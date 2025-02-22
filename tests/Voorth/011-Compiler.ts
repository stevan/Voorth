
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test011a () {
    let executor = new Voorth.Interpreter();
    let runtime  = executor.runtime;
    let compiler = executor.compiler;

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        : greet "Hello World" ;

        greet
    `));

    executor.execute(new Voorth.Tapes.CompiledTape(exe));

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    let result : Voorth.Literals.Str = runtime.stack.pop() as Voorth.Literals.Str;
    test.is(result.toNative(), "Hello World", '... got the expected result (const)');
}

function Test011b () {
    let executor = new Voorth.Interpreter();
    let runtime  = executor.runtime;
    let compiler = executor.compiler;

    let exe = compiler.compile(Voorth.Tokens.tokenize(`
        : greet "Hello " SWAP ~ ;

        "World" greet
    `));

    executor.execute(new Voorth.Tapes.CompiledTape(exe));

    //console.log(runtime.dict);
    //console.log(runtime.stack);

    let result : Voorth.Literals.Str = runtime.stack.pop() as Voorth.Literals.Str;
    test.is(result.toNative(), 'Hello World', '... got the expected result (const)');
}


Test011a();
Test011b();
test.done();
