const RulesHandler = require('../rulesHandler/RulesHandler')
const developmentPointsTable = require('../developmentPoints/developmentPointsTable')
const categories = require('../categories')
const sizeTable = require('../secondaryCharacteristics/sizeTable')
const expandCostOfSecondaryAbilitiesCategories = require('../categories/expandCostOfSecondaryAbilitiesCategories')

const addWhenItReachesTheValue = (
  toAdd,
  toReach
) => value =>
  value >= toReach ? value + toAdd : value

const addOneWhenReachTeen = addWhenItReachesTheValue(
  1,
  10
)

const theTenCostTwoPoints = spended =>
  spended.map(addOneWhenReachTeen)
const pathEnd = path => path.split('/').pop()

const throwErrorWhenExceeds = (
  toExceed,
  message
) => value => {
  if (value > toExceed) throw new Error(message)
  return value
}
const limitValueToTen = message =>
  throwErrorWhenExceeds(10, message)

const checkHeightOrWeight = (
  value,
  creator,
  path
) => {
  const {
    size,
  } = creator.settedSecondaryCharacteristics()
  if (!size)
    throw new Error(
      'size is not defined, first set strength and physique'
    )
  const { slim } = creator.settedBasicInfo()
  const targetName = pathEnd(path)
  const target = sizeTable[targetName]
  if (!target)
    throw new Error(
      'only height and weight admited'
    )
  if (!target.from.check(size, value, slim))
    throw new Error(
      `${targetName} ${value} must be greatest or equal than ${creator.minHeightSupported()}`
    )
  if (!target.to.check(size, value))
    throw new Error(
      `${targetName} ${value} must be less or equal than ${creator.maxHeightSupported()}`
    )
  return value
}

const BASE_BONUS = {
  reason: 'base -30',
  value: -30,
  baseBonus: true,
}

const addBaseBonusToAll = creator => {
  creator.bonusHandler
    .addBonusTo('combatAbilities', BASE_BONUS)
    .addBonusTo(
      'supernaturalAbilities',
      BASE_BONUS
    )
    .addBonusTo('psychicAbilities', BASE_BONUS)
    .addBonusTo('secondaryAbilities', BASE_BONUS)
}

const removeBaseBonusToAll = creator => {
  creator.bonusHandler
    .removeBonusTo(
      'combatAbilities',
      BASE_BONUS.reason
    )
    .removeBonusTo(
      'psychicAbilities',
      BASE_BONUS.reason
    )
    .removeBonusTo(
      'supernaturalAbilities',
      BASE_BONUS.reason
    )
    .removeBonusTo(
      'secondaryAbilities',
      BASE_BONUS.reason
    )
}

const addBaseBonusTo = (name, creator) => {
  if (creator.combatAbilities.has(name)) {
    creator.bonusHandler.addBonus(
      'combatAbilities',
      name,
      BASE_BONUS
    )
  }
  if (creator.supernaturalAbilities.has(name)) {
    creator.bonusHandler.addBonus(
      'supernaturalAbilities',
      name,
      BASE_BONUS
    )
  }
  if (creator.psychicAbilities.has(name)) {
    creator.bonusHandler.addBonus(
      'psychicAbilities',
      name,
      BASE_BONUS
    )
  }
  if (creator.secondaryAbilities.has(name)) {
    creator.bonusHandler.addBonus(
      'secondaryAbilities',
      name,
      BASE_BONUS
    )
  }
}

const removeBaseBonusTo = (name, creator) => {
  if (creator.combatAbilities.has(name)) {
    creator.bonusHandler.removeBonus(
      'combatAbilities',
      name,
      BASE_BONUS.reason
    )
  }
  if (creator.supernaturalAbilities.has(name)) {
    creator.bonusHandler.removeBonus(
      'supernaturalAbilities',
      name,
      BASE_BONUS.reason
    )
  }
  if (creator.psychicAbilities.has(name)) {
    creator.bonusHandler.removeBonus(
      'psychicAbilities',
      name,
      BASE_BONUS.reason
    )
  }
  if (creator.secondaryAbilities.has(name)) {
    creator.bonusHandler.removeBonus(
      'secondaryAbilities',
      name,
      BASE_BONUS.reason
    )
  }
}

/* TODO change the context to get the name of characteristic */
const theMaximunValueOfCharacteristicIsTen = characteristic =>
  limitValueToTen(
    'the maximun value of the characteristics is ten'
  )(characteristic)

const theMaximunValueOfAppearanceIsTen = appearanceValue =>
  limitValueToTen(
    'the maximun value of appearance is ten'
  )(appearanceValue)

const forbitOperation = message => () => {
  throw new Error(message)
}

module.exports = () => {
  const rules = new RulesHandler()

  /* Characteristics */
  rules
    .add(
      'the ten cost two points',
      'points/spends',
      theTenCostTwoPoints
    )

    /* Characteristics limits */
    .add(
      'the maximun value of the characteristics is ten',
      'characteristics/set',
      theMaximunValueOfCharacteristicIsTen
    )

    /* Appearance */
    .add(
      'appearance cannot be set',
      'secondaryCharacteristics/set/appearance',
      forbitOperation('appearance cannot be set')
    )

    .add(
      'the maximun value of appearance is ten',
      'secondaryCharacteristics/set/appearance',
      theMaximunValueOfAppearanceIsTen,
      {
        hidden: true,
      }
    )

    .add(
      'size limitations',
      [
        'basicInfo/set/height',
        'basicInfo/set/weight',
      ],
      checkHeightOrWeight
    )

    /* base -30 rule */
    .add(
      'base -30',
      'creator/init',
      (_, creator) => addBaseBonusToAll(creator),
      {
        disable: (_, creator) =>
          removeBaseBonusToAll(creator),
        /* TODO when enabled only add bonus to abilities with not enhanced */
        enable: (_, creator) =>
          addBaseBonusToAll(creator),
        childs: [
          'refound all points add -30 bonus',
          'spenden in a ability remove -30 bonus',
        ],
      }
    )

    .add(
      'spenden in a ability remove -30 bonus',
      'pd/spend',
      ({ name, value }, creator) => {
        removeBaseBonusTo(name, creator)
        return { name, value }
      }
    )

    .add(
      'refound all points add -30 bonus',
      'pd/refound',
      ({ name, value }, creator) => {
        if (
          creator.developmentPointsShop.buyList[
            name
          ] &&
          creator.developmentPointsShop.buyList[
            name
          ] -
            value ===
            0
        ) {
          addBaseBonusTo(name, creator)
        }
        return { name, value }
      }
    )

    /* abilities */
    .add(
      'ability minimun 5',
      'pd/spend',
      ({ name, value }, creator) => {
        if (
          !creator.developmentPointsShop.buyList[
            name
          ] &&
          value < 5
        ) {
          throw new Error(
            'cannot enhance bellow 5'
          )
        }
        if (
          creator.developmentPointsShop.buyList[
            name
          ] &&
          creator.developmentPointsShop.buyList[
            name
          ] +
            value <
            5
        )
          throw new Error(
            'cannot enhance bellow 5'
          )
        return { name, value }
      },
      { childs: ['cannot decrease bellow 5'] }
    )

    .add(
      'cannot decrease bellow 5',
      'pd/refound',
      ({ name, value }, creator) => {
        if (
          creator.developmentPointsShop.buyList[
            name
          ] &&
          creator.developmentPointsShop.buyList[
            name
          ] -
            value <
            5 &&
          creator.developmentPointsShop.buyList[
            name
          ] -
            value >
            0
        )
          throw new Error(
            'cannot enhance bellow 5'
          )
        return { name, value }
      }
    )

    /* Categories */
    .add(
      'select category',
      'category/set',
      (name, creator) => {
        const category = categories.find(
          cat => cat.name === name
        )
        if (!category)
          throw new Error(
            'the category does not exist'
          )
        /* TODO merge all catalogs function */
        /* TODO all merges must be part of CharacterCreator */
        creator.developmentPointsShop.mergeCatalog(
          category.primaryAbilities
            .combatAbilities
        )
        creator.developmentPointsShop.mergeCatalog(
          category.primaryAbilities
            .supernaturalAbilities
        )
        creator.developmentPointsShop.mergeCatalog(
          category.primaryAbilities
            .psychicAbilities
        )
        creator.developmentPointsShop.mergeCatalog(
          expandCostOfSecondaryAbilitiesCategories(
            category.secondaryAbilities.categories
          )
        )
        creator.developmentPointsShop.mergeCatalog(
          category.secondaryAbilities.reducedCost
        )
        return category
      }
    )

    /* development points */
    .add(
      'pd linked to level',
      'basicInfo/set/level',
      (level, creator) => {
        creator._pd = developmentPointsTable.get(
          level
        )
        return level
      },
      {
        childs: [
          'pd based on level',
          'set pd disabled',
        ],
      }
    )

    .add(
      'pd based on level',
      'pd/get',
      (_, creator) => {
        const {
          level,
        } = creator.settedBasicInfo()
        if (!level)
          throw new Error(
            'level is not setted use CharacterCreator.setBasicInfo("level", value)'
          )
      }
    )

    .add('set pd disabled', 'pd/set', () => {
      throw new Error(
        'pd only be setted by level'
      )
    })

    .add(
      'select category to spend pd',
      'pd/spend',
      ({ name, value }, creator) => {
        if (!creator.category)
          throw new Error(
            'select category to spend development points'
          )
        return { name, value }
      }
    )

    /* pd limits */
    .add(
      'development points limit',
      'pd/spend',
      ({ name, value }, creator) => {
        const {
          balance,
        } = creator.developmentPointsShop
        const cost =
          creator.developmentPointsShop.catalog[
            name
          ] * value
        if (
          balance + cost >
          creator.developmentPoints
        )
          throw new Error(
            'development points exeded'
          )
        return { name, value }
      }
    )

    .add(
      'offencive and defencive limits',
      'pd/spend/combatAbilities',
      ({ name, value }, creator) => {
        if (
          name !== 'attack' &&
          name !== 'dodge' &&
          name !== 'stop'
        )
          return { name, value }

        const limit =
          creator.developmentPoints / 2
        let spended =
          creator.developmentPointsShop.catalog[
            name
          ] * value
        spended += creator.developmentPointsSpendedIn(
          'attack'
        )
        spended += creator.developmentPointsSpendedIn(
          'dodge'
        )
        spended += creator.developmentPointsSpendedIn(
          'stop'
        )

        if (spended > limit)
          throw new Error(
            `the limit of offensive and defensive is ${limit}`
          )

        return { name, value }
      }
    )

    .add(
      'offencive and deffensive diference limit',
      'pd/spend/combatAbilities',
      ({ name, value }, creator) => {
        if (
          name !== 'attack' &&
          name !== 'dodge' &&
          name !== 'stop'
        )
          return { name, value }
        let attack = creator.combatAbilities.get(
          'attack'
        ).base
        let dodge = creator.combatAbilities.get(
          'dodge'
        ).base
        let stop = creator.combatAbilities.get(
          'stop'
        ).base
        attack =
          name === 'attack'
            ? attack + value
            : attack
        dodge =
          name === 'dodge' ? dodge + value : dodge
        stop =
          name === 'stop' ? stop + value : stop

        const dominantDefense =
          stop > dodge ? stop : dodge
        const limit =
          creator.developmentPoints / 4
        if (
          creator.developmentPointsSpendedIn(
            'attack'
          ) === 0
        ) {
          let spended =
            creator.developmentPointsShop.catalog[
              name
            ] * value
          spended += creator.developmentPointsSpendedIn(
            'dodge'
          )
          spended += creator.developmentPointsSpendedIn(
            'stop'
          )
          if (spended > limit)
            throw new Error(
              `the limit of dodge and stop is ${limit}`
            )
        } else if (
          creator.developmentPointsSpendedIn(
            'dodge'
          ) === 0 &&
          creator.developmentPointsSpendedIn(
            'stop'
          ) === 0
        ) {
          let spended =
            creator.developmentPointsShop.catalog[
              name
            ] * value
          spended += creator.developmentPointsSpendedIn(
            'attack'
          )
          if (spended > limit)
            throw new Error(
              `the limit of attack is ${limit}`
            )
        } else if (
          Math.abs(dominantDefense - attack) > 50
        ) {
          throw new Error(
            'attack and defense diference cannot be more than 50'
          )
        }
        return { name, value }
      }
    )

    .add(
      'combat abilities limit',
      'pd/spend/combatAbilities',
      ({ name, value }, creator) => {
        if (
          name in
          creator._category.primaryAbilities
            .combatAbilities
        ) {
          const limit =
            creator.developmentPoints *
            (creator._category.limits
              .combatAbilities /
              100)
          let spended =
            creator.developmentPointsShop.catalog[
              name
            ] * value
          for (const ability in creator
            .developmentPointsShop.buyList) {
            if (
              ability in
              creator._category.primaryAbilities
                .combatAbilities
            ) {
              spended += creator.developmentPointsSpendedIn(
                name
              )
            }
          }
          if (spended > limit)
            throw new Error(
              `the limit of pd for combat abilities is ${limit}`
            )
        }
        return { name, value }
      }
    )

    .add(
      'sobrenatural abilities limits',
      'pd/spend/supernaturalAbilities',
      ({ name, value }, creator) => {
        const limit =
          creator.developmentPoints *
          (creator._category.limits
            .supernaturalAbilities /
            100)
        let spended =
          creator.developmentPointsShop.catalog[
            name
          ] * value
        spended += creator.developmentPointsSpendedIn(
          'magic projection'
        )
        spended += creator.developmentPointsSpendedIn(
          'summon'
        )
        spended += creator.developmentPointsSpendedIn(
          'domain'
        )
        spended += creator.developmentPointsSpendedIn(
          'tie'
        )
        spended += creator.developmentPointsSpendedIn(
          'unsummon'
        )
        if (spended > limit)
          throw new Error(
            `the limit of supernatural abilities is ${limit}`
          )

        return { name, value }
      }
    )

    .add(
      'magic projection limit',
      'pd/spend/supernaturalAbilities',
      ({ name, value }, creator) => {
        const limit =
          (creator.developmentPoints *
            (creator._category.limits
              .supernaturalAbilities /
              100)) /
          2
        let spended =
          creator.developmentPointsShop.catalog[
            name
          ] * value
        spended += creator.developmentPointsSpendedIn(
          'magic projection'
        )
        if (spended > limit)
          throw new Error(
            `the pd limit to spend in magic projection is ${limit}`
          )

        return { name, value }
      }
    )

    .add(
      'psychic abilities limits',
      'pd/spend/psychicAbilities',
      ({ name, value }, creator) => {
        const limit =
          creator.developmentPoints *
          (creator._category.limits
            .psychicAbilities /
            100)
        let spended =
          creator.developmentPointsShop.catalog[
            name
          ] * value
        spended += creator.developmentPointsSpendedIn(
          'psychic projection'
        )
        if (spended > limit)
          throw new Error(
            `the limit of psychic abilities is ${limit}`
          )

        return { name, value }
      }
    )

    .add(
      'psychic projection limit',
      'pd/spend/psychicAbilities',
      ({ name, value }, creator) => {
        const limit =
          (creator.developmentPoints *
            (creator._category.limits
              .psychicAbilities /
              100)) /
          2
        let spended =
          creator.developmentPointsShop.catalog[
            name
          ] * value
        spended += creator.developmentPointsSpendedIn(
          'psychic projection'
        )
        if (spended > limit)
          throw new Error(
            `the pd limit to spend in psychic projection is ${limit}`
          )

        return { name, value }
      }
    )

  return rules
}
