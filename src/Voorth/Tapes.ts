
import { CompiledTokens } from './CompiledTokens';

export namespace Tapes {

    export type TapeStream<T> = Generator<T, void, void>;

    export interface Tape<T> {
        jump (offset : number) : void;
        play () : TapeStream<T>;
    }

    export class CompiledTape implements Tape<CompiledTokens.CompiledToken> {
        private $index   : number;
        private $tokens  : CompiledTokens.CompiledToken[];

        constructor (compiled? : CompiledTokens.CompiledStream) {
            this.$index  = 0;
            this.$tokens = compiled ? [...compiled] : [];
        }

        jump (offset : number) : void { this.$index += offset }

        load (source : CompiledTokens.CompiledToken[]) {
            this.$tokens.push(...source);
        }

        *play () : TapeStream<CompiledTokens.CompiledToken> {
            while (this.$index < this.$tokens.length) {
                let xt = this.$tokens[ this.$index++ ] as CompiledTokens.CompiledToken;
                yield xt;
            }
            this.$index = 0;
        }
    }

}
