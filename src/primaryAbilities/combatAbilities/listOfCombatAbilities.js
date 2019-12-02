const createList = require('../../utils/createList')
const CombatAbility = require('./CombatAbility')
const list = [
  {
    name: 'atack',
    dependency: 'dexterity',
    CREATOR: CombatAbility
  },
  {
    name: 'stop',
    dependency: 'dexterity',
    CREATOR: CombatAbility
  },
  {
    name: 'dodge',
    dependency: 'agility',
    CREATOR: CombatAbility
  },
  {
    name: 'wear armor',
    dependency: 'strength',
    CREATOR: CombatAbility
  }
]

module.exports = createList(list)
