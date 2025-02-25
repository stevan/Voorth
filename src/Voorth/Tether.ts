
import { Words }          from './Words';
import { Literals }       from './Literals';
import { Library }        from './Library';
import { Tapes }          from './Tapes';
import { VM }             from './VM';
import { Runtime }        from './Runtime';
import { CompiledTokens } from './CompiledTokens';

export class Tether {
    public runtime : Runtime
    public tapes   : Tapes.CompiledTape[];

    constructor(r : Runtime, t? : Tapes.CompiledTape) {
        this.runtime = r;
        this.tapes   = new Array<Tapes.CompiledTape>();
        if (t) this.tapes.push(t);
    }

    load (t : Tapes.CompiledTape) : void {
        this.tapes.push(t);
    }

    *stream () : VM.InstructionStream {
        let library = this.runtime.library;
        while (this.tapes.length) {
            let tape = this.tapes.shift() as Tapes.CompiledTape;
            for (const t of tape.play()) {
                switch (true) {
                case CompiledTokens.isConstToken(t):
                    yield { type : 'CONST', value : t.literal.toNative() as VM.Literal };
                    break;
                case CompiledTokens.isCallToken(t):
                    let ref = t.wordRef as Literals.WordRef;
                    let word;
                    if (word = library.lookup(ref)) {
                        if (Words.isNativeWord(word)) {
                            yield { type : 'OP', value : ref.name as VM.BIF };
                        }
                        else {
                            yield* (new Tether(this.runtime, word.body)).stream();
                        }
                    }
                    else {
                        throw new Error(`Could not find word(${ref.name})`);
                    }
                    break;
                case CompiledTokens.isMoveToken(t):
                    let jump = t.jump;
                    if (jump.conditional) {
                        let cond = yield { type : 'OP', value : 'JUMP?' };
                        if (!cond) tape.jump(jump.offset);
                        // send NOOP instruction that can be ignored
                        yield { type : 'OP', value : 'NOOP' };
                    }
                    else {
                        tape.jump(jump.offset);
                        continue;
                    }
                    break;
                default:
                    throw new Error(`Unrecognized token ${JSON.stringify(t)}`)
                }
            }
        }
    }

}
