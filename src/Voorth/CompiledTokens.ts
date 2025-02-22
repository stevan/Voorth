
import { Literals } from './Literals';
import { Tokens }   from './Tokens';

export namespace CompiledTokens {
    export type ConstToken  = { type : 'CONST', literal : Literals.Literal }
    export type CallToken   = { type : 'CALL',  wordRef : Literals.WordRef }
    export type MoveToken   = { type : 'MOVE',  jump    : Tokens.JumpToken }

    export type CompiledToken =
        | ConstToken
        | CallToken
        | MoveToken

    export type CompiledStream = Generator<CompiledToken, void, void>;

    export function isConstToken (t : CompiledToken) : t is ConstToken { return t.type == 'CONST'  }
    export function isCallToken  (t : CompiledToken) : t is CallToken  { return t.type == 'CALL'   }
    export function isMoveToken  (t : CompiledToken) : t is MoveToken  { return t.type == 'MOVE'   }

    export function createConstToken (l : Literals.Literal) : ConstToken {
        return { type : 'CONST', literal : l } as ConstToken
    }

    export function createCallToken (w : Literals.WordRef) : CallToken {
        return { type : 'CALL', wordRef : w } as CallToken
    }

    export function createMoveToken (j : Tokens.JumpToken) : MoveToken {
        return { type : 'MOVE', jump : j } as MoveToken
    }
}
