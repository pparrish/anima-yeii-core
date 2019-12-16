const NamedValueColection = require('../NamedValue/NamedValueColection')
const BasicInfo = require('./BasicInfo')

class CharacterBasicInfo extends NamedValueColection {
  constructor (infoName, infoContent) {
    super(infoName, infoContent, BasicInfo)
  }
}

module.exports = CharacterBasicInfo
