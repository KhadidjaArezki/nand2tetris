// PARSING UTILITIES FOR THE HACK ASSEMBLER

export function getInstructionType(line) {
  if (line.indexOf("@") == 0) return "A_INSTRUCTION"
  else if (/^\w+=?.*;?\w*$/g.test(line)) return "C_INSTRUCTION"
  else if (line.indexOf("(") == 0) return "L_INSTRUCTION"
}

export function getAInstructionValue(aCommand) {
  return aCommand.substring(aCommand.indexOf("@") + 1, aCommand.length)
}

export function getLInstructionValue(label) {
  return label.substring(label.indexOf("(") + 1, label.indexOf(")"))
}

export function getDest(cCommand) {
  const end = cCommand.indexOf("=")
  return end == -1 ? null : cCommand.substring(0, end)
}

export function getComp(cCommand) {
  const comp = cCommand.indexOf("=")
  const start = comp == -1 ? 0 : comp + 1
  const jump = cCommand.indexOf(";")
  const end = jump == -1 ? cCommand.length : jump
  return cCommand.substring(start, end)
}

export function getJump(cCommand) {
  const jump = cCommand.indexOf(";")
  return jump == -1 ? null : cCommand.substring(jump + 1, cCommand.length)
}
