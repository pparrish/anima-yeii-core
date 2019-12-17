const RulesHandler = require('../rulesHandler/RulesHandler')

const D10 = require('../dices/d10')
const d10 = new D10()
const developmentPointsTable = require('../developmentPoints/developmentPointsTable')
const categories = require('../categories')
const sizeTable = require('../secondaryCharacteristics/sizeTable')

const addWhenItReachesTheValue = (toAdd, toReach) => (value) => value >= toReach ? value + toAdd : value

const addOneWhenReachTeen = addWhenItReachesTheValue(1, 10)

const theTenCostTwoPoints = (spended) => spended.map(addOneWhenReachTeen)
const pathEnd = path => path.split('/').pop()

const throwErrorWhenExceeds = (toExceed, message) => (value) => {
  if (value > toExceed) throw new Error(message)
  return value
}
const limitValueToTen = (message) => throwErrorWhenExceeds(10, message)

/* TODO change the context to get the name of characteristic */
const theMaximunValueOfCharacteristicIsTen = (characteristic) => limitValueToTen('the maximun value of the characteristics is ten')(characteristic)

const theMaximunValueOfAppearanceIsTen = (appearanceValue) => limitValueToTen('the maximun value of appearance is ten')(appearanceValue)

module.exports = () => {
  const rules = new RulesHandler()

  /* Characteristics */
  rules.add('the ten cost two points',
    'points/spends',
    theTenCostTwoPoints)

  /* Characteristics limits */
    .add('the maximun value of the characteristics is ten',
      'characteristics/set',
      theMaximunValueOfCharacteristicIsTen)

  /* Characteristics links */
    .add('physique is fatigue',
      'characteristics/set/physique',
      (physique, aCreator) => {
        aCreator._set('fatigue', physique, 'physicalCapacities')
        return physique
      })

    .add('agility is movement type',
      'characteristics/set/agility',
      (agility, aCreator) => {
        aCreator._set('movement type', agility, 'physicalCapacities')
        return agility
      })

    .add('Size is strength added to physique',
      ['characteristics/setted/strength', 'characteristics/setted/physique'],
      (_, creator) => {
        const { strength, physique } = creator.settedCharacteristics()
        if (!strength || !physique) return
        creator._set('size', strength + physique, 'secondaryCharacteristics')
      })

  /* Appearance */
    .add('appearance blocked',
      'secondaryCharacteristics/set/appearance',
      () => {
        throw new Error('appearance is random only')
      })

    .add('appearance is random',
      'creator/init',
      (creator) => {
        creator._appearance = d10.roll()
      })

    .add('the maximun value of appearance is ten',
      'secondaryCharacteristics/set/appearance',
      theMaximunValueOfAppearanceIsTen,
      {
        hidden: true
      })

    .add('size limitations',
      ['basicInfo/set/height', 'basicInfo/set/weight'],
      (value, creator, path) => {
        const { size } = creator.settedSecondaryCharacteristics()
        if (!size) throw new Error('size is not defined, first set strength and physique')
        const { slim } = creator.settedBasicInfo()
        const targetName = pathEnd(path)
        const target = sizeTable[targetName]
        if (!target) throw new Error('only height and weight admited')
        if (!target.from.check(size, value, slim)) throw new Error(`${targetName} ${value} must be greatest or equal than ${creator.minHeightSupported()}`)
        if (!target.to.check(size, value)) throw new Error(`${targetName} ${value} must be less or equal than ${creator.maxHeightSupported()}`)
        return value
      })

  /* base -30 rule */
    .add('base -30',
      'creator/init',
      (_, creator) => {
        creator.combatAbilities.addBonus({
          reason: 'base -30',
          value: -30,
          baseBonus: true
        })
        creator.supernaturalAbilities.addBonus({
          reason: 'base -30',
          value: -30,
          baseBonus: true
        })
      },
      {
        disable (_, creator) {
          creator.combatAbilities.removeBonus('base -30')
          creator.supernaturalAbilities.removeBonus('base -30')
        },
        enable (_, creator) {
          creator.combatAbilities.addBonus({
            reason: 'base -30',
            value: -30,
            baseBonus: true
          })
          creator.supernaturalAbilities.addBonus({
            reason: 'base -30',
            value: -30,
            baseBonus: true
          })
        },
        childs: ['refound all points add -30 bonus', 'spenden in a ability remove -30 bonus']
      })

    .add('spenden in a ability remove -30 bonus',
      'pd/spend',
      ({ name, value }, creator) => {
        if (creator.combatAbilities.has(name)) { creator.combatAbilities.removeBonusOf(name, 'base -30') }
        if (creator.supernaturalAbilities.has(name)) { creator.supernaturalAbilities.removeBonusOf(name, 'base -30') }
        return { name, value }
      })

    .add('refound all points add -30 bonus',
      'pd/refound',
      ({ name, value }, creator) => {
        if (creator.developmentPointsShop.buyList[name] && creator.developmentPointsShop.buyList[name] - value === 0) {
          if (creator.combatAbilities.has(name)) {
            creator.combatAbilities.addBonusOf(name, {
              reason: 'base -30',
              value: -30,
              baseBonus: true
            })
          }
          if (creator.supernaturalAbilities.has(name)) {
            creator.supernaturalAbilities.addBonusOf(name, {
              reason: 'base -30',
              value: -30,
              baseBonus: true
            })
          }
        }
        return { name, value }
      })

  /* abilities */
    .add('ability minimun 5',
      'pd/spend',
      ({ name, value }, creator) => {
        if (!creator.developmentPointsShop.buyList[name] && value < 5) {
          throw new Error('cannot enhance bellow 5')
        }
        if (creator.developmentPointsShop.buyList[name] && creator.developmentPointsShop.buyList[name] + value < 5) throw new Error('cannot enhance bellow 5')
        return { name, value }
      },
      { childs: ['cannot decrease bellow 5'] }
    )

    .add('cannot decrease bellow 5',
      'pd/refound',
      ({ name, value }, creator) => {
        if (creator.developmentPointsShop.buyList[name] && creator.developmentPointsShop.buyList[name] - value < 5 && creator.developmentPointsShop.buyList[name] - value > 0) throw new Error('cannot enhance bellow 5')
        return { name, value }
      })

  /* Categories */
    .add('select category',
      'category/set',
      (name, creator) => {
        const category = categories.find(cat => cat.name === name)
        if (!category) throw new Error('the category does not exist')
        creator.developmentPointsShop.mergeCatalog(category.primaryAbilities.combatAbilities)
        creator.developmentPointsShop.mergeCatalog(category.primaryAbilities.supernaturalAbilities)
        return category
      })

  /* development points */
    .add('pd linked to level',
      'basicInfo/set/level',
      (level, creator) => {
        creator._pd = developmentPointsTable.get(level)
        return level
      },
      {
        childs: ['pd based on level', 'set pd disabled']
      }
    )

    .add('pd based on level',
      'pd/get',
      (_, creator) => {
        const { level } = creator.settedBasicInfo()
        if (!level) throw new Error('level is not setted use CharacterCreator.setBasicInfo("level", value)')
      })

    .add('set pd disabled',
      'pd/set',
      () => {
        throw new Error('pd only be setted by level')
      })

    .add('select category to spend pd',
      'pd/spend',
      ({ name, value }, creator) => {
        if (!creator.category) throw new Error('select category to spend development points')
        return { name, value }
      })

  /* pd limits */
    .add('development points limit',
      'pd/spend',
      ({ name, value }, creator) => {
        const balance = creator.developmentPointsShop.balance
        const cost = creator.developmentPointsShop.catalog[name] * value
        if (balance + cost > creator.developmentPoints) throw new Error('development points exeded')
        return { name, value }
      })

    .add('offencive and defencive limits',
      'pd/spend/combatAbilities',
      ({ name, value }, creator) => {
        if (name !== 'attack' && name !== 'dodge' && name !== 'stop') return { name, value }

        const limit = creator.developmentPoints / 2
        let spended = creator.developmentPointsShop.catalog[name] * value
        spended += creator.developmentPointsSpendedIn('attack')
        spended += creator.developmentPointsSpendedIn('dodge')
        spended += creator.developmentPointsSpendedIn('stop')

        if (spended > limit) throw new Error('the limit of offensive and defensive is ' + limit)

        return { name, value }
      })

    .add('offencive and deffensive diference limit',
      'pd/spend/combatAbilities',
      ({ name, value }, creator) => {
        if (name !== 'attack' && name !== 'dodge' && name !== 'stop') return { name, value }
        let attack = creator.combatAbilities.get('attack').base
        let dodge = creator.combatAbilities.get('dodge').base
        let stop = creator.combatAbilities.get('stop').base
        attack = name === 'attack' ? attack + value : attack
        dodge = name === 'dodge' ? dodge + value : dodge
        stop = name === 'stop' ? stop + value : stop

        const dominantDefense = stop > dodge ? stop : dodge
        const limit = creator.developmentPoints / 4
        if (creator.developmentPointsSpendedIn('attack') === 0) {
          let spended = creator.developmentPointsShop.catalog[name] * value
          spended += creator.developmentPointsSpendedIn('dodge')
          spended += creator.developmentPointsSpendedIn('stop')
          if (spended > limit) throw new Error('the limit of dodge and stop is ' + limit)
        } else if (creator.developmentPointsSpendedIn('dodge') === 0 && creator.developmentPointsSpendedIn('stop') === 0) {
          let spended = creator.developmentPointsShop.catalog[name] * value
          spended += creator.developmentPointsSpendedIn('attack')
          if (spended > limit) throw new Error('the limit of attack is ' + limit)
        } else if (Math.abs(dominantDefense - attack) > 50) {
          throw new Error('attack and defense diference cannot be more than 50')
        }
        return { name, value }
      })

    .add('combat abilities limit',
      'pd/spend/combatAbilities',
      ({ name, value }, creator) => {
        if (name in creator._category.primaryAbilities.combatAbilities) {
          const limit = creator.developmentPoints * (creator._category.limits.combatAbilities / 100)
          let spended = creator.developmentPointsShop.catalog[name] * value
          for (const ability in creator.developmentPointsShop.buyList) {
            if (ability in creator._category.primaryAbilities.combatAbilities) {
              spended += creator.developmentPointsSpendedIn(name)
            }
          }
          if (spended > limit) throw new Error(`the limit of pd for combat abilities is ${limit}`)
        }
        return { name, value }
      })

    .add('sobrenatural abilities limits',
      'pd/spend/supernaturalAbilities',
      ({ name, value }, creator) => {
        const limit = creator.developmentPoints * (creator._category.limits.supernaturalAbilities / 100)
        let spended = creator.developmentPointsShop.catalog[name] * value
        spended += creator.developmentPointsSpendedIn('magic projection')
        spended += creator.developmentPointsSpendedIn('summon')
        spended += creator.developmentPointsSpendedIn('domain')
        spended += creator.developmentPointsSpendedIn('tie')
        spended += creator.developmentPointsSpendedIn('unsummon')
        if (spended > limit) throw new Error('the limit of supernatural abilities is ' + limit)

        return { name, value }
      })

    .add('magic projection limit',
      'pd/spend/supernaturalAbilities',
      ({ name, value }, creator) => {
        const limit = (creator.developmentPoints * (creator._category.limits.supernaturalAbilities / 100)) / 2
        let spended = creator.developmentPointsShop.catalog[name] * value
        spended += creator.developmentPointsSpendedIn('magic projection')
        if (spended > limit) throw new Error('the pd limit to spend in magic projection is ' + limit)

        return { name, value }
      })

  return rules
}
