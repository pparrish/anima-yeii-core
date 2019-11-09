const NamedValueColection = require('../../NamedValue/NamedValueColection')
const SupernaturalAbility = require('./SupernaturalAbility')

module.exports = class SupernaturalAbilities extends NamedValueColection {
  constructor (names, values) {
    super(names, values, SupernaturalAbility)
  }
}
