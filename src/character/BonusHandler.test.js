import BonusHandler from './BonusHandler'

class DumpCollection {
  constructor() {
    this.bonuses = {}
    this.global = {}
  }

  addBonus(bonus) {
    this.global[bonus.reason] = bonus
  }

  addBonusOf(name, bonus) {
    if (!this.bonuses[name])
      this.bonuses[name] = {}
    this.bonuses[name][bonus.reason] = bonus
  }

  removeBonus(reason) {
    this.global[reason] = undefined
  }

  removeBonusOf(name, reason) {
    this.bonuses[name][reason] = undefined
  }
}

describe('Bonus handler', () => {
  let bonusHandler
  let dumps
  let testBonus
  beforeEach(() => {
    dumps = []
    dumps.push(new DumpCollection())
    bonusHandler = new BonusHandler()
    bonusHandler.addCollection(
      'testCollection',
      dumps[0]
    )
    testBonus = {
      reason: 'testBonus',
      value: 0,
    }
  })
  test('when i add a bonus to test in test collection then the bonus exist in the collection target', () => {
    bonusHandler.addBonus(
      'testCollection',
      'testTarget',
      testBonus
    )
    expect(
      dumps[0].bonuses.testTarget.testBonus
    ).toBe(testBonus)
  })
  test('when i add a bonus to a collection  then the bonus is global to a collection', () => {
    bonusHandler.addBonusTo(
      'testCollection',
      testBonus
    )
    expect(dumps[0].global.testBonus).toBe(
      testBonus
    )
  })

  test('when i remove a bonus with test reason in test collection then the bonus is removed from the target', () => {
    bonusHandler.addBonus(
      'testCollection',
      'testTarget',
      testBonus
    )
    bonusHandler.removeBonus(
      'testCollection',
      'testTarget',
      'testBonus'
    )
    expect(
      dumps[0].bonuses.testTarget.testBonus
    ).not.toBe(testBonus)
  })
  test('when i remove a bonus to a test colection then the bonus is removed from colection', () => {
    bonusHandler.addBonusTo(
      'testCollection',
      testBonus
    )
    bonusHandler.removeBonusTo(
      'testCollection',
      'testBonus'
    )
    expect(dumps[0].global.testBonus).not.toBe(
      testBonus
    )
  })
  test('when i change a bonus value of bonusHamdler then change in the colection', () => {
    bonusHandler.addBonus(
      'testCollection',
      'testTarget',
      testBonus
    )
    bonusHandler.addBonusTo(
      'testCollection',
      testBonus
    )
    const bonusGlobal = bonusHandler.getBonusTo(
      'testCollection',
      'testBonus'
    )
    const bonus = bonusHandler.getBonus(
      'testCollection',
      'testTarget',
      'testBonus'
    )
    bonusGlobal.value = 1
    expect(dumps[0].global.testBonus.value).toBe(
      1
    )
    bonus.value = 2
    expect(
      dumps[0].bonuses.testTarget.testBonus.value
    ).toBe(2)
  })
})
