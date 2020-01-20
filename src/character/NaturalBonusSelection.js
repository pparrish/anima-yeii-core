module.exports = class NaturalBonusSelection {
  constructor(
    characteristicsSelection,
    secondaryAbilities,
    bonusHandler
  ) {
    this.secondaryAbilities = secondaryAbilities
    this.characteristicsSelection = characteristicsSelection
    this.bonusHandler = bonusHandler
    this.characteristicsSelection.addLink(
      this.changeBonusLink()
    )
    this.selectedPhysicalAbility = null
    this.selectedPsychicAbility = null
  }

  selectPhysicalAbility(abilityName) {
    const ability = this.secondaryAbilities.get(
      abilityName
    )
    const { dependency } = ability
    const characteristic = this.characteristicsSelection.characteristics.get(
      dependency
    )
    if (
      !characteristic.isFromCategory('physical')
    )
      throw new Error(
        `${abilityName} is not depends on a physical characteristic`
      )
    if (this.selectedPhysicalAbility) {
      this.bonusHandler.removeBonus(
        'secondaryAbilities',
        this.selectedPhysicalAbility,
        'natural bonus'
      )
    }
    this.selectedPhysicalCharacteristic = dependency
    this.selectedPhysicalAbility = abilityName
    this.bonusHandler.addBonus(
      'secondaryAbilities',
      this.selectedPhysicalAbility,
      {
        reason: 'natural bonus',
        value: characteristic.bonus,
      }
    )
  }

  selectPsychicAbility(abilityName) {
    const ability = this.secondaryAbilities.get(
      abilityName
    )
    const { dependency } = ability
    const characteristic = this.characteristicsSelection.characteristics.get(
      dependency
    )
    if (!characteristic.isFromCategory('psychic'))
      throw new Error(
        `${abilityName} is not depends on a psychic characteristic`
      )
    if (this.selectedPhysicalAbility) {
      this.bonusHandler.removeBonus(
        'secondaryAbilities',
        this.selectedPsychicCharacteristic,
        'natural bonus'
      )
    }
    this.selectedPsychicCharacteristic = dependency
    this.selectedPsychicAbility = abilityName
    this.bonusHandler.addBonus(
      'secondaryAbilities',
      this.selectedPsychicAbility,
      {
        reason: 'natural bonus',
        value: characteristic.bonus,
      }
    )
  }

  changeBonusLink() {
    const selector = this
    return name => {
      if (
        name ===
        selector.selectedPhysicalCharacteristic
      ) {
        const bonusValue = selector.characteristicsSelection.characteristics.get(
          selector.selectedPhysicalCharacteristic
        ).bonus

        selector.bonusHandler.getBonus(
          'secondaryAbilities',
          selector.selectedPhysicalAbility,
          'natural bonus'
        ).value = bonusValue
      }
      if (
        name ===
        selector.selectedPsychicCharacteristic
      ) {
        const bonusValue = selector.characteristicsSelection.characteristics.get(
          selector.selectedPsychicCharacteristic
        ).bonus

        selector.bonusHandler.getBonus(
          'secondaryAbilities',
          selector.selectedPhysicalAbility,
          'natural bonus'
        ).value = bonusValue
      }
    }
  }
}
