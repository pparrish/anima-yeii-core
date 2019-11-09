const listOfCharacterBasicInfo = require('../characterBasicInfo/listOfCharacterBasicInfo')

module.exports = class CharacterCreator {
  constructor () {
    this.basicInfoValues = []
    listOfCharacterBasicInfo.map(() => this.basicInfoValues.push(null))
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
}
