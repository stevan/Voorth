
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test021a () {
    let i = new Voorth.Interpreter();

    i.run(`
        : /reduce
            0 DO
                ROT SWAP RDUP INVOKE!
            LOOP
            SWAP DROP
        ;

        4 3 2 1
        &+ 0 4 /reduce
    `);

    //console.log(runtime.dict);
    //console.log("END", i.runtime.stack);

    // results are in reverse order ...
    let got      = i.runtime.stack.toNative().at(0);
    let expected = 10;

    test.is(got, expected, '... got the expected results');
}

Test021a();
test.done();



