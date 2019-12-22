module.exports = {
  name: 'warlock',
  limits: {
    combatAbilities: 50,
    supernaturalAbilities: 50,
    psychicAbilities: 50
  },
  primaryAbilities: {
    combatAbilities: {
      attack: 2,
      stop: 2,
      dodge: 2,
      'wear armor': 2
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
      atletics: '1',
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
