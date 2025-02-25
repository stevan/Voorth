
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
            let compiled = this.tapes.shift() as Tapes.CompiledTape;
            let tape     = new Tapes.ExecutableTape(compiled, this.runtime);
            for (const t of tape.play()) {
                switch (true) {
                case ExecTokens.isConstToken(t):
                    yield { type : 'CONST', value : t.literal.toNative() as VM.Literal };
                    break;
                case ExecTokens.isInvokeToken(t):
                    throw new Error("TODO");
                    break;
                case ExecTokens.isCallToken(t):
                    let userWord = t.word as Words.UserWord;
                    yield* (new Tether(this.runtime, userWord.body)).stream();
                    break;
                case ExecTokens.isBuiltinToken(t):
                    let builtinWord = t.word as Words.NativeWord;
                    yield { type : 'OP', value : builtinWord.name as VM.BIF };
                    break;
                case ExecTokens.isCondToken(t):
                    let cond = yield { type : 'OP', value : 'JUMP?' };
                    if (!cond) tape.jump(t.offset);
                    // send NOOP instruction that can be ignored
                    yield { type : 'OP', value : 'NOOP' };
                    break;
                case ExecTokens.isMoveToken(t):
                    tape.jump(t.offset);
                    break;
                default:
                    throw new Error(`Unrecognized token ${JSON.stringify(t)}`)
                }
            }
        }
    }
}
