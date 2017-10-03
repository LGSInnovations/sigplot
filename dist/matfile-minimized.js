/*

 File: matfile.js
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
(function(w){"object"===typeof exports&&"undefined"!==typeof module?module.exports=w():"function"===typeof define&&define.amd?define([],w):("undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:this).matfile=w()})(function(){return function u(r,s,l){function n(h,p){if(!s[h]){if(!r[h]){var g="function"==typeof require&&require;if(!p&&g)return g(h,!0);if(t)return t(h,!0);g=Error("Cannot find module '"+h+"'");throw g.code="MODULE_NOT_FOUND",g;}g=s[h]={exports:{}};
r[h][0].call(g.exports,function(g){var l=r[h][1][g];return n(l?l:g)},g,g.exports,u,r,s,l)}return s[h].exports}for(var t="function"==typeof require&&require,x=0;x<l.length;x++)n(l[x]);return n}({1:[function(u,r,s){(function(l){function n(a){a=new Uint8Array(a);if(y)return String.fromCharCode.apply(null,a);for(var f="",d=0;d<a.length;d++)f+=String.fromCharCode(a[d]);return f}function t(a){return 0<=a&&31>a?1<<a:t[a]||(t[a]=Math.pow(2,a))}function r(a,f,d,b){var e=[];new DataView(a,f,d);if("miINT8"===
b)a=new Int8Array(a,f,d);else if("miUINT8"===b)a=new Uint8Array(a,f,d);else if("miINT16"===b)a=new Int16Array(a,f,d);else if("miUINT16"===b)a=new Uint16Array(a,f,d);else if("miINT32"===b)a=new Int32Array(a,f,d);else if("miUINT32"===b)a=new Uint32Array(a,f,d);else if("miDOUBLE"===b)a=new Float64Array(a,f,d);else{window.console.warn("Array data type not supported yet.");return}a.forEach(function(a){e.push(a)});return e}function h(a,f,d,b){var e;switch(f){case "miINT8":e=a.getInt8(d,b);break;case "miUINT8":e=
a.getInt8(d,b);break;case "miINT16":e=a.getInt16(d,b);break;case "miUINT16":e=a.getUint16(d,b);break;case "miINT32":e=a.getInt32(d,b);break;case "miUINT32":e=a.getUint32(d,b);break;case "miSINGLE":e=a.getFloat32(d,b);break;case "miDOUBLE":e=a.getFloat64(d,b);break;case "miINT64":var c;f=Math.pow(2,53);b?(c=4,e=0):(c=0,e=4);c=a.getInt32(d+c,b);a=a.getInt32(d+e,b)+t(32)*c;a>=f?(window.console.info("Int is bigger than JS can represent."),e=Infinity):e=a;break;default:window.console.warn(f+" not supported at thsi time")}return e}
function p(a,f){this.file_name=this.file=null;this.buf=a;if(null!=this.buf){var d=new DataView(this.buf);this.headerStr=n(this.buf.slice(z-1,A));this.datarep=n(this.buf.slice(B-1,C));var b="IM"===this.datarep,e="IM"===this.datarep;this.headerList=this.headerStr.split(",").map(function(a){return a.trim()});this.matfile=this.headerList[0];this.platform=this.headerList[1];this.createdOn=this.headerList[2];this.subsystemOffset=n(this.buf.slice(D-1,E));this.version=d.getUint16(F-1,b);this.versionName=
G[this.version];this.dataType=d.getUint32(H-1,b);this.dataTypeName=q[this.dataType].name;this.arraySize=d.getUint32(I-1,b);var c=J+1,b=d.getUint32(c-1,b),k=q[b].name,b=q[b].size,c=c+4;h(d,k,c-1,e);c+=b;h(d,k,c-1,e);var c=c+b+b,m=d.getUint32(c-1,e),c=c+4,k=q[m].name,m=q[m].size;d.getUint32(c-1,e);var c=c+4,g=h(d,k,c-1,e),c=c+m;1<g&&window.console.warn("Only 1D arrays are currently supported.");h(d,k,c-1,e);c+=b;m=d.getUint32(c-1,e);c+=4;b=0;k=!1;15<m&&(m&=255,k=!0,b=d.getUint16(c-5,e));m=q[m].name;
k||(b=h(d,m,c-1,e),c+=4);n(this.buf.slice(c-1,c+b-1));c+=b+(k?(4-b%4)%4:(8-b%8)%8);this.setData(this.buf,d,c,e)}}function g(a){var f=document.createElement("a");f.href=a;for(var d=f.protocol.replace(":",""),b=f.hostname,e=f.port,c=f.search,k={},m=f.search.replace(/^\?/,"").split("&"),g=m.length,h=0,l;h<g;h++)m[h]&&(l=m[h].split("="),k[l[0]]=l[1]);return{source:a,protocol:d,host:b,port:e,query:c,params:k,file:(f.pathname.match(/\/([^\/?#]+)$/i)||[null,""])[1],hash:f.hash.replace("#",""),path:f.pathname.replace(/^([^\/])/,
"/$1"),relative:(f.href.match(/tps?:\/\/[^\/]+(.+)/)||[null,""])[1],segments:f.pathname.replace(/^\//,"").split("/")}}function s(a,f,d){d=d||1024;var b=0,e=new ArrayBuffer(a.length),c=new Uint8Array(e),k=function(){for(var g=b+d;b<g;b++)c[b]=a.charCodeAt(b)&255;b>=a.length?f(e):setTimeout(k,0)};setTimeout(k,0)}function u(a){this.options=a}navigator.userAgent.match(/(iPad|iPhone|iPod)/i);var z=1,A=116,D=117,E=124,F=125,B=127,C=128,H=129,I=133,J=136;(function(){var a=new ArrayBuffer(4),f=new Uint32Array(a),
a=new Uint8Array(a);f[0]=3735928559;if(239===a[0])return"LE";if(222===a[0])return"BE";throw Error("unknown endianness");})();var G={256:"MAT-file"},q={1:{name:"miINT8",size:1},2:{name:"miUINT8",size:1},3:{name:"miINT16",size:2},4:{name:"miUINT16",size:2},5:{name:"miINT32",size:4},6:{name:"miUINT32",size:4},7:{name:"miSINGLE",size:4},9:{name:"miDOUBLE",size:8},12:{name:"miINT64",size:8},13:{name:"miUINT64",size:8},14:{name:"miMATRIX",size:null},15:{name:"miCOMPRESSED",size:null},16:{name:"miUTF8",
size:null},17:{name:"miUTF16",size:null},18:{name:"miUTF32",size:null}},y=!0;try{var v=new Uint8Array(new ArrayBuffer(4));v[0]=66;v[1]=76;v[2]=85;v[3]=69;"BLUE"!==String.fromCharCode.apply(null,v)&&(y=!1)}catch(K){y=!1}p.prototype={setData:function(a,f,d,b){var e,c=f.getUint32(d-1,b),k=!1;15<c?(c&=255,k=!0,e=f.getUint16(d+1,2,b)):d+=4;var g=q[c].name,c=q[c].size;k||(e=f.getUint32(d-1,b));this.dview=r(a,d+4-1,e/c,g)}};u.prototype={readheader:function(a,f){var d=this,b=new FileReader,e=a.webkitSlice(0,
116);b.onloadend=function(a){return function(e){e.target.error?f(null):(e=new p(b.result,d.options),e.file=a,f(e))}}(a);b.readAsArrayBuffer(e)},read:function(a,f){var d=this,b=new FileReader;b.onloadend=function(a){return function(c){c.target.error?f(null):(c=new p(b.result,d.options),c.file=a,c.file_name=a.name,f(c))}}(a);b.readAsArrayBuffer(a)},read_http:function(a,f){var d=this,b=new XMLHttpRequest;b.open("GET",a,!0);b.responseType="arraybuffer";b.overrideMimeType("text/plain; charset=x-user-defined");
b.onload=function(e){if(4!==b.readyState||200!==b.status&&0!==b.status)f(null);else if(e=null,b.response){e=b.response;e=new p(e,d.options);g(a);var c=g(a);e.file_name=c.file;f(e)}else b.responseText&&s(b.responseText,function(b){b=new p(b,d.options);g(a);var c=g(a);b.file_name=c.file;f(b)})};b.onerror=function(a){f(null)};b.send(null)}};l.MatHeader=l.MatHeader||p;l.MatFileReader=l.MatFileReader||u})(this)},{}]},{},[1])(1)});
