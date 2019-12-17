/* eslint-env jest */
const CharacterCreator = require('./CharacterCreator')
const listOfBasicInfo = require('../characterBasicInfo/listOfCharacterBasicInfo')
const listOfCharacteristics = require('../characteristics/listOfAnimaCharacteristics')
describe('Creation of a character', () => {
  const characterCreator = new CharacterCreator()
  const newCreator = () => new CharacterCreator()

  const newCreatorWithType = type => {
    const creator = newCreator()
    creator.generatePoints(type)
    return creator
  }

  const creatorWithType1 = () => newCreatorWithType(1)

  const creatorWithType4 = () => newCreatorWithType(4)

  const creatorWithType5And60Points = () => {
    const creator = newCreator()
    creator.setPoints(60).generatePoints(5)
    return creator
  }
  const creatorWidthAllCharacteristicsSetted = () => {
    const creator = creatorWithType1()
    listOfCharacteristics.map(x => creator.selectGreatestValueTo(x))
    return creator
  }

  test('when the creation begings all the basic info is not seted', () => {
    expect(characterCreator.nonSetBasicInfo()).toEqual(expect.arrayContaining(listOfBasicInfo))
  })
  test('before i set the name then i see the name ass null', () => {
    const { name } = characterCreator.settedBasicInfo()
    expect(name).toBe(undefined)
  })

  test('when i set the name then i see the name setted', () => {
    characterCreator.setBasicInfo('name', 'Parrish')
    const { name } = characterCreator.settedBasicInfo()
    expect(name).toBe('Parrish')
  })

  test.each([
    ['description', 'generic description'],
    ['personality', 'generic personality'],
    ['lore', 'generic lore'],
    ['age', 20],
    ['race', 'human']
  ])('when i set %s as %s then i see tne value setted',
    (name, value) => {
      characterCreator.setBasicInfo(name, value)
      const setted = characterCreator.settedBasicInfo()
      expect(setted[name]).toBe(value)
    })

  test('when generate points i get 8 values', () => {
    const generatedPoints = characterCreator.generatePoints(1)
    expect(generatedPoints.nonSetGenerationValues().length).toBe(8)
  })

  test('when generate points.type 4 i get points less or equal 70', () => {
    const generatedPoints = characterCreator.generatePoints(4)
    expect(generatedPoints.remainerPoints()).toBeLessThanOrEqual(70)
  })

  test('when select 60 points i have 60 points', () => {
    characterCreator.setPoints(60)
    characterCreator.generatePoints(5)
    expect(characterCreator.remainerPoints()).toBe(60)
  })

  test('when i generate points again i get the same values', () => {
    const firstPoints = characterCreator.generatePoints(3)
    const secondPoints = characterCreator.generatePoints(3)
    expect(firstPoints).toEqual(secondPoints)
  })

  describe('points selection', () => {
    test('Given a new creator them pointAlreadyGenerathed must be false', () => {
      const creator = newCreator()
      expect(creator.isPoinsAlreadyGenerated()).toBe(false)
    })

    test('Given a new creator Then access to generator type twow a error', () => {
      const creator = newCreator()
      expect(() => creator.generationType()).toThrow()
    })

    test('Given a creator width type1 generator then i get generate type "values"', () => {
      const creator = creatorWithType1()
      expect(creator.generationType()).toBe('values')
    })

    test('Given a creator with type 4 generator Then i get generate type "points"', () => {
      const creator = creatorWithType4()
      expect(creator.generationType()).toBe('points')
    })

    test('Given a creator with type 1 generation And change to type 4 generation Then the generation type is points', () => {
      const creator = creatorWithType1()
      creator.generatePoints(4)
      expect(creator.generationType()).toBe('points')
    })

    test('Given a creator with type 4 generation And change to type 1 generation Then the generation type is values', () => {
      const creator = creatorWithType4()
      creator.generatePoints(1)
      expect(creator.generationType()).toBe('values')
    })

    test('Given a new creator Then the nonSettedCharacteristics contains all characteristics', () => {
      const creator = newCreator()
      expect(creator.nonSetCharacteristics()).toEqual(expect.arrayContaining(listOfCharacteristics))
    })

    test('Given a creator with type 1 And select greatest value to dexterity Then i get the characteristic dexterity with the greatestValue', () => {
      const creator = creatorWithType1()
      const greatestValue = creator.getGreatestNonSetValue()
      creator.selectGreatestValueTo('dexterity')
      const { dexterity } = creator.settedCharacteristics()
      expect(dexterity).toBe(greatestValue)
    })

    test('Given a creatpr with type 1 And select the smalest value to dexterity Then i get the characteristic of dexterity woth the smalest value', () => {
      const creator = creatorWithType1()
      const smalestValue = creator.getSmalestNonSetValue()
      creator.selectSmalestValueTo('dexterity')
      const { dexterity } = creator.settedCharacteristics()
      expect(dexterity).toBe(smalestValue)
    })

    test('Given a creator with type1 And i select a value to dexterity Then the value is on dexterity', () => {
      const creator = creatorWithType1()
      const firstValue = creator.nonSetGenerationValues()[0]
      creator.selectValueTo('dexterity', firstValue)
      const { dexterity } = creator.settedCharacteristics()
      expect(dexterity).toBe(firstValue)
    })

    test('Given a creator widrh type 1 And i selexta a value to dexterity that not is in notSetGenerationValues Then throw error', () => {
      const creator = creatorWithType1()
      expect(() => creator.selectValueTo('dexterity', 2000)).toThrow()
    })

    test('Given a creator with type 1 And select a value to dexterity And i remove the value of the dexterity Then the value is in nonSetGeneratorValue', () => {
      const creator = creatorWithType1()
      const firstValue = creator.nonSetGenerationValues()[0]
      creator.selectValueTo('dexterity', firstValue)
      creator.removeValueTo('dexterity')
      expect(creator.nonSetGenerationValues()).toEqual(expect.arrayContaining([firstValue]))
    })
  })

  describe('physical capacities', () => {
    test('Given a type 1 creator And i select the greates to physique Then fatigue is the same as physique', () => {
      const creator = creatorWithType1()
      creator.selectGreatestValueTo('physique')
      expect(creator.settedPhysicalCapacities().fatigue).toBe(creator.settedCharacteristics().physique)
    })
    test('Given a type 1 creator And i select the greatest to agility Then movement type is the same as agility', () => {
      const creator = creatorWithType1()
      creator.selectGreatestValueTo('agility')
      expect(creator.settedPhysicalCapacities()['movement type']).toBe(creator.settedCharacteristics().agility)
    })
    test('The physical capacities cant be accesed witoud the characteristics than are linked', () => {
      const creator = creatorWithType1()
      expect(creator.settedPhysicalCapacities().fatigue).toBe(undefined)
      expect(creator.settedPhysicalCapacities()['movement type']).toBe(undefined)
    })
  })
  describe('secondary characteristics', () => {
    describe('appearance', () => {
      test('Given a generator And not set appearance then i have a random value in appearance', () => {
        const creator = newCreator()
        expect(creator.settedSecondaryCharacteristics().appearance).toBeTruthy()
      })
      test('Given a creator and i set appearance to 5 then i get a error', () => {
        const creator = newCreator()
        expect(() => creator.setSecondaryCharacteristic('appearance', 5)).toThrow('appearance is random only')
      })
      test('Given a generator And i disable de rule of "appearance blocked" And set 10 to appearance then i have 10 in appearance', () => {
        const creator = newCreator()
        creator.disableRule('appearance blocked')
        creator.setSecondaryCharacteristic('appearance', 10)
        expect(creator.settedSecondaryCharacteristics().appearance).toBe(10)
      })
      test('Given a generator And set 11 to appearance Then i get a error', () => {
        const creator = newCreator()
        creator.disableRule('appearance blocked')
        expect(() => creator.setSecondaryCharacteristic('appearance', 11)).toThrow('the maximun value of appearance is ten')
      })
      test('Given a Creator And and i disable the rule of "appearance blocked" And i set 10 to appearance and them remove it i have the same random value', () => {
        const creator = newCreator()
        const { appearance: expected } = creator.settedSecondaryCharacteristics()
        creator.disableRule('appearance blocked')
          .setSecondaryCharacteristic('appearance', 5)
          .resetSecondaryCharacteristic('appearance')
        expect(creator.settedSecondaryCharacteristics().appearance).toBe(expected)
      })
    })
    describe('size', () => {
      test('Given a generator with all characteristics setted them i have size equal to strenght and psysique ', () => {
        const creator = creatorWidthAllCharacteristicsSetted()
        const { strength, physique } = creator.settedCharacteristics()
        expect(creator.settedSecondaryCharacteristics().size).toBe(strength + physique)
      })
      test('Given a generator of type 5 and add 5 and 5 to strenght an physique then  my minimun height is 140 and maximun is 170 and weight is minimun in 40 and maximun is 90', () => {
        const creator = creatorWithType5And60Points()
        creator.expendPointsTo('physique', 5)
          .expendPointsTo('strength', 5)
        expect(creator.minHeightSupported()).toBe(140)
        expect(creator.maxHeightSupported()).toBe(170)
        expect(creator.minWeightSupported()).toBe(40)
        expect(creator.maxWeightSupported()).toBe(90)
      })
      test('Given a generator of type 5 And expend 5 and 5 in strenght and physique And select the body type in slim then the minimum height is 120 the maximun is 170 and weight minimun is 35 and the maximun is 90', () => {
        const creator = creatorWithType5And60Points()
        creator.expendPointsTo('physique', 5)
          .expendPointsTo('strength', 5)
          .setBasicInfo('slim', true)

        expect(creator.minHeightSupported()).toBe(120)
        expect(creator.maxHeightSupported()).toBe(170)
        expect(creator.minWeightSupported()).toBe(35)
        expect(creator.maxWeightSupported()).toBe(90)
      })
      test('Given a generator and get the supported height and weight then i get error', () => {
        const creator = newCreator()
        expect(() => creator.minHeightSupported()).toThrow()
        expect(() => creator.maxHeightSupported()).toThrow()
        expect(() => creator.minWeightSupported()).toThrow()
        expect(() => creator.maxWeightSupported()).toThrow()
      })
      test('Given a generator And disable the rule of "size limitations" Then supported height weight is o and infinity', () => {
        const creator = newCreator()
        creator.disableRule('size limitations')
        expect(creator.minHeightSupported()).toBe(0)
        expect(creator.maxHeightSupported()).toBe(Infinity)
        expect(creator.minWeightSupported()).toBe(0)
        expect(creator.maxWeightSupported()).toBe(Infinity)
      })
      test('Given a generator of type 5 And expend 5 and 5 in strenght and physique and select the body type slim then i can set weigth 120 but not 119, and weight to 35 but not 34', () => {
        const creator = creatorWithType5And60Points()
        creator.expendPointsTo('physique', 5)
          .expendPointsTo('strength', 5)
          .setBasicInfo('slim', true)
        expect(() => creator.setBasicInfo('height', 120)).not.toThrow()
        expect(() => creator.setBasicInfo('height', 119)).toThrow()
        expect(() => creator.setBasicInfo('weight', 35)).not.toThrow()
        expect(() => creator.setBasicInfo('weight', 34)).toThrow()
      })
      test('Given a generator of type 5 And expend 5 and 5 in strenght and physique And select the body type in slim then i can set weigth 170 but not 171, and weight to 90 but not 91', () => {
        const creator = creatorWithType5And60Points()
        creator.expendPointsTo('physique', 5)
          .expendPointsTo('strength', 5)
          .setBasicInfo('slim', true)
        expect(() => creator.setBasicInfo('height', 120)).not.toThrow()
        expect(() => creator.setBasicInfo('height', 110)).toThrow()
        expect(() => creator.setBasicInfo('weight', 35)).not.toThrow()
        expect(() => creator.setBasicInfo('weight', 34)).toThrow()
      })
    })
  })

  describe('development points', () => {
    test('Given a new creator And i get development points then i get error', () => {
      const creator = newCreator()
      expect(() => creator.developmentPoints).toThrow()
    })
    test('Given a new creator And i set level 1 Then the pd is 600', () => {
      const creator = newCreator()
      const rule = creator.rules.rules['pd linked to level'].rule = jest.fn(creator.rules.rules['pd linked to level'].rule)
      creator.setBasicInfo('level', 1)
      expect(rule).toBeCalled()
      expect(creator.developmentPoints).toBe(600)
    })
    test('Given a new creator And i set pd to 300 Then i get a error', () => {
      const creator = newCreator()
      expect(() => { creator.developmentPoints = 300 }).toThrow()
    })
    test('Given a new creator And i disable the rulejof "pd linked to level" And i set pd to 300 Then the pd is 300', () => {
      const creator = newCreator()
      creator.disableRule('pd linked to level')
      creator.developmentPoints = 300
      expect(creator.developmentPoints).toBe(300)
    })
  })
})
