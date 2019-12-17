const basicInfoList = require('../characterBasicInfo/listOfCharacterBasicInfo')
const characteristicsList = require('../characteristics/listOfAnimaCharacteristics')
const physicalCapacities = require('../physicalCapacities/listOfPhysicalCapacities')
const secondaryCharacteristicsList = require('../secondaryCharacteristics/listOfAnimaSecondaryCharacteristics')
const Shop = require('../shop/Shop')
const CombatAbilities = require('../primaryAbilities/combatAbilities/CombatHabilities')
const SupernaturalAbilities = require('../primaryAbilities/supernaturalAbilities/SupernaturalAbilities')
const rules = require('./rules')
const sizeTable = require('../secondaryCharacteristics/sizeTable')
const D10 = require('../dices/d10')
const d10 = new D10()

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

    this._appearance = d10.roll()

    this.developmentPointsShop = new Shop({})

    this._points = {
      generators: pointsGenerators,
      generatedResults: {},
      generatorSelected: null,
      nonSettedValues: [],
      pointsToGenerate: null,
      remainer: null
    }

    this.combatAbilities = new CombatAbilities()
    this.supernaturalAbilities = new SupernaturalAbilities()

    this.rules = rules()

    this._pd = null

    this.applyRules('creator/init', this)
  }

  /** ñapplies all rules of one path to a value
   * @protected
   * @param {string} path - is a path to find the rules any strong is vald but by convention is a path like string
   * @param {any} context - is the value by working the rule
   * @return {Object} the modified value of operation
   */
  applyRules (path, context) {
    return this.rules.apply(path, context, this)
  }

  /** disable a rule
   * @param {string} rule - the name of rule to diable
   * @return {Object} this
   */
  disableRule (rule, context) {
    this.rules.disable(rule, context, this)
    return this
  }

  /** enable a rule
   * @param {string} rule - rule to enable
   * @return {Object} this
   */
  enableRule (rule, context) {
    this.rules.enable(rule, context, this)
    return this
  }

  _getNames (type) {
    const list = this._namesLists[type]
    if (!list) throw new Error(`the ${type} list not exists`)
    return list.map(x => x)
  }

  /* TODO _setWithoutRules must be _set and _set must be _setWithRules */
  _setWithoutRules (name, value, type) {
    const index = this._getNames(type).indexOf(name)
    if (index === -1) throw new Error(`the ${name} name is not in ${type}`)
    this._valuesLists[type][index] = value
  }

  /* TODO _set must return this */
  _set (name, value, type) {
    const index = this._getNames(type).indexOf(name)
    if (index === -1) return false
    let newValue = this.applyRules(`${type}/set`, value)
    newValue = this.applyRules(`${type}/set/${name}`, value)
    this._setWithoutRules(name, newValue, type)
    /* Manage the secondaryCharacteristics links, rules only modify a value not set values for thad reason the lisks not are a rules
     * TODO this feature must be manage by a link manager in the future
     */
    if (type === 'characteristics') {
      // replace physique is fatigue
      if (name === 'physique') {
        this._setWithoutRules('fatigue', newValue, 'physicalCapacities')
      }
      if (name === 'agility') {
        this._setWithoutRules('movement type', newValue, 'physicalCapacities')
      }

      if (name === 'strength' || name === 'physique') {
        const { strength, physique } = this.settedCharacteristics()
        if (strength && physique) {
          this._setWithoutRules('size', strength + physique, 'secondaryCharacteristics')
        }
      }
    }

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
    if (!this.rules.isEnabled('size limitations')) return 0
    const { size } = this.settedSecondaryCharacteristics()
    if (!size) throw new Error('size is not defined')
    const { slim } = this.settedBasicInfo()
    return sizeTable.height.from.value(size, slim)
  }

  /** @returns {number} the max height supported by the size */
  maxWeightSupported () {
    if (!this.rules.isEnabled('size limitations')) return Infinity
    const { size } = this.settedSecondaryCharacteristics()
    return sizeTable.weight.to.value(size)
  }

  /** @returns {number} the min weight supported by the size, if basic info slim is setted, the value is size -2 */
  minWeightSupported () {
    if (!this.rules.isEnabled('size limitations')) return 0
    const { size } = this.settedSecondaryCharacteristics()
    const { slim } = this.settedBasicInfo()
    return sizeTable.weight.from.value(size, slim)
  }

  /** @returns {number} max height supported by the size. */
  maxHeightSupported () {
    if (!this.rules.isEnabled('size limitations')) return Infinity
    const { size } = this.settedSecondaryCharacteristics()
    return sizeTable.height.to.value(size)
  }

  /** the total of development points
   * @readonly
   * @type {number}
   */
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

  /** Select the category of the character
   * @param {string} name - the name of category
   */
  selectCategory (name) {
    this._category = this.applyRules('category/set', name)
    return this
  }

  /** ñ name of the category selected
   * @type {string}
   */
  get category () {
    if (this._category) { return this._category.name }
    return undefined
  }

  /** Enhance a ability
   * @param {string} name - the name of the ability
   * @param {number} value - the value to enhance
   * @returns {CharacterCreator} this
   */
  enhance (name, value) {
    let context = this.applyRules('pd/spend', { name, value }, this)
    if (this.combatAbilities.has(name)) {
      context = this.applyRules('pd/spend/combatAbilities', context)
      this.combatAbilities.enhance(context.name, context.value)
    }
    if (this.supernaturalAbilities.has(name)) {
      context = this.applyRules('pd/spend/supernaturalAbilities', context)
      this.supernaturalAbilities.enhance(context.name, context.value)
    }
    this.developmentPointsShop.spend(context.name, context.value)
    return this
  }

  /** decrease a ability
   * @param {string} name - the name of ability
   * @param {number} value - the value to decrease
   * @returns {CharacterCreator} this
   */
  decrease (name, value) {
    if (this.developmentPointsShop.buyList[name] && this.developmentPointsShop.buyList[name] - value < 0) throw new Error('decrease bellow 0')
    let context = this.applyRules('pd/refound', { name, value }, this)
    if (this.combatAbilities.has(name)) {
      context = this.applyRules('pd/refound/combatAbilities', context)
      this.combatAbilities.decrease(context.name, context.value)
    }
    if (this.supernaturalAbilities.has(name)) {
      context = this.applyRules('pd/refound/supernaturalAbilities', context)
      this.supernaturalAbilities.decrease(context.name, context.value)
    }
    this.developmentPointsShop.refound(context.name, context.value)
    return this
  }

  /* total of development points spended
   * @type {number}
   * @readonly
   */
  get developmentPointsSpended () {
    return this.developmentPointsShop.balance
  }

  /* Get a ability
   * @param {string} name - the name of ability
   * @returns {Ability}
   */
  ability (name) {
    return this.combatAbilities.get(name)
  }

  /* Get the total of development points spended in a ability
   * @param {string} name - the name of ability
   * @returns {number}
   */
  developmentPointsSpendedIn (name) {
    return this.developmentPointsShop.balanceOf(name)
  }
}

module.exports = CharacterCreator
