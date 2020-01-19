import {
  required,
  frobiden,
} from '../utils/classUtils'

export default class BonusHandler {
  constructor() {
    this.collections = {}
    this.bonus = {}
  }

  addCollection(
    name = required('name'),
    ICollection = required('collection')
  ) {
    this.collections[name] = ICollection
    return this
  }

  addBonus(
    collectionName = required('collection name'),
    target = required('target'),
    bonus = required('bonus')
  ) {
    if (bonus.reason === 'bonus')
      frobiden(
        'The bonus reason cannot be "bonus"'
      )
    if (!this.bonus[collectionName])
      this.bonus[collectionName] = {}
    if (!this.bonus[collectionName][target])
      this.bonus[collectionName][target] = {}
    if (
      this.bonus[collectionName][target][
        bonus.reason
      ]
    )
      return this
    this.collections[collectionName].addBonusOf(
      target,
      bonus
    )
    this.bonus[collectionName][target][
      bonus.reason
    ] = bonus
    return this
  }

  addBonusTo(collection, bonus) {
    if (!this.bonus[collection])
      this.bonus[collection] = {}
    if (!this.bonus[collection].bonus)
      this.bonus[collection].bonus = {}
    if (
      this.bonus[collection].bonus[bonus.reason]
    )
      return this
    this.collections[collection].addBonus(bonus)
    this.bonus[collection].bonus[
      bonus.reason
    ] = bonus
    return this
  }

  removeBonus(
    colection = required('colection name'),
    target = required('target'),
    reason = required('reason')
  ) {
    if (!this.collections[colection])
      frobiden(
        `The ${colection} colection does not exists`
      )
    this.collections[colection].removeBonusOf(
      target,
      reason
    )
    this.bonus[colection][target] = undefined
  }

  removeBonusTo(
    colection = required('colection name'),
    reason = required('reason')
  ) {
    if (!this.collections[colection])
      frobiden(
        `The ${colection}} colection does not exist`
      )
    this.collections[colection].removeBonus(
      reason
    )
    this.bonus[colection].bonus.reason = undefined
    return this
  }

  getBonus(
    colection = required('colection name'),
    target = required('target'),
    reason = required('reason')
  ) {
    if (!this.bonus[colection])
      frobiden(
        `The ${colection}} colection does not exist`
      )
    if (!this.bonus[colection][target])
      frobiden(
        `The ${target}} target does not exist`
      )
    if (!this.bonus[colection][target][reason])
      frobiden(
        `The ${reason}} reason does not exist`
      )
    return this.bonus[colection][target][reason]
  }

  getBonusTo(
    colection = required('colection name'),
    reason = required('reason')
  ) {
    if (!this.bonus[colection])
      frobiden(
        `The ${colection}} colection does not exist`
      )
    console.log(this.bonus)
    if (!this.bonus[colection].bonus)
      frobiden(
        `${colection} does not have any bonus`
      )
    if (!this.bonus[colection].bonus[reason])
      frobiden(
        `The ${reason}} reason does not exist`
      )
    return this.bonus[colection].bonus[reason]
  }
}
