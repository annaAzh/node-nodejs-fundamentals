import { createInterface } from 'node:readline'

const errorMessage = 'Unknown command'

const interactive = () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  })

  rl.prompt()

  rl.on('line', (line) => {
    controller(line, rl)
    rl.prompt()
  })

  rl.on('SIGINT', () => rl.close())

  rl.on('close', () => {
    console.log('Goodbye!')
    process.exit(0)
  })
};

const controller = (line, rl) => {
  const command = line.trim()

 try {
   switch(command) {
    case 'uptime': {
      console.log(`Uptime: ${process.uptime().toFixed(2)}s`) 
      break;
    }
    case 'cwd': {
      console.log(process.cwd())
      break;
    }
    case 'date': {
      console.log(new Date().toISOString())
      break;
    }
    case 'exit': {
      rl.close()
    }
    default: {
      throw new Error(errorMessage);
    }
  }
 } catch (error) {
  console.log(error.message)
 }
}

interactive();
