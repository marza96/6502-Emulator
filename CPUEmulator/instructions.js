const { IntConstants } = require("./cpu_constatns");

class Helpers{
    relBranchOffset(offset){
        var offset = address;
        var sign = offset & (0x80) == 1 ? 1 : -1;
        return sign * (offset & 0x7F);
    }
}

class Instructions{
    static _ADC(cpuInstance, address){
        var operand = cpuInstance.getData(address);
        var carry = cpuInstance.regSR & 0x01;
        cpuInstance.regA = operand ^ cpuInstance.regA ^ carry;
        cpuInstance.carry = cpuInstance.regA & 0x01;
    }
    
    static _AND(cpuInstance, address){
        console.log("AND", address)
        var operand = cpuInstance.getData(address);
        cpuInstance.regA = operand & cpuInstance.regA;
    }
    
    static _ASL(cpuInstance, address){
        var operand = cpuInstance.getData(address);
        cpuInstance.regA = operand & cpuInstance.regA;
    }

    static _BCC(cpuInstance, address){
        if (cpuInstance.regSR & 0x01)
            return;

        offset = Helpers.relBranchOffset(address);
        cpuInstance.regPC += offset;
    }

    static _BCS(cpuInstance, address){
        if (!(cpuInstance.regSR & 0x01))
            return;

        offset = Helpers.relBranchOffset(address);
        cpuInstance.regPC += offset;
    }

    static _BEQ(cpuInstance, address){
        if (!(cpuInstance.regSR & 0x02))
            return;

        offset = Helpers.relBranchOffset(address);
        cpuInstance.regPC += offset;
    }

    static _BIT(cpuInstance, address){
        var operand = cpuInstance.getData(address);
        cpuInstance.regSR &= 0x3F;
        cpuInstance.regSR |= 0xC0 & operand;
    }

    static _BMI(cpuInstance, address){
        if (!(cpuInstance.regSR & 0x80))
            return;

        offset = Helpers.relBranchOffset(address);
        cpuInstance.regPC += offset;
    }

    static _BNE(cpuInstance, address){
        if (cpuInstance.regSR & 0x02)
            return;

        offset = Helpers.relBranchOffset(address);
        cpuInstance.regPC += offset;
    }

    static _BPL(cpuInstance, address){
        if (cpuInstance.regSR & 0x80)
            return;

        offset = Helpers.relBranchOffset(address);
        cpuInstance.regPC += offset;
    }
}


exports.Instructions = Instructions;