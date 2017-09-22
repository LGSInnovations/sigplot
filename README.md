Developing
=============

1. Install [GPP](http://en.nothingisreal.com/wiki/GPP).  The Ubuntu and
MacOSX [Homebrew](brew.sh) package managers have GPP directly available, for
Redhat/CentOS you can download and build the source.

2. Install [Grunt](http://gruntjs.com) per the standard directions

3. Run `npm install` to install grunt packages

4. Run `npm install -g bower` to install bower globally on your system

5. Run `grunt` to run the build.  If you want to use your development copy of
   SigPlot (as opposed to the latest release), use `grunt devbuild`, this
assumes that SigPlot is available at `../sigplot`.

Running Jekyll Locally
=====================

GitHub pages are built using Jekyll.  You can build and serve up the pages
following the [GitHub Directions](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/).  Below are some quick start directions for Ubuntu.

```
sudo apt-get install gcc ruby ruby-dev libxml2 libxml2-dev  libxslt1-dev
gem install bundler
bundle install
bundle exec jekyll server
```

Testing
==========
You can run `grunt web_server` to start a test web server and then load the
[Demo](http://localhost:1337/html/index.html).

Alternatively you can load from a file URL, for example
`file:///path/to/your/sigplotdemo/html/index.html`.

When loading the demo page from a `file://` URL, you will receive errors
if you try to plot a file (i.e. using `overlay_href`).  Each browser has a
unique way to overcome this.

Firefox - Under about:config disable `Security.fileuri.strict_origin_policy`
Chrome  - Launch Chrome with --allow-file-access-from-files
Safari  - TBD
IE      - TBD
Opera   - TBD
