// UTILITIES FOR HACK-VM-TO-ASSEMBLY TRANSLATION

let contlabelCount = 0
let eqLabelCount = 0
let neLabelCount = 0
let gtLabelCount = 0
let geLabelCount = 0
let ltLabelCount = 0
let leLabelCount = 0
let labelPrefix = "FibonacciElement$"
let currentFunction = "FibonacciElement"
let runningFunctions = { [currentFunction]: 0 }

function getLabelPrefix() {
  return labelPrefix
}
function setLabelPrefix(p) {
  labelPrefix = p
}
function getCurrentFunction() {
  return currentFunction
}
function setCurrentFunction(fun) {
  currentFunction = fun
}

export function translateArithmetic(command) {
  let arithmeticToAssembly = ""
  if (command == "add" || command == "sub") {
    arithmeticToAssembly = translateAddSub(command)
  } else if (command == "neg" || command == "not") {
    arithmeticToAssembly = translateNegNot(command)
  } else if (command == "and" || command == "or") {
    arithmeticToAssembly = translateAndOr(command)
  } else if (command == "eq" || command == "gt" || command == "lt") {
    arithmeticToAssembly = translateEqGtLt(command)
  }
  return arithmeticToAssembly
}

export function translatePushPop(command, vmFileName) {
  let pushPopToAssembly = ""
  const [prompt, segment, i] = command.split(" ")
  if (segment == "constant") {
    pushPopToAssembly = pushConstant(i)
  } else {
    const segmentPointer = getSegmentPointer(segment, i, vmFileName)
    if (segment == "static" || segment == "pointer" || segment == "temp") {
      if (prompt == "push") {
        pushPopToAssembly = pushSegmentPointer(segmentPointer)
      } else {
        pushPopToAssembly = popSegmentPointer(segmentPointer)
      }
    } else {
      if (prompt == "push") {
        pushPopToAssembly = translatePush(segmentPointer, i)
      }
      // pop command
      else {
        pushPopToAssembly = translatePop(segmentPointer, i)
      }
    }
  }
  return pushPopToAssembly
}

export function translateLabel(command) {
  const [, label] = command.split(" ")
  return `(${getLabelPrefix()}${label})\n`
}
export function translateGoto(command) {
  const [, label] = command.split(" ")
  return `@${getLabelPrefix()}${label}\n0;JMP\n`
}
export function translateIf(command) {
  const [, label] = command.split(" ")
  let ifToAssembly = ""
  // SP--
  ifToAssembly += `@SP\n`
  ifToAssembly += `M=M-1\n`
  // if RAM[SP] !== 0 goto label
  ifToAssembly += `A=M\n`
  ifToAssembly += `D=M\n`
  ifToAssembly += `@${getLabelPrefix()}${label}\n`
  ifToAssembly += `D;JNE\n`
  return ifToAssembly
}
export function translateFunction(command) {
  const [, fun, nVars] = command.split(" ")
  setLabelPrefix(`${fun}$`)
  setCurrentFunction(fun)
  runningFunctions[fun] =
    runningFunctions[fun] == undefined ? 0 : runningFunctions[fun] + 1
  let functionToAssembly = `(${fun})\n`
  if (nVars > 0) {
    functionToAssembly += `@LCL\n`
    functionToAssembly += `A=M\n`
    for (let i = 0; i < nVars; i++) {
      functionToAssembly += `M=0\n`
      functionToAssembly += `A=A+1\n`
    }
    for (let i = 0; i < nVars; i++) {
      // SP++
      functionToAssembly += `@SP\n`
      functionToAssembly += `M=M+1\n`
    }
  }
  return functionToAssembly
}
export function translateReturn(command) {
  // Store end of frame address
  let returnToAssembly = `@LCL\n`
  returnToAssembly += `D=M\n`
  returnToAssembly += `@${getLabelPrefix()}endFrame\n`
  returnToAssembly += `M=D\n`
  // Store the function's return address
  returnToAssembly += `@${getLabelPrefix()}endFrame\n`
  returnToAssembly += `D=M\n`
  returnToAssembly += `@5\n`
  returnToAssembly += `A=D-A\n`
  returnToAssembly += `D=M\n`
  returnToAssembly += `@${getLabelPrefix()}retaddr\n`
  returnToAssembly += `M=D\n`
  // RAM[ARG] = RAM[SP]
  returnToAssembly += `@SP\n`
  returnToAssembly += `M=M-1\n`
  returnToAssembly += `A=M\n`
  returnToAssembly += `D=M\n`
  returnToAssembly += `@ARG\n`
  returnToAssembly += `A=M\n`
  returnToAssembly += `M=D\n`
  // SP = ARG + 1
  returnToAssembly += `@ARG\n`
  returnToAssembly += `A=M\n`
  returnToAssembly += `D=A+1\n`
  returnToAssembly += `@SP\n`
  returnToAssembly += `M=D\n`
  // Reistate the caller's segment pointers
  const pointers = ["THAT", "THIS", "ARG", "LCL"]
  for (let i = 0; i < pointers.length; i++) {
    returnToAssembly += `@${getLabelPrefix()}endFrame\n`
    returnToAssembly += `D=M\n`
    returnToAssembly += `@${i + 1}\n`
    returnToAssembly += `A=D-A\n`
    returnToAssembly += `D=M\n`
    returnToAssembly += `@${pointers[i]}\n`
    returnToAssembly += `M=D\n`
  }
  // Jump to the return address
  returnToAssembly += `@${getLabelPrefix()}retaddr\n`
  returnToAssembly += `A=M\n`
  returnToAssembly += `0;JMP\n`
  return returnToAssembly
}

export function translateCall(command) {
  const pointers = ["LCL", "ARG", "THIS", "THAT"]
  const [, fun, nArgs] = command.split(" ")
  const callerRetCount = runningFunctions[getCurrentFunction()]++
  // generate a label and store its address
  let callToAssembly = `@${getLabelPrefix()}ret.${callerRetCount}\n`
  callToAssembly += `D=A\n`
  callToAssembly += `@SP\n`
  callToAssembly += `A=M\n`
  callToAssembly += `M=D\n`
  // SP++
  callToAssembly += `@SP\n`
  callToAssembly += `M=M+1\n`
  // Store caller's segment pointers
  pointers.forEach((pointer) => {
    callToAssembly += `@${pointer}\n`
    callToAssembly += `D=M\n`
    callToAssembly += `@SP\n`
    callToAssembly += `A=M\n`
    callToAssembly += `M=D\n`
    callToAssembly += `@SP\n`
    callToAssembly += `M=M+1\n`
  })
  // Reposition callee's ARG
  callToAssembly += `@SP\n`
  callToAssembly += `D=M\n`
  callToAssembly += `@5\n`
  callToAssembly += `D=D-A\n`
  callToAssembly += `@${nArgs}\n`
  callToAssembly += `D=D-A\n`
  callToAssembly += `@ARG\n`
  callToAssembly += `M=D\n`
  // Reposition callee's LCL and SP
  callToAssembly += `@SP\n`
  callToAssembly += `D=M\n`
  callToAssembly += `@LCL\n`
  callToAssembly += `M=D\n`
  // goto function
  callToAssembly += `@${fun}\n`
  callToAssembly += `0;JMP\n`
  callToAssembly += `(${getLabelPrefix()}ret.${callerRetCount})\n`
  return callToAssembly
}

function translateAddSub(command) {
  // SP--
  let addSubToAssembly = `@SP\n`
  addSubToAssembly += `M=M-1\n`
  // arg1 = RAM[SP-1]
  addSubToAssembly += `@SP\n`
  addSubToAssembly += `A=M\n`
  addSubToAssembly += `D=M\n`
  // SP--
  addSubToAssembly += `@SP\n`
  addSubToAssembly += `M=M-1\n`
  // arg2 = RAM[SP-2]
  addSubToAssembly += `@SP\n`
  addSubToAssembly += `A=M\n`
  if (command == "add") {
    // D = arg1 + arg2
    addSubToAssembly += `D=M+D\n`
  } else {
    // D = arg1 - arg2
    addSubToAssembly += `D=M-D\n`
  }
  // RAM[SP] = D
  addSubToAssembly += `@SP\n`
  addSubToAssembly += `A=M\n`
  addSubToAssembly += `M=D\n`
  // SP++
  addSubToAssembly += `@SP\n`
  addSubToAssembly += `M=M+1\n`
  return addSubToAssembly
}

function translateEqGtLt(command) {
  // SP--
  let eqGtLtToAssembly = `@SP\n`
  eqGtLtToAssembly += `M=M-1\n`
  // arg1 = RAM[SP-1]
  eqGtLtToAssembly += `@SP\n`
  eqGtLtToAssembly += `A=M\n`
  eqGtLtToAssembly += `D=M\n`
  // SP--
  eqGtLtToAssembly += `@SP\n`
  eqGtLtToAssembly += `M=M-1\n`
  // arg2 = RAM[SP-2]
  eqGtLtToAssembly += `@SP\n`
  eqGtLtToAssembly += `A=M\n`
  // D = arg1 - arg2
  eqGtLtToAssembly += `D=M-D\n`
  // eq command
  if (command == "eq") {
    eqGtLtToAssembly += `@EQ${eqLabelCount}\n`
    eqGtLtToAssembly += `D;JEQ\n`
    eqGtLtToAssembly += `@NE${neLabelCount}\n`
    eqGtLtToAssembly += `D;JNE\n`
    eqGtLtToAssembly += `(EQ${eqLabelCount})\n`
    eqGtLtToAssembly += `D=-1\n`
    eqGtLtToAssembly += `@CONT${contlabelCount}\n`
    eqGtLtToAssembly += `0;JMP\n`
    eqGtLtToAssembly += `(NE${neLabelCount})\n`
    eqGtLtToAssembly += `D=0\n`
    eqGtLtToAssembly += `@CONT${contlabelCount}\n`
    eqGtLtToAssembly += `0;JMP\n`
    eqLabelCount++
    neLabelCount++
  }
  // gt command
  else if (command == "gt") {
    eqGtLtToAssembly += `@GT${gtLabelCount}\n`
    eqGtLtToAssembly += `D;JGT\n`
    eqGtLtToAssembly += `@LE${leLabelCount}\n`
    eqGtLtToAssembly += `D;JLE\n`
    eqGtLtToAssembly += `(GT${gtLabelCount})\n`
    eqGtLtToAssembly += `D=-1\n`
    eqGtLtToAssembly += `@CONT${contlabelCount}\n`
    eqGtLtToAssembly += `0;JMP\n`
    eqGtLtToAssembly += `(LE${leLabelCount})\n`
    eqGtLtToAssembly += `D=0\n`
    eqGtLtToAssembly += `@CONT${contlabelCount}\n`
    eqGtLtToAssembly += `0;JMP\n`
    gtLabelCount++
    leLabelCount++
  }
  // lt command
  else {
    eqGtLtToAssembly += `@LT${ltLabelCount}\n`
    eqGtLtToAssembly += `D;JLT\n`
    eqGtLtToAssembly += `@GE${geLabelCount}\n`
    eqGtLtToAssembly += `D;JGE\n`
    eqGtLtToAssembly += `(LT${ltLabelCount})\n`
    eqGtLtToAssembly += `D=-1\n`
    eqGtLtToAssembly += `@CONT${contlabelCount}\n`
    eqGtLtToAssembly += `0;JMP\n`
    eqGtLtToAssembly += `(GE${geLabelCount})\n`
    eqGtLtToAssembly += `D=0\n`
    eqGtLtToAssembly += `@CONT${contlabelCount}\n`
    eqGtLtToAssembly += `0;JMP\n`
    ltLabelCount++
    geLabelCount++
  }
  // RAM[SP] = D
  eqGtLtToAssembly += `(CONT${contlabelCount})\n`
  eqGtLtToAssembly += `@SP\n`
  eqGtLtToAssembly += `A=M\n`
  eqGtLtToAssembly += `M=D\n`
  // SP++
  eqGtLtToAssembly += `@SP\n`
  eqGtLtToAssembly += `M=M+1\n`
  contlabelCount++
  return eqGtLtToAssembly
}

function translateNegNot(command) {
  // SP--
  let negToAssembly = `@SP\n`
  negToAssembly += `M=M-1\n`
  // arg = RAM[SP-1]
  negToAssembly += `@SP\n`
  negToAssembly += `A=M\n`
  if (command == "neg") {
    // D = -arg
    negToAssembly += `D=-M\n`
  } else {
    // D = not D
    negToAssembly += `D=!M\n`
  }
  // RAM[SP] = D
  negToAssembly += `@SP\n`
  negToAssembly += `A=M\n`
  negToAssembly += `M=D\n`
  // SP++
  negToAssembly += `@SP\n`
  negToAssembly += `M=M+1\n`
  return negToAssembly
}
function translateAndOr(command) {
  // SP--
  let andOrToAssembly = `@SP\n`
  andOrToAssembly += `M=M-1\n`
  // arg1 = RAM[SP-1]
  andOrToAssembly += `@SP\n`
  andOrToAssembly += `A=M\n`
  andOrToAssembly += `D=M\n`
  // SP--
  andOrToAssembly += `@SP\n`
  andOrToAssembly += `M=M-1\n`
  // arg2 = RAM[SP-2]
  andOrToAssembly += `@SP\n`
  andOrToAssembly += `A=M\n`
  if (command == "and") {
    // D = arg1 and arg2
    andOrToAssembly += `D=M&D\n`
  }
  // or command
  else {
    // D = arg1 or arg2
    andOrToAssembly += `D=M|D\n`
  }
  // RAM[SP] = D
  andOrToAssembly += `@SP\n`
  andOrToAssembly += `A=M\n`
  andOrToAssembly += `M=D\n`
  // SP++
  andOrToAssembly += `@SP\n`
  andOrToAssembly += `M=M+1\n`
  return andOrToAssembly
}

function translatePush(segmentPointer, i) {
  // addr = segPointer + i
  let pushToAssembly = `@${i}\n`
  pushToAssembly += `D=A\n`
  pushToAssembly += `@${segmentPointer}\n`
  pushToAssembly += `D=D+M\n`
  pushToAssembly += `@addr\n`
  pushToAssembly += `A=D\n`
  // RAM[SP] = RAM[addr]
  pushToAssembly += `D=M\n`
  pushToAssembly += `@SP\n`
  pushToAssembly += `A=M\n`
  pushToAssembly += `M=D\n`
  // SP++
  pushToAssembly += `@SP\n`
  pushToAssembly += `M=M+1\n`
  return pushToAssembly
}
function translatePop(segmentPointer, i) {
  // addr = segPointer + i
  let popToAssembly = `@${i}\n`
  popToAssembly += `D=A\n`
  popToAssembly += `@${segmentPointer}\n`
  popToAssembly += `D=D+M\n`
  popToAssembly += `@addr\n`
  popToAssembly += `M=D\n`
  // SP--
  popToAssembly += `@SP\n`
  popToAssembly += `M=M-1\n`
  // RAM[addr] = RAM[SP]
  popToAssembly += `@SP\n`
  popToAssembly += `A=M\n`
  popToAssembly += `D=M\n`
  popToAssembly += `@addr\n`
  popToAssembly += `A=M\n`
  popToAssembly += `M=D\n`
  return popToAssembly
}
function pushConstant(i) {
  // RAM[SP] = i
  let pushConstantToAssembly = `@${i}\n`
  pushConstantToAssembly += `D=A\n`
  pushConstantToAssembly += `@SP\n`
  pushConstantToAssembly += `A=M\n`
  pushConstantToAssembly += `M=D\n`
  // SP++
  pushConstantToAssembly += `@SP\n`
  pushConstantToAssembly += `M=M+1\n`
  return pushConstantToAssembly
}
function pushSegmentPointer(segmentPointer) {
  // RAM[SP] = SegmentPointer
  let pushSegPToAssembly = `@${segmentPointer}\n`
  pushSegPToAssembly += `D=M\n`
  pushSegPToAssembly += `@SP\n`
  pushSegPToAssembly += `A=M\n`
  pushSegPToAssembly += `M=D\n`
  // SP++
  pushSegPToAssembly += `@SP\n`
  pushSegPToAssembly += `M=M+1\n`
  return pushSegPToAssembly
}

function popSegmentPointer(segmentPointer) {
  // SP--
  let popSegPToAssembly = `@SP\n`
  popSegPToAssembly += `M=M-1\n`
  // segmentPointer = RAM[SP]
  popSegPToAssembly += `@SP\n`
  popSegPToAssembly += `A=M\n`
  popSegPToAssembly += `D=M\n`
  popSegPToAssembly += `@${segmentPointer}\n`
  popSegPToAssembly += `M=D\n`
  return popSegPToAssembly
}
function getSegmentPointer(segment, i, vmFileName) {
  switch (segment) {
    case "local":
      return "LCL"
    case "argument":
      return "ARG"
    case "this":
      return "THIS"
    case "that":
      return "THAT"
    case "static":
      return `${vmFileName}.${i}`
    case "pointer":
      return i == "0" ? "THIS" : "THAT"
    case "temp":
      return Number(5 + parseInt(i)).toString()
    default:
      break
  }
}
