
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test004 () {
    let test = new Test.Simple();

    let tape = new Voorth.ExecTokens.Tape();
    tape.load([
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(10)),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(20)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
        Voorth.ExecTokens.createConstToken(new Voorth.Literals.Num(5)),
        Voorth.ExecTokens.createCallToken(new Voorth.Literals.WordRef('+')),
    ]);

    let p = tape.play();

    test.ok(Voorth.ExecTokens.isConstToken(p.next().value as Voorth.ExecTokens.ExecToken), '... got the expected token');
    test.ok(Voorth.ExecTokens.isConstToken(p.next().value as Voorth.ExecTokens.ExecToken), '... got the expected token');
    test.ok( Voorth.ExecTokens.isCallToken(p.next().value as Voorth.ExecTokens.ExecToken), '... got the expected token');
    test.ok(Voorth.ExecTokens.isConstToken(p.next().value as Voorth.ExecTokens.ExecToken), '... got the expected token');
    test.ok( Voorth.ExecTokens.isCallToken(p.next().value as Voorth.ExecTokens.ExecToken), '... got the expected token');

    test.done();
}

Test004();
