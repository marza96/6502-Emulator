#!/root/.nvm/versions/node/v12.0.0/bin/node

var {InstructionDecoder} = require("/home/node/SNESEmulator/CPUEmulator/instruction_decoder.js");
var {MemMapConstants, IntConstants, IntVectors, SRMasks} = require("/home/node/SNESEmulator/CPUEmulator/cpu_constatns.js");
var {RAM} = require("/home/node/SNESEmulator/RAMEmulator/ram.js");


class CpuCore{
    constructor(RAMInstance){
        this.regX  = 0x00;
        this.regY  = 0x00;
        this.regA  = 0x00;
        this.regPC = MemMapConstants._ROM[0];
        this.regSR = 0x00;
        this.regSP = 0x01FF;

        this.instrDecoder = new InstructionDecoder();
        this.RAMInstance  = RAMInstance;
        
        this.intActive = false;
        this.zp        = false;
        this.immMem    = null;
        this.interrupt = null;
    }

    getData(address){
        if (address == null)
            return this.regA;
        
        if (this.immMem != null){
            var data    = this.immMem;
            this.immMem = null;
            return data;
        }
        
        if (this.zp == false){
            var inRange = address >= MemMapConstants._FREE[0];
            inRange = inRange & (address < MemMapConstants._FREE[1]);
            console.assert(inRange);
        }
        
        this.zp = false
        return this.RAMInstance.getData(address);
    }

    updateSR(bits, vals){
        var maskByte = 0x0;
        var valsByte = 0x0;
        var regSRCpy = this.regSR;

        bits.forEach(bit => {
            maskByte |= bit 
        });
        vals.forEach((flag ,index) => {
            valsByte |= flag * bits[index]
        });

        regSRCpy &= 0xFF - maskByte;
        regSRCpy |= valsByte;
        this.regSR = regSRCpy;
    }

    pushStack(byte){
        // console.assert(this.regSP >= 0x0101);
        this.RAMInstance.setData(this.regSP, byte);

        this.regSP++;
    }

    popStack(){
        // console.assert(this.regSP < 0xFE);
        var byte = this.RAMInstance.getData(--this.regSP);

        // this.regSP--;
        return byte;
    }

    isAllowed(intType){
        if (intType == null)
            return false

        if (intType == IntConstants._INT_IQR)
            return !(this.regSR & SRMasks._INT >> 2);
        
        return true;
    }

    interruptInit(){
        var intVector = IntVectors[this.interrupt];

        this.pushStack((this.regPC & 0xFF00) >> 8);
        this.pushStack(this.regPC & 0x00FF);
        this.pushStack(this.regSR);
        this.regSR |= SRMasks._INT;
        this.regPC = (this.RAMInstance.getData(intVector[0]) & 0xFF) << 8;
        this.regPC |= this.RAMInstance.getData(intVector[1]) & 0xFF;
        this.intActive = true;
        this.interrupt = null;
    }

    tick(intType=null){ 
        var byteStep = null;
        var currCycle = null;

        [byteStep, currCycle] = this.instrDecoder.resolveInstr(this);
        if (this.isAllowed(intType)){
            this.interrupt = intType;
        }

        if (byteStep == 0x00)
            return;
        
        this.regPC += byteStep;
        if (this.interrupt == null)
            return;
        
        this.interruptInit();
    }
}


programData = [
    0x69, 0x7E,
    0x29, 0xA5, 
    0x25, 0x01, 
    0x35, 0x03, 
    0x2D, 0x11, 0x33, 
    0x3D, 0x12, 0x33, 
    0x39, 0x12, 0x33,
    0x21, 0x02,
    0x31, 0x07,
    0xA9, 0xF1, //LDA FOR INTERRUPT TEST
    0x40        //RTI FOR INTERRUPT TEST
];
RAMInstance = new RAM(programData);
core = new CpuCore(RAMInstance);
RAMInstance.setData(0xFFFA, 0xE0);
RAMInstance.setData(0xFFFB, 0x15);

//ADC IMM WITH OVERFLOW
core.regA = 0x2;
core.tick(IntConstants._INT_NMI);
core.tick();
console.log("SP TEST", core.regSR.toString(16))

core.tick();
core.tick();

core.tick();
core.tick();
core.tick();
core.tick();
core.tick();
core.tick();

//IMM
// core.regA = 0xF1;
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
RAMInstance.setData(0x06, 0xBB)
core.regX = 3;
core.regA = 0x2F;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x2F & 0xBB);

//ABS
RAMInstance.setData(0x3311, 0x3C)
core.regA = 0x2F;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x2F & 0x3C);

//ABS_X
RAMInstance.setData(0x3316, 0xA1)
core.regX = 4;
core.regA = 0x2C;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x2C & 0xA1);

//ABS_Y
RAMInstance.setData(0x3317, 0xF1)
core.regY = 5;
core.regA = 0x32;
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x32 & 0xF1);

//X_IND
RAMInstance.setData(0x7, 0x8)
RAMInstance.setData(0x8, 0x25)
core.regX = 5;
core.regA = 0xC6;
core.tick();
core.tick();
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0xC6 & 0x25);

//IND_Y
RAMInstance.setData(0x7, 0x8)
RAMInstance.setData(0x9, 0x31)
core.regY = 1;
core.regA = 0x11;
core.tick();
core.tick();
core.tick();
core.tick();
core.tick();
console.log("OUT", "is: ", core.regA, "should: ", 0x11 & 0x31);





