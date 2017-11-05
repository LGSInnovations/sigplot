[SigPlot](http://sigplot.lgsinnovations.com)
=======

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Build Status](https://travis-ci.org/LGSInnovations/sigplot.svg?branch=develop-2.0)](https://travis-ci.org/LGSInnovations/sigplot) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md#pull-requests) [![npm version](https://badge.fury.io/js/sigplot.svg)](https://badge.fury.io/js/sigplot)

SigPlot provides fast, interactive plotting for software defined radio
applications using HTML5.

![SigPlot plotting the FFT of a signal](doc/fft-white.png)

Getting Started
=================
First include the SigPlot library in your webpage:

```html
<html>
  <head>
    <title>SigPlot Standalone</title>
    <style>
      #plot {
        width: 600px;
        height: 400px;
      }
    </style>
  </head>
  <body>
    <div id="plot"></div>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sigplot@2.0.0-rc2/dist/sigplot-debug.js"></script>
    <script type="text/javascript">
      var options = {};
      var plot = new sigplot.Plot(document.getElementById('plot'), options);
    </script>
  </body>
</html>
```

Additional [examples and demos](http://sigplot.lgsinnovations.com/).


WebPack Quick Start
================================

These instructions assume you have Node.js/NPM correctly installed on your
system.

First install webpack:

```
npm install webpack -g
```

Then create a project for the SigPlot demo and install sigplot.

```bash
mkdir sigplot-webpack
cd sigplot-webpack
npm install sigplot
```

Next, create a file called `demo.js` with the following contents:

```javascript
let sigplot = require("sigplot");
let options = {};
let plot = new sigplot.Plot(document.getElementById('plot'), options);
```

Then, create a file called `index.html` with the following contents:

```html
<html>
  <head>
    <title>SigPlot Webpack</title>
    <style>
      #plot {
        width: 600px;
        height: 400px;
      }
    </style>
  </head>
  <body>
    <div id="plot"></div>
    <script type="text/javascript" src="bundle.js" charset="utf-8"></script>
  </body>
</html>
```

Use webpack to compile the bundle:

```bash
webpack ./demo.js bundle.js
```

Then open index.html in your webbrowser.

Building
=============

Using Grunt
-------------
[Grunt](http://gruntjs.com) is the primary mechanism for building SigPlot.  You
will need an installation of Node.js and the Grunt command line interface.

The first step is to install the build dependencies using `npm install`.

Run `grunt test` to run the unittests and JavaScript linting; run `grunt dist`
to build a distributable version of the project.

If you get an warning from jsbeautifer about files not being "beautified", you 
can use --force while doing development but prior to making your final commits
you should run `grunt jsbeautifier:cleanup`.  This will fix any of the formatting
issues.  It was an intentional decision to not automatically run cleanup because
it can be risky to make changes to the code as part of the build (even if the
beautifier is supposed to be 100% code-identical).

Using Make
-------------
Although Grunt is the canonical build system, a basic Makefile is provided for
environment where Grunt cannot be used.  You will need the following:

* GNU Make
* Java version 1.7+

If you wish to build the SigPlot API documention, you will need
[jsdoc](https://github.com/jsdoc3/jsdoc) installed.

Testing
=============

The non-interactive unittests are executed automatically whenever a Grunt build
is executed.  The full unittest suite is interactive and requires that you
execute tests within a webbrowser.  A local web server can easily be started by
running `npm web_server` and then opening a browser to
http://localhost:1337/test/test.html


Contributing
=====================
The `master` branch is used to distribute stable releases.  No development
should occur directly on the master branch.  To be compatible with Bower, the
output of `grunt dist` (i.e. the files in the `dist` folder) should be commited
when preparing a release.

The `develop` branch should be used for general development towards the next
release.  All code should be built using `grunt jsbeautifier:cleanup`
**before** being commited.  Unlike the `master` branch, the output of the dist
folder should not be commited on the develop branch.

If release candidate builds are desired, a branch should be made from the
`develop` branch.  The package.json and bower.json files should be updated; the
code built with `grunt dist` and the resulting distribution files in the `dist`
folder committed.

Work performed under contract should always be first commited to a topic branch
before being merged into the `develop` branch.

License
=====================
Licensed to the LGS Innovations (LGS) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  LGS licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at
 
  http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
