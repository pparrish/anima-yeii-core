/* eslint-env jest */
const CharacterCreator = require('./CharacterCreator')
const listOfBasicInfo = require('../characterBasicInfo/listOfCharacterBasicInfo')
const listOfCharacteristics = require('../characteristics/listOfAnimaCharacteristics')
describe('Creation of a character', () => {
  const characterCreator = new CharacterCreator()
  const newCreator = () => new CharacterCreator()

  const newCreatorWithType = type => {
    const creator = newCreator()
    creator.generatePoints(type)
    return creator
  }

  const creatorWithType1 = () => newCreatorWithType(1)

  const creatorWithType4 = () => newCreatorWithType(4)

  const creatorWithType5And60Points = () => {
    const creator = newCreator()
    creator.setPoints(60).generatePoints(5)
    return creator
  }

  test('when the creation begings all the basic info is not seted', () => {
    expect(characterCreator.nonSetBasicInfo()).toEqual(expect.arrayContaining(listOfBasicInfo))
  })
  test('before i set the name then i see the name ass null', () => {
    const { name } = characterCreator.settedBasicInfo()
    expect(name).toBe(undefined)
  })

  test('when i set the name then i see the name setted', () => {
    characterCreator.setBasicInfo('name', 'Parrish')
    const { name } = characterCreator.settedBasicInfo()
    expect(name).toBe('Parrish')
  })

  test.each([
    ['description', 'generic description'],
    ['personality', 'generic personality'],
    ['lore', 'generic lore'],
    ['age', 20],
    ['race', 'human']
  ])('when i set %s as %s then i see tne value setted',
    (name, value) => {
      characterCreator.setBasicInfo(name, value)
      const setted = characterCreator.settedBasicInfo()
      expect(setted[name]).toBe(value)
    })

  test('when generate points i get 8 values', () => {
    const generatedPoints = characterCreator.generatePoints(1)
    expect(generatedPoints.nonSetGenerationValues().length).toBe(8)
  })

  test('when generate points.type 4 i get points less or equal 70', () => {
    const generatedPoints = characterCreator.generatePoints(4)
    expect(generatedPoints.remainerPoints()).toBeLessThanOrEqual(70)
  })

  test('when select 60 points i have 60 points', () => {
    characterCreator.setPoints(60)
    characterCreator.generatePoints(5)
    expect(characterCreator.remainerPoints()).toBe(60)
  })

  test('when i generate points again i get the same values', () => {
    const firstPoints = characterCreator.generatePoints(3)
    const secondPoints = characterCreator.generatePoints(3)
    expect(firstPoints).toEqual(secondPoints)
  })

  describe('points selection', () => {
    test('Given a new creator them pointAlreadyGenerathed must be false', () => {
      const creator = newCreator()
      expect(creator.isPoinsAlreadyGenerated()).toBe(false)
    })

    test('Given a new creator Then access to generator type twow a error', () => {
      const creator = newCreator()
      expect(() => creator.generationType()).toThrow()
    })

    test('Given a creator width type1 generator then i get generate type "values"', () => {
      const creator = creatorWithType1()
      expect(creator.generationType()).toBe('values')
    })

    test('Given a creator with type 4 generator Then i get generate type "points"', () => {
      const creator = creatorWithType4()
      expect(creator.generationType()).toBe('points')
    })

    test('Given a creator with type 1 generation And change to type 4 generation Then the generation type is points', () => {
      const creator = creatorWithType1()
      creator.generatePoints(4)
      expect(creator.generationType()).toBe('points')
    })

    test('Given a creator with type 4 generation And change to type 1 generation Then the generation type is values', () => {
      const creator = creatorWithType4()
      creator.generatePoints(1)
      expect(creator.generationType()).toBe('values')
    })

    test('Given a new creator Then the nonSettedCharacteristics contains all characteristics', () => {
      const creator = newCreator()
      expect(creator.nonSetCharacteristics()).toEqual(expect.arrayContaining(listOfCharacteristics))
    })

    test('Given a creator with type 1 And select greatest value to dexterity Then i get the characteristic dexterity with the greatestValue', () => {
      const creator = creatorWithType1()
      const greatestValue = creator.getGreatestNonSetValue()
      creator.selectGreatestValueTo('dexterity')
      const { dexterity } = creator.settedCharacteristics()
      expect(dexterity).toBe(greatestValue)
    })

    test('Given a creatpr with type 1 And select the smalest value to dexterity Then i get the characteristic of dexterity woth the smalest value', () => {
      const creator = creatorWithType1()
      const smalestValue = creator.getSmalestNonSetValue()
      creator.selectSmalestValueTo('dexterity')
      const { dexterity } = creator.settedCharacteristics()
      expect(dexterity).toBe(smalestValue)
    })

    test('Given a creator with type1 And i select a value to dexterity Then the value is on dexterity', () => {
      const creator = creatorWithType1()
      const firstValue = creator.nonSetGenerationValues()[0]
      creator.selectValueTo('dexterity', firstValue)
      const { dexterity } = creator.settedCharacteristics()
      expect(dexterity).toBe(firstValue)
    })

    test('Given a creator widrh type 1 And i selexta a value to dexterity that not is in notSetGenerationValues Then throw error', () => {
      const creator = creatorWithType1()
      expect(() => creator.selectValueTo('dexterity', 2000)).toThrow()
    })

    test('Given a creator with type 1 And select a value to dexterity And i remove the value of the dexterity Then the value is in nonSetGeneratorValue', () => {
      const creator = creatorWithType1()
      const firstValue = creator.nonSetGenerationValues()[0]
      creator.selectValueTo('dexterity', firstValue)
      creator.removeValueTo('dexterity')
      expect(creator.nonSetGenerationValues()).toEqual(expect.arrayContaining([firstValue]))
    })
  })

  describe('Select points by points', () => {
    test('Given a creator width type 4 and select 60 points And i expend 5 points to dexterity then Dexterity have 5 points', () => {
      const creator = creatorWithType5And60Points()
      creator.expendPointsTo('dexterity', 5)
      expect(creator.settedCharacteristics().dexterity).toBe(5)
    })
    test(`Given a creator width type 4
And select 60 points
And i expend 5 pointe to dexterity
Then i have 55 points to expend`, () => {
      const creator = creatorWithType5And60Points()
      creator.expendPointsTo('dexterity', 5)
      expect(creator.remainderPoints()).toBe(55)
    })
    test('Given a creator with type 4 And select 5 to dexterity And Select 2 to dexterity Then dexterity is 7', () => {
      const creator = creatorWithType5And60Points()
      creator.expendPointsTo('dexterity', 5)
      creator.expendPointsTo('dexterity', 2)
      const { dexterity } = creator.settedCharacteristics()
      expect(dexterity).toBe(4)
    })
    test.skip('Given a creator with type 4 and select 60 points And expend 10 points to dexterity Then i have 49 points remaind to expend', () => {
      const creator = creatorWithType5And60Points()
      creator.expendPointsTo('dexterity', 10)
      expect(creator.remainerPoints()).toBe(49)
    })

    test.skip('Given a creator width type 4 amd select 60 pointd And disable the "10 value expends 2" Then i have 60 points remaind to expend', () => {
      const creator = creatorWithType5And60Points()
      creator.disableRule('10 value expends 2')
      creator.expendPointsTo('dexterity', 10)
      expect(creator.remainerPoints()).toBe(60)
    })

    test.skip('Given a creator with type 4 and select 60 points And try to expend more than 60 Then i get Error', () => {
      const creator = creatorWithType5And60Points()
      const expendAllPoints = () => {
        for (const name of listOfCharacteristics) {
          creator.expendPointsTo(name, 10)
        }
      }
      expect(expendAllPoints).toThrow('points to expend exeded')
    })

    test.skip('Given a creator with type 4 and select 60 points And try to expend more than 60 Then i have', () => {
      const creator = creatorWithType5And60Points()
      const expendAllPoints = () => {
        for (const name of listOfCharacteristics) {
          creator.expendPointsTo(name, 10)
        }
      }

      try {
        expendAllPoints()
      } catch {}

      expect(creator.remainerPoints()).toBe(4)
    })

    test.skip('Given a creator width type 4 and select 60 points And expend 11 points to dexterity Then i get a error', () => {
      const creator = creatorWithType5And60Points()
      expect(() => creator.expendPointsTo('dexterity', 11)).toThrow('Buy more than 10 points to a characteristic is froiben')
    })

    test.skip('Given q creator with type 4 and select 60 points And disable rule of "maximun is 10" And add 11 to dexterity then i have 11 to dexterity', () => {
      const creator = creatorWithType5And60Points()
      creator.disableRule('maximun is 10').expendPointsTo('dexterity', 11)
      const { dexterity } = creator.settedCharacteristics()
      expect(dexterity).toBe(11)
    })

    test.skip('Given a creator with type 4 And select 5 to dexterity And remove 4 to dexterity Then i have 1 of dexterity And i have 59 points remaind', () => {
      const creator = creatorWithType5And60Points()
      creator.expendPointsTo('dexterity', 5)
        .removePointsTo('dexterity', 4)
      expect(creator.settedCharacteristics().dexterity).toBe(1)
      expect(creator.remainerPoints()).toBe(59)
    })

    test.skip('Given a creator width type 4 And select 5 to dexterity And i remove 6 to dexterity then i get a error', () => {
      const creator = creatorWithType5And60Points()
      creator.expendPointsTo('dexterity')
      expect(() => creator.removePointsTo('dexterity', 6)).toThrow('you are trying to remove 6 to dexterity but dexterity have only 5 points')
    })

    test.skip('Given a creator with type 4 And select 5 to dexterity and remove points to dexterity then dexterity not have points', () => {
      const creator = creatorWithType5And60Points()
      creator.expendPointsTo('dexterity')
      creator.removePointsTo('dexterity')
      expect(creator.nonSetGenerationValues()).toEqual(expect.arrayContaining(['dexterity']))
    })

    test.skip('Given a creator width type 4 and i remove 6 to dexterity then i have a error', () => {
      expect(() => creatorWithType5And60Points().removePointsTo('dexterity', 6)).toThrow('you are tying to remove 6 to dexterity but dexterity is not have points')
    })
  })
})
