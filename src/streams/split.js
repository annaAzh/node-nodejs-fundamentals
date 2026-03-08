import { argv } from 'node:process'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createReadStream, createWriteStream } from 'node:fs';
import { resolve } from 'path';

const defaultLines = 10

const split = async () => {
  const filePath = resolve('source.txt')
  const pathToChunks = resolve('.')

  const index = argv.indexOf('--lines')
  const linesPerFile = (index !== -1 && index + 1) ? parseInt(argv[index + 1], 10) : defaultLines

  const read = createReadStream(filePath, 'utf-8')

  let fileIndex = 1;
  let buffer = []

  const transform = new Transform({
    transform(chunk, _encoding, callback) {

    const lines = chunk.toString().split(/\r?\n/)
     for (const line of lines) {
        buffer.push(line)
        if(buffer.length >= linesPerFile) {
          const filePath = resolve(pathToChunks, `chunk_${fileIndex}.txt`)
          const ws = createWriteStream(filePath)
          ws.write(buffer.join('\n') + '\n')
          ws.end()
          fileIndex += 1
          buffer = []
        }
     }
      callback()
    },
    flush(callback) {
      if (buffer.length > 0) {
        const filePath = resolve(pathToChunks, `chunk_${fileIndex}.txt`)
        createWriteStream(filePath, buffer.join('\n'))
      }
      callback()
    }
  })

  await pipeline(read, transform)
};

await split();
