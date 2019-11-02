const NamedValueCollection = require('../namedValue/NamedValueColection')
const SecondaryCharacteristic = require('./SecondaryCharacteristic')

module.exports = class SecondaryCharacteristics extends NamedValueCollection {
  constructor (names, values) {
    super(names, values, SecondaryCharacteristic)
  }
}
