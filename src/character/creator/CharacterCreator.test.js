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
    test('the shop stock have 8 values', () => {
      expect(
        newCharacter.data.pointsShop.values.stock
          .length
      ).toBe(8)
    })
    describe('Select characteristics', () => {
      beforeAll(() => {
        const {
          points,
        } = newCharacter.data.generatedRolls
        const {
          names,
        } = newCharacter.data.characteristics
        for (let i = 0; i < 8; i += 1) {
          newCharacter.characteristicsSelection.select(
            names[i],
            points[i]
          )
        }
      })
      test('the skop of shop have 0 values', () => {
        expect(
          newCharacter.data.pointsShop.values
            .stock.length
        ).toBe(0)
      })
      test('movement type must be equal to agility', () => {
        const agility = newCharacter.data.characteristics.get(
          'agility'
        ).value
        const movementType = newCharacter.data.physicalCapacities.get(
          'movement type'
        ).value
        expect(agility).toBe(movementType)
      })

      test('fatigue must be equal to physique', () => {
        const physique = newCharacter.data.characteristics.get(
          'physique'
        ).value
        const fatigue = newCharacter.data.physicalCapacities.get(
          'fatigue'
        ).value
        expect(physique).toBe(fatigue)
      })

      test('size is strength added to physique', () => {
        const size = newCharacter.data.secondaryCharacteristics.get(
          'size'
        ).value
        const strength = newCharacter.data.characteristics.get(
          'strength'
        ).value
        const physique = newCharacter.data.characteristics.get(
          'physique'
        ).value

        expect(size).toBe(strength + physique)
      })

      test('appearance must be random', () => {
        const appearance = newCharacter.data.secondaryCharacteristics.get(
          'appearance'
        ).value
        expect(appearance).toBeLessThanOrEqual(10)
        expect(appearance).toBeGreaterThanOrEqual(
          1
        )
      })

      describe('Select body', () => {
        let weight
        let height
        beforeAll(() => {
          newCharacter.physicalAttibutesSelector.selectBodyType(
            'slim'
          )
          const limits =
            newCharacter.physicalAttibutesSelector
              .bodyLimits
          weight = limits.weight.from
          height = limits.height.from
          newCharacter.physicalAttibutesSelector
            .selectHeight(height)
            .selectWeight(weight)
        })

        test('height must be the minimun slim height', () => {
          const characterHeight =
            newCharacter.data.body.height
          expect(height).toBe(characterHeight)
        })
        test('weight must be the minimun slim weight', () => {
          const characterWeight =
            newCharacter.data.body.weight
          expect(weight).toBe(characterWeight)
        })
      })
    })
  })
})
