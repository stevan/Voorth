
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
        LOG(DEBUG, "TETHER // LOAD", t);
        this.tapes.push(t);
        this.ready();
    }

    onReady (callback : Function) : void {
        this.to_notify.push(callback);
    }

    ready () : void {
        LOG(DEBUG, "TETHER // READY // NOTIFY");
        this.to_notify.forEach((f) => f());
        LOG(DEBUG, "TETHER // READY // NOTIFIED");
    }

    async *stream () : VM.InstructionStream {
        LOG(DEBUG, "TETHER // STREAM");
        while (this.tapes.length) {
            let tape = this.tapes.shift() as Tapes.ExecutableTape;
            LOG(DEBUG, "TETHER // STREAM // >START", tape);
            for (const t of tape.play()) {
                LOG(DEBUG, "TETHER // STREAM // PLAY", t);
                switch (true) {
                case ExecTokens.isConstToken(t):
                    yield this.createConst(t.literal);
                    break;
                case ExecTokens.isInvokeToken(t):
                    const callResp = yield this.createChannelRequest('CALL?');
                    this.assertChannelResponse(callResp);
                    let name = callResp.value as string;
                    if (name.indexOf('&') != 0) throw new Error(`Not a word ref string ${name}`);
                    tape.invoke(new Literals.WordRef(name.slice(1)));
                    // send NOOP instruction that can be ignored
                    yield this.createOp('NOOP');
                    break;
                case ExecTokens.isCallToken(t):
                    let userWord = t.word as Words.UserWord;
                    yield* (new Tether(userWord.body)).stream();
                    break;
                case ExecTokens.isBuiltinToken(t):
                    let builtinWord = t.word as Words.NativeWord;
                    yield this.createOp(builtinWord.name as VM.BIF);
                    break;
                case ExecTokens.isCondToken(t):
                    const jumpResp = yield this.createChannelRequest('JUMP?');
                    this.assertChannelResponse(jumpResp);
                    let cond = jumpResp.value as boolean;
                    if (!cond) tape.jump(t.offset);
                    // send NOOP instruction that can be ignored
                    yield this.createOp('NOOP');
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

    private assertChannelResponse (r : VM.ChannelResponse | undefined) : asserts r is VM.ChannelResponse {
        if (!r || r.type != 'CRES') throw new Error(`Not ChannelResponse ${JSON.stringify(r)}`)
    }

    private createConst (l : Literals.Literal) : Promise<VM.Constant> {
        return new Promise<VM.Constant>((r) =>
            r({ type : 'CONST', value : l.toNative() as VM.Literal } as VM.Constant)
        );
    }

    private createOp (op : string) : Promise<VM.Operator> {
        return new Promise<VM.Operator>((r) =>
            r({ type : 'OP', bif : op as VM.BIF } as VM.Operator)
        );
    }

    private createChannelRequest (op : string) : Promise<VM.ChannelRequest> {
        return new Promise<VM.ChannelRequest>((r) =>
            r({ type : 'CREQ', op : op as VM.ChannelRequestOp } as VM.ChannelRequest)
        );
    }
}
