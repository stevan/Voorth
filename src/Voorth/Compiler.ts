
import { DEBUG, LOG }     from './Util/Logger';
import { Tokens }         from './Tokens';
import { Literals }       from './Literals';
import { CompiledTokens } from './CompiledTokens';
import { Tapes }          from './Tapes';
import { Runtime }        from './Runtime';

export class Compiler {

    constructor(public runtime : Runtime) {}

    compile (tokens : Tokens.TokenStream) : Tapes.CompiledTape {
        return new Tapes.CompiledTape(
            this.compileStream(
                this.compileControlStructures(
                    this.compileWordDefinitions(
                        tokens
                    )
                )
            )
        );
    }

    compileWord (tokens : Tokens.TokenStream) : void {
        let name = this.extractName(tokens);
        //LOG(DEBUG, "BEGIN WORD: ", name);
        let compiled = this.compileStream(this.compileControlStructures(this.extractWordBody(tokens)));
        //LOG(DEBUG, "END WORD: ", name);
        this.runtime.bindUserWord(name, new Tapes.CompiledTape(compiled));
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

    private *compileStream (tokens : Tokens.TokenStream) : CompiledTokens.CompiledStream {
        for (const token of tokens) {
            LOG(DEBUG, "COMPILING // STREAM", token);
            if (Tokens.isLiteralToken(token)) {
                switch (true) {
                case Tokens.isNumberToken(token):
                    yield CompiledTokens.createConstToken(new Literals.Num(parseInt(token.value)))
                    break;
                case Tokens.isStringToken(token):
                    yield CompiledTokens.createConstToken(new Literals.Str(token.value.slice(1,-1)))
                    break;
                case Tokens.isBooleanToken(token):
                    yield CompiledTokens.createConstToken(new Literals.Bool(token.value == '#t'))
                    break;
                default:
                    throw new Error(`Unrecognized (Const) token (${JSON.stringify(token)})`)
                }
            }
            else if (Tokens.isWordToken(token)) {
                let name = token.value;
                if (/^\&/.test(name)) {
                    yield CompiledTokens.createConstToken(new Literals.WordRef(name.slice(1)))
                }
                else {
                    yield CompiledTokens.createCallToken(new Literals.WordRef(name))
                }
            }
            else if (Tokens.isJumpToken(token)) {
                yield CompiledTokens.createMoveToken(token)
            }
            else {
                throw new Error(`Unrecognized (??) token (${JSON.stringify(token)})`);
            }
        }
        LOG(DEBUG, "COMPILING // STREAM !DONE");
    }

    // -------------------------------------------------------------------------

    private *compileWordDefinitions (tokens : Tokens.TokenStream) : Tokens.TokenStream {
        for (const token of tokens) {
            LOG(DEBUG, "COMPILING // WORD DEFINITIONS", token);
            if (Tokens.isWordToken(token)) {

                if (token.value == '::') {
                    let name = this.extractName(tokens);
                    this.runtime.library.createVolume(name);
                    continue;
                }

                if (token.value == ';;') {
                    this.runtime.library.exitCurrentVolume();
                    continue;
                }

                if (token.value == ':') {
                    this.compileWord(tokens);
                    continue;
                }
            }
            yield token;
        }
        LOG(DEBUG, "COMPILING // WORD DEFINITIONS !DONE");
    }

    private *compileControlStructures (tokens : Tokens.TokenStream) : Tokens.TokenStream {
        let index : number = 0;
        let jumps : Tokens.JumpToken[] = [];
        for (const t of tokens) {
            LOG(DEBUG, "COMPILING // CONTROL STRUCTURES", t);
            if (Tokens.isWordToken(t)) {
                // -------------------------------------------------------------
                // Conditionals
                // -------------------------------------------------------------
                if (t.value == 'IF') {
                    let jump = Tokens.createConditionalJumpToken( index += 1, { synthetized : 'IF' } );
                    jumps.push(jump);
                    yield jump;
                }
                else if (t.value == 'ELSE') {
                    let jump = jumps.pop() as Tokens.JumpToken;
                    index += 1
                    jump.offset = index - jump.offset;

                    let next_jump = Tokens.createJumpToken( index, { synthetized : 'ELSE' } );
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
                    let jump = Tokens.createConditionalJumpToken( index, { synthetized : 'BEGIN' } );
                    jumps.push(jump);
                    continue;
                }
                else if (t.value == 'UNTIL') {
                    let jump = jumps.pop() as Tokens.JumpToken;
                    index += 1;
                    jump.offset = jump.offset - index;
                    jump.meta.synthetized += '/UNTIL';
                    yield jump;
                }
                else if (t.value == 'WHILE') {
                    let jump = Tokens.createConditionalJumpToken( index, { synthetized : 'WHILE' } );
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
                    repeat_jump.meta.synthetized += '/REPEAT';

                    while_jump.offset = index - repeat_jump.offset;
                    while_jump.meta.synthetized += '/WHILE';

                    yield repeat_jump;
                }
                // -------------------------------------------------------------
                // DO LOOP
                // -------------------------------------------------------------
                else if (t.value == 'DO') {
                    let jump = Tokens.createConditionalJumpToken( index += 2, { synthetized : 'DO' } );
                    jumps.push(jump);
                    index += 3;
                    yield Tokens.createWordToken("SWAP", { synthetized : 'DO' });
                    yield Tokens.createWordToken(">R!",  { synthetized : 'DO' });
                    yield Tokens.createNumberToken("1",  { synthetized : 'DO' });   // loop returns here
                    yield Tokens.createWordToken("+",    { synthetized : 'DO' });
                    yield Tokens.createWordToken(">R!",  { synthetized : 'DO' });
                }
                else if (t.value == 'LOOP') {
                    let jump = jumps.pop() as Tokens.JumpToken;
                    index += 5;
                    jump.offset = jump.offset - index;
                    jump.meta.synthetized += '/LOOP';
                    index += 2;
                    yield Tokens.createWordToken("<R!",  { synthetized : 'LOOP' });
                    yield Tokens.createWordToken("DUP",  { synthetized : 'LOOP' });
                    yield Tokens.createWordToken(".R!",  { synthetized : 'LOOP' });
                    yield Tokens.createWordToken(">=",   { synthetized : 'LOOP' });
                    yield jump;
                    yield Tokens.createWordToken("DROP", { synthetized : 'LOOP' });
                    yield Tokens.createWordToken("^R!",  { synthetized : 'LOOP' });
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
        LOG(DEBUG, "COMPILING // CONTROL STRUCTURES !DONE");
    }

}
