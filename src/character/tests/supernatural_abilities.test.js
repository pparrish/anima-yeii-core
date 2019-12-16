/* eslint-env jest */
const CharacterCreator = require('../CharacterCreator')

describe('character creator -> supernatural abilities ', () => {
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
        expect(creator.supernaturalAbilities.get('magic projection').base).toBe(-30)
      })
      test('when i enhance by 5 then the base is 5', () => {
        creator.enhance('magic projection', 5)
        expect(creator.supernaturalAbilities.get('magic projection').base).toBe(5)
      })
      test('when i disable the rule then the base is 0', () => {
        creator.disableRule('base -30')
        expect(creator.supernaturalAbilities.get('magic projection').base).toBe(0)
      })
    })
    test('when i enhance 5 all the supernarural abilities then i spend 75 pd', () => {
      creator.enhance('magic projection', 5)
      expect(creator.developmentPointsSpended).toBe(15)
      creator.enhance('summon', 5)
      expect(creator.developmentPointsSpended).toBe(30)
      creator.enhance('domain', 5)
      expect(creator.developmentPointsSpended).toBe(45)
      creator.enhance('tie', 5)
      expect(creator.developmentPointsSpended).toBe(60)
      creator.enhance('unsummon', 5)
      expect(creator.developmentPointsSpended).toBe(75)
    })
    test('when i enhance 10 points i can decrease the ability 5 points', () => {
      creator.enhance('magic projection', 10)
      expect(() => {
        creator.decrease('magic projection', 5)
      }).not.toThrow()
      expect(creator.developmentPointsSpended).toBe(15)
    })
    test('i cannot enhance more than the supernatural abilities limit', () => {
      expect(() => {
        creator.enhance('summon', 101)
      }).toThrow('the limit of supernatural abilities is 300')
    })
    test('i cannot enhance the magic projection ability more than the limit', () => {
      expect(() => {
        creator.enhance('magic projection', 51)
      }).toThrow('the pd limit to spend in magic projection is 150')
    })
  })
})
