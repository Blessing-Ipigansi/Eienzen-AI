import readline from "readline";

const directories = [
  "file:///C:/Users/1012 G2/Desktop/PROJECTS/FULL-STACK/EienzenAI/learner/functions/manyFunctions.js",
  "file:///C:/Users/1012 G2/Desktop/PROJECTS/full-stack/EienzenAI/backend/functions/helperFunctions.js",
  "file:///C:/Users/1012 G2/Desktop/PROJECTS/express-apis/learn-express-through-miniprojects/testFolder/permutationsAlgorithm.js",
];
const imports = {}
const locations = {}

async function importer () {
  for (const dir of directories) {
    const exports = await import(dir)
    for (const exp in exports) {
      let clashes = 0
      let name = exp
      while (true) {
        if (imports[name]) {
          clashes = clashes + 1
          name = `${exp}X${clashes}`
        } else break
      }
      imports[name] = exports[exp]
      locations[name] = dir
    }
  }
}

function runner () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.setPrompt("\n\nWelcome to the function tester!\n" +
      "This program was created to test run functions directly from the console,\n" +
      "so that you don't have to build a new process every time.\n" +
      "Type 'run ${function}' to run your function.\n" +
      "Type '--help ${functionName}' for more information on a function.\n" +
      "Type '--help for more general information.'\n\n\n" +
      "Run here --> ")
  rl.prompt()

  rl.on('line', async (line) => {
    let [linePart1, linePart2] = line.split(/ (.+)/, 2)
    const command = [linePart1, linePart2]
    if (command[0] === 'run' && command[1]) {
      try {
        if (command[1][0] === '(') {
          eval(`const directFunction = ${command[1]}; directFunction()`)
        } else {
          let parts = command[1].split(/\((.+)/)
          parts = [parts[0], '('+String(parts[1])];
          eval(`console.log( imports["${parts[0]}"]${parts[1]} )`)
        }
      } catch (error) {
        console.log(`${error.name}: ${error.message}`)
      }
    }
    else if (command[0] === '--help' && !command[1]) {
      console.log(
        imports,
        "\nThe ${imports} object holds all available functions.",
        "\nYou can also define and call an arrow function directly " +
          "in the console with 'run ${() => {}}'"
      );
    }
    else if (command[0] === 'exit') {
      console.log("Have a great day!")
      process.exit(1)
    }
    else console.log("Unknown command: ", line)

    rl.setPrompt("Run here --> ")
    rl.prompt()
  }).on('close', () => {console.log("\nHave a great day!")})
}

async function main () {
  await importer()
  runner()
}

main().then(p => { console.log("Done!") })