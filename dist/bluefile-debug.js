/*

 File: license.js
 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser 
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or 
 (at your option) any later version. This library is distributed in the hope that it will be useful, but 
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the 
 GNU Lesser General Public License along with SigPlot.

 Portions of SigPlot may utilize the following open-source software:

   loglevel.js          - MIT License; Copyright (c) 2014, Tim Perry
   typedarray.js        - MIT License; Copyright (c) 2010, Linden Research, Inc.
   tinycolor.js         - MIT License; Copyright (c) 2013, Brian Grinstead
   CanvasInput.js       - MIT License; Copyright (c) 2013, James Simpson of GoldFire Studios
   spin.js              - MIT License; Copyright (c) 2011-2013 Felix Gnass
   Array.remove         - MIT License; Copyright (c) 2007, John Resig
   Firefox subarray fix - Public Domain; Copyright (c) 2011, Ryan Berdeen

 File: typedarray.js
 $LicenseInfo:firstyear=2010&license=mit$

 Copyright (c) 2010, Linden Research, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 $/LicenseInfo$

 Copyright (c) 2013, Michael Ihde - Added big-endian/little-endian support

 File: common.js
 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or
 (at your option) any later version. This library is distributed in the hope that it will be useful, but
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the
 GNU Lesser General Public License along with SigPlot.


 File: bluefile.js
 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or
 (at your option) any later version. This library is distributed in the hope that it will be useful, but
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the
 GNU Lesser General Public License along with SigPlot.

*/
var ArrayBuffer, ArrayBufferView;
var Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array;
var Float32Array, Float64Array;
var DataView;
(function() {
  var ECMAScript = {ToInt32:function(v) {
    return v >> 0;
  }, ToUint32:function(v) {
    return v >>> 0;
  }};
  function raise_INDEX_SIZE_ERR() {
    if (document) {
      document.createTextNode("").splitText(1);
    }
    throw new RangeError("INDEX_SIZE_ERR");
  }
  function configureProperties(obj) {
    if (Object.getOwnPropertyNames && Object.defineProperty) {
      var props = Object.getOwnPropertyNames(obj), i;
      for (i = 0;i < props.length;i += 1) {
        Object.defineProperty(obj, props[i], {value:obj[props[i]], writable:false, enumerable:false, configurable:false});
      }
    }
  }
  if (Object.prototype.__defineGetter__ && !Object.defineProperty) {
    Object.defineProperty = function(obj, prop, desc) {
      if (desc.hasOwnProperty("get")) {
        obj.__defineGetter__(prop, desc.get);
      }
      if (desc.hasOwnProperty("set")) {
        obj.__defineSetter__(prop, desc.set);
      }
    };
  }
  function makeArrayAccessors(obj) {
    if (!Object.defineProperty) {
      return;
    }
    function makeArrayAccessor(index) {
      Object.defineProperty(obj, index, {"get":function() {
        return obj._getter(index);
      }, "set":function(v) {
        obj._setter(index, v);
      }, enumerable:true, configurable:false});
    }
    var i;
    for (i = 0;i < obj.length;i += 1) {
      makeArrayAccessor(i);
    }
  }
  function be_as_signed(value, bits) {
    var s = 32 - bits;
    return value << s >> s;
  }
  function be_as_unsigned(value, bits) {
    var s = 32 - bits;
    return value << s >>> s;
  }
  function be_packInt8(n) {
    return[n & 255];
  }
  function be_unpackInt8(bytes) {
    return as_signed(bytes[0], 8);
  }
  function be_packUint8(n) {
    return[n & 255];
  }
  function be_unpackUint8(bytes) {
    return as_unsigned(bytes[0], 8);
  }
  function be_packInt16(n) {
    return[n >> 8 & 255, n & 255];
  }
  function be_unpackInt16(bytes) {
    return as_signed(bytes[0] << 8 | bytes[1], 16);
  }
  function be_packUint16(n) {
    return[n >> 8 & 255, n & 255];
  }
  function be_unpackUint16(bytes) {
    return as_unsigned(bytes[0] << 8 | bytes[1], 16);
  }
  function be_packInt32(n) {
    return[n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function be_unpackInt32(bytes) {
    return as_signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32);
  }
  function be_packUint32(n) {
    return[n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function be_unpackUint32(bytes) {
    return as_unsigned(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32);
  }
  function be_packBits(bits) {
    var bytes = [];
    var str = bits.join("");
    while (str.length) {
      bytes.push(parseInt(str.substring(0, 8), 2));
      str = str.substring(8);
    }
    return bytes;
  }
  function be_unpackBits(bytes) {
    var bits = [], i, j;
    for (i = bytes.length;i;i -= 1) {
      b = bytes[i - 1];
      for (j = 8;j;j -= 1) {
        bits.push(b % 2 ? 1 : 0);
        b = b >> 1;
      }
    }
    bits.reverse();
    return bits;
  }
  function le_as_signed(value, bits) {
    var s = 32 - bits;
    return value << s >> s;
  }
  function le_as_unsigned(value, bits) {
    var s = 32 - bits;
    return value << s >>> s;
  }
  function le_packInt8(n) {
    return[n & 255];
  }
  function le_unpackInt8(bytes) {
    return as_signed(bytes[0], 8);
  }
  function le_packUint8(n) {
    return[n & 255];
  }
  function le_unpackUint8(bytes) {
    return as_unsigned(bytes[0], 8);
  }
  function le_packInt16(n) {
    return[n & 255, n >> 8 & 255];
  }
  function le_unpackInt16(bytes) {
    return as_signed(bytes[1] << 8 | bytes[0], 16);
  }
  function le_packUint16(n) {
    return[n & 255, n >> 8 & 255];
  }
  function le_unpackUint16(bytes) {
    return as_unsigned(bytes[1] << 8 | bytes[0], 16);
  }
  function le_packInt32(n) {
    return[n & 255, n >> 8 & 255, n >> 16 & 255, n >> 24 & 255];
  }
  function le_unpackInt32(bytes) {
    return as_signed(bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0], 32);
  }
  function le_packUint32(n) {
    return[n & 255, n >> 8 & 255, n >> 16 & 255, n >> 24 & 255];
  }
  function le_unpackUint32(bytes) {
    return as_unsigned(bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0], 32);
  }
  function le_packBits(bits) {
    var bytes = [];
    var str = bits.join("");
    while (str.length) {
      bytes.push(parseInt(str.substring(str.length - 8, str.length), 2));
      str = str.substring(0, str.length - 8);
    }
    return bytes;
  }
  function le_unpackBits(bytes) {
    var bits = [], i, j;
    for (i = 0;i < bytes.length;i++) {
      b = bytes[i];
      for (j = 8;j;j -= 1) {
        bits.push(b % 2 ? 1 : 0);
        b = b >> 1;
      }
    }
    bits.reverse();
    return bits;
  }
  var packInt8 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_packInt8 : be_packInt8;
  var unpackInt8 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_unpackInt8 : be_unpackInt8;
  var packUint8 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_packUint8 : be_packUint8;
  var unpackUint8 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_unpackUint8 : be_unpackUint8;
  var packInt16 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_packInt16 : be_packInt16;
  var unpackInt16 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_unpackInt16 : be_unpackInt16;
  var packUint16 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_packUint16 : be_packUint16;
  var unpackUint16 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_unpackUint16 : be_unpackUint16;
  var packInt32 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_packInt32 : be_packInt32;
  var unpackInt32 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_unpackInt32 : be_unpackInt32;
  var packUint32 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_packUint32 : be_packUint32;
  var unpackUint32 = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_unpackUint32 : be_unpackUint32;
  var packBits = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_packBits : be_packBits;
  var unpackBits = !window.BIG_ENDIAN_ARRAYBUFFERS ? le_unpackBits : be_unpackBits;
  function as_signed(value, bits) {
    var s = 32 - bits;
    return value << s >> s;
  }
  function as_unsigned(value, bits) {
    var s = 32 - bits;
    return value << s >>> s;
  }
  function packIEEE754(v, ebits, fbits) {
    var bias = (1 << ebits - 1) - 1, s, e, f, ln, i, bits, bytes;
    if (isNaN(v)) {
      e = (1 << bias) - 1;
      f = Math.pow(2, fbits - 1);
      s = 0;
    } else {
      if (v === Infinity || v === -Infinity) {
        e = (1 << bias) - 1;
        f = 0;
        s = v < 0 ? 1 : 0;
      } else {
        if (v === 0) {
          e = 0;
          f = 0;
          s = 1 / v === -Infinity ? 1 : 0;
        } else {
          s = v < 0;
          v = Math.abs(v);
          if (v >= Math.pow(2, 1 - bias)) {
            ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
            e = ln + bias;
            f = Math.round(v * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
          } else {
            e = 0;
            f = Math.round(v / Math.pow(2, 1 - bias - fbits));
          }
        }
      }
    }
    bits = [];
    for (i = fbits;i;i -= 1) {
      bits.push(f % 2 ? 1 : 0);
      f = Math.floor(f / 2);
    }
    for (i = ebits;i;i -= 1) {
      bits.push(e % 2 ? 1 : 0);
      e = Math.floor(e / 2);
    }
    bits.push(s ? 1 : 0);
    bits.reverse();
    var bytes = packBits(bits);
    return bytes;
  }
  function unpackIEEE754(bytes, ebits, fbits) {
    var bits = [], i, j, b, str, bias, s, e, f;
    bits = unpackBits(bytes);
    str = bits.join("");
    bias = (1 << ebits - 1) - 1;
    s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
    e = parseInt(str.substring(1, 1 + ebits), 2);
    f = parseInt(str.substring(1 + ebits), 2);
    if (e === (1 << ebits) - 1) {
      return f !== 0 ? NaN : s * Infinity;
    } else {
      if (e > 0) {
        return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
      } else {
        if (f !== 0) {
          return s * Math.pow(2, -(bias - 1)) * (f / Math.pow(2, fbits));
        } else {
          return s < 0 ? -0 : 0;
        }
      }
    }
  }
  function unpackFloat64(b) {
    return unpackIEEE754(b, 11, 52);
  }
  function packFloat64(v) {
    return packIEEE754(v, 11, 52);
  }
  function unpackFloat32(b) {
    return unpackIEEE754(b, 8, 23);
  }
  function packFloat32(v) {
    return packIEEE754(v, 8, 23);
  }
  if (!ArrayBuffer) {
    (function() {
      ArrayBuffer = function(length) {
        length = ECMAScript.ToInt32(length);
        if (length < 0) {
          throw new RangeError("ArrayBuffer size is not a small enough positive integer.");
        }
        this.byteLength = length;
        this._bytes = [];
        this._bytes.length = length;
        var i;
        for (i = 0;i < this.byteLength;i += 1) {
          this._bytes[i] = 0;
        }
        configureProperties(this);
      };
      ArrayBuffer.isNative = false;
      ArrayBufferView = function() {
      };
      function makeTypedArrayConstructor(bytesPerElement, pack, unpack) {
        var ctor;
        ctor = function(buffer, byteOffset, length) {
          var array, sequence, i, s;
          if (!arguments.length || typeof arguments[0] === "number") {
            this.length = ECMAScript.ToInt32(arguments[0]);
            if (length < 0) {
              throw new RangeError("ArrayBufferView size is not a small enough positive integer.");
            }
            this.byteLength = this.length * this.BYTES_PER_ELEMENT;
            this.buffer = new ArrayBuffer(this.byteLength);
            this.byteOffset = 0;
          } else {
            if (typeof arguments[0] === "object" && arguments[0].constructor === ctor) {
              array = arguments[0];
              this.length = array.length;
              this.byteLength = this.length * this.BYTES_PER_ELEMENT;
              this.buffer = new ArrayBuffer(this.byteLength);
              this.byteOffset = 0;
              for (i = 0;i < this.length;i += 1) {
                this._setter(i, array._getter(i));
              }
            } else {
              if (typeof arguments[0] === "object" && !(arguments[0] instanceof ArrayBuffer)) {
                sequence = arguments[0];
                this.length = ECMAScript.ToUint32(sequence.length);
                this.byteLength = this.length * this.BYTES_PER_ELEMENT;
                this.buffer = new ArrayBuffer(this.byteLength);
                this.byteOffset = 0;
                for (i = 0;i < this.length;i += 1) {
                  s = sequence[i];
                  this._setter(i, Number(s));
                }
              } else {
                if (typeof arguments[0] === "object" && arguments[0] instanceof ArrayBuffer) {
                  this.buffer = buffer;
                  this.byteOffset = ECMAScript.ToUint32(byteOffset);
                  if (this.byteOffset > this.buffer.byteLength) {
                    raise_INDEX_SIZE_ERR();
                  }
                  if (this.byteOffset % this.BYTES_PER_ELEMENT) {
                    throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
                  }
                  if (arguments.length < 3) {
                    this.byteLength = this.buffer.byteLength - this.byteOffset;
                    if (this.byteLength % this.BYTES_PER_ELEMENT) {
                      raise_INDEX_SIZE_ERR();
                    }
                    this.length = this.byteLength / this.BYTES_PER_ELEMENT;
                  } else {
                    this.length = ECMAScript.ToUint32(length);
                    this.byteLength = this.length * this.BYTES_PER_ELEMENT;
                  }
                  if (this.byteOffset + this.byteLength > this.buffer.byteLength) {
                    raise_INDEX_SIZE_ERR();
                  }
                } else {
                  throw new TypeError("Unexpected argument type(s)");
                }
              }
            }
          }
          this.constructor = ctor;
          configureProperties(this);
          makeArrayAccessors(this);
        };
        ctor.prototype = new ArrayBufferView;
        ctor.prototype.BYTES_PER_ELEMENT = bytesPerElement;
        ctor.prototype.emulated = true;
        ctor.prototype._pack = pack;
        ctor.prototype._unpack = unpack;
        ctor.BYTES_PER_ELEMENT = bytesPerElement;
        ctor.prototype._getter = function(index) {
          if (arguments.length < 1) {
            throw new SyntaxError("Not enough arguments");
          }
          index = ECMAScript.ToUint32(index);
          if (index >= this.length) {
            return;
          }
          var bytes = [], i, o;
          for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;i < this.BYTES_PER_ELEMENT;i += 1, o += 1) {
            bytes.push(this.buffer._bytes[o]);
          }
          return this._unpack(bytes);
        };
        ctor.prototype.get = ctor.prototype._getter;
        ctor.prototype._setter = function(index, value) {
          if (arguments.length < 2) {
            throw new SyntaxError("Not enough arguments");
          }
          index = ECMAScript.ToUint32(index);
          if (index >= this.length) {
            return;
          }
          var bytes = this._pack(value), i, o;
          for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;i < this.BYTES_PER_ELEMENT;i += 1, o += 1) {
            this.buffer._bytes[o] = bytes[i];
          }
        };
        ctor.prototype.set = function(index, value) {
          if (arguments.length < 1) {
            throw new SyntaxError("Not enough arguments");
          }
          var array, sequence, offset, len, i, s, d, byteOffset, byteLength, tmp;
          if (typeof arguments[0] === "object" && arguments[0].constructor === this.constructor) {
            array = arguments[0];
            offset = ECMAScript.ToUint32(arguments[1]);
            if (offset + array.length > this.length) {
              raise_INDEX_SIZE_ERR();
            }
            byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
            byteLength = array.length * this.BYTES_PER_ELEMENT;
            if (array.buffer === this.buffer) {
              tmp = [];
              for (i = 0, s = array.byteOffset;i < byteLength;i += 1, s += 1) {
                tmp[i] = array.buffer._bytes[s];
              }
              for (i = 0, d = byteOffset;i < byteLength;i += 1, d += 1) {
                this.buffer._bytes[d] = tmp[i];
              }
            } else {
              for (i = 0, s = array.byteOffset, d = byteOffset;i < byteLength;i += 1, s += 1, d += 1) {
                this.buffer._bytes[d] = array.buffer._bytes[s];
              }
            }
          } else {
            if (typeof arguments[0] === "object" && typeof arguments[0].length !== "undefined") {
              sequence = arguments[0];
              len = ECMAScript.ToUint32(sequence.length);
              offset = ECMAScript.ToUint32(arguments[1]);
              if (offset + len > this.length) {
                raise_INDEX_SIZE_ERR();
              }
              for (i = 0;i < len;i += 1) {
                s = sequence[i];
                this._setter(offset + i, Number(s));
              }
            } else {
              throw new TypeError("Unexpected argument type(s)");
            }
          }
        };
        ctor.prototype.subarray = function(start, end) {
          function clamp(v, min, max) {
            return v < min ? min : v > max ? max : v;
          }
          start = ECMAScript.ToInt32(start);
          end = ECMAScript.ToInt32(end);
          if (arguments.length < 1) {
            start = 0;
          }
          if (arguments.length < 2) {
            end = this.length;
          }
          if (start < 0) {
            start = this.length + start;
          }
          if (end < 0) {
            end = this.length + end;
          }
          start = clamp(start, 0, this.length);
          end = clamp(end, 0, this.length);
          var len = end - start;
          if (len < 0) {
            len = 0;
          }
          return new this.constructor(this.buffer, start * this.BYTES_PER_ELEMENT, len);
        };
        return ctor;
      }
      Int8Array = Int8Array || makeTypedArrayConstructor(1, packInt8, unpackInt8);
      Uint8Array = Uint8Array || makeTypedArrayConstructor(1, packUint8, unpackUint8);
      Int16Array = Int16Array || makeTypedArrayConstructor(2, packInt16, unpackInt16);
      Uint16Array = Uint16Array || makeTypedArrayConstructor(2, packUint16, unpackUint16);
      Int32Array = Int32Array || makeTypedArrayConstructor(4, packInt32, unpackInt32);
      Uint32Array = Uint32Array || makeTypedArrayConstructor(4, packUint32, unpackUint32);
      Float32Array = Float32Array || makeTypedArrayConstructor(4, packFloat32, unpackFloat32);
      Float64Array = Float64Array || makeTypedArrayConstructor(8, packFloat64, unpackFloat64);
    })();
  }
  if (!DataView) {
    (function() {
      function r(array, index) {
        if (typeof array.get === "function") {
          return array.get(index);
        } else {
          return array[index];
        }
      }
      var IS_BIG_ENDIAN = function() {
        var u16array = new Uint16Array([4660]), u8array = new Uint8Array(u16array.buffer);
        return r(u8array, 0) === 18;
      }();
      DataView = function(buffer, byteOffset, byteLength) {
        if (!(typeof buffer === "object" && buffer instanceof ArrayBuffer)) {
          throw new TypeError("TypeError");
        }
        this.buffer = buffer;
        this.byteOffset = ECMAScript.ToUint32(byteOffset);
        if (this.byteOffset > this.buffer.byteLength) {
          raise_INDEX_SIZE_ERR();
        }
        if (arguments.length < 3) {
          this.byteLength = this.buffer.byteLength - this.byteOffset;
        } else {
          this.byteLength = ECMAScript.ToUint32(byteLength);
        }
        if (this.byteOffset + this.byteLength > this.buffer.byteLength) {
          raise_INDEX_SIZE_ERR();
        }
        configureProperties(this);
      };
      if (ArrayBufferView) {
        DataView.prototype = new ArrayBufferView;
      }
      function makeDataView_getter(arrayType) {
        return function(byteOffset, littleEndian) {
          byteOffset = ECMAScript.ToUint32(byteOffset);
          if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
            raise_INDEX_SIZE_ERR();
          }
          byteOffset += this.byteOffset;
          var uint8Array = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT), bytes = [], i;
          for (i = 0;i < arrayType.BYTES_PER_ELEMENT;i += 1) {
            bytes.push(r(uint8Array, i));
          }
          if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
            bytes.reverse();
          }
          return r(new arrayType((new Uint8Array(bytes)).buffer), 0);
        };
      }
      DataView.prototype.getUint8 = makeDataView_getter(Uint8Array);
      DataView.prototype.getInt8 = makeDataView_getter(Int8Array);
      DataView.prototype.getUint16 = makeDataView_getter(Uint16Array);
      DataView.prototype.getInt16 = makeDataView_getter(Int16Array);
      DataView.prototype.getUint32 = makeDataView_getter(Uint32Array);
      DataView.prototype.getInt32 = makeDataView_getter(Int32Array);
      DataView.prototype.getFloat32 = makeDataView_getter(Float32Array);
      DataView.prototype.getFloat64 = makeDataView_getter(Float64Array);
      function makeDataView_setter(arrayType) {
        return function(byteOffset, value, littleEndian) {
          byteOffset = ECMAScript.ToUint32(byteOffset);
          if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
            raise_INDEX_SIZE_ERR();
          }
          var typeArray = new arrayType([value]), byteArray = new Uint8Array(typeArray.buffer), bytes = [], i, byteView;
          for (i = 0;i < arrayType.BYTES_PER_ELEMENT;i += 1) {
            bytes.push(r(byteArray, i));
          }
          if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
            bytes.reverse();
          }
          byteView = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
          byteView.set(bytes);
        };
      }
      DataView.prototype.setUint8 = makeDataView_setter(Uint8Array);
      DataView.prototype.setInt8 = makeDataView_setter(Int8Array);
      DataView.prototype.setUint16 = makeDataView_setter(Uint16Array);
      DataView.prototype.setInt16 = makeDataView_setter(Int16Array);
      DataView.prototype.setUint32 = makeDataView_setter(Uint32Array);
      DataView.prototype.setInt32 = makeDataView_setter(Int32Array);
      DataView.prototype.setFloat32 = makeDataView_setter(Float32Array);
      DataView.prototype.setFloat64 = makeDataView_setter(Float64Array);
    })();
  }
})();
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
function dashOn(ctx, on, off) {
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
}
function dashOff(ctx) {
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
}
function getKeyCode(e) {
  e = window.event || e;
  e = e.charCode || e.keyCode;
  return e;
}
function setKeypressHandler(handler) {
  if (window.addEventListener) {
    window.addEventListener("keypress", handler, false);
  } else {
    if (window.attachEvent) {
      window.attachEvent("onkeypress", handler);
    }
  }
}
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
(function(global) {
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
  var _applySupportsTypedArray = true;
  try {
    var uintbuf = new UInt8Array(new ArrayBuffer(4));
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
  function BlueHeader(buf) {
    this.file = null;
    this.file_name = null;
    this.offset = 0;
    this.buf = buf;
    if (this.buf != null) {
      var dvhdr = new DataView(this.buf);
      this.version = ab2str(this.buf.slice(0, 4));
      this.headrep = ab2str(this.buf.slice(4, 8));
      this.datarep = ab2str(this.buf.slice(8, 12));
      var littleEndianHdr = this.headrep === "EEEI";
      var littleEndianData = this.datarep === "EEEI";
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
      this.setData(this.buf, ds, de, littleEndianData);
    }
  }
  BlueHeader.prototype = {setData:function(buf, offset, data_end, littleEndian) {
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
  function BlueFileReader(options) {
    this.options = options;
  }
  BlueFileReader.prototype = {readheader:function readheader(theFile, onload) {
    var reader = new FileReader;
    var blob = theFile.webkitSlice(0, 512);
    reader.onloadend = function(theFile) {
      return function(e) {
        if (e.target.error) {
          onload(null);
          return;
        }
        var rawhdr = reader.result;
        var hdr = new BlueHeader(rawhdr);
        hdr.file = theFile;
        onload(hdr);
      };
    }(theFile);
    reader.readAsArrayBuffer(blob);
  }, read:function read(theFile, onload) {
    var reader = new FileReader;
    reader.onloadend = function(theFile) {
      return function(e) {
        if (e.target.error) {
          onload(null);
          return;
        }
        var raw = reader.result;
        var hdr = new BlueHeader(raw);
        hdr.file = theFile;
        hdr.file_name = theFile.name;
        onload(hdr);
      };
    }(theFile);
    reader.readAsArrayBuffer(theFile);
  }, read_http:function read_http(href, onload) {
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
            var hdr = new BlueHeader(arrayBuffer);
            parseURL(href);
            var fileUrl = parseURL(href);
            hdr.file_name = fileUrl.file;
            onload(hdr);
          } else {
            if (oReq.responseText) {
              text2buffer(oReq.responseText, function(arrayBuffer) {
                var hdr = new BlueHeader(arrayBuffer);
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
  global["BlueHeader"] = global["BlueHeader"] || BlueHeader;
  global["BlueFileReader"] = global["BlueFileReader"] || BlueFileReader;
})(this);

