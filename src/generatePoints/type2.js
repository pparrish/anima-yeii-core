const Dice = require('../dices/d10')
const type1RollRule = require('./type2RollRule')
const dice = new Dice()
const generatePointsWith = require('./generatePointsWith')

module.exports = (numberOfCharacteristics) => generatePointsWith(dice, type1RollRule, numberOfCharacteristics)
