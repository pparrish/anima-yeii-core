const createList = require('../utils/createList')
const SecondaryCharacteristic = require('./SecondaryCharacteristic')
const list = [
  {
    name: 'appearance',
    CREATOR: SecondaryCharacteristic
  },
  {
    name: 'size',
    CREATOR: SecondaryCharacteristic
  }
]

module.exports = createList(list)
