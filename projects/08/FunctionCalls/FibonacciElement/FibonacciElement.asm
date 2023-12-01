// SP = 256
@256
D=A
@SP
M=D

// call Sys.init 0
@FibonacciElement$ret.0
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
(FibonacciElement$ret.0)

// function Main.fibonacci 0
(Main.fibonacci)

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

// push constant 2
@2
D=A
@SP
A=M
M=D
@SP
M=M+1

// lt
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
@LT0
D;JLT
@GE0
D;JGE
(LT0)
D=-1
@CONT0
0;JMP
(GE0)
D=0
@CONT0
0;JMP
(CONT0)
@SP
A=M
M=D
@SP
M=M+1

// if-goto IF_TRUE
@SP
M=M-1
A=M
D=M
@Main.fibonacci$IF_TRUE
D;JNE

// goto IF_FALSE
@Main.fibonacci$IF_FALSE
0;JMP

// label IF_TRUE
(Main.fibonacci$IF_TRUE)

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

// return
@LCL
D=M
@Main.fibonacci$endFrame
M=D
@Main.fibonacci$endFrame
D=M
@5
A=D-A
D=M
@Main.fibonacci$retaddr
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
@Main.fibonacci$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@Main.fibonacci$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@Main.fibonacci$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@Main.fibonacci$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@Main.fibonacci$retaddr
A=M
0;JMP

// label IF_FALSE
(Main.fibonacci$IF_FALSE)

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

// push constant 2
@2
D=A
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

// call Main.fibonacci 1
@Main.fibonacci$ret.0
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
@1
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci$ret.0)

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

// push constant 1
@1
D=A
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

// call Main.fibonacci 1
@Main.fibonacci$ret.1
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
@1
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Main.fibonacci$ret.1)

// add
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
D=M+D
@SP
A=M
M=D
@SP
M=M+1

// return
@LCL
D=M
@Main.fibonacci$endFrame
M=D
@Main.fibonacci$endFrame
D=M
@5
A=D-A
D=M
@Main.fibonacci$retaddr
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
@Main.fibonacci$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@Main.fibonacci$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@Main.fibonacci$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@Main.fibonacci$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@Main.fibonacci$retaddr
A=M
0;JMP

// function Sys.init 0
(Sys.init)

// push constant 4
@4
D=A
@SP
A=M
M=D
@SP
M=M+1

// call Main.fibonacci 1
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
@1
D=D-A
@ARG
M=D
@SP
D=M
@LCL
M=D
@Main.fibonacci
0;JMP
(Sys.init$ret.0)

// label WHILE
(Sys.init$WHILE)

// goto WHILE
@Sys.init$WHILE
0;JMP

