module.exports = {
  name: 'ranger',
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
      atletics: '2',
      social: '2',
      perceptive: '1',
      intellectual: '3',
      vigor: '3',
      subterfuge: '2',
      creative: '2'
    },
    reducedCost: {
      trapping: 1,
      herbalism: 2,
      animals: 1,
      medicine: 2
    }
  }
}
