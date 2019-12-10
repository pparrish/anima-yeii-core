const Abilities = require('../../abilities/Abilities')
const listOfCombatAbilities = require('./listOfCombatAbilities')
module.exports = class CombatAbilities extends Abilities {
  constructor() {
    super(listOfCombatAbilities)
  }
}

