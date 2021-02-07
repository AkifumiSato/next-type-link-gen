import { getAllFiles } from './fileUtils'

const fs = require('fs')
let pagesPath

if (fs.existsSync(`${ process.cwd() }/pages`)) {
  pagesPath = `${ process.cwd() }/pages`
} else if (fs.existsSync(`${ process.cwd() }/src/pages`)) {
  pagesPath = `${ process.cwd() }/src/pages`
} else {
  throw new Error('pages directory not found.')
}

const pagesDir = getAllFiles(pagesPath)
console.log(pagesDir)
