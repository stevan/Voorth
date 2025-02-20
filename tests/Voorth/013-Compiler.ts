
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test012a () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        : countdown
            BEGIN
                DUP 1 - DUP 0 ==
            UNTIL DROP
        ;

        5 countdown
    `));

    runtime.run(tape);

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    // results are in reverse order ...
    let results = runtime.stack.toNative().reverse();

    let x = 0;
    while (++x <= 5) {
        test.is(results.shift(), x, '... got the expected results');
    }
}

function Test012b () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);

    let tape = compiler.compile(Voorth.Tokens.tokenize(`
        : countup
            BEGIN
            DUP
            0 != WHILE
                DUP 1 -
            REPEAT
        ;

        5 countup
    `));

    runtime.run(tape);

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    // results are in reverse order ...
    let results = runtime.stack.toNative();

    let x = 6;
    while (x-- > 0) {
        test.is(results.shift(), x, '... got the expected results');
    }
}

Test012a();
Test012b();
test.done();

