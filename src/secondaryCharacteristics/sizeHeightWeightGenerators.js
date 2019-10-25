function * heightFromGenerator () {
  let base = 0
  for (let size = 2; size < 22; size++) {
    if (size < 7) {
      base += 0.2
      yield base
    }
    if ((size > 6 && size < 11) || size > 18) {
      base += 0.1
      yield base
    }
    if (size > 10 && size < 19) {
      if (size % 2 === 0) {
        base += 0.1
      }
      yield base
    }
  }
}

function * heightToGenerator () {
  let base = 0.6
  for (let size = 2; size < 22; size++) {
    if (size === 4) base += 0.4
    if (size > 4 && size < 7) base += 0.2
    if (size > 6 && size < 9) base += 0.1
    if (size > 9 && size < 12) base += 0.1
    if (size > 13 && size < 17) base += 0.1
    if (size >= 18 && size <= 20) base += 0.1
    if (size >= 21) base += +0.2
    yield base
  }
}

function * weightFromGenerator () {
  let base = 0
  for (let size = 2; size < 22; size++) {
    if (size <= 3) base += 5
    if (size >= 4 && size <= 7) base = (size % 2 === 0) ? base + 10 : base
    if (size === 8 || size === 9) base += 5
    if (size === 11) base += 10
    if (size >= 15) base += 10
    yield base
  }
}

function * weightToGenerator () {
  let base = 15
  for (let size = 2; size < 22; size++) {
    if (size === 3) base += 5
    if (size === 4 || size === 14) base += 10
    if (size === 5) base += 20
    if (size >= 7 && size <= 11) base += 10
    if (size >= 12 && size <= 13) base += 20
    if (size === 15) base += 30
    if (size === 16 || size === 20) base += 40
    if (size >= 17 && size <= 19) base += 20
    if (size >= 21) base += 130
    yield base
  }
}

function * sizeGenerator () {
  for (let size = 2; size < 22; size++) {
    yield size
  }
}

module.exports = {
  heightFromGenerator,
  heightToGenerator,
  weightFromGenerator,
  weightToGenerator,
  sizeGenerator
}
