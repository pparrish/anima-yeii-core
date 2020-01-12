/* eslint-env jest */
const NaturalAbilitiesSelection = require('../NaturalAbilitiesSelection')
const SecondaryAbilities = require('../../secondaryAbilities/SecondaryAbilities')
const BasicInfo = require('../../characterBasicInfo/CharacterBasicInfo')
describe('natural improvement', () => {
  describe('natural abilities selection', () => {
    let naturalAbilitiesSelection = {}
    let basicInfo = {}
    let secondaryAbilities = {}
    beforeEach(() => {
      basicInfo = new BasicInfo()
      secondaryAbilities = new SecondaryAbilities()
      naturalAbilitiesSelection = new NaturalAbilitiesSelection(secondaryAbilities, basicInfo)
    })
    describe('level 1', () => {
      beforeEach(() => {
        basicInfo.changeValueOf('level', 1)
      })
      test('the remaining abilities to chose is 5', () => {
        expect(naturalAbilitiesSelection.remaining).toBe(5)
      })
      describe('choose', () => {
        test('when choose jump then jump have a bonus of "natural ability"', () => {
          naturalAbilitiesSelection.choose('jump')
          const jump = secondaryAbilities.get('jump')
          const bonus = { reason: 'natural ability', value: 10 }
          expect(jump.bonuses).toContainEqual(bonus)
        })
        test('when choose dance then remaining abilities is 4', () => {
          naturalAbilitiesSelection.choose('dance')
          expect(naturalAbilitiesSelection.remaining).toBe(4)
        })
        test('when choose search two times i get error', () => {
          naturalAbilitiesSelection.choose('search')
          expect(() => naturalAbilitiesSelection.choose('search')).toThrow('you can only choose the same ability once')
        })
        test('when remaining is 0, i cannot coose more abilities', () => {
          naturalAbilitiesSelection.choose('search')
          naturalAbilitiesSelection.choose('jump')
          naturalAbilitiesSelection.choose('dance')
          naturalAbilitiesSelection.choose('swim')
          naturalAbilitiesSelection.choose('style')
          expect(() => naturalAbilitiesSelection.choose('persuasion')).toThrow('you can only choose 5 abilities by level')
        })
      })
      describe('discard', () => {
        test('when i discard a ability than not choose i get a error', () => {
          expect(() => {
            naturalAbilitiesSelection.discard('style')
          }).toThrow('style not have been choosen')
        })
        describe('chose jump, search and dance', () => {
          beforeEach(() => {
            naturalAbilitiesSelection.choose('search')
            naturalAbilitiesSelection.choose('jump')
            naturalAbilitiesSelection.choose('dance')
          })
          test('when discard jump then the remaining is 3', () => {
            naturalAbilitiesSelection.discard('jump')
            expect(naturalAbilitiesSelection.remaining).toBe(3)
          })
          test('when discad jump then the bonus of "natural Ability " is removed', () => {
            naturalAbilitiesSelection.discard('jump')
            const jump = secondaryAbilities.get('jump')
            const bonus = { reason: 'natural ability', value: 10 }
            expect(jump.bonuses).not.toContainEqual(bonus)
          })
        })
      })
    })
  })
})
