const {
  heightFromGenerator,
  heightToGenerator,
  weightFromGenerator,
  weightToGenerator
} = require('./sizeHeightWeightGenerators')

const {
  isLessOrEqual,
  isGreaterOrEqual
} = require('../utils/arrayValueComparators')

const table = {
  height: {
    from: [...heightFromGenerator()],
    to: [...heightToGenerator()]
  },
  weight: {
    from: [...weightFromGenerator()],
    to: [...weightToGenerator()]
  }
}

module.exports = (height, weight, size, slim = false) => {
  if (size < 2) throw new Error('the size cant be les than 2')
  if (size >= 22 && slim === false) {
    return {
      height: {
        from: height >= 2.6,
        to: height <= Infinity
      },
      weight: {
        from: weight >= 400,
        to: weight <= Infinity
      }
    }
  }

  const index = size - 2
  const slimIndex = index < 2 ? index : index - 2
  return {
    height: {
      from: isGreaterOrEqual(
        table.height.from,
        slim ? slimIndex : index,
        height),
      to: isLessOrEqual(
        table.height.to,
        index,
        height)
    },
    weight: {
      from: isGreaterOrEqual(
        table.weight.from,
        slim ? slimIndex : index,
        weight),
      to: isLessOrEqual(
        table.weight.to,
        index,
        weight)
    }
  }
}
