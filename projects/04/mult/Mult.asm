// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
//
// This program only needs to handle arguments that satisfy
// R0 >= 0, R1 >= 0, and R0*R1 < 32768.

// Put your code here.
// n = RAM[0]
   @R0
   D=M
   @n
   M=D
// m = RAM[1]
   @R1
   D=M
   @m
   M=D
// RAM[2] = 0
   @R2
   M=0
   
// i = 0
   @i
   M=0
// res = 0
   @res
   M=0

(LOOP)
// if i == n goto STOP
   @n
   D=M
   @i
   D=M-D
   @STOP
   D;JEQ
   
// res = res + m
   @m
   D=M
   @res
   D=D+M
   M=D

// i = i + 1
   @i
   M=M+1
   
   @LOOP
   0;JMP

(STOP)
// RAM[2] = res
   @res
   D=M
   @R2
   M=D
   
(END)
   @END
   0;JMP
