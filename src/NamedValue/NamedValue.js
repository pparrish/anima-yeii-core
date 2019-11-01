class NamedValue {
  constructor (name, value) {
    this._name = name
    this._value = value
  }

  get name () { return this._name }
  get value () { return this._value }

  set name (val) {
    throw new Error('name is read only')
  }

  set value (val) {
    throw new Error('value is read only')
  }
}
module.exports = NamedValue
