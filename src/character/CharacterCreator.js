const Characteristics = require('../characteristics/characteristics')
const PhysicalCapacities = require('../physicalCapacities/PhysicalCapacities')
const SecondaryCharacteristics = require('../secondaryCharacteristics/SecondaryCharacteristics')
const Shop = require('../shop/Shop')
const ValuesShop = require('../shop/valuesShop')
const PointsGenerator = require('../generatePoints/PointsGenerator')
const CharacterBasicInfo = require('../characterBasicInfo/CharacterBasicInfo')
const CombatAbilities = require('../primaryAbilities/combatAbilities/CombatHabilities')
const SupernaturalAbilities = require('../primaryAbilities/supernaturalAbilities/SupernaturalAbilities')
const PsychicAbilities = require('../primaryAbilities/psychicAbilities/PsychicAbilities')
const SecondaryAbilities = require('../secondaryAbilities/SecondaryAbilities')
const rules = require('./rules')
const sizeTable = require('../secondaryCharacteristics/sizeTable')
const D10 = require('../dices/d10')
const d10 = new D10()

/** class represents a creator of a character with a rules.of anima
 */
class CharacterCreator {
  constructor () {
    this._appearance = d10.roll()
    this._pd = null

    /* Abilities */
    this.characteristics = new Characteristics()
    this.secondaryCharacteristics = new SecondaryCharacteristics()
    this.basicInfo = new CharacterBasicInfo()
    this.physicalCapacities = new PhysicalCapacities()
    this.combatAbilities = new CombatAbilities()
    this.supernaturalAbilities = new SupernaturalAbilities()
    this.psychicAbilities = new PsychicAbilities()
    this.secondaryAbilities = new SecondaryAbilities()
    /* shops */
    this.developmentPointsShop = new Shop({})
    this.pointsGenerator = new PointsGenerator()
    this.pointsGenerator.setValuesToGenerate(this.characteristics.length)
      .setPointsToGenerate(60)
    this.valuesShop = new ValuesShop([])

    this.rules = rules()

    this._applyRules(this, 'creator', 'init')
  }

  /* RULES */

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

  _applyRules (value, base, operation, especified) {
    let newValue = value
    newValue = this.rules.apply(base + '/' + operation, newValue, this)
    if (especified) newValue = this.rules.apply(base + '/' + operation + '/' + especified, newValue, this)
    return newValue
  }

  /* Temporal waiting to a link manager */
  _setLinks (name, value) {
    /* Manage the secondaryCharacteristics links, rules only modify a value not set values for thad reason the lisks not are a rules
     * TODO this feature must be manage by a link manager in the future
     */
    // replace physique is fatigue
    if (name === 'physique') {
      this.physicalCapacities.set('fatigue', this._applyRules(value, 'physicalCapacities', 'set', 'fatigue'))
      if (this.physicalCapacities.get('fatigue')) this.physicalCapacities.markSetted('fatigue')
      else this.physicalCapacities.markUnsetted('fatigue')
    }
    if (name === 'agility') {
      this.physicalCapacities.set('movement type', this._applyRules(value, 'physicalCapacities', 'set', 'movement type'))
      if (this.physicalCapacities.get('movement type')) this.physicalCapacities.markSetted('movement type')
      else this.physicalCapacities.markUnsetted('movement type')
    }

    if (name === 'strength' || name === 'physique') {
      const { strength, physique } = this.settedCharacteristics()
      if (strength && physique) {
        this.secondaryCharacteristics.set('size', this._applyRules(strength + physique, 'secondaryCharacteristics', 'set', 'size'))
          .markSetted('size')
      }
    }
    return this
  }

  // BASICINFO
  /** Set a value of a character basic Info
   * @param {string} name - The name of the basic info to set can use nonSetBasicInfo to get what names are supported
   * @param {any} value - The value of the basic info to set.
   * @returns {CharacterCreator} - this
   */
  setBasicInfo (name, value) {
    if (!this.basicInfo.has(name)) throw new Error('the ' + name + ' is not in basic info')
    this.basicInfo.changeValueOf(name, this._applyRules(value, 'basicInfo', 'set', name)).markSetted(name)
    return this
  }

  /** Return the names of basic info than are not setted
   * @return {Array} BasicInfoNames
   */
  nonSetBasicInfo () {
    return this.basicInfo.nonSetted
  }

  /* Get a Object with all already setted values of Basic info an her values
   * @returns {Object} Already setted Values
   */
  settedBasicInfo () {
    return this.basicInfo.settedValues
  }

  // POINTS
  /* Generate point to be setted in characteristics
   * @param {number} typeNumber - The type of generation for now allows [1,2,3] of value types and [4,5] of points type
   * @returns {CharacterCreator} this
   */
  generatePoints (type) {
    this.pointsGenerator.selectGenerator(type).generate()
    if (this.pointsGenerator.type === 'values') { this.valuesShop = new ValuesShop(this.pointsGenerator.result.points) }
    this.characteristics = new Characteristics()
    return this
  }

  /** Set the number of points than type 5 generator used, use this before use a type 5 generator
   * @param {number} points - number of points for generate
   * @returns {CharacterCreator} this
   */
  setPoints (points) {
    this.characteristics = new Characteristics()
    this.pointsGenerator.setPointsToGenerate(points)
    return this
  }

  isPoinsAlreadyGenerated () {
    if (!this.pointsGenerator.isGeneratoraSelected()) return false
    return this.pointsGenerator.isAlreadyGenerated(this.pointsGenerator.generator.name)
  }

  getGeneratedPointsResult () {
    return this.pointsGenerator.result
  }

  generationType () {
    return this.pointsGenerator.type
  }

  // Characteristic
  /** Returns a array of the non setted characteristics names
   * @returns {Array} Array of strings
   */
  nonSetCharacteristics () {
    return this.characteristics.nonSetted
  }

  getGreatestNonSetValue () {
    if (this.generationType() === 'points') throw new Error('the generation type is points use another generation')
    return this.valuesShop.greatestInStock
  }

  getSmalestNonSetValue () {
    if (this.generationType() === 'points') throw new Error('the generation type is points use another generation')
    return this.valuesShop.smalestInStock
  }

  /* set a Value to a chacacteristic the value must be in the generated values. You can get the abiable values by non set generation values
   * @param {string} name - The name of a characteristic
   * @param {number} value - The value to set
   * @returns {CharacterCreator} this
   */
  selectValueTo (name, value) {
    const newValue = this._applyRules(value, 'characteristics', 'set', name)
    this.valuesShop.spend(newValue)
    this.characteristics.set(name, newValue)
    this.characteristics.markSetted(name)
    this._setLinks(name, newValue)
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
    return this.valuesShop.catalog
  }

  /* Remove a value to a characteristic and move again to the aviable values
   * @param {string} name - The name of characteristic
   * @returns {CharacterCreator} this
   */
  removeValueTo (name) {
    const valueToRefound = this.characteristics.get(name).value
    this.characteristics.set(name, 0)
    this.characteristics.markUnsetted(name)
    this._setLinks(name, 0)
    this.valuesShop.refound(valueToRefound)
    return this
  }

  /* Get the characteristic than are setted and her values
   * @returns {Object} the characteristics setted
   */
  settedCharacteristics () {
    return this.characteristics.settedValues
  }

  /** Add the amount of points to a characteristic and spend it from remainder points. Uses the rule path of "set/characteristics"
   * @param {string} characteristic - The characteristic to add value
   * @param {number} amount - The value to be added in characteristic and expended from remainder points.
   * @returns {Object} this
   */
  expendPointsTo (characteristic, amount) {
    const actualCharacteristicValue = this.settedCharacteristics()[characteristic] || 0
    let newValue = this._applyRules(actualCharacteristicValue + amount, 'characteristics', 'set', characteristic)
    this.characteristics.set(characteristic, newValue)
      .markSetted(characteristic)
    this._setLinks(characteristic, newValue)
    if (this.remainderPoints() < 0) {
      newValue = this._applyRules(actualCharacteristicValue, 'characteristics', 'set', characteristic)
      this.characteristics.set(characteristic, newValue)
        .markUnsetted(characteristic)
      this._setLinks(characteristic, newValue)
      if (!this.remainderPoints()) this.characteristics.markUnsetted(characteristic, newValue)
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
      this.characteristics.set(characteristic, this._applyRules(0, 'characteristics', 'set', characteristic))
        .markUnsetted(characteristic)
      this._setLinks(characteristic, 0)
      return this
    }
    const newValue = beforeValue - amount
    if (newValue < 0) throw new Error(`You are trying to remove ${amount} to ${characteristic} but only have ${beforeValue}`)
    this.characteristics.set(characteristic, this._applyRules(newValue, 'characteristics', 'set', characteristic))
    this._setLinks(characteristic, 0)
    if (!newValue) this.characteristics.markUnsetted(characteristic)
    return this
  }

  /** Returns the number of points left to spend in the characteristics
   * @returns {number} remainder points
   */
  remainderPoints () {
    const totalPoints = this.pointsGenerator.pointsToGenerate
    const spendCharacteristics = this._applyRules(Object.values(this.settedCharacteristics()), 'points', 'spends')
    const spendedPoints = spendCharacteristics.reduce((total, actual) => total + actual, 0)
    return totalPoints - spendedPoints
  }

  // PhysicalCapacities
  /** get the setted physicalCapacities, the physicalCapacities is setted when the linked characteristic is setted
   * @returns {Object} the physicalCapacities names with value
   */
  settedPhysicalCapacities () {
    return this.physicalCapacities.settedValues
  }

  // Secondary characteristics
  /** get the secondaryCharacteristics than are setted already with the value. Maibe some are setted when the creator is created.
   *  @returns {Object} the secondary characteristics names with values
   */
  settedSecondaryCharacteristics () {
    const setted = this.secondaryCharacteristics.settedValues
    // TODO manage appearance with secondaryCharacteristics
    if (!setted.appearance) setted.appearance = this._appearance
    return setted
  }

  /* set a secondary characteristic
   * @param {string} name - a name of secondaryCharacteristic
   * @param {any} value - the value to set the secondary characteristic
   * returns {CharacterCreator} this
   */
  setSecondaryCharacteristic (name, value) {
    this.secondaryCharacteristics.set(name, this._applyRules(value, 'secondaryCharacteristics', 'set', name))
      .markSetted(name)
    return this
  }

  /** reset a secondary charactetistic (null or origibal value)
   * @param {string} name - the name of sexondary characteristic to reset
   * @return {CharacterCreator} this
   */
  resetSecondaryCharacteristic (name) {
    this.secondaryCharacteristics.set(name, null)
      .markUnsetted(name)
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
    const pd = this._applyRules(this._pd, 'pd', 'get')
    if (pd === null) throw new Error('Development points is not setted')
    return this._pd
  }

  set developmentPoints (recibedPD) {
    const newPD = this._applyRules(recibedPD, 'pd', 'set')
    this._pd = newPD
    return recibedPD
  }

  /** Select the category of the character
   * @param {string} name - the name of category
   */
  selectCategory (name) {
    this._category = this._applyRules(name, 'category', 'set')
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
    let context = this._applyRules({ name, value }, 'pd', 'spend')
    if (this.combatAbilities.has(name)) {
      context = this._applyRules(context, 'pd', 'spend', 'combatAbilities')
      this.combatAbilities.enhance(context.name, context.value)
    }
    if (this.supernaturalAbilities.has(name)) {
      context = this._applyRules(context, 'pd', 'spend', 'supernaturalAbilities')
      this.supernaturalAbilities.enhance(context.name, context.value)
    }
    if (this.psychicAbilities.has(name)) {
      context = this._applyRules(context, 'pd', 'spend', 'psychicAbilities')
      this.psychicAbilities.enhance(context.name, context.value)
    }
    if (this.secondaryAbilities.has(name)) {
      context = this._applyRules(context, 'pd', 'spend', 'secondaryAbilities')
      this.secondaryAbilities.enhance(context.name, context.value)
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
    let context = this._applyRules({ name, value }, 'pd', 'refound')
    if (this.combatAbilities.has(name)) {
      context = this._applyRules(context, 'pd', 'refound', 'combatAbilities')
      this.combatAbilities.decrease(context.name, context.value)
    }
    if (this.supernaturalAbilities.has(name)) {
      context = this._applyRules(context, 'pd', 'refound', 'supernaturalAbilities')
      this.supernaturalAbilities.decrease(context.name, context.value)
    }
    if (this.psychicAbilities.has(name)) {
      context = this._applyRules(context, 'pd', 'refound', 'psychicAbilities')
      this.psychicAbilities.decrease(context.name, context.value)
    }
    if (this.secondaryAbilities.has(name)) {
      context = this._applyRules(context, 'pd', 'refound', 'secondaryAbilities')
      this.secondaryAbilities.decrease(context.name, context.value)
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
