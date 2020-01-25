import GenerateRolls from '../selectors/GenerateRolls'
import Characteristics from '../../characteristics/characteristics'
import RollsGenerator from '../../generatePoints/RollsGenerator'
import ValuesShop from '../../shop/ValuesShop'
import PointsShop from '../../shop/PointsShop'
import CharacteristicsSelector from '../selectors/CharacteristicSelector'
import PhysicalCapacities from '../../physicalCapacities/PhysicalCapacities'
import RulesHandler from '../../rulesHandler/RulesHandler'
import SecondaryCharacteristics from '../../secondaryCharacteristics/SecondaryCharacteristics'
import D10 from '../../dices/d10'

const d10 = new D10()

const DEFAULT_POINTS_TO_GENERATE = 60

export default class CharacterCreator {
  constructor() {
    this.data = {
      generatedRolls: {
        type: undefined,
        mode: undefined,
        points: undefined,
        generated: {},
      },
      pointsShop: {
        values: new ValuesShop(),
        points: new PointsShop(),
      },
      basicInfo: {},
      characteristics: new Characteristics(),
      secondaryCharacteristics: new SecondaryCharacteristics(),
      physicalCapacities: new PhysicalCapacities(),
      CombatAbilities: {},
      SupernaturalAbilities: {},
      SecondaryAbilities: {},
      rules: new RulesHandler(),
    }

    this.rollsGenerator = new RollsGenerator(
      this.data.characteristics.length,
      DEFAULT_POINTS_TO_GENERATE
    )

    this.generateRolls = new GenerateRolls(
      this.data.generatedRolls,
      this.rollsGenerator
    )

    this.characteristicsSelection = new CharacteristicsSelector(
      this.data.characteristics,
      this.data.pointsShop.values
    )

    this.generateRolls.rules.add(
      'Actualice the shops',
      'selected',
      ({ result }) => {
        const { mode, points } = result
        this.data.pointsShop[mode].mergeCatalog(
          points
        )
        this.characteristicsSelection.shop = this.data.pointsShop[
          mode
        ]
      }
    )

    this.characteristicsSelection.rules.add(
      'agility is movement tyoe',
      'characteristics/setted/agility',
      value => {
        this.data.physicalCapacities.set(
          'movement type',
          value
        )
      }
    )

    this.characteristicsSelection.rules.add(
      'streng is fatigue',
      'characteristics/setted/physique',
      value => {
        this.data.physicalCapacities.set(
          'fatigue',
          value
        )
      }
    )

    this.characteristicsSelection.rules.add(
      'strength is added to physique to size',
      'characteristics/setted/strength',
      value => {
        this._setSize(value, 'physique')
      }
    )

    this.characteristicsSelection.rules.add(
      'physique is added to strength to size',
      'characteristics/setted/physique',
      value => {
        this._setSize(value, 'strength')
      }
    )

    // TODO Maibe must be a part of secondaryCharaxteristic selector
    this.data.rules.add(
      'Random appearance',
      'creator/init',
      () => {
        this.data.secondaryCharacteristics.set(
          'appearance',
          d10.roll()
        )
      }
    )

    this.data.rules.apply(
      'creator/init',
      this,
      this
    )
  }

  _setSize(value, complementNameToSearch) {
    const { mode } = this.data.generatedRolls
    if (
      this.data.pointsShop[mode].buyList[
        complementNameToSearch
      ]
    ) {
      const complementValue = this.data.characteristics.get(
        complementNameToSearch
      ).value
      this.data.secondaryCharacteristics.set(
        'size',
        value + complementValue
      )
    } else {
      this.data.secondaryCharacteristics.get(
        'size',
        0
      )
    }
  }
}
