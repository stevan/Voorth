
import { Tokens }     from './Tokens';
import { Runtime }    from './Runtime';
import { Compiler }   from './Compiler';
import { Executors }  from './Executors';

export class Interpreter {
    public compiler : Compiler;
    public runtime  : Runtime;
    public executor : Executors.Executor;

    constructor () {
        this.runtime  = new Runtime();
        this.compiler = new Compiler(this.runtime);
        this.executor = new Executors.Executor(this.runtime);
    }

    run (src : string) : void {
        let tape = this.compiler.compile(Tokens.tokenize(src));
        this.executor.execute(tape);
    }
}
