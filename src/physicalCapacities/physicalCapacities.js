class PhysicalCapacities {
  constructor (agility, physique) {
    this._agility = agility
    this._physique = physique
  }

  get agility () { return this._agility }

  set agility (val) { throw new Error('Agility is read only') }

  get physique () { return this._physique }

  set physique (val) { throw new Error('physique is read only') }
}

module.exports = PhysicalCapacities
