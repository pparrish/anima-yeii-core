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

  }
}
