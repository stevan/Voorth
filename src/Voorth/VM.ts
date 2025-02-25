
import { Tether } from './Tether';

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
        | 'JUMP?'
        | 'NOOP'
    ;

    export type Literal = number | string | boolean;

    export type Operator = { type : 'OP',    value : BIF };
    export type Constant = { type : 'CONST', value : Literal };

    export type Instruction = Operator | Constant;

    export type InstructionStream = Generator<Instruction, void, any>;

    export type Stack   = Literal[];
    export type Control = Literal[];

    export function isOperator (i : Instruction) : i is Operator { return i.type == 'OP' }
    export function isConstant (i : Instruction) : i is Constant { return i.type == 'CONST' }

    export class Processor {
        public stack    : Stack;
        public control  : Control;
        public tether   : Tether;

        constructor (tether : Tether) {
            this.stack   = [] as Stack;
            this.control = [] as Control;
            this.tether  = tether;
        }

        run () : void {
            let stack   = this.stack;
            let control = this.control;
            let stream  = this.tether.stream();
            for (const inst of stream) {
                console.log("Running ...", inst);
                switch (true) {
                case isConstant(inst):
                    stack.push(inst.value);
                    break;
                case isOperator(inst):
                    let rhs, lhs, x, y, z;
                    switch (inst.value) {
                    case 'JUMP?':
                        x = stack.pop() as Literal;
                        stream.next(x);
                        break;
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
                console.log("  STACK: ", stack);
                console.log("CONTROL: ", control);
            }

            console.log("  STACK: ", stack);
            console.log("CONTROL: ", control);
        }
    }

}



















