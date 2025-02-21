
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test014a () {
    let runtime  = new Voorth.Runtime();
    let compiler = new Voorth.Compiler(runtime);
    let executor = new Voorth.Executors.Executor(runtime);

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        : countdown
            DUP 0 DO
                DUP 1 -
            LOOP ;

        5 countdown
    `));

    executor.execute(new Voorth.Tape(exe));

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
