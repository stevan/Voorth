
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test002 () {
    let test = new Test.Simple();

    let coll = new Voorth.Library.Catalog();
    let d   = coll.createVolume("Foo");

    let foo = Voorth.Words.createNativeWord('foo', (r) => {});
    d.bind(foo);

    let bar = Voorth.Words.createNativeWord('bar', (r) => {});
    d.bind(bar);

    test.ok(d.lookup(new Voorth.Literals.WordRef('foo')) != undefined, '... we have the foo entry');
    test.ok(d.lookup(new Voorth.Literals.WordRef('bar')) != undefined, '... we have the bar entry');
    test.ok(d.lookup(new Voorth.Literals.WordRef('baz')) == undefined, '... we do not have the baz entry');

    test.ok(d.lookup(new Voorth.Literals.WordRef('foo')) === foo, '... we have the expected foo entry');
    test.ok(d.lookup(new Voorth.Literals.WordRef('bar')) === bar, '... we have the expected bar entry');

    test.done();
}

Test002();
