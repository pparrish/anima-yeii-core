/* eslint-env jest */
const generator = require('./type3.js')
describe('type 3 generator', () => {
  test('when use the generator i obtain a points and history', () => {
    const result = generator(8)
    expect(result).toHaveProperty('points')
    expect(result).toHaveProperty('history')
  })

  test('when generate a 8 characteristics i get 8 values', () => {
    const { points } = generator(8)
    expect(points).toHaveLength(8)
  })
  test('when genetare 8 characteristics i get 8 history value', () => {
    const { history } = generator(8)
    expect(history).toHaveLength(8)
  })
})
