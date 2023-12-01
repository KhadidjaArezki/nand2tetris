// push constant 8
@8
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

// eq
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
@EQUAL
D;JEQ
@NOTEQUAL
D;JNE
(EQUAL)
D=-1
@CONT
0;JMP
(NOTEQUAL)
D=0
@CONT
0;JMP
(CONT)
@SP
A=M
M=D
@SP
M=M+1

