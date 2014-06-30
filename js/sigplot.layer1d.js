/**
 * @license
 * File: sigplot.layer1d.js
 * Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 * Copyright (c) 2012-2014, Axios Inc., All rights reserved.
 *
 * This file is part of SigPlot.
 *
 * SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation; either version 3.0 of the License, or
 * (at your option) any later version. This library is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the
 * GNU Lesser General Public License along with SigPlot.
 */

/* global mx */
/* global m */
(function(sigplot, mx, m, undefined) {


    /**
     * @constructor
     * @param plot
     */

    sigplot.Layer1D = function(plot) {
        this.plot = plot;

        this.xbuf = undefined; // raw (ArrayBuffer) of ABSC data
        this.ybuf = undefined; // raw (ArrayBuffer) of ORD data

        this.offset = 0.0;
        this.xstart = 0.0;
        this.xdelta = 0.0;
        this.imin = 0;
        this.xmin = 0.0;
        this.xmax = 0.0;
        this.name = "";
        this.cx = false;
        this.hcb = undefined; // index in Gx.HCB
        // xbufn = xbuf.byteLength
        // ybufn = ybuf.byteLength
        this.size = 0;

        this.display = true;
        this.color = 0;
        this.line = 3; // 0=none, 1-vertical, 2-horizontal, 3-connecting
        this.thick = 1; // negative for dashed
        this.symbol = 0;
        this.radius = 3;

        this.skip = 0; // number of elements between ord values
        this.xsub = 0;
        this.ysub = 0;
        this.xdata = false; // true if X data is data from file
        this.modified = false;
        this.opacity = 1.0;
        this.preferred_origin = 1;

        this.options = {};
    };

    sigplot.Layer1D.prototype = {

        /**
         * Initializes the layer to display the provided data.
         *
         * @param hcb
         *            {BlueHeader} an opened BlueHeader file
         * @param lyrn
         *          the index of the added layer
         *
         * @memberOf sigplot.Layer1D
         * @private
         */
        init: function(hcb, options) {
            var Gx = this.plot._Gx;

            this.hcb = hcb;
            this.hcb.buf_type = "D";

            this.offset = 0;
            this.size = 0;
            this.xbufn = 0;
            this.ybufn = 0;

            if (!this.hcb.pipe) {
		if (hcb["class"] === 2) {
                    m.force1000(hcb);
                    this.size = hcb.subsize;
                } else {
                    this.size = hcb.size;
                }
            } else {
		this.size = options.framesize;
            }

            if (hcb["class"] <= 2) {
                this.xsub = -1;
                this.ysub = 1;
                this.cx = (hcb.format[0] === 'C');
            } else {
                // TODO
            }

            this.skip = 1;
            if (this.cx) {
                this.skip = 2;
            }

            this.xstart = hcb.xstart;
            this.xdelta = hcb.xdelta;
            var d = hcb.xstart + hcb.xdelta * (this.size - 1.0);
            this.xmin = Math.min(hcb.xstart, d);
            this.xmax = Math.max(hcb.xstart, d);

            this.xlab = hcb.xunits;
            this.ylab = hcb.yunits; // might be undefined

            if (this.hcb.pipe) {
		this.drawmode = "scrolling";
		this.position = 0;
		this.tle = options.tl;

		this.ybufn = this.size * Math.max(this.skip * sigplot.PointArray.BYTES_PER_ELEMENT, sigplot.PointArray.BYTES_PER_ELEMENT);
		this.ybuf = new ArrayBuffer(this.ybufn);

		var self = this;
		m.addPipeWriteListener(this.hcb, function() { self._onpipewrite(); });
            }
        },

        _onpipewrite : function() {
            var ybuf = new sigplot.PointArray(this.ybuf);

            var tle = this.tle; // in scalars
            if (tle === undefined) {
		tle = Math.floor(m.pavail(this.hcb)) / this.hcb.spa;
            } else if (m.pavail(this.hcb) < (tle*this.hcb.spa)) {
                return;
            }

            var tl = tle * this.hcb.spa;

            if (this.drawmode === "lefttoright") {
		this.position = 0;
		ybuf.set(ybuf.subarray(0, this.size-tl), tl);
            } else if (this.drawmode === "righttoleft") {
		this.position = this.size-tle;
		ybuf.set(ybuf.subarray(tl), 0);
            } else if (this.drawmode === "scrolling") {
		// Nothing to do
            } else {
		throw "Invalid draw mode";
            }

            tle = Math.min(tle, this.size-this.position);
            var ngot = m.grabx(this.hcb, ybuf, tle*this.hcb.spa, this.position*this.hcb.spa);
            if (ngot === 0) {
                return;
            }

            this.position = (this.position + tle) % this.size;
        },

        get_data: function(xmin, xmax) {
            var Gx = this.plot._Gx;
            var HCB = this.hcb;

            var skip = this.skip;

            var size;
            if (HCB["class"] === 2) {
                size = HCB.subsize;
            } else {
                size = HCB.size;
            }

            var imin = 0;
            var imax = 0;
            if (Gx.index) {
                imin = Math.floor(xmin);
                imax = Math.floor(xmax + 0.5);
            } else if (HCB.xdelta >= 0.0) {
                imin = Math.floor((xmin - HCB.xstart) / HCB.xdelta) - 1;
                imax = Math.floor((xmax - HCB.xstart) / HCB.xdelta + 0.5);
            } else {

                imin = Math.floor((xmax - HCB.xstart) / HCB.xdelta) - 1;
                imax = Math.floor((xmin - HCB.xstart) / HCB.xdelta + 0.5);
            }
            imin = Math.max(0.0, imin);
            imax = Math.min(size, imax);

            var npts = Math.max(0.0, Math.min(imax - imin + 1, Gx.bufmax));
            if (HCB.xdelta < 0) {
                imin = imax - npts + 1;
	    }

            if ((imin >= this.imin) && (imin + npts <= this.imin + this.size) && (this.ybuf !== undefined)) {
                // data already in buffers
            } else if (this.modified) {
                // modified data not yet saved off

            } else if (HCB["class"] <= 2) {
                // load new data
                var start = this.offset + imin;
                var skip = this.skip;
                this.ybufn = npts * Math.max(skip * sigplot.PointArray.BYTES_PER_ELEMENT,
                    sigplot.PointArray.BYTES_PER_ELEMENT);
                if ((this.ybuf === undefined) || (this.ybuf.byteLength < this.ybufn)) {
                    this.ybuf = new ArrayBuffer(this.ybufn);
                }
                var ybuf = new sigplot.PointArray(this.ybuf);
                var ngot = m.grab(HCB, ybuf, start, npts);
                this.imin = imin;
                this.xstart = HCB.xstart + (imin) * this.xdelta;
                this.size = ngot;
            } else {
                // type 3000, 4000, 5000
                // TODO yeah right
            }

        },

        change_settings: function(settings) {
            if (settings.index !== undefined) {
                if (settings.index) {
                    this.xstart = 1.0;
                    this.xdelta = 1.0;
                    this.xmin = 1.0;
                    this.xmax = this.size;
                } else {
                    this.xstart = this.hcb.xstart + (this.imin) * this.xdelta;
                    this.xdelta = this.hcb.xdelta;
                    var d = this.hcb.xstart + this.hcb.xdelta * (this.size - 1.0);
                    this.xmin = Math.min(this.hcb.xstart, d);
                    this.xmax = Math.max(this.hcb.xstart, d);
                }
            }

            if (settings.drawmode !== undefined) {
		this.drawmode = settings.drawmode;
		// Reset the buffer
		this.position = 0;
		this.ybufn =  this.size * Math.max(this.skip * sigplot.PointArray.BYTES_PER_ELEMENT, sigplot.PointArray.BYTES_PER_ELEMENT);
		this.ybuf = new ArrayBuffer(this.ybufn);
            }
        },
       
        reload: function(data, hdrmod) {

            var axis_change = (this.hcb.dview.length !== data.length) || hdrmod;
            if (hdrmod) {
                for (var k in hdrmod) {
                    this.hcb[k] = hdrmod[k];
                }
            }
            this.hcb.setData(data);

            // Setting these causes refresh() to refetch 
            this.imin = 0;
            this.xstart = undefined;
            this.size = 0;

            var xmin = this.xmin;
            var xmax = this.xmax;

            if (axis_change) {
                var d = this.hcb.xstart + this.hcb.xdelta * (this.hcb.size - 1.0);
                this.xmin = Math.min(this.hcb.xstart, d);
                this.xmax = Math.max(this.hcb.xstart, d);
                this.xdelta = this.hcb.xdelta;
                this.xstart = this.hcb.xstart;
                xmin = undefined;
                xmax = undefined;
            }

            return {xmin: xmin, xmax: xmax};
        },         
        
        push: function(data, hdrmod, sync) {
            if (hdrmod) {
                for (var k in hdrmod) {
                    this.hcb[k] = hdrmod[k];
                }
                      
                var d = this.hcb.xstart + this.hcb.xdelta * (this.hcb.size - 1.0);
                this.xmin = Math.min(this.hcb.xstart, d);
                this.xmax = Math.max(this.hcb.xstart, d);
                this.xdelta = this.hcb.xdelta;
                this.xstart = this.hcb.xstart;
            }

            m.filad(this.hcb, data, sync);

            return hdrmod ? true : false;
            
        },

        prep: function(xmin, xmax) {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            var npts = Math.ceil(this.size);

            var skip = this.skip;

            if (npts === 0) { return; }

            if (npts * sigplot.PointArray.BYTES_PER_ELEMENT > Gx.pointbufsize) {
                Gx.pointbufsize = npts * sigplot.PointArray.BYTES_PER_ELEMENT;
                Gx.xptr = new ArrayBuffer(Gx.pointbufsize);
                Gx.yptr = new ArrayBuffer(Gx.pointbufsize);
            }

            var dbuf = new sigplot.PointArray(this.ybuf);
            var xpoint = new sigplot.PointArray(Gx.xptr);
            var qmin = this.xmin;
            var qmax = this.xmax;
            var n1, n2;
            var mxmn;
            if ((Gx.cmode === 5) || (this.xsub > 0)) {
                if (npts <= 0) {
                    qmin = Gx.panxmin;
                    qmax = Gx.panxmax;
                } else if (Gx.cmode !== 5) {
                    xpoint = new sigplot.PointArray(this.xbuf);
                } else if (this.cx) {
                    m.vmov(dbuf, skip, xpoint, 1, npts);
                } else if (this.line !== 0) {
                    mxmn = m.vmxmn(dbuf, npts);
                    xpoint[0] = mxmn.smax;
                    xpoint[1] = mxmn.smin;
                    n1 = mxmn.imax;
                    n2 = mxmn.imin;
                    npts = 2;
                } else {
                    xpoint = dbuf;
                }
                if (npts > 0) {
                    mxmn = m.vmxmn(xpoint, npts);
                    qmax = mxmn.smax;
                    qmin = mxmn.smin;
                    n1 = mxmn.imax;
                    n2 = mxmn.imin;
                }
            } else if (npts > 0) {
                var xstart = this.xstart;
                var xdelta = this.xdelta;
                var d = npts;
                if (Gx.index) {
                    n1 = 0;
                    n2 = npts - 1;
                } else if (xdelta >= 0.0) {
                    n1 = Math.max(1.0, Math.min(d, Math.round((xmin - xstart) / xdelta))) - 1.0;
                    n2 = Math.max(1.0, Math.min(d, Math.round((xmax - xstart) / xdelta) + 2.0)) - 1.0;
                } else {
                    n1 = Math.max(1.0, Math.min(d, Math.round((xmax - xstart) / xdelta) - 1.0)) - 1.0;
                    n2 = Math.max(1.0, Math.min(d, Math.round((xmin - xstart) / xdelta) + 2.0)) - 1.0;
                }

                npts = n2 - n1 + 1;
                if (npts < 0) {
		    m.log.debug("Nothing to plot");
                    npts = 0;
                }
                dbuf = new sigplot.PointArray(this.ybuf).subarray(n1 * skip);
                xstart = xstart + xdelta * (n1);
                for (var i = 0; i < npts; i++) {
                    if (Gx.index) {
                        xpoint[i] = this.imin + i + 1;
                    } else {
                        xpoint[i] = xstart + i * xdelta;
                    }
                }
            }

            if (Gx.panxmin > Gx.panxmax) {
                Gx.panxmin = qmin;
                Gx.panxmax = qmax;
            } else {
                Gx.panxmin = Math.min(Gx.panxmin, qmin);
                Gx.panxmax = Math.max(Gx.panxmax, qmax);
            }

            if (npts <= 0) {
                m.log.debug("Nothing to plot");
                return;
            }
            var ypoint = new sigplot.PointArray(Gx.yptr);
            if (this.cx) {
                if (Gx.cmode === 1) {
                    m.cvmag(dbuf, ypoint, npts);
                } else if (Gx.cmode === 2) {
                    if (Gx.plab === 25) {
                        m.cvpha(dbuf, ypoint, npts);
                        m.vsmul(ypoint, 1.0 / (2 * Math.PI), ypoint, npts);
                    } else if (Gx.plab !== 24) {
                        m.cvpha(dbuf, ypoint, npts);
                    } else {
                        m.cvphad(dbuf, ypoint, npts);
                    }
                } else if (Gx.cmode === 3) {
                    m.vmov(dbuf, skip, ypoint, 1, npts);
                } else if (Gx.cmode >= 6) {
                    m.cvmag2(dbuf, ypoint, npts);
                } else if (Gx.cmode >= 4) {
                    m.vmov(dbuf.subarray(1), skip, ypoint, 1, npts);
                }
            } else {
                if (Gx.cmode === 5) { // I vs. R
                    m.vfill(ypoint, 0, npts);
                } else if ((Gx.cmode === 1) || (Gx.cmode >= 6)) { // Mag, log
                    for (var i = 0; i < npts; i++) {
                        ypoint[i] = Math.abs(dbuf[i]);
                    }
                } else {
                    for (var i = 0; i < npts; i++) {
                        ypoint[i] = dbuf[i];
                    }
                }
            }

            if (Gx.cmode >= 6) {
                m.vlog10(ypoint, Gx.dbmin, ypoint);
                var dbscale = 10.0;
                if (Gx.cmode === 7) {
                    dbscale = 20.0;
                }
                if ((Gx.lyr.length > 0) && (Gx.lyr[0].cx)) {
                    dbscale = dbscale / 2.0;
                }
                m.vsmul(ypoint, dbscale, ypoint);
            }
            mxmn = m.vmxmn(ypoint, npts);

            qmax = mxmn.smax;
            qmin = mxmn.smin;
            n1 = mxmn.imax;
            n2 = mxmn.imin;

            var yran = qmax - qmin;
            if (yran < 0.0) {
                qmax = qmin;
                qmin = qmax + yran;
                yran = -yran;
            }
            if (yran <= 1.0e-20) {
                qmin = qmin - 1.0;
                qmax = qmax + 1.0;
            } else {
                qmin = qmin - 0.02 * yran;
                qmax = qmax + 0.02 * yran;
            }

            if (Mx.level === 0) {
                if (Gx.panymin > Gx.panymax) {
                    Gx.panymin = qmin;
                    Gx.panymax = qmax;
                } else {
                    Gx.panymin = Math.min(Gx.panymin, qmin);
                    Gx.panymax = Math.max(Gx.panymax, qmax);
                }

                if (Gx.autol > 1) {
                    var fac = 1.0 / (Math.max(Gx.autol, 1));
                    Gx.panymin = Gx.panymin * fac + Mx.stk[0].ymin * (1.0 - fac);
                    Gx.panymax = Gx.panymax * fac + Mx.stk[0].ymax * (1.0 - fac);
                }
            }

            // Gx.xptr = xpoint;
            // Gx.yptr = ypoint;
            return npts;
        },

        draw: function() {
            var Mx = this.plot._Mx;
            var Gx = this.plot._Gx;

            var ic = this.color;
            var symbol = this.symbol;
            var rad = this.radius;
            var mask = 0;
            var line = 0;
            var traceoptions = {};

            traceoptions.fillStyle = Gx.fillStyle;
            if (this.options) {
                traceoptions.highlight = this.options.highlight;
                traceoptions.noclip = this.options.noclip;
            }

            if (this.line === 0) {
                line = 0;
            } else {
                line = 1;
                if (this.thick > 0) {
                    line = this.thick;
                } else if (this.thick < 0) {
                    line = Math.abs(this.thick);
                    traceoptions.dashed = true;
                }
                if (this.line === 1) {
                    traceoptions.vertsym = true;
		}
                if (this.line === 2) {
                    traceoptions.horzsym = true;
		}
            }

            var segment = (Gx.segment) && (Gx.cmode !== 5) && (this.xsub > 0) && (mask === 0);
            var xdelta = this.xdelta;

            var xmin;
            var xmax;
            if (this.xdata) {
                xmin = this.xmin;
                xmax = this.xmax;
            } else {
                xmin = Math.max(this.xmin, Mx.stk[Mx.level].xmin);
                xmax = Math.min(this.xmax, Mx.stk[Mx.level].xmax);
                if (xmin >= xmax) { // no data but do scaling
                    Gx.panxmin = Math.min(Gx.panxmin, this.xmin);
                    Gx.panxmax = Math.max(Gx.panxmax, this.xmax);
                }
            }

            if (!Gx.all) {
                var xran = (Gx.bufmax - 1.0) * xdelta;
                if (xran >= -0.0) {
                    xmax = Math.min(xmax, xmin + xran);
                } else {
                    xmin = Math.max(xmin, xmax + xran);
                }
            }

            if ((line === 0) && (symbol === 0)) {
                // Nothing to draw
                return;
            }
            while (xmin < xmax) {
                //if (Gx.all) {
                // TODO allow interrupt of all by mouse clicks
                //}

                if (!this.hcb.pipe) {
                    // get_data fills in the layer xbuf/ybuf with data
                    this.get_data(xmin, xmax);
                }

                // sigplot_prep fills in Gx.xptr and Gx.yptr (both sigplot.PointArray)
                // with the data to be plotted

                var npts = this.prep(xmin, xmax);
                if (npts > 0) {
                    if (segment) {
                        // TODO
                    } else {
                        mx.trace(Mx, ic, new sigplot.PointArray(Gx.xptr), new sigplot.PointArray(
                            Gx.yptr), npts, 1, line, symbol, rad, traceoptions);
                    }
                }

                if (Gx.all) {
                    if (this.size === 0) {
                        xmin = xmax;
                    } else {
                        if (Gx.index) {
                            xmin = xmin + npts;
                        } else {
                            if (xdelta >= 0) {
                                xmin = xmin + (this.size * xdelta);
                            } else {
                                xmax = xmax + (this.size * xdelta);
                            }
                        }
                    }
                } else {
                    xmin = xmax;
                }
            }

            if ((this.position) && (this.drawmode === "scrolling")) {
                var pnt = mx.real_to_pixel(Mx, this.position*this.xdelta, 0);
                if ((pnt.x > Mx.l) && (pnt.x < Mx.r)) {
                    mx.draw_line(Mx, "white", pnt.x, Mx.t, pnt.x, Mx.b);
                }
            }
        },

        /**
         * Add a highlight to a specific layer.
         *
         * @param {Number}
         *            n the layer to add the highlight to
         * @param highlight
         *            the highlight to add
         * @param {Number}
         *            highlight.xmin the minimum x value to start the highlight
         *            at
         * @param {Number}
         *            highlight.xmax the maximum x value to start the highlight
         *            at
         * @param {String}
         *            hightlight.color the color to use for the highlight
         *
         * @param {String}
         *            hightlight.id the id for the highlight
         */
        add_highlight : function(highlight) {
            if (!this.options.highlight) {
                this.options.highlight = [];
            }

            if (highlight instanceof Array) {
                this.options.highlight.push.apply(
                this.options.highlight, highlight);
            } else {
                this.options.highlight.push(highlight);
            }
            this.plot.refresh();
        },

        /**
         * Remove a highlight from the layer.
         *
         * @param {String} {Object}
         *             the id of the highlight to remove
         *             or the highlight object itself
         */
        remove_highlight : function(highlight) {
            if (this.options.highlight) {
                var i = this.options.highlight.length;
                while (i--) {
                if ((highlight === this.options.highlight[i]) || (highlight === this.options.highlight[i].id)) {
                    this.options.highlight.splice(i, 1);
                }
                }
                this.plot.refresh();
            }
        },

        get_highlights: function(){
            if (this.options.highlight) {
                return this.options.highlight.slice(0);
            } else {
                return [];
            }
        },

        /**
         * Clear all highlights from the layer.
         */
        clear_highlights : function() {
            if (this.options.highlight) {
                this.options.highlight = undefined;
                this.plot.refresh();
            }
        }
    };

    /**
     * Color positions for the various layers
     *
     * These magic numbers were conjured up by a wizard somewhere.
     *
     * @memberOf sigplot
     * @private
     */
    var mixc = [0, 53, 27, 80, 13, 40, 67, 93, 7, 60, 33, 87, 20, 47, 73, 100];

    /**
     * Factory to overlay the given file onto the given plot.
     *
     * @private
     */
    sigplot.Layer1D.overlay = function(plot, hcb, layerOptions) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        if (hcb["class"] === 2) {
            m.force1000(hcb);
        }
        hcb.buf_type = "D";

        // If the input is type 2000, each row becomes
        // it's own layer
        var n1 = 0;
        var n2 = 1;
        if (hcb["class"] === 2) {
            var num_rows = hcb.size / hcb.subsize;
            n2 = Math.min(num_rows, 16 - Gx.lyr.length);
        }

        for (var i = n1; i < n2; i++) {
            // This is logic from within sigplot.for LOAD_FILES
            var layer = new sigplot.Layer1D(plot);
            layer.init(hcb, layerOptions);

            // Provide a default color for the layer
            var n = (Gx.lyr.length) % mixc.length;
            layer.color = mx.getcolor(Mx, m.Mc.colormap[3], mixc[n]);

            // Provide the layer name
            if (hcb["class"] === 2) {
                if (hcb.file_name) {
                    layer.name = m.trim_name(hcb.file_name);
                } else {
                    layer.name = "layer_" + Gx.lyr.length;
                }
                layer.name = layer.name + "." + mx.pad((i + 1).toString(), 3, "0");
                layer.offset = i * hcb.subsize;
            } else {
                if (hcb.file_name) {
                    layer.name = m.trim_name(hcb.file_name);
                } else {
                    layer.name = "layer_" + Gx.lyr.length;
                }
                layer.offset = 0;
            }

            for (var layerOption in layerOptions) {
                if (layer[layerOption] !== undefined) {
                    layer[layerOption] = layerOptions[layerOption];
                }
            }
            plot.add_layer(layer);
        }
    };

}(window.sigplot = window.sigplot || {}, mx, m));
