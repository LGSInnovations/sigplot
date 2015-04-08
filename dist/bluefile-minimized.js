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
var ArrayBuffer,ArrayBufferView,Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,DataView;
(function(){function c(){document&&document.createTextNode("").splitText(1);throw new RangeError("INDEX_SIZE_ERR");}function f(a){if(Object.getOwnPropertyNames&&Object.defineProperty){var c=Object.getOwnPropertyNames(a),d;for(d=0;d<c.length;d+=1)Object.defineProperty(a,c[d],{value:a[c[d]],writable:!1,enumerable:!1,configurable:!1})}}function g(a){function c(d){Object.defineProperty(a,d,{get:function(){return a._getter(d)},set:function(c){a._setter(d,c)},enumerable:!0,configurable:!1})}if(Object.defineProperty){var d;
for(d=0;d<a.length;d+=1)c(d)}}function q(a){return[a&255]}function m(a){return x(a[0],8)}function p(a){return[a&255]}function v(a){return y(a[0],8)}function A(a){return[a>>8&255,a&255]}function s(a){return x(a[0]<<8|a[1],16)}function w(a){return[a>>8&255,a&255]}function z(a){return y(a[0]<<8|a[1],16)}function u(a){return[a>>24&255,a>>16&255,a>>8&255,a&255]}function B(a){return x(a[0]<<24|a[1]<<16|a[2]<<8|a[3],32)}function d(a){return[a>>24&255,a>>16&255,a>>8&255,a&255]}function e(a){return y(a[0]<<
24|a[1]<<16|a[2]<<8|a[3],32)}function l(a){var d=[];for(a=a.join("");a.length;)d.push(parseInt(a.substring(0,8),2)),a=a.substring(8);return d}function k(a){var d=[],c,e;for(c=a.length;c;c-=1)for(b=a[c-1],e=8;e;e-=1)d.push(b%2?1:0),b>>=1;d.reverse();return d}function E(a){return[a&255]}function F(a){return x(a[0],8)}function G(a){return[a&255]}function H(a){return y(a[0],8)}function I(a){return[a&255,a>>8&255]}function J(a){return x(a[1]<<8|a[0],16)}function K(a){return[a&255,a>>8&255]}function L(a){return y(a[1]<<
8|a[0],16)}function M(a){return[a&255,a>>8&255,a>>16&255,a>>24&255]}function N(a){return x(a[3]<<24|a[2]<<16|a[1]<<8|a[0],32)}function O(a){return[a&255,a>>8&255,a>>16&255,a>>24&255]}function P(a){return y(a[3]<<24|a[2]<<16|a[1]<<8|a[0],32)}function Q(a){var d=[];for(a=a.join("");a.length;)d.push(parseInt(a.substring(a.length-8,a.length),2)),a=a.substring(0,a.length-8);return d}function R(a){var d=[],c,e;for(c=0;c<a.length;c++)for(b=a[c],e=8;e;e-=1)d.push(b%2?1:0),b>>=1;d.reverse();return d}function x(a,
d){var c=32-d;return a<<c>>c}function y(a,d){var c=32-d;return a<<c>>>c}function C(a,d,c){var e=(1<<d-1)-1,h,t,l;isNaN(a)?(t=(1<<e)-1,e=Math.pow(2,c-1),h=0):Infinity===a||-Infinity===a?(t=(1<<e)-1,e=0,h=0>a?1:0):0===a?(e=t=0,h=-Infinity===1/a?1:0):(h=0>a,a=Math.abs(a),a>=Math.pow(2,1-e)?(l=Math.min(Math.floor(Math.log(a)/Math.LN2),e),t=l+e,e=Math.round(a*Math.pow(2,c-l)-Math.pow(2,c))):(t=0,e=Math.round(a/Math.pow(2,1-e-c))));for(a=[];c;c-=1)a.push(e%2?1:0),e=Math.floor(e/2);for(c=d;c;c-=1)a.push(t%
2?1:0),t=Math.floor(t/2);a.push(h?1:0);a.reverse();return S(a)}function D(a,c,d){var e=[],h,t,e=T(a);h=e.join("");a=(1<<c-1)-1;e=parseInt(h.substring(0,1),2)?-1:1;t=parseInt(h.substring(1,1+c),2);h=parseInt(h.substring(1+c),2);return t===(1<<c)-1?0!==h?NaN:Infinity*e:0<t?e*Math.pow(2,t-a)*(1+h/Math.pow(2,d)):0!==h?e*Math.pow(2,-(a-1))*(h/Math.pow(2,d)):0>e?-0:0}function U(a){return D(a,11,52)}function V(a){return C(a,11,52)}function W(a){return D(a,8,23)}function X(a){return C(a,8,23)}var r={ToInt32:function(a){return a>>
0},ToUint32:function(a){return a>>>0}};Object.prototype.__defineGetter__&&!Object.defineProperty&&(Object.defineProperty=function(a,c,d){d.hasOwnProperty("get")&&a.__defineGetter__(c,d.get);d.hasOwnProperty("set")&&a.__defineSetter__(c,d.set)});var Y=window.BIG_ENDIAN_ARRAYBUFFERS?q:E,Z=window.BIG_ENDIAN_ARRAYBUFFERS?m:F,$=window.BIG_ENDIAN_ARRAYBUFFERS?p:G,aa=window.BIG_ENDIAN_ARRAYBUFFERS?v:H,ba=window.BIG_ENDIAN_ARRAYBUFFERS?A:I,ca=window.BIG_ENDIAN_ARRAYBUFFERS?s:J,da=window.BIG_ENDIAN_ARRAYBUFFERS?
w:K,ea=window.BIG_ENDIAN_ARRAYBUFFERS?z:L,fa=window.BIG_ENDIAN_ARRAYBUFFERS?u:M,ga=window.BIG_ENDIAN_ARRAYBUFFERS?B:N,ha=window.BIG_ENDIAN_ARRAYBUFFERS?d:O,ia=window.BIG_ENDIAN_ARRAYBUFFERS?e:P,S=window.BIG_ENDIAN_ARRAYBUFFERS?l:Q,T=window.BIG_ENDIAN_ARRAYBUFFERS?k:R;ArrayBuffer||function(){function a(a,d,e){var h;h=function(a,d,e){var l,n,k;if(arguments.length&&"number"!==typeof arguments[0])if("object"===typeof arguments[0]&&arguments[0].constructor===h)for(l=arguments[0],this.length=l.length,this.byteLength=
this.length*this.BYTES_PER_ELEMENT,this.buffer=new ArrayBuffer(this.byteLength),n=this.byteOffset=0;n<this.length;n+=1)this._setter(n,l._getter(n));else if("object"!==typeof arguments[0]||arguments[0]instanceof ArrayBuffer)if("object"===typeof arguments[0]&&arguments[0]instanceof ArrayBuffer){this.buffer=a;this.byteOffset=r.ToUint32(d);this.byteOffset>this.buffer.byteLength&&c();if(this.byteOffset%this.BYTES_PER_ELEMENT)throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
3>arguments.length?(this.byteLength=this.buffer.byteLength-this.byteOffset,this.byteLength%this.BYTES_PER_ELEMENT&&c(),this.length=this.byteLength/this.BYTES_PER_ELEMENT):(this.length=r.ToUint32(e),this.byteLength=this.length*this.BYTES_PER_ELEMENT);this.byteOffset+this.byteLength>this.buffer.byteLength&&c()}else throw new TypeError("Unexpected argument type(s)");else for(l=arguments[0],this.length=r.ToUint32(l.length),this.byteLength=this.length*this.BYTES_PER_ELEMENT,this.buffer=new ArrayBuffer(this.byteLength),
n=this.byteOffset=0;n<this.length;n+=1)k=l[n],this._setter(n,Number(k));else{this.length=r.ToInt32(arguments[0]);if(0>e)throw new RangeError("ArrayBufferView size is not a small enough positive integer.");this.byteLength=this.length*this.BYTES_PER_ELEMENT;this.buffer=new ArrayBuffer(this.byteLength);this.byteOffset=0}this.constructor=h;f(this);g(this)};h.prototype=new ArrayBufferView;h.prototype.BYTES_PER_ELEMENT=a;h.prototype.emulated=!0;h.prototype._pack=d;h.prototype._unpack=e;h.BYTES_PER_ELEMENT=
a;h.prototype._getter=function(a){if(1>arguments.length)throw new SyntaxError("Not enough arguments");a=r.ToUint32(a);if(!(a>=this.length)){var c=[],d,e;d=0;for(e=this.byteOffset+a*this.BYTES_PER_ELEMENT;d<this.BYTES_PER_ELEMENT;d+=1,e+=1)c.push(this.buffer._bytes[e]);return this._unpack(c)}};h.prototype.get=h.prototype._getter;h.prototype._setter=function(a,d){if(2>arguments.length)throw new SyntaxError("Not enough arguments");a=r.ToUint32(a);if(!(a>=this.length)){var c=this._pack(d),e,h;e=0;for(h=
this.byteOffset+a*this.BYTES_PER_ELEMENT;e<this.BYTES_PER_ELEMENT;e+=1,h+=1)this.buffer._bytes[h]=c[e]}};h.prototype.set=function(a,d){if(1>arguments.length)throw new SyntaxError("Not enough arguments");var e,h,l,g,k,f;if("object"===typeof arguments[0]&&arguments[0].constructor===this.constructor)if(e=arguments[0],h=r.ToUint32(arguments[1]),h+e.length>this.length&&c(),f=this.byteOffset+h*this.BYTES_PER_ELEMENT,h=e.length*this.BYTES_PER_ELEMENT,e.buffer===this.buffer){l=[];g=0;for(k=e.byteOffset;g<
h;g+=1,k+=1)l[g]=e.buffer._bytes[k];for(g=0;g<h;g+=1,f+=1)this.buffer._bytes[f]=l[g]}else for(g=0,k=e.byteOffset;g<h;g+=1,k+=1,f+=1)this.buffer._bytes[f]=e.buffer._bytes[k];else if("object"===typeof arguments[0]&&"undefined"!==typeof arguments[0].length)for(e=arguments[0],l=r.ToUint32(e.length),h=r.ToUint32(arguments[1]),h+l>this.length&&c(),g=0;g<l;g+=1)k=e[g],this._setter(h+g,Number(k));else throw new TypeError("Unexpected argument type(s)");};h.prototype.subarray=function(a,d){a=r.ToInt32(a);d=
r.ToInt32(d);1>arguments.length&&(a=0);2>arguments.length&&(d=this.length);0>a&&(a=this.length+a);0>d&&(d=this.length+d);var c=this.length;a=0>a?0:a>c?c:a;c=this.length;c=(0>d?0:d>c?c:d)-a;0>c&&(c=0);return new this.constructor(this.buffer,a*this.BYTES_PER_ELEMENT,c)};return h}ArrayBuffer=function(a){a=r.ToInt32(a);if(0>a)throw new RangeError("ArrayBuffer size is not a small enough positive integer.");this.byteLength=a;this._bytes=[];this._bytes.length=a;for(a=0;a<this.byteLength;a+=1)this._bytes[a]=
0;f(this)};ArrayBuffer.isNative=!1;ArrayBufferView=function(){};Int8Array=Int8Array||a(1,Y,Z);Uint8Array=Uint8Array||a(1,$,aa);Int16Array=Int16Array||a(2,ba,ca);Uint16Array=Uint16Array||a(2,da,ea);Int32Array=Int32Array||a(4,fa,ga);Uint32Array=Uint32Array||a(4,ha,ia);Float32Array=Float32Array||a(4,X,W);Float64Array=Float64Array||a(8,V,U)}();DataView||function(){function a(a,d){return"function"===typeof a.get?a.get(d):a[d]}function d(e){return function(d,l){d=r.ToUint32(d);d+e.BYTES_PER_ELEMENT>this.byteLength&&
c();d+=this.byteOffset;var k=new Uint8Array(this.buffer,d,e.BYTES_PER_ELEMENT),f=[],n;for(n=0;n<e.BYTES_PER_ELEMENT;n+=1)f.push(a(k,n));Boolean(l)===Boolean(g)&&f.reverse();return a(new e((new Uint8Array(f)).buffer),0)}}function e(d){return function(e,l,k){e=r.ToUint32(e);e+d.BYTES_PER_ELEMENT>this.byteLength&&c();l=new d([l]);l=new Uint8Array(l.buffer);var f=[],n;for(n=0;n<d.BYTES_PER_ELEMENT;n+=1)f.push(a(l,n));Boolean(k)===Boolean(g)&&f.reverse();(new Uint8Array(this.buffer,e,d.BYTES_PER_ELEMENT)).set(f)}}
var g=function(){var d=new Uint16Array([4660]),d=new Uint8Array(d.buffer);return 18===a(d,0)}();DataView=function(a,d,e){if(!("object"===typeof a&&a instanceof ArrayBuffer))throw new TypeError("TypeError");this.buffer=a;this.byteOffset=r.ToUint32(d);this.byteOffset>this.buffer.byteLength&&c();this.byteLength=3>arguments.length?this.buffer.byteLength-this.byteOffset:r.ToUint32(e);this.byteOffset+this.byteLength>this.buffer.byteLength&&c();f(this)};ArrayBufferView&&(DataView.prototype=new ArrayBufferView);
DataView.prototype.getUint8=d(Uint8Array);DataView.prototype.getInt8=d(Int8Array);DataView.prototype.getUint16=d(Uint16Array);DataView.prototype.getInt16=d(Int16Array);DataView.prototype.getUint32=d(Uint32Array);DataView.prototype.getInt32=d(Int32Array);DataView.prototype.getFloat32=d(Float32Array);DataView.prototype.getFloat64=d(Float64Array);DataView.prototype.setUint8=e(Uint8Array);DataView.prototype.setInt8=e(Int8Array);DataView.prototype.setUint16=e(Uint16Array);DataView.prototype.setInt16=e(Int16Array);
DataView.prototype.setUint32=e(Uint32Array);DataView.prototype.setInt32=e(Int32Array);DataView.prototype.setFloat32=e(Float32Array);DataView.prototype.setFloat64=e(Float64Array)}()})();window.ArrayBuffer&&!ArrayBuffer.prototype.slice&&(ArrayBuffer.prototype.slice=function(c,f){var g=new Uint8Array(this);void 0===f&&(f=g.length);for(var q=new ArrayBuffer(f-c),m=new Uint8Array(q),p=0;p<m.length;p++)m[p]=g[p+c];return q});
Array.prototype.remove=function(c,f){var g=this.slice((f||c)+1||this.length);this.length=0>c?this.length+c:c;return this.push.apply(this,g)};window.requestAnimFrame=function(c){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(c){return window.setTimeout(c,1E3/60)}}();
window.cancelAnimFrame=function(c){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCanelAnimationFrame||function(c){window.clearTimeout(c)}}();function dashOn(c,f,g){return c.setLineDash?(c.setLineDash([f,g]),!0):void 0!==c.mozDash?(c.mozDash=[f,g],!0):c.webkitLineDash&&0===c.webkitLineDash.length?(c.webkitLineDash=[f,g],!0):!1}
function dashOff(c){c.setLineDash?c.setLineDash([]):c.mozDash?c.mozDash=null:c.webkitLineDash&&(c.webkitLineDash=[])}function getKeyCode(c){c=window.event||c;return c=c.charCode||c.keyCode}function setKeypressHandler(c){window.addEventListener?window.addEventListener("keypress",c,!1):window.attachEvent&&window.attachEvent("onkeypress",c)}Array.isArray||(Array.isArray=function(c){return"[object Array]"===Object.prototype.toString.call(c)});
window.Float64Array||(window.Float64Array=function(){return window.Float64Array||function(c,f,g){if(!(c instanceof ArrayBuffer))throw"Invalid type";var q=new DataView(c),m=[];c=(c.byteLength-f)/8;m.length=void 0===g?c:Math.min(g,c);for(g=0;g<m.length;g++)m[g]=q.getFloat64(8*g+f,!0);m.subarray=function(c,g){return m.slice(c,g)};return m}}());
(function(){var c=function(){};window.console||(window.console={log:c,info:c,warn:c,debug:c,error:c});if((new Int8Array([0,1,0])).subarray(1).subarray(1)[0]){var f=function(c,f){0===arguments.length?(c=0,f=this.length):(0>c&&(c+=this.length),c=Math.max(0,Math.min(this.length,c)),1===arguments.length?f=this.length:(0>f&&(f+=this.length),f=Math.max(c,Math.min(this.length,f))));return new this.constructor(this.buffer,this.byteOffset+c*this.BYTES_PER_ELEMENT,f-c)};[Int8Array,Uint8Array,Int16Array,Uint16Array,
Int32Array,Uint32Array,Float32Array,Float64Array].forEach(function(c){c.prototype.subarray=f})}})();
(function(c,f){function g(g,f,s,w){g[m](q+f,"wheel"===p?s:function(g){!g&&(g=c.event);var f={originalEvent:g,target:g.target||g.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"===g.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){g.preventDefault?g.preventDefault():g.returnValue=!1}};"mousewheel"===p?(f.deltaY=-0.025*g.wheelDelta,g.wheelDeltaX&&(f.deltaX=-0.025*g.wheelDeltaX)):f.deltaY=g.detail;return s(f)},w||!1)}var q="",m,p;c.addEventListener?m="addEventListener":(m="attachEvent",q=
"on");p="onwheel"in f.createElement("div")?"wheel":void 0!==f.onmousewheel?"mousewheel":"DOMMouseScroll";c.addWheelListener=function(c,f,m){g(c,p,f,m);"DOMMouseScroll"===p&&g(c,"MozMousePixelScroll",f,m)}})(window,document);
(function(c){function f(d){d=new Uint8Array(d);if(z)return String.fromCharCode.apply(null,d);for(var c="",g=0;g<d.length;g++)c+=String.fromCharCode(d[g]);return c}function g(d){this.file_name=this.file=null;this.offset=0;this.buf=d;if(null!=this.buf){d=new DataView(this.buf);this.version=f(this.buf.slice(0,4));this.headrep=f(this.buf.slice(4,8));this.datarep=f(this.buf.slice(8,12));var c="EEEI"===this.headrep,g="EEEI"===this.datarep;this.type=d.getUint32(48,c);this["class"]=this.type/1E3;this.format=
f(this.buf.slice(52,54));this.timecode=d.getFloat64(56,c);1===this["class"]?(this.xstart=d.getFloat64(256,c),this.xdelta=d.getFloat64(264,c),this.xunits=d.getInt32(272,c),this.yunits=d.getInt32(296,c),this.subsize=1):2===this["class"]&&(this.xstart=d.getFloat64(256,c),this.xdelta=d.getFloat64(264,c),this.xunits=d.getInt32(272,c),this.subsize=d.getInt32(276,c),this.ystart=d.getFloat64(280,c),this.ydelta=d.getFloat64(288,c),this.yunits=d.getInt32(296,c));this.data_start=d.getFloat64(32,c);this.data_size=
d.getFloat64(40,c);this.setData(this.buf,this.data_start,this.data_start+this.data_size,g)}}function q(c){var e=document.createElement("a");e.href=c;for(var g=e.protocol.replace(":",""),f=e.hostname,m=e.port,p=e.search,q={},s=e.search.replace(/^\?/,"").split("&"),v=s.length,u=0,w;u<v;u++)s[u]&&(w=s[u].split("="),q[w[0]]=w[1]);return{source:c,protocol:g,host:f,port:m,query:p,params:q,file:(e.pathname.match(/\/([^\/?#]+)$/i)||[null,""])[1],hash:e.hash.replace("#",""),path:e.pathname.replace(/^([^\/])/,
"/$1"),relative:(e.href.match(/tps?:\/\/[^\/]+(.+)/)||[null,""])[1],segments:e.pathname.replace(/^\//,"").split("/")}}function m(c,e,g){g=g||1024;var f=0,m=new ArrayBuffer(c.length),q=new Uint8Array(m),p=function(){for(var s=f+g;f<s;f++)q[f]=c.charCodeAt(f)&255;f>=c.length?e(m):setTimeout(p,0)};setTimeout(p,0)}function p(c){this.options=c}navigator.userAgent.match(/(iPad|iPhone|iPod)/i);var v=function(){var c=new ArrayBuffer(4),e=new Uint32Array(c),c=new Uint8Array(c);e[0]=3735928559;if(239===c[0])return"LE";
if(222===c[0])return"BE";throw Error("unknown endianness");}(),A={S:1,C:2,V:3,Q:4,M:9,X:10,T:16,U:1,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9},s={P:0.125,A:1,O:1,B:1,I:2,L:4,X:8,F:4,D:8},w={P:null,A:null,O:Uint8Array,B:Int8Array,I:Int16Array,L:Int32Array,X:null,F:Float32Array,D:Float64Array},z=!0;try{var u=new UInt8Array(new ArrayBuffer(4));u[0]=66;u[1]=76;u[2]=85;u[3]=69;"BLUE"!==String.fromCharCode.apply(null,u)&&(z=!1)}catch(B){z=!1}g.prototype={setData:function(c,e,g,f){1===this["class"]?(this.spa=
A[this.format[0]],this.bps=s[this.format[1]],this.bpa=this.spa*this.bps,this.ape=1,this.bpe=this.ape*this.bpa):2===this["class"]&&(this.spa=A[this.format[0]],this.bps=s[this.format[1]],this.bpa=this.spa*this.bps,this.ape=this.subsize,this.bpe=this.ape*this.bpa);void 0===f&&(f="LE"===v);if("LE"===v&&!f)throw"Not supported "+v+" "+f;if("BE"===v&&this.littleEndianData)throw"Not supported "+v+" "+f;c?(this.dview=e&&g?this.createArray(c,e,(g-e)/this.bps):this.createArray(c),this.size=this.dview.length/
(this.spa*this.ape)):this.dview=this.createArray(null,null,this.size)},createArray:function(c,e,g){var f=w[this.format[1]];if(void 0===f)throw"unknown format "+this.format[1];void 0===e&&(e=0);void 0===g&&(g=c.length||c.byteLength/s[this.format[1]]);return c?new f(c,e,g):new f(g)}};p.prototype={readheader:function(c,e){var f=new FileReader,k=c.webkitSlice(0,512);f.onloadend=function(c){return function(d){d.target.error?e(null):(d=new g(f.result),d.file=c,e(d))}}(c);f.readAsArrayBuffer(k)},read:function(c,
e){var f=new FileReader;f.onloadend=function(c){return function(d){d.target.error?e(null):(d=new g(f.result),d.file=c,d.file_name=c.name,e(d))}}(c);f.readAsArrayBuffer(c)},read_http:function(c,e){var f=new XMLHttpRequest;f.open("GET",c,!0);f.responseType="arraybuffer";f.overrideMimeType("text/plain; charset=x-user-defined");f.onload=function(k){if(4!==f.readyState||200!==f.status&&0!==f.status)e(null);else if(k=null,f.response){k=f.response;k=new g(k);q(c);var p=q(c);k.file_name=p.file;e(k)}else f.responseText&&
m(f.responseText,function(f){f=new g(f);q(c);var k=q(c);f.file_name=k.file;e(f)})};f.onerror=function(c){e(null)};f.send(null)}};c.BlueHeader=c.BlueHeader||g;c.BlueFileReader=c.BlueFileReader||p})(this);
