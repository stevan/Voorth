
import { DEBUG, LOG } from './Util/Logger';

export namespace Tokens {

    export type TokenMeta = {
        // TODO - add info about soure and position, etc.
        synthetized? : string
    };

    export type NumberToken  = { type : 'NUMBER',  value : string, meta : TokenMeta }
    export type StringToken  = { type : 'STRING',  value : string, meta : TokenMeta }
    export type BooleanToken = { type : 'BOOLEAN', value : string, meta : TokenMeta }
    export type WordToken    = { type : 'WORD',    value : string, meta : TokenMeta }
    export type JumpToken    = { type : 'JUMP',   offset : number, conditional : boolean, meta : TokenMeta }
    export type CommentToken = { type : 'COMMENT', value : string, meta : TokenMeta }

    export type Token =
        | NumberToken
        | StringToken
        | BooleanToken
        | WordToken
        | JumpToken
        | CommentToken

    export type LiteralToken = NumberToken | StringToken | BooleanToken

    export type TokenStream = Generator<Token, void, void>

    export function isNumberToken  (t : Token) : t is NumberToken  { return t.type == 'NUMBER'  }
    export function isStringToken  (t : Token) : t is StringToken  { return t.type == 'STRING'  }
    export function isBooleanToken (t : Token) : t is BooleanToken { return t.type == 'BOOLEAN' }
    export function isWordToken    (t : Token) : t is WordToken    { return t.type == 'WORD'    }
    export function isJumpToken    (t : Token) : t is JumpToken    { return t.type == 'JUMP'    }
    export function isCommentToken (t : Token) : t is CommentToken { return t.type == 'COMMENT' }
    export function isLiteralToken (t : Token) : t is LiteralToken {
        return isNumberToken(t) || isStringToken(t) || isBooleanToken(t)
    }

    export function createNumberToken (v : string, m : TokenMeta = {} as TokenMeta) : NumberToken {
        return { type : 'NUMBER', value : v, meta : m } as NumberToken
    }

    export function createStringToken (v : string, m : TokenMeta = {} as TokenMeta) : StringToken {
        return { type : 'STRING', value : v, meta : m } as StringToken
    }

    export function createBooleanToken (v : string, m : TokenMeta = {} as TokenMeta) : BooleanToken {
        return { type : 'BOOLEAN', value : v, meta : m } as BooleanToken
    }

    export function createWordToken (v : string, m : TokenMeta = {} as TokenMeta) : WordToken {
        return { type : 'WORD', value : v, meta : m } as WordToken
    }

    export function createJumpToken (o : number, m : TokenMeta = {} as TokenMeta) : JumpToken {
        return { type : 'JUMP', offset: o, conditional : false, meta : m } as JumpToken
    }

    export function createConditionalJumpToken (o : number, m : TokenMeta = {} as TokenMeta) : JumpToken {
        return { type : 'JUMP', offset: o, conditional : true, meta : m } as JumpToken
    }

    const IS_NUMBER   = /^-?[0-9][0-9_]*$/;
    const IS_STRING   = /^"[^"]*"|'[^']*'$/;
    const IS_BOOLEAN  = /^#t|#f$/;
    const IS_WORD     = /^\S+$/;
    const IS_COMMENT  = /^\/\/\s.*\n$/;

    const SPLITTER = /\/\/\s.*\n|"([^"])*"|'([^'])*'|\S+/g;

    export function* tokenize (src : string, includeComments : boolean = false) : TokenStream {
        let match;
        while ((match = SPLITTER.exec(src)) !== null) {
            let m = match[0] as string;
            LOG(DEBUG, "TOKENIZING", m);
            switch (true) {
            case IS_COMMENT.test(m):
                if (includeComments) {
                    yield { type: 'COMMENT', value : m, meta : {} as TokenMeta } as CommentToken
                }
                break;
            case IS_STRING.test(m):
                yield createStringToken(m)
                break;
            case IS_NUMBER.test(m):
                yield createNumberToken(m)
                break;
            case IS_BOOLEAN.test(m):
                yield createBooleanToken(m)
                break;
            case IS_WORD.test(m):
                yield createWordToken(m)
                break;
            default:
                throw new Error(`Unrecognized match ${m}`);
            }
        }
        LOG(DEBUG, "TOKENIZING !DONE");
    }

}
