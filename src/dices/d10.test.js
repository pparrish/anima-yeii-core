const D10 = require('./d10.js')
/* eslint-env jest */
describe('d10', () => {
  const d10 = new D10()
  test('when roll a d10 return value betwen 1 and 10', () => {
    const result = d10.roll()
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(10)
  })
  test('when roll 10 dices the 10 dices have 10 results', () => {
    const results = d10.roll(10)
    expect(results).toHaveLength(10)
  })
})
