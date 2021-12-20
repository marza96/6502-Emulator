const { IntConstants } = require("./cpu_constatns");

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


exports.Instructions = Instructions;