module.exports = {
  name: 'thief',
  limits: {
    combatAbilities: 50,
    supernaturalAbilities: 50,
    psychicAbilities: 50
  },
  primaryAbilities: {
    combatAbilities: {
      attack: 2,
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
      'psychic projection': 3
    }
  },
  secondaryAbilities: {
    categories: {
      atletics: '1',
      social: '2',
      perceptive: '2',
      intellectual: '3',
      vigor: '3',
      subterfuge: '1',
      creative: '2'
    },
    reducedCost: {
      appraisal: 1
    }
  }
}
