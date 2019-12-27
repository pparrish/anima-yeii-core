const secondaryAbilitiesList = require('../secondaryAbilities/listOfSecondaryAbilities')
module.exports = (categoryCosts) => {
  let secondaryAbilitiesCost = {}
  secondaryAbilitiesCost = secondaryAbilitiesList.reduce(
    (secondaryAbilitiesCost, secondaryAbility) => {
      const name = secondaryAbility.name
      const category = secondaryAbility.category
      secondaryAbilitiesCost[name] = categoryCosts[category]
      return secondaryAbilitiesCost
    },
    secondaryAbilitiesCost
  )
  return secondaryAbilitiesCost
}
