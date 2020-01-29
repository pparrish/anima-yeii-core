const NamedValueColection = require('../NamedValue/NamedValueColection')
const listOfCharacterBasicInfo = require('./listOfCharacterBasicInfo')
const { required } = require('../utils').classUtils

class CharacterBasicInfo extends NamedValueColection {
  constructor () {
    super(listOfCharacterBasicInfo)
  }

  changeValueOf (name, value = required('value')) {
    const basicInfo = this.get(name)
    if (!basicInfo) return this
    this._.storage.set(name, basicInfo.changeValue(value))
    return this
  }
}

module.exports = CharacterBasicInfo
