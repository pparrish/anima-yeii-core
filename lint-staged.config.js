module.exports = {
  // test first then fix and add.
  '**/*.js': filenames => {
    const commands = []
    filenames.map(file => {
      // test file
      commands.push(`yarn test --findRelatedTests ${file}`)
      // Fix file
      commands.push(`yarn standard --fix ${file}`)
      // add file
      commands.push(`git add ${file}`)
    })
    return commands
  },
  // Generate docunentation of nontest files in src
  'src/**/*!(*test).js': filenames => {
    const commands = []
    filenames.map(file => {
      const docFile = file.replace(/\.js$/, 'doc.md')
      // documentation lint files
      commands.push(`documentation lint ${file}`)
      // documentation create files
      commands.push(`documentation build ${file} -f md -o ${docFile}`)
      // add files
      commands.push(`git add ${docFile}`)
    })
    return commands
  }
}
