/**
 * Each token should be printed in a separate line
 * as <tokenType> token </tokenType>, where tokenType is an
 * XML tag coding one of the five possible token types in
 * the Jack language:
 * keyword, symbol, identifier, integerConstant, stringConstant.
 * In the case of string constants, the program ignores the
 * double quote characters.
 * The symbols (<, >, ", &) are also used for XML markup, and thus
 * they cannot appear as data in XML files. Following convention,
 * the analyzer represents these symbols as &lt;, &gt;, &quot;, and
 * &amp;, respectively.
 *
 * Requirements:
 *   Ignore white space
 *   Get next token
 *   Extract value and type of current token
 *   Advance input
 * Fields: Object currentToken, string input, Number currentIndex,
 *         boolean lineCommentOn, boolean blockCommentOn
 * Functions:
 *   init inputFile/stream -> null
 *   hasMoreTokens null -> boolean
 *   advance null -> null
 *   isWhiteSpaceToken token -> boolean
 *   tokenType null -> "KEYWORD" | "SYMBOL" | "IDENTIFIER" | "INT_CONST" | "STRING_CONST"
 */
export function JackTokenizer(inputStr) {
  return {
    input: inputStr.replace(/\s+$/g, ""),
    currentIndex: 0,
    currentToken: {
      value: null,
      type: "",
    },
    lineCommentOn: false,
    blockCommentOn: false,
    isWhiteSpaceToken(token) {
      return /\s/.test(token)
    },
    reverseStr(str) {
      return [...str].reverse().join("")
    },
    hasMoreTokens() {
      return this.currentIndex < this.input.length
    },
    advance() {
      const token = this.input[this.currentIndex]
      // Match the end of a line comment
      if (
        this.lineCommentOn &&
        /^(\n|\r)+.*\/{2,}/.test(
          this.reverseStr(this.input.substring(0, this.currentIndex + 1))
        )
      ) {
        this.lineCommentOn = false
        this.currentIndex += 1
        if (this.hasMoreTokens()) this.advance()
      } else if (
        // Match the end of a block comment
        this.blockCommentOn &&
        /^\/\*(\*(?!\/)|[^\*])*\*\//.test(
          this.reverseStr(this.input.substring(0, this.currentIndex + 1))
        )
      ) {
        this.blockCommentOn = false
        this.currentIndex += 1
        if (this.hasMoreTokens()) this.advance()
      } else if (
        // Match a line comment
        /^\/{2,}.*(\n|\r)+/.test(this.input.substring(this.currentIndex))
      ) {
        if (!this.blockCommentOn) this.lineCommentOn = true
        this.currentIndex += 1
        if (this.hasMoreTokens()) this.advance()
      } else if (
        /* Match a block comment */
        /^\/\*(\*(?!\/)|[^\*])*\*\//.test(
          this.input.substring(this.currentIndex)
        )
      ) {
        if (!this.lineCommentOn) this.blockCommentOn = true
        this.currentIndex += 1
        if (this.hasMoreTokens()) this.advance()
      } else if (this.lineCommentOn || this.blockCommentOn) {
        this.currentIndex += 1
        if (this.hasMoreTokens()) this.advance()
      } else if (this.isWhiteSpaceToken(token)) {
        this.currentIndex += 1
        if (this.hasMoreTokens()) this.advance()
      } else {
        const [inputMatch, type] = this.getCurrentToken(
          this.input.substring(this.currentIndex)
        )
        this.currentToken = {
          value: inputMatch[1],
          type,
        }
        this.currentIndex = this.currentIndex + inputMatch[0].toString().length
      }
    },
    /* tokenType null -> "KEYWORD" | "SYMBOL" | "IDENTIFIER" | "INT_CONST" | "STRING_CONST" */
    getCurrentToken(input) {
      const keywordRegexp = RegExp(/^([a-zA-Z]{2,11})/)
      const keywordMatch = input.match(keywordRegexp)
      const symbolRegexp = RegExp(/^([\{\}\(\)\[\]\.,;\+\-\*\/&\|<>=~])/)
      const symbolMatch = input.match(symbolRegexp)
      const identifierRegexp = RegExp(/^([a-zA-Z_]+\w*)/)
      const identifierMatch = input.match(identifierRegexp)
      const intConstRegexp = RegExp(/^(\d+)/)
      const intConstMatch = input.match(intConstRegexp)
      const stringConstRegexp = RegExp(/^"([^"\n]*)"/)
      const stringConstMatch = input.match(stringConstRegexp)

      if (keywordMatch !== null && this.keywords.includes(keywordMatch[1])) {
        return [keywordMatch, "keyword"]
      } else if (symbolMatch !== null) {
        // if (this.xmlSymbolConversions.hasOwnProperty(symbolMatch[1])) {
        //   symbolMatch[1] = this.xmlSymbolConversions[symbolMatch[1]]
        // }
        return [symbolMatch, "symbol"]
      } else if (identifierMatch !== null) {
        return [identifierMatch, "identifier"]
      } else if (
        intConstMatch !== null &&
        0 <= Number(intConstMatch[1]) &&
        Number(intConstMatch[1]) <= 32767
      ) {
        return [intConstMatch, "integerConstant"]
      } else if (stringConstMatch !== null) {
        return [stringConstMatch, "stringConstant"]
      } else {
        throw Error("Could not match input")
      }
    },
    keywords: [
      "class",
      "constructor",
      "function",
      "method",
      "int",
      "boolean",
      "char",
      "void",
      "var",
      "static",
      "field",
      "let",
      "do",
      "if",
      "else",
      "while",
      "return",
      "true",
      "false",
      "null",
      "this",
    ],
    xmlSymbolConversions: {
      '"': "&quot;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    },
  }
}
