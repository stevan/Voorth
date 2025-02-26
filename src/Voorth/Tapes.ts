
import { Words }          from './Words';
import { Literals }       from './Literals';
import { Runtime }        from './Runtime';
import { CompiledTokens } from './CompiledTokens';
import { ExecTokens }     from './ExecTokens';

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
                let ct = this.$tokens[ this.$index++ ] as CompiledTokens.CompiledToken;
                yield ct;
            }
            this.$index = 0;
        }
    }

    export class ExecutableTape implements Tape<ExecTokens.ExecToken> {
        private $runtime  : Runtime;
        private $compiled : CompiledTape;
        private $invoke?  : Literals.WordRef | undefined;

        constructor (compiled : CompiledTape, runtime : Runtime) {
            this.$compiled = compiled;
            this.$runtime  = runtime;
        }

        invoke (wordRef : Literals.WordRef) : void {
            this.$invoke = wordRef;
        }

        jump (offset : number) : void {
            this.$compiled.jump(offset);
        }

        *play () : TapeStream<ExecTokens.ExecToken> {
            let tape    = this.$compiled.play();
            let library = this.$runtime.library;
            for (const t of tape) {
                //console.log("THREADING: ", t);
                switch (true) {
                case CompiledTokens.isConstToken(t):
                    yield ExecTokens.createConstToken(t.literal);
                    break;
                case CompiledTokens.isCallToken(t):
                    let ref = t.wordRef as Literals.WordRef;
                    if (ref.name == 'INVOKE!') {
                        yield ExecTokens.createInvokeToken();
                        if (this.$invoke) {
                            ref = this.$invoke;
                            this.$invoke = undefined;
                        }
                    }
                    let word : Words.RuntimeWord | undefined;
                    if (word = library.lookup(ref)) {
                        if (Words.isNativeWord(word)) {
                            yield ExecTokens.createBuiltinToken(word);
                        }
                        else {
                            yield ExecTokens.createCallToken(word);
                        }
                    }
                    else {
                        throw new Error(`Could not find word(${ref.name})`);
                    }
                    break;
                case CompiledTokens.isMoveToken(t):
                    let jump = t.jump;
                    if (jump.conditional) {
                        yield ExecTokens.createCondToken(jump.offset);
                    }
                    else {
                        yield ExecTokens.createMoveToken(jump.offset);
                    }
                    break;
                default:
                    throw new Error(`Unrecognized token ${JSON.stringify(t)}`)
                }
                //console.log(">>> STACK: ", this.runtime.stack);
            }
        }
    }

}
