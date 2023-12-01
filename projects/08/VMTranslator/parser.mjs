// PARSING UTILITIES FOR THE HACK VM TRANSLATOR

export function getCommandType(command) {
  const prompt = command.split(" ")[0]
  switch (prompt) {
    case "push":
      return "C_PUSH"
    case "pop":
      return "C_POP"
    case "add":
      return "C_ARITHMETIC"
    case "sub":
      return "C_ARITHMETIC"
    case "neg":
      return "C_ARITHMETIC"
    case "eq":
      return "C_ARITHMETIC"
    case "gt":
      return "C_ARITHMETIC"
    case "lt":
      return "C_ARITHMETIC"
    case "and":
      return "C_ARITHMETIC"
    case "or":
      return "C_ARITHMETIC"
    case "not":
      return "C_ARITHMETIC"
    case "label":
      return "C_LABEL"
    case "goto":
      return "C_GOTO"
    case "if-goto":
      return "C_IF"
    case "function":
      return "C_FUNCTION"
    case "return":
      return "C_RETURN"
    case "call":
      return "C_CALL"
    default:
      break
  }
}

export function getFstArg(command) {
  if (command.type == "C_ARITHMETIC") {
    return command
  } else if (command.type == "C_RETURN") {
    throw "Function getFstArg should not be called on command of type C_RETURN"
  } else return command.split(" ")[1]
}

export function getSndArg(command) {
  if (
    command.type == "C_PUSH" ||
    command.type == "C_POP" ||
    command.type == "C_FUNCTION" ||
    command.type == "C_CALL"
  ) {
    return command.split(" ")[2]
  } else throw "Command of inappropriate type passed to function getSndArg"
}
