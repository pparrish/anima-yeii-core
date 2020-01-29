const createList = require('../../utils/createList')
const CombatAbility = require('./CombatAbility')

const list = [
  {
    name: 'attack',
    dependency: 'dexterity',
    CREATOR: CombatAbility,
  },
  {
    name: 'stop',
    dependency: 'dexterity',
    CREATOR: CombatAbility,
  },
  {
    name: 'dodge',
    dependency: 'agility',
    CREATOR: CombatAbility,
  },
  {
    name: 'wear armor',
    dependency: 'strength',
    CREATOR: CombatAbility,
  },
  {
    name: 'ki',
    CREATOR: CombatAbility,
  },
  {
    name: 'acumulation multiplied',
    CREATOR: CombatAbility,
  },
]

module.exports = createList(list)
