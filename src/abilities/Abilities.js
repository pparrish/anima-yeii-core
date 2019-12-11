module.exports = class Abilities {
  constructor (list) {
    this._ = {}
    this._.storage = new Map()
    list.map(ability => {
      this._.storage.set(ability.name, ability)
    })
  }

  get (name) {
    const ability = this._.storage.get(name)
    if (!ability) throw new Error(`the ${name} ability does not exist`)
    return ability
  }

  enhance (name, points) {
    const ability = this._.storage.get(name)
    if (!ability) throw new Error(`the ${name} ability does not exist`)
    this._.storage.set(name, ability.enhance(points))
    return this
  }

  decrease (name, points) {
    const ability = this.get(name)
    this._.storage.set(name, ability.decrease(points))
    return this
  }

  addBonus (bonus) {
    this._.storage.forEach((ability, name) => {
      this._.storage.set(name, ability.addBonus(bonus))
    })
  }

  removeBonus (bonusName) {
    this._.storage.forEach((ability, name) => {
      this._.storage.set(name, ability.removeBonus(bonusName))
    })
  }

  addBonusOf (name, bonus) {
    const ability = this.get(name)
    this._.storage.set(name, ability.addBonus(bonus))
  }

  removeBonusOf (name, bonusName) {
    const ability = this.get(name)
    this._.storage.set(name, ability.removeBonus(bonusName))
  }
}
