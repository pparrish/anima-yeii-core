/** Ability class
 * @module Ability
*/
const required = (name = 'is') => { throw new Error(`Param ${name} missed`) }
const readOnly = (name) => { throw new Error(`${name} read only`) }
/** Class representing a ability */
module.exports = class Ability {
  /* Create a Ability
   * @param {string} name - The name of the ability
   * @param { string } dependency - The name of characteristic on wich it depends
   * @param { number } rate - The rate of rise with every point
   * @param { number } points - The points of ability is used with {@link Ability#rate} to get the {@link Ability#base} value
   * @param { Bonus[] } bonuses - A array of bonus, to be added with {@link Ability#base} to get {@link Ability#value}
   * @param { string } bonuses[].reason - String with the reason of the bonus
   * @param { number } bonuses[].value - the bonus value.
   */
  constructor (name = required('name'), points = 0, dependency = '', rate = 1, bonuses = []) {
    this._ = {
      name,
      rate,
      dependency,
      points,
      bonuses
    }
  }

  get name () {
    return this._.name
  }

  set name (_) {
    readOnly('name')
  }

  get value () {
    const value = this.base + this.bonus
    return value
  }

  set value (_) {
    readOnly('name')
  }

  get base () {
    const base = this._.rate * this.points
    return base
  }

  set base (_) {
    readOnly('base')
  }

  get bonus () {
    const bonusValue = this._.bonuses.reduce((bonusValue, bonus) => bonusValue + bonus.value, 0)
    return bonusValue
  }

  set bonus (_) {
    readOnly('base')
  }

  get rate () {
    return this._.rate
  }

  set rate (_) {
    readOnly('rate')
  }

  get points () {
    return this._.points
  }

  set points (_) {
    readOnly('rate')
  }

  set bonuses (_) {
    readOnly('bonuses')
  }

  get bonuses () {
    return this._.bonuses.map(x => x)
  }

  get dependency () {
    return this._.dependency
  }

  set dependency (_) {
    readOnly('dependency')
  }

  /* enhance a ability
   * @param {number} - A number of points to add.
   * @returns { Ability } - new Ability with enhance
   */
  enhance (value = required('value')) {
    if (value < 0) throw new Error('The value must be positive')
    const newPoints = this.points + value
    return new Ability(this.name, newPoints, this.dependency, this.rate, this.bonuses)
  }

  /* decrease a ability
   * @param { number } value - A number of points to remove from a ability.
   * @returns { Ability } new Ability decreased
   */
  decrease (value = required('value')) {
    if (value < 0) throw new Error('The value must be positive')
    const newPoints = this.points - value
    return new Ability(this.name, newPoints, this.dependency, this.rate, this.bonuses)
  }

  /** add a bonus
   * @param { Object } bonus
   * @param { string } bonus.reason - The reason of the bonus or the name of the bonus
   * @param { number } bonus.value - The value of the bonus.
   * @returns { Ability } Ability with the new bonus
   */
  addBonus (bonus = required('bonus')) {
    if (typeof bonus !== 'object') throw new Error('The bonus must be a object')
    if (!bonus.reason) throw new Error('The bonus must have a reason property')
    if (!bonus.value) throw new Error('The bonus must have a value property')
    if (isNaN(bonus.value)) throw new Error('The bonus must be a number')
    const newBonuses = this.bonuses
    newBonuses.push(bonus)
    return new Ability(this.name, this.points, this.dependency, this.rate, newBonuses)
  }

  /** Remove all bonus of one reazon
   * @param { string } reason - String to search the bonus to remove, all bonus with the same reason is removed
   * returns { Ability } The Ability without the bonus removed.
   */
  removeBonus (reason = required('reason')) {
    const newBonuses = this.bonuses.filter(bonus => bonus.reason !== reason)
    return new Ability(this.name, this.points, this.dependency, this.rate, newBonuses)
  }

  /** Check the equality of habilities, must be the same name, value, dependency and rate
   * @param {Ability} toTest - The ability to test equality
   * @returns {bolean}
   */
  equal (toTest = require('toTest')) {
    return this.value === toTest.value &&
      this.name === toTest.name &&
      this.dependency === toTest.dependency &&
      this.rate === toTest.rate
  }
}
