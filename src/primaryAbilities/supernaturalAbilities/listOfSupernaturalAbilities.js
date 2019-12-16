const createList = require('../../utils/createList')
const supernaturalAbility = require('./SupernaturalAbility')
const list = [
  {
    name: 'magic projection',
    dependency: 'dexterity',
    CREATOR: supernaturalAbility
  },
  {
    name: 'summon',
    dependency: 'power',
    CREATOR: supernaturalAbility
  },
  {
    name: 'domination',
    dependency: 'will',
    CREATOR: supernaturalAbility
  },
  {
    name: 'tie',
    dependency: 'power',
    CREATOR: supernaturalAbility
  },
  {
    name: 'unsummon',
    dependency: 'power',
    CREATOR: supernaturalAbility
  }
]
module.exports = createList(list)
