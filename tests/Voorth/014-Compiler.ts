
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test014a () {
    let executor = new Voorth.Interpreter();
    let runtime  = executor.runtime;
    let compiler = executor.compiler;

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        : countdown
            DUP 0 DO
                DUP 1 -
            LOOP ;

        5 countdown
    `));

    executor.execute(exe);

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    // results are in reverse order ...
    let results = runtime.stack.toNative().reverse();

    let x = 0;
    while (x <= 5) {
        test.is(results.shift(), x++, '... got the expected results');
    }
}

Test014a();
test.done();
