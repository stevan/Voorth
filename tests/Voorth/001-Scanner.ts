
import * as Voorth from '../../src/Voorth'

function ScannerTest001 () {

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

    const toTest = [
        Voorth.Scanner.isNumber, Voorth.Scanner.isComment, Voorth.Scanner.isNumber,
        Voorth.Scanner.isNumber, Voorth.Scanner.isNumber, Voorth.Scanner.isNumber,
        Voorth.Scanner.isNumber, Voorth.Scanner.isNumber, Voorth.Scanner.isComment,
        Voorth.Scanner.isNumber,

        Voorth.Scanner.isString, Voorth.Scanner.isString, Voorth.Scanner.isString,
        Voorth.Scanner.isString, Voorth.Scanner.isString, Voorth.Scanner.isString,

        Voorth.Scanner.isBoolean, Voorth.Scanner.isBoolean,

        Voorth.Scanner.isPlatform, Voorth.Scanner.isPlatform,

        Voorth.Scanner.isControl, Voorth.Scanner.isControl,
        Voorth.Scanner.isControl, Voorth.Scanner.isControl, Voorth.Scanner.isControl,
        Voorth.Scanner.isControl, Voorth.Scanner.isControl,
        Voorth.Scanner.isControl, Voorth.Scanner.isControl, Voorth.Scanner.isControl,
    ];

    let t = 0;
    let f = 0;
    for (const str of Voorth.Scanner.scan(source)) {
        let test : (s : string) => boolean = Voorth.Scanner.isWord;
        if (toTest.length) {
            test = toTest.shift() as (s : string) => boolean;
        }
        t++;
        if (test(str)) {
            console.log(`ok ${t} - (${str.trim()}) matches (${test.name})`);
        }
        else {
            f++;
            console.log(`not ok ${t} - (${str.trim()}) does not match (${test.name})`);
        }
    }

    console.log(`1..${t}`);
    if (f > 0) console.log(`# Looks like you failed ${f} test of ${t}`);
}

ScannerTest001();
