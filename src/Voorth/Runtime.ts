
import { Literals }    from './Literals';
import { Words }       from './Words';
import { Library }     from './Library';
import { Tapes }       from './Tapes';

export class Runtime {
    public stack   : Literals.Stack;
    public control : Literals.Stack;
    public library : Library.Catalog;

    constructor () {
        this.stack   = new Literals.Stack();
        this.control = new Literals.Stack();
        this.library = new Library.Catalog();

        this.loadBuiltIns();
        this.library.createVolume('_');
    }

    link (body : Tapes.CompiledTape) : Tapes.ExecutableTape {
        return new Tapes.ExecutableTape(body, this)
    }

    bindUserWord (name : string, body : Tapes.CompiledTape) : void {
        this.library.bindToCurrentVolume(
            Words.createUserWord(name, this.link(body))
        );
    }

    private loadBuiltIns () : void {
        const loadBuiltIn = (
            name : string,
            body : Words.NativeWordBody
        ) => this.library.bindToCurrentVolume(
            Words.createNativeWord(name, body)
        );

        this.library.createVolume('CORE');

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
        loadBuiltIn('DROP', (r) => this.stack.drop());

        loadBuiltIn('OVER', (r) => this.stack.over());
        loadBuiltIn('SWAP', (r) => this.stack.swap());

        loadBuiltIn('RDUP', (r) => this.stack.rdup());
        loadBuiltIn('ROT',  (r) => this.stack.rot());
        loadBuiltIn('-ROT', (r) => this.stack.rrot());

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

        this.library.exitCurrentVolume();
    }

}
