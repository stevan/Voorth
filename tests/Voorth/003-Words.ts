
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test000 () {
    let test = new Test.Simple();

    let out : string[] = [];

    let w1 = Voorth.Words.createNativeWord('HELLO', (r : Voorth.Runtime) => {
        out.push('Hello');
    });

    let w2 = Voorth.Words.createNativeWord('WORLD', (r : Voorth.Runtime) => {
        out.push('World!');
    });

    let runtime = new Voorth.Runtime();
    let tape    = new Voorth.Words.Tape([ w1, w2 ]);

    for (const w of tape.play()) {
        w.body(runtime);
    }

    test.is(out[0], 'Hello', '... got the first output');
    test.is(out[1], 'World!', '... got the second output');

    let dict = new Voorth.Library.Dictionary();
    dict.bind(w1);
    dict.bind(w2);

    test.ok(dict.fetch('HELLO') === w1, '... fetched the right word');
    test.ok(dict.fetch('WORLD') === w2, '... fetched the right word');

    test.done();
}

Test000();
