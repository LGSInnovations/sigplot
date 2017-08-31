/*

 File: license.js

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
var ArrayBuffer,ArrayBufferView,Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,DataView;
(function(){function c(){document&&document.createTextNode("").splitText(1);throw new RangeError("INDEX_SIZE_ERR");}function g(a){if(Object.getOwnPropertyNames&&Object.defineProperty){var d=Object.getOwnPropertyNames(a),c;for(c=0;c<d.length;c+=1)Object.defineProperty(a,d[c],{value:a[d[c]],writable:!1,enumerable:!1,configurable:!1})}}function h(a){function c(d){Object.defineProperty(a,d,{get:function(){return a._getter(d)},set:function(c){a._setter(d,c)},enumerable:!0,configurable:!1})}if(Object.defineProperty){var d;
for(d=0;d<a.length;d+=1)c(d)}}function l(a){return[a&255]}function m(a){return B(a[0],8)}function p(a){return[a&255]}function E(a){return C(a[0],8)}function v(a){return[a>>8&255,a&255]}function t(a){return B(a[0]<<8|a[1],16)}function x(a){return[a>>8&255,a&255]}function G(a){return C(a[0]<<8|a[1],16)}function D(a){return[a>>24&255,a>>16&255,a>>8&255,a&255]}function A(a){return B(a[0]<<24|a[1]<<16|a[2]<<8|a[3],32)}function r(a){return[a>>24&255,a>>16&255,a>>8&255,a&255]}function H(a){return C(a[0]<<
24|a[1]<<16|a[2]<<8|a[3],32)}function e(a){var d=[];for(a=a.join("");a.length;)d.push(parseInt(a.substring(0,8),2)),a=a.substring(8);return d}function n(a){var d=[],c,e;for(c=a.length;c;c-=1)for(b=a[c-1],e=8;e;e-=1)d.push(b%2?1:0),b>>=1;d.reverse();return d}function f(a){return[a&255]}function d(a){return B(a[0],8)}function K(a){return[a&255]}function k(a){return C(a[0],8)}function F(a){return[a&255,a>>8&255]}function L(a){return B(a[1]<<8|a[0],16)}function M(a){return[a&255,a>>8&255]}function y(a){return C(a[1]<<
8|a[0],16)}function z(a){return[a&255,a>>8&255,a>>16&255,a>>24&255]}function N(a){return B(a[3]<<24|a[2]<<16|a[1]<<8|a[0],32)}function O(a){return[a&255,a>>8&255,a>>16&255,a>>24&255]}function w(a){return C(a[3]<<24|a[2]<<16|a[1]<<8|a[0],32)}function P(a){var d=[];for(a=a.join("");a.length;)d.push(parseInt(a.substring(a.length-8,a.length),2)),a=a.substring(0,a.length-8);return d}function Q(a){var d=[],c,e;for(c=0;c<a.length;c++)for(b=a[c],e=8;e;e-=1)d.push(b%2?1:0),b>>=1;d.reverse();return d}function B(a,
d){var c=32-d;return a<<c>>c}function C(a,d){var c=32-d;return a<<c>>>c}function I(a,d,c){var e=(1<<d-1)-1,f,s,n;isNaN(a)?(s=(1<<e)-1,e=Math.pow(2,c-1),f=0):Infinity===a||-Infinity===a?(s=(1<<e)-1,e=0,f=0>a?1:0):0===a?(e=s=0,f=-Infinity===1/a?1:0):(f=0>a,a=Math.abs(a),a>=Math.pow(2,1-e)?(n=Math.min(Math.floor(Math.log(a)/Math.LN2),e),s=n+e,e=Math.round(a*Math.pow(2,c-n)-Math.pow(2,c))):(s=0,e=Math.round(a/Math.pow(2,1-e-c))));for(a=[];c;c-=1)a.push(e%2?1:0),e=Math.floor(e/2);for(c=d;c;c-=1)a.push(s%
2?1:0),s=Math.floor(s/2);a.push(f?1:0);a.reverse();return R(a)}function J(a,c,d){var e=[],f,s,e=S(a);f=e.join("");a=(1<<c-1)-1;e=parseInt(f.substring(0,1),2)?-1:1;s=parseInt(f.substring(1,1+c),2);f=parseInt(f.substring(1+c),2);return s===(1<<c)-1?0!==f?NaN:Infinity*e:0<s?e*Math.pow(2,s-a)*(1+f/Math.pow(2,d)):0!==f?e*Math.pow(2,-(a-1))*(f/Math.pow(2,d)):0>e?-0:0}function T(a){return J(a,11,52)}function U(a){return I(a,11,52)}function V(a){return J(a,8,23)}function W(a){return I(a,8,23)}var q={ToInt32:function(a){return a>>
0},ToUint32:function(a){return a>>>0}};Object.prototype.__defineGetter__&&!Object.defineProperty&&(Object.defineProperty=function(a,c,d){d.hasOwnProperty("get")&&a.__defineGetter__(c,d.get);d.hasOwnProperty("set")&&a.__defineSetter__(c,d.set)});var X=window.BIG_ENDIAN_ARRAYBUFFERS?l:f,Y=window.BIG_ENDIAN_ARRAYBUFFERS?m:d,Z=window.BIG_ENDIAN_ARRAYBUFFERS?p:K,$=window.BIG_ENDIAN_ARRAYBUFFERS?E:k,aa=window.BIG_ENDIAN_ARRAYBUFFERS?v:F,ba=window.BIG_ENDIAN_ARRAYBUFFERS?t:L,ca=window.BIG_ENDIAN_ARRAYBUFFERS?
x:M,da=window.BIG_ENDIAN_ARRAYBUFFERS?G:y,ea=window.BIG_ENDIAN_ARRAYBUFFERS?D:z,fa=window.BIG_ENDIAN_ARRAYBUFFERS?A:N,ga=window.BIG_ENDIAN_ARRAYBUFFERS?r:O,ha=window.BIG_ENDIAN_ARRAYBUFFERS?H:w,R=window.BIG_ENDIAN_ARRAYBUFFERS?e:P,S=window.BIG_ENDIAN_ARRAYBUFFERS?n:Q;ArrayBuffer||function(){function a(a,d,e){var f;f=function(a,d,e){var n,u,k;if(arguments.length&&"number"!==typeof arguments[0])if("object"===typeof arguments[0]&&arguments[0].constructor===f)for(n=arguments[0],this.length=n.length,this.byteLength=
this.length*this.BYTES_PER_ELEMENT,this.buffer=new ArrayBuffer(this.byteLength),u=this.byteOffset=0;u<this.length;u+=1)this._setter(u,n._getter(u));else if("object"!==typeof arguments[0]||arguments[0]instanceof ArrayBuffer)if("object"===typeof arguments[0]&&arguments[0]instanceof ArrayBuffer){this.buffer=a;this.byteOffset=q.ToUint32(d);this.byteOffset>this.buffer.byteLength&&c();if(this.byteOffset%this.BYTES_PER_ELEMENT)throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
3>arguments.length?(this.byteLength=this.buffer.byteLength-this.byteOffset,this.byteLength%this.BYTES_PER_ELEMENT&&c(),this.length=this.byteLength/this.BYTES_PER_ELEMENT):(this.length=q.ToUint32(e),this.byteLength=this.length*this.BYTES_PER_ELEMENT);this.byteOffset+this.byteLength>this.buffer.byteLength&&c()}else throw new TypeError("Unexpected argument type(s)");else for(n=arguments[0],this.length=q.ToUint32(n.length),this.byteLength=this.length*this.BYTES_PER_ELEMENT,this.buffer=new ArrayBuffer(this.byteLength),
u=this.byteOffset=0;u<this.length;u+=1)k=n[u],this._setter(u,Number(k));else{this.length=q.ToInt32(arguments[0]);if(0>e)throw new RangeError("ArrayBufferView size is not a small enough positive integer.");this.byteLength=this.length*this.BYTES_PER_ELEMENT;this.buffer=new ArrayBuffer(this.byteLength);this.byteOffset=0}this.constructor=f;g(this);h(this)};f.prototype=new ArrayBufferView;f.prototype.BYTES_PER_ELEMENT=a;f.prototype.emulated=!0;f.prototype._pack=d;f.prototype._unpack=e;f.BYTES_PER_ELEMENT=
a;f.prototype._getter=function(a){if(1>arguments.length)throw new SyntaxError("Not enough arguments");a=q.ToUint32(a);if(!(a>=this.length)){var c=[],d,e;d=0;for(e=this.byteOffset+a*this.BYTES_PER_ELEMENT;d<this.BYTES_PER_ELEMENT;d+=1,e+=1)c.push(this.buffer._bytes[e]);return this._unpack(c)}};f.prototype.get=f.prototype._getter;f.prototype._setter=function(a,d){if(2>arguments.length)throw new SyntaxError("Not enough arguments");a=q.ToUint32(a);if(!(a>=this.length)){var c=this._pack(d),e,f;e=0;for(f=
this.byteOffset+a*this.BYTES_PER_ELEMENT;e<this.BYTES_PER_ELEMENT;e+=1,f+=1)this.buffer._bytes[f]=c[e]}};f.prototype.set=function(a,d){if(1>arguments.length)throw new SyntaxError("Not enough arguments");var e,f,n,h,k,g;if("object"===typeof arguments[0]&&arguments[0].constructor===this.constructor)if(e=arguments[0],f=q.ToUint32(arguments[1]),f+e.length>this.length&&c(),g=this.byteOffset+f*this.BYTES_PER_ELEMENT,f=e.length*this.BYTES_PER_ELEMENT,e.buffer===this.buffer){n=[];h=0;for(k=e.byteOffset;h<
f;h+=1,k+=1)n[h]=e.buffer._bytes[k];for(h=0;h<f;h+=1,g+=1)this.buffer._bytes[g]=n[h]}else for(h=0,k=e.byteOffset;h<f;h+=1,k+=1,g+=1)this.buffer._bytes[g]=e.buffer._bytes[k];else if("object"===typeof arguments[0]&&"undefined"!==typeof arguments[0].length)for(e=arguments[0],n=q.ToUint32(e.length),f=q.ToUint32(arguments[1]),f+n>this.length&&c(),h=0;h<n;h+=1)k=e[h],this._setter(f+h,Number(k));else throw new TypeError("Unexpected argument type(s)");};f.prototype.subarray=function(a,e){a=q.ToInt32(a);e=
q.ToInt32(e);1>arguments.length&&(a=0);2>arguments.length&&(e=this.length);0>a&&(a=this.length+a);0>e&&(e=this.length+e);var d=this.length;a=0>a?0:a>d?d:a;d=this.length;d=(0>e?0:e>d?d:e)-a;0>d&&(d=0);return new this.constructor(this.buffer,a*this.BYTES_PER_ELEMENT,d)};return f}ArrayBuffer=function(a){a=q.ToInt32(a);if(0>a)throw new RangeError("ArrayBuffer size is not a small enough positive integer.");this.byteLength=a;this._bytes=[];this._bytes.length=a;for(a=0;a<this.byteLength;a+=1)this._bytes[a]=
0;g(this)};ArrayBuffer.isNative=!1;ArrayBufferView=function(){};Int8Array=Int8Array||a(1,X,Y);Uint8Array=Uint8Array||a(1,Z,$);Int16Array=Int16Array||a(2,aa,ba);Uint16Array=Uint16Array||a(2,ca,da);Int32Array=Int32Array||a(4,ea,fa);Uint32Array=Uint32Array||a(4,ga,ha);Float32Array=Float32Array||a(4,W,V);Float64Array=Float64Array||a(8,U,T)}();DataView||function(){function a(a,e){return"function"===typeof a.get?a.get(e):a[e]}function e(d){return function(e,n){e=q.ToUint32(e);e+d.BYTES_PER_ELEMENT>this.byteLength&&
c();e+=this.byteOffset;var h=new Uint8Array(this.buffer,e,d.BYTES_PER_ELEMENT),k=[],g;for(g=0;g<d.BYTES_PER_ELEMENT;g+=1)k.push(a(h,g));Boolean(n)===Boolean(f)&&k.reverse();return a(new d((new Uint8Array(k)).buffer),0)}}function d(e){return function(d,n,h){d=q.ToUint32(d);d+e.BYTES_PER_ELEMENT>this.byteLength&&c();n=new e([n]);n=new Uint8Array(n.buffer);var k=[],g;for(g=0;g<e.BYTES_PER_ELEMENT;g+=1)k.push(a(n,g));Boolean(h)===Boolean(f)&&k.reverse();(new Uint8Array(this.buffer,d,e.BYTES_PER_ELEMENT)).set(k)}}
var f=function(){var e=new Uint16Array([4660]),e=new Uint8Array(e.buffer);return 18===a(e,0)}();DataView=function(a,e,d){if(!("object"===typeof a&&a instanceof ArrayBuffer))throw new TypeError("TypeError");this.buffer=a;this.byteOffset=q.ToUint32(e);this.byteOffset>this.buffer.byteLength&&c();this.byteLength=3>arguments.length?this.buffer.byteLength-this.byteOffset:q.ToUint32(d);this.byteOffset+this.byteLength>this.buffer.byteLength&&c();g(this)};ArrayBufferView&&(DataView.prototype=new ArrayBufferView);
DataView.prototype.getUint8=e(Uint8Array);DataView.prototype.getInt8=e(Int8Array);DataView.prototype.getUint16=e(Uint16Array);DataView.prototype.getInt16=e(Int16Array);DataView.prototype.getUint32=e(Uint32Array);DataView.prototype.getInt32=e(Int32Array);DataView.prototype.getFloat32=e(Float32Array);DataView.prototype.getFloat64=e(Float64Array);DataView.prototype.setUint8=d(Uint8Array);DataView.prototype.setInt8=d(Int8Array);DataView.prototype.setUint16=d(Uint16Array);DataView.prototype.setInt16=d(Int16Array);
DataView.prototype.setUint32=d(Uint32Array);DataView.prototype.setInt32=d(Int32Array);DataView.prototype.setFloat32=d(Float32Array);DataView.prototype.setFloat64=d(Float64Array)}()})();window.ArrayBuffer&&!ArrayBuffer.prototype.slice&&(ArrayBuffer.prototype.slice=function(c,g){var h=new Uint8Array(this);void 0===g&&(g=h.length);for(var l=new ArrayBuffer(g-c),m=new Uint8Array(l),p=0;p<m.length;p++)m[p]=h[p+c];return l});
Array.prototype.remove=function(c,g){var h=this.slice((g||c)+1||this.length);this.length=0>c?this.length+c:c;return this.push.apply(this,h)};window.requestAnimFrame=function(c){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(c){return window.setTimeout(c,1E3/60)}}();
window.cancelAnimFrame=function(c){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCanelAnimationFrame||function(c){window.clearTimeout(c)}}();function dashOn(c,g,h){return c.setLineDash?(c.setLineDash([g,h]),!0):void 0!==c.mozDash?(c.mozDash=[g,h],!0):c.webkitLineDash&&0===c.webkitLineDash.length?(c.webkitLineDash=[g,h],!0):!1}
function dashOff(c){c.setLineDash?c.setLineDash([]):c.mozDash?c.mozDash=null:c.webkitLineDash&&(c.webkitLineDash=[])}function getKeyCode(c){c=window.event||c;return c=c.charCode||c.keyCode}function setKeypressHandler(c){window.addEventListener?window.addEventListener("keypress",c,!1):window.attachEvent&&window.attachEvent("onkeypress",c)}Array.isArray||(Array.isArray=function(c){return"[object Array]"===Object.prototype.toString.call(c)});
window.Float64Array||(window.Float64Array=function(){return window.Float64Array||function(c,g,h){if(!(c instanceof ArrayBuffer))throw"Invalid type";var l=new DataView(c),m=[];c=(c.byteLength-g)/8;m.length=void 0===h?c:Math.min(h,c);for(h=0;h<m.length;h++)m[h]=l.getFloat64(8*h+g,!0);m.subarray=function(c,h){return m.slice(c,h)};return m}}());
(function(){var c=function(){};window.console||(window.console={log:c,info:c,warn:c,debug:c,error:c});if((new Int8Array([0,1,0])).subarray(1).subarray(1)[0]){var g=function(c,g){0===arguments.length?(c=0,g=this.length):(0>c&&(c+=this.length),c=Math.max(0,Math.min(this.length,c)),1===arguments.length?g=this.length:(0>g&&(g+=this.length),g=Math.max(c,Math.min(this.length,g))));return new this.constructor(this.buffer,this.byteOffset+c*this.BYTES_PER_ELEMENT,g-c)};[Int8Array,Uint8Array,Int16Array,Uint16Array,
Int32Array,Uint32Array,Float32Array,Float64Array].forEach(function(c){c.prototype.subarray=g})}})();
(function(c,g){function h(g,h,t,x){g[m](l+h,"wheel"===p?t:function(g){!g&&(g=c.event);var h={originalEvent:g,target:g.target||g.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"===g.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){g.preventDefault?g.preventDefault():g.returnValue=!1}};"mousewheel"===p?(h.deltaY=-0.025*g.wheelDelta,g.wheelDeltaX&&(h.deltaX=-0.025*g.wheelDeltaX)):h.deltaY=g.detail;return t(h)},x||!1)}var l="",m,p;c.addEventListener?m="addEventListener":(m="attachEvent",l=
"on");p="onwheel"in g.createElement("div")?"wheel":void 0!==g.onmousewheel?"mousewheel":"DOMMouseScroll";c.addWheelListener=function(c,g,l){h(c,p,g,l);"DOMMouseScroll"===p&&h(c,"MozMousePixelScroll",g,l)}})(window,document);function update(c,g){for(var h in g){var l=g[h];"object"===typeof l?update(c[h],l):c[h]=l}return c}
(function(c){function g(e){e=new Uint8Array(e);if(A)return String.fromCharCode.apply(null,e);for(var c="",f=0;f<e.length;f++)c+=String.fromCharCode(e[f]);return c}function h(e){return 0<=e&&31>e?1<<e:h[e]||(h[e]=Math.pow(2,e))}function l(e,n){this.options={ext_header_type:"dict"};c.update(this.options,n);this.file_name=this.file=null;this.offset=0;this.buf=e;if(null!=this.buf){var f=new DataView(this.buf);this.version=g(this.buf.slice(0,4));this.headrep=g(this.buf.slice(4,8));this.datarep=g(this.buf.slice(8,
12));var d="EEEI"===this.headrep,h="EEEI"===this.datarep;this.ext_start=f.getInt32(24,d);this.ext_size=f.getInt32(28,d);this.type=f.getUint32(48,d);this["class"]=this.type/1E3;this.format=g(this.buf.slice(52,54));this.timecode=f.getFloat64(56,d);1===this["class"]?(this.xstart=f.getFloat64(256,d),this.xdelta=f.getFloat64(264,d),this.xunits=f.getInt32(272,d),this.yunits=f.getInt32(296,d),this.subsize=1):2===this["class"]&&(this.xstart=f.getFloat64(256,d),this.xdelta=f.getFloat64(264,d),this.xunits=
f.getInt32(272,d),this.subsize=f.getInt32(276,d),this.ystart=f.getFloat64(280,d),this.ydelta=f.getFloat64(288,d),this.yunits=f.getInt32(296,d));this.data_start=f.getFloat64(32,d);this.data_size=f.getFloat64(40,d);var f=this.data_start,k=this.data_start+this.data_size;this.ext_size&&(this.ext_header=this.unpack_keywords(this.buf,this.ext_size,512*this.ext_start,d));this.setData(this.buf,f,k,h)}}function m(e){var c=document.createElement("a");c.href=e;for(var f=c.protocol.replace(":",""),d=c.hostname,
g=c.port,h=c.search,F={},l=c.search.replace(/^\?/,"").split("&"),m=l.length,p=0,z;p<m;p++)l[p]&&(z=l[p].split("="),F[z[0]]=z[1]);return{source:e,protocol:f,host:d,port:g,query:h,params:F,file:(c.pathname.match(/\/([^\/?#]+)$/i)||[null,""])[1],hash:c.hash.replace("#",""),path:c.pathname.replace(/^([^\/])/,"/$1"),relative:(c.href.match(/tps?:\/\/[^\/]+(.+)/)||[null,""])[1],segments:c.pathname.replace(/^\//,"").split("/")}}function p(e,c,f){f=f||1024;var d=0,g=new ArrayBuffer(e.length),h=new Uint8Array(g),
l=function(){for(var m=d+f;d<m;d++)h[d]=e.charCodeAt(d)&255;d>=e.length?c(g):setTimeout(l,0)};setTimeout(l,0)}function E(e){this.options=e}navigator.userAgent.match(/(iPad|iPhone|iPod)/i);var v=function(){var e=new ArrayBuffer(4),c=new Uint32Array(e),e=new Uint8Array(e);c[0]=3735928559;if(239===e[0])return"LE";if(222===e[0])return"BE";throw Error("unknown endianness");}(),t={S:1,C:2,V:3,Q:4,M:9,X:10,T:16,U:1,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9},x={P:0.125,A:1,O:1,B:1,I:2,L:4,X:8,F:4,D:8},G={P:null,
A:null,O:Uint8Array,B:Int8Array,I:Int16Array,L:Int32Array,X:null,F:Float32Array,D:Float64Array},D={P:null,A:null,O:"getUint8",B:"getInt8",I:"getInt16",L:"getInt32",X:function(e,c,f){var d,g,k=Math.pow(2,53);f?(d=4,g=0):(d=0,g=4);d=e.getInt32(c+d,f);e=e.getInt32(c+g,f)+h(32)*d;return e>=k?(window.console.info("Int is bigger than JS can represent."),Infinity):e},F:"getFloat32",D:"getFloat64"},A=!0;try{var r=new Uint8Array(new ArrayBuffer(4));r[0]=66;r[1]=76;r[2]=85;r[3]=69;"BLUE"!==String.fromCharCode.apply(null,
r)&&(A=!1)}catch(H){A=!1}l.prototype={setData:function(e,c,f,d){1===this["class"]?(this.spa=t[this.format[0]],this.bps=x[this.format[1]],this.bpa=this.spa*this.bps,this.ape=1,this.bpe=this.ape*this.bpa):2===this["class"]&&(this.spa=t[this.format[0]],this.bps=x[this.format[1]],this.bpa=this.spa*this.bps,this.ape=this.subsize,this.bpe=this.ape*this.bpa);void 0===d&&(d="LE"===v);if("LE"===v&&!d)throw"Not supported "+v+" "+d;if("BE"===v&&this.littleEndianData)throw"Not supported "+v+" "+d;e?(this.dview=
c&&f?this.createArray(e,c,(f-c)/this.bps):this.createArray(e),this.size=this.dview.length/(this.spa*this.ape)):this.dview=this.createArray(null,null,this.size)},unpack_keywords:function(c,h,f,d){var l,k,m,p,v,y,z=[],t={},x={},w=0;c=c.slice(f,c.length);var r=new DataView(c);for(c=g(c);w<h;)y=w+8,f=r.getUint32(w,d),l=r.getInt16(w+4,d),k=r.getInt8(w+6,d),m=c.slice(w+7,w+8),l=f-l,v=y+l,k=c.slice(v,v+k),"A"===m?p=c.slice(y,y+l):D[m]?p="string"===typeof D[m]?r[D[m]](y,d):D[m](r,y,d):window.console.info("Unsupported keyword format "+
m+" for tag "+k),"undefined"===typeof t[k]?t[k]=1:(t[k]++,k=""+k+t[k]),x[k]=p,z.push({tag:k,value:p}),w+=f;c=["dict","json",{},"XMTable","JSON","DICT"];for(var A in c)if(c[A]===this.options.ext_header_type)return x;return z},createArray:function(c,g,f){var d=G[this.format[1]];if(void 0===d)throw"unknown format "+this.format[1];void 0===g&&(g=0);void 0===f&&(f=c.length||c.byteLength/x[this.format[1]]);return c?new d(c,g,f):new d(f)}};E.prototype={readheader:function(c,g){var f=this,d=new FileReader,
h=c.webkitSlice(0,512);d.onloadend=function(c){return function(e){e.target.error?g(null):(e=new l(d.result,f.options),e.file=c,g(e))}}(c);d.readAsArrayBuffer(h)},read:function(c,g){var f=this,d=new FileReader;d.onloadend=function(c){return function(e){e.target.error?g(null):(e=new l(d.result,f.options),e.file=c,e.file_name=c.name,g(e))}}(c);d.readAsArrayBuffer(c)},read_http:function(c,g){var f=this,d=new XMLHttpRequest;d.open("GET",c,!0);d.responseType="arraybuffer";d.overrideMimeType("text/plain; charset=x-user-defined");
d.onload=function(h){if(4!==d.readyState||200!==d.status&&0!==d.status)g(null);else if(h=null,d.response){h=d.response;h=new l(h,f.options);m(c);var k=m(c);h.file_name=k.file;g(h)}else d.responseText&&p(d.responseText,function(d){d=new l(d,f.options);m(c);var h=m(c);d.file_name=h.file;g(d)})};d.onerror=function(c){g(null)};d.send(null)}};c.BlueHeader=c.BlueHeader||l;c.BlueFileReader=c.BlueFileReader||E})(this);
