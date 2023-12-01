// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 17
@17
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
@EQ0
D;JEQ
@NE0
D;JNE
(EQ0)
D=-1
@CONT0
0;JMP
(NE0)
D=0
@CONT0
0;JMP
(CONT0)
@SP
A=M
M=D
@SP
M=M+1

// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 16
@16
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
@EQ1
D;JEQ
@NE1
D;JNE
(EQ1)
D=-1
@CONT1
0;JMP
(NE1)
D=0
@CONT1
0;JMP
(CONT1)
@SP
A=M
M=D
@SP
M=M+1

// push constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 17
@17
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
@EQ2
D;JEQ
@NE2
D;JNE
(EQ2)
D=-1
@CONT2
0;JMP
(NE2)
D=0
@CONT2
0;JMP
(CONT2)
@SP
A=M
M=D
@SP
M=M+1

// push constant 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 891
@891
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
@CONT3
0;JMP
(GE0)
D=0
@CONT3
0;JMP
(CONT3)
@SP
A=M
M=D
@SP
M=M+1

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 892
@892
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
@LT1
D;JLT
@GE1
D;JGE
(LT1)
D=-1
@CONT4
0;JMP
(GE1)
D=0
@CONT4
0;JMP
(CONT4)
@SP
A=M
M=D
@SP
M=M+1

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 891
@891
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
@LT2
D;JLT
@GE2
D;JGE
(LT2)
D=-1
@CONT5
0;JMP
(GE2)
D=0
@CONT5
0;JMP
(CONT5)
@SP
A=M
M=D
@SP
M=M+1

// push constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32766
@32766
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
@GT0
D;JGT
@LE0
D;JLE
(GT0)
D=-1
@CONT6
0;JMP
(LE0)
D=0
@CONT6
0;JMP
(CONT6)
@SP
A=M
M=D
@SP
M=M+1

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32767
@32767
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
@GT1
D;JGT
@LE1
D;JLE
(GT1)
D=-1
@CONT7
0;JMP
(LE1)
D=0
@CONT7
0;JMP
(CONT7)
@SP
A=M
M=D
@SP
M=M+1

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32766
@32766
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
@GT2
D;JGT
@LE2
D;JLE
(GT2)
D=-1
@CONT8
0;JMP
(LE2)
D=0
@CONT8
0;JMP
(CONT8)
@SP
A=M
M=D
@SP
M=M+1

// push constant 57
@57
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 31
@31
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 53
@53
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

// push constant 112
@112
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

// and
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
D=M&D
@SP
A=M
M=D
@SP
M=M+1

// push constant 82
@82
D=A
@SP
A=M
M=D
@SP
M=M+1

// or
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
D=M|D
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

