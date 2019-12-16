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
