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
})
