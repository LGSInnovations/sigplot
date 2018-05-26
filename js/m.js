/**
 * @license
 * File: m.js
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

/*jslint nomen: true, browser: true, devel: true*/

//Uses Immediately-invoked Function Expressions (IIFE)s for namespaces
//See http://addyosmani.com/blog/essential-js-namespacing/ for details.

/* global module */
/* global require */

(function() {
    'use strict';

    var bluefile = require("./bluefile");
    var loglevel = require("loglevel");

    function m() {}

    m.log = loglevel;

    /**
     *
     *
     * @memberOf sigplot
     * @private
     */
    var PointArray = null;

    /**
     * True if we detected that we are on an iOS device
     *
     * @memberOf sigplot
     * @private
     */
    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
    if ((iOS) || // iOS doesn't support Float64
        (typeof Float64Array === 'undefined') || // If it's undefined it's obviously not supported
        (Float64Array.emulated) || // If it's emulated, don't waste time on extra precision
        (!Float64Array.BYTES_PER_ELEMENT)) { // If bytes per element isn't defined, it's a buggy implementation (i.e. PhantomJS)
        m.PointArray = Float32Array;
    } else {
        m.PointArray = Float64Array;
    }


    /** UNITS Structure:
     *		0: ["None", "U"],
     *		1: ["Time", "sec"],
     *		2: ["Delay", "sec"],
     *		3: ["Frequency", "Hz"],
     *		4: ["Time code format", ""],
     *		5: ["Distance", "m"],
     *		6: ["Speed", "m/s"],
     *		7: ["Acceleration", "m/sec^2"],
     *		8: ["Jerk", "m/sec^3"],
     *		9: ["Doppler", "Hz"],
     *		10: ["Doppler rate", "Hz/sec"],
     *		11: ["Energy", "J"],
     *		12: ["Power", "W"],
     *		13: ["Mass", "g"],
     *		14: ["Volume", "l"],
     *		15: ["Angular power density", "W/ster"],
     *		16: ["Integrated power density", "W/rad"],
     *		17: ["Spatial power density", "W/m^2"],
     *		18: ["Integrated power density", "W/m"],
     *		19: ["Spectral power density", "W/MHz"],
     *		20: ["Amplitude", "U"],
     *		21: ["Real", "U"],
     *		22: ["Imaginary", "U"],
     *		23: ["Phase", "rad"],
     *		24: ["Phase", "deg"],
     *		25: ["Phase", "cycles"],
     *		26: ["10*Log", "U"],
     *		27: ["20*Log", "U"],
     *		28: ["Magnitude", "U"],
     *		29: ["Unknown", "U"],
     *		30: ["Unknown", "U"],
     *		31: ["General dimensionless", ""],
     *		32: ["Counts", ""],
     *		33: ["Angle", "rad"],
     *		34: ["Angle", "deg"],
     *		35: ["Relative power", "dB"],
     *		36: ["Relative power", "dBm"],
     *		37: ["Relative power", "dBW"],
     *		38: ["Solid angle", "ster"],
     *		40: ["Distance", "ft"],
     *		41: ["Distance", "nmi"],
     *		42: ["Speed", "ft/sec"],
     *		43: ["Speed", "nmi/sec"],
     *		44: ["Speed", "knots=nmi/hr"],
     *		45: ["Acceleration", "ft/sec^2"],
     *		46: ["Acceleration", "nmi/sec^2"],
     *		47: ["Acceleration", "knots/sec"],
     *		48: ["Acceleration", "G"],
     *		49: ["Jerk", "G/sec"],
     *		50: ["Rotation", "rps"],
     *		51: ["Rotation", "rpm"],
     *		52: ["Angular velocity", "rad/sec"],
     *		53: ["Angular velocity", "deg/sec"],
     *		54: ["Angular acceleration", "rad/sec^2"],
     *		55: ["Angular acceleration", "deg/sec^2"],
     *		60: ["Latitude", "deg"],
     *		61: ["Longitude", "deg"],
     *		62: ["Altitude", "ft"],
     *		63: ["Altitude", "m"]
     * @global
     */
    var UNITS = {
        0: ["None", "U", true, true],
        1: ["Time", "sec", true, true],
        2: ["Delay", "sec", true, false],
        3: ["Frequency", "Hz", true, true],
        4: ["Time code format", "", true, false],
        5: ["Distance", "m", true, true],
        6: ["Speed", "m/s", true, true],
        7: ["Acceleration", "m/sec^2", true, true],
        8: ["Jerk", "m/sec^3", true, true],
        9: ["Doppler", "Hz", true, false],
        10: ["Doppler rate", "Hz/sec", true, true],
        11: ["Energy", "J", true, true],
        12: ["Power", "W", true, true],
        13: ["Mass", "g", true, true],
        14: ["Volume", "l", true, true],
        15: ["Angular power density", "W/ster", true, true],
        16: ["Integrated power density", "W/rad", true, true],
        17: ["Spatial power density", "W/m^2", true, true],
        18: ["Integrated power density", "W/m", false, true],
        19: ["Spectral power density", "W/MHz", true, true],
        20: ["Amplitude", "U", true, false],
        21: ["Real", "U", true, false],
        22: ["Imaginary", "U", true, false],
        23: ["Phase", "rad", true, true],
        24: ["Phase", "deg", false, true],
        25: ["Phase", "cycles", false, true],
        26: ["10*Log", "U", true, false],
        27: ["20*Log", "U", true, false],
        28: ["Magnitude", "U", true, false],
        29: ["Unknown", "U", true, false],
        30: ["Unknown", "U", false, false],
        31: ["General dimensionless", "", true, true],
        32: ["Counts", "", true, false],
        33: ["Angle", "rad", true, false],
        34: ["Angle", "deg", false, false],
        35: ["Relative power", "dB", true, true],
        36: ["Relative power", "dBm", false, true],
        37: ["Relative power", "dBW", false, true],
        38: ["Solid angle", "ster", true, true],
        40: ["Distance", "ft", false, true],
        41: ["Distance", "nmi", false, true],
        42: ["Speed", "ft/sec", false, true],
        43: ["Speed", "nmi/sec", false, true],
        44: ["Speed", "knots=nmi/hr", false, true],
        45: ["Acceleration", "ft/sec^2", false, true],
        46: ["Acceleration", "nmi/sec^2", false, true],
        47: ["Acceleration", "knots/sec", false, true],
        48: ["Acceleration", "G", false, true],
        49: ["Jerk", "G/sec", false, true],
        50: ["Rotation", "rps", true, false],
        51: ["Rotation", "rpm", false, false],
        52: ["Angular velocity", "rad/sec", true, true],
        53: ["Angular velocity", "deg/sec", false, true],
        54: ["Angular acceleration", "rad/sec^2", true, true],
        55: ["Angular acceleration", "deg/sec^2", false, true],
        60: ["Latitude", "deg", true, false],
        61: ["Longitude", "deg", true, false],
        62: ["Altitude", "ft", true, false],
        63: ["Altitude", "m", false, false]
    };

    m.UNITS = UNITS;

    /** Common structure
     * @private
     */
    m.Mc = {
        // Colormaps are stored as 7 element tables which are then
        //	interpolated to the number of colors actually used in a graphics routine
        //	call to MX$COLORMAP.

        // There are 4 colormap tables stored in the environment: A GREYSCALE,
        // COLORRAMP, COLORWHEEL, COLORSPECTRUM, or SUNSET.  The specific values that
        // are listed here are from xcolordef.prm (use the XCOLORMAP widget).
        //
        // The actual values are a result of tribal knowledge and years of experience
        colormap: [{
                name: "Greyscale",
                colors: [{
                    pos: 0,
                    red: 0,
                    green: 0,
                    blue: 0
                }, {
                    pos: 60,
                    red: 50,
                    green: 50,
                    blue: 50
                }, {
                    pos: 100,
                    red: 100,
                    green: 100,
                    blue: 100
                }, {
                    pos: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }]
            }, {
                name: "Ramp Colormap",
                colors: [{
                    pos: 0,
                    red: 0,
                    green: 0,
                    blue: 15
                }, {
                    pos: 10,
                    red: 0,
                    green: 0,
                    blue: 50
                }, {
                    pos: 31,
                    red: 0,
                    green: 65,
                    blue: 75
                }, {
                    pos: 50,
                    red: 0,
                    green: 85,
                    blue: 0
                }, {
                    pos: 70,
                    red: 75,
                    green: 80,
                    blue: 0
                }, {
                    pos: 83,
                    red: 100,
                    green: 60,
                    blue: 0
                }, {
                    pos: 100,
                    red: 100,
                    green: 0,
                    blue: 0
                }]
            }, {
                name: "Color Wheel",
                colors: [{
                    pos: 0,
                    red: 100,
                    green: 100,
                    blue: 0
                }, {
                    pos: 20,
                    red: 0,
                    green: 80,
                    blue: 40
                }, {
                    pos: 30,
                    red: 0,
                    green: 100,
                    blue: 100
                }, {
                    pos: 50,
                    red: 10,
                    green: 10,
                    blue: 0
                }, {
                    pos: 65,
                    red: 100,
                    green: 0,
                    blue: 0
                }, {
                    pos: 88,
                    red: 100,
                    green: 40,
                    blue: 0
                }, {
                    pos: 100,
                    red: 100,
                    green: 100,
                    blue: 0
                }]
            }, {
                name: "Spectrum",
                colors: [{
                    pos: 0,
                    red: 0,
                    green: 75,
                    blue: 0
                }, {
                    pos: 22,
                    red: 0,
                    green: 90,
                    blue: 90
                }, {
                    pos: 37,
                    red: 0,
                    green: 0,
                    blue: 85
                }, {
                    pos: 49,
                    red: 90,
                    green: 0,
                    blue: 85
                }, {
                    pos: 68,
                    red: 90,
                    green: 0,
                    blue: 0
                }, {
                    pos: 80,
                    red: 90,
                    green: 90,
                    blue: 0
                }, {
                    pos: 100,
                    red: 95,
                    green: 95,
                    blue: 95
                }]
            }, {
                name: "calewhite",
                colors: [{
                    pos: 0,
                    red: 100,
                    green: 100,
                    blue: 100
                }, {
                    pos: 16.666,
                    red: 0,
                    green: 0,
                    blue: 100
                }, {
                    pos: 33.333,
                    red: 0,
                    green: 100,
                    blue: 100
                }, {
                    pos: 50,
                    red: 0,
                    green: 100,
                    blue: 0
                }, {
                    pos: 66.666,
                    red: 100,
                    green: 100,
                    blue: 0
                }, {
                    pos: 83.333,
                    red: 100,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 100,
                    green: 0,
                    blue: 100
                }]
            }, {
                name: "HotDesat",
                colors: [{
                    pos: 0,
                    red: 27.84,
                    green: 27.84,
                    blue: 85.88
                }, {
                    pos: 14.2857,
                    red: 0,
                    green: 0,
                    blue: 35.69
                }, {
                    pos: 28.571,
                    red: 0,
                    green: 100,
                    blue: 100
                }, {
                    pos: 42.857,
                    red: 0,
                    green: 49.8,
                    blue: 0
                }, {
                    pos: 57.14286,
                    red: 100,
                    green: 100,
                    blue: 0
                }, {
                    pos: 71.42857,
                    red: 100,
                    green: 37.65,
                    blue: 0
                }, {
                    pos: 85.7143,
                    red: 41.96,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 87.84,
                    green: 29.8,
                    blue: 29.8
                }]
            }, {
                name: "Sunset",
                colors: [{
                    pos: 0,
                    red: 10,
                    green: 0,
                    blue: 23
                }, {
                    pos: 18,
                    red: 34,
                    green: 0,
                    blue: 60
                }, {
                    pos: 36,
                    red: 58,
                    green: 20,
                    blue: 47
                }, {
                    pos: 55,
                    red: 74,
                    green: 20,
                    blue: 28
                }, {
                    pos: 72,
                    red: 90,
                    green: 43,
                    blue: 0
                }, {
                    pos: 87,
                    red: 100,
                    green: 72,
                    blue: 0
                }, {
                    pos: 100,
                    red: 100,
                    green: 100,
                    blue: 76
                }]
            },
            {
                name: "Hot",
                colors: ["#000000", "#7f0000", "#b30000", "#d7301f", "#ef6548", "#fc8d59", "#fdbb84", "#fdd49e", "#fee8c8", "#fff7ec", "#ffffff"]
            }, {
                name: "Cold",
                colors: ["#000000", "#023858", "#045a8d", "#0570b0", "#3690c0", "#74a9cf", "#a6bddb", "#d0d1e6", "#ece7f2", "#fff7fb", "#ffffff"]
            },
            {
                name: "Purple",
                colors: ["#230022", "#4d004b", "#810f7c", "#88419d", "#8c6bb1", "#8c96c6", "#9ebcda", "#bfd3e6", "#e0ecf4", "#f7fcfd"]
            }, {
                name: "BuGn",
                colors: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b']
            }, {
                name: "YlOrBr",
                colors: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506']
            }, {
                name: "YlGnBu",
                colors: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']
            }, {
                name: "YlOrRd",
                colors: ["#000000", "#662506", "#993404", "#cc4c02", "#ec7014", "#fe9929", "#fec44f", "#fee391", "#fff7bc", "#ffffe5", "#ffffff"]
            }, {
                name: "GreyNRed",
                colors: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'].reverse()
            }
        ]
    };

    /** Pipe Size
     * @private
     */
    m.PIPESIZE = 1024 * 1024;

    /**
     * Converts unit strings to number code
     * @param	{string}	unitInput	User unit input
     */
    m.unit_lookup = function(unitInput) {
        for (var i = 0; i < 64; i++) {
            var u;
            if (UNITS[i] === undefined) {
                u = UNITS[0];
            } else {
                u = UNITS[i];
            }
            var first = u[0];
            var second = u[1];
            var comparer1 = u[0] + " " + u[1];
            var comparer2 = u[0] + "_" + u[1];
            if (unitInput === first) {
                if (u[2]) {
                    return i;
                }
            } else if (unitInput === second) {
                if (u[3]) {
                    return i;
                }
            } else if ((unitInput === comparer1) || (unitInput === comparer2)) {
                return i;
            }
        }
        return unitInput;
    };

    /**
     * Creates new file with header initialized to type-1000 defaults
     * and data appended. (tbd)
     * @param	{string}	filename	Name of File to Create
     * @param  	{array}		data		Input data buffer
     * @param  	{array}	  	overrides	List of fields/values to be overridden in the bluefile header
     * @return 	{header} 	hcb		Return <hcb> type-1000 bluefile header, filename=null
     */
    m.initialize = function(data, overrides) {
        var hcb = new bluefile.BlueHeader(null);

        hcb.version = 'BLUE';
        hcb.size = 0;
        hcb.type = 1000;
        hcb.format = 'SF';
        hcb.timecode = 0.0;
        hcb.xstart = 0.0;
        hcb.xdelta = 1.0;
        hcb.xunits = 0;
        hcb.subsize = 1;
        hcb.ystart = 0.0;
        hcb.ydelta = 1.0;
        hcb.yunits = 0;
        hcb.enabled_streaming_pcut = false;

        if (!overrides) { /* if no overrides provided...set it to empty*/
            overrides = {};
        }

        for (var field in overrides) {
            hcb[field] = overrides[field];
        }

        //Convert xunits and yunits to numbers if they are strings
        hcb["xunits"] = m.unit_lookup(hcb["xunits"]);
        hcb["yunits"] = m.unit_lookup(hcb["yunits"]);


        // Force type 2000 is subsize is specified
        if (hcb["subsize"] > 1) {
            hcb.type = 2000;
        } else if (Array.isArray(data) && Array.isArray(data[0])) {
            //If this is a 2-D array automatically set subsize
            hcb.type = 2000;
            hcb.subsize = data[0].length;
        }
        hcb["class"] = hcb.type / 1000;
        // If this is a type 2000 , subsize *must* be provided
        if ((hcb["class"] === 2) && (hcb["subsize"] === undefined)) {
            throw "subsize must be provided with type 2000 files";
        }


        if (!overrides.pipe) {
            hcb.setData(data);
        } else {
            hcb.pipe = true;
            hcb.in_byte = 0;
            hcb.out_byte = 0;
            // TODO round pipe size to nearest number of elements
            var pipesize = overrides.pipesize || m.PIPESIZE;

            hcb.buf = new ArrayBuffer(pipesize);
            hcb.setData(hcb.buf);
            hcb.data_free = hcb.dview.length;
        }

        return hcb;
    };

    /**
     * Convert type-2000 header internals to force GRAB and FILAD routines to treat file as a 1000-type file.
     * @param	{header}	hcb		Bluefile header control block
     */
    m.force1000 = function(hcb) {
        if (hcb["class"] === 2) {
            if ((hcb.size) && (!hcb.pipe)) {
                hcb.size = hcb.subsize * hcb.size;
            } else {
                // assume the size is 0
                hcb.size = 0;
            }
            hcb.bpe = hcb.bpe / hcb.subsize;
            hcb.ape = 1;
        }
    };

    /**
     * Get data from file at specified start location.
     * @param	{header}	hcb		Bluefile header control block
     * @param	{array}		bufview		Data buffer to receive data
     * @param	{number}	start		Start location
     * @param	{number}	nget		Number of requested data
     * @return	{number}	ngot		Number of received data
     */
    m.grab = function(hcb, bufview, start, nget) {
        if (!hcb.dview) {
            return 0;
        }

        // TODO reformat
        if (hcb.format[0] === 'C') {
            start = start * 2;
        }

        nget = hcb.ape * nget; // TODO - this is never used????

        //var ngot = Math.min(bufview.length, (hcb.dview.length-start)); //mmm
        var ngot = Math.min(bufview.length, (hcb.dview.length - start));
        // iOS doesn't have .set on TypedArrays
        if (bufview.set === undefined) {
            for (var i = 0; i < ngot; i++) {
                bufview[i] = hcb.dview[start + i];
            }
        } else {
            bufview.set(hcb.dview.subarray(start, start + ngot));
        }
        if (hcb.format[0] === 'C') {
            ngot = ngot / 2;
        }
        return ngot;
    };

    /**
     * Append data buffer to file specified in the bluefile header control block.
     * @param	{header}	hcb		Bluefile header control block
     * @param	{array}		data		Data buffer
     * @param   {boolean}       [sync=false]    dispatch onpipewrite syncronously
     */
    m.filad = function(hcb, data, sync) {
        if (hcb.data_free < data.length) {
            throw "Pipe full";
        }
        var sidx = hcb.in_byte / hcb.dview.BYTES_PER_ELEMENT;
        var eidx = (sidx + data.length);
        if (eidx > hcb.dview.length) {
            var head = hcb.dview.length - sidx;
            var tail = data.length - head;
            if (data.subarray) {
                hcb.dview.set(data.subarray(0, head), sidx);
                hcb.dview.set(data.subarray(head, data.length), 0);
            } else {
                hcb.dview.set(data.slice(0, head), sidx);
                hcb.dview.set(data.slice(head, data.length), 0);
            }
            hcb.in_byte = (tail * hcb.dview.BYTES_PER_ELEMENT);
        } else {
            hcb.dview.set(data, sidx);
            hcb.in_byte = (eidx * hcb.dview.BYTES_PER_ELEMENT) % hcb.buf.byteLength;
        }
        hcb.data_free -= data.length;
        if (hcb.onwritelisteners) {
            for (var i = 0; i < hcb.onwritelisteners.length; i++) {
                if (!sync) {
                    window.setTimeout(hcb.onwritelisteners[i], 0);
                } else {
                    hcb.onwritelisteners[i]();
                }
            }
        }
    };

    /**
     * @param	{header}	hcb		Bluefile header control block
     * @return	{number}	elements available
     * @private
     */
    m.pavail = function(hcb) {
        return hcb.dview.length - hcb.data_free;
    };

    /**
     * Get data from file in dataflow fashion.
     * @param	{array}		hcb	Bluefile header control block
     * @param 	{array}		dview	Data buffer to receive data
     * @param	{number}	nget	Input variable name of parameter to receive data
     * @param	{number}	offset	Offset into file
     * @return	{number}	ngot	Number of data values gotten
     */
    // WARNING - nget is number of scalars...which differs from the normal API
    m.grabx = function(hcb, dview, nget, offset) {
        var navail = hcb.dview.length - hcb.data_free;
        if (offset === undefined) {
            offset = 0;
        }
        if (!nget) {
            nget = Math.min(dview.length - offset, navail);
        } else if (nget > dview.length - offset) {
            throw "m.grabx : nget larger then available buffer space";
        }
        if (nget < 0) {
            throw "m.grabx : nget cannot be negative";
        }
        if (nget > navail) {
            return 0;
        }

        var sidx = hcb.out_byte / hcb.dview.BYTES_PER_ELEMENT;
        var eidx = (sidx + nget);
        if (eidx >= hcb.dview.length) {
            var head = hcb.dview.length - sidx;
            eidx = eidx - hcb.dview.length;
            dview.set(hcb.dview.subarray(sidx, hcb.dview.length), offset);
            dview.set(hcb.dview.subarray(0, eidx), offset + head);
        } else {
            dview.set(hcb.dview.subarray(sidx, eidx), offset);
        }
        hcb.out_byte = (eidx * hcb.dview.BYTES_PER_ELEMENT) % hcb.buf.byteLength;
        hcb.data_free += nget;
        var ngot = nget;
        return ngot;
    };


    /**
     * @param	{header}	hcb		Bluefile header control block
     * @param	{number}	onwrite		-
     * @private
     */
    m.addPipeWriteListener = function(hcb, onwrite) {
        if (!hcb.onwritelisteners) {
            hcb.onwritelisteners = [];
        }
        if (hcb.onwritelisteners.indexOf(onwrite) === -1) {
            hcb.onwritelisteners.push(onwrite);
        }
    };

    /**
     * Returns ASCII description of units code
     * @param 	{number}	UNITS array index (see global UNITS)
     * @return 	{string}	ASCII code pair
     */
    // ~= M$UNITS_NAME
    m.units_name = function(units) {
        var u = UNITS[units];
        return u[0] + " (" + u[1] + ")";
    };

    /**
     * Extract filename from full path
     * @param 	{string}	pathfilename	Full path, including filename
     * @return	{string}	filename	    Trimmed filename
     */
    m.trim_name = function(pathfilename) {
        var i = pathfilename.indexOf(']');
        if (i === -1) {
            i = pathfilename.indexOf('/');
        }
        if (i === -1) {
            i = pathfilename.indexOf(':');
        }
        var j = pathfilename.substr(i + 1, pathfilename.length).indexOf('.');
        if (j < 0) {
            j = pathfilename.length - i;
        }
        var filename = pathfilename.substr(i + 1, i + j + 1);
        return filename;
    };

    /**
     * Takes an integer code for units and a multiplier and returns the string representation of the two.
     * Example: l = m.label(1,1.0e3) ==> l =  Time (Ksec)
     * @param 	{number}	units	Integer code for Unit (see global UNITS)
     * @param 	{number} 	mult	Units multiplier (i.e 1.0e3 ==> 'K')
     * @return {string} representation of units and multiplier
     */
    // ~= M$LABEL
    m.label = function(units, mult) {
        var u = ["Unknown", "U"];

        if (typeof units === "string") {
            u = [units, null];
        } else if (Array.isArray(units)) {
            u = units;
        } else {
            u = UNITS[units];
            if (u === undefined) {
                u = ["Unknown", "U"];
            }
        }

        var prefix = m.mult_prefix(mult);

        if (u[1]) {
            return u[0] + " (" + prefix + u[1] + ")";
        } else {
            return u[0];
        }
    };

    /**
     * @method bound
     * @param a
     * @param b
     * @param c
     */
    m.bound = function(a, b, c) {
        return a < b ? b : (a > c ? c : a);
    };

    m.touch_distance = function(touchA, touchB) {
        var xd = (touchA.pageX - touchB.pageX);
        var yd = (touchA.pageY - touchB.pageY);
        return Math.sqrt((xd * xd) + (yd * yd));
    };

    m.mult_prefix = function(mult) {
        var prefix = "?";

        /* jshint -W116 */
        if (mult == 1) {
            prefix = "";
        } else if (mult == 10) {
            prefix = 'da';
        } else if (mult == 0.1) {
            prefix = 'd';
        } else if (mult == 100) {
            prefix = 'h';
        } else if (mult == 0.01) {
            prefix = 'c';
        } else if (mult == 1.0e3) {
            prefix = 'K';
        } else if (mult == 1.0e-3) {
            prefix = 'm';
        } else if (mult == 1.0e6) {
            prefix = 'M';
        } else if (mult == 1.0e-6) {
            prefix = 'u';
        } else if (mult == 1.0e9) {
            prefix = 'G';
        } else if (mult == 1.0e-9) {
            prefix = 'n';
        } else if (mult == 1.0e12) {
            prefix = 'T';
        } else if (mult == 1.0e-12) {
            prefix = 'p';
        }
        /* jshint +W116 */

        return prefix;
    };

    /**
     * @private
     */
    var VECTOR = {
        MV: 'F', // vector type
        MS: 'F', // scalar type...not really necessary in javascript
        nbpt: 4,
        view: undefined
    };


    /**
     * Sets data type for all subsequent calls to vector libraries.  Remains in effect until another call to this routine.
     * @param ctype
     */
    // ~= VSTYPE - not really necessary
    m.vstype = function(ctype) {
        VECTOR.MS = ctype;
        VECTOR.MV = ctype;
        if (VECTOR.MV === 'D') {
            VECTOR.nbpt = 8;
        } else if ((VECTOR.MV === 'L') || (VECTOR.MV === 'F')) {
            VECTOR.nbpt = 4;
        } else if (VECTOR.MV === 'I') {
            VECTOR.nbpt = 2;
        } else if (VECTOR.MV === 'B') {
            VECTOR.nbpt = 1;
        } else {
            alert("Unsupported vector type");
        }
    };

    m.log10 = function(v, lo_thresh) {
        if (lo_thresh === undefined) {
            lo_thresh = 1.0e-20;
        }
        return Math.log(Math.max(v, lo_thresh)) / Math.log(10);
    };

    /**
     * For each vector element in <src>, determine the max of <src> element and <lo_thresh>, returns the log(base10) of that value in <dst>
     * @param	{array}		src		Input vector.
     * @param 	{number} 	lo_thresh	User-set minimum log threshold (if not defined, set default=1.0e-20). Prevent computing log of 0 or negative values.
     * @param 	{array}		dst		Ouput vector.  If undefined, <src> elements will be overwritten.
     */
    // ~= M$VLOG10- not really necessary
    m.vlog10 = function(src, lo_thresh, dst) {
        if (lo_thresh === undefined) {
            lo_thresh = 1.0e-20;
        }
        if (dst === undefined) {
            dst = src;
        }
        for (var i = 0; i < src.length; i++) {
            if (dst.length <= i) {
                break;
            }
            dst[i] = Math.log(Math.max(src[i], lo_thresh)) / Math.log(10);
        }
    };

    /**
     * Same as vlog10 but multiply each output value by a scale factor <dbscale>.
     * @param 	{array}		src		Input vector.
     * @param 	{number}	lo_thresh	User-set minimum log threshold.
     *                                              If undefined, defaults to 1.0e-20. Prevent computing log of 0 or negative values.
     * @param 	{number}	dbscale		Output scale factor. If undefined, defaults to 1.
     * @param 	{array}		dst		Output vector. If undefined, <src> elements will be overwritten.
     * @private
     */
    m.vlogscale = function(src, lo_thresh, dbscale, dst) {
        if (lo_thresh === undefined) {
            lo_thresh = 1.0e-20;
        }
        if (dbscale === undefined) {
            dbscale = 1;
        }
        if (dst === undefined) {
            dst = src;
        }
        for (var i = 0; i < src.length; i++) {
            if (dst.length <= i) {
                break;
            }
            dst[i] = Math.log(Math.abs(Math.max(src[i], lo_thresh))) / Math.log(10);
            dst[i] = dst[i] * dbscale;
        }
    };

    /**
     * Same as vlogscale but computes magnitude squared.
     *
     * @param 	{array}		src		Input vector.
     * @param 	{number}	lo_thresh	User-set minimum log threshold.
     *                                              If undefined, defaults to 1.0e-20. Prevent computing log of 0 or negative values.
     * @param 	{number}	dbscale		Output scale factor. If undefined, defaults to 1.
     * @param 	{array}		dst		Output vector. If undefined, <src> elements will be overwritten.
     * @private
     */
    m.cvmag2logscale = function(src, lo_thresh, dbscale, dst) {
        if (lo_thresh === undefined) {
            lo_thresh = 1.0e-20;
        }
        if (dbscale === undefined) {
            dbscale = 1;
        }
        if (dst === undefined) {
            dst = src;
        }
        var j = 0;
        for (var i = 0; i < dst.length; i++) {
            j = 2 * i + 1;
            if (j >= src.length) {
                break;
            }
            dst[i] = (src[j - 1] * src[j - 1]) + (src[j] * src[j]);
            dst[i] = Math.log(Math.abs(Math.max(dst[i], lo_thresh))) / Math.log(10);
            dst[i] = dst[i] * dbscale;
        }
    };

    /**
     * Multiply <count> elements of <src> by <mul>, store results in <dst>
     * @param	{array} 	src		Input vector.
     * @param	{number}	mul		Vector multiplier.
     * @param	{array}		dst		Output vector. If not defined, <src> elements will be overwritten.
     * @param	{number}	count		Number of elements to apply multiplier, starting with first <src> element.
     */
    // ~= M$VSMUL
    m.vsmul = function(src, mul, dst, count) {
        if (dst === undefined) {
            dst = src;
        }
        if (count === undefined) {
            count = dst.length;
        }
        count = Math.min(dst.length, count);
        count = Math.min(src.length, count);

        for (var i = 0; i < count; i++) {
            if (dst.length <= i) {
                break;
            }
            dst[i] = src[i] * mul;
        }
    };

    /**
     * Finds max and min values in vector <vec> and returns values.
     * @param 	{array}		vec		Input vector.
     * @param	{number}	size		Number of elements to search to find max.min values.
     * @return 	{array}		mxmin		Index and value of min and max elements in <vec>.
     */
    // ~= M$VMXMN
    m.vmxmn = function(vec, size) {
        // Originally this code used an object to hold the values
        // but Chrome 34.0.1847.131 seemed to have a bug where
        // these values would somehow get messed up...oddly
        // putting printouts or breakpoints prevented the
        // problem from showing up.
        var smax = vec[0];
        var smin = vec[0];
        var imax = 0;
        var imin = 0;
        size = Math.min(size, vec.length);
        for (var i = 0; i < size; i++) {
            if (vec[i] > smax) {
                smax = vec[i];
                imax = i;
            }
            if (vec[i] < smin) {
                smin = vec[i];
                imin = i;
            }
        }
        return {
            smax: smax,
            smin: smin,
            imax: imax,
            imin: imin
        };
    };

    /**
     * Move <count> elements from <src> to <dest>.  Stride is the distance between each array element in either or both the input and output vectors.
     * @param {array}	src		Input vector.
     * @param {number}	sstride		Input stride.
     * @param {array}	dest		Output vector.
     * @param {number}	dstride		Output stride.
     * @param {number}	count		Number of input vector elements to move, starting with 0th element of <vec>. Cannot exceed vector lengths,
     *					taking into account the strides.
     */
    m.vmov = function(src, sstride, dest, dstride, count) {
        if (count === undefined) {
            count = src.length;
        }
        count = Math.min(src.length, count);
        //count = Math.min(src.length, count, (count)*(dest.length)*(dstride)); //mmm-TODO

        for (var i = 0; i < count; i++) {
            var s = i * sstride;
            var d = i * dstride;
            if (s >= src.length) {
                break;
            }
            if (d >= dest.length) {
                break;
            }
            dest[d] = src[s];
        }
    };

    /**
     * Initialize <count> consecutive elements of input vector <vec> with value <inpval>.
     * @param	{array}		vec		Input vector
     * @param	{number}	inpval		Value
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <vec>.  If undefined, entire <vec> is written.
     */
    // ~= M$VFILL
    // TODO - more optimal version?
    m.vfill = function(vec, inpval, count) {
        if (count === undefined) {
            count = vec.length;
        }
        count = Math.min(vec.length, count);
        for (var i = 0; i < count; i++) {
            vec[i] = inpval;
        }
    };

    /**
     * Compute the absolute value of <count> elements in <vec> and write to output vector <dest>
     * @param 	{array}		vec		Input vector.
     * @param 	{array}		dest		Ouput vector. If <dest> is undefined, overwrite input vector <vec>.
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <vec>. Cannot exceed vector lengths.
     */
    m.vabs = function(vec, dest, count) {
        if (count === undefined) {
            count = vec.length;
        }
        if (dest === undefined) {
            dest = vec;
        }
        //count = Math.min(dest.length, count, vec.length); //mmm-TODO
        for (var i = 0; i < count; i++) {
            dest[i] = Math.abs(vec[i]);
        }
    };


    /**
     * Computes the magnitude of <count> complex vector <cxvec> elements. Store results in output vector <dest>.
     * @param	{array}		cxvec		Input vector
     * @param 	{array}		dest		Output vector
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <cxvec>. Cannot exceed vector lengths.  If undefined, defaults to output vector <dest> length.
     */
    // ~= M$CVMAG
    m.cvmag = function(cxvec, dest, count) {
        if (count === undefined) {
            count = dest.length;
        }
        count = Math.min(dest.length, count);
        //count = Math.min(dest.length, count, cxvec.length); //mmm-TODO

        for (var i = 0; i < count; i++) {
            var j = 2 * i + 1;
            if (j >= cxvec.length) {
                break;
            }
            dest[i] = Math.sqrt((cxvec[j - 1] * cxvec[j - 1]) + (cxvec[j] * cxvec[j]));
        }
    };

    /**
     * Computes the magnitude squared of <count> complex vector <cxvec> elements. Store results in output vector <dest>.
     * @param	{array}		cxvec		Input vector
     * @param 	{array}		dest		Output vector
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <cxvec>. Cannot exceed vector lengths.  If undefined, defaults to output vector <dest> length.
     */
    // ~= M$CVMAG2
    m.cvmag2 = function(cxvec, dest, count) {
        if (count === undefined) {
            count = dest.length;
        }
        count = Math.min(dest.length, count);
        //count = Math.min(dest.length, count, cxvec.length); //mmm-TODO

        var j = 0;
        for (var i = 0; i < count; i++) {
            j = 2 * i + 1;
            if (j >= cxvec.length) {
                break;
            }
            dest[i] = (cxvec[j - 1] * cxvec[j - 1]) + (cxvec[j] * cxvec[j]);
        }
    };

    /**
     * Computes phase in radians of <count> complex vector <cxvec> elements. Store results in output vector <dest>.
     * @param	{array}		cxvec		Input vector
     * @param 	{array}		dest		Output vector
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <cxvec>. Cannot exceed vector lengths.  If undefined, defaults to output vector <dest> length.
     */
    // ~= M$CVPHA
    m.cvpha = function(cxvec, dest, count) {
        if (count === undefined) {
            count = dest.length;
        }
        count = Math.min(dest.length, count);
        //count = Math.min(dest.length, count, cxvec.length); //mmm-TODO

        var j = 0;
        var re = 0;
        var im = 0;
        for (var i = 0; i < count; i++) {
            j = 2 * i + 1;
            if (j >= cxvec.length) {
                break;
            }
            re = cxvec[j - 1];
            im = cxvec[j];
            if ((re === 0.0) && (im === 0.0)) {
                re = 1.0;
            }
            dest[i] = Math.atan2(im, re);
        }
    };

    /**
     * Computes the phase in degrees of <count> complex vector <cxvec> elements. Store results in output vector <dest>.
     * @param	{array}		cxvec		Input vector
     * @param 	{array}		dest		Output vector
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <cxvec>. Cannot exceed vector lengths.  If undefined, defaults to output vector <dest> length.
     */
    // ~= M$CVPHAD
    m.cvphad = function(cxvec, dest, count) {
        if (count === undefined) {
            count = dest.length;
        }
        count = Math.min(dest.length, count);

        var j = 0;
        var re = 0;
        var im = 0;
        for (var i = 0; i < count; i++) {
            j = 2 * i + 1;
            if (j >= cxvec.length) {
                break;
            }
            re = cxvec[j - 1];
            im = cxvec[j];
            if ((re === 0.0) && (im === 0.0)) {
                re = 1.0;
            }
            dest[i] = Math.atan2(im, re) * (180.0 / Math.PI);
        }
    };

    /**
     * @param n
     * @private
     */
    // ~= INT(), DINT
    m.trunc = function(n) {
        return n - n % 1;
    };

    /**
     * @param a1
     * @param a2
     * @private
     */
    // Transfer of sign function from Fortran
    m.sign = function(a1, a2) {
        if (a2 >= 0) {
            return Math.abs(a1);
        } else {
            return -Math.abs(a1);
        }
    };

    /**
     * @method pad2
     * @param number
     * @private
     */

    function pad2(number) {
        return (number < 10 ? '0' : '') + number;
    }

    /**
     * Convert J1950 time or seconds-since-Epoch (midnight Dec-31-1949) to time-of-day. Fractional seconds accurate to milliseconds.
     * @param 	{number}	sec		Number of seconds.
     * @return	{string}	tod		Time of day
     */

    /* Output string can be in different forms as follows:
     * -31536000 <  sec < 0                   -DDD::HH:MM:SS
     *         0 <= sec < 86400                     HH:MM:SS
     *         86400 <= sec < 31536000         DDD::HH:MM:SS
     *         31536000 <=sec            YYYY:MM:DD:HH:MM:SS.<FFFFFF>
     *                                    where FFFFFF is in microseconds
     *
     */

    m.sec2tod = function(sec, trim_trailing_zeros) {
        var tod = "";
        var j1950 = Date.UTC(1950, 0, 1); //From 1950 to 1970
        var j1950Date = new Date(j1950); //debug var
        var j1949 = Date.UTC(1949, 11, 31);
        var j1949Date = new Date(j1949); //debug var
        var d = new Date();
        var midnightToday = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        var diffDaySecs = 86400; //    86400 secs = 24*60*60
        var diffYearSecs = 31536000; // 31536000 secs = 365*24*60*60
        var negDiffYearSecs = -1 * diffYearSecs; //-31536000 secs

        if (sec >= 0) {
            if (sec < diffDaySecs) {
                // hh:mm:ss
                var millisecs = midnightToday.getTime() + (sec * 1000);
                var d = new Date(millisecs);
                tod = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
            } else if (sec === 86400) {
                tod = "24:00:00";
            } else if (sec < diffYearSecs) {
                // ddd:hh:mm:ss
                var days = sec / diffDaySecs;
                days = [days > 0 ? Math.floor(days) : Math.ceil(days)];
                var d = new Date((sec * 1000) + midnightToday.getTime());
                tod = days.toString() + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
            } else {
                // convert to j1950
                var secMilli = Math.floor(sec * 1000) + j1950;
                d = new Date(secMilli);
                tod = d.getUTCFullYear() + ":" + pad2(d.getUTCMonth() + 1) + ":" + pad2(d.getUTCDate()) + "::" +
                    pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds());
            }
        } else {
            if (sec > negDiffYearSecs) {
                // -ddd:hh:mm:ss
                var days = sec / diffDaySecs;
                days = (days <= 0) ? Math.ceil(days) : Math.floor(days);
                var d = new Date(Math.abs(sec * 1000) + midnightToday.getTime());
                if (days === 0) {
                    days = "-0";
                } else {
                    days = days.toString();
                }
                tod = days + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
            } else {
                // convert to j1950
                var secMilli = Math.floor(sec * 1000) + j1950;
                d = new Date(secMilli);
                tod = d.getUTCFullYear() + ":" + pad2(d.getUTCMonth() + 1) + ":" + pad2(d.getUTCDate()) + "::" +
                    pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds());
            }
        }

        // violate legacy behavior, include full precision always
        // even if we are on a full second boundary, otherwise
        // on rising/falling rasters it can look like the display
        // is flickering
        var fractional = (sec % 1);
        if (fractional === 0.0) {
            tod += ".000000";
        } else {
            tod += "." + Math.abs(sec % 1).toPrecision(6).slice(2, 8);
        }

        if (trim_trailing_zeros) {
            var dloc = tod.indexOf(".");
            var zloc = -1;
            // If there is a 'decimal point'
            if (dloc !== -1) {
                zloc = tod.substr(dloc, tod.length).indexOf("0");
            }
            if (zloc !== -1) {
                tod = tod.substr(0, dloc + zloc);
            }
        }
        return tod;

    };

    /**
     * The offset to convert midnight Jan 1st 1970 to
     * midnight Jan 1st 1950.
     *
     * @private
     */
    var j1950offset = (20.0 * 365.0 + 5.0) * (24 * 3600);

    /**
     * 0.0 - 86400 == m.sec2tod
     * >86400 then modulo 86400
     *   if modulo <= 0 return m.sec2tod(modulo)+86400
     *   if module <
     */
    m.sec2tspec = function(sec, mode, trim_trailing_zeros) {
        mode = mode || "";
        if (sec >= 0 && sec <= 86400) {
            return m.sec2tod(sec, trim_trailing_zeros);
        } else {
            sec = sec % 86400;
            if (mode !== "delta" && sec <= 0) {
                return m.sec2tod(sec + 86400, trim_trailing_zeros);
            } else if (mode === "delta" && sec <= 0) {
                return "-" + m.sec2tod(-1 * sec, trim_trailing_zeros);
            } else {
                return m.sec2tod(sec, trim_trailing_zeros);
            }
        }
    };

    /**
     * @param 	{number}	sec		Number of seconds.
     * @return	{string}	tod		Time of day
     */

    m.sec2tod_j1970 = function(sec) {
        var tod = "";
        var d;
        if ((sec >= 0) && (sec < 86400)) {
            // hh:mm:ss
            d = new Date(sec * 1000);
            tod = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());

        } else if ((sec < 0) && (sec > -31536000)) {
            // -ddd:hh:mm:ss
            var days = -1 * (sec / (24 * 60 * 60));
            d = new Date(sec * 1000);
            tod = days.toString() + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
        } else {
            // convert to j1950
            d = new Date((sec - j1950offset) * 1000);
            tod = d.getFullYear() + ":" + pad2(d.getMonth()) + ":" + pad2(d.getDate()) + "::" +
                pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
        }
        if ((sec % 1) !== 0) {
            tod += "." + (sec % 1).toPrecision(6).slice(2, 8);
        }
        return tod;
    };

    m.j1970toj1950 = function(t) {
        if (t.getTime !== undefined) {
            return ((t.getTime() / 1000) + j1950offset);
        } else {
            return (t + j1950offset);
        }
    };

    m.j1950toj1970 = function(t) {
        return (t - j1950offset);
    };

    /**
     * @private
     */
    // Throttle calls to "callback" routine and ensure that it
    // is not invoked any more often than "delay" milliseconds.
    //
    m.throttle = function(delay, callback) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();

            //
            // if "delay" milliseconds have expired since
            // the previous call then propagate this call to
            // "callback"
            //
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    };

    // Node: Export function
    module.exports = m;

}());
