import RulesHandler from '../../rulesHandler/RulesHandler'

export default class CharacteristicsSelector {
  constructor(ICharacteristicsCollection, IShop) {
    this.rules = new RulesHandler()
    this.characteristics = ICharacteristicsCollection
    this.shop = IShop
  }

  select(name, value) {
    const toSpend = this.rules.applyRules(
      value,
      'pointsShop',
      'buy',
      name,
      this
    )
    const toSet = this.rules.applyRules(
      value,
      'characteristics',
      'set',
      name,
      this
    )
    this.characteristics.set(name, toSet)
    this.shop.buy(name, toSpend)

    this.rules.applyRules(
      toSpend,
      'pointsShop',
      'buyed',
      name,
      this
    )
    this.rules.applyRules(
      toSet,
      'characteristics',
      'setted',
      name,
      this
    )
  }

  discard(name) {
    const toSet = this.rules.applyRules(
      0,
      'characteristics',
      'set',
      name,
      this
    )
    const toRefound = this.rules.applyRules(
      this.shop.buyList[name],
      'pointsShop',
      'refound',
      name,
      this
    )

    this.characteristics.set(name, toSet)
    this.shop.refound(name, toRefound)

    this.rules.applyRules(
      toSet,
      'characteristics',
      'setted',
      name,
      this
    )
    this.rules.applyRules(
      toRefound,
      'pointsShop',
      'refounded',
      name,
      this
    )
    return this
  }
}
