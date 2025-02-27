
import { INFO, LOG }   from './Util/Logger';
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

    bindNativeWord (name : string, body : Words.NativeWordBody) : void {
        this.library.bindToCurrentVolume(
            Words.createNativeWord(name, body)
        );
    }

    private loadBuiltIns () : void {
        this.library.createVolume('CORE');

        // =====================================================================
        // Debugging
        // =====================================================================

        this.bindNativeWord('.SHOW!', (_:Runtime) => LOG(INFO, "PEEK:", this.stack.peek()));
        this.bindNativeWord('.DUMP!', (_:Runtime) => LOG(INFO, "STACK:", ...this.stack.toArray()));

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

        this.bindNativeWord('DUP',  (_:Runtime) => this.stack.dup());
        this.bindNativeWord('DROP', (_:Runtime) => this.stack.drop());

        this.bindNativeWord('OVER', (_:Runtime) => this.stack.over());
        this.bindNativeWord('SWAP', (_:Runtime) => this.stack.swap());

        this.bindNativeWord('RDUP', (_:Runtime) => this.stack.rdup());
        this.bindNativeWord('ROT',  (_:Runtime) => this.stack.rot());
        this.bindNativeWord('-ROT', (_:Runtime) => this.stack.rrot());

        // ---------------------------------------------------------------------
        // Contorl Stack Ops
        // ---------------------------------------------------------------------
        // >R!  ( a --   ) ( a --   ) take from stack and push to control stack
        // <R!  (   -- a ) (   -- a ) take from control stack and push to stack
        // .R!  (   -- a ) ( a -- a ) push top of control stack to stack
        // ^R!  (   --   ) (   --   ) drop the top of the control stack
        // ---------------------------------------------------------------------

        this.bindNativeWord('>R!', (_:Runtime) => this.control.push(this.stack.pop()));
        this.bindNativeWord('<R!', (_:Runtime) => this.stack.push(this.control.pop()));
        this.bindNativeWord('.R!', (_:Runtime) => this.stack.push(this.control.peek()));
        this.bindNativeWord('^R!', (_:Runtime) => this.control.drop());

        // =====================================================================
        // BinOps
        // =====================================================================

        // ---------------------------------------------------------------------
        // Strings
        // ---------------------------------------------------------------------

        this.bindNativeWord('~', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Str(lhs.toNative() + rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Equality
        // ---------------------------------------------------------------------

        this.bindNativeWord('==', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() == rhs.toNative()))
        });

        this.bindNativeWord('!=', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() != rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Comparison
        // ---------------------------------------------------------------------

        this.bindNativeWord('>', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() > rhs.toNative()))
        });

        this.bindNativeWord('>=', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() >= rhs.toNative()))
        });

        this.bindNativeWord('<=', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() <= rhs.toNative()))
        });

        this.bindNativeWord('<', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Bool(lhs.toNative() < rhs.toNative()))
        });

        // ---------------------------------------------------------------------
        // Math Ops
        // ---------------------------------------------------------------------

        this.bindNativeWord('+', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() + rhs.toNative()))
        });

        this.bindNativeWord('-', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() - rhs.toNative()))
        });

        this.bindNativeWord('*', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() * rhs.toNative()))
        });

        this.bindNativeWord('/', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() / rhs.toNative()))
        });

        this.bindNativeWord('%', (_:Runtime) => {
            let rhs = this.stack.pop() as Literals.Literal;
            let lhs = this.stack.pop() as Literals.Literal;
            this.stack.push(new Literals.Num(lhs.toNative() % rhs.toNative()))
        });

        this.library.exitCurrentVolume();
    }

}
