/**
 * @license
 * File: sigplot.boxes.js
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
    var SigplotPlugin = require("./sigplot.plugin");
    var BoxesPlugin = SigplotPlugin.extend({
        options: {
            display: true
        },
        /**
         * @constructor
         * @param options
         * @returns {BoxesPlugin}
         */
        init: function(options) {
            common.update(this.options, options);
            this.boxes = [];
        },
        onAdd: function(plot) {
            this.plot = plot;
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
                    self.boxes = [];
                    self.plot.redraw();
                };
            }(this));
            return {
                text: "Boxes...",
                menu: {
                    title: "BOXES",
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
        add_box: function(box) {
            this.boxes.push(box);
            this.plot.redraw();
            return this.boxes.length;
        },
        clear_boxes: function() {
            this.boxes = [];
            this.plot.redraw();
        },
        refresh: function(canvas) {
            if (!this.options.display) {
                return;
            }
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;
            var ctx = canvas.getContext("2d");
            var box, pxl;
            var x, y, w, h;
            var ul, lr;
            ctx.save();
            ctx.beginPath();
            ctx.rect(Mx.l, Mx.t, Mx.r - Mx.l, Mx.b - Mx.t);
            ctx.clip();
            for (var i = 0; i < this.boxes.length; i++) {
                box = this.boxes[i];
                if (box.absolute_placement === true) {
                    x = box.x + Mx.l;
                    y = box.y + Mx.t;
                    w = box.w;
                    h = box.h;
                } else {
                    ul = mx.real_to_pixel(Mx, box.x, box.y);
                    lr = pxl = mx.real_to_pixel(Mx, box.x + box.w, box.y + box.h);
                    x = ul.x;
                    y = ul.y;
                    w = lr.x - ul.x;
                    h = ul.y - lr.y;
                }
                ctx.strokeStyle = box.strokeStyle || Mx.fg;
                ctx.lineWidth = box.lineWidth || 1;
                if (ctx.lineWidth % 2 === 1) {
                    x += 0.5;
                    y += 0.5;
                }
                if (box.fillStyle || box.fill) {
                    ctx.globalAlpha = box.alpha || 0.5;
                    ctx.fillStyle = box.fillStyle || ctx.strokeStyle;
                    ctx.fillRect(x, y, w, h);
                    ctx.globalAlpha = 1;
                }
                ctx.strokeRect(x, y, w, h);
                if (box.text) {
                    ctx.save();
                    ctx.font = box.font || Mx.text_H + "px Courier New, monospace";
                    ctx.globalAlpha = 1;
                    ctx.textAlign = "end";
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
            this.boxes = [];
        }
    });
    module.exports = BoxesPlugin;
}());