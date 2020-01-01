const NamedValue = require('../NamedValue/NamedValue')

class PhysicalCapacity extends NamedValue {
  static fromOptions (options) {
    const { name, value } = options
    return PhysicalCapacity(name, value)
  }

  fromOptions (options) {
    return PhysicalCapacity.fromOptions(options)
  }
}

module.exports = PhysicalCapacity
