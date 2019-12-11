const D10 = require('../dices/d10')
const d10 = new D10()
const developmentPointsTable = require('../developmentPoints/developmentPointsTable')
const categories = require('../categories')
const sizeTable = require('../secondaryCharacteristics/sizeTable')

module.exports = {
  '10 cost 2': {
    enabled: true,
    path: 'points/spends',
    rule: (spended) => {
      spended = spended.map(x => x >= 10 ? x + 1 : x)
      return spended
    }
  },
  '10 limit': {
    enabled: true,
    path: 'characteristics/set',
    rule: (characteristic) => {
      if (characteristic > 10) {
        throw new Error('The limit of characteristics is 10')
      }
      return characteristic
    }
  },
  'physique is fatigue': {
    enabled: true,
    hidden: true,
    path: 'characteristics/set/physique',
    rule: (physique, aCreator) => {
      aCreator._set('fatigue', physique, 'physicalCapacities')
      return physique
    }
  },
  'agility is movement type': {
    enabled: true,
    hidden: true,
    path: 'characteristics/set/agility',
    rule: (agility, aCreator) => {
      aCreator._set('movement type', agility, 'physicalCapacities')
      return agility
    }
  },
  'appearance is random': {
    enabled: true,
    hidden: true,
    path: 'creator/init',
    rule: (creator) => {
      creator._appearance = d10.roll()
    }
  },
  'appearance blocked': {
    enabled: true,
    path: 'secondaryCharacteristics/set/appearance',
    rule: () => {
      throw new Error('appearance is random only')
    }
  },
  'appearance 10 limit': {
    enabled: true,
    hidden: true,
    path: 'secondaryCharacteristics/set/appearance',
    rule (appearance) {
      if (appearance > 10) throw new Error('appearance limit is 10')
      return appearance
    }
  },
  'Size is strength added to physique': {
    enabled: true,
    hidden: true,
    path: ['characteristics/setted/strength', 'characteristics/setted/physique'],
    rule (_, creator) {
      const { strength, physique } = creator.settedCharacteristics()
      if (!strength || !physique) return
      creator._set('size', strength + physique, 'secondaryCharacteristics')
    }
  },
  'size limitations': {
    enabled: true,
    path: ['basicInfo/set/height', 'basicInfo/set/weight'],
    rule (value, creator, path) {
      if (!creator._rules['size limitations'].enabled) return value

      const { size } = creator.settedSecondaryCharacteristics()
      const { slim } = creator.settedBasicInfo()

      if (!size) throw new Error('size is not defined, first set streng and physique')

      if (path === 'basicInfo/set/height') {
        if (!sizeTable.height.from.check(size, value, slim)) throw new Error(`height ${value} must be greatest or equal than ${creator.minHeightSupported()}`)
        if (!sizeTable.height.to.check(size, value)) throw new Error(`height ${value} must be less or equal than ${creator.maxHeightSupported()}`)
      }
      if (path === 'basicInfo/set/weight') {
        if (!sizeTable.weight.from.check(size, value, slim)) throw new Error(`weight ${value} must be greatest or equal than ${creator.minWeightSupported()}`)
        if (!sizeTable.weight.to.check(size, value)) throw new Error(`weight ${value} must be less or equal than ${creator.maxWeightSupported()}`)
      }
      return value
    }
  },
  'pd linked to level': {
    enabled: true,
    hidden: true,
    path: 'basicInfo/set/level',
    rule (level, creator) {
      creator._pd = developmentPointsTable.get(level)
      return level
    },
    childs: ['pd based on level', 'set pd disabled']
  },
  'pd based on level': {
    enabled: true,
    hidden: false,
    path: 'pd/get',
    rule (_, creator) {
      const { level } = creator.settedBasicInfo()
      if (!level) throw new Error('level is not setted use CharacterCreator.setBasicInfo("level", value)')
    }

  },
  'set pd disabled': {
    enabled: true,
    hidden: true,
    path: 'pd/set',
    rule (pd, creator) {
      throw new Error('pd only be setted by level')
    }
  },
  'select category to spend pd': {
    enabled: true,
    hidden: true,
    path: 'pd/spend',
    rule ({ name, value }, creator) {
      if (!creator.category) throw new Error('select category to spend development points')
      return { name, value }
    }
  },
  'spenden in a ability remove -30 bonus': {
    enabled: true,
    hidden: true,
    path: 'pd/spend',
    rule ({ name, value }, creator) {
      creator.combatAbilities.removeBonusOf(name, 'base -30')
      return { name, value }
    }
  },
  'refound all points add -30 bonus': {
    enabled: true,
    hidden: true,
    path: 'pd/spend',
    rule ({ name, value }, creator) {
      if (creator.developmentPointsShop.buyList[name] && creator.developmentPointsShop.buyList[name] - value === 0) {
        creator.combatAbilities.addBonusOf(name, {
          reason: 'base -30',
          value: -30,
          baseBonus: true
        })
      }
      return { name, value }
    }
  },
  'ability minimun 5': {
    enabled: true,
    hidden: false,
    path: 'pd/spend',
    rule ({ name, value }, creator) {
      if (!creator.developmentPointsShop.buyList[name] && value < 5) {
        throw new Error('cannot enhance bellow 5')
      }
      if (creator.developmentPointsShop.buyList[name] && creator.developmentPointsShop.buyList[name] + value < 5) throw new Error('cannot enhance bellow 5')
      return { name, value }
    },
    childs: ['cannot decrease bellow 5']
  },
  'development points lumit': {
    enabled: true,
    hidden: false,
    path: 'pd/spend',
    rule ({ name, value }, creator) {
      const balance = creator.developmentPointsShop.balance
      const cost = creator.developmentPointsShop.catalog[name] * value
      if (balance + cost > creator.developmentPoints) throw new Error('development points exeded')
      return { name, value }
    }
  },
  'cannot decrease bellow 5': {
    enabled: true,
    hidden: false,
    path: 'pd/refound',
    rule ({ name, value }, creator) {
      if (creator.developmentPointsShop.buyList[name] && creator.developmentPointsShop.buyList[name] - value < 5 && creator.developmentPointsShop.buyList[name] - value > 0) throw new Error('cannot enhance bellow 5')
      return { name, value }
    }
  },
  'combat abilities limit': {
    enabled: true,
    hidden: false,
    path: 'pd/spend',
    rule ({ name, value }, creator) {
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
    }
  },
  'offencive and defencive limits': {
    enabled: true,
    hidden: false,
    path: 'pd/spend',
    rule ({ name, value }, creator) {
      if (name !== 'attack' && name !== 'dodge' && name !== 'stop') return { name, value }

      const limit = creator.developmentPoints / 2
      let spended = creator.developmentPointsShop.catalog[name] * value
      spended += creator.developmentPointsSpendedIn('attack')
      spended += creator.developmentPointsSpendedIn('dodge')
      spended += creator.developmentPointsSpendedIn('stop')

      if (spended > limit) throw new Error('the limit of offensive and defensive is ' + limit)

      return { name, value }
    }
  },
  'select category': {
    enabled: true,
    hidden: true,
    path: 'category/set',
    rule (name, creator) {
      const category = categories.find(cat => cat.name === name)
      if (!category) throw new Error('the category does not exist')
      creator.developmentPointsShop.mergeCatalog(category.primaryAbilities.combatAbilities)
      return category
    }
  },
  'offencive and deffensive diference limit': {
    enabled: true,
    hidden: false,
    path: 'pd/spend',
    rule ({ name, value }, creator) {
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
    }
  },
  'base -30': {
    enabled: true,
    hidden: false,
    path: 'creator/init',
    rule (_, creator) {
      creator.combatAbilities.addBonus({
        reason: 'base -30',
        value: -30,
        baseBonus: true
      })
    },
    disabled (_, creator) {
      creator.combatAbilities.removeBonus('base -30')
    },
    enable (_, creator) {
      creator.combatAbilities.addBonus({
        reason: 'base -30',
        value: -30,
        baseBonus: true
      })
    },
    childs: ['refound all points add -30 bonus', 'spenden in a ability remove -30 bonus']
  }
}
