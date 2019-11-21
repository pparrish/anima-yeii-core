const basicInfoList = require('../characterBasicInfo/listOfCharacterBasicInfo')
const characteristicsList = require('../characteristics/listOfAnimaCharacteristics')
const physicalCapacities = require('../physicalCapacities/listOfPhysicalCapacities')

function getNames (listObject) {
  return listObject.map(x => x.name)
}

const pointsGenerators = require('../generatePoints')

module.exports = class CharacterCreator {
  constructor () {
    this._namesLists = {
      basicInfo: basicInfoList.map(x => x),
      characteristics: characteristicsList.map(x => x),
      physicalCapacities: getNames(physicalCapacities)
    }

    this._valuesLists = {
      basicInfo: this._getNames('basicInfo').map(() => null),
      characteristics: this._getNames('characteristics').map(() => null),
      physicalCapacities: this._namesLists.physicalCapacities.map(() => null)
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
      }
    }
  }

  /** applies all rules of one path to a value
   * @param {string} path - is a path to find the rules any strong is vald but by convention is a path like string
   * @param {any} context - is the value by working the rule
   * @return {any} the modified value of operation
   */
  applyRules (path, context) {
    let newContext = context
    // get all rules matched widrh path
    const rulesMatch = []
    for (const rule in this._rules) {
      if (this._rules[rule].path === path) {
        rulesMatch.push(this._rules[rule])
      }
    }
    // aply all rules to the context
    newContext = rulesMatch.reduce((aContext, rule) => rule.enabled ? rule.rule(aContext, this) : aContext, newContext)
    // return the new context
    return newContext
  }

  /** disable a rule
   * @param {string} rule - the name of rule to diable
   * @return {object} this
   */
  disableRule (rule) {
    if (!this._rules[rule]) throw new Error(`the rule ${rule} does not exist`)
    this._rules[rule].enabled = false
    return this
  }

  /** enable a rule
   * @param {string} rule - rule to enable
   * @return {object} this
   */
  enableRule (rule) {
    if (!this._rules[rule]) throw new Error(`the rule ${rule} does not exist`)
    this._rules[rule].enabled = true
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
  setBasicInfo (name, value) {
    return this._set(name, value, 'basicInfo')
  }

  nonSetBasicInfo () {
    return this._nonSetValues('basicInfo')
  }

  settedBasicInfo () {
    return this._settedValues('basicInfo')
  }

  // POINTS
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

  remainerPoints () {
    if (this._points.remainer === null) throw new Error('points is not generated')
    return this._points.remainer
  }

  // Characteristic
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

  selectValueTo (name, value) {
    const indexOfValue = this._getIndex(value, this._points.nonSettedValues)
    if (indexOfValue === -1) throw new Error('the value is not in nonSettedValues')
    this._set(name, value, 'characteristics')
    this._points.nonSettedValues.splice(indexOfValue, 1)
    return this
  }

  selectGreatestValueTo (characteristicName) {
    this.selectValueTo(characteristicName, this.getGreatestNonSetValue())
    return this
  }

  selectSmalestValueTo (characteristicName) {
    this.selectValueTo(characteristicName, this.getSmalestNonSetValue())
    return this
  }

  nonSetGenerationValues () {
    return this._points.nonSettedValues.map(x => x)
  }

  removeValueTo (name) {
    const index = this.indexOfCharacteristic(name)
    const value = this._valuesLists.characteristics[index]
    this._valuesLists.characteristics[index] = null
    this._points.nonSettedValues.push(value)
    return this
  }

  settedCharacteristics () {
    return this._settedValues('characteristics')
  }

  /** Add the amount of points to a characteristic and spend it from remainder points. Uses the rule path of "set/characteristics"
   * @param {string} characteristic - The characteristic to add value
   * @param {number} amount - The value to be added in characteristic and expended from remainder points.
   * @returns {object} this
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
   * @return {object} this
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
}
