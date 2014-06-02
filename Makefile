.PHONY: all clean

BLUEFILE_SOURCES = js/license.js \
		   js/typedarray.js \
		   js/common.js \
		   js/bluefile.js

SIGPLOT_SOURCES = $(BLUEFILE_SOURCES) \
		js/tinycolor.js \
		js/CanvasInput.js \
		js/spin.js \
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

all: bluefile-minimized.js bluefile-debug.js sigplot-minimized.js sigplot-debug.js sigplot.plugins-minimized.js sigplot.plugins-debug.js

%-minimized.js: js/%-debug.js
ifeq ($(DEBUG),1)
	cp $^ $@
else
ifeq ($(UGLIFYJS),1)
	uglifyjs -o $@ $^
else
	java -jar support/google-closure-compiler/compiler.jar --js=$^ --js_output_file=$@
endif
endif

%-debug.js: js/%-debug.js
ifeq ($(UGLIFYJS),1)
	uglifyjs --no-mangle-functions -b -o $@ $^
else
	java -jar support/google-closure-compiler/compiler.jar --js=$^ --js_output_file=$@ --formatting=PRETTY_PRINT --compilation_level=WHITESPACE_ONLY
endif


beautify:
	# Requires js-beautifier
	# Install using `sudo pip install jsbeautifier`
	$(foreach x, $(SIGPLOT_SOURCES), js-beautify -o $(x).tmp $(x) ;)
	# js-beautify doesn't support inline file writes
	$(foreach x, $(SIGPLOT_SOURCES), mv $(x).tmp $(x) ;)


doc: doc/index.html

clean:
	rm -f sigplot-minimized.js bluefile-minimized.js sigplot.plugins-minimized.js
	rm -f sigplot-debug.js bluefile-debug.js sigplot.plugins-debug.js
	rm -f js/*-debug.js

cleandoc:
	rm -rf doc/*

doc/index.html: $(wildcard js/*.js)
	jsdoc js/*debug*.js -d doc -c docstrap-master/conf.json -t docstrap-master/template

js/sigplot-debug.js: $(SIGPLOT_SOURCES)
	cat $^ > $@

js/bluefile-debug.js: $(BLUEFILE_SOURCES)
	cat $^ > $@

js/sigplot.plugins-debug.js: $(PLUGINS_SOURCES)
	cat $^ > $@

clean-build: clean
	$(MAKE) all doc
