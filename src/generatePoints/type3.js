const D10 = require('../dices/d10')
const d10 = new D10()

module.exports = {
  name: 'type 3',
  type: 'values',
  need: 'values to generate',
  generator: (pointsToGenerate) => {
    const result = d10.roll(pointsToGenerate)
    return {
      points: result,
      history: result
    }
  }
}
