const getDevelopmentPointsByLevel = level => {
  let base = 400
  if (level >= 1) base += 200
  return base + ((level - 1) * 100)
}

module.exports = {
  table: new Map(),
  get (level) {
    if (!this.table.get(level)) this.table.set(level, getDevelopmentPointsByLevel(level))
    return this.table.get(level)
  }
}
