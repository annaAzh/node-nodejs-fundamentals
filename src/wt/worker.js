import { parentPort } from 'worker_threads';

parentPort.on('message', (data) => {
  const res =  data.sort((a, b) => a - b)

  parentPort.postMessage(res)
  parentPort.close()
});
