// function SimpleFunction.test 2
(SimpleFunction.test)
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
@LCL
D=M
@endFrame
M=D
@endFrame
D=M
@5
D=D-A
@retaddr
M=D
@endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@retaddr
A=M
0;JMP

