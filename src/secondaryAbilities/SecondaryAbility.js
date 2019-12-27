const Ability = require('../abilities/Ability')
const readOnly = (name) => { throw new Error(`${name} read only`) }
/** Represents a secondary ability
   *@param { string } category - the category of te secondaryAbilitie
 */
module.exports = class SecondaryAbility extends Ability {
  constructor (name, points, dependency, rate, bonuses, category = '') {
    super(name, points, dependency, rate, bonuses)
    this._.category = category
  }

  /* The category of the secondary ability ex.atletics
   * @type { string }
   */
  get category () {
    return this._.category
  }

  set category (_) {
    readOnly('category')
  }

  static fromOptions (options) {
    const ability = super.fromOptions(options)
    return new SecondaryAbility(ability.name, ability.points, ability.dependency, ability.rate, ability.bonuses, options.category)
  }

  enhance (value) {
    return this._promote(super.enhance(value))
  }

  decrease (value) {
    return this._promote(super.decrease(value))
  }

  addBonus (bonus) {
    return this._promote(super.addBonus(bonus))
  }

  removeBonus (reason) {
    return this._promote(super.removeBonus(reason))
  }

  _promote (ability) {
    const bonuses = ability.bonuses
    bonuses.push(ability._.baseBonus)
    return new SecondaryAbility(ability.name, ability.points, ability.dependency, ability.rate, bonuses, this.category)
  }
}
