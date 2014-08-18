.PHONY: all clean dist beautify

BLUEFILE_SOURCES = js/license.js \
		   js/typedarray.js \
		   js/common.js \
		   js/bluefile.js

SIGPLOT_SOURCES = $(BLUEFILE_SOURCES) \
		js/tinycolor.js \
		js/CanvasInput.js \
		js/spin.js \
		js/loglevel.js \
		js/m.js \
		js/mx.js \
		js/sigplot.layer1d.js \
		js/sigplot.layer2d.js \
		js/sigplot.js

PLUGINS_SOURCES = js/license.js \
		  js/sigplot.annotations.js \
		  js/sigplot.slider.js \
		  js/sigplot.accordion.js \
		  js/sigplot.boxes.js \
		  js/sigplot.playback.js

all: dist/bluefile-minimized.js dist/bluefile-debug.js dist/sigplot-minimized.js dist/sigplot-debug.js dist/sigplot.plugins-minimized.js dist/sigplot.plugins-debug.js

dist/%-minimized.js: dist/%-debug.js
ifeq ($(DEBUG),1)
	cp $^ $@
else
ifeq ($(UGLIFYJS),1)
	uglifyjs -o $@ $^
else
	java -jar support/google-closure-compiler/build/compiler.jar --js=$^ --js_output_file=$@
endif
endif

dist/%-debug.js: dist/%.js
ifeq ($(UGLIFYJS),1)
	uglifyjs --no-mangle-functions -b -o $@ $^
else
	java -jar support/google-closure-compiler/build/compiler.jar --js=$^ --js_output_file=$@ --formatting=PRETTY_PRINT --compilation_level=WHITESPACE_ONLY
endif

dist:
	grunt dist

beautify:
	# Requires js-beautifier
	# Install using `sudo pip install jsbeautifier`
	$(foreach x, $(SIGPLOT_SOURCES), js-beautify -o $(x).tmp $(x) ;)
	# js-beautify doesn't support inline file writes
	$(foreach x, $(SIGPLOT_SOURCES), mv $(x).tmp $(x) ;)


doc: doc/index.html

clean:
	rm -f dist/*.js

cleandoc:
	rm -rf doc/*

doc/index.html: $(wildcard js/*.js)
	jsdoc js/*debug*.js -d doc -c docstrap-master/conf.json -t docstrap-master/template

dist/sigplot.js: $(SIGPLOT_SOURCES)
	cat $^ > $@

dist/bluefile.js: $(BLUEFILE_SOURCES)
	cat $^ > $@

dist/sigplot.plugins.js: $(PLUGINS_SOURCES)
	cat $^ > $@

clean-build: clean
	$(MAKE) all doc
