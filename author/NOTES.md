
## Literals

### Numeric

```
1
-1
100
10_000
```

### Strings
```
"Hello World"
```

### Booleans
```
#t
#f
```

### Tuple

Tuples are of a fixed size, and are not indexable

```
(n).             // create a new tuple of n size
*Tuple* ().?     // get the size of the tuple
*Tuple* ().1     // get the first value of the tuple
*Tuple* ().2     // get the second value of the tuple, etc.
```

### Stacks

```
[_]                pushes a Stack on the stack
*Stack* [?_]        pushes the Stack length onto the stack
*Stack* $n [>_]     pop $n items from the stack, push them into Stack
*Stack* $n [<_]     pop $n items from Stack push them onto the stack
*Stack* $n [^_]     drop $n items from Stack (does not affect the stack)
*Stack* $n [._]     peek $n items from Stack and push them onto the stack

dup   [+_]
over  [_+]
swap  [%_]
rot   [@_]
```

### Queues

```
[=]                 pushes a Queue on the stack
*Queue* [?=]        pushes the Queue length onto the stack
*Queue* $n [>=]     pop $n items from the stack, put them into Queue
*Queue* $n [<=]     get $n items from Stack push them onto the stack
*Queue* $n [^=]     drop $n items from Stack (does not affect the stack)
```

## Words

### Definition
```
:say ( s -- ) "\n" SWAP ~ PRINT!;

:greet ( s -- )
    "Hello " SWAP ~ .say;

// or with more traditional Forth style spacing
: greet ( s -- )
    "Hello " SWAP ~ .say ;
```
### Evaluating
```
.greet
```
### First Class Functions
```
&greet INVOKE!
```

## Types

```
n num  number
s str  string
b bool boolean
l lit  literal   // n | s | b
w word
S Stack
Q Queue
```

### Signatures

Every word has a signature, which defines the state of the stack before and
after the word is run.

```
//    ( before --  after )
:word ( P .. P -- R .. R )
```

## Namespaces

They are just nested dictionaries
```
.say               // in the top level
.time.now          // in the time subdictionary
```
```
: time.later ( -- n ) .time.now 1 + ;
```

## Variables

Global variables only (for now) ... allocated at compile time.
```
$ var <value> ;
```
This creates the following words to handle them ...
```
>var     pop from the stack, store in the variable
<var     clear the variable and push onto the stack
.var     copy the variable and push onto the stack
^var     clear the variable (does not affect the stack)
?var     query if variable is defined, pushes bool on the stack
&var     puts a reference to the variable on the stack
```

## Control Structures

### Conditionals

    <bool> IF <body*> THEN                 if statement
    <bool> IF <body*> ELSE <body*> THEN    if else statement

### Loops

    <end> <start> DO <body*> LOOP          loops from <start> to <end> and executes the <body*>
    BEGIN <body*> <bool> UNTIL             executes <body*> until the <bool> condition is false
    BEGIN <bool> WHILE <body*> REPEAT      executes <body*> until the <bool> condition is true

## Platform Builtins

### Stack

    DUP        ( a     -- a a   )      duplicate the top of the stack
    SWAP       ( b a   -- a b   )      swap the top two items on the stack
    DROP       ( a     --       )      drop the item at the top of the stack
    OVER       ( b a   -- b a b )      like DUP, but for the second item on the stack
    ROT        ( c b a -- b a c )      rotate the 3rd item to the top of the stack

### Math

    +          ( n n -- n )            addition
    -          ( n n -- n )            subtraction
    *          ( n n -- n )            multiplication
    /          ( n n -- n )            division
    %          ( n n -- n )            modulo

### Equality

    ==         ( l l -- b )            equal
    !=         ( l l -- b )            not equal

### Conditions

    <          ( l l -- b )            less than
    <=         ( l l -- b )            less than or equal
    >          ( l l -- b )            greater than
    >=         ( l l -- b )            greater than or equal

### Stings

    ~          ( l l -- s )            string concat

### Control

    >R!        ( a --   ) ( a --   )   take from stack and push onto control stack
    <R!        (   -- a ) (   -- a )   take from control stack and push onto stack
    .R!        (   -- a ) ( a -- a )   push top of control stack onto stack
    ^R!        (   --   ) (   --   )   drop the top of the control stack

    HERE!      (   --   ) ( L --   )   puts the current address on the controls stack

    BRANCH!    (   --   ) ( L --   )   jump to address on the control stack
    BRANCH?    ( b --   ) ( L --   )   conditional jump to address on the control stack

### OS
    SLEEP!     ( n --   )              sleep for n seconds

### I/O
    PRINT!     ( l --   )              print string to output

## Conventions

```
>     pop from the stack, push into something
<     pop from something push onto the stack
.     peek from something and push onto the stack
^     drop from something (does not affect the stack)
?     query if something is available, pushes bool on the stack
&     puts a reference to something on the stack
```

With the expection of the built in stack operations (`DUP`, `SWAP`, etc) all
other platform builtins will be in all caps and end with a `!` character.

## Internal Types

### Label

They cannot be passed around, only created on the control stack

## Decompilation

### IF THEN
```
0 > IF "Yes" .say THEN
```
```
    0 >              //        ( #t ) (   )
    [                // `IF    (    ) (   ) enter compilation mode,
       >A            // `IF    (    ) (   ) ( A1 ) push current address on the stack
    ]+               // `IF    (    ) ( $ ) and leave the top of the address stack on the control stack
    ?BRANCH!         // IF     ( #t ) ( $ )
    "Yes" .say       //
    [                // `THEN  (    ) (   )
        >A           // `THEN  (    ) (   ) ( A1 A2 ) << A2 will end up in first to call ]+
    ]-               // `THEN  (    ) (   )
                     // THEN   (    ) (   )
```
```
0 > IF "Yes" .say ELSE "No" .say THEN
```
### IF ELSE THEN
```
    0 >              //        ( #t ) (   )
    [                // `IF    (    ) (   ) enter compilation mode,
       >A            // `IF    (    ) (   ) ( A1 ) push current address on the stack
    ]+               // `IF    (    ) ( $ ) and leave the top of the address stack on the control stack
    ?BRANCH!         // IF     ( #t ) ( $ )
    "Yes" .say       //
    [                // `ELSE  (    ) (   ) enter compilation mode,
       >A            // `ELSE  (    ) (   ) ( A1 A2 ) push current address on the stack
    ]+               // `ELSE  (    ) ( $ ) and leave the top of the address stack on the control stack
    ?BRANCH!         // ELSE   ( #t ) ( $ )
    "No" .say        //
    [                // `THEN  (    ) (   )
        >A           // `THEN  (    ) (   ) ( A1 A2 A3 ) << A3 will end up in first to call ]+
    ]-               // `THEN  (    ) (   )
                     // THEN   (    ) (   )
```

### DO LOOP

```
10 1 DO "Hello" .say LOOP
```
```
    10 0              //       (      10 0 ) (        )
    HERE!             // DO    (      10 0 ) (      L ) // when branching to this label, it is executed again
    SWAP              // DO    (      0 10 ) (      L )
    >R                // DO    (         0 ) (   L 10 )
    1 + >R            // DO    (           ) ( L 10 1 )
    "Hello" .say
    <R                // LOOP  (         1 ) (   L 10 )
    <R                // LOOP  (      1 10 ) (      L )
    OVER OVER         // LOOP  ( 1 10 1 10 ) (      L )
    >                 // LOOP  (   1 10 #f ) (      L )
    ?BRANCH!          // LOOP  (      1 10 ) (        ) // consumes the label and jumps back
```

### BEGIN UNTIL

```
BEGIN


UNTIL
```
```
```

### BEGIN WHILE REPEAT

```
BEGIN

WHILE

REPEAT
```
```
```


