import GenerateRolls from '../selectors/GenerateRolls'
import Characteristics from '../../characteristics/characteristics'
import RollsGenerator from '../../generatePoints/RollsGenerator'
import ValuesShop from '../../shop/ValuesShop'
import PointsShop from '../../shop/PointsShop'
import CharacteristicsSelector from '../selectors/CharacteristicSelector'
import PhysicalAttibutesSelector from '../selectors/PhysicalAttibutesSelector'
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
      body: {
        randomAppearance: d10.roll(),
        height: undefined,
        weight: undefined,
        type: undefined,
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

    this.physicalAttibutesSelector = new PhysicalAttibutesSelector(
      this.data.body,
      this.data.physicalCapacities,
      this.data.secondaryCharacteristics,
      this.data.pointsShop,
      this.data.generatedRolls,
      this.data.characteristics,
      this.characteristicsSelection.rules
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
  }
}
