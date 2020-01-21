import type1 from './type1'
import type2 from './type2'
import type3 from './type3'
import type4 from './type4'
import type5 from './type5'

// TODO must be outside of this class
const GENERATORS = [
  type1,
  type2,
  type3,
  type4,
  type5,
]

/** Generator of rolls results
 * @param {number} valuesToGenerate - Number of values with the generators work
 * @param {number} pointsToGenerate - Points to be used in generators of points
 */
export default class RollsGenerator {
  constructor(
    valuesToGenerate,
    pointsToGenerate
  ) {
    this.valuesToGenerate = valuesToGenerate
    this.pointsToGenerate = pointsToGenerate
    this.generators = GENERATORS
  }

  /** Generate a result of giben type
   * @param {number | string} type
   * @returns {object} result of the generator
   */
  generate(type) {
    const generator = this.getGenerator(type)
    const neededValue =
      generator.need === 'values to generate'
        ? this.valuesToGenerate
        : generator.need === 'points to generate'
        ? this.pointsToGenerate
        : undefined

    const result = generator.generator(
      neededValue
    )

    return {
      ...result,
      type: generator.name,
      mode: generator.type,
      points: result.points,
    }
  }

  getGenerator(nameOrNumber) {
    if (typeof nameOrNumber === 'number')
      return this.generators[nameOrNumber - 1]
    if (typeof nameOrNumber === 'string')
      return this.generators.find(
        x => x.name === nameOrNumber
      )
    return this
  }
}
