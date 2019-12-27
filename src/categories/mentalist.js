module.exports = {
  name: 'mentalist',
  limits: {
    combatAbilities: 50,
    supernaturalAbilities: 50,
    psychicAbilities: 60
  },
  primaryAbilities: {
    combatAbilities: {
      attack: 3,
      stop: 3,
      dodge: 2,
      'wear armor': 3
    },
    supernaturalAbilities: {
      zeon: 3,
      'multiple of ACT': 70,
      'magic projection': 3,
      summon: 3,
      domain: 3,
      tie: 3,
      unsummon: 3
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
      vigor: '3',
      subterfuge: '2',
      creative: '2'
    },
    reducedCost: {
    }
  }
}
