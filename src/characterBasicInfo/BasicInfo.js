const NamedValue = require('../NamedValue/NamedValue')

class BasicInfo extends NamedValue {
  static fromOptions (options) {
    const { name, value } = options
    return new BasicInfo(name, value)
  }

  fromOptions (options) {
    return BasicInfo.fromOptions(options)
  }

  changeValue (value) {
    if (typeof this.value !== typeof value) throw new Error('the value to change must be the same type of the actual value')
    return super.changeValue(value)
  }
}

module.exports = BasicInfo
