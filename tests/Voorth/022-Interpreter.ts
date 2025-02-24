
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test022a () {
    let i = new Voorth.Interpreter();

    i.run(`

        : in_main_1 "in main 1" ;

        // ----------------------------------------
        :: Foo
        // ----------------------------------------

            : in_foo_1 "in foo 1" ;

            // ----------------------------------------
            :: Bar
            // ----------------------------------------

                : in_foobar "in FooBar!" ;

            ;;

            : in_foo_2 "in foo 2" ;

        ;;

        : in_main_2 "in main 2" ;

    `);

    let library = i.runtime.library;

    test.ok(library.lookup(new Voorth.Literals.WordRef('in_main_1')), '... got the expected results');
    test.ok(library.lookup(new Voorth.Literals.WordRef('in_main_2')), '... got the expected results');
    test.ok(library.lookup(new Voorth.Literals.WordRef('in_foo_1')), '... got the expected results');
    test.ok(library.lookup(new Voorth.Literals.WordRef('in_foo_2')), '... got the expected results');
    test.ok(library.lookup(new Voorth.Literals.WordRef('in_foobar')), '... got the expected results');

    test.ok(!library.lookup(new Voorth.Literals.WordRef('in_foobaz')), '... got the expected results');

    let scratch = library.shelf.get('_');
    if (scratch) {
        test.ok(scratch, '... we found the scratch namespace');
        test.ok(scratch.lookup(new Voorth.Literals.WordRef('in_main_1')), '... we found the word');
        test.ok(scratch.lookup(new Voorth.Literals.WordRef('in_main_2')), '... we found the word');
        test.ok(!scratch.lookup(new Voorth.Literals.WordRef('in_foo_1')), '... we did not find the word');
        test.ok(!scratch.lookup(new Voorth.Literals.WordRef('in_foo_2')), '... we did not find the word');
        test.ok(!scratch.lookup(new Voorth.Literals.WordRef('in_foobar')), '... we did not find the word');
    }
    else {
        test.fail('... could not find the scatch namespace');
    }

    let Foo = library.shelf.get('Foo');
    if (Foo) {
        test.ok(Foo, '... we found the Foo namespace');
        test.ok(!Foo.lookup(new Voorth.Literals.WordRef('in_main_1')), '... we found the word');
        test.ok(!Foo.lookup(new Voorth.Literals.WordRef('in_main_2')), '... we found the word');
        test.ok(Foo.lookup(new Voorth.Literals.WordRef('in_foo_1')), '... we did not find the word');
        test.ok(Foo.lookup(new Voorth.Literals.WordRef('in_foo_2')), '... we did not find the word');
        test.ok(!Foo.lookup(new Voorth.Literals.WordRef('in_foobar')), '... we did not find the word');
    }
    else {
        test.fail('... could not find the Foo namespace');
    }

    let Bar = library.shelf.get('Bar');
    if (Bar) {
        test.ok(Bar, '... we found the Bar namespace');
        test.ok(!Bar.lookup(new Voorth.Literals.WordRef('in_main_1')), '... we found the word');
        test.ok(!Bar.lookup(new Voorth.Literals.WordRef('in_main_2')), '... we found the word');
        test.ok(!Bar.lookup(new Voorth.Literals.WordRef('in_foo_1')), '... we did not find the word');
        test.ok(!Bar.lookup(new Voorth.Literals.WordRef('in_foo_2')), '... we did not find the word');
        test.ok(Bar.lookup(new Voorth.Literals.WordRef('in_foobar')), '... we did not find the word');
    }
    else {
        test.fail('... could not find the Bar namespace');
    }
}

Test022a();
test.done();
