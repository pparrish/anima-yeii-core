module.exports = {
  required: (name = 'is') => { throw new Error(`Param ${name} missed`) },
  readOnly: (name = '') => { throw new Error(`${name} read only`) }
}
