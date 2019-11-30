/* eslint-env jest */
const { defineFeature, loadFeature } = require('jest-cucumber')

const Ability = require('./Ability.js')

const feature = loadFeature('./src/abilities/Ability.feature')

defineFeature(feature, test => {
  let ability = null

  const newAbility = (given) => {
    given(/^a new Ability$/, () => {
      ability = new Ability('test')
    })
  }

  test('Create a ability', ({ given, and, then }) => {
    given(/^a (.*) ability with (\d+) points$/, (name, points) => {
      ability = new Ability(name, parseInt(points), 'strength')
    })
    then(/^the value is (\d+)$/, (value) => {
      expect(ability.value).toBe(parseInt(value))
    })
    and(/^the base is (\d+)$/, (base) => {
      expect(ability.base).toBe(parseInt(base))
    })
    and(/^the bonus value is (\d+)$/, (bonus) => {
      expect(ability.bonus).toBe(parseInt(bonus))
    })
    and(/^the name is (.*)$/, (name) => {
      expect(ability.name).toBe(name)
    })
    and(/^the rate is (\d+)$/, (rate) => {
      expect(ability.rate).toBe(parseInt(rate))
    })
    and('the dependency is strength', () => {
      expect(ability.dependency).toBe('strength')
    })
  })

  test('enhance Ability', ({ given, and, then }) => {
    newAbility(given)

    and(/^enhance by 5 points$/, () => {
      ability = ability.enhance(5)
    })

    then(/^the value is 5$/, () => {
      expect(ability.value).toBe(5)
    })

    test('decrease Ability', ({ given, then, and }) => {
      given(/^a new Ability with 10 points$/, () => {
        ability = new Ability('test', 10)
      })

      and(/^decrease 5 points$/, () => {
        ability = ability.decrease(5)
      })

      then(/^the value is 5$/, () => {
        expect(ability.value).toBe(5)
      })
    })

    test('add a bonus', ({ given, then, and }) => {
      given(/^a new Ability$/, () => {
        ability = new Ability('test')
      })

      and(/^add a bonus of 5$/, () => {
        ability = ability.addBonus({ reason: 'test bonus', value: 5 })
      })

      then(/^the value is 5$/, () => {
        expect(ability.value).toBe(5)
      })
    })

    test('remove bonus', ({ given, then, and }) => {
      given(/^a Ability with bonus of 5$/, () => {
        ability = new Ability('test', 0, '', 1 [
          { reason: 'test', value: 5 }])
      })
      and(/^remove a bonus of a ability$/, () => {
        ability = ability.removeBonus('test')
      })
      then(/^the value is 0$/, () => {
        expect(ability.value).toBe(0)
      })
    })
    test('negative bonus', ({ given, then, and }) => {
      given(/^a Ability with bonus of -5$/, () => {
        ability = new Ability('test', 0, '', 1, [{ reason: 'test', value: -5 }])
      })

      then(/^the value is -5$/, () => {
        expect(ability.value).toBe(-5)
      })
    })
    test('equality', ({ given, then, and }) => {
      let secondAbility = {}
      given(/^a ability atack of 10$/, () => {
        ability = new Ability('atack', 10)
      })
      and(/^a second ability atack of 10$/, () => {
        secondAbility = new Ability('atack', 10)
      })
      then(/^the two abilities are equal$/, () => {
        expect(ability.equal(secondAbility)).toBe(true)
      })
    })
    test('inequality', ({ given, then, and }) => {
      let secondAbility = {}
      given(/^a ability of atack 10$/, () => {
        ability = new Ability('atack', 10)
      })
      and(/^a second ability of dodge 15$/, () => {
        secondAbility = new Ability('dodge', 15)
      })
      then(/^the two abilities are not equal$/, () => {
        expect(ability.equal(secondAbility)).toBe(false)
      })
    })
  })
})
