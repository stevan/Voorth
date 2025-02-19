

export namespace Scanner {

    export enum ScanType {
        NUMBER   = 'NUMBER',
        STRING   = 'STRING',
        BOOLEAN  = 'BOOLEAN',
        WORD     = 'WORD',
        COMMENT  = 'COMMENT',
    }

    const IS_NUMBER   = /^-?[0-9][0-9_]*$/;
    const IS_STRING   = /^"[^"]*"|'[^']*'$/;
    const IS_BOOLEAN  = /^#t|#f$/;
    const IS_WORD     = /^[&.:]?\S+$/;
    const IS_COMMENT  = /^\/\/\s.*\n$/;

    const SPLITTER = /\/\/\s.*\n|"([^"])*"|'([^'])*'|\S+/g;

    export type Scan       = { type : ScanType, value : string };
    export type ScanStream = Generator<Scan, void, void>

    export function* scan (src : string) : ScanStream {
        let match;
        while ((match = SPLITTER.exec(src)) !== null) {
            let m = match[0] as string;
            switch (true) {
            case IS_COMMENT.test(m):
                yield { type: ScanType.COMMENT, value : m }
                break;
            case IS_STRING.test(m):
                yield { type: ScanType.STRING, value : m }
                break;
            case IS_NUMBER.test(m):
                yield { type: ScanType.NUMBER, value : m }
                break;
            case IS_BOOLEAN.test(m):
                yield { type: ScanType.BOOLEAN, value : m }
                break;
            case IS_WORD.test(m):
                yield { type: ScanType.WORD, value : m }
                break;
            default:
                throw new Error(`Unrecognized match ${m}`);
            }
        }
    }

}
