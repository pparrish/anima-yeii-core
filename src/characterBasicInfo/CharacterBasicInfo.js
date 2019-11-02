const NamedValueCollection = require('../namedValue/NamedValueCollection')
const BasicInfo = require('./BasicInfo')

class CharacterBasicInfo extends NamedValueCollection {
  constructor (infoName, infoContent) {
    super(infoName, infoContent, BasicInfo)
  }
}

module.exports = CharacterBasicInfo
