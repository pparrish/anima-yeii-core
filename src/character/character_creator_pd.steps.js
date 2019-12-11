/* eslint-env jest */
const { defineFeature, loadFeature } = require('jest-cucumber')

const CharacterCreator = require('./CharacterCreator')

const feature = loadFeature('./src/character/character_creator_pd.feature')

defineFeature(feature, test => {
  let creator = null

  const givenACreator = (given) => {
    given(/^a creator$/, () => {
      creator = new CharacterCreator()
    })
  }

  const givenACreatorWithCategory = (given) => {
    given(/^a creator with (.*) category$/, (category) => {
      creator = new CharacterCreator()
      creator.selectCategory(category)
      creator.setBasicInfo('level', 1)
    })
  }
  const andEnhanceTheAbility = (and) => {
    and(/^enhance (\d+) points the (.*) ability$/, (points, ability) => {
      creator.enhance(ability, parseInt(points))
    })
  }

  const theBaseOfIs = (given) => {
    given(/^the base of (.*) is (-?\d+)$/, (name, base) => {
      expect(creator.ability(name).base).toBe(parseInt(base))
    })
  }

  const thePdSpendedInIs = (given) => {
    given(/^the pd spended in (.*) is (.\d)$/, (abilityName, spendedPd) => {
      expect(creator.developmentPointsSpendedIn(abilityName)).toBe(parseInt(spendedPd))
    })
  }

  const iSpendPd = (given) => {
    given(/^i spend (\d+) pd$/, (spended) => {
      expect(creator.developmentPointsSpended).toBe(parseInt(spended))
    })
  }

  const iCannotEnhanceTo = (given, throwMessage) => {
    given(/^i cannot enhance (.*) to (\d+)$/, (name, points) => {
      expect(() => creator.enhance(name, parseInt(points))).toThrow(throwMessage)
    })
  }
  const iCanEnhanceTo = (given, throwMessage) => {
    given(/^i can enhance (.*) to (\d+)$/, (name, points) => {
      expect(() => creator.enhance(name, parseInt(points))).not.toThrow(throwMessage)
    })
  }

  test('category not setted', ({ given, then }) => {
    givenACreator(given)
    then(/^when i try to spend pd i have a error$/, () => {
      expect(() => creator.enhance('attack', 10)).toThrow('select category to spend development points')
    })
  })

  test('category setted', ({ given, then, and }) => {
    givenACreator(given)
    and(/^select the warrior category$/, () => {
      creator.selectCategory('warrior')
    })
    then(/^when i try to spend pd i dont have errors$/, () => {
      expect(() => creator.enhance('attack', 10)).not.toThrow('select category to spend development points')
    })
  })

  test('enhance ability', ({ given, and, then }) => {
    givenACreatorWithCategory(given)
    andEnhanceTheAbility(and)
    iSpendPd(then)
    theBaseOfIs(and)
    thePdSpendedInIs(and)
  })

  test('decrease ability', ({ given, and, then }) => {
    givenACreatorWithCategory(given)
    andEnhanceTheAbility(and)
    and(/^decrease (\d+) points the (.*) ability$/, (points, abilityName) => {
      creator.decrease(abilityName, parseInt(points))
    })
    theBaseOfIs(then)
    thePdSpendedInIs(and)
    iSpendPd(and)
  })

  test('enhance more than the pd limit', ({ given, then }) => {
    givenACreatorWithCategory(given)
    then(/^enhance 500 points the attack ability i get a error$/, () => {
      expect(() => creator.enhance('wear armor', 500)).toThrow('development points exeded')
    })
  })

  test('decrease a ability', ({ given, then }) => {
    givenACreatorWithCategory(given)
    then(/^decrease 500 points a ability throw a error$/, () => {
      creator.enhance('wear armor', 10)
      expect(() => creator.decrease('wear armor', 500)).toThrow('decrease bellow 0')
    })
  })

  test('base -30 rule', ({ given, then }) => {
    givenACreatorWithCategory(given)
    theBaseOfIs(then)
  })

  test('disable base -30 rule', ({ given, then, and }) => {
    givenACreatorWithCategory(given)
    and(/^disable base -30 rule$/, () => {
      creator.disableRule('base -30')
    })
    theBaseOfIs(then)
  })

  test('cannot enhance ability bellow 5', ({ given, then, and }) => {
    givenACreatorWithCategory(given)
    then(/^i try to enhance by 3 throw a error$/, () => {
      expect(() => creator.enhance('attack', 3)).toThrow('cannot enhance bellow 5')
    })
    and(/^i try to enhance by 5 not throw$/, () => {
      expect(() => creator.enhance('attack', 5)).not.toThrow('cannot enhance bellow 5')
    })
    and(/^disable the ability minimun 5 rule$/, () => {
      creator.disableRule('ability minimun 5')
    })
    then(/^i try to enhance by 3 not throw error$/, () => {
      expect(() => creator.enhance('dodge', 3)).not.toThrow('cannot enhance bellow 5')
    })
  })

  test('the limits on the points distribution', ({ given, and, then }) => {
    givenACreatorWithCategory(given)
    iCanEnhanceTo(and)
    iCannotEnhanceTo(and, 'the limit of pd for combat abilities is 360')
    and(/^i disable limits rule$/, () => {
      creator.disableRule('combat abilities limit')
    })
    iCanEnhanceTo(then, 'the limit of pd for combat abilities is 360')
  })

  test('limit of offensive and defensive ability', ({ given, and, then }) => {
    givenACreatorWithCategory(given)
    iCanEnhanceTo(and)
    iCanEnhanceTo(and)
    iCanEnhanceTo(and)
    iCanEnhanceTo(and)
    iCanEnhanceTo(and)
    iCanEnhanceTo(and)
    then(/^i spend 50 percent of pd$/, () => {
      expect(creator.developmentPointsSpended).toBe(creator.developmentPoints * 0.5)
    })

    iCannotEnhanceTo(and, 'the limit of offensive and defensive is 300')
  })

  test('limit of diference betten atack and defense', ({ given, then, and }) => {
    givenACreatorWithCategory(given)
    andEnhanceTheAbility(and)
    iCanEnhanceTo(and, '')
    iCannotEnhanceTo(and, '')
    andEnhanceTheAbility(then)
    iCanEnhanceTo(and, '')
    iCannotEnhanceTo(and, '')
    and(/^disable de rule of diference limits$/, () => {
      creator.disableRule('offencive and deffensive diference limit')
    })
    iCanEnhanceTo(and, '')
  })

  test('only attack or defence limits', ({ given, and }) => {
    givenACreatorWithCategory(given)
    iCanEnhanceTo(and, 'the limit of dodge and stop is150')
    iCannotEnhanceTo(and, 'the limit of dodge and stop is 150')
  })
})
