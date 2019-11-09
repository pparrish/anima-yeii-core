const NamedValueColection = require('../../NamedValue/NamedValueColection')
const PsychicAbility = require('./PsychicAbility')

module.exports = class PsysicAbilities extends NamedValueColection {
  constructor (names, values) {
    super(names, values, PsychicAbility)
  }
}
