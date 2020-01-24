import GenerateRolls from '../selectors/GenerateRolls'
import Characteristics from '../../characteristics/characteristics'
import RollsGenerator from '../../generatePoints/RollsGenerator'
import ValuesShop from '../../shop/ValuesShop'
import PointsShop from '../../shop/PointsShop'

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
      secondaryCharacteristics: {},
      PhysicalCapacities: {},
      CombatAbilities: {},
      SupernaturalAbilities: {},
      SecondaryAbilities: {},
    }

    this.rollsGenerator = new RollsGenerator(
      this.data.characteristics.length,
      DEFAULT_POINTS_TO_GENERATE
    )

    this.generateRolls = new GenerateRolls(
      this.data.generatedRolls,
      this.rollsGenerator
    )

    this.characteristicsSelection = {}

    this.generateRolls.rules.add(
      'Merge points in shop when is selected',
      'selected',
      ({ result }) => {
        const { mode, points } = result
        this.data.pointsShop[mode].mergeCatalog(
          points
        )
      }
    )
  }
}
