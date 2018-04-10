/**
 * @license
 * File: sigplot.accordion.js
 * Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.
 *
 * This file is part of SigPlot.
 *
 * Licensed to the LGS Innovations (LGS) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  LGS licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* global module */
/* global require */
(function() {
    var m = require("./m");
    var mx = require("./mx");
    /**
     * @constructor
     * @param options
     * @returns {AccordionPlugin}
     */
    var AccordionPlugin = function(options) {
        this.options = (options !== undefined) ? options : {};
        if (this.options.display === undefined) {
            this.options.display = true;
        }
        if (this.options.center_line_style === undefined) {
            this.options.center_line_style = {};
        }
        if (this.options.edge_line_style === undefined) {
            this.options.edge_line_style = {};
        }
        if (this.options.fill_style === undefined) {
            this.options.fill_style = {};
        }
        if (this.options.direction === undefined) {
            this.options.direction = "vertical";
        }
        /**
         * In absolute mode, center and width are expressed in
         * real wold coordinates. In relative mode, center and width
         * are expressed as percentages (0 to 1.0) of the width or
         * height of the plot at the current zoom level
         */
        if (this.options.mode === undefined) {
            this.options.mode = "absolute";
        }
        this.center = undefined; // In real units
        this.width = undefined; // In real units
        this.center_location = undefined; // In pixels
        this.loc_1 = undefined; // In pixels
        this.loc_2 = undefined;
        this.visible = true;
    };
    AccordionPlugin.prototype = {
        init: function(plot) {
            this.plot = plot;
            var Mx = this.plot._Mx;
            var self = this;
            this.onmousemove = function(evt) {
                // Ignore if the slider isn't even visible
                if (self.center_location === undefined) {
                    return;
                }
                // Or if the user wants to prevent a drag operation
                if (self.options.prevent_drag) {
                    return;
                }
                // Ignore if the mouse is outside of the plot area
                if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) {
                    self.set_highlight(false);
                    return;
                }
                if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) {
                    self.set_highlight(false);
                    return;
                }
                // If the mouse is close, "highlight" the line
                var lineWidth = (self.options.center_line_style.lineWidth !== undefined) ? self.options.center_line_style.lineWidth : 1;
                var elineWidth = (self.options.edge_line_style.lineWidth !== undefined) ? self.options.edge_line_style.lineWidth : 1;
                if (!self.dragging && !self.edge_dragging) {
                    if (Mx.warpbox) {
                        return;
                    } // Don't highlight if a warpbox is being drawn
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
                    var pos = mx.pixel_to_real(Mx, evt.xpos, evt.ypos);
                    if (self.options.direction === "vertical") {
                        self.center_location = evt.xpos;
                        if (self.options.mode === 'absolute') {
                            self.center = pos.x;
                        } else if (self.options.mode === 'relative') {
                            self.center = (evt.xpos - Mx.l) / (Mx.r - Mx.l);
                        }
                    } else if (self.options.direction === "horizontal") {
                        self.center_location = evt.ypos;
                        if (self.options.mode === 'absolute') {
                            self.center = pos.y;
                        } else if (self.options.mode === 'relative') {
                            self.center = (evt.ypos - Mx.t) / (Mx.b - Mx.t);
                        }
                    }
                }
                if (self.edge_dragging) {
                    // If we are dragging, update the slider location
                    var pos = mx.pixel_to_real(Mx, evt.xpos, evt.ypos);
                    if (self.options.direction === "vertical") {
                        if (self.options.mode === 'absolute') {
                            self.width = 2 * Math.abs(self.center - pos.x);
                        } else if (self.options.mode === 'relative') {
                            self.width = (2 * Math.abs(self.center_location - evt.xpos)) / (Mx.r - Mx.l);
                        }
                    } else if (self.options.direction === "horizontal") {
                        if (self.options.mode === 'absolute') {
                            self.width = 2 * Math.abs(self.center - pos.y);
                        } else if (self.options.mode === 'relative') {
                            self.width = (2 * Math.abs(self.center_location - evt.ypos)) / (Mx.b - Mx.t);
                        }
                    }
                    // See if the width needs to be constrained
                    if (self.options.discrete_widths) {
                        // If the user wants to restrict the accordion to a set of
                        // discrete widths, find the closest match
                        var nearestIdx = 0;
                        var minDiff = Math.abs(self.width - self.options.discrete_widths[0]);
                        var tmpDiff = 0;
                        for (var idx = 1; idx < self.options.discrete_widths.length; idx++) {
                            tmpDiff = Math.abs(self.width - self.options.discrete_widths[idx]);
                            if (tmpDiff < minDiff) {
                                nearestIdx = idx;
                                minDiff = tmpDiff;
                            }
                        }
                        self.width = self.options.discrete_widths[nearestIdx];
                    } else {
                        // Otherwise, apply min_width/max_width if defined
                        if (self.options.min_width) {
                            self.width = Math.max(self.width, self.options.min_width);
                        }
                        if (self.options.max_width) {
                            self.width = Math.min(self.width, self.options.max_width);
                        }
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
                if (self.center_location === undefined) {
                    return;
                }
                if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) {
                    return;
                }
                if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) {
                    return;
                }
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
                mx.dispatchEvent(Mx, evt);
                self.emit('change', {
                    center: self.center,
                    width: self.width
                });
            };
            document.addEventListener("mouseup", this.onmouseup, false);
        },
        addListener: function(what, callback) {
            var Mx = this.plot._Mx;
            mx.addEventListener(Mx, what, callback, false);
        },
        removeListener: function(what, callback) {
            var Mx = this.plot._Mx;
            mx.removeEventListener(Mx, what, callback, false);
        },
        on: function(type, fn, context) {
            if (!this._events) {
                this._events = {};
            }
            if (!this._events[type]) {
                this._events[type] = [];
            }
            if (context === this) {
                // Less memory footprint.
                context = undefined;
            }
            this._events[type].push({
                cb: fn,
                ctx: context
            });
        },
        emit: function(type, data) {
            var event = Object.assign({}, data, {
                type: type,
                target: this
            });
            if (this._events) {
                var listeners = this._events[type];
                if (listeners) {
                    for (var i = 0, len = listeners.length; i < len; i++) {
                        var l = listeners[i];
                        l.cb.call(l.ctx || this, event);
                    }
                }
            }
            return this;
        },
        off: function(type, fn, context) {
            var listeners,
                i,
                len;
            if (!type) {
                // clear all listeners if called without arguments
                delete this._events;
            }
            if (!this._events) {
                return;
            }
            listeners = this._events[type];
            if (!listeners) {
                return;
            }
            if (context === this) {
                context = undefined;
            }
            if (listeners) {
                // find fn and remove it
                for (i = 0, len = listeners.length; i < len; i++) {
                    var l = listeners[i];
                    if (l.ctx !== context) {
                        continue;
                    }
                    if (l.fn === fn) {
                        listeners.splice(i, 1);
                        return;
                    }
                }
            }
            return this;
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
            var self = this;
            this.center = center;
            if (this.plot) {
                var Mx = this.plot._Mx;
                // Issue a slider tag event
                var evt = document.createEvent('Event');
                evt.initEvent('accordiontag', true, true);
                this.emit('change', {
                    center: self.center,
                    width: self.width
                });
                evt.center = this.center;
                evt.width = this.width;
                mx.dispatchEvent(Mx, evt);
                this.plot.redraw();
            }
        },
        mimic: function(acc) {
            var self = this;
            if (acc instanceof AccordionPlugin) {
                acc.on("change", function(evt) {
                    self.width = evt.width;
                    self.center = evt.center;
                    self.plot.redraw();
                });
            }
        },
        set_width: function(width) {
            var self = this;
            this.width = width;
            if (this.plot) {
                var Mx = this.plot._Mx;
                // Issue a slider tag event
                var evt = document.createEvent('Event');
                evt.initEvent('accordiontag', true, true);
                this.emit('change', {
                    center: self.center,
                    width: self.width
                });
                evt.center = this.center;
                evt.width = this.width;
                mx.dispatchEvent(Mx, evt);
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
            if (!this.plot || !this.visible) {
                return;
            }
            if (!this.options.display) {
                return;
            }
            if ((this.center === undefined) || (this.width === undefined)) {
                return;
            }
            var Mx = this.plot._Mx;
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var center_pxl;
            if (this.options.mode === "absolute") {
                center_pxl = mx.real_to_pixel(Mx, this.center, this.center);
            } else if (this.options.mode === "relative") {
                if (this.options.direction === "vertical") {
                    var c = Mx.stk[0].x1 + (Mx.stk[0].x2 - Mx.stk[0].x1) * this.center;
                    center_pxl = mx.real_to_pixel(Mx, mx.pixel_to_real(Mx, c, c).x, mx.pixel_to_real(Mx, c, c).y);
                } else if (this.options.direction === "horizontal") {
                    var c = Mx.stk[0].y1 + (Mx.stk[0].y2 - Mx.stk[0].y1) * this.center;
                    center_pxl = mx.real_to_pixel(Mx, mx.pixel_to_real(Mx, c, c).x, mx.pixel_to_real(Mx, c, c).y);
                }
            }
            var pxl_1, pxl_2;
            if (this.options.mode === "absolute") {
                pxl_1 = mx.real_to_pixel(Mx, this.center - (this.width / 2), this.center - (this.width / 2));
                pxl_2 = mx.real_to_pixel(Mx, this.center + (this.width / 2), this.center + (this.width / 2));
            } else if (this.options.mode === 'relative') {
                var w = Mx.stk[0].x2 - Mx.stk[0].x1;
                var h = Mx.stk[0].y2 - Mx.stk[0].y1;
                pxl_1 = {
                    x: center_pxl.x - (this.width * w / 2),
                    y: center_pxl.y - (this.width * h / 2)
                };
                pxl_2 = {
                    x: center_pxl.x + (this.width * w / 2),
                    y: center_pxl.y + (this.width * h / 2)
                };
            }
            if (this.options.direction === "vertical") {
                this.center_location = center_pxl.x;
                this.loc_1 = Math.max(Mx.l, pxl_1.x);
                this.loc_2 = Math.min(Mx.r, pxl_2.x);
            } else if (this.options.direction === "horizontal") {
                this.center_location = center_pxl.y;
                this.loc_1 = Math.max(Mx.t, pxl_2.y);
                this.loc_2 = Math.min(Mx.b, pxl_1.y);
            }
            if (this.options.shade_area && (Math.abs(this.loc_2 - this.loc_1) > 0)) {
                var oldAlpha = ctx.globalAlpha;
                ctx.globalAlpha = (this.options.fill_style.opacity !== undefined) ? this.options.fill_style.opacity : 0.4;
                ctx.fillStyle = (this.options.fill_style.fillStyle !== undefined) ? this.options.fill_style.fillStyle : Mx.hi;
                if (this.options.direction === "vertical") {
                    ctx.fillRect(this.loc_1, Mx.t, this.loc_2 - this.loc_1, Mx.b - Mx.t);
                } else if (this.options.direction === "horizontal") {
                    ctx.fillRect(Mx.l, this.loc_1, Mx.r - Mx.l, this.loc_2 - this.loc_1);
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
                    ctx.moveTo(this.loc_1 + 0.5, Mx.t);
                    ctx.lineTo(this.loc_1 + 0.5, Mx.b);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(this.loc_2 + 0.5, Mx.t);
                    ctx.lineTo(this.loc_2 + 0.5, Mx.b);
                    ctx.stroke();
                } else if (this.options.direction === "horizontal") {
                    ctx.beginPath();
                    ctx.moveTo(Mx.l, this.loc_1 + 0.5);
                    ctx.lineTo(Mx.r, this.loc_1 + 0.5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(Mx.l, this.loc_2 + 0.5);
                    ctx.lineTo(Mx.r, this.loc_2 + 0.5);
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
                    ctx.moveTo(this.center_location + 0.5, Mx.t);
                    ctx.lineTo(this.center_location + 0.5, Mx.b);
                    ctx.stroke();
                } else if (this.options.direction === "horizontal") {
                    ctx.beginPath();
                    ctx.moveTo(Mx.l, this.center_location + 0.5);
                    ctx.lineTo(Mx.r, this.center_location + 0.5);
                    ctx.stroke();
                }
            }
        },
        set_visible: function(isVisible) {
            this.visible = isVisible;
            this.plot.redraw();
        },
        set_mode: function(mode) {
            this.options.mode = mode;
        },
        dispose: function() {
            this.plot = undefined;
            this.center = undefined;
            this.center_location = undefined;
            this.width = undefined;
        }
    };
    module.exports = AccordionPlugin;
}());
