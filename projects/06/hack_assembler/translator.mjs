// UTILITIES FOR HACK-ASSEMBLY-TO-BINARY TRANSLATION

import { getDest, getComp, getJump, getAInstructionValue } from "./parser.mjs"
import { symbolTable } from "./symbols.mjs"

export function instructionToBin(instruction) {
  if (instruction.type == "A_INSTRUCTION") {
    let aValue = getAInstructionValue(instruction.command)
    if (isNaN(aValue)) {
      aValue = symbolTable[aValue]
    }
    return posDecToBin(aValue)
  } else if (instruction.type == "C_INSTRUCTION") {
    return cCommandToBin(instruction.command)
  }
}

// Convert a_instruction to binary
export function posDecToBin(decValue) {
  const binary = Number(decValue).toString(2)
  return `${"0".repeat(16 - binary.length)}${binary}`
}

// Convert c_instruction to binary
export function cCommandToBin(cCommand) {
  const dest = getDest(cCommand)
  const comp = getComp(cCommand)
  const jump = getJump(cCommand)
  const destBin = getDestBin(dest)
  const compBin = getCompBin(comp)
  const jumpBin = getJumpBin(jump)
  return `111${compBin}${destBin}${jumpBin}`
}

function getDestBin(dest) {
  switch (dest) {
    case null:
      return "000"
    case "M":
      return "001"
    case "D":
      return "010"
    case "DM":
      return "011"
    case "MD":
      return "011"
    case "A":
      return "100"
    case "AM":
      return "101"
    case "MA":
      return "101"
    case "AD":
      return "110"
    case "DA":
      return "110"
    case "ADM":
      return "111"
    case "AMD":
      return "111"
    case "DAM":
      return "111"
    case "DMA":
      return "111"
    case "MAD":
      return "111"
    case "MDA":
      return "111"
    default:
      break
  }
}
function getCompBin(comp) {
  let a = "0"
  let compFields = ""
  switch (comp) {
    case "0":
      compFields = "101010"
      break
    case "1":
      compFields = "111111"
      break
    case "-1":
      compFields = "111010"
      break
    case "D":
      compFields = "001100"
      break
    case "A":
      compFields = "110000"
      break
    case "!D":
      compFields = "001101"
      break
    case "!A":
      compFields = "110001"
      break
    case "-D":
      compFields = "001111"
      break
    case "-A":
      compFields = "110011"
      break
    case "D+1":
      compFields = "011111"
      break
    case "A+1":
      compFields = "110111"
      break
    case "D-1":
      compFields = "001110"
      break
    case "A-1":
      compFields = "110010"
      break
    case "D+A":
      compFields = "000010"
      break
    case "D-A":
      compFields = "010011"
      break
    case "A-D":
      compFields = "000111"
      break
    case "D&A":
      compFields = "000000"
      break
    case "D|A":
      compFields = "010101"
      break
    case "M":
      a = "1"
      compFields = "110000"
      break
    case "!M":
      a = "1"
      compFields = "110001"
      break
    case "-M":
      a = "1"
      compFields = "110011"
      break
    case "M+1":
      a = "1"
      compFields = "110111"
      break
    case "M-1":
      a = "1"
      compFields = "110010"
      break
    case "D+M":
      a = "1"
      compFields = "000010"
      break
    case "D-M":
      a = "1"
      compFields = "010011"
      break
    case "M-D":
      a = "1"
      compFields = "000111"
      break
    case "D&M":
      a = "1"
      compFields = "000000"
      break
    case "D|M":
      a = "1"
      compFields = "010101"
      break
    default:
      break
  }
  return `${a}${compFields}`
}
function getJumpBin(jump) {
  switch (jump) {
    case null:
      return "000"
    case "JGT":
      return "001"
    case "JEQ":
      return "010"
    case "JGE":
      return "011"
    case "JLT":
      return "100"
    case "JNE":
      return "101"
    case "JLE":
      return "110"
    case "JMP":
      return "111"
    default:
      break
  }
}
