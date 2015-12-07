---
layout: post
title: Cleaner commits with `git add -p`
---

Today I learned how to use `git add -p` (short for `git add --patch`) to make smaller, cleaner, more isolated git commits. My life is changed.

## When to use it

Let me paint you a picture...

I'm working on a really fun project (the [Kimi](https://github.com/vakila/kimi) interpreter), and am so in the zone that I forget to commit for a couple of hours.
During that time I make a bunch of different changes to a certain file, `kimi.py`, and some of those changes don't have anything to do with one another conceptually, i.e. relate to different features/bugfixes.

At this point, if I stage all my changes with `git add kimi.py`, I'll have a commit which globs together all the different things I did.

!['Git Commit' on XKCD](https://imgs.xkcd.com/comics/git_commit.png)
*[XKCD](https://imgs.xkcd.com/comics/git_commit.png) knows my pain*

So what?

Well, if later on, after committing, I decide that most of the changes in that commit were useful, but one was a real fuck-up and I want to revert the commit, I'd have to manually go back and redo all of my other changes.
That sounds like a pain in the ass, no?

But wait! The `--patch` flag to the rescue!

## How it works

If I run `git add --patch kimi.py` or `git add -p kimi.py` instead of the regular `git add kimi.py`, git divides the edits I've made into separate "hunks", and launches a nice little interactive interface which lets me pick and choose which hunks to stage for the next commit. It presents the hunks one-by-one in the order they appear in the file, and gives me the following options for each hunk:

    y - stage this hunk
    n - do not stage this hunk
    q - quit; do not stage this hunk or any of the remaining ones
    a - stage this hunk and all later hunks in the file
    d - do not stage this hunk or any of the later hunks in the file
    g - select a hunk to go to
    / - search for a hunk matching the given regex
    j - leave this hunk undecided, see next undecided hunk
    J - leave this hunk undecided, see next hunk
    k - leave this hunk undecided, see previous undecided hunk
    K - leave this hunk undecided, see previous hunk
    s - split the current hunk into smaller hunks
    e - manually edit the current hunk
    ? - print help

This allows me to make separate commits for the different parts of the file I edited, so that each commit is conceptually independent of the others. Now, if I later decide that one of those hunks was a mistake, I can simply revert that commit, and all of my other changes remain in place.

If I want to make sure I've staged the right hunks, I can run `git diff --staged` to see exactly which changes are staged before making the commit.

It's not perfect; for example, it's only aware of position in the code, so it can't distinguish two conceptually different changes that are right next to each other, as in:

    - this is an old line I deleted
    + (topic 1) this is a new line I added
    + (topic 1) this is another line related to the one above
    + (topic 2) this is a new line related to a different topic
    
...but that would be expecting too much.

In any case, you shouldn't be using `--patch` as an excuse to be more lazy about your committing habits. **Commit early, commit often, and work on one thing at a time.** But in those *rare* (ahem) cases  where for whatever reason you got behind on your git organization, `--patch` is your friend!

---
*Sources:*

* [Commit only part of a file in Git](http://stackoverflow.com/questions/1085162/commit-only-part-of-a-file-in-git) on StackOverflow
* Info from typing `help` while in the `git add -p file.ext` dialog
