
import { Literals }   from './Literals';
import { Words }      from './Words';
import { Library }    from './Library';
import { ExecTokens } from './ExecTokens';

export class Runtime {
    public stack   : Literals.Stack;
    public control : Literals.Stack;
    public dict    : Library.RuntimeDict;

    constructor () {
        this.stack   = new Literals.Stack();
        this.control = new Literals.Stack();
        this.dict    = new Library.RuntimeDict();
        this.loadBuiltIns();
    }

    call (wordRef : Literals.WordRef) : void {
        let word;
        if (word = this.dict.lookup(wordRef)) {
            if (Words.isNativeWord(word)) {
                word.body(this);
            }
            else {
                this.run(word.body);
            }
        }
        else {
            throw new Error(`Unable to find word(${wordRef.name})`);
        }
    }

    run (tape : ExecTokens.Tape) : void {
        for (const xt of tape.play()) {
            //console.log("EXECUTING", xt);
            switch (true) {
            case ExecTokens.isConstToken(xt):
                this.stack.push(xt.literal);
                break;
            case ExecTokens.isCallToken(xt):
                this.call(xt.wordRef);
                break;
            case ExecTokens.isInvokeToken(xt):
                let wordRef = this.stack.pop() as Literals.WordRef;
                this.call(wordRef);
                break;
            case ExecTokens.isMoveToken(xt):
                let jump = xt.jumpToken;
                if (jump.conditional) {
                    let cond = this.stack.pop() as Literals.Literal;
                    if (!cond.toBool())
                        tape.jump(jump.offset);
                }
                else {
                    tape.jump(jump.offset);
                }
                break;
            case ExecTokens.isWaitToken(xt):
                console.log('Wait!');
                break;
            case ExecTokens.isExitToken(xt):
                console.log('Goodbye!');
                return;
            default:
                throw new Error("Unrecognized Token" + xt);
            }
            //console.log("STACK", this.stack);
        }
    }

    private loadBuiltIns () : void {
        const loadWord = (
            name : string,
            body : Words.NativeWordBody
        ) => this.dict.bind(Words.createNativeWord(name, body));

        // ---------------------------------------------------------------------
        // I/O
        // ---------------------------------------------------------------------

        loadWord('SAY!',  (r) => console.log(this.stack.pop()));

        // ---------------------------------------------------------------------
        // Stack Ops
        // ---------------------------------------------------------------------

        loadWord('DUP',  (r) => this.stack.dup());
        loadWord('OVER', (r) => this.stack.over());
        loadWord('DROP', (r) => this.stack.drop());
        loadWord('SWAP', (r) => this.stack.swap());
        loadWord('ROT',  (r) => this.stack.rot());

        // ---------------------------------------------------------------------
        // Contorl Stack Ops
        // ---------------------------------------------------------------------
        // >R!  ( a --   ) ( a --   )   take from stack and push onto control stack
        // <R!  (   -- a ) (   -- a )   take from control stack and push onto stack
        // .R!  (   -- a ) ( a -- a )   push top of control stack onto stack
        // ^R!  (   --   ) (   --   )   drop the top of the control stack
        // ---------------------------------------------------------------------

        loadWord('>R!', (r) => this.control.push(this.stack.pop()));
        loadWord('<R!', (r) => this.stack.push(this.control.pop()));
        loadWord('.R!', (r) => this.stack.push(this.control.peek()));
        loadWord('^R!', (r) => this.control.drop());

        // ---------------------------------------------------------------------
        // Strings
        // ---------------------------------------------------------------------

        loadWord('~', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Str(lhs.toNative() + rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Equality
        // ---------------------------------------------------------------------

        loadWord('==', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() == rhs.toNative()))
        });

        loadWord('!=', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() != rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Comparison
        // ---------------------------------------------------------------------

        loadWord('>', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() > rhs.toNative()))
        });

        loadWord('>=', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() >= rhs.toNative()))
        });

        loadWord('<=', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() <= rhs.toNative()))
        });

        loadWord('<', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() < rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Math Ops
        // ---------------------------------------------------------------------

        loadWord('+', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() + rhs.toNative()))
        });

        loadWord('-', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() - rhs.toNative()))
        });

        loadWord('*', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() * rhs.toNative()))
        });

        loadWord('/', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() / rhs.toNative()))
        });

        loadWord('%', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() % rhs.toNative()))
        });
    }

}
