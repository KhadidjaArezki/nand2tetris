// push constant 8
@8
D=A
@SP
A=M
M=D
@SP
M=M+1

// neg
@SP
M=M-1
@SP
A=M
D=-M
@SP
A=M
M=D
@SP
M=M+1

