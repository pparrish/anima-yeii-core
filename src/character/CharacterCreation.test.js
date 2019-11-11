/* eslint-env jest */
const CharacterCreator = require('./CharacterCreator')
const listOfBasicInfo = require('../characterBasicInfo/listOfCharacterBasicInfo')
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
    test.todo('when i generetate by type 4 i get type "points"')

    test.todo('when i generate points type 1 i can get the type of generation type 1')

    test.todo('when i not select any characteristic all non set characteristics is in notSetterCharacteristic')

    test.todo('when i use select Greatest value to a characteristic i can see the selectec characteristic width the greather value of the values')

    test.todo('when i select a value of a table this value is removed to remaind values')

    test.todo('when i use select smallest value to a characteristic i can see the characteristic width the smlest value of the values')

    test.todo('when i use the select value to a characteristic and the selected value is not in the characteristic twrow error'
    )

    test.todo('when i use select value to a characteristic i can see the value selecten in the characteristic')

    test.todo('when i remove greatest value  i cant see the in rhe selectec characteristics')

    test.todo('when i remove the smalest value i cant see it in the selected characteristics ')
    test.todo('when i remove a value from a characteristic the  i can see the selected characteristic')
  })
})
