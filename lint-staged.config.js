module.exports = {
  // test first then fix and add.
  '**/*.js': filenames => {
    console.log(filenames)
    const commands = []
    // Fix file
    commands.push(`yarn standard --fix ${filenames.join(' ')}`)
    // add file
    commands.push(`git add ${filenames.join(' ')}`)
    return commands
  },
  // Generate docunentation of nontest files in src
  'src/**/*!(*test).js': filenames => {
    console.log(filenames)
    const commands = []
    // test files
    commands.push(`yarn test --findRelatedTests ${filenames.join(' ')}`)
    filenames.map(file => {
      const docFile = file.replace(/\.js$/, '-doc.md')
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
