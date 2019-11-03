/* eslint-env jest */
const heightWeightSizeCheck = require('./heightWeightSupportsSizeCheck')

describe('height weight size check', () => {
  test('when i have size 2 and i have 0.2 height and 5 wheight pass all', () => {
    const result = heightWeightSizeCheck(0.2, 5, 2)
    expect(result).toMatchInlineSnapshot(`
      Object {
        "height": Object {
          "from": true,
          "to": true,
        },
        "weight": Object {
          "from": true,
          "to": true,
        },
      }
    `)
  })
  test('when i have 22 size and i have 2.6 and 400 pass all', () => {
    const result = heightWeightSizeCheck(2.6, 400, 22)
    expect(result).toMatchInlineSnapshot(`
      Object {
        "height": Object {
          "from": true,
          "to": true,
        },
        "weight": Object {
          "from": true,
          "to": true,
        },
      }
    `)
  })
  test('when i have 21 size and i have 2.1 and 120 pass all', () => {
    const result = heightWeightSizeCheck(2.6, 400, 22)
    expect(result).toMatchInlineSnapshot(`
      Object {
        "height": Object {
          "from": true,
          "to": true,
        },
        "weight": Object {
          "from": true,
          "to": true,
        },
      }
    `)
  })
})
