
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test003 () {
    let test = new Test.Simple();

    let out : string[] = [];

    let w1 = Voorth.Words.createNativeWord('HELLO', (r : Voorth.Runtime) => {
        out.push('Hello');
    });

    let w2 = Voorth.Words.createNativeWord('WORLD', (r : Voorth.Runtime) => {
        out.push('World!');
    });

    let runtime = new Voorth.Runtime();
    w1.body(runtime);
    w2.body(runtime);

    test.is(out[0], 'Hello', '... got the first output');
    test.is(out[1], 'World!', '... got the second output');

    let dict = new Voorth.Library.RuntimeDict();
    dict.bind(w1);
    dict.bind(w2);

    test.ok(dict.lookup(new Voorth.Literals.WordRef('HELLO')) === w1, '... fetched the right word');
    test.ok(dict.lookup(new Voorth.Literals.WordRef('WORLD')) === w2, '... fetched the right word');

    test.done();
}

Test003();
