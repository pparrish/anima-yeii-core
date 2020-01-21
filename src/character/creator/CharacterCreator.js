import GenerateRolls from './GenerateRolls'
import Characteristics from '../../characteristics/characteristics'
import RollsGenerator from '../../generatePoints/RollsGenerator'

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
  }
}
