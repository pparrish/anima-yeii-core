/** A table with the pd based on level
 * @module src/developmentPoints/developmentPointsTable
 */
const getDevelopmentPointsByLevel = level => {
  let base = 400
  if (level >= 1) base += 200
  return base + ((level - 1) * 100)
}

module.exports = {
  table: new Map(),
  /** Get the development points based on levels
 * @param {number} level - A positive number
 * @returns {number} Value of development points
 */
  get (level) {
    if (!this.table.get(level)) this.table.set(level, getDevelopmentPointsByLevel(level))
    return this.table.get(level)
  }
}
