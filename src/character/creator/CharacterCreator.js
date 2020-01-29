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
import categories from '../../categories'
import CategorySelector from '../selectors/CategorySelector'
import Shop from '../../shop/Shop'

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
      developmentPointsShop: new Shop(),
      basicInfo: {},
      characteristics: new Characteristics(),
      secondaryCharacteristics: new SecondaryCharacteristics(),
      physicalCapacities: new PhysicalCapacities(),
      CombatAbilities: {},
      SupernaturalAbilities: {},
      SecondaryAbilities: {},
      rules: new RulesHandler(),
      selectedCategory: {
        name: null,
        archetype: null,
        limits: null,
        abilitiesCosts: null,
      },
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

    // TODO Get this categories in another method
    this.categories = categories

    this.categorySelector = new CategorySelector(
      this.data.selectedCategory,
      this.categories
    )

    this.generateRolls.rules.add(
      'Actualice the points shops',
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

    this.categorySelector.rules.add(
      'Update de development points shop',
      'category/selected',
      ({ category }) => {
        this.data.developmentPointsShop.mergeCatalog(
          category.abilitiesCosts
        )
      }
    )
  }
}
