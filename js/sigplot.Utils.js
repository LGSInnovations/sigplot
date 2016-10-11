/**
 * @license
 * File: sigplot.Utils.js
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
(function(sigplot) {
	sigplot.Utils = {
		// @function extend(dest: Object, src?: Object): Object
		// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter.
		extend: function (dest) {
			var i, j, len, src;

			for (j = 1, len = arguments.length; j < len; j++) {
				src = arguments[j];
				for (i in src) {
					dest[i] = src[i];
				}
			}
			return dest;
		},
		// @function setOptions(obj: Object, options: Object): Object
		// Merges the given properties to the `options` of the `obj` object, returning the resulting options.
		setOptions: function (obj, options) {
			if (!obj.hasOwnProperty('options')) {
				obj.options = obj.options ? sigplot.Utils.create(obj.options) : {};
			}
			for (var i in options) {
				if(typeof options[i] === "object"){
					obj.options[i] = this.extend(obj.options[i], options[i]);
				}else{
					obj.options[i] = options[i];
				}
			}
			return obj.options;
		},
		// @function create(proto: Object, properties?: Object): Object
		// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
		create: Object.create || (function () {
			function F() {}
			return function (proto) {
				F.prototype = proto;
				return new F();
			};
		})()
	};

	//Shortcut for Utils
	sigplot.setOptions = sigplot.Utils.setOptions;
	sigplot.extend = sigplot.Utils.extend;
}(window.sigplot = window.sigplot || {}));