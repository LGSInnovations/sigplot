/**
 * @license
 * File: m.js
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

/*jslint nomen: true, browser: true, devel: true*/

//Uses Immediately-invoked Function Expressions (IIFE)s for namespaces
//See http://addyosmani.com/blog/essential-js-namespacing/ for details.

/**
 * @namespace
 */
window.m = window.m || {};

(function(m, undefined) {
    'use strict';
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
        0: ["None", "U"],
        1: ["Time", "sec"],
        2: ["Delay", "sec"],
        3: ["Frequency", "Hz"],
        4: ["Time code format", ""],
        5: ["Distance", "m"],
        6: ["Speed", "m/s"],
        7: ["Acceleration", "m/sec^2"],
        8: ["Jerk", "m/sec^3"],
        9: ["Doppler", "Hz"],
        10: ["Doppler rate", "Hz/sec"],
        11: ["Energy", "J"],
        12: ["Power", "W"],
        13: ["Mass", "g"],
        14: ["Volume", "l"],
        15: ["Angular power density", "W/ster"],
        16: ["Integrated power density", "W/rad"],
        17: ["Spatial power density", "W/m^2"],
        18: ["Integrated power density", "W/m"],
        19: ["Spectral power density", "W/MHz"],
        20: ["Amplitude", "U"],
        21: ["Real", "U"],
        22: ["Imaginary", "U"],
        23: ["Phase", "rad"],
        24: ["Phase", "deg"],
        25: ["Phase", "cycles"],
        26: ["10*Log", "U"],
        27: ["20*Log", "U"],
        28: ["Magnitude", "U"],
        29: ["Unknown", "U"],
        30: ["Unknown", "U"],
        31: ["General dimensionless", ""],
        32: ["Counts", ""],
        33: ["Angle", "rad"],
        34: ["Angle", "deg"],
        35: ["Relative power", "dB"],
        36: ["Relative power", "dBm"],
        37: ["Relative power", "dBW"],
        38: ["Solid angle", "ster"],
        40: ["Distance", "ft"],
        41: ["Distance", "nmi"],
        42: ["Speed", "ft/sec"],
        43: ["Speed", "nmi/sec"],
        44: ["Speed", "knots=nmi/hr"],
        45: ["Acceleration", "ft/sec^2"],
        46: ["Acceleration", "nmi/sec^2"],
        47: ["Acceleration", "knots/sec"],
        48: ["Acceleration", "G"],
        49: ["Jerk", "G/sec"],
        50: ["Rotation", "rps"],
        51: ["Rotation", "rpm"],
        52: ["Angular velocity", "rad/sec"],
        53: ["Angular velocity", "deg/sec"],
        54: ["Angular acceleration", "rad/sec^2"],
        55: ["Angular acceleration", "deg/sec^2"],
        60: ["Latitude", "deg"],
        61: ["Longitude", "deg"],
        62: ["Altitude", "ft"],
        63: ["Altitude", "m"]
    };

    /** Common structure 
     * @private
     */
    m.Mc = {
        // Colormaps are stored as 7 element tables which are then
        //	interpolated to the number of colors actually used in a graphics routine
        //	call to MX$COLORMAP.

        // There are 4 colormap tables stored in the environment: A GREYSCALE,
        // COLORRAMP, COLORWHEEL, or COLORSPECTRUM.  The specific values that
        // are listed here are from xcolordef.prm (use the XCOLORMAP widget).
        //
        // The actual values are a result of tribal knowledge and years of experience
        colormap: [
            [ // GREYSCALE
                {
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
                }
            ],
            [ // COLORRAMP
                {
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
                }
            ],
            [ // COLORWHEEL
                {
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
                }
            ],
            [ // COLORSPECTRUM
                {
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
                }
            ],
            [ // SUNSET
                {
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
                }
            ]
        ]
    };

    /** Pipe Size 
     * @private
     */
    m.PIPESIZE = 1024 * 1024;

    /**
     * Creates new file with header initialized to type-1000 defaults
     * and data appended. (tbd)
     * @param	{string}	filename	Name of File to Create
     * @param  	{array}		data		Input data buffer
     * @param  	{array}	  	overrides	List of fields/values to be overridden in the bluefile header
     * @return 	{header} 	hcb		Return <hcb> type-1000 bluefile header, filename=null
     */
    m.initialize = function(data, overrides) {
        var hcb = new BlueHeader(null);

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

        if (!overrides) { /* if no overrides provided...set it to empty*/
            overrides = {};
        }

        for (var field in overrides) {
            hcb[field] = overrides[field];
        }

        // Force type 2000 is subsize is specified
        if (hcb["subsize"] > 1) {
            hcb.type = 2000;
        }
        hcb["class"] = hcb.type / 1000;
        // If this is a type 2000 , subsize *must* be provided
        if ((hcb["class"] === 2) && (overrides["subsize"] === undefined)) {
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
        var prefix = "?";
        if (mult === 1.0e3) {
            prefix = 'K';
        } else if (mult === 1.0e-3) {
            prefix = 'm';
        } else if (mult === 1.0e6) {
            prefix = 'M';
        } else if (mult === 1.0e-6) {
            prefix = 'u';
        } else if (mult === 1.0e9) {
            prefix = 'G';
        } else if (mult === 1.0e-9) {
            prefix = 'n';
        } else if (mult === 1.0e12) {
            prefix = 'T';
        } else if (mult === 1.0e-12) {
            prefix = 'p';
        } else if (mult === 1) {
            prefix = "";
        }

        if (u[1]) {
            return u[0] + " (" + prefix + u[1] + ")";
        } else {
            return u[0];
        }
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
        var midnightTomorrow = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
        var midnightJan = new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
        var midnightDec = new Date(d.getFullYear() + 1, 0, 1, 0, 0, 0);
        var diffDaySecs = (midnightTomorrow - midnightToday) / 1000; //    86400 secs = 24*60*60
        var diffYearSecs = (midnightDec - midnightJan) / 1000; // 31536000 secs = 365*24*60*60
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

        if ((sec % 1) !== 0) {
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
            var j1950offset = (20.0 * 365.0 + 5.0) * (24 * 3600);
            d = new Date((sec - j1950offset) * 1000);
            tod = d.getFullYear() + ":" + pad2(d.getMonth()) + ":" + pad2(d.getDate()) + "::" +
                pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
        }
        if ((sec % 1) !== 0) {
            tod += "." + (sec % 1).toPrecision(6).slice(2, 8);
        }
        return tod;
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

}(window.m));
