/* eslint-env jest */
const type1RollRule = require('./type1RollRule')
describe('type1RollRule', () => {
  test('when recibe a value less than 4 get repeat of true ', () => {
    for (let i = 1; i < 4; i++) {
      const { repeat } = type1RollRule(i)
      expect(repeat).toBeTruthy()
    }
  })
  test('when recibe a value greather than 3 get repeat of false', () => {
    for (let i = 4; i < 11; i++) {
      const { repeat } = type1RollRule(i)
      expect(repeat).toBeFalsy()
    }
  })
})
