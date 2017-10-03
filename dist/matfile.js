(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.matfile = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @license
 * File: matfile.js
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
/**
 * MAT-files are a binary format directly supported by SigPlot.  A MAT-file consists of a 132-byte header
 * followed by binary data.
 * For more information on MAT-files, please visit https://www.mathworks.com/help/pdf_doc/matlab/matfile_format.pdf
 *
 * Offset   Name        Size    Type        Description
 * -----------------------------------------------------------------------------
 * 0        header     115   char[115]     Header
 * 116      subsys       7   char[7]
 * 124      version      2   int_2
 * 126      endianness   2   char[2]
 * 128      data_offset  4   int_4
 * 132      byte_offset  4   int_4
 *
 * @namespace matfile
 */
(function(global) {
    'use strict';
    /**
     * @memberOf matfile
     * @private
     */
    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);

    // Descriptive text field
    var headerTextBegin = 1;
    var headerTextEnd = 116;

    // Subsystem data offset field
    var subsysOffsetBegin = 117;
    var subsysOffsetEnd = 124;

    // Version field
    var versionOffsetBegin = 125;
    var versionOffsetEnd = 126;

    // Two character endian indicator. If the value reads "MI" then native computer
    // has written the file in Big Endian, so no byte translation must occur.
    // If value reads "IM" then native computer has written the file in Little Endian
    // so byte-wise translation must be used on all data elements larger than 1 byte.
    var endianCharsBegin = 127;
    var endianCharsEnd = 128;

    // Outermost data type and number of bytes. For data plottable in SigPlot this will
    // most likely be a 1D array. The associated MATLAB type will most likely be "miMATRIX".

    // WARNING: type "miCOMPRESSED" is the default for MATLAB files above version 6. These
    // compressed files are currently UNREADABLE by this program as the file must be
    // decompressed before reading.
    var firstDataTypeOffsetBegin = 129;
    var firstDataTypeOffsetEnd = 132;

    var numBytesOffsetBegin = 133;
    var numBytesOffsetEnd = 136;

    // https://gist.github.com/TooTallNate/4750953
    /**
     * Returns the endianness of the browser
     *
     * @memberof matfile
     * @private
     */
    function endianness() {
        var b = new ArrayBuffer(4);
        var a = new Uint32Array(b);
        var c = new Uint8Array(b);
        a[0] = 0xdeadbeef;
        if (c[0] === 0xef) {
            return 'LE';
        }
        if (c[0] === 0xde) {
            return 'BE';
        }
        throw new Error('unknown endianness');
    }

    function getDataField(fileData, firstByte, lastByte) {
        return fileData.slice(firstByte - 1, lastByte);
    }


    /**
     * @memberOf matfile
     * @private
     */
    var ARRAY_BUFFER_ENDIANNESS = endianness();

    /**
     * @memberOf matfile
     * @private
     */
    var versionNames = {
        256: "MAT-file"
    };

    /**
     * @memberOf matfile
     * @private
     */
    var dataTypeNames = {
        1: {
            name: "miINT8",
            size: 1
        },
        2: {
            name: "miUINT8",
            size: 1
        },
        3: {
            name: "miINT16",
            size: 2
        },
        4: {
            name: "miUINT16",
            size: 2
        },
        5: {
            name: "miINT32",
            size: 4
        },
        6: {
            name: "miUINT32",
            size: 4
        },
        7: {
            name: "miSINGLE",
            size: 4
        },
        // 8 is reserved
        9: {
            name: "miDOUBLE",
            size: 8
        },
        // 10 and 11 are reserved
        12: {
            name: "miINT64",
            size: 8
        },
        13: {
            name: "miUINT64",
            size: 8
        },
        14: {
            name: "miMATRIX",
            size: null
        },
        15: {
            name: "miCOMPRESSED",
            size: null
        },
        16: {
            name: "miUTF8",
            size: null
        },
        17: {
            name: "miUTF16",
            size: null
        },
        18: {
            name: "miUTF32",
            size: null
        }
    };

    /**
     * @memberOf matfile
     * @private
     */
    var arrayClassNames = {
        1: "mxCELL_CLASS",
        2: "mxSTRUCT_CLASS",
        3: "mxOBJECT_CLASS",
        4: "mxCHAR_CLASS",
        5: "mxSPARSE_CLASS",
        6: "mxDOUBLE_CLASS",
        7: "mxSINGLE_CLASS",
        8: "mxINT8_CLASS",
        9: "mxUINT8_CLASS",
        10: "mxINT16_CLASS",
        11: "mxUINT16_CLASS",
        12: "mxINT32_CLASS",
        13: "mxUINT32_CLASS",
        14: "mxINT64_CLASS",
        15: "mxUINT64_CLASS"
    };

    /**
     * @memberOf matfilee
     * @private
     */
    var _SPA = {
        'S': 1,
        'C': 2,
        'V': 3,
        'Q': 4,
        'M': 9,
        'X': 10,
        'T': 16,
        'U': 1,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9
    };

    /**
     * @memberOf bluefile
     * @private
     */
    var _BPS = {
        'P': 0.125,
        'A': 1,
        'O': 1,
        'B': 1,
        'I': 2,
        'L': 4,
        'X': 8,
        'F': 4,
        'D': 8
    };

    /**
     * @memberOf bluefile
     * @private
     */
    var _XM_TO_TYPEDARRAY = {
        'P': null,
        'A': null,
        'O': Uint8Array,
        'B': Int8Array,
        'I': Int16Array,
        'L': Int32Array,
        'X': null,
        'F': Float32Array,
        'D': Float64Array
    };

    /**
     * @memberof matfile
     * @param   {array}     buf         Data bffer
     * @param number
     * @param bool
     * @private
     */
    function getInt64(dataView, index, littleEndian) {
        var highIndex, lowIndex;
        var MAX_INT = Math.pow(2, 53);
        if (littleEndian) {
            highIndex = 4;
            lowIndex = 0;
        } else {
            highIndex = 0;
            lowIndex = 4;
        }
        var high = dataView.getInt32(index + highIndex, littleEndian);
        var low = dataView.getInt32(index + lowIndex, littleEndian);
        var rv = low + pow2(32) * high;
        if (rv >= MAX_INT) {
            window.console.info("Int is bigger than JS can represent.");
            return Infinity;
        }
        return rv;
    }

    /**
     * @memberOf matfile
     * @private
     */
    var _applySupportsTypedArray = true;
    try {
        var uintbuf = new Uint8Array(new ArrayBuffer(4));
        uintbuf[0] = 66;
        uintbuf[1] = 76;
        uintbuf[2] = 85;
        uintbuf[3] = 69;
        var test = String.fromCharCode.apply(null, uintbuf);
        if (test !== "BLUE") {
            _applySupportsTypedArray = false;
        }
    } catch (error) {
        _applySupportsTypedArray = false;
    }

    /**
     * @memberof matfile
     * @param   {array}     buf         Data bffer
     * @private
     */
    function ab2str(buf) {
        var uintbuf = new Uint8Array(buf);
        // Firefox 3.6 nor iOS devices can use ArrayBuffers with .apply
        if (_applySupportsTypedArray) {
            return String.fromCharCode.apply(null, uintbuf);
        } else {
            var str = "";
            for (var i = 0; i < uintbuf.length; i++) {
                str += String.fromCharCode(uintbuf[i]);
            }
            return str;
        }
    }

    /**
     * @memberof matfile
     * @param   {string}
     * @private
     */
    function str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    /**
     * @memberof matfile
     * @param   {number}
     * @private
     */
    function pow2(n) {
        return (n >= 0 && n < 31) ? (1 << n) : (pow2[n] || (pow2[n] = Math.pow(2, n)));
    }

    /**
     * @memberof matfile
     * @param   {array}
     * @param   {number}
     * @param   {number}
     * @param   {string}
     * @param   {endian}
     * @private
     */
    function getArray(arrayBuff, startByte, byteLength, type) {
        // Get a JS array from MATLAB array
        // TODO: big endian implemenation

        var outArr = [];
        var dv = new DataView(arrayBuff, startByte, byteLength);

        var array;
        if (type === "miINT8") {
            array = new Int8Array(arrayBuff, startByte, byteLength);
        } else if (type === "miUINT8") {
            array = new Uint8Array(arrayBuff, startByte, byteLength);
        } else if (type === "miINT16") {
            array = new Int16Array(arrayBuff, startByte, byteLength);
        } else if (type === "miUINT16") {
            array = new Uint16Array(arrayBuff, startByte, byteLength);
        } else if (type === "miINT32") {
            array = new Int32Array(arrayBuff, startByte, byteLength);
        } else if (type === "miUINT32") {
            array = new Uint32Array(arrayBuff, startByte, byteLength);
        } else if (type === "miDOUBLE") {
            array = new Float64Array(arrayBuff, startByte, byteLength);
        } else {
            window.console.warn("Array data type not supported yet.");
            return;
        }

        array.forEach(function(element) {
            outArr.push(element);
        });

        return outArr;
    }

    function getDataWithType(dv, typeName, offset, littleEndian) {
        var output;
        switch (typeName) {
            case "miINT8":
                output = dv.getInt8(offset, littleEndian);
                break;
            case "miUINT8":
                output = dv.getInt8(offset, littleEndian);
                break;
            case "miINT16":
                output = dv.getInt16(offset, littleEndian);
                break;
            case "miUINT16":
                output = dv.getUint16(offset, littleEndian);
                break;
            case "miINT32":
                output = dv.getInt32(offset, littleEndian);
                break;
            case "miUINT32":
                output = dv.getUint32(offset, littleEndian);
                break;
            case "miSINGLE":
                output = dv.getFloat32(offset, littleEndian);
                break;
            case "miDOUBLE":
                output = dv.getFloat64(offset, littleEndian);
                break;
            case "miINT64":
                output = getInt64(dv, offset, littleEndian);
                break;
            default:
                window.console.warn(typeName + " not supported at thsi time");
                break;
                /* TODO:           
                case "miUINT64":
                    break;
                case "miMATRIX":
                    break;
                case "miCOMPRESSED":
                    break;
                case "miUTF8":
                    break;
                case "miUTF16":
                    break;
                case "miUTF32":
                    break;*/
        }
        return output;
    }

    /**
     * Create matfile header and attach data buffer
     * @memberof matfile
     * @param   {array}     buf         Data bffer
     */
    function MatHeader(buf, options) {
        this.file = null;
        this.file_name = null;
        this.buf = buf;
        if (this.buf != null) {
            var dvhdr = new DataView(this.buf);
            this.headerStr = ab2str(this.buf.slice(headerTextBegin - 1, headerTextEnd));

            // get endianness
            this.datarep = ab2str(this.buf.slice(endianCharsBegin - 1, endianCharsEnd));
            var littleEndianHdr = (this.datarep === "IM");
            var littleEndianData = (this.datarep === "IM");

            this.headerList = this.headerStr.split(",").map(function(str) {
                return str.trim();
            });
            this.matfile = this.headerList[0];
            this.platform = this.headerList[1];
            this.createdOn = this.headerList[2];
            this.subsystemOffset = ab2str(this.buf.slice(subsysOffsetBegin - 1, subsysOffsetEnd));
            this.version = dvhdr.getUint16(versionOffsetBegin - 1, littleEndianHdr);
            this.versionName = versionNames[this.version];

            this.dataType = dvhdr.getUint32(firstDataTypeOffsetBegin - 1, littleEndianHdr);
            this.dataTypeName = dataTypeNames[this.dataType].name;
            this.arraySize = dvhdr.getUint32(numBytesOffsetBegin - 1, littleEndianHdr);

            var beginArray = numBytesOffsetEnd + 1;

            // Start reading the file linearly from beginning and inc index as you go...
            var currIndex = numBytesOffsetEnd + 1;
            var typeNum = dvhdr.getUint32(currIndex - 1, littleEndianHdr);
            var typeName = dataTypeNames[typeNum].name;
            var typeSize = dataTypeNames[typeNum].size;
            currIndex += 4;

            // bytes per ``typeName``
            var flagLength = getDataWithType(dvhdr, typeName, currIndex - 1, littleEndianData);
            currIndex += typeSize;

            // Array flags
            // If bit is set:
            // - complex: the data element includes an imaginary part
            // - global: "MATLAB loads the data element as a global variable in the base workspace"
            // - logical: indicates the array is used for logical indexing.
            var arrayFlag = getDataWithType(dvhdr, typeName, currIndex - 1, littleEndianData);
            currIndex += typeSize;

            // TODO: use flags for future implementation
            var complexFlag = arrayFlag & 0x80;
            var globalFlag = arrayFlag & 0x40;
            var logicalFlag = arrayFlag & 0x20;

            // Find array class
            var arrayClassNum = arrayFlag & 0xF;
            var arrayClassName = arrayClassNames[arrayClassNum];

            // TODO: sparse array data format implementation: which uses next 4 bytes
            // Skip to next type field (array dimensions)
            currIndex += typeSize;

            // Dimensions type:
            var dimTypeNum = dvhdr.getUint32(currIndex - 1, littleEndianData);
            currIndex += 4;

            var dimTypeName = dataTypeNames[dimTypeNum].name;
            var dimTypeSize = dataTypeNames[dimTypeNum].size;

            // Dimensions size:
            var arrayDimTotalSize = dvhdr.getUint32(currIndex - 1, littleEndianData);
            currIndex += 4;

            // Get number of rows
            var rows = getDataWithType(dvhdr, dimTypeName, currIndex - 1, littleEndianData);
            currIndex += dimTypeSize;

            // TODO: support for >= 2D array types
            if (rows > 1) {
                window.console.warn("Only 1D arrays are currently supported.");
            }

            // Get number of columns
            var cols = getDataWithType(dvhdr, dimTypeName, currIndex - 1, littleEndianData);
            currIndex += typeSize;

            // array name type
            var arrayNameTypeNum = dvhdr.getUint32(currIndex - 1, littleEndianData);
            currIndex += 4;

            var nameSize = 0;
            var small = false;
            if (arrayNameTypeNum > 15) {
                arrayNameTypeNum &= 0x00FF;
                small = true;
                nameSize = dvhdr.getUint16(currIndex - 5, littleEndianData);
            }

            var arrayNameTypeName = dataTypeNames[arrayNameTypeNum].name;
            var arrayNameTypeSize = dataTypeNames[arrayNameTypeNum].size;

            if (!small) {
                nameSize = getDataWithType(dvhdr, arrayNameTypeName, currIndex - 1, littleEndianData);
                currIndex += 4;
            }

            var arrayName = ab2str(this.buf.slice(currIndex - 1, currIndex + nameSize - 1));

            // Pad to end of 64 bit word if necessary
            var rndUp;
            if (small) {
                // Pad from the middle to the end of a 64 bit word
                rndUp = (4 - (nameSize % 4)) % 4;
            } else {
                // Pad from the start of a new word
                rndUp = (8 - (nameSize % 8)) % 8;
            }

            var jumpTo = nameSize + rndUp;
            currIndex += jumpTo;

            // set the data field in the header
            this.setData(this.buf, dvhdr, currIndex, littleEndianData);
        }
    }
    MatHeader.prototype = {
        /**
         * @memberof bluefile
         * @param   buf
         * @param   dvhdr
         * @param   data_end
         * @param   littleEndian
         *
         */
        setData: function(buf, dvhdr, currIndex, littleEndian) {
            var arrayValSize;

            // Array value(s) type:
            var typeNum = dvhdr.getUint32(currIndex - 1, littleEndian);

            // Check for MATLAB "small element type"
            var small = false;
            if (typeNum > 15) {
                typeNum &= 0x00FF;
                small = true;
                arrayValSize = dvhdr.getUint16(currIndex + 1, 2, littleEndian);
            } else {
                currIndex += 4;
            }

            var typeName = dataTypeNames[typeNum].name;
            var typeSize = dataTypeNames[typeNum].size;

            if (!small) {
                arrayValSize = dvhdr.getUint32(currIndex - 1, littleEndian);
                small = false;
            }

            currIndex += 4;

            // Get JS array from MATLAB array
            this.dview = getArray(buf, currIndex - 1, arrayValSize / typeSize, typeName);
        }
    };

    // Internal method from http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
    /**
     * This function creates a new anchor element and uses location
     * properties (inherent) to get the desired URL data. Some String
     * operations are used (to normalize results across browsers).
     *
     * @memberof bluefile
     * @private
     * @param   url
     * @returns -
     */
    function parseURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [null, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [null, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    }

    /**
     * @memberof bluefile
     * @private
     * @param   text
     * @param   oncomplete
     * @param   blocksize
     */
    function text2buffer(text, oncomplete, blocksize) {
        blocksize = blocksize || 1024;
        var i = 0;
        var arrayBuffer = new ArrayBuffer(text.length);
        var bufView = new Uint8Array(arrayBuffer);
        var worker = function() {
            var end = i + blocksize;
            for (; i < end; i++) {
                bufView[i] = (text.charCodeAt(i) & 0xff);
            }
            if (i >= text.length) {
                oncomplete(arrayBuffer);
            } else {
                setTimeout(worker, 0);
            }
        };
        setTimeout(worker, 0);
    }

    /**
     * Matfile Reader
     * @memberof    matfile
     * @param   options
     */
    function MatFileReader(options) {
        this.options = options;
    }

    MatFileReader.prototype = {
        /**
         * @memberof matfile
         * @param   theFile
         * @param   onload
         *
         */
        readheader: function readheader(theFile, onload) {
            var that = this;
            var reader = new FileReader();
            var blob = theFile.webkitSlice(0, 116); // Chrome specific
            // Closure to capture the file information.
            reader.onloadend = (function(theFile) {
                return function(e) {
                    if (e.target.error) {
                        onload(null);
                        return;
                    }
                    var rawhdr = reader.result;
                    var hdr = new MatHeader(rawhdr, that.options);
                    hdr.file = theFile;
                    onload(hdr);
                };
            })(theFile);
            reader.readAsArrayBuffer(blob);
        },

        /**
         *
         * @memberof matfile
         * @param   theFile
         * @param   onload
         *
         */
        read: function read(theFile, onload) {
            var that = this;
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onloadend = (function(theFile) {
                return function(e) {
                    if (e.target.error) {
                        onload(null);
                        return;
                    }
                    var raw = reader.result;
                    var hdr = new MatHeader(raw, that.options);
                    hdr.file = theFile;
                    hdr.file_name = theFile.name;
                    onload(hdr);
                };
            })(theFile);
            reader.readAsArrayBuffer(theFile);
        },

        /**
         *
         * @memberof matfile
         * @param   href
         * @param   onload
         *
         */
        read_http: function read_http(href, onload) {
            var that = this;
            var oReq = new XMLHttpRequest();
            oReq.open("GET", href, true);
            oReq.responseType = "arraybuffer";
            oReq.overrideMimeType('text\/plain; charset=x-user-defined');
            oReq.onload = function(oEvent) {
                if (oReq.readyState === 4) {
                    if ((oReq.status === 200) || (oReq.status === 0)) { // status = 0 is necessary for file URL
                        var arrayBuffer = null; // Note: not oReq.responseText
                        if (oReq.response) {
                            arrayBuffer = oReq.response;
                            var hdr = new MatHeader(arrayBuffer, that.options);
                            parseURL(href);
                            var fileUrl = parseURL(href);
                            hdr.file_name = fileUrl.file;
                            onload(hdr);
                        } else if (oReq.responseText) {
                            text2buffer(oReq.responseText, function(arrayBuffer) {
                                var hdr = new MatHeader(arrayBuffer, that.options);
                                parseURL(href);
                                var fileUrl = parseURL(href);
                                hdr.file_name = fileUrl.file;
                                onload(hdr);
                            });
                        }
                        return;
                    }
                }
                onload(null);
            };
            oReq.onerror = function(oEvent) {
                onload(null);
            };
            oReq.send(null);
        }
    };
    global['MatHeader'] = global['MatHeader'] || MatHeader;
    global['MatFileReader'] = global['MatFileReader'] || MatFileReader;
}(this));

},{}]},{},[1])(1)
});