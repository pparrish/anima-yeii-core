const Dice = require('../dices/d10')
const type1RollRule = require('./type1RollRule')
const dice = new Dice()
const generatePointsWith = require('./generatePointsWith')

module.exports = (numberOfCharacteristics) => {
  /* const points = []
  const history = []
  for (let i = 0; i < numberOfCharacteristics; i++) {
    const result = dice.rollWidthRule(type1RollRule)
    points.push(result[result.length - 1])
    history.push(result)
  } */

  const { points, history } = generatePointsWith(dice, type1RollRule, numberOfCharacteristics)

  // replace the minimun value width 9
  const minimunPoint = points.reduce((minimun, actual) => (minimun < actual) ? minimun : actual, Infinity)

  const minimunPointIndex = points.indexOf(minimunPoint)

  points[minimunPointIndex] = 9

  return { points, history, replaced: minimunPoint, replacedIndex: minimunPointIndex }
}
