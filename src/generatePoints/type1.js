const Dice = require('../dices/d10')
const type1RollRule = require('./type1RollRule')
const dice = new Dice()
const generatePointsWith = require('./generatePointsWith')

module.exports = {
  name: 'type 1',
  type: 'values',
  need: 'values to generate',
  generator: (numberOfCharacteristics) => {
    const { points, history } = generatePointsWith(dice, type1RollRule, numberOfCharacteristics)

    // replace the minimun value width 9
    const minimunPoint = points.reduce((minimun, actual) => (minimun < actual) ? minimun : actual, Infinity)

    const minimunPointIndex = points.indexOf(minimunPoint)

    points[minimunPointIndex] = 9

    return { points, history, replaced: minimunPoint, replacedIndex: minimunPointIndex }
  }
}
