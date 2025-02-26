import { EventEmitter } from 'events';

import { Words }          from './Words';
import { Literals }       from './Literals';
import { Library }        from './Library';
import { Tapes }          from './Tapes';
import { VM }             from './VM';
import { CompiledTokens } from './CompiledTokens';
import { ExecTokens }     from './ExecTokens';

export class Tether extends EventEmitter {
    public tapes : Tapes.ExecutableTape[];

    constructor(t? : Tapes.ExecutableTape) {
        super();
        this.tapes = new Array<Tapes.ExecutableTape>();
        if (t) this.tapes.push(t);
    }

    load (t : Tapes.ExecutableTape) : void {
        this.tapes.push(t);
        this.emit('ready');
    }

    *stream () : VM.InstructionStream {
        while (this.tapes.length) {
            let tape = this.tapes.shift() as Tapes.ExecutableTape;
            for (const t of tape.play()) {
                switch (true) {
                case ExecTokens.isConstToken(t):
                    yield { type : 'CONST', value : t.literal.toNative() as VM.Literal };
                    break;
                case ExecTokens.isInvokeToken(t):
                    let name : string = yield { type : 'OP', value : 'CALL?' };
                    if (name.indexOf('&') != 0) throw new Error(`Not a word ref string ${name}`);
                    tape.invoke(new Literals.WordRef(name.slice(1)));
                    // send NOOP instruction that can be ignored
                    yield { type : 'OP', value : 'NOOP' };
                    break;
                case ExecTokens.isCallToken(t):
                    let userWord = t.word as Words.UserWord;
                    yield* (new Tether(userWord.body)).stream();
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
