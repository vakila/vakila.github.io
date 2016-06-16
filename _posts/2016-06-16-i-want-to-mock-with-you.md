---
layout: post
title: "I want to mock with you"
excerpt: "When writing Python unit tests, sometimes you want to just test one specific aspect of a piece of code that does multiple things.\n
\n
For example, maybe you're wondering:\n
\n
* Does object X get created here?\n
* Does method X get called here?\n
* Assuming method X returns Y, does the right thing happen after that?\n
\n
Finding the answers to such questions is super simple if you use `mock`: a library which 'allows you to replace parts of your system under test with mock objects and make assertions about how they have been used.' Let's talk about why `Mock`s are super cool, and some of the tips/tips/trials/tribulations I discovered when starting to use them."
---

*This post brought to you from Mozilla's London All Hands meeting - cheers!*

When writing Python unit tests, sometimes you want to just test one specific aspect of a piece of code that does multiple things.

For example, maybe you're wondering:

* Does object X get created here?
* Does method X get called here?
* Assuming method X returns Y, does the right thing happen after that?

Finding the answers to such questions is super simple if you use `mock`: a library which "allows you to replace parts of your system under test with mock objects and make assertions about how they have been used." Since Python 3.3 it's available simply as `unittest.mock`, but if you're using an earlier Python you can get it from PyPI with `pip install mock`.

So, what are mocks? How do you use them?

Well, in short I could tell you that a `Mock` is a sort of magical object that's intended to be a doppelgänger for some object in your code that you want to test. `Mock`s have special attributes and methods you can use to find out how your test is using the object you're mocking. For example, you can use `Mock.called` and `.call_count` to find out if and how many times a method has been called. You can also manipulate `Mock`s to simulate functionality that you're not directly testing, but is necessary for the code you're testing. For example, you can set `Mock.return_value` to pretend that an function gave you some particular output, and make sure that the right thing happens in your program.

But honestly, I don't think I could give a better or more succinct overview of mocks than the [Quick Guide](https://docs.python.org/3/library/unittest.mock.html#quick-guide), so for a real intro you should go read that. While you're doing that, I'm going to watch this fantastic Michael Jackson video:

<div style="text-align:center; padding:1em;"><iframe width="420" height="315" src="https://www.youtube.com/embed/5X-Mrc2l1d0" frameborder="0" allowfullscreen></iframe></div>

Oh you're back? Hi! So, now that you have a basic idea of what makes `Mock`s super cool, let me share with you some of the tips/tips/trials/tribulations I discovered when starting to use them.


## Patches and namespaces

*tl;dr: Learn [where to patch](https://docs.python.org/3/library/unittest.mock.html#where-to-patch) if you don't want to be sad!*

When you import a helper module into a module you're testing, the tested module gets its own namespace for the helper module. So if you want to mock a class from the helper module, you need to mock it *within the tested module's namespace*.

For example, let's say I have a Super Useful `helper` module, which defines a class `HelperClass` that is So Very Helpful:

    # helper.py

    class HelperClass():
        def __init__(self):
            self.name = "helper"
        def help(self):
            helpful = True
            return helpful

And in the module I want to test, `tested`, I instantiate the Incredibly Helpful `HelperClass`, which I imported from `helper.py`:

    # tested.py

    from helper import HelperClass

    def fn():
        h = HelperClass() # using tested.HelperClass
        return h.help()

Now, let's say that it is Incredibly Important that I make sure that a `HelperClass` object is actually getting created in `tested`, i.e. that `HelperClass()` is being called. I can write a test module that patches `HelperClass`, and check the resulting `Mock` object's [`called` property](https://docs.python.org/3/library/unittest.mock.html#unittest.mock.Mock.called). But I have to be careful that I patch the right `HelperClass`! Consider `test_tested.py`:

    # test_tested.py

    import tested

    from mock import patch

    # This is not what you want:
    @patch('helper.HelperClass')
    def test_helper_wrong(mock_HelperClass):
        tested.fn()
        assert mock_HelperClass.called # Fails! I mocked the wrong class, am sad :(

    # This is what you want:
    @patch('tested.HelperClass')
    def test_helper_right(mock_HelperClass):
        tested.fn()
        assert mock_HelperClass.called # Passes! I am not sad :)


OK great! If I patch `tested.HelperClass`, I get what I want.

But what if the module I want to test uses `import helper` and `helper.HelperClass()`, instead of `from helper import HelperClass` and `HelperClass()`? As in `tested2.py`:

    # tested2.py

    import helper

    def fn():
        h = helper.HelperClass()
        return h.help()


In this case, in my test for `tested2` I need to patch the class with `patch('helper.HelperClass')` instead of `patch('tested.HelperClass')`. Consider `test_tested2.py`:

    # test_tested2.py

    import tested2
    from mock import patch

    # This time, this IS what I want:
    @patch('helper.HelperClass')
    def test_helper_2_right(mock_HelperClass):
        tested2.fn()
        assert mock_HelperClass.called # Passes! I am not sad :)

    # And this is NOT what I want!
    # Mock will complain: "module 'tested2' does not have the attribute 'HelperClass'"
    @patch('tested2.HelperClass')
    def test_helper_2_right(mock_HelperClass):
        tested2.fn()
        assert mock_HelperClass.called

Wonderful!

In short: be careful of which namespace you're patching in. If you patch whatever object you're testing in the wrong namespace, the object that's created will be the real object, not the mocked version. And that will make you confused and sad.

I was confused and sad when I was trying to mock the `TestManifest.active_tests()` function to test [`BaseMarionetteTestRunner.add_test`](https://dxr.mozilla.org/mozilla-central/source/testing/marionette/harness/marionette/runner/base.py#902), and I was trying to mock it in the place it was defined, i.e. `patch('manifestparser.manifestparser.TestManifest.active_tests')`.

Instead, I had to patch `TestManifest` *within the `runner.base` module*, i.e. the place where it was actually being called by the `add_test` function, i.e. `patch('marionette.runner.base.TestManifest.active_tests')`.

So don't be confused or sad, mock the thing *where it is used*, not where it was defined!


## Pretending to read files with `mock_open`

One thing I find particularly annoying is writing tests for modules that have to interact with files. Well, I guess I could, like, write code in my tests that creates dummy files and then deletes them, or (even worse) just put some dummy files next to my test module for it to use. But wouldn't it be better if I could just skip all that and *pretend* the files exist, and have whatever content I need them to have?

It sure would! And that's exactly the type of thing `mock` is really helpful with. In fact, there's even a helper called `mock_open` that makes it super simple to pretend to read a file. All you have to do is patch the builtin `open` function, and pass in `mock_open(read_data="my data")` to the patch to make the `open` in the code you're testing only *pretend* to open a file with that content, instead of actually doing it.

To see it in action, you can take a look at a (not necessarily great) little test I wrote that pretends to open a file and read some data from it:

    def test_nonJSON_file_throws_error(runner):
        with patch('os.path.exists') as exists:
            exists.return_value = True
            with patch('__builtin__.open', mock_open(read_data='[not {valid JSON]')):
                with pytest.raises(Exception) as json_exc:
                    runner._load_testvars() # This is the code I want to test, specifically to be sure it throws an exception
        assert 'not properly formatted' in json_exc.value.message



## Gotchya: Mocking and debugging at the same time

See that `patch('os.path.exists')` in the test I just mentioned? Yeah, that's probably not a great idea. At least, I found it problematic.

I was having some difficulty with a similar test, in which I was also patching `os.path.exists` to fake a file (though that wasn't the part I was having problems with), so I decided to [set a breakpoint with `pytest.set_trace()`](https://pytest.org/latest/usage.html#setting-a-breakpoint-aka-set-trace) to drop into the Python debugger and try to understand the problem. The debugger I use is [pdb++](https://pypi.python.org/pypi/pdbpp/), which just adds some helpful little features to the default [pdb](https://docs.python.org/3/library/pdb.html), like colors and [`sticky` mode](https://pypi.python.org/pypi/pdbpp/#sticky-mode).  

So there I am, merrily debugging away at my `(Pdb++)` prompt. But as soon as I entered the `patch('os.path.exists')` context, I started getting weird behavior in the debugger console: complaints about some `~/.fancycompleterrc.py` file and certain commands not working properly.

It turns out that at least one module pdb++ was using (e.g. `fancycompleter`) was getting confused about file(s) it needs to function, because of checks for `os.path.exists` that were now all messed up thanks to my ill-advised `patch`. This had me scratching my head for longer than I'd like to admit.

What I still don't understand (explanations welcome!) is why I still got this weird behavior when I tried to change the test to patch `'mymodule.os.path.exists'` (where `mymodule.py` contains `import os`) instead of just `'os.path.exists'`. Based on what we saw about namespaces, I figured this would restrict the mock to only `mymodule`, so that pdb++ and related modules would be safe - but it didn't seem to have any effect whatsoever. But I'll have to save that mystery for another day (and another post).

Still, lesson learned: if you're patching a commonly used function, like, say, `os.path.exists`, don't forget that once you're inside that mocked context, you no longer have access to the real function *at all*! So keep an eye out, and mock responsibly!


## Mock the night away

Those are just a few of the things I've learned in my first few weeks of `mock`ing. If you need some bedtime reading, check out these resources that I found helpful:

* [An intro to mocking in Python](https://www.toptal.com/python/an-introduction-to-mocking-in-python) on Toptal
* Mozilla dev Armen Z.G.'s [blog post on better Python tests](http://armenzg.blogspot.de/2016/04/improving-how-i-write-python-tests.html)

I'm sure `mock` has all kinds of secrets, magic, and superpowers I've yet to discover, but that gives me something to look forward to! If you have `mock`-foo tips to share, just give me a shout on [Twitter](https://twitter.com/intent/tweet?screen_name=AnjanaVakil)!
