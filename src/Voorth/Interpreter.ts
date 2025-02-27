
import { DEBUG, LOG } from './Util/Logger';
import { Tokens }     from './Tokens';
import { Words }      from './Words';
import { Tapes }      from './Tapes';
import { Runtime }    from './Runtime';
import { Compiler }   from './Compiler';
import { Literals }   from './Literals';
import { Tether }     from './Tether';
import { ExecTokens } from './ExecTokens';

export class Interpreter {
    public compiler : Compiler;
    public runtime  : Runtime;
    public tether   : Tether;

    constructor () {
        this.runtime  = new Runtime();
        this.compiler = new Compiler(this.runtime);
        this.tether   = new Tether();
    }

    run (src : string) : void {
        LOG(DEBUG, "INTERPRETER // RUN // COMPILE");
        let tape = this.compiler.compile(Tokens.tokenize(src));
        LOG(DEBUG, "INTERPRETER // RUN // COMPILE !DONE");
        LOG(DEBUG, "INTERPRETER // RUN // EXECUTE");
        this.execute(this.runtime.link(tape));
        LOG(DEBUG, "INTERPRETER // RUN // EXECUTE !DONE");
    }

    send (src : string) : void {
        LOG(DEBUG, "INTERPRETER // SEND // COMPILE");
        let tape = this.compiler.compile(Tokens.tokenize(src));
        LOG(DEBUG, "INTERPRETER // SEND // COMPILE !DONE");
        LOG(DEBUG, "INTERPRETER // SEND // LOAD");
        this.tether.load(this.runtime.link(tape));
        LOG(DEBUG, "INTERPRETER // SEND // LOAD !DONE");
    }

    execute (tape : Tapes.ExecutableTape) : void {
        for (const t of tape.play()) {
            LOG(DEBUG, "INTERPRETER // EXECUTING", t);
            switch (true) {
            case ExecTokens.isConstToken(t):
                this.runtime.stack.push(t.literal)
                break;
            case ExecTokens.isInvokeToken(t):
                let dynRef = this.runtime.stack.pop() as Literals.WordRef;
                tape.invoke(dynRef);
                break;
            case ExecTokens.isCallToken(t):
                let userWord = t.word as Words.UserWord;
                this.execute(userWord.body);
                break;
            case ExecTokens.isBuiltinToken(t):
                let builtinWord = t.word as Words.NativeWord;
                builtinWord.body(this.runtime);
                break;
            case ExecTokens.isCondToken(t):
                let cond = this.runtime.stack.pop();
                if (!cond.toBool()) {
                    tape.jump(t.offset);
                }
                break;
            case ExecTokens.isMoveToken(t):
                tape.jump(t.offset);
                break;
            default:
                throw new Error(`Unrecognized token ${JSON.stringify(t)}`)
            }
            //LOG(DEBUG, ">>> STACK: ", this.runtime.stack);
        }
        LOG(DEBUG, "INTERPRETER // EXECUTING !DONE");
    }

}
