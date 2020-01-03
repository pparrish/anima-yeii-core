const { required } = require('../utils').classUtils
const NamedValueCollection = require('../NamedValue/NamedValueColection')
const listOfAnimaSecondaryCharacteristics = require('./listOfAnimaSecondaryCharacteristics')
module.exports = class SecondaryCharacteristics extends NamedValueCollection {
  constructor () {
    super(listOfAnimaSecondaryCharacteristics)
  }

  set (name, value = required('value')) {
    const secondaryCharacteristic = this.get(name)
    this._.storage.set(name, secondaryCharacteristic.fromOptions({ name, value }))
    return this
  }
}
