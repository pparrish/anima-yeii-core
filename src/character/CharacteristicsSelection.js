const Characteristics = require('../characteristics/characteristics')
const PointsGenerator = require('../generatePoints/PointsGenerator')
const ValuesShop = require('../shop/valuesShop')

module.exports = class CharacteristicsSelection {
  constructor (characterCreator, rules) {
    this.links = []
    this.characterCreator = characterCreator
    this.characteristics = new Characteristics()
    this.pointsGenerator = new PointsGenerator()
    this.pointsGenerator.setValuesToGenerate(this.characteristics.length)
      .setPointsToGenerate(60)
    this.rules = rules
    this.valuesShop = new ValuesShop([])
  }

  generatePoints (type) {
    this.pointsGenerator.selectGenerator(type).generate()
    if (this.pointsGenerator.type === 'values') {
      this.valuesShop = new ValuesShop(this.pointsGenerator.result.points)
    }
    this.characteristics = new Characteristics()
    return this
  }

  set points (points) {
    this.characteristics = new Characteristics()
    this.pointsGenerator.setPointsToGenerate(points)
    return this
  }

  get pointsAlreadyGenerated () {
    if (!this.pointsGenerator.isGeneratorSelected()) return false
    return this.pointsGenerator.isAlreadyGenerated(this.pointsGenerator.generator.name)
  }

  get generatorResult () {
    return this.pointsGenerator.result
  }

  get generatorType () {
    return this.pointsGenerator.type
  }

  get nonSetted () {
    return this.characteristics.nonSetted
  }

  get greatestNonSetValue () {
    if (this.generatorType === 'points') throw new Error('the generation type is points use another generation')
    return this.valuesShop.greatestInStock
  }

  get smalestNonSetValue () {
    if (this.generatorType === 'points') throw new Error('the generation type is points use another generation')
    return this.valuesShop.smalestInStock
  }

  selectValueTo (name, value) {
    this.valuesShop.spend(value)
    this.commitCharacteristic(name, value)
    return this
  }

  removeValueTo (name) {
    const valueToRefound = this.characteristics.get(name).value
    this.removePointsTo(name)
    this.valuesShop.refound(valueToRefound)
    return this
  }

  get nonSetValues () {
    return this.valuesShop.catalog
  }

  get setted () {
    return this.characteristics.settedValues
  }

  get nonSet () {
    return this.characteristics.nonSetted
  }

  callLinks (name, value) {
    this.links.map(link => link(name, value, this.characterCreator))
    return this
  }

  addLink (linkFn) {
    this.links.push(linkFn)
    return this
  }

  expendPointsTo (characteristic, amount) {
    const actualCharacteristicValue = this.setted[characteristic] || 0

    this.commitCharacteristic(characteristic, actualCharacteristicValue + amount)

    if (this.remainingPoints < 0) {
      this.commitCharacteristic(characteristic, actualCharacteristicValue)

      if (!this.remainingPoints) this.characteristics.markUnsetted(characteristic)
      throw new Error('points to expend exeded')
    }
    return this
  }

  removePointsTo (characteristic, amount) {
    const actualValue = this.setted[characteristic]
    if (!actualValue) throw new Error(`the ${characteristic} not have any value`)
    if (!amount) {
      this.commitCharacteristic(characteristic, 0)
      this.characteristics.markUnsetted(characteristic)
      return this
    }
    const newValue = actualValue - amount
    if (newValue < 0) throw new Error(`You are trying to remove ${amount} to ${characteristic} but only have ${actualValue}`)
    this.commitCharacteristic(characteristic, newValue)
    if (!newValue) this.characteristics.markUnsetted(characteristic)
    return this
  }

  get remainingPoints () {
    const totalPoints = this.pointsGenerator.pointsToGenerate
    const spendCharacteristics = this.rules.applyRules(Object.values(this.setted), 'points', 'spends')
    const spendedPoints = spendCharacteristics.reduce((total, actual) => total + actual, 0)
    return totalPoints - spendedPoints
  }

  commitCharacteristic (characteristic, value) {
    const newValue = this.rules.applyRules(value, 'characteristics', 'set', characteristic)
    this.characteristics.set(characteristic, newValue)
      .markSetted(characteristic)
    this.callLinks(characteristic, newValue)
    return newValue
  }
}
