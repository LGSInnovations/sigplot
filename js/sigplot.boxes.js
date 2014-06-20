/**
 * @license
 * File: sigplot.boxes.js
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

/* global mx */
/* global m */
(function( sigplot, mx, m, undefined ) {
	
	/**
	 * @constructor
	 * @param options
	 * @returns {sigplot.BoxesPlugin}
	 */
	sigplot.BoxesPlugin = function(options) {
		this.options = (options === undefined) ? {} : options;
		
		if (this.options.display === undefined) { this.options.display = true; }
		
		this.boxes = [];
	};
	
	sigplot.BoxesPlugin.prototype = {
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
						self.boxes = [];
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
			
			add_box: function(box) {
				this.boxes.push(box);
				
				this.plot.redraw();
				return this.boxes.length;
			},
			
			refresh: function(canvas) {
				if (!this.options.display) { return; }
				var Gx = this.plot._Gx;
				var Mx = this.plot._Mx;
				
				var ctx = canvas.getContext("2d");
				var box,pxl;
				var x,y,w,h;
				var ul,lr;

				
				ctx.save();
				ctx.beginPath();
				ctx.rect(Mx.l, Mx.t, Mx.r-Mx.l, Mx.b-Mx.t);
				ctx.clip();
				
				for (var i=0; i<this.boxes.length; i++) {
					box = this.boxes[i];
					if (box.absolute_placement === true) {
						x = box.x + Mx.l;
						y = box.y + Mx.t;
						w = box.w;
						h = box.h;
					} else {
						ul = mx.real_to_pixel(Mx, box.x, box.y);
						lr = pxl = mx.real_to_pixel(Mx, box.x + box.w , box.y + box.h);
						x = ul.x;
						y = ul.y;
						w = lr.x - ul.x;
						h = ul.y - lr.y;
					}
					
					ctx.strokeStyle = box.strokeStyle || Mx.fg;
					ctx.lineWidth =  box.lineWidth || 1;
					
					if (ctx.lineWidth % 2 === 1) {
						x += 0.5;
						y += 0.5;
					}
					
					ctx.strokeRect(x,
							       y,
							       w,
							       h);
					
					if (box.text) {
						ctx.save();
						ctx.font= box.font || Mx.text_H + "px Courier New, monospace";
						ctx.globalAlpha = 1;
						ctx.textAlign="end";
						ctx.fillStyle = ctx.strokeStyle;
						if (box.font) {
							ctx.font = box.font;
						}
						
						x = x - Mx.text_w;
						y = y - (Mx.text_h / 3);
						
						var text_w = ctx.measureText(box.text).width;
						
						if ((x - text_w) < Mx.l) {
							x = (x + w);
						}
						
						ctx.fillText(box.text, x, y);
						ctx.restore();
					}
				}
				
				ctx.restore();
			},
			
			dispose: function() {
				this.plot = undefined;
				this.boxes = undefined;
			}
	};
	
}( window.sigplot = window.sigplot || {}, mx, m));
