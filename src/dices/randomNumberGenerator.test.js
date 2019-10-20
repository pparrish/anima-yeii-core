/* eslint-env jest */
const generator = require('./randomNumberGenerator.js')
describe('randomNumberGenerator', () => {
  test('when i create the generator width 10,/it returns a random number betwen 1 and 10', () => {
    const d10 = generator(10)
    const number = d10.next().value
    expect(number).toBeGreaterThanOrEqual(1)
    expect(number).toBeLessThanOrEqual(10)
  })
  test('when i create the generator width 100 it returns a random number betwen 1 and 100', () => {
    const d100 = generator(100)
    const number = d100.next().value
    expect(number).toBeGreaterThanOrEqual(1)
    expect(number).toBeLessThanOrEqual(100)
  })
})
