module.exports = (array, index, value, fnComparator) => {
  const indexValue = array[index]
  return fnComparator(indexValue, value, index, array)
}
