// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
(LOOP)
// addr = 16384
   @SCREEN
   D=A
   @addr
   M=D

// if RAM[KBD] == 0 => whiten screen else blacken it
   @KBD
   D=M
   @WHITE
   D;JEQ   
   @BLACK
   D;JNE

(WHITE)
// if addr == 24576 goto LOOP
   @KBD
   D=A
   @addr
   D=D-M
   @LOOP
   D;JEQ
   
// RAM[addr] = 0000000000000000
   @addr
   A=M // A = 16384 + n
   M=0 // RAM[16384 + n] = 0

// Ram[addr] = Ram[addr] + 1
   @addr
   M=M+1
   @WHITE
   0;JMP
   
(BLACK)
// if addr = 24576 goto LOOP
   @KBD
   D=A
   @addr
   D=D-M
   @LOOP
   D;JEQ
   
// RAM[addr] = 1111111111111111
   @addr
   A=M // A = 16384 + n
   M=-1 // RAM[16384 + n] = -1

// addr = addr + 1
   @addr
   M=M+1
   @BLACK
   0;JMP
