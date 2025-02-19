
import { Tokens }     from './Tokens';
import { Values }     from './Values';
import { Runtime }    from './Runtime';

export namespace Compiler {




    export type CompiledStream = Generator<any, void, void>

    export function* compile (tokens : Tokens.Stream) : CompiledStream {

    }

}
