/**
 * @license
 * File: sigplot.layer2d.js
 * Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.
 *
 * This file is part of SigPlot.
 *
 * Licensed to the LGS Innovations (LGS) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  LGS licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License
 */

/* global module */
/* global require */

(function() {

    var m = require("./m");
    var mx = require("./mx");

    /**
     * @constructor
     * @param plot
     */
    var Layer2D = function(plot) {
        this.plot = plot;

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

    Layer2D.prototype = {

        /**
         * Initializes the layer to display the provided data.
         *
         * @param hcb
         *            {BlueHeader} an opened BlueHeader file
         * @param lyrn
         *          the index of the added layer
         *
         * @memberOf Layer2D
         * @private
         */
        init: function(hcb) {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            this.hcb = hcb;
            this.hcb.buf_type = "D";

            if (this.hcb.pipe) {
                var self = this;
                this.position = 0;
                this.frame = 0;


                this.lps = this.hcb.lps || Math.ceil(Math.max(1, (Mx.b - Mx.t)));
                m.addPipeWriteListener(this.hcb, function() {
                    self._onpipewrite();
                });
            } else {
                this.lps = this.hcb.lps || Math.ceil(hcb.size);
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
                this.ymax = this.size;
            } else {
                this.xstart = hcb.xstart;
                this.xdelta = hcb.xdelta;
                var d = hcb.xstart + hcb.xdelta * (hcb.subsize - 1.0);
                this.xmin = this.hcb.xmin || Math.min(hcb.xstart, d);
                this.xmax = this.hcb.xmax || Math.max(hcb.xstart, d);
                this.ystart = hcb.ystart;
                this.ydelta = hcb.ydelta;
                var d = hcb.ystart + hcb.ydelta * (this.lps - 1.0);
                this.ymin = this.hcb.ymin || Math.min(hcb.ystart, d);
                this.ymax = this.hcb.ymax || Math.max(hcb.ystart, d);
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

            while (m.pavail(this.hcb) >= (this.hcb.subsize * this.hcb.spa)) {

                // if we aren't scrolling, than update the values
                // so that the axis scrolls with the data.  The below
                // code might seem counter intuitive, but given the
                // the behavior of other rendering code it is configured
                // to have ymin always be the history (i.e prior to ystart)
                // and ystart is always the relative "now" which is equivalent
                // to ymax
                if (this.drawmode !== "scrolling") {
                    this.hcb.ystart += this.hcb.ydelta;
                    this.ystart = this.hcb.ystart;
                    this.ymin = this.hcb.ystart - (this.hcb.ydelta * (this.lps));
                    this.ymax = this.hcb.ystart;
                }

                if (this.drawmode === "falling") {
                    this.position = 0;
                    if (this.img) {
                        mx.shift_image_rows(Mx, this.img, 1);
                    }
                } else if (this.drawmode === "rising") {
                    this.position = this.lps - 1;
                    if (this.img) {
                        mx.shift_image_rows(Mx, this.img, -1);
                    }
                } else if (this.drawmode === "scrolling") {
                    var ylength = Math.abs(this.ymax - this.ymin);
                    this.ystart = 0;
                    this.ymin = 0;
                    this.ymax = ylength;
                    if (this.position >= this.lps) { // if lps got resized make sure we don't go out of bounds
                        this.position = 0;
                    }
                } else {
                    throw "Invalid draw mode";
                }

                if (!this.buf) {
                    // the layer isn't setup correctly yet
                    return;
                }

                // grab one row worth of data
                var ngot = m.grabx(this.hcb, this.buf, this.hcb.subsize * this.hcb.spa);
                if (ngot === 0) { // shouldn't happen because of the pavail check
                    m.log.error("Internal error");
                    return;
                }

                var zpoint = new m.PointArray(this.hcb.subsize);
                if (this.cx) {
                    if (Gx.cmode === 1) {
                        m.cvmag(this.buf, zpoint, zpoint.length);
                    } else if (Gx.cmode === 2) {
                        if (Gx.plab === 25) {
                            m.cvpha(this.buf, zpoint, zpoint.length);
                            m.vsmul(zpoint, 1.0 / (2 * Math.PI), zpoint, zpoint.length);
                        } else if (Gx.plab !== 24) {
                            m.cvpha(this.buf, zpoint, zpoint.length);
                        } else {
                            m.cvphad(this.buf, zpoint, zpoint.length);
                        }
                    } else if (Gx.cmode === 3) {
                        m.vmov(this.buf, this.skip, zpoint, 1, zpoint.length);
                    } else if (Gx.cmode === 4) {
                        m.vmov(this.buf.subarray(1), this.skip, zpoint, 1, zpoint.length);
                    } else if (Gx.cmode === 5) { // IR
                        m.vfill(zpoint, 0, zpoint.length);
                    } else if (Gx.cmode === 6) { // 10log
                        m.cvmag2logscale(this.buf, Gx.dbmin, 10.0, zpoint);
                    } else if (Gx.cmode === 7) { // 20log
                        m.cvmag2logscale(this.buf, Gx.dbmin, 20.0, zpoint);
                    }
                } else {
                    if (Gx.cmode === 1) { // mag
                        m.vabs(this.buf, zpoint);
                    } else if (Gx.cmode === 2) { // phase
                        m.vfill(zpoint, 0, zpoint.length);
                    } else if (Gx.cmode === 3) { // real
                        m.vmov(this.buf, this.skip, zpoint, 1, zpoint.length);
                    } else if (Gx.cmode === 4) { // imag
                        m.vfill(zpoint, 0, zpoint.length);
                    } else if (Gx.cmode === 5) { // IR
                        m.vfill(zpoint, 0, zpoint.length);
                    } else if (Gx.cmode === 6) { // 10log
                        m.vlogscale(this.buf, Gx.dbmin, 10.0, zpoint);
                    } else if (Gx.cmode === 7) { // 20log
                        m.vlogscale(this.buf, Gx.dbmin, 20.0, zpoint);
                    }
                }

                var min = zpoint[0];
                var max = zpoint[0];
                for (var i = 0; i < zpoint.length; i++) {
                    if (zpoint[i] < min) {
                        min = zpoint[i];
                    }
                    if (zpoint[i] > max) {
                        max = zpoint[i];
                    }
                }

                var zmin, zmax;
                if (Gx.autol === 1) {
                    zmin = min;
                    zmax = max;
                } else if (Gx.autol > 1) {
                    var fac = 1.0 / (Math.max(Gx.autol, 1));
                    zmin = Gx.zmin * fac + min * (1.0 - fac);
                    zmax = Gx.zmax * fac + max * (1.0 - fac);
                } else if (Gx.autol < 0) {
                    // -1 means autol wasn't set so default to
                    // 5 like the original XRTRASTER; however,
                    // don't actually override Gx.autol since
                    // other layers may behave differently
                    var fac = 1.0 / (Math.max(5, 1));
                    zmin = Gx.zmin * fac + min * (1.0 - fac);
                    zmax = Gx.zmax * fac + max * (1.0 - fac);
                }

                if (((Gx.autoz & 1) !== 0)) {
                    Gx.zmin = zmin;
                }
                if (((Gx.autoz & 2) !== 0)) {
                    Gx.zmax = zmax;
                }
                if (Gx.p_cuts) {
                    if (this.drawmode === "scrolling") {
                        //fill in the next row of data.
                        var start_write = this.position * this.hcb.subsize;
                        var stop_write = start_write + this.hcb.subsize;
                        var b = 0;
                        for (var i = start_write; i < stop_write; i++) {
                            this.zbuf[i] = zpoint[b];
                            b++;
                        }

                    }
                    if (this.drawmode === "falling") {
                        //shift and fill in the next row of data.
                        var cut_off = (this.lps - 1) * this.hcb.subsize;
                        var tmp = this.zbuf.slice(0, cut_off);
                        this.zbuf = [];
                        for (var i = 0; i < this.hcb.subsize; i++) {
                            this.zbuf.push(zpoint[i]);
                        }
                        this.zbuf.push.apply(this.zbuf, tmp);
                        tmp = [];
                    }
                    if (this.drawmode === "rising") {
                        //shift and fill in the next row of data.
                        var cut_off = this.lps * this.hcb.subsize;
                        var tmp = this.zbuf.slice(this.hcb.subsize, cut_off);
                        this.zbuf = [];
                        this.zbuf.push.apply(this.zbuf, tmp);
                        for (var i = 0; i < this.hcb.subsize; i++) {
                            this.zbuf.push(zpoint[i]);
                        }
                        tmp = [];
                    }
                }

                if (this.img) {
                    mx.update_image_row(Mx, this.img, zpoint, this.position, Gx.zmin, Gx.zmax, Gx.xcompression);
                }
                this.frame += 1;
                if (this.drawmode === "scrolling") {
                    this.position = (this.position + 1) % this.lps;
                }

                if (Mx.level === 0) {
                    Gx.panymin = this.ymin;
                    Gx.panymax = this.ymax;
                    Mx.stk[0].ymin = this.ymin;
                    Mx.stk[0].ymax = this.ymax;
                }
            }
        },

        get_data: function() {
            var HCB = this.hcb;

            if (!this.buf) {
                if (this.hcb.pipe) {
                    // For pipes, we allocate buf and zbuf to only hold one line of
                    // data
                    this.buf = this.hcb.createArray(null, 0, this.hcb.subsize * this.hcb.spa);
                    this.zbuf = new m.PointArray(this.hcb.subsize);
                } else {
                    // Otherwise, we allocate for the entire image
                    this.buf = this.hcb.createArray(null, 0, this.lps * this.hcb.subsize * this.hcb.spa);
                    this.zbuf = new m.PointArray(this.lps * this.hcb.subsize);
                }
            }

            if (!this.hcb.pipe) {
                m.grab(HCB, this.buf, 0, HCB.subsize);
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
            var Gx = this.plot._Gx;

            if (settings.cmode !== undefined) {
                this.img = undefined;
                if (((Gx.autoz & 1) !== 0)) {
                    Gx.zmin = undefined;
                }
                if (((Gx.autoz & 2) !== 0)) {
                    Gx.zmax = undefined;
                }
            }
            if ((settings.zmin !== undefined) ||
                (settings.zmax !== undefined) ||
                (settings.autoz !== undefined)) {
                this.img = undefined;
            }
            if (settings.cmap !== undefined) {
                this.img = undefined;
            }
            if ((settings.drawmode !== undefined) || (settings.xmin !== undefined) ||
                (settings.xmax !== undefined) || (settings.xdelta !== undefined) ||
                (settings.xstart !== undefined)) {
                if (settings.drawmode === undefined) {
                    settings.drawmode = this.drawmode;
                }
                this.drawmode = settings.drawmode;
                // Reset the buffer
                this.position = 0;
                this.frame = 0;
                if (this.hcb.pipe) {
                    this.buf = this.hcb.createArray(null, 0, this.hcb.subsize * this.hcb.spa);
                    this.zbuf = new m.PointArray(this.hcb.subsize);
                } else {
                    this.buf = this.hcb.createArray(null, 0, this.lps * this.hcb.subsize * this.hcb.spa);
                    this.zbuf = new m.PointArray(this.lps * this.hcb.subsize);
                }
                this.img = undefined;

                if (this.drawmode === "falling") {
                    this.plot._Mx.origin = 1;
                    this.preferred_origin = 1;
                } else {
                    this.plot._Mx.origin = 4;
                    this.preferred_origin = 4;
                }
            }
            if (settings.opacity !== undefined) {
                this.opacity = settings.opacity;
            }
            if (settings.p_cuts !== undefined) {
                var p_cuts = Gx.p_cuts;
                if (settings.p_cuts === null) {
                    p_cuts = !p_cuts;
                } else {
                    p_cuts = settings.p_cuts;
                }

                // If p_cuts are enabled from streams, we need to keep the entire zbuf in memory
                if (this.hcb.pipe) {
                    if (!p_cuts) {
                        this.buf = this.hcb.createArray(null, 0, this.lps * this.hcb.subsize * this.hcb.spa);
                        this.zbuf = new m.PointArray(this.lps * this.hcb.subsize);
                    } else {
                        this.buf = this.hcb.createArray(null, 0, this.hcb.subsize * this.hcb.spa);
                        this.zbuf = new m.PointArray(this.hcb.subsize);
                    }
                }
            }
        },

        push: function(data, hdrmod, sync) {
            var Gx = this.plot._Gx;
            var rescale = false;
            var timestamp = null;
            if (hdrmod) {
                // handle timestamps in a unique manner
                if (hdrmod.timestamp) {
                    timestamp = hdrmod.timestamp;
                    delete hdrmod["timestamp"];
                }

                // If the subsize changes, we need to invalidate the buffer
                if ((hdrmod.subsize) && (hdrmod.subsize !== this.hcb.subsize)) {
                    this.hcb.subsize = hdrmod.subsize;
                    if (this.hcb.pipe && !Gx.p_cuts) {
                        this.buf = this.hcb.createArray(null, 0, this.hcb.subsize * this.hcb.spa);
                        this.zbuf = new m.PointArray(this.hcb.subsize);

                    } else {
                        this.buf = this.hcb.createArray(null, 0, this.lps * this.hcb.subsize * this.hcb.spa);
                        this.zbuf = new m.PointArray(this.lps * this.hcb.subsize);
                    }
                    rescale = true;
                }

                for (var k in hdrmod) {
                    if (this.hcb[k] !== hdrmod[k]) {
                        this.hcb[k] = hdrmod[k];
                        if (k === "type") {
                            this.hcb["class"] = hdrmod[k] / 1000;
                        }
                        rescale = true;
                    }
                }

                if (hdrmod.lps) {
                    this.lps = hdrmod.lps;
                }

                if (rescale) {
                    var d = this.hcb.xstart + this.hcb.xdelta * (this.hcb.subsize - 1.0);
                    this.xmin = Math.min(this.hcb.xstart, d);
                    this.xmax = Math.max(this.hcb.xstart, d);
                    this.xdelta = this.hcb.xdelta;
                    this.xstart = this.hcb.xstart;

                    this.ystart = this.hcb.ystart;
                    this.ydelta = this.hcb.ydelta;
                    var d = this.hcb.ystart + this.hcb.ydelta * (this.lps - 1.0);
                    this.ymin = Math.min(this.hcb.ystart, d);
                    this.ymax = Math.max(this.hcb.ystart, d);
                }

            }

            if ((this.hcb.yunits === 1) || (this.hcb.yunits === 4)) {
                if ((!this.hcb["timecode"]) && (timestamp)) {
                    // if we don't have a timecode set, we can use
                    // the timestamp and reset ystart
                    this.hcb.timecode = m.j1970toj1950(timestamp);
                    this.hcb.ystart = 0;
                    rescale = true;
                } else {
                    // otherwise, we need to look at timecode, ystart,
                    // and ydelta to see if the timestamp indicates
                    // any data drops...and then zero-fill accordingly
                    // TODO
                }
            }

            if (data.length > 0) {
                m.filad(this.hcb, data, sync);
            }

            return rescale;

        },

        prep: function(xmin, xmax) {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            var npts = this.lps;

            var skip = this.skip;

            var qmin = this.xmin;
            var qmax = this.xmax;
            var n1, n2;

            var xsize = this.hcb.subsize;
            if (Gx.xcompression > 0) {
                xsize = Math.ceil(Mx.r - Mx.l);
            }

            this.get_data(xmin, xmax);

            if (!this.hcb.pipe) {
                // if we aren't a pipe we do a full prep

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
                        m.log.debug("Nothing to plot");
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
                    m.log.debug("Nothing to plot");
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
                        m.log.debug("Nothing to plot");
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

                if (this.cx) {
                    if (Gx.cmode === 1) { // mag
                        m.cvmag(this.buf, this.zbuf, this.zbuf.length);
                    } else if (Gx.cmode === 2) { // phase
                        if (Gx.plab === 25) {
                            m.cvpha(this.buf, this.zbuf, this.zbuf.length);
                            m.vsmul(this.zbuf, 1.0 / (2 * Math.PI), this.zbuf, this.zbuf.length);
                        } else if (Gx.plab !== 24) {
                            m.cvpha(this.buf, this.zbuf, this.zbuf.length);
                        } else {
                            m.cvphad(this.buf, this.zbuf, this.zbuf.length);
                        }
                    } else if (Gx.cmode === 3) { // real
                        m.vmov(this.buf, this.skip, this.zbuf, 1, this.zbuf.length);
                    } else if (Gx.cmode === 4) { // imag
                        m.vmov(this.buf.subarray(1), this.skip, this.zbuf, 1, this.zbuf.length);
                    } else if (Gx.cmode === 5) { // IR - what does this mean for a raster?
                        m.vfill(this.zbuf, 0, this.zbuf.length);
                    } else if (Gx.cmode === 6) { // 10log
                        m.cvmag2logscale(this.buf, Gx.dbmin, 10.0, this.zbuf);
                    } else if (Gx.cmode === 7) { // 20log
                        m.cvmag2logscale(this.buf, Gx.dbmin, 20.0, this.zbuf);
                    }
                } else {
                    if (Gx.cmode === 1) { // mag
                        m.vabs(this.buf, this.zbuf);
                    } else if (Gx.cmode === 2) { // phase
                        m.vfill(this.zbuf, 0, this.zbuf.length);
                    } else if (Gx.cmode === 3) { // real
                        m.vmov(this.buf, this.skip, this.zbuf, 1, this.zbuf.length);
                    } else if (Gx.cmode === 4) { // imag
                        m.vfill(this.zbuf, 0, this.zbuf.length);
                    } else if (Gx.cmode === 5) { // IR
                        m.vfill(this.zbuf, 0, this.zbuf.length);
                    } else if (Gx.cmode === 6) { // 10log
                        m.vlogscale(this.buf, Gx.dbmin, 10.0, this.zbuf);
                    } else if (Gx.cmode === 7) { // 20log
                        m.vlogscale(this.buf, Gx.dbmin, 20.0, this.zbuf);
                    }
                }

                // find z-min/z-max
                // this is equivalent to setting XRASTER /LPB=0
                var zpoint = this.zbuf;

                var min = 0;
                var max = 0;

                if ((Gx.autol <= 0) || this.hcb.pipe) {
                    // If autol is not used or the layer is rendering
                    // a pipe, then use the basic z-scaling method
                    if (zpoint.length > 0) {
                        min = zpoint[0];
                        max = zpoint[0];
                        for (var i = 0; i < zpoint.length; i++) {
                            if ((i / this.xframe) >= this.lpb) {
                                break;
                            }
                            if (zpoint[i] < min) {
                                min = zpoint[i];
                            }
                            if (zpoint[i] > max) {
                                max = zpoint[i];
                            }
                        }
                    }

                    if (((Gx.autoz & 1) !== 0)) {
                        if (Gx.zmin !== undefined) {
                            Gx.zmin = Math.min(Gx.zmin, min);
                        } else {
                            Gx.zmin = min;
                        }
                    }
                    if (((Gx.autoz & 2) !== 0)) {
                        if (Gx.zmax !== undefined) {
                            Gx.zmax = Math.min(Gx.zmax, max);
                        } else {
                            Gx.zmax = max;
                        }
                    }

                    this.img = mx.create_image(Mx,
                        this.zbuf,
                        this.hcb.subsize,
                        xsize,
                        this.lps,
                        Gx.zmin + Gx.zoff,
                        Gx.zmax + Gx.zoff,
                        Gx.xcompression);
                } else {
                    // otherwise autol > 1
                    var nny = this.hcb.size;
                    var fac = 1.0 / (Math.max(Gx.autol, 1));

                    // If the image isn't yet created, make one now
                    if (!this.img) {
                        this.img = mx.create_image(Mx,
                            this.zbuf,
                            this.hcb.subsize,
                            xsize,
                            this.lps,
                            Gx.zmin + Gx.zoff,
                            Gx.zmax + Gx.zoff);
                    }

                    Gx.zmin = 0;
                    Gx.zmax = 0;
                    if (zpoint.length > 0) {
                        for (var yy = 0; yy < nny; yy++) {
                            var noff = yy * this.xframe;
                            var min = zpoint[noff];
                            var max = zpoint[noff];
                            for (var i = 0; i < this.xframe; i++) {
                                min = Math.min(zpoint[noff + i], min);
                                max = Math.max(zpoint[noff + i], max);
                            }

                            // Auto-scale this raster line
                            if ((Gx.autoz !== 2) && (min !== undefined)) {
                                Gx.zmin = (min * fac) + (Gx.zmin * (1.0 - fac));
                            }
                            if ((Gx.autoz !== 1) && (max !== undefined)) {
                                Gx.zmax = (max * fac) + (Gx.zmax * (1.0 - fac));
                            }

                            // Render the row
                            mx.update_image_row(Mx,
                                this.img,
                                zpoint.subarray(noff, noff + this.xframe),
                                yy,
                                Gx.zmin,
                                Gx.zmax);

                        }
                    }
                }
            } else {
                // Setup image for pipe-mode
                if (Gx.panxmin > Gx.panxmax) {
                    Gx.panxmin = qmin;
                    Gx.panxmax = qmax;
                } else {
                    Gx.panxmin = Math.min(Gx.panxmin, qmin);
                    Gx.panxmax = Math.max(Gx.panxmax, qmax);
                }
                if (Gx.panymin > Gx.panxmax) {
                    Gx.panymin = this.ymin;
                    Gx.panymax = this.ymax;
                } else {
                    Gx.panymin = Math.min(Gx.panymin, this.ymin);
                    Gx.panymax = Math.max(Gx.panymax, this.ymax);
                }

                if (!this.img) {
                    if (Gx.zmin === undefined) {
                        Gx.zmin = 0;
                    }
                    if (Gx.zmax === undefined) {
                        Gx.zmax = 0;
                    }
                    this.img = mx.create_image(Mx,
                        null,
                        this.hcb.subsize,
                        xsize,
                        this.lps,
                        Gx.zmin + Gx.zoff,
                        Gx.zmax + Gx.zoff,
                        Gx.xcompression);
                }
            }

            this.img.cmode = Gx.cmode;
            this.img.cmap = Gx.cmap;
            this.img.origin = Mx.origin;

            // Make the parts without data transparent
            if (this.hcb.pipe && (this.frame < this.lps)) {
                var imgd = new Uint32Array(this.img);
                if (this.drawmode === "rising") {
                    for (var i = 0; i < imgd.length - (this.frame * xsize); i++) {
                        imgd[i] = 0;
                    }
                } else {
                    for (var i = this.frame * xsize; i < imgd.length; i++) {
                        imgd[i] = 0;
                    }
                }
            }

            return npts;
        },

        draw: function() {
            var Mx = this.plot._Mx;
            var Gx = this.plot._Gx;
            var HCB = this.hcb;

            if (this.hcb.pipe) {
                var lps = this.hcb.lps || Math.ceil(Math.max(1, (Mx.b - Mx.t)));
                if ((lps !== this.lps) && this.buf) {
                    this.lps = lps;
                    if (this.position >= this.lps) { // if lps got resized make sure we don't go out of bounds
                        this.position = 0;
                    }
                    var d = HCB.ystart + HCB.ydelta * (this.lps - 1.0);
                    this.ymin = Math.min(HCB.ystart, d);
                    this.ymax = Math.max(HCB.ystart, d);
                    // reset the image since we now have more lines to render
                    // TODO - can we preserve the image data rather than resetting?
                    this.img = null;
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

            // we might need to prep in certian situations
            if ((!this.img) || (!this.buf) || (Gx.cmode !== this.img.cmode) || (Gx.cmap !== this.img.cmap) || (Mx.origin !== this.img.origin)) {
                this.prep(xmin, xmax);
            }

            // if there is an image, render it
            if (this.img) {
                mx.draw_image(Mx, this.img, this.xmin, this.ymin, this.xmax, this.ymax, this.opacity, Gx.rasterSmoothing);
            }

            // render the scrolling pipe line
            if (this.position !== null && this.drawmode === "scrolling") {
                var pnt = mx.real_to_pixel(Mx, 0, this.position * this.ydelta);
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
    Layer2D.overlay = function(plot, hcb, layerOptions) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        hcb.buf_type = "D";

        var layer = new Layer2D(plot);
        layer.init(hcb);

        if (hcb.file_name) {
            layer.name = m.trim_name(hcb.file_name);
        } else {
            layer.name = "layer_" + Gx.lyr.length;
        }

        layer.change_settings(layerOptions);

        if (plot.add_layer(layer)) {
            return layer;
        } else {
            return null;
        }
    };

    module.exports = Layer2D;

}());
