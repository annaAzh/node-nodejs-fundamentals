import { argv } from 'node:process'
import { resolve } from 'path'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const errorMessage = 'Plugin not found'
const folderName = 'plugins'

const dynamic = async () => {
  try {
    const fileName = argv.slice(2)[0]
    const rootPath = dirname(fileURLToPath(import.meta.url))
    const filePath = resolve(rootPath, folderName, fileName + '.js')

    const module = await import(filePath)
    console.log(module.run())
  } catch  {
    console.log(errorMessage)
    process.exit(1)
  }
};

await dynamic();
