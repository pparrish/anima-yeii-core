module.exports = (characteristicValue) => {
  if (characteristicValue < 4) { return characteristicValue * 10 - 40 }
  if (characteristicValue < 6) { return characteristicValue * 5 - 25 }
  if (characteristicValue < 8) { return 5 }
  if (characteristicValue < 10) { return 10 }
  if (characteristicValue < 11) { return 15 }
  if (characteristicValue < 13) { return 20 }
  if (characteristicValue < 15) { return 25 }
  if (characteristicValue < 16) { return 30 }
  if (characteristicValue < 18) { return 35 }
  if (characteristicValue < 20) { return 40 }
  return (characteristicValue - 20) * 5 + 45
}
