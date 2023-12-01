// push constant 8
@8
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 7
@8
D=A
@SP
A=M
M=D
@SP
M=M+1

// gt
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
@GT
D;JGT
@LE
D;JLE
(GT)
D=-1
@CONT
0;JMP
(LE)
D=0
@CONT
0;JMP
(CONT)
@SP
A=M
M=D
@SP
M=M+1

