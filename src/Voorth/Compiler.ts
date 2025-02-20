
import { Tokens }  from './Tokens';
import { Literals }  from './Literals';
import { Runtime } from './Runtime';
import { Library } from './Library';
import { Words }   from './Words';

export class Compiler {
//
//    *compile (tokens : Tokens.Stream) : Words.CompiledStream {
//        this.compileControlStructures(
//        this.compileWordDefinitions(
//        this.dropComments(
//            tokens
//        )));
//    }
//
//    compileWord (tokens : Tokens.Stream) : void {}
//
//    private loadTape (tokens : Tokens.Stream) : Words.Tape {
//        let tape = new Words.Tape();
//        tape.load(this.compileStream(tokens));
//        return tape;
//    }
//
//    private compileStream (tokens : Tokens.Stream) : Words.CompiledStream {
//        for (const token of tokens) {
//
//        }
//    }
//
//    // -------------------------------------------------------------------------
//
//    private *dropComments (tokens : Tokens.Stream) : Tokens.Stream {
//        for (const token of tokens) {
//            if (!Tokens.isCommentToken(token)) {
//                yield token;
//            }
//        }
//    }
//
//    private *compileWordDefinitions (tokens : Tokens.Stream) : Tokens.Stream {
//        for (const token of tokens) {
//            if (Tokens.isWordToken(token)) {
//                if (token.value == ':') {
//                    this.compileWord(tokens);
//                    continue;
//                }
//            }
//            yield token;
//        }
//    }
//
//    private *compileControlStructures (tokens : Tokens.Stream) : Tokens.Stream {
//        let index : number = 0;
//        for (const t of tokens) {
//            index++;
//            yield t;
//            /*
//            if (Tokens.isWordToken(t)) {
//                // -------------------------------------------------------------
//                // Conditionals
//                // -------------------------------------------------------------
//                if (t.value == 'IF') {
//                    let addr = Tokens.createJumpToken( index += 1, true );
//                    addrs.push(addr)
//                    yield addr;
//                }
//                else if (t.value == 'ELSE') {
//                    let addr = addrs.pop() as Tokens.Token;
//                    Tokens.assertJumpToken(addr);
//                    index += 1
//                    addr.value = index - addr.value;
//
//                    let next_addr = Tokens.createJumpToken( index, false );
//                    addrs.push(next_addr)
//                    yield next_addr;
//                }
//                else if (t.value == 'THEN') {
//                    let addr = addrs.pop() as Tokens.Token;
//                    Tokens.assertJumpToken(addr);
//                    addr.value = index - addr.value;
//                    continue;
//                }
//                // -------------------------------------------------------------
//                // BEGIN UNTIL
//                // -------------------------------------------------------------
//                else if (t.value == 'BEGIN') {
//                    let addr = Tokens.createJumpToken( index, true );
//                    addrs.push(addr);
//                    continue;
//                }
//                else if (t.value == 'UNTIL') {
//                    let addr = addrs.pop() as Tokens.Token;
//                    Tokens.assertJumpToken(addr);
//                    index += 1;
//                    addr.value = addr.value - index;
//                    yield addr;
//                }
//                else if (t.value == 'WHILE') {
//                    let addr = Tokens.createJumpToken( index, true );
//                    addrs.push(addr);
//                    index += 1;
//                    yield addr;
//                }
//                else if (t.value == 'REPEAT') {
//                    index += 1;
//
//                    let while_addr = addrs.pop() as Tokens.Token;
//                    Tokens.assertJumpToken(while_addr);
//
//                    let repeat_addr = addrs.pop() as Tokens.Token;
//                    Tokens.assertJumpToken(repeat_addr);
//
//                    repeat_addr.value = repeat_addr.value - index;
//                    repeat_addr.isConditional = false;
//
//                    while_addr.value = index - repeat_addr.value;
//
//                    yield repeat_addr;
//                }
//                // -------------------------------------------------------------
//                // DO LOOP
//                // -------------------------------------------------------------
//                else if (t.value == 'DO') {
//                    let addr = Tokens.createJumpToken( index += 2, true );
//                    addrs.push(addr);
//                    index += 3;
//                    yield Tokens.createWordToken("SWAP");
//                    yield Tokens.createWordToken(">R");
//                    yield Tokens.createNumToken(1);       // loop returns here
//                    yield Tokens.createWordToken("+");
//                    yield Tokens.createWordToken(">R");
//                }
//                else if (t.value == 'LOOP') {
//                    let addr = addrs.pop() as Tokens.Token;
//                    Tokens.assertJumpToken(addr);
//                    index += 5;
//                    addr.value = addr.value - index;
//                    index += 2;
//                    yield Tokens.createWordToken("<R");
//                    yield Tokens.createWordToken("DUP");
//                    yield Tokens.createWordToken("@R");
//                    yield Tokens.createWordToken(">=");
//                    yield addr;
//                    yield Tokens.createWordToken("DROP");
//                    yield Tokens.createWordToken("^R");
//                }
//                else {
//                    index++;
//                    yield t;
//                }
//
//            }
//            else {
//                index++;
//                yield t;
//            }
//            */
//        }
//    }

}
