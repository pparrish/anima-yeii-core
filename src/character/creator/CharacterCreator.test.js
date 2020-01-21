import CharacterCreator from './CharacterCreator'

/* eslint-env jest */
describe('Create a character', () => {
  const newCharacter = new CharacterCreator()
  describe('select type 1', () => {
    newCharacter.generateRolls.select(1)
    test('i get a generator type 1', () => {
      expect(
        newCharacter.data.generatedRolls.type
      ).toBe('type 1')
    })
    test('i get 8 values', () => {
      expect(
        newCharacter.data.generatedRolls.points
          .length
      ).toBe(8)
    })
  })
})
