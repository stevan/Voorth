
import { Literals } from './Literals';
import { Tokens }   from './Tokens';

export namespace ExecTokens {

    export type ConstToken  = { type : 'CONST', literal   : Literals.Literal }
    export type CallToken   = { type : 'CALL',  wordRef   : Literals.WordRef }
    export type MoveToken   = { type : 'MOVE',  jumpToken : Tokens.JumpToken }
    export type InvokeToken = { type : 'INVOKE' }
    export type WaitToken   = { type : 'WAIT'   }
    export type ExitToken   = { type : 'EXIT'   }

    export type ExecToken =
        | ConstToken
        | CallToken
        | InvokeToken
        | MoveToken
        | WaitToken
        | ExitToken

    export type ExecStream = Generator<ExecToken, void, void>;

    export function isConstToken  (t : ExecToken) : t is ConstToken  { return t.type == 'CONST'  }
    export function isCallToken   (t : ExecToken) : t is CallToken   { return t.type == 'CALL'   }
    export function isInvokeToken (t : ExecToken) : t is InvokeToken { return t.type == 'INVOKE' }
    export function isMoveToken   (t : ExecToken) : t is MoveToken   { return t.type == 'MOVE'   }
    export function isWaitToken   (t : ExecToken) : t is WaitToken   { return t.type == 'WAIT'   }
    export function isExitToken   (t : ExecToken) : t is ExitToken   { return t.type == 'EXIT'   }

    export function createConstToken (l : Literals.Literal) : ConstToken {
        return { type : 'CONST', literal : l } as ConstToken
    }

    export function createCallToken (w : Literals.WordRef) : CallToken {
        return { type : 'CALL', wordRef : w } as CallToken
    }

    export function createMoveToken (j : Tokens.JumpToken) : MoveToken {
        return { type : 'MOVE', jumpToken : j } as MoveToken
    }

    export function createInvokeToken () : InvokeToken { return { type : 'INVOKE' } as InvokeToken }
    export function createWaitToken   () : WaitToken   { return { type : 'WAIT'   } as WaitToken   }
    export function createExitToken   () : ExitToken   { return { type : 'EXIT'   } as ExitToken   }

    export class Tape {
        private $index   : number;
        private $tokens  : ExecToken[];

        constructor (tokens? : ExecToken[]) {
            this.$index  = 0;
            this.$tokens = tokens ? tokens : new Array<ExecToken>();
        }

        length () : number { return this.$tokens.length }

        load (source : ExecToken[]) {
            this.$tokens.push(...source);
        }

        loadStream (source : ExecStream) {
            this.$tokens.push(...source);
        }

        jump (offset : number) : void {
            this.$index += offset;
        }

        *play () : ExecStream {
            while (this.$index < this.$tokens.length) {
                let token = this.$tokens[ this.$index++ ] as ExecToken;
                yield token;
            }
            this.$index = 0;
        }
    }
}
