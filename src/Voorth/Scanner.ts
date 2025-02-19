

export namespace Scanner {

    export type Scanner = Generator<string, void, void>

    const NUMBERS  = /-?[0-9][0-9_]*/;
    const STRINGS  = /"[^"]*"|'[^']*'/;
    const BOOLEANS = /#t|#f/;
    const WORDS    = /[&.:]?\S+/;
    const CONTROLS = /IF|THEN|ELSE|BEGIN|UNTIL|WHILE|REPEAT|DO|LOOP/;
    const PLATFORM = /BRANCH[!?]|INVOKE\!/;
    const COMMENT  = /\/\/\s.*\n/;

    const SPLITTER = new RegExp(
        [
            COMMENT,
            CONTROLS,
            PLATFORM,
            STRINGS,
            NUMBERS,
            BOOLEANS,
            WORDS,
        ].map((r) => r.source).join('|'), 'g'
    );

    export function* scan (src : string) : Scanner {
        let match;
        while ((match = SPLITTER.exec(src)) !== null) {
            let m = match[0] as string;
            yield m;
        }
    }

    export function isNumber   (s : string) : boolean { return NUMBERS.test(s)  }
    export function isString   (s : string) : boolean { return STRINGS.test(s)  }
    export function isBoolean  (s : string) : boolean { return BOOLEANS.test(s) }
    export function isWord     (s : string) : boolean { return WORDS.test(s)    }
    export function isControl  (s : string) : boolean { return CONTROLS.test(s) }
    export function isPlatform (s : string) : boolean { return PLATFORM.test(s) }
    export function isComment  (s : string) : boolean { return COMMENT.test(s)  }
}
