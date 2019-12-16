const Abilities = require('../../abilities/Abilities')
const listOfSupernaturalAbilities = require('./listOfSupernaturalAbilities')

module.exports = class SupernaturalAbilities extends Abilities {
  constructor () {
    super(listOfSupernaturalAbilities)
  }
}
