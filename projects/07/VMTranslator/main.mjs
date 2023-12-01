import fs from "fs"
import { getCommandType } from "./parser.mjs"
import { translatePushPop, translateArithmetic } from "./translator.mjs"

const folder = "StackArithmetic"
const subFolder = "StackTest"
export const fileName = "StackTest"
const inputFile = `../${folder}/${subFolder}/${fileName}.vm`
const outputFile = `../${folder}/${subFolder}/${fileName}.asm`
fs.writeFile(outputFile, "", (err) => {})

// STATE
let commands = []

// MAIN PROCESS
fs.readFile(inputFile, (e, data) => {
  data
    .toString()
    .split(/\n/)
    .forEach((line) => {
      // Ignore comments and empty lines
      if (line.indexOf("//") !== 0 && line !== "\r" && line.length !== 0) {
        const start = 0
        // Ignore in-line comments
        const end = line.indexOf("//") !== -1 ? line.indexOf("//") : line.length
        // Strip spaces from beginning and end of line
        line = line.substring(start, end).replace(/^\s+/g, "")
        line = line.substring(start, end).replace(/\s+$/g, "")
        // SIDE EFFECTS!!!
        commands.push({
          command: line,
          type: getCommandType(line),
        })
      }
    })
  console.log(commands)

  const logger = fs.createWriteStream(outputFile, {
    flags: "a", // 'a' means appending (old data will be preserved)
  })

  commands.forEach((command) => {
    let commandToAssembly = ""
    if (command.type == "C_PUSH" || command.type == "C_POP") {
      commandToAssembly = translatePushPop(command.command)
    } else if (command.type == "C_ARITHMETIC") {
      commandToAssembly = translateArithmetic(command.command)
    }
    // console.log(commandToAssembly)
    logger.write(`// ${command.command}\n`)
    logger.write(`${commandToAssembly}\n`)
  })
})
