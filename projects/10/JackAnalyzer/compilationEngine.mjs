import { SymbolTable } from "./symbolTable.mjs"
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

 DONE: Extend the analyzer to output the following information about each identifier:
  * name;
  * category (field, static, local, arg, class, subroutine);
  * index: if the identifier’s category is field, static, local, or arg,
      the running index assigned to the identiﬁer by the symbol table;
  * usage: whether the identiﬁer is presently being declared
      (in a static / field / var variable declaration,
      or in a parameter list), or used (in an expression).
  Have your syntax analyzer output this information as part of its XML
  output, using markup tags of your choice.
  Test your new SymbolTable module and the new functionality
  just described by running your extended syntax analyzer on the test
  Jack programs supplied in project 10.
 */
export function CompilationEngine(tokenizer) {
  return {
    tokenizer,
    classSymbolTable: SymbolTable(),
    subroutineSymbolTable: SymbolTable(),
    /* Compiles a class declaration
     * class:'class' className '{' classVarDec* subroutineDec* '}'
     */
    compileClass() {
      let output = `<class>\n`
      output += this.processToken("class")
      const name = this.tokenizer.currentToken.value
      output += this.processIdentifier(name, "class", "declaration")
      output += this.processToken("{")
      while (
        this.tokenizer.currentToken.value == "static" ||
        this.tokenizer.currentToken.value == "field"
      ) {
        output += this.compileClassVarDec()
      }
      while (
        this.tokenizer.currentToken.value == "constructor" ||
        this.tokenizer.currentToken.value == "function" ||
        this.tokenizer.currentToken.value == "method"
      ) {
        output += this.compileSubroutine()
      }
      output += this.processToken("}")
      output += `</class>\n`
      return output
    },
    /* Compiles a static variable or field declaration
     * classVarDec:('static' | 'field') type varName (',' varName)* ';'
     */
    compileClassVarDec() {
      let output = `<classVarDec>\n`
      const varKind = this.tokenizer.currentToken.value
      output += this.processToken(varKind)
      const varType = this.tokenizer.currentToken.value
      output += this.processToken(varType)
      let varName = this.tokenizer.currentToken.value
      output += this.processIdentifier(varName, varKind, "declaration", varType)
      while (this.tokenizer.currentToken.value == ",") {
        output += this.processToken(",")
        varName = this.tokenizer.currentToken.value
        output += this.processIdentifier(
          varName,
          varKind,
          "declaration",
          varType
        )
      }
      output += this.processToken(";")
      output += `</classVarDec>\n`
      return output
    },
    /* Compiles a method, function or constructor
     * subroutineDec:('constructor' | 'function' | 'method')
         ('void' | type) subroutineName '(' parameterList ')' subroutineBody
     */
    compileSubroutine() {
      this.subroutineSymbolTable.reset()
      let output = `<subroutineDec>\n`
      output += this.processToken(this.tokenizer.currentToken.value)
      output += this.processToken(this.tokenizer.currentToken.value)
      const name = this.tokenizer.currentToken.value
      output += this.processIdentifier(name, "subroutine", "declaration")
      output += this.processToken("(")
      output += this.compileParameterList()
      output += this.processToken(")")
      output += this.compileSubroutineBody()
      output += `</subroutineDec>\n`
      return output
    },
    /* Compiles a - possibly empty - parameter list. Does not handle the enclosing parentheses
     * parameterList:((type varName) (',' type varName)*)?
     */
    compileParameterList() {
      let output = "<parameterList>\n"
      if (this.tokenizer.currentToken.value !== ")") {
        let varType = this.tokenizer.currentToken.value
        output += this.processToken(varType)
        let varName = this.tokenizer.currentToken.value
        output += this.processIdentifier(varName, "arg", "declaration", varType)
        while (this.tokenizer.currentToken.value == ",") {
          output += this.processToken(",")
          varType = this.tokenizer.currentToken.value
          output += this.processToken(varType)
          varName = this.tokenizer.currentToken.value
          output += this.processIdentifier(
            varName,
            "arg",
            "declaration",
            varType
          )
        }
      }
      output += `</parameterList>\n`
      return output
    },
    /* Compiles the body of a constructor, method, or function
     * subroutineBody: '{' varDec* statements '}'
     */
    compileSubroutineBody() {
      let output = "<subroutineBody>\n"
      output += this.processToken("{")
      while (this.tokenizer.currentToken.value == "var") {
        output += this.compileVarDec()
      }
      output += this.compileStatements()
      output += this.processToken("}")
      output += "</subroutineBody>\n"
      return output
    },
    /* Compile a variable declaration
     * varDec: 'var' type varName (',' varName)* ';'
     */
    compileVarDec() {
      let output = `<varDec>\n`
      output += this.processToken("var")
      let varType = this.tokenizer.currentToken.value
      output += this.processToken(varType)
      let varName = this.tokenizer.currentToken.value
      output += this.processIdentifier(varName, "local", "declaration", varType)
      while (this.tokenizer.currentToken.value == ",") {
        output += this.processToken(",")
        varName = this.tokenizer.currentToken.value
        output += this.processIdentifier(
          varName,
          "local",
          "declaration",
          varType
        )
      }
      output += this.processToken(";")
      output += `</varDec>\n`
      return output
    },
    /* Compiles a sequence of statements. Does not handle the enclosing curly braces
     * statements: statement*
     * statement: letStatement | ifStatement | whileStatement |
     *    doStatement | returnStatement
     */
    compileStatements() {
      let output = "<statements>\n"
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
      output += "</statements>\n"
      return output
    },
    /* letStatement:'let' varName ('[' expression ']')? '=' expression ';'
     */
    compileLet() {
      let output = `<letStatement>\n`
      output += this.processToken("let")
      let varName = this.tokenizer.currentToken.value
      let varType = this.getVarType(varName)
      let varKind = this.getVarKind(varName)
      output += this.processIdentifier(varName, varKind, "expression", varType)
      if (this.tokenizer.currentToken.value == "[") {
        output += this.processToken("[")
        output += this.compileExpression()
        output += this.processToken("]")
      }
      output += this.processToken("=")
      output += this.compileExpression()
      output += this.processToken(";")
      output += `</letStatement>\n`
      return output
    },
    /* ifStatement:'if' '(' expression ')' '{' statements '}' ('else' '{' statements '}')?
     */
    compileIf() {
      let output = `<ifStatement>\n`
      output += this.processToken("if")
      output += this.processToken("(")
      output += this.compileExpression()
      output += this.processToken(")")
      output += this.processToken("{")
      output += this.compileStatements()
      output += this.processToken("}")
      if (this.tokenizer.currentToken.value == "else") {
        output += this.processToken("else")
        output += this.processToken("{")
        output += this.compileStatements()
        output += this.processToken("}")
      }
      output += `</ifStatement>\n`
      return output
    },
    /* whileStatement: 'while' '(' expression ')' '{' statements '}' */
    compileWhile() {
      let output = `<whileStatement>\n`
      // Process each token in the statement and advance to next token
      output += this.processToken("while")
      output += this.processToken("(")
      output += this.compileExpression()
      output += this.processToken(")")
      output += this.processToken("{")
      output += this.compileStatements()
      output += this.processToken("}")
      output += `</whileStatement>\n`
      return output
    },
    /* doStatement:'do' subroutineCall ';'
     * subroutineCall: subroutineName '(' expressionList ')' | (className |
         varName) '.' subroutineName '(' expressionList ')'
     */
    compileDo() {
      let output = `<doStatement>\n`
      output += this.processToken("do")
      // Compile subroutineName, className or varName
      let identifierName = this.tokenizer.currentToken.value
      let identifierKind = this.getVarKind(identifierName)
      if (identifierKind == undefined) {
        if (identifierName[0].toUpperCase() == identifierName[0])
          identifierKind = "class"
        else identifierKind = "subroutine"
      }
      let identifierType = this.getVarType(identifierName)
      output += this.processIdentifier(
        identifierName,
        identifierKind,
        "expression",
        identifierType
      )
      if (this.tokenizer.currentToken.value == ".") {
        output += this.processToken(".")
        // Compile subroutineName
        let subroutineName = this.tokenizer.currentToken.value
        output += this.processIdentifier(
          subroutineName,
          "subroutine",
          "expression"
        )
      }
      output += this.processToken("(")
      output += this.compileExpressionList()
      output += this.processToken(")")
      output += this.processToken(";")
      output += `</doStatement>\n`
      return output
    },
    /* ReturnStatement: 'return' expression? ';' */
    compileReturn() {
      let output = "<returnStatement>\n"
      output += this.processToken("return")
      if (this.tokenizer.currentToken.value !== ";") {
        output += this.compileExpression()
      }
      output += this.processToken(";")
      output += "</returnStatement>\n"
      return output
    },
    /* expression: term (op term)*
     * op: '+' | '-' | '*' | '/' | '&' | '|' | '<' | '>' | '='
     */
    compileExpression() {
      const ops = ["+", "-", "*", "/", "&amp;", "|", "&lt;", "&gt;", "="]
      let output = `<expression>\n`
      output += this.compileTerm()
      while (ops.includes(this.tokenizer.currentToken.value)) {
        output += this.processToken(this.tokenizer.currentToken.value)
        output += this.compileTerm()
      }
      output += `</expression>\n`
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
      let output = "<term>\n"
      // Compile unaryOp term
      if (unaryOps.includes(this.tokenizer.currentToken.value)) {
        output += this.processToken(this.tokenizer.currentToken.value)
        output += this.compileTerm()
      }
      // Compile '(' expression ')'
      else if (this.tokenizer.currentToken.value == "(") {
        output += this.processToken("(")
        output += this.compileExpression()
        output += this.processToken(")")
      }
      // Compile integerConstant | stringConstant | keywordConstant
      else if (
        this.tokenizer.currentToken.type == "keyword" ||
        this.tokenizer.currentToken.type == "integerConstant" ||
        this.tokenizer.currentToken.type == "stringConstant"
      ) {
        output += this.processToken(this.tokenizer.currentToken.value)
      }
      // Compile varName | varName '[' expression ']' | subroutineCall
      else if (this.tokenizer.currentToken.type == "identifier") {
        let identifierName = this.tokenizer.currentToken.value
        let identifierKind = this.getVarKind(identifierName)
        if (identifierKind == undefined) {
          if (identifierName[0].toUpperCase() == identifierName[0])
            identifierKind = "class"
          else identifierKind = "subroutine"
        }
        let identifierType = this.getVarType(identifierName)
        output += this.processIdentifier(
          identifierName,
          identifierKind,
          "expression",
          identifierType
        )
        if (this.tokenizer.currentToken.value == "[") {
          output += this.processToken("[")
          output += this.compileExpression()
          output += this.processToken("]")
        } else if (this.tokenizer.currentToken.value == "(") {
          output += this.processToken("(")
          output += this.compileExpressionList()
          output += this.processToken(")")
        } else if (this.tokenizer.currentToken.value == ".") {
          output += this.processToken(".")
          let subroutineName = this.tokenizer.currentToken.value
          output += this.processIdentifier(
            subroutineName,
            "subroutine",
            "expression"
          )
          output += this.processToken("(")
          output += this.compileExpressionList()
          output += this.processToken(")")
        }
      }
      output += "</term>\n"
      return output
    },
    /* Compiles a - possibly empty - comma-separated list of expressions.
     * expressionList: (expression (',' expression)* )?
     */
    compileExpressionList() {
      let output = "<expressionList>\n"
      if (this.tokenizer.currentToken.value !== ")") {
        output += this.compileExpression()
        while (this.tokenizer.currentToken.value == ",") {
          output += this.processToken(",")
          output += this.compileExpression()
        }
      }
      output += "</expressionList>\n"
      return output
    },
    /** Compilation Utilities */
    getVarType(varName) {
      let varType = this.classSymbolTable.typeOf(varName)
      if (varType == undefined) {
        varType = this.subroutineSymbolTable.typeOf(varName)
      }
      return varType
    },
    getVarKind(varName) {
      let varKind = this.classSymbolTable.kindOf(varName)
      if (varKind == undefined) {
        varKind = this.subroutineSymbolTable.kindOf(varName)
      }
      return varKind
    },
    getVarIndex(varName) {
      let varIndex = this.classSymbolTable.indexOf(varName)
      if (varIndex == undefined) {
        varIndex = this.subroutineSymbolTable.indexOf(varName)
      }
      return varIndex
    },
    /** Compiles a single identifier: className, subroutineName,
     * or varName(staticVar, fieldVar, argVar, localVar)
     */
    processIdentifier(name, category, usage, type = "") {
      let output = `<identifier>\n`
      output += this.outputTokenXml(name, "name")
      output += this.outputTokenXml(category, "category")

      if (category != "class" && category != "subroutine") {
        if (usage == "declaration") {
          if (category == "field" || category == "static") {
            this.classSymbolTable.define(name, type, category)
          } else if (category == "arg" || category == "local") {
            this.subroutineSymbolTable.define(name, type, category)
          }
        }
        let index = this.getVarIndex(name)
        output += this.outputTokenXml(index, "index")
      }
      output += this.outputTokenXml(usage, "usage")
      output += `</identifier>\n`
      console.log(
        this.classSymbolTable.variables,
        this.subroutineSymbolTable.variables
      )
      if (this.tokenizer.hasMoreTokens()) this.tokenizer.advance()
      return output
    },
    processToken(tokenStr) {
      if (this.tokenizer.currentToken.value == tokenStr) {
        const tokenValue = this.tokenizer.currentToken.value
        const tokenType = this.tokenizer.currentToken.type
        if (this.tokenizer.hasMoreTokens()) this.tokenizer.advance()
        return this.outputTokenXml(tokenValue, tokenType)
      } else {
        throw Error("Syntax Error")
      }
    },
    outputTokenXml(tokenValue, tokenType) {
      return `<${tokenType}> ${tokenValue} </${tokenType}>\n`
    },
  }
}
