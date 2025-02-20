
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test010a () {
    let compiler = new Voorth.Compiler();
    let runtime  = new Voorth.Runtime();

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        10
    `));

    runtime.run(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 10, '... got the expected result (const only)');
}

function Test010b () {
    let compiler = new Voorth.Compiler();
    let runtime  = new Voorth.Runtime();

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 +
    `));

    runtime.run(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 11, '... got the expected result (addition)');
}

function Test010c () {
    let compiler = new Voorth.Compiler();
    let runtime  = new Voorth.Runtime();

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 + 20 +
    `));

    runtime.run(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 31, '... got the expected result (multiple additions)');
}

function Test010d () {
    let compiler = new Voorth.Compiler();
    let runtime  = new Voorth.Runtime();

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 + 20 &+ INVOKE!
    `));

    runtime.run(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.value, 31, '... got the expected result (addition with INVOKE!)');
}

Test010a();
Test010b();
Test010c();
Test010d();
test.done();
