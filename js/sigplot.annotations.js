/**
 * @license
 * File: sigplot.annotations.js
 *
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

(function( sigplot, mx, m, undefined ) {
	
	/**
	 * @constructor
	 * @param options
	 * @returns {sigplot.AnnotationPlugin}
	 */
	sigplot.AnnotationPlugin = function(options) {
		this.options = (options === undefined) ? {} : options;
		
		if (this.options.display === undefined)  this.options.display = true;
		
		this.annotations = [];
	}
	
	sigplot.AnnotationPlugin.prototype = {
			init: function(plot) {
				this.plot = plot;
			},
			
			menu: function() {
				var _display_handler = ( function(self) {
					return function() {
						self.options.display = !self.options.display;
						self.plot.redraw();
					};
				}(this) );
				
				var _clearall_handler = ( function(self) {
					return function() {
						self.annotations = [];
						self.plot.redraw();
					};
				}(this) );
				
				return {
					text: "Annotations...",
					menu: {
						title: "ANNOTATIONS",
						items: [{
							text: "Display",
				        	checked: this.options.display,
				        	style: "checkbox",
				        	handler: _display_handler
						},{
							text: "Clear All",
							handler: _clearall_handler
						}]
					}
				};
			},
			
			add_annotation: function(annotation) {
				this.annotations.push(annotation);
				
				this.plot.redraw();
				return this.annotations.length;
			},
			
			clear_annotations: function() {
				self.annotations = [];
				
				this.plot.redraw();
			},
			
			refresh: function(canvas) {
				if (!this.options.display) return;
				var Gx = this.plot._Gx;
				var Mx = this.plot._Mx;
				
				var ctx = canvas.getContext("2d");
				
				for (var i=0; i<this.annotations.length; i++) {
					var annotation = this.annotations[i];
					
					var pxl = {x: annotation.x,
						       y: annotation.y};
					if (annotation.absolute_placement === true) {
						pxl.x += Mx.l;
						pxl.y += Mx.t;
					} else {
						pxl = mx.real_to_pixel(Mx, pxl.x, pxl.y);
						pxl.y += Mx.t;
					}

					if ((annotation.value instanceof HTMLImageElement) ||
						(annotation.value instanceof HTMLCanvasElement) ||
						(annotation.value instanceof HTMLVideoElement)) {
						ctx.drawImage(annotation.value, pxl.x, pxl.y);
					} else {
						ctx.save();
						ctx.font="bold italic 20px new century schoolbook";
						ctx.globalAlpha = 1;
						ctx.fillStyle = Mx.fg;
						if (annotation.font) {
							ctx.font = annotation.font;
						}
						ctx.fillText(annotation.value, pxl.x, pxl.y);
						ctx.restore();
					}
				}
			},
			
			dispose: function() {
				this.plot = undefined;
				this.annotations = undefined;
			}
	}
	
}( window.sigplot = window.sigplot || {}, mx, m));
