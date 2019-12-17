const createList = require('../../utils/createList')
const PsychicAbility = require('./PsychicAbility')
const list = [
  {
    name: 'psychic projection',
    dependency: 'dexterity',
    CREATOR: PsychicAbility
  }
]

module.exports = createList(list)
