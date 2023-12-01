// push constant 3
@3
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 4
@4
D=A
@SP
A=M
M=D
@SP
M=M+1

// call SimpleFunction.test 2
@SimpleFunctionCall$ret.0
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
@SimpleFunctionCall.SimpleFunction.test
0;JMP
(SimpleFunctionCall$ret.0)

// push constant 5
@5
D=A
@SP
A=M
M=D
@SP
M=M+1

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

// label LOOP
(SimpleFunctionCall$LOOP)

// goto LOOP
@SimpleFunctionCall$LOOP
0;JMP

// function SimpleFunction.test 2
(SimpleFunctionCall.SimpleFunction.test)
@LCL
A=M
M=0
A=A+1
M=0
A=A+1
@SP
M=M+1
@SP
M=M+1

// push local 0
@0
D=A
@LCL
D=D+M
@addr
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1

// push local 1
@1
D=A
@LCL
D=D+M
@addr
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1

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

// not
@SP
M=M-1
@SP
A=M
D=!M
@SP
A=M
M=D
@SP
M=M+1

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
@SimpleFunctionCall.SimpleFunction.test$endFrame
M=D
@SimpleFunctionCall.SimpleFunction.test$endFrame
D=M
@5
A=D-A
D=M
@SimpleFunctionCall.SimpleFunction.test$retaddr
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
@SimpleFunctionCall.SimpleFunction.test$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@SimpleFunctionCall.SimpleFunction.test$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@SimpleFunctionCall.SimpleFunction.test$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@SimpleFunctionCall.SimpleFunction.test$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@SimpleFunctionCall.SimpleFunction.test$retaddr
A=M
0;JMP

