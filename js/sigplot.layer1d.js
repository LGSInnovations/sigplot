/**
 * @license
 * File: sigplot.layer1d.js
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
 * under the License.
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

    var Layer1D = function(plot) {
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
        this.fillStyle = null;
        this.preferred_origin = 1;

        this.pointbufsize = 0;
        this.xptr = null;
        this.yptr = null;
        this.xpoint = null; // PointArray backed by memory in xptr
        this.ypoint = null; // PointArray backed by memory in yptr

        this.options = {};
    };

    Layer1D.prototype = {

        /**
         * Initializes the layer to display the provided data.
         *
         * @param hcb
         *            {BlueHeader} an opened BlueHeader file
         * @param lyrn
         *          the index of the added layer
         *
         * @memberOf Layer1D
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
                if (hcb["class"] === 2) {
                    m.force1000(hcb);
                    this.size = hcb.subsize;
                }
            }

            if (options.framesize) {
                this.size = options.framesize;
            }

            // pipe data requires a valid size on overlay, but
            // other data can work without a valid size because
            // the reload() function will correctly update the size
            if (this.hcb.pipe && !this.size) {
                throw "1D layer could not determine appropriate size for pipe, use framesize option";
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

                this.ybufn = this.size * Math.max(this.skip * m.PointArray.BYTES_PER_ELEMENT, m.PointArray.BYTES_PER_ELEMENT);
                this.ybuf = new ArrayBuffer(this.ybufn);

                var self = this;
                m.addPipeWriteListener(this.hcb, function() {
                    self._onpipewrite();
                });
            }
        },

        _onpipewrite: function() {
            var ybuf = new m.PointArray(this.ybuf);

            var tle = this.tle; // in scalars
            if (tle === undefined) {
                // if the transfer length wasn't set then we read
                // all the elements that are available
                tle = Math.floor(m.pavail(this.hcb)) / this.hcb.spa;
            }

            // Calculate transfer length in scalars
            var tl = tle * this.hcb.spa;
            while (m.pavail(this.hcb) >= tl) {

                if (this.drawmode === "lefttoright") {
                    this.position = 0;
                    ybuf.set(ybuf.subarray(0, this.size - tl), tl);
                } else if (this.drawmode === "righttoleft") {
                    this.position = this.size - tle;
                    ybuf.set(ybuf.subarray(tl), 0);
                } else if (this.drawmode === "scrolling") {
                    // Nothing to do
                } else {
                    throw "Invalid draw mode";
                }

                // transfer length is adjusted to the remaining size 
                // before wrapping
                var ngot = m.grabx(
                    this.hcb, ybuf,
                    Math.min(tle, this.size - this.position) * this.hcb.spa,
                    this.position * this.hcb.spa
                );
                if (ngot === 0) {
                    break;
                }

                // update the position
                this.position = (this.position + tle) % this.size;

                if (this.tle === undefined) {
                    tle = Math.floor(m.pavail(this.hcb)) / this.hcb.spa;
                }
                tl = tle * this.hcb.spa;
            }

            if (this.plot._Gx.autol !== 0) {
                this.plot.rescale();
            }
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
                this.ybufn = npts * Math.max(skip * m.PointArray.BYTES_PER_ELEMENT,
                    m.PointArray.BYTES_PER_ELEMENT);
                if ((this.ybuf === undefined) || (this.ybuf.byteLength < this.ybufn)) {
                    this.ybuf = new ArrayBuffer(this.ybufn);
                }
                var ybuf = new m.PointArray(this.ybuf);
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
                this.ybufn = this.size * Math.max(this.skip * m.PointArray.BYTES_PER_ELEMENT, m.PointArray.BYTES_PER_ELEMENT);
                this.ybuf = new ArrayBuffer(this.ybufn);
            }

            if (settings.framesize !== undefined) {
                this.size = settings.framesize;
                this.xstart = this.hcb.xstart + (this.imin) * this.xdelta;
                this.xdelta = this.hcb.xdelta;
                var d = this.hcb.xstart + this.hcb.xdelta * (this.size - 1.0);
                this.xmin = Math.min(this.hcb.xstart, d);
                this.xmax = Math.max(this.hcb.xstart, d);
                this.ybufn = this.size * Math.max(this.skip * m.PointArray.BYTES_PER_ELEMENT, m.PointArray.BYTES_PER_ELEMENT);
                this.ybuf = new ArrayBuffer(this.ybufn);
            }
        },

        reload: function(data, hdrmod) {
            if (this.hcb.pipe) {
                throw "reload cannot be used with pipe, use push instead";
            }
            var axis_change = (this.hcb.dview.length !== data.length) || hdrmod;
            if (hdrmod) {
                for (var k in hdrmod) {
                    this.hcb[k] = hdrmod[k];
                    if (k === "xstart" || k === "xdelta") {
                        axis_change = true;
                    }
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
                if (this.hcb["class"] === 2) {
                    m.force1000(this.hcb);
                }
                var d = this.hcb.xstart + this.hcb.xdelta * (this.hcb.size - 1.0);
                this.xmin = Math.min(this.hcb.xstart, d);
                this.xmax = Math.max(this.hcb.xstart, d);
                this.xdelta = this.hcb.xdelta;
                this.xstart = this.hcb.xstart;
                xmin = undefined;
                xmax = undefined;
            }

            return {
                xmin: xmin,
                xmax: xmax
            };
        },

        push: function(data, hdrmod, sync) {
            if (hdrmod) {
                for (var k in hdrmod) {
                    this.hcb[k] = hdrmod[k];
                    if (k === "type") {
                        this.hcb["class"] = hdrmod[k] / 1000;
                    }
                }

                if (hdrmod.subsize) {
                    if (this.hcb["class"] === 2) {
                        m.force1000(this.hcb);
                        this.size = this.hcb.subsize;
                        // Reset the buffer
                        this.position = null;
                        this.ybufn = this.size * Math.max(this.skip * m.PointArray.BYTES_PER_ELEMENT, m.PointArray.BYTES_PER_ELEMENT);
                        this.ybuf = new ArrayBuffer(this.ybufn);
                    }
                }

                var d = this.hcb.xstart + this.hcb.xdelta * (this.size - 1.0);
                this.xmin = this.hcb.xmin || Math.min(this.hcb.xstart, d);
                this.xmax = this.hcb.xmax || Math.max(this.hcb.xstart, d);
                this.xdelta = this.hcb.xdelta;
                this.xstart = this.hcb.xstart;
            }

            if (data.length > 0) {
                m.filad(this.hcb, data, sync);
            }

            return hdrmod ? true : false;

        },

        prep: function(xmin, xmax) {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            var npts = Math.ceil(this.size);

            var skip = this.skip;

            if (npts === 0) {
                return {
                    num: 0,
                    start: 0,
                    end: 0
                };
            }

            if (npts * m.PointArray.BYTES_PER_ELEMENT > this.pointbufsize) {
                this.pointbufsize = npts * m.PointArray.BYTES_PER_ELEMENT;
                this.xptr = new ArrayBuffer(this.pointbufsize);
                this.yptr = new ArrayBuffer(this.pointbufsize);
                this.xpoint = new m.PointArray(this.xptr);
                this.ypoint = new m.PointArray(this.yptr);
            }

            var dbuf = new m.PointArray(this.ybuf);
            var qmin = this.xmin;
            var qmax = this.xmax;
            var n1, n2;
            var mxmn;
            // xsub isn't really used yet, so it can largely be ignored
            if ((Gx.cmode === 5) || (this.xsub > 0)) {
                if (npts <= 0) {
                    // This is a degenerate case when there are no points
                    qmin = Gx.panxmin;
                    qmax = Gx.panxmax;
                } else if (Gx.cmode !== 5) {
                    // Largely unused code since xsub isn't used
                    this.xpoint = new m.PointArray(this.xbuf);
                } else if (this.cx) {
                    // This is the pre-dominate condition
                    m.vmov(dbuf, skip, this.xpoint, 1, npts);
                } else if (this.line !== 0) {
                    // If we have been asked to plot Real vs. Imaginary
                    // for real data and there is a line being drawn
                    // we take the min x and max x and then plot it
                    // later on against the first two ypoints...it's
                    // not clear if this is correct or not, but since
                    // it's a degenerate case it is tolerated
                    mxmn = m.vmxmn(dbuf, npts);
                    this.xpoint[0] = mxmn.smax;
                    this.xpoint[1] = mxmn.smin;
                    n1 = 0;
                    n2 = 2;
                    npts = 2;
                } else {
                    // Otherwise we just plot the y-values
                    this.xpoint = dbuf;
                }
                if (npts > 0) {
                    mxmn = m.vmxmn(this.xpoint, npts);
                    qmax = mxmn.smax;
                    qmin = mxmn.smin;
                    n1 = 0;
                    n2 = npts;
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
                dbuf = new m.PointArray(this.ybuf).subarray(n1 * skip);
                xstart = xstart + xdelta * (n1);
                for (var i = 0; i < npts; i++) {
                    if (Gx.index) {
                        this.xpoint[i] = this.imin + i + 1;
                    } else {
                        this.xpoint[i] = xstart + i * xdelta;
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
                return {
                    num: npts,
                    start: n1,
                    end: n2
                };
            }
            if (this.cx) {
                if (Gx.cmode === 1) {
                    m.cvmag(dbuf, this.ypoint, npts);
                } else if (Gx.cmode === 2) {
                    if (Gx.plab === 25) {
                        m.cvpha(dbuf, this.ypoint, npts);
                        m.vsmul(this.ypoint, 1.0 / (2 * Math.PI), this.ypoint, npts);
                    } else if (Gx.plab !== 24) {
                        m.cvpha(dbuf, this.ypoint, npts);
                    } else {
                        m.cvphad(dbuf, this.ypoint, npts);
                    }
                } else if (Gx.cmode === 3) {
                    m.vmov(dbuf, skip, this.ypoint, 1, npts);
                } else if (Gx.cmode >= 6) {
                    m.cvmag2(dbuf, this.ypoint, npts);
                } else if (Gx.cmode >= 4) {
                    m.vmov(dbuf.subarray(1), skip, this.ypoint, 1, npts);
                }
            } else {
                if (Gx.cmode === 5) { // I vs. R
                    m.vfill(this.ypoint, 0, npts);
                } else if ((Gx.cmode === 1) || (Gx.cmode >= 6)) { // Mag, log
                    for (var i = 0; i < npts; i++) {
                        this.ypoint[i] = Math.abs(dbuf[i]);
                    }
                } else {
                    for (var i = 0; i < npts; i++) {
                        this.ypoint[i] = dbuf[i];
                    }
                }
            }

            if (Gx.cmode >= 6) {
                m.vlog10(this.ypoint, Gx.dbmin, this.ypoint);
                var dbscale = 10.0;
                if (Gx.cmode === 7) {
                    dbscale = 20.0;
                }
                if ((Gx.lyr.length > 0) && (Gx.lyr[0].cx)) {
                    dbscale = dbscale / 2.0;
                }
                m.vsmul(this.ypoint, dbscale, this.ypoint);
            }
            mxmn = m.vmxmn(this.ypoint, npts);

            qmax = mxmn.smax;
            qmin = mxmn.smin;

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

            return {
                num: npts,
                start: n1,
                end: n2
            };
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

            if (this.fillStyle) {
                traceoptions.fillStyle = this.fillStyle;
            } else if (Gx.fillStyle) {
                traceoptions.fillStyle = Gx.fillStyle;
            }
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
                if (this.line === 4) {
                    traceoptions.horzsym = true;
                    traceoptions.vertsym = true;
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

                // sigplot_prep fills in this.xptr and this.yptr (both m.PointArray)
                // with the data to be plotted

                var pts = this.prep(xmin, xmax);
                if (pts.num > 0) {
                    if (segment) {
                        // TODO
                    } else {
                        mx.trace(Mx,
                            ic,
                            new m.PointArray(this.xptr),
                            new m.PointArray(this.yptr),
                            pts.num,
                            pts.start,
                            1,
                            line,
                            symbol,
                            rad,
                            traceoptions);
                    }
                }

                if (Gx.all) {
                    if (this.size === 0) {
                        xmin = xmax;
                    } else {
                        if (Gx.index) {
                            xmin = xmin + pts.num;
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
                var pnt = mx.real_to_pixel(Mx, this.position * this.xdelta, 0);
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
         *            highlight.xstart x value to start the highlight
         *            at
         * @param {Number}
         *            highlight.xend the maximum x value to end the highlight
         *            at
         * @param {String}
         *            hightlight.color the color to use for the highlight
         *
         * @param {String}
         *            hightlight.id the id for the highlight
         */
        add_highlight: function(highlight) {
            if (!this.options.highlight) {
                this.options.highlight = [];
            }
            // Check for nans

            var xmin = highlight.xstart;
            var xmax = highlight.xend;
            var min_nan = isNaN(xmin);
            var max_nan = isNaN(xmax);

            if ((min_nan === true) || (xmin === null) || (xmin === undefined)) {

                this.options.highlight = [];
            }
            if ((max_nan === true) || (xmax === null) || (xmax === undefined)) {

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
        remove_highlight: function(highlight) {
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

        get_highlights: function() {
            if (this.options.highlight) {
                return this.options.highlight.slice(0);
            } else {
                return [];
            }
        },

        /**
         * Clear all highlights from the layer.
         */
        clear_highlights: function() {
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
    Layer1D.overlay = function(plot, hcb, layerOptions) {
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
        if ((hcb["class"] === 2) && (hcb.size > 0)) {
            var num_rows = hcb.size / hcb.subsize;
            n2 = Math.min(num_rows, 16 - Gx.lyr.length);
        }

        // Extract the layer_name before enter the loop
        var layer_name_override = layerOptions["name"];
        delete layerOptions["name"];

        for (var i = n1; i < n2; i++) {
            // This is logic from within sigplot.for LOAD_FILES
            var layer = new Layer1D(plot);
            layer.init(hcb, layerOptions);

            // Provide a default color for the layer
            var n = (Gx.lyr.length) % mixc.length;
            layer.color = mx.getcolor(Mx, m.Mc.colormap[3].colors, mixc[n]);

            // Provide the layer name
            if (hcb["class"] === 2) {
                if (layer_name_override !== undefined) {
                    // If you get an array of names, pull the name
                    // from this list...if we run out of names before
                    // we run out of layers fall back
                    if (Array.isArray(layer_name_override)) {
                        layer.name = layer_name_override[i];
                    } else {
                        layer.name = layer_name_override;
                        layer.name = layer.name + "." + mx.pad((i + 1).toString(), 3, "0");
                    }
                }
                // If a name hasn't been assigned yet
                if (!layer.name) {
                    if (hcb.file_name) {
                        layer.name = m.trim_name(hcb.file_name);
                    } else {
                        layer.name = "layer_" + Gx.lyr.length;
                    }
                    layer.name = layer.name + "." + mx.pad((i + 1).toString(), 3, "0");
                }
                layer.offset = i * hcb.subsize;
            } else {
                if (layer_name_override !== undefined) {
                    layer.name = layer_name_override;
                } else if (hcb.file_name) {
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
            if (plot.add_layer(layer)) {
                return layer;
            } else {
                return null;
            }
        }
    };

    module.exports = Layer1D;

}());
