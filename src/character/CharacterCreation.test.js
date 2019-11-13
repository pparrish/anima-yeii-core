/* eslint-env jest */
const CharacterCreator = require('./CharacterCreator')
const listOfBasicInfo = require('../characterBasicInfo/listOfCharacterBasicInfo')
const listOfCharacteristics = require('../characteristics/listOfAnimaCharacteristics')
describe('Creation of a character', () => {
  const characterCreator = new CharacterCreator()
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
    expect(generatedPoints.points.length).toBe(8)
  })

  test('when generate points.type 4 i get points less or equal 70', () => {
    const generatedPoints = characterCreator.generatePoints(4)
    expect(generatedPoints.points).toBeLessThanOrEqual(70)
  })

  test('when select 60 points i have 60 points', () => {
    characterCreator.setPoints(60)
    const generatedPoints = characterCreator.generatePoints(5)
    expect(generatedPoints.points).toBe(60)
  })

  test('when i generate points again i get the same values', () => {
    const firstPoints = characterCreator.generatePoints(3)
    const secondPoints = characterCreator.generatePoints(3)
    expect(firstPoints).toEqual(secondPoints)
  })

  describe('points selection', () => {
    const newCreator = () => new CharacterCreator()

    const newCreatorWithType = type => {
      const creator = newCreator()
      creator.generatePoints(type)
      return creator
    }

    const creatorWithType1 = () => newCreatorWithType(1)

    const creatorWithType4 = () => newCreatorWithType(4)

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
})
