/**
 * @license
 * File: sigplot.slider.js
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
	 * @returns {sigplot.SliderPlugin}
	 */
	sigplot.SliderPlugin = function(options) {
		this.options = (options !== undefined) ? options : {};
		
		if (this.options.display === undefined)  this.options.display = true;
		
		if (this.options.style === undefined) this.options.style = {};
		
		if (this.options.direction === undefined) this.options.direction = "vertical";
		
		this.position = undefined;
		this.location = undefined;
	};
	
	sigplot.SliderPlugin.prototype = {
			init: function(plot) {
				this.plot = plot;
				var Mx = plot._Mx;
				
				// Register for mouse events
				var self = this;
				this.onmousemove = function(evt) {
					// Ignore if the slider isn't even visible
					if (self.location === undefined) return;
					
					// Or if the user wants to prevent a drag operation
					if (self.options.prevent_drag) return;
					
					// Ignore if the mouse is outside of the plot area
					if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) { self.set_highlight(false); return; }
					if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) { self.set_highlight(false); return; }
					
					// If the mouse is close, "highlight" the line
					
					var lineWidth = (self.options.style.lineWidth !== undefined) ? self.options.style.lineWidth : 1;
					
					// If we aren't dragging, then there is nothing else to do
					if (!self.dragging) {
						if (Mx.warpbox) { return; } // Don't highlight if a warpbox is being drawn
						if (self.options.direction === "vertical") {
							if (Math.abs(self.location - evt.xpos) < (lineWidth + 5)) {
								self.set_highlight(true);
							} else {
								self.set_highlight(false);
							}
						} else if (self.options.direction === "horizontal") {
							if (Math.abs(self.location - evt.ypos) < (lineWidth + 5)) {
								self.set_highlight(true);
							} else {
								self.set_highlight(false);
							}
						}
						return;
					}
					
					// If we are dragging, update the slider location
					var pos = mx.pixel_to_real(Mx,  evt.xpos, evt.ypos);
					if (self.options.direction === "vertical") {
						self.location = evt.xpos;
						self.position = pos.x;
					} else if (self.options.direction === "horizontal") {
						self.location = evt.ypos;
						self.location = pos.y;
					}
					
					// Refresh the plugin
					self.plot.redraw();
					
					// Prevent any other plot default action at this point
					evt.preventDefault();
				};
				this.plot.addListener("mmove", this.onmousemove);
				
				this.onmousedown = function(evt) {
					if (self.location === undefined) return;
					
					// Or if the user wants to prevent a drag operation
					if (self.options.prevent_drag) return;
					
					if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) return;
					if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) return;
					
					var lineWidth = (self.options.style.lineWidth !== undefined) ? self.options.style.lineWidth : 1;
					
					if (self.options.direction === "vertical") {
						if (Math.abs(self.location - evt.xpos) < (lineWidth + 5)) {
							self.dragging = true;
							evt.preventDefault();
						}
					} else if (self.options.direction === "horizontal") {
						if (Math.abs(self.location - evt.ypos) < (lineWidth + 5)) {
							self.dragging = true;
							evt.preventDefault();
						}
					}
				};
				this.plot.addListener("mdown", this.onmousedown);
				
				this.onmouseup = function(evt) {
					// We are no longer dragging
					self.dragging = false;
					
					// Issue a slider tag event
					var evt = document.createEvent('Event');
					evt.initEvent('slidertag', true, true);
					evt.location = self.location;
					evt.position = self.position;
					var canceled = !mx.dispatchEvent(Mx, evt);
					
					// Issue a slider tag event
					var evt = document.createEvent('Event');
					evt.initEvent('sliderdrag', true, true);
					evt.location = self.location;
					evt.position = self.position;
					var canceled = !mx.dispatchEvent(Mx, evt);
				};
				document.addEventListener("mouseup", this.onmouseup, false);
			},
			
			addListener: function (what, callback) {
				var Mx = this.plot._Mx;
				mx.addEventListener(Mx, what, callback, false);
			},
			
			removeListener: function (what, callback) {
				var Mx = this.plot._Mx;
				mx.removeEventListener(Mx, what, callback, false);
			},
			
			set_highlight: function(ishighlight) {
				if (ishighlight != this.highlight) {
					this.highlight = ishighlight;
					this.plot.redraw();
				}
			},
			
			set_position: function(position) {
				if (this.dragging) return;
				if (this.position == position) return;
				
				this.set_highlight(false); // cheat any set position clears the highlight
				
				var Mx = this.plot._Mx;
				this.position = position;
				
				var pxl = mx.real_to_pixel(Mx, this.position, this.position);
				
				if (this.options.direction === "vertical") {
					this.location = pxl.x;
				} else if (this.options.direction === "horizontal") {
					this.location = pxl.y;
				}
				
				// Issue a slider tag event
				var evt = document.createEvent('Event');
				evt.initEvent('slidertag', true, true);
				evt.location = this.location;
				evt.position = this.position;
				var canceled = !mx.dispatchEvent(Mx, evt);
				if (canceled) return;
				
				this.plot.redraw();
			},
			
			set_location: function(location) {
				if (this.dragging) return;
				if (this.location == location) return;
				this.set_highlight(false); // cheat any set location clears the highlight
				
				var Mx = this.plot._Mx;
				this.location = location;
				
				pos = mx.pixel_to_real(Mx, location, location);
				if (this.options.direction === "vertical") {
					this.position = pos.x;
				} else if (this.options.direction === "horizontal") {
					this.location = pos.y;
				}

				// Issue a slider tag event
				var evt = document.createEvent('Event');
				evt.initEvent('slidertag', true, true);
				evt.location = this.location;
				evt.position = this.position;
				var canceled = !mx.dispatchEvent(Mx, evt);
				if (canceled) return;
				
				this.plot.redraw();
			},
			
			get_position: function() { // In real units
				return this.position;
			},
			
			get_location: function() { // Pixels
				return this.location;
			},
			
			refresh: function(canvas) {
				if (!this.options.display) return;
				if (this.position === undefined) return;
				
				var Mx = this.plot._Mx;
				var ctx = canvas.getContext("2d");
				
				ctx.lineWidth = (this.options.style.lineWidth !== undefined) ? this.options.style.lineWidth : 1;
				ctx.lineCap = (this.options.style.lineCap !== undefined) ? this.options.style.lineCap : "square";
				ctx.strokeStyle = (this.options.style.strokeStyle !== undefined) ? this.options.style.strokeStyle : Mx.fg;
				
				if (this.dragging || this.highlight) {
					ctx.lineWidth = Math.ceil(ctx.lineWidth * 1.2); 
				}
				
				var pxl = mx.real_to_pixel(Mx, this.position, this.position);
				if (this.options.direction === "vertical") {
					if ((pxl.x < Mx.l) || (pxl.x > Mx.r)) {
						return;
					}
					this.location = pxl.x;
				} else if (this.options.direction === "horizontal") {
					if ((pxl.y < Mx.t) || (pxl.y > Mx.b)) {
						return;
					}
					this.location = pxl.y;
				}
				
				if (this.options.direction === "vertical") {
					ctx.beginPath();
					ctx.moveTo(this.location+0.5, Mx.t);
					ctx.lineTo(this.location+0.5, Mx.b);
					ctx.stroke();
				} else if (this.options.direction === "horizontal") {
					ctx.beginPath();
					ctx.moveTo(Mx.l, this.location+0.5);
					ctx.lineTo(Mx.r, this.location+0.5);
					ctx.stroke();
				}
			},
			
			dispose: function() {
				this.plot.removeListener("mmove", this.onmousemove);
				document.removeEventListener("mouseup", this.onmouseup, false);
				this.plot = undefined;
				this.position = undefined;
			}
	}
	
}( window.sigplot = window.sigplot || {}, mx, m));
