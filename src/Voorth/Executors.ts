
import { Words }      from './Words';
import { Literals }   from './Literals';
import { ExecTokens } from './ExecTokens';
import { Runtime, Tape }    from './Runtime';

export namespace Executors {

    type Runnable       = (r : Runtime) => void;
    type RunnableStream = Generator<Runnable, void, void>;

    export class Executor {
        public runtime : Runtime;

        constructor(r : Runtime) {
            this.runtime = r;
        }

        execute (tape : Tape) : void {
            for (const r of this.thread(tape)) {
                r(this.runtime);
                //console.log("STACK", this.runtime.stack);
                //console.log("CONTROL", this.runtime.control);
            }
        }

        *thread (tape : Tape) : RunnableStream {
             for (const xt of tape.play()) {
                //console.log("THREADING", xt);
                switch (true) {
                // -----------------------------------------------------------------
                // Constants
                // -----------------------------------------------------------------
                case ExecTokens.isConstToken(xt):
                    yield (r) => { r.stack.push(xt.literal) }
                    break;

                // -----------------------------------------------------------------
                // Calls
                // -----------------------------------------------------------------
                case ExecTokens.isCallToken(xt):
                    let word = this.runtime.dict.lookup(xt.wordRef);
                    if (!word) throw new Error(`Unable to find word(${xt.wordRef.name})`);

                    if (Words.isNativeWord(word)) {
                        yield (r) => { word.body(r) };
                    }
                    else {
                        yield* this.thread(word.body);
                    }
                    break;
                case ExecTokens.isInvokeToken(xt):
                    yield (r) => {
                        //console.log(r);
                        let wordRef = r.control.pop() as Literals.WordRef;
                        let word    = r.dict.lookup(wordRef);
                        if (!word)
                            throw new Error(`Unable to find word(${wordRef.name})`);
                        if (Words.isNativeWord(word)) {
                            word.body(r);
                        }
                        else {
                            tape.invoke(word.body);
                        }
                    }
                    break;

                // -----------------------------------------------------------------
                // Jumps
                // -----------------------------------------------------------------
                case ExecTokens.isMoveToken(xt):
                    let jump = xt.jumpToken;
                    if (jump.conditional) {
                        yield (r) => {
                            let cond = r.stack.pop() as Literals.Literal;
                            if (!cond.toBool())
                                tape.jump(jump.offset);
                        }
                    }
                    else {
                        yield (r) => { tape.jump(jump.offset) }
                    }
                    break;

                // -----------------------------------------------------------------
                // Specials
                // -----------------------------------------------------------------
                case ExecTokens.isWaitToken(xt):
                    yield (r) => { console.log('Wait!'); }
                    break;
                case ExecTokens.isExitToken(xt):
                    yield (r) => { console.log('Goodbye!'); }
                    return;
                // -----------------------------------------------------------------
                default:
                    throw new Error("Unrecognized Token" + xt);
                }
            }
        }
    }
}
