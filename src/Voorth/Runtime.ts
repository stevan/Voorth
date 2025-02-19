
import { Values }  from './Values';
import { Library } from './Library';

export class Runtime {
    public stack   : Values.Stack;
    public control : Values.Stack;
    public dict    : Library.Dictionary;

    constructor () {
        this.stack   = new Values.Stack();
        this.control = new Values.Stack();
        this.dict    = new Library.Dictionary();
    }

}
