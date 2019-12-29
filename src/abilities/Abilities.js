const { required } = require('../utils').classUtils
const NamedValueColection = require('../NamedValue/NamedValueColection')
/** Represents a collection of abilities
 * @param {Ability[]} list - Abilities to store
 */
module.exports = class Abilities extends NamedValueColection {
  get (name) {
    if (!this.has(name)) throw new Error(`the ${name} ability does not exist`)
    return super.get(name)
  }

  /** Enhance a ability
   * @param {string} name - the name ability to enhance
   * @param {number} points - the points to enhance, must be positive
   * @returns {Abilities} this
   */
  enhance (name, points = required('points')) {
    const ability = this.get(name)
    this._.storage.set(name, ability.enhance(points))
    return this
  }

  /** decrease a ability
   * @param {string} name - the name of ability to decrease
   * @param {number} points - the points to decrease, must be positive
   * @returns {Abilities} this
   */
  decrease (name, points = required('points')) {
    const ability = this.get(name)
    this._.storage.set(name, ability.decrease(points))
    return this
  }

  /** add bonus to all abilities in collection
   * @param {Object} bonus - the same as {@link Ability#addBonus}
   * @returns {Abilities} this
   */
  addBonus (bonus = required('bonus')) {
    this._.storage.forEach((ability, name) => {
      this._.storage.set(name, ability.addBonus(bonus))
    })
  }

  /** Remove bonus to all abilities in collection
   * @param {string} reason - name of bonus to remove
   * @returns {Abilities} this
   */
  removeBonus (reason = required('reason')) {
    this._.storage.forEach((ability, name) => {
      this._.storage.set(name, ability.removeBonus(reason))
    })
  }

  /** add bonus to a abilities in collection
   * @param {string} name - the name of a ability to add bonus
   * @param {Object} bonus - the same as {@link Ability#addBonus}
   * @returns {Abilities} this
   */
  addBonusOf (name, bonus = required('bonus')) {
    const ability = this.get(name)
    this._.storage.set(name, ability.addBonus(bonus))
  }

  /** Remove bonus to a abilities in collection
   * @param {string} name - the name of a ability to remove bonus
   * @param {string} reason - the name of the bonus to remove
   * @returns {Abilities} this
   */
  removeBonusOf (name, reason = required('reason')) {
    const ability = this.get(name)
    this._.storage.set(name, ability.removeBonus(reason))
  }
}
