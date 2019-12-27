module.exports = {
  name: 'dark paladin',
  limits: {
    combatAbilities: 60,
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
      zeon: 2,
      'multiple of ACT': 60,
      'magic projection': 3,
      summon: 3,
      domain: 1,
      tie: 3,
      unsummon: 3
    },
    psychicAbilities: {
      'psychic projection': 3
    }
  },
  secondaryAbilities: {
    categories: {
      atletics: '2',
      social: '1',
      perceptive: '2',
      intellectual: '2',
      vigor: '2',
      subterfuge: '2',
      creative: '2'
    },
    reducedCost: {
      coldness: 1
    }
  }
}
