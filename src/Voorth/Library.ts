
import { Words }    from './Words'
import { Literals } from './Literals'

export namespace Library {

    export class Dictionary<T extends Words.Word> {
        private $entries : Map<string, T>;

        constructor () {
            this.$entries = new Map<string, T>();
        }

        bind (e : T) : void {
            this.$entries.set(e.name, e);
        }

        lookup (wordRef : Literals.WordRef) : T | undefined {
            return this.$entries.get(wordRef.name);
        }
    }

    export class RuntimeDict extends Dictionary<Words.RuntimeWord>  {}
    export class CompileDict extends Dictionary<Words.CompilerWord> {}
}
