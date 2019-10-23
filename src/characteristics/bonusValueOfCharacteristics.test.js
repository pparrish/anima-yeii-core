/* eslint-env jest */
const bonuValueOfCharacteristics = require('./bonusValueOfCharacteristics')
describe('Bonus value of characteristics', () => {
  test('when recibe the value of 1 return -30', () => {
    expect(bonuValueOfCharacteristics(1)).toBe(-30)
  })
  test('when recibe 2 return -20', () => {
    expect(bonuValueOfCharacteristics(2)).toBe(-20)
  })
  test('when recibe 3 return -10', () => {
    expect(bonuValueOfCharacteristics(3)).toBe(-10)
  })
  test('(when recibe 4 return -5', () => {
    expect(bonuValueOfCharacteristics(4)).toBe(-5)
  })
  test('when recibe 5 return 0', () => {
    expect(bonuValueOfCharacteristics(5)).toBe(0)
  })
  test('when recibe 6 return 5', () => {
    expect(bonuValueOfCharacteristics(6)).toBe(5)
  })
  test('when recibe 8 return 10', () => {
    expect(bonuValueOfCharacteristics(8)).toBe(10)
  })
  test('test all table values', () => {
    const allTableValues = []
    for (let i = -1; i < 25; i++) {
      allTableValues[i] = bonuValueOfCharacteristics(i)
    }
    expect(allTableValues).toMatchInlineSnapshot(`
      Array [
        -40,
        -30,
        -20,
        -10,
        -5,
        0,
        5,
        5,
        10,
        10,
        15,
        20,
        20,
        25,
        25,
        30,
        35,
        35,
        40,
        40,
        45,
        50,
        55,
        60,
        65,
      ]
    `)
  })
})
