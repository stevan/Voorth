
import { Test } from '../Test';
import * as Voorth from '../../src/Voorth';

function TokensTest001 () {
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

    let expected : Voorth.Tokens.Type[] = [
        Voorth.Tokens.Type.NUMBER,
        Voorth.Tokens.Type.COMMENT,
        Voorth.Tokens.Type.NUMBER, Voorth.Tokens.Type.NUMBER,
        Voorth.Tokens.Type.NUMBER, Voorth.Tokens.Type.NUMBER,
        Voorth.Tokens.Type.NUMBER, Voorth.Tokens.Type.NUMBER,
        Voorth.Tokens.Type.COMMENT,
        Voorth.Tokens.Type.NUMBER,

        Voorth.Tokens.Type.STRING, Voorth.Tokens.Type.STRING,
        Voorth.Tokens.Type.STRING, Voorth.Tokens.Type.STRING,
        Voorth.Tokens.Type.STRING, Voorth.Tokens.Type.STRING,

        Voorth.Tokens.Type.BOOLEAN, Voorth.Tokens.Type.BOOLEAN,
    ];

    for (const got of Voorth.Tokens.tokenize(source)) {
        let exp : Voorth.Tokens.Type = Voorth.Tokens.Type.WORD;
        if (expected.length) {
            exp = expected.shift() as Voorth.Tokens.Type;
        }
        test.is(got.type, exp, `(${got.value.trim()}) matches (${exp}) ... got(${got.type})`);
    }

    test.done();
}

TokensTest001();
