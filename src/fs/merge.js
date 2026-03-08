import { readdir, writeFile, readFile } from 'node:fs/promises'
import { resolve, extname } from 'node:path'
import { argv } from 'node:process'
import { exist } from '../shared/utils/index.js'

const directoryName = "workspace"
const partsName = 'parts'
const fileName = "merged.txt"
const errorMessage = 'FS operation failed'
const defaultExtension = '.txt'

const merge = async () => {
  const rootPath = resolve(directoryName)
  const partsFolder = resolve(directoryName, partsName)
  const destinationPath = resolve(rootPath, fileName)

  const index = argv.indexOf('--files')
  const exactFiles = index !== -1 && argv[index + 1] ? argv[index + 1].split(',') : null
  const mode = exactFiles === null ? 'default': 'optional'

  try {
    const isPartsExist = await exist(partsFolder, 'directory')
    if (!isPartsExist) throw new Error(errorMessage)

    const files = await readdir(partsFolder)
    const sorted = files.sort((a, b) => a.localeCompare(b))

    if (mode === 'optional') {
      const isContainAllFiles = exactFiles.every(file => sorted.includes(file))
      if (!isContainAllFiles) throw new Error(errorMessage)
    }

    const defaultSorted = sorted.filter(file => extname(file) === defaultExtension)
    if (mode === 'default') {
      const isContainDefaultExt = defaultSorted.length >= 1
      if (!isContainDefaultExt)  throw new Error(errorMessage)
    }

    const filesToMerge = mode === 'default' ? defaultSorted : exactFiles

    for (let i = 0; i < filesToMerge.length; i += 1) {
      const file = filesToMerge[i]
      const filePath = resolve(partsFolder, file)

      const content = await readFile(filePath)
      await writeFile(destinationPath, content.toString() + '\n' , {flag: 'a'})
    }

  } catch (error) {
    throw new Error(errorMessage)
  }
};

await merge();
