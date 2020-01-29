module.exports = {
  // Lint js files
  '*.js': filenames => {
    return [
      `npx jest --findRelatedTests ${filenames.join(
        ' '
      )}`,
      `npx eslint --fix ${filenames.join(' ')}`,
      `git add ${filenames.join(' ')}`,
    ]
  },
  'src/**/!(*test|*steps).js': filenames => {
    const lintDoc = filenames.map(file => {
      if (file.endsWith('.config.js')) return ''
      return `documentation lint ${file}`
    })
    return lintDoc
  },
}
