module.exports = {
  // Lint js files
  '*.js': filenames => {
    return [
      'yarn test',
      `yarn standard --fix ${filenames.join(' ')}`,
      `git add ${filenames.join(' ')}`
    ]
  },
  '!(*test|*steps).js': filenames => {
    const lintDoc = []

    filenames.map(file => {
      if (file.endsWith('.config.js')) return
      lintDoc.push(`documentation lint ${file}`)
    })
    return lintDoc
  }
}
