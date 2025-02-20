
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test005 () {
    let test = new Test.Simple();

    let runtime = new Voorth.Runtime();
    let tape    = new Voorth.ExecTokens.Tape();
    tape.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(10)),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(20)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(5)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
    ]);

    runtime.run(tape);

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 35, '... got the expected result');

    test.done();
}

Test005();
