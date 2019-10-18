/* eslint-env jest */
const list = require('./listOfAnimaCharacteristics.js')
describe('listOfAnimaCharacteristics', () => {
  test('have a strength value', () => {
    expect(list).toContain('strength')
  })
  test('have a dexterity value', () => {
    expect(list).toContain('dexterity')
  })
  test('have a agility value', () => {
    expect(list).toContain('agility')
  })
  test('have a physique value', () => {
    expect(list).toContain('physique')
  })
  test('have a inteligence value', () => {
    expect(list).toContain('inteligence')
  })
  test('have a power value', () => {
    expect(list).toContain('power')
  })
  test('have a will value', () => {
    expect(list).toContain('will')
  })
  test('hace a perception value', () => {
    expect(list).toContain('perception')
  })
  test('have a 8 characteristics', () => {
    expect(list.length).toBe(8)
  })
})
