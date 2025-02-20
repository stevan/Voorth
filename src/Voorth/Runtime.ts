
import { Literals }   from './Literals';
import { Words }      from './Words';
import { Library }    from './Library';
import { ExecTokens } from './ExecTokens';

export class Runtime {
    public stack   : Literals.Stack;
    public control : Literals.Stack;
    public dict    : Library.Dictionary;

    constructor () {
        this.stack   = new Literals.Stack();
        this.control = new Literals.Stack();
        this.dict    = new Library.Dictionary();

        this.dict.bind(
            Words.createNativeWord('+', (r) => {
                let rhs = this.stack.pop();
                let lhs = this.stack.pop();
                this.stack.push(
                    new Literals.Num(
                        lhs.toNum() + rhs.toNum()
                    )
                )
            })
        );
    }

    run (tape : ExecTokens.Tape) : void {
        for (const xt of tape.play()) {
            switch (true) {
            case ExecTokens.isConstToken(xt):
                this.stack.push(xt.literal);
                break;
            case ExecTokens.isCallToken(xt):
                let word;
                if (word = this.dict.lookup(xt.wordRef)) {
                    switch (true) {
                    case Words.isNativeWord(word):
                        word.body(this);
                        break;
                    default:
                        throw new Error("Unrecognized Token" + xt);
                    }
                }
                else {
                    throw new Error(`Unable to find word(${xt.wordRef.name})`);
                }
                break;
            default:
                throw new Error("Unrecognized Token" + xt);
            }
        }
    }
}
