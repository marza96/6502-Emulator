#!/root/.nvm/versions/node/v8.0.0/bin/node

var {MemConstants, OpcodeMap, IntConstants} = require("/home/node/SNESEmulator/CPUEmulator/cpu_constatns.js");


class InstructionDecoder{
    constructor(){
        this.cycles = null
        this.curr_cycle = null

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
                address = cpuInstance.regA;
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

    resolveInstr(cpuInstance, opcode, address){
        var instr_name, mem_access, cycles;
        [instr_name, mem_access, cycles] = OpcodeMap[opcode];
        if (this.cycles == null){
            this.cycles = cycles;
            this.curr_cycle = 0;
        }
        
        if (this.curr_cycle < this.cycles - 1){
            this.curr_cycle++;
            return false;
        }

        this.curr_cycle = null;
        this.cycles = null;
        this[instr_name](
            cpuInstance, address, mem_access);
        return true
    }
}


class Instructions{
    static _ORA(cpuInstance, address){
        var operand = cpuInstance.getData(address);
        cpuInstance.regA = operand | cpuInstance.regA;
    }
    
    static _ADC(cpuInstance, address){
        var operand = cpuInstance.getData(address);
        cpuInstance.regA = operand ^ cpuInstance.regA ^ cpuInstance.carry;
        cpuInstance.carry = cpuInstance.regA << 8 == 0 ? 1 : 0;
    }
    
    static _AND(cpuInstance, address){
        var operand = cpuInstance.getData(address);
        cpuInstance.regA = operand & cpuInstance.regA;
    }
    
    static _ASL(cpuInstance, address){
        var operand = cpuInstance.getData(address);
        cpuInstance.regA = operand & cpuInstance.regA;
    }
}


exports.InstructionDecoder = InstructionDecoder
