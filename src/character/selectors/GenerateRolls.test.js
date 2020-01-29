/* eslint-env jest */
import GenerateRolls from './GenerateRolls'

describe('generate rolls', () => {
  let rollsStore
  let generateRolls
  let generator
  beforeEach(() => {
    rollsStore = {
      type: undefined,
      mode: undefined,
      points: undefined,
      generated: {},
    }
    generator = {
      generate: jest.fn(),
    }
    generator.generate.mockReturnValue({
      type: 'typeTest',
      mode: 'values',
      points: [1, 2, 3, 4, 5],
    })
    generateRolls = new GenerateRolls(
      rollsStore,
      generator
    )
  })

  test('When i select a type, the result store is filled with generator result', () => {
    generateRolls.select(1)
    expect(rollsStore).toMatchInlineSnapshot(`
      Object {
        "generated": Object {
          "1": Object {
            "mode": "values",
            "points": Array [
              1,
              2,
              3,
              4,
              5,
            ],
            "type": "typeTest",
          },
        },
        "mode": "values",
        "points": Array [
          1,
          2,
          3,
          4,
          5,
        ],
        "type": "typeTest",
      }
    `)
  })

  test('when i select de same value twice then the generator is not called', () => {
    generateRolls.select(1)
    generateRolls.select(1)
    expect(
      generator.generate.mock.calls.length
    ).toBe(1)
  })
})
