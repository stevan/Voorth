
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test010a () {
    let executor = new Voorth.Interpreter();
    let runtime  = executor.runtime;
    let compiler = executor.compiler;

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        10
    `));

    executor.execute(exe);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.toNative(), 10, '... got the expected result (const only)');
}

function Test010b () {
    let executor = new Voorth.Interpreter();
    let runtime  = executor.runtime;
    let compiler = executor.compiler;

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 +
    `));

    executor.execute(exe);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.toNative(), 11, '... got the expected result (addition)');
}

function Test010c () {
    let executor = new Voorth.Interpreter();
    let runtime  = executor.runtime;
    let compiler = executor.compiler;

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 + 20 +
    `));

    executor.execute(exe);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.toNative(), 31, '... got the expected result (multiple additions)');
}

function Test010d () {
    let executor = new Voorth.Interpreter();
    let runtime  = executor.runtime;
    let compiler = executor.compiler;

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        10 1 + 20 &+ INVOKE!
    `));

    executor.execute(exe);

    //console.log(runtime.stack)

    let result : Voorth.Literals.Num = runtime.stack.pop() as Voorth.Literals.Num;
    test.is(result.toNative(), 31, '... got the expected result (addition with INVOKE!)');
}

Test010a();
Test010b();
Test010c();
Test010d();
test.done();
