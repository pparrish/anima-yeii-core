const Abilities = require('../abilities/Abilities')
const listOfSecondaryAbilities = require('./listOfSecondaryAbilities')
/** A collection of SecondaryAbilities
 */
module.exports = class SecondaryAbilities extends Abilities {
  constructor () {
    super(listOfSecondaryAbilities)
  }
}
