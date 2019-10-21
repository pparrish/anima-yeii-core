const D10 = require('../dices/d10')
const d10 = new D10()
module.exports = (numberOfCharacteristics) => {
  const numberOfRolls = numberOfCharacteristics - Math.floor(numberOfCharacteristics * 0.14)
  const history = d10.roll(numberOfRolls)
  const points = history.reduce((points, roll) => points + roll, 0)

  return { points, history }
}
