
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test030 () {
    let test = new Test.Simple();

    let i  = new Voorth.Interpreter();
    let vm = new Voorth.VM.ProcessingUnit(i.tether);

    i.send(`
        : dup3 2 0 DO DUP LOOP ;

        "hey" dup3
    `);

    i.send(`
        "ho" dup3

        10 1 + 20 &+ INVOKE!
    `);

    vm.run();

    console.log("   STACK: ", vm.stack);
    console.log(" CONTROL: ", vm.control);

    test.is(
        vm.stack.join(','),
        'hey,hey,hey,ho,ho,ho,31',
        '... got the expected output'
    );

    test.done();
}

Test030();
