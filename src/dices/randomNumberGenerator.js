module.exports = function * (maxNumber) {
  while (true) {
    yield Math.floor(Math.random() * maxNumber + 1)
  }
}
