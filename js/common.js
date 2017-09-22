/**
 * @license
 * File: common.js
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
 *
 */

/* global module */
/* global require */

(function() {

module.exports = {};

if (window.ArrayBuffer) {
    if (!ArrayBuffer.prototype.slice) {
        //Monkey Patching for iOS and early Firefox
        ArrayBuffer.prototype.slice = function(start, end) {
            var that = new Uint8Array(this);
            if (end === undefined) {
                end = that.length;
            }
            var result = new ArrayBuffer(end - start);
            var resultArray = new Uint8Array(result);
            for (var i = 0; i < resultArray.length; i++) {
                resultArray[i] = that[i + start];
            }
            return result;
        };
    }
}

//Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// Shim for requestAnimationFrame compatibility
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelAnimFrame = (function(callback) {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCanelAnimationFrame ||
        function(timeoutID) {
            window.clearTimeout(timeoutID);
    };
})();

// Handle various ways to draw dashed lines
module.exports.dashOn = function(ctx, on, off) {
    if (ctx.setLineDash) {
        ctx.setLineDash([on, off]);
        return true;
    } else if (ctx.mozDash !== undefined) { // Gecko 7.0+
        ctx.mozDash = [on, off];
        return true;
    } else if (ctx.webkitLineDash && ctx.webkitLineDash.length === 0) {
        ctx.webkitLineDash = [on, off];
        return true;
    }
    return false;
};

module.exports.dashOff = function(ctx) {
    if (ctx.setLineDash) {
        ctx.setLineDash([]);
    } else if (ctx.mozDash) { // Gecko 7.0+
        ctx.mozDash = null;
    } else if (ctx.webkitLineDash) {
        ctx.webkitLineDash = [];
    }
};

// Firefox behaves differntly for keypress events
module.exports.getKeyCode = function(e) {
    e = window.event || e;
    e = e.charCode || e.keyCode;
    return e;
};

module.exports.setKeypressHandler = function(handler) {
    if (window.addEventListener) { window.addEventListener('keypress', handler, false); }
    else if (window.attachEvent) {
        window.attachEvent('onkeypress', handler);
    }
};

// Array.isArray
// FF 4+
// IE 9+
// SF 5+
// http://kangax.github.io/es5-compat-table/#Array.isArray
if (!Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
}

if (!window.Float64Array) {
    //Monkey Patching for iOS
    // This is essentially ReadOnly because
    // if someone does x[i] = 5
    // the value will be set in the array
    // but not in the underlying buffer
    window.Float64Array = (function() {
        return window.Float64Array ||
            function(buffer, byteOffset, length) {
                if (!(buffer instanceof ArrayBuffer)) {
                    throw "Invalid type";
                }
                var dv = new DataView(buffer);
                var b = [];
                var maxlength = (buffer.byteLength - byteOffset) / 8;
                if (length === undefined) {
                    b.length = maxlength;
                } else {
                    b.length = Math.min(length, maxlength);
                }

                for (var i = 0; i < b.length; i++) {
                    b[i] = dv.getFloat64(i * 8 + byteOffset, true);
                }
                b.subarray = function(begin, end) {
                    return b.slice(begin, end);
                };
                return b;
        };
    })();
}

// Shims
(function() {
    /* console shim*/
    var f = function() {};
    if (!window.console) {
        window.console = {
            log: f,
            info: f,
            warn: f,
            debug: f,
            error: f
        };
    }

    // Firefox 4 has a glaring subarray bug
    // http://ryanberdeen.com/2011/04/16/firefox-subarray-bug.html
    if (new Int8Array([0, 1, 0]).subarray(1).subarray(1)[0]) {
        var subarray = function(begin, end) {
            if (arguments.length === 0) {
                begin = 0;
                end = this.length;
            } else {
                if (begin < 0) {
                    // relative to end
                    begin += this.length;
                }
                // clamp to 0, length
                begin = Math.max(0, Math.min(this.length, begin));
                if (arguments.length === 1) {
                    // slice to end
                    end = this.length;
                } else {
                    if (end < 0) {
                        // relative to end
                        end += this.length;
                    }
                    // clamp to begin, length
                    end = Math.max(begin, Math.min(this.length, end));
                }
            }

            var byteOffset = this.byteOffset + begin * this.BYTES_PER_ELEMENT;
            return new this.constructor(this.buffer, byteOffset, end - begin);
        };

        var typedArrays = [Int8Array, Uint8Array, Int16Array, Uint16Array,
            Int32Array, Uint32Array, Float32Array, Float64Array
        ];
        typedArrays.forEach(function(cls) {
            cls.prototype.subarray = subarray;
        });
    }

}());

// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel?redirectlocale=en-US&redirectslug=DOM%2FMozilla_event_reference%2Fwheel#Listening_to_this_event_across_browser
// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function(window, document) {

    var prefix = "",
        _addEventListener, onwheel, support;

    // detect event model
    if (window.addEventListener) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
    "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = function(elem, callback, useCapture) {
        _addWheelListener(elem, support, callback, useCapture);

        // handle MozMousePixelScroll in older Firefox
        if (support === "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
        }
    };

    /* jshint -W030 */
    function _addWheelListener(elem, eventName, callback, useCapture) {
        elem[_addEventListener](prefix + eventName, support === "wheel" ? callback : function(originalEvent) {
            !originalEvent && (originalEvent = window.event);

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type === "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support === "mousewheel") {
                event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);

        }, useCapture || false);
    }
    /* jshint +W030 */

})(window, document);

//Updates destenation object with source values
module.exports.update = function update(dst, src) {
    for (var prop in src) {
        var val = src[prop];
        if (typeof val === "object") { // recursive
            update(dst[prop], val);
        } else {
            dst[prop] = val;
        }
    }
    return dst; // return dst to allow method chaining
};

}());
