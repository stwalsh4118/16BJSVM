const createMemory = require("./create-memory");
const instructions = require("./instructions");

class CPU {
	/**
	 ** Initialize a CPU class
	 *  @param  {DataView} memory
	 *
	 * note: the dependency injection of the memory makes the code
	 * more modular and easier to refactor
	 */
	constructor(memory) {
		this.memory = memory;

		//!we will also create the CPU registers in the constructor
		//!holds the actual state of the CPU

		//!SPECIAL REGISTERS
		//!
		//!Instruction pointer (ip): holds the address of the next instruction in memory
		//!Accumulator (acc): holds the output of mathematical operations
		//!

		this.registerNames = ["ip", "acc", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

		//!Were making a 16-bit cpu
		//!thus each register is going to be 16 bits wide (or 2 bytes)

		//allocate the memory for all of the registers (10 * 2 = 20 bytes in total - we can add more or remove some later as we please)
		this.registers = createMemory(this.registerNames.length * 2);

		//create a register map that maps the register names to the byte offset or the actual space in memory that corresponds to it
		this.registerMap = this.registerNames.reduce((map, name, i) => {
			//for each register name map the byte offset to it
			map[name] = i * 2;
			return map;
		}, {});
	}
	/**
	 ** print out the values in the registers
	 * @return {void}
	 */
	debug() {
		this.registerNames.forEach((name) => {
			console.log(`${name}: ${this.getRegister(name).toString(16).padStart(4, "0")}`);
		});
		console.log();
	}

	/**
	 ** Get the value of the named register
	 *  @param  {string} name: give name of register to get the value of
	 *  @return {void}
	 */
	getRegister(name) {
		//check if name given is actually a name of a register
		if (!(name in this.registerMap)) {
			throw new Error(`getRegister: No register with name: ${name}`);
		}

		//return the 16 bit value at the byte offset that is mapped to the register name requested
		return this.registers.getUint16(this.registerMap[name]);
	}

	/**
	 ** Set the value of named register to given value
	 *  @param  {string} name: give name of register to set the value of
	 *  @param  {number} value: give 16 bit number to set the register to
	 *  @return {void}
	 */
	setRegister(name, value) {
		//check validity of register name
		if (!(name in this.registerMap)) {
			throw new Error(`setRegister: No register with name: ${name}`);
		}

		//set the value of the named register with the given value
		return this.registers.setUint16(this.registerMap[name], value);
	}

	/**
	 ** Get the byte thats being pointed to by the IP register, then
	 ** move the instruction pointer one byte over
	 * @return {Uint8}: returns the byte pointed to by the IP register
	 */
	fetch() {
		const nextInstructionAddress = this.getRegister("ip");
		const instruction = this.memory.getUint8(nextInstructionAddress);
		this.setRegister("ip", nextInstructionAddress + 1);

		return instruction;
	}

	/**
	 ** Get the next two bytes thats being pointed to by the IP register, then
	 ** move the instruction pointer two byte over
	 * @return {Uint16}: returns the next two bytes point to by the IP register
	 *
	 * note: we create this secondary fetch since we will often be wanting to fetch two bytes in our instructions
	 */
	fetch16() {
		const nextInstructionAddress = this.getRegister("ip");
		const instruction = this.memory.getUint16(nextInstructionAddress);
		this.setRegister("ip", nextInstructionAddress + 2);

		return instruction;
	}
	/**
	 ** Tries to execute given instruction
	 *  @param  {Uint8} instruction: input 8 bit number, executes something if it is a implemented instruction
	 *  @return {void}
	 */
	execute(instruction) {
		switch (instruction) {
			//move literal into the r1 register
			//this instruction move a 16 bit number so we use our fetch16 to get it
			case instructions.MOV_LIT_R1: {
				const literal = this.fetch16();
				this.setRegister("r1", literal);
				return;
			}

			//move literal into the r2 register
			case instructions.MOV_LIT_R2: {
				const literal = this.fetch16();
				this.setRegister("r2", literal);
				return;
			}

			//add register to register
			//note: register addresses are 1 byte long so we just use fetch
			case instructions.ADD_REG_REG: {
				const registerX = this.fetch();
				const registerY = this.fetch();

				//need to translate the numerical version of the registers into their mapped names
				//we can use the fact that we mapped the registers sequentially to get them by their indexes in the register mapping

				const registerValue1 = this.registers.getUint16(registerX * 2);
				const registerValue2 = this.registers.getUint16(registerY * 2);
				this.setRegister("acc", registerValue1 + registerValue2);
				return;
			}
		}
	}

	/**
	 ** Calls fetch, then executes whatever it fetched
	 *  @return {void}
	 */
	step() {
		const instruction = this.fetch();
		return this.execute(instruction);
	}
}

module.exports = CPU;
