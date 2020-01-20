/* eslint-env jest */
import BonusHandler from '../BonusHandler'

const NaturalAbilitiesSelection = require('../NaturalAbilitiesSelection')
const SecondaryAbilities = require('../../secondaryAbilities/SecondaryAbilities')
const NaturalBonusSelection = require('../NaturalBonusSelection')
const CharacterCreator = require('../CharacterCreator')

describe('natural improvement', () => {
  describe('natural abilities selection', () => {
    let bonusHandler
    let naturalAbilitiesSelection = {}
    let secondaryAbilities = {}
    beforeEach(() => {
      secondaryAbilities = new SecondaryAbilities()
      bonusHandler = new BonusHandler()
      bonusHandler.addCollection(
        'secondaryAbilities',
        secondaryAbilities
      )
      naturalAbilitiesSelection = new NaturalAbilitiesSelection(
        secondaryAbilities,
        bonusHandler
      )
    })
    test('the remaining abilities to chose is 5', () => {
      expect(
        naturalAbilitiesSelection.remaining
      ).toBe(5)
    })
    describe('choose', () => {
      test('when choose jump then jump have a bonus of "natural ability"', () => {
        naturalAbilitiesSelection.choose('jump')
        const jump = secondaryAbilities.get(
          'jump'
        )
        const bonus = {
          reason: 'natural ability',
          value: 10,
        }
        expect(jump.bonuses).toContainEqual(bonus)
      })
      test('when choose dance then remaining abilities is 4', () => {
        naturalAbilitiesSelection.choose('dance')
        expect(
          naturalAbilitiesSelection.remaining
        ).toBe(4)
      })
      test('when choose search two times i get error', () => {
        naturalAbilitiesSelection.choose('search')
        expect(() =>
          naturalAbilitiesSelection.choose(
            'search'
          )
        ).toThrow(
          'you can only choose the same ability once'
        )
      })
      test('when remaining is 0, i cannot coose more abilities', () => {
        naturalAbilitiesSelection.choose('search')
        naturalAbilitiesSelection.choose('jump')
        naturalAbilitiesSelection.choose('dance')
        naturalAbilitiesSelection.choose('swim')
        naturalAbilitiesSelection.choose('style')
        expect(() =>
          naturalAbilitiesSelection.choose(
            'persuasion'
          )
        ).toThrow(
          'you can only choose 5 abilities by level'
        )
      })
    })
    describe('discard', () => {
      test('when i discard a ability than not choose i get a error', () => {
        expect(() => {
          naturalAbilitiesSelection.discard(
            'style'
          )
        }).toThrow('style not have been choosen')
      })
      describe('chose jump, search and dance', () => {
        beforeEach(() => {
          naturalAbilitiesSelection.choose(
            'search'
          )
          naturalAbilitiesSelection.choose('jump')
          naturalAbilitiesSelection.choose(
            'dance'
          )
        })
        test('when discard jump then the remaining is 3', () => {
          naturalAbilitiesSelection.discard(
            'jump'
          )
          expect(
            naturalAbilitiesSelection.remaining
          ).toBe(3)
        })
        test('when discad jump then the bonus of "natural Ability " is removed', () => {
          naturalAbilitiesSelection.discard(
            'jump'
          )
          const jump = secondaryAbilities.get(
            'jump'
          )
          const bonus = {
            reason: 'natural ability',
            value: 10,
          }
          expect(jump.bonuses).not.toContainEqual(
            bonus
          )
        })
      })
    })
  })
  describe('natural bonus', () => {
    let naturalBonusSelection = {}
    let characterCreator = {}
    beforeEach(() => {
      characterCreator = new CharacterCreator()
      naturalBonusSelection = new NaturalBonusSelection(
        characterCreator.characteristicsSelection,
        characterCreator.secondaryAbilities,
        characterCreator.bonusHandler
      )
    })
    describe('select a natural bonus', () => {
      test('when select a physical Ability then i can see the Ability than i select', () => {
        naturalBonusSelection.selectPhysicalAbility(
          'feats of strength'
        )
        expect(
          naturalBonusSelection.selectedPhysicalAbility
        ).toBe('feats of strength')
      })
      test('when select a non physical ability then i get a error', () => {
        expect(() =>
          naturalBonusSelection.selectPhysicalAbility(
            'persuasion'
          )
        ).toThrow(
          'persuasion is not depends on a physical characteristic'
        )
      })
      test('when i select a psychic ability i can see the Ability than i select', () => {
        naturalBonusSelection.selectPsychicAbility(
          'persuasion'
        )
        expect(
          naturalBonusSelection.selectedPsychicAbility
        ).toBe('persuasion')
      })
      test('when select a non psychic ability then i get  a error', () => {
        expect(() => {
          naturalBonusSelection
            .selectPsychicAbility(
              'feats of strength'
            )
            .toThrow(
              'feats of strength is not depends on a psychic characteristic'
            )
        })
      })
      test('when select a physical ability, then the ability have a bonus', () => {
        naturalBonusSelection.selectPhysicalAbility(
          'jump'
        )
        const {
          bonuses,
        } = characterCreator.secondaryAbilities.get(
          'jump'
        )
        const bonus = {
          reason: 'natural bonus',
          value: -40,
        }
        expect(bonuses).toContainEqual(bonus)
      })
      test('when select a physical ability and then change the value of a characteristic then the bonus change', () => {
        naturalBonusSelection.selectPhysicalAbility(
          'jump'
        )
        const beforeBonus = characterCreator.secondaryAbilities
          .get('jump')
          .bonuses.find(
            x => x.reason === 'natural bonus'
          ).value
        characterCreator.characteristicsSelection
          .generatePoints(5)
          .expendPointsTo('agility', 9)
        const afterBonus = characterCreator.secondaryAbilities
          .get('jump')
          .bonuses.find(
            x => x.reason === 'natural bonus'
          ).value
        expect(beforeBonus).not.toBe(afterBonus)
      })
      test('when i change the selection the bonus is removed from the last ability', () => {
        naturalBonusSelection.selectPhysicalAbility(
          'jump'
        )
        naturalBonusSelection.selectPhysicalAbility(
          'climb'
        )
        expect(
          characterCreator.secondaryAbilities.get(
            'jump'
          ).bonuses
        ).not.toContainEqual({
          reason: 'natural bonus',
          value: -40,
        })
      })
    })
  })
})
