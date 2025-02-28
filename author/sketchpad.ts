
type InstructionStream = Generator<string, void, void>;

function *MakeInstructionStream () : InstructionStream {
    yield '1';
    yield 'DUP';
    yield 'WAIT!';
    yield '+';
}

export type ControlRequestOp =
    | 'READY?'
    | 'WAIT?'
    | 'HALT?'
;

export type ControlResponseOp =
    | 'STARTED!'
    | 'READY!'
    | 'WAIT!'
    | 'HALT!'
;

type ControlStream = Generator<ControlRequestOp, void, ControlResponseOp>;

function *MakeControlStream (stream : InstructionStream) : ControlStream {
    let running = true;
    let instr : ControlRequestOp = 'READY?';
    while (running) {
        console.log(`Control sending ${instr}`);
        let resp : ControlResponseOp = yield instr;
        console.log(`Control sent ${instr} got ${resp}`);
        switch (resp) {
        case 'READY!':
            instr = execute(stream);
            break;
        case 'HALT!':
            running = false;
            break;
        default:
            throw new Error(`Unknown resp ${resp}`);
        }
    }
}

function execute (stream : InstructionStream) : ControlRequestOp {
    let next = stream.next();
    while(!next.done) {
        let instr = next.value;
        console.log('GOT :', instr);
        if (instr == 'WAIT!') {
            return 'WAIT?' as ControlRequestOp;
        }
        next = stream.next();
    }
    return 'HALT?' as ControlRequestOp;
}

function run () : void {
    let stream  = MakeInstructionStream();
    let control = MakeControlStream(stream);

    let instr : ControlResponseOp = 'STARTED!';

    let next = control.next(instr);
    while (!next.done) {
        let request : ControlRequestOp = next.value;
        console.log(`Run got ${request} back`);
        switch (request) {
        case 'READY?':
            instr = 'READY!';
            break;
        case 'WAIT?':
            instr = 'READY!';
            break;
        case 'HALT?':
            instr = 'HALT!';
            break;
        default:
            throw new Error(`Unknown request ${request}`);
        }
        console.log(`Run sending ${instr}`);
        next = control.next(instr);
        console.log(`Run sending ${instr} got ${next.value}`);
    }
}

run();
