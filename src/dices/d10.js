const generator = require('./randomNumberGenerator.js')
class D10 {
  constructor () {
    this.generator = generator(10)
  }

  roll (times = 1) {
    const results = []
    for (let i = 0; i < times; i++) {
      results.push(this.generator.next().value)
    }
    if (times === 1) {
      return results[0]
    }
    return results
  }
}

module.exports = D10
