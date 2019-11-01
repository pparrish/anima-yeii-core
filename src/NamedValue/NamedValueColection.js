const NamedValue = require('./NamedValue')

class NamedValueColection {
  constructor (names, values, InamedValue = NamedValue) {
    this._storage = new Map()
    names.map((name, nameIndex) => {
      this._storage.set(name, new InamedValue(name, values[nameIndex]))
    })
  }

  has (name) {
    return this._storage.has(name)
  }

  get (name) {
    if (!this.has(name)) return null
    return this._storage.get(name)
  }

  valueOf (name) {
    if (!this.has(name)) return null
    return this._storage.get(name).value
  }
}

module.exports = NamedValueColection
