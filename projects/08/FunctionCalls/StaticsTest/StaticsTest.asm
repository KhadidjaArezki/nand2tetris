// SP = 256
@256
D=A
@SP
M=D

// call Sys.init 0
@StaticsTest$ret.0
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Sys.init
0;JMP
(StaticsTest$ret.0)

// function Class1.set 0
(Class1.set)

// push argument 0
@0
D=A
@ARG
D=D+M
@addr
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1

// pop static 0
@SP
M=M-1
@SP
A=M
D=M
@Class1.0
M=D

// push argument 1
@1
D=A
@ARG
D=D+M
@addr
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1

// pop static 1
@SP
M=M-1
@SP
A=M
D=M
@Class1.1
M=D

// push constant 0
@0
D=A
@SP
A=M
M=D
@SP
M=M+1

// return
@LCL
D=M
@Class1.set$endFrame
M=D
@Class1.set$endFrame
D=M
@5
A=D-A
D=M
@Class1.set$retaddr
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
A=M
D=A+1
@SP
M=D
@Class1.set$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@Class1.set$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@Class1.set$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@Class1.set$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@Class1.set$retaddr
A=M
0;JMP

// function Class1.get 0
(Class1.get)

// push static 0
@Class1.0
D=M
@SP
A=M
M=D
@SP
M=M+1

// push static 1
@Class1.1
D=M
@SP
A=M
M=D
@SP
M=M+1

// sub
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
D=M-D
@SP
A=M
M=D
@SP
M=M+1

// return
@LCL
D=M
@Class1.get$endFrame
M=D
@Class1.get$endFrame
D=M
@5
A=D-A
D=M
@Class1.get$retaddr
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
A=M
D=A+1
@SP
M=D
@Class1.get$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@Class1.get$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@Class1.get$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@Class1.get$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@Class1.get$retaddr
A=M
0;JMP

// function Class2.set 0
(Class2.set)

// push argument 0
@0
D=A
@ARG
D=D+M
@addr
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1

// pop static 0
@SP
M=M-1
@SP
A=M
D=M
@Class2.0
M=D

// push argument 1
@1
D=A
@ARG
D=D+M
@addr
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1

// pop static 1
@SP
M=M-1
@SP
A=M
D=M
@Class2.1
M=D

// push constant 0
@0
D=A
@SP
A=M
M=D
@SP
M=M+1

// return
@LCL
D=M
@Class2.set$endFrame
M=D
@Class2.set$endFrame
D=M
@5
A=D-A
D=M
@Class2.set$retaddr
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
A=M
D=A+1
@SP
M=D
@Class2.set$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@Class2.set$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@Class2.set$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@Class2.set$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@Class2.set$retaddr
A=M
0;JMP

// function Class2.get 0
(Class2.get)

// push static 0
@Class2.0
D=M
@SP
A=M
M=D
@SP
M=M+1

// push static 1
@Class2.1
D=M
@SP
A=M
M=D
@SP
M=M+1

// sub
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
D=M-D
@SP
A=M
M=D
@SP
M=M+1

// return
@LCL
D=M
@Class2.get$endFrame
M=D
@Class2.get$endFrame
D=M
@5
A=D-A
D=M
@Class2.get$retaddr
M=D
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D
@ARG
A=M
D=A+1
@SP
M=D
@Class2.get$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@Class2.get$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@Class2.get$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@Class2.get$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@Class2.get$retaddr
A=M
0;JMP

// function Sys.init 0
(Sys.init)

// push constant 6
@6
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 8
@8
D=A
@SP
A=M
M=D
@SP
M=M+1

// call Class1.set 2
@Sys.init$ret.0
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@2
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Class1.set
0;JMP
(Sys.init$ret.0)

// pop temp 0
@SP
M=M-1
@SP
A=M
D=M
@5
M=D

// push constant 23
@23
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 15
@15
D=A
@SP
A=M
M=D
@SP
M=M+1

// call Class2.set 2
@Sys.init$ret.1
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@2
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Class2.set
0;JMP
(Sys.init$ret.1)

// pop temp 0
@SP
M=M-1
@SP
A=M
D=M
@5
M=D

// call Class1.get 0
@Sys.init$ret.2
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Class1.get
0;JMP
(Sys.init$ret.2)

// call Class2.get 0
@Sys.init$ret.3
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
D=M
@5
D=D-A
@0
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Class2.get
0;JMP
(Sys.init$ret.3)

// label WHILE
(Sys.init$WHILE)

// goto WHILE
@Sys.init$WHILE
0;JMP

