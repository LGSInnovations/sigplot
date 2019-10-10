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
    var plugin = require("./sigplot.plugin");
    /**
     * @constructor
     * @param options
     * @returns {AccordionPlugin}
     */
    class AccordionPlugin extends plugin.Plugin {
        pluginSetup() {
            this.defineProperty("center_line_style", {
                defaultValue: {},
                refreshOnChange: true
            });
            this.defineProperty("edge_line_style", {
                defaultValue: {},
                refreshOnChange: true
            });
            this.defineProperty("fill_style", {
                defaultValue: {},
                refreshOnChange: true
            });
            this.defineProperty("direction", {
                defaultValue: "vertical",
                refreshOnChange: true
            });
            this.defineProperty("mode", {
                defaultValue: "absolute",
                refreshOnChange: true
            });
            this.defineProperty("draw_center_line", {
                defaultValue: true,
                refreshOnChange: true
            });
            this.defineProperty("prevent_drag", {
                defaultValue: false,
                refreshOnChange: true
            });
            this.defineProperty("prevent_move", {
                defaultValue: false,
                refreshOnChange: true
            });
            this.defineProperty("prevent_resize", {
                defaultValue: false,
                refreshOnChange: true
            });
            this.defineProperty("discrete_widths", {
                defaultValue: undefined,
                refreshOnChange: true
            });
            this.defineProperty("min_width", {
                defaultValue: undefined,
                refreshOnChange: true
            });
            this.defineProperty("max_width", {
                defaultValue: undefined,
                refreshOnChange: true
            });
            this.defineProperty("shade_area", {
                defaultValue: undefined,
                refreshOnChange: true
            });
            this.defineProperty("draw_edge_lines", {
                defaultValue: true,
                refreshOnChange: true
            });
            this.defineProperty("draw_center_line", {
                defaultValue: true,
                refreshOnChange: true
            });
            this.defineProperty("center", {
                refreshOnChange: true,
                callback: (value) => {
                    this._onCenterChange(value);
                },
                help: "center of the accordion in plot units (not pixels)"
            });
            this.defineProperty("highlight", {
                refreshOnChange: true,
                help: "highlight the center of the accordion"
            });
            this.defineProperty("edge_highlight", {
                refreshOnChange: true,
                help: "highlight the edges of the accordion"
            });
            this.defineProperty("width", {
                refreshOnChange: true,
                callback: (value) => {
                    this._onWidthChange(value);
                },
                help: "width of the accordion in plot units (not pixels)"
            });
            this.defineProperty("center_location", {
                refreshOnChange: true,
                help: "center of the accordion in pixels"
            });
            this.defineProperty("loc_1", {
                refreshOnChange: true,
                help: "location of one of the accordion bars in pixels"
            });
            this.defineProperty("loc_2", {
                refreshOnChange: true,
                help: "location of one of the accordion bars in pixels"
            });
        }

        pluginInit() {
            this.addListener("mmove", (evt) => {
                this._onMouseMove(evt);
            });
            this.addListener("mdown", (evt) => {
                this._onMouseDown(evt);
            });
            document.addEventListener("mouseup", () => {
                this._onDocMouseUp();
            }, false);
        }

        pluginDispose() {}

        pluginRefresh() {
            if ((this.properties.center === undefined) || (this.properties.width === undefined)) {
                return;
            }
            let Mx = this.Mx;
            let ctx = this.Context;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            let center_pxl;
            if (this.properties.mode === "absolute") {
                center_pxl = mx.real_to_pixel(Mx, this.properties.center, this.properties.center);
            } else if (this.properties.mode === "relative") {
                if (this.properties.direction === "vertical") {
                    let c = Mx.stk[0].x1 + (Mx.stk[0].x2 - Mx.stk[0].x1) * this.properties.center;
                    center_pxl = mx.real_to_pixel(Mx, mx.pixel_to_real(Mx, c, c).x, mx.pixel_to_real(Mx, c, c).y);
                } else if (this.properties.direction === "horizontal") {
                    let c = Mx.stk[0].y1 + (Mx.stk[0].y2 - Mx.stk[0].y1) * this.properties.center;
                    center_pxl = mx.real_to_pixel(Mx, mx.pixel_to_real(Mx, c, c).x, mx.pixel_to_real(Mx, c, c).y);
                }
            }

            let pxl_1, pxl_2;
            if (this.properties.mode === "absolute") {
                pxl_1 = mx.real_to_pixel(Mx, this.properties.center - (this.properties.width / 2), this.properties.center - (this.properties.width / 2));
                pxl_2 = mx.real_to_pixel(Mx, this.properties.center + (this.properties.width / 2), this.properties.center + (this.properties.width / 2));
            } else if (this.properties.mode === 'relative') {
                let w = Mx.stk[0].x2 - Mx.stk[0].x1;
                let h = Mx.stk[0].y2 - Mx.stk[0].y1;
                pxl_1 = {
                    x: center_pxl.x - (this.properties.width * w / 2),
                    y: center_pxl.y - (this.properties.width * h / 2)
                };
                pxl_2 = {
                    x: center_pxl.x + (this.properties.width * w / 2),
                    y: center_pxl.y + (this.properties.width * h / 2)
                };
            }
            if (this.properties.direction === "vertical") {
                this.properties.center_location = center_pxl.x;
                this.properties.loc_1 = Math.max(Mx.l, pxl_1.x);
                this.properties.loc_2 = Math.min(Mx.r, pxl_2.x);
            } else if (this.properties.direction === "horizontal") {
                this.properties.center_location = center_pxl.y;
                this.properties.loc_1 = Math.max(Mx.t, pxl_2.y);
                this.properties.loc_2 = Math.min(Mx.b, pxl_1.y);
            }

            if (this.properties.shade_area && (Math.abs(this.properties.loc_2 - this.properties.loc_1) > 0)) {
                let oldAlpha = ctx.globalAlpha;
                ctx.globalAlpha = (this.properties.fill_style.opacity !== undefined) ? this.properties.fill_style.opacity : 0.4;
                ctx.fillStyle = (this.properties.fill_style.fillStyle !== undefined) ? this.properties.fill_style.fillStyle : Mx.hi;
                if (this.properties.direction === "vertical") {
                    ctx.fillRect(this.properties.loc_1, Mx.t, this.properties.loc_2 - this.properties.loc_1, Mx.b - Mx.t);
                } else if (this.properties.direction === "horizontal") {
                    ctx.fillRect(Mx.l, this.properties.loc_1, Mx.r - Mx.l, this.properties.loc_2 - this.properties.loc_1);
                }
                ctx.globalAlpha = oldAlpha;
            }

            if (this.properties.draw_edge_lines || this.properties.edge_highlight || this.edge_dragging) {
                ctx.lineWidth = (this.properties.edge_line_style.lineWidth !== undefined) ? this.properties.edge_line_style.lineWidth : 1;
                ctx.lineCap = (this.properties.edge_line_style.lineCap !== undefined) ? this.properties.edge_line_style.lineCap : "square";
                ctx.strokeStyle = (this.properties.edge_line_style.strokeStyle !== undefined) ? this.properties.edge_line_style.strokeStyle : Mx.fg;
                if (this.edge_dragging || this.properties.edge_highlight) {
                    ctx.lineWidth = Math.ceil(ctx.lineWidth * 1.2);
                }
                if (this.properties.direction === "vertical") {
                    ctx.beginPath();
                    ctx.moveTo(this.properties.loc_1 + 0.5, Mx.t);
                    ctx.lineTo(this.properties.loc_1 + 0.5, Mx.b);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(this.properties.loc_2 + 0.5, Mx.t);
                    ctx.lineTo(this.properties.loc_2 + 0.5, Mx.b);
                    ctx.stroke();
                } else if (this.properties.direction === "horizontal") {
                    ctx.beginPath();
                    ctx.moveTo(Mx.l, this.properties.loc_1 + 0.5);
                    ctx.lineTo(Mx.r, this.properties.loc_1 + 0.5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(Mx.l, this.properties.loc_2 + 0.5);
                    ctx.lineTo(Mx.r, this.properties.loc_2 + 0.5);
                    ctx.stroke();
                }
            }

            if (this.properties.draw_center_line) {
                ctx.lineWidth = (this.properties.center_line_style.lineWidth !== undefined) ? this.properties.center_line_style.lineWidth : 1;
                ctx.lineCap = (this.properties.center_line_style.lineCap !== undefined) ? this.properties.center_line_style.lineCap : "square";
                ctx.strokeStyle = (this.properties.center_line_style.strokeStyle !== undefined) ? this.properties.center_line_style.strokeStyle : Mx.fg;
                if (this.dragging || this.properties.highlight) {
                    ctx.lineWidth = Math.ceil(ctx.lineWidth * 1.2);
                }
                if (this.properties.direction === "vertical") {
                    ctx.beginPath();
                    ctx.moveTo(this.properties.center_location + 0.5, Mx.t);
                    ctx.lineTo(this.properties.center_location + 0.5, Mx.b);
                    ctx.stroke();
                } else if (this.properties.direction === "horizontal") {
                    ctx.beginPath();
                    ctx.moveTo(Mx.l, this.properties.center_location + 0.5);
                    ctx.lineTo(Mx.r, this.properties.center_location + 0.5);
                    ctx.stroke();
                }
            }
        }

        mimic(acc) {
            if (acc instanceof AccordionPlugin) {
                acc.on("change", (evt) => {
                    this.properties.width = evt.width;
                    this.properties.center = evt.center;
                    this.plot.redraw();
                });
            }
        }

        _onMouseMove(evt) {
            const Mx = this.Mx;

            // Ignore if the slider isn't even visible
            if (this.properties.center_location === undefined) {
                return;
            }
            // Or if the user wants to prevent a drag operation
            if (this.properties.prevent_drag) {
                return;
            }
            // Ignore if the mouse is outside of the plot area
            if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) {
                this.properties.highlight = false;
                return;
            }
            if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) {
                this.properties.highlight = false;
                return;
            }
            // If the mouse is close, "highlight" the line
            let lineWidth = (this.properties.center_line_style.lineWidth !== undefined) ? this.properties.center_line_style.lineWidth : 1;
            let elineWidth = (this.properties.edge_line_style.lineWidth !== undefined) ? this.properties.edge_line_style.lineWidth : 1;
            if (!this.dragging && !this.edge_dragging) {
                if (Mx.warpbox) {
                    return;
                } // Don't highlight if a warpbox is being drawn
                if (this.properties.direction === "vertical") {
                    if (!this.properties.prevent_move) {
                        if (Math.abs(this.properties.center_location - evt.xpos) < (lineWidth + 5)) {
                            this.properties.highlight = true;
                        } else {
                            this.properties.highlight = false;
                        }
                    }
                    if (!this.properties.prevent_resize) {
                        if ((Math.abs(this.properties.loc_1 - evt.xpos) < (elineWidth + 5)) || (Math.abs(this.properties.loc_2 - evt.xpos) < (elineWidth + 5))) {
                            this.properties.edge_highlight = true;
                        } else {
                            this.properties.edge_highlight = false;
                        }
                    }
                } else if (this.properties.direction === "horizontal") {
                    if (!this.properties.prevent_move) {
                        if (Math.abs(this.properties.center_location - evt.ypos) < (lineWidth + 5)) {
                            this.properties.highlight = true;
                        } else {
                            this.properties.highlight = false;
                        }
                    }
                    if (!this.properties.prevent_resize) {
                        if ((Math.abs(this.properties.loc_1 - evt.ypos) < (elineWidth + 5)) || (Math.abs(this.properties.loc_2 - evt.ypos) < (elineWidth + 5))) {
                            this.properties.edge_highlight = true;
                        } else {
                            this.properties.edge_highlight = false;
                        }
                    }
                }
                return;
            }
            if (this.dragging) {
                // If we are dragging, update the slider location
                var pos = mx.pixel_to_real(Mx, evt.xpos, evt.ypos);
                if (this.properties.direction === "vertical") {
                    this.properties.center_location = evt.xpos;
                    if (this.properties.mode === 'absolute') {
                        this.properties.center = pos.x;
                    } else if (this.properties.mode === 'relative') {
                        this.properties.center = (evt.xpos - Mx.l) / (Mx.r - Mx.l);
                    }
                } else if (this.properties.direction === "horizontal") {
                    this.properties.center_location = evt.ypos;
                    if (this.properties.mode === 'absolute') {
                        this.properties.center = pos.y;
                    } else if (this.properties.mode === 'relative') {
                        this.properties.center = (evt.ypos - Mx.t) / (Mx.b - Mx.t);
                    }
                }
            }
            if (this.edge_dragging) {
                // If we are dragging, update the slider location
                var pos = mx.pixel_to_real(Mx, evt.xpos, evt.ypos);
                if (this.properties.direction === "vertical") {
                    if (this.properties.mode === 'absolute') {
                        this.properties.width = 2 * Math.abs(this.properties.center - pos.x);
                    } else if (this.properties.mode === 'relative') {
                        this.properties.width = (2 * Math.abs(this.properties.center_location - evt.xpos)) / (Mx.r - Mx.l);
                    }
                } else if (this.properties.direction === "horizontal") {
                    if (this.properties.mode === 'absolute') {
                        this.properties.width = 2 * Math.abs(this.properties.center - pos.y);
                    } else if (this.properties.mode === 'relative') {
                        this.properties.width = (2 * Math.abs(this.properties.center_location - evt.ypos)) / (Mx.b - Mx.t);
                    }
                }
                // See if the width needs to be constrained
                if (this.properties.discrete_widths) {
                    // If the user wants to restrict the accordion to a set of
                    // discrete widths, find the closest match
                    let nearestIdx = 0;
                    let minDiff = Math.abs(this.properties.width - this.properties.discrete_widths[0]);
                    let tmpDiff = 0;
                    for (let idx = 1; idx < this.properties.discrete_widths.length; idx++) {
                        tmpDiff = Math.abs(this.properties.width - this.properties.discrete_widths[idx]);
                        if (tmpDiff < minDiff) {
                            nearestIdx = idx;
                            minDiff = tmpDiff;
                        }
                    }
                    // Otherwise, apply min_width/max_width if defined
                    if (this.properties.min_width) {
                        this.properties.width = Math.max(this.properties.width, this.properties.min_width);
                    }
                    if (this.properties.max_width) {
                        this.properties.width = Math.min(this.properties.width, this.properties.max_width);
                    }
                }
            }
            // Refresh the plot
            if (this.plot) {
                this.plot.refresh(); // rate limit?
            }
            // Prevent any other plot default action at this point
            evt.preventDefault();
        }

        _onMouseDown(evt) {
            const Mx = this.Mx;

            if (this.properties.center_location === undefined) {
                return;
            }
            if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) {
                return;
            }
            if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) {
                return;
            }
            if (this.properties.prevent_drag) {
                return;
            }
            let lineWidth = (this.properties.center_line_style.lineWidth !== undefined) ? this.properties.center_line_style.lineWidth : 1;
            let elineWidth = (this.properties.edge_line_style.lineWidth !== undefined) ? this.properties.edge_line_style.lineWidth : 1;
            if (this.properties.direction === "vertical") {
                // prefer edge drag over center drag
                if ((Math.abs(this.properties.loc_1 - evt.xpos) < (elineWidth + 5)) || (Math.abs(this.properties.loc_2 - evt.xpos) < (elineWidth + 5))) {
                    this.edge_dragging = !this.properties.prevent_resize;
                    evt.preventDefault();
                } else if (Math.abs(this.properties.center_location - evt.xpos) < (lineWidth + 5)) {
                    this.dragging = !this.properties.prevent_move;
                    evt.preventDefault();
                }
            } else if (this.properties.direction === "horizontal") {
                if ((Math.abs(this.properties.loc_1 - evt.ypos) < (elineWidth + 5)) || (Math.abs(this.properties.loc_2 - evt.ypos) < (elineWidth + 5))) {
                    this.edge_dragging = !this.properties.prevent_resize;
                    evt.preventDefault();
                } else if (Math.abs(this.properties.center_location - evt.ypos) < (lineWidth + 5)) {
                    this.dragging = !this.properties.prevent_move;
                    evt.preventDefault();
                }
            }
        }

        _onDocMouseUp() {
            const Mx = this.Mx;

            // We are no longer dragging
            this.dragging = false;
            this.edge_dragging = false;

            // only emit an event if we are actually dragging
            if (!this.dragging || !this.edge_dragging) {
                return;
            }

            // Issue a slider tag event
            let evt = document.createEvent('Event');
            evt.initEvent('accordiontag', true, true);
            evt.center = this.properties.center;
            evt.width = this.properties.width;
            mx.dispatchEvent(Mx, evt);
            this.emit('change', {
                center: this.properties.center,
                width: this.properties.width
            });
        }

        _onCenterChange(center) {
            if (this.plot) {
                var Mx = this.Mx;
                // Issue a slider tag event
                var evt = document.createEvent('Event');
                evt.initEvent('accordiontag', true, true);
                this.emit('change', {
                    center: this.properties.center,
                    width: this.properties.width
                });
                evt.center = this.properties.center;
                evt.width = this.properties.width;
                mx.dispatchEvent(Mx, evt);
                this.plot.redraw();
            }
        }

        _onWidthChange(width) {
            if (this.plot) {
                var Mx = this.Mx;
                // Issue a slider tag event
                var evt = document.createEvent('Event');
                evt.initEvent('accordiontag', true, true);
                this.emit('change', {
                    center: this.properties.center,
                    width: this.properties.width
                });
                evt.center = this.properties.center;
                evt.width = this.properties.width;
                mx.dispatchEvent(Mx, evt);
                this.plot.redraw();
            }
        }

        /**
         * @deprecated use .center(value)
         */
        set_center(width) {
            this.center(width);
        }

        /**
         * @deprecated use .width(value)
         */
        set_width(width) {
            this.width(width);
        }

        /**
         * @deprecated use .highlight(value) instead
         */
        set_highlight(ishighlight) {
            this.highlight(ishighlight);
        }

        /**
         * @deprecated use .edge_highlight(value) instead
         */
        set_edge_highlight(ishighlight) {
            this.edge_highlight(ishighlight);
        }

        /**
         * @deprecated use .display(value)
         */
        set_visible(isVisible) {
            this.display(false);
        }

        /**
         * @deprecated use .mode(value)
         */
        set_mode(mode) {
            this.mode(mode);
        }

        /**
         * @deprecated use .center()
         */
        get_center() { // In real units
            return this.properties.center();
        }

        /**
         * @deprecated use .width()
         */
        get_width() { // Pixels
            return this.properties.width();
        }
    }

    module.exports = AccordionPlugin;
}());
