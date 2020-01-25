export default class PhysicalAttibutesSelector {
  constructor(
    body,
    IPhysicalCollection,
    ISecondaryCollection,
    pointsShop,
    generatedRolls,
    characteristics,
    IRulesRegister
  ) {
    this.rulesToLink = IRulesRegister
    this.body = body
    this.physicalCapacities = IPhysicalCollection
    this.generatedRolls = generatedRolls
    this.pointsShop = pointsShop
    this.secondaryCharacteristics = ISecondaryCollection
    this.characteristics = characteristics

    this.secondaryCharacteristics.set(
      'appearance',
      this.body.randomAppearance
    )

    this.rulesToLink.add(
      'agility is movement tyoe',
      'characteristics/setted/agility',
      value => {
        this.physicalCapacities.set(
          'movement type',
          value
        )
      }
    )

    this.rulesToLink.add(
      'streng is fatigue',
      'characteristics/setted/physique',
      value => {
        this.physicalCapacities.set(
          'fatigue',
          value
        )
      }
    )

    this.rulesToLink.add(
      'strength is added to physique to size',
      'characteristics/setted/strength',
      value => {
        this._setSize(value, 'physique')
      }
    )

    this.rulesToLink.add(
      'physique is added to strength to size',
      'characteristics/setted/physique',
      value => {
        this._setSize(value, 'strength')
      }
    )
  }

  _setSize(value, complementNameToSearch) {
    const { mode } = this.generatedRolls
    if (
      this.pointsShop[mode].buyList[
        complementNameToSearch
      ]
    ) {
      const complementValue = this.characteristics.get(
        complementNameToSearch
      ).value
      this.secondaryCharacteristics.set(
        'size',
        value + complementValue
      )
    } else {
      this.secondaryCharacteristics.get('size', 0)
    }
  }
}
