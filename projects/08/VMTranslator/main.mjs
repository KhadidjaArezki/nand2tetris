import fs from "fs"
import path from "path"
import { getCommandType } from "./parser.mjs"
import {
  translatePushPop,
  translateArithmetic,
  translateLabel,
  translateGoto,
  translateIf,
  translateFunction,
  translateReturn,
  translateCall,
} from "./translator.mjs"

/* TODO:
 * DONE TASK 01: The name of the input file or directory
 * may contain a file path. If no path is
 * specified, the VM translator operates
 * on the current directory by default.
 *
 * DONE TASK 02: Expand translator to handle label, goto,
 * and if-goto commands.
 *
 * DONE TASK 03: Expand translator to handle function,
 * call, and return commands.
 *
 * DONE TASK 04: Add bootstrap code
 * initialize stack pointer and VM segments and call Sys.init
 *
 */

function getFileName(filePath) {
  const temp = filePath.split("/")
  const fileName = temp[temp.length - 1]
  return isVMFileInput(fileName) ? temp[temp.length - 2] : fileName
}

function getDirName(path) {
  const temp = path.split("/")
  const fileName = temp[temp.length - 1]
  return isVMFileInput(fileName)
    ? temp.slice(0, temp.length - 1).join("/")
    : path
}

function isVMFileInput(input) {
  if (isPathlessInput(input)) {
    return input.indexOf(".vm") !== -1
  }
  const last = input.split("/").pop()
  return /\.vm$/.test(last)
}

function removeFileExtension(filePath) {
  const temp = filePath.split("/")
  const fileName = temp[temp.length - 1]
  return temp.length == 1
    ? fileName.substring(0, fileName.indexOf("."))
    : `${temp.slice(0, temp.length - 1).join("/")}/${fileName.substring(
        0,
        fileName.indexOf(".")
      )}`
}

function getCurrentDirBaseName() {
  return path.basename(process.cwd())
}

function isPathlessInput(input) {
  return input.indexOf("/") == -1
}

function getOutputPathOfPathlessInput(input) {
  return input == ""
    ? `./${getCurrentDirBaseName()}.asm`
    : isVMFileInput(input)
    ? `./${removeFileExtension(input)}.asm`
    : `./${input}.asm`
}

// Set up input and output paths
let inputPath = "../FunctionCalls/FibonacciElement"
inputPath = isPathlessInput(inputPath)
  ? inputPath == ""
    ? "./"
    : `./${inputPath}`
  : inputPath

const outputPath = isPathlessInput(inputPath)
  ? getOutputPathOfPathlessInput(inputPath)
  : isVMFileInput(inputPath)
  ? `${removeFileExtension(inputPath)}.asm`
  : `${inputPath}/${getFileName(inputPath)}.asm`

console.log(`inputPath: ${inputPath}`)
console.log(`outputPath: ${outputPath}`)
fs.writeFile(outputPath, "", (err) => {})

// STATE
let commands = []

// MAIN PROCESS
const logger = fs.createWriteStream(outputPath, {
  flags: "a", // 'a' means appending (old data will be preserved)
})
// Bootstrap Code:
let bootstrapToAssembly = `// SP = 256\n`
bootstrapToAssembly += `@256\n`
bootstrapToAssembly += `D=A\n`
bootstrapToAssembly += `@SP\n`
bootstrapToAssembly += `M=D\n\n`
bootstrapToAssembly += `// call Sys.init 0\n`
bootstrapToAssembly += translateCall("call Sys.init 0")
logger.write(`${bootstrapToAssembly}\n`)

fs.readdir(inputPath, (err, files) => {
  if (err) {
    files = [`${getFileName(inputPath)}.vm`]
    console.log(`Error while accessing directory => ${err}`)
  }
  files.forEach((file, index) => {
    if (isVMFileInput(file)) {
      // SIDE EFFECTS!!!
      let vmFileName = removeFileExtension(file)
      console.log(`vmFileName: ${vmFileName}`)

      file = `${getDirName(inputPath)}/${file}`
      console.log(`file: ${file}`)

      fs.readFile(file, (e, data) => {
        if (e) {
          console.error(`Error while accessing file: ${file} => ${e}`)
        }
        data
          .toString()
          .split(/\n/)
          .forEach((line) => {
            // Ignore comments and empty lines
            if (
              line.indexOf("//") !== 0 &&
              line !== "\r" &&
              line.length !== 0
            ) {
              const start = 0
              // Ignore in-line comments
              const end =
                line.indexOf("//") !== -1 ? line.indexOf("//") : line.length
              // Strip spaces from beginning and end of line
              line = line.substring(start, end).replace(/^\s+/g, "")
              line = line.substring(start, end).replace(/\s+$/g, "")
              // SIDE EFFECTS!!!
              commands.push({
                command: line,
                type: getCommandType(line),
                vmFile: vmFileName,
              })
            }
          })
      })
    }
  })
  setTimeout(() => {
    console.log(commands)

    commands.forEach((command) => {
      let commandToAssembly = ""
      if (command.type == "C_PUSH" || command.type == "C_POP") {
        commandToAssembly = translatePushPop(command.command, command.vmFile)
      } else if (command.type == "C_ARITHMETIC") {
        commandToAssembly = translateArithmetic(command.command)
      } else if (command.type == "C_LABEL") {
        commandToAssembly = translateLabel(command.command)
      } else if (command.type == "C_GOTO") {
        commandToAssembly = translateGoto(command.command)
      } else if (command.type == "C_IF") {
        commandToAssembly = translateIf(command.command)
      } else if (command.type == "C_FUNCTION") {
        commandToAssembly = translateFunction(command.command)
      } else if (command.type == "C_RETURN") {
        commandToAssembly = translateReturn(command.command)
      } else if (command.type == "C_CALL") {
        commandToAssembly = translateCall(command.command)
      }
      logger.write(`// ${command.command}\n`)
      logger.write(`${commandToAssembly}\n`)
    })
  }, 1000)
})
