# Contributing to SigPlot

## Preparing Development Environment

Using Grunt
-------------
Building SigPlot requires that you have Node.js and the Node Package Manager
(npm) installed.

Node.js can be installed using the [official source](https://nodejs.org/en/),
using your operating-systems package manager, or by using
[nvm](https://github.com/creationix/nvm).

Once you have `npm` working, install [Grunt](http://gruntjs.com) with the
command `npm install -g grunt-cli`.

Using Make
-------------
Although Grunt is the canonical build system, a basic Makefile is provided for
environment where Grunt cannot be used.  You will need the following:

* GNU Make
* Java version 1.7+

If you wish to build the SigPlot API documention, you will need
[jsdoc](https://github.com/jsdoc3/jsdoc) installed.

## Getting started

1. Fork the SigPlot repository on GitHub.
2. Clone the repostory that you have just forked.
3. Create a branch with a meaningful name: `git checkout -b fix-some-issue`.
4. Run `npm install` to fetch all of the required SigPlot dependencies.
5. Run `grunt test` to ensure that your branch builds and passes all of the tests.

## Writing code

All code for SigPlot is found within the `js` folder.  Coding style is enforced
using jsbeautifier during the build process.  Prior to commiting your code you
should cleanup your code using `jsbeautifier:cleanup`.  This will reformat your
code and make it consistent with the SigPlot coding standards.

Please use semantic commit messages following this format:

```
commit-type: commit summary

Commit details as necessary...
```

The following commit-type values should be used:
* feat (new feature)
* fix (bug fix)
* docs (changes to documentation)
* style (formatting, missing semi colons, etc; no code change)
* refactor (refactoring production code)
* test (adding missing tests, refactoring tests; no production code change)
* chore (updating grunt tasks etc; no production code change)

## Running test suite

SigPlot includes an extensive set of unittests found in the `test/tests.js`
file.  There are two broad categories of test: those that exeucte without user
interaction and those that require user interaction to confirm proper behavior.

Non-interactive tests can be executed by simply running `grunt test`.
Interactive tests can be executed by running `grunt web_server` and then
opening your webrowser to http://localhost:1337/test/test.html.

## Preparing your code for submission

Prior to submitting a pull request, the following steps are recommended to
prepare your branch:

1. Fetch the latest code from the repository: `git fetch origin`
2. Rebase your branch against master `git rebase origin/master`
3. Run the build and test with `grunt test`.  This must pass without the use of --force.

## Contributions

All code in this repository is under the [Apache License, version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

SigPlot welcomes contributions from everyone.  You will need to agree to the
[LGS Contributor License Agreement](https://cla-assistant.lgsinnovations.com/LGSInnovations/) before
your contributions can be incorporated into SigPlot.

Contributions to SigPlot should be made in the form of GitHub pull requests.
Each pull request will be reviewed by a core contributor and either included in
the main tree or given feedback for changes that would be required.
