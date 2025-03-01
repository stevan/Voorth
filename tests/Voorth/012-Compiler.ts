
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test012a () {
    let executor = new Voorth.Interpreter();
    let runtime  = executor.runtime;
    let compiler = executor.compiler;

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        : greet 12 < IF "Good Morning" ELSE "Good Day" THEN ;

        14 greet
        10 greet
    `));

    executor.execute(runtime.link(exe));

    //let greet = runtime.dict.lookup(new Voorth.Literals.WordRef('greet')) as Voorth.Words.UserWord;
    //for (const xt of greet.body.play()) {
    //    console.log(xt);
    //}

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    // results are in reverse order ...

    let result1 : Voorth.Literals.Str = runtime.stack.pop() as Voorth.Literals.Str;
    test.is(result1.toNative(), "Good Morning", '... got the expected result (const)');

    let result2 : Voorth.Literals.Str = runtime.stack.pop() as Voorth.Literals.Str;
    test.is(result2.toNative(), "Good Day", '... got the expected result (const)');
}

Test012a();
test.done();
