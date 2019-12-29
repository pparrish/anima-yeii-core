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
    const { name, points, dependency, rate, bonuses, category } = options
    return new SecondaryAbility(name, points, dependency, rate, bonuses, category)
  }

  _promote (changes) {
    changes = super._promote(changes)
    return {
      ...changes,
      category: changes.category || this.changes
    }
  }
}
