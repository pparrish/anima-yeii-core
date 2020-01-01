const PhysicalCapacity = require('./PhysicalCapacity')
const createList = require('../utils/createList')
const list = [
  {
    name: 'fatigue',
    linkedTo: 'characteristics/strength',
    CREATOR: PhysicalCapacity
  },
  {
    name: 'movement type',
    linkedTo: 'characteristics/agility',
    CREATOR: PhysicalCapacity
  }
]

module.exports = createList(list)
