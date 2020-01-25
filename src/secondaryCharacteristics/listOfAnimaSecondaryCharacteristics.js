const createList = require('../utils/createList')
const SecondaryCharacteristic = require('./SecondaryCharacteristic')

const list = [
  {
    name: 'appearance',
    linkedTo: 'D10 unselected',
    CREATOR: SecondaryCharacteristic,
  },
  {
    name: 'size',
    linkedTo: 'strength physique add',
    CREATOR: SecondaryCharacteristic,
  },
]

module.exports = createList(list)
