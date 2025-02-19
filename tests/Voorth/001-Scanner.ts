
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

    let expected : Voorth.Scanner.ScanType[] = [
        Voorth.Scanner.ScanType.NUMBER,
        Voorth.Scanner.ScanType.COMMENT,
        Voorth.Scanner.ScanType.NUMBER, Voorth.Scanner.ScanType.NUMBER,
        Voorth.Scanner.ScanType.NUMBER, Voorth.Scanner.ScanType.NUMBER,
        Voorth.Scanner.ScanType.NUMBER, Voorth.Scanner.ScanType.NUMBER,
        Voorth.Scanner.ScanType.COMMENT,
        Voorth.Scanner.ScanType.NUMBER,

        Voorth.Scanner.ScanType.STRING, Voorth.Scanner.ScanType.STRING,
        Voorth.Scanner.ScanType.STRING, Voorth.Scanner.ScanType.STRING,
        Voorth.Scanner.ScanType.STRING, Voorth.Scanner.ScanType.STRING,

        Voorth.Scanner.ScanType.BOOLEAN, Voorth.Scanner.ScanType.BOOLEAN,
    ];

    let t = 0;
    let f = 0;
    for (const got of Voorth.Scanner.scan(source)) {
        let exp : Voorth.Scanner.ScanType = Voorth.Scanner.ScanType.WORD;
        if (expected.length) {
            exp = expected.shift() as Voorth.Scanner.ScanType;
        }
        t++;
        if (got.type == exp) {
            console.log(`ok ${t} - (${got.value.trim()}) matches expected(${exp})`);
        }
        else {
            f++;
            console.log(`not ok ${t} - (${got.value.trim()}) does not match expected(${exp}) got(${got.type})`);
        }
    }

    console.log(`1..${t}`);
    if (f > 0) console.log(`# Looks like you failed ${f} test of ${t}`);
}

ScannerTest001();
