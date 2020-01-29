import { required } from '../../utils/classUtils'
import RulesHandler from '../../rulesHandler/RulesHandler'
/** Represents a generator of rolls for characteristic points
 * @param {Object} IResultsStore - Store for the history of results
 * @param {string} IResultsStore.type - The type of generator of the actual selection
 * @param {string} IResultsStore.mode - The actual selected roll mode in the store
 * @param {number | number[]} IResultsStore.points - The points generated by the actual selection
 * @param {Object} IResultsStore.generated - Store all already generated results
 * @param {Object} IRollsGenerator - A generator to get the results
 * @param {function} IRollsGenerator.generate - A function than recibe a type of roll to generate and returns the result
 */
export default class GenerateRolls {
  constructor(IResultsStore, IRollsGenerator) {
    this.store = IResultsStore
    this.generator = IRollsGenerator
    this.rules = new RulesHandler()
  }

  /** Select a roll type the selected roll generated values is stored in result store
   * @param {number} type - the number type of the generator
   * @returns {GenerateRolls} this
   */
  select(type = required('type')) {
    this.rules.apply(
      'select',
      { type },
      this.store
    )
    let result = this.store.generated[type]
    if (!result) {
      result = this.generator.generate(type)
      this.store.generated[type] = result
    }
    this.store.mode = result.mode
    this.store.type = result.type
    this.store.points = result.points
    this.rules.apply(
      'selected',
      { result },
      this.store
    )
    return this
  }
}
