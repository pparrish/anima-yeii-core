import RulesHandler from '../../rulesHandler/RulesHandler'

export default class CharacteristicsSelector {
  constructor(ICharacteristicsCollection) {
    this.rules = new RulesHandler()
    this.characteristics = ICharacteristicsCollection
  }
}
