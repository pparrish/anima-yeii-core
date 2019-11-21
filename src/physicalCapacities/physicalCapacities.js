const NamedValueCollection = require('../NamedValue/NamedValueColection')
const PhysicalCapacity = require('./PhysicalCapacity')
class PhysicalCapacities extends NamedValueCollection {
  constructor (names, values) {
    super(names, values, PhysicalCapacity)
  }
}

module.exports = PhysicalCapacities
