
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test010a () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);
    let executor = new Voorth.Executors.Executor(runtime);

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        10
    `));

    executor.execute(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.toNative(), 10, '... got the expected result (const only)');
}

function Test010b () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);
    let executor = new Voorth.Executors.Executor(runtime);

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 +
    `));

    executor.execute(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.toNative(), 11, '... got the expected result (addition)');
}

function Test010c () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);
    let executor = new Voorth.Executors.Executor(runtime);

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 + 20 +
    `));

    executor.execute(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.toNative(), 31, '... got the expected result (multiple additions)');
}

function Test010d () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);
    let executor = new Voorth.Executors.Executor(runtime);

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 + 20 &+ >R! INVOKE!
    `));

    executor.execute(tape);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.toNative(), 31, '... got the expected result (addition with INVOKE!)');
}

Test010a();
Test010b();
Test010c();
Test010d();
test.done();
