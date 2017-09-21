TEMPLATES=$(wildcard raw/include/*)

%.html: raw/%.html $(TEMPLATES)
	gpp -H -I raw/include -o $@ $<

SRCS=$(wildcard raw/*.html)
HTML=$(notdir $(SRCS))

all: $(HTML)

clean:
	rm $(HTML)
