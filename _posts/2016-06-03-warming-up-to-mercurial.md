---
layout: post
title: Warming up to Mercurial
---

When it comes to [version control](https://en.wikipedia.org/wiki/Version_control), I'm a [Git](https://git-scm.com/) girl. I had to use [Subversion](https://subversion.apache.org/) a little bit for a project in grad school (not distributed == not so fun). But I had never touched [Mercurial](https://www.mercurial-scm.org/) until I decided to contribute to Mozilla's [Marionette](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette), a testing tool for Firefox, for my [Outreachy application]({% post_url 2016-05-23-outreachy-what-how-why %}). Mercurial is the [main version control system](http://mozilla-version-control-tools.readthedocs.io/en/latest/hgmozilla/index.html) for Firefox and Marionette development,<sup id="a1">[1](#f1)</sup> so this gave me a great opportunity to start learning my way around the `hg`. Turns out it's really close to Git, though there are some subtle differences that can be a little tricky. This post documents the basics and the trip-ups I discovered. Although there's plenty of [other](https://www.mercurial-scm.org/wiki/UnderstandingMercurial) [info](https://www.mercurial-scm.org/wiki/GitConcepts)  [out](https://docs.python.org/devguide/gitdevs.html#mercurial-for-git-developers) [there](https://sny.no/hg), I hope some of this might be helpful for others (especially other Gitters) using Mercurial or [contributing to Mozilla code](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Introduction) for the first time. Ready to heat things up? Let's do this!

## Getting my bearings on Planet Mercury

OK, so I've been working through the [Firefox Onramp](http://areweeveryoneyet.org/onramp/desktop.html) to install Mercurial (via the `bootstrap` script) and clone the `mozilla-central` repository, i.e. the source code for Firefox. This is just like Git; all I have to do is:


    $ hg clone <repo>


(Incidentally, I like to pronounce the `hg` command "hug", e.g. "hug clone". Warm fuzzies!)

Cool, I've set foot on a new planet! ...But where am I? What's going on?

Just like in Git, I can find out about the repo's history with [`hg log`](https://www.selenic.com/hg/help/log). Adding some flags make this even more readable: I like to `--limit` the number of changesets (change-whats? more on that later) displayed to a small number, and show the `--graph` to see how changes are related. For example:


    $ hg log --graph --limit 5


or, for short:


    $ hg log -Gl5


This outputs something like:

    @    changeset:   300339:e27fe24a746f
    |\   tag:         tip
    | ~  fxtree:      central
    |    parent:      300125:718e392bad42
    |    parent:      300338:8b89d98ce322
    |    user:        Carsten "Tomcat" Book <cbook@mozilla.com>
    |    date:        Fri Jun 03 12:00:06 2016 +0200
    |    summary:     merge mozilla-inbound to mozilla-central a=merge
    |
    o  changeset:   300338:8b89d98ce322
    |  user:        Jean-Yves Avenard <jyavenard@mozilla.com>
    |  date:        Thu Jun 02 21:08:05 2016 +1000
    |  summary:     Bug 1277508: P2. Add HasPendingDrain convenience method. r=kamidphish
    |
    o  changeset:   300337:9cef6a01859a
    |  user:        Jean-Yves Avenard <jyavenard@mozilla.com>
    |  date:        Thu Jun 02 20:54:33 2016 +1000
    |  summary:     Bug 1277508: P1. Don't attempt to demux new samples while we're currently draining. r=kamidphish
    |
    o  changeset:   300336:f75d7afd686e
    |  user:        Jean-Yves Avenard <jyavenard@mozilla.com>
    |  date:        Fri Jun 03 11:46:36 2016 +1000
    |  summary:     Bug 1277729: Ignore readyState value when reporting the buffered range. r=jwwang
    |
    o  changeset:   300335:71a44348d3b7
    |  user:        Jean-Yves Avenard <jyavenard@mozilla.com>
    ~  date:        Thu Jun 02 17:14:03 2016 +1000
       summary:     Bug 1276184: [MSE] P3. Be consistent with types when accessing track buffer. r=kamidphish


Great! Now what does that all mean?

## Some (confusing) terminology

### Changesets/revisions and their identifiers

According to the official definition, a [**changeset**](https://www.mercurial-scm.org/wiki/ChangeSet) is "an atomic collection of changes to files in a repository." As far as I can tell, this is basically what I would call a *commit* in Gitese. For now, that's how I'm going to think of a changeset, though I'm sure there's some subtle difference that's going to come back to bite me later. Looking forward to it!

Changesets are also called [**revisions**](https://www.mercurial-scm.org/wiki/Revision) (because two names are better than one?), and each one has (confusingly) two identifying numbers: a local *revision number* (a small integer), and a global *changeset ID* (a 40-digit hexadecimal, more like Git's commit IDs). These are what you see in the output of `hg log` above in the format:

    changeset: <revision-number>:<changeset-ID>

For example,

    changeset:   300339:e27fe24a746f

is the changeset with revision number 300339 (its number in *my copy of the repo*) and changeset ID e27fe24a746f (its number *everywhere*).

Why the confusing double-numbering? Well, [apparently](https://www.mercurial-scm.org/wiki/RevisionNumber) because revision numbers are "shorter to type" when you want to refer to a certain changeset locally on the command line; but since revision numbers only apply to your local copy of the repo and will "very likely" be different in another contributor's local copy, you should only use changeset IDs when discussing changes with others. But on the command line I usually just copy-paste the hash I want, so length doesn't really matter, so... I'm just going to ignore revision numbers and always use changeset IDs, OK Mercurial? Cool.

### Branches, bookmarks, heads, and the tip

> I know Git! I know what a "branch" is!  *- Anjana, learning Mercurial*

Yeeeah, about that... Unfortunately, this term in Gitese is a [false friend](https://en.wikipedia.org/wiki/False_friend) of its Mercurialian equivalent.

In the land of Gitania, when it's time to start work on a new bug/feature, I make a new branch, giving it a feature-specific name; do a bunch of work on that branch, merging in master as needed; then merge the branch back into master whenever the feature is complete. I can make as many branches as I want, whenever I want, and give them whatever names I want.

This is because in Git, a "branch" is basically just a pointer (a reference or "ref") to a certain commit, so I can add/delete/change that pointer whenever and however I want without altering the commit(s) at all.  But on Mercury, a [**branch**](https://www.mercurial-scm.org/wiki/Branch) is simply a "diverged" series of changesets; it comes to exist simply by virtue of a given changeset having multiple children, and it doesn't need to have a name. In the output of `hg log --graph`, you can see the branches on the left hand side: continuation of a branch looks like `|`, merging `|\`, and branching `|/`. [Here](https://www.mercurial-scm.org/wiki/GraphlogExtension) are some examples of what that looks like.

Confusingly, Mercuial also has [**named branches**](https://www.mercurial-scm.org/wiki/NamedBranches), which are intended to be longer-lived than branches in Git, and actually become part of a commit's information; when you make a commit on a certain named branch, that branch is part of that commit forever. [This post](https://felipec.wordpress.com/2011/01/16/mercurial-vs-git-its-all-in-the-branches/) has a pretty good explanation of this.

Luckily, Mercurial does have an equivalent to Git's branches: they're called [**bookmarks**](https://www.mercurial-scm.org/wiki/Bookmarks). Like Git branches, Mercurial bookmarks are just handy references to certain commits. I can create a new one thus:

    $ hg bookmark my-awesome-bookmark

When I make it, it will point to the changeset I'm currently on, and if I commit more work, it will move forward to point to my most recent changeset. Once I've created a bookmark, I can use its name pretty much anywhere I can use a changeset ID, to refer to the changeset the bookmark is pointing to: e.g. to point to the bookmark I can do `hg up my-awesome-bookmark`. I can see all my bookmarks and the changesets they're pointing to with the command:

    $ hg bookmarks

which outputs something like:

       loadvars                  298655:fe18ebae0d9c
       resetstats                300075:81795401c97b
     * my-awesome-bookmark       300339:e27fe24a746f

When I'm on a bookmark, it's "active"; the currently active bookmark is indicated with a `*`.

> OK, maybe I was wrong about branches, but at least I know what the "HEAD" is!  *- Anjana, a bit later*

Yeah, nope. I think of the "HEAD" in Git as the branch (or commit, if I'm in "detached HEAD" state) I'm currently on, i.e. a pointer to (the pointer to) the commit that would end up the parent of whatever I commit next. In Mercurial, this doesn't seem to have a special name like "HEAD", but it's indicated in the output of `hg log --graph` by the symbol `@`. However, Mercurial documentation does talk about [**heads**](https://www.mercurial-scm.org/wiki/Head), which are just the most recent changesets on all branches (regardless of whether those branches have names or bookmarks pointing to them or not).<sup id="a2">[2](#f2)</sup> You can see all those with the command `hg heads`.

The head which is the most recent changeset, period, gets a special name: the [**tip**](https://www.mercurial-scm.org/wiki/Head). This is another slight difference from Git, where we can talk about "the tip of a branch", and therefore have several tips. In Mercurial, there is only one. It's labeled in the output of `hg log` with `tag: tip`.

### Recap: Mercurial glossary

| Term | Meaning |
| ----- | ----- |
| [branch](https://www.mercurial-scm.org/wiki/Branch) | a "diverged" series of changesets; doesn't need to have a name |
| [bookmark](https://www.mercurial-scm.org/wiki/Bookmarks) | a named reference to a given commit; can be used much like a Git branch |
| [heads](https://www.mercurial-scm.org/wiki/Head) | the last changesets on each diverged branch, i.e. changesets which have no children |
| [tip](https://www.mercurial-scm.org/wiki/Head) | the most recent changeset in the entire history (regardless of branch structure) |


## All the world's a stage (but Mercury's not the world)

Just like with Git, I can use `hg status` to see the changes I'm about to commit before committing with `hg commit`. However, what's missing is the part where it tells me which changes are *staged*, i.e. "to be committed". Turns out the concept of "staging" is unique to Git; Mercurial doesn't have it. That means that when you type `hg commit`, any changes to any tracked files in the repo will be committed; you don't have to manually stage them like you do with `git add <file>` (`hg add <file>` is only used to tell Mercurial to track a new file that it's not tracking yet).

However, just like you can use [`git add --patch`]({% post_url 2015-11-17-git-add-patch %}) to stage individual changes to a certain file a la carte, you can use the now-standard [record extension](https://www.mercurial-scm.org/wiki/RecordExtension) to commit only certain files or parts of files at a time with `hg commit --interactive`. I haven't yet had occasion to use this myself, but I'm looking forward to it!

## Turning back time

I can mess with my Mercurial history in almost exactly the same way as I would in Git, although whereas this functionality is built in to Git, in Mercurial it's accomplished by means of extensions. I can use the [rebase extension](https://www.mercurial-scm.org/wiki/RebaseExtension) to rebase a series of changesets (say, the parents of the active bookmark location) onto a given changeset (say, the latest change I pulled from `central`) with `hg rebase`, and I can use the `hg histedit` command provided by the [histedit extension](https://www.mercurial-scm.org/wiki/HisteditExtension) to reorder, edit, and squash (or "fold", to use the Mercurialian term) changesets like I would with `git rebase --interactive`.

## My Mozilla workflow

In my [recent work](https://bugzilla.mozilla.org/show_bug.cgi?id=1275269) refactoring and adding unit tests for [Marionette](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette)'s Python test runner, I use a workflow that goes something like this.

I'm gonna start work on a new bug/feature, so first I want to make a new bookmark for work that will branch off of `central`:

    $ hg up central
    $ hg bookmark my-feature

Now I go ahead and do some work, and when I'm ready to commit it I simply do:

    $ hg commit

which opens my default editor so that I can write a super great commit message. It's going to be informative and [formatted properly](http://mozilla-version-control-tools.readthedocs.io/en/latest/mozreview/commits.html#formatting-commit-messages-to-influence-behavior) for [MozReview](http://mozilla-version-control-tools.readthedocs.io/en/latest/mozreview.html)/[Bugzilla](https://bugzilla.mozilla.org/), so it might look something like this:

    Bug 1275269 - Add tests for _add_tests; r?maja_zf

    Add tests for BaseMarionetteTestRunner._add_tests:
    Test that _add_tests populates self.tests with correct tests;
    Test that invalid test names cause _add_tests to
    throw Exception and report invalid names as expected.

After working for a while, it's possible that some new changes have come in on `central` (this happens about daily), so I may need to rebase my work on top of them. I can do that with:

    $ hg pull central

followed by:

    $ hg rebase -d central

which rebases the commits in the branch that my bookmark points to onto the most recent changeset in `central`. Note that this assumes that the bookmark I want to rebase is currently active (I can check if it is with `hg bookmarks`).

Then maybe I commit some more work, so that now I have a series of commits on my bookmark. But perhaps I want to reorder them, squash some together, or edit commit messages; no problemo, I just do a quick:

    $ hg histedit


which opens a [history](https://www.mercurial-scm.org/wiki/HisteditExtension#line-1-3) listing all the changesets on my bookmark. I can edit that file to `pick`, `fold` (squash), or `edit` changesets in pretty much the same way I would using `git rebase --interactive`.

When I'm satisfied with the history, I [push my changes to review](http://mozilla-version-control-tools.readthedocs.io/en/latest/mozreview/commits.html#submitting-commits-for-review):

    $ hg push review

My special Mozillian configuration of Mercurial, which a wizard helped me set up during [installation](https://developer.mozilla.org/en-US/docs/Mozilla/Mercurial/Installing_Mercurial), magically prepares everything for MozReview and then asks me if I want to

    publish these review requests now (Yn)?

To which I of course say `Y` (or, you know, realize I made a horrible mistake, say `n`, go back and re-do everything, and then push to review again).

Then I just wait for review feedback from my mentor, and perhaps make some changes and amend my commits based on that feedback, and push those to review again.

Ultimately, once the review has passed, my changes get merged into `mozilla-inbound`, then eventually `mozilla-central` (more on what that all means in a future post), and I become an official contributor. Yay! :)

## So is this goodbye Git?

Nah, I'll still be using Git as my go-to version control system for my own projects, and another Mozilla project I'm contributing to, [Perfherder](https://wiki.mozilla.org/EngineeringProductivity/Projects/Perfherder), has its code on [Github](https://github.com/mozilla/treeherder), so Git is the default for that.

But learning to use Mercurial, like learning any new tool, has been educational! Although my progress was (and still is) a bit slow as I get used to the differences in features/workflow (which, I should reiterate, are quite minor when coming from Git), I've learned a bit more about version control systems in general, and some of the design decisions that have gone into these two. Plus, I've been able to contribute to a great open-source project! I'd call that a win. Thanks Mercurial, you deserve a `hg`. :)

## Further reading

* [Understanding Mercurial](https://www.mercurial-scm.org/wiki/UnderstandingMercurial) and [Mercurial for Git users](https://www.mercurial-scm.org/wiki/GitConcepts) on the Mercurial wiki
* [Mercurial for git developers](https://docs.python.org/devguide/gitdevs.html) from the Python Developer's Guide
* [Mercurial Tips](https://sny.no/hg) from Mozilla developer Andreas Tolfsen (:ato)
* [Mercurial vs Git; it's all in the branches](https://felipec.wordpress.com/2011/01/16/mercurial-vs-git-its-all-in-the-branches/) by Felipe Contreras

#### Notes

<b id="f1">1</b> However, there is a small but ardent faction of Mozilla devs who refuse to stop using [Git](https://developer.mozilla.org/en-US/docs/Mozilla/Git). Despite being a Gitter, I chose to forego this option and use Mercurial because a) it's the default, so most of the documentation etc. assumes it's what you're using, and b) I figured it was a good chance to get to know a new tool. [↩](#a1)

<b id="f2">2</b> Git actually uses this term the same way; the tips of all branches are stored in `.git/refs/heads`. But in my experience the term "heads" doesn't pop up as often in Git as in Mercurial. Maybe this is because in Git we can talk about "branches" instead? [↩](#a2)
