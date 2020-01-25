const {
  required,
  readOnly,
} = require('../utils').classUtils
/** Represents a inmutable name asociated with a value.
 * @param {string} name - the name for asociated a value
 * @param {any} value - any value to asociate
 */
class NamedValue {
  constructor(name = required('name'), value) {
    this._ = {
      name,
      value,
    }
  }

  /** the name
   * @type {string}
   * @readonly
   */
  get name() {
    return this._.name
  }

  /** the value
   * @type {any}
   * @readonly
   */
  get value() {
    return this._.value
  }

  set name(_) {
    readOnly('name')
  }

  set value(_) {
    readOnly('value')
  }

  /** Base operation of named value
   * @param {any} value - the value to change
   * @returns { NamedValue } new NammedValue with the new value
   */
  changeValue(value) {
    return this.fromOptions(
      this._promote({ value })
    )
  }

  /** Recibe a object and full any non specified value for the NamedValue properties
   * @private
   */
  _promote(changes = {}) {
    return {
      ...changes,
      name: this.name,
      value: changes.value || this.value,
    }
  }

  /** Create a NamedValue from a object
   * @param {Object} options - a object with the arguments of NamedValueConstructor
   * @returns {NamedValue} a NamedValue make with options
   */
  static fromOptions(
    options = required('options')
  ) {
    const { name, value } = options
    return new NamedValue(name, value)
  }

  fromOptions(options) {
    return this.constructor.fromOptions(options)
  }
}
module.exports = NamedValue
