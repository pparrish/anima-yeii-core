import Category from './Category'
import categories from './categories.json'

const { warrior } = categories
export default [
  new Category(
    'warrior',
    warrior.archetype,
    warrior.pv,
    warrior.turn,
    warrior['martial knowledge'],
    warrior['innate cv'],
    warrior.limits,
    warrior.costs,
    warrior.bonus
  ),
]
