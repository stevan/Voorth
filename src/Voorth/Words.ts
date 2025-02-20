
import { Tokens }     from './Tokens';
import { ExecTokens } from './ExecTokens';
import { Runtime }    from './Runtime';

export namespace Words {

    export type UserWordBody     = ExecTokens.Tape;
    export type NativeWordBody   = (runtime : Runtime) => void;
    export type CompilerWordBody = (tokens : Tokens.TokenStream, tape : ExecTokens.Tape) => void;

    export type UserWord     = { type : 'USER',     name : string, body : UserWordBody }
    export type NativeWord   = { type : 'NATIVE',   name : string, body : NativeWordBody }
    export type CompilerWord = { type : 'COMPILER', name : string, body : CompilerWordBody }

    export type RuntimeWord  = UserWord | NativeWord;
    export type Word         = UserWord | NativeWord | CompilerWord;

    export type CompiledStream  = Generator<RuntimeWord, void, void>;

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

}
