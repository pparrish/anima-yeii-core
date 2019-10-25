const PhysicalCapacities = require('./physicalCapacities')
module.exports = (characteristics) => {
  const physique = characteristics.getValue('physique')
  const agility = characteristics.getValue('agility')

  if (!physique) throw new Error('Characteristics dont have physique characteristic')
  if (!agility) throw new Error('Characteristic dont have agility characteristic')

  return new PhysicalCapacities(agility, physique)
}
