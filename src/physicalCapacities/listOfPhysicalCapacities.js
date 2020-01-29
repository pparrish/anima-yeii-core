const PhysicalCapacity = require('./PhysicalCapacity')
const createList = require('../utils/createList')

const list = [
  {
    name: 'fatigue',
    linkedTo: 'strength',
    CREATOR: PhysicalCapacity,
  },
  {
    name: 'movement type',
    linkedTo: 'agility',
    CREATOR: PhysicalCapacity,
  },
]

module.exports = createList(list)
