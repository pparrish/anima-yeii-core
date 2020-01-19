export function required(name = 'is') {
  throw new Error(`Param ${name} missed`)
}
export function readOnly(name = '') {
  throw new Error(`${name} read only`)
}
export function frobiden(message) {
  throw new Error(message)
}
