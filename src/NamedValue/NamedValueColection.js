const {
  required,
} = require('../utils').classUtils

/** Represents a colection of {@link NamedValue} objects
 * @param {any[]} list - A array of any values to use in each {@link NamedValue}
 */
class NamedValueColection {
  constructor(list = required('list')) {
    this._ = {
      storage: new Map(),
      setted: [],
      nonSetted: [],
    }
    list.map(ability => {
      this._.storage.set(ability.name, ability)
    })
    this._.nonSetted = list.map(
      namedValue => namedValue.name
    )
  }

  /** inform the existence of a name in the collection
   * @param {string} name - the name to search
   * @returns {boolean} true if the name is in the collection
   */
  has(name = required('name')) {
    return this._.storage.has(name)
  }

  /** get a {@link NamedValue} in the collection
   * @param {string} name - the name of the {@link NamedValue} in the collection
   * @returns {(NamedValue|null)} if the name is not in collection return null
   */
  get(name = required('name')) {
    if (!this.has(name)) return null
    return this._.storage.get(name)
  }

  /** value asociated by a name
   * @param {string} name - the name in the collection to get the value
   * @returns {(NamedValue|null)} if name is not in collection return null
   */
  valueOf(name = required('name')) {
    if (!this.has(name)) return null
    return this._.storage.get(name).value
  }

  markSetted(name = required('name')) {
    if (!this.has(name)) return null
    this._.nonSetted = this._.nonSetted.filter(
      namedValue => namedValue !== name
    )
    this._.setted.push(name)
    return this
  }

  markUnsetted(name = required('name')) {
    if (!this.has(name)) return null
    this._.setted = this._.setted.filter(
      namedValue => namedValue !== name
    )
    this._.nonSetted.push(name)
    return this
  }

  get settedValues() {
    const settedValues = {}
    this._.storage.forEach(namedValue => {
      if (
        this._.setted[
          this._.setted.indexOf(namedValue.name)
        ]
      )
        settedValues[namedValue.name] =
          namedValue.value
    })
    return settedValues
  }

  get nonSetted() {
    return this._.nonSetted.map(x => x)
  }

  get length() {
    return this._.storage.size
  }

  get names() {
    return [...this._.storage.keys()]
  }
}

module.exports = NamedValueColection
