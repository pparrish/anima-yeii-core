const Characteristic = require('./characteristic')

class Characteristics {
  constructor (names, values) {
    this._characteristics = new Map()
    names.map(
      (name, nameIndex) =>
        this._characteristics.set(
          name,
          new Characteristic(
            name, values[nameIndex]
          )
        )
    )
  }

  get (name) {
    if (!this._characteristics.has(name)) return null
    return this._characteristics.get(name)
  }

  valueOf (name) {
    const characteristic = this.get(name)
    if (!characteristic) return characteristic
    return characteristic.value
  }

  bonusValueOf (name) {
    const characteristic = this.get(name)
    if (!characteristic) return characteristic
    return characteristic.bonusValue
  }
}
module.exports = Characteristics
