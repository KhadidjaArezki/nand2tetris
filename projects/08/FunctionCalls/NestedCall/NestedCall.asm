// function Sys.init 0
(Sys.Sys.init)

// push constant 4000
@4000
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop pointer 0
@SP
M=M-1
@SP
A=M
D=M
@THIS
M=D

// push constant 5000
@5000
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop pointer 1
@SP
M=M-1
@SP
A=M
D=M
@THAT
M=D

// call Sys.main 0
@Sys.Sys.init$ret.0
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
@Sys.Sys.main
0;JMP
(Sys.Sys.init$ret.0)

// pop temp 1
@SP
M=M-1
@SP
A=M
D=M
@6
M=D

// label LOOP
(Sys.Sys.init$LOOP)

// goto LOOP
@Sys.Sys.init$LOOP
0;JMP

// function Sys.main 5
(Sys.Sys.main)
@LCL
A=M
M=0
A=A+1
M=0
A=A+1
M=0
A=A+1
M=0
A=A+1
M=0
A=A+1
@SP
M=M+1
@SP
M=M+1
@SP
M=M+1
@SP
M=M+1
@SP
M=M+1

// push constant 4001
@4001
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop pointer 0
@SP
M=M-1
@SP
A=M
D=M
@THIS
M=D

// push constant 5001
@5001
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop pointer 1
@SP
M=M-1
@SP
A=M
D=M
@THAT
M=D

// push constant 200
@200
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop local 1
@1
D=A
@LCL
D=D+M
@addr
M=D
@SP
M=M-1
@SP
A=M
D=M
@addr
A=M
M=D

// push constant 40
@40
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop local 2
@2
D=A
@LCL
D=D+M
@addr
M=D
@SP
M=M-1
@SP
A=M
D=M
@addr
A=M
M=D

// push constant 6
@6
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop local 3
@3
D=A
@LCL
D=D+M
@addr
M=D
@SP
M=M-1
@SP
A=M
D=M
@addr
A=M
M=D

// push constant 123
@123
D=A
@SP
A=M
M=D
@SP
M=M+1

// call Sys.add12 1
@Sys.Sys.main$ret.0
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
@Sys.Sys.add12
0;JMP
(Sys.Sys.main$ret.0)

// pop temp 0
@SP
M=M-1
@SP
A=M
D=M
@5
M=D

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

// push local 2
@2
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

// push local 3
@3
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

// push local 4
@4
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
@Sys.Sys.main$endFrame
M=D
@Sys.Sys.main$endFrame
D=M
@5
A=D-A
D=M
@Sys.Sys.main$retaddr
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
@Sys.Sys.main$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@Sys.Sys.main$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@Sys.Sys.main$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@Sys.Sys.main$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@Sys.Sys.main$retaddr
A=M
0;JMP

// function Sys.add12 0
(Sys.Sys.add12)

// push constant 4002
@4002
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop pointer 0
@SP
M=M-1
@SP
A=M
D=M
@THIS
M=D

// push constant 5002
@5002
D=A
@SP
A=M
M=D
@SP
M=M+1

// pop pointer 1
@SP
M=M-1
@SP
A=M
D=M
@THAT
M=D

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

// push constant 12
@12
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

// return
@LCL
D=M
@Sys.Sys.add12$endFrame
M=D
@Sys.Sys.add12$endFrame
D=M
@5
A=D-A
D=M
@Sys.Sys.add12$retaddr
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
@Sys.Sys.add12$endFrame
D=M
@1
A=D-A
D=M
@THAT
M=D
@Sys.Sys.add12$endFrame
D=M
@2
A=D-A
D=M
@THIS
M=D
@Sys.Sys.add12$endFrame
D=M
@3
A=D-A
D=M
@ARG
M=D
@Sys.Sys.add12$endFrame
D=M
@4
A=D-A
D=M
@LCL
M=D
@Sys.Sys.add12$retaddr
A=M
0;JMP

