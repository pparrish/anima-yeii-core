const CharacteristicsSelection = require('./CharacteristicsSelection')
const PhysicalCapacities = require('../physicalCapacities/PhysicalCapacities')
const SecondaryCharacteristics = require('../secondaryCharacteristics/SecondaryCharacteristics')
const Shop = require('../shop/Shop')
const CharacterBasicInfo = require('../characterBasicInfo/CharacterBasicInfo')
const CombatAbilities = require('../primaryAbilities/combatAbilities/CombatHabilities')
const SupernaturalAbilities = require('../primaryAbilities/supernaturalAbilities/SupernaturalAbilities')
const PsychicAbilities = require('../primaryAbilities/psychicAbilities/PsychicAbilities')
const SecondaryAbilities = require('../secondaryAbilities/SecondaryAbilities')
const rules = require('./rules')
const sizeTable = require('../secondaryCharacteristics/sizeTable')
const NaturalAbilitiesSelection = require('./NaturalAbilitiesSelection')
const D10 = require('../dices/d10')
const d10 = new D10()

/** class represents a creator of a character with a rules.of anima
 */
class CharacterCreator {
  constructor () {
    this.rules = rules()
    this.rules.defaultEmiter = this

    this.characteristicsSelection = new CharacteristicsSelection(this, this.rules)
    this._setLinks()

    /* Abilities */
    this.secondaryCharacteristics = new SecondaryCharacteristics()
    this.basicInfo = new CharacterBasicInfo()
    this.physicalCapacities = new PhysicalCapacities()
    this.combatAbilities = new CombatAbilities()
    this.supernaturalAbilities = new SupernaturalAbilities()
    this.psychicAbilities = new PsychicAbilities()
    this.secondaryAbilities = new SecondaryAbilities()

    /* shops */
    this.developmentPointsShop = new Shop({})

    this.naturalAbilitiesSelection = new NaturalAbilitiesSelection(this.secondaryAbilities, this.basicInfo)

    this._appearance = d10.roll()
    this._pd = null

    this.rules.applyRules(this, 'creator', 'init')
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

  _setLinks () {
    // Bonusses links
    this.characteristicsSelection.addLink((name, _, creator) => {
      const characteristic = creator.characteristicsSelection.characteristics.get(name)

      if (name in creator.settedCharacteristics()) {
        const bonus = { reason: 'characteristic', value: characteristic.bonus }
        creator.combatAbilities.addBonusWhoDepensOn(name, bonus)
        creator.supernaturalAbilities.addBonusWhoDepensOn(name, bonus)
        creator.psychicAbilities.addBonusWhoDepensOn(name, bonus)
        creator.secondaryAbilities.addBonusWhoDepensOn(name, bonus)
        return
      }

      creator.combatAbilities.removeBonusWhoDependsOn(name, 'characteristic')
      creator.supernaturalAbilities.removeBonusWhoDependsOn(name, 'characteristic')
      creator.psychicAbilities.removeBonusWhoDependsOn(name, 'characteristic')
      creator.secondaryAbilities.removeBonusWhoDependsOn(name, 'characteristic')
    })

    // psysique link
    this.characteristicsSelection.addLink((name, value, creator) => {
      if (name === 'physique') {
        creator.physicalCapacities.set('fatigue', creator.rules.applyRules(value, 'physicalCapacities', 'set', 'fatigue'))
        if (creator.physicalCapacities.get('fatigue')) creator.physicalCapacities.markSetted('fatigue')
        else creator.physicalCapacities.markUnsetted('fatigue')
      }
    })

    this.characteristicsSelection.addLink((name, value, creator) => {
      if (name === 'agility') {
        creator.physicalCapacities.set('movement type', creator.rules.applyRules(value, 'physicalCapacities', 'set', 'movement type'))
        if (creator.physicalCapacities.get('movement type')) creator.physicalCapacities.markSetted('movement type')
        else creator.physicalCapacities.markUnsetted('movement type')
      }
    })

    this.characteristicsSelection.addLink((name, _, creator) => {
      if (name === 'strength' || name === 'physique') {
        const { strength, physique } = creator.settedCharacteristics()
        if (strength && physique) {
          this.secondaryCharacteristics.set('size', creator.rules.applyRules(strength + physique, 'secondaryCharacteristics', 'set', 'size'))
            .markSetted('size')
        }
      }
    })
  }

  // BASICINFO
  /** Set a value of a character basic Info
   * @param {string} name - The name of the basic info to set can use nonSetBasicInfo to get what names are supported
   * @param {any} value - The value of the basic info to set.
   * @returns {CharacterCreator} - this
   */
  setBasicInfo (name, value) {
    if (!this.basicInfo.has(name)) throw new Error('the ' + name + ' is not in basic info')
    this.basicInfo.changeValueOf(name, this.rules.applyRules(value, 'basicInfo', 'set', name)).markSetted(name)
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
    this.characteristicsSelection.generatePoints(type)
    return this
  }

  /** Set the number of points than type 5 generator used, use this before use a type 5 generator
   * @param {number} points - number of points for generate
   * @returns {CharacterCreator} this
   */
  setPoints (points) {
    this.characteristicsSelection.points = points
    return this
  }

  isPoinsAlreadyGenerated () {
    return this.characteristicsSelection.pointsAlreadyGenerated
  }

  getGeneratedPointsResult () {
    return this.pointsGenerator.result
  }

  generationType () {
    return this.characteristicsSelection.generatorType
  }

  // Characteristic
  /** Returns a array of the non setted characteristics names
   * @returns {Array} Array of strings
   */
  nonSetCharacteristics () {
    return this.characteristicsSelection.nonSet
  }

  getGreatestNonSetValue () {
    return this.characteristicsSelection.greatestNonSetValue
  }

  getSmalestNonSetValue () {
    return this.characteristicsSelection.smalestNonSetValue
  }

  /* set a Value to a chacacteristic the value must be in the generated values. You can get the abiable values by non set generation values
   * @param {string} name - The name of a characteristic
   * @param {number} value - The value to set
   * @returns {CharacterCreator} this
   */
  selectValueTo (name, value) {
    this.characteristicsSelection.selectValueTo(name, value)
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
    return this.characteristicsSelection.nonSetValues
  }

  /* Remove a value to a characteristic and move again to the aviable values
   * @param {string} name - The name of characteristic
   * @returns {CharacterCreator} this
   */
  removeValueTo (name) {
    this.characteristicsSelection.removeValueTo(name)
    return this
  }

  /* Get the characteristic than are setted and her values
   * @returns {Object} the characteristics setted
   */
  settedCharacteristics () {
    return this.characteristicsSelection.setted
  }

  /** Add the amount of points to a characteristic and spend it from remainder points. Uses the rule path of "set/characteristics"
   * @param {string} characteristic - The characteristic to add value
   * @param {number} amount - The value to be added in characteristic and expended from remainder points.
   * @returns {Object} this
   */
  expendPointsTo (characteristic, amount) {
    this.characteristicsSelection.expendPointsTo(characteristic, amount)
    return this
  }

  /** Subtracts or remove the points of a characteristic
   * @param {string} characteristic - The name of the characteristic to substract or remove
   * @param {number} [amount] - The value to substract, if not setted then remove all points to characteristic
   * @return {Object} this
   */
  removePointsTo (characteristic, amount) {
    this.characteristicsSelection.removePointsTo(characteristic, amount)
    return this
  }

  /** Returns the number of points left to spend in the characteristics
   * @returns {number} remainder points
   */
  remainderPoints () {
    return this.characteristicsSelection.remainingPoints
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
    if (!setted.appearance) setted.appearance = this._appearance
    return setted
  }

  /* set a secondary characteristic
   * @param {string} name - a name of secondaryCharacteristic
   * @param {any} value - the value to set the secondary characteristic
   * returns {CharacterCreator} this
   */
  setSecondaryCharacteristic (name, value) {
    this.secondaryCharacteristics.set(name, this.rules.applyRules(value, 'secondaryCharacteristics', 'set', name))
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
    const pd = this.rules.applyRules(this._pd, 'pd', 'get')
    if (pd === null) throw new Error('Development points is not setted')
    return this._pd
  }

  set developmentPoints (recibedPD) {
    const newPD = this.rules.applyRules(recibedPD, 'pd', 'set')
    this._pd = newPD
    return recibedPD
  }

  /** Select the category of the character
   * @param {string} name - the name of category
   */
  selectCategory (name) {
    this._category = this.rules.applyRules(name, 'category', 'set')
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
    let context = this.rules.applyRules({ name, value }, 'pd', 'spend')
    let especified = ''
    let IAbilityCollection = null
    if (this.combatAbilities.has(name)) {
      especified = 'combatAbilities'
      IAbilityCollection = this.combatAbilities
    }
    if (this.supernaturalAbilities.has(name)) {
      especified = 'supernaturalAbilities'
      IAbilityCollection = this.supernaturalAbilities
    }
    if (this.psychicAbilities.has(name)) {
      especified = 'psychicAbilities'
      IAbilityCollection = this.psychicAbilities
    }
    if (this.secondaryAbilities.has(name)) {
      especified = 'secondaryAbilities'
      IAbilityCollection = this.secondaryAbilities
    }
    if (!IAbilityCollection) {
      console.log(this.supernaturalAbilities)
      throw new Error(name + ' is not a ability' + especified)
    }
    context = this.rules.applyRules(context, 'pd', 'spend', especified)
    IAbilityCollection.enhance(context.name, context.value)
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
    let context = this.rules.applyRules({ name, value }, 'pd', 'refound')
    let especified = ''
    let IAbilityCollection = null
    if (this.combatAbilities.has(name)) {
      especified = 'combatAbilities'
      IAbilityCollection = this.combatAbilities
    }
    if (this.supernaturalAbilities.has(name)) {
      especified = 'supernaturalAbilities'
      IAbilityCollection = this.supernaturalAbilities
    }
    if (this.psychicAbilities.has(name)) {
      especified = 'psychicAbilities'
      IAbilityCollection = this.psychicAbilities
    }
    if (this.secondaryAbilities.has(name)) {
      especified = 'secondaryAbilities'
      IAbilityCollection = this.secondaryAbilities
    }
    context = this.rules.applyRules(context, 'pd', 'refound', especified)
    IAbilityCollection.decrease(context.name, context.value)
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
    let IAbilityCollection = null
    if (this.combatAbilities.has(name)) {
      IAbilityCollection = this.combatAbilities
    }
    if (this.supernaturalAbilities.has(name)) {
      IAbilityCollection = this.supernaturalAbilities
    }
    if (this.psychicAbilities.has(name)) {
      IAbilityCollection = this.psychicAbilities
    }
    if (this.secondaryAbilities.has(name)) {
      IAbilityCollection = this.secondaryAbilities
    }
    return IAbilityCollection.get(name)
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
