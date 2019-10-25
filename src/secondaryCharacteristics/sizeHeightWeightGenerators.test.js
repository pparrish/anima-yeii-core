/* eslint-env jest */
const {
  sizeGenerator,
  heightToGenerator,
  heightFromGenerator,
  weightToGenerator,
  weightFromGenerator
} = require('./sizeHeightWeightGenerators')

describe('Size generator', () => {
  const values = [...sizeGenerator()]
  test('the first value of generator must be 2', () => {
    expect(values[0]).toBe(2)
  })
  test('the last value must be 21', () => {
    expect(values[values.length - 1]).toBe(21)
  })
  test('the number of values is 20', () => {
    expect(values.length).toBe(20)
  })
})
describe('height from Generator', () => {
  const values = [...heightFromGenerator()]
  test('first value must be .20', () => {
    expect(values[0]).toBe(0.20)
  })
  test('last value muest be 2.1', () => {
    expect(values[values.length - 1]).toBeCloseTo(2.1)
  })
})
describe('height to Generator', () => {
  const values = [...heightToGenerator()]
  test('first value must be 0.6', () => {
    expect(values[0]).toBeCloseTo(0.6)
  })
  test('las value must be 2.6', () => {
    expect(values[values.length - 1]).toBeCloseTo(2.6)
  })
})
describe('weight from Generator', () => {
  const values = [...weightFromGenerator()]
  test('fist value must be 5', () => {
    expect(values[0]).toBe(5)
  })
  test('last value must be 120', () => {
    expect(values[values.length - 1]).toBe(120)
  })
  test('the 11st value must be 50', () => {
    expect(values[10]).toBe(50)
  })
  test('the 5st value must be 30', () => {
    expect(values[4]).toBe(30)
  })
  test('the 8st value must be 30', () => {
    expect(values[7]).toBe(40)
  })
})
describe('wheight to generator', () => {
  const values = [...weightToGenerator()]
  test('first value must be 15', () => {
    expect(values[0]).toBe(15)
  })
  test('last value must be 450', () => {
    expect(values[values.length - 1]).toBe(450)
  })
})
