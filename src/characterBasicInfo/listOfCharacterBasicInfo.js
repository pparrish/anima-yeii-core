const createList = require('../utils/createList')
const BasicInfo = require('./BasicInfo')

const list = [
  {
    name: 'name',
    value: '',
    CREATOR: BasicInfo
  },
  {
    name: 'description',
    value: '',
    CREATOR: BasicInfo
  },
  {
    name: 'personality',
    value: '',
    CREATOR: BasicInfo
  },
  {
    name: 'lore',
    value: '',
    CREATOR: BasicInfo
  },
  {
    name: 'slim',
    value: false,
    CREATOR: BasicInfo
  },
  {
    name: 'age',
    value: 0,
    CREATOR: BasicInfo
  },
  {
    name: 'race',
    value: '',
    CREATOR: BasicInfo
  },
  {
    name: 'weight',
    value: 0,
    CREATOR: BasicInfo
  },
  {
    name: 'height',
    value: 0,
    CREATOR: BasicInfo
  },
  {
    name: 'level',
    value: 0,
    CREATOR: BasicInfo
  }
]

module.exports = createList(list)
