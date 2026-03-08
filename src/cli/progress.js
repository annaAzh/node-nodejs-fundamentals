import { argv } from 'node:process'

const defaultDuration = 5000
const defaultInterval = 100
const defaultLength = 30
const resetStyle = "\x1b[0m"

const progress = () => {
  const args = argv.slice(2)
  const config = {
    duration: defaultDuration,
    interval: defaultInterval,
    length: defaultLength,
    color: null
  }

  for (let i = 0; i < args.length; i +=2) {
    const key = args[i].replace(/-{2}/, '')
    if (key in config && args[i + 1]) {
      config[key] = key === 'color' ? args[i + 1]: Number(args[i + 1])
    }
  }

  let step = 0

  const intervalId = setInterval(() =>{
    printProgress(config, step, intervalId)
    step += 1
  }, config.interval)
};

progress();

const printProgress = (config, step, intervalId) => {
  const { duration, interval,length } = config
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(config.color)
  const rgb = isValidHex ? hexToRGB(config.color) : null
  
  const steps = Math.ceil(duration / interval)
  const percent = Math.floor(step / steps * 100)
  const filled = Math.floor(percent / 100 * length)
  const empty = length - filled

  const block = '\u2588'
  const filledBlocks = block.repeat(filled)

  const filledLine = rgb
  ? `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m${filledBlocks}${resetStyle}`
  : filledBlocks

  const emptyLine = ' '.repeat(empty)
  const printedLine = `[${filledLine}${emptyLine}] ${percent}% `

  process.stdout.write('\r' + printedLine)

  if (step >= steps) {
    clearInterval(intervalId)
    process.stdout.write(`\nDone!\n`)
    process.exit(0)
  }
}

const hexToRGB = (color) => {
  color = color.toString();
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  return { r, g, b };
}