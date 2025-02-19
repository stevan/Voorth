
export namespace Values {

    // -------------------------------------------------------------------------
    // Scalars
    // -------------------------------------------------------------------------

    export interface Literal {
        toNum  () : number;
        toBool () : boolean;
        toStr  () : string;
    }

    abstract class Value {}

    export class Bool extends Value implements Literal {
        constructor(public value : boolean) { super() }
        toNum  () : number  { return this.value ? 1 : 0 }
        toBool () : boolean { return this.value }
        toStr  () : string  { return this.value.toString() }

        // TODO:
        // invert
        // equals
    }

    export class Num extends Value implements Literal {
        constructor(public value : number) { super() }
        toNum  () : number  { return this.value }
        toBool () : boolean { return this.value != 0 ? true : false }
        toStr  () : string  { return this.value.toString() }

        // TODO:
        // negate
        // add, sub, mul, div, mod
        // equals
        // compare
    }

    export class Str extends Value implements Literal {
        constructor(public value : string) { super() }
        toNum  () : number  { return parseInt(this.value) }
        toBool () : boolean { return this.value != '' ? true : false }
        toStr  () : string  { return this.value }

        // TODO:
        // length
        // concat
        // equals
        // compare
    }

    export class WordLiteral extends Value {
        constructor(public name : string) { super() }

        // TODO:
        // length?
        // equals
    }

    // -------------------------------------------------------------------------
    // Containers
    // -------------------------------------------------------------------------

    export class Tuple extends Value {
        private $items : Value[] = [];

        constructor(public size : number) { super() }

        get (i : number) : Value { return this.$items[i] as Value }
        set (i : number, l : Value) : void { this.$items[i] = l }

        // TODO:
        // length
        // equals
    }

    export class Stack extends Value {
        private $items : Value[] = [];

        constructor() { super() }

        get size () : number { return this.$items.length }

        push (l : Value) : void { this.$items.push(l) }
        pop  () : Value { return this.$items.pop()  as Value }
        peek () : Value { return this.$items.at(-1) as Value }
        drop () : void    { this.$items.pop(); }

        // TODO:
        // length
        // equals
    }

    export class Queue extends Value {
        private $items : Value[] = [];

        constructor() { super() }

        get size () : number { return this.$items.length }

        enqueue (l : Value) : void { this.$items.unshift(l) }
        dequeue () : Value { return this.$items.pop() as Value }
        drop    () : void  { this.$items.pop(); }

        // TODO:
        // length
        // equals
    }

}
