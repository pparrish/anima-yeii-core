import { frobiden } from '../utils/classUtils'

/** Shop represents a shop when can spend in centrain values in a stock and can shop this values to a place * */
export default class ValuesShop {
  constructor() {
    this.stock = []
    this.buyList = {}
  }

  /** Merge the catalog of a product, this replace before products and spends all values than already buyed
   * @param {Array} catalog
   * @returns {ValuesShop} this
   */
  mergeCatalog(catalog) {
    this.stock = [...catalog]
    const beforeBuyList = this.buyList
    this.buyList = {}
    Object.entries(beforeBuyList).map(buyed => {
      if (this.isInStock(buyed[1]))
        this.buy(buyed[0], buyed[1])
      return buyed
    })
    return this
  }

  buy(buyer, product) {
    if (this.buyList[buyer]) {
      this.stock.push(this.buyList[buyer])
      delete this.buyList[buyer]
    }
    if (!this.isInStock(product))
      frobiden(`${product} is not in stock`)
    this.buyList[buyer] = product
    const index = this.stock.indexOf(product)
    this.stock.splice(index, 1)
    return this
  }

  refound(buyer) {
    if (this.buyList[buyer]) {
      this.stock.push(this.buyList[buyer])
      delete this.buyList[buyer]
    }
    return this
  }

  isInStock(product) {
    return !!this.stock.find(
      stockProduct => stockProduct === product
    )
  }
}
