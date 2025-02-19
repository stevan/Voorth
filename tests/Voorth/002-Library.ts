
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function DictionaryTest002 () {
    let test = new Test.Simple();

    let d = new Voorth.Library.Dictionary();

    let foo = Voorth.Words.createNativeWord('foo', (r) => {});
    d.bind(foo);

    let bar = Voorth.Words.createNativeWord('bar', (r) => {});
    d.bind(bar);

    test.ok(d.contains('foo'), '... we have the foo entry');
    test.ok(d.contains('bar'), '... we have the bar entry');

    test.ok(d.fetch('foo') === foo, '... we have the expected foo entry');
    test.ok(d.fetch('bar') === bar, '... we have the expected bar entry');

    test.done();
}

DictionaryTest002();
