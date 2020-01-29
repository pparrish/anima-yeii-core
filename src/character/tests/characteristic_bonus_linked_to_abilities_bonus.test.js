/* eslint-env jest */
const CharacterCreator = require('../CharacterCreator')

describe('Characteristics bonus linked to abilities bonus', () => {
  describe('Creator of type 4', () => {
    let creator = {}
    beforeEach(() => {
      creator = new CharacterCreator()
    })
    describe('select 60 points', () => {
      beforeEach(() => {
        creator.setPoints(60).generatePoints(5)
      })
      test('when spend 9 points in agility, then dance must have a characteristic bonus of 10', () => {
        creator.expendPointsTo('agility', 9)
        expect(
          creator
            .ability('dance')
            .bonuses.find(
              x => x.reason === 'characteristic'
            ).value
        ).toBe(10)
      })
    })
  })
})
