
import { Words } from './Words'

export namespace Library {

    export class Dictionary {
        private $entries : Map<string, Words.Word>;

        constructor () {
            this.$entries = new Map<string, Words.Word>();
        }

        bind (e : Words.Word) : void { this.$entries.set( e.name, e ) }

        contains (n : string) : boolean { return this.$entries.has(n) }

        fetch (n : string) : Words.Word {
            if (!this.$entries.has(n))
                throw new Error(`Could not fetch (${n}) from Dictionary`);
            return this.$entries.get(n) as Words.Word;
        }
    }
}
