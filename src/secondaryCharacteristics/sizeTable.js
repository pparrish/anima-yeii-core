const {
  heightFromGenerator,
  heightToGenerator,
  weightFromGenerator,
  weightToGenerator,
  sizeGenerator
} = require('./sizeHeightWeightGenerators')

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

let mapedTable = new Map()

const sizes = sizeGenerator()

const fillMapedTable = (g, m) => {
  const s = [...g]
  s.map((si, index) => m.set(si, {
    height: {
      from: table.height.from[index],
      to: table.height.to[index]
    },
    weight: {
      from: table.weight.from[index],
      to: table.weight.to[index]
    }
  }))
  return m
}

mapedTable = fillMapedTable(sizes, mapedTable)

module.exports = {
  table,
  mapedTable,
  height: {
    from: {
      value (size, slim = false) {
        return mapedTable.get(size >= 4 && slim
          ? size - 2
          : size < 4 && slim
            ? 2 : size).height.from
      },
      check (size, height, slim = false) {
        const min = this.value(size, slim)
        return height >= min
      }
    },
    to: {
      value (size) {
        return mapedTable.get(size).height.to
      },
      check (size, height) {
        const max = this.value(size)
        return height <= max
      }
    }
  },
  weight: {
    from: {
      value (size, slim = false) {
        return mapedTable.get(size >= 4 && slim
          ? size - 2
          : size < 4 && slim
            ? 2 : size).weight.from
      },
      check (size, weight, slim = false) {
        const min = this.value(size, slim)
        return weight >= min
      }
    },
    to: {
      value (size) {
        return mapedTable.get(size).weight.to
      },
      check (size, weight) {
        const max = this.value(size)
        return weight <= max
      }
    }
  }
}
