const NamedValue = require('../NamedValue/NamedValue')

class SecondaryCharacteristic extends NamedValue {
  constructor(name, value, linkedTo) {
    super(name, value)
    this._.linkedTo = linkedTo
  }

  static fromOptions(options) {
    const { name, value, linkedTo } = options
    return new SecondaryCharacteristic(
      name,
      value,
      linkedTo
    )
  }

  _promote(changes) {
    const newChanges = super._promote(changes)
    return {
      ...changes,
      linkedTo:
        newChanges.linkedTo ?? this.linkedTo,
    }
  }
}

module.exports = SecondaryCharacteristic
