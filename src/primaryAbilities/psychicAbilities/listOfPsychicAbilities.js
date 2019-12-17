const createList = require('../../utils/createList')
const PsychicAbility = require('./PsychicAbility')
const list = [
  {
    name: 'psychic proyection',
    dependency: 'dexterity',
    CREATOR: PsychicAbility
  }
]

module.exports = createList(list)
