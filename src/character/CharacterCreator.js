const listOfCharacterBasicInfo = require('../characterBasicInfo/listOfCharacterBasicInfo')
const listOfCharacteristics = require('../characteristics/listOfAnimaCharacteristics')
const generatePoints = require('../generatePoints')

module.exports = class CharacterCreator {
  constructor () {
    this.basicInfoValues = []
    listOfCharacterBasicInfo.map(() => this.basicInfoValues.push(null))
    this.generatedPointsResults = {}
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
    const generatedTypes = Object.keys(generatePoints)
    const generateName = generatedTypes[typeNumber - 1]
    this.generatorSelected = generateName
    if (generateName === 'type5') {
      this.generatedPointsResults[generateName] = generatePoints[generateName](this.points)
      return this.generatedPointsResults[generateName]
    }
    if (this.generatedPointsResults[generateName]) {
      return this.generatedPointsResults[generateName]
    }
    this.generatedPointsResults[generateName] = generatePoints[generateName](listOfCharacteristics.length)
    return this.generatedPointsResults[generateName]
  }

  setPoints (points) {
    this.points = points
  }

  isPoinsAlreadyGenerated () {
    console.log(Object.keys(this.generatedPointsResults).length)
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
}
