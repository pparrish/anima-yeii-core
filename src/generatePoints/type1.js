const Dice = require('../dices/d10')
const type1RollRule = require('./type1RollRule')
const dice = new Dice()

module.exports = (numberOfCharacteristics) => {
  const points = []
  const history = []
  for (let i = 0; i < numberOfCharacteristics; i++) {
    const result = dice.rollWidthRule(type1RollRule)
    points.push(result.pop())
    history.push(result)
  }
  return { points, history }
}
