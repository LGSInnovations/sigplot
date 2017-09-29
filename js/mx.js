/**
 * @license
 * File: mx.js
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

/*jslint nomen: true, browser: true, devel: true*/

//Uses Immediately-invoked Function Expressions (IIFE)s for namespaces
//See http://addyosmani.com/blog/essential-js-namespacing/ for details.

/**
 * This namespace includes generic graphical routines and functions
 * the manipulate a canvas.
 *
 * @namespace
 */

/* global module */
/* global require */
/* global requestAnimFrame */
/* global cancelAnimFrame */

(function() {

    var tinycolor = require("tinycolor2");
    var common = require("./common");
    var CanvasInput = require("./CanvasInput");
    var m = require("./m");

    function mx() {}


    mx.XW_INIT = -3;
    mx.XW_DRAW = 1;
    mx.XW_EVENT = 2;
    mx.XW_UPDATE = 3;
    mx.XW_COMMAND = 5;
    mx.SB_EXPAND = 1;
    mx.SB_SHRINK = 2;
    mx.SB_FULL = 3;
    mx.SB_STEPINC = 4;
    mx.SB_STEPDEC = 5;
    mx.SB_PAGEINC = 6;
    mx.SB_PAGEDEC = 7;
    mx.SB_DRAG = 8;
    mx.SB_WHEELUP = 9;
    mx.SB_WHEELDOWN = 10;

    // Grayscale colors:
    // "15%,15%,10%" - very dark gray
    // "25%,25%,20%" - dark gray
    // "35%,35%,30%" - medium gray
    // "40%,40%,35%" - light medium gray
    // "60%,60%,55%" - light gray
    // "70%,70%,65%" - very light gray
    // "80%,80%,75%" - very very light gray

    mx.L_ArrowLeft = 1001;
    mx.L_ArrowRight = 1002;
    mx.L_ArrowUp = 1003;
    mx.L_ArrowDown = 1004;
    mx.L_dashed = 801;
    mx.GBorder = 3; // TODO Is this a good original value to use...?
    mx.L_RModeOff = 900;
    mx.L_RModeOn = 901;
    mx.L_PixelSymbol = 1;
    mx.L_CircleSymbol = 2;
    mx.L_SquareSymbol = 3;
    mx.L_PlusSymbol = 4;
    mx.L_XSymbol = 5;
    mx.L_TriangleSymbol = 6;
    mx.L_ITriangleSymbol = 7;
    mx.L_HLineSymbol = 8;
    mx.L_VLineSymbol = 9;

    /**
     * Set to True for a retro look that would make hipsters proud
     */
    mx.LEGACY_RENDER = false;

    /**
     * The zoom stack structure object
     * @private
     */
    mx.STKSTRUCT = function() {
        this.xmin = 0.0; // real world val at x1(origin=1,4) or x2(origin=2,4)
        this.xmax = 0.0; // real world val at x2(origin=1,4) or x1(origin=2,4)
        this.ymin = 0.0; // real world val at y2(origin=1,2) or y1(origin=3,4)
        this.ymax = 0.0; // real world val at y1(origin=1,2) or y2(origin=3,4)
        this.xscl = 0.0; // ratio of X real world units to pixel units
        this.yscl = 0.0; // ratio of Y real world units to pixel units
        this.x1 = 0; // left edge relative to window (pixels)
        this.y1 = 0; // top edge relative to window (pixels)
        this.x2 = 0; // right edge relative to window (pixels)
        this.y2 = 0; // bottom edge relative to window (pixels)
    };

    /**
     * The scrollbar structure object used to hold state about scrolling
     * @private
     */
    mx.SCROLLBAR = function() {
        this.flag = null; // int_4 // flag field for MX$SCROLLBAR routine
        this.action = null; // int_4 // returned action performed (XW_EVENT)
        this.smin = null;
        this.srange = null; // real_8 // real_8 // min and range values of scroll
        // bar
        this.tmin = null;
        this.trange = null; // real_8 // real_8 // min and range values of trough
        this.step = null; // real_8 // ratios of smin to move for step
        this.page = null; // real_8 // ratios of smin to move for page
        this.scale = null; // real_8 // ratio to scale by for expand/shrink
        this.dragoutline = null; // bool_4 // FALSE = smooth scroll, TRUE = drag &
        // drop
        this.initial_pause = null; // real_4
        this.repeat_pause = null; // real_4

        this.x = null;
        this.y = null;
        this.w = null;
        this.h = null; // int_2 // These fields are private and are to be
        this.s1 = null;
        this.sw = null;
        this.swmin = null;
        this.soff = null; // int_2 // set through other interfaces
        this.a1 = null;
        this.a2 = null;
        this.arrow = null; // int_2
        this.mxevent = null; // bool_1
        this.origin = null; // int_1
        this.repeat_count = null; // int_4
    };

    /**
     * @method WARPBOX
     * @private
     */
    function WARPBOX() {
        this.xo = 0;
        this.yo = 0;
        this.xl = 0;
        this.yl = 0;
        this.xmin = 0;
        this.xmax = 0;
        this.ymin = 0;
        this.ymax = 0;
        this.func = undefined;
        this.mode = undefined;
    }

    /**
     * Defines 2 canvas layers, canvas and wid_canvas
     * @method MX
     * @param element
     * @private
     */
    function MX(element) { // this is where the canvases are setup/defined
        this.root = element;

        // Create a div to hold all the various canvas layers
        this.parent = document.createElement('div');
        this.parent.style.position = "relative";
        //this.parent.style.height = "100%"; //element.clientHeight;
        //this.parent.style.width = "100%"; //element.clientHeight;
        //this.parent.clientWidth = element.clientWidth;
        this.parent.width = element.clientWidth;
        this.parent.height = element.clientHeight;
        element.appendChild(this.parent);

        // Create the canvas that will hold the plot
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px";
        this.canvas.width = element.clientWidth;
        this.canvas.height = element.clientHeight;

        this.parent.appendChild(this.canvas);
        this.active_canvas = this.canvas;

        // This canvas holds all widgets and reacts to mouse events
        this.wid_canvas = document.createElement('canvas');
        this.wid_canvas.style.position = "absolute";
        this.wid_canvas.style.top = "0px";
        this.wid_canvas.style.left = "0px";
        this.wid_canvas.style.zIndex = 1;
        this.wid_canvas.width = element.clientWidth;
        this.wid_canvas.height = element.clientHeight;

        this.parent.appendChild(this.wid_canvas);

        //if ((this.canvas.height <= 0) || (this.canvas.width <= 0)) {
        //	throw "Plot could not be instantiated correctly; did you specify a size for your placeholder?";
        //}

        this.font = undefined; // the full calculated font string
        this.font_family = "Courier New, monospace"; // default font family
        this.text_w = 0; // text width
        this.text_h = 0; // text height
        this.level = 0; // current zoom level
        this.width = this.parent.width; // width of window
        this.height = this.parent.height; // height of window
        this.xpos = 0; // x-pixel loc of mouse during event
        this.ypos = 0; // y-pixel loc of mouse during event
        this.xmrk = 0.0; // absc coord of mark
        this.ymrk = 0.0;
        this.origin = 1;
        this.stk = [new mx.STKSTRUCT()]; // zoom stack

        mx.setbgfg(this, "black", "white");

        // Custom stuff for the Javascript implementation
        this.event_cb = undefined;
        this.warpbox = undefined;

        // draw_mode flags;
        this.rmode = false;
        this.linewidth = 1;
        this.style = undefined;
        this.xi = false;

        // Button Eventing variables
        this.button_release = 0;
        this.button_press = 0;
        this.state_mask = 0;

        // Specifies display field
        this.l = 0;
        this.r = this.width;
        this.t = 0;
        this.b = this.height;

        // Scrollbar state
        this.scrollbar_x = new mx.SCROLLBAR();
        this.scrollbar_y = new mx.SCROLLBAR();

        // Prompt mode state variable
        this.prompt = undefined;

        // Colormap
        this.pixel = [];

        // Render Canvas
        this._renderCanvas = document.createElement("canvas");
    }

    /* This is used as a helper function for defining highlight ranges/
     */

    function in_fill_range(ele, range_begin, range_end) {
        var left = false;
        var right = false;

        if (ele >= range_begin) {
            left = true;
        }


        if (ele <= range_end) {
            right = true;
        }

        if (left === true && right === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Create Canvas and it's Mx structure and functions
     * @param {element}	element 	Reference to a DOM window element
     */
    /* Step #5*/
    mx.open = function(element) {
        var Mx = new MX(element); /* Step #6*/

        Mx.wid_canvas.oncontextmenu = function(event) {
            event.preventDefault();
            return false;
        };

        this._ctx = Mx.active_canvas.getContext("2d");

        Mx.onmousemove = (function(Mx) {
            return function(e) {
                var rect = e.target.getBoundingClientRect();
                // Screen x/y of mouse
                Mx.x = e.x || e.clientX;
                Mx.y = e.y || e.clientY;
                // Plot relative x/y of mouse
                Mx.xpos = (e.offsetX === undefined) ? (e.pageX - rect.left - window.scrollX) : e.offsetX;
                Mx.ypos = (e.offsetX === undefined) ? (e.pageY - rect.top - window.scrollY) : e.offsetY;

                //				Mx.xpos = (e.offsetX === undefined) ? e.layerX : e.offsetX;
                //				Mx.ypos = (e.offsetY === undefined) ? e.layerY : e.offsetY;

                if (Mx.warpbox) {
                    if ((e.ctrlKey || e.metaKey) && (Mx.warpbox.alt_style !== undefined)) {
                        Mx.warpbox.style = Mx.warpbox.alt_style;
                    } else {
                        Mx.warpbox.style = Mx.warpbox.def_style;
                    }
                    mx.redraw_warpbox(Mx);
                }

                mx.widget_callback(Mx, e);
            };
        })(Mx);

        Mx.onmouseup = (function(Mx) {
            return function(event) {
                if (Mx.warpbox) {
                    mx.onWidgetLayer(Mx, function() {
                        mx.erase_window(Mx);
                    });

                    var old_warpbox = Mx.warpbox;
                    Mx.warpbox = undefined;

                    if (event.which === 1 || event.which === 3) {
                        if (old_warpbox.func) {
                            var xo = old_warpbox.xo;
                            var yo = old_warpbox.yo;
                            var xl = old_warpbox.xl;
                            var yl = old_warpbox.yl;

                            if (old_warpbox.mode === "vertical") {
                                xo = Mx.l;
                                xl = Mx.r;
                            } else if (old_warpbox.mode === "horizontal") {
                                yo = Mx.t;
                                yl = Mx.b;
                            } // else "box"
                            old_warpbox.func(event, xo, yo, xl, yl,
                                old_warpbox.style.return_value,
                                old_warpbox.mode);
                        }
                    }

                }
                mx.widget_callback(Mx, event);
            };
        })(Mx);

        Mx.onmousedown = (function(Mx) {
            return function(event) {
                event.preventDefault();
                mx.widget_callback(Mx, event);
                return false;
            };
        })(Mx);

        Mx.onkeydown = (function(Mx) {
            return function(event) {
                if (Mx.warpbox) {
                    var keyCode = common.getKeyCode(event);
                    if (((keyCode === 17) || // Ctrl
                            (keyCode === 224) || // Mac Command Firefox
                            (keyCode === 91) || // Safari/Chrome Left-command
                            (keyCode === 93)) && // Safari/Chrome Right-command
                        (Mx.warpbox.style !== Mx.warpbox.alt_style)) {
                        Mx.warpbox.style = Mx.warpbox.alt_style;
                        mx.redraw_warpbox(Mx);
                    }
                }

                mx.widget_callback(Mx, event);
            };
        })(Mx);

        Mx.onkeyup = (function(Mx) {
            return function(event) {
                if (Mx.warpbox) {
                    var keyCode = common.getKeyCode(event);
                    if (((keyCode === 17) || // Ctrl
                            (keyCode === 224) || // Mac Command Firefox
                            (keyCode === 91) || // Safari/Chrome Left-command
                            (keyCode === 93)) && // Safari/Chrome Right-command
                        (Mx.warpbox.style !== Mx.warpbox.def_style)) {
                        Mx.warpbox.style = Mx.warpbox.def_style;
                        mx.redraw_warpbox(Mx);
                    }
                }
            };
        })(Mx);

        Mx.ontouchend = (function(Mx) {
            return function(event) {
                Mx.onmouseup({
                    which: 1
                });
            };
        })(Mx);

        Mx.ontouchmove = (function(Mx) {
            return function(event) {
                // Compute the total offset - consider caching offset and only calculating on resize
                var element = Mx.canvas;
                var offsetX = 0;
                var offsetY = 0;
                if (element.offsetParent !== undefined) {
                    do {
                        offsetX += element.offsetLeft;
                        offsetY += element.offsetTop;
                    } while ((element = element.offsetParent));
                }

                Mx.xpos = event.targetTouches[0].pageX - offsetX;
                Mx.ypos = event.targetTouches[0].pageY - offsetY;
                mx.redraw_warpbox(Mx);
            };
        })(Mx);

        mx.enableListeners(Mx);

        return Mx;
    };

    /**
     * @param Mx
     * @private
     */
    mx.enableListeners = function(Mx) {
        mx.addEventListener(Mx, "mousemove", Mx.onmousemove, false);
        window.addEventListener("mouseup", Mx.onmouseup, false);
        mx.addEventListener(Mx, "mousedown", Mx.onmousedown, false);
        window.addEventListener("keydown", Mx.onkeydown, false);
        window.addEventListener("keyup", Mx.onkeyup, false);
        //mx.addEventListener(Mx, "touchend", Mx.ontouchend);
        //mx.addEventListener(Mx, 'touchmove', Mx.ontouchmove, false);

    };

    /**
     * @param Mx
     * @private
     */
    mx.disableListeners = function(Mx) {
        mx.removeEventListener(Mx, "mousemove", Mx.onmousemove, false);
        window.removeEventListener("mouseup", Mx.onmouseup, false);
        mx.removeEventListener(Mx, "mousedown", Mx.onmousedown, false);
        window.removeEventListener("keydown", Mx.onkeydown, false);
        window.removeEventListener("keyup", Mx.onkeyup, false);
        //mx.addEventListener(Mx, "touchend", Mx.ontouchend);
        //mx.addEventListener(Mx, 'touchmove', Mx.ontouchmove, false);
    };

    /**
     * @param Mx
     * @param event
     * @param callback
     * @param useCapture
     * @private
     */
    mx.addEventListener = function(Mx, event, callback, useCapture) {
        return Mx.wid_canvas.addEventListener(event, callback, useCapture);
    };

    /**
     * @param Mx
     * @param event
     * @param callback
     * @param useCapture
     * @private
     */
    mx.removeEventListener = function(Mx, event, callback, useCapture) {
        return Mx.wid_canvas.removeEventListener(event, callback, useCapture);
    };

    /**
     * @param Mx
     * @param event
     * @private
     */
    mx.dispatchEvent = function(Mx, event) {
        return Mx.wid_canvas.dispatchEvent(event);
    };

    /**
     * @param Mx
     * @param func
     * @private
     */
    mx.onWidgetLayer = function(Mx, func) {
        mx.onCanvas(Mx, Mx.wid_canvas, func);
    };

    /**
     * @param Mx
     * @param func
     * @private
     */
    mx.onCanvas = function(Mx, canvas, func) {
        var current_active = Mx.active_canvas;
        Mx.active_canvas = canvas;
        try {
            if (func) {
                return func();
            }
        } finally {
            Mx.active_canvas = current_active;
        }
    };

    /**
     * @param Mx
     * @param func
     * @private
     */
    mx.withWidgetLayer = function(Mx, func) {
        var f = function() {
            mx.onWidgetLayer(Mx, func);
        };
        return f;
    };

    /**
     * @param Mx
     * @param func
     * @private
     */
    mx.render = function(Mx, func) {
        if (!func) {
            return;
        }

        var active_canvas = Mx.active_canvas;

        if (!active_canvas._animationFrameHandle) {
            active_canvas._animationFrameHandle = requestAnimFrame(function() {
                active_canvas._animationFrameHandle = undefined;
                func();
            });
        }
    };

    /**
     * @param Mx
     * @param value
     * @private
     */
    mx.fullscreen = function(Mx, value) {
        if (value === undefined) {
            value = !Mx.fullscreen;
        }
        if (value) {
            Mx.fullscreen = {
                position: Mx.root.style.position,
                height: Mx.root.style.height,
                width: Mx.root.style.width,
                left: Mx.root.style.left,
                top: Mx.root.style.top,
                zIndex: Mx.root.style.zIndex
            };
            Mx.root.style.position = "fixed";
            Mx.root.style.height = "100%";
            Mx.root.style.width = "100%";
            Mx.root.style.left = "0px";
            Mx.root.style.top = "0px";
            Mx.root.style.zIndex = 16777271; // http://www.puidokas.com/max-z-index/
        } else {
            Mx.root.style.position = Mx.fullscreen.position;
            Mx.root.style.height = Mx.fullscreen.height;
            Mx.root.style.width = Mx.fullscreen.width;
            Mx.root.style.left = Mx.fullscreen.left;
            Mx.root.style.top = Mx.fullscreen.top;
            Mx.root.style.zIndex = Mx.fullscreen.zIndex;
            Mx.fullscreen = undefined;
        }
        mx.checkresize(Mx);
    };

    /**
     * @param Mx
     * @private
     */
    mx.checkresize = function(Mx) {
        var canvas = Mx.canvas;
        if ((canvas.height !== Mx.root.clientHeight) || (canvas.width !== Mx.root.clientWidth)) {

            Mx.height = Mx.root.clientHeight;
            Mx.width = Mx.root.clientWidth;

            Mx.canvas.height = Mx.height;
            Mx.canvas.width = Mx.width;
            Mx.wid_canvas.height = Mx.height;
            Mx.wid_canvas.width = Mx.width;

            return true;
        }
        return false;
    };

    /**
     * @param Mx
     * @private
     */
    mx.invertbgfg = function(Mx) {
        mx.setbgfg(Mx, Mx.fg, Mx.bg, !Mx.xi);
    };

    /**
     * @param color1
     * @param color2
     * @param color3
     * @private
     */
    mx.mixcolor = function(color1, color2, perc1to2) {
        var c1 = tinycolor(color1).toRgb();
        var c2 = tinycolor(color2).toRgb();
        var mix = 1.0 - perc1to2;
        c2.r = c1.r * mix + c2.r * perc1to2;
        c2.g = c1.g * mix + c2.g * perc1to2;
        c2.b = c1.b * mix + c2.b * perc1to2;
        return tinycolor(c2).toHexString(true);
    };

    /**
     * @param Mx
     * @param x
     * @param y
     * @param w
     * @param h
     * @param fillStyle
     * @private
     */
    mx.linear_gradient = function(Mx, x, y, w, h, fillStyle) {
        var ctx = Mx.active_canvas.getContext("2d");
        var step_size = 1.0 / fillStyle.length;
        var lingrad = ctx.createLinearGradient(x, y, w, h);
        for (var i = 0; i < fillStyle.length - 1; i++) {
            lingrad.addColorStop(step_size * (i), fillStyle[i]);
        }
        lingrad.addColorStop(1, fillStyle[fillStyle.length - 1]);
        return lingrad;
    };

    /**
     * Set's the background and foreground
     * xwfg : usually used for text on a widget
     * xwbg : background for a widget
     * @param Mx
     * @param bg
     * @param fg
     * @param xi
     * @private
     */
    mx.setbgfg = function(Mx, bg, fg, xi) {
        Mx.bg = tinycolor(bg).toHexString();
        Mx.fg = tinycolor(fg).toHexString();
        Mx.xi = tinycolor(xi).toHexString();

        if ((tinycolor.equals(Mx.bg, "black")) && (tinycolor.equals(Mx.fg, "white"))) { ///mmm
            Mx.xwfg = Mx.fg; // X-Widget Foreground color
            Mx.xwbg = "rgb(35%,35%,30%)"; // X-Widget Background color
            Mx.xwts = "rgb(60%,60%,55%)"; // X-Widget top shadow color
            Mx.xwbs = "rgb(25%,25%,20%)"; // X-Widget bottom shadow color
            Mx.xwms = mx.mixcolor(Mx.xwts, Mx.xwbs, 0.5); // mid shadow
            Mx.xwlo = "rgb(15%,15%,10%)"; // X-Widget top shadow color
            Mx.hi = Mx.xwts; //  Highlight color
        } else if ((tinycolor.equals(Mx.bg, "white")) && (tinycolor.equals(Mx.fg, "black"))) {
            Mx.xwfg = Mx.fg; // X-Widget Foreground color
            Mx.xwbg = "rgb(60%,60%,55%)"; // X-Widget Background color
            Mx.xwts = "rgb(80%,80%,75%)"; // X-Widget top shadow color
            Mx.xwbs = "rgb(40%,40%,35%)"; // X-Widget bottom shadow color
            Mx.xwms = mx.mixcolor(Mx.xwts, Mx.xwbs, 0.5); // mid shadow
            Mx.xwlo = "rgb(70%,70%,65%)";
            Mx.hi = Mx.xwbs; //  Highlight color
        } else {
            var clr = tinycolor(Mx.bg).toRgb();
            var hsp = Math.sqrt( // HSP equation from http://alienryderflex.com/hsp.html
                0.299 * (clr.r * clr.r) +
                0.587 * (clr.g * clr.g) +
                0.114 * (clr.b * clr.b)
            );
            if (hsp > 127.5) { // light
                Mx.xwfg = "black";
                Mx.xwbg = "rgb(60%,60%,55%)"; // X-Widget Background color
                Mx.xwts = "rgb(80%,80%,75%)"; // X-Widget top shadow color
                Mx.xwbs = "rgb(40%,40%,35%)"; // X-Widget bottom shadow color
                Mx.xwms = mx.mixcolor(Mx.xwts, Mx.xwbs, 0.5); // mid shadow
                Mx.xwlo = "rgb(70%,70%,65%)";
                Mx.hi = Mx.xwts;
            } else { // dark
                Mx.xwfg = "white";
                Mx.xwbg = "rgb(35%,35%,30%)"; // X-Widget Background color
                Mx.xwts = "rgb(60%,60%,55%)"; // X-Widget top shadow color
                Mx.xwbs = "rgb(25%,25%,20%)"; // X-Widget bottom shadow color
                Mx.xwms = mx.mixcolor(Mx.xwts, Mx.xwbs, 0.5); // mid shadow
                Mx.xwlo = "rgb(15%,15%,10%)"; // X-Widget top shadow color
                Mx.hi = Mx.xwbs;
            }
        }
    };

    /**
     * @param Mx
     * @param theme
     * @private
     */
    mx.settheme = function(Mx, theme) {
        Mx.bg = theme.bg;
        Mx.fg = theme.fg;
        Mx.xi = theme.xi;
        Mx.xwfg = theme.xwfg;
        Mx.xwbg = theme.xwbg;
        Mx.xwts = theme.xwts;
        Mx.xwbs = theme.xwbs;
        Mx.xwlo = theme.xwlo;
        Mx.hi = theme.hi;
    };

    /**
     * Close graphics windows.
     * @param Mx
     */
    mx.close = function(Mx) {
        var canvas = Mx.wid_canvas;
        canvas.removeEventListener("mousemove", Mx.onmousemove, false);
        //canvas.removeEventListener("touchmove", Mx.ontouchmove);
        canvas.removeEventListener("mouseup", Mx.onmouseup, false);
        //canvas.addEventListener("touchend", Mx.onmouseup);

        if (Mx.parent && Mx.parent.parentNode) {
            Mx.parent.parentNode.removeChild(Mx.parent);
        }
    };

    /**
     * Draws and implements a scrollbar
     * @param Mx
     * @param sb
     * @param xs
     * @param xe
     * @param ys
     * @param ye
     * @param out
     * @param qs
     * @param qe
     * @param mouseEvent
     * @param scrollbarState
     */
    //
    // ~= MX$SCROLLBAR
    //
    mx.scrollbar = function(Mx, sb, xs, xe, ys, ye, out, qs, qe, mouseEvent, scrollbarState) {
        // Param types:
        // mx.SCROLLBAR* sb,
        // int xs, int xe, int ys, int ye,
        // real* ps, real* pe, real qs, real qe

        var mode; // an int
        var action; // an int
        var origin; // an int
        var stat = 0; // an int

        var step; // a real_8
        var page; // a real_8
        var scale; // a real_8
        var sblocal = new mx.SCROLLBAR(); // a SCROLLBAR

        mode = (sb.flag !== undefined ? sb.flag : sb); // REFACTOR - if user sends in a number instead of a scrollbar
        action = Math.abs(mode);

        if (ye - ys > xe - xs) {
            if (Mx.origin < 3) {
                origin = 2; /* inverted Y scrollbar */
            } else {
                origin = 4; /* normal Y scrollbar */
            }
        } else {
            if (Mx.origin & 2) {
                origin = 3; /* inverted X scrollbar */
            } else {
                origin = 1; /* normal X scrollbar */
            }
        }

        if (action < 10) {
            sb = sblocal; /* use local SB structure */
        }
        if (action < 10 || sb.action === 0) { /* re-init the SB structure */
            mx.scroll(Mx, sb, mx.XW_INIT, undefined, scrollbarState);
            sb.flag = mode;
            /* Turn off repeated event handling in mx_scroll */
            sb.initial_pause = -1.0;
            mx.scroll_loc(sb, xs, ys, xe - xs + 1, ye - ys + 1, origin, scrollbarState);
        }
        sb.srange = out.pe - out.ps;

        switch (action) {
            case 0:
                step = page = scale = 1.0;
                break;
            case 1:
            case 11:
                step = page = 0.9 * sb.srange;
                scale = 2.0;
                break;
            case 2:
            case 12:
                step = 0.1 * sb.srange;
                page = 9 * step;
                scale = 2.0;
                break;
            case 3:
            case 13:
                step = 1.0;
                page = sb.srange - 1.0;
                scale = 1.0;
                break;
            default:
                return 0;
        }
        mx.scroll_vals(sb, out.ps, sb.srange, qs, qe - qs, step, page, scale, scrollbarState);

        if (mode === 0) {
            mx.scroll(Mx, sb, mx.XW_DRAW, undefined, undefined); // No need for a mouse event
        } else {
            if (mx.scroll(Mx, sb, mx.XW_EVENT, mouseEvent, scrollbarState)) {
                if (out.ps !== sb.smin) {
                    out.ps = sb.smin;
                    stat += 1;
                }
                if (out.pe !== sb.smin + sb.srange) {
                    out.pe = sb.smin + sb.srange;
                    stat += 2;
                }
            }
        }
        return stat;
    };

    /**
     * Instantiate scrollbar on graphics window
     * @param Mx
     * @param sv
     * @param op
     * @param mouseEvent
     * @param scrollbarState
     */
    //
    // ~= mx_scroll
    //
    mx.scroll = function(Mx, sv, op, mouseEvent, scrollbarState) {
        var btn; // an int
        var smin; // a real_8
        var srange; // a real_8
        var s; // an int_4

        if (sv === undefined) {
            return false; /* an mx.SCROLLBAR */
        }

        switch (op) {
            case mx.XW_INIT:
                mx.scroll_loc(sv, 0, 0, Mx.width, 20, 1, scrollbarState);
                mx.scroll_vals(sv, 0.0, 10.0, 0.0, 100.0, 1.0, 10.0, 1.0, scrollbarState);
                sv.flag = 0;
                sv.action = 0;
                sv.initial_pause = 0.25;
                sv.repeat_pause = 0.05;
                sv.mxevent = true;
                sv.repeat_count = 0;
                break;
            case mx.XW_EVENT:
                /*  Determine which button, if any, was pressed/released
                 */
                btn = 0;
                if (sv.mxevent) { // TODO make sure mxevent is set properly when an event goes off - how is this supposed to be set?
                    btn = (Mx.button_release) ? -Mx.button_release : Mx.button_press;
                } else if (mouseEvent.type === "mousedown" || mouseEvent.type === "mouseup") {
                    // TODO Does this case ever happen?
                    switch (mouseEvent.which) {
                        case 1:
                            btn = 1;
                            break;
                        case 2:
                            btn = 2;
                            break;
                        case 3:
                            btn = 3;
                            break;
                            /* Add these cases for the mouse wheel */
                        case 4:
                            btn = 4;
                            break;
                        case 5:
                            btn = 5;
                            break;
                    }
                    if (mouseEvent.type === "mouseup") {
                        btn = -btn;
                    }
                } else if (mouseEvent.type === "mousewheel" || mouseEvent.type === "DOM-MouseScroll") {
                    // TODO Does this case ever happen?
                    if (mouseEvent.wheelDelta && mouseEvent.wheelDelta > 0) {
                        btn = 4; // TODO is 4 right for negative scroll (aka a scroll forwards away from the user)
                        // TODO Do we need to worry about a release here?
                    } else if (mouseEvent.wheelDelta && mouseEvent.wheelDelta < 0) {
                        btn = 5; // TODO is 5 right for negative scroll (aka a scroll backward towards the user)
                        // TODO Do we need to worry about a release here?
                    }
                }

                if (sv.action === 0) {
                    /*  First-time action -- only interested in button presses
                     *  1 or 2 within our bounds
                     */
                    /* If scroll wheel, pretend we're on vertical scroll bar */
                    if (btn === 4 || btn === 5) {
                        Mx.xpos = sv.x;
                    }


                    /* Button !=1,2,4,5 OR NOT on scroll bar */
                    if ((btn !== 1 && btn !== 2 && btn !== 4 && btn !== 5) ||
                        Mx.xpos < sv.x || Mx.ypos < sv.y ||
                        Mx.xpos > sv.x + sv.w || Mx.ypos > sv.y + sv.h) {
                        return false;
                    }
                } else if (btn < 0) {
                    /* Any button release within a repeated action will make us exit */
                    sv.action = sv.repeat_count = 0; // TODO Update scrollbarState's action?
                    return true;
                }

                /*  Compute s, the offset in pixels from the 'origin' of
                 *  the scrollbar's on-screen region.
                 */
                if (sv.origin & 1) {
                    s = Mx.xpos - sv.x;
                    if (sv.origin & 2) {
                        s = sv.w - s;
                    }
                } else {
                    s = Mx.ypos - sv.y;
                    if (sv.origin <= 2) {
                        s = sv.h - s;
                    }
                }

                /*  Determine action */
                if (sv.action === 0) {
                    /* First-time action */

                    sv.repeat_count = 0; // TODO Is repeat count necessary any more?

                    var scrollReal2PixOut = mx.scroll_real2pix(sv);
                    // UPDATE SCROLLBAR STATE as well
                    sv.s1 = scrollbarState.s1 = scrollReal2PixOut.s1;
                    sv.sw = scrollbarState.sw = scrollReal2PixOut.sw;
                    sv.soff = scrollbarState.soff = s - sv.s1;
                    if (sv.trange === 0.0) {
                        // UPDATE SCROLLBAR STATE as well
                        sv.smin = scrollbarState.smin = sv.tmin;
                        sv.srange = scrollbarState.srange = 0.0;
                    } else switch (btn) {
                        case 1:
                            if (s > sv.a1 && s < sv.a2) { /* on scroll trough */
                                sv.action = (sv.soff > 0) ? mx.SB_PAGEINC : mx.SB_PAGEDEC;
                            } else { /* on arrows */
                                sv.action = (sv.soff > 0) ? mx.SB_STEPINC : mx.SB_STEPDEC;
                            }
                            break;
                        case 4:
                            sv.action = mx.SB_WHEELUP;
                            break;
                        case 5:
                            sv.action = mx.SB_WHEELDOWN;
                            break;
                    }
                } else {
                    /* We're repeating sv.action */
                    switch (sv.action) {
                        case mx.SB_WHEELUP:
                        case mx.SB_WHEELDOWN:
                        case mx.SB_EXPAND:
                            /* we don't want to repeat these */
                        case mx.SB_SHRINK:
                        case mx.SB_FULL:
                            sv.action = sv.repeat_count = 0;
                    }
                }
                /* FALL THROUGH!!! */
                /* jshint -W086 */
            case mx.XW_COMMAND:
                /* jshint +W086 */

                smin = sv.smin;
                srange = sv.srange;

                switch (sv.action) {
                    case mx.SB_STEPINC:
                        smin += sv.step;
                        break;
                    case mx.SB_STEPDEC:
                        smin -= sv.step;
                        break;
                    case mx.SB_PAGEINC:
                        smin += sv.page;
                        break;
                    case mx.SB_PAGEDEC:
                        smin -= sv.page;
                        break;
                    case mx.SB_FULL:
                        smin = sv.tmin;
                        srange = sv.trange;
                        break;
                    case mx.SB_EXPAND:
                        srange = srange * sv.scale;
                        if (smin <= 0 && smin + sv.srange >= 0) {
                            smin *= sv.scale;
                        } else {
                            smin -= (srange - sv.srange) / 2.0;
                        }
                        break;
                    case mx.SB_SHRINK:
                        srange = srange / sv.scale;
                        if (smin < 0 && smin + sv.srange >= 0) {
                            smin += srange / sv.scale; /* Plot crosses axis */
                        } else if (smin === 0 && smin + sv.srange >= 0) {
                            smin = srange / sv.scale; /* Plot touches axis */
                        } else {
                            smin += (sv.srange - srange) / 2.0; /* Plot is completely contained on positive side of axis */
                        }
                        break;
                        /* The mouse wheel needs to scroll 1 page at a time, if you want an
		           application to scroll differently, change sv.page with
		           mx_scroll_vals in the application code */
                    case mx.SB_WHEELUP:
                        smin -= sv.page;
                        break;
                    case mx.SB_WHEELDOWN:
                        smin += sv.page;
                        break;
                }

                if (sv.trange > 0) {
                    smin = Math.max(sv.tmin, Math.min(smin, sv.tmin + sv.trange - srange));
                    srange = Math.min(srange, sv.trange);
                } else {
                    smin = Math.min(sv.tmin, Math.max(smin, sv.tmin + sv.trange - srange));
                    srange = Math.max(srange, sv.trange);
                }

                if (sv.smin === smin && sv.srange === srange) {
                    if (sv.action !== mx.SB_DRAG) {
                        sv.action = sv.repeat_count = 0;
                    }
                } else {
                    // UPDATE SCROLLBAR STATE as well
                    sv.smin = scrollbarState.smin = smin;
                    sv.srange = scrollbarState.srange = srange;
                    sv.repeat_count++;
                }

                if (op === mx.XW_COMMAND) {
                    mx.scroll(Mx, sv, mx.XW_UPDATE, undefined);
                    sv.action = 0;
                }

                break;
            case mx.XW_DRAW:
            case mx.XW_UPDATE:
                mx.redrawScrollbar(sv, Mx, op);

        } /* switch */
        return true;
    };

    /**
     * Specify location and orientation of a scrollbar
     * @param sv
     * @param x
     * @param y
     * @param w
     * @param h
     * @param origin
     * @param scrollbarState
     */
    //
    // ~= mx_scroll_loc
    //
    mx.scroll_loc = function(sv, x, y, w, h, origin, scrollbarState) {
        // UPDATE local scrollbar and SCROLLBAR STATE
        if (sv === undefined) {
            return; /* mx.SCROLLBAR */
        }
        sv.x = scrollbarState.x = x; // int
        sv.y = scrollbarState.y = y; // int
        sv.w = scrollbarState.w = w; // int
        sv.h = scrollbarState.h = h; // int
        sv.origin = scrollbarState.origin = Math.max(1, Math.min(4, origin)); // int

        if (sv.origin & 1) {
            sv.a2 = scrollbarState.a2 = sv.w;
            sv.arrow = scrollbarState.arrow = Math.min(m.trunc((sv.w - m.trunc(2 * mx.GBorder)) / 3), sv.h + mx.GBorder);
        } else {
            sv.a2 = scrollbarState.a2 = sv.h;
            sv.arrow = scrollbarState.arrow = Math.min(m.trunc((sv.h - m.trunc(2 * mx.GBorder)) / 3), sv.w + mx.GBorder);
        }
        sv.a1 = scrollbarState.a1 = sv.arrow + mx.GBorder;
        sv.a2 -= sv.arrow + mx.GBorder;
        scrollbarState.a2 -= sv.arrow + mx.GBorder;
        sv.swmin = scrollbarState.swmin = Math.min(10, sv.a2 - sv.a1);
        sv.s1 = scrollbarState.s1 = 0;
        sv.sw = scrollbarState.sw = 0;
        sv.action = scrollbarState.action = 0;
    };

    /**
     * Set coordinates in scrollbar structure
     * @param sv
     * @param smin
     * @param srange
     * @param tmin
     * @param trange
     * @param step
     * @param page
     * @param scale
     * @param scrollbarState
     */
    //
    // ~= mx_scroll_vals
    //
    mx.scroll_vals = function(sv, smin, srange, tmin, trange, step, page, scale, scrollbarState) {
        // UPDATE SCROLLBAR STATE as well
        if (sv === undefined) {
            return; /* an mx.SCROLLBAR */
        }
        sv.smin = scrollbarState.smin = smin;
        sv.srange = scrollbarState.srange = srange;
        sv.tmin = scrollbarState.tmin = tmin;
        sv.trange = scrollbarState.trange = trange;
        sv.step = scrollbarState.step = step;
        sv.page = scrollbarState.page = page;
        sv.scale = scrollbarState.scale = Math.max(scale, 1.0);
    };

    /**
     * Draw single symbol centered at pixel (x,y)
     * @param Mx
     * @param ic
     * @param x
     * @param y
     * @param symbol
     * @param rr
     */
    //
    // ~= MX$DRAW_SYMBOL
    //
    mx.draw_symbol = function(Mx, ic, x, y, symbol, rr, n) {
        var ctx = Mx.active_canvas.getContext("2d");

        var r = 0; // int
        var d = 0; // int
        var d2 = 0; // int
        var rmode = false; // bool
        var fill = false; // bool
        var tri = []; // XPoint array of size 4
        for (var cnt = 0; cnt < 4; cnt++) { // initializing 4 points in the array
            tri[cnt] = {
                x: 0,
                y: 0
            };
        }

        var c = ''; // char

        fill = rr < 0;
        r = Math.abs(rr);
        d = r * 2;

        // Set the foreground color
        ctx.fillStyle = ic;
        ctx.strokeStyle = ic;

        if (typeof symbol === "function") {
            symbol(ctx, n, x, y);
        } else {
            switch (symbol) {
                case mx.L_CircleSymbol:
                    ctx.beginPath();
                    if (fill) {
                        ctx.arc(x, y, r, 0, 360); // draw arc
                        ctx.fill(); // fill in the area of the arc
                    } else {
                        ctx.arc(x, y, r, 0, 360);
                        ctx.stroke(); // just draw the arc's outline
                    }
                    break;
                case mx.L_SquareSymbol:
                    if (fill) {
                        fill_rectangle(ctx, x - r, y - r, d, d);
                    } else {
                        draw_rectangle(ctx, x - r, y - r, d, d);
                    }
                    break;
                case mx.L_PixelSymbol:
                    d = 1; // d = 2*GMaxLines; // TODO Do we care about a maximum number of lines?
                    // No native way to draw just a pixel - so use a circle instead
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
                    ctx.fill();
                    break;
                case mx.L_ITriangleSymbol:
                    r = -r; // TODO Refactor without switch fall-through?
                    /* jshint -W086 */
                case mx.L_TriangleSymbol:
                    /* jshint +W086 */
                    d = m.trunc(r * 1.5);
                    d2 = m.trunc(r * 0.80);

                    // Coordinates of just the triangle itself
                    tri[1].x = -d2;
                    tri[1].y = d;
                    tri[2].x = d2 * 2;
                    tri[2].y = 0;
                    tri[3].x = -d2;
                    tri[3].y = -d;

                    var tempTri = []; // XPoint array of size 4
                    for (var cnt = 0; cnt < 4; cnt++) { // initializing 4 points in the array
                        tempTri[cnt] = {
                            x: 0,
                            y: 0
                        };
                    }

                    if (fill) {
                        tempTri[0].x = x;
                        tempTri[0].y = y - r;

                        // Replacement for CoordModePrevious offset (updating coordinates to be relative to origin, instead of previous pt)
                        tempTri[1].x = tempTri[0].x + tri[1].x;
                        tempTri[1].y = tempTri[0].y + tri[1].y;
                        tempTri[2].x = tempTri[1].x + tri[2].x;
                        tempTri[2].y = tempTri[1].y + tri[2].y;
                        tempTri[3].x = tempTri[2].x + tri[3].x;
                        tempTri[3].y = tempTri[2].y + tri[3].y;

                        fill_poly(ctx, tempTri);
                    } else {
                        tempTri[0].x = x;
                        tempTri[0].y = y - r;

                        // Replacement for CoordModePrevious offset (updating coordinates to be relative to origin, instead of previous pt)
                        tempTri[1].x = tempTri[0].x + tri[1].x;
                        tempTri[1].y = tempTri[0].y + tri[1].y;
                        tempTri[2].x = tempTri[1].x + tri[2].x;
                        tempTri[2].y = tempTri[1].y + tri[2].y;
                        tempTri[3].x = tempTri[2].x + tri[3].x;
                        tempTri[3].y = tempTri[2].y + tri[3].y;

                        draw_poly(ctx, tempTri);
                    }
                    break;
                case mx.L_PlusSymbol:
                    draw_line(ctx, x, y + r, x, y - r);
                    draw_line(ctx, x + r, y, x - r, y);
                    break;
                case mx.L_HLineSymbol:
                    draw_line(ctx, x + r, y, x - r, y);
                    break;
                case mx.L_VLineSymbol:
                    draw_line(ctx, x, y + r, x, y - r);
                    break;
                case mx.L_XSymbol:
                    draw_line(ctx, x - r, y - r, x + r, y + r);
                    draw_line(ctx, x + r, y - r, x - r, y + r);
                    break;
                default:
                    c = symbol;
                    r = m.trunc(Mx.text_w / 2); //tbd
                    if (fill && !rmode) {
                        ctx.fillText(c.substring(0, 2), x - r, y + r); // TODO Does this cover it? Do we need to also fill in a rectangle behind
                    }
                    break;
            } // end switch (symbol)
        }
    };

    /**
     * Plot symbols at centers defined by an array of pixels
     * @param Mx
     * @param ic
     * @param pixx
     * @param pixy
     * @param npix
     * @param symbol
     * @param rr
     * @private
     */
    //
    // ~= MX$DRAW_SYMBOLS
    //
    mx.draw_symbols = function(Mx, ic, pixx, pixy, npix, symbol, rr, istart) {
        for (var i = 0; i < npix; i++) {
            mx.draw_symbol(Mx, ic, pixx[i], pixy[i], symbol, rr, i + istart);
        }
    };

    /* http://geomalgorithms.com/a01-_area.html
     *   > 0 left
     *   = 0 on
     *   < 0 right
     */
    /**
     * Test if a point is Left|On|Right of an infinite 2D line.
     * @method isLeft
     * @param p_x Point's x-coordinate
     * @param p_y Point's y-coordinate
     * @param e_x1 Lines's x1-coordinate
     * @param e_y1 Lines's y1-coordinate
     * @param e_x2 Lines's x2-coordinate
     * @param e_y2 Lines's y2-coordinate
     * @private
     */
    function isLeft(p_x, p_y, e_x1, e_y1, e_x2, e_y2) {
        return ((e_x1 - p_x) * (e_y2 - p_y) - (e_x2 - p_x) * (e_y1 - p_y));
    }

    /**
     * @method update_winding_number
     * @param wn
     * @param p_x
     * @param p_y
     * @param e_x1
     * @param e_y1
     * @param e_x2
     * @param e_y2
     * @private
     */
    function update_winding_number(wn, p_x, p_y, e_x1, e_y1, e_x2, e_y2) {
        if (e_y1 <= p_y) { // start y <= P.y
            if (e_y2 > p_y) { // an upward crossing
                if (isLeft(p_x, p_y, e_x1, e_y1, e_x2, e_y2) > 0) {
                    wn += 1;
                }
            }
        } else { // start y > P.y (no test needed)
            if (e_y2 <= p_y) { // a downward crossing
                if (isLeft(p_x, p_y, e_x1, e_y1, e_x2, e_y2) < 0) {
                    wn -= 1;
                }
            }
        }
        return wn;
    }

    /**
     * Converts array of (x,y) coordinates to pixel coordinates, plots lines or dots
     * @param Mx
     * @param color
     * @param xpoint
     * @param ypoint
     * @param npts
     * @param skip
     * @param line
     * @param symb
     * @param rad
     * @param options
     */
    //
    // ~= MX$TRACE
    //
    mx.trace = function(Mx, color, xpoint, ypoint, npts, istart, skip, line, symb, rad, options) {
        if ((xpoint === undefined) || (ypoint === undefined)) {
            throw "mx.trace requires xpoint and ypoint";
        }

        if (skip === undefined) {
            skip = 1;
        }

        if (line === undefined) {
            line = 1;
        }

        if (symb === undefined) {
            symb = 0;
        }

        if (rad === undefined) {
            rad = 0;
        }

        if (options === undefined) {
            options = {};
        }

        if (npts <= 0) {
            m.log.warn("No points to draw");
            return;
        }

        if ((line === 0) && (symb === 0)) {
            m.log.warn("No line or symbol to draw");
            return;
        }

        var style;
        if (options.dashed) {
            style = {
                mode: "dashed",
                on: 4,
                off: 4
            };
        }

        var stk4 = mx.origin(Mx.origin, 4, Mx.stk[Mx.level]);
        if ((stk4.xscl === 0.0) || (stk4.yscl === 0.0)) {
            // the min and max are the same
            return;
        }

        var left = stk4.x1;
        var top = stk4.y1;

        var xxmin = stk4.xmin;
        var xscl = 1.0 / stk4.xscl;

        var yymin = stk4.ymin;
        var yscl = 1.0 / stk4.yscl;

        if (!options.noclip) {
            mx.clip(Mx, left, top, stk4.x2 - left + 1, stk4.y2 - top + 1);
        }

        var dx = Math.abs(stk4.xmax - stk4.xmin);
        var dy = Math.abs(stk4.ymax - stk4.ymin);
        var xmin = Math.min(stk4.xmin, stk4.xmax);
        var ymin = Math.min(stk4.ymin, stk4.ymax);
        var xmax = xmin + dx;
        var ymax = ymin + dy;
        //dx = dx * 0.5;
        //if ((line == -1) || (line == 1)) {
        //	dy = dy * 10.0;
        //} else {
        //	dy = dy * 0.5;
        //}
        //xmin = xmin - dx;
        //ymin = ymin - dy;
        //xmax = xmax + dx;
        //ymax = ymax + dy;
        // These buffers need to be able to hold 2 times the number of points.
        // if all points are on screen, then we will will need 'n' points
        // if all points are off the screen, then we will need (2*n)-2
        var bufsize = 4 * Math.ceil(2 * xpoint.length);
        var pixx = new Int32Array(new ArrayBuffer(bufsize));
        var pixy = new Int32Array(new ArrayBuffer(bufsize));

        var ib = 0;
        if ((line === 0) && (symb !== 0)) {
            for (var n = (skip - 1); n < npts; n += skip) {
                var x = xpoint[n];
                var y = ypoint[n];
                var lvisible = ((x >= xmin) && (x <= xmax) && (y >= ymin) && (y <= ymax));
                if (lvisible) {
                    pixx[0] = Math.round((x - xxmin) * xscl) + left;
                    pixy[0] = Math.round((y - yymin) * yscl) + top;
                    mx.draw_symbol(Mx, color, pixx[0], pixy[0], symb, rad, istart + n);
                }
            }
        }
        if (options.vertsym === true) {
            for (var n = (skip - 1); n < npts; n += skip) {
                var x = xpoint[n];
                var y = ypoint[n];
                if ((x >= xmin) && (x <= xmax)) {
                    var i = Math.round((x - xxmin) * xscl) + left;
                    mx.draw_line(Mx, color, i, 0, i, Mx.height);
                    if ((y >= ymin) && (y <= ymax)) {
                        pixx[0] = i;
                        pixy[0] = Math.round((y - yymin) * yscl) + top;
                        mx.draw_symbol(Mx, color, pixx[0], pixy[0], symb, rad, istart + n);
                    }
                }
            }
        }
        if (options.horzsym === true) {
            for (var n = (skip - 1); n < npts; n += skip) {
                var x = xpoint[n];
                var y = ypoint[n];
                if ((y >= ymin) && (y <= ymax)) {
                    var i = Math.round((y - yymin) * yscl) + top;
                    mx.draw_line(Mx, color, 0, i, Mx.width, i);
                    if ((x >= xmin) && (x <= xmax)) {
                        pixx[0] = Math.round((x - xxmin) * xscl) + left;
                        pixy[0] = i;
                        mx.draw_symbol(Mx, color, pixx[0], pixy[0], symb, rad, istart + n);
                    }
                }
            }
        } else if (line !== 0) {
            var colors;
            if ((options) && (options.highlight)) {
                colors = [];
                for (var sn = 0; sn < options.highlight.length; sn++) {
                    if (options.highlight[sn].xstart >= xmax) {
                        continue;
                    }
                    if (options.highlight[sn].xend <= xmin) {
                        continue;
                    }

                    var xs = Math.max(options.highlight[sn].xstart, xmin);
                    var xe = Math.min(options.highlight[sn].xend, xmax);

                    if (xs < xe) {
                        var rxs = Math.round((xs - xxmin) * xscl) + left;
                        var rxe = Math.round((xe - xxmin) * xscl) + left;

                        for (var cn = colors.length - 1; cn >= 0; cn--) {
                            // This highlight overlaps the entire range of a previous
                            // highlight...we can thus remove the color
                            if ((rxs <= colors[cn].start) && (rxe >= colors[cn].end)) {
                                colors.splice(cn, 1);
                                continue;
                            }
                            // This highlight splits a previous highlight...we need
                            // to create a new color range
                            else if ((rxs >= colors[cn].start) && (rxe <= colors[cn].end)) {
                                colors.push({
                                    start: rxe,
                                    end: colors[cn].end,
                                    color: colors[cn].color
                                });
                                colors[cn].end = rxs;

                            }
                            // This highlight overlaps partially
                            else if ((rxs <= colors[cn].start) && (rxe >= colors[cn].start)) {
                                colors[cn].start = rxe;
                            } else if ((rxs <= colors[cn].end) && (rxe >= colors[cn].end)) {
                                colors[cn].end = rxs;
                            }

                            // See if this colors is still valid
                            if (colors[cn].end <= colors[cn].start) {
                                colors.splice(cn, 1);
                            }
                        }

                        colors.push({
                            start: rxs,
                            end: rxe,
                            color: options.highlight[sn].color
                        });
                    }
                }

                // The first color is the start of the plot
                // in the base-line color
                colors.push({
                    start: left,
                    color: color
                });

                colors.sort(function(a, b) {
                    return a.start - b.start;
                });

            } else {
                colors = color;
            }

            var wn = 0; // the winding number counter http://geomalgorithms.com/a03-_inclusion.html
            var mid_x = (Mx.stk[Mx.level].xmax + Mx.stk[Mx.level].xmin) / 2.0;
            var mid_y = (Mx.stk[Mx.level].ymax + Mx.stk[Mx.level].ymin) / 2.0;

            var x = xpoint[0];
            var y = ypoint[0];

            wn = update_winding_number(wn, mid_x, mid_y, Mx.stk[Mx.level].xmin, Mx.stk[Mx.level].ymin, x, y);

            var lvisible = ((x >= xmin) && (x <= xmax) && (y >= ymin) && (y <= ymax));
            // The first point is visible
            if (lvisible) {
                pixx[ib] = Math.round((x - xxmin) * xscl) + left;
                pixy[ib] = Math.round((y - yymin) * yscl) + top;
                ib += 1;
                if (symb !== 0) {
                    mx.draw_symbols(Mx, color, pixx, pixy, 1, symb, rad, istart);
                }
            } else {
                ib = 0;
            }

            var ie = 0;
            var visible = false;
            for (var n = skip; n <= (skip * (npts - 1)); n += skip) {

                var lx = x;
                var ly = y;
                x = xpoint[n];
                y = ypoint[n];

                wn = update_winding_number(wn, mid_x, mid_y, lx, ly, x, y);

                visible = ((x >= xmin) && (x <= xmax) && (y >= ymin) && (y <= ymax));
                if ((lvisible) && (visible)) {
                    // both the left point and right point are visible, so we can draw the trace
                    pixx[ib] = Math.round((x - xxmin) * xscl) + left;
                    pixy[ib] = Math.round((y - yymin) * yscl) + top;
                    ib += 1;
                } else {
                    // clipping necessary, either the left or right point are not visible
                    lvisible = visible;
                    // calculate the difference between the last point and this point
                    dx = lx - x;
                    dy = ly - y;
                    if ((dx !== 0.0) || (dy !== 0.0)) {
                        var o = {
                            tL: 1.0,
                            tE: 0.0
                        };
                        // Between the last point and the current point,
                        // determine the ratio of the x and y porionts
                        // that intersects the border.  If clipt returns
                        // false then no portion of the line between the two
                        // points is visible
                        if (clipt(dx, xmin - x, o)) {
                            if (clipt(-dx, x - xmax, o)) {
                                if (clipt(dy, ymin - y, o)) {
                                    if (clipt(-dy, y - ymax, o)) {
                                        // If this point is starting the on-screen portion, start the line
                                        if (o.tL < 1) {
                                            pixx[ib] = Math.round((x - xxmin + o.tL * dx) * xscl) + left;
                                            pixy[ib] = Math.round((y - yymin + o.tL * dy) * yscl) + top;
                                            ib += 1;
                                        }

                                        // If this point is ending the on-screen portion draw the line
                                        if (o.tE > 0) {
                                            pixx[ib] = Math.round((x - xxmin + o.tE * dx) * xscl) + left;
                                            pixy[ib] = Math.round((y - yymin + o.tE * dy) * yscl) + top;
                                            ib += 1;
                                            mx.draw_lines(Mx, colors, pixx.subarray(ie, ib), pixy.subarray(ie, ib), (ib - ie), line, style);

                                            if (symb !== 0 && (ib - ie) > 2) {
                                                mx.draw_symbols(Mx,
                                                    color,
                                                    pixx.subarray(ie + 1, ib - 1),
                                                    pixy.subarray(ie + 1, ib - 1), (ib - ie - 2),
                                                    symb,
                                                    rad,
                                                    istart + n - (ib - ie - 2));
                                            }
                                            ie = ib;
                                        } else {
                                            // otherwise add it to the line to be drawn
                                            pixx[ib] = Math.round((x - xxmin) * xscl) + left;
                                            pixy[ib] = Math.round((y - yymin) * yscl) + top;
                                            ib += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            wn = update_winding_number(wn, mid_x, mid_y, x, y, Mx.stk[Mx.level].xmax, Mx.stk[Mx.level].ymin);
            wn = update_winding_number(wn, mid_x, mid_y, Mx.stk[Mx.level].xmax, Mx.stk[Mx.level].ymin, Mx.stk[Mx.level].xmin, Mx.stk[Mx.level].ymin);
            if ((ib - ie) > 0) {
                mx.draw_lines(Mx, colors, pixx.subarray(ie, ib), pixy.subarray(ie, ib), (ib - ie), line, style);
                if (visible) {
                    ie = ie + 1;
                }
                if (symb !== 0 && (ib - ie) > 1) {
                    // TODO ib - 1 is used below because
                    // otherwise the last point has undefined
                    // for it's x/y coordinates...but this may
                    // be a bug because it may neglect drawing
                    // the last data point
                    mx.draw_symbols(Mx,
                        color,
                        pixx.subarray(ie - 1, ib),
                        pixy.subarray(ie - 1, ib),
                        ib - ie - 1,
                        symb,
                        rad,
                        n - ib + istart);
                }
            }

            if (options.fillStyle && !Mx.fillMin && !Mx.fillMax) {
                if ((ib > 1) || (wn !== 0)) {
                    // if we have at least one point
                    // or the entire plot area is in the fill zone
                    mx.fill_trace(Mx, options.fillStyle, pixx, pixy, ib);
                }
            }

            if (options.highlight) {
                for (var i = 0; i < options.highlight.length; i++) {
                    var highlight = options.highlight[i];
                    if (!highlight.fill) {
                        continue;
                    }

                    var x_start = highlight.xstart;
                    var x_end = highlight.xend;

                    console.log("x start ", x_start);
                    console.log("x end ", x_end);

                    if (x_start >= Mx.stk[Mx.level].xmax) {
                        continue;
                    }
                    if (x_end <= Mx.stk[Mx.level].xmin) {
                        continue;
                    }

                    if ((ib > 1) || (wn !== 0)) {

                        var xstart_pixel_value = mx.real_to_pixel(Mx, x_start, 0);
                        var xend_pixel_value = mx.real_to_pixel(Mx, x_end, 0);

                        var pi_start = xstart_pixel_value.x;
                        var pi_end = xend_pixel_value.x;
                        //console.log('start: ', pi_start, 'end: ', pi_end);
                        var pixx_new = [];
                        var pixy_new = [];
                        for (var q = 0; q < ib; q++) {
                            var this_point = pixx[q];
                            var this_point_y = pixy[q];
                            //console.log(this_point);
                            if (in_fill_range(this_point, pi_start, pi_end) === true) {
                                //console.log('in range: ', this_point);
                                pixx_new.push(this_point);
                                pixy_new.push(this_point_y);

                            }
                        }

                        if ((pixx_new.length > 0) || (wn !== 0)) {
                            pi_start = Math.max(pi_start, pixx_new[0]);
                            pi_end = Math.min(pi_end, pixx_new[pixx_new.length - 1]);
                            mx.fill_trace(Mx, highlight.fill, pixx_new, pixy_new, pixx_new.length, pi_start, pi_end);
                        }
                    }

                }
            }


        }

        if (!options.noclip) {
            mx.clip(Mx, 0, 0, 0, 0);
        }
    };

    /**
     * Set dashed or solid lines mode.
     * @param Mx
     * @param linewidth
     * @param style
     */
    //
    // ~= MX$DRAW_MODE
    //
    mx.draw_mode = function(Mx, linewidth, style) {
        Mx.linewidth = (linewidth === undefined) ? 1 : linewidth;
        Mx.style = style;
    };

    /**
     * @param Mx
     * @param color
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param linewidth
     * @param style
     */
    //
    // ~= MX$DRAW_LINES
    //
    mx.draw_line = function(Mx, color, x1, y1, x2, y2, linewidth, style) {
        var ctx = Mx.active_canvas.getContext("2d");
        if (linewidth === undefined) {
            linewidth = Mx.linewidth;
        }
        if (style === undefined) {
            style = Mx.style;
        }
        // Look up the color in Mx.pixels
        if (typeof color === "number") {
            if (!Mx.pixel || Mx.pixel.length === 0) {
                m.log.warn("COLORMAP not initialized, defaulting to foreground");
                color = Mx.fg;
            } else {
                var cidx = Math.max(0, Math.min(Mx.pixel.length, color));
                color = to_rgb(
                    Mx.pixel[cidx].red,
                    Mx.pixel[cidx].green,
                    Mx.pixel[cidx].blue);
            }
        }
        draw_line(ctx, x1, y1, x2, y2, style, color, linewidth);
    };

    /**
     * @param Mx
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    //
    // ~= MX$RUBBERLINE
    //
    mx.rubberline = function(Mx, x1, y1, x2, y2) {
        var ctx = Mx.active_canvas.getContext("2d");
        draw_line(ctx, x1, y1, x2, y2, {
            mode: "xor"
        }, "white", 1);
    };

    /**
     * @param Mx
     * @param fillStyle
     * @param pixx
     * @param pixy
     * @param npts
     * @private
     */
    mx.fill_trace = function(Mx, fillStyle, pixx, pixy, npts, l, r) {
        var ctx = Mx.active_canvas.getContext("2d");
        if (Array.isArray(fillStyle)) {
            ctx.fillStyle = mx.linear_gradient(Mx, 0, 0, 0, Mx.b - Mx.t, fillStyle);
        } else {
            ctx.fillStyle = fillStyle;
        }

        if (npts < 1) {
            ctx.fillRect(Mx.l, Mx.t, (Mx.r - Mx.l), (Mx.b - Mx.t));
            return;
        }

        if (l === undefined) {
            l = Mx.l;
        }
        if (r === undefined) {
            r = Mx.r;
        }

        if (fillStyle) {
            var x = pixx[0];
            var y = pixy[0];

            ctx.beginPath();
            if (y === Mx.t) {
                ctx.lineTo(l, Mx.t);
            } else {
                ctx.lineTo(l, Mx.b);
            }


            ctx.lineTo(x, y);



            for (var i = 1; i < npts; i++) {
                x = pixx[i];
                y = pixy[i];
                ctx.lineTo(x, y);
            }

            if (y === Mx.t) {
                ctx.lineTo(r, Mx.t);
            }
            ctx.lineTo(r, Mx.b);
            if (pixy[0] === Mx.t) {
                ctx.lineTo(l, Mx.b);
            }

            ctx.closePath();
            ctx.fill("evenodd");
        }
    };

    /**
     * @param Mx
     * @param colors
     * @param pixx
     * @param pixy
     * @param npts
     * @param linewidth
     * @param style
     */
    //
    // ~= MX$DRAW_LINES
    //
    mx.draw_lines = function(Mx, colors, pixx, pixy, npts, linewidth, style) {
        var ctx = Mx.active_canvas.getContext("2d");

        if (npts < 1) {
            return;
        }

        var x = pixx[0];
        var y = pixy[0];

        if (linewidth === undefined) {
            linewidth = Mx.linewidth;
        }
        if (style === undefined) {
            style = Mx.style;
        }

        if ((style) && (style.mode === "dashed")) {
            var dash_supported = common.dashOn(ctx, style.on, style.off);
            if (!dash_supported) {
                m.log.warn("WARNING: Dashed lines aren't supported on your browser");
            }
        }

        ctx.lineWidth = linewidth;
        var current_color = 0;

        if (typeof colors === "string") {
            colors = [{
                start: 0,
                color: colors
            }];
        } else if (!(colors instanceof Array)) {
            if (colors.start === undefined) {
                colors.start = 0;
            }
            colors = [colors];
        }

        // Find the first valid color (expects colors to be sorted)
        for (var n = 0; n < colors.length; n++) {
            if ((colors[n].end != null) && (colors[n].end < x)) {
                colors.remove(n);
            } else if (colors[n].start < x) {
                current_color = n;
            }
        }

        ctx.strokeStyle = colors[current_color].color;
        ctx.beginPath();
        ctx.moveTo(x, y);

        for (var i = 0; i < npts; i++) {
            if ((x === pixx[i]) && (y === pixy[i])) {
                continue;
            }
            x = pixx[i];
            y = pixy[i];

            var newcolor = false;
            if ((current_color > 0) && (colors[current_color].end != null) && (colors[current_color].end < x)) {
                newcolor = true;
                while ((colors[current_color].end != null) && (colors[current_color].end < x)) {
                    colors.remove(current_color);
                    current_color -= 1;
                    if (current_color === 0) {
                        break;
                    }
                }
            }

            if (((current_color + 1) < colors.length) && (colors[current_color + 1].start <= x)) {
                newcolor = true;
                while (((current_color + 1) < colors.length) && (colors[current_color + 1].start <= x)) {
                    current_color++;
                }
            }

            ctx.lineTo(x, y);
            if (newcolor) {
                ctx.stroke();
                ctx.strokeStyle = colors[current_color].color;
                ctx.beginPath();
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        common.dashOff(ctx);
        ctx.beginPath();
    };

    /**
     * @param Mx
     * @param left
     * @param top
     * @param width
     * @param height
     */
    //
    // ~= MX$CLIP
    //
    mx.clip = function(Mx, left, top, width, height) {
        var ctx = Mx.active_canvas.getContext("2d");

        if ((left === 0) && (top === 0) && (width === 0) && (height === 0)) {
            ctx.restore();
            return;
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.clip();
    };

    /**
     * @param Mx
     */
    //
    // ~= MX$CLEAR_WINDOW
    //
    mx.clear_window = function(Mx) {
        var ctx = Mx.active_canvas.getContext("2d");

        ctx.fillStyle = Mx.bg;
        ctx.fillRect(0, 0, Mx.width, Mx.height);
    };

    /**
     * @param Mx
     * @private
     */
    mx.erase_window = function(Mx) {
        var ctx = Mx.active_canvas.getContext("2d");

        ctx.clearRect(0, 0, Mx.width, Mx.height);
    };

    /**
     * @param Mx
     * @param func
     * @param mode
     * @param def_style
     * @param alt_style
     */
    //
    // ~= MX$RUBBERBOX
    // Unlike MX$RUBBERBOX, this is a non-blocking call.  As such the 'func' is a callback for then the rubberbox is finished.
    //
    // When CTRL is pressed, alt_style is used
    //
    mx.rubberbox = function(Mx, func, mode, def_style, alt_style) {
        mx.warpbox(Mx, Mx.xpos, Mx.ypos, Mx.xpos, Mx.ypos, 0, Mx.width, 0, Mx.height, func, mode, def_style, alt_style);
    };

    /**
     * @param Mx
     * @param xo
     * @param yo
     * @param xl
     * @param yl
     * @param xmin
     * @param xmax
     * @param ymin
     * @param ymax
     * @param func
     * @param mode
     * @param def_style
     * @param alt_style
     */
    //
    // ~= MX$WARPBOX
    // Unlike MX$WARPBOX, this is a non-blocking call.   As such the 'func' is a callback for then the rubberbox is finished.
    //
    mx.warpbox = function(Mx, xo, yo, xl, yl, xmin, xmax, ymin, ymax, func, mode, def_style, alt_style) {
        if (!def_style) {
            def_style = {};
        }

        Mx.warpbox = new WARPBOX();
        Mx.warpbox.xo = xo;
        Mx.warpbox.yo = yo;
        Mx.warpbox.xl = xl;
        Mx.warpbox.yl = yl;
        Mx.warpbox.xmin = xmin;
        Mx.warpbox.xmax = xmax;
        Mx.warpbox.ymin = ymin;
        Mx.warpbox.ymax = ymax;
        Mx.warpbox.func = func;
        Mx.warpbox.mode = mode;

        Mx.warpbox.style = def_style;
        Mx.warpbox.def_style = def_style;
        Mx.warpbox.alt_style = alt_style;
    };

    /**
     * @param inorigin
     * @param outorigin
     * @param instk
     */
    //
    // ~= M$ORIGIN
    //
    mx.origin = function(inorigin, outorigin, instk) {
        inorigin = Math.max(1, inorigin);
        outorigin = Math.max(1, outorigin);

        var outstk = new mx.STKSTRUCT();

        outstk.xmin = instk.xmin;
        outstk.xmax = instk.xmax;
        outstk.ymin = instk.ymin;
        outstk.ymax = instk.ymax;
        outstk.xscl = instk.xscl;
        outstk.yscl = instk.yscl;
        outstk.x1 = instk.x1;
        outstk.y1 = instk.y1;
        outstk.x2 = instk.x2;
        outstk.y2 = instk.y2;

        if (inorigin !== outorigin) {
            var diff = Math.abs(outorigin - inorigin); // used to simplify boolean logic
            var sum = outorigin + inorigin;
            if (diff === 2 || sum !== 5) { // (1<->3) (2<->4) (1<->2) (3<->4)
                outstk.xmin = instk.xmax;
                outstk.xmax = instk.xmin;
                outstk.xscl = -instk.xscl;
            }
            if (diff === 2 || sum === 5) { // (1<->3) (2<->4) (1<->4) (2<->3)
                outstk.ymin = instk.ymax;
                outstk.ymax = instk.ymin;
                outstk.yscl = -instk.yscl;
            }
        }
        return outstk;
    };

    /**
     * @param end1
     * @param end2
     */
    //
    // ~= MX$MULT
    //
    mx.mult = function(end1, end2) {
        var absmax = Math.max(Math.abs(end1), Math.abs(end2));
        if (absmax === 0) {
            return 1.0;
        }
        var kengr = 0.1447648 * Math.log(absmax);
        kengr = kengr | kengr; // Math.floor always rounds down, so -3.3 becomes -4 use this bitwise hack instead
        if (absmax < 1.0) {
            kengr = kengr - 1;
        }
        if (kengr < 0) {
            return 1.0 / Math.pow(10, (-3 * kengr));
        } else {
            return Math.pow(10, (3 * kengr));
        }
    };

    /**
     * @param Mx
     * @param event
     * @private
     */
    //
    // event may be undefined or null
    mx.widget_callback = function(Mx, event) {
        if (Mx.prompt) {
            if (event.which === 3) {
                Mx.prompt.input.onsubmit();
            }
        }

        if (Mx.widget) {
            Mx.widget.callback(event);
        }
    };

    /**
     * @param Mx
     * @param promptText
     * @param isValid
     * @param onSuccess
     * @param refresh
     * @param inputValue
     * @param xpos
     * @param ypos
     * @param errorTimeout
     */
    //
    // ~= MX$DPROMPT - only higher-level
    mx.prompt = function(Mx, promptText, isValid, onSuccess, refresh, inputValue, xpos, ypos, errorTimeout) {
        if (inputValue !== undefined) {
            var inputValid = isValid(inputValue);

            if (!inputValid.valid) {
                throw "Prompt default input value not valid due to '" + inputValid.reason + "'";
            }
        }

        // TODO Validation - make sure promptText is not too long and isn't multi-line...
        mx.onWidgetLayer(Mx, function() {
            var ctx = Mx.active_canvas.getContext("2d");
            var maxNumChars = 30;

            // Construct the input box
            var pxIndex = ctx.font.indexOf('px');
            var fontIndex = pxIndex + 3;
            var fontSize = ctx.font.substr(0, pxIndex);
            var fontFamily = ctx.font.substr(fontIndex, ctx.font.length).toString();

            /* TODO Note: There is a scrolling bug - you can scroll to the right, but not the left of the value
			And... when truncating the width of an input field - it shows the value as though truncated
			from the right (say if its cut off by 1 and that one happened to be a negative sign, the value
			would look like a positive) .
			 */
            var canvasInput = new CanvasInput({
                height: Mx.text_h,
                fontFamily: fontFamily,
                /* jshint -W053 */
                fontSize: new Number(fontSize),
                /* jshint +W053 */
                backgroundColor: Mx.bg,
                fontColor: Mx.fg,
                borderWidth: 0,
                borderRadius: 0,
                padding: 0,
                boxShadow: "none",
                innerShadow: "none",
                width: Mx.text_w * maxNumChars,
                value: (inputValue !== undefined ? inputValue.toString() : ""),
                disableBlur: true,
                renderOnReturn: false,
                tabToClear: true
            });

            var subHandlerCreator = function(messageX, messageY) {
                return function() {
                    var newValue = this.value();

                    var inputValid = isValid(newValue);

                    if (!inputValid.valid) {
                        mx.message(Mx, "Value: '" + newValue + "' isn't valid due to '" + inputValid.reason + "' - RETRY", undefined, messageX, messageY);

                        // Clear error message
                        setTimeout(function() {
                            mx.onWidgetLayer(Mx, function() {
                                mx.erase_window(Mx);
                            });
                            Mx.widget = null;
                            //refresh();
                        }, errorTimeout != null ? errorTimeout : 4000);
                    } else {
                        Mx.prompt = undefined; // clear state variable

                        // Kill CanvasInput
                        this.cleanup();
                        mx.onWidgetLayer(Mx, function() {
                            mx.erase_window(Mx);
                        });

                        onSuccess(newValue);
                    }
                };
            };

            // Create redraw method
            var redrawPromptCreator = function(Mx, input, promptText) {
                return function(xpos, ypos) {
                    mx.onWidgetLayer(Mx, function() {
                        var GBorder = 3;

                        // Calculate the position variables

                        var xssPrompt = (promptText.length + 2) * Mx.text_w;
                        var xss = xssPrompt + (maxNumChars + 1) * Mx.text_w;
                        var yss = 2 * Mx.text_h;

                        var xs = xss + 2 * GBorder;
                        var ys = yss + 2 * GBorder;
                        if (!xpos) {
                            xpos = Mx.xpos;
                        }
                        if (!ypos) {
                            ypos = Mx.ypos;
                        }
                        var xc = Math.max(0, Math.min(xpos, Mx.width - xs));
                        var yc = Math.max(0, Math.min(ypos, Mx.height - ys));
                        var xcc = xc + GBorder;
                        var ycc = yc + GBorder;

                        var yPos = ycc + Mx.text_h * 1.5;
                        var inputXPos = xcc + Mx.text_w;

                        // Draw the box and label text
                        mx.widgetbox(Mx, xc, yc, xs, ys, xcc, ycc, 0, "");
                        mx.text(Mx, inputXPos, yPos, promptText);

                        var inputYPos = yPos - Mx.text_h * 1.15;

                        // Redraw the input at the new location
                        input.x(xcc + Mx.text_w + xssPrompt - Mx.text_w);
                        input.y(inputYPos);

                        input.onsubmit(subHandlerCreator(xc, inputYPos - 75)); // TODO Refactor positioning based on char length of reason code...
                        if (!input.canvas()) {
                            input.canvas(Mx.active_canvas);
                        } else {
                            input.render();
                        }
                    });
                };
            };

            var redrawPrompt = redrawPromptCreator(Mx, canvasInput, promptText);

            //refresh();
            redrawPrompt(xpos, ypos);
            canvasInput.focus();

            // Set state variable
            Mx.prompt = {
                redraw: redrawPrompt,
                input: canvasInput
            };
        });
    };

    /**
     * Floating-point number validator. Verifies that value is a valid floating point
     * number. Validation is loose by default - meaning empty strings are considered valid.
     * @param value The value to validate.
     * @param strict If strict is set to true - does not consider empty strings as valid floating point numbers.
     * @private
     */
    mx.floatValidator = function(value, strict) {
        if (!(((strict === undefined || strict === false) && value === "")) &&
            isNaN(parseFloat(value)) || !isFinite(value)) {
            return {
                valid: false,
                reason: "Failed float validation: not a valid floating point number"
            };
        }

        return {
            valid: true,
            reason: ""
        };
    };

    /**
     * Integer number validator. Verifies that value is a valid integer.
     * Validation is loose by default - meaning empty strings are considered valid.
     * @param value The value to validate.
     * @param strict If strict is set to true - does not consider empty strings as valid integers.
     * @private
     */
    mx.intValidator = function(value, strict) {
        if (((strict === undefined || strict === false) && value === "") ||
            ((parseFloat(value) === parseInt(value, 10)) && !isNaN(value))) {
            return {
                valid: true,
                reason: ""
            };
        } else {
            return {
                valid: false,
                reason: "Failed integer validation: not a valid integer"
            };
        }
    };

    mx.hexValidator = function(value, strict) {
        var regColorcode = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
        if (((strict === undefined || strict === false) && value === "") ||
            (regColorcode.test(value) !== false)) {
            return {
                valid: true,
                reason: ""
            };
        } else {
            return {
                valid: false,
                reason: "Failed hexcode validation: not a valid hexcode"
            };
        }
    };

    /**
     * @param Mx
     * @param msg
     * @param time - unused?
     * @param xpos
     * @param ypos
     */
    //
    // ~= MX$MESSAGE
    //
    mx.message = function(Mx, msg, time, xpos, ypos, type) {
        mx.onWidgetLayer(Mx, function() {

            mx.render_message_box(Mx, msg, xpos, ypos);

            Mx.widget = {
                type: type || "ONESHOT",
                callback: function(event) {
                    if ((event.type === "mousedown") || (event.type === "keydown")) {
                        Mx.widget = null;
                        mx.onWidgetLayer(Mx, function() {
                            mx.erase_window(Mx);
                        });
                    }
                }
            };
        });
    };

    mx.render_message_box = function(Mx, msg, xpos, ypos, textColor) {
        var GBorder = 3;

        // Unlike MX$MESSAGE, this implementaion if the message
        // already contains newlines, the text will placed in the
        // box as-is.
        var beg = msg.split(/\r\n|\r|\n/g);
        var linel = 0;
        var center;
        if (beg.length === 1) {
            beg = [];
            var MESSWIDTH = 40;

            linel = Math.min((((Mx.width - 2 * GBorder) / Mx.text_w) - 2), msg.length);
            if (linel <= 0) {
                return;
            }
            while ((linel > MESSWIDTH) && (2.5 * Mx.text_h * msg.length < Mx.height * linel)) {
                linel -= 5;
            }

            var cur = 0;
            var bg = 0;
            var i = 0;
            var j = 0;
            var end = 0;
            var brk = 0;
            var beg = [];

            center = true;
            while (bg < msg.length) {
                end = bg + linel - 1;
                brk = end = Math.min(end, msg.length - 1);
                var endinreturn = false;
                for (cur = bg; cur <= end && !endinreturn; cur++) {
                    switch (msg[cur]) {
                        case ',':
                        case ';':
                        case ' ':
                        case ':':
                            brk = cur;
                            break;
                        case '-':
                        case '/':
                            if (brk !== cur - 1) {
                                brk = cur;
                            }
                            break;
                        case '@':
                        case '\n':
                        case '\r':
                            center = false;
                            endinreturn = true;
                            brk = cur;
                            break;
                    }
                }
                if (cur === msg.length) {
                    brk = end;
                }
                if (endinreturn) {
                    beg.push(msg.substring(bg, brk));
                } else {
                    // trim leading space
                    var s = msg.substring(bg, brk + 1).replace(/^\s+/, "");
                    beg.push(s);
                }
                bg = brk + 1;
                j = Math.max(j, beg[i].length);
            }
        } else {
            for (var i = 0; i < beg.length; i++) {
                linel = Math.min((((Mx.width - 2 * GBorder) / Mx.text_w) - 2), Math.max(linel, beg[i].length));
            }
        }

        var lines = beg.length;
        if (lines > 6) {
            center = false;
        }
        var cur = 0;
        var winlines = Math.max(1, Mx.height / Mx.text_h);
        var lastline = Math.min(lines, cur + winlines - 1);

        var xss = (linel + 2) * Mx.text_w;
        var yss = (lastline - cur + 1) * Mx.text_h;

        var xs = xss + 2 * GBorder;
        var ys = yss + 2 * GBorder;
        if (!xpos) {
            xpos = Mx.xpos;
        }
        if (!ypos) {
            ypos = Mx.ypos;
        }
        var xc = Math.max(Mx.l, Math.min(xpos, Mx.r - xs));
        var yc = Math.max(Mx.t, Math.min(ypos, Mx.b - ys));
        var xcc = xc + GBorder;
        var ycc = yc + GBorder;

        mx.widgetbox(Mx, xc, yc, xs, ys, xcc, ycc, 0, "");

        var j = ycc + Mx.text_h / 3;
        var i = xcc + Mx.text_w;
        while (cur < lastline) {
            j += Mx.text_h;
            if (center) {
                i = xc + xs / 2 - ((beg[cur].length * Mx.text_w) / 2);
            }
            mx.text(Mx, i, j, beg[cur], textColor);
            cur++;
        }
    };

    /**
     * Based on http://js-bits.blogspot.co.uk/2010/07/canvas-rounded-corner-rectangles.html
     *
     * @param Mx
     * @param color
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @param fill_opacity
     * @param fill_color
     * @param {Number} radius The corner radius. Defaults to 5;
     */
    mx.draw_round_box = function(Mx, color, x, y, w, h, fill_opacity, fill_color, radius) {
        var ctx = Mx.active_canvas.getContext("2d");

        if (!radius) {
            radius = 5;
        }

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.stroke();

        if ((fill_opacity !== undefined) && (fill_opacity > 0)) {
            var oldAlpha = ctx.globalAlpha;
            ctx.globalAlpha = fill_opacity;
            if (fill_color) {
                ctx.fillStyle = fill_color;
            } else {
                ctx.fillStyle = color;
            }
            ctx.fill();
            ctx.globalAlpha = oldAlpha;
        }
    };

    /**
     * @param Mx
     * @param color
     * @param x
     * @param y
     * @param w
     * @param h
     * @param fill_opacity
     * @param fill_color
     */
    //
    // ~= MX$DRAW_BOX
    //
    mx.draw_box = function(Mx, color, x, y, w, h, fill_opacity, fill_color) {
        var ctx = Mx.active_canvas.getContext("2d");

        if (color !== "xor") {
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.strokeRect(x, y, w, h);
        } else {
            if (typeof Uint8ClampedArray === 'undefined') {
                // we don't have typed arrays, so canvas getImageData operations
                // will be very slow, so use Mx.fg instead
                ctx.lineWidth = 1;
                ctx.strokeStyle = Mx.fg;
                ctx.strokeRect(x, y, w, h);
            } else {
                // TODO switch to using TypedArrays
                x = Math.floor(x);
                y = Math.floor(y);
                w = Math.floor(w);
                h = Math.floor(h);

                // For now assume xor always uses the base canvas
                // even if it draws on another canvas
                var dctx = Mx.canvas.getContext("2d");

                var imgd = dctx.getImageData(x, y, w, 1);
                var pix = imgd.data;
                for (var c = 0; c < imgd.data.length; c++) {
                    pix[c * 4] = 255 - pix[c * 4]; // red
                    pix[c * 4 + 1] = 255 - pix[c * 4 + 1]; // green
                    pix[c * 4 + 2] = 255 - pix[c * 4 + 2]; // blue
                    pix[c * 4 + 3] = 255; // opacity
                }
                ctx.putImageData(imgd, x, y);

                imgd = dctx.getImageData(x, y + h, w, 1);
                pix = imgd.data;
                for (var c = 0; c < imgd.data.length; c++) {
                    pix[c * 4] = 255 - pix[c * 4]; // red
                    pix[c * 4 + 1] = 255 - pix[c * 4 + 1]; // green
                    pix[c * 4 + 2] = 255 - pix[c * 4 + 2]; // blue
                    pix[c * 4 + 3] = 255; // opacity
                }
                ctx.putImageData(imgd, x, y + h);

                var imgd = dctx.getImageData(x, y, 1, h);
                var pix = imgd.data;
                for (var c = 0; c < h; c++) {
                    pix[c * 4] = 255 - pix[c * 4]; // red
                    pix[c * 4 + 1] = 255 - pix[c * 4 + 1]; // green
                    pix[c * 4 + 2] = 255 - pix[c * 4 + 2]; // blue
                    pix[c * 4 + 3] = 255; // opacity
                }
                ctx.putImageData(imgd, x, y);

                imgd = dctx.getImageData(x + w, y, 1, h);
                pix = imgd.data;
                for (var c = 0; c < h; c++) {
                    pix[c * 4] = 255 - pix[c * 4]; // red
                    pix[c * 4 + 1] = 255 - pix[c * 4 + 1]; // green
                    pix[c * 4 + 2] = 255 - pix[c * 4 + 2]; // blue
                    pix[c * 4 + 3] = 255; // opacity
                }
                ctx.putImageData(imgd, x + w, y);
            }
        }

        if ((fill_opacity !== undefined) && (fill_opacity > 0)) {
            var oldAlpha = ctx.globalAlpha;
            ctx.globalAlpha = fill_opacity;
            if (fill_color) {
                ctx.fillStyle = fill_color;
            } else {
                ctx.fillStyle = color;
            }
            ctx.fillRect(x + 1, y + 1, w - 1, h - 1);
            ctx.globalAlpha = oldAlpha;
        }
    };

    /**
     * @param Mx
     * @param width
     */
    // ~= MX$SETFONT
    mx.set_font = function(Mx, width) {
        var ctx = Mx.canvas.getContext("2d");
        var ctx_wid = Mx.wid_canvas.getContext("2d");

        if ((Mx.font) && (Mx.font.width === width)) {
            // use the cached font
            ctx.font = Mx.font.font;
            ctx_wid.font = Mx.font.font;
        } else {
            // figure out the font
            var text_h = 1;
            do {
                text_h = text_h + 1;
                ctx.font = text_h + "px " + Mx.font_family;
                ctx_wid.font = text_h + "px " + Mx.font_family;
                var font_size = ctx.measureText('M'); // the capital M is typically the same height and width
                Mx.text_w = font_size.width;
                Mx.text_h = text_h;
            } while (Mx.text_w < width);
            Mx.font = {
                font: text_h + "px " + Mx.font_family,
                width: width
            };
        }
    };


    /**
     * @param Mx
     * @param xstart
     * @param ystart
     * @param xend
     * @param yend
     * @param style
     */
    // ~= MX$FTEXTLINE
    mx.textline = function(Mx, xstart, ystart, xend, yend, style) {
        var ctx = Mx.active_canvas.getContext("2d");
        if (!style) {
            style = {};
        }
        if (!style.color) {
            style.color = Mx.fg;
        }
        if (!style.width) {
            style.width = 1;
        }
        draw_line(ctx, xstart, ystart, xend, yend, style, style.color, style.width);
    };

    /**
     * @param dmin
     * @param dmax
     * @param ndiv
     */
    // ~= MX$TICS
    mx.tics = function(dmin, dmax, ndiv, timecode) {
        var dtic = 1;
        var dtic1 = dmin;

        // handle degenerate case
        if (dmax === dmin) {
            return {
                dtic: 1,
                dtic1: dmin
            };
        }

        // split up range into about ndiv 'nice' chunks
        // zero is included only if   dmin < zero < dmax
        var dran = Math.abs(dmax - dmin);
        var df = dran / ndiv;
        var sig = log10(Math.max(df, 1.0e-36));
        var nsig;
        if (sig < 0.0) {
            nsig = Math.ceil(sig);
            nsig = nsig - 1;
        } else {
            nsig = Math.floor(sig);
        }

        var ddf = df * Math.pow(10.0, (-nsig));
        sig = Math.pow(10.0, nsig);
        var dft = ddf * sig;
        // If timecode has been requested and it looks like
        // timecode
        if (timecode && (dft >= 5.0 && dft <= 59.5 * 3600 * 24)) {
            var dscl;
            if (dft < 17.5) {
                dscl = 5.0; // align to 5 sec tics
            } else if (dft < 37.5) {
                dscl = 15.0; // align to 15 sec tics
            } else if (dft < 4.5 * 60) {
                dscl = 60.0; // 1 minute tics
            } else if (dft < 17.5 * 60) {
                dscl = 5.0 * 60; // and so on
            } else if (dft < 37.5 * 60) {
                dscl = 15.0 * 60;
            } else if (dft < 2.0 * 3600) {
                dscl = 1.0 * 3600;
            } else if (dft < 4.5 * 3600) {
                dscl = 3.0 * 3600;
            } else if (dft < 9.0 * 3600) {
                dscl = 6.0 * 3600;
            } else if (dft < 1.5 * 3600 * 24) {
                dscl = 12.0 * 3600;
            } else if (dft < 6.0 * 3600 * 24) {
                dscl = 1.0 * 3600 * 24; // 1 day
            } else {
                dscl = 1.0 * 3600 * 24 * 7; // 1 week
            }
            dtic = Math.round(dft / dscl) * dscl;
        } else {
            if (ddf < 1.75) {
                dtic = sig;
            } else if (ddf < 2.25) {
                dtic = 2.0 * sig;
            } else if (ddf < 3.5) {
                dtic = 2.50 * sig;
            } else if (ddf < 7.0) {
                dtic = 5.0 * sig;
            } else {
                dtic = 10.0 * sig;
            }
        }

        // redefine dmin and dmax to line up on 'nice' boundaries
        if (dtic === 0.0) {
            dtic = 1.0;
        }
        var nseg;
        if (dmax >= dmin) {
            if (dmin >= 0.0) {
                nseg = dmin / dtic + 0.995;
            } else {
                nseg = dmin / dtic - 0.005;
            }
            nseg = Math.floor(nseg); // floor
            dtic1 = nseg * dtic;
        } else {
            if (dmin >= 0.0) {
                nseg = dmin / dtic + 0.005;
            } else {
                nseg = dmin / dtic - 0.995;
            }
            nseg = Math.floor(nseg); // floor
            dtic1 = nseg * dtic;
            dtic = -1 * dtic;
        }
        if (dtic1 + dtic === dtic1) {
            dtic = dmax - dmin;
        }

        return {
            dtic: dtic,
            dtic1: dtic1
        };
    };

    /**
     * @param Mx
     * @param xdiv
     * @param ydiv
     * @param xlab
     * @param ylab
     * @param flags
     */
    // ~= MX$FDRAWAXIS
    mx.drawaxis = function(Gx, Mx, xdiv, ydiv, xlab, ylab, flags) {
        var stk1 = mx.origin(Mx.origin, 1, Mx.stk[Mx.level]);
        var iscl = 0;
        var isct = 0;
        var iscr = 0;
        var iscb = 0;
        var width = 0;
        var height = 0;

        xlab = (xlab === undefined) ? 30 : xlab;
        ylab = (ylab === undefined) ? 30 : ylab;


        if (flags.exactbox) {
            iscl = Math.floor(stk1.x1);
            isct = Math.floor(stk1.y1);
            iscr = Math.floor(stk1.x2);
            iscb = Math.floor(stk1.y2);
            width = iscr - iscl;
            height = iscb - isct;
        } else {
            iscl = Math.max(Math.floor(stk1.x1) - 2, 0);
            isct = Math.max(Math.floor(stk1.y1) - 2, 0);
            iscr = Math.min(Math.floor(stk1.x2) + 2, Mx.width);
            iscb = Math.min(Math.floor(stk1.y2) + 2, Mx.height);
            width = iscr - iscl - 4;
            height = iscb - isct - 4;
        }

        var ctx = Mx.active_canvas.getContext("2d");
        if (flags.fillStyle) {
            if (Array.isArray(flags.fillStyle)) {
                ctx.fillStyle = mx.linear_gradient(Mx, 0, 0, 0, iscb - isct, flags.fillStyle);
            } else {
                ctx.fillStyle = flags.fillStyle;
            }
        } else {
            ctx.fillStyle = Mx.bg;
        }
        ctx.fillRect(iscl, isct, iscr - iscl, iscb - isct);

        if (!flags.noaxisbox) {
            mx.textline(Mx, iscl, isct, iscr, isct);
            mx.textline(Mx, iscr, isct, iscr, iscb);
            mx.textline(Mx, iscr, iscb, iscl, iscb);
            mx.textline(Mx, iscl, iscb, iscl, isct);
        }

        var xTIC = {
            dtic: 0,
            dtic1: 0
        };
        var yTIC = {
            dtic: 0,
            dtic1: 0
        };

        if (xdiv < 0) {
            xTIC.dtic1 = stk1.xmin;
            xTIC.dtic = (stk1.xmin - stk1.xmax) / xdiv;
        } else {
            xTIC = mx.tics(stk1.xmin, stk1.xmax, xdiv, flags.xtimecode);
        }


        var _xmult = 1.0;
        if (flags.xmult) { // if xmult was provided
            _xmult = flags.xmult;
        } else if (!flags.xtimecode) {
            _xmult = mx.mult(stk1.xmin, stk1.xmax);
        }
        if (ydiv < 0) {
            yTIC.dtic1 = stk1.ymin;
            yTIC.dtic = (stk1.ymin - stk1.ymax) / ydiv;
        } else {
            yTIC = mx.tics(stk1.ymin, stk1.ymax, ydiv, flags.ytimecode);
        }
        var _ymult = 1.0;
        if (flags.ymult) { // if ymult was provided
            _ymult = flags.ymult;
        } else if (!flags.ytimecode) {
            _ymult = mx.mult(stk1.ymin, stk1.ymax);
        }

        var xticlabels = !flags.noxtlab;
        var yticlabels = !flags.noytlab;

        // add labels
        var ix = Math.max(0, iscl - 4 * Mx.text_w);
        var iy = 0;
        if (flags.ontop) {
            iy = Math.min(Mx.height, Math.floor(iscb + 1.5 * Mx.text_h));
        } else {
            iy = Math.max(Mx.text_h, Math.floor(isct - 0.5 * Mx.text_h));
        }

        var xlabel;
        var ylabel;

        if (iy > 0) {
            var ly = 0;
            if (!flags.noyplab) {
                if (flags.ylabel instanceof Function) {
                    ylabel = flags.ylabel(ylab, _ymult);
                } else if (flags.ylabel !== undefined) {
                    ylabel = flags.ylabel;
                } else {
                    ylabel = m.label(ylab, _ymult);
                }
            }
            if (!flags.noxplab) {
                if (flags.xlabel instanceof Function) {
                    xlabel = flags.xlabel(xlab, _xmult);
                } else if (flags.xlabel !== undefined) {
                    xlabel = flags.xlabel;
                } else {
                    xlabel = m.label(xlab, _xmult);
                }
            }
        }

        if (xlabel && ylabel) {
            mx.text(Mx, ix, iy, ylabel + " vs " + xlabel);
        } else if (xlabel) {
            mx.text(Mx, ix, iy, xlabel);
        } else if (ylabel) {
            mx.text(Mx, ix, iy, ylabel);
        }

        var itext = 5.5 * Mx.text_w;
        var jtext = 0;
        if (flags.ontop) {
            if (flags.inside) {
                jtext = isct + 1.0 * Mx.text_h;
            } else {
                jtext = isct - 0.2 * Mx.text_h;
            }
        } else {
            if (flags.inside) {
                jtext = iscb - 0.5 * Mx.text_h;
            } else {
                jtext = iscb + 1.0 * Mx.text_h + 2;
            }
        }
        var fact;
        if (stk1.xmin !== stk1.xmax) {
            fact = width / (stk1.xmax - stk1.xmin);
        } else {
            fact = width / 1.0;
        }

        var fmul;
        if (_xmult !== 0) {
            fmul = 1.0 / _xmult;
        } else {
            fmul = 1.0;
        }

        // Figure out how many characters can fit between tics
        var xlbl_maxlen = Math.min(12, Math.round(fact * xTIC.dtic) / Mx.text_w);

        // The sp flag decides if all tics should be labeled, or just the first tic.
        // in LEGACY rendering when sp=0 you should get one tic at the start
        // that then displays like XPOS += tic-delta
        //
        // The original logic basically says, if the tic-delta (i.e. dtic) is very small
        // relative to the first tic, only render the first tic.  Specifically:
        //    sp = (Math.abs(xTIC.dtic) / Math.max(Math.abs(xTIC.dtic1), Math.abs(xTIC.dtic)) > 1.0e-6);
        //
        // However, it's probably more important to decide this based off the significant digits of the
        // tic labels.  In other words, if the tics cannot be labeled uniquely then you need to make sp=0.
        var sp = 1;
        var x;
        var xlbl = "";
        if (xticlabels) {
            if (flags.xtimecode) {
                xlbl = m.sec2tod(xTIC.dtic1);
                // If the label is no longer than half of the total width display multiple labels
                sp = (xlbl.length * Mx.text_w < (iscr - iscl) / 2);
            } else {
                // Ensure that all of the tic labels will render uniquely
                var last_xlbl;
                for (x = xTIC.dtic1; x <= stk1.xmax; x = x + xTIC.dtic) {
                    xlbl = mx.format_f(x * fmul, xlbl_maxlen, xlbl_maxlen / 2);
                    if (xlbl === last_xlbl) {
                        sp = 0;
                        break;
                    }
                    last_xlbl = xlbl;
                }
            }
        }
        if (xTIC.dtic === 0) {
            xTIC.dtic = stk1.xmax - xTIC.dtic1 + 1.0;
        }

        var i;
        ix = 0;
        xlbl = "";
        for (x = xTIC.dtic1; x <= stk1.xmax; x = x + xTIC.dtic) {
            i = iscl + Math.round(fact * (x - stk1.xmin)) + 2;
            if (i < iscl) {
                continue;
            }
            if (flags.grid && flags.grid !== "y") {
                if (!flags.gridStyle) {
                    if (mx.LEGACY_RENDER) {
                        flags.gridStyle = {
                            mode: "dashed",
                            on: 1,
                            off: 3
                        };
                    } else {
                        flags.gridStyle = {
                            "color": Mx.xwms,
                            mode: "dashed",
                            on: 1,
                            off: 3
                        };
                    }
                }
                mx.textline(Mx, i, iscb, i, isct, flags.gridStyle);
            } else {
                mx.textline(Mx, i, iscb - 2, i, iscb + 2);
                mx.textline(Mx, i, isct - 2, i, isct + 2);
            }
            if (xticlabels) {
                if (sp) {
                    xlbl = null;
                    if (flags.xtimecode) {
                        // If we have enough space to draw the next tic label
                        if (i > ix) {
                            xlbl = m.sec2tod(x, true);
                            ix = i + (Mx.text_w * (xlbl.length + 1));
                        }
                    } else {
                        xlbl = mx.format_f(x * fmul, xlbl_maxlen, xlbl_maxlen / 2);
                        xlbl = trimlabel(xlbl, true);
                    }
                    if (xlbl) {
                        var itexti = Math.round(xlbl.length / 2) * Mx.text_w;
                        if (flags.inside) {
                            i = Math.max(iscl + itexti, i);
                            i = Math.min(iscr - itexti, i);
                        }
                        if (i - itexti >= 0) {
                            mx.text(Mx, i - itexti, jtext, xlbl);
                        }
                    }
                } else if (x === xTIC.dtic1) {
                    if (flags.xtimecode) {
                        xlbl = m.sec2tod(x, true);
                        if (flags.inside) {
                            i = Math.floor(Math.max(iscl + itext, i));
                        }
                        mx.text(Mx, i - itext, jtext, xlbl + " +\u0394 " + m.sec2tod(xTIC.dtic));
                    } else {
                        xlbl = (xTIC.dtic1 * fmul).toString();
                        if (flags.inside) {
                            i = Math.floor(Math.max(iscl + itext, i));
                        }
                        mx.text(Mx, i - itext, jtext, xlbl + " +\u0394 " + (xTIC.dtic * fmul));
                    }
                }
            }
        }

        // Add y-tick marks
        if (flags.yonright) { // TODO - yonright probably doesn't work
            if (flags.inside) {
                itext = Math.min(iscr - 6 * Mx.text_w, Mx.width - 5 * Mx.text_w);
            } else {
                itext = Math.min(iscr + Mx.text_w, Mx.width - 5 * Mx.text_w);
            }
        } else {
            if (flags.inside) {
                itext = Math.max(0, iscl + Mx.text_w);
            } else {
                itext = Math.max(0, Math.floor(iscl - (Mx.l - 0.5) * Mx.text_w));
            }
        }
        jtext = 0.4 * Mx.text_h;
        if (stk1.ymin !== stk1.ymax) {
            fact = -height / (stk1.ymax - stk1.ymin);
        } else {
            fact = -height / 1.0;
        }
        if (_ymult !== 0) {
            fmul = 1.0 / _ymult;
        } else {
            fmul = 1;
        }
        var ytic, ytic1, endtic;
        if (yTIC.dtic === 0) {
            ytic = stk1.ymax - ytic1 + 1.0;
        }
        if (stk1.ymax >= stk1.ymin) {
            endtic = function(val) {
                return (val <= stk1.ymax);
            };
        } else {
            endtic = function(val) {
                return (val >= stk1.ymax);
            };
        }
        var ylbl;
        for (var y = yTIC.dtic1; endtic(y); y = y + yTIC.dtic) {
            i = iscb + Math.round(fact * (y - stk1.ymin)) - 2;
            if (i > iscb) {
                continue;
            }
            if (flags.grid && flags.grid !== "x") {
                if (!flags.gridStyle) {
                    flags.gridStyle = {
                        mode: "dashed",
                        on: 1,
                        off: 3
                    };
                }
                mx.textline(Mx, iscl, i, iscr, i, flags.gridStyle);
            } else {
                mx.textline(Mx, iscl - 2, i, iscl + 2, i);
                mx.textline(Mx, iscr - 2, i, iscr + 2, i);
            }
            if (yticlabels) {
                // TODO
                if (flags.inside &&
                    ((i < isct + Mx.text_h) || (i > iscb - Mx.text_h * 2))) {
                    // out of range for inside labels
                } else if (flags.ytimecode) {
                    ylbl = m.sec2tod(y); // don't trim zeros because we use them later
                    // y-axis timecodes
                    // use three lines
                    // YYYY:MM:DD
                    // HH:MM
                    // SS.factional
                    var k = i + jtext - Mx.text_h;
                    var sep = ylbl.indexOf("::");
                    if (sep !== -1) {
                        if (k > isct && k < iscb) {
                            // it the label has space, draw it
                            mx.text(Mx, itext, k, ylbl.substring(0, sep));
                        }
                        sep += 1; // adjust for the next stage
                    }
                    // The draw the primary portion
                    mx.text(Mx, itext, Math.min(iscb, i + jtext), ylbl.substring(sep + 1, sep + 6));
                    // Finally the sections portion if it fits on the screen
                    // and is necessary
                    k = i + jtext + Mx.text_h;
                    if ((k > isct && k < iscb)) {
                        if (ylbl.substring(sep + 7, sep + 9) !== "00") {
                            // add the .00 which is safe to do unconditionally because
                            // we truncate on the following line and we know that
                            // sec2tod either returns no decimal places or 6 decimal places
                            ylbl = ylbl + ".00";
                            mx.text(Mx, itext, k, ylbl.substring(sep + 7, sep + 12));
                        }
                    }
                } else {
                    ylbl = mx.format_f(y * fmul, 12, 6);
                    ylbl = trimlabel(ylbl, flags.inside);
                    mx.text(Mx, itext, Math.min(iscb, i + jtext), ylbl);
                }
            }
        }
    };

    /**
     * @param x
     * @param y
     * @param rect_x
     * @param rect_y
     * @param rect_width
     * @param rect_height
     * @private
     */
    mx.inrect = function(x, y, rect_x, rect_y, rect_width, rect_height) {
        return (x >= rect_x && x <= rect_x + rect_width &&
            y >= rect_y && y <= rect_y + rect_height);
    };
    /**
     * @private
     */
    var MENU_CONSTANTS = {
        GBorder: 3,
        sidelab: 0,
        toplab: 1,
        n_show: 0
    };

    /**
     * @method _menu_redraw
     * @param Mx
     * @param menu
     * @private
     */
    function _menu_redraw(Mx, menu) {
        if (menu.animationFrameHandle) {
            return;
        }
        // Use the current mouse position and the size of the plot to determine available space
        //var mouse_pos = Mx.ypos; TODO: Use mouse position
        var plot_height = Mx.canvas.height;
        var buffer_sz = 35; // estimate of how much of the canvas is spacing around plot
        var avail_space = plot_height - 2 * buffer_sz;

        // Calculate how many menu items can fit inside that space
        var menu_item_height = Mx.text_h * 1.5;
        var n_items = Math.floor(avail_space / menu_item_height);
        if (n_items >= menu.items.length) {
            MENU_CONSTANTS.n_show = menu.items.length;
        } else {
            MENU_CONSTANTS.n_show = n_items;
        }


        menu.animationFrameHandle = requestAnimFrame(mx.withWidgetLayer(Mx, function() {
            mx.erase_window(Mx);

            menu.animationFrameHandle = undefined;
            var yb = Mx.text_h * 1.5;
            menu.x = Math.max(menu.x, 0);
            menu.y = Math.max(menu.y, 0);
            menu.x = Math.min(menu.x, Mx.width - menu.w);
            menu.y = Math.min(menu.y, Mx.height - menu.h);

            var xcc = menu.x + MENU_CONSTANTS.GBorder + Math.max(0, MENU_CONSTANTS.sidelab);
            var ycc = menu.y + MENU_CONSTANTS.GBorder + MENU_CONSTANTS.toplab * (yb + MENU_CONSTANTS.GBorder);

            var xss = menu.w - 2 * MENU_CONSTANTS.GBorder - Math.abs(MENU_CONSTANTS.sidelab);
            var yss = menu.h - 2 * MENU_CONSTANTS.GBorder - MENU_CONSTANTS.toplab * (yb + MENU_CONSTANTS.GBorder);

            mx.widgetbox(Mx, menu.x, menu.y, menu.w, menu.h, xcc, ycc, xss, yss, menu.title);

            //ctx.fillStyle = xwlo;
            //ctx.fillRect(xcc, ycc, xss, yss);

            var ctx = Mx.wid_canvas.getContext("2d");
            ctx.lineWidth = 1;

            ctx.strokeStyle = Mx.xwbs; // xwbs
            ctx.beginPath();
            ctx.moveTo(xcc, ycc - 4 + 0.5);
            ctx.lineTo(xcc + xss - 1, ycc - 4 + 0.5);
            ctx.stroke();

            ctx.strokeStyle = Mx.xwts; // xwts
            ctx.beginPath();
            ctx.moveTo(xcc, ycc - 3 + 0.5);
            ctx.lineTo(xcc + xss - 1, ycc - 3 + 0.5);
            ctx.stroke();

            var i_begin = menu.queue[0];
            var i_end = menu.queue[MENU_CONSTANTS.n_show - 1];
            if (i_end === 0) {
                // now we are starting over
                for (var q = 0; q < MENU_CONSTANTS.n_show; q++) {
                    menu.queue[q] = q;
                }
                i_begin = menu.queue[0];
                i_end = menu.queue[MENU_CONSTANTS.n_show - 1];
            }
            var menu_counter = 0;
            for (var i = i_begin; i <= i_end; i++) {
                var item = menu.items[i];
                var y = ycc + yb * menu_counter;
                menu_counter = menu_counter + 1;

                if (item.style === "separator") {
                    ctx.fillStyle = Mx.xwbs;
                    ctx.fillRect(xcc, y, xss, yb);

                    ctx.beginPath();
                    ctx.moveTo(xcc, y + 0.5);
                    ctx.lineTo(xcc + xss, y + 0.5);
                    ctx.stroke();

                    ctx.textBaseline = "middle";
                    ctx.textAlign = "left";
                    ctx.fillStyle = Mx.xwfg;
                    ctx.fillText(" " + item.text + " ", xcc + Mx.text_w * 2, y + yb / 2);
                } else {
                    if (mx.LEGACY_RENDER) {
                        ctx.fillStyle = Mx.xwlo;
                        ctx.fillRect(xcc, y, xss, yb);
                        ctx.beginPath();
                        ctx.moveTo(xcc, y + 0.5);
                        ctx.lineTo(xcc + xss, y + 0.5);
                        ctx.stroke();
                        if (item.selected) {
                            mx.shadowbox(Mx, xcc - 1, y, xss + 2, yb, 1, 2, "", 0.75);
                        }
                    } else {
                        ctx.save();
                        ctx.globalAlpha = 0.75;
                        if (item.selected) {
                            ctx.fillStyle = Mx.xwts;
                        } else {
                            ctx.fillStyle = Mx.xwlo;
                        }
                        ctx.fillRect(xcc, y, xss, yb);
                        ctx.restore();
                        ctx.strokeStyle = Mx.bg;
                        ctx.beginPath();
                        ctx.moveTo(xcc, y + 0.5);
                        ctx.lineTo(xcc + xss, y + 0.5);
                        ctx.stroke();
                    }

                    ctx.textBaseline = "middle";
                    ctx.textAlign = "left";
                    ctx.fillStyle = Mx.xwfg;
                    if (item.style === "checkbox") {
                        ctx.fillText(" " + item.text + " ", xcc + Mx.text_w * 2, y + yb / 2);
                        ctx.strokeStyle = Mx.xwfg;
                        ctx.strokeRect(xcc + 1 + Mx.text_w, y + ((yb - Mx.text_w) / 2), Mx.text_w, Mx.text_w);
                        if (item.checked) {
                            ctx.beginPath();
                            ctx.moveTo(xcc + 1 + Mx.text_w, y + ((yb - Mx.text_w) / 2));
                            ctx.lineTo(xcc + 1 + Mx.text_w + Mx.text_w, y + ((yb - Mx.text_w) / 2) + Mx.text_w);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(xcc + 1 + Mx.text_w + Mx.text_w, y + ((yb - Mx.text_w) / 2));
                            ctx.lineTo(xcc + 1 + Mx.text_w, y + ((yb - Mx.text_w) / 2) + Mx.text_w);
                            ctx.stroke();
                        }
                    } else {
                        ctx.fillText(" " + item.text + " ", xcc, y + yb / 2);

                        // draw the triangle
                        if (item.checked) {
                            ctx.beginPath();
                            ctx.moveTo(xcc + 1, y + Mx.text_h / 4);
                            ctx.lineTo(xcc + 1 + Mx.text_w - 2, y + Mx.text_h / 4 + Mx.text_h / 2);
                            ctx.lineTo(xcc + 1, y + Mx.text_h / 4 + Mx.text_h);
                            ctx.lineTo(xcc + 1, y + Mx.text_h / 4);
                            ctx.fill();
                        }
                    }
                }
            }


        }));
    }

    /**
     * @method _menu_takeaction
     * @param Mx
     * @param menu
     * @private
     */
    function _menu_takeaction(Mx, menu) {
        mx.onWidgetLayer(Mx, function() {
            mx.erase_window(Mx);
        });
        Mx.menu = undefined;
        Mx.widget = null;

        for (var i = 0; i < menu.items.length; i++) {
            var item = menu.items[i];
            if (item.selected) {
                if (item.handler) {
                    item.handler();
                } else if (item.menu) {
                    var newmenu = item.menu;
                    if (typeof item.menu === 'function') {
                        newmenu = item.menu();
                    }
                    newmenu.finalize = menu.finalize;
                    mx.menu(Mx, newmenu);
                }
                break;
            }
        }
        if ((!Mx.menu) && (menu.finalize)) {
            menu.finalize();
        }
    }

    /**
     * @method _menu_dismiss
     * @param Mx
     * @param menu
     * @private
     */
    function _menu_dismiss(Mx, menu) {
        mx.onWidgetLayer(Mx, function() {
            mx.erase_window(Mx);
        });
        Mx.menu = undefined;
        Mx.widget = null;

        if ((!Mx.menu) && (menu.finalize)) {
            menu.finalize();
        }
    }

    /**
     * @method _menu_callback
     * @param Mx
     * @param menu
     * @param event
     * @private
     */
    function _menu_callback(Mx, menu, event) {
        // Keep track of whats visible currently
        var i_begin = menu.queue[0];
        var i_end = menu.queue[MENU_CONSTANTS.n_show - 1];
        if (event === undefined) {
            // no event, just refresh the menu
            _menu_redraw(Mx, menu);
        } else if (event.type === "mousemove") {
            // Update position
            if (menu.drag_x !== undefined && menu.drag_y !== undefined && Math.abs(Mx.xpos - menu.drag_x) > 2 && Math.abs(Mx.ypos - menu.drag_y) > 2) {
                menu.x += Mx.xpos - menu.drag_x;
                menu.y += Mx.ypos - menu.drag_y;
                menu.drag_x = Mx.xpos;
                menu.drag_y = Mx.ypos;
            }

            // All of these variables suck and are common in other places...refactoring is necessary
            var xcc = menu.x + MENU_CONSTANTS.GBorder + Math.max(0, MENU_CONSTANTS.sidelab);
            var xss = menu.w - 2 * MENU_CONSTANTS.GBorder - Math.abs(MENU_CONSTANTS.sidelab);
            var yb = Mx.text_h * 1.5;
            var ycc = menu.y + MENU_CONSTANTS.GBorder + MENU_CONSTANTS.toplab * (yb + MENU_CONSTANTS.GBorder);

            for (var i = i_begin; i <= i_end; i++) {
                var y = ycc + yb * i;
                var item = menu.items[i];
                item.selected = false;
                if (mx.inrect(Mx.xpos, Mx.ypos, xcc, y, xss, yb)) {
                    item.selected = true;
                }
            }
            _menu_redraw(Mx, menu);
        } else if (event.type === "mouseup") {
            // No longer dragging menu
            if (event.which === 1) {
                if ((menu.drag_x !== undefined) && (menu.drag_y !== undefined)) {
                    menu.drag_x = undefined;
                    menu.drag_y = undefined;
                } else {
                    _menu_takeaction(Mx, menu);
                }
            } else if (event.which === 3) {
                _menu_dismiss(Mx, menu);
            }
        } else if (event.type === "mousedown") {
            event.preventDefault();
            if (event.which === 1) {
                if (Mx.xpos > menu.x && Mx.xpos < (menu.x + menu.w) && Mx.ypos > menu.y && Mx.ypos < (menu.y + Mx.text_h * 1.5)) {
                    menu.drag_x = Mx.xpos;
                    menu.drag_y = Mx.ypos;
                }
            } else if (event.which === 2) {
                _menu_takeaction(Mx, menu);
            }
        } else if (event.type === "keydown") {
            // Remember that keydown triggers periodically while a key is held
            if (Mx.menu) {
                var menu = Mx.menu;
                event.preventDefault();
                var keyCode = common.getKeyCode(event);
                if (keyCode === 13) { // enter
                    _menu_takeaction(Mx, menu);
                } else if (keyCode === 38) { // up arrow
                    for (var i = i_begin; i < i_end; i++) {
                        var item = menu.items[i];
                        if (item.selected) {
                            item.selected = false;
                            if (menu.items[i - 1] !== undefined) {
                                menu.items[i - 1].selected = true;
                            }
                            break;
                        } else if (i === i_begin && i_begin !== 0) {
                            // we are at the end of the list and nothing was selected so pick the last element
                            //item.selected = true;
                            menu.queue.pop();
                            menu.queue.unshift(i_begin - 1);
                            _menu_redraw(Mx, menu);
                            menu.items[i_end - 1].selected = true;

                        } else if (i_begin === 0 && menu.items[i_begin].selected === true) {
                            _menu_redraw(Mx, menu);
                            menu.items[0].selected = true;
                        }
                    }
                    _menu_redraw(Mx, menu);
                } else if (keyCode === 40) { // down arrow
                    for (var i = i_begin; i < i_end; i++) {
                        var item = menu.items[i];
                        if (item.selected) {
                            item.selected = false;
                            if (menu.items[i + 1] !== undefined) {
                                menu.items[i + 1].selected = true;
                            }
                            break;
                        } else if (i === (i_end - 1)) {
                            // nothing was selected so select the top
                            var next_item = i_end + 1;

                            if (i_end + 1 === menu.items.length) {
                                next_item = 0;
                            }

                            menu.queue.shift();
                            menu.queue.push(next_item);
                            menu.items[i_end].selected = false;
                            menu.items[next_item].selected = true;
                            _menu_redraw(Mx, menu);
                        }
                    }
                    _menu_redraw(Mx, menu);
                } else if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90)) {
                    var inp = String.fromCharCode(keyCode).toUpperCase();

                    if (menu.keypresses === undefined) {
                        menu.keypresses = inp;
                    } else {
                        menu.keypresses = menu.keypresses + inp;
                    }

                    var matches = 0;
                    for (var i = 0; i < menu.items.length; i++) {
                        var item = menu.items[i];
                        item.selected = false;
                        if (!item.text) {
                            continue;
                        }

                        if (item.text.toUpperCase().indexOf(menu.keypresses) === 0) {
                            if (matches === 0) {
                                item.selected = true;
                            }
                            matches++;
                        }
                    }

                    if (matches === 0) {
                        menu.keypresses = undefined;
                        _menu_redraw(Mx, menu);
                    } else if (matches === 1) {
                        _menu_takeaction(Mx, menu);
                    } else {
                        _menu_redraw(Mx, menu);
                    }
                }
            }
        }
    }

    /**
     * @param Mx
     * @param menu
     * @private
     */
    mx.menu = function(Mx, menu) {
        var yb = Mx.text_h * 1.5;
        //MENU_CONSTANTS.n_show = menu.items.length;

        var plot_height = Mx.canvas.height;
        var buffer_sz = 35; // estimate of how much of the canvas is spacing around plot
        var avail_space = plot_height - 2 * buffer_sz;
        // Calculate how many menu items can fit inside that space
        var menu_item_height = Mx.text_h * 1.5;
        var n_items = Math.floor(avail_space / menu_item_height);
        if (n_items >= menu.items.length) {
            MENU_CONSTANTS.n_show = menu.items.length;
        } else {
            MENU_CONSTANTS.n_show = n_items;
        }

        if (menu) {
            if (!Mx.widget) {
                menu.x = Mx.xpos;
                menu.y = Mx.ypos;
                menu.val = 0;

                menu.h = MENU_CONSTANTS.GBorder * 2 + yb * MENU_CONSTANTS.n_show + MENU_CONSTANTS.toplab * (yb + MENU_CONSTANTS.GBorder) - 1;
                menu.y = menu.y - ((MENU_CONSTANTS.toplab + (Math.max(1, menu.val)) - 0.5) * yb + (1 + MENU_CONSTANTS.toplab) * MENU_CONSTANTS.GBorder) + 1;

                var xb = menu.title.length;
                var yadj = 0;
                for (var i = 0; i < menu.items.length; i++) {
                    var item = menu.items[i];
                    xb = Math.max(xb, item.text.length);
                    if (item.style === "checkbox") {
                        xb += 2;
                    }
                    if (item.style === "separator") {
                        xb += 2;
                    }
                    if (item.checked && item.style !== "checkbox") {
                        yadj = yb * i;
                    }
                }

                menu.queue = [];

                for (var q = 0; q < MENU_CONSTANTS.n_show; q++) {
                    menu.queue.push(q);

                }

                menu.y = menu.y - yadj;
                xb += 2;
                xb = xb * Mx.text_w;

                menu.w = MENU_CONSTANTS.GBorder * 2 + Math.abs(MENU_CONSTANTS.sidelab) + xb - 1;
                menu.x = menu.x - menu.w / 2;

                Mx.menu = menu;

                Mx.widget = {
                    type: "MENU",
                    callback: function(event) {
                        _menu_callback(Mx, menu, event);
                    }
                };
            }
            _menu_redraw(Mx, menu);
        }
    };

    /**
     * @param Mx
     * @param x
     * @param y
     * @param w
     * @param h
     * @param inx
     * @param iny
     * @param inw
     * @param inh
     * @param name
     * @private
     */
    mx.widgetbox = function(Mx, x, y, w, h, inx, iny, inw, inh, name) {
        var GBorder = 3;
        mx.shadowbox(Mx, x, y, w, h, 1, 2, "", 0.75);
        if (name) {
            var length = name.length;
            length = Math.min(length, w / Mx.text_w);
            length = Math.max(length, 1);
            var xt = x + (w - length * Mx.text_w) / 2;
            y += GBorder;
            var yt = y + (iny - y + 0.7 * Mx.text_h) / 2;

            mx.text(Mx, xt, yt, name, Mx.xwfg);
        }
        if (inw > 0 && inh > 0) {
            var ctx = Mx.active_canvas.getContext("2d");
            if (mx.LEGACY_RENDER) {
                ctx.fillStyle = Mx.bg;
                ctx.fillRect(inx, iny, inw, inh);
            } else {
                ctx.save();
                ctx.globalAlpha = 0.1;
                ctx.fillStyle = Mx.bg;
                ctx.fillRect(inx, iny, inw, inh);
                ctx.restore();
            }
        }
    };

    /**
     * @param Mx
     * @param x
     * @param y
     * @param lbl
     * @param color
     * @private
     */
    //
    // ~= MX$TEXT
    //
    mx.text = function(Mx, x, y, lbl, color) {
        var ctx = Mx.active_canvas.getContext("2d");

        x = Math.max(0, x);
        y = Math.max(0, y);
        if ((x < 0) || (y < 0)) {
            throw "On No!";
        }
        ctx.textBaseline = "bottom";
        ctx.textAlign = "left";
        ctx.font = Mx.font.font;
        if (color === undefined) {
            ctx.fillStyle = Mx.fg;
        } else {
            ctx.fillStyle = color;
        }

        ctx.fillText(lbl, x, y);
    };

    /**
     * @method clipt
     * @param denom
     * @param num
     * @param o
     * @private
     */
    // ~= glibf1.for CLIPT
    function clipt(denom, num, o) {
        var accept = true;
        var t;

        t = num / denom;
        if (denom > 0) {
            if (t > o.tL) {
                accept = false;
            } else if (t > o.tE) {
                o.tE = t;
            }
        } else if (denom < 0) {
            if (t < o.tE) {
                accept = false;
            } else if (t < o.tL) {
                o.tL = t;
            }
        } else {
            if (num > 0) {
                accept = false;
            }
        }

        return accept;
    }

    /**
     * Method which draws a line in a graphics context.
     * In the graphics context provided, draws a line.
     * Mimics XLib's XDrawLines method in at least the basic functionality.
     * @method draw_line
     * @param ctx
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param style
     * @param color
     * @param width
     * @private
     */
    function draw_line(ctx, x1, y1, x2, y2, style, color, width) {
        // For odd width lines (i.e. 1,3,5...) if you draw right
        // on the pixel boundry the canvas will actually draw a slightly
        // grey line 2 px wide.  You have to add .5 to get what you want.

        // Handle boundary cases - instead of throwing an exception, just bound
        // the value to 0
        if (x1 < 0) {
            x1 = 0;
        }
        if (y1 < 0) {
            y1 = 0;
        }
        if (x2 < 0) {
            x2 = 0;
        }
        if (y2 < 0) {
            y2 = 0;
        }

        if (width) {
            ctx.lineWidth = width;
        }
        if (color) {
            ctx.strokeStyle = color;
        }

        if (ctx.lineWidth % 2 === 1) {
            if (x1 === x2) {
                x1 = Math.floor(x1) + 0.5;
                x2 = x1;
            }
            if (y1 === y2) {
                y1 = Math.floor(y1) + 0.5;
                y2 = y1;
            }
        }

        if (!style || !style.mode) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
        } else if (style.mode === "dashed") {
            var dash_supported = common.dashOn(ctx, style.on, style.off);
            if (dash_supported) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                common.dashOff(ctx);
                ctx.beginPath();
            } else {
                // Fallback that only supports vertical/horizontal
                ctx.beginPath();
                if (y1 === y2) {
                    var x = Math.min(x1, x2);
                    x2 = Math.max(x1, x2);
                    while (x < x2) {
                        ctx.moveTo(x, y1);
                        ctx.lineTo(x + style.on, y1);
                        ctx.stroke();
                        x += (style.on + style.off);
                    }
                } else if (x1 === x2) {
                    // vertical line
                    var y = Math.min(y1, y2);
                    y2 = Math.max(y1, y2);
                    while (y < y2) {
                        ctx.moveTo(x1, y);
                        ctx.lineTo(x1, y + style.on);
                        ctx.stroke();
                        y += (style.on + style.off);
                    }
                } else {
                    throw "Only horizontal or vertical dashed lines are supported";
                }
                ctx.beginPath();
            }
        } else if (style.mode === "xor") {
            if (typeof Uint8ClampedArray === 'undefined') {
                // we don't have typed arrays, so canvas getImageData operations
                // will be very slow, so use color instead
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.beginPath();
            } else {
                // currently xor-style is only supported for horizontal or vertical lines
                var w = 0;
                var h = 0;
                if (y1 === y2) {
                    w = Math.abs(x2 - x1);
                    h = width;
                    x1 = Math.min(x1, x2);
                } else if (x1 === x2) {
                    w = width;
                    h = Math.abs(y2 - y1);
                    y1 = Math.min(y1, y2);
                } else {
                    throw "Only horizontal and vertical lines can be drawn with XOR";
                }

                if ((w === 0) || (h === 0)) {
                    return;
                }

                x1 = Math.floor(x1);
                y1 = Math.floor(y1);
                var imgd = ctx.getImageData(x1, y1, w, h);
                var pix = imgd.data;
                // Loop over each pixel and invert the color.
                for (var i = 0, n = pix.length; i < n; i += 4) {
                    pix[i] = 255 - pix[i]; // red
                    pix[i + 1] = 255 - pix[i + 1]; // green
                    pix[i + 2] = 255 - pix[i + 2]; // blue
                    pix[i + 3] = 255; // opacity
                }
                ctx.putImageData(imgd, x1, y1);
                ctx.clearRect(0, 0, 1, 1);
            }
        }
    }

    /**
     * Method which draws a polygon in a graphics context.
     * In the graphics context provided, draws a polygon.
     * Mimics XLib's XDrawLines method in at least the basic functionality.
     * @method draw_poly
     * @param ctx - The graphics context to draw in
     * @param pix - Defined as [\{"x": xval, y: "y": yval\}, \{"x": xval, "y":yval\}...].
     *              xval and yval represent their respective coordinate values in the tuples
     *				number of points in the structure can be retrieved via pix.length.
     * @param color - The color of the rectangle
     * @param width - The line width to set.
     * @private
     */
    function draw_poly(ctx, pix, color, width) { // TODO Should this be a public method?
        start_poly(ctx, pix, width);

        if (color) {
            ctx.strokeStyle = color;
        }

        ctx.stroke(); // draw the shape outlined in the path
        ctx.closePath();
    }

    /**
     * Method which draws a filled polygon in a graphics context.
     * In the graphics context provided draws a polygon, then fills it.
     * Mimics XLib's XFillPolygon method in at least the basic functionality.
     * Some differences between this and Xlib's method are:
     *  -no way to specify convex/non-convex
     *  -no way to specify CoordModeOrigin
     *  -no need to specify the number of points to draw (plots all points in pix)
     * @method fill_poly
     * @param ctx - The graphics context to draw in
     * @param pix - Defined as [\{"x": xval, y: "y": yval\}, \{"x": xval, "y":yval\}...].
     *              xval and yval represent their respective coordinate values in the tuples
     *				number of points in the structure can be retrieved via pix.length.
     * @param lineColor - The line color of the polygon
     * @param fillColor - The fill color of the polygon
     * @param lineWidth - The line width to set
     * @private
     */
    function fill_poly(ctx, pix, lineColor, fillColor, width) { // TODO Should this be a public method?
        start_poly(ctx, pix, width);

        if (lineColor) {
            ctx.strokeStyle = lineColor;
        }
        if (fillColor) {
            ctx.fillStyle = fillColor;
        }

        ctx.fill(); // fill in the shape only, no outline drawn
        ctx.closePath();
    }

    /**
     * Helper method which starts drawing a polygon in a graphics context.
     * In the graphics context provided, begins a path at the first point in pix,
     * then draws lines from each point in pix to the next. It also sets the width
     * of the line.
     * @method start_poly
     * @param ctx - The graphics context to draw in
     * @param pix - Defined as [\{"x": xval, y: "y": yval\}, \{"x": xval, "y":yval\}...].
     *              xval and yval represent their respective coordinate values in the tuples
     *				number of points in the structure can be retrieved via pix.length.
     * @param width - The line width to set.
     * @private
     */
    function start_poly(ctx, pix, width) {
        if (pix.length < 1) {
            return;
        }

        var x = pix[0].x;
        var y = pix[0].y;

        if (width) {
            ctx.lineWidth = width;
        } else {
            ctx.lineWidth = 1; // Default
        }

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (var i = 0; i < pix.length; i++) {
            x = pix[i].x;
            y = pix[i].y;
            ctx.lineTo(x, y);
        }
    }

    /**
     * Method which draws a rectangle (hollowed) in a graphics context.
     * In the graphics context provided, draws a hollow rectangle.
     * Mimics XLib's XDrawRectangle method in at least the basic functionality.
     * @method draw_rectangle
     * @param ctx - The graphics context to draw in
     * @param x - The x coordinate
     * @param y - The y coordinate
     * @param width - The width of the rectangle
     * @param height - The height of the rectangle
     * @param color - The color of the rectangle
     * @param lineWidth - The line width to set.
     * @private
     */
    function draw_rectangle(ctx, x, y, width, height, color, lineWidth) { // TODO Should this be a public method?
        if (lineWidth) {
            ctx.lineWidth = lineWidth;
        }
        if (color) {
            ctx.strokeStyle = color;
        }

        ctx.strokeRect(x, y, width, height);
    }

    /**
     * Method which draws a rectangle (filled) in a graphics context.
     * In the graphics context provided, draws a filled rectangle.
     * Mimics XLib's XFillRectangle method in at least the basic functionality.
     * @method fill_rectangle
     * @param ctx - The graphics context to draw in
     * @param x - The x coordinate
     * @param y - The y coordinate
     * @param width - The width of the rectangle
     * @param height - The height of the rectangle
     * @param fillColor - The fill color of the rectangle
     * @param strokeColor - The line color of the rectangle
     * @param lineWidth - The line width to set.
     * @private
     */
    function fill_rectangle(ctx, x, y, width, height, fillColor, strokeColor, lineWidth) { // TODO Should this be a public method?
        if (lineWidth) {
            ctx.lineWidth = lineWidth;
        }
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
        }
        if (fillColor) {
            ctx.fillStyle = fillColor;
        }

        ctx.fillRect(x, y, width, height);
    }

    /**
     * @method pc2px
     * @param perc
     * @private
     */
    function pc2px(perc) {
        return Math.floor(Math.round(255 * (perc / 100)));
    }

    /**
     * @method to_rgb
     * @param red
     * @param green
     * @param blue
     * @private
     */
    function to_rgb(red, green, blue) {
        return "rgb(" + Math.round(red) + ", " + Math.round(green) + ", " + Math.round(blue) + ")";
    }

    /**
     *
     * Instead of dealing with color tables and stuff, all we really need
     * is the ability to on-the-fly generate a color from the map
     * @param Mx
     * @param map
     * @param z
     * @private
     */
    mx.getcolor = function(Mx, map, z) {
        var iz = 0;
        for (; iz < 6 && map[iz + 1].pos === 0; iz++) {}

        while (z > map[iz].pos && iz < 6) {
            iz++;
        }
        if ((iz === 0) || (z >= map[iz].pos)) {
            // above, below, or directly on boundry
            return to_rgb(
                pc2px(map[iz].red),
                pc2px(map[iz].green),
                pc2px(map[iz].blue));
        } else {
            // interpolation my dear watson
            var pf = (z - map[iz - 1].pos) / (map[iz].pos - map[iz - 1].pos);
            var zf = pc2px(pf * 100);
            var zf1 = 255 - zf;
            return to_rgb(
                (zf * (map[iz].red / 100) + zf1 * (map[iz - 1].red / 100)), (zf * (map[iz].green / 100) + zf1 * (map[iz - 1].green / 100)), (zf * (map[iz].blue / 100) + zf1 * (map[iz - 1].blue / 100)));
        }
    };

    /**
     * @method trimlabel
     * @param lbl
     * @param inside
     * @private
     */
    // ~= glibf1.for TRIMLABEL
    function trimlabel(lbl, inside) {
        var k;
        var j;
        if (lbl.substring(5, 8) === ".000000") { // this line seems to always evaluate to false
            k = 4;
        } else {
            k = lbl.length - 1;
            while (lbl[k] === "0") {
                k = k - 1;
            }
        }
        j = 0;
        while ((lbl[j] === " ") && ((k - j + 1 > 5) || inside)) {
            j = j + 1;
        }
        var res = lbl.substring(j, k + 1);
        if (res.indexOf(".") === -1) {
            res += ".";
        }
        return res;
    }

    /**
     * @param Mx
     * @private
     */
    mx.redraw_warpbox = function(Mx) {
        if (Mx.warpbox) {
            if (Mx._animationFrameHandle) {
                cancelAnimFrame(Mx._animationFrameHandle);
            }
            Mx._animationFrameHandle = requestAnimFrame(function() {
                display_warpbox(Mx);
            });
        }
    };

    /**
     * @method display_warpbox
     * @param Mx
     * @private
     */
    function display_warpbox(Mx) {
        Mx._animationFrameHandle = undefined;
        var warpbox = Mx.warpbox;
        var ctx = Mx.active_canvas.getContext("2d");

        if (!warpbox) {
            return;
        }

        if (((Mx.xpos >= warpbox.xmin) && (Mx.xpos <= warpbox.xmax)) &&
            ((Mx.ypos >= warpbox.ymin) && (Mx.ypos <= warpbox.ymax))) {

            // Update the position
            warpbox.xl = Mx.xpos;
            warpbox.yl = Mx.ypos;

            // Draw the current box
            var x = Math.min(warpbox.xo, warpbox.xl);
            var y = Math.min(warpbox.yo, warpbox.yl);
            var w = Math.abs(warpbox.xl - warpbox.xo);
            var h = Math.abs(warpbox.yl - warpbox.yo);

            if ((w === 0) || (h === 0)) {
                // Nothing to draw
                return;
            }

            if (warpbox.mode === "vertical") {
                x = Mx.l;
                w = Mx.r - Mx.l;
            } else if (warpbox.mode === "horizontal") {
                y = Mx.t;
                h = Mx.b - Mx.t;
            } // else box

            mx.onWidgetLayer(Mx, function() {
                mx.erase_window(Mx);
                mx.draw_box(Mx, "xor", x, y, w, h, warpbox.style.opacity, warpbox.style.fill_color);
            });
        }

    }

    /**
     * @method log10
     * @param val
     * @private
     */
    function log10(val) {
        return Math.log(val) / Math.log(10);
    }


    /**
     * Attempts to format a number in the same manner
     * as the FORTRAN format code 1p1g16.9
     * 1p1g16.9
     * 16 character fields
     * 9 for decimals
     * 3 for exponent (E)
     * 1 for sign
     * 1 for starting 0
     * 1 for decimal point
     * 1 for blank space
     *
     * The E format code is used for scientific (exponential) notation.
     * The value is rounded to d decimal positions and right-justified
     * into an external field that is w characters wide. The value of w
     * must be large enough to include a minus sign when necessary, at least
     * one digit to the left of the decimal point, the decimal point,
     * d digits to the right of the decimal point, a plus or minus sign for
     * the exponent, the character "e" or "E", and at least two characters for the exponent.
     *
     * The G format code uses the F output style when reasonable and
     * E for other values, but displays exactly d significant digits
     * rather than d digits following the decimal point.
     *
     * @param num
     * @param w
     * @param d
     * @param leading_nonzer
     * @private
     */
    mx.format_g = function(num, w, d, leading_nonzero) {
        var w = Math.min(w, d + 7);
        var f = Math.abs(num).toString();

        var decloc = f.indexOf(".");
        // If there is no decimal point, add one at the end.
        if (decloc === -1) {
            f = f + ".";
            decloc = f.length;
        }

        var exp = 0;
        var eloc = f.indexOf("e");
        // If there is already an 'e' in the string parse it out
        if (eloc !== -1) {
            exp = parseInt(f.slice(eloc + 1, f.length), 10);
            f = f.slice(0, eloc);
        }

        // Add zero's to the end if necessary
        var dz = Math.min(d - (f.length - decloc) + 1, d);
        for (var i = 0; i < dz; i++) {
            f = f + "0";
        }

        if (num !== 0) {
            if (Math.abs(num) < 1.0) {
                if (f.slice(0, 2) === "0.") {
                    // Shift to the left until the first number is non-zero
                    for (var i = 2; i < f.length; i++) {
                        if (f[i] === "0") {
                            exp -= 1;
                        } else {
                            f = "0." + f.slice(i, i + d);
                            break;
                        }
                    }
                } else {
                    f = f.slice(0, d + 2);
                }
            } else if (decloc > d) {
                var exp = Math.max(0, decloc - 1);
                f = f[0] + "." + f.slice(1, d + 1);
            } else {
                f = f.slice(0, d + 2);
            }
        }

        if (exp === 0) {
            f = f + "    ";
        } else {
            var e = mx.pad(Math.abs(exp).toString(), 2, "0");
            if (exp < 0) {
                f = f + "E-" + e;
            } else {
                f = f + "E+" + e;
            }
        }

        if (num < 0) {
            f = "-" + f;
        } else {
            f = " " + f;
        }
        return f;
    };

    /**
     *
     * Behave like fortran format code
     * fs.d
     * @param num the number to format
     * @param s the width of digits
     * @param d number of digits after the decimal
     * @private
     */
    mx.format_f = function(num, s, d) {
        d = Math.max(Math.min(d, 20), 0);
        var f = num.toFixed(d).toString();
        f = mx.pad(f, (s + d), " ");
        return f;
    };

    /**
     * @param s
     * @param size
     * @param c
     * @private
     */
    mx.pad = function(s, size, c) {
        while (s.length < size) {
            s = c + s;
        }
        return s;
    };

    /**
     * @param Mx
     * @param x
     * @param y
     * @param w
     * @param h
     * @param shape
     * @param func
     * @param label
     * @private
     */
    // ~= MX$SHADOWBOX
    mx.legacy_shadowbox = function(Mx, x, y, w, h, shape, func, label) {
        var length = label.length; // Original method declaration includes a length - but it only represents the length of the label

        var xt = 0; // Originally an int
        var yt = 0; // Originally an int
        var bw = 0; // Originally an int

        var pix = []; // Originally declared as a size 11 XPoint array
        for (var cnt = 0; cnt < 11; cnt++) { // initializing 11 points in the array
            pix[cnt] = {
                x: 0,
                y: 0
            };
        }

        var fill = !(func === 1 || func === -1); // Originally a bool

        // Removed the G.BW section - since we don't need to support black & white displays

        var j = (shape === mx.L_ArrowLeft || shape === mx.L_ArrowUp) ? 1 : 2;

        if (func !== 0 && mx.GBorder > 0) {
            bw = m.trunc(Math.min(w, h) / 3);
            bw = Math.max(1, Math.min(bw, mx.GBorder));
        }

        if (bw > 0) {
            /* outer shape */
            pix[0].x = pix[1].x = x;
            pix[8].x = pix[9].x = x + w;
            pix[1].y = pix[8].y = y;
            pix[0].y = pix[9].y = y + h;

            switch (shape) {
                case mx.L_ArrowLeft:
                    pix[0].y = pix[1].y = y + m.trunc(h / 2);
                    x += 2;
                    --w;
                    break;
                case mx.L_ArrowRight:
                    pix[8].y = pix[9].y = y + m.trunc(h / 2);
                    --x;
                    --w;
                    break;
                case mx.L_ArrowUp:
                    pix[1].x = pix[8].x = x + m.trunc(w / 2);
                    y += 2;
                    --h;
                    break;
                case mx.L_ArrowDown:
                    pix[0].x = pix[9].x = x + m.trunc(w / 2);
                    --y;
                    --h;
                    break;
            }
            pix[2] = pix[8];
            pix[10] = pix[0];

            x += bw;
            y += bw;
            w -= 2 * bw;
            h -= 2 * bw;
        }

        /* inner shape */
        pix[4].x = pix[5].x = x;
        pix[3].x = pix[6].x = x + w;
        pix[3].y = pix[4].y = y;
        pix[5].y = pix[6].y = y + h;
        switch (shape) {
            case mx.L_ArrowLeft:
                pix[4].y = pix[5].y = y + m.trunc(h / 2);
                break;
            case mx.L_ArrowRight:
                pix[3].y = pix[6].y = y + m.trunc(h / 2);
                break;
            case mx.L_ArrowUp:
                pix[3].x = pix[4].x = x + m.trunc(w / 2);
                break;
            case mx.L_ArrowDown:
                pix[5].x = pix[6].x = x + m.trunc(w / 2);
                break;
        }
        pix[7] = pix[3];

        var ctx = Mx.active_canvas.getContext("2d");

        if (bw > 0) {
            ctx.fillStyle = (func > 0) ? Mx.xwts : Mx.xwbs; // Set foreground color
            fill_poly(ctx, pix.slice(0, 7));
            //	if (shape !== 1) { draw_poly(ctx, pix.slice(0,7)); } // TODO what shape is this neccessary with - causes an issue with arrows

            ctx.fillStyle = (func < 0) ? Mx.xwts : Mx.xwbs; // Set foreground color
            fill_poly(ctx, pix.slice(5, 11));
            //if (shape !== 1) { draw_poly(ctx, pix.slice(5, 11)); } // TODO what shape is this neccessary with - causes an issue with arrows
        }

        if (fill) {
            ctx.fillStyle = Mx.xwbg; // Set foreground color
            fill_poly(ctx, pix.slice(3, 8));
            //if (shape !== 1) { draw_poly(ctx, pix.slice(3, 8)); } // TODO what shape is this neccessary with - causes an issue with arrows
        }

        ctx.fillStyle = Mx.xwfg; // Set foreground color
        ctx.textBaseline = "alphabetic"; // Reset vertical text alignment

        if (fill && length > 0) {
            length = Math.min(length, m.trunc(w / Mx.text_w));
            length = Math.max(length, 1);
            xt = x + m.trunc((w - length * Mx.text_w) / 2);
            yt = y + m.trunc((h + 0.7 * Mx.text_h) / 2);
            ctx.fillText(label, xt, yt); // Draw a string
        }
    };

    /**
     * @param Mx
     * @param x
     * @param y
     * @param w
     * @param h
     * @param shape
     * @param func
     * @param label
     * @private
     */
    // ~= MX$SHADOWBOX
    mx.sigplot_shadowbox = function(Mx, x, y, w, h, shape, func, label, alpha) {
        var ctx = Mx.active_canvas.getContext("2d");

        var length = label.length; // Original method declaration includes a length - but it only represents the length of the label

        var color = (func < 0) ? Mx.xwts : Mx.xwbs;

        alpha = alpha || 1.0;

        var pix = []; // Originally declared as a size 11 XPoint array
        for (var cnt = 0; cnt < 11; cnt++) { // initializing 11 points in the array
            pix[cnt] = {
                x: 0,
                y: 0
            };
        }


        switch (shape) {
            case mx.L_ArrowLeft:
            case mx.L_ArrowRight:
            case mx.L_ArrowUp:
            case mx.L_ArrowDown:
                var pix = mx.chevron(shape, x, y, w, h);
                ctx.fillStyle = (func > 0) ? Mx.xwts : Mx.xwbs;
                fill_poly(ctx, pix.slice(0, 6));
                break;
            default:
                mx.draw_round_box(Mx, color, x, y, w, h, alpha, Mx.xwbg, 5, Mx.xwbs);
                break;
        }

        ctx.fillStyle = Mx.xwfg; // Set foreground color
        ctx.textBaseline = "alphabetic"; // Reset vertical text alignment

        var fill = !(func === 1 || func === -1); // Originally a bool
        if (fill && length > 0) {
            length = Math.min(length, m.trunc(w / Mx.text_w));
            length = Math.max(length, 1);
            var xt = x + m.trunc((w - length * Mx.text_w) / 2);
            var yt = y + m.trunc((h + 0.7 * Mx.text_h) / 2);
            ctx.fillText(label, xt, yt); // Draw a string
        }
    };

    if (mx.LEGACY_RENDER) { // TODO new-style conditional
        mx.shadowbox = mx.legacy_shadowbox;
    } else {
        mx.shadowbox = mx.sigplot_shadowbox;
    }

    mx.chevron = function(shape, x, y, w, h, e) {
        // Figure out the largest square dimension
        var q = Math.min(w, h);

        // if the edge width isn't provided use a decent one
        if (!e) {
            e = q * 0.25;
        }



        // Initialize the pixel array
        var pix = [];
        for (var cnt = 0; cnt < 6; cnt++) { // initializing 11 points in the array
            pix[cnt] = {
                x: 0,
                y: 0
            };
        }


        var x_offset = m.trunc(((w - q) / 2) + (q / 4) - (e / (2 * 1.414)));
        var y_offset = m.trunc(((h - q) / 2) + (q / 4) - (e / (2 * 1.414)));
        switch (shape) {
            case mx.L_ArrowLeft:
                // Chevron points from the tip around the edge clockwise
                pix[0].x = x + x_offset;
                pix[0].y = y + m.trunc(q / 2);
                pix[1].x = x + x_offset + m.trunc(q / 2);
                pix[1].y = y;
                pix[2].x = x + x_offset + m.trunc((q / 2) + (e / 1.414));
                pix[2].y = y + m.trunc(e / 1.414);
                pix[3].x = x + x_offset + m.trunc((2 * e) / 1.414);
                pix[3].y = y + m.trunc(q / 2);
                pix[4].x = x + x_offset + m.trunc((q / 2) + (e / 1.414));
                pix[4].y = y + h - m.trunc(e / 1.414);
                pix[5].x = x + x_offset + m.trunc(q / 2);
                pix[5].y = y + q;
                break;
            case mx.L_ArrowRight:
                // Chevron points from the tip around the edge clockwise
                pix[0].x = x + w - x_offset;
                pix[0].y = y + m.trunc(q / 2);
                pix[1].x = x + w - x_offset - m.trunc(q / 2);
                pix[1].y = y;
                pix[2].x = x + w - x_offset - m.trunc((q / 2) + (e / 1.414));
                pix[2].y = y + m.trunc(e / 1.414);
                pix[3].x = x + w - x_offset - m.trunc((2 * e) / 1.414);
                pix[3].y = y + m.trunc(q / 2);
                pix[4].x = x + w - x_offset - m.trunc((q / 2) + (e / 1.414));
                pix[4].y = y + h - m.trunc(e / 1.414);
                pix[5].x = x + w - x_offset - m.trunc(q / 2);
                pix[5].y = y + q;
                break;
            case mx.L_ArrowUp:
                // Chevron points from the tip around the edge counter-clockwise
                pix[0].x = x + m.trunc(q / 2);
                pix[0].y = y + y_offset;
                pix[1].x = x;
                pix[1].y = y + y_offset + m.trunc(q / 2);
                pix[2].x = x + m.trunc(e / 1.414);
                pix[2].y = y + y_offset + m.trunc((q / 2) + (e / 1.414));
                pix[3].x = x + m.trunc(q / 2);
                pix[3].y = y + y_offset + m.trunc((2 * e) / 1.414);
                pix[4].x = x + w - m.trunc(e / 1.414);
                pix[4].y = y + y_offset + m.trunc((q / 2) + (e / 1.414));
                pix[5].x = x + q;
                pix[5].y = y + y_offset + m.trunc(q / 2);
                break;
            case mx.L_ArrowDown:
                // Chevron points from the tip around the edge counter-clockwise
                pix[0].x = x + m.trunc(q / 2);
                pix[0].y = y + h - y_offset;
                pix[1].x = x;
                pix[1].y = y + h - y_offset - m.trunc(q / 2);
                pix[2].x = x + m.trunc(e / 1.414);
                pix[2].y = y + h - y_offset - m.trunc((q / 2) + (e / 1.414));
                pix[3].x = x + m.trunc(q / 2);
                pix[3].y = y + h - y_offset - m.trunc((2 * e) / 1.414);
                pix[4].x = x + w - m.trunc(e / 1.414);
                pix[4].y = y + h - y_offset - m.trunc((q / 2) + (e / 1.414));
                pix[5].x = x + q;
                pix[5].y = y + h - y_offset - m.trunc(q / 2);
                break;
        }

        return pix;
    };

    /**
     * @param Mx
     * @param mouseEvent
     * @private
     */
    // ~= mx_ifevent
    mx.ifevent = function(Mx, mouseEvent) {
        Mx.button_press = 0;
        Mx.button_release = 0;
        Mx.state_mask = 0;

        var rect = mouseEvent.target.getBoundingClientRect();
        var eventXPos = (mouseEvent.offsetX === undefined) ? (mouseEvent.pageX - rect.left - window.scrollX) : mouseEvent.offsetX;
        var eventYPos = (mouseEvent.offsetX === undefined) ? (mouseEvent.pageY - rect.top - window.scrollY) : mouseEvent.offsetY;

        //		var eventXPos = (mouseEvent.offsetX === undefined) ? mouseEvent.layerX : mouseEvent.offsetX;
        //		var eventYPos = (mouseEvent.offsetY === undefined) ? mouseEvent.layerY : mouseEvent.offsetY;

        switch (mouseEvent.type) {
            case "mousedown":
                Mx.xpos = m.bound(eventXPos, 0, Mx.width);
                Mx.ypos = m.bound(eventYPos, 0, Mx.height);
                switch (mouseEvent.which) {
                    case 1:
                        Mx.button_press = 1;
                        break;
                    case 2:
                        Mx.button_press = 2;
                        break;
                    case 3:
                        Mx.button_press = 3;
                        break;
                    case 4:
                        Mx.button_press = 4;
                        break;
                    case 5:
                        Mx.button_press = 5;
                }
                //Mx.state_mask = TODO
                break;
            case "mouseup":
                Mx.xpos = m.bound(eventXPos, 0, Mx.width);
                Mx.ypos = m.bound(eventYPos, 0, Mx.height);
                switch (mouseEvent.which) {
                    case 1:
                        Mx.button_release = 1;
                        break;
                    case 2:
                        Mx.button_release = 2;
                        break;
                    case 3:
                        Mx.button_release = 3;
                        break;
                    case 4:
                        Mx.button_release = 4;
                        break;
                    case 5:
                        Mx.button_release = 5;
                }
                //Mx.state_mask = TODO
                break;
        }
    };

    /**
     * @param sv
     * @private
     */
    //
    // ~= scroll_real2pix
    //
    // TODO Refactor real2pix to return an object instead of sending in reference vars?
    mx.scroll_real2pix = function(sv) {
        // Param types:
        // sv - mx.SCROLLBAR

        if (sv.range === 0.0) {
            return {
                s1: sv.a1,
                sw: sv.a2 - sv.a1
            };
            //			out.s1 = sv.a1;
            //			out.sw = sv.a2 - sv.a1;
        } else {
            var dv; // real_8
            var ts1; // int_2
            var ts2; // int_2

            dv = (sv.a2 - sv.a1) / sv.trange;

            ts1 = sv.a1 + Math.floor(0.5 + (sv.smin - sv.tmin) * dv);
            ts2 = ts1 + Math.floor(0.5 + sv.srange * dv);

            if (ts1 > sv.a2 - sv.swmin) {
                ts1 = sv.a2 - sv.swmin;
            } else {
                ts1 = Math.max(ts1, sv.a1);
            }

            if (ts2 < sv.a1 + sv.swmin) {
                ts2 = sv.a1 + sv.swmin;
            } else {
                ts2 = Math.min(ts2, sv.a2);
            }

            return {
                s1: ts1,
                sw: Math.max(ts2 - ts1, sv.swmin)
            };
            //			out.s1 = ts1;
            //			out.sw = Math.max(ts2 - ts1, sv.swmin);
        }
    };

    /**
     * Method to re-draw a scrollbar after update. Logic taken from mx.scroll's UPDATE section.
     * @param sv The scrollbar to work with.
     * @param Mx The Mx context to work with.
     * @param op Optional op-code for XW_DRAW
     * @private
     */
    mx.redrawScrollbar = function(sv, Mx, op) {
        var x;
        var y;
        var xcc;
        var ycc;
        var xss;
        var yss;
        var p1;
        var op1; // int
        var s1;
        var sw; // int_2

        var ctx = Mx.active_canvas.getContext("2d");

        var scrollReal2PixOut = mx.scroll_real2pix(sv);
        s1 = scrollReal2PixOut.s1;
        sw = scrollReal2PixOut.sw;

        p1 = s1;
        op1 = sv.s1;

        xcc = sv.x;
        ycc = sv.y;
        xss = sv.w;
        yss = sv.h;

        // horizontal scroll bar
        if (sv.origin & 1) {
            y = ycc + yss / 2;
            if (sv.origin & 2) {
                op1 = xss - op1 - sv.sw;
                p1 = xss - p1 - sw;
            }
            if (op === mx.XW_DRAW) {
                var arrow = sv.arrow; // int

                mx.shadowbox(Mx, xcc, ycc, arrow, yss - 1, mx.L_ArrowLeft, 2, "", 0);
                mx.shadowbox(Mx, xcc + xss - arrow, ycc, arrow - 1, yss, mx.L_ArrowRight, 2, "", 0);
            }


            if (mx.LEGACY_RENDER) {
                mx.draw_line(Mx, Mx.fg, xcc + sv.a1, y, xcc + sv.a2, y);
                mx.shadowbox(Mx, xcc + p1, ycc, sw + 1, yss, 1, 2, "", 0);
            } else {
                // Veritical gradiant
                var lingrad = ctx.createLinearGradient(xcc + sv.a1, 0, xcc + sv.a2, 0);
                lingrad.addColorStop(0, Mx.xwbs);
                lingrad.addColorStop(0.5, Mx.xwts);
                lingrad.addColorStop(1, Mx.xwbs);
                mx.draw_line(Mx, lingrad, xcc + sv.a1, y, xcc + sv.a2, y, 1);

                var lingrad = ctx.createLinearGradient(0, ycc, 0, ycc + yss);
                lingrad.addColorStop(0.1, Mx.xwts);
                lingrad.addColorStop(0.75, Mx.xwbs);
                mx.draw_round_box(Mx, Mx.xwbg, xcc + p1, ycc, sw + 1, yss, 1, lingrad, 8, Mx.xwbs);
            }

            // else vertical scroll bar
        } else {
            x = xcc + m.trunc(xss / 2);
            if (sv.origin <= 2) {
                op1 = yss - op1 - sv.sw;
                p1 = yss - p1 - sw;
            }
            if (op === mx.XW_DRAW) {
                var arrow = sv.arrow; // int
                mx.shadowbox(Mx, xcc, ycc, xss - 1, arrow, mx.L_ArrowUp, 2, "", 0);
                mx.shadowbox(Mx, xcc, ycc + yss - arrow, xss - 1, arrow, mx.L_ArrowDown, 2, "", 0);
            }

            if (mx.LEGACY_RENDER) {
                mx.draw_line(Mx, Mx.fg, x, ycc + sv.a1, x, ycc + sv.a2);
                mx.shadowbox(Mx, xcc, ycc + p1, xss, sw + 1, 1, 2, "", 0);
            } else {
                // Horizontal gradiant
                var lingrad = ctx.createLinearGradient(0, ycc + sv.a1, 0, ycc + sv.a2);
                lingrad.addColorStop(0, Mx.xwbs);
                lingrad.addColorStop(0.5, Mx.xwts);
                lingrad.addColorStop(1, Mx.xwbs);
                mx.draw_line(Mx, lingrad, x, ycc + sv.a1, x, ycc + sv.a2, 1);

                var lingrad = ctx.createLinearGradient(xcc, 0, xcc + xss, 0);
                lingrad.addColorStop(0.1, Mx.xwts);
                lingrad.addColorStop(0.75, Mx.xwbs);
                mx.draw_round_box(Mx, Mx.xwbg, xcc - 1, ycc + p1, xss, sw + 1, 1, lingrad, 8, Mx.xwbs);
            }

        }

        sv.s1 = s1;
        sv.sw = sw;
    };

    /**
     * @param {Object} Mx - the Mx object
     * @param {number} x - the real-world x coordinate
     * @param {number} y - the real-world y coordinate
     * @param {boolean} [clip=false] set to clip the returned value to the plot area
     * @returns {Object} pixel - the x,y coordinates in pixel coordinate space
     * @returns {number} pixel.clipped - true if the point would have or has been clipped
     * @private
     */
    mx.real_to_pixel = function(Mx, x, y, clip) {
        var stk4 = mx.origin(Mx.origin, 4, Mx.stk[Mx.level]);
        if ((stk4.xscl === 0.0) || (stk4.yscl === 0.0)) {
            return {
                x: 0,
                y: 0
            };
        }

        var left = stk4.x1;
        var top = stk4.y1;

        var xxmin = stk4.xmin;
        var xscl = 1.0 / stk4.xscl;

        var yymin = stk4.ymin;
        var yscl = 1.0 / stk4.yscl;

        var clipped_x = false;
        var clipped_y = false;

        if (x !== null) {
            clipped_x = ((x > stk4.xmax) || (x < stk4.xmin));
            if (clip) {
                x = Math.min(x, stk4.xmax);
                x = Math.max(x, stk4.xmin);
            }
            x = Math.round((x - xxmin) * xscl) + left;
        }
        if (y !== null) {
            clipped_y = ((y > stk4.ymin) || (y < stk4.ymax));
            if (clip) {
                y = Math.min(y, stk4.ymin);
                y = Math.max(y, stk4.ymax);
            }
            y = Math.round((y - yymin) * yscl) + top;
        }

        x = Math.round(x);
        y = Math.round(y);

        return {
            x: x,
            y: y,
            clipped_x: clipped_x,
            clipped_y: clipped_y,
            clipped: (clipped_x || clipped_y)
        };
    };

    /**
     * @param Mx
     * @param xpos
     * @param ypos
     * @private
     */
    mx.pixel_to_real = function(Mx, xpos, ypos) {
        var iretx = Math.min(Mx.r, Math.max(Mx.l, xpos));
        var irety = Math.min(Mx.b, Math.max(Mx.t, ypos));
        var retx;
        var rety;

        var k = Mx.level;
        if ((Mx.origin !== 2) && (Mx.origin !== 3)) {
            retx = Mx.stk[k].xmin + (iretx - Mx.stk[k].x1) * Mx.stk[k].xscl;
        } else {
            retx = Mx.stk[k].xmin + (Mx.stk[k].x2 - iretx) * Mx.stk[k].xscl;
        }
        if (Mx.origin > 2) {
            rety = Mx.stk[k].ymin + (irety - Mx.stk[k].y1) * Mx.stk[k].yscl;
        } else {
            rety = Mx.stk[k].ymin + (Mx.stk[k].y2 - irety) * Mx.stk[k].yscl;
        }

        return {
            x: retx,
            y: rety
        };
    };

    /**
     * @param Mx
     * @param map
     * @param ncolors
     * @private
     */
    mx.colormap = function(Mx, map, ncolors) {
        Mx.pixel = new Array(ncolors);
        var colorp = new Array(ncolors);

        var cf = 100.0 / (Math.max(2, ncolors) - 1);
        for (var n = 0; n < ncolors; n++) {
            colorp[n] = (cf * n) + 0.5;
        }

        var iz;
        for (iz = 0;
            (iz < 6) && (map[iz + 1].pos === 0); iz++) {}

        for (var n = 0; n < ncolors; n++) {
            Mx.pixel[n] = 0;
            var z = colorp[n];
            while ((iz < 6) && (Math.floor(z) > map[iz].pos)) {
                iz++;
            }
            if ((iz === 0) || (z >= map[iz].pos)) {
                // above, below, or directly on boundry
                Mx.pixel[n] = {
                    red: pc2px(map[iz].red),
                    green: pc2px(map[iz].green),
                    blue: pc2px(map[iz].blue)
                };
            } else {
                // interpolation my dear watson
                var pf = (z - map[iz - 1].pos) / (map[iz].pos - map[iz - 1].pos);
                var zf = pc2px(pf * 100);
                var zf1 = 255 - zf;
                Mx.pixel[n] = {
                    red: (zf * (map[iz].red / 100) + zf1 * (map[iz - 1].red / 100)),
                    green: (zf * (map[iz].green / 100) + zf1 * (map[iz - 1].green / 100)),
                    blue: (zf * (map[iz].blue / 100) + zf1 * (map[iz - 1].blue / 100))
                };
            }
        }
    };

    /**
     * @param Mx
     * @param x
     * @param y
     * @param w
     * @param h
     * @private
     */
    mx.colorbar = function(Mx, x, y, w, h) {
        for (var j = 1; j < h; j++) {
            var cidx = Math.floor(Mx.pixel.length * (j - 1) / h);
            mx.draw_line(Mx, cidx, x, y + h - j, x + w, y + h - j);
        }
        mx.draw_box(Mx, Mx.fg, x + 0.5, y, w, h);
    };

    /**
     * @param Mx
     * @param x
     * @param y
     * @param w
     * @param h
     * @private
     */
    mx.legend_colorbar = function(Mx, x, y, w, h) {
        for (var j = 1; j < w; j++) {
            var cidx = Math.floor(Mx.pixel.length * (j - 1) / w);
            mx.draw_line(Mx, cidx, x + w - j, y, x + w - j, y + h);
        }
        mx.draw_box(Mx, Mx.fg, x + 0.5, y, w, h);
    };

    /**
     * Render image buffer to canvas.
     *
     * If we don't have access to Uint8ClampedArray (i.e. Firefox 3.6)
     * use a slower approach that only supports rasters up to the size
     * limit of the canvas
     * @private
     *
     * @param ctx
     *   {context} a canvas 2d context
     * @param buf
     *   {ArrayBuffer} a buffer of 32-bit image data
     * @param opacity
     *   the opacity to render the image with
     * @param smoothing
     *   if image smoothing should be enabled
     * @param sx
     *   source x position
     * @param sy
     *   source y position
     * @param sw
     *   source width
     * @param sh
     *   source height
     * @param x
     *   optional x canvas dest
     * @param y
     *   optional y canvas dest
     * @param w
     *   optional width
     * @param h
     *   optional height
     */
    function renderImageNoTypedArrays(Mx, ctx, buf, opacity, smoothing, x, y, w, h, sx, sy, sw, sh) {
        if (sx === undefined) {
            sx = 0;
        }
        if (sy === undefined) {
            sy = 0;
        }
        if (sw === undefined) {
            sw = buf.width - sx;
        }
        if (sh === undefined) {
            sh = buf.height - sy;
        }

        // If the source buffer is small enough to be directly rendered, do that
        Mx._renderCanvas.width = buf.width;
        Mx._renderCanvas.height = buf.height;

        var imgctx = Mx._renderCanvas.getContext("2d");
        var imgd = imgctx.createImageData(Mx._renderCanvas.width, Mx._renderCanvas.height);
        var buf8 = new Uint8Array(buf);
        for (var yy = 0; yy < buf.height; ++yy) {
            for (var xx = 0; xx < buf.width; ++xx) {
                var index = ((yy * buf.width) + xx) * 4;
                imgd.data[index] = buf8[index]; // red
                imgd.data[index + 1] = buf8[index + 1]; // green
                imgd.data[index + 2] = buf8[index + 2]; // blue
                imgd.data[index + 3] = 255; // alpha
            }
        }
        imgctx.putImageData(imgd, 0, 0);

        // Render the image to the destination
        ctx.save();
        ctx.globalAlpha = opacity;
        if (!smoothing) {
            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
        }
        ctx.drawImage(Mx._renderCanvas, sx, sy, sw, sh, x, y, w, h);
        ctx.restore();
    }

    /**
     * @private
     *
     * @param ctx
     *   {context} a canvas 2d context
     * @param buf
     *   {ArrayBuffer} a buffer of 32-bit image data
     * @param opacity
     *   the opacity to render the image with
     * @param smoothing
     *   if image smoothing should be enabled
     * @param sx
     *   source x position
     * @param sy
     *   source y position
     * @param sw
     *   source width
     * @param sh
     *   source height
     * @param x
     *   optional x canvas dest
     * @param y
     *   optional y canvas dest
     * @param w
     *   optional width
     * @param h
     *   optional height
     */
    function renderImageTypedArrays(Mx, ctx, buf, opacity, smoothing, x, y, w, h, sx, sy, sw, sh) {
        if (sx === undefined) {
            sx = 0;
        }
        if (sy === undefined) {
            sy = 0;
        }
        if (sw === undefined) {
            sw = buf.width - sx;
        }
        if (sh === undefined) {
            sh = buf.height - sy;
        }

        if ((buf.width < 32768) && (buf.height < 32768)) {
            // If the source buffer is small enough to be directly rendered, do that
            Mx._renderCanvas.width = buf.width;
            Mx._renderCanvas.height = buf.height;

            var imgctx = Mx._renderCanvas.getContext("2d");
            var imgd = imgctx.createImageData(Mx._renderCanvas.width, Mx._renderCanvas.height);

            // TODO - This may not be portable to all browsers, if not
            // we need to choose between this approach and the traditional
            // for-loop based approach
            var buf8 = new Uint8ClampedArray(buf);
            imgd.data.set(buf8);
            imgctx.putImageData(imgd, 0, 0);
        } else {
            if ((sw < 32768) && (sh < 32768)) {
                // The clipped image is small enough to directly render
                Mx._renderCanvas.width = sw;
                Mx._renderCanvas.height = sh;
                scaleImage(Mx._renderCanvas, buf, sx, sy, sw, sh);
            } else {
                // Downscale to twice the destination size
                Mx._renderCanvas.width = Math.min(w * 2, buf.width);
                Mx._renderCanvas.height = Math.min(h * 2, buf.height);
                scaleImage(Mx._renderCanvas, buf, sx, sy, sw, sh);
                sw = Mx._renderCanvas.width;
                sh = Mx._renderCanvas.height;
            }
            sx = 0;
            sy = 0;
        }

        // Render the image to the destination
        ctx.save();
        ctx.globalAlpha = opacity;
        if (!smoothing) {
            ctx.imageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
        }
        ctx.drawImage(Mx._renderCanvas, sx, sy, sw, sh, x, y, w, h);
        ctx.restore();
    }

    /**
     * Scale the image data (represented by buf) into the destination canvas
     * using nearest neighbor.  In genearl, you should just use the scaling
     * provided by drawImage...but if the buf is greater than 32767 pixels in
     * either dimension that won't work and you have to use this.
     *
     * @param img
     *   A canvas object
     * @param buf
     *   An ArrayBuf with .width and .height elements
     *
     * @private
     */
    function scaleImage(img, buf, sx, sy, sw, sh) {
        // Source buffer, expected to have .width and .height elements
        var src = new Uint32Array(buf);

        if (!sw) {
            sw = buf.width;
        }
        if (!sh) {
            sh = buf.height;
        }
        if (!sx) {
            sx = 0;
        }
        if (!sy) {
            sy = 0;
        }

        // Cache to avoid get width calls in tight loop
        var w = img.width;
        var h = img.height;

        // Destination element
        var imgctx = img.getContext("2d");
        var imgd = imgctx.createImageData(w, h);
        var ibuf = new ArrayBuffer(imgd.data.length);
        var buf8 = new Uint8ClampedArray(ibuf);
        var dest = new Uint32Array(ibuf);

        // Scaling factor
        var width_scaling = sw / w;
        var height_scaling = sh / h;

        // Perform the scaling
        var xx = 0;
        var yy = 0;
        var jj = 0;
        for (var i = 0; i < dest.length; i++) {
            xx = Math.round(Math.floor(i % w) * width_scaling) + sx;
            yy = Math.round(Math.floor(i / w) * height_scaling) + sy;
            jj = Math.floor((yy * buf.width) + xx);
            dest[i] = src[jj];
        }

        // Set the data
        imgd.data.set(buf8);
        imgctx.putImageData(imgd, 0, 0);
    }

    var renderImage = (typeof Uint8ClampedArray === 'undefined') ? renderImageNoTypedArrays : renderImageTypedArrays;

    /**
     * @param Mx
     * @param img
     * @param shift
     * @private
     */
    mx.shift_image_rows = function(Mx, buf, shift) {
        var imgd = new Uint32Array(buf);
        if (shift > 0) { // shift down
            shift = shift * buf.width;
            imgd.set(imgd.subarray(0, imgd.length - shift), shift);
        } else if (shift < 0) { // shift up
            shift = Math.abs(shift) * buf.width;
            imgd.set(imgd.subarray(shift));
        }

        return buf;
    };

    /**
     * @param Mx
     * @param img
     * @param data
     * @param row
     * @param zmin
     * @param zmax
     * @private
     */
    mx.update_image_row = function(Mx, buf, data, row, zmin, zmax, xcompression) {
        var imgd = new Uint32Array(buf, row * buf.width * 4, buf.width);

        var fscale = 1;
        if (zmax !== zmin) {
            fscale = Mx.pixel.length / Math.abs(zmax - zmin); // number of colors spread across the zrange
        }

        var xc = Math.max(1, data.length / buf.width);
        for (var i = 0; i < buf.width; i++) {
            var didx = Math.floor(i * xc);
            var value = data[didx];
            if (xc > 1) {
                if (xcompression === 1) { // average
                    for (var j = 1; j < xc; j++) {
                        value += data[didx + j];
                    }
                    value = (value / xc);
                } else if (xcompression === 2) { // min
                    for (var j = 1; j < xc; j++) {
                        value = Math.min(value, data[didx + j]);
                    }
                } else if (xcompression === 3) { // max
                    for (var j = 1; j < xc; j++) {
                        value = Math.max(value, data[didx + j]);
                    }
                } else if (xcompression === 4) { // first
                    value = data[i];
                } else if (xcompression === 5) { // max abs
                    for (var j = 1; j < xc; j++) {
                        value = Math.max(Math.abs(value), Math.abs(data[didx + j]));
                    }
                }
            }
            var cidx = Math.floor((value - zmin) * fscale);
            cidx = Math.max(0, Math.min(Mx.pixel.length - 1, cidx));

            var color = Mx.pixel[cidx];
            if (color) {
                /*jshint bitwise: false */
                imgd[i] = (255 << 24) | // alpha
                    (color.blue << 16) | // blue
                    (color.green << 8) | // green
                    (color.red); // red
                /*jshint bitwise: true */
            }
        }

        return imgd;
    };

    /**
     * @param Mx
     * @param data
     * @param w
     * @param h
     * @param Mx
     * @param zmin
     * @param zmax
     * @private
     */
    mx.create_image = function(Mx, data, subsize, w, h, zmin, zmax, xcompression) {
        var ctx = Mx.active_canvas.getContext("2d");

        if (!Mx.pixel || Mx.pixel.length === 0) {
            m.log.warn("COLORMAP not initialized, defaulting to foreground");
            mx.colormap(Mx, m.Mc.colormap[1].colors, 16);
        }

        var fscale = 1;
        if (zmax !== zmin) {
            fscale = Mx.pixel.length / Math.abs(zmax - zmin); // number of colors spread across the zrange
        }

        w = Math.ceil(w);
        h = Math.ceil(h);
        var buf = new ArrayBuffer(w * h * 4);
        buf.width = w;
        buf.height = h;

        var nxc = Math.max(1, subsize / w);

        var imgd = new Uint32Array(buf);
        if (data) {
            for (var i = 0; i < imgd.length; i++) {
                var ix;
                var iy;
                if ((Mx.origin === 1) || (Mx.origin === 4)) {
                    ix = Math.floor(i % w);
                } else {
                    ix = w - Math.floor(i % w) - 1;
                }
                if ((Mx.origin === 3) || (Mx.origin === 4)) {
                    iy = Math.floor(i / w);
                } else {
                    iy = h - Math.floor(i / w) - 1;
                }
                if (iy === 1) {
                    var test = 1;
                }
                var didx = (iy * subsize) + Math.floor(ix * nxc);
                var value = data[didx];
                if (nxc > 1) {
                    if (xcompression === 1) { // average
                        for (var j = 1; j < nxc; j++) {
                            value += data[didx + j];
                        }
                        value = value / nxc;
                    } else if (xcompression === 2) { // min
                        for (var j = 1; j < nxc; j++) {
                            value = Math.min(value, data[didx + j]);
                        }
                    } else if (xcompression === 3) { // max
                        for (var j = 1; j < nxc; j++) {
                            value = Math.max(value, data[didx + j]);
                        }
                    } else if (xcompression === 4) { // first
                        value = data[didx];
                    } else if (xcompression === 5) { // max abs
                        for (var j = 1; j < nxc; j++) {
                            value = Math.max(Math.abs(value), Math.abs(data[didx + j]));
                        }
                    }
                }

                var cidx = Math.floor((value - zmin) * fscale);
                cidx = Math.max(0, Math.min(Mx.pixel.length - 1, cidx));

                var color = Mx.pixel[cidx];
                if (color) {
                    /*jshint bitwise: false */
                    imgd[i] = (255 << 24) | // alpha
                        (color.blue << 16) | // blue
                        (color.green << 8) | // green
                        (color.red); // red
                    /*jshint bitwise: true */
                }
            }
        }

        // Return the image in case the caller wishes to cache it
        return buf;
    };

    /**
     * @param Mx
     * @param data
     * @param nx
     * @param ny
     * @param nex
     * @param ney
     * @param xd
     * @param yd
     * @param level
     * @param opacity
     * @param smoothing
     * @private
     */
    mx.put_image = function(Mx, data, nx, ny, nex, ney, xd, yd, level, opacity, smoothing) {
        var ctx = Mx.active_canvas.getContext("2d");

        if (!Mx.pixel || Mx.pixel.length === 0) {
            m.log.warn("COLORMAP not initialized, defaulting to foreground");
            mx.colormap(Mx, m.Mc.colormap[1].colors, 16);
        }

        var w;
        var h;

        if (nex > 0) {
            w = nx * nex;
        } else {
            w = -nex;
        }
        w = Math.floor(w);
        h = Math.floor(ny * ney);

        var buf = new ArrayBuffer(w * h * 4);
        buf.width = w;
        buf.height = h;

        var imgd = new Uint32Array(buf);
        for (var i = 0; i < imgd.length; i++) {
            var cidx = Math.max(0, data[i]);
            cidx = Math.min(Mx.pixel.length - 1, cidx);

            var color = Mx.pixel[cidx];
            if (color) {
                /*jshint bitwise: false */
                imgd[i] = (255 << 24) | // alpha
                    (color.blue << 16) | // blue
                    (color.green << 8) | // green
                    (color.red); // red
                /*jshint bitwise: true */
            }
        }

        //render the buffered canvas onto the original canvas element
        renderImage(Mx, ctx, buf, opacity, smoothing, xd, yd, w, h);

        // Return the image in case the caller wishes to cache it
        return buf;
    };

    /**
     * @param Mx
     * @param buf
     * @param xmin
     * @param ymin
     * @param xmax
     * @param ymax
     * @param opacity
     * @param smoothing
     * @private
     */
    mx.draw_image = function(Mx, buf, xmin, ymin, xmax, ymax, opacity, smoothing) {
        var view_xmin = Math.max(xmin, Mx.stk[Mx.level].xmin);
        var view_xmax = Math.min(xmax, Mx.stk[Mx.level].xmax);
        var view_ymin = Math.max(ymin, Mx.stk[Mx.level].ymin);
        var view_ymax = Math.min(ymax, Mx.stk[Mx.level].ymax);


        if ((buf.width <= 1) || Math.abs(xmax - xmin) === 0) {
            return;
        }
        if ((buf.height <= 1) || Math.abs(ymax - ymin) === 0) {
            return;
        }
        var rx = buf.width / (xmax - xmin);
        var ry = buf.height / (ymax - ymin);

        // Ensure we are on buffer pixel boundaries, later we use clipping
        // to constrain to the proper area
        view_xmin = Math.floor(view_xmin * rx) / rx;
        view_xmax = Math.ceil(view_xmax * rx) / rx;
        view_ymin = Math.floor(view_ymin * ry) / ry;
        view_ymax = Math.ceil(view_ymax * ry) / ry;

        var ul, lr;
        var sy, sx, sw, sh;
        if (Mx.origin === 1) {
            // regular x, regular y
            sy = Math.max(0, Math.floor((ymax - view_ymax) * ry));
            sh = Math.min(buf.height - sy, Math.floor((view_ymax - view_ymin) * ry));
            sx = Math.max(0, Math.floor((view_xmin - xmin) * rx));
            sw = Math.min(buf.width - sx, Math.floor((view_xmax - view_xmin) * rx));

            ul = mx.real_to_pixel(Mx, view_xmin, view_ymax);
            lr = mx.real_to_pixel(Mx, view_xmax, view_ymin);
        } else if (Mx.origin === 2) {
            // inverted x, regular y
            sy = Math.max(0, Math.floor((ymax - view_ymax) * ry));
            sh = Math.min(buf.height - sy, Math.floor((view_ymax - view_ymin) * ry));
            sx = Math.max(0, Math.ceil((view_xmin - xmin) * rx));
            sw = Math.min(buf.width - sx, Math.floor((view_xmax - view_xmin) * rx));

            ul = mx.real_to_pixel(Mx, view_xmax, view_ymax);
            lr = mx.real_to_pixel(Mx, view_xmin, view_ymin);
        } else if (Mx.origin === 3) {
            // inverted x, inverted y
            sy = Math.max(0, Math.ceil((view_ymin - ymin) * ry));
            sh = Math.min(buf.height - sy, Math.floor((view_ymax - view_ymin) * ry));
            sx = Math.max(0, Math.ceil((view_xmin - xmin) * rx));
            sw = Math.min(buf.width - sx, Math.floor((view_xmax - view_xmin) * rx));

            ul = mx.real_to_pixel(Mx, view_xmax, view_ymin);
            lr = mx.real_to_pixel(Mx, view_xmin, view_ymax);
        } else if (Mx.origin === 4) {
            // regular x, inverted y
            sy = Math.max(0, Math.ceil((view_ymin - ymin) * ry));
            sh = Math.min(buf.height - sy, Math.floor((view_ymax - view_ymin) * ry));
            sx = Math.max(0, Math.floor((view_xmin - xmin) * rx));
            sw = Math.min(buf.width - sx, Math.floor((view_xmax - view_xmin) * rx));

            ul = mx.real_to_pixel(Mx, view_xmin, view_ymin);
            lr = mx.real_to_pixel(Mx, view_xmax, view_ymax);
        }

        var iw = lr.x - ul.x;
        var ih = lr.y - ul.y;

        // Always include at least one pixel from the source
        sw = Math.max(1, sw);
        sh = Math.max(1, sh);

        // See if smart smoothing is requested
        if (typeof smoothing === "number") {
            // calculate the ratio of displayed pixels over
            // displayed data-points
            var ratio = (Mx.r - Mx.l) / sw;
            // if the ratio is greater than the smoothing value
            // turn on smoothing
            smoothing = (ratio <= smoothing);
        }

        //render the buffered canvas onto the original canvas element
        var ctx = Mx.active_canvas.getContext("2d");
        ctx.save();
        ctx.beginPath();
        ctx.rect(Mx.l, Mx.t, Mx.r - Mx.l, Mx.b - Mx.t);
        ctx.clip();
        renderImage(Mx, ctx, buf, opacity, smoothing, ul.x, ul.y, iw, ih, sx, sy, sw, sh);
        ctx.restore();
    };

    // Node: Export function
    module.exports = mx;

}());

///////////////////////////////////////////////////////////////////////////////
