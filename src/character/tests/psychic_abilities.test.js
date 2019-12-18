/* eslint-env jest */
const CharacterCreator = require('../CharacterCreator')

describe('character creator -> psychic abilities', () => {
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
        expect(creator.psychicAbilities.get('psychic projection').base).toBe(-30)
      })
      test('when i enhance by 5 then the base is 5', () => {
        creator.enhance('psychic projection', 5)
        expect(creator.psychicAbilities.get('psychic projection').base).toBe(5)
      })
      test('when i disable the rule then the base is 0', () => {
        creator.disableRule('base -30')
        expect(creator.psychicAbilities.get('psychic projection').base).toBe(0)
      })
    })
    test('when i enhance 5 all the psychic abilities then i spend 75 pd', () => {
      creator.enhance('psychic projection', 5)
      expect(creator.developmentPointsSpended).toBe(15)
    })
    test('when i enhance 10 points i can decrease the ability 5 points', () => {
      creator.enhance('psychic projection', 10)
      expect(() => {
        creator.decrease('psychic projection', 5)
      }).not.toThrow()
      expect(creator.developmentPointsSpended).toBe(15)
    })
    test('i cannot enhance more than the supernatural abilities limit', () => {
      expect(() => {
        creator.enhance('psychic projection', 101)
      }).toThrow('the limit of psychic abilities is 300')
    })
    test('i cannot enhance the psychic projection ability more than the limit', () => {
      expect(() => {
        creator.enhance('psychic projection', 51)
      }).toThrow('the pd limit to spend in psychic projection is 150')
    })
  })
})
