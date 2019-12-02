module.exports = class Abilities {
  constructor (list) {
    this._.storage = new Map()
    list.map(ability => {
      this._.storage.set(ability.name, ability)
    })
  }

  get (name) {
    return this._.storage.get(name)
  }
}
