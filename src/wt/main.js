import { readFile} from 'node:fs/promises';
import os from 'node:os';
import { Worker } from 'node:worker_threads';
import { resolve} from 'path'

const kWayMerge = (arrays) => {
  const pointers = new Map();
  const result = [];

  arrays.forEach((_, index) => {
    pointers.set(index, 0);
  });

  while (pointers.size > 0) {
    let minValue = Infinity;
    let minArrayIndex = null;

    for (const [arrayIndex, pointer] of pointers) {
      const value = arrays[arrayIndex][pointer];

      if (value < minValue) {
        minValue = value;
        minArrayIndex = arrayIndex;
      }
    }

    if (minArrayIndex === null) {
      break
    }

    result.push(minValue);

    const nextPointer = pointers.get(minArrayIndex) + 1;

    if (nextPointer >= arrays[minArrayIndex].length) {
      pointers.delete(minArrayIndex);
    } else {
      pointers.set(minArrayIndex, nextPointer);
    }
  }

  return result;
}


const main = async () => {
  const filePath = resolve('data.json')

  const cpus = os.cpus().length;
  
  const data = JSON.parse(await readFile(filePath));
  const chunkSize = Math.ceil(data.length / cpus)

  const chunks = []
  for(let i = 0; i < cpus; i += 1) {
    chunks.push(data.slice(i * chunkSize, (i + 1) * chunkSize))
  }

   const workerPromises = chunks.map(chunk => {
    return new Promise((resolve, reject) => {
     const worker = new Worker(new URL('./worker.js', import.meta.url))
      worker.postMessage(chunk)
      worker.once('message', resolve)
      worker.on('error', reject)
   })
  
  })

  const results = await Promise.all(workerPromises)

  const mergedArr = kWayMerge(results)

  console.log(mergedArr)

};

await main();
