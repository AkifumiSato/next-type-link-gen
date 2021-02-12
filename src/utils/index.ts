import * as fs from 'fs'
import path from 'path'

export const getAllFiles = (dirPath: string): string[] => {
  const files = fs.readdirSync(dirPath)

  return files
    .map((file: string) => {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        return getAllFiles(dirPath + '/' + file)
      } else {
        return path.join(__dirname, dirPath, '/', file)
      }
    })
    .reduce((accum: string[], current: string | string[]) => {
      if (Array.isArray(current)) {
        return [
          ...accum,
          ...current,
        ]
      }
      return [
        ...accum,
        current,
      ]
    }, [])
}

export const readNextPagesRoute = (): string[] => {
  let pagesPath

  if (fs.existsSync(`${ process.cwd() }/pages`)) {
    pagesPath = `${ process.cwd() }/pages`
  } else if (fs.existsSync(`${ process.cwd() }/src/pages`)) {
    pagesPath = `${ process.cwd() }/src/pages`
  } else {
    throw new Error('pages directory not found.')
  }

  return getAllFiles(pagesPath)
    .map(filePath => filePath
      .replace(/\.tsx?/, '')
      .replace(/index$/, '')
    )
}
