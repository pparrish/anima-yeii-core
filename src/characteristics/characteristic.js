const { readOnly } = require('../utils').classUtils
const NamedValue = require('../NamedValue/NamedValue')
const bonusFunction = require('./bonusValueOfCharacteristics')

class Characteristic extends NamedValue {
  constructor (name, value) {
    super(name, value)
    this._.bonus = bonusFunction(this.value)
  }

  get bonus () {
    return this._.bonus
  }

  set bonus (_) {
    readOnly('bonus')
  }

  static fromOptions (options) {
    const { name, value } = options
    return new Characteristic(name, value)
  }

  fromOptions (options) {
    return Characteristic.fromOptions(options)
  }
}
module.exports = Characteristic
