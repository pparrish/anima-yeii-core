module.exports = {
  name: 'novel',
  limits: {
    combatAbilities: 60,
    supernaturalAbilities: 60,
    psychicAbilities: 60
  },
  primaryAbilities: {
    combatAbilities: {
      attack: 2,
      stop: 2,
      dodge: 2,
      'wear armor': 2
    },
    supernaturalAbilities: {
      zeon: 2,
      'multiple of ACT': 60,
      'magic projection': 2,
      summon: 2,
      domain: 2,
      tie: 2,
      unsummon: 2
    },
    psychicAbilities: {
      'psychic projection': 2
    }
  },
  secondaryAbilities: {
    categories: {
      atletics: '2',
      social: '2',
      perceptive: '2',
      intellectual: '2',
      vigor: '2',
      subterfuge: '2',
      creative: '2'
    },
    reducedCost: {
    }
  }
}
