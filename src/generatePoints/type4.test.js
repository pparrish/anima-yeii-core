/* eslint-env jest */
const generator = require('./type4')
describe('type 4 point generator', () => {
  test('when use a generator with 8 i have points value between 7 and 70', () => {
    const { points } = generator(7)
    expect(points).toBeGreaterThanOrEqual(8)
    expect(points).toBeLessThanOrEqual(70)
  })
  test('when use a generator of 8 i have a 7 values in history', () => {
    const { history } = generator(8)
    expect(history).toHaveLength(7)
  })
})
