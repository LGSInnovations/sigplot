/**
 * @license
 * File: sigplot.playback.js
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
    var common = require("./common");

    /**
     * @constructor
     * @param options
     * @returns {PlaybackControlsPlugin}
     */
    var PlaybackControlsPlugin = function(options) {
        this.options = {
            display: true,
            size: 25,
            lineWidth: 2,
            fillStyle: false //,
                /*strokeStyle: "#FFFFFF"*/
        };
        common.update(this.options, options);
        this.state = "paused";
        this.highlight = false;
    };

    PlaybackControlsPlugin.prototype = {
        init: function(plot) {
            this.plot = plot;

            // Register for mouse events
            var self = this;
            var Mx = this.plot._Mx;
            this.onmousemove = function(evt) {
                if (Mx.warpbox) {
                    return;
                } // Don't highlight if a warpbox is being drawn

                // Ignore if the mouse is outside of the control area
                if (self.ismouseover(evt.xpos, evt.ypos)) {
                    self.set_highlight(true);
                } else {
                    self.set_highlight(false);
                }
            };
            this.plot.addListener("mmove", this.onmousemove);

            this.onmousedown = function(evt) {
                if (Mx.warpbox) {
                    return;
                } // Don't handle if a warpbox is being drawn

                // Ignore if the mouse is outside of the control area
                if (self.ismouseover(evt.xpos, evt.ypos)) {
                    evt.preventDefault();
                }
            };
            // Prevents zooms and stuff from occuring
            this.plot.addListener("mdown", this.onmousedown);

            this.onmouseclick = function(evt) {
                if (Mx.warpbox) {
                    return;
                } // Don't handle if a warpbox is being drawn

                // Ignore if the mouse is outside of the control area
                if (self.ismouseover(evt.xpos, evt.ypos)) {
                    self.toggle();
                    evt.preventDefault();
                }
            };
            this.plot.addListener("mclick", this.onmouseclick);
        },

        set_highlight: function(ishighlight) {
            if (ishighlight !== this.highlight) {
                this.highlight = ishighlight;
                this.plot.redraw();
            }
        },

        toggle: function(new_state) {
            if (!new_state) {
                if (this.state === "paused") {
                    new_state = "playing";
                } else {
                    new_state = "paused";
                }
            }

            if (new_state !== this.state) {
                if (this.plot) {
                    var Mx = this.plot._Mx;
                    var evt = document.createEvent('Event');
                    evt.initEvent('playbackevt', true, true);
                    evt.state = new_state;
                    var executeDefault = mx.dispatchEvent(Mx, evt);
                    if (executeDefault) {
                        this.state = new_state;
                    }
                    this.plot.redraw();
                }
            }
        },

        addListener: function(what, callback) {
            var Mx = this.plot._Mx;
            mx.addEventListener(Mx, what, callback, false);
        },

        removeListener: function(what, callback) {
            var Mx = this.plot._Mx;
            mx.removeEventListener(Mx, what, callback, false);
        },

        ismouseover: function(xpos, ypos) {
            var position = this.position();
            var distance_from_ctr = Math.pow(xpos - position.x, 2) + Math.pow(ypos - position.y, 2);
            var R = this.options.size / 2;

            return (distance_from_ctr < Math.pow(R, 2));
        },

        position: function() {
            if (this.options.position) {
                return this.options.position;
            } else if (this.plot) {
                var Mx = this.plot._Mx;
                var R = this.options.size / 2;
                return {
                    x: Mx.l + R + this.options.lineWidth + 1,
                    y: Mx.t + R + this.options.lineWidth + 1
                };
            } else {
                return {
                    x: null,
                    y: null
                };
            }
        },

        refresh: function(canvas) {
            if (!this.options.display) {
                return;
            }
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            var ctx = canvas.getContext("2d");

            ctx.lineWidth = this.options.lineWidth;
            var R = this.options.size / 2;

            if (this.highlight) {
                ctx.lineWidth += 2;
                R += 1;
            }

            var position = this.position();


            ctx.beginPath();
            ctx.arc(position.x, position.y, R - ctx.lineWidth, 0, Math.PI * 2, true);
            ctx.closePath();

            ctx.strokeStyle = this.options.strokeStyle || Mx.fg;
            ctx.stroke();

            if (this.options.fillStyle) {
                ctx.fillStyle = this.options.fillStyle;
                ctx.fill();
            }

            if (this.state === "paused") {
                var p1 = {
                    x: R * 0.8,
                    y: R * 0.56
                };
                var p2 = {
                    x: R * 1.45,
                    y: R
                };
                var p3 = {
                    x: R * 0.8,
                    y: R * 1.45
                };

                p1.x += (position.x - R);
                p2.x += (position.x - R);
                p3.x += (position.x - R);
                p1.y += (position.y - R);
                p2.y += (position.y - R);
                p3.y += (position.y - R);

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();

                ctx.fillStyle = this.options.strokeStyle || Mx.fg;
                ctx.fill();
            } else {
                ctx.lineCap = 'round';
                ctx.lineWidth = Math.floor(Math.min(1, this.options.size / 8));

                var p1 = {
                    x: R * 0.8,
                    y: R / 2
                };
                var p2 = {
                    x: R * 0.8,
                    y: R * 1.5
                };
                p1.x += (position.x - R);
                p2.x += (position.x - R);
                p1.y += (position.y - R);
                p2.y += (position.y - R);

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.closePath();
                ctx.stroke();

                var p1 = {
                    x: R + (R / 5),
                    y: R / 2
                };
                var p2 = {
                    x: R + (R / 5),
                    y: R * 1.5
                };
                p1.x += (position.x - R);
                p2.x += (position.x - R);
                p1.y += (position.y - R);
                p2.y += (position.y - R);

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.closePath();
                ctx.stroke();
            }

            ctx.restore();
        },

        dispose: function() {
            this.plot = undefined;
            this.boxes = undefined;
        }
    };

    module.exports = PlaybackControlsPlugin;

}());
