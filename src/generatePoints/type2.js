const Dice = require('../dices/d10')
const type1RollRule = require('./type2RollRule')
const dice = new Dice()
const generatePointsWith = require('./generatePointsWith')

module.exports = {
  name: 'type 2',
  type: 'values',
  need: 'values to generate',
  generator: (numberOfCharacteristics) => generatePointsWith(dice, type1RollRule, numberOfCharacteristics)
}
