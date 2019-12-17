const NamedValue = require('./NamedValue')

/** Represents a colection of {@link NamedValue} objects
 * @param {string[]} names - A array of names of each {@link NamedValue }
 * @param {any[]} values - A array of any values to use in each {@link NamedValue}
 */
class NamedValueColection {
  constructor (names, values, InamedValue = NamedValue) {
    this._storage = new Map()
    names.map((name, nameIndex) => {
      this._storage.set(name, new InamedValue(name, values[nameIndex]))
    })
  }

  /** inform the existence of a name in the collection
   * @param {string} name - the name to search
   * @returns {boolean} true if the name is in the collection
   */
  has (name) {
    return this._storage.has(name)
  }

  /** get a {@link NamedValue} in the collection
   * @param {string} name - the name of the {@link NamedValue} in the collection
   * @returns {(NamedValue|null)} if the name is not in collection return null
   */
  get (name) {
    if (!this.has(name)) return null
    return this._storage.get(name)
  }

  /** value asociated by a name
   * @param {string} name - the name in the collection to get the value
   * @returns {(NamedValue|null)} if name is not in collection return null
   */
  valueOf (name) {
    if (!this.has(name)) return null
    return this._storage.get(name).value
  }
}

module.exports = NamedValueColection
