const { required } = require('../utils').classUtils
const NamedValueCollection = require('../NamedValue/NamedValueColection')
const listOfPhysicalCapacities = require('./listOfPhysicalCapacities')
class PhysicalCapacities extends NamedValueCollection {
  constructor () {
    super(listOfPhysicalCapacities)
  }

  set (name, value = required('value')) {
    const physicalCapacity = this.get(name)
    this._.storage.set(name, physicalCapacity.fromOptions({ name, value }))
    return this
  }
}

module.exports = PhysicalCapacities
