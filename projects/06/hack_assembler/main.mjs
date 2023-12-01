import fs from "fs"
import { getInstructionType } from "./parser.mjs"
import { instructionToBin } from "./translator.mjs"
import {
  populateSymbolTableFstPass,
  populateSymbolTableSndPass,
} from "./symbols.mjs"

const inputFile = "../pong/Pong.asm"
const outputFile = "../bin/Pong.hack"
fs.writeFile(outputFile, "", (err) => {})

// STATE
let instructions = []
let symbolTable = {}

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
        // Strip spaces
        line = line.substring(start, end).replace(/\s+/g, "")
        // SIDE EFFECTS!!!
        instructions.push({
          command: line,
          type: getInstructionType(line),
        })
      }
    })

  symbolTable = populateSymbolTableFstPass(instructions)
  symbolTable = populateSymbolTableSndPass(instructions)

  const logger = fs.createWriteStream(outputFile, {
    flags: "a", // 'a' means appending (old data will be preserved)
  })

  instructions.forEach((instruction) => {
    if (instruction.type !== "L_INSTRUCTION") {
      const instructionBin = instructionToBin(instruction)
      logger.write(`${instructionBin}\n`)
    }
  })
})
