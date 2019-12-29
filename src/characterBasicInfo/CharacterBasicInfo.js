const NamedValueColection = require('../NamedValue/NamedValueColection')
const { required } = require('../utils').classUtils

class CharacterBasicInfo extends NamedValueColection {
  changeValueOf (name, value = required('value')) {
    const basicInfo = this.get(name)
    if (!basicInfo) return this
    this._.storage.set(name, basicInfo.changeValue(value))
  }
}

module.exports = CharacterBasicInfo
