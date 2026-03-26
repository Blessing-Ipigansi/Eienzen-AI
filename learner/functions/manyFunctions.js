import fs from 'fs'

// const iterator = {
//   now: 0,
//   next() {
//     this.now++
//     return {
//       value: this.now,
//       done: (10 <= this.now)
//     }
//   },
//   [Symbol.iterator]() {
//     return this
//   }
// }

// iteratorWithGenerator = {
//   [Symbol.iterator]: function* () {
//     yield "yeet"
//     yield "off"
//     yield "hill"
//   }
// }

// function* generator(bottomLim=0, upperLim=Infinity, skip=1) {
//   while (bottomLim <= upperLim) {
//     yield bottomLim;
//     bottomLim = bottomLim + skip
//   }
// }
//
// const iteratorWithGenerator = generator(0, 10, 2)
//
// for (const value of generator(0, 10, 2)) {
//   console.log(`${value}`)
// }
// console.log("__________________________________");
// for (const val of generator(1, 10, 2)) {
//   console.log(`${val}`)
// }

// function runner () {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })
//
//   rl.setPrompt("\n\nWelcome to the function tester!\n" +
//       "This program was created to test run functions directly from the console,\n" +
//       "so that you don't have to build a new process every time.\n" +
//       "Type 'run ${functionName}' to run your function.\n" +
//       "Type 'run ${functionName} Argument-Separator: ${seperatorString} ${type:arg}${seperatorString}${type:arg}...'\n" +
//       "Type 'run ${functionName} ${type:arg} ${type:arg}' to use the default single-whitespace(' ') separator.\n" +
//       "Type '--help -arg' for help on arguments.\n" +
//       "Type '--help ${functionName}' for more information on a function.\n" +
//       "Type '--help for more general information.'\n\n\n" +
//       "Run here --> ")
//   rl.prompt()
//
//   rl.on('line', async (line) => {
//     const command = line.split(' ', 3)
//     if (command[0] === 'run') {
//       if (command[2]) {
//         if (command[2].split(' ')[0] === 'Argument-Separator:') {
//           const part3 = command[2].split(' ', 3)
//           const argsAndTypes = part3[2].split(part3[1])
//           const args = argsAndTypes.map(arg => {
//             const typeAndArg = arg.split(':', 1)
//           })
//         } else {
//
//         }
//       } else imports[command[1]]()
//     }
//     else if (command[0] === '--help' && !command[1]) console.log(imports)
//     else if (command[0] === '--help' && command[1] && (command[1].split('')[0] !== '-')) {
//       console.log(imports[command[1]])
//     } else if (command[0] === '--help' && command[1] && (command[1] === '-arg')) {
//       console.log(argumentTypes)
//     }
//     else if (command[0] === 'exit') {
//       console.log("Have a great day!")
//       process.exit(1)
//     }
//     else console.log("Unknown command: ", line)
//
//     rl.setPrompt("Run here --> ")
//     rl.prompt()
//   }).on('close', () => {console.log("\nHave a great day!")})
// }


// import {authorize} from "./backend/functions/helperFunctions";
// import streamData from "./Test-Stream-Data.json";
//
// export async function generateImage(req, res) {
//   await authorize(req)
//   res.setHeader('Content-Type', 'text/event-stream')
//   res.setHeader('Cache-Control', 'no-cache')
//   res.setHeader('Connection', 'keep-alive')
//
//   const toStream = streamData[0].stream.split(" ")
//   const wordCount = toStream.length
//   let wordPosition = 0
//
//   const streamIntervalId = setInterval(() => {
//     if (wordPosition < wordCount) {
//       res.write(`data: ${toStream[wordPosition]}\n\n`)
//       ++wordPosition
//     } else res.end()
//   }, 100)
//
//   req.on('close', () => {
//     clearInterval(streamIntervalId)
//     res.end()
//   })
// }

export function count (delay=0, timeoutFunction=undefined) {
  const defaultFunction = () => {
    console.log(`Timed out after: ${delay}s`)
  }

  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const returnValue = timeoutFunction || defaultFunction
        returnValue()
        resolve(`Promise resolved after ${delay}s`)
      }, delay * 1000)
    } catch (error) {
      reject(`${error.name}: ${error.message}`)
    }
  })
}

function* asyncCounterGenerator (times=0) {
  while (times > 0) {
    yield count(times)
    times = times - 1
  }
}

export async function iterateOverCounterGenerator(times=0) {
  const iterableFromAsyncCounterGenerator = asyncCounterGenerator(times)
  let counter = 1

  for await (const run of iterableFromAsyncCounterGenerator) {
    console.log(`yield of iterable (${counter}): ${run}`)
    counter = counter + 1
  }
}

// async function* a (...args) {
//   function b (c) {
//     return new Promise((resolve, reject) => {
//       const timeoutId = setTimeout(() => {
//         console.log("This is " + String(c))
//         resolve("✔")
//         clearTimeout(timeoutId)
//       }, Number(c) * 1000)
//     })
//   }
//   for (const arg of args) {
//     yield b(arg)
//   }
// }
//
// export async function d (...args) {
//   const e = a(...args)
//   for await (const es of e) {
//
//   }
//   console.log('😪😪 This should be last 😪😪.')
// }

export function readImage() {
  fs.readFile('C:/Users/1012 G2/Pictures/brimedgeFavicon.png', (readError, data) => {
    fs.writeFile('C:/Users/1012 G2/Desktop/PROJECTS/FULL-STACK/EienzenAI/ImageBinary.png'
        , data, (writeError) => console.log(writeError))
  })
}

function sharedMemory () {
  const memoryAllocation = new SharedArrayBuffer(4)
  const bytesAsChars = new TextDecoder()

  const act1byte = new Uint8Array(memoryAllocation)
  const act4byteInt = new Int32Array(memoryAllocation)

  console.log("32-bit Int array-view length: ", act4byteInt.length+'\n'+act4byteInt[0])
  console.log("8-bit Int array-view length: ", act1byte.length+'\n'+act1byte[0])

  act4byteInt[0] = 91374424
  console.log("32-bit Int array-view length: ", act4byteInt.length+'\n'+act4byteInt[0])
  console.log(bytesAsChars.decode(act1byte))
  console.log(bytesAsChars.decode(act4byteInt))
  act1byte[0] = 251
  act1byte[1] = 251;
  act1byte[2] = 251;
  act1byte[3] = 251;
  console.log("32-bit Int array-view length: ", act4byteInt.length+'\n'+act4byteInt[0])
  console.log(bytesAsChars.decode(act1byte));
  console.log(bytesAsChars.decode(act4byteInt));
}