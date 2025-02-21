
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
            for (const xt of tape.play()) {
                //console.log("THREADING", xt);
                if (ExecTokens.isConstToken(xt)) {
                    this.runtime.stack.push(xt.literal);
                }

                // -----------------------------------------------------------------
                // Calls
                // -----------------------------------------------------------------
                else if (ExecTokens.isCallToken(xt)) {
                    let word = this.runtime.dict.lookup(xt.wordRef);
                    if (!word) throw new Error(`Unable to find word(${xt.wordRef.name})`);

                    if (Words.isNativeWord(word)) {
                        word.body(this.runtime);
                    }
                    else {
                        this.execute(word.body);
                    }
                }
                else if (ExecTokens.isInvokeToken(xt)) {
                    let wordRef = this.runtime.control.pop() as Literals.WordRef;
                    let word    = this.runtime.dict.lookup(wordRef);
                    if (!word)
                        throw new Error(`Unable to find word(${wordRef.name})`);
                    if (Words.isNativeWord(word)) {
                        word.body(this.runtime);
                    }
                    else {
                        this.execute(word.body);
                    }
                }

                // -----------------------------------------------------------------
                // Jumps
                // -----------------------------------------------------------------
                else if (ExecTokens.isMoveToken(xt)) {
                    let jump = xt.jumpToken;
                    if (jump.conditional) {
                        let cond = this.runtime.stack.pop() as Literals.Literal;
                        if (!cond.toBool())
                            tape.jump(jump.offset);
                    }
                    else {
                        tape.jump(jump.offset);
                    }
                }

                // -----------------------------------------------------------------
                // Specials
                // -----------------------------------------------------------------
                else if (ExecTokens.isWaitToken(xt)) {
                    console.log('Wait!');
                }
                else if (ExecTokens.isExitToken(xt)) {
                    console.log('Goodbye!');
                }
                // -----------------------------------------------------------------
                else {
                    throw new Error("Unrecognized Token" + xt);
                }
            }
        }
    }
}
