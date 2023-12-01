/**
 * When compiling a Jack class, we can build one class-level
 * symbol table and one subroutine-level symbol table.
 * We can reset the latter table each time we start
 * compiling a new subroutine.
 * Each variable is assigned a running index within its scope
 * (table) and kind. The index starts at 0, increments by 1
 * after each time a new symbol is added to the table, and is
 * reset to 0 when starting a new scope (table).
 * When compiling an error-free Jack code, each symbol not found
 * in the symbol tables can be assumed to be either a subroutine
 * name or a class name.
 * Functions:
 * define: (name: string, type: string, kind: static/field/arg/var) -> null
 * varCount: (kind: static/field/arg/var) -> int
 */
export function SymbolTable() {
  return {
    variables: [],
    fieldIndex: 0,
    staticIndex: 0,
    argIndex: 0,
    localIndex: 0,
    /** Empties the symbol table, and resets the four indexes to 0.
     * Called when starting the compilation of a a subroutine declaration.
     */
    reset() {
      this.variables = []
      this.fieldIndex = 0
      this.staticIndex = 0
      this.argIndex = 0
      this.localIndex = 0
    },
    /* Adds a new variable to the table and assigns
     * to it the undex value of its kind plus 1
     */
    define(name, type, kind) {
      const index = this.getIndex(kind)
      const newVar = {
        name,
        type,
        kind,
        index,
      }
      this.variables.push(newVar)
      this.incVarIndex(kind)
    },
    incVarIndex(kind) {
      if (kind == "field") return this.fieldIndex++
      else if (kind == "static") return this.staticIndex++
      else if (kind == "argument") return this.argIndex++
      else if (kind == "local") return this.localIndex++
      else throw Error("Variable Kind Incorrect")
    },
    getIndex(kind) {
      if (kind == "field") return this.fieldIndex
      else if (kind == "static") return this.staticIndex
      else if (kind == "argument") return this.argIndex
      else if (kind == "local") return this.localIndex
      else throw Error("Variable Kind Incorrect")
    },
    varCount(kind) {
      return this.variables.reduce((count, v) => {
        return v.kind == kind ? count + 1 : count
      }, 0)
    },
    kindOf(name) {
      return this.variables.find((v) => v.name == name)?.kind
    },
    typeOf(name) {
      return this.variables.find((v) => v.name == name)?.type
    },
    indexOf(name) {
      return this.variables.find((v) => v.name == name)?.index
    },
  }
}
