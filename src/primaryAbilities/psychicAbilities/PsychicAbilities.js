const Abilities = require('../../abilities/Abilities')
const listOfSupernaturalAbilities = require('./listOfPsychicAbilities')

module.exports = class PsysicAbilities extends Abilities {
  constructor () {
    super(listOfSupernaturalAbilities)
  }
}
