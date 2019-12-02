const D10 = require('../dices/d10')
const d10 = new D10()
const basicInfoList = require('../characterBasicInfo/listOfCharacterBasicInfo')
const characteristicsList = require('../characteristics/listOfAnimaCharacteristics')
const physicalCapacities = require('../physicalCapacities/listOfPhysicalCapacities')
const secondaryCharacteristicsList = require('../secondaryCharacteristics/listOfAnimaSecondaryCharacteristics')
const sizeTable = require('../secondaryCharacteristics/sizeTable')
const developmentPointsTable = require('../developmentPoints/developmentPointsTable')

function getNames (listObject) {
  return listObject.map(x => x.name)
}

const pointsGenerators = require('../generatePoints')

/** class represents a creator of a character with a rules.of anima
 */
class CharacterCreator {
  constructor () {
    /** storage of names */
    this._namesLists = {
      basicInfo: basicInfoList.map(x => x),
      characteristics: characteristicsList.map(x => x),
      physicalCapacities: getNames(physicalCapacities),
      secondaryCharacteristics: secondaryCharacteristicsList.map(x => x)
    }

    this._valuesLists = {
      basicInfo: this._getNames('basicInfo').map(() => null),
      characteristics: this._getNames('characteristics').map(() => null),
      physicalCapacities: this._namesLists.physicalCapacities.map(() => null),
      secondaryCharacteristics: this._getNames('secondaryCharacteristics').map(() => null)
    }

    this._points = {
      generators: pointsGenerators,
      generatedResults: {},
      generatorSelected: null,
      nonSettedValues: [],
      pointsToGenerate: null,
      remainer: null
    }

    this._rules = {
      '10 cost 2': {
        enabled: true,
        path: 'points/spends',
        rule: (spended) => {
          spended = spended.map(x => x >= 10 ? x + 1 : x)
          return spended
        }
      },
      '10 limit': {
        enabled: true,
        path: 'characteristics/set',
        rule: (characteristic) => {
          if (characteristic > 10) {
            throw new Error('The limit of characteristics is 10')
          }
          return characteristic
        }
      },
      'physique is fatigue': {
        enabled: true,
        hidden: true,
        path: 'characteristics/set/physique',
        rule: (physique, aCreator) => {
          aCreator._set('fatigue', physique, 'physicalCapacities')
          return physique
        }
      },
      'agility is movement type': {
        enabled: true,
        hidden: true,
        path: 'characteristics/set/agility',
        rule: (agility, aCreator) => {
          aCreator._set('movement type', agility, 'physicalCapacities')
          return agility
        }
      },
      'appearance is random': {
        enabled: true,
        hidden: true,
        path: 'creator/init',
        rule: (creator) => {
          creator._appearance = d10.roll()
        }
      },
      'appearance blocked': {
        enabled: true,
        path: 'secondaryCharacteristics/set/appearance',
        rule: () => {
          throw new Error('appearance is random only')
        }
      },
      'appearance 10 limit': {
        enabled: true,
        hidden: true,
        path: 'secondaryCharacteristics/set/appearance',
        rule (appearance) {
          if (appearance > 10) throw new Error('appearance limit is 10')
          return appearance
        }
      },
      'Size is strength added to physique': {
        enabled: true,
        hidden: true,
        path: ['characteristics/setted/strength', 'characteristics/setted/physique'],
        rule (_, creator) {
          const { strength, physique } = creator.settedCharacteristics()
          if (!strength || !physique) return
          creator._set('size', strength + physique, 'secondaryCharacteristics')
        }
      },
      'size limitations': {
        enabled: true,
        path: ['basicInfo/set/height', 'basicInfo/set/weight'],
        rule (value, creator, path) {
          if (!creator._rules['size limitations'].enabled) return value

          const { size } = creator.settedSecondaryCharacteristics()
          const { slim } = creator.settedBasicInfo()

          if (!size) throw new Error('size is not defined, first set streng and physique')

          if (path === 'basicInfo/set/height') {
            if (!sizeTable.height.from.check(size, value, slim)) throw new Error(`height ${value} must be greatest or equal than ${creator.minHeightSupported()}`)
            if (!sizeTable.height.to.check(size, value)) throw new Error(`height ${value} must be less or equal than ${creator.maxHeightSupported()}`)
          }
          if (path === 'basicInfo/set/weight') {
            if (!sizeTable.weight.from.check(size, value, slim)) throw new Error(`weight ${value} must be greatest or equal than ${creator.minWeightSupported()}`)
            if (!sizeTable.weight.to.check(size, value)) throw new Error(`weight ${value} must be less or equal than ${creator.maxWeightSupported()}`)
          }
          return value
        }
      },
      'pd linked to level': {
        enabled: true,
        hidden: true,
        path: 'basicInfo/set/level',
        rule (level, creator) {
          creator._pd = developmentPointsTable.get(level)
          return level
        },
        childs: ['pd based on level', 'set pd disabled']
      },
      'pd based on level': {
        enabled: true,
        hidden: false,
        path: 'pd/get',
        rule (_, creator) {
          const { level } = creator.settedBasicInfo()
          if (!level) throw new Error('level is not setted use CharacterCreator.setBasicInfo("level", value)')
        }

      },
      'set pd disabled': {
        enabled: true,
        hidden: true,
        path: 'pd/set',
        rule (pd, creator) {
          throw new Error('pd only be setted by level')
        }
      }
    }
    this._pd = null

    this.applyRules('creator/init', this)
  }

  /** applies all rules of one path to a value
   * @protected
   * @param {string} path - is a path to find the rules any strong is vald but by convention is a path like string
   * @param {any} context - is the value by working the rule
   * @return {Object} the modified value of operation
   */
  applyRules (path, context) {
    let newContext = context
    // get all rules matched widrh path
    const rulesMatch = []
    for (const ruleName in this._rules) {
      const aRule = this._rules[ruleName]

      if (Array.isArray(aRule.path)) {
        for (const aPath of aRule.path) {
          if (aPath === path) {
            rulesMatch.push(aRule)
          }
        }
      } else if (aRule.path === path) {
        rulesMatch.push(this._rules[ruleName])
      }
    }
    // aply all rules to the context
    newContext = rulesMatch.reduce((aContext, rule) => rule.enabled ? rule.rule(aContext, this, path) : aContext, newContext)
    // return the new context
    return newContext
  }

  /** disable a rule
   * @param {string} rule - the name of rule to diable
   * @return {Object} this
   */
  disableRule (rule) {
    if (!this._rules[rule]) throw new Error(`the rule ${rule} does not exist`)
    this._rules[rule].enabled = false
    if (this._rules[rule].childs) {
      this._rules[rule].childs.map(rule => this.disableRule(rule))
    }
    return this
  }

  /** enable a rule
   * @param {string} rule - rule to enable
   * @return {Object} this
   */
  enableRule (rule) {
    if (!this._rules[rule]) throw new Error(`the rule ${rule} does not exist`)
    this._rules[rule].enabled = true
    if (this._rules[rule].childs) {
      this._rules[rule].childs.map(rule => this.enableRule(rule))
    }
    return this
  }

  _getNames (type) {
    const list = this._namesLists[type]
    if (!list) throw new Error(`the ${type} list not exists`)
    return list.map(x => x)
  }

  _set (name, value, type) {
    const index = this._getNames(type).indexOf(name)
    if (index === -1) return false
    let newValue = this.applyRules(`${type}/set`, value)
    newValue = this.applyRules(`${type}/set/${name}`, value)
    this._valuesLists[type][index] = newValue
    this.applyRules(`${type}/setted/${name}`)
    return true
  }

  _nonSetValues (type) {
    const nonSet = []
    this._getNames(type).map((name, index) => {
      if (this._valuesLists[type][index] === undefined || this._valuesLists[type][index] === null) {
        nonSet.push(name)
      }
    })
    return nonSet
  }

  _settedValues (type) {
    const settedValues = {}
    this._getNames(type).reduce((settedValues, name, index) => {
      if (this._valuesLists[type][index] !== undefined && this._valuesLists[type][index] !== null) {
        settedValues[name] = this._valuesLists[type][index]
      }
      return settedValues
    }, settedValues)
    return settedValues
  }

  // BASICINFO
  /** Set a value of a character basic Info
   * @param {string} name - The name of the basic info to set can use nonSetBasicInfo to get what names are supported
   * @param {any} value - The value of the basic info to set.
   * @returns {CharacterCreator} - this
   */
  setBasicInfo (name, value) {
    return this._set(name, value, 'basicInfo')
  }

  /** Return the names of basic info than are not setted
   * @return {Array} BasicInfoNames
   */
  nonSetBasicInfo () {
    return this._nonSetValues('basicInfo')
  }

  /* Get a Object with all already setted values of Basic info an her values
   * @returns {Object} Already setted Values
   */
  settedBasicInfo () {
    return this._settedValues('basicInfo')
  }

  // POINTS
  /* Generate point to be setted in characteristics
   * @param {number} typeNumber - The type of generation for now allows [1,2,3] of value types and [4,5] of points type
   * @returns {CharacterCreator} this
   */
  generatePoints (typeNumber) {
    const generatedTypes = Object.keys(this._points.generators)
    const generateName = generatedTypes[typeNumber - 1]
    this._valuesLists.characteristics = this._getNames('characteristics').map(x => null)
    this._points.remainer = null
    this._points.generatorSelected = generateName
    if (generateName === 'type5') {
      if (!this._points.pointsToGenerate) throw new Error('Must select before the points to generate')
      this._points.generatedResults[generateName] = this._points.generators[generateName](this._points.pointsToGenerate)
      this._points.remainer = this._points.generatedResults[generateName].points
    } else if (generateName === 'type4') {
      this._points.generatedResults[generateName] = this._points.generators[generateName](this._getNames('characteristics').length)
      this._points.remainer = this._points.generatedResults[generateName].points
    } else if (!this._points.generatedResults[generateName]) {
      this._points.generatedResults[generateName] = this._points.generators[generateName](this._getNames('characteristics').length)
    }
    this._points.nonSettedValues = this._points.generatedResults[generateName].points
    return this
  }

  /** Set the number of points than type 5 generator used, use this before use a type 5 generator
   * @param {number} points - number of points for generate
   * @returns {CharacterCreator} this
   */
  setPoints (points) {
    this._points.pointsToGenerate = points
    return this
  }

  isPoinsAlreadyGenerated () {
    return (Object.keys(this._points.generatedResults).length !== 0)
  }

  getGeneratedPointsResult () {
    return { ...this._points.generatedResults[this._points.generationType] }
  }

  generationType () {
    if (!this.isPoinsAlreadyGenerated()) throw new Error('The points is not generated, use genetatePoints(type) before')
    const generator = this._points.generatedResults[this._points.generatorSelected].points
    if (Array.isArray(generator)) {
      return 'values'
    }
    if (typeof generator === 'number') {
      return 'points'
    }
    throw new Error('The generator set of points generator is not a valid type')
  }

  /** @deprecated
   */
  remainerPoints () {
    if (this._points.remainer === null) throw new Error('points is not generated')
    return this._points.remainer
  }

  // Characteristic
  /** Returns a array of the non setted characteristics names
   * @returns {Array} Array of strings
   */
  nonSetCharacteristics () {
    return this._nonSetValues('characteristics')
  }

  getGreatestNonSetValue () {
    if (this.generationType() === 'points') throw new Error('the generation type is points use another generation')
    const greatest = this._points.nonSettedValues.reduce((greatest, actual) => greatest > actual ? greatest : actual, -Infinity)
    return greatest
  }

  getSmalestNonSetValue () {
    if (this.generationType() === 'points') throw new Error('the generation type is points use another generation')
    return this._points.nonSettedValues.reduce((smalest, actual) => smalest < actual ? smalest : actual, Infinity)
  }

  _getIndex (value, array) {
    return array.indexOf(value)
  }

  indexOfCharacteristic (name) {
    const index = this._getIndex(name, this._getNames('characteristics'))
    if (index === -1) throw new Error('The characteristic is not in characteristics list')
    return index
  }

  /* set a Value to a chacacteristic the value must be in the generated values. You can get the abiable values by non set generation values
   * @param {string} name - The name of a characteristic
   * @param {number} value - The value to set
   * @returns {CharacterCreator} this
   */
  selectValueTo (name, value) {
    const indexOfValue = this._getIndex(value, this._points.nonSettedValues)
    if (indexOfValue === -1) throw new Error('the value is not in nonSettedValues')
    this._set(name, value, 'characteristics')
    this._points.nonSettedValues.splice(indexOfValue, 1)
    return this
  }

  /* set the greatest value of non setted values to a characteristic
   * @param {string} the name of characteristic
   * @return {CharacterCreator} this
   */
  selectGreatestValueTo (characteristicName) {
    this.selectValueTo(characteristicName, this.getGreatestNonSetValue())
    return this
  }

  /* set the smalest value of nin setted values to a characteristic
   * @param {string} the name of characteristic
   * @returns {CharacterCreator} this
   */
  selectSmalestValueTo (characteristicName) {
    this.selectValueTo(characteristicName, this.getSmalestNonSetValue())
    return this
  }

  /* Get the generation values than are not setted
   * @returns {Array} array of numbes of non setted values
   */
  nonSetGenerationValues () {
    return this._points.nonSettedValues.map(x => x)
  }

  /* Remove a value to a characteristic and move again to the aviable values
   * @param {string} name - The name of characteristic
   * @returns {CharacterCreator} this
   */
  removeValueTo (name) {
    const index = this.indexOfCharacteristic(name)
    const value = this._valuesLists.characteristics[index]
    this._valuesLists.characteristics[index] = null
    this._points.nonSettedValues.push(value)
    return this
  }

  /* Get the characteristic than are setted and her values
   * @returns {Object} the characteristics setted
   */
  settedCharacteristics () {
    return this._settedValues('characteristics')
  }

  /** Add the amount of points to a characteristic and spend it from remainder points. Uses the rule path of "set/characteristics"
   * @param {string} characteristic - The characteristic to add value
   * @param {number} amount - The value to be added in characteristic and expended from remainder points.
   * @returns {Object} this
   */
  expendPointsTo (characteristic, amount) {
    let actualCharacteristicValue = this.settedCharacteristics()[characteristic]
    if (!actualCharacteristicValue) {
      actualCharacteristicValue = 0
    }
    this._set(characteristic, amount + actualCharacteristicValue, 'characteristics')
    if (this.remainderPoints() < 0) {
      this._set(characteristic, actualCharacteristicValue, 'characteristics')
      throw new Error('points to expend exeded')
    }
    return this
  }

  /** Subtracts or remove the points of a characteristic
   * @param {string} characteristic - The name of the characteristic to substract or remove
   * @param {number} [amount] - The value to substract, if not setted then remove all points to characteristic
   * @return {Object} this
   */
  removePointsTo (characteristic, amount) {
    const beforeValue = this.settedCharacteristics()[characteristic]
    if (!beforeValue) throw new Error(`the ${characteristic} not have any value`)
    if (!amount) {
      this._set(characteristic, null, 'characteristics')
      return this
    }
    const newValue = beforeValue - amount
    if (newValue < 0) throw new Error(`You are trying to remove ${amount} to ${characteristic} but only have ${beforeValue}`)
    if (newValue === 0) {
      this._set(characteristic, null, 'characteristics')
      return this
    }
    this._set(characteristic, newValue, 'characteristics')
    return this
  }

  /** Returns the number of points left to spend in the characteristics
   * @returns {number} remainder points
   */
  remainderPoints () {
    const totalPoints = this._points.pointsToGenerate
    const spendCharacteristics = this.applyRules('points/spends', Object.values(this.settedCharacteristics()))
    const spendedPoints = spendCharacteristics.reduce((total, actual) => total + actual, 0)
    return totalPoints - spendedPoints
  }

  // PhysicalCapacities
  /** get the setted physicalCapacities, the physicalCapacities is setted when the linked characteristic is setted
   * @returns {Object} the physicalCapacities names with value
   */
  settedPhysicalCapacities () {
    return this._settedValues('physicalCapacities')
  }

  // Secondary characteristics
  /** get the secondaryCharacteristics than are setted already with the value. Maibe some are setted when the creator is created.
   *  @returns {Object} the secondary characteristics names with values
   */
  settedSecondaryCharacteristics () {
    const setted = this._settedValues('secondaryCharacteristics')
    if (!setted.appearance) setted.appearance = this._appearance
    return setted
  }

  /* set a secondary characteristic
   * @param {string} name - a name of secondaryCharacteristic
   * @param {any} value - the value to set the secondary characteristic
   * returns {CharacterCreator} this
   */
  setSecondaryCharacteristic (name, value) {
    this._set(name, value, 'secondaryCharacteristics')
    return this
  }

  /** reset a secondary charactetistic (null or origibal value)
   * @param {string} name - the name of sexondary characteristic to reset
   * @return {CharacterCreator} this
   */
  resetSecondaryCharacteristic (name) {
    const secondaryIndex = this._getIndex(name, this._getNames('secondaryCharacteristics'))
    if (secondaryIndex === -1) throw new Error(`${name} is not a secondaryCharacteristic`)
    this._valuesLists.secondaryCharacteristics[secondaryIndex] = null
    return this
  }

  /** @returns {number} the min height supported by the size */
  minHeightSupported () {
    if (!this._rules['size limitations'].enabled) return 0
    const { size } = this.settedSecondaryCharacteristics()
    if (!size) throw new Error('size is not defined')
    const { slim } = this.settedBasicInfo()
    return sizeTable.height.from.value(size, slim)
  }

  /** @returns {number} the max height supported by the size */
  maxWeightSupported () {
    if (!this._rules['size limitations'].enabled) return Infinity
    const { size } = this.settedSecondaryCharacteristics()
    return sizeTable.weight.to.value(size)
  }

  /** @returns {number} the min weight supported by the size, if basic info slim is setted, the value is size -2 */
  minWeightSupported () {
    if (!this._rules['size limitations'].enabled) return 0
    const { size } = this.settedSecondaryCharacteristics()
    const { slim } = this.settedBasicInfo()
    return sizeTable.weight.from.value(size, slim)
  }

  /** @returns {number} max height supported by the size. */
  maxHeightSupported () {
    if (!this._rules['size limitations'].enabled) return Infinity
    const { size } = this.settedSecondaryCharacteristics()
    return sizeTable.height.to.value(size)
  }

  get developmentPoints () {
    const pd = this.applyRules('pd/get', this._pd)
    if (pd === null) throw new Error('Development points is not setted')
    return this._pd
  }

  set developmentPoints (recibedPD) {
    const newPD = this.applyRules('pd/set', recibedPD, this)
    this._pd = newPD
    return recibedPD
  }
}

module.exports = CharacterCreator
