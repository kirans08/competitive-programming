const fs = require('fs');
const input = fs.readFileSync('input', 'utf8');

const processOpcode = opcode => {

    let parts = opcode.toString().split('').reverse();

    return {
        code: opcode % 100,
        mode1: parts[2] || 0,
        mode2: parts[3] || 0,
    }

}

const run = (program,inputs) => {

    let pointer = 0, output, param1, param2, inputPointer = 0;

    program = program.split(',').map(Number);

    while (pointer < program.length) {

        const opcode = processOpcode(program[pointer++]);

        let arg1 = program[pointer];
        let arg2 = program[pointer+1];
        let arg3 = program[pointer+2];
        (opcode.mode1 == 0) && (arg1 = program[arg1]);
        (opcode.mode2 == 0) && (arg2 = program[arg2]);

        switch(opcode.code) {

            case 1:
                program[arg3] = arg1 + arg2;
                pointer+=3;
                break;
            case 2:
                program[arg3] = arg1 * arg2;
                pointer+=3;
                break;

            case 3:
                program[program[pointer]] = inputs[inputPointer++];
                pointer++;
                break;

            case 4:
                output = arg1;
                pointer++;
                break;

            case 5:
                pointer+=2;
                (arg1 != 0) && (pointer = arg2)
                break

            case 6:
                pointer+=2;
                (arg1 == 0) && (pointer = arg2)
                break

            case 7:
                program[arg3] = (arg1 < arg2) ? 1 : 0;
                pointer+=3;
                break

            case 8:
                program[arg3] = (arg1 == arg2) ? 1 : 0;
                pointer+=3;
                break

            case 99:
                return output;

        }

    }

    return output;
}


const testAdapter = (program, prevPhases, input) => {

    if (prevPhases.length == 5) {
        return input;
    }

    let outputs = [];

    for (var i=0; i<5; i++) {

        if (prevPhases.includes(i)) {
            continue;
        }

        let result = run(program, [i, input]);
        outputs.push(testAdapter(program, [...prevPhases,i], result));

    }

    return Math.max(...outputs);

}

console.log(testAdapter(input, [],0));
