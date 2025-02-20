
export namespace Tokens {

    export type NumberToken  = { type : 'NUMBER',  value : string }
    export type StringToken  = { type : 'STRING',  value : string }
    export type BooleanToken = { type : 'BOOLEAN', value : string }
    export type WordToken    = { type : 'WORD',    value : string }
    export type CommentToken = { type : 'COMMENT', value : string }

    export type Token =
        | NumberToken
        | StringToken
        | BooleanToken
        | WordToken
        | CommentToken

    export type LiteralToken = NumberToken | StringToken | BooleanToken

    export type TokenStream = Generator<Token, void, void>

    export function isNumberToken  (t : Token) : t is NumberToken  { return t.type == 'NUMBER'  }
    export function isStringToken  (t : Token) : t is StringToken  { return t.type == 'STRING'  }
    export function isBooleanToken (t : Token) : t is BooleanToken { return t.type == 'BOOLEAN' }
    export function isWordToken    (t : Token) : t is WordToken    { return t.type == 'WORD'    }
    export function isCommentToken (t : Token) : t is CommentToken { return t.type == 'COMMENT' }
    export function isLiteralToken (t : Token) : t is LiteralToken {
        return isNumberToken(t) || isStringToken(t) || isBooleanToken(t)
    }

    const IS_NUMBER   = /^-?[0-9][0-9_]*$/;
    const IS_STRING   = /^"[^"]*"|'[^']*'$/;
    const IS_BOOLEAN  = /^#t|#f$/;
    const IS_WORD     = /^\S+$/;
    const IS_COMMENT  = /^\/\/\s.*\n$/;

    const SPLITTER = /\/\/\s.*\n|"([^"])*"|'([^'])*'|\S+/g;

    export function* tokenize (src : string) : TokenStream {
        let match;
        while ((match = SPLITTER.exec(src)) !== null) {
            let m = match[0] as string;
            switch (true) {
            case IS_COMMENT.test(m):
                yield { type: 'COMMENT', value : m }
                break;
            case IS_STRING.test(m):
                yield { type: 'STRING', value : m }
                break;
            case IS_NUMBER.test(m):
                yield { type: 'NUMBER', value : m }
                break;
            case IS_BOOLEAN.test(m):
                yield { type: 'BOOLEAN', value : m }
                break;
            case IS_WORD.test(m):
                yield { type: 'WORD', value : m }
                break;
            default:
                throw new Error(`Unrecognized match ${m}`);
            }
        }
    }

}
