module.exports = {
  name: 'sorcerer',
  limits: {
    combatAbilities: 50,
    supernaturalAbilities: 60,
    psychicAbilities: 50
  },
  primaryAbilities: {
    combatAbilities: {
      attack: 3,
      stop: 3,
      dodge: 2,
      'wear armor': 3
    },
    supernaturalAbilities: {
      zeon: 1,
      'multiple of ACT': 50,
      'magic projection': 2,
      summon: 2,
      domain: 2,
      tie: 2,
      unsummon: 2
    },
    psychicAbilities: {
      'psychic projection': 3
    }
  },
  secondaryAbilities: {
    categories: {
      atletics: '2',
      social: '2',
      perceptive: '2',
      intellectual: '2',
      vigor: '3',
      subterfuge: '2',
      creative: '2'
    },
    reducedCost: {
      'magic valuation': 1
    }
  }
}
