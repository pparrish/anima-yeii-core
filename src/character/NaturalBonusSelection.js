module.exports = class NaturalBonusSelection {
  constructor (characteristicsSelection, secondaryAbilities) {
    this.secondaryAbilities = secondaryAbilities
    this.characteristicsSelection = characteristicsSelection
    this.characteristicsSelection.addLink(this.changeBonusLink())
    this.selectedPhysicalAbility = null
    this.selectedPsychicAbility = null
  }

  selectPhysicalAbility (abilityName) {
    const ability = this.secondaryAbilities.get(abilityName)
    const dependency = ability.dependency
    const characteristic = this.characteristicsSelection.characteristics.get(dependency)
    if (!characteristic.isFromCategory('physical')) throw new Error(`${abilityName} is not depends on a physical characteristic`)
    if (this.selectedPhysicalAbility) {
      this.secondaryAbilities.removeBonusOf(this.selectedPhysicalAbility, 'natural bonus')
    }
    this.selectedPhysicalCharacteristic = dependency
    this.selectedPhysicalAbility = abilityName
    this.secondaryAbilities.addBonusOf(this.selectedPhysicalAbility, { reason: 'natural bonus', value: characteristic.bonus })
  }

  selectPsychicAbility (abilityName) {
    const ability = this.secondaryAbilities.get(abilityName)
    const dependency = ability.dependency
    const characteristic = this.characteristicsSelection.characteristics.get(dependency)
    if (!characteristic.isFromCategory('psychic')) throw new Error(`${abilityName} is not depends on a psychic characteristic`)
    if (this.selectedPhysicalAbility) {
      this.secondaryAbilities.removeBonusOf(this.selectedPsychicCharacteristic, 'natural bonus')
    }
    this.selectedPsychicCharacteristic = dependency
    this.selectedPsychicAbility = abilityName
    this.secondaryAbilities.addBonusOf(this.selectedPsychicAbility, { reason: 'natural bonus', value: characteristic.bonus })
  }

  changeBonusLink () {
    const selector = this
    return (name) => {
      if (name === selector.selectedPhysicalCharacteristic) {
        const bonusValue = selector.characteristicsSelection.characteristics.get(selector.selectedPhysicalCharacteristic).bonus
        selector.secondaryAbilities.removeBonusOf(selector.selectedPhysicalAbility, 'natural bonus')
        selector.secondaryAbilities.addBonusOf(selector.selectedPhysicalAbility, { reason: 'natural bonus', value: bonusValue })
      }
      if (name === selector.selectedPsychicCharacteristic) {
        const bonusValue = selector.characteristicsSelection.characteristics.get(selector.selectedPsychicCharacteristic).bonus
        selector.secondaryAbilities.removeBonusOf(selector.selectedPsychicAbility, 'natural bonus')
        selector.secondaryAbilities.addBonusOf(selector.selectedPsychicAbility, { reason: 'natural bonus', value: bonusValue })
      }
    }
  }
}
