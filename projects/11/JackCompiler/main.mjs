/**
 * DONE Task 01: This program receives as input either a file name of the
 * form Xxx.jack or a folder name. If no path is specified, the
 * analyzer operates on the current folder.
 * It constructs an output file for writing the output (XML code).
 * The output file corresponding to each input Xxx.jack file
 * is named XxxT.xml
 * An XML file must be enclosed within some begin and end tags;
 * this convention is satisfied by the <tokens> and </tokens> tags.
 *
 * DONE Task 02: For each Xxx.jack input file, the analyzer
 * constructs a JackTokenizer for handling the input.
 * After constructing a JackTokenizer, the analyzer enters
 * a loop that advances and handles all the tokens in the
 * input file, one token at a time, using the JackTokenizer
 * services.
 *
 * JackAnalyzer:
 * Input: a single fileName.jack, or a folder containing 0 or more such files
 * For each file:
 *   1. Creates a JackTokenizer from fileName.jack
 *   2. Creates an output file named fileName.xml and, optionally, a tokenized file named fileNameT.xml
 *   3. Creates a CompilationEngine, and calls the compileClass method.
 */
import fs from "fs"
import { JackTokenizer } from "./tokenizer.mjs"
import { CompilationEngine } from "./compilationEngine.mjs"

function isPathlessInput(input) {
  return input.indexOf("/") == -1
}

function isJackFileInput(input) {
  if (isPathlessInput(input)) {
    return input.indexOf(".jack") !== -1
  }
  const last = input.split("/").pop()
  return /\.jack$/.test(last)
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

function getDirName(path) {
  const temp = path.split("/")
  const fileName = temp[temp.length - 1]
  return isJackFileInput(fileName)
    ? temp.slice(0, temp.length - 1).join("/")
    : path
}

// Set up input and output paths
let inputPath = "../ComplexArrays"
inputPath = isPathlessInput(inputPath)
  ? inputPath == ""
    ? "./"
    : `./${inputPath}`
  : inputPath

if (isJackFileInput(inputPath)) {
  const tokenizedOutputPath = `${removeFileExtension(inputPath)}.vm`
  fs.writeFile(tokenizedOutputPath, "", (err) => {})
  const logger = fs.createWriteStream(tokenizedOutputPath, {
    flags: "a", // 'a' means appending (old data will be preserved)
  })
  fs.readFile(inputPath, (e, data) => {
    console.log(`file: ${inputPath}`)
    if (e) {
      console.error(`Error while accessing file: ${inputPath} => ${e}`)
    } else {
      const inputStr = data.toString()
      const tokenizer = JackTokenizer(inputStr)
      const compiler = CompilationEngine(tokenizer)
      if (tokenizer.hasMoreTokens()) tokenizer.advance()
      const compilerOutput = compiler.compileClass()
      logger.write(compilerOutput)
    }
  })
} else {
  fs.readdir(inputPath, (err, files) => {
    if (err) {
      console.log(`Error while accessing directory => ${err}`)
    }
    files.forEach((file, index) => {
      if (isJackFileInput(file)) {
        file = `${getDirName(inputPath)}/${file}`
        console.log(`file: ${file}`)

        const outputPath = `${removeFileExtension(file)}.vm`
        fs.writeFile(outputPath, "", (err) => {})
        const logger = fs.createWriteStream(outputPath, {
          flags: "a", // 'a' means appending (old data will be preserved)
        })

        fs.readFile(file, (e, data) => {
          if (e) {
            console.error(`Error while accessing file: ${file} => ${e}`)
          } else {
            console.log(`compiling file: ${file}`)
            const inputStr = data.toString()
            const tokenizer = JackTokenizer(inputStr)
            const compiler = CompilationEngine(tokenizer)
            if (tokenizer.hasMoreTokens()) tokenizer.advance()
            const compilerOutput = compiler.compileClass()
            logger.write(compilerOutput)
          }
        })
      }
    })
  })
}
