
export namespace Logger {

    export enum Level {
        INFO  = 1,
        WARN  = 2,
        ERROR = 3,
        DEBUG = 4,
    }

    export const LOG_LABELS : string[] = [
        ".o(INFO)",
        "^^[WARN]",
        "!{ERROR}",
        "?<DEBUG>",
    ];

    const ESC       = '\u001B[';
    const RESET     = ESC + '0m';
    const LT_GRAY   = ESC + '38;2;200;200;200;m';
    const DK_GRAY   = ESC + '38;2;125;125;125;m';
    const MSG_COLOR = ESC + '38;2;150;200;255;m';

    export const LOG_COLORS : string[] = [
        ESC + '96m',
        ESC + '93m',
        ESC + '91m',
        ESC + '92m',
    ];

    const ColorMap = new Map<string, string>();

    function fetchColorFor(name : string) : string {
        if (!ColorMap.has(name)) {
            ColorMap.set(name,
                ESC + '38;2;' + [
                    Math.trunc(Math.random() * 100),
                    Math.trunc(Math.random() * 100),
                    Math.trunc(Math.random() * 100),
                ].map((c) => c + 150)
                 .join(';') + ';m'
            );
        }
        return ColorMap.get(name) as string;
    }

    function colorizeMessage (msg : any) : string {
        if (typeof msg === 'string') {
            let match = msg.match(/^(\S+)/);
            if (match) {
                let m = match[0] as string;
                let c = fetchColorFor(m);
                return c + msg;
            }
            else {
                return msg;
            }
        } else {
            return JSON.stringify(msg);
        }
    }

    export const DEBUG     : string = process.env['DEBUG'] ?? '';
    export const LOG_LEVEL : number = DEBUG ? parseInt(DEBUG) : 0;

    export function LOG (level : Level, ...msgs : any[]) : void {
        if (level > LOG_LEVEL) return;

        let stackDepth = 0;
        let stackTrace = '';
        if (level == Level.DEBUG) {
            let error = new Error();
            let stack = error.stack ?? '';
            let trace = stack.toString();
            let lines = trace.split("\n").map((s) => s.trim());
            lines.shift(); // Error message
            lines.shift(); // LOG line
            lines = lines.filter((line) => {
                return (
                    line.indexOf('ts-node') == -1 &&
                    line.indexOf('node:internal') == -1
                );
            });
            if (LOG_LEVEL > Level.DEBUG) {
                stackDepth = lines.length;
                stackTrace = DK_GRAY;
                for (let i = 0; i < lines.length; i++) {
                    stackTrace += " ".repeat(stackDepth + 9);
                    if (i == 0) {
                        stackTrace += "╰┬─▶ ";
                    } else if (i == lines.length - 1) {
                        stackTrace += " ╰─▶ ";
                    } else {
                        stackTrace += " ├─▶ ";
                    }
                    stackTrace += lines[i] + "\n";
                }
            }
        }

        process.stderr.write(
            LT_GRAY
            + "◦".repeat(stackDepth)
                + LOG_COLORS[level - 1] as string
                + LOG_LABELS[level - 1] as string
                + ((stackDepth) ? DK_GRAY + '─╮ ' : ' │ ')
                + MSG_COLOR
                + msgs.map((m) => colorizeMessage(m)).join(' ')
            + "\n"
            + stackTrace
            + RESET
        );
    }

}

export const INFO      = Logger.Level.INFO;
export const WARN      = Logger.Level.WARN;
export const ERROR     = Logger.Level.ERROR;
export const DEBUG     = Logger.Level.DEBUG;
export const LOG_LEVEL = Logger.LOG_LEVEL;
export const LOG       = Logger.LOG;
