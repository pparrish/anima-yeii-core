const compareWihtIndex = require('./compareWithIndex')

const isLessOrEqual = (array, index, value) => compareWihtIndex(array, index, value, (indexValue, value) => value <= indexValue)

const isGreaterOrEqual = (array, index, value) => compareWihtIndex(
  array, index, value,
  (indexValue, value) => value >= indexValue)

module.exports = {
  isLessOrEqual,
  isGreaterOrEqual
}
