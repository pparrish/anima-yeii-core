/* eslint-env jest */
const CharacterCreator = require('../CharacterCreator')

describe('character creator -> secondary abilities ', () => {
  let creator = {}
  beforeEach(() => {
    creator = new CharacterCreator()
    creator.setBasicInfo('level', 1)
  })
  describe('warrior category selected', () => {
    beforeEach(() => {
      creator.selectCategory('warrior')
    })
    describe('base -30 rule', () => {
      test('when i dont enhance then the base is -30', () => {
        expect(creator.secondaryAbilities.get('search').base).toBe(-30)
      })
      test('when i enhance by 5 then the base is 5', () => {
        creator.enhance('coldness', 5)
        expect(creator.secondaryAbilities.get('coldness').base).toBe(5)
      })
      test('when i disable the rule then the base is 0', () => {
        creator.disableRule('base -30')
        expect(creator.secondaryAbilities.get('style').base).toBe(0)
      })
    })
    test('when i enhance 5 all intimidate and persuasion then i spend 75 pd', () => {
      creator.enhance('persuasion', 5)
      expect(creator.developmentPointsSpended).toBe(10)
      creator.enhance('intimidate', 5)
      expect(creator.developmentPointsSpended).toBe(20)
    })
    test('when i enhance 10 points i can decrease the ability 5 points', () => {
      creator.enhance('warm', 10)
      expect(() => {
        creator.decrease('warm', 5)
      }).not.toThrow()
      expect(creator.developmentPointsSpended).toBe(10)
    })
  })
})
