import { readOnly } from '../utils/classUtils'

const NamedValue = require('../NamedValue/NamedValue')

class PhysicalCapacity extends NamedValue {
  constructor(name, value, linkedTo = '') {
    super(name, value)
    this._.linkedTo = linkedTo
  }

  get linkedTo() {
    return this._.linkedTo
  }

  set linkedTo(_) {
    readOnly('linkedTo')
  }

  static fromOptions(options) {
    const { name, value, linkedTo = '' } = options
    return new PhysicalCapacity(
      name,
      value,
      linkedTo
    )
  }

  _promote(changes) {
    const newChanges = super._promote(changes)
    return {
      ...newChanges,
      linkedTo:
        newChanges.linkedTo ?? this.linkedTo,
    }
  }
}

module.exports = PhysicalCapacity
