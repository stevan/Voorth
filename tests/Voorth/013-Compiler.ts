
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test013a () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);
    let executor = new Voorth.Executors.Executor(runtime);

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        : countdown
            BEGIN
                DUP 1 - DUP 0 ==
            UNTIL DROP
        ;

        5 countdown
    `));

    executor.execute(new Voorth.Tape(exe));

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    // results are in reverse order ...
    let results = runtime.stack.toNative().reverse();

    let x = 0;
    while (++x <= 5) {
        test.is(results.shift(), x, '... got the expected results');
    }
}

function Test013b () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);
    let executor = new Voorth.Executors.Executor(runtime);

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        : countup
            BEGIN
            DUP
            0 != WHILE
                DUP 1 -
            REPEAT
        ;

        5 countup
    `));

    executor.execute(new Voorth.Tape(exe));

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    // results are in reverse order ...
    let results = runtime.stack.toNative();

    let x = 6;
    while (x-- > 0) {
        test.is(results.shift(), x, '... got the expected results');
    }
}

Test013a();
Test013b();
test.done();

