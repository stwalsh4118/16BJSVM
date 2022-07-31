const createMemory = require("./create-memory");
const CPU = require("./cpu");
const instructions = require("./instructions");

const memory = createMemory(256);

//we can pass the our memory into this array to have it change the actual memory buffer from reference
const writeableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

writeableBytes[0] = instructions.MOV_LIT_R1;
writeableBytes[1] = 0x12;
writeableBytes[2] = 0x34;

writeableBytes[3] = instructions.MOV_LIT_R2;
writeableBytes[4] = 0xab;
writeableBytes[5] = 0xcd;

writeableBytes[6] = instructions.ADD_REG_REG;
writeableBytes[7] = 0x2;
writeableBytes[8] = 0x3;

cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();
