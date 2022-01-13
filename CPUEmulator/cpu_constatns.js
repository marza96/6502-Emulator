/*
    Memory access constants
*/
const MEM_ACC       = Symbol("MemMap");
const MEM_ABS       = Symbol("MemMap");
const MEM_ABS_X     = Symbol("MemMap");
const MEM_ABS_Y     = Symbol("MemMap");
const MEM_IMM       = Symbol("MemMap");
const MEM_IMPL      = Symbol("MemMap");
const MEM_IND       = Symbol("MemMap");
const MEM_X_IND     = Symbol("MemMap");
const MEM_IND_Y     = Symbol("MemMap");
const MEM_REL       = Symbol("MemMap");
const MEM_ZP        = Symbol("MemMap");
const MEM_ZPX       = Symbol("MemMap");
const MEM_ZPY       = Symbol("MemMap");


/*
    Memory access constants wrapper
*/
class MemConstants{
    static get _ACC()   {return MEM_ACC;    }
    static get _ABS()   {return MEM_ABS;    }
    static get _ABS_X() {return MEM_ABS_X;  }
    static get _ABS_Y() {return MEM_ABS_Y;  }
    static get _IMM()   {return MEM_IMM;    }
    static get _IMPL()  {return MEM_IMPL;   }
    static get _IND()   {return MEM_IND;    }
    static get _X_IND() {return MEM_X_IND;  }
    static get _IND_Y() {return MEM_IND_Y;  }
    static get _REL()   {return MEM_REL;    }
    static get _ZP()    {return MEM_ZP;     }
    static get _ZPX()   {return MEM_ZPX;    }
    static get _ZPY()   {return MEM_ZPY;    }
}


/*
    Memory map constants wrapper
*/
class MemMapConstants{
    static get _ZERO_PAGE() {return [0x0000, 0x0100];}
    static get _STACK()     {return [0x0100, 0x0200];}
    static get _IO_PER()    {return [0x0200, 0x0300];}
    static get _FREE()      {return [0x0300, 0xE000];}
    static get _ROM()       {return [0xE000, 0xFFFF];}
}


/*
    CPU Interrupt constants wrapper
*/
class IntConstants{
    static get _INT_RES() {return "_INT_RES";}
    static get _INT_NMI() {return "_INT_NMI";}
    static get _INT_BRK() {return "_INT_BRK";}
    static get _INT_IQR() {return "_INT_IQR";}
}


/*
    Interrupt execution vectors
*/
class IntVectors{
    static get _INT_RES() {return [0xFFFC, 0xFFFD];}
    static get _INT_NMI() {return [0xFFFA, 0xFFFB];}
    static get _INT_BRK() {return [0xFFFE, 0xFFFF];}
    static get _INT_IQR() {return [0xFFFE, 0xFFFF];}
}


/*
    Status Register flags
*/
class SRMasks{
    static get _NEG()   {return 0x80;} 
    static get _OFW()   {return 0x40;}
    static get _NO()    {return 0x20;}
    static get _BRK()   {return 0x10;}
    static get _DEC()   {return 0x08;}
    static get _INT()   {return 0x04;}
    static get _ZERO()  {return 0x02;}
    static get _CARRY() {return 0x01;}
}


/*
    OpCode Map  
*/
class OpcodeMap{
    static get _x69(){return ['_ADC',   MemConstants._IMM,      2,  2];}
    static get _x65(){return ['_ADC',   MemConstants._ZP,       2,  2];}    
    static get _x75(){return ['_ADC',   MemConstants._ZPX,      2,  2];}    
    static get _x6D(){return ['_ADC',   MemConstants._ABS,      3,  3];}    
    static get _x7D(){return ['_ADC',   MemConstants._ABS_X,    3,  3];}
    static get _x79(){return ['_ADC',   MemConstants._ABS_Y,    3,  3];}    
    static get _x61(){return ['_ADC',   MemConstants._X_IND,    2,  2];}    
    static get _x71(){return ['_ADC',   MemConstants._IND_Y,    2,  2];}   

    static get _x29(){return ['_AND',   MemConstants._IMM,      2,  2];} 
    static get _x25(){return ['_AND',   MemConstants._ZP,       2,  3];} 
    static get _x35(){return ['_AND',   MemConstants._ZPX,      2,  4];} 
    static get _x2D(){return ['_AND',   MemConstants._ABS,      3,  4];} 
    static get _x3D(){return ['_AND',   MemConstants._ABS_X,    3,  4];} 
    static get _x39(){return ['_AND',   MemConstants._ABS_Y,    3,  4];} 
    static get _x21(){return ['_AND',   MemConstants._X_IND,    2,  6];} 
    static get _x31(){return ['_AND',   MemConstants._IND_Y,    2,  5];} 
    
    static get _x0A(){return ['_ASL',   MemConstants._ACC,      1,  2];}
    static get _x06(){return ['_ASL',   MemConstants._ZP,       2,  5];}
    static get _x16(){return ['_ASL',   MemConstants._ZPX,      2,  6];}
    static get _x0E(){return ['_ASL',   MemConstants._ABS,      3,  6];}
    static get _x1E(){return ['_ASL',   MemConstants._ABS_X,    3,  7];}

    static get _x90(){return ['_BCC',   MemConstants._REL,      2,  2];}
        
    static get _xB0(){return ['_BCS',   MemConstants._REL,      2,  2];}   
     
    static get _xF0(){return ['_BEQ',   MemConstants._REL,      2,  2];}   
    
    static get _x24(){return ['_BIT',   MemConstants._ZP,       2,  3];} 
    static get _x2C(){return ['_BIT',   MemConstants._ABS,      3,  4];} 
    
    static get _xA9(){return ['_LDA',   MemConstants._IMM,      2,	2];}  
    static get _xA5(){return ['_LDA',   MemConstants._ZP,       2,	3];}   
    static get _xB5(){return ['_LDA',   MemConstants._ZPX,      2,	4];}   
    static get _xAD(){return ['_LDA',   MemConstants._ABS,      3,	4];}   
    static get _xBD(){return ['_LDA',   MemConstants._ABS_X,    3,	4];}  
    static get _xB9(){return ['_LDA',   MemConstants._ABS_Y,    3,	4];}   
    static get _xA1(){return ['_LDA',   MemConstants._X_IND,    2,	6];}   
    static get _xB1(){return ['_LDA',   MemConstants._IND_Y,    2,	5];} 

    static get _xE9(){return ['_SBC',   MemConstants._IMM,      2,  2];}   
    static get _xE5(){return ['_SBC',   MemConstants._ZP,       2,  3];}   
    static get _xF5(){return ['_SBC',   MemConstants._ZPX,      2,  4];}   
    static get _xED(){return ['_SBC',   MemConstants._ABS,      3,  4];}   
    static get _xFD(){return ['_SBC',   MemConstants._ABS_X,    3,  4];}   
    static get _xF9(){return ['_SBC',   MemConstants._ABS_Y,    3,  4];}   
    static get _xE1(){return ['_SBC',   MemConstants._X_IND,    2,  6];}   
    static get _xF1(){return ['_SBC',   MemConstants._IND_Y,    2,  5];} 

    static get _x40(){return ['_RTI',   MemConstants._IMPL,     1,  6];}    

    static get _x30(){return ['_BMI',   MemConstants._REL,      2,  2];}    

    static get _xD0(){return ['_BNE',   MemConstants._REL,      2,  2];}    

    static get _x10(){return ['_BPL',   MemConstants._REL,      2,  2];} 

    static get _x00(){return ['_BRK',   MemConstants._IMPL,     1,  7];}   

    static get _x50(){return ['_BVC',   MemConstants._REL,      2,  2];} 

    static get _x70(){return ['_BVS',   MemConstants._REL,      2,  2];} 
    
    static get _x60(){return ['_RTS',   MemConstants._IMPL,     1,  6];}    

    static get _x18(){return ['_CLC',   MemConstants._IMPL,     1,  2];} 

    static get _xD8(){return ['_CLD',   MemConstants._IMPL,     1,  2];}   

    static get _x58(){return ['_CLI',   MemConstants._IMPL,     1,  2];}    

    static get _xB8(){return ['_CLV',   MemConstants._IMPL,     1,  2];}  

    static get _xC9(){return ['_CMP',   MemConstants._IMM,      2,  2];} 
    static get _xC5(){return ['_CMP',   MemConstants._ZP,       2,  3];} 
    static get _xD5(){return ['_CMP',   MemConstants._ZPX,      2,  4];} 
    static get _xCD(){return ['_CMP',   MemConstants._ABS,      3,  4];}   
    static get _xDD(){return ['_CMP',   MemConstants._ABS_X,    3,  4];} 
    static get _xD9(){return ['_CMP',   MemConstants._ABS_Y,    3,  4];} 
    static get _xC1(){return ['_CMP',   MemConstants._X_IND,    2,  6];}
    static get _xD1(){return ['_CMP',   MemConstants._IND_Y,    2,  5];} 

    static get _xE0(){return ['_CPX',   MemConstants._IMM,      2];}
    static get _xE4(){return ['_CPX',   MemConstants._ZP ,      3];}
    static get _xEC(){return ['_CPX',   MemConstants._ABS,      4];}

    static get _xC0(){return ['_CPY',   MemConstants._IMM,      2];}
    static get _xC4(){return ['_CPY',   MemConstants._ZP ,      3];}
    static get _xCC(){return ['_CPY',   MemConstants._ABS,      4];} 

    static get _xC6(){return ['_DEC',   MemConstants._ZP,       5];}
    static get _xD6(){return ['_DEC',   MemConstants._ZPX,      6];}    
    static get _xCE(){return ['_DEC',   MemConstants._ABS,      6];}    
    static get _xDE(){return ['_DEC',   MemConstants._AB,       7];}    

    static get _xCA(){return ['_DEX',   MemConstants._IMPL,     2];}  

    static get _x88(){return ['_DEY',   MemConstants._IMPL,     2];} 

    static get _x49(){return ['_EOR',   MemConstants._IMM,      2];}
    static get _x45(){return ['_EOR',   MemConstants._ZP,       3];}   
    static get _x55(){return ['_EOR',   MemConstants._ZPX,      4];}   
    static get _x4D(){return ['_EOR',   MemConstants._ABS,      4];}   
    static get _x5D(){return ['_EOR',   MemConstants._ABS_X,    4];}
    static get _x59(){return ['_EOR',   MemConstants._ABS_Y,    4];}   
    static get _x41(){return ['_EOR',   MemConstants._X_IND,    6];}   
    static get _x51(){return ['_EOR',   MemConstants._IND_Y,    5];} 

    static get _xE6(){return ['_INC',   MemConstants._ZP,       5];}
    static get _xF6(){return ['_INC',   MemConstants._ZPX,      6];}
    static get _xEE(){return ['_INC',   MemConstants._ABS,      6];}
    static get _xFE(){return ['_INC',   MemConstants._ABS_X,    7];}


    static get _INX(){return ['_INX',   MemConstants._ACC];}    
    static get _INY(){return ['_INY',   MemConstants._ACC];}    
    static get _JMP(){return ['_JMP',   MemConstants._ACC];}    
    static get _JSR(){return ['_JSR',   MemConstants._ACC];}  
    static get _LDX(){return ['_LDX',   MemConstants._ACC];}    
    static get _LDY(){return ['_LDY',   MemConstants._ACC];}    
    static get _LSR(){return ['_LSR',   MemConstants._ACC];}    
    static get _NOP(){return ['_NOP',   MemConstants._ACC];}    
    static get _ORA(){return ['_ORA',   MemConstants._ACC];}    
    static get _PHA(){return ['_PHA',   MemConstants._ACC];}    
    static get _PHP(){return ['_PHP',   MemConstants._ACC];}    
    static get _PLA(){return ['_PLA',   MemConstants._ACC];}    
    static get _PLP(){return ['_PLP',   MemConstants._ACC];}    
    static get _ROL(){return ['_ROL',   MemConstants._ACC];}    
    static get _ROR(){return ['_ROR',   MemConstants._ACC];}    
    static get _SEC(){return ['_SEC',   MemConstants._ACC];}    
    static get _SED(){return ['_SED',   MemConstants._ACC];}    
    static get _SEI(){return ['_SEI',   MemConstants._ACC];}    
    static get _STA(){return ['_STA',   MemConstants._ACC];}    
    static get _STX(){return ['_STX',   MemConstants._ACC];}    
    static get _STY(){return ['_STY',   MemConstants._ACC];}    
    static get _TAX(){return ['_TAX',   MemConstants._ACC];}    
    static get _TAY(){return ['_TAY',   MemConstants._ACC];}    
    static get _TSX(){return ['_TSX',   MemConstants._ACC];}    
    static get _TXA(){return ['_TXA',   MemConstants._ACC];}    
    static get _TXS(){return ['_TXS',   MemConstants._ACC];}    
    static get _TYA(){return ['_TYA',   MemConstants._ACC];}
}


exports.MemConstants = MemConstants;
exports.OpcodeMap = OpcodeMap;
exports.IntConstants = IntConstants;
exports.MemMapConstants = MemMapConstants;
exports.SRMasks = SRMasks;
exports.IntVectors = IntVectors;


