/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions

const HLT = 0b00000001; // Halt CPU
// LDI
const LDI = 0b10011001;
// MUL
const MUL = 0b10101010;
// PRN
const PRN = 0b01000011;
// ADD
const ADD = 0b10101000;
// AND
const AND = 0b10110011;
// NOP
const NOP = 0b00000000;
// POP
const POP = 0b01001100;
// PUSH
const PUSH = 0b01001101;
// INC
const INC = 0b01111000;
// DEC
const DEC = 0b01111001;
// DIV
const DIV = 0b10101011;
// CMP
const CMP = 0b10100000;
// CALL
const CALL = 0b01001000;
// JEQ
const JEQ = 0b01010001;
// MOD
const MOD = 0b10101100;
// NOT
const NOT = 0b01110000;
// OR
const OR = 0b10110001;
// SUB
const SUB = 0b10101001;
// XOR
const XOR = 0b10110010;
// RET
const RET = 0b00001001;
// JGT
const JGT = 0b01010100;
// JLT
const JLT = 0b01010011;
// JMP
const JMP = 0b01010000;
// JNE
const JNE = 0b01010010;
// LD
const LD = 0b10011000;
// PRA
const PRA = 0b01000010;
// ST
const ST = 0b10011010;
// IRET
const IRET = 0b00001011;

// General registers
const IM = 0b00000101;
const IS = 0b00000110;
const SP = 0b00000111;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;
        this.reg = new Array(8).fill(0); // General-purpose registers

        // initialize SP of stack in ram;
        this.reg[SP] = 0xf4;

        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
        this.reg.IR = 0; // Instruction Register
        this.reg.FL = 0; // Flag Register

        this.setupBranchTable();
    }

    /**
     * Sets up the branch table
     */
    setupBranchTable() {
        let bt = {};

        bt[HLT] = this.HLT; // Halt CPU
        // LDI
        bt[LDI] = this.LDI; // ADD R R
        // MUL
        bt[MUL] = this.MUL; // MUL R R
        // PRN
        bt[PRN] = this.PRN; // PRN R
        // ADD
        bt[ADD] = this.ADD; // ADD R R
        // AND
        bt[AND] = this.AND; // AND R R
        // NOP
        bt[NOP] = this.NOP; // NOP
        // INC
        bt[INC] = this.INC; // INC R
        // DEC
        bt[DEC] = this.DEC; // DEC R
        // DIV
        bt[DIV] = this.DIV; // DIV R R
        bt[CMP] = this.CMP; // CMP R R
        // POP
        bt[POP] = this.POP; // POP R
        // PUSH
        bt[PUSH] = this.PUSH; // PUSH R
        // CALL
        bt[CALL] = this.CALL; // CALL R
        // JEQ
        bt[JEQ] = this.JEQ; // JEQ R
        // MOD
        bt[MOD] = this.MOD; // MOD R,R
        // NOT
        bt[NOT] = this.NOT; // NOT R
        // OR
        bt[OR] = this.OR; // OR R,R
        // SUB
        bt[SUB] = this.SUB; // SUB R,R
        // XOR
        bt[XOR] = this.XOR; // XOR R,R
        // RET
        bt[RET] = this.RET; // RET
        // JGT
        bt[JGT] = this.JGT; // JGT R
        // JLT
        bt[JLT] = this.JLT; // JLT R
        // JMP
        bt[JMP] = this.JMP; // JMP R
        // JNE
        bt[JNE] = this.JNE; // JNE R
        // LD
        bt[LD] = this.LD; // LD R,R
        // PRA
        bt[PRA] = this.PRA; // PRA R
        // ST
        bt[ST] = this.ST; // ST R,R
        // IRET
        bt[IRET] = this.IRET; // IRET

        this.branchTable = bt;
    }

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
        }, 1);
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                this.reg[regA] = this.reg[regA] * this.reg[regB];
                break;
            case 'ADD':
                this.reg[regA] = this.reg[regA] + this.reg[regB];
                break;
            case 'AND':
                this.reg[regA] = this.reg[regA] & this.reg[regB];
                break;
            case 'INC':
                this.reg[regA] = (this.reg[regA] + 1) & 0xff;
                break;
            case 'DEC':
                this.reg[regA] = (this.reg[regA] - 1) & 0xff;
                break;
            case 'DIV':
                if (this.reg[regB] === 0) {
                    console.error('Divider cannot be zero', this.reg[regB]);
                    this.HLT();
                }
                this.reg[regA] = this.reg[regA] / this.reg[regB];
                break;
            case 'CMP':
                if (this.reg[regA] === this.reg[regB]) {
                    this.reg.FL = this.reg.FL | 0b00000001;
                }
                if (this.reg[regA] > this.reg[regB]) {
                    this.reg.FL = this.reg.FL | 0b00000010;
                }
                if (this.reg[regA] < this.reg[regB]) {
                    this.reg.FL = this.reg.FL | 0b00000100;
                }
                break;
            case 'MOD':
                if (this.reg[regB] === 0) {
                    console.error('Divder cannot be zeor', this.reg[regB]);
                    this.HLT();
                }
                this.reg[regA] = this.reg[regA] % this.reg[regB];
                break;
            case 'NOT':
                this.reg[regA] = ~this.reg[regA];
                break;
            case 'OR':
                this.reg[regA] = this.reg[regA] | this.reg[regB];
                break;
            case 'SUB':
                this.reg[regA] = this.reg[regA] - this.reg[regB];
                break;
            case 'XOR':
                this.reg[regA] = this.reg[regA] ^ this.reg[regB];
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR) from the current PC
        this.reg.IR = this.ram.read(this.reg.PC);
        // Debugging output
        // console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`);

        // Based on the value in the Instruction Register, locate the
        // appropriate hander in the branchTable
        let offset = (this.reg.IR >> 6) & 0b00000011;

        const operandA = this.ram.read(this.reg.PC + 1);
        const operandB = this.ram.read(this.reg.PC + 2);

        let handler = this.branchTable[this.reg.IR];
        // Check that the handler is defined, halt if not (invalid
        // instruction)
        if (!handler) {
            this.HLT();
            return undefined;
        }

        // We need to use call() so we can set the "this" value inside
        // the handler (otherwise it will be undefined in the handler)
        let nextPC = handler.call(this, operandA, operandB);

        if (nextPC !== undefined) {
            this.reg.PC = nextPC;
        } else {
            // Increment the PC register to go to the next instruction
            this.reg.PC += offset + 1;
        }
    }

    // INSTRUCTION HANDLER CODE:

    /**
     * ADD R R
     */
    ADD(regA, regB) {
        this.alu('ADD', regA, regB);
    }

    /**
     * HLT
     */
    HLT() {
        this.stopClock();
    }

    /**
     * LDI R,I
     */
    LDI(reg, value) {
        this.reg[reg] = value;
    }

    /**
     * MUL R,R
     */
    MUL(regA, regB) {
        // Call the ALU
        this.alu('MUL', regA, regB);
    }

    /**
     * PRN R
     */
    PRN(regA) {
        console.log(this.reg[regA]);
    }

    /**
     * AND R,R
     */
    AND(regA, regB) {
        this.alu('AND', regA, regB);
    }

    /**
     * NOP
     */
    NOP() {
        return undefined;
    }

    /**
     * INC R
     */
    INC(regA) {
        this.alu('INC', regA);
    }

    /**
     * DEC R
     */
    DEC(regA) {
        this.alu('DEC', regA);
    }

    /**
     * DIV R,R
     */
    DIV(regA, regB) {
        this.alu('DIV', regA, regB);
    }

    /**
     * CMP R,R
     */
    CMP(regA, regB) {
        this.alu('CMP', regA, regB);
    }

    _pop() {
        const value = this.ram.read(this.reg[SP]);
        this.alu('INC', SP);
        return value;
    }

    POP(regA) {
        this.reg[regA] = this._pop();
    }

    _push(value) {
        this.alu('DEC', SP);
        this.ram.write(this.reg[SP], value);
    }

    PUSH(regA) {
        this._push(this.reg[regA]);
    }

    JEQ(regA) {
        if (this.reg.FL === 1) {
            return this.reg[regA];
        }
    }

    JGT(regA) {
        if (this.reg.FL === 2) {
            return this.reg[regA];
        }
    }

    JLT(regA) {
        if (this.reg.FL === 4) {
            return this.reg[regA];
        }
    }

    JMP(regA) {
        return this.reg[regA];
    }

    JNE(regA) {
        if (this.reg.FL === 0) {
            return this.reg[regA];
        }
    }

    CALL(regA) {
        this._push(this.reg.PC + 2);
        return this.reg[regA];
    }

    MOD(regA, regB) {
        this.alu('MOD', regA, regB);
    }

    NOT(regA) {
        this.alu('NOT', regA);
    }

    OR(regA, regB) {
        this.alu('OR', regA, regB);
    }

    SUB(regA, regB) {
        this.alu('SUB', regA, regB);
    }

    XOR(regA, regB) {
        this.alu('XOR', regA, regB);
    }

    RET() {
        return this._pop();
    }

    LD(regA, regB) {
        this.reg[regA] = this.ram.read(this.reg[regB]);
    }

    PRA(regA) {
        const value = this.reg[regA];
        console.log(String.fromCharCode(value));
    }

    ST(regA, regB) {
        const value = this.reg[regB];
        this.ram.write(this.reg[regA], value);
    }

    IRET() {}
}

module.exports = CPU;
