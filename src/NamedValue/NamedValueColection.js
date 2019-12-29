const { required } = require('../utils').classUtils

/** Represents a colection of {@link NamedValue} objects
 * @param {any[]} list - A array of any values to use in each {@link NamedValue}
 */
class NamedValueColection {
  constructor (list = required('list')) {
    this._ = {
      storage: new Map()
    }
    list.map(ability => {
      this._.storage.set(ability.name, ability)
    })
  }

  /** inform the existence of a name in the collection
   * @param {string} name - the name to search
   * @returns {boolean} true if the name is in the collection
   */
  has (name = required('name')) {
    return this._.storage.has(name)
  }

  /** get a {@link NamedValue} in the collection
   * @param {string} name - the name of the {@link NamedValue} in the collection
   * @returns {(NamedValue|null)} if the name is not in collection return null
   */
  get (name = required('name')) {
    if (!this.has(name)) return null
    return this._.storage.get(name)
  }

  /** value asociated by a name
   * @param {string} name - the name in the collection to get the value
   * @returns {(NamedValue|null)} if name is not in collection return null
   */
  valueOf (name = required('name')) {
    if (!this.has(name)) return null
    return this._.storage.get(name).value
  }
}

module.exports = NamedValueColection
