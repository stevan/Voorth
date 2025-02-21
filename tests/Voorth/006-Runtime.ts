
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test006a () {
    let runtime  = new Voorth.Runtime();
    let executor = new Voorth.Executors.Executor(runtime);

    let tape = new Voorth.Tape();
    tape.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(10)),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(1)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('-')),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('DUP')),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(0)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('<=')),
        Voorth.ExecTokens.createMoveToken(Voorth.Tokens.createJumpToken(-6, true)),
    ]);

    executor.execute(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 0, '... got the expected result');
}


Test006a();
test.done();
