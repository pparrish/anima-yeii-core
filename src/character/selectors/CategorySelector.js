import RulesHandler from '../../rulesHandler/RulesHandler'
import { frobiden } from '../../utils/classUtils'

export default class CategorySelector {
  constructor(storage, categories) {
    this.rules = new RulesHandler()
    // TODO categories is now a array, whe need wrap this to a collection maibe. Or a storage interface
    this.categories = categories
    this.storage = storage
  }

  select(name) {
    const { name: aName } = this.rules.applyRules(
      { name },
      'category',
      'select',
      name,
      this
    )
    const selected = this.categories.find(
      category => category.name === name
    )
    if (!selected)
      frobiden(`${name} category is not fount`)
    // Dont change the reference of storage
    this.storage.name = selected.name
    this.storage.archetype = selected.archetype
    this.storage.limits = selected.limits
    this.storage.abilitiesCosts =
      selected.abilitiesCosts

    this.rules.applyRules(
      { category: selected },
      'category',
      'selected',
      aName,
      this
    )
    return this
  }
}
