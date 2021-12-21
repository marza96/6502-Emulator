#!/root/.nvm/versions/node/v8.0.0/bin/node

var {MemMapConstants} = require("/home/node/SNESEmulator/CPUEmulator/cpu_constatns.js");


class RAM{
    constructor(programData){
        this.memory = {};
        this.initializeRAM();
        this.populateROM(programData);
    }

    initializeRAM(){
        for (var i = 0x00; i <= 0xFF; i++)
            this.memory[i] = 0x00;
    }

    populateROM(programData){
        var romLimits = MemMapConstants._ROM;
        var romOffset = romLimits[0];
        for (var key in programData) {
            var addr = (romOffset + parseInt(key));
            this.memory[romOffset + parseInt(key)] = programData[key];
            console.assert(romOffset <= romLimits[1])
        }
    }

    getData(addr){
        return this.memory[addr];
    }

    setData(addr, byte){
        console.assert(romOffset < romLimits[0]);
        this.memory[addr] = byte;
    }
}


exports.RAM = RAM;