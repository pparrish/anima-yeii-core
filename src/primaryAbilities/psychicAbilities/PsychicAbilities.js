const Abilities = require('../../abilities/Abilities')
const listOfSupernaturalAbilities = require('./listOfPsychicAbilities')

module.exports = class PsychicAbilities extends Abilities {
  constructor () {
    super(listOfSupernaturalAbilities)
  }
}
