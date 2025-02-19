
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test000 () {
    let test = new Test.Simple();

    test.ok(true, '... somthing works!');

    test.done();
}

Test000();
