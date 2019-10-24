/* eslint-env jest */
const Characteristics = require('./characteristics')
const Characteristic = require('./characteristic')
describe('Characteristics', () => {
  const c = new Characteristics(['a', 'b', 'c'], [5, 1, 2])
  test('when i call get with a characteristic name then i get a characteristic', () => {
    expect(c.get('a') instanceof Characteristic).toBe(true)
  })
  test('when i call valueOf "a" i get 5', () => {
    expect(c.valueOf('a')).toBe(5)
  })
  test('when i call bonusValueOf "a" i get 0', () => {
    expect(c.bonusValueOf('a')).toBe(0)
  })
})
