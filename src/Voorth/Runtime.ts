
import { Literals }   from './Literals';
import { Words }      from './Words';
import { Library }    from './Library';
import { ExecTokens } from './ExecTokens';

export class Tape {
    private $index   : number;
    private $tokens  : ExecTokens.ExecToken[];
    private $invoke? : Tape;

    constructor (exe? : ExecTokens.ExecStream) {
        this.$index  = 0;
        this.$tokens = exe ? [...exe] : [];
    }

    invoke (tape : Tape)     : void { this.$invoke = tape   }
    jump   (offset : number) : void { this.$index += offset }

    load (source : ExecTokens.ExecToken[]) {
        this.$tokens.push(...source);
    }

    *play () : ExecTokens.ExecStream {
        while (this.$index < this.$tokens.length) {
            let xt = this.$tokens[ this.$index++ ] as ExecTokens.ExecToken;
            yield xt;

            if (this.$invoke) {
                let invoked = this.$invoke;
                this.$invoke = undefined;
                yield* invoked.play();
            }
        }
        this.$index = 0;
    }
}

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

    bindUserWord (name : string, exec : ExecTokens.ExecStream) : void {
        this.dict.bind(
            Words.createUserWord(
                name,
                new Tape(exec)
            )
        );
    }

    private loadBuiltIns () : void {
        const loadBuiltIn = (
            name : string,
            body : Words.NativeWordBody
        ) => this.dict.bind(Words.createNativeWord(name, body));

        // =====================================================================
        // Debugging
        // =====================================================================

        loadBuiltIn('.SHOW!', (r) => console.log("PEEK:", this.stack.peek()));
        loadBuiltIn('.DUMP!', (r) => console.log("STACK:", ...this.stack.toArray()));

        // =====================================================================
        // Stack Operators
        // =====================================================================

        // ---------------------------------------------------------------------
        // Stack Ops
        // ---------------------------------------------------------------------
        // DUP   ( a     -- a a   ) duplicate the top of the stack
        // SWAP  ( b a   -- a b   ) swap the top two items on the stack
        // DROP  ( a     --       ) drop the item at the top of the stack
        // OVER  ( b a   -- b a b ) like DUP, but for the 2nd item on the stack
        // ROT   ( c b a -- b a c ) rotate the 3rd item to the top of the stack

        loadBuiltIn('DUP',  (r) => this.stack.dup());
        loadBuiltIn('OVER', (r) => this.stack.over());
        loadBuiltIn('DROP', (r) => this.stack.drop());
        loadBuiltIn('SWAP', (r) => this.stack.swap());
        loadBuiltIn('ROT',  (r) => this.stack.rot());

        // ---------------------------------------------------------------------
        // Contorl Stack Ops
        // ---------------------------------------------------------------------
        // >R!  ( a --   ) ( a --   ) take from stack and push to control stack
        // <R!  (   -- a ) (   -- a ) take from control stack and push to stack
        // .R!  (   -- a ) ( a -- a ) push top of control stack to stack
        // ^R!  (   --   ) (   --   ) drop the top of the control stack
        // ---------------------------------------------------------------------

        loadBuiltIn('>R!', (r) => this.control.push(this.stack.pop()));
        loadBuiltIn('<R!', (r) => this.stack.push(this.control.pop()));
        loadBuiltIn('.R!', (r) => this.stack.push(this.control.peek()));
        loadBuiltIn('^R!', (r) => this.control.drop());

        // =====================================================================
        // BinOps
        // =====================================================================

        // ---------------------------------------------------------------------
        // Strings
        // ---------------------------------------------------------------------

        loadBuiltIn('~', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Str(lhs.toNative() + rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Equality
        // ---------------------------------------------------------------------

        loadBuiltIn('==', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() == rhs.toNative()))
        });

        loadBuiltIn('!=', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() != rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Comparison
        // ---------------------------------------------------------------------

        loadBuiltIn('>', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() > rhs.toNative()))
        });

        loadBuiltIn('>=', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() >= rhs.toNative()))
        });

        loadBuiltIn('<=', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() <= rhs.toNative()))
        });

        loadBuiltIn('<', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() < rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Math Ops
        // ---------------------------------------------------------------------

        loadBuiltIn('+', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() + rhs.toNative()))
        });

        loadBuiltIn('-', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() - rhs.toNative()))
        });

        loadBuiltIn('*', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() * rhs.toNative()))
        });

        loadBuiltIn('/', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() / rhs.toNative()))
        });

        loadBuiltIn('%', (r) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() % rhs.toNative()))
        });
    }

}
