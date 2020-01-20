import categories from '../categories'

export default class CategorySelector {
  constructor(IShopCatalog) {
    this.shop = IShopCatalog
    this.categories = categories
  }

  select(name) {
    const category = this.categories.find(
      cat => cat.name === name
    )
    if (!category)
      throw new Error(
        'the category does not exist'
      )
    this._selected = category
    this.shop.mergeCatalog(
      category.abilitiesCosts
    )
    return this
  }

  get selected() {
    return this._selected
  }

  get isAlreadySelected() {
    return !!this._selected
  }
}
