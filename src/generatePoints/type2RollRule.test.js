/* eslint-env jest */
const rule = require('./type2RollRule')
describe('type2RollRule', () => {
  test('when i get a value with a no history i return repeat of true', () => {
    const { repeat } = rule(5, [])
    expect(repeat).toBeTruthy()
  })
  test('when i get a value width a one history retyrn repeat of false', () => {
    const { repeat } = rule(5, [5])
    expect(repeat).toBeFalsy()
  })
  test('when i get first value of 5 and second of 6 i return result of 6', () => {
    const { result } = rule(5, [6])
    expect(result).toBe(6)
  })
  test('when i get first value of 6 and second of 5, i return result of 6', () => {
    const { result } = rule(6, [5])
    expect(result).toBe(6)
  })
})
