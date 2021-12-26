#!/root/.nvm/versions/node/v8.0.0/bin/node

var {MemConstants, OpcodeMap, IntConstants} = require("/home/node/SNESEmulator/CPUEmulator/cpu_constatns.js");
var {Instructions} = require("/home/node/SNESEmulator/CPUEmulator/instructions.js");

class InstructionDecoder{
    constructor(){
        this.instrName = null;
        this.memAccess = null;
        this.bytes     = null;
        this.cycles    = null;
        this.curCycle  = null;
        this.PREP      = "_x";

        var instrs = Object.getOwnPropertyNames(Instructions);
        for (var key in instrs) {
            var instr_name = instrs[key];
            if (instr_name[0] != '_')
                continue;

            this[instr_name] = this.wrapInstr(
                Instructions[instr_name]); 
        }
    }

    calcAddr(cpuInstance, address, mem_access){
        switch(mem_access){
            case MemConstants._ACC:
                address = null;
                break;
            case MemConstants._ABS:
                address = address;
                break;  
            case MemConstants._ABS_X:
                address = address + cpuInstance.regX;
                break;
            case MemConstants._ABS_Y:
                address = address + cpuInstance.regY;
                break;
            case MemConstants._IMM:
                cpuInstance.immMem = address;
                break;  
            case MemConstants._IND:
                address = cpuInstance.getData(address);
                break;  
            case MemConstants._X_IND:
                cpuInstance.zp = true;
                address = cpuInstance.getData(
                    address + cpuInstance.regX)
                cpuInstance.zp = true;
                break;
            case MemConstants._IND_Y:
                cpuInstance.zp = true;
                address = cpuInstance.getData(address)
                address += cpuInstance.regY;
                cpuInstance.zp = true;
                break;
            case MemConstants._REL:
                address = cpuInstance.regPC + address;
                break;  
            case MemConstants._ZP:
                cpuInstance.zp = true;
                address = address;
                break;   
            case MemConstants._ZPX:
                cpuInstance.zp = true;
                address = address + cpuInstance.regX;
                break;  
            case MemConstants._ZPY:
                cpuInstance.zp = true;
                address = address + cpuInstance.regY;
                break;  
        }
        return address;
    }

    wrapInstr(instruction){
        return function(cpuInstance, address, mem_access){
            address = this.calcAddr(
                cpuInstance, address, mem_access);
            return instruction(cpuInstance, address);
        };
    }

    fetchAddr(cpuInstance, bytes){
        var addr  = 0x00;
        var offset  = 1;
        var regPC = cpuInstance.regPC;
        
        for (var i = 0x01; i < bytes; i++){
            var byte = cpuInstance.RAMInstance.getData(regPC + i);
            addr += offset * byte;
            offset *= 256;
        }
        
        return addr;
    }

    resolveInstr(cpuInstance){
        if (this.cycles == null){
            var opCode  = null;
            var regPC   = null;
            var retVals = null;

            regPC   = cpuInstance.regPC;
            opCode  = cpuInstance.RAMInstance.getData(regPC);
            opCode  = opCode.toString(16);
            opCode  = this.PREP + opCode.toUpperCase();
            
            retVals = OpcodeMap[opCode];
            this.instrName = retVals[0];
            this.memAccess = retVals[1];
            this.bytes     = retVals[2]
            this.cycles    = retVals[3];  
            this.currCycle = 0;
        }
        
        if (this.currCycle < this.cycles - 1){
            this.currCycle++;

            return [0x00, this.currCycle];
        }

        var addr = this.fetchAddr(cpuInstance, this.bytes);
        this[this.instrName](cpuInstance, 
            addr, this.memAccess);
        cpuInstance.regA = 0xFF & cpuInstance.regA;

        var retBytes   = this.bytes;
        var retCurrCyle = this.currCycle + 1;
        this.instrName  = null;
        this.memAccess  = null;
        this.bytes      = null;
        this.cycles     = null;
        this.currCycle = null;
        
        return [retBytes, retCurrCyle];
    }
}


exports.InstructionDecoder = InstructionDecoder
