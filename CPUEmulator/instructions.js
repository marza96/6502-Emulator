const { IntConstants, SRMasks, OpcodeMap} = require("./cpu_constatns");

class Helpers{
    relBranchOffset(offset){
        var offset = address;
        var sign = offset & (0x80) == 1 ? 1 : -1;

        return sign * (offset & 0x7F);
    }
}

class Instructions{
    static _LDA(cpuInstance, address){
        var operand = cpuInstance.getData(address);

        cpuInstance.regA = operand;
        cpuInstance.updateSR(
            [
                SRMasks._ZERO,
                SRMasks._NEG
            ],
            [
                cpuInstance.regA      == 0x00,
                cpuInstance.regA >> 7 == 0x01
            ]
        );
    }

    static _RTI(cpuInstance, address){
        cpuInstance.regSR = cpuInstance.popStack() & 0xFF;
        cpuInstance.regPC = cpuInstance.popStack() & 0xFF;
        cpuInstance.regPC |= (cpuInstance.popStack() & 0xFF) << 8;
        cpuInstance.regPC -= 0x01;
    }

    static _SBC(cpuInstance, address){
        var operand = ~cpuInstance.getData(address);

        Instructions._ADC(
            cpuInstance, 0x00, operand);
    }

    static _ADC(cpuInstance, address, operandOvrride=null){
        var overflow = null;
        var carry    = null;
        var res      = null
        var operand = cpuInstance.getData(address);
        if (operandOvrride != null)
            operand = operandOvrride;

        carry = cpuInstance.regSR & SRMasks._CARRY;
        res = cpuInstance.regA + operand + carry;
        overflow = (cpuInstance.regA ^ res) & (operand ^ res);
        cpuInstance.regA = res;

        cpuInstance.updateSR(
            [
                SRMasks._ZERO,
                SRMasks._NEG,
                SRMasks._CARRY,
                SRMasks._OFW
            ],
            [
                cpuInstance.regA        == 0x00,
                cpuInstance.regA >> 7   == 0x01,
                cpuInstance.regA > 0xFF == 0x01,
                (overflow & 0x80) >> 7  == 0x01
            ]
        );
    }
    
    static _AND(cpuInstance, address){
        var operand = cpuInstance.getData(address);

        cpuInstance.regA = operand & cpuInstance.regA;
        cpuInstance.updateSR(
            [
                SRMasks._ZERO,
                SRMasks._NEG
            ],
            [
                cpuInstance.regA      == 0x00,
                cpuInstance.regA >> 7 == 0x01
            ]
        );
    }
    
    static _ASL(cpuInstance, address){
        var operand = cpuInstance.getData(address);

        cpuInstance.regA = operand << 0x01; 
        cpuInstance.updateSR(
            [
                SRMasks._ZERO,
                SRMasks._NEG,
                SRMasks._CARRY
            ],
            [
                cpuInstance.regA      == 0x00,
                cpuInstance.regA >> 7 == 0x01,
                (operand >> 7)        == 0x01
            ]
        );
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

        cpuInstance.updateSR(
            [
                SRMasks._ZERO,
            ],
            [
                operand & cpuInstance.regA == 0,
            ]
        );
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