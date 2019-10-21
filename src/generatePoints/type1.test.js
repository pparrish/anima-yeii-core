const type1 = require('./type1.js')
/* eslint-env jest */
describe('type 1 generator', () => {
  test('when generate a 8 characteristics i get 8 values', () => {
    const { points } = type1(8)
    expect(points).toHaveLength(8)
  })
  test('when use a generator must recibe a points and history', () => {
    const result = type1(8)
    expect(result).toHaveProperty('points')
    expect(result).toHaveProperty('history')
  })
  test('when genetare 8 characteristics i get 8 history value', () => {
    const { history } = type1(8)
    expect(history).toHaveLength(8)
  })
  test('when generate 8 points all points must have value greather than 3', () => {
    const { points } = type1(8)
    points.map(point => expect(point).toBeGreaterThan(3))
  })
  test('when generate a 8 points alwais have value of 9', () => {
    const { points } = type1(8)
    expect(points).toContain(9)
  })
})
