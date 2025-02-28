
import { DEBUG, LOG } from './Util/Logger';

export namespace VM {

    export type BIF =
        | 'DUP'  | 'DROP'
        | 'SWAP' | 'OVER'
        | 'ROT'  | '-ROT' | 'RDUP'
        | '+'    | '-'    | '*'   | '/'   | '%'
        | '=='   | '!='
        | '<'    | '<='   | '>'   | '>='
        | '~'
        | '>R!'  | '<R!'  | '.R!' | '^R!'
        | 'NOOP'
    ;

    export type ChannelRequestOp =
        | 'JUMP?'
        | 'CALL?'
    ;

    export type ChannelResponseOp =
        | 'JUMP!'
        | 'CALL!'
    ;

    export type Literal = number | string | boolean;

    export type Operator        = { type : 'OP',    bif : BIF };
    export type Constant        = { type : 'CONST', value : Literal };
    export type ChannelRequest  = { type : 'CREQ',  op : ChannelRequestOp };
    export type ChannelResponse = { type : 'CRES',  op : ChannelResponseOp, value : Literal };

    export type Instruction       = Operator | Constant | ChannelRequest;
    export type InstructionStream = Generator<Instruction, void, ChannelResponse | undefined>;

    export type Stack   = Literal[];
    export type Control = Literal[];

    export function isOperator       (i : Instruction) : i is Operator       { return i.type == 'OP' }
    export function isConstant       (i : Instruction) : i is Constant       { return i.type == 'CONST' }
    export function isChannelRequest (i : Instruction) : i is ChannelRequest { return i.type == 'CREQ' }

    export interface Tether {
        onReady (f : () => void) : void;
        stream  ()               : InstructionStream;
    }

    export class ProcessingUnit {
        public stack    : Stack;
        public control  : Control;
        public tether   : Tether;

        constructor (tether : Tether) {
            this.stack   = [] as Stack;
            this.control = [] as Control;
            this.tether  = tether;
        }

        ready () : Promise<ProcessingUnit> {
            return new Promise<ProcessingUnit>((resolved) => {
                this.tether.onReady(() => resolved(this.run()));
            });
        }

        run () : ProcessingUnit {
            LOG(DEBUG, "VM // RUN");
            let stream = this.tether.stream();
            for (const inst of stream) {
                this.execute(inst, stream, this.stack, this.control);
            }
            LOG(DEBUG, "VM // RUN !DONE");
            return this;
        }

        execute (
            inst    : Instruction,
            stream  : InstructionStream,
            stack   : Stack,
            control : Control,
        ) : void {
            LOG(DEBUG, "VM // EXECUTE", inst);
            let rhs, lhs, x, y, z;
            switch (true) {
            case isConstant(inst):
                stack.push(inst.value);
                break;
            case isChannelRequest(inst):
                switch (inst.op) {
                case 'JUMP?':
                    x = stack.pop() as Literal;
                    stream.next({ type : 'CRES', op : 'JUMP!', value : x });
                    break;
                case 'CALL?':
                    x = stack.pop() as Literal;
                    stream.next({ type : 'CRES', op : 'CALL!', value : x });
                    break;
                default:
                    throw new Error(`Unrecognized channel request ${inst}`);
                }
                break;
            case isOperator(inst):
                switch (inst.bif) {
                // stack
                case 'DROP':
                    stack.pop();
                    break;
                case 'DUP':
                    stack.push(stack.at(-1) as Literal);
                    break;
                case 'OVER':
                    stack.push(stack.at(-2) as Literal);
                    break;
                case 'RDUP':
                    stack.push(stack.at(-3) as Literal);
                    break;
                case 'SWAP':
                    x = stack.pop() as Literal;
                    y = stack.pop() as Literal;
                    stack.push(x);
                    stack.push(y);
                    break;
                case 'ROT':
                    x = stack.pop() as Literal;
                    y = stack.pop() as Literal;
                    z = stack.pop() as Literal;
                    stack.push(y);
                    stack.push(x);
                    stack.push(z);
                    break;
                case '-ROT':
                    x = stack.pop() as Literal;
                    y = stack.pop() as Literal;
                    z = stack.pop() as Literal;
                    stack.push(x);
                    stack.push(z);
                    stack.push(y);
                    break;
                // control
                case '>R!':
                    control.push(stack.pop() as Literal);
                    break;
                case '<R!':
                    stack.push(control.pop() as Literal);
                    break;
                case '.R!':
                    stack.push(control.at(-1) as Literal);
                    break;
                case '^R!':
                    control.pop();
                    break;
                // string
                case '~':
                    rhs = stack.pop() as Literal;
                    lhs = stack.pop() as Literal;
                    stack.push(lhs.toString() + rhs.toString());
                    break;
                // math
                case '+':
                    rhs = stack.pop() as number;
                    lhs = stack.pop() as number;
                    stack.push(lhs + rhs);
                    break;
                case '-':
                    rhs = stack.pop() as number;
                    lhs = stack.pop() as number;
                    stack.push(lhs - rhs);
                    break;
                case '*':
                    rhs = stack.pop() as number;
                    lhs = stack.pop() as number;
                    stack.push(lhs * rhs);
                    break;
                case '/':
                    rhs = stack.pop() as number;
                    lhs = stack.pop() as number;
                    stack.push(lhs / rhs);
                    break;
                case '%':
                    rhs = stack.pop() as number;
                    lhs = stack.pop() as number;
                    stack.push(lhs % rhs);
                    break;
                // equality
                case '==':
                    rhs = stack.pop() as Literal;
                    lhs = stack.pop() as Literal;
                    stack.push(lhs == rhs);
                    break;
                case '!=':
                    rhs = stack.pop() as Literal;
                    lhs = stack.pop() as Literal;
                    stack.push(lhs != rhs);
                    break;
                // comparisons
                case '<':
                    rhs = stack.pop() as Literal;
                    lhs = stack.pop() as Literal;
                    stack.push(lhs < rhs);
                    break;
                case '>':
                    rhs = stack.pop() as Literal;
                    lhs = stack.pop() as Literal;
                    stack.push(lhs > rhs);
                    break;
                case '>=':
                    rhs = stack.pop() as Literal;
                    lhs = stack.pop() as Literal;
                    stack.push(lhs >= rhs);
                    break;
                case '<=':
                    rhs = stack.pop() as Literal;
                    lhs = stack.pop() as Literal;
                    stack.push(lhs <= rhs);
                    break;
                default:
                    throw new Error(`Unrecognized operator ${inst}`);
                }
                break;
            default:
                throw new Error(`Unrecognized instruction ${inst}`);
            }
            //Logger.LOG("  STACK: ", stack);
            //Logger.LOG("CONTROL: ", control);
            LOG(DEBUG, "VM // EXECUTE !DONE");
        }
    }

}

