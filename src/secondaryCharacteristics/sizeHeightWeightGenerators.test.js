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
  test('Must have 21 values', () => {
    expect(values.length).toBe(21)
  })
  test('the first value of generator must be 2', () => {
    expect(values[0]).toBe(2)
  })
  test('the last value must be 22', () => {
    expect(values[values.length - 1]).toBe(22)
  })
})
describe('height from Generator', () => {
  const values = [...heightFromGenerator()]
  test('must have 21 values', () => {
    expect(values.length).toBe(21)
  })
  test('first value must be 20', () => {
    expect(values[0]).toBe(20)
  })
  test('penultimate value muest be 210', () => {
    expect(values[values.length - 2]).toBeCloseTo(210)
  })
  test('last value muest be 250', () => {
    expect(values[values.length - 1]).toBeCloseTo(250)
  })
})
describe('height to Generator', () => {
  test('must have 21 values', () => {
    expect(values.length).toBe(21)
  })
  const values = [...heightToGenerator()]
  test('first value must be 60', () => {
    expect(values[0]).toBe(60)
  })
  test('penultimate value must be 260', () => {
    expect(values[values.length - 2]).toBe(260)
  })
  test('last value must be Infinity', () => {
    expect(values[values.length - 1]).toBe(Infinity)
  })
})
describe('weight from Generator', () => {
  test('must have 21 values', () => {
    expect(values.length).toBe(21)
  })
  const values = [...weightFromGenerator()]
  test('fist value must be 5', () => {
    expect(values[0]).toBe(5)
  })
  test('penultimate value must be 120', () => {
    expect(values[values.length - 2]).toBe(120)
  })
  test('last value must be 400', () => {
    expect(values[values.length - 1]).toBe(400)
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
  test('must have 21 values', () => {
    expect(values.length).toBe(21)
  })
  const values = [...weightToGenerator()]
  test('first value must be 15', () => {
    expect(values[0]).toBe(15)
  })
  test('last value must be 450', () => {
    expect(values[values.length - 2]).toBe(450)
  })
  test('last value must be 450', () => {
    expect(values[values.length - 1]).toBe(Infinity)
  })
})
