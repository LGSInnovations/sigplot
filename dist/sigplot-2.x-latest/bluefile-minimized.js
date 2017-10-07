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
(function(v){"object"===typeof exports&&"undefined"!==typeof module?module.exports=v():"function"===typeof define&&define.amd?define([],v):("undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:this).bluefile=v()})(function(){return function t(l,m,a){function g(d,e){if(!m[d]){if(!l[d]){var h="function"==typeof require&&require;if(!e&&h)return h(d,!0);if(b)return b(d,!0);h=Error("Cannot find module '"+d+"'");throw h.code="MODULE_NOT_FOUND",h;}h=m[d]={exports:{}};
l[d][0].call(h.exports,function(a){var b=l[d][1][a];return g(b?b:a)},h,h.exports,t,l,m,a)}return m[d].exports}for(var b="function"==typeof require&&require,e=0;e<a.length;e++)g(a[e]);return g}({1:[function(t,l,m){(function(){function a(){}function g(a){a=new Uint8Array(a);if(s)return String.fromCharCode.apply(null,a);for(var b="",f=0;f<a.length;f++)b+=String.fromCharCode(a[f]);return b}function b(a){return 0<=a&&31>a?1<<a:b[a]||(b[a]=Math.pow(2,a))}function e(a){var b=document.createElement("a");
b.href=a;for(var f=b.protocol.replace(":",""),c=b.hostname,g=b.port,e=b.search,d={},h=b.search.replace(/^\?/,"").split("&"),k=h.length,q=0,l;q<k;q++)h[q]&&(l=h[q].split("="),d[l[0]]=l[1]);return{source:a,protocol:f,host:c,port:g,query:e,params:d,file:(b.pathname.match(/\/([^\/?#]+)$/i)||[null,""])[1],hash:b.hash.replace("#",""),path:b.pathname.replace(/^([^\/])/,"/$1"),relative:(b.href.match(/tps?:\/\/[^\/]+(.+)/)||[null,""])[1],segments:b.pathname.replace(/^\//,"").split("/")}}function d(a,b,f){f=
f||1024;var c=0,g=new ArrayBuffer(a.length),d=new Uint8Array(g),e=function(){for(var h=c+f;c<h;c++)d[c]=a.charCodeAt(c)&255;c>=a.length?b(g):setTimeout(e,0)};setTimeout(e,0)}var k=t("./common");navigator.userAgent.match(/(iPad|iPhone|iPod)/i);var h=function(){var a=new ArrayBuffer(4),b=new Uint32Array(a),a=new Uint8Array(a);b[0]=3735928559;if(239===a[0])return"LE";if(222===a[0])return"BE";throw Error("unknown endianness");}(),u={S:1,C:2,V:3,Q:4,M:9,X:10,T:16,U:1,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9},
p={P:0.125,A:1,O:1,B:1,I:2,L:4,X:8,F:4,D:8},m={P:null,A:null,O:Uint8Array,B:Int8Array,I:Int16Array,L:Int32Array,X:null,F:Float32Array,D:Float64Array},q={P:null,A:null,O:"getUint8",B:"getInt8",I:"getInt16",L:"getInt32",X:function(a,g,f){var c,e,d=Math.pow(2,53);f?(c=4,e=0):(c=0,e=4);c=a.getInt32(g+c,f);a=a.getInt32(g+e,f)+b(32)*c;return a>=d?(window.console.info("Int is bigger than JS can represent."),Infinity):a},F:"getFloat32",D:"getFloat64"},s=!0;try{var n=new Uint8Array(new ArrayBuffer(4));n[0]=
66;n[1]=76;n[2]=85;n[3]=69;"BLUE"!==String.fromCharCode.apply(null,n)&&(s=!1)}catch(w){s=!1}a.BlueHeader=function(a,b){this.options={ext_header_type:"dict"};k.update(this.options,b);this.buf=a;if(null!=this.buf){var f=new DataView(this.buf);this.version=g(this.buf.slice(0,4));this.headrep=g(this.buf.slice(4,8));this.datarep=g(this.buf.slice(8,12));var c="EEEI"===this.headrep,e="EEEI"===this.datarep;this.ext_start=f.getInt32(24,c);this.ext_size=f.getInt32(28,c);this.type=f.getUint32(48,c);this["class"]=
this.type/1E3;this.format=g(this.buf.slice(52,54));this.timecode=f.getFloat64(56,c);1===this["class"]?(this.xstart=f.getFloat64(256,c),this.xdelta=f.getFloat64(264,c),this.xunits=f.getInt32(272,c),this.yunits=f.getInt32(296,c),this.subsize=1):2===this["class"]&&(this.xstart=f.getFloat64(256,c),this.xdelta=f.getFloat64(264,c),this.xunits=f.getInt32(272,c),this.subsize=f.getInt32(276,c),this.ystart=f.getFloat64(280,c),this.ydelta=f.getFloat64(288,c),this.yunits=f.getInt32(296,c));this.data_start=f.getFloat64(32,
c);this.data_size=f.getFloat64(40,c);var f=this.data_start,d=this.data_start+this.data_size;this.ext_size&&(this.ext_header=this.unpack_keywords(this.buf,this.ext_size,512*this.ext_start,c));this.setData(this.buf,f,d,e)}};a.BlueHeader.prototype={setData:function(a,b,f,c){1===this["class"]?(this.spa=u[this.format[0]],this.bps=p[this.format[1]],this.bpa=this.spa*this.bps,this.ape=1,this.bpe=this.ape*this.bpa):2===this["class"]&&(this.spa=u[this.format[0]],this.bps=p[this.format[1]],this.bpa=this.spa*
this.bps,this.ape=this.subsize,this.bpe=this.ape*this.bpa);void 0===c&&(c="LE"===h);if("LE"===h&&!c)throw"Not supported "+h+" "+c;if("BE"===h&&this.littleEndianData)throw"Not supported "+h+" "+c;a?(this.dview=b&&f?this.createArray(a,b,(f-b)/this.bps):this.createArray(a),this.size=this.dview.length/(this.spa*this.ape)):this.dview=this.createArray(null,null,this.size)},unpack_keywords:function(a,b,f,c){var e,d,h,k,l,p,m=[],s={},u={},r=0;a=a.slice(f,a.length);var n=new DataView(a);for(a=g(a);r<b;)p=
r+8,f=n.getUint32(r,c),e=n.getInt16(r+4,c),d=n.getInt8(r+6,c),h=a.slice(r+7,r+8),e=f-e,l=p+e,d=a.slice(l,l+d),"A"===h?k=a.slice(p,p+e):q[h]?k="string"===typeof q[h]?n[q[h]](p,c):q[h](n,p,c):window.console.info("Unsupported keyword format "+h+" for tag "+d),"undefined"===typeof s[d]?s[d]=1:(s[d]++,d=""+d+s[d]),u[d]=k,m.push({tag:d,value:k}),r+=f;a=["dict","json",{},"XMTable","JSON","DICT"];for(var t in a)if(a[t]===this.options.ext_header_type)return u;return m},createArray:function(a,b,f){var c=m[this.format[1]];
if(void 0===c)throw"unknown format "+this.format[1];void 0===b&&(b=0);void 0===f&&(f=a.length||a.byteLength/p[this.format[1]]);return a?new c(a,b,f):new c(f)}};a.BlueFileReader=function(a){this.options=a};a.BlueFileReader.prototype={readheader:function(b,d){var f=this,c=new FileReader,e=b.webkitSlice(0,512);c.onloadend=function(b){return function(e){e.target.error?d(null):(e=new a.BlueHeader(c.result,f.options),e.file=b,d(e))}}(b);c.readAsArrayBuffer(e)},read:function(b,d){var e=this,c=new FileReader;
c.onloadend=function(b){return function(g){g.target.error?d(null):(g=new a.BlueHeader(c.result,e.options),g.file=b,g.file_name=b.name,d(g))}}(b);c.readAsArrayBuffer(b)},read_http:function(b,g){var f=this,c=new XMLHttpRequest;c.open("GET",b,!0);c.responseType="arraybuffer";c.overrideMimeType("text/plain; charset=x-user-defined");c.onload=function(h){if(4!==c.readyState||200!==c.status&&0!==c.status)g(null);else if(h=null,c.response){h=c.response;h=new a.BlueHeader(h,f.options);e(b);var k=e(b);h.file_name=
k.file;g(h)}else c.responseText&&d(c.responseText,function(c){c=new a.BlueHeader(c,f.options);e(b);var d=e(b);c.file_name=d.file;g(c)})};c.onerror=function(a){g(null)};c.send(null)}};l.exports=a})()},{"./common":2}],2:[function(t,l,m){(function(){l.exports={};window.ArrayBuffer&&!ArrayBuffer.prototype.slice&&(ArrayBuffer.prototype.slice=function(a,g){var b=new Uint8Array(this);void 0===g&&(g=b.length);for(var e=new ArrayBuffer(g-a),d=new Uint8Array(e),k=0;k<d.length;k++)d[k]=b[k+a];return e});Array.prototype.remove=
function(a,g){var b=this.slice((g||a)+1||this.length);this.length=0>a?this.length+a:a;return this.push.apply(this,b)};window.requestAnimFrame=function(a){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){return window.setTimeout(a,1E3/60)}}();window.cancelAnimFrame=function(a){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||
window.oCancelAnimationFrame||window.msCanelAnimationFrame||function(a){window.clearTimeout(a)}}();l.exports.dashOn=function(a,g,b){return a.setLineDash?(a.setLineDash([g,b]),!0):void 0!==a.mozDash?(a.mozDash=[g,b],!0):a.webkitLineDash&&0===a.webkitLineDash.length?(a.webkitLineDash=[g,b],!0):!1};l.exports.dashOff=function(a){a.setLineDash?a.setLineDash([]):a.mozDash?a.mozDash=null:a.webkitLineDash&&(a.webkitLineDash=[])};l.exports.getKeyCode=function(a){a=window.event||a;return a=a.charCode||a.keyCode};
l.exports.setKeypressHandler=function(a){window.addEventListener?window.addEventListener("keypress",a,!1):window.attachEvent&&window.attachEvent("onkeypress",a)};Array.isArray||(Array.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)});window.Float64Array||(window.Float64Array=function(){return window.Float64Array||function(a,g,b){if(!(a instanceof ArrayBuffer))throw"Invalid type";var e=new DataView(a),d=[];a=(a.byteLength-g)/8;d.length=void 0===b?a:Math.min(b,a);for(b=
0;b<d.length;b++)d[b]=e.getFloat64(8*b+g,!0);d.subarray=function(a,b){return d.slice(a,b)};return d}}());(function(){var a=function(){};window.console||(window.console={log:a,info:a,warn:a,debug:a,error:a});if((new Int8Array([0,1,0])).subarray(1).subarray(1)[0]){var g=function(a,e){0===arguments.length?(a=0,e=this.length):(0>a&&(a+=this.length),a=Math.max(0,Math.min(this.length,a)),1===arguments.length?e=this.length:(0>e&&(e+=this.length),e=Math.max(a,Math.min(this.length,e))));return new this.constructor(this.buffer,
this.byteOffset+a*this.BYTES_PER_ELEMENT,e-a)};[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array].forEach(function(a){a.prototype.subarray=g})}})();(function(a,g){function b(b,g,l,m){b[d](e+g,"wheel"===k?l:function(b){!b&&(b=a.event);var d={originalEvent:b,target:b.target||b.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"===b.type?0:1,deltaX:0,delatZ:0,preventDefault:function(){b.preventDefault?b.preventDefault():b.returnValue=!1}};"mousewheel"===
k?(d.deltaY=-0.025*b.wheelDelta,b.wheelDeltaX&&(d.deltaX=-0.025*b.wheelDeltaX)):d.deltaY=b.detail;return l(d)},m||!1)}var e="",d,k;a.addEventListener?d="addEventListener":(d="attachEvent",e="on");k="onwheel"in g.createElement("div")?"wheel":void 0!==g.onmousewheel?"mousewheel":"DOMMouseScroll";a.addWheelListener=function(a,d,e){b(a,k,d,e);"DOMMouseScroll"===k&&b(a,"MozMousePixelScroll",d,e)}})(window,document);l.exports.update=function g(b,e){for(var d in e){var k=e[d];"object"===typeof k?g(b[d],
k):b[d]=k}return b}})()},{}]},{},[1])(1)});
