
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test030 () {
    let test = new Test.Simple();

    let i  = new Voorth.Interpreter();
    let vm = new Voorth.VM.ProcessingUnit(i.tether);

    vm.run().then((vm) => {
        console.log("   STACK: ", vm.stack);
        console.log(" CONTROL: ", vm.control);
    }).then(() => {
        test.is(
            vm.stack.join(','),
            'hey,hey,hey,ho,ho,ho,31',
            '... got the expected output'
        );
    }).then(() => {
        test.done();
    });

    console.log("compile locally")
    i.run(': dup3 2 0 DO DUP LOOP ;');
    console.log("send code to run")
    i.send('"hey" dup3');
    console.log("send code to run (again)")
    i.send(`
        "ho" dup3

        10 1 + 20 &+ INVOKE!
    `);
    console.log("all done here ...")
}

Test030();
