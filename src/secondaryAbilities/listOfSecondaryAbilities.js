const createList = require('../utils/createList')
const SecondaryAbility = require('./SecondaryAbility')
const list = [
  {
    name: 'acrobatics',
    dependency: 'agility',
    category: 'atletics',
    CREATOR: SecondaryAbility
  },
  {
    name: 'atletics',
    dependency: 'agility',
    category: 'atletics',
    CREATOR: SecondaryAbility
  },
  {
    name: 'swim',
    dependency: 'agility',
    category: 'atletics',
    CREATOR: SecondaryAbility
  },
  {
    name: 'jump',
    dependency: 'agility',
    category: 'atletics',
    CREATOR: SecondaryAbility
  },
  {
    name: 'climb',
    dependency: 'agility',
    category: 'atletics',
    CREATOR: SecondaryAbility
  },
  {
    name: 'style',
    dependency: 'power',
    category: 'social',
    CREATOR: SecondaryAbility
  },
  {
    name: 'intimidate',
    dependency: 'will',
    category: 'social',
    CREATOR: SecondaryAbility
  },
  {
    name: 'leadership',
    dependency: 'power',
    category: 'social',
    CREATOR: SecondaryAbility
  },
  {
    name: 'persuasion',
    dependency: 'inteligence',
    category: 'social',
    CREATOR: SecondaryAbility
  },
  {
    name: 'warm',
    dependency: 'perception',
    category: 'perceptive',
    CREATOR: SecondaryAbility
  },
  {
    name: 'search',
    dependency: 'perception',
    category: 'perceptive',
    CREATOR: SecondaryAbility
  },
  {
    name: 'track',
    dependency: 'perception',
    category: 'perceptive',
    CREATOR: SecondaryAbility
  },
  {
    name: 'animals',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'science',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'herbalism',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'history',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'medicine',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'memorize',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'navigation',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'ocultism',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'appraisal',
    dependency: 'inteligence',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'magic valuation',
    dependency: 'power',
    category: 'intellectual',
    CREATOR: SecondaryAbility
  },
  {
    name: 'coldness',
    dependency: 'will',
    category: 'vigor',
    CREATOR: SecondaryAbility
  },
  {
    name: 'feats of strength',
    dependency: 'strength',
    category: 'vigor',
    CREATOR: SecondaryAbility
  },
  {
    name: 'resist pain',
    dependency: 'will',
    category: 'vigor',
    CREATOR: SecondaryAbility
  },
  {
    name: 'locksmith',
    dependency: 'dexterity',
    category: 'subterfuge',
    CREATOR: SecondaryAbility
  },
  {
    name: 'costume',
    dependency: 'dexterity',
    category: 'subterfuge',
    CREATOR: SecondaryAbility
  },
  {
    name: 'hide',
    dependency: 'perception',
    category: 'subterfuge',
    CREATOR: SecondaryAbility
  },
  {
    name: 'stealing',
    dependency: 'dexterity',
    category: 'subterfuge',
    CREATOR: SecondaryAbility
  },
  {
    name: 'stealth',
    dependency: 'agility',
    category: 'subterfuge',
    CREATOR: SecondaryAbility
  },
  {
    name: 'trapping',
    dependency: 'dexterity',
    category: 'subterfuge',
    CREATOR: SecondaryAbility
  },
  {
    name: 'poisons',
    dependency: 'inteligence',
    category: 'subterfuge',
    CREATOR: SecondaryAbility
  },
  {
    name: 'art',
    dependency: 'power',
    category: 'creative',
    CREATOR: SecondaryAbility
  },
  {
    name: 'dance',
    dependency: 'agility',
    category: 'creative',
    CREATOR: SecondaryAbility
  },
  {
    name: 'forging',
    dependency: 'dexterity',
    category: 'creative',
    CREATOR: SecondaryAbility
  },
  {
    name: 'music',
    dependency: 'power',
    category: 'creative',
    CREATOR: SecondaryAbility
  },
  {
    name: 'hands triks',
    dependency: 'dexterity',
    category: 'creative',
    CREATOR: SecondaryAbility
  }

]

module.exports = createList(list)
