export function vmWriter() {
  return {
    writePush(segment, index) {
      return `push ${segment} ${index}\n`
    },
    writePop(segment, index) {
      return `pop ${segment} ${index}\n`
    },
    writeArithmetic(command) {
      return `${command}\n`
    },
    writeLabel(label) {
      return `label ${label}\n`
    },
    writeGoto(label) {
      return `goto ${label}\n`
    },
    writeIf(label) {
      return `if-goto ${label}\n`
    },
    writeCall(name, nArgs) {
      return `call ${name} ${nArgs}\n`
    },
    writeFunction(name, nVars) {
      return `function ${name} ${nVars}\n`
    },
    writeReturn() {
      return `return\n`
    },
    writeBinOp(op) {
      switch (op) {
        case "+":
          return "add\n"
        case "-":
          return "sub\n"
        case "*":
          return "call Math.multiply 2\n"
        case "/":
          return "call Math.divide 2\n"
        case "&":
          return "and\n"
        case "|":
          return "or\n"
        case "<":
          return "lt\n"
        case ">":
          return "gt\n"
        case "=":
          return "eq\n"
        default:
          break
      }
    },
    writeUnOp(op) {
      switch (op) {
        case "-":
          return "neg\n"
        case "~":
          return "not\n"
        default:
          break
      }
    },
  }
}
