/* eslint-env jest */
const Characteristic = require('./characteristic')
describe('Characteristic', () => {
  test('A characteristic must have a name', () => {
    const c = new Characteristic('dexterity', 10)
    expect(c).toHaveProperty('name')
  })
  test('A characteristic must have a value', () => {
    const c = new Characteristic('dexterity', 10)
    expect(c).toHaveProperty('value')
  })
  test('A characteristic must have a bonus value', () => {
    const c = new Characteristic('dexterity', 10)
    expect(c).toHaveProperty('bonusValue')
  })
  test('name is read only', () => {
    const c = new Characteristic('dexterity', 10)
    expect(() => { c.name = 'no' }).toThrow()
  })
  test('value is read only', () => {
    const c = new Characteristic('dexterity', 10)
    expect(() => { c.value = 'no' }).toThrow()
  })
  test('bonusValue is read only', () => {
    const c = new Characteristic('dexterity', 10)
    expect(() => { c.bonusValue = 'no' }).toThrow()
  })
})
