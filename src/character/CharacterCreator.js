const basicInfoList = require('../characterBasicInfo/listOfCharacterBasicInfo')
const characteristicsList = require('../characteristics/listOfAnimaCharacteristics')
const generatePoints = require('../generatePoints')

module.exports = class CharacterCreator {
  constructor () {
    this._namesLists = {
      basicInfo: basicInfoList.map(x => x),
      characteristics: characteristicsList.map(x => x)
    }

    this._valuesLists = {
      basicInfo: this._getNames('basicInfo').map(() => null),
      characteristics: this._getNames('characteristics').map(() => null)
    }

    this.generatedPointsResults = {}
    this.generatorSelected = null
    this.nonSettedValues = []
  }

  _getNames (type) {
    const list = this._namesLists[type]
    if (!list) throw new Error(`the ${type} list not exists`)
    return list.map(x => x)
  }

  _set (name, value, type) {
    const index = this._getNames(type).indexOf(name)
    if (index === -1) return false
    this._valuesLists[type][index] = value
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

  setBasicInfo (name, value) {
    return this._set(name, value, 'basicInfo')
  }

  nonSetBasicInfo () {
    return this._nonSetValues('basicInfo')
  }

  settedBasicInfo () {
    return this._settedValues('basicInfo')
  }

  generatePoints (typeNumber) {
    const generatedTypes = Object.keys(generatePoints)
    const generateName = generatedTypes[typeNumber - 1]
    this._valuesLists.characteristics = this._getNames('characteristics').map(x => null)
    this.generatorSelected = generateName

    if (generateName === 'type5') {
      if (!this.points) throw new Error('Must select before the points to generate')
      this.generatedPointsResults[generateName] = generatePoints[generateName](this.points)
      this.remainerPoints = this.generatedPointsResults[generateName].point
    } else if (!this.generatedPointsResults[generateName]) {
      this.generatedPointsResults[generateName] = generatePoints[generateName](this._getNames('characteristics').length)
    }
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
    return this._nonSetValues('characteristics')
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
    const index = this._getIndex(name, this._getNames('characteristics'))
    if (index === -1) throw new Error('The characteristic is not in characteristics list')
    return index
  }

  selectValueTo (name, value) {
    const indexName = this.indexOfCharacteristic(name)
    const indexOfValue = this._getIndex(value, this.nonSettedValues)
    if (indexOfValue === -1) throw new Error('the value is not in nonSettedValues')
    this._valuesLists.characteristics[indexName] = value
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
    const value = this._valuesLists.characteristics[index]
    this._valuesLists.characteristics[index] = null
    this.nonSettedValues.push(value)
    return this
  }

  settedCharacteristics () {
    return this._settedValues('characteristics')
  }
}
