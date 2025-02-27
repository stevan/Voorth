
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test024a () {
    let i = new Voorth.Interpreter();

    i.runtime.bindNativeWord('{}', (r : Voorth.Runtime) => {
        r.stack.push(new Voorth.Literals.JSValue(
            new Map<string, Voorth.Literals.Literal>()
        ));
    });

    i.runtime.bindNativeWord('.set', (r : Voorth.Runtime) => {
        let key   = r.stack.pop()  as Voorth.Literals.Str;
        let value = r.stack.pop()  as Voorth.Literals.Literal;
        let map   = r.stack.peek() as Voorth.Literals.JSValue;
        map.toNative().set(key.toStr(), value);
    });

    i.runtime.bindNativeWord('.get', (r : Voorth.Runtime) => {
        let key   = r.stack.pop()  as Voorth.Literals.Str;
        let map   = r.stack.peek() as Voorth.Literals.JSValue;
        let value = map.toNative().get(key.toStr()) as Voorth.Literals.Literal;
        r.stack.push(value);
    });

    i.run(`
        {}
        100 "test" .set
        "test" .get
    `);

    //console.log("STACK", i.runtime.stack.toArray());

    let [ jsVal, num ] : Voorth.Literals.Literal[] = i.runtime.stack.toArray();

    if (!jsVal || !num) throw new Error("MAP or NUM are undefined!");

    Voorth.Literals.assertNum(num);
    Voorth.Literals.assertJSValue(jsVal);

    test.is(num.value, 100, '... got the expected results');

    let map = jsVal.toNative() as Map<string, Voorth.Literals.Literal>;
    test.ok(map instanceof Map, '... this is a Map');
    test.ok(map.has('test'), '... it has the test key');
    test.is(
        (map.get('test') as Voorth.Literals.Num).value,
        num.value,
        '... it has the right value');
}

Test024a();
test.done();



