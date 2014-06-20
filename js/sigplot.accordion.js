/**
 * @license
 * File: sigplot.accordion.js
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
	 * @returns {sigplot.AccordionPlugin}
	 */
	sigplot.AccordionPlugin = function(options) {
		this.options = (options !== undefined) ? options : {};
		
		if (this.options.display === undefined) { this.options.display = true; }
		
		if (this.options.center_line_style === undefined) { this.options.center_line_style = {}; }
		if (this.options.edge_line_style === undefined) { this.options.edge_line_style = {}; }
		if (this.options.fill_style === undefined) { this.options.fill_style = {}; }
		
		if (this.options.direction === undefined) { this.options.direction = "vertical"; }
		
		this.center = undefined; // In real units
		this.width = undefined;  // In real units
		
		this.center_location = undefined; // In pixels
		this.loc_1 = undefined; // In pixels
		this.loc_2 = undefined;
	};
	
	sigplot.AccordionPlugin.prototype = {
			init: function(plot) {
				this.plot = plot;
				var Mx = this.plot._Mx;
				
				var self = this;
				this.onmousemove = function(evt) {
					// Ignore if the slider isn't even visible
					if (self.center_location === undefined) { return; }
					
					// Or if the user wants to prevent a drag operation
					if (self.options.prevent_drag) { return; }
					
					// Ignore if the mouse is outside of the plot area
					if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) { self.set_highlight(false); return; }
					if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) { self.set_highlight(false); return; }
					
					// If the mouse is close, "highlight" the line
					var lineWidth = (self.options.center_line_style.lineWidth !== undefined) ? self.options.center_line_style.lineWidth : 1;
					var elineWidth = (self.options.edge_line_style.lineWidth !== undefined) ? self.options.edge_line_style.lineWidth : 1;
					
					if (!self.dragging && !self.edge_dragging) {
						if (Mx.warpbox) { return; } // Don't highlight if a warpbox is being drawn
						if (self.options.direction === "vertical") {
							if (Math.abs(self.center_location - evt.xpos) < (lineWidth + 5)) {
								self.set_highlight(true);
							} else {
								self.set_highlight(false);
							}
							if ((Math.abs(self.loc_1 - evt.xpos) < (elineWidth + 5)) || (Math.abs(self.loc_2 - evt.xpos) < (elineWidth + 5))) {
								self.set_edge_highlight(true);
							} else {
								self.set_edge_highlight(false);
							}
						} else if (self.options.direction === "horizontal") {
							if (Math.abs(self.center_location - evt.ypos) < (lineWidth + 5)) {
								self.set_highlight(true);
							} else {
								self.set_highlight(false);
							}
							if ((Math.abs(self.loc_1 - evt.ypos) < (elineWidth + 5)) || (Math.abs(self.loc_2 - evt.ypos) < (elineWidth + 5))) {
								self.set_edge_highlight(true);
							} else {
								self.set_edge_highlight(false);
							}
						}
						return;
					}
					
					if (self.dragging) {
						// If we are dragging, update the slider location
						var pos = mx.pixel_to_real(Mx,  evt.xpos, evt.ypos);
						if (self.options.direction === "vertical") {
							self.center_location = evt.xpos;
							self.center = pos.x;
						} else if (self.options.direction === "horizontal") {
							self.center_location = evt.ypos;
							self.center = pos.y;
						}
					}
					
					if (self.edge_dragging) {
						// If we are dragging, update the slider location
						var pos = mx.pixel_to_real(Mx,  evt.xpos, evt.ypos);
						if (self.options.direction === "vertical") {
							self.width = 2*Math.abs(self.center-pos.x);
						} else if (self.options.direction === "horizontal") {
							self.width = 2*Math.abs(self.center-pos.y);
						}
					}
					
					// Refresh the plot
					if (self.plot) {
						self.plot.refresh(); // rate limit?
					}
					
					// Prevent any other plot default action at this point
					evt.preventDefault();
				};
				this.plot.addListener("mmove", this.onmousemove);
				
				this.onmousedown = function(evt) {
					if (self.center_location === undefined) { return; }
					
					if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) { return; }
					if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) { return; }
					
					var lineWidth = (self.options.center_line_style.lineWidth !== undefined) ? self.options.center_line_style.lineWidth : 1;
					var elineWidth = (self.options.edge_line_style.lineWidth !== undefined) ? self.options.edge_line_style.lineWidth : 1;
					
					if (self.options.direction === "vertical") {
						// prefer edge drag over center drag
						if ((Math.abs(self.loc_1 - evt.xpos) < (elineWidth + 5)) || (Math.abs(self.loc_2 - evt.xpos) < (elineWidth + 5))) {
							self.edge_dragging = true;
							evt.preventDefault();
						} else if (Math.abs(self.center_location - evt.xpos) < (lineWidth + 5)) {
							self.dragging = true;
							evt.preventDefault();
						} 
					} else if (self.options.direction === "horizontal") {
						if ((Math.abs(self.loc_1 - evt.ypos) < (elineWidth + 5)) || (Math.abs(self.loc_2 - evt.ypos) < (elineWidth + 5))) {
							self.edge_dragging = true;
							evt.preventDefault();
						} else if (Math.abs(self.center_location - evt.ypos) < (lineWidth + 5)) {
							self.dragging = true;
							evt.preventDefault();
						} 
					}
				};
				this.plot.addListener("mdown", this.onmousedown);
				
				this.onmouseup = function(evt) {
					// We are no longer dragging
					self.dragging = false;
					self.edge_dragging = false;
					
					// Issue a slider tag event
					var evt = document.createEvent('Event');
					evt.initEvent('accordiontag', true, true);
					evt.center = self.center;
					evt.width = self.width;
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
				if (ishighlight !== this.highlight) {
					this.highlight = ishighlight;
					this.plot.redraw();
				}
			},
			
			set_edge_highlight: function(ishighlight) {
				if (ishighlight !== this.edge_highlight) {
					this.edge_highlight = ishighlight;
					this.plot.redraw();
				}
			},
			
			set_center: function(center) {
				this.center = center;
				if (this.plot) {
					var Mx = this.plot._Mx;
					
					// Issue a slider tag event
					var evt = document.createEvent('Event');
					evt.initEvent('accordiontag', true, true);
					evt.center = this.center;
					evt.width = this.width;
					var canceled = !mx.dispatchEvent(Mx, evt);
					if (canceled) { return; }

					this.plot.redraw();
				}
			},
			
			set_width: function(width) {
				this.width = width;
				if (this.plot) {
					var Mx = this.plot._Mx;
					
					// Issue a slider tag event
					var evt = document.createEvent('Event');
					evt.initEvent('accordiontag', true, true);
					evt.center = this.center;
					evt.width = this.width;
					var canceled = !mx.dispatchEvent(Mx, evt);
					if (canceled) { return; }
					
					this.plot.redraw();
				}
			},
			
			get_center: function() { // In real units
				return this.center;
			},
			
			get_width: function() { // Pixels
				return this.width;
			},
			
			refresh: function(canvas) {
				if (!this.plot) { return; }
				if (!this.options.display) { return; }
				if ((this.center === undefined) || (this.width === undefined)) { return; }
				
				var Mx = this.plot._Mx;
				var ctx = canvas.getContext("2d");
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				
				var center_pxl = mx.real_to_pixel(Mx, this.center, this.center);
				var pxl_1 = mx.real_to_pixel(Mx, this.center-(this.width/2), this.center-(this.width/2));
				var pxl_2 = mx.real_to_pixel(Mx, this.center+(this.width/2), this.center+(this.width/2));
				
				if (this.options.direction === "vertical") {
					this.center_location = center_pxl.x;
					this.loc_1 = Math.max(Mx.l, pxl_1.x);
					this.loc_2 = Math.min(Mx.r, pxl_2.x);
				} else if (this.options.direction === "horizontal") {
					this.center_location = center_pxl.y;
					this.loc_1 = Math.max(Mx.t, pxl_2.y);
					this.loc_2 = Math.min(Mx.b, pxl_1.y);
				}
				
				if (this.options.shade_area && ((this.loc_2-this.loc_1) > 0)) {
					var oldAlpha = ctx.globalAlpha;
					ctx.globalAlpha = (this.options.fill_style.opacity !== undefined) ? this.options.fill_style.opacity : 0.4;
					ctx.fillStyle = (this.options.fill_style.fillStyle !== undefined) ? this.options.fill_style.fillStyle : Mx.hi;
					
					if (this.options.direction === "vertical") {
						ctx.fillRect(this.loc_1, Mx.t, this.loc_2-this.loc_1, Mx.b-Mx.t);
					} else if (this.options.direction === "horizontal") {
						ctx.fillRect(Mx.l, this.loc_1, Mx.r-Mx.l, this.loc_2-this.loc_1);
					}
					ctx.globalAlpha = oldAlpha;
				}
				
				if (this.options.draw_edge_lines || this.edge_highlight || this.edge_dragging) {
					ctx.lineWidth = (this.options.edge_line_style.lineWidth !== undefined) ? this.options.edge_line_style.lineWidth : 1;
					ctx.lineCap = (this.options.edge_line_style.lineCap !== undefined) ? this.options.edge_line_style.lineCap : "square";
					ctx.strokeStyle = (this.options.edge_line_style.strokeStyle !== undefined) ? this.options.edge_line_style.strokeStyle : Mx.fg;
					
					if (this.edge_dragging || this.edge_highlight) {
						ctx.lineWidth = Math.ceil(ctx.lineWidth * 1.2); 
					}
					
					if (this.options.direction === "vertical") {
						ctx.beginPath();
						ctx.moveTo(this.loc_1+0.5, Mx.t);
						ctx.lineTo(this.loc_1+0.5, Mx.b);
						ctx.stroke();
						ctx.beginPath();
						ctx.moveTo(this.loc_2+0.5, Mx.t);
						ctx.lineTo(this.loc_2+0.5, Mx.b);
						ctx.stroke();
					} else if (this.options.direction === "horizontal") {
						ctx.beginPath();
						ctx.moveTo(Mx.l, this.loc_1+0.5);
						ctx.lineTo(Mx.r, this.loc_1+0.5);
						ctx.stroke();
						ctx.beginPath();
						ctx.moveTo(Mx.l, this.loc_2+0.5);
						ctx.lineTo(Mx.r, this.loc_2+0.5);
						ctx.stroke();
					}
				}
				
				if (this.options.draw_center_line) {
					ctx.lineWidth = (this.options.center_line_style.lineWidth !== undefined) ? this.options.center_line_style.lineWidth : 1;
					ctx.lineCap = (this.options.center_line_style.lineCap !== undefined) ? this.options.center_line_style.lineCap : "square";
					ctx.strokeStyle = (this.options.center_line_style.strokeStyle !== undefined) ? this.options.center_line_style.strokeStyle : Mx.fg;
					
					if (this.dragging || this.highlight) {
						ctx.lineWidth = Math.ceil(ctx.lineWidth * 1.2); 
					}
					
					if (this.options.direction === "vertical") {
						ctx.beginPath();
						ctx.moveTo(this.center_location+0.5, Mx.t);
						ctx.lineTo(this.center_location+0.5, Mx.b);
						ctx.stroke();
					} else if (this.options.direction === "horizontal") {
						ctx.beginPath();
						ctx.moveTo(Mx.l, this.center_location+0.5);
						ctx.lineTo(Mx.r, this.center_location+0.5);
						ctx.stroke();
					}
				}
				
				
			},
			
			dispose: function() {
				this.plot = undefined;
				this.center = undefined;
				this.center_location = undefined;
				this.width = undefined;
			}
	};
	
}( window.sigplot = window.sigplot || {}, mx, m));
