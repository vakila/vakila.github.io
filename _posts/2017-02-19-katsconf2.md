---
layout: post
title: "Notes from KatsConf2"
---

Hello from Dublin! Yesterday I had the privilege of attending [KatsConf2](http://www.katsconf.com/), a functional programming conference put on by the fun-loving, welcoming, and crazy-well-organized [@FunctionalKats](https://twitter.com/functionalkats). It was a whirlwind of really exciting talks from some of the best speakers around. Here's a glimpse into what I learned. 

* There's no such thing as an objectively [perfect programming language](#perfect): all languages make tradeoffs. But it is possible to find/design a language that's more perfect for you and your project's needs.
* Automation, automation, automation: 
  * [Generative programming](#generative) lets you write high-level code that generates low-level code 
  * Program [derivation](#derivation) and [synthesis](#synthesis) let you write specifications/tests and leave it to the computer to figure out the code
  * (Boring!) code rewriting tasks can be [automated](#rug) too
* [Relational programming](#relational), [Total programming and Type-Driven Development](#total) are (cool/mindblowing) things. 
* You can do [web programming with FP](#web) - and interestingly, even in a [total language like Idris](#total). 

I took a bunch of notes during the talks, in case you're hungering for more details. But [@jessitron](https://twitter.com/jessitron) took amazing graphical notes that I've linked to in the talks below, so just go read those! 

And for the complete experience, check out this storify [Vicky Twomey-Lee](https://twitter.com/whykay), who led a great ally skills workshop the evening before the conference, made of the [#KatsConf2](https://twitter.com/hashtag/KatsConf2?src=hash) tweets: 

<div class="storify"><iframe src="//storify.com/whykay/kats-conf-2/embed?template=slideshow" width="100%" height="750" frameborder="no" allowtransparency="true"></iframe><script src="//storify.com/whykay/kats-conf-2.js?template=slideshow"></script><noscript>[<a href="//storify.com/whykay/kats-conf-2" target="_blank">View the story "Kats Conf 2" on Storify</a>]</noscript></div>

Hopefully this gives you an idea of what was said and which brain-exploding things you should go look up now! Personally it opened up a bunch of cans of worms for me - definitely a lot of the material went over my head, but I have a ton of stuff to go find out more (i.e. the first thing) about. 

*Disclaimer: The (unedited!!!) notes below represent my initial impressions of the content of these talks, jotted down as I listened. They may or may not be totally accurate, or precisely/adequately represent what the speakers said or think, and the code examples are almost certainly mistake-ridden. Read at your own risk!* 


## The origin story of FunctionalKats

FunctionalKatas => FunctionalKats => (as of today) FunctionalKubs

* Meetups in Dublin & other locations
* Katas for solving programming problems in different functional languages
* Talks about FP and related topics
* Welcome to all, including beginners


## <a name="perfect"></a>The Perfect Language

**Bodil Stokke @bodil**

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">Bodil&#39;s opinions on the Perfect Language. <a href="https://twitter.com/hashtag/katsConf2?src=hash">#katsConf2</a><br>Rather noninflammatory, it must be early in the morning <a href="https://t.co/KsqGAKubpd">https://t.co/KsqGAKubpd</a></p>&mdash; Jessica Kerr (@jessitron) <a href="https://twitter.com/jessitron/status/832913621181018112">February 18, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

What would the perfect programming language look like?

"MS Excel!"
"Nobody wants to say 'JavaScript' as a joke?"
"Lisp!"
"I know there are Clojurians in the audience, they're suspiciously silent..."

There's no such thing as the perfect language; Languages are about compromise.

What the perfect language actually is is a personal thing.

I get paid to make whatever products I feel like to make life better for programmers. So I thought: I should design the perfect language.

What do I want in a language?

### It should be hard to make mistakes

On that note let's talk about JavaScript.
It was designed to be easy to get into, and not to place too many restrictions on what you can do.
But this means it's easy to make mistakes & get unexpected results (cf. crazy stuff that happens when you add different things in JS).
By restricting the types of inputs/outputs (see TypeScript), we can throw errors for incorrect input types - error messages may look like the compiler yelling at you, but really they're saving you a bunch of work later on by telling you up front.

Let's look at PureScript

Category theory!
Semiring: something like addition/multiplication that has commutativity (a+b == b+a).
Semigroup: ...?

### There should be no ambiguity

`1 + 2 * 3`

vs.

`(+ 1 (* 2 3))`


Pony: `1 + (2 * 3)`  -- have to use parentheses to make precedence explicit

### It shouldn't make you think

Joe made a language at Ericsson in the late 80's called "Erlang". This is a gif of Joe from the Erlang movie. He's my favorite movie star.

Immutability: In Erlang, values and variable bindings never change. At all.

This takes away some cognitive overhead (because we don't have to think about what value a variable has at the moment)

Erlang tends to essentially fold over state: the old state is an input to the function and the new state is an output.

### The "abstraction ceiling"

This term has to do with being able to express abstractions in your language.

Those of you who don't know C: you don't know what you're missing, and I urge you not to find out.
If garbage collection is a thing you don't have to worry about in your language, that's fantastic.

Elm doesn't really let you abstract over the fact that e.g. map over array, list, set is somehow the same type of operation. So you have to provide 3 different variants of a function that can be mapped over any of the 3 types of collections.
This is a bit awkward, but Elm programmers tend not to mind, because there's a tradeoff: the fact that you can't do this makes the type system simple so that Elm programmers get succinct, helpful error messages from the compiler.

I was learning Rust recently and I wanted to be able to express this abstraction. If you have a Collection trait, you can express that you take in a Collection and return a Collection. But you can't specify that the output Collection has to be the same type as the incoming one. Rust doesn't have this ability to deal with this, but they're trying to add it.

We can do this in Haskell, because we have *functors*. And that's the last time I'm going to use a term from category theory, I promise.

On the other hand, in a language like Lisp you can use its metaprogramming capabilities to raise the abstraction ceiling in other ways.  

### Efficiency

I have a colleague and when I suggested using OCaml as an implementation language for our utopian language, she rejected it because it was 50% slower than C.

In slower languages like Python or Ruby you tend to have performance-critical code written in the lower-level language of C.

But my feeling is that in theory, we should be able to take a language like Haskell and build a smarter compiler that can be more efficient.

But the problem is that we're designing languages that are built on the lambda calculus and so on, but the machines they're implemented on are not built on that idea, but rather on the Von Neumann architecture. The computer has to do a lot of contortions to take the beautiful lambda calculus idea and convert it into something that can run on an architecture designed from very different principles. This obviously complicates writing a performant and high-level language.

Rust wanted to provide a language as high-level as possible, but with zero-cost abstractions. So instead of garbage collection, Rust has a type-system-assisted kind of clean up. This is easier to deal with than the C version.

If you want persistent data structures a la Erlang or Clojure, they can be pretty efficient, but simple mutation is always going to be more efficient. We couldn't do PDSs natively.

Suppose you have a langauge that's low-level enough to have zero-cost abstractions, but you can plug in something like garbage collection, currying, perhaps extend the type system, so that you can write high-level programs using that functionality, but it's not actually part of the library. I have no idea how to do this but it would be really cool.

### Summing up

You need to think about:
* Ergonomics
* Abstraction
* Efficiency
* Tooling (often forgotten at first, but very important!)
* Community (Code sharing, Documentation, Education, Marketing)

Your language has to be open source. You can make a proprietary language, and you can make it succeed if you throw enough money at it, but even the successful historical examples of that were eventually open-sourced, which enabled their continued use. I could give a whole other talk about open source.


## <a name="web"></a>Functional programming & static typing for server-side web
**Oskar Wickström @owickstrom**

FP has been influencing JavaScript a lot in the last few years. You have ES6 functional features, libraries like Underscore, Rambda, etc, products like React with FP/FRP at their core, JS as a compile target for functional languages

But the focus is still client-side JS.

Single page applications: using the browser to write apps more like you wrote desktop apps before. Not the same model as perhaps the web browser was intended for at the beginning.

Lots of frameworks to choose from: Angular, Ember, Meteor, React&al. Without JS on the client, you get nothing.

There's been talk recently of "isomorphic" applications: one framework which runs exactly the same way on the esrver and the client. The term is sort of stolen &  not used in the same way as in category theory.

Static typing would be really useful for Middleware, which is a common abstraction but every easy to mess up if dynamically typed. In Clojure if you mess up the middleware you get the Stack Trace of Doom.

Let's use extensible records in PureScript - shout out to Edwin's talk related to this. That inspired me to implement this in PureScript, which started this project called Hyper which is what I'm working on right now in my free time.

Goals:
* Safe HTTP middleware architecture
* Make effects of middleware explicit
* No magic

How?
* Track middleware effects in type system
* leverage extensible records in PureScript
* Provide a common API for middleware
* Write middleware that can work on multiple backends

Design
* Conn: sort of like in Elixer, instead of passing a request and returning a response, pass them all together as a single unit
* Middleware: a function that takes a connection c and returns another connection type c' inside another type m
* Indexed monads: similar to a state monad, but with two additional parameters: the type of the state before this action, and the type after. We can use this to prohibit effectful operations which aren't correct.
* Response state transitions: Hyper uses phantom types to track the state of response, guaranteeing correctness in response side effects


## <a name="derivation"></a>Functional Program Derivation

**@Felienne**

[(Amazing, hand-drawn, animal-filled) Slides](http://www.felienne.com/slides)

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/KatsConf2?src=hash">#KatsConf2</a> notes from <a href="https://twitter.com/Felienne">@Felienne</a> TL;DR Math is good practice at being precise. This helps with programming.  <a href="https://t.co/4QB9xFcLay">https://t.co/4QB9xFcLay</a></p>&mdash; Jessica Kerr (@jessitron) <a href="https://twitter.com/jessitron/status/832938376462532609">February 18, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Program derivation:

Problem => Specification => Derivation => Program

Someone said this is like "refactoring in reverse"

Generalization: introduce parameters instead of constant values

Induction: prove something for a base case and a first step, and you've proven it for all numbers

Induction hypothesis: if you are at step n, you must have been at step n-1 before that.

With these elements, we have a program! We just make an if/else: e.g. for sum(n), if n == 0: return 0; else return sum(n-1) + n

It all comes down to writing the right specification: which is where we need to step away from the keyboard and think.

Induction is the basis of recursion.

We can use induction to create a specification for sorting lists from which we can derive the QuickSort algorithm.

But we get 2 sorting algorithms for the price of 1: if we place a restriction that we can only do one recursive call, we can tweak the specification to derive InsertionSort, thus proving that Insertion Sort is a special case of Quick Sort.

I stole this from a PhD dissertation ("Functional Program Derivation" by <inaudible>). This is all based on program derivation work by Djikstra.  

Takeaways:
* Programming == Math. Practicing some basic math is going to help you write code, even if you won't be doing these kind of exercises on yo ur day-to-day
* Calculations provide insight
* Delay choices where possible. Say "let's assume a solution to this part of the problem" and then go back and solve it later.

I'm writing a whole book on this, if you're interested in giving feedback on chapter drafts let me know! mail at felienne dot com

Q&A:
* is there a link between the specification and the complexity of the program? Yes, the specification has implications for implementation. The choices you make within the specification (e.g. caching values, splitting computation) affect the efficency of the program.
* What about proof assistants? Those are nice if you're writing a dissertation or whatnot, but if you're at the stage where you're practicing this, the exercise is being precise, so I recommend doing this on paper. The second your fingers touch the keyboard, you can outsource your preciseness to the computer.
* Once you've got your specification, how do you ensure that your program meets it? One of the things you could do is write the spec in something like fscheck, or you could convert the specification into tests. Testing and specification are really enriching each other. Writing tests as a way to test your specification is also a good way to go. You should also have some cases for which you know, or have an intuition of, the behavior. But none of this is supposed to go in a machine, it's supposed to be on paper.


## <a name="generative"></a>The cake and eating it: or writing expressive high-level programs that generate fast low-level code at runtime

**Nada Amin @nadamin**

Distinguish stages of computation

* Program generator: basic types (Int, String, T) are executed at code generation time
* Rep(Int), Rep(String), Rep(T) are left as variables in the generated code and executed at program run time(?)

Shonan Challenge for Generative Programming - part of the gen. pro. for HPC literature: you want to generate code that is specialized to a particular matrix
* Demo of generating code to solve this challenge

Generative Programming Patterns
* Deep linguistic reuse
* Turning interpreters into compilers
  - You can think of the process of staging as something which generates code, think of an interpreter as taking code and additional input and creates a result.
  - Putting them together we get something that takes code and symbolic input, and in the interpret stage generates code which takes actual input, which in the execution stage produces a result
  - This idea dates back to 1971, Futamura's Partial Evaluation

* Generating efficient low-level code
  - e.g. for specialized parsers
  - We can take an efficient HTTP parser from 2000+ lines to 200, with parser combinators
  - But while this is great for performance, it leaves big security holes
  - So we can use independent tools to verify the generated code after the fact


Sometimes generating code is not the right solution to your problem

More info on the particular framework I'm using: [Generative Programming for 'Abstraction without Regret'](http://scala-lms.github.io)


## <a name="rug"></a>Rug: an External DSL for Coding Code Transformations (with Scala Parser-Combinators)

**Jessica Kerr @jessitron, Atomist**

The last talk was about abstraction without (performance) regret. This talk is about abstraction without the regret of making your code harder to read.

Elm is a particularly good language to modify automatically, because it's got some boilerplate, but I love that boilerplate! No polymorphism, no type classes - I know exactly what that code is going to do! Reading it is great, but writing it can be a bit of a headache.

As a programmer I want to spend my time thinking about what the users need and what my program is supposed to do. I don't want to spend my time going "Oh no, i forgot to put that thing there".

Here's a simple Elm program that prints "Hello world". The goal is to write a program that modifies this existing Elm code and changes the greeting that we print.

We're going to do this with Scala. The goal is to generate readable code that I can later go ahead and change. It's more like a templating engine, but instead of starting with a templating file it starts from a cromulent Scala program.

Our goal is to parse an Elm file into a parse tree, which give us the meaningful bits of that file.

The "parser" in parser combinators is actually a combination of lexer and parser.

Reuse is dangerous, dependencies are dangerous, because they create coupling. (Controlled, automated)  Cut & Paste is a safer solution.

*at which point @jessitron does some crazy fast live coding to write an Elm parser in Scala*

Rug is the super-cool open-source project I get to work on as my day job now! It's a framework for creating code rewriters

[Repo for this talk](https://github.com/jessitron/kats)

In conclusion: any time my job feels easy, I think "OMG I'm doing it wrong". But I don't want to introduce abstraction into my code, because someone else is going to have difficulty reading that. I want to be able to abstract without sacrificing code readability. I can make my job faster and harder by automating it.


## <a name="relational"></a>Relational Programming

**Will Byrd**

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">Your days are numbered, human programmers. <a href="https://twitter.com/hashtag/KatsConf2?src=hash">#KatsConf2</a> <a href="https://twitter.com/webyrd">@webyrd</a>  <a href="https://t.co/NK8tRg3sei">https://t.co/NK8tRg3sei</a></p>&mdash; Jessica Kerr (@jessitron) <a href="https://twitter.com/jessitron/status/832996092484734977">February 18, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

There are many programming paradigms that don't get enough attention. The one I want to talk about today is Relational Programming. It's somewhat representative of Logic Programming, like Prolog. I want to show you what can happen when you commit fully to the paradigm, and see where that leads us.

Functional Programming is a special case of Relational Programming, as we're going to see in a minute.


What is functional programming about? There's a hint in the name. It's about functions, the idea that representing computation in the form of mathematical functions could be useful. Because you can compose functions, you don have to reason about mutable state, etc. - there are advantages to modeling computation as math. functions.

In relational programming, instead of representing computation as functions we represent it as relations. You can think of a relation in may ways. If you're familiar with relational databases, or you can think in terms of tuples where we want to reason over sets or collections of tuples, or we can think of it in terms of algebra - like high school algebra - where we have variables representing unknown quantities and we have to figure out their values. We'll see that we can get FP as a special case - there's a different set of tradeoffs - but we'll see that when you commit fully to this paradigm you can get some very surprising behavior.

Let's start in our functional world, we're going to write a little program in Scheme or Racket, a little program to manipulate lists. We'll just do something simple like append or concatenate. Let's define append in Scheme:

```
(define append
  (lambda (l s)
    (if (null? l)
        s
        (cons (car l) (append (cdr l) s))))
```

We're going to use a relational programming language called Mini Kanren which is basically an extension that has been applied to lots of languages which allows us to put in variables representing values and ask Kanren to fill in those values.

So I'm going to define `appendo`. (By convention we define our names ending in -o, it's kind of a long story, happy to explain offline.)

*Writes a bunch of Kanren that we don't really understand*

Now I can do:
```
> (run 1 (q) (appendo '(a b c) '(d e) q))
((a b c d e))
```

So far, not very interesting, if this is all it does then it's no better than `append`.
But where it gets interesting is that I can run it backwards to find an input:

```
> (run 1 (X) (appendo '(a, b, c) X (a b c d e)))
((d e))
```

Or I can ask it to find N possible inputs:
```
> (run 2 (X Y) (appendo X Y (a b c d e)))
((a b c d) (e))
((a b c d e) ())
```

Or all possible inputs:
```
> (run* (X Y) (appendo X Y (a b c d e)))
((a b c d) (e))
((a b c d e) ())
...
```

What happens if I do this?
```
> (run* (X Y Z) (appendo X Y Z))
```
It will run forever. This is sort of like a database query, except where the tables are infinite.


One program we could write is an interpreter, an evaluator. We're going to take an `eval` that's written in MiniKanren, which is called `evalo` and takes two arguments: the expression to be evaluated, and the value of that expression.

```
> (run 1 (a) (evalo '(lambda (x) x) q))
((closure x x ()))
```
```
> (run 1 (a) (evalo '(list 'a) q))
((a))
```

Professor <inaudible> wrote a Valentine's day post "99 ways to say 'I love you' in Racket", to teach people Racket by showing 99 different racket expressions that evaluate to the list `(I love you)`

```
> (run 99 (q) (evalo q '(I love you)))
...99 ways...
```

What about quines: a quine is a program that evaluates to itself. How could we find or generate a quine?
```
> (run 1 (q) (evalo q q))
```

And twines: two different programs p and q where p evaluates to q and q evaluates to p.
```
> (run 1 (p q) (=/= p q) (evalo p q) (evalo q p))
...two expressions that basically quote/unquote themselves...
```

What would happen if we run Scheme's `append` in our evaluator?
```
> (run 1 (q)
    (evalo
      `(letrec ((append
                  (lambda (l s)
                    (if (null? l)
                        s
                        (cons (car l)
                              (append (cdr l)
                                      s)))))))
          (append '(a b c) '(d e))
      q))
((a b c d e))
```

But we can put the variable also inside the definition of `append`:
```
> (run 1 (q)
    (evalo
      `(letrec ((append
                  (lambda (l s)
                    (if (null? l)
                        q
                        (cons (car l)
                              (append (cdr l)
                                      s)))))))
          (append '(a b c) '(d e))
      '(a b c d e)))
(s)
```
Now we're starting to synthesize programs, based on specifications. When I gave this talk at PolyConf a couple of years ago Jessitron trolled me about how long it took to run this, since then we've gotten quite a bit faster.

This is a tool called [Barliman](https://github.com/webyrd/Barliman) that I (and Greg Rosenblatt) have been working on, and it's basically a frontend, a dumb GUI to the interpreter we were just playing with. It's just a prototype. We can see a partially specified definition - a Scheme function that's partially defined, with metavariables that are fill-in-the-blanks for some Scheme expressions that we don't know what they are yet. Barliman's going to guess what the definition is going to be.
```
(define ,A
    (lambda ,B
      ,C))
```
Now we give Barliman a bunch of examples. Like `(append '() '())` gives `'()`. It guesses what the missing expressions were based on those examples. The more test cases we give it, the better approximation of the program it guesses. With 3 examples, we can get it to correctly guess the definition of `append`.

Yes, you are going to lose your jobs. Well, some people are going to lose their jobs. This is actually something that concerns me, because this tool is going to get a lot better.

If you want to see the full dog & pony show, watch the [ClojureConj talk](https://youtu.be/er_lLvkklsk) I gave with Greg.

Writing the tests is indeed the harder part. But if you're already doing TDD or property-based testing, you're already writing the tests, why don't you just let the computer figure out the code for you based on those tests?

Some people say this is too hard, the search space is too big. But that's what they said about Go, and it turns out that if you use the right techniques plus a lot of computational power, Go isn't as hard as we thought. I think in about 10-15 years program synthesis won't be as hard as we think now. We'll have much more powerful IDEs, much more powerful synthesis tools. It could even tell you as you're writing your code whether it's inconsistent with your tests.

What this will do for jobs, I don't know. I don't know, maybe it won't pan out, but I can no longer tell you that this definitely won't work. I think we're at the point now where a lot of the academic researchers are looking at a bunch of different parts of synthesis, and no one's really combining them, but when they do, there will be huge breakthroughs. I don't know what it's going to do, but it's going to do something.


## Working hard to keep things lazy

**Raichoo @raichoo**

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">The how, why, and trade offs of non-strictness in Haskell <a href="https://twitter.com/raichoo">@raichoo</a>  <a href="https://twitter.com/hashtag/KatsConf2?src=hash">#KatsConf2</a> <a href="https://t.co/TWkJjW3gL7">https://t.co/TWkJjW3gL7</a></p>&mdash; Jessica Kerr (@jessitron) <a href="https://twitter.com/jessitron/status/833006960207347712">February 18, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Without laziness, we waste a lot of space, because when we have recursion we have to keep allocating memory for each evaluated thing. Laziness allows us to get around that.

What is laziness, from a theoretical standpoint?

The first thing we want to talk about is different ways to evaluate expressions.

```
> f x y = x + y
> f (1 + 1) (2 + 2)  
```
How do we evaluate this?
```
=> (1 + 1) + (2 + 2)
=> 2 + 4
=> 6  
```
This evaluation was normal form

Church-Rosser Theorem: the order of evaluation doesn't matter, ultimately a lambda expression will evaluate to the same thing.

But! We have things like non-termination, and termination can only be determined after the fact.

Here's a way we can think of types: Let's think of a Boolean as something which has three possible values: True, False, and "bottom", which represents not-yet-determined, a computation that hasn't ended yet. True and False are more defined than bottom (e.g. `_|_ <= True`). Partial ordering.

Monotone functions: if we have a function that takes a Bool and returns a Bool, and x and y are bools where `x <= y`, then `f x <= f y`. We can now show that `f _|_ = True` and `f x = False` doesn't work out, because it would have the consequence that `True => False`, which doesn't work - that's a good thing because if it did, we would have solve the halting problem. What's nice here is that if we write a function and evaluate it in normal order, in the lazy way, then this naturally works out.

Laziness is basically non-strictness (this normal order thing I've been talking about the whole time), and sharing.

Laziness lets us reuse code and use combinators. This is something I miss from Haskell when I use any other language.

Honorable mention: Purely Functional Data Structures by Chris Okasaki. When you have Persistent Data Structures, you need laziness to have this whole amortization argument going on. This book introduces its own dialect of ML (lazy ML).

How do we do laziness in Haskell (in GHC)? At an intermediate stage of compilation called STG, Haskell takes unoptimized code and optimizes it to make it lazy. (???)


## <a name="total"></a>Total Functional Programming

**Edwin Brady @edwinbrady**

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">Type driven development of interactive, total programs <a href="https://twitter.com/edwinbrady">@edwinbrady</a> <a href="https://twitter.com/hashtag/KatsConf2?src=hash">#KatsConf2</a>  <a href="https://t.co/KpzHhzXxMX">https://t.co/KpzHhzXxMX</a></p>&mdash; Jessica Kerr (@jessitron) <a href="https://twitter.com/jessitron/status/833021344182915074">February 18, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[Idris](http://www.idris-lang.org/) is a pure functional language with dependent types. It's a "total" language, which means you have program totality: a program either terminates, or gives you new results.

Goals are:
* Encourage type-driven development
* Reduce the cost of writing correct software - giving you more tools to know upfront the program will do the correct thing.

People on the internet say, you can't do X, you can't do Y in a total language. I'm going to do X and Y in a total language.

Types become plans for a program. Define the type up front, and use it to guide writing the program.

You define the program interactively. The compiler should be less like a teacher, and more like a lab assistant. You say "let's work on this" and it says "yes! let me help you".

As you go, you need to refine the type and the program as necessary.

Test-driven development has "red, green, refactor". We have "type, define, refine".

If you care about types, you should also care about totality. You don't have a type that completely describes your program unless your program is total.

Given `f : T`: if program `f` is total, we know that it will always give a result of type T. If it's partial, we only know that *if* it gives a result, it will be type T, but it might crash, run forever, etc. and not give a result.

The difference between total and partial functions in this world: if it's total, we can think of it as a Theorem.

Idris can tell us whether or not it thinks a program is total (though we can't be sure, because we haven't solved the halting problem "yet", as a student once wrote in an assignment). If I write a program that type checks but Idris thinks it's possibly not total, then I've probably done the wrong thing. So in my Idris code I can tell it that some function I'm defining should be `total`.

I can also tell Idris that if I can prove something that's impossible, then I can basically deduce anything, e.g. an alt-fact about arithmetic. We have the `absurd` keyword.

We have Streams, where a Stream is sort of like a list without `nil`, so potentially infinite. As far as the runtime is concerned, this means this is lazy. Even though we have strictness.

Idris uses `IO` like Haskell to write interactive programs. IO is a description of actions that we expect the program to make(?). If you want to write interactive programs that loop, this stops it being total. But we can solve this by describing looping programs as a stream of IO actions. We know that the potentially-infinite loops are only going to get evaluated when we have a bit more information about what the program is going to do.

Turns out, you can use this to write servers, which run forever and accept responses, which are total. (So the people on the internet are wrong).

Check out David Turner's paper "Elementary Strong Functional Programming", where he argues that totality is more important than Turing-completeness, so if you have to give up one you should give up the latter.

Book coming out: [Type-Driven Development with Idris](https://www.tinyurl.com/typedd)
