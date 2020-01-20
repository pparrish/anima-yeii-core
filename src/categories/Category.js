import { required } from '../utils/classUtils'
import expandCosts from './expandCostOfSecondaryAbilitiesCategories'

export default class Category {
  constructor(
    name = required('name'),
    archetype = required('archetype'),
    pv = required('pv'),
    turn = required('turn'),
    martialKnowledge = required(
      'martial knowledge'
    ),
    innateCv = required('innate CV'),
    limits = required('limits'),
    costs = required('costs'),
    bonus = required('bonus')
  ) {
    this._ = {
      name,
      archetype,
      pv,
      turn,
      martialKnowledge,
      innateCv,
      limits,
      costs,
      bonus,
    }
  }

  get name() {
    return this._.name
  }

  get archetype() {
    return this._.archetype
  }

  get limits() {
    return this._.limits
  }

  get abilitiesCosts() {
    const secondaries = expandCosts(
      this._.costs.secondary
    )
    const { reducedCosts } = this._.costs
    const primary = this._getPrimaryCosts()

    return {
      ...secondaries,
      ...reducedCosts,
      ...primary,
    }
  }

  _getPrimaryCosts() {
    const abilities = Object.entries(
      this._.costs.primary
    )
    return abilities.reduce((result, actual) => {
      return {
        ...result,
        ...actual[1],
      }
    }, {})
  }
}
