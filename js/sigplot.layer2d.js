/**
 * @license
 * File: sigplot.layer2d.js
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

(function(sigplot, mx, m, undefined) {

    /**
     * @constructor
     * @param plot
     */
    sigplot.Layer2D = function(plot) {
        this.plot = plot;

        this.xbuf = undefined; // raw (ArrayBuffer) of ABSC data
        this.ybuf = undefined; // raw (ArrayBuffer) of ORD data

        this.offset = 0.0;
        this.xstart = 0.0;
        this.xdelta = 0.0;
        this.ystart = 0.0;
        this.ydelta = 0.0;
        this.imin = 0;
        this.xmin = 0.0;
        this.xmax = 0.0;
        this.name = "";
        this.cx = false;
        this.hcb = undefined; // index in Gx.HCB
        // xbufn = xbuf.byteLength
        // ybufn = ybuf.byteLength

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

        this.preferred_origin = 4;
        this.opacity = 1;

        // LPB is kinda odd right now, since we read the entire file into memory anyways...
        // given that often we are loading from an HREF so there is no downside to this...
        // however, we keep LPB around (for now) so that the scaling behaves identical to
        // the original code
        this.lpb = undefined;

        this.yc = 1; // y-compression factor...not yet used 

        this.options = {};
    };

    sigplot.Layer2D.prototype = {

        /**
         * Initializes the layer to display the provided data.
         *
         * @param hcb
         *            {BlueHeader} an opened BlueHeader file
         * @param lyrn
         *          the index of the added layer
         *
         * @memberOf sigplot.Layer2D
         * @private
         */
        init: function(hcb) {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            this.hcb = hcb;
            this.hcb.buf_type = "D";

            if (this.hcb.pipe) {
                var self = this;
                this.frame = 0;


                this.lps = Math.max(1, (Mx.b - Mx.t));
                m.addPipeWriteListener(this.hcb, function() {
                    self._onpipewrite();
                });
                this.buf = new ArrayBuffer(this.lps * this.hcb.subsize * this.hcb.spa * sigplot.PointArray.BYTES_PER_ELEMENT);
                this.zbuf = new sigplot.PointArray(this.buf);
            } else {
                this.lps = hcb.size;
            }

            this.offset = 0;
            this.xbufn = 0;
            this.ybufn = 0;
            this.drawmode = "scrolling"; // "falling", "rising"


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

            if (Gx.index) {
                this.xstart = 1.0;
                this.xdelta = 1.0;
                this.xmin = 1.0;
                this.xmax = hcb.subsize;
                this.ystart = 1.0;
                this.ydelta = 1.0;
                this.ymin = 1.0;
                this.ymax = size;
            } else {
                this.xstart = hcb.xstart;
                this.xdelta = hcb.xdelta;
                var d = hcb.xstart + hcb.xdelta * (hcb.subsize - 1.0);
                this.xmin = Math.min(hcb.xstart, d);
                this.xmax = Math.max(hcb.xstart, d);
                this.ystart = hcb.ystart;
                this.ydelta = hcb.ydelta;
                var d = hcb.ystart + hcb.ydelta * (this.lps - 1.0);
                this.ymin = Math.min(hcb.ystart, d);
                this.ymax = Math.max(hcb.ystart, d);
            }

            // TODO make this work with force 1000 applied
            this.xframe = this.hcb.subsize;
            this.yframe = (this.lps * this.hcb.subsize) / this.xframe;

            if (this.lpb === 0) {
                this.lpb = this.yframe;
            }
            if (!this.lpb || (this.lpb <= 0)) {
                this.lpb = 16;
            }
            this.lpb = Math.max(1, this.lpb / this.yc) * this.yc;

            this.xlab = hcb.xunits;
            this.ylab = hcb.yunits; // might be undefined

        },

        _onpipewrite: function() {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            if (this.drawmode === "falling") {
                this.frame = 0;
                this.zbuf.set(this.zbuf.subarray(0, (this.lps - 1) * this.hcb.subsize * this.hcb.spa), this.hcb.subsize * this.hcb.spa);
                if (this.img) {
                    mx.shift_image_rows(Mx, this.img, 1);
                }
            } else if (this.drawmode === "rising") {
                this.frame = this.lps - 1;
                this.zbuf.set(this.zbuf.subarray(this.hcb.subsize * this.hcb.spa), 0);
                if (this.img) {
                    mx.shift_image_rows(Mx, this.img, -1);
                }
            } else if (this.drawmode === "scrolling") {
                if (this.frame >= this.lps) { // if lps got resized make sure we don't go out of bounds
                    this.frame = 0;
                }
            } else {
                throw "Invalid draw mode";
            }

            var ngot = m.grabx(this.hcb, this.zbuf, this.hcb.subsize * this.hcb.spa, this.frame * this.hcb.subsize * this.hcb.spa);

            var zpoint;
            if (this.cx) {
                var dbuf = this.zbuf.subarray(this.frame * this.hcb.subsize * this.hcb.spa, (this.frame + 1) * this.hcb.subsize * this.hcb.spa);
                zpoint = new sigplot.PointArray(this.hcb.subsize);
                if (Gx.cmode === 1) {
                    m.cvmag(dbuf, zpoint, zpoint.length);
                } else if (Gx.cmode === 2) {
                    if (Gx.plab === 25) {
                        m.cvpha(dbuf, zpoint, zpoint.length);
                        m.vsmul(ypoint, 1.0 / (2 * Math.PI), ypoint, zpoint.length);
                    } else if (Gx.plab !== 24) {
                        m.cvpha(dbuf, zpoint, zpoint.length);
                    } else {
                        m.cvphad(dbuf, zpoint, zpoint.length);
                    }
                } else if (Gx.cmode === 3) {
                    m.vmov(dbuf, skip, zpoint, 1, zpoint.length);
                } else if (Gx.cmode >= 6) {
                    m.cvmag2(dbuf, zpoint, zpoint.length);
                } else if (Gx.cmode >= 4) {
                    m.vmov(dbuf.subarray(1), skip, zpoint, 1, zpoint.length);
                }
            } else {
                zpoint = this.zbuf.subarray(this.frame * this.hcb.subsize, (this.frame + 1) * this.hcb.subsize);
                if (Gx.cmode === 1) {
                    m.vabs(zpoint);
                }
            }

            if (Gx.cmode === 6) {
                m.vlogscale(zpoint, Gx.dbmin, 10.0);
            } else if (Gx.cmode === 7) {
                m.vlogscale(zpoint, Gx.dbmin, 20.0);
            }

            var min = zpoint[0];
            var max = zpoint[0];
            for (var i = 0; i < zpoint.length; i++) {
                if (zpoint[i] < min) min = zpoint[i];
                if (zpoint[i] > max) max = zpoint[i];
            }

            if (Gx.autol === 1) {
                Gx.zmin = min;
                Gx.zmax = max;
            } else if (Gx.autol > 1) {
                var fac = 1.0 / (Math.max(Gx.autol, 1));
                Gx.zmin = Gx.zmin * fac + min * (1.0 - fac);
                Gx.zmax = Gx.zmax * fac + max * (1.0 - fac);
            }

            if (this.img) {
                mx.update_image_row(Mx, this.img, zpoint, this.frame, Gx.zmin, Gx.zmax);
            }
            if (this.drawmode === "scrolling") {
                this.frame = (this.frame + 1) % this.lps;
            }
        },

        get_data: function() {
            var HCB = this.hcb;

            if (!this.buf) {
                // Grab all the data
                this.buf = new ArrayBuffer(this.lps * HCB.subsize * this.hcb.spa * sigplot.PointArray.BYTES_PER_ELEMENT);
                this.zbuf = new sigplot.PointArray(this.buf);
            }

            if (!this.hcb.pipe) {
                m.grab(HCB, this.zbuf, 0, HCB.subsize);
            }
        },

        /**
         * Provisional API
         *
         * @private
         * @param x
         * @param y
         */
        get_z: function(x, y) {
            var ix = Math.floor(x / this.hcb.xdelta);
            var iy = Math.floor(y / this.hcb.ydelta);
            var zidx = (iy * this.hcb.subsize) + ix;
            return this.zbuf[zidx];
        },

        change_settings: function(settings) {
            if (settings.cmode !== undefined) {
                this.img = undefined;
            }
            if (settings.cmap !== undefined) {
                this.img = undefined;
            }
            if (settings.drawmode !== undefined) {
                this.drawmode = settings.drawmode;
                // Reset the buffer
                this.frame = 0;
                this.buf = new ArrayBuffer(this.lps * this.hcb.subsize * this.hcb.spa * sigplot.PointArray.BYTES_PER_ELEMENT);
                this.zbuf = new sigplot.PointArray(this.buf);
                this.img = undefined;
            }
        },

        prep: function(xmin, xmax) {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            var npts = this.lps;

            var skip = this.skip;

            var qmin = this.xmin;
            var qmax = this.xmax;
            var n1, n2;

            this.get_data(xmin, xmax);

            if ((Gx.cmode === 5) || (this.xsub > 0)) {
                // TODO - is this mode supported in rasters?
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
                    console.log("Nothing to plot");
                    npts = 0;
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
                console.log("Nothing to plot");
                return;
            }

            if ((Gx.cmode === 5) || (this.ysub > 0)) {
                // TODO - is this mode supported in rasters?
            } else if (npts > 0) {
                var ystart = this.ystart;
                var ydelta = this.ydelta;
                var d = npts;
                if (Gx.index) {
                    n1 = 0;
                    n2 = npts - 1;
                } else if (ydelta >= 0.0) {
                    n1 = Math.max(1.0, Math.min(d, Math.round((xmin - ystart) / ydelta))) - 1.0;
                    n2 = Math.max(1.0, Math.min(d, Math.round((xmax - ystart) / ydelta) + 2.0)) - 1.0;
                } else {
                    n1 = Math.max(1.0, Math.min(d, Math.round((xmax - ystart) / ydelta) - 1.0)) - 1.0;
                    n2 = Math.max(1.0, Math.min(d, Math.round((xmin - ystart) / ydelta) + 2.0)) - 1.0;
                }

                npts = n2 - n1 + 1;
                if (npts < 0) {
                    console.log("Nothing to plot");
                    npts = 0;
                }
            }

            if (Gx.panymin > Gx.panxmax) {
                Gx.panymin = this.ymin;
                Gx.panymax = this.ymax;
            } else {
                Gx.panymin = Math.min(Gx.panymin, this.ymin);
                Gx.panymax = Math.max(Gx.panymax, this.ymax);
            }

            if (Gx.cmode === 1) {
                m.vabs(this.zbuf);
            } else if (Gx.cmode === 6) {
                m.vlogscale(this.zbuf, Gx.dbmin, 10.0);
            } else if (Gx.cmode === 7) {
                m.vlogscale(this.zbuf, Gx.dbmin, 20.0);
            }

            // find z-min/z-max
            // this is equivalent to setting XRASTER /LPB=0
            var min = this.zbuf[0];
            var max = this.zbuf[0];
            for (var i = 0; i < this.zbuf.length; i++) {
                if ((i / this.xframe) >= this.lpb) break;
                if (this.zbuf[i] < min) min = this.zbuf[i];
                if (this.zbuf[i] > max) max = this.zbuf[i];
            }
            if (Gx.zmin !== undefined) {
                Gx.zmin = Math.min(Gx.zmin, min);
            } else {
                Gx.zmin = min;
            }
            if (Gx.zmax !== undefined) {
                Gx.zmax = Math.min(Gx.zmax, max);
            } else {
                Gx.zmax = max;
            }

            this.img = mx.create_image(Mx, this.zbuf, this.hcb.subsize, this.lps, Gx.zmin, Gx.zmax);
            this.img.cmode = Gx.cmode;
            this.img.cmap = Gx.cmap;
            this.img.origin = Mx.origin;

            return npts;
        },

        draw: function() {
            var Mx = this.plot._Mx;
            var Gx = this.plot._Gx;
            var HCB = this.hcb;

            if (this.hcb.pipe) {
                var lps = Math.max(1, (Mx.b - Mx.t));
                if ((lps != this.lps) && this.buf) {
                    var new_buf = new ArrayBuffer(lps * this.hcb.subsize * sigplot.PointArray.BYTES_PER_ELEMENT);
                    var new_zbuf = new sigplot.PointArray(new_buf);

                    // copy the data into the new buffer, it will be clamped by subarray
                    new_zbuf.set(this.zbuf.subarray(0, new_zbuf.length));
                    this.buf = new_buf;
                    this.zbuf = new_zbuf;
                    this.lps = lps;
		    if (this.frame >= this.lps) { // if lps got resized make sure we don't go out of bounds
			this.frame = 0;
		    }
                    var d = HCB.ystart + HCB.ydelta * (this.lps - 1.0);
                    this.ymin = Math.min(HCB.ystart, d);
                    this.ymax = Math.max(HCB.ystart, d);
                    this.plot.rescale();
                }
            }

            var xmin = Math.max(this.xmin, Mx.stk[Mx.level].xmin);
            var xmax = Math.min(this.xmax, Mx.stk[Mx.level].xmax);
            if (xmin >= xmax) { // no data but do scaling
                Gx.panxmin = Math.min(Gx.panxmin, this.xmin);
                Gx.panxmax = Math.max(Gx.panxmax, this.xmax);
                return;
            }
            var ymin = Math.max(this.ymin, Mx.stk[Mx.level].ymin);
            var ymax = Math.min(this.ymax, Mx.stk[Mx.level].ymax);

            var w = Math.abs(xmax - xmin) + 1;
            var h = Math.abs(ymax - ymin) + 1;

            w = Math.floor(w / HCB.xdelta);
            h = Math.floor(h / HCB.ydelta);

            w = Math.min(w, HCB.subsize);
            h = Math.min(h, HCB.size);

            var ul = mx.real_to_pixel(Mx, xmin, ymin);
            var lr = mx.real_to_pixel(Mx, xmax, ymax);

            var iw = lr.x - ul.x;
            var ih = lr.y - ul.y;

            var rx = iw / w;
            var ry = ih / h;

            Gx.xe = Math.max(1, Math.round(rx));
            Gx.ye = Math.max(1, Math.round(ry));

            if (!this.img) {
                this.prep(xmin, xmax);
            } else if ((Gx.cmode !== this.img.cmode) || (Gx.cmap !== this.img.cmap) || (Mx.origin !== this.img.origin)) {
                this.prep(xmin, xmax);
            }

            if (this.img) {
                mx.draw_image(Mx, this.img, this.xmin, this.ymin, this.xmax, this.ymax, this.opacity, Gx.rasterSmoothing);
            }

            if (this.frame) {
                var pnt = mx.real_to_pixel(Mx, 0, this.frame*this.ydelta);
                if ((pnt.y > Mx.t) && (pnt.y < Mx.b)) {
                    mx.draw_line(Mx, "white", Mx.l, pnt.y, Mx.r, pnt.y);
                }
            }
        }
    };

    /**
     * Factory to overlay the given file onto the given plot.
     *
     * @private
     */
    sigplot.Layer2D.overlay = function(plot, hcb, layerOptions) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        hcb.buf_type = "D";

        var layer = new sigplot.Layer2D(plot);
        layer.init(hcb);

        if (hcb.file_name) {
            layer.name = m.trim_name(hcb.file_name);
        } else {
            layer.name = "layer_" + Gx.lyr.length;
        }

        for (var layerOption in layerOptions) {
            if (layer[layerOption] !== undefined) {
                layer[layerOption] = layerOptions[layerOption];
            }
        }

        plot.add_layer(layer);
    };

}(window.sigplot = window.sigplot || {}, mx, m));
