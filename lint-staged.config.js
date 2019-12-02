module.exports = {
  // Lint js files
  '*.js': filenames => {
    return [
      `yarn standard --fix ${filenames.join(' ')}`,
      `git add ${filenames.join(' ')}`
    ]
  },
  '(*test|*steps).js': (filenames) => {
    return `yarn jest ${filenames.join(' ')} --bail --findRelatedTests --coverage `
  },
  '!(*test|*steps).js': filenames => {
    const lintDoc = []
    const buildDoc = []
    const addDoc = []

    filenames.map(file => {
      if (file.endsWith('.config.js')) return
      lintDoc.push(`documentation lint ${file}`)
      buildDoc.push(`documentation build -f md ${file} -o ${file.replace('.js', '.doc.md')} --shallow`)
      buildDoc.push(`git add ${file.replace('.js', '.doc.md')}`)
    })
    return [...lintDoc, ...buildDoc, ...addDoc]
  }
}
