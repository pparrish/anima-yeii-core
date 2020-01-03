const NamedValue = require('../NamedValue/NamedValue')

class SecondaryCharacteristic extends NamedValue {
  static fromOptions (options) {
    const { name, value } = options
    return new SecondaryCharacteristic(name, value)
  }

  fromOptions (options) {
    return SecondaryCharacteristic.fromOptions(options)
  }
}

module.exports = SecondaryCharacteristic
