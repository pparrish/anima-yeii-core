module.exports = (result, history) => {
  if (history.length === 0) {
    return {
      result,
      repeat: true
    }
  }
  return {
    result: result > history[0] ? result : history[0],
    repeat: false
  }
}
