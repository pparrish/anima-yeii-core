const { readOnly } = require('../utils').classUtils
const NamedValue = require('../NamedValue/NamedValue')
const bonusFunction = require('./bonusValueOfCharacteristics')

class Characteristic extends NamedValue {
  constructor (name, value = 0) {
    super(name, value)
    this._.bonus = bonusFunction(this.value)
  }

  get bonus () {
    return this._.bonus
  }

  set bonus (_) {
    readOnly('bonus')
  }

  enhance (points) {
    if (points < 0) throw new Error('The value must be positive')
    const value = this.value + points
    return this.fromOptions(this._promote({ value }))
  }

  decrease (points) {
    if (points < 0) throw new Error('The value must be positive')
    const value = this.points - points
    if (points < 0) throw new Error('The points cannot be negative')
    return this.fromOptions(this._promote({ value }))
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
