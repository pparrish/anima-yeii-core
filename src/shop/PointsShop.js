import { frobiden } from '../utils/classUtils'

export default class PointsShop {
  constructor() {
    this.stock = 0
    this.buyList = {}
  }

  mergeCatalog(points) {
    this.stock = points
    return this
  }

  buy(buyer, points) {
    const stock = this.stock - points
    if (stock < 0)
      frobiden(
        `${buyer} try to buy ${points} points but only have ${this.stock} points `
      )
    if (!this.buyList[buyer])
      this.buyList[buyer] = 0
    this.stock = stock
    this.buyList[buyer] += points
    return this
  }

  refound(buyer, points) {
    if (this.buyList[buyer]) {
      const value = this.buyList[buyer]
      let toRefound = points
      if (value - points < 0)
        toRefound += value - points
      this.buyList[buyer] -= toRefound
      if (this.buyList[buyer] === 0)
        delete this.buyList[buyer]
      this.stock += toRefound
    }
  }
}
