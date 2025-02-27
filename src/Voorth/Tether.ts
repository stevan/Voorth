
import { DEBUG, LOG } from './Util/Logger';
import { Words }      from './Words';
import { Literals }   from './Literals';
import { ExecTokens } from './ExecTokens';
import { Tapes }      from './Tapes';
import { VM }         from './VM';

export class Tether implements VM.Tether {
    public tapes     : Tapes.ExecutableTape[];
    public to_notify : Function[];

    constructor(t? : Tapes.ExecutableTape) {
        this.tapes     = new Array<Tapes.ExecutableTape>();
        this.to_notify = new Array<Function>();
        if (t) this.tapes.push(t);
    }

    load (t : Tapes.ExecutableTape) : void {
        this.tapes.push(t);
        this.ready();
    }

    onReady (callback : Function) : void {
        this.to_notify.push(callback);
    }

    ready () : void {
        this.to_notify.forEach((f) => f());
    }

    *stream () : VM.InstructionStream {
        while (this.tapes.length) {
            let tape = this.tapes.shift() as Tapes.ExecutableTape;
            LOG(DEBUG, "TETHER // STREAM // >START", tape);
            for (const t of tape.play()) {
                LOG(DEBUG, "TETHER // STREAM // PLAY", t);
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
            LOG(DEBUG, "TETHER // STREAM // >END", tape);
        }
        LOG(DEBUG, "TETHER // STREAM !DONE");
    }
}
