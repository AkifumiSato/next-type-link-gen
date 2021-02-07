const fs = require('fs')
const path = require('path')

export const getAllFiles = (dirPath) => {
  const files = fs.readdirSync(dirPath)

  return files
    .map((filePath) => {
      if (fs.statSync(dirPath + '/' + filePath).isDirectory()) {
        return getAllFiles(dirPath + '/' + filePath)
      } else {
        return path.join(dirPath, '/', filePath)
      }
    })
    .flat()
    .map((filePath) => filePath.replace(process.cwd(), ''))
}