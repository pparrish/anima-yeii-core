/** Represents a rules handler */
module.exports = class RulesHandler {
  constructor () {
    this.rulesPaths = {}
    this.rules = {}
    this.emiter = {}
  }

  createRulesPath (path) {
    return path.split('/').reduce(
      (rulesPath, path) => {
        if (!rulesPath[path]) rulesPath[path] = { rules: {} }
        return rulesPath[path]
      }, this.rulesPaths)
  }

  getRulesfrom (path) {
    return path.split('/').reduce((rulesPath, aPath) => {
      if (rulesPath === null) return null
      if (!rulesPath[aPath]) return null
      return rulesPath[aPath]
    }, this.rulesPaths)
  }

  /** add a rule to a rule handler
   * @param {string} name - unique the name of a rule.
   * @param {string|string[]} path - path or paths to fire the rule.
   * @param {function} rule - the function handler rule, reibes a context, a emiter, and a path
   * @param {Object} options - modifiers to rule
   * @param {boolean} options.enabled - default is true, when is false the rule not be used.
   * @param {boolean} options.hidden - default false, when a rule is hidden it work but cant be listed by ruleHandler
   * @param {function} options.enable - function called when a rule is enabled, recibes a context and a emiter
   * @param {functios} options.disable - function called when a object is disabled
   * @param {string[]} options.childs - name of the childs of the rule, when a rule is disabled or enabled all chiles are enabled or disabled.
   */
  add (name, path, rule, { enabled = true, hidden = false, enable = () => {}, disable = () => {}, childs = [] } = {}) {
    const options = { enabled, hidden, disable, enable, childs }
    this.rules[name] = { name, rule, ...options }
    if (Array.isArray(path)) {
      path.map(aPath => {
        const rulePath = this.createRulesPath(aPath)
        rulePath.rules[name] = this.rules[name]
      })
    } else {
      const rulePath = this.createRulesPath(path)
      rulePath.rules[name] = this.rules[name]
    }
    return this
  }

  /** Enable a rule if the rule have childs all childs are enabled
   * @param {string} name - The name of the rule
   * @returns {RulesHandler} this
   */
  enable (name, context, emiter) {
    emiter = emiter || this.defaultEmiter
    if (!this.rules[name]) throw new Error(`the rule ${name} does not exist`)
    this.rules[name].enabled = true
    if (this.rules[name].enable) this.rules[name].enable(context, emiter)

    if (this.rules[name].childs) {
      this.rules[name].childs.map(name => this.enable(name, context, emiter))
    }

    return this
  }

  /** Disable a rule if the rule have childs all childs are disabled
   * @param {string} name - The name of the rule
   * @returns {RulesHandler} this
   */
  disable (name, context, emiter) {
    emiter = emiter || this.defaultEmiter
    if (!this.rules[name]) throw new Error(`the rule ${name} does not exist`)
    this.rules[name].enabled = false
    if (this.rules[name].disable) this.rules[name].disable(context, emiter)

    if (this.rules[name].childs) {
      this.rules[name].childs.map(name => this.disable(name, context, emiter))
    }

    return this
  }

  /** Applies all rules of one path to a value
   * @param {string} path - is a path to find the rules any string is vald but by convention is a path like string
   * @param {any} context - is the value by working the rule
   * @param {any} source - is the object to wich the rule will be applied
   * @return {Object} the modified context of operation
   */
  apply (path, context, source) {
    source = source || this.emiter
    let newContext = context
    const rulesPath = this.getRulesfrom(path)
    if (!rulesPath) return newContext
    const rules = rulesPath.rules
    for (const ruleName in rules) {
      const rule = rules[ruleName]
      newContext = rule.enabled
        ? rule.rule(context, source, path)
        : newContext
    }

    return newContext
  }

  applyRules (value, base, operation, especified, emiter) {
    emiter = emiter || this.defaultEmiter
    let newValue = value
    newValue = this.apply(base + '/' + operation, newValue, emiter)
    if (especified) newValue = this.apply(base + '/' + operation + '/' + especified, newValue, emiter)
    return newValue
  }

  isEnabled (name) {
    if (!this.rules[name]) throw new Error(`the "${name}" rule does not exists`)
    return this.rules[name].enabled
  }

  /** List of all tules exept the hidden rules
   * type {string[]}
   */
  get list () {
    return Object.keys(this.rules).filter((name) => this.rules[name].hidden === false)
  }

  set list (_) {
    throw new Error('list is read only')
  }

  set defaultEmiter (emiter) {
    this.emiter = emiter
  }
}
