
export namespace Test {

    export class Simple {
        public num_tests : number = 0;
        public failures  : number = 0;

        ok (got : any, msg : string) : void {
            !!(got) ? this.pass(msg) : this.fail(msg)
        }
        is (got : any, expected : any, msg : string) : void {
            got == expected ? this.pass(msg) : this.fail(msg)
        }

        pass (msg : string) : void {
            this.num_tests++;
            console.log(`ok ${this.num_tests} - ${msg}`);
        }

        fail (msg : string) : void {
            this.num_tests++;
            this.failures++;
            console.log(`not ok ${this.num_tests} - ${msg}`);
        }

        done () : void {
            console.log(`1..${this.num_tests}`);
            if (this.failures > 0) {
                console.log(`# Looks like you failed ${this.failures} test of ${this.num_tests}`);
            }
        }
    }
}
