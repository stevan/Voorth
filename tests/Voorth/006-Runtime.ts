
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test006a () {
    let runtime = new Voorth.Runtime();

    let tape = new Voorth.ExecTokens.Tape();
    tape.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(10)),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(1)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('-')),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('DUP')),
        Voorth.ExecTokens.createMoveToken(-4, true),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Str("SURPRISE!")),
    ]);

    runtime.run(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Str = runtime.stack.pop() as Voorth.Literals.Str;
    test.is(result.value, "SURPRISE!", '... got the expected result');
}


Test006a();
test.done();
