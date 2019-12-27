/** Represents a collection of abilities
 * @param {Ability[]} list - Abilities to store
 */
module.exports = class Abilities {
  constructor (list) {
    this._ = {}
    this._.storage = new Map()
    list.map(ability => {
      this._.storage.set(ability.name, ability)
    })
  }

  /** Get a {@link Ability} in the collection
   * @param {string} name - the name of ability
   * @returns {Ability}
   */
  get (name) {
    const ability = this._.storage.get(name)
    if (!ability) throw new Error(`the ${name} ability does not exist`)
    return ability
  }

  /** Inform the existence of a ability in the collection
   * @param {string} name - the name of the ability to check.
   * @returns {boolean}
   */
  has (name) {
    return this._.storage.has(name)
  }

  /** Enhance a ability
   * @param {string} name - the name ability to enhance
   * @param {number} points - the points to enhance, must be positive
   * @returns {Abilities} this
   */
  enhance (name, points) {
    const ability = this._.storage.get(name)
    if (!ability) throw new Error(`the ${name} ability does not exist`)
    this._.storage.set(name, ability.enhance(points))
    return this
  }

  /** decrease a ability
   * @param {string} name - the name of ability to decrease
   * @param {number} points - the points to decrease, must be positive
   * @returns {Abilities} this
   */
  decrease (name, points) {
    const ability = this.get(name)
    this._.storage.set(name, ability.decrease(points))
    return this
  }

  /** add bonus to all abilities in collection
   * @param {Object} bonus - the same as {@link Ability#addBonus}
   * @returns {Abilities} this
   */
  addBonus (bonus) {
    this._.storage.forEach((ability, name) => {
      this._.storage.set(name, ability.addBonus(bonus))
    })
  }

  /** Remove bonus to all abilities in collection
   * @param {string} bonusName - name of bonus to remove
   * @returns {Abilities} this
   */
  removeBonus (bonusName) {
    this._.storage.forEach((ability, name) => {
      this._.storage.set(name, ability.removeBonus(bonusName))
    })
  }

  /** add bonus to a abilities in collection
   * @param {string} name - the name of a ability to add bonus
   * @param {Object} bonus - the same as {@link Ability#addBonus}
   * @returns {Abilities} this
   */
  addBonusOf (name, bonus) {
    const ability = this.get(name)
    this._.storage.set(name, ability.addBonus(bonus))
  }

  /** Remove bonus to a abilities in collection
   * @param {string} name - the name of a ability to remove bonus
   * @param {string} bonusName - the name of the bonus to remove
   * @returns {Abilities} this
   */
  removeBonusOf (name, bonusName) {
    const ability = this.get(name)
    this._.storage.set(name, ability.removeBonus(bonusName))
  }
}
