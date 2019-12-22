module.exports = {
  name: 'conjurer',
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
      'multiple of ACT': 60,
      'magic projection': 3,
      summon: 1,
      domain: 1,
      tie: 1,
      unsummon: 1
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
      ocultism: 1
    }
  }
}
