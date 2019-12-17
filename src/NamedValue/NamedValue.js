/** Class than represent a name asociated to a value
 * @param {string} name - the name for asociated a value
 * @param {any} value - any value to asociate
 */
class NamedValue {
  constructor (name, value) {
    this._name = name
    this._value = value
  }

  /** the name of the named value
   * @type {string}
   * @readonly
   */
  get name () { return this._name }
  /** the value of the named value
   * @type {any}
   * @readonly
   */
  get value () { return this._value }

  set name (_) {
    throw new Error('name is read only')
  }

  set value (_) {
    throw new Error('value is read only')
  }
}
module.exports = NamedValue
