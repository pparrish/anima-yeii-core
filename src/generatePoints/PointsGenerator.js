const generators = [
  require('./type1'),
  require('./type2'),
  require('./type3'),
  require('./type4'),
  require('./type5')
]

module.exports = class PointsGenerator {
  constructor () {
    this._ = {
      selected: null,
      results: {},
      pointsToGenerate: 0,
      valuesToGenerate: 0,
      generators
    }
  }

  generate () {
    const generator = this._.selected
    if (!generator) throw new Error('Generator is not selected')
    if (this.isAlreadyGenerated(generator.name) && generator.need !== 'points to generate') {
      return { ...this._.results[generator.name] }
    }

    const need = generator.need === 'values to generate'
      ? this._.valuesToGenerate
      : generator.need === 'points to generate'
        ? this._.pointsToGenerate
        : undefined

    this._.results[generator.name] = generator.generator(need)
  }

  selectGenerator (type) {
    if (typeof type === 'string') {
      // TODO error when name not found
      this._.selected = this._.generators.find(generator => generator.name === type)
    }
    if (typeof type === 'number') {
      /* TODO error if not in the range of generators */
      this._.selected = this._.generators[type - 1]
    }
    return this
  }

  setValuesToGenerate (value) {
    this._.valuesToGenerate = value
    return this
  }

  setPointsToGenerate (value) {
    this._.pointsToGenerate = value
    return this
  }

  isAlreadyGenerated (name) {
    return !!this._.results[name]
  }

  isGeneratoraSelected () {
    if (this._.selected === null) return false
    return true
  }

  get generator () {
    if (!this.isGeneratoraSelected()) throw new Error('To get generator first select one')
    return { ...this._.selected }
  }

  get result () {
    return this._.results[this._.selected.name]
  }

  get type () {
    return this.generator.type
  }

  get pointsToGenerate () {
    return this._.pointsToGenerate
  }
}
