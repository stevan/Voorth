
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test020a () {
    let i = new Voorth.Interpreter();

    i.run(`
        : countdown
            DUP 0 DO
                DUP 1 -
            LOOP ;

        5 countdown
    `);

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    // results are in reverse order ...
    let results = i.runtime.stack.toNative().reverse();

    let x = 0;
    while (x <= 5) {
        test.is(results.shift(), x++, '... got the expected results');
    }
}

Test020a();
test.done();
