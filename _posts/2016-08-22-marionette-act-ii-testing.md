---
layout: post
title: "Marionette, Act II: Harnessing automation to test the browser"
excerpt_separator: "<!--/excerpt-->"
---

Welcome back to my post series on the [Marionette](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette) project! In [Act I]({% post_url 2016-07-08-marionette-act-i-automation %}), we looked into Marionette's automation framework for Gecko, the engine behind the Firefox browser. Here in Act II, we'll take a look at a complementary side of the Marionette project: the testing framework that helps us run tests using our Marionette-animated browser, aka the [Marionette test harness](https://developer.mozilla.org/en-US/docs/Marionette_Test_Runner). If -- like me at the start of my [Outreachy internship]({% post_url 2016-05-23-outreachy-what-how-why %}) -- you're [clueless](https://en.wikipedia.org/wiki/Clueless_(film)) about test harnesses, or the Marionette harness in particular, and want to fix that, you're in the right place!

<!--/excerpt-->

## Wait, what's Marionette again?

Quick recap from [Act I]({% post_url 2016-07-08-marionette-act-i-automation %}):

> [Marionette](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette) refers to a suite of tools for automated testing of Mozilla browsers.

In that post, we [saw]({% post_url 2016-07-08-marionette-act-i-automation %}#how-do-marionettes-server-and-client-automate-the-browser) how the Marionette automation framework lets us control the Gecko browser engine (our "puppet"), thanks to a *server* component built into Gecko (the puppet's "strings") and a *client* component (a "handle" for the puppeteer) that gives us a simple Python API to talk to the server and thus control the browser. But why do we need to automate the browser in the first place? What good does it do us?

Well, one thing it's great for is testing. Indulge me in a brief return to my puppet metaphor from last time, won't you? If the *automation* side of Marionette gives us strings and a handle that turn the browser into our puppet, the *testing* side of Marionette gives that puppet a reason for being, by letting it perform: it sets up a stage for the puppet to dance on, tell it to carry out a given performance, write a review of that performance, and tear down the stage again.

OK, OK, metaphor-indulgence over; let's get real.

## Wait, why do we need automated browser testing again?

As Firefox<sup id="a1">[1](#f1)</sup> contributors, we don't want to have to manually open up Firefox, click around, and check that everything works every time we change a line of code. We're developers, we're lazy!

!["Gosh, you say it like it's a bad thing" (GIF from the film "Clueless")](http://media4.popsugar-assets.com/files/thumbor/W4GOj04aYxDOfU2W8M8VooIy7A4/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2015/07/21/936/n/1922283/a3ec73cee2bf5525_1e96c7e2cf97ee07e043ac3cef331074/i/When-Your-Mom-Criticizes-Your-Strict-Diet-Quesadillas.gif)
<p class="credit"><em>Clueless</em> via <a href="http://www.popsugar.com/entertainment/Clueless-Movie-GIFs-37943154">POPSUGAR</a></p>

But we can't *not* do it, because then we might not realize that we've broken the entire internet (or, you know, introduced a bug that makes Firefox crash, which is just as bad).

So instead of testing manually, we do the same thing we always do: make the computer do it for us!

The type of program that can magically do this stuff for us is called a [test harness](https://en.wikipedia.org/wiki/Test_harness). And there's even a special version specific to testing Gecko-based browsers, called -- can you guess? -- the Marionette test harness, also known as the [Marionette test runner](https://developer.mozilla.org/en-US/docs/Marionette_Test_Runner).

(Lazy) Firefox contributors, rejoice!

!["Two enthusiastic thumbs up!" (GIF from the film "Clueless")](https://media.tenor.co/images/5e3ed62355b84ea1662a5fcc9178e85f/raw)
<p class="credit"><em>Clueless</em> via <a href="https://www.tenor.co/view/thumbsup-enthusiastic-clueless-gif-5146508">tenor</a></p>


So, what exactly is this magical "test harness" thing? And what do we need to know about the Marionette-specific one?

## What's a test harness?

First of all, let's not get hung up on the name "test harness" -- the names people use to refer to these things can be a bit ambiguous and confusing, as we saw with other parts of the Marionette suite in Act I. So let's set aside the name of the thing for now, and focus on what the thing does.

Assuming we have a framework like the Marionette client/server that lets us automatically control the browser, the other thing we need for automatically testing the browser is something that lets us:

* Properly set up & launch the browser, and any other related components we might need
* Define tests we want to perform and their expected results
* Discover tests defined in a file or directory
* Run those tests, using the automation framework to do the stuff we want to do in the browser
* Keep track of what we actually saw, and how it compares to what we expected to see
* Report the results in human- and/or machine-readable logs
* Clean up all of that stuff we set up in the beginning

Take out the browser-specific parts, and you've got the basic outline of what a test harness for any kind of software should do.

Ever write tests using Python's [`unittest`](https://docs.python.org/3/library/unittest.html), JavaScript's [`mocha`](http://mochajs.org/), Java's [`JUnit`](http://junit.org), or a similar tool? If you're like me, you might have been perfectly happy writing unit tests with one of these, thinking not:

> Yeah, I know `unittest`! It's a test harness.

but rather:

> Yeah, I know `unittest`! It's, you know, a, like, thing for writing tests that lets you make assertions and write setup/teardown methods and stuff and, like, print out stuff about the test results, or whatever.

Turns out, they're the same thing; one is just shorter (and less, like, full of "like"s, and stuff).

!["Whatever" (GIF from the film "Clueless")](http://media1.popsugar-assets.com/files/thumbor/cSwGkFRP96rFHR0GStr-CAC1m_4/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2015/07/21/936/n/1922283/f359498dff0704fd_Whatever-Clueless-GIF-1433983360/i/When-People-Tell-You-Going-Bed-9-pm-Lame.gif)
<p class="credit"><em>Clueless</em> via <a href="http://www.popsugar.com/entertainment/Clueless-Movie-GIFs-37943154">POPSUGAR</a></p>

So that's the general idea of a test harness. But we're not concerned with just any test harness; we want to know more about the *Marionette* test harness.

## What's special about the Marionette test harness?

Um, like, duh, it's made for tests using Marionette!

What I mean is that unlike an all-purpose test harness, the Marionette harness already knows that you're a Mozillian specifically interested in is running Gecko-based browser tests using Marionette. So instead of making you write code in for setup/teardown/logging/etc. that talks to Marionette and uses other features of the Mozilla ecosystem, it does that legwork for you.

You still have control, though; it makes it easy for you to make decisions about certain Mozilla-/Gecko-specific properties that could affect your tests, like:

* Need to use a specific Firefox binary? Or a particular Firefox instance running on a device somewhere?
* Got a special profile or set of preferences you want the browser to run with?
* Want [Electrolysis](https://developer.mozilla.org/en-US/Firefox/Multiprocess_Firefox) enabled, or not?

As well as some more general decisions, like:

* Need to run an individual test module? A directory full of tests? Tests listed in a manifest file?
* Want the tests run multiple times? Or in chunks?
* How and where should the results be logged?
* Care to drop into a debugger if something goes wrong?

But how does it do all this? What does it look like on the inside? Let's dive into the code to find out.

## How does the Marionette harness work?

Inside Marionette, in the file [`harness/marionette/runtests.py`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runtests.py#30), we find the `MarionetteHarness` class. `MarionetteHarness` itself is quite simple: it takes in a set of *arguments* that specify the desired preferences with respect to the type of decisions we just mentioned, uses an *argument parser* to parse and process those arguments, and then passes them along to a *test runner*, which runs the tests accordingly.

So actually, it's the "test runner" that does the brunt of the work of a test harness here. Perhaps for that reason, the names "Marionette Test Harness" and "Marionette Test Runner" sometimes seem to be used interchangeably, which I for one found quite confusing at first.

Anyway, the test runner that `MarionetteHarness` makes use of is the `MarionetteTestRunner` class defined in [`runtests.py`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runtests.py#18), but that's really just a little wrapper around `BaseMarionetteTestRunner` from [`harness/marionette/runner/base.py`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#491), which is where the magic happens -- and also where I've spent most of my time for my [Outreachy]({% post_url 2016-05-23-outreachy-what-how-why %}) [internship]({% post_url 2016-08-02-outreachy-halftime-ish-update %}), but more on that later. For now let's check out the runner!

### How does Marionette's test runner work?

The beating heart of the Marionette test runner is the method [`run_tests`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#860-931). By combining some methods that take care of general test-harness functionality and some methods that let us set up and keep tabs on a Marionette client-server session, `run_tests` gives us the Marionette-centric test harness we never knew we always wanted. Thanks, `run_tests`!

To get an idea of how the test runner works, let's take a walk through the `run_tests` method and see what it does.<sup id="a2">[2](#f2)</sup>

First of all, it simply [initializes](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#861-862) some things, e.g. timers and counters for passed/failed tests. So far, so boring.

Next, we get to the part that puts the "Marionette" in "Marionette test runner". The `run_tests` method [starts up Marionette](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#864-865), by [creating a `Marionette` object](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#815) -- passing in the appropriate [arguments](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#688-749) based on the runner's settings -- which gives us the client-server session we need to automate the browser in the tests we're about to run (we know how that all works from [Act I]({% post_url 2016-07-08-marionette-act-i-automation %})).

[Adding the tests we want](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#867) to the runner's to-run list (`self.tests`) is the next step. This means [finding](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#964-1021) the appropriate tests from test modules, a directory containing test modules, or a manifest file listing tests and the conditions under which they should be run.

Given those tests, after  [gathering](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#869-880) and [logging](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#882-888) some info about the settings we're using, we're ready to [run](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#897)! ([Perhaps multiple times](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#892-898),  if repeated runs were requested.)

To actually run the tests, the runner calls   [`run_test_sets`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#1082-1099), which runs the tests we added earlier, possibly dividing them into several sets (or `chunks`) that will be run separately (thus enabling parallelization). This in turn calls [`run_test_set`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#1072-1080), which basically just calls [`run_test`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#1023-1070), which is the [final turtle](https://en.wikipedia.org/wiki/Turtles_all_the_way_down).<sup id="a3">[3](#f3)</sup>

Glancing at `run_test`, we can see how the Marionette harness is [based](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#1025-1026) on Python's [`unittest`](https://docs.python.org/2/library/unittest.html), which is why the tests we run with this harness basically look like `unittest` tests (we'll say a bit more about that below). Using `unittest` to [discover](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#1041) our test cases in the modules we provided, `run_test` [runs](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#1050-1051) each test using a [`MarionetteTextTestRunner`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#217) and gets back a [`MarionetteTestResult`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#61). These are basically Marionette-specific versions of classes from [`moztest`](https://dxr.mozilla.org/mozilla-central/source/testing/mozbase/moztest), which helps us store the test results in a format that's compatible with other Mozilla automation tools, like [Treeherder](https://wiki.mozilla.org/Auto-tools/Projects/Treeherder). Once we've got the test result, `run_test` simply [adds it to the runner's tally](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#1053-1066) of test successes/failures.

So, that's how `run_tests` (and its helper functions) execute the tests. Once all the tests have been run, our main `run_tests` method basically just [logs some info](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#911-913,921) about how things went, and which tests passed. After that, the runner [cleans up](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#927) by [shutting down Marionette and the browser](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#1101-1112), even if something [went wrong](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#904-908,922-925) during the running or logging, or if the user [interrupted](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/runner/base.py#899-903,929-931) the tests.

So there we have it: our very own Marionette-centric test-runner! It runs our tests with Marionette and Firefox set up however we want, and also gives us control over more general things like logging and test chunking. In the next section, we'll take a look at how we can interact with and customize the runner, and tell it how we want our tests run.


### What do the tests look like?

As for the tests themselves, since the Marionette harness is an extension of Python's `unittest`, tests are mostly written as a custom flavor of `unittest` test cases. Tests extend [`MarionetteTestCase`](https://dxr.mozilla.org/mozilla-central/rev/3ba5426a03b495b6417fffb872d42874edb80855/testing/marionette/harness/marionette/marionette_test.py#617), which is an extension of [`unittest.TestCase`](https://docs.python.org/2/library/unittest.html#unittest.TestCase). So if you need to write a new test using Marionette, it's as simple as writing a new test module named `test_super_awesome_things.py` which extends that class with whatever `test_*` methods you want -- just like with vanilla [`unittest`](https://docs.python.org/2/library/unittest.html#basic-example).

Let's take a look at a simple example, [`test_checkbox.py`](https://dxr.mozilla.org/mozilla-central/source/testing/marionette/harness/marionette/tests/unit/test_checkbox.py):


```python
from marionette import MarionetteTestCase
from marionette_driver.by import By

class TestCheckbox(MarionetteTestCase):
    def test_selected(self):
        test_html = self.marionette.absolute_url("test.html")
        self.marionette.navigate(test_html)
        box = self.marionette.find_element(By.NAME, "myCheckBox")
        self.assertFalse(box.is_selected())
        box.click()
        self.assertTrue(box.is_selected())
```


This and the other Marionette unit tests can be found in the directory  [`testing/marionette/harness/marionette/tests/unit/`](https://dxr.mozilla.org/mozilla-central/source/testing/marionette/harness/marionette/tests/unit/), so have a peek there for some more examples.

Once we've got our super awesome new test, we can run it (with whatever super awesome settings we want) using the harness's command-line interface. Let's take a look at how that interface works.

### What is the interface to the harness like?

Let's peek at the [constructor method](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runner/base.py#496-582) for the `BaseMarionetteTestRunner` class:

{% highlight python %}
class BaseMarionetteTestRunner(object):
    # ...
    def __init__(self, address=None,
        app=None, app_args=None, binary=None, profile=None,
        logger=None, logdir=None,
        repeat=0, testvars=None,
        symbols_path=None, timeout=None,
        shuffle=False, shuffle_seed=random.randint(0, sys.maxint), this_chunk=1, total_chunks=1, sources=None,
        server_root=None, gecko_log=None, result_callbacks=None,
        prefs=None, test_tags=None,
        socket_timeout=BaseMarionetteArguments.socket_timeout_default,
        startup_timeout=None, addons=None, workspace=None,
        verbose=0, e10s=True, emulator=False, **kwargs):
{% endhighlight %}

<!--** -->

Our first thought might be, "Wow, that's a lot of arguments". Indeed! This is how the runner knows how you want the tests to be run. For example, `binary` is the path to the specific Firefox application binary you want to use, and `e10s` conveys whether or not you want to run Firefox with multiple processes.

Where do all these arguments come from? They're [passed](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runtests.py#67) to the runner by `MarionetteHarness`, which [gets them](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runtests.py#51-52) from the *argument parser* we mentioned earlier, [`MarionetteArguments`](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runtests.py#24-27).

Analogous to `MarionetteTestRunner`/`BaseMarionetteTestRunner`, `MarionetteArgument` is just a small wrapper around `BaseMarionetteArguments` from [`runner/base.py`](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runner/base.py#241), which in turn is just an extension of Python's [`argparse.ArgumentParser`](https://docs.python.org/2/library/argparse.html#argparse.ArgumentParser). `BaseMarionetteArguments` defines which [arguments](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runner/base.py#254-373) can be passed in to the harness's [command-line interface](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runtests.py#72-92) to configure its settings. It also [verifies](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runner/base.py#419) that whatever arguments the user passed in make sense and don't contract each other.

To actually [use the harness](https://developer.mozilla.org/en-US/docs/Marionette_Test_Runner), we can simply call the [`runtests.py`](https://dxr.mozilla.org/mozilla-central/source/testing/marionette/harness/marionette/runtests.py) script with: `python runtests.py [whole bunch of awesome arguments]`. Alternatively, we can use the [Mach command](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/mach) `marionette-test` (which just calls `runtests.py`), as described [here](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette/Running_Tests).

To see all of the available command-line options (there are a lot!), you can run `python runtests.py --help` or `./mach marionette-test --help`, which just spits out the arguments and their descriptions as defined in [`BaseMarionetteArguments`](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/testing/marionette/harness/marionette/runner/base.py#254-373).

So, with the simple command `mach marionette-test [super fancy arguments] test_super_fancy_things.py`, you can get the harness to run your Marionette tests with whatever fancy options you desire to fit your specific fancy scenario.

!["I'm so fancy" (GIF from "Fancy" by Iggy Azalea)](https://media.tenor.co/images/532d794fb57c2b1bfbcedef396e93ce1/raw)
<p class="credit">Iggy Azalea's "Fancy" via <a href="https://www.tenor.co/view/fancy-iggyazalea-gif-4448714">tenor</a></p>

But what if you're extra fancy, and have testing needs that exceed the limits of what's possible with the (copious) command-line options you can pass to the Marionette runner? Worry not! You can customize the runner even further by extending the base classes and making your own super-fancy harness. In the next section, we'll see how and why you might do that.

## How is the Marionette test harness used at Mozilla?

Other than enabling people to write and run their own tests using the Marionette client, what is the Marionette harness for? How does Mozilla use it internally?

Well, first and foremost, the harness is used to run the Marionette Python unit tests we described earlier, which check that Marionette is functioning as expected (e.g. if Marionette tells the browser to check that box, then by golly that box better get checked!). Those are the tests that will get run if you just run `mach marionette-test` without specifying any test(s) in particular.

But that's not all! I mentioned above that there might be special cases where the runner's functionality needs to be extended, and indeed Mozilla has already encountered this scenario a couple of times.

One example is the [Firefox UI tests](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Firefox_UI_tests), and in particular the UI update tests. These test the functionality of e.g. clicking the "Update Firefox" button in the UI, which means they need to do things like compare the old version of the application to the updated one to make sure that the update worked. Since this involves binary-managing superpowers that the base Marionette harness doesn't have, the UI tests have their own runner, [`FirefoxUITestRunner`](https://dxr.mozilla.org/mozilla-central/source/testing/firefox-ui/harness/firefox_ui_harness/runners/base.py), which extends `BaseMarionetteTestRunner` with those superpowers.

Another test suite that makes use of a superpowered harness is the [External Media Tests](https://developer.mozilla.org/en-US/docs/Mozilla/QA/external-media-tests), which tests video playback in Firefox and need some extra resources -- namely a list of video URLs to make available to the tests. Since there's no easy way to make such resources available to tests using the base Marionette harness, the external media tests have [their own test harness](https://dxr.mozilla.org/mozilla-central/source/dom/media/test/external/external_media_harness/runtests.py) which uses the custom [`MediaTestRunner`](https://developer.mozilla.org/en-US/docs/Mozilla/QA/external-media-tests) and [`MediaTestArguments`](https://dxr.mozilla.org/mozilla-central/rev/d5f20820c80514476f596090292a5d77c4b41e3b/dom/media/test/external/external_media_harness/runtests.py#49) (extensions of `BaseMarionetteTestRunner` and `BaseMarionetteArguments`, respectively), to allow the user to e.g. specify the video resources to use via the command line.

So the Marionette harness is used in at least three test suites at Mozilla, and more surely can and will be added as the need arises! Since the harness is designed with automation in mind, suites like `marionette-test` and the Firefox UI tests can be (and are!) run automatically to make sure that developers aren't breaking Firefox or Marionette as they make changes to the Mozilla codebase. This all makes the Marionette harness a rather indispensable development tool.

Which brings us to a final thought...

## How do we know that the harness itself is running tests properly?

The Marionette harness, like any test harness, is just another piece of software. It was written by humans, which means that bugs and breakage are always a possibility. Since breakage or bugs in the test harness could prevent us from running tests properly, and we need those tests to work on Firefox and other Mozilla tools, we need to make sure that they get caught!

Do you see where I'm going with this? We need to... wait for it...

> *Test the thing that runs the tests*

Yup, that's right: Meta-testing. Test-ception. Tests all the way down.

!["Oh my god" (GIF from the film "Clueless")](http://media1.popsugar-assets.com/files/thumbor/mQHBZmHnmyaKD5KDQ3Pczk6iM4E/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2015/07/21/936/n/1922283/2213f04074cccfc3_raw/i/When-You-Realize-Youre-Getting-Security-Deposit-Back-From-Your-Lease.gif)
<p class="credit"><em>Clueless</em> via <a href="http://www.popsugar.com/entertainment/Clueless-Movie-GIFs-37943154">POPSUGAR</a></p>

And that's what I've been doing this summer for my [Outreachy project](https://wiki.mozilla.org/Outreachy#Test-driven_Refactoring_of_Marionette.27s_Python_Test_Runner): working on the tests for the Marionette test harness, otherwise known as the [Marionette harness (unit) tests](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette/Developer_setup#Marionette_Harness_Unit_Tests). I wrote a bit about what I've been up to in my [previous post]({% post_url 2016-08-02-outreachy-halftime-ish-update %}), but in my next and final Outreachy post, I'll explain in more detail what the harness tests do, how we run them in automation, and what improvements I've made to them during my time as a Mozilla contributor.

Stay tuned!

!["I'm outty" (GIF from the film "Clueless")](http://media2.popsugar-assets.com/files/thumbor/fvDfv9zE69Mw1HJJtn4veTLo6BQ/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2015/07/21/935/n/1922283/3c71c918ce03dcce_tumblr_lv6o35jlkv1qb9pa3o1_500/i/When-Youre-Dinner-Weeknight-You-Realize-8-pm.gif)
<p class="credit"><em>Clueless</em> via <a href="http://www.popsugar.com/entertainment/Clueless-Movie-GIFs-37943154">POPSUGAR</a></p>



-----

#### Notes

<b id="f1">1</b> Or [Fennec](https://www.mozilla.org/en-US/firefox/android/), or [B2G](https://developer.mozilla.org/en-US/docs/Mozilla/B2G_OS), or [insert [Gecko-based project](https://en.wikipedia.org/wiki/Gecko_(software)#Usage) here]... [↩](#a1)

<b id="f2">2</b> If you scroll through it and think, "Wow, that's long and ugly", well, you should've seen it before I [refactored](https://bugzilla.mozilla.org/show_bug.cgi?id=1275269) it!

!["Hagsville" (GIF from the film "Clueless")](http://media3.popsugar-assets.com/files/thumbor/fc9xotgGrHFZI0W6fUakt4MC2Ug/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2015/07/21/935/n/1922283/0151951e7852f4d2_hagsville/i/When-You-Look-Your-High-School-Enemies-Facebook-Pages.gif)
<p class="credit"><em>Clueless</em> via <a href="http://www.popsugar.com/entertainment/Clueless-Movie-GIFs-37943154">POPSUGAR</a></p>

[↩](#a2)

<b id="f3">3</b> If you think distinguishing `run_tests`, `run_test_sets`, `run_test_set`, and `run_test` is confusing, I wholeheartedly agree with you! But best get used to it; working on the Marionette test harness involves developing an eagle-eye for plurals in method names (we've also got `_add_tests` and `add_test`). [↩](#a3)
