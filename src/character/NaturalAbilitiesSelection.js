module.exports = class NaturalAbilitiesSelection {
  constructor(secondaryAbilities, bonusHandler) {
    this.secondaryAbilities = secondaryAbilities
    this.bonusHandler = bonusHandler
    this.bonus = {
      reason: 'natural ability',
      value: 10,
    }
    this.totalOfNaturalAbilitiesToChoose = 5
    this.choosenNaturalAbilities = []
  }

  get remaining() {
    return (
      this.totalOfNaturalAbilitiesToChoose -
      this.choosenNaturalAbilities.length
    )
  }

  choose(name) {
    if (!this.remaining)
      throw new Error(
        `you can only choose ${this.totalOfNaturalAbilitiesToChoose} abilities by level`
      )
    if (
      this.choosenNaturalAbilities.find(
        x => x === name
      )
    )
      throw new Error(
        'you can only choose the same ability once'
      )
    this.bonusHandler.addBonus(
      'secondaryAbilities',
      name,
      this.bonus
    )
    this.choosenNaturalAbilities.push(name)
    return this
  }

  discard(name) {
    if (
      !this.choosenNaturalAbilities.find(
        x => x === name
      )
    )
      throw new Error(
        `${name} not have been choosen`
      )
    this.choosenNaturalAbilities = this.choosenNaturalAbilities.filter(
      ability => ability !== name
    )
    this.bonusHandler.removeBonus(
      'secondaryAbilities',
      name,
      this.bonus.reason
    )
    return this
  }
}
