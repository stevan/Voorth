
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

function Test031a () {
    let test = new Test.Simple();

    let t   = new Voorth.Tether();
    let i   = new Voorth.Interpreter();
    let vm  = new Voorth.VM.ProcessingUnit(t);

    vm.ready().then((vm) => {
        console.log("   STACK: ", vm.stack);
        console.log(" CONTROL: ", vm.control);

        test.is(
            vm.stack.join(','),
            [
                5,4,3,2,1,0,
                5,4,3,2,1,0,
                5,4,3,2,1,0,
                'reject','small','medium',
                'large','extra large','error',
                10,
                '<html>',
                    '<body>',
                        '<h1>','Hello World','</h1>',
                    '</body>',
                '</html>',
            ].join(','),
            '... got the expected output'
        );

        test.done();
    });

    i.run(`
        :: HTML
            : <html>   "<html>"  ; : </html>  "</html>"  ;
            : <body>   "<body>"  ; : </body>  "</body>"  ;

            : <h1> "<h1>" ; : </h1> "</h1>" ;
            : <h1/> <h1> SWAP </h1> ;
        ;;

        : /reduce
            0 DO
                ROT SWAP RDUP INVOKE!
            LOOP
            SWAP DROP
        ;

        : EGGSIZE
           DUP 18 < IF  "reject"      ELSE
           DUP 21 < IF  "small"       ELSE
           DUP 24 < IF  "medium"      ELSE
           DUP 27 < IF  "large"       ELSE
           DUP 30 < IF  "extra large" ELSE
              "error"
           THEN THEN THEN THEN THEN SWAP DROP ;

        : countdown1
            BEGIN
                DUP 1 - DUP 0 <
            UNTIL DROP
        ;

        : countdown2
            BEGIN
            DUP
            0 != WHILE
                DUP 1 -
            REPEAT
        ;

        : countdown3
            DUP 0 DO
                DUP 1 -
            LOOP
        ;
    `);

    t.load(i.compile(`
        5 countdown1
        5 countdown2
        5 countdown3

        10  EGGSIZE
        19  EGGSIZE
        22  EGGSIZE
        25  EGGSIZE
        29  EGGSIZE
        31  EGGSIZE

        4 3 2 1
        &+ 0 4 /reduce

        <html>
            <body>
                "Hello World" <h1/>
            </body>
        </html>
    `));

}

Test031a();
