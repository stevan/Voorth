
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test020a () {
    let i = new Voorth.Interpreter();

    i.run(`
        : EGGSIZE // ( n -- )
               DUP 18 < IF  "reject"      ELSE
               DUP 21 < IF  "small"       ELSE
               DUP 24 < IF  "medium"      ELSE
               DUP 27 < IF  "large"       ELSE
               DUP 30 < IF  "extra large" ELSE
                  "error"
               THEN THEN THEN THEN THEN SWAP DROP ;
        10  EGGSIZE
        19  EGGSIZE
        22  EGGSIZE
        25  EGGSIZE
        29  EGGSIZE
        31  EGGSIZE
    `);

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    // results are in reverse order ...
    let got      = i.runtime.stack.toNative().reverse();
    let expected = [ 'error', 'extra large', 'large', 'medium', 'small', 'reject' ];

    test.is(got.join(','), expected.join(','), '... got the expected results');
}

Test020a();
test.done();
