---
layout: post
title: "Mozilla London All Hands 2016"
excerpt_separator: <!--end-excerpt-->
---

Last week, all of Mozilla met in London for a whirlwind tour from TARDIS to TaskCluster, from BBC1 to e10s, from Regent Park to the release train, from Paddington to Positron. As an [Outreachy intern]({% post_url 2016-05-23-outreachy-what-how-why %}), I felt incredibly lucky to be part of this event, which gave me a chance to get to know Mozilla, my team, and the other interns much better.  It was a jam-packed work week of talks, meetings, team events, pubs, and parties, and it would be impossible to blog about all of the fun, fascinating, and foxy things I learned and did. But I can at least give you some of the highlights! Or, should I say, *Who*-lights? (Be warned, that is not the last pun you will encounter here today.)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Foxy, the TARDIS, and espionage in the park? All in a day&#39;s work at <a href="https://twitter.com/hashtag/MozLondon?src=hash">#MozLondon</a>! <a href="https://t.co/QPWdPRnJHY">pic.twitter.com/QPWdPRnJHY</a></p>&mdash; Anjana Vakil (@AnjanaVakil) <a href="https://twitter.com/AnjanaVakil/status/742853826428997632">June 14, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<!--end-excerpt-->

## Role models

While watching the plenary session that kicked off the week, it felt great to realize that of the 4 executives emerging from the TARDIS in the corner to take the stage (3 Mozillians and 1 guest star), a full 50% were women. As I had shared with my mentor (also a woman) before arriving in London, one of my goals for the week was to get inspired by finding some new role moz-els (ha!): Mozillians who I could aspire to be like one day, especially those of the female variety.

> *Why a female role model, specifically? What does gender have to do with it?*

Well, to be a good role model for you, a person needs to not only have a life/career/lego-dragon you aspire to have one day, but also be someone who you can already identify with, and see yourself in, today. A role model serves as a bridge between the two.  As I am a woman, and that is a fundamental part of my experience, a role model who shares that experience is that much easier for me to relate to. I wouldn't turn down a half-Irish-half-Indian American living in Germany, either.

At any rate, in London I found no shortage of talented, experienced, and - perhaps most importantly - *valued* [women at Mozilla](http://www.womoz.org). I don't want to single anyone out here, but I can tell you that I met women at all levels of the organization, from intern to executive, who have done and are doing really exciting things to advance both the technology and culture of Mozilla and the web. Knowing that those people exist, and that what they do is possible, might be the most valuable thing I took home with me from London.

> *Aw, what about the Whomsycorn?*

No offense, Whomyscorn, you're cool too.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The Whomsycorn, making its <a href="https://twitter.com/hashtag/mozlondon?src=hash">#mozlondon</a> debut.<br><br>(c/o <a href="https://twitter.com/shorlander">@shorlander</a> and <a href="https://twitter.com/FirefoxUX">@FirefoxUX</a>) <a href="https://t.co/xEFGcnNZNp">pic.twitter.com/xEFGcnNZNp</a></p>&mdash; madhava (@madhava) <a href="https://twitter.com/madhava/status/742702961185423360">June 14, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>




## Electrolysis (e10s)

[Electrolysis](https://wiki.mozilla.org/Electrolysis), or "e10s" for those who prefer integers to morphemes, is a massive and long-running initiative to separate the work Firefox does into multiple processes.

At the moment, the Firefox desktop program that the average user downloads and uses to explore the web runs in a single process. That means that one process has to do all the work of loading & displaying web pages (the browser "content"), as well as the work of displaying the user interface and its various tabs, search bars, sidebars, etc. (the browser "chrome"). So if something goes wrong with, say, the execution of a poorly-written script on a particular page, instead of only that page refusing to load, or its tab perhaps crashing, the entire browser itself may hang or crash.

> *That's not cool. Especially if you often have lots of tabs open. Not that I ever do.*

Of course not. Anyway, even less cool is the possibility that some jerk (not that there are any of those on the internet, though, right?) could make a page with a script that hijacks the entire browser process, and does super uncool stuff.

It would be much cooler if, instead of a single massive process, Firefox could use separate processes for content and chrome. Then, if a page crashes, at least the UI still works. And if we assign the content process(es) reduced permissions, we can keep possibly-jerkish content in a nice, safe sandbox so that it can't do uncool things with our browser or computer.

> *Better performance, more security? Super cool.*

Indeed. Separation is cool. [Electrolysis is separation](https://en.wikipedia.org/wiki/Electrolysis). Ergo, Electrolysis is cool.

It's not perfect yet - for example, compatibility with right-to-left languages, accessibility (or "a11y", if "e10s" needs a buddy), and add-ons is still an issue - but it's getting there, and it's rolling out real soon! Given that the project has been underway since 2008, that's pretty exciting.

## Rust, Servo, & Oxidation

<span style="float: right"> ![Rust logo](https://www.rust-lang.org/logos/rust-logo-blk.svg) </span>
I first heard about the increasingly popular language [Rust](https://www.rust-lang.org/) when I was at the [Recurse Center](https://www.recurse.com) last fall, and all I knew about it was that it was being used at Mozilla to develop a new browser engine called [Servo](https://servo.org/).

More recently, I heard talks from Mozillians like [E. Dunham](http://conferences.oreilly.com/oscon/open-source-us/public/schedule/detail/49024) that revealed a bit more about why people are so excited about Rust: it's a new language for low-level programming, and compared with the current mainstay C, it guarantees memory safety. As in, "No more [segfaults](https://en.wikipedia.org/wiki/Segmentation_fault), no more [NULL](https://www.lucidchart.com/techblog/2015/08/31/the-worst-mistake-of-computer-science/)s, no more [dangling pointers](https://en.wikipedia.org/wiki/Dangling_pointer)' dirty looks". It's also been designed with [concurrency](https://en.wikipedia.org/wiki/Concurrency_(computer_science)) and [thread safety](https://en.wikipedia.org/wiki/Thread_safety) in mind, so that programs can take better advantage of e.g. multi-core processors. (Do not ask me to get into details on this; the lowest level I have programmed at is probably sitting in a beanbag chair. But I believe them when they say that Rust does those things, and that those things are good.)

Finally, it has the advantage of having a tight-knit, active, and dedicated community ["populated entirely by human beings"](https://twitter.com/rustlang/status/633323561457971201), which is due in no small part to the folks at Mozilla and beyond who've been working to [keep the community that way](https://www.rust-lang.org/conduct.html).

> *OK OK OK, so Rust is a super cool new language. What can you do with it?*

Well, lots of stuff. For example, you could write a totally new [browser engine](https://en.wikipedia.org/wiki/Web_browser_engine), and call it [Servo](https://servo.org/).

> *Wait, what's a browser engine?*

A browser engine (aka layout or rendering engine) is basically the part of a browser that allows it to show you the web pages you navigate to. That is, it takes the raw HTML and CSS content of the page, figures out what it means, and turns it into a pretty picture for you to look at.

> *Uh, I'm pretty sure I can see web pages in Firefox right now. Doesn't it already have an engine?*

Indeed it does. It's called [Gecko](https://en.wikipedia.org/wiki/Gecko_(software)), and it's written in C++. It lets Firefox make the web beautiful every day.

> *So why Servo, then? Is it going to replace Gecko?*

No. Servo is an experimental engine developed by Mozilla Research; it's just intended to serve(-o!) as a playground for new ideas that could improve a browser's performance and security.

The beauty of having a research project like Servo and a real-world project like Gecko under the same roof at Mozilla is that when the Servo team's research unveils some new and clever way of doing something faster or more awesomely than Gecko does, everybody wins! That's thanks to the [Oxidation](https://wiki.mozilla.org/Oxidation) project, which aims to integrate clever Rust components cooked up in the Servo lab into Gecko. Apparently, Firefox 45 already got (somewhat unexpectedly) an MP4 metadata parser in Rust, which has been running just fine so far. It's just the tip of the iceberg, but the potential for cool ideas from Servo to make their way into Gecko via Oxidation is pretty exciting.

## The Janitor

Another really exciting thing I heard about during the week is [The Janitor](https://janitor.technology/), a tool that lets you contribute to FOSS projects like Firefox straight from your browser.

For me, one of the biggest hurdles to contributing to a new open-source project is getting the development environment all set up.

> *Ugh I hate that. I just want to change one line of code, do I really need to spend two days grappling with installation and configuration?!?*

Exactly. But the Janitor to the rescue!

<iframe src="//giphy.com/embed/XhLq1G1mvFpuM" width="480" height="257" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p style="font-size:.5em"><a href="http://giphy.com/gifs/perfectloops-spike-janitor-XhLq1G1mvFpuM">Cowboy Bebop via GIPHY</a></p>

Powered by the very cool [Cloud9 IDE](https://c9.io/), the Janitor gives you one-click access to a ready-to-go, cloud-based development environment for a given project. At the moment there are a handful of project supported (including Firefox, Servo, and Google Chrome), and new ones can be added by simply writing a [Dockerfile](https://www.digitalocean.com/community/tutorials/docker-explained-using-dockerfiles-to-automate-building-of-images). I'm not sure that an easier point of entry for new FOSS contributors is physically possible. The ease of start-up is perfect for short-term contribution efforts like hackathons or workshops, and thanks to the collaborative features of Cloud9 it's also perfect for remote pairing.

> *Awesome, I'm sold. How do I use it?*

Unfortunately, the Janitor is still in alpha and invite-only, but you can go to [janitor.technology](https://janitor.technology) and sign up to get on the waitlist. I'm still waiting to get my invite, but if it's half as fantastic as it seems, it will be a huge step forward in making it easier for new contributors to get involved with FOSS projects. If it starts supporting offline work (apparently the Cloud9 editor is somewhat functional offline already, once you've loaded the page initially, but the terminal and VNC always needs a connection to function), I think it'll be unstoppable.

## L20n

The last cool thing I heard about (literally, it was the last session on Friday) at this work week was [L20n](http://l20n.org/).

> *Wait, I thought "localization" was abbreviated "L10n"?*

Yeah, um, that's the whole pun. Way to be sharp, exhausted-from-a-week-of-talks-Anjana.

See, L20n is a next-generation framework for web and browser localization (l10n) and internationalization (i18n). It's apparently a long-running project too, born out of the frustrations of the l10n status quo.  

According to the L20n team, at the moment the localization system for Firefox is spread over multiple files with multiple syntaxes, which is no fun for localizers, and multiple APIs, which is no fun for developers. What we end up with is program logic intermingling with l10n/i18n decisions (say, determining the correct format for a date) such that developers, who probably aren't also localizers, end up making decisions about language that should really be in the hands of the localizers. And if a localizer makes a syntax error when editing a certain localization file, the entire browser refuses to run. Not cool.

Pop quiz: what's cool?

> *Um...*

C'mon, we just went over this. Go on and scroll up.

> *Electrolyis?*

Yeah, that's cool, but thinking more generally...

> *Separation?*

That's right! *Separation* is super cool! And that's what L20n does: separate l10n code from program source code. This way, developers aren't pretending to be localizers, and localizers aren't crashing browsers. Instead, developers are merely getting localized strings by calling a single L20n API, and localizers are providing localized strings in a single file format & syntax.

> *Wait but, isn't unifying everything into a single API/file format the opposite of separation? Does that mean it's not cool?*

Shhh. Meaningful separation of concerns is cool. Arbitrary separation of a single concern (l10n) is not cool. L20n knows the difference.

> *OK, fine. But first "e10s" and "a11y", now "l10n"/"l20n" and "i18n"... why does everything need a numbreviation?*

You've got me there.
