/**
 * @license
 * File: sigplot.slider.js
 * Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.
 *
 * This file is part of SigPlot.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/* global mx */
/* global m */
(function(sigplot, mx, m, undefined) {

    /**
     * @constructor
     * @param options
     * @returns {sigplot.SliderPlugin}
     */
    sigplot.SliderPlugin = function(options) {
        this.options = (options !== undefined) ? options : {};

        if (this.options.display === undefined) {
            this.options.display = true;
        }

        if (this.options.style === undefined) {
            this.options.style = {};
        }

        if (this.options.direction === undefined) {
            this.options.direction = "vertical";
        }

        this.position = undefined;
        this.location = undefined;
        this.paired_slider = undefined;
    };

    sigplot.SliderPlugin.prototype = {
        init: function(plot) {
            this.plot = plot;
            var Mx = plot._Mx;

            // Register for mouse events
            var self = this;
            this.onmousemove = function(evt) {
                // Ignore if the slider isn't even visible
                if (self.location === undefined) {
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

                var lineWidth = (self.options.style.lineWidth !== undefined) ? self.options.style.lineWidth : 1;

                // If we aren't dragging, then there is nothing else to do
                if (!self.dragging) {
                    if (Mx.warpbox) {
                        return;
                    } // Don't highlight if a warpbox is being drawn
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
                    } else if (self.options.direction === "both") {
                        if (Math.abs(self.location.x - evt.xpos) < (lineWidth + 5) &&
                            Math.abs(self.location.y - evt.ypos) < (lineWidth + 5)) {
                            self.set_highlight(true);
                        } else {
                            self.set_highlight(false);
                        }
                    }
                    return;
                }

                // If we are dragging, update the slider location
                var pos = mx.pixel_to_real(Mx, evt.xpos, evt.ypos);
                if (self.options.direction === "vertical") {
                    self.location = evt.xpos;
                    self.position = pos.x;
                } else if (self.options.direction === "horizontal") {
                    self.location = evt.ypos;
                    self.position = pos.y;
                } else if (self.options.direction === "both") {
                    self.location.x = evt.xpos;
                    self.position.x = pos.x;
                    self.location.y = evt.ypos;
                    self.position.y = pos.y;
                }

                // Refresh the plugin
                self.plot.redraw();

                // Prevent any other plot default action at this point
                evt.preventDefault();
            };
            this.plot.addListener("mmove", this.onmousemove);

            this.onmousedown = function(evt) {
                if (self.location === undefined) {
                    return;
                }

                // Or if the user wants to prevent a drag operation
                if (self.options.prevent_drag) {
                    return;
                }

                if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) {
                    return;
                }
                if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) {
                    return;
                }

                if (evt.slider_drag) {
                    return;
                }

                var lineWidth = (self.options.style.lineWidth !== undefined) ? self.options.style.lineWidth : 1;

                // TODO if multiple sliders are on the same position
                // they will become stuck together and cannot be separated
                if (self.options.direction === "vertical") {
                    if (Math.abs(self.location - evt.xpos) < (lineWidth + 5)) {
                        self.dragging = true;
                        evt.slider_drag = true;
                        evt.preventDefault();
                    }
                } else if (self.options.direction === "horizontal") {
                    if (Math.abs(self.location - evt.ypos) < (lineWidth + 5)) {
                        self.dragging = true;
                        evt.slider_drag = true;
                        evt.preventDefault();
                    }
                } else if (self.options.direction === "both") {
                    if (Math.abs(self.location.x - evt.xpos) < (lineWidth + 5) &&
                        Math.abs(self.location.y - evt.ypos) < (lineWidth + 5)) {
                        self.dragging = true;
                        evt.slider_drag = true;
                        evt.preventDefault();
                    }
                }
            };
            this.plot.addListener("mdown", this.onmousedown);

            this.onmouseup = function(evt) {
                if (!self.dragging) {
                    return;
                }

                // We are no longer dragging
                self.dragging = false;

                // Issue a slider tag event
                var evt = document.createEvent('Event');
                evt.source = self;
                evt.initEvent('slidertag', true, true);

                if (self.options.direction === "both") {
                    evt.location = self.location ? JSON.parse(JSON.stringify(self.location)) : undefined;
                    evt.position = self.position ? JSON.parse(JSON.stringify(self.position)) : undefined;
                } else {
                    evt.location = self.location;
                    evt.position = self.position;
                }

                mx.dispatchEvent(Mx, evt);

                // Issue a slider tag event
                var evt = document.createEvent('Event');
                evt.initEvent('sliderdrag', true, true);
                if (self.options.direction === "both") {
                    evt.location = self.location ? JSON.parse(JSON.stringify(self.location)) : undefined;
                    evt.position = self.position ? JSON.parse(JSON.stringify(self.position)) : undefined;
                } else {
                    evt.location = self.location;
                    evt.position = self.position;
                }

                mx.dispatchEvent(Mx, evt);
            };
            document.addEventListener("mouseup", this.onmouseup, false);
        },

        addListener: function(what, callback) {
            var Mx = this.plot._Mx;
            var self = this;
            var wrapped_cb = function(evt) {
                if (evt.source === self) {
                    return callback(evt);
                }
            };
            mx.addEventListener(Mx, what, wrapped_cb, false);
        },

        removeListener: function(what, callback) {
            var Mx = this.plot._Mx;
            mx.removeEventListener(Mx, what, callback, false);
        },

        pair: function(other_slider) {
            if (!other_slider) {
                this.paired_slider = null;
                return;
            }

            if (other_slider.direction !== this.direction) {
                throw "paired sliders must use the same direction setting";
            }
            this.paired_slider = other_slider;
        },

        set_highlight: function(ishighlight) {
            if (ishighlight !== this.highlight) {
                this.highlight = ishighlight;
                this.plot.redraw();
            }
        },

        set_position: function(position) {
            if (this.dragging) {
                return;
            }
            if (this.options.direction === "both") { // Object comparison
                if (this.position !== undefined && this.position.x === position.x && this.position.y === position.y) {
                    return;
                }
            } else {
                if (this.position === position) {
                    return;
                }
            }

            this.set_highlight(false); // cheat any set position clears the highlight

            var Mx = this.plot._Mx;
            if (this.options.direction === "both") {
                this.position = position ? JSON.parse(JSON.stringify(position)) : undefined;
            } else {
                this.position = position;
            }

            var pxl;
            if (this.options.direction === "both") {
                pxl = mx.real_to_pixel(Mx, this.position.x, this.position.y);
            } else {
                pxl = mx.real_to_pixel(Mx, this.position, this.position);
            }

            if (this.options.direction === "vertical") {
                this.location = pxl.x;
            } else if (this.options.direction === "horizontal") {
                this.location = pxl.y;
            } else if (this.options.direction === "both") {
                this.location = {
                    x: pxl.x,
                    y: pxl.y
                };
            }

            // Issue a slider tag event
            var evt = document.createEvent('Event');
            evt.initEvent('slidertag', true, true);
            if (this.options.direction === "both") { // If both, expecting position to be an object
                evt.location = this.location ? JSON.parse(JSON.stringify(this.location)) : undefined;
                evt.position = this.position ? JSON.parse(JSON.stringify(this.position)) : undefined;
            } else { // vertical or horizontal
                evt.location = this.location;
                evt.position = this.position;
            }

            mx.dispatchEvent(Mx, evt);

            this.plot.redraw();
        },

        set_location: function(location) {
            if (this.dragging) {
                return;
            }

            if (this.options.direction === "both") {
                if (this.location !== undefined && this.location.x === location.x && this.location.y === location.y) {
                    return;
                }
            } else {
                if (this.location === location) {
                    return;
                }
            }
            this.set_highlight(false); // cheat any set location clears the highlight

            var Mx = this.plot._Mx;

            if (this.options.direction === "both") {
                this.location = location ? JSON.parse(JSON.stringify(location)) : undefined;
            } else {
                this.location = location;
            }

            var pos;
            if (this.options.direction === "both") {
                pos = mx.pixel_to_real(Mx, location.x, location.y);
            } else {
                pos = mx.pixel_to_real(Mx, location, location);
            }

            if (this.options.direction === "vertical") {
                this.position = pos.x;
            } else if (this.options.direction === "horizontal") {
                this.position = pos.y;
            } else if (this.options.direction === "both") {
                this.position = {
                    x: pos.x,
                    y: pos.y
                };
            }

            // Issue a slider tag event
            var evt = document.createEvent('Event');
            evt.initEvent('slidertag', true, true);

            if (this.options.direction === "both") {
                evt.location = this.location ? JSON.parse(JSON.stringify(this.location)) : undefined;
                evt.position = this.position ? JSON.parse(JSON.stringify(this.position)) : undefined;
            } else {
                evt.location = this.location;
                evt.position = this.position;
            }
            mx.dispatchEvent(Mx, evt);

            this.plot.redraw();
        },

        get_position: function() { // In real units
            return this.position;
        },

        get_location: function() { // Pixels
            return this.location;
        },

        refresh: function(canvas) {
            if (!this.options.display) {
                return;
            }
            if (this.position === undefined) {
                return;
            }

            var Mx = this.plot._Mx;
            var ctx = canvas.getContext("2d");

            ctx.lineWidth = (this.options.style.lineWidth !== undefined) ? this.options.style.lineWidth : 1;
            ctx.lineCap = (this.options.style.lineCap !== undefined) ? this.options.style.lineCap : "square";
            ctx.strokeStyle = (this.options.style.strokeStyle !== undefined) ? this.options.style.strokeStyle : Mx.fg;

            if (this.dragging || this.highlight) {
                ctx.lineWidth = Math.ceil(ctx.lineWidth * 1.2);
            }

            var pxl;
            if (this.options.direction === "both") {
                pxl = mx.real_to_pixel(Mx, this.position.x, this.position.y);
            } else {
                pxl = mx.real_to_pixel(Mx, this.position, this.position);
            }
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
            } else if (this.options.direction === "both") {
                if ((pxl.x < Mx.l) || (pxl.x > Mx.r) ||
                    ((pxl.y < Mx.t) || (pxl.y > Mx.b))) {
                    return;
                }
                this.location.x = pxl.x;
                this.location.y = pxl.y;
            }

            if (this.options.direction === "vertical") {
                ctx.beginPath();
                ctx.moveTo(this.location + 0.5, Mx.t);
                ctx.lineTo(this.location + 0.5, Mx.b);
                ctx.stroke();
            } else if (this.options.direction === "horizontal") {
                ctx.beginPath();
                ctx.moveTo(Mx.l, this.location + 0.5);
                ctx.lineTo(Mx.r, this.location + 0.5);
                ctx.stroke();
            } else if (this.options.direction === "both") {
                // Horizontal portion
                ctx.beginPath();
                ctx.moveTo(Mx.l, this.location.y + 0.5);
                ctx.lineTo(Mx.r, this.location.y + 0.5);
                ctx.closePath();

                // Vertical portion
                ctx.moveTo(this.location.x + 0.5, Mx.t);
                ctx.lineTo(this.location.x + 0.5, Mx.b);
                ctx.stroke();
            }

            // Show extra information while dragging or highlighted
            if (this.dragging || this.highlight) {
                if (this.options.direction === "vertical") {
                    ctx.textBaseline = "alphabetic";
                    ctx.textAlign = "left";
                    ctx.fillStyle = (this.options.style.textStyle !== undefined) ? this.options.style.textStyle : Mx.fg;
                    ctx.font = Mx.font.font;
                    var text = mx.format_g(this.position, 6, 3, true).trim();
                    var text_w = ctx.measureText(text).width;
                    if ((this.location + 5 + text_w) > Mx.r) {
                        ctx.textAlign = "right";
                        ctx.fillText(text, this.location - 5, Mx.t + 10);
                    } else {
                        ctx.fillText(text, this.location + 5, Mx.t + 10);
                    }
                } else if (this.options.direction === "horizontal") {
                    ctx.textBaseline = "alphabetic";
                    ctx.textAlign = "left";
                    ctx.fillStyle = (this.options.style.textStyle !== undefined) ? this.options.style.textStyle : Mx.fg;
                    ctx.font = Mx.font.font;
                    var text = mx.format_g(this.position, 6, 3, true).trim();
                    if ((this.location - Mx.text_h - 5) > Mx.t) {
                        ctx.fillText(text, Mx.l + 10, this.location - 5);
                    } else {
                        ctx.fillText(text, Mx.l + 10, this.location + 5 + Mx.text_h);
                    }
                } else if (this.options.direction === "both") {
                    // TODO
                }

                if (this.paired_slider) {
                    if (this.options.direction === "vertical") {
                        var delta = this.position - this.paired_slider.position;
                        var locdelta = this.location - this.paired_slider.location;

                        var ypos = Mx.t + Math.round((Mx.b - Mx.t) / 2);
                        mx.textline(Mx, this.location, ypos, this.paired_slider.location, ypos, {
                            mode: "dashed",
                            on: 3,
                            off: 3
                        });

                        ctx.textBaseline = "alphabetic";
                        ctx.textAlign = "center";
                        ctx.fillStyle = (this.options.style.textStyle !== undefined) ? this.options.style.textStyle : Mx.fg;
                        ctx.font = Mx.font.font;
                        var text = mx.format_g(delta, 6, 3, true);
                        ctx.fillText(text, this.location - Math.round(locdelta / 2), ypos - 5);

                    } else if (this.options.direction === "horizontal") {
                        var delta = this.position - this.paired_slider.position;
                        var locdelta = this.location - this.paired_slider.location;

                        var xpos = Mx.l + Math.round((Mx.r - Mx.l) / 2);
                        mx.textline(Mx, xpos, this.location, xpos, this.paired_slider.location, {
                            mode: "dashed",
                            on: 3,
                            off: 3
                        });

                        ctx.textBaseline = "alphabetic";
                        ctx.textAlign = "left";
                        ctx.fillStyle = (this.options.style.textStyle !== undefined) ? this.options.style.textStyle : Mx.fg;
                        ctx.font = Mx.font.font;
                        var text = mx.format_g(delta, 6, 3, true);
                        ctx.fillText(text, xpos + 5, this.location - Math.round(locdelta / 2));
                    } else if (this.options.direction === "both") {
                        // TODO
                    }
                }
            }
        },

        dispose: function() {
            this.plot.removeListener("mmove", this.onmousemove);
            document.removeEventListener("mouseup", this.onmouseup, false);
            this.plot = undefined;
            this.position = undefined;
        }
    };

}(window.sigplot = window.sigplot || {}, mx, m));
