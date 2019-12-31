
module.exports = class ValuesShop {
  constructor (valuesList) {
    this._ = {
      productsList: {},
      buyList: {}
    }
    valuesList.map(value => {
      if (!this._.productsList[value]) this._.productsList[value] = 0
      this._.productsList[value]++
    })
  }

  spend (value) {
    if (this._.productsList[value] === 0) throw new Error('the ' + value + ' product is not in the catalog')
    if (!this._.productsList[value]) throw new Error('the ' + value + ' product does not exist')
    if (!this._.buyList[value]) this._.buyList[value] = 0
    this._.buyList[value]++
    return this
  }

  refound (value) {
    if (!this._.productsList[value]) throw new Error('the ' + value + ' product does not exist')
    if (!this._.buyList[value]) throw new Error('the product ' + value + ' is not in the buyList')
    this._.buyList[value]--
    return this
  }

  get catalog () {
    const catalog = Object.keys(this._.productsList).reduce((catalog, product) => {
      for (let i = 0; i < this._.productsList[product]; i++) catalog.push(parseInt(product))
      return catalog
    }, [])
    return catalog
  }

  get buyList () {
    return { ...this._.buyList }
  }

  get greatestInStock () {
    const greatest = Object.keys(this._.productsList).reduce((greatest, actual) => {
      if (this._.productsList[actual] === 0) return greatest
      actual = parseInt(actual)
      return greatest > actual ? greatest : actual
    }, -Infinity)
    return greatest === -Infinity ? null : greatest
  }

  get smalestInStock () {
    const smalest = Object.keys(this._.productsList).reduce((smalest, actual) => {
      if (this._.productsList[actual] === 0) return smalest
      actual = parseInt(actual)
      return smalest < actual ? smalest : actual
    }, Infinity)
    return smalest === Infinity ? null : smalest
  }
}
