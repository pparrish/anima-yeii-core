/* eslint-env jest */
const CharacterCreator = require('../CharacterCreator')
const listOfCharacteristics = require('../../characteristics/listOfAnimaCharacteristics')

describe('Select points by points', () => {
  describe('Creator of type 4', () => {
    let creator = {}
    beforeEach(() => {
      creator = new CharacterCreator()
    })

    describe('select 60 points', () => {
      beforeEach(() => {
        creator.setPoints(60).generatePoints(5)
      })
      test('when i spend 5 points to dexterity then Dexterity have 5 points', () => {
        creator.expendPointsTo('dexterity', 5)
        expect(creator.settedCharacteristics().dexterity).toBe(5)
      })
      test('When i spend 5 points to dexterity Then i have 55 points to spend', () => {
        creator.expendPointsTo('dexterity', 5)
        expect(creator.remainderPoints()).toBe(55)
      })
      test('When i select 5 to dexterity And Select 2 to dexterity Then dexterity is 7 And left 53 points to spend', () => {
        creator.expendPointsTo('dexterity', 5)
        creator.expendPointsTo('dexterity', 2)
        const { dexterity } = creator.settedCharacteristics()
        expect(dexterity).toBe(7)
        expect(creator.remainderPoints()).toBe(53)
      })
      test('When i expend 10 points to dexterity Then i have 49 points remaind to expend', () => {
        creator.expendPointsTo('dexterity', 10)
        expect(creator.remainderPoints()).toBe(49)
      })
      test('When i disable the "the ten cost two points" Then i have 50 points remaind to expend', () => {
        creator.disableRule('the ten cost two points')
        creator.expendPointsTo('dexterity', 10)
        expect(creator.remainderPoints()).toBe(50)
      })
      test('When i try to expend more than 60 Then i get Error', () => {
        const expendAllPoints = () => {
          for (const name of listOfCharacteristics) {
            creator.expendPointsTo(name, 10)
          }
        }
        expect(expendAllPoints).toThrow('points to expend exeded')
      })
      test('when i try to expend more than 60 Then i have 5 points left', () => {
        const expendAllPoints = () => {
          for (const name of listOfCharacteristics) {
            creator.expendPointsTo(name, 10)
          }
        }
        try {
          expendAllPoints()
        } catch {}
        expect(creator.remainderPoints()).toBe(5)
      })
      test('expend 11 points to dexterity Then i get a error', () => {
        expect(() => creator.expendPointsTo('dexterity', 11)).toThrow('the maximun value of the characteristics is ten')
      })

      test('disable rule of "the maximun value of the characteristics is ten" And add 11 to dexterity then i have 11 to dexterity', () => {
        creator.disableRule('the maximun value of the characteristics is ten').expendPointsTo('dexterity', 11)
        const { dexterity } = creator.settedCharacteristics()
        expect(dexterity).toBe(11)
      })

      test('And select 5 to dexterity And remove 4 to dexterity Then i have 1 of dexterity And i have 59 points remaind', () => {
        creator.expendPointsTo('dexterity', 5)
          .removePointsTo('dexterity', 4)
        expect(creator.settedCharacteristics().dexterity).toBe(1)
        expect(creator.remainderPoints()).toBe(59)
      })

      test(' And select 5 to dexterity And i remove 6 to dexterity then i get a error', () => {
        creator.expendPointsTo('dexterity', 5)
        expect(() => creator.removePointsTo('dexterity', 6)).toThrow('You are trying to remove 6 to dexterity but only have 5')
      })

      test('And select 5 to dexterity and remove points to dexterity then dexterity not have points', () => {
        creator.expendPointsTo('dexterity', 5)
        creator.removePointsTo('dexterity')
        expect(creator.nonSetCharacteristics()).toEqual(expect.arrayContaining(['dexterity']))
      })

      test('4 and i remove 6 to dexterity then i have a error', () => {
        expect(() => creator.removePointsTo('dexterity', 6)).toThrow('the dexterity not have any value')
      })
    })
  })
})
