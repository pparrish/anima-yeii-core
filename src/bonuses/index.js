const { required, readOnly }= require('../utils').classUtils
class Bonus {
  constructor (reason = required() , value = 0) {
    this._ = {
      reason,
      value
    }
  }
  get reason() { return this._.reason}
  set reason(_) {readOnly('reason')}
  get value() {return this._.value}
  set value(_) {readOnly('value')}
}

class BonusByLevel extends Bonus {
  constructor(reason, level = 1, rate = 1, max = Infinity) {
    super(reason)
    let value = level * rate
    this._.value = value > max ? max : value
  }
}

module.exports = {
  Bonus,
  BonusByLevel
}
