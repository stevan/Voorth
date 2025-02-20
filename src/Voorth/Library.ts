
import { Words }    from './Words'
import { Literals } from './Literals'

export namespace Library {

    export class Dictionary {
        private $entries : Map<string, Words.Word>;

        constructor () {
            this.$entries = new Map<string, Words.Word>();
        }

        bind (e : Words.Word) : void {
            this.$entries.set(e.name, e);
        }

        lookup (wordRef : Literals.WordRef) : Words.Word | undefined {
            return this.$entries.get(wordRef.name);
        }
    }
}
