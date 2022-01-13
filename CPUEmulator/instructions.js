const {SRMasks, IntVectors} = require("./cpu_constatns");

class Helpers{
    static add(op1, op2){
        
    }
}

class Instructions{
    static _RTI(cpuInstance, address){
        cpuInstance.regSR = cpuInstance.popStack() & 0xFF;
        cpuInstance.regPC = cpuInstance.popStack() & 0xFF;
        cpuInstance.regPC |= (cpuInstance.popStack() & 0xFF) << 8;
        cpuInstance.regPC -= 0x01;
        cpuInstance.regSR &= 0xFF - SRMasks._BRK;
    }

    static _RTS(cpuInstance, address){
        cpuInstance.regPC = cpuInstance.popStack() & 0xFF;
        cpuInstance.regPC |= (cpuInstance.popStack() & 0xFF) << 8;
    }

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

    static _CMP(cpuInstance, address){
        var operand = cpuInstance.getData(address);
        var res = Instructions._SBC(
            cpuInstance, address, operand, true);

        cpuInstance.updateSR(
            [
                SRMasks._ZERO,
                SRMasks._NEG,
                SRMasks._CARRY,
            ],
            [
                res        == 0x00,
                res >> 7   == 0x01,
                res > 0xFF == 0x01,
            ]
        );
    }

    static _CPX(cpuInstance, address){

    }

    static _CPX(cpuInstance, address){
        
    }

    static _SBC(cpuInstance, address, resOverride=false){
        var operand = ~cpuInstance.getData(address);

        return Instructions._ADC(
                    cpuInstance, 0x00, operand, resOverride);
    }

    static _ADC(cpuInstance, address, operandOvrride=null, resOverride=false){
        var overflow = null;
        var carry    = null;
        var res      = null
        var operand = cpuInstance.getData(address);

        if (operandOvrride != null)
            operand = operandOvrride;

        carry = cpuInstance.regSR & SRMasks._CARRY;
        res = cpuInstance.regA + operand + carry;
        overflow = (cpuInstance.regA ^ res) & (operand ^ res);

        if (resOverride == true)
            return res;

        cpuInstance.regA = res;
        cpuInstance.updateSR(
            [
                SRMasks._ZERO,
                SRMasks._NEG,
                SRMasks._CARRY,
                SRMasks._OFW
            ],
            [
                res        == 0x00,
                res >> 7   == 0x01,
                res > 0xFF == 0x01,
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

    static _BRK(cpuInst, address){
        var intVec = IntVectors._BRK;
        var retPC = cpuInst.regPC + 0x0001;

        cpuInst.pushStack((retPC & 0xFF00) >> 8);
        cpuInst.pushStack(retPC & 0x00FF);
        cpuInst.pushStack(cpuInst.regSR | SRMasks._BRK);
        cpuInst.regSR |= SRMasks._INT;
        cpuInst.regPC = (cpuInst.RAMInstance.getData(intVec[1]) & 0xFF) << 8;
        cpuInst.regPC |= cpuInst.RAMInstance.getData(intVec[0]) & 0xFF;
        cpuInst.interrupt = null;
    }

    static _BCC(cpuInstance, address){
        if (!(cpuInstance.regSR & SRMasks._CARRY))
            cpuInstance.regPC += address;
    }

    static _BCS(cpuInstance, address){
        if (cpuInstance.regSR & SRMasks._CARRY)
            cpuInstance.regPC += address;
    }

    static _BEQ(cpuInstance, address){
        if (cpuInstance.regSR & SRMasks._ZERO)
            cpuInstance.regPC += address;
    }

    static _BMI(cpuInstance, address){
        if (cpuInstance.regSR & SRMasks._NEG)
            cpuInstance.regPC += address;
    }

    static _BNE(cpuInstance, address){
        if (!(cpuInstance.regSR & SRMasks._ZERO))
            cpuInstance.regPC += address;
    }

    static _BPL(cpuInstance, address){
        if (!(cpuInstance.regSR & SRMasks._NEG))
            cpuInstance.regPC += address;
    }

    static _CLC(cpuInstance, address){
        cpuInstance.regSR &= 0xFF - SRMasks._CARRY;
    }

    static _CLD(cpuInstance, address){
        cpuInstance.regSR &= 0xFF - SRMasks._DEC;
    }

    static _CLI(cpuInstance, address){
        cpuInstance.regSR &= 0xFF - SRMasks._INT;
    }

    static _CLV(cpuInstance, address){
        cpuInstance.regSR &= 0xFF - SRMasks._OFW;
    }
}


exports.Instructions = Instructions;