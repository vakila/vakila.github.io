---
layout: post
title: "Outreachy halftime(ish) update"
---

It feels like yesterday that I [started my Outreachy internship]({% post_url 2016-05-23-outreachy-what-how-why %}), but it was actually over 2 months ago! For the last couple of weeks I've been on Outreachy hiatus because of [EuroPython](https://ep2016.europython.eu/en/), moving from [Saarbrücken to Berlin](https://goo.gl/maps/Rp7qp5Dvg5C2), and my mentor being on vacation. Now I'm back, with 6 weeks left in my internship! So it seems like a good moment to check in and reflect on how things have been going so far, and what's in store for the left of my time as an Outreachyee.

## What have I been up to?

### Learning how to do the work

In the rather involved application process for Outreachy, I already had to spend quite a bit of time figuring out the process for making even the tiniest contribution to the Mozilla codebase. But obviously one can't learn everything there is to know about a project within a couple of weeks, so a good chunk of my Outreachy time so far was spent on getting better acquainted with:

* **The tools**

  I've already written about my learning experiences with [Mercurial]({% post_url 2016-06-03-warming-up-to-mercurial %}), but there were a lot of other components of the Mozilla development process that I had to learn about (and am still learning about), such as [Bugzilla](https://bugzilla.mozilla.org/), [MozReview](http://mozilla-version-control-tools.readthedocs.io/en/latest/mozreview.html), [Treeherder](https://wiki.mozilla.org/EngineeringProductivity/Projects/Treeherder), [Try](https://wiki.mozilla.org/ReleaseEngineering/TryServer), [Mach](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/mach)... I could go on, but you get the idea.
  Then, since the project I'm working focuses on testing, I had to deepen my understanding (or acquire an understanding in the first place) of tools like [Pytest](http://docs.pytest.org/en/latest/) and [Mock](https://docs.python.org/3/library/unittest.mock.html). Luckily, everything is Python, which I was already familiar with, but since I'm certainly not an expert in the language (working on it!), I've also been picking up useful Python tidbits here and there. For example, recently I've been working on [including Pytest in the Firefox codebase](https://bugzilla.mozilla.org/show_bug.cgi?id=1253359) (aka putting it "in the tree" aka "vendoring it in") so that we can use a [plugin](https://github.com/davehunt/pytest-mozlog) that connects Pytest to the logging tool [MozLog](http://mozbase.readthedocs.io/en/latest/mozlog.html) to improve how the Marionette harness tests produce logs, and in connection with that I've been learning a bit more about e.g. how Python packaging and package distribution.

* **The project**

  My internship project, ["Test-driven refactoring of Marionette's Python test runner"](https://wiki.mozilla.org/Outreachy#Test-driven_Refactoring_of_Marionette.27s_Python_Test_Runner), relates to a component of the Marionette project, which encompasses a lot of moving parts. Even figuring out what Marionette is, what components it comprises, how these interrelate, and which of them I need to know about, was a non-trivial task. That's why I'm writing a couple of posts about the project itself - [one down]({% post_url 2016-07-08-marionette-act-i-automation %}), one to go - to crystallize what I've learned and hopefully make it a little easier for other people to get through the what-even-is-it steps that I've been going through. This post is a sort of "intermission", so stay tuned for my upcoming post on the Marionette test runner and harness!


### Doing the work

Of course, there's a reason I've been trying to wrap my head around all the stuff I just mentioned: so that I can actually do this project! So what is the actual work I've been doing, i.e. my overall contribution to Mozilla as an Outreachy intern?
Well, to quote the [project description](https://wiki.mozilla.org/Outreachy#Test-driven_Refactoring_of_Marionette.27s_Python_Test_Runner):

> we're testing the thing that runs Firefox tests

The "thing" is the Marionette test runner, a tool written in Python that allows us to run tests that make use of [Marionette](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette) to automate the browser. It's responsible for things like discovering which tests we need to run, setting up all the necessary prerequisites, running the tests one by one, and logging all of the results. I'll describe it in much more detail in the aforementioned upcoming blog post "Marionette Act II", but that's the basic idea.

Since the test runner is essentially a program like any other, it can be broken just like any other! And since it's used in automation to run the tests that let Firefox developers know if some new change they've introduced breaks something, if the test runner itself breaks, that could cause a lot of problems. So what do we do? We test it!

That's where I come in. My mentor, Maja, had started writing some unit tests for the test runner before the internship began. My job is to continue adding tests to this

* Reading [the code](https://dxr.mozilla.org/mozilla-central/source/testing/marionette/harness/marionette/runner/base.py) to identify things that could break and cause problems, and thus should be tested
* Writing [new](https://bugzilla.mozilla.org/show_bug.cgi?id=1275288) [unit](https://bugzilla.mozilla.org/show_bug.cgi?id=1276974) [tests](https://bugzilla.mozilla.org/show_bug.cgi?id=1287591#c4) using Pytest
* [Refactoring](https://bugzilla.mozilla.org/show_bug.cgi?id=1275269) the code to make it easier to test, more readable, easier to extend/change, or otherwise better

Aside from the testing side of things, another aspect of the project (which I particularly enjoy) involves improving how the runner relates to the rest of the world. For example, improving the [command line interface](https://bugzilla.mozilla.org/show_bug.cgi?id=1237958) to the runner, or making sure the unit tests for the runner are producing [logs](https://bugzilla.mozilla.org/show_bug.cgi?id=1285299) that play nicely with the rest of the Mozilla ecosystem.


### Writing stuff down

As you can see, I've also been spending a fair bit of time writing blog [p]({% post_url 2016-05-23-outreachy-what-how-why %})[o]({% post_url 2016-06-03-warming-up-to-mercurial %})[s]({% post_url 2016-06-16-i-want-to-mock-with-you %})[t]({% post_url 2016-06-20-mozilla-london-all-hands-2016 %})[s]({% post_url 2016-07-08-marionette-act-i-automation %}) about what I've been learning and encountering over the course of my internship. Hopefully these have been or will be useful to others who might also be wrapping their heads around, say, [Mercurial]({% post_url 2016-06-03-warming-up-to-mercurial %}) for the first time. But regardless, they've certainly been useful for me as a way of firming up my (sometimes shaky) understanding of a new technology or topic, and/or diving deeper into a topic than I might have done otherwise - for example, writing a post on [browser automation with Marionette]({% post_url 2016-07-08-marionette-act-i-automation %}) gave me a concrete reason to really try to wrap my head around this system, instead of just chugging along with my internship work with only a vague, yeah-I-sort-of-think-I-know-what-it-does understanding of it.


## What's been fun?

### Learning all the things

  Through this project, I've gotten to learn how to use lots of new tools: some of them more Mozilla-specific (like Bugzilla or Treeherder), and some less (e.g. Mercurial, Pytest, and Mock). While working with a new system or technology can often be frustrating, especially when you're used to something similar-but-not-quite-the-same (ahem, [git and hg]({% post_url 2016-06-03-warming-up-to-mercurial %})), I've found that the frustration always subsides eventually (though sometimes later rather than sooner, to be sure), and in its place you find not only the newfound ease of working with the given thing-you-just-learned, but also the gratification that comes with the knowledge, "Hey! I learned the thing!" - and this makes the whole experience more fun & rewarding than frustrating, in my experience.

### Working remotely

  This internship has been my first experience with a lifestyle that always attracted me: working remotely. I love the freedom of being able to work from home if I have things to take care of around the house, or at a cafe if I just really need to sip on a Chocolate Chai Soy Latte right now, or from the public library if I want some peace & quiet. I also love being able to escape Germany for 2 weeks to visit my boyfriend's family in Italy, or to work a day out of the Berlin office if I'm there for a long weekend looking at apartments. Now that I've moved to Berlin, I love the option of working out of the office here if I want to, or working from home or a cafe if I have things I need to take care of on the other side of the city. All of these things can remove some of the stresses that come with feeling tethered to a particular office and/or city, which I remember well from working office-based jobs. And because the team I'm working on is also completely distributed, there's a great infrastructure already in place (IRC, video conferences, collaborative documents) to enable us to work in completely different countries/time zones and still feel connected. It has its disadvantages, of course (more on that in a bit), but so far I've been really enjoying the independence, freedom, and flexibility of working remotely.

### Helping others get started contributing!

  A couple of weeks ago I got to mentor my first bug on Bugzilla, and help someone else get started contributing to the thing that I had gotten started contributing to a few months ago for my Outreachy internship. Although it was a pretty simple & trivial thing, the very fact of seeing someone else wanting to get involved, and knowing the answers to a couple of their questions, made me realize what makes open source communities like Mozilla so special in the first place. It's really amazing to see people come together like this around a technology, and to see how the knowledge about it gets passed almost organically from one contributor to the next, with employees and long-standing volunteers providing stability and expertise. That's the kind of thing that really makes me want to continue working with FOSS projects after my internship ends, and makes me so appreciative of initiatives like Outreachy that help bring newcomers like me into this community.

## What's been hard?

### Impostor Syndrome

  The flip side of the learning-stuff fun is that, especially at the beginning, ye olde Impostor Syndrome gets to run amok. When I started my internship, I had the feeling that I had Absolutely No Idea what I was doing -- over the past couple of months it has gotten gradually better, but I still have the feeling that I have a Shaky and Vague Idea of what I'm doing. From my communications with other current/former Outreachy interns, this seems to be par for the course, and I suppose it's par for the course for anyone joining a new project or team for the first time. But even if it's normal, it's still there, and it's still hard.

### Working remotely

  As I mentioned, overall I've been really enjoying the remote-work lifestyle, but it does have its drawbacks. When working from home, I find it incredibly difficult to separate my working time from my not-working time, which is most often manifested in my complete inability to stop working at the end of the day. Because I don't have to physically walk away from my computer, at the end of the day, say around 7:00pm, I think "Oh, I'll just do that one last thing," and the next thing I know the Last Thing has led to 10 other Last Things and now it's 11:00pm and I've been working for 13 hours straight. Not healthy, not fun. Also, while the flexibility and freedom of not having a fixed place of work is great, moving around (e.g. from Germany to Italy to other side of Germany) can also be chaotic and stressful, and can make working (productively) more difficult -- especially if you're not sure where your next internet is going to come from. So the remote work thing is really a double-edged sword, and doing in a way that preserves both flexibility and stability is clearly a balancing act that takes some practice. I'm working on it.

### Measuring productivity

  Speaking of working productively, how do you know when you're doing it? The nature of the Outreachy system is that every project is different, and the target outcomes (or lack thereof) are determined by the project mentor, and whether or not your work is satisfactory is entirely a matter of their judgment. Luckily, my mentor is extremely fair, open, clear, and realistic about her goals for the project, which we've been gradually checking in on and adjusting (though actually not departing much from my initial guess as to the project timeline) as the internship goes on. She's also been very reassuring when I've expressed concerns about productivity and forthcoming with feedback about her satisfaction with my progress. But I feel like this is just my good luck at getting chosen for a project with a mentor who a) is an awesome person and b) was an Outreachy intern herself once, and can thus empathize. I do wonder how my experience would be different, especially from the standpoint of knowing whether I'm measuring up to expectations, if I were on a different project with a different mentor. Which brings me to...



## What's been helpful?

### Having a fantastic mentor

  As I've just said, I feel really lucky to be working with my mentor, Maja. She's been an incredible support throughout the internship, and has just made it a great experience. I'm really thankful for her for being so detailed & thorough in her initial conception of the project and instructions to me, and for being so consistently responsive and helpful with any of my questions or concerns. I can't imagine a better mentor.

### Being part of a team

  "It takes a village," or whatever they say, and my village is the Automation crew (who hang out in [#automation](irc://irc.mozilla.org/#automation) on IRC) within the slightly-larger village of the Engineering Productivity team (A-Team) ([#ateam](irc://irc.mozilla.org/#ateam)). Just like my mentor, the rest of the crew and the team have also been really friendly and helpful to me so far. If Maja's not there, if I'm working on some adjacent component, or if I have some general question, they've been there for me. And while having a fantastic mentor is fantastic, having a fantastic mentor within a fantastic team is double-fantastic, because it helps with the hard things like learning new tools or working remotely (especially when your mentor is in a different time zone, but other team members are in yours). So I'm also really grateful to the whole team for taking me in and treating me as one of their own.

### Attending All Hands

  Apparently, at some point in the last couple of years, someone at Mozilla decided to start including Outreachy interns in the semi-annual All Hands meetings. Whoever made that decision, please accept my heartfelt thanks on behalf of myself and the rest of the Outreachy interns who got to attend the [London All Hands]({% post_url 2016-06-20-mozilla-london-all-hands-2016 %}) back in June. Being included in this meeting made a real difference - not only because it gave me a chance to attend presentations that illuminated various components of the Mozilla infrastructure that had previously been confusing or unclear to me, but also because the chance to meet and socialize with team members and other Outreachy interns face-to-face was a huge help in dealing with e.g. Impostor Syndrome and the challenges of working on a distributed team. I'm so glad I was able to join that meeting, because it really helped me feel more bonded to both Mozilla as a whole and to my specific team/project, and I hope for the sake of both Mozilla and Outreachy that Outreachyees continue to be invited to such gatherings.

### Intern solidarity

  Early on in the internship, one of the other Mozilla Outreachy interns started a channel just for us on Mozilla's IRC. Having a "safe space" to check in with the other interns, ask "dumb" questions, express insecurities/frustrations, and just generally support each other is immensely helpful. On top of that, several of us got to hang out in person at the London All Hands meeting, which was an even more wonderful chance to get to know each other and share our experiences. Having contact with a group of other people going through more or less the same exciting/bewildering/overwelming/interesting experience you are is invaluable, especially if you suffer from Impostor Syndrome as so many of us do. So I'm so grateful to the other interns for their support and solidarity.


## What's up next?

In the remaining weeks of my internship, I'm going to be continuing the work I mentioned, but instead of from a library in a small German town or a random internet connection in a small Italian town, I'll be working mainly out of the Berlin office, and hopefully getting to know more Mozillians there. I'll also be participating in the [TechSpeakers](https://wiki.mozilla.org/TechSpeakers) program, a training program from the Mozilla Reps to improve your public speaking skills so that you can go forth and spread the word about Mozilla's awesome technologies. Finally, in the last week or two, I'll be figuring out how to pass the baton, i.e. tie up loose ends, document what I've done and where I'm leaving off, and make it possible for someone else -- whether existing team or community members, or perhaps the next intern -- to continue making the Marionette test runner and its unit tests Super Awesome. And blogging all the while, of course. :) Looking forward to it!  
