#!/root/.nvm/versions/node/v8.0.0/bin/node

var {InstructionDecoder} = require("/home/node/SNESEmulator/CPUEmulator/instruction_decoder.js");
var {MemConstants, OpcodeMap, IntConstants} = require("/home/node/SNESEmulator/CPUEmulator/cpu_constatns.js");

class CpuCore{
    constructor(RAMInstance){
        this.regX = 0x00;
        this.regY = 0x00;
        this.regA = 0x00;
        this.regPC = 0x00;
        this.regSR = 0x00;
        this.regSP = 0x01FF;

        this.temp_regX = 0x00;
        this.temp_regY = 0x00;
        this.temp_regA = 0x00;
        this.temp_regPC = 0x00;
        this.temp_regSR = 0x00;
        this.temp_regSP = 0x01FF;

        this.instrDecoder = new InstructionDecoder();
        this.RAMInstance = RAMInstance;
        
        this.zp = false;
        this.immMem = null;
        this.opcode = null;
        this.address = null;
        this.initCore();
    }

    get carry(){
        return this.regSR << 7;
    }

    initCore(){
        var vals = this.RAMInstance.fetchInstr(this.regPC);
        this.opcode = vals[0];
        this.address = vals[1];
    }

    getData(address){
        if (this.immMem != null){
            var data = this.immMem;
            this.immMem = null;
            return data;
        }
        
        if (this.zp == false)
            console.assert((address >= 0x300) && (address < 0xE000));
        
        this.zp = false
        return this.RAMInstance.getData(address);
    }

    saveState(){
        this.temp_regX  = regX;
        this.temp_regY  = regY; 
        this.temp_regA  = regA; 
        this.temp_regPC = regPC;
        this.temp_regSR = regSR;
        this.temp_regSP = regSP;
    }

    restoreState(){
        regX  = this.temp_regX; 
        regY  = this.temp_regY;  
        regA  = this.temp_regA;  
        regPC = this.temp_regPC;
        regSR = this.temp_regSR;
        regSP = this.temp_regSP;
    }

    pushStack(byte){
        console.assert(this.regSP >= 0x0101);
        this.ram_instance.setData(this.regSP, byte);
        this.regSP++;
    }

    popStack(){
        console.assert(this.regSP < 0xFE);
        byte = this.ram_instance.getData(this.regSP);
        this.regSP--;
        return byte;
    }

    interrupt(intType){
        return 0;
    }

    tick(){ 
        var done = null;
        done = this.instrDecoder.resolveInstr(
            this, this.opcode, this.address);

        if (done == false)
            return;
        
        this.regPC++;
        var vals = this.RAMInstance.fetchInstr(this.regPC);
        this.opcode = vals[0];
        this.address = vals[1];
    }
}


class DummyRam{
    constructor(data, opcode, addr){
        this.data = data;
        this.opcode = opcode;
        this.addr = addr;
    }

    setData(address, data){

    }

    getData(address){
        console.log("ADDR", address);
        return this.data[address];
    }

    fetchInstr(PC){
        return [this.opcode[PC], this.addr[PC]];
    }
}


ram_instance = new DummyRam(
    {
        0x22 : 0xAB,
        0x25 : 0xBB,
        0x26 : 0xCC,
        0x32 : 0x36,
        0x23 : 0x25,
        0x2C : 0x23,
        0x301 : 0x3C,
        0x305 : 0xA1,
        0x306 : 0xF1
    }, 
    ["_x29", "_x25", "_x35", "_x2D", "_x3D", "_x39", "_x21"], 
    [0x03, 0x22, 0x22, 0x301, 0x301, 0x301, 0x0027]
    );

core = new CpuCore(ram_instance);

//IMM
core.regA = 0xF1;
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0xF1 & 0x03);

//ZP
core.regA = 0xAF;
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0xAF & 0xAB);

//ZPX
core.regX = 3;
core.regA = 0xEF;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0xEF & 0xBB);

//ABS
core.regA = 0x2F;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x2F & 0x3C);

//ABS_X
core.regX = 4;
core.regA = 0x2C;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x2C & 0xA1);

//ABS_Y
core.regY = 5;
core.regA = 0x32;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x32 & 0xF1);

//X_IND
core.regX = 5;
core.regA = 0xC6;
core.tick();
core.tick();
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0xC6 & 0x25);
