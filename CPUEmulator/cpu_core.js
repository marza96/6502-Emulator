#!/root/.nvm/versions/node/v8.0.0/bin/node

var {InstructionDecoder} = require("/home/node/SNESEmulator/CPUEmulator/instruction_decoder.js");
var {MemMapConstants} = require("/home/node/SNESEmulator/CPUEmulator/cpu_constatns.js");
var {RAM} = require("/home/node/SNESEmulator/RAMEmulator/ram.js");


class CpuCore{
    constructor(RAMInstance){
        this.regX  = 0x00;
        this.regY  = 0x00;
        this.regA  = 0x00;
        this.regPC = MemMapConstants._ROM[0];
        this.regSR = 0x00;
        this.regSP = 0x01FF;

        this.temp_regX  = null;
        this.temp_regY  = null;
        this.temp_regA  = null;
        this.temp_regSR = null;
        this.temp_regPC = null;
        this.temp_regSP = null;

        this.instrDecoder = new InstructionDecoder();
        this.RAMInstance  = RAMInstance;
        
        this.zp        = false;
        this.immMem    = null;
        this.interrupt = null;
    }

    getData(address){
        if (this.immMem != null){
            var data    = this.immMem;
            this.immMem = null;
            return data;
        }
        
        if (this.zp == false)
            console.assert(
                (address >= MemMapConstants._FREE[0]) && (address < MemMapConstants._FREE[1]));
        
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

    isAllowed(intType){
        // TODO CHECK IF CERTAIN INTS ON
    }

    interrupt(intType){
        if (!this.isAllowed(intType))
            return;

        this.interrupt = intType;
    }

    interruptPrep(){
        this.saveState();
        this.pushStack(this.regSP & 0xF0);
        this.pushStack(this.regSP & 0x0F);
        this.pushStack(this.regSR);
        this.regSR &= 0xFB;
        // TODO FETCH INTERRUPT VECTOR
    }

    tick(){ 
        var bytes_step = null;
        bytes_step = this.instrDecoder.resolveInstr(this);

        if (bytes_step == 0x00)
            return;
        
        this.regPC += bytes_step;
        if (this.interrupt == null)
            return;
        
        this.interruptPrep();
    }
}


programData = [0x29, 0xA5, 0x25, 0x01, 0x35, 0x01, 0x03];
RAMInstance = new RAM(programData);
core = new CpuCore(RAMInstance);

//IMM
core.regA = 0xF1;
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0xF1 & 0xA5);

// ZP
RAMInstance.setData(0x01, 0xAB)
core.regA = 0xAF;
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0xAF & 0xAB);

//ZPX
RAMInstance.setData(0x04, 0xBB)
core.regX = 3;
core.regA = 0x2F;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x2F & 0xBB);

// //ABS
// core.regA = 0x2F;
// core.tick();
// core.tick();
// core.tick();
// core.tick();
// console.log("OUT", "is: ", core.regA, "should: ", 0x2F & 0x3C);

// //ABS_X
// core.regX = 4;
// core.regA = 0x2C;
// core.tick();
// core.tick();
// core.tick();
// core.tick();
// console.log("OUT", "is: ", core.regA, "should: ", 0x2C & 0xA1);

// //ABS_Y
// core.regY = 5;
// core.regA = 0x32;
// core.tick();
// core.tick();
// core.tick();
// core.tick();
// console.log("OUT", "is: ", core.regA, "should: ", 0x32 & 0xF1);

// //X_IND
// core.regX = 5;
// core.regA = 0xC6;
// core.tick();
// core.tick();
// core.tick();
// core.tick();
// core.tick();
// core
// .tick();
// console.log("OUT", "is: ", core.regA, "should: ", 0xC6 & 0x25);



