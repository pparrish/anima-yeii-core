/* Create a array of given clases from array of options.
 * @param {Array} list - list of objects options
 * @param {Object} list[].options - a option to generate in the retuned array
 * @param {Class} list[].options.CREATOR - the class to create the elements in listt
 * @param { function} list[].options.CREATOR.fromOptions - Requirrd static function of the class or constructor function than acept a option object amd returns a instance of class with this options.
 * @returns {Array} A array of instances of the CREATOR with given options.
 */
module.exports = list => list.map(
  options => options.CREATOR.fromOptions(options)
)
