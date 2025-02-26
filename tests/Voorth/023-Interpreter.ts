
import { Test } from '../Test';

import * as Voorth from '../../src/Voorth'

const test = new Test.Simple();

function Test023a () {
    let i = new Voorth.Interpreter();

    i.run(`
        :: HTML
            : <html>   "<html>"  ; : </html>  "</html>"  ;
            : <head>   "<head>"  ; : </head>  "</head>"  ;
            : <body>   "<body>"  ; : </body>  "</body>"  ;

            : <title>  "<title>" ; : </title> "</title>" ;
            : <title/> <title> SWAP </title> ;

            : <h1> "<h1>" ; : </h1> "</h1>" ;
            : <h1/> <h1> SWAP </h1> ;

            : <ul> "<ul>" ; : </ul> "</ul>" ;
            : <li> "<li>" ; : </li> "</li>" ;
            : <li/> <li> SWAP </li> ;
        ;;

        <html>
           <head>
               "Hello World" <title/>
           </head>
           <body>
               "Hello HTML!" <h1/>
                <ul>
                    4 0 DO .R! <li/> LOOP
                   </ul>
           </body>
        </html>
    `);

    let got = i.runtime.stack.toNative();
    //console.log(got);
    test.is(
        got.join(''),
        '<html><head><title>Hello World</title></head><body><h1>Hello HTML!</h1><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></body></html>',
    '... got the expected results');
}

Test023a();
test.done();


