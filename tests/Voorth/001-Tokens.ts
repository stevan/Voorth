
import { Test } from '../Test';
import * as Voorth from '../../src/Voorth';

function Test001 () {
    let test = new Test.Simple();

    let source = `
        1                 // basic numbers
        -1
        10
        -10
        1234567890
        -1234567890
        1_234_567_890     // numbers w/ underscores
        -1_234_567_890
        'Hello'
        "Hello"
        'Hello world'
        "Hello world"
        'Hello "world"'
        "Hello 'world'"
        #t
        #f
        BRANCH?
        BRANCH!
        DO LOOP
        IF ELSE THEN
        BEGIN UNTIL
        BEGIN WHILE REPEAT
        :say ( s -- ) CR! SWAP ~ PRINT! ;
        [_]
        [=]
        [?_]
        [^=]
        (1,)
        <+++Hello*>>=
    `;

    let expected : string[] = [
        'NUMBER',
        'COMMENT',
        'NUMBER', 'NUMBER',
        'NUMBER', 'NUMBER',
        'NUMBER', 'NUMBER',
        'COMMENT',
        'NUMBER',

        'STRING', 'STRING',
        'STRING', 'STRING',
        'STRING', 'STRING',

        'BOOLEAN', 'BOOLEAN',
    ];

    for (const got of Voorth.Tokens.tokenize(source)) {
        let exp : string = 'WORD';
        if (expected.length) {
            exp = expected.shift() as string;
        }
        test.is(got.type as string, exp, `(${got.value.trim()}) matches (${exp}) ... got(${got.type})`);
    }

    test.done();
}

Test001();
