import { SymbolTable } from "./symbolTable.mjs"
import { vmWriter } from "./vmWriter.mjs"
/**
 * The Jack language features five categories of terminal elements (tokens):
 * keyword: 'class' | 'constructor' | 'function' |
    'method' | 'field' | 'static' | 'var' |
    'int' | 'char' | 'boolean' | 'void' | 'true' |
    'false' | 'null' | 'this' | 'let' | 'do' |
    'if' | 'else' | 'while' | 'return'

 * symbol: '{' | '}' | '(' | ')' | '[' | ']' | '.' |
     ',' | ';' | '+' | '-' | '*' | '/' | '&' |
     '|' | '<' | '>' | '=' | '~'

 * integerConstant: A decimal number in the range 0 .. 32767.
 * StringConstant: '""' A sequence of Unicode characters not
     including double quote or newline '""'

 * identifier: A sequence of letters, digits, and underscore
     ('_') not starting with a digit.

 ** PROGRAM STRUCTURE:
 * A Jack program is a collection of classes, each appearing in a separate ﬁle.
   The compilation unit is a class. A class is a sequence of tokens structured
   according to the following context free syntax:
 * class:'class' className '{' classVarDec* subroutineDec* '}'
 * classVarDec:('static' | 'field') type varName (',' varName)* ';'
 * type: 'int' | 'char' | 'boolean' | className
 * subroutineDec:('constructor' | 'function' | 'method')
     ('void' | type) subroutineName '(' parameterList ')' subroutineBody
 * parameterList:((type varName) (',' type varName)*)?
 * subroutineBody: '{' varDec* statements '}'
 * varDec: 'var' type varName (',' varName)* ';'
 * className:identifier
 * subroutineName:identifier
 * varName:identifier
 
 ** Statements:
 * statements: statement*
 * statement: letStatement | ifStatement | whileStatement |
     doStatement | returnStatement
 * letStatement:'let' varName ('[' expression ']')? '=' expression ';'
 * ifStatement:'if' '(' expression ')' '{' statements '}'
     ('else' '{' statements '}')?
 * whileStatement: 'while' '(' expression ')' '{' statements '}'
 * doStatement:'do' subroutineCall ';'
 * ReturnStatement: 'return' expression? ';'
 
 ** Expressions:
 * expression: term (op term)*
 * term: integerConstant | stringConstant | keywordConstant |
     varName | varName '[' expression ']' | subroutineCall |
     '(' expression ')' | unaryOp term
 * subroutineCall: subroutineName '(' expressionList ')' | (className |
     varName) '.' subroutineName '(' expressionList ')'
 * expressionList: (expression (',' expression)* )?
 * op: '+' | '-' | '*' | '/' | '&' | '|' | '<' | '>' | '=' 
 * unaryOp: '-' | '~'
 * KeywordConstant: 'true' | 'false' | 'null' | 'this'
  
 
 ** Implementation:
  * If the analyzer encounters a terminal element xxx
    It generates the output: <terminalType> xxx </terminalType>
    where terminalType is: keyword, symbol, integerConstant,
    stringConstant, identifier

  * If the analyzer encounters one of the nonterminal elements:
    class declaration, class variable declaration, subroutine
    declaration, parameter list, subroutine body, variable declaration,
    statements, let statement, if statement, while statement, do statement,
    return statement, an expression, a term, or an expression list
    It generates the output:
      <nonTerminal>
        Recursive output for the nonterminal body
      </nonTerminal>
    where nonTerminal is:
      class, classVarDec, subroutineDec, parameterList,
      subroutineBody, varDec; statements, LetStatement,
      ifStatement, whileStatement, doStatement, 
      returnStatement; expression, term, expressionList
 ** If the analyzer encounters one of the (simple) nonterminal elements:
     type, className, subroutineName, variableName,
     statement, and subroutineCall
    It handles the body of the nonterminal directly, without calling other methods
    (because it simplifies the implementation).

 */
const VMWriter = vmWriter()
export function CompilationEngine(tokenizer) {
  return {
    tokenizer,
    classSymbolTable: SymbolTable(),
    subroutineSymbolTable: SymbolTable(),
    className: "",
    subroutineName: "",
    subroutineIfLabelIndex: 0,
    subroutineWhileLabelIndex: 0,
    /* Compiles a class declaration
     * class:'class' className '{' classVarDec* subroutineDec* '}'
     */
    compileClass() {
      let output = ``
      this.processToken("class")
      this.processIdentifier(
        this.tokenizer.currentToken.value,
        "class",
        "declaration"
      )
      this.processToken("{")
      while (
        this.tokenizer.currentToken.value == "static" ||
        this.tokenizer.currentToken.value == "field"
      ) {
        this.compileClassVarDec()
      }
      while (
        this.tokenizer.currentToken.value == "constructor" ||
        this.tokenizer.currentToken.value == "function" ||
        this.tokenizer.currentToken.value == "method"
      ) {
        output += this.compileSubroutine()
      }
      this.processToken("}")
      return output
    },
    /* Compiles a static variable or field declaration
     * classVarDec:('static' | 'field') type varName (',' varName)* ';'
     */
    compileClassVarDec() {
      const varKind = this.tokenizer.currentToken.value
      this.processToken(varKind)
      const varType = this.tokenizer.currentToken.value
      this.processToken(varType)
      let varName = this.tokenizer.currentToken.value
      this.processIdentifier(varName, varKind, "declaration", varType)
      while (this.tokenizer.currentToken.value == ",") {
        this.processToken(",")
        varName = this.tokenizer.currentToken.value
        this.processIdentifier(varName, varKind, "declaration", varType)
      }
      this.processToken(";")
    },

    /* Compiles a method, function or constructor
     * subroutineDec:('constructor' | 'function' | 'method')
         ('void' | type) subroutineName '(' parameterList ')' subroutineBody
     */
    compileSubroutine() {
      this.subroutineSymbolTable.reset()
      let output = ``
      const subroutineKind = this.tokenizer.currentToken.value
      this.processToken(subroutineKind)
      const subroutineType = this.tokenizer.currentToken.value
      this.processToken(subroutineType)
      const subroutineName = this.tokenizer.currentToken.value
      this.processIdentifier(subroutineName, "subroutine", "declaration")

      this.processToken("(")
      if (subroutineKind == "method") {
        this.subroutineSymbolTable.define("this", this.className, "argument")
      }
      this.compileParameterList()
      this.processToken(")")
      const bodyOut = this.compileSubroutineBody()
      const nVars = this.subroutineSymbolTable.varCount("local")
      output += VMWriter.writeFunction(
        `${this.className}.${subroutineName}`,
        nVars
      )
      if (subroutineKind == "constructor") {
        const nFields = this.classSymbolTable.varCount("field")
        output += VMWriter.writePush("constant", nFields)
        output += VMWriter.writeCall("Memory.alloc", 1)
        output += VMWriter.writePop("pointer", 0)
      } else if (subroutineKind == "method") {
        output += VMWriter.writePush("argument", 0)
        output += VMWriter.writePop("pointer", 0)
      }
      output += bodyOut
      return output
    },

    /* Compiles a - possibly empty - parameter list. Does not handle the enclosing parentheses
     * parameterList:((type varName) (',' type varName)*)?
     */
    compileParameterList() {
      if (this.tokenizer.currentToken.value !== ")") {
        let varType = this.tokenizer.currentToken.value
        this.processToken(varType)
        let varName = this.tokenizer.currentToken.value
        this.processIdentifier(varName, "argument", "declaration", varType)
        while (this.tokenizer.currentToken.value == ",") {
          this.processToken(",")
          varType = this.tokenizer.currentToken.value
          this.processToken(varType)
          varName = this.tokenizer.currentToken.value
          this.processIdentifier(varName, "argument", "declaration", varType)
        }
      }
    },
    /* Compiles the body of a constructor, method, or function
     * subroutineBody: '{' varDec* statements '}'
     */
    compileSubroutineBody() {
      let output = ""
      this.processToken("{")
      while (this.tokenizer.currentToken.value == "var") {
        this.compileVarDec()
      }
      output += this.compileStatements()
      this.processToken("}")
      return output
    },
    /* Compile a variable declaration
     * varDec: 'var' type varName (',' varName)* ';'
     */
    compileVarDec() {
      this.processToken("var")
      let varType = this.tokenizer.currentToken.value
      this.processToken(varType)
      let varName = this.tokenizer.currentToken.value
      this.processIdentifier(varName, "local", "declaration", varType)
      while (this.tokenizer.currentToken.value == ",") {
        this.processToken(",")
        varName = this.tokenizer.currentToken.value
        this.processIdentifier(varName, "local", "declaration", varType)
      }
      this.processToken(";")
    },
    /* Compiles a sequence of statements. Does not handle the enclosing curly braces
     * statements: statement*
     * statement: letStatement | ifStatement | whileStatement |
     *    doStatement | returnStatement
     */
    compileStatements() {
      let output = ""
      while (
        this.tokenizer.currentToken.value == "while" ||
        this.tokenizer.currentToken.value == "if" ||
        this.tokenizer.currentToken.value == "let" ||
        this.tokenizer.currentToken.value == "do" ||
        this.tokenizer.currentToken.value == "return"
      ) {
        if (this.tokenizer.currentToken.value == "while") {
          output += this.compileWhile()
        } else if (this.tokenizer.currentToken.value == "if") {
          output += this.compileIf()
        } else if (this.tokenizer.currentToken.value == "let") {
          output += this.compileLet()
        } else if (this.tokenizer.currentToken.value == "do") {
          output += this.compileDo()
        } else if (this.tokenizer.currentToken.value == "return") {
          output += this.compileReturn()
        }
      }
      return output
    },
    /* letStatement:'let' varName ('[' expression1 ']')? '=' expression2 ';'
     */
    compileLet() {
      let output = ""
      let isArrayAccess = false
      this.processToken("let")
      let varName = this.tokenizer.currentToken.value
      let varType = this.getVarType(varName)
      let varKind = this.getVarKind(varName)
      this.processIdentifier(varName, varKind, "expression", varType)
      let exp1Out = ""
      if (this.tokenizer.currentToken.value == "[") {
        isArrayAccess = true
        this.processToken("[")
        exp1Out = this.compileExpression()
        this.processToken("]")
      }

      this.processToken("=")
      let exp2Out = this.compileExpression()
      this.processToken(";")
      if (!isArrayAccess) {
        output += exp2Out
        output += VMWriter.writePop(varKind, this.getVarIndex(varName))
      } else {
        output += VMWriter.writePush(varKind, this.getVarIndex(varName))
        output += exp1Out
        output += VMWriter.writeBinOp("+")
        output += exp2Out
        output += VMWriter.writePop("temp", 0)
        output += VMWriter.writePop("pointer", 1)
        output += VMWriter.writePush("temp", 0)
        output += VMWriter.writePop("that", 0)
      }

      return output
    },
    /* ifStatement:'if' '(' expression ')' '{' statements1 '}' ('else' '{' statements2 '}')?
     */
    compileIf() {
      let output = ""
      let isElseStatement = false
      this.processToken("if")
      this.processToken("(")
      output += this.compileExpression()
      this.processToken(")")
      this.processToken("{")
      output += VMWriter.writeUnOp("~")
      const elseLabel = this.getLabel("if")
      const statements1Out = this.compileStatements()
      let statements2Out = ""
      this.processToken("}")
      const ifLabel = this.getLabel("if")
      if (this.tokenizer.currentToken.value == "else") {
        isElseStatement = true
        this.processToken("else")
        this.processToken("{")
        statements2Out = this.compileStatements()
        this.processToken("}")
      }
      if (isElseStatement) {
        output += VMWriter.writeIf(elseLabel)
        output += statements1Out
        output += VMWriter.writeGoto(ifLabel)
        output += VMWriter.writeLabel(elseLabel)
        output += statements2Out
      } else {
        output += VMWriter.writeGoto(ifLabel)
        output += statements1Out
      }
      output += VMWriter.writeLabel(ifLabel)
      return output
    },
    /* whileStatement: 'while' '(' expression ')' '{' statements '}' */
    compileWhile() {
      const whileLabel = this.getLabel("while")
      let output = VMWriter.writeLabel(whileLabel)
      // Process each token in the statement and advance to next token
      this.processToken("while")
      this.processToken("(")
      output += this.compileExpression()
      this.processToken(")")
      output += VMWriter.writeUnOp("~")
      const whileNotLabel = this.getLabel("while")
      output += VMWriter.writeIf(whileNotLabel)
      this.processToken("{")
      output += this.compileStatements()
      this.processToken("}")
      output += VMWriter.writeGoto(whileLabel)
      output += VMWriter.writeLabel(whileNotLabel)
      return output
    },

    /* subroutineCall: subroutineName '(' expressionList ')' | (className |
     *   varName) '.' subroutineName '(' expressionList ')'
     */
    compileSubroutineCall() {
      let output = ""
      // Compile subroutineName, className or varName
      let identifierName = this.tokenizer.currentToken.value
      let identifierKind = this.getVarKind(identifierName)

      // Identifier is an object
      if (identifierKind != "class" && identifierKind != "subroutine") {
        output += VMWriter.writePush(
          this.getVarKind(identifierName),
          this.getVarIndex(identifierName)
        )
      }
      if (identifierKind == "subroutine") {
        output += VMWriter.writePush("pointer", 0)
      }
      let identifierType = this.getVarType(identifierName)
      this.processIdentifier(
        identifierName,
        identifierKind,
        "expression",
        identifierType
      )
      let subroutineName = ""
      if (this.tokenizer.currentToken.value == ".") {
        this.processToken(".")
        // Compile subroutineName
        subroutineName = this.tokenizer.currentToken.value
        this.processIdentifier(subroutineName, "subroutine", "expression")
      }
      this.processToken("(")
      const [expLstOut, nArgs] = this.compileExpressionList()
      output += expLstOut
      this.processToken(")")
      if (identifierKind == "subroutine") {
        output += VMWriter.writeCall(
          `${this.className}.${identifierName}`,
          nArgs + 1
        )
      } else if (identifierKind == "class") {
        output += VMWriter.writeCall(
          `${identifierName}.${subroutineName}`,
          nArgs
        )
      } else {
        output += VMWriter.writeCall(
          `${this.getVarType(identifierName)}.${subroutineName}`,
          nArgs + 1
        )
      }
      return output
    },
    /* doStatement:'do' subroutineCall ';'
     */
    compileDo() {
      let output = ""
      this.processToken("do")
      output += this.compileSubroutineCall()
      this.processToken(";")
      output += VMWriter.writePop("temp", 0)
      return output
    },
    /* ReturnStatement: 'return' expression? ';' */
    compileReturn() {
      let output = ""
      this.processToken("return")
      if (this.tokenizer.currentToken.value == ";") {
        output += VMWriter.writePush("constant", 0)
      } else {
        output += this.compileExpression()
      }
      this.processToken(";")
      output += VMWriter.writeReturn()
      return output
    },
    /* expression: term (op term)*
     * op: '+' | '-' | '*' | '/' | '&' | '|' | '<' | '>' | '='
     */
    compileExpression() {
      const ops = ["+", "-", "*", "/", "&", "|", "<", ">", "="]
      let output = ""
      output += this.compileTerm()
      let token = ""
      while (ops.includes((token = this.tokenizer.currentToken.value))) {
        const opOutput = VMWriter.writeBinOp(token)
        this.processToken(token)
        output += this.compileTerm()
        output += opOutput
      }
      return output
    },
    /* Compiles a term. If the current token is an identifier,
     * it must be resolved to a variable, a routine call, or an array entry
     * term: integerConstant | stringConstant | keywordConstant |
         varName | varName '[' expression ']' | subroutineCall |
         '(' expression ')' | unaryOp term
     * subroutineCall: subroutineName '(' expressionList ')' | (className |
         varName) '.' subroutineName '(' expressionList ')'
     * KeywordConstant: 'true' | 'false' | 'null' | 'this'
     * unaryOp: '-' | '~'
     */
    compileTerm() {
      const unaryOps = ["-", "~"]
      let output = ""
      // Compile unaryOp term
      let token = this.tokenizer.currentToken
      if (unaryOps.includes(token.value)) {
        const opOutput = VMWriter.writeUnOp(token.value)
        this.processToken(token.value)
        output += this.compileTerm()
        output += opOutput
      }
      // Compile '(' expression ')'
      else if (token.value == "(") {
        this.processToken("(")
        output += this.compileExpression()
        this.processToken(")")
      }
      // keywordConstant: this | null | true | false
      else if (token.type == "keyword") {
        if (token.value == "null" || token.value == "false") {
          output += VMWriter.writePush("constant", 0)
        } else if (token.value == "true") {
          output += VMWriter.writePush("constant", 1)
          output += VMWriter.writeUnOp("-")
        } else if (token.value == "this") {
          output += VMWriter.writePush("pointer", 0)
        }
        this.processToken(token.value)
      }
      // Compile Ineteger constant
      else if (token.type == "integerConstant") {
        output += VMWriter.writePush("constant", token.value)
        this.processToken(token.value)
      }
      // Compile string constant
      else if (token.type == "stringConstant") {
        const strLen = token.value.length
        output += VMWriter.writePush("constant", strLen)
        output += VMWriter.writeCall("String.new", 1)
        output += VMWriter.writePop("temp", 1)
        for (let i = 0; i < strLen; i++) {
          output += VMWriter.writePush("temp", 1)
          output += VMWriter.writePush("constant", token.value.charCodeAt(i))
          output += VMWriter.writeCall("String.appendChar", 2)
          output += VMWriter.writePop("temp", 1)
        }
        output += VMWriter.writePush("temp", 1)
        // output += VMWriter.writeCall("String.dispose", 1)
        this.processToken(token.value)
      }
      // Compile varName | varName '[' expression ']' | subroutineCall
      else if (token.type == "identifier") {
        let identifierName = token.value
        let identifierKind = this.getVarKind(identifierName)
        let identifierType = this.getVarType(identifierName)

        const nextToken = this.getNextToken(token.value)
        if (nextToken == "(" || nextToken == ".") {
          output += this.compileSubroutineCall()
        } else if (nextToken == "[") {
          /** push identifier + exp
           *  pop pointer 1
           *  push that 0
           */
          this.processIdentifier(
            identifierName,
            identifierKind,
            "expression",
            identifierType
          )
          output += VMWriter.writePush(
            identifierKind,
            this.getVarIndex(identifierName)
          )
          this.processToken("[")
          output += this.compileExpression()
          this.processToken("]")
          output += VMWriter.writeBinOp("+")
          output += VMWriter.writePop("pointer", 1)
          output += VMWriter.writePush("that", 0)
        } else {
          this.processIdentifier(
            identifierName,
            identifierKind,
            "expression",
            identifierType
          )
          output += VMWriter.writePush(
            identifierKind,
            this.getVarIndex(identifierName)
          )
        }
      }
      return output
    },
    /* Compiles a - possibly empty - comma-separated list of expressions.
     * expressionList: (expression (',' expression)* )?
     */
    compileExpressionList() {
      let output = ""
      let nExps = 0
      if (this.tokenizer.currentToken.value !== ")") {
        output += this.compileExpression()
        nExps++
        while (this.tokenizer.currentToken.value == ",") {
          this.processToken(",")
          output += this.compileExpression()
          nExps++
        }
      }
      return [output, nExps]
    },
    /** Compilation Utilities */
    getLabel(command) {
      let label = ""
      if (command == "if") {
        label = `${this.subroutineName}_If${this.subroutineIfLabelIndex}`
        this.subroutineIfLabelIndex++
      } else if (command == "while") {
        label = `${this.subroutineName}_While${this.subroutineWhileLabelIndex}`
        this.subroutineWhileLabelIndex++
      }
      return label
    },
    getVarType(varName) {
      let varType = this.subroutineSymbolTable.typeOf(varName)
      if (varType == undefined) {
        varType = this.classSymbolTable.typeOf(varName)
      }
      return varType
    },
    getVarKind(varName) {
      let varKind = this.subroutineSymbolTable.kindOf(varName)
      if (varKind == undefined) {
        varKind = this.classSymbolTable.kindOf(varName)
      }
      if (varKind == "field") varKind = "this"
      if (varKind == undefined) {
        if (varName[0].toUpperCase() == varName[0]) varKind = "class"
        else varKind = "subroutine"
      }
      return varKind
    },
    getVarIndex(varName) {
      let varIndex = this.subroutineSymbolTable.indexOf(varName)
      if (varIndex == undefined) {
        varIndex = this.classSymbolTable.indexOf(varName)
      }
      return varIndex
    },
    getNextToken() {
      return this.tokenizer.input[this.tokenizer.currentIndex]
    },
    /* Compiles a single identifier: className | subroutineName |
     * varName(staticVar|fieldVar|argVar|localVar)
     */
    processIdentifier(name, category, usage, type = "") {
      if (usage == "declaration") {
        if (category == "class") {
          this.className = name
        } else if (category == "subroutine") {
          this.subroutineName = `${this.className}.${name}`
          this.subroutineWhileLabelIndex = 0
          this.subroutineIfLabelIndex = 0
        } else {
          if (category == "field" || category == "static") {
            this.classSymbolTable.define(name, type, category)
          } else if (category == "argument" || category == "local") {
            this.subroutineSymbolTable.define(name, type, category)
          }
        }
      }
      if (this.tokenizer.hasMoreTokens()) this.tokenizer.advance()
    },
    processToken(tokenStr) {
      if (this.tokenizer.currentToken.value == tokenStr) {
        if (this.tokenizer.hasMoreTokens()) this.tokenizer.advance()
      } else {
        throw Error("Syntax Error")
      }
    },
    outputTokenXml(tokenValue, tokenType) {
      return `<${tokenType}> ${tokenValue} </${tokenType}>\n`
    },
  }
}
