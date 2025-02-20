
import { Tokens }     from './Tokens';
import { Literals }   from './Literals';
import { ExecTokens } from './ExecTokens';
import { Runtime }    from './Runtime';
import { Library }    from './Library';
import { Words }      from './Words';

export class Compiler {

    compile (tokens : Tokens.TokenStream) : ExecTokens.Tape {
        return this.loadTape(
            this.compileControlStructures(
                this.compileWordDefinitions(
                    tokens
                )
            )
        );
    }

    compileWord (tokens : Tokens.TokenStream) : void {}

    private loadTape (tokens : Tokens.TokenStream) : ExecTokens.Tape {
        let tape = new ExecTokens.Tape();
        tape.loadStream(this.compileStream(tokens));
        return tape;
    }

    private *compileStream (tokens : Tokens.TokenStream) : ExecTokens.ExecStream {
        for (const token of tokens) {
            if (Tokens.isLiteralToken(token)) {
                switch (true) {
                case Tokens.isNumberToken(token):
                    yield ExecTokens.createConstToken(new Literals.Num(parseInt(token.value)))
                    break;
                case Tokens.isStringToken(token):
                    yield ExecTokens.createConstToken(new Literals.Str(token.value))
                    break;
                case Tokens.isBooleanToken(token):
                    yield ExecTokens.createConstToken(new Literals.Bool(token.value == '#t'))
                    break;
                default:
                    throw new Error(`Unrecognized (Const) token (${JSON.stringify(token)})`)
                }
            }
            else if (Tokens.isWordToken(token)) {
                let name = token.value;
                switch (true) {
                case /^\&/.test(name):
                    yield ExecTokens.createConstToken(new Literals.WordRef(name.slice(1)))
                    break;
                case (name == "INVOKE!"):
                    yield ExecTokens.createInvokeToken()
                    break;
                case /^BRANCH[!?]$/.test(name):
                    console.log("TODO");
                    break;
                default:
                    yield ExecTokens.createCallToken(new Literals.WordRef(name))
                }
            }
            else {
                throw new Error(`Unrecognized (??) token (${JSON.stringify(token)})`);
            }
        }
    }

    // -------------------------------------------------------------------------

    private *compileWordDefinitions (tokens : Tokens.TokenStream) : Tokens.TokenStream {
        for (const token of tokens) {
            if (Tokens.isWordToken(token)) {
                if (token.value == ':') {
                    this.compileWord(tokens);
                    continue;
                }
            }
            yield token;
        }
    }

    private *compileControlStructures (tokens : Tokens.TokenStream) : Tokens.TokenStream {
        let index : number = 0;
        for (const t of tokens) {
            index++;
            yield t;
            /*
            if (Tokens.isWordToken(t)) {
                // -------------------------------------------------------------
                // Conditionals
                // -------------------------------------------------------------
                if (t.value == 'IF') {
                    let addr = Tokens.createJumpToken( index += 1, true );
                    addrs.push(addr)
                    yield addr;
                }
                else if (t.value == 'ELSE') {
                    let addr = addrs.pop() as Tokens.Token;
                    Tokens.assertJumpToken(addr);
                    index += 1
                    addr.value = index - addr.value;

                    let next_addr = Tokens.createJumpToken( index, false );
                    addrs.push(next_addr)
                    yield next_addr;
                }
                else if (t.value == 'THEN') {
                    let addr = addrs.pop() as Tokens.Token;
                    Tokens.assertJumpToken(addr);
                    addr.value = index - addr.value;
                    continue;
                }
                // -------------------------------------------------------------
                // BEGIN UNTIL
                // -------------------------------------------------------------
                else if (t.value == 'BEGIN') {
                    let addr = Tokens.createJumpToken( index, true );
                    addrs.push(addr);
                    continue;
                }
                else if (t.value == 'UNTIL') {
                    let addr = addrs.pop() as Tokens.Token;
                    Tokens.assertJumpToken(addr);
                    index += 1;
                    addr.value = addr.value - index;
                    yield addr;
                }
                else if (t.value == 'WHILE') {
                    let addr = Tokens.createJumpToken( index, true );
                    addrs.push(addr);
                    index += 1;
                    yield addr;
                }
                else if (t.value == 'REPEAT') {
                    index += 1;

                    let while_addr = addrs.pop() as Tokens.Token;
                    Tokens.assertJumpToken(while_addr);

                    let repeat_addr = addrs.pop() as Tokens.Token;
                    Tokens.assertJumpToken(repeat_addr);

                    repeat_addr.value = repeat_addr.value - index;
                    repeat_addr.isConditional = false;

                    while_addr.value = index - repeat_addr.value;

                    yield repeat_addr;
                }
                // -------------------------------------------------------------
                // DO LOOP
                // -------------------------------------------------------------
                else if (t.value == 'DO') {
                    let addr = Tokens.createJumpToken( index += 2, true );
                    addrs.push(addr);
                    index += 3;
                    yield Tokens.createWordToken("SWAP");
                    yield Tokens.createWordToken(">R");
                    yield Tokens.createNumToken(1);       // loop returns here
                    yield Tokens.createWordToken("+");
                    yield Tokens.createWordToken(">R");
                }
                else if (t.value == 'LOOP') {
                    let addr = addrs.pop() as Tokens.Token;
                    Tokens.assertJumpToken(addr);
                    index += 5;
                    addr.value = addr.value - index;
                    index += 2;
                    yield Tokens.createWordToken("<R");
                    yield Tokens.createWordToken("DUP");
                    yield Tokens.createWordToken("@R");
                    yield Tokens.createWordToken(">=");
                    yield addr;
                    yield Tokens.createWordToken("DROP");
                    yield Tokens.createWordToken("^R");
                }
                else {
                    index++;
                    yield t;
                }

            }
            else {
                index++;
                yield t;
            }
            */
        }
    }

}
