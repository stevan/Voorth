<!----------------------------------------------------------------------------->
# TODO
<!----------------------------------------------------------------------------->

- make JIT/Mix Interpreter
    - compile Literal into NativeWord
        - squashes runs of Literal tokens into one NativeWord

    - needs a Tape that can mix
        - so interpreter sees a continual stream of tokens
            - regardless of the source word
    - needs a Tape that can invoke
        - so that we can jump to a dynamic word and not disrupt the stream

    - binds Jumps to the correct Tape
        - this is nessecary since the Interpreter only sees one stream
            - so the tape in scope is often not the one being run

NOTES:
    - `INVOKE!`
        - converted to a NativeWord that handles telling the tape to invoke()
    - `BRANCH!`
        - this is converted to a MixToken.JUMP since it is unconditional jump()
    - `BRANCH?`
        - this is converted to NativeWord that handles checking the condition
           and performing the jump() accordingly

- JitTokens  // to be understood by the JITInterpreter
    - RUN  : Words.NativeWord

- MixTokens // to be understood by the MixTape
    - MOVE : offset   // unconditional jump
    - CALL : Words.RuntimeWord
    // this will `yeild word`, or `yield* word.body` accordingly
    // so that to always produce a stream of JitTokens.RUN and never CALL
    - CONST : compile this into a NativeWord and returns RUN token




<!----------------------------------------------------------------------------->
## Ponder
<!----------------------------------------------------------------------------->

- inner/outer interpreter?
