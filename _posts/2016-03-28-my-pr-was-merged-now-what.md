---
layout: post
title: My pull request was merged! Now what?
---

So, you've just made a contribution to an open-source project on Github by creating a pull request and having it merged by the project's administrators! Congratulations, you're a rockstar! ...But now what do you do? How do you clean up your fork and your local copy of the repository? It's a pretty simple process, but involves a few steps; here they are all written down in one place.

### 1. Pull in the central changes to your local repo

Your PR has been merged, so the changes you made are now in the central repository. You want to pull those in (along with any other changes that might have been made to the central repo since you last updated your fork) to your local copy of the repo.

    git fetch upstream

    git checkout master

    git merge upstream/master

For more info, see [Github Help: Syncing a Fork](https://help.github.com/articles/syncing-a-fork/).

### 2. Push the changes to your fork

Great, now your local copy of the repo is up-to-date. But your fork of the project on Github won't be updated until you push to it, so go ahead and:

    git push origin master

For more info, see  [Github Help: Pushing to a Remote](https://help.github.com/articles/pushing-to-a-remote/).

### 3. [Optional] Delete the branch from your fork

If you want, you can clean up your fork by deleting the branch you made for the PR (you did [make a new feature branch](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) for your work on that feature/bugfix, didn't you?), so that old branches don't start to pile up in your repo.

At the bottom of the Pull Request page on Github, below any comments, there will be a button giving you the option to delete the branch.

![Screenshot: Deleting a PR's branch on Github](https://help.github.com/assets/images/help/pull_requests/delete_branch_button.png)

Push it! (Don't worry, you can un-delete - or "restore" - the branch later if you need to.)

For more info, see [Github Help: Deleting unused branches](https://help.github.com/articles/deleting-unused-branches/).

### 4. [Optional] Delete the branch from your local repo

This has two sub-steps. (For more info, see [this blog post by Fizer Khan](http://www.fizerkhan.com/blog/posts/Clean-up-your-local-branches-after-merge-and-delete-in-GitHub.html).)

##### 4a. Prune the remote tracker for the branch

First, make sure that the right branch(es) will be pruned, using

    git remote show origin

and/or

    git remote prune --dry-run origin

Make sure that only the branch(es) you want to delete are marked as `stale` (if you used `show`) or `[would prune]` (if you used `prune --dry-run`). If everything looks OK, go ahead and actually prune the branch:

    git remote prune origin

##### 4b. Delete your local copy of the branch

You don't have to, but if you want to it's easy:

    git branch -d my-branch


### All done!

Sit back, relax, and enjoy a celebratory glass of bubbly while you bask in the glory of your open-source contribution and immaculately tidy repo. Er, I mean, get to work on that next PR!
