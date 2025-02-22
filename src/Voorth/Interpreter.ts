
import { Tokens }         from './Tokens';
import { Words }          from './Words';
import { Tapes }          from './Tapes';
import { Runtime }        from './Runtime';
import { Compiler }       from './Compiler';
import { Library }        from './Library';
import { Literals }       from './Literals';
import { CompiledTokens } from './CompiledTokens';

export class Interpreter {
    public compiler : Compiler;
    public runtime  : Runtime;

    constructor () {
        this.runtime  = new Runtime();
        this.compiler = new Compiler(this.runtime);
    }

    run (src : string) : void {
        let tape = new Tapes.CompiledTape(this.compiler.compile(Tokens.tokenize(src)));
        this.execute(tape);
    }

    execute (tape : Tapes.CompiledTape) : void {
        for (const t of tape.play()) {
            //console.log("EXECUTING: ", t);
            switch (true) {
            case CompiledTokens.isConstToken(t):
                this.runtime.stack.push(t.literal)
                break;
            case CompiledTokens.isCallToken(t):
                let ref = t.wordRef as Literals.WordRef;
                if (ref.name == 'INVOKE!') {
                    ref = this.runtime.stack.pop() as Literals.WordRef;
                }
                Literals.assertWordRef(ref);

                let word;
                if (word = this.runtime.dict.lookup(ref)) {
                    if (Words.isNativeWord(word)) {
                        word.body(this.runtime);
                    }
                    else {
                        this.execute(word.body);
                    }
                }
                else {
                    throw new Error(`Could not find word(${ref.name})`);
                }
                break;
            case CompiledTokens.isMoveToken(t):
                let jump = t.jump;
                if (jump.conditional) {
                    let cond = this.runtime.stack.pop();
                    if (!cond.toBool())
                        tape.jump(jump.offset);
                }
                else {
                    tape.jump(jump.offset);
                }
                break;
            default:
                throw new Error(`Unrecognized token ${JSON.stringify(t)}`)
            }
            //console.log(">>> STACK: ", this.runtime.stack);
        }
    }

}
