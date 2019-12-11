/** Represent a shop
 * @param { Object } productsList - contains product: price of all products of the shop
 */
class Shop {
  constructor (productsList) {
    this._ = {
      productsList: { ...productsList },
      buyList: {}
    }
  }

  /** @param {string} name - the name of product must be in a product list
   * @param { number } quantity - number of products to buy
   * @returns {number} the total cost of operation
   */
  spend (name, quantity) {
    if (!(name in this._.productsList)) throw new Error(`${name} is not a product`)
    if (quantity <= 0) throw new Error('the quantity must be a number greatest than 0')
    if (!this._.buyList[name]) this._.buyList[name] = 0
    this._.buyList[name] += quantity
    return quantity * this._.productsList[name]
  }

  /** @param {string} name - the name of product in the product list
   * @param {number} quantity - the number of products to refound
   * @returns  {number } the total amount to refund.
   */
  refound (name, quantity) {
    if (!(name in this._.productsList)) throw new Error(`${name} is not a product`)
    if (quantity <= 0) throw new Error('the quantity must be a number greatest than 0')
    if (!this._.buyList[name]) throw new Error('the product ' + name + ' is not in the buyList')
    const beforeQuantity = this._.buyList[name]
    const balance = this._.buyList[name] - quantity
    if (balance < 0) throw new Error('Only have buyed ' + this._.buyList[name])
    if (balance === 0) delete this._.buyList[name]
    else this._.buyList[name] = balance
    return (beforeQuantity - balance) * this._.productsList[name]
  }

  get catalog () {
    return { ...this._.productsList }
  }

  set catalog (_) {
    throw new Error('the catalog is read only, use mergeCatalog')
  }

  mergeCatalog (catalog) {
    const beforeBalance = this.balance
    this._.productsList = { ...this._.productsList, ...catalog }
    return this.balance - beforeBalance
  }

  get productsList () {
    return Object.keys(this._.productsList)
  }

  set productsList (_) {
    throw new Error('product list is read only, use mergeCatalog')
  }

  productPrice (name) {
    if (!(name in this._.productsList)) throw new Error(`${name} is not a product`)
    return this._.productsList[name]
  }

  get balance () {
    return Object.keys(this._.buyList).reduce((total, actual) => total + this.balanceOf(actual), 0)
  }

  set balance (_) {
    throw new Error('balance is read only')
  }

  balanceOf (name) {
    if (!(name in this._.productsList)) throw new Error(`${name} is not a product`)
    return (this._.buyList[name] || 0) * this._.productsList[name]
  }

  get buyList () {
    return { ...this._.buyList }
  }

  set buyList (_) {
    throw new Error('buy list is read only')
  }

  get balanceList () {
    return Object.keys(this._.buyList).reduce((balanceList, actual) => {
      return {
        ...balanceList,
        [actual]: this.balanceOf(actual)
      }
    }, {})
  }
}

module.exports = Shop
