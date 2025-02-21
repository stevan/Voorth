
import { Tokens }     from './Tokens';
import { Literals }   from './Literals';
import { ExecTokens } from './ExecTokens';
import { Runtime }    from './Runtime';
import { Library }    from './Library';
import { Words }      from './Words';

export class Compiler {

    constructor(public runtime : Runtime) {}

    compile (tokens : Tokens.TokenStream) : ExecTokens.ExecStream {
        return this.compileStream(
            this.compileControlStructures(
                this.compileWordDefinitions(
                    tokens
                )
            )
        );
    }

    compileWord (tokens : Tokens.TokenStream) : void {
        let name = this.extractName(tokens);
        //console.log("BEGIN WORD: ", name);
        let exec = this.compileStream(this.compileControlStructures(this.extractWordBody(tokens)));
        //console.log("END WORD: ", name);
        this.runtime.bindUserWord(name, exec);
    }

    private extractName (tokens : Tokens.TokenStream) : string {
        let next = tokens.next();
        if (next.done)
            throw new Error(`Unexpected end of token stream, expected word name`);
        let token = next.value;
        if (!Tokens.isWordToken(token))
            throw new Error(`Expected WordToken, got (${JSON.stringify(token)})`);
        return token.value as string;
    }

    private *extractWordBody (tokens : Tokens.TokenStream) : Tokens.TokenStream {
        let next = tokens.next();
        while (!next.done) {
            let token = next.value;
            if (Tokens.isWordToken(token) && token.value == ';') return;
            yield token;
            next = tokens.next();
        }
        throw new Error(`Reached end of token stream without encountering word end (;)`);
    }

    private *compileStream (tokens : Tokens.TokenStream) : ExecTokens.ExecStream {
        for (const token of tokens) {
            if (Tokens.isLiteralToken(token)) {
                switch (true) {
                case Tokens.isNumberToken(token):
                    yield ExecTokens.createConstToken(new Literals.Num(parseInt(token.value)))
                    break;
                case Tokens.isStringToken(token):
                    yield ExecTokens.createConstToken(new Literals.Str(token.value.slice(1,-1)))
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
                default:
                    yield ExecTokens.createCallToken(new Literals.WordRef(name))
                }
            }
            else if (Tokens.isJumpToken(token)) {
                yield ExecTokens.createMoveToken(token)
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
        let jumps : Tokens.JumpToken[] = [];
        for (const t of tokens) {
            if (Tokens.isWordToken(t)) {
                // -------------------------------------------------------------
                // Conditionals
                // -------------------------------------------------------------
                if (t.value == 'IF') {
                    let jump = Tokens.createJumpToken( index += 1, true );
                    jumps.push(jump);
                    yield jump;
                }
                else if (t.value == 'ELSE') {
                    let jump = jumps.pop() as Tokens.JumpToken;
                    index += 1
                    jump.offset = index - jump.offset;

                    let next_jump = Tokens.createJumpToken( index, false );
                    jumps.push(next_jump)
                    yield next_jump;
                }
                else if (t.value == 'THEN') {
                    let jump = jumps.pop() as Tokens.JumpToken;
                    jump.offset = index - jump.offset;
                    continue;
                }
                // -------------------------------------------------------------
                // BEGIN UNTIL
                // -------------------------------------------------------------
                else if (t.value == 'BEGIN') {
                    let jump = Tokens.createJumpToken( index, true );
                    jumps.push(jump);
                    continue;
                }
                else if (t.value == 'UNTIL') {
                    let jump = jumps.pop() as Tokens.JumpToken;
                    index += 1;
                    jump.offset = jump.offset - index;
                    yield jump;
                }
                else if (t.value == 'WHILE') {
                    let jump = Tokens.createJumpToken( index, true );
                    jumps.push(jump);
                    index += 1;
                    yield jump;
                }
                else if (t.value == 'REPEAT') {
                    index += 1;

                    let while_jump  = jumps.pop() as Tokens.JumpToken;
                    let repeat_jump = jumps.pop() as Tokens.JumpToken;

                    repeat_jump.offset      = repeat_jump.offset - index;
                    repeat_jump.conditional = false;

                    while_jump.offset = index - repeat_jump.offset;

                    yield repeat_jump;
                }
                // -------------------------------------------------------------
                // DO LOOP
                // -------------------------------------------------------------
                else if (t.value == 'DO') {
                    let jump = Tokens.createJumpToken( index += 2, true );
                    jumps.push(jump);
                    index += 3;
                    yield Tokens.createWordToken("SWAP");
                    yield Tokens.createWordToken(">R!");
                    yield Tokens.createNumberToken("1");   // loop returns here
                    yield Tokens.createWordToken("+");
                    yield Tokens.createWordToken(">R!");
                }
                else if (t.value == 'LOOP') {
                    let jump = jumps.pop() as Tokens.JumpToken;
                    index += 5;
                    jump.offset = jump.offset - index;
                    index += 2;
                    yield Tokens.createWordToken("<R!");
                    yield Tokens.createWordToken("DUP");
                    yield Tokens.createWordToken(".R!");
                    yield Tokens.createWordToken(">=");
                    yield jump;
                    yield Tokens.createWordToken("DROP");
                    yield Tokens.createWordToken("^R!");
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
        }
    }

}
