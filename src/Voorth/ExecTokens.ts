
import { Literals } from './Literals';
import { Tokens }   from './Tokens';
import { Words }    from './Words';

export namespace ExecTokens {
    export type ConstToken   = { type : 'CONST',  literal : Literals.Literal }
    export type CallToken    = { type : 'CALL',   word    : Words.UserWord }
    export type BuiltinToken = { type : 'NATIVE', word    : Words.NativeWord }
    export type MoveToken    = { type : 'MOVE',   offset  : number }
    export type CondToken    = { type : 'COND',   offset  : number }
    export type InvokeToken  = { type : 'INVOKE' }

    export type ExecToken =
        | ConstToken
        | CallToken
        | BuiltinToken
        | MoveToken
        | CondToken
        | InvokeToken

    export type ExecStream = Generator<ExecToken, void, void>;

    export function isConstToken   (t : ExecToken) : t is ConstToken   { return t.type == 'CONST'  }
    export function isCallToken    (t : ExecToken) : t is CallToken    { return t.type == 'CALL'   }
    export function isBuiltinToken (t : ExecToken) : t is BuiltinToken { return t.type == 'NATIVE' }
    export function isMoveToken    (t : ExecToken) : t is MoveToken    { return t.type == 'MOVE'   }
    export function isCondToken    (t : ExecToken) : t is CondToken    { return t.type == 'COND'   }
    export function isInvokeToken  (t : ExecToken) : t is InvokeToken  { return t.type == 'INVOKE' }

    export function createConstToken (l : Literals.Literal) : ConstToken {
        return { type : 'CONST', literal : l } as ConstToken
    }

    export function createCallToken (w : Words.UserWord) : CallToken {
        return { type : 'CALL', word : w } as CallToken
    }

    export function createBuiltinToken (w : Words.NativeWord) : BuiltinToken {
        return { type : 'NATIVE', word : w } as BuiltinToken
    }

    export function createMoveToken (o : number) : MoveToken {
        return { type : 'MOVE', offset : o } as MoveToken
    }

    export function createCondToken (o : number) : CondToken {
        return { type : 'COND', offset : o } as CondToken
    }

    export function createInvokeToken () : InvokeToken {
        return { type : 'INVOKE' } as InvokeToken
    }
}
