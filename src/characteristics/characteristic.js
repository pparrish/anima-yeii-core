const bonusFunction = require('./bonusValueOfCharacteristics')
class Characteristic {
  constructor (name, value) {
    this._name = name
    this._value = value
  }

  set name (val) {
    throw new Error('Characteristic name is read only')
  }

  get name () { return this._name }
  set value (val) {
    throw new Error('Characteristic value is read only')
  }

  get value () { return this._value }
  set bonusValue (val) {
    throw new Error('Charactrristic bonusValue is read only')
  }

  get bonusValue () { return bonusFunction(this.value) }
}
module.exports = Characteristic
