
export namespace Logger {

    export enum Level {
        INFO  = 1,
        WARN  = 2,
        ERROR = 3,
        DEBUG = 4,
    }

    export const LOG_LABELS : string[] = [
        ".o(INFO) : ",
        "^^[WARN] : ",
        "!{ERROR} : ",
        "?<DEBUG> : ",
    ];

    const ESC   = '\u001B[';
    const RESET = ESC + "0m";

    export const LOG_COLORS : string[] = [
        ESC + "96m",
        ESC + "93m",
        ESC + "91m",
        ESC + "92m",
    ];

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
                stackTrace = lines.map((line) => {
                    return " ".repeat(stackDepth)
                         + "      -> : "
                         + line
                }).join("\n") + "\n";
            }
        }

        process.stderr.write(
            ".".repeat(stackDepth)
            + LOG_COLORS[level - 1] as string
            + LOG_LABELS[level - 1] as string
            + msgs.join(' ')
            + RESET
            + "\n"
            + stackTrace
        );
    }

}

export const INFO      = Logger.Level.INFO;
export const WARN      = Logger.Level.WARN;
export const ERROR     = Logger.Level.ERROR;
export const DEBUG     = Logger.Level.DEBUG;
export const LOG_LEVEL = Logger.LOG_LEVEL;
export const LOG       = Logger.LOG;
