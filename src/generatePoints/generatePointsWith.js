module.exports = (dice, rule, numberOfCharacteristics) => {
  const points = []
  const history = []
  for (let i = 0; i < numberOfCharacteristics; i++) {
    const result = dice.rollWidthRule(rule)
    points.push(result[result.length - 1])
    history.push(result)
  }
  return { points, history }
}
