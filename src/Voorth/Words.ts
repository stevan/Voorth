
import { Tokens }  from './Tokens';
import { Runtime } from './Runtime';

export namespace Words {

    export type UserWordBody     = Tape;
    export type NativeWordBody   = (runtime : Runtime) => void;
    export type CompilerWordBody = (tokens : Tokens.Stream, tape : Tape) => void;

    export interface UserWord {
        type : 'USER';
        name : string;
        body : UserWordBody;
    }

    export interface NativeWord {
        type : 'NATIVE';
        name : string;
        body : NativeWordBody;
    }

    export interface CompilerWord {
        type : 'COMPILER';
        name : string;
        body : CompilerWordBody;
    }

    export type RuntimeWord  = UserWord | NativeWord;
    export type Word         = UserWord | NativeWord | CompilerWord;

    export type CompiledStream  = Generator<RuntimeWord, void, void>;
    export type ExecutionStream = Generator<NativeWord, void, void>;

    // -------------------------------------------------------------------------

    export function createUserWord (n : string, b : UserWordBody) : UserWord {
        return { type : 'USER', name : n, body : b } as UserWord
    }

    export function createNativeWord (n : string, b : NativeWordBody) : NativeWord {
        return { type : 'NATIVE', name : n, body : b } as NativeWord
    }

    export function createCompilerWord (n : string, b : CompilerWordBody) : CompilerWord {
        return { type : 'COMPILER', name : n, body : b } as CompilerWord
    }

    export function isUserWord     (w : Word) : w is UserWord     { return w.type == 'USER'     }
    export function isNativeWord   (w : Word) : w is NativeWord   { return w.type == 'NATIVE'   }
    export function isCompilerWord (w : Word) : w is CompilerWord { return w.type == 'COMPILER' }
    export function isRuntimeWord  (w : Word) : w is RuntimeWord  { return isNativeWord(w) || isUserWord(w) }

    export function assertRuntimeWord (w : Word) : asserts w is RuntimeWord {
        if (!isRuntimeWord(w)) throw new Error("Not RuntimeWord")
    }

    export function assertNativeWord (w : Word) : asserts w is NativeWord {
        if (!isNativeWord(w)) throw new Error("Not NativeWord")
    }

    export function assertUserWord (w : Word) : asserts w is UserWord {
        if (!isUserWord(w)) throw new Error("Not UserWord")
    }

    export function assertCompilerWord (w : Word) : asserts w is CompilerWord {
        if (!isCompilerWord(w)) throw new Error("Not CompilerWord")
    }

    // -------------------------------------------------------------------------

    export class Tape {
        private $index   : number;
        private $words   : RuntimeWord[];
        private $invoke? : RuntimeWord;

        constructor (words? : RuntimeWord[]) {
            this.$index  = 0;
            this.$words = words ? words : new Array<RuntimeWord>();
        }

        invoke (w : RuntimeWord) { this.$invoke = w }

        length () : number { return this.$words.length }

        load (source : CompiledStream) {
            this.$words.push(...source);
        }

        jump (offset : number) : void {
            this.$index += offset;
        }

        *play () : ExecutionStream {
            while (this.$index < this.$words.length) {
                let word = this.$words[ this.$index++ ] as RuntimeWord;

                if (word.type == 'NATIVE') {
                    yield word;
                }
                else {
                    yield* word.body.play();
                }

                if (this.$invoke) {
                    let dyn = this.$invoke;
                    this.$invoke = undefined;
                    if (dyn.type == 'NATIVE') {
                        yield dyn;
                    }
                    else {
                        yield* dyn.body.play();
                    }
                }
            }
            this.$index = 0;
        }
    }

}
