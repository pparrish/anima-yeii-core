module.exports = {
  // Lint js files
  '*.js': filenames => {
    return [
      `yarn standard --fix ${filenames.join(' ')}`,
      `git add ${filenames.join(' ')}`
    ]
  },
  // Lint documentation and create documentation
  '!(*test).js': filenames => {
    const lintDoc = []
    const buildDoc = []
    const addDoc = []

    filenames.map(file => {
      if (file.endsWith('.config.js')) return
      lintDoc.push(`documentation lint ${file}`)
      buildDoc.push(`documentation build -f md -o ${file.replace('.js', '.doc.md')}`)
      buildDoc.push(`git add ${file.replace('.js', '.doc.md')}`)
    })
    return [...lintDoc, ...buildDoc, ...addDoc]
  }
}
