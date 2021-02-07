const fs = require('fs')
const path = require('path')

export const getAllFiles = (dirPath) => {
  const files = fs.readdirSync(dirPath)

  return files
    .map((file) => {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        return getAllFiles(dirPath + '/' + file)
      } else {
        return path.join(__dirname, dirPath, '/', file)
      }
    })
    .flat()
}