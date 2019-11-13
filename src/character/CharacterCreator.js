const listOfCharacterBasicInfo = require('../characterBasicInfo/listOfCharacterBasicInfo')
const listOfCharacteristics = require('../characteristics/listOfAnimaCharacteristics')
const generatePoints = require('../generatePoints')

module.exports = class CharacterCreator {
  constructor () {
    this.basicInfoValues = []
    listOfCharacterBasicInfo.map(() => this.basicInfoValues.push(null))
    this.generatedPointsResults = {}
    this.characteristicsValues = []
  }

  _set (name, value, names, values) {
    const index = names.indexOf(name)
    if (index === -1) return false
    values[index] = value
    return true
  }

  _nonSetValues (names, values) {
    const nonSet = []
    names.map((name, index) => {
      if (values[index] === undefined || values[index] === null) {
        nonSet.push(name)
      }
    })
    return nonSet
  }

  _settedValues (names, values) {
    const settedValues = {}
    names.reduce((settedValues, name, index) => {
      if (values[index] !== undefined && values[index] !== null) {
        settedValues[name] = values[index]
      }
      return settedValues
    }, settedValues)
    return settedValues
  }

  setBasicInfo (name, value) {
    return this._set(name, value, listOfCharacterBasicInfo, this.basicInfoValues)
  }

  nonSetBasicInfo () {
    return this._nonSetValues(listOfCharacterBasicInfo, this.basicInfoValues)
  }

  settedBasicInfo () {
    return this._settedValues(listOfCharacterBasicInfo, this.basicInfoValues)
  }

  generatePoints (typeNumber) {
    this.characteristicsValues = []
    const generatedTypes = Object.keys(generatePoints)
    const generateName = generatedTypes[typeNumber - 1]
    this.generatorSelected = generateName
    if (generateName === 'type5') {
      this.generatedPointsResults[generateName] = generatePoints[generateName](this.points)
      this.remainerPoints = this.generatedPointsResults[generateName].point
      return this.generatedPointsResults[generateName]
    }
    if (this.generatedPointsResults[generateName]) {
      this.nonSettedValues = this.generatedPointsResults[generateName].points
      return this.generatedPointsResults[generateName]
    }
    this.generatedPointsResults[generateName] = generatePoints[generateName](listOfCharacteristics.length)
    this.nonSettedValues = this.generatedPointsResults[generateName].points
    return this.generatedPointsResults[generateName]
  }

  setPoints (points) {
    this.points = points
  }

  isPoinsAlreadyGenerated () {
    return (Object.keys(this.generatedPointsResults).length !== 0)
  }

  generationType () {
    if (!this.isPoinsAlreadyGenerated()) throw new Error('The points is not generated, use genetatePoints(type) before')
    const generator = this.generatedPointsResults[this.generatorSelected].points
    if (Array.isArray(generator)) {
      return 'values'
    }
    if (typeof generator === 'number') {
      return 'points'
    }
    throw new Error('The generator set of points generator is not a valid type')
  }

  nonSetCharacteristics () {
    return this._nonSetValues(listOfCharacteristics, this.characteristicsValues)
  }

  getGreatestNonSetValue () {
    if (this.generationType() === 'points') throw new Error('the generation type is points use another generation')
    const greatest = this.nonSettedValues.reduce((greatest, actual) => greatest > actual ? greatest : actual, -Infinity)
    return greatest
  }

  getSmalestNonSetValue () {
    if (this.generationType() === 'points') throw new Error('the generation type is points use another generation')
    return this.nonSettedValues.reduce((smalest, actual) => smalest < actual ? smalest : actual, Infinity)
  }

  _getIndex (value, array) {
    return array.indexOf(value)
  }

  indexOfCharacteristic (name) {
    const index = this._getIndex(name, listOfCharacteristics)
    if (index === -1) throw new Error('The characteristic is not in characteristics list')
    return index
  }

  selectValueTo (name, value) {
    const indexName = this.indexOfCharacteristic(name)
    const indexOfValue = this._getIndex(value, this.nonSettedValues)
    if (indexOfValue === -1) throw new Error('the value is not in nonSettedValues')
    this.characteristicsValues[indexName] = value
    this.nonSettedValues.splice(indexOfValue)
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
    return this.nonSettedValues.map(x => x)
  }

  removeValueTo (name) {
    const index = this.indexOfCharacteristic(name)
    const value = this.characteristicsValues[index]
    delete this.characteristicsValues[index]
    this.nonSettedValues.push(value)
    return this
  }

  settedCharacteristics () {
    return this._settedValues(listOfCharacteristics, this.characteristicsValues)
  }
}
