
import { Words }    from './Words'
import { Literals } from './Literals'

export namespace Library {

    export class Catalog {
        public shelf : Map<string, Volume>;
        public stack : Volume[];

        constructor () {
            this.shelf = new Map<string, Volume>();
            this.stack = new Array<Volume>();
        }

        createVolume (name : string) : Volume {
            let dict = new Volume(name);
            this.shelf.set(name, dict);
            this.stack.unshift(dict);
            return dict;
        }

        currentVolume     () : Volume { return this.stack[0] as Volume }
        exitCurrentVolume () : void { this.stack.shift() }

        bindToCurrentVolume (e : Words.RuntimeWord) : void {
            this.currentVolume().bind(e);
        }

        lookup (wordRef : Literals.WordRef) : Words.RuntimeWord | undefined {
            // XXX - this could be much better
            for (const dict of this.shelf.values()) {
                let word = dict.lookup(wordRef);
                if (word && Words.isRuntimeWord(word)) {
                    return word as Words.RuntimeWord;
                }
            }
            return undefined;
        }
    }

    export class Volume {
        private $name    : string;
        private $entries : Map<string, Words.RuntimeWord>;

        constructor (name : string) {
            this.$name    = name;
            this.$entries = new Map<string, Words.RuntimeWord>();
        }

        name () : string { return this.$name }

        bind (e : Words.RuntimeWord) : void {
            this.$entries.set(e.name, e);
        }

        lookup (wordRef : Literals.WordRef) : Words.RuntimeWord | undefined {
            return this.$entries.get(wordRef.name);
        }
    }
}
