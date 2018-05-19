/**
 * @license
 * File: sigplot.annotations.js
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
     * @returns {AnnotationPlugin}
     */
    var AnnotationPlugin = function(options) {
        this.options = (options === undefined) ? {} : options;

        if (this.options.display === undefined) {
            this.options.display = true;
        }

        this.options.textBaseline = this.options.textBaseline || "alphabetic";
        this.options.textAlign = this.options.textAlign || "left";

        this.annotations = [];
    };

    AnnotationPlugin.prototype = {
        init: function(plot) {
            var self = this;
            this.plot = plot;
            var Mx = this.plot._Mx;

            this.onmousemove = function(evt) {
                // Ignore if there are no annotations
                if (self.annotations.length === 0) {
                    return;
                }

                // Or if the user wants to prevent hover actions
                if (self.options.prevent_hover) {
                    return;
                }

                // Ignore if the mouse is outside of the plot area, clear the highlights
                if ((evt.xpos < Mx.l) || (evt.xpos > Mx.r)) {
                    self.set_highlight(false);
                    return;
                }
                if ((evt.ypos > Mx.b) || (evt.ypos < Mx.t)) {
                    self.set_highlight(false);
                    return;
                }

                // If the mouse is close to an annotation, highlight it
                var need_refresh = false;
                for (var i = 0; i < self.annotations.length; i++) {
                    var annotation = self.annotations[i];

                    var pxl = {
                        x: undefined,
                        y: undefined
                    };
                    // Perserve the legacy API for now
                    if (annotation.absolute_placement) {
                        pxl.x = annotation.x;
                        pxl.y = annotation.y;
                    }
                    // Provide the new API
                    if (annotation.pxl_x !== undefined) {
                        pxl.x = annotation.pxl_x;
                    }
                    if (annotation.pxl_y !== undefined) {
                        pxl.y = annotation.pxl_y;
                    }
                    var res = mx.real_to_pixel(Mx, annotation.x, annotation.y);
                    if (pxl.x === undefined) {
                        pxl.x = res.x;
                    }

                    if (pxl.y === undefined) {
                        pxl.y = res.y;
                    }

                    var rect_upperleft = {
                        x: pxl.x,
                        y: pxl.y
                    };
                    if ((annotation.value instanceof HTMLImageElement) ||
                        (annotation.value instanceof HTMLCanvasElement) ||
                        ((typeof HTMLVideoElement !== 'undefined') && annotation.value instanceof HTMLVideoElement)) {
                        // For image, pxl.x and pxl.y are center
                        rect_upperleft.x -= annotation.width / 2;
                        rect_upperleft.y -= annotation.height / 2;
                    } else {
                        // For text, pxl.x and pxl.y are lower left corner
                        rect_upperleft.y -= annotation.height;
                    }

                    if (mx.inrect(evt.xpos, evt.ypos, rect_upperleft.x, rect_upperleft.y, annotation.width, annotation.height)) {
                        if (!annotation.highlight) {
                            self.set_highlight(true, [annotation], pxl.x, pxl.y);
                            need_refresh = true;
                        }
                    } else {
                        if (annotation.highlight) {
                            self.set_highlight(false, [annotation]);
                            need_refresh = true;
                        }
                        annotation.selected = undefined;
                    }
                }

                // Refresh the plot
                if (self.plot && need_refresh) {
                    self.plot.refresh(); // todo - add call to refresh only the plugin layer itself
                }
            };
            this.plot.addListener("mmove", this.onmousemove);

            this.onmousedown = function(evt) {
                for (var i = 0; i < self.annotations.length; i++) {
                    // leverage the fact that annotation.highlight is
                    // set when the mouse is over the annotation
                    if (self.annotations[i].highlight) {
                        self.annotations[i].selected = true;
                    }
                }
            };
            this.plot.addListener("mdown", this.onmousedown);

            this.onmouseup = function(evt) {
                for (var i = 0; i < self.annotations.length; i++) {
                    // leverage the fact that annotation.highlight is
                    // set when the mouse is over the annotation
                    if (self.annotations[i].selected) {
                        // Issue a highlight event
                        var evt = document.createEvent('Event');
                        evt.initEvent('annotationclick', true, true);
                        evt.annotation = self.annotations[i];
                        var executeDefault = mx.dispatchEvent(self.plot._Mx, evt);
                        if ((executeDefault) && (self.annotations[i].onclick)) {
                            self.annotations[i].onclick();
                        }
                    }
                    self.annotations[i].selected = undefined;
                }
            };
            document.addEventListener("mouseup", this.onmouseup, false);
        },

        set_highlight: function(state, annotations, x, y) {
            var _annotations = annotations || this.annotations;
            for (var i = 0; i < _annotations.length; i++) {
                // Issue a highlight event
                var evt = document.createEvent('Event');
                evt.initEvent('annotationhighlight', true, true);
                evt.annotation = _annotations[i];
                evt.state = state;
                evt.x = x;
                evt.y = y;
                var executeDefault = mx.dispatchEvent(this.plot._Mx, evt);
                if (executeDefault) {
                    _annotations[i].highlight = state;
                }
            }
        },

        menu: function() {
            var _display_handler = (function(self) {
                return function() {
                    self.options.display = !self.options.display;
                    self.plot.redraw();
                };
            }(this));

            var _clearall_handler = (function(self) {
                return function() {
                    self.annotations = [];
                    self.plot.redraw();
                };
            }(this));

            return {
                text: "Annotations...",
                menu: {
                    title: "ANNOTATIONS",
                    items: [{
                        text: "Display",
                        checked: this.options.display,
                        style: "checkbox",
                        handler: _display_handler
                    }, {
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
            this.annotations = [];

            this.plot.redraw();
        },

        refresh: function(canvas) {
            if (!this.options.display) {
                return;
            }
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;
            var ctx = canvas.getContext("2d");
            var self = this;

            ctx.save();
            // Ensure annotations are clipped at the plot borders
            ctx.beginPath();
            ctx.rect(Mx.l, Mx.t, Mx.r - Mx.l, Mx.b - Mx.t);
            ctx.clip();

            mx.onCanvas(Mx, canvas, function() {

                // iterate backwards so we can remove from the end...in the future
                // if we decide to have annotations auto-remove
                for (var i = self.annotations.length - 1; i >= 0; i--) {
                    var annotation = self.annotations[i];

                    var pxl = {
                        x: undefined,
                        y: undefined
                    };
                    // Perserve the legacy API for now
                    if (annotation.absolute_placement) {
                        pxl.x = annotation.x;
                        pxl.y = annotation.y;
                    }
                    // Provide the new API
                    if (annotation.pxl_x !== undefined) {
                        pxl.x = annotation.pxl_x;
                    }
                    if (annotation.pxl_y !== undefined) {
                        pxl.y = annotation.pxl_y;
                    }
                    var res = mx.real_to_pixel(Mx, annotation.x, annotation.y);
                    if (pxl.x === undefined) {
                        pxl.x = res.x;
                    }

                    if (pxl.y === undefined) {
                        pxl.y = res.y;
                    }

                    if (!mx.inrect(pxl.x, pxl.y, Mx.l, Mx.t, Mx.r - Mx.l, Mx.b - Mx.t)) {
                        // do we want to auto-remove?
                        //self.annotations.splice(i,1);
                        continue;
                    }

                    if ((annotation.value instanceof HTMLImageElement) ||
                        (annotation.value instanceof HTMLCanvasElement) ||
                        ((typeof HTMLVideoElement !== 'undefined') && annotation.value instanceof HTMLVideoElement)) {
                        annotation.width = annotation.value.width;
                        annotation.height = annotation.value.height;
                        ctx.drawImage(annotation.value, pxl.x - (annotation.width / 2), pxl.y - (annotation.height / 2));
                    } else {
                        // Setup the text styles
                        ctx.font = annotation.font || "bold italic 20px new century schoolbook";
                        if (!annotation.highlight) {
                            ctx.fillStyle = annotation.color || Mx.fg;
                        } else {
                            ctx.fillStyle = annotation.highlight_color || Mx.hi;
                        }
                        ctx.globalAlpha = 1;
                        // Measure the text
                        annotation.width = ctx.measureText(annotation.value).width;
                        annotation.height = ctx.measureText("M").width; // approximation of height

                        // Render the text
                        ctx.textBaseline = annotation.textBaseline || self.options.textBaseline;
                        ctx.textAlign = annotation.textAlign || self.options.textAlign;
                        ctx.fillText(annotation.value, pxl.x, pxl.y);
                    }


                    if (annotation.highlight && annotation.popup) {
                        mx.render_message_box(Mx, annotation.popup, pxl.x + 5, pxl.y + 5, annotation.popupTextColor);
                    }
                }

            });

            ctx.restore();
        },

        dispose: function() {
            this.plot = undefined;
            this.annotations = undefined;
        }
    };

    module.exports = AnnotationPlugin;

}());
