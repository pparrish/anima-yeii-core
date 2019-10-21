const D10 = require('../dices/d10')
const d10 = new D10()

module.exports = (pointsToGenerate) => {
  const result = d10.roll(pointsToGenerate)
  return {
    points: result,
    history: result
  }
}
