const NamedValueCollection = require('../NamedValue/NamedValueColection')
const listOfPhysicalCapacities = require('./listOfPhysicalCapacities')
class PhysicalCapacities extends NamedValueCollection {
  constructor () {
    super(listOfPhysicalCapacities)
  }
}

module.exports = PhysicalCapacities
