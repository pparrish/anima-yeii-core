import sizeTable from '../../secondaryCharacteristics/sizeTable'

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

  selectApareance(value) {
    this.secondaryCharacteristics.set(
      'appearance',
      value
    )
    return this
  }

  discardAppearance() {
    this.secondaryCharacteristics.set(
      'appearance',
      this.body.randomAppearance
    )
    return this
  }

  selectBodyType(type) {
    this.body.type = type
    return this
  }

  discardBodyType() {
    this.body.type = null
    return this
  }

  _isAcetable(value, attribute) {
    const size = this.secondaryCharacteristics.get(
      'size'
    ).value
    const isSlim = this.body.type === 'slim'
    const isFromAceptable = sizeTable[
      attribute
    ].from.check(size, value, isSlim)
    const isToAceptable = this.sizeTable[
      attribute
    ].to.check(size, value)
    return isFromAceptable && isToAceptable
  }

  selectHeight(value) {
    this.body.height = value
    return this
  }

  discardHeight() {
    this.body.height = null
    return this
  }

  selectWeight(value) {
    this.body.weight = value
    return this
  }

  discardWeight() {
    this.body.weight = null
    return this
  }

  get bodyLimits() {
    const size = this.secondaryCharacteristics.get(
      'size'
    ).value
    const isSlim = this.body.type === 'slim'
    return {
      height: {
        from: sizeTable.height.from.value(
          size,
          isSlim
        ),
        to: sizeTable.height.to.value(size),
      },
      weight: {
        from: sizeTable.weight.from.value(
          size,
          isSlim
        ),
        to: sizeTable.weight.to.value(size),
      },
    }
  }
}
