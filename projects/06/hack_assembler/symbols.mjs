import { getAInstructionValue, getLInstructionValue } from "./parser.mjs"

const BASE_VARIABLE_ADDRESS = 16

// Shared State
export const symbolTable = {
  R0: "0",
  R1: "1",
  R2: "2",
  R3: "3",
  R4: "4",
  R5: "5",
  R6: "6",
  R7: "7",
  R8: "8",
  R9: "9",
  R10: "10",
  R11: "11",
  R12: "12",
  R13: "13",
  R14: "14",
  R15: "15",
  SCREEN: "16384",
  KBD: "24576",
  SP: "0",
  LCL: "1",
  ARG: "2",
  THIS: "3",
  THAT: "4",
}

// Add labels to symbol table
export function populateSymbolTableFstPass(instructions) {
  let commandNumber = 0
  instructions.forEach((instruction) => {
    if (instruction.type == "L_INSTRUCTION") {
      const symbol = getLInstructionValue(instruction.command)
      // SIDE EFFECTS!!!
      symbolTable[symbol] = Number(commandNumber).toString()
    } else commandNumber++
  })
  return symbolTable
}

// Add variables to symbol table
export function populateSymbolTableSndPass(instructions) {
  let currentVariableAddress = BASE_VARIABLE_ADDRESS
  instructions.forEach((instruction) => {
    if (instruction.type == "A_INSTRUCTION") {
      const symbol = getAInstructionValue(instruction.command)
      if (isNaN(parseInt(symbol))) {
        if (!symbolTable.hasOwnProperty(symbol)) {
          // SIDE EFFECTS!!!
          symbolTable[symbol] = Number(currentVariableAddress).toString()
          currentVariableAddress++
        }
      }
    }
  })
  return symbolTable
}
