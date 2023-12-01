// push constant 9
@9
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
@LT
D;JLT
@GE
D;JGE
(LT)
D=-1
@CONT
0;JMP
(GE)
D=0
@CONT
0;JMP
(CONT)
@SP
A=M
M=D
@SP
M=M+1

