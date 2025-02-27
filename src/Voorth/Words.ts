
import { Runtime } from './Runtime';
import { Tapes }   from './Tapes';

export namespace Words {

    export type UserWordBody     = Tapes.ExecutableTape;
    export type NativeWordBody   = (runtime : Runtime) => void;

    export type UserWord     = { type : 'USER',   name : string, body : UserWordBody }
    export type NativeWord   = { type : 'NATIVE', name : string, body : NativeWordBody }

    export type RuntimeWord  = UserWord | NativeWord;
    export type Word         = UserWord | NativeWord;

    // -------------------------------------------------------------------------

    export function createUserWord (n : string, b : UserWordBody) : UserWord {
        return { type : 'USER', name : n, body : b } as UserWord
    }

    export function createNativeWord (n : string, b : NativeWordBody) : NativeWord {
        return { type : 'NATIVE', name : n, body : b } as NativeWord
    }

    export function isUserWord     (w : Word) : w is UserWord     { return w.type == 'USER'     }
    export function isNativeWord   (w : Word) : w is NativeWord   { return w.type == 'NATIVE'   }
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


    // -------------------------------------------------------------------------

}
