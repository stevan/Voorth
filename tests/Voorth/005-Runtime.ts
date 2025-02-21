
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test005a () {
    let runtime  = new Voorth.Runtime();
    let executor = new Voorth.Executors.Executor(runtime);

    let tape = new Voorth.ExecTokens.Tape();
    tape.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(20)),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(10)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(5)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
    ]);

    executor.execute(tape);

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 35, '... got the expected result (simple)');
}

function Test005b () {
    let runtime  = new Voorth.Runtime();
    let executor = new Voorth.Executors.Executor(runtime);

    let addTen = new Voorth.ExecTokens.Tape();
    addTen.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(10)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
    ]);

    runtime.dict.bind(Voorth.Words.createUserWord('add10', addTen));

    let tape = new Voorth.ExecTokens.Tape();
    tape.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(20)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('add10')),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(5)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
    ]);

    executor.execute(tape);

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 35, '... got the expected result (calling user word)');
}

function Test005c () {
    let runtime  = new Voorth.Runtime();
    let executor = new Voorth.Executors.Executor(runtime);

    let addTen = new Voorth.ExecTokens.Tape();
    addTen.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(10)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
    ]);

    runtime.dict.bind(Voorth.Words.createUserWord('add10', addTen));

    let tape = new Voorth.ExecTokens.Tape();
    tape.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(50)),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.WordRef('add10')),
        Voorth.ExecTokens.createInvokeToken(),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(5)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
    ]);

    executor.execute(tape);

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 65, '... got the expected result (invoking ref to user word) ');
}

Test005a();
Test005b();
Test005c();
test.done();
