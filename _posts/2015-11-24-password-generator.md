---
layout: post
title: "Comic-inspired pairing"
---

Today at the [Recurse Center](http://www.recurse.com), [Shad](https://github.com/Shadhopson) and I both had a spare half-hour, so we decided to do a little [pair programming](https://en.wikipedia.org/wiki/Pair_programming). (Pairing is a common occurrence at RC; it's one way Recursers take advantage of each others' experience, curiosity, and energy. And it's so much fun!)

We both like web comics (Shad recently turned me on to the excellent [Strong Female Protagonist](http://strongfemaleprotagonist.com/)), and being computery people, of course we're big fans of [xkcd](http://xkcd.com/).

So, on this particular afternoon we took inspiration from an xkcd strip about [password strength](http://xkcd.com/936/), and decided to make a toy [password generator](http://vakila.github.io/rc-projects/xkcd-pass/). The idea is that a password consisting of four common English words is easier for you to remember and harder for hackers to guess:
![xkcd: Password strength](http://imgs.xkcd.com/comics/password_strength.png)

The main challenge we faced was a non-technical one: finding a list of common English words. Wikipedia turned us on to [Ogden's Basic English word lists](https://en.wikipedia.org/wiki/Basic_English#Word_lists), and we managed to find a [little BitBucket project](https://bitbucket.org/snippets/gravitywell_ltd/bqzj) that had an array of all the words in the [Basic English combined word list] (thanks, Lucian Buzzo!).

Once we got our hands on the word list, it was a simple matter of randomly selecting a word from the list, making sure it fit certain criteria (e.g. minimum and maximum length, doesn't include "-", etc.), and then adding it to the password. Once we've selected four words this way, the password is ready to display!

However, that password is **not** secure. As fellow Recurser [Benjamin](https://github.com/bgilbert) pointed out, the `Math.random()` function that we use to "randomly" select an index from the word array is not cryptographically secure, meaning it's in theory possible for someone else to predict which "random" value will be returned by the function, and therefore to guess your password. Since we built this password generator as a toy and an excuse for a quick half-hour of pairing fun, that's OK with us. But if we wanted to get serious, we could go back and use `window.crypto.getRandomValues()` from the Web Crypto API instead. Maybe some day!

As it is, the password generator is still really fun. Some of my favorites so far:

* `technology-must-study-computer` (!!!)
* `such-about-regret-dropped` (Good for you, [doge](https://en.wikipedia.org/wiki/Doge_(meme))!)
* `thousand-horsepower-outskirts-mania` (I think I've seen that [movie](http://www.imdb.com/title/tt1392190/)...)


But don't take my word for it; [try it out](http://vakila.github.io/rc-projects/xkcd-pass/) yourself!
