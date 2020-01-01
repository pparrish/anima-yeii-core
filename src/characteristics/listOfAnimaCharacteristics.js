const createList = require('../utils/createList')
const Characteristic = require('./characteristic')
const list = [
  {
    name: 'strength',
    CREATOR: Characteristic
  },
  {
    name: 'dexterity',
    CREATOR: Characteristic
  },
  {
    name: 'agility',
    CREATOR: Characteristic
  },
  {
    name: 'physique',
    CREATOR: Characteristic
  },
  {
    name: 'inteligence',
    CREATOR: Characteristic
  },
  {
    name: 'power',
    CREATOR: Characteristic
  },
  {
    name: 'will',
    CREATOR: Characteristic
  },
  {
    name: 'perception',
    CREATOR: Characteristic
  }
]
module.exports = createList(list)
