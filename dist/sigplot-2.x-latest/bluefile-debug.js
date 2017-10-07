/*

 File: common.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.


 File: bluefile.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.

*/
(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else {
    if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else {
        if (typeof global !== "undefined") {
          g = global;
        } else {
          if (typeof self !== "undefined") {
            g = self;
          } else {
            g = this;
          }
        }
      }
      g.bluefile = f();
    }
  }
})(function() {
  var define, module, exports;
  return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) {
            return a(o, !0);
          }
          if (i) {
            return i(o, !0);
          }
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {exports:{}};
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0;o < r.length;o++) {
      s(r[o]);
    }
    return s;
  }({1:[function(require, module, exports) {
    (function() {
      var common = require("./common");
      function bluefile() {
      }
      var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false;
      function endianness() {
        var b = new ArrayBuffer(4);
        var a = new Uint32Array(b);
        var c = new Uint8Array(b);
        a[0] = 3735928559;
        if (c[0] === 239) {
          return "LE";
        }
        if (c[0] === 222) {
          return "BE";
        }
        throw new Error("unknown endianness");
      }
      var ARRAY_BUFFER_ENDIANNESS = endianness();
      var _SPA = {"S":1, "C":2, "V":3, "Q":4, "M":9, "X":10, "T":16, "U":1, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9};
      var _BPS = {"P":0.125, "A":1, "O":1, "B":1, "I":2, "L":4, "X":8, "F":4, "D":8};
      var _XM_TO_TYPEDARRAY = {"P":null, "A":null, "O":Uint8Array, "B":Int8Array, "I":Int16Array, "L":Int32Array, "X":null, "F":Float32Array, "D":Float64Array};
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
      var _XM_TO_DATAVIEW = {"P":null, "A":null, "O":"getUint8", "B":"getInt8", "I":"getInt16", "L":"getInt32", "X":getInt64, "F":"getFloat32", "D":"getFloat64"};
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
      function ab2str(buf) {
        var uintbuf = new Uint8Array(buf);
        if (_applySupportsTypedArray) {
          return String.fromCharCode.apply(null, uintbuf);
        } else {
          var str = "";
          for (var i = 0;i < uintbuf.length;i++) {
            str += String.fromCharCode(uintbuf[i]);
          }
          return str;
        }
      }
      function str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2);
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length;i < strLen;i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }
      function pow2(n) {
        return n >= 0 && n < 31 ? 1 << n : pow2[n] || (pow2[n] = Math.pow(2, n));
      }
      bluefile.BlueHeader = function(buf, options) {
        this.options = {ext_header_type:"dict"};
        common.update(this.options, options);
        this.buf = buf;
        if (this.buf != null) {
          var dvhdr = new DataView(this.buf);
          this.version = ab2str(this.buf.slice(0, 4));
          this.headrep = ab2str(this.buf.slice(4, 8));
          this.datarep = ab2str(this.buf.slice(8, 12));
          var littleEndianHdr = this.headrep === "EEEI";
          var littleEndianData = this.datarep === "EEEI";
          this.ext_start = dvhdr.getInt32(24, littleEndianHdr);
          this.ext_size = dvhdr.getInt32(28, littleEndianHdr);
          this.type = dvhdr.getUint32(48, littleEndianHdr);
          this["class"] = this.type / 1E3;
          this.format = ab2str(this.buf.slice(52, 54));
          this.timecode = dvhdr.getFloat64(56, littleEndianHdr);
          if (this["class"] === 1) {
            this.xstart = dvhdr.getFloat64(256, littleEndianHdr);
            this.xdelta = dvhdr.getFloat64(256 + 8, littleEndianHdr);
            this.xunits = dvhdr.getInt32(256 + 16, littleEndianHdr);
            this.yunits = dvhdr.getInt32(256 + 40, littleEndianHdr);
            this.subsize = 1;
          } else {
            if (this["class"] === 2) {
              this.xstart = dvhdr.getFloat64(256, littleEndianHdr);
              this.xdelta = dvhdr.getFloat64(256 + 8, littleEndianHdr);
              this.xunits = dvhdr.getInt32(256 + 16, littleEndianHdr);
              this.subsize = dvhdr.getInt32(256 + 20, littleEndianHdr);
              this.ystart = dvhdr.getFloat64(256 + 24, littleEndianHdr);
              this.ydelta = dvhdr.getFloat64(256 + 32, littleEndianHdr);
              this.yunits = dvhdr.getInt32(256 + 40, littleEndianHdr);
            }
          }
          this.data_start = dvhdr.getFloat64(32, littleEndianHdr);
          this.data_size = dvhdr.getFloat64(40, littleEndianHdr);
          var ds = this.data_start;
          var de = this.data_start + this.data_size;
          if (this.ext_size) {
            this.ext_header = this.unpack_keywords(this.buf, this.ext_size, this.ext_start * 512, littleEndianHdr);
          }
          this.setData(this.buf, ds, de, littleEndianData);
        }
      };
      bluefile.BlueHeader.prototype = {setData:function(buf, offset, data_end, littleEndian) {
        if (this["class"] === 1) {
          this.spa = _SPA[this.format[0]];
          this.bps = _BPS[this.format[1]];
          this.bpa = this.spa * this.bps;
          this.ape = 1;
          this.bpe = this.ape * this.bpa;
        } else {
          if (this["class"] === 2) {
            this.spa = _SPA[this.format[0]];
            this.bps = _BPS[this.format[1]];
            this.bpa = this.spa * this.bps;
            this.ape = this.subsize;
            this.bpe = this.ape * this.bpa;
          }
        }
        if (littleEndian === undefined) {
          littleEndian = ARRAY_BUFFER_ENDIANNESS === "LE";
        }
        if (ARRAY_BUFFER_ENDIANNESS === "LE" && !littleEndian) {
          throw "Not supported " + ARRAY_BUFFER_ENDIANNESS + " " + littleEndian;
        } else {
          if (ARRAY_BUFFER_ENDIANNESS === "BE" && this.littleEndianData) {
            throw "Not supported " + ARRAY_BUFFER_ENDIANNESS + " " + littleEndian;
          }
        }
        if (buf) {
          if (offset && data_end) {
            this.dview = this.createArray(buf, offset, (data_end - offset) / this.bps);
          } else {
            this.dview = this.createArray(buf);
          }
          this.size = this.dview.length / (this.spa * this.ape);
        } else {
          this.dview = this.createArray(null, null, this.size);
        }
      }, unpack_keywords:function(buf, lbuf, offset, littleEndian) {
        var lkey, lextra, ltag, format, tag, data, ldata, itag, idata, dvk;
        var keywords = [];
        var dic_index = {};
        var dict_keywords = {};
        var ii = 0;
        buf = buf.slice(offset, buf.length);
        var dvhdr = new DataView(buf);
        buf = ab2str(buf);
        while (ii < lbuf) {
          idata = ii + 8;
          lkey = dvhdr.getUint32(ii, littleEndian);
          lextra = dvhdr.getInt16(ii + 4, littleEndian);
          ltag = dvhdr.getInt8(ii + 6, littleEndian);
          format = buf.slice(ii + 7, ii + 8);
          ldata = lkey - lextra;
          itag = idata + ldata;
          tag = buf.slice(itag, itag + ltag);
          if (format === "A") {
            data = buf.slice(idata, idata + ldata);
          } else {
            if (_XM_TO_DATAVIEW[format]) {
              if (typeof _XM_TO_DATAVIEW[format] === "string") {
                data = dvhdr[_XM_TO_DATAVIEW[format]](idata, littleEndian);
              } else {
                data = _XM_TO_DATAVIEW[format](dvhdr, idata, littleEndian);
              }
            } else {
              window.console.info("Unsupported keyword format " + format + " for tag " + tag);
            }
          }
          if (typeof dic_index[tag] === "undefined") {
            dic_index[tag] = 1;
          } else {
            dic_index[tag]++;
            tag = "" + tag + dic_index[tag];
          }
          dict_keywords[tag] = data;
          keywords.push({tag:tag, value:data});
          ii += lkey;
        }
        var dictTypes = ["dict", "json", {}, "XMTable", "JSON", "DICT"];
        for (var k in dictTypes) {
          if (dictTypes[k] === this.options.ext_header_type) {
            return dict_keywords;
          }
        }
        return keywords;
      }, createArray:function(buf, offset, length) {
        var TypedArray = _XM_TO_TYPEDARRAY[this.format[1]];
        if (TypedArray === undefined) {
          throw "unknown format " + this.format[1];
        }
        if (offset === undefined) {
          offset = 0;
        }
        if (length === undefined) {
          length = buf.length || buf.byteLength / _BPS[this.format[1]];
        }
        if (buf) {
          return new TypedArray(buf, offset, length);
        } else {
          return new TypedArray(length);
        }
      }};
      function parseURL(url) {
        var a = document.createElement("a");
        a.href = url;
        return{source:url, protocol:a.protocol.replace(":", ""), host:a.hostname, port:a.port, query:a.search, params:function() {
          var ret = {}, seg = a.search.replace(/^\?/, "").split("&"), len = seg.length, i = 0, s;
          for (;i < len;i++) {
            if (!seg[i]) {
              continue;
            }
            s = seg[i].split("=");
            ret[s[0]] = s[1];
          }
          return ret;
        }(), file:(a.pathname.match(/\/([^\/?#]+)$/i) || [null, ""])[1], hash:a.hash.replace("#", ""), path:a.pathname.replace(/^([^\/])/, "/$1"), relative:(a.href.match(/tps?:\/\/[^\/]+(.+)/) || [null, ""])[1], segments:a.pathname.replace(/^\//, "").split("/")};
      }
      function text2buffer(text, oncomplete, blocksize) {
        blocksize = blocksize || 1024;
        var i = 0;
        var arrayBuffer = new ArrayBuffer(text.length);
        var bufView = new Uint8Array(arrayBuffer);
        var worker = function() {
          var end = i + blocksize;
          for (;i < end;i++) {
            bufView[i] = text.charCodeAt(i) & 255;
          }
          if (i >= text.length) {
            oncomplete(arrayBuffer);
          } else {
            setTimeout(worker, 0);
          }
        };
        setTimeout(worker, 0);
      }
      bluefile.BlueFileReader = function(options) {
        this.options = options;
      };
      bluefile.BlueFileReader.prototype = {readheader:function readheader(theFile, onload) {
        var that = this;
        var reader = new FileReader;
        var blob = theFile.webkitSlice(0, 512);
        reader.onloadend = function(theFile) {
          return function(e) {
            if (e.target.error) {
              onload(null);
              return;
            }
            var rawhdr = reader.result;
            var hdr = new bluefile.BlueHeader(rawhdr, that.options);
            hdr.file = theFile;
            onload(hdr);
          };
        }(theFile);
        reader.readAsArrayBuffer(blob);
      }, read:function read(theFile, onload) {
        var that = this;
        var reader = new FileReader;
        reader.onloadend = function(theFile) {
          return function(e) {
            if (e.target.error) {
              onload(null);
              return;
            }
            var raw = reader.result;
            var hdr = new bluefile.BlueHeader(raw, that.options);
            hdr.file = theFile;
            hdr.file_name = theFile.name;
            onload(hdr);
          };
        }(theFile);
        reader.readAsArrayBuffer(theFile);
      }, read_http:function read_http(href, onload) {
        var that = this;
        var oReq = new XMLHttpRequest;
        oReq.open("GET", href, true);
        oReq.responseType = "arraybuffer";
        oReq.overrideMimeType("text/plain; charset=x-user-defined");
        oReq.onload = function(oEvent) {
          if (oReq.readyState === 4) {
            if (oReq.status === 200 || oReq.status === 0) {
              var arrayBuffer = null;
              if (oReq.response) {
                arrayBuffer = oReq.response;
                var hdr = new bluefile.BlueHeader(arrayBuffer, that.options);
                parseURL(href);
                var fileUrl = parseURL(href);
                hdr.file_name = fileUrl.file;
                onload(hdr);
              } else {
                if (oReq.responseText) {
                  text2buffer(oReq.responseText, function(arrayBuffer) {
                    var hdr = new bluefile.BlueHeader(arrayBuffer, that.options);
                    parseURL(href);
                    var fileUrl = parseURL(href);
                    hdr.file_name = fileUrl.file;
                    onload(hdr);
                  });
                }
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
      }};
      module.exports = bluefile;
    })();
  }, {"./common":2}], 2:[function(require, module, exports) {
    (function() {
      module.exports = {};
      if (window.ArrayBuffer) {
        if (!ArrayBuffer.prototype.slice) {
          ArrayBuffer.prototype.slice = function(start, end) {
            var that = new Uint8Array(this);
            if (end === undefined) {
              end = that.length;
            }
            var result = new ArrayBuffer(end - start);
            var resultArray = new Uint8Array(result);
            for (var i = 0;i < resultArray.length;i++) {
              resultArray[i] = that[i + start];
            }
            return result;
          };
        }
      }
      Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
      };
      window.requestAnimFrame = function(callback) {
        return window.requestAnimationFrame || (window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || function(callback) {
          return window.setTimeout(callback, 1E3 / 60);
        }))));
      }();
      window.cancelAnimFrame = function(callback) {
        return window.cancelAnimationFrame || (window.webkitCancelAnimationFrame || (window.mozCancelAnimationFrame || (window.oCancelAnimationFrame || (window.msCanelAnimationFrame || function(timeoutID) {
          window.clearTimeout(timeoutID);
        }))));
      }();
      module.exports.dashOn = function(ctx, on, off) {
        if (ctx.setLineDash) {
          ctx.setLineDash([on, off]);
          return true;
        } else {
          if (ctx.mozDash !== undefined) {
            ctx.mozDash = [on, off];
            return true;
          } else {
            if (ctx.webkitLineDash && ctx.webkitLineDash.length === 0) {
              ctx.webkitLineDash = [on, off];
              return true;
            }
          }
        }
        return false;
      };
      module.exports.dashOff = function(ctx) {
        if (ctx.setLineDash) {
          ctx.setLineDash([]);
        } else {
          if (ctx.mozDash) {
            ctx.mozDash = null;
          } else {
            if (ctx.webkitLineDash) {
              ctx.webkitLineDash = [];
            }
          }
        }
      };
      module.exports.getKeyCode = function(e) {
        e = window.event || e;
        e = e.charCode || e.keyCode;
        return e;
      };
      module.exports.setKeypressHandler = function(handler) {
        if (window.addEventListener) {
          window.addEventListener("keypress", handler, false);
        } else {
          if (window.attachEvent) {
            window.attachEvent("onkeypress", handler);
          }
        }
      };
      if (!Array.isArray) {
        Array.isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      if (!window.Float64Array) {
        window.Float64Array = function() {
          return window.Float64Array || function(buffer, byteOffset, length) {
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
            for (var i = 0;i < b.length;i++) {
              b[i] = dv.getFloat64(i * 8 + byteOffset, true);
            }
            b.subarray = function(begin, end) {
              return b.slice(begin, end);
            };
            return b;
          };
        }();
      }
      (function() {
        var f = function() {
        };
        if (!window.console) {
          window.console = {log:f, info:f, warn:f, debug:f, error:f};
        }
        if ((new Int8Array([0, 1, 0])).subarray(1).subarray(1)[0]) {
          var subarray = function(begin, end) {
            if (arguments.length === 0) {
              begin = 0;
              end = this.length;
            } else {
              if (begin < 0) {
                begin += this.length;
              }
              begin = Math.max(0, Math.min(this.length, begin));
              if (arguments.length === 1) {
                end = this.length;
              } else {
                if (end < 0) {
                  end += this.length;
                }
                end = Math.max(begin, Math.min(this.length, end));
              }
            }
            var byteOffset = this.byteOffset + begin * this.BYTES_PER_ELEMENT;
            return new this.constructor(this.buffer, byteOffset, end - begin);
          };
          var typedArrays = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
          typedArrays.forEach(function(cls) {
            cls.prototype.subarray = subarray;
          });
        }
      })();
      (function(window, document) {
        var prefix = "", _addEventListener, onwheel, support;
        if (window.addEventListener) {
          _addEventListener = "addEventListener";
        } else {
          _addEventListener = "attachEvent";
          prefix = "on";
        }
        support = "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
        window.addWheelListener = function(elem, callback, useCapture) {
          _addWheelListener(elem, support, callback, useCapture);
          if (support === "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
          }
        };
        function _addWheelListener(elem, eventName, callback, useCapture) {
          elem[_addEventListener](prefix + eventName, support === "wheel" ? callback : function(originalEvent) {
            !originalEvent && (originalEvent = window.event);
            var event = {originalEvent:originalEvent, target:originalEvent.target || originalEvent.srcElement, type:"wheel", deltaMode:originalEvent.type === "MozMousePixelScroll" ? 0 : 1, deltaX:0, delatZ:0, preventDefault:function() {
              originalEvent.preventDefault ? originalEvent.preventDefault() : originalEvent.returnValue = false;
            }};
            if (support === "mousewheel") {
              event.deltaY = -1 / 40 * originalEvent.wheelDelta;
              originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
              event.deltaY = originalEvent.detail;
            }
            return callback(event);
          }, useCapture || false);
        }
      })(window, document);
      module.exports.update = function update(dst, src) {
        for (var prop in src) {
          var val = src[prop];
          if (typeof val === "object") {
            update(dst[prop], val);
          } else {
            dst[prop] = val;
          }
        }
        return dst;
      };
    })();
  }, {}]}, {}, [1])(1);
});

