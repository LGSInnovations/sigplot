/**
 * @license
 * File: sigplot.js
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

/*jslint nomen: true, browser: true, devel: true */

/**
 * This namespace provides the implementation of the plotting functionality.
 *
 * @namespace sigplot
 */
window.sigplot = window.sigplot || {};

//Uses Immediately-invoked Function Expressions (IIFE)s for namespaces
//See:
//http://addyosmani.com/blog/essential-js-namespacing/ for details.
//http://www.ethangardner.com/articles/javascript-namespace-strategy-for-large-applications/
(function(sigplot, mx, m) {
    /* global setKeypressHandler */
    /* global getKeyCode */
    /* global BlueFileReader */
    /* global Spinner */

    /**
     * Text of the keypress help dialog.
     *
     * @memberOf sigplot
     * @private
     */
    var KEYPRESS_HELP = "Keypress Table:\n" +
        "--------------\n" +
        "?    - Main help box.\n" +
        "A    - Toggle display x,y readouts:\n" +
        "       (absc) -> (index) -> (1/absc) -> (time).\n" +
        "B    - Toggle LM Drag Mode:\n" +
        "       (box) -> (horizontal) -> (vertical).\n" +
        "C    - Toggle controls.\n" +
        "K    - Show Marker.\n" +
        "L    - Toggle legend.\n" +
        "M    - Pops up main menu\n" +
        "R    - Toggle display specs (x/y readout)\n" +
        "S    - Toggle display specs and axes.\n" +
        "T    - Popup box with timecode value at mouse.\n" +
        "X    - Popup box with X value at mouse.\n" +
        "Y    - Popup box with Y value at mouse.\n" +
        "F    - Toggle fullscreen.\n";

    /**
     * Text of the main help dialog.
     *
     * @memberOf sigplot
     * @private
     */
    var MAIN_HELP = "To zoom, press and drag the left mouse (LM) over the region of interest and release. " +
        "To unzoom, press right mouse (RM).  Press the middle mouse (MM) button or press the " +
        "by selecting 'Keypress Info' from the main menu.";

    /**
     * Attempts basic checks to determine if the browser is compatible with
     * sigplot.
     *
     * @memberOf sigplot
     * @private
     */
    sigplot.browserIsCompatible = function browserIsCompatible() {
        // We need a Canvas
        var test_canvas = document.createElement('canvas');
        var hascanvas = (test_canvas.getContext) ? true : false;

        // We need ArrayBuffer
        var hasarraybuf = ("ArrayBuffer" in window);

        // File and FileReader are optional...and only
        // required if the user wants to plot local files
        return (hascanvas && hasarraybuf);
    };

    /**
     *
     *
     * @memberOf sigplot
     * @private
     */
    var PointArray = null;

    /**
     * True if we detected that we are on an iOS device
     *
     * @memberOf sigplot
     * @private
     */
    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
    if ((iOS) || // iOS doesn't support Float64
        (typeof Float64Array === 'undefined') || // If it's undefined it's obviously not supported
        (Float64Array.emulated) || // If it's emulated, don't waste time on extra precision
        (!Float64Array.BYTES_PER_ELEMENT)) { // If bytes per element isn't defined, it's a buggy implementation (i.e. PhantomJS)
        sigplot.PointArray = Float32Array;
    } else {
        sigplot.PointArray = Float64Array;
    }



    /**
     * Construct and render a plot.
     *
     * @constructor
     *
     * @example plot = new sigplot.Plot(document.getElementById('plot'), {});
     *
     * @param element
     *            a 'div' DOM elements
     * @param [options]
     *            alters the behavior of the plot.
     *
     * @param {String}
     *            options.cmode the plot rendering mode "IN" = Index, "AB" =
     *            Abscissa, "MA" = Magnitude, "PH" = Phase, "RE" = Real, "IM" =
     *            Imaginary, "LO" or "D1" = 10*log, "L2" or "D2" = 20*log, "RI"
     *            or "IR" = Real vs. Imaginary
     *
     * @param {String}
     *            options.phunits the phase units "D" = Degrees, "R" = Radians,
     *            "C" = Cycles
     *
     * @param {Boolean}
     *            options.cross display cross hairs on the plot
     *
     * @param {Boolean}
     *            options.nogrid hide the background grid
     *
     * @param {Boolean}
     *            options.legend hide the legned
     *
     * @param {Boolean}
     *            options.nopan disable panning on the plot
     *
     * @param {Boolean}
     *            options.nomenu disable the middle-click menu
     *
     * @param {Boolean}
     *            options.nospec hide all plot specification displays
     *
     * @param {Boolean}
     *            options.noxaxis hide the x-axis
     *
     * @param {Boolean}
     *            options.noyaxis hide the y-axis
     *
     * @param {Boolean}
     *            options.noreadout hide the plot readout area
     *
     * @param {Boolean}
     *            options.nodragdrop prevent file drag drop
     *
     * @param {Number}
     *            options.scroll_time_interval
     *
     * @param {Boolean}
     *            options.index use the data-index in the X axis
     *
     * @param {Number}
     *            options.autox auto-scaling settings for X axis
     *
     * @param {Number}
     *            options.xmin the minimum range to display on the X axis
     *
     * @param {Number}
     *            options.xmax the maximum range to display on the X axis
     *
     * @param {Number}
     *            options.xlab the units that X-axis uses (see m.UNITS)
     *
     * @param {Number}
     *            options.xdiv the number of divisions on the X axis
     *
     * @param {Number}
     *            options.xcnt configure the mtag mouse controls 0 = Off, 1
     *            (default) = LM Click, 2 = Continuous
     *
     * @param {String}
     *            options.rubberbox_mode controls the behavior of the rubberbox
     *            "zoom" (default) = zoom to the selected area "box" = trigger
     *            an mtag action on the selected area
     *
     * @param {String}
     *            options.rightclick_rubberbox_mode controls the behavior of the rubberbox
     *            "zoom" = zoom to the selected area "box" = trigger
     *            an mtag action on the selected area.  By default is null to disable
     *            right-click boxes
     *
     * @param {Number}
     *            options.line the line type to draw 0 = None, 1 = Verticals, 2 =
     *            Horizontals, 3 (default) = Connecting
     *
     * @param {Number}
     *            options.autoy auto-scaling settings for Y axis
     *
     * @param {Number}
     *            options.ylab the units that Y-axis uses (see m.UNITS)
     *
     * @param {Number}
     *            options.ymin the minimum range to display on the Y axis
     *
     * @param {Number}
     *            options.ymax the maximum range to display on the Y axis
     *
     * @param {Number}
     *            options.ydiv the number of divisions on the Y axis
     *
     * @param {Number}
     *            options.zmin the minimum range to display on the Z axis
     *
     * @param {Number}
     *            options.zmax the maximum range to display on the Z axis
     *
     * @param {Boolean}
     *            options.yinv invert the y-axis
     *
     * @param {String}
     *            options.colors.fg the foreground color as a CSS color
     *
     * @param {String}
     *            options.colors.bg the background color as a CSS color
     *
     * @param {Boolean}
     *            options.xi invert the foreground/background colors
     *
     * @param {Boolean}
     *            options.forcelab
     *
     * @param {Boolean}
     *            options.all show all of the data on the plot instead of just
     *            one buffer
     *
     * @param {Boolean}
     *            options.expand auto-scale the plot based on all the data (when
     *            combined with the all option)
     *
     * @param {Number}
     *            options.origin 1 = x1:xmin, x2:xmax, y1:ymax, y2:ymin
     *            (default), 2 = x1:xmax, x2:xmin, y1:ymax, y2:ymin (x
     *            inverted), 3 = x1:xmax, x2:xmin, y1:ymin, y2:ymax (x & y
     *            inverted), 4 = x1:xmin, x2:xmax, y1:ymin, y2:ymax (y inverted)
     *
     * @param {Number}
     *            options.bufmax the buffer size to use
     *
     * @param {Boolean}
     *            options.nokeypress disable key press actions
     *
     * @param options.anno_type
     *            (Not implemented)
     *
     * @param options.pmt
     *            (Not implemented)
     *
     * @param options.xfmt
     *            (Not implemented)
     *
     * @param options.yfmt
     *            (Not implemented)
     *
     * @param options.nsec
     *            the number of sections to split the plot into (Not
     *            implemented)
     *
     * @returns {sigplot.Plot}
     */
    sigplot.Plot = function(element, options) {
        if (!sigplot.browserIsCompatible()) {
            throw "Browser is not compatible";
        }
        // Register with the Mx structure - Step #4
        this._Mx = mx.open(element);
        var Mx = this._Mx;

        this._Gx = new GX();
        this._Gx.parent = element;

        // Variable which stores state of mouse position relative to the canvas
        this.mouseOnCanvas = false;

        if (!options) {
            options = {};
        }

        plot_init(this, options);

        this._refresh(); // Draw immediately

        this.onmousemove = (function(plot) {
            return function(e) {
                var Mx = plot._Mx;
                var Gx = plot._Gx;

                var rect = e.target.getBoundingClientRect();
                var xpos = (e.offsetX === undefined) ? (e.pageX - rect.left - window.scrollX) : e.offsetX;
                var ypos = (e.offsetX === undefined) ? (e.pageY - rect.top - window.scrollY) : e.offsetY;

                // var xpos = (e.offsetX === undefined) ? e.layerX : e.offsetX;
                // var ypos = (e.offsetY === undefined) ? e.layerY : e.offsetY;
                var re = pixel_to_real(plot, xpos, ypos);
                Gx.retx = re.x;
                Gx.rety = re.y;

                if (Mx.widget) {
                    return;
                }
                display_specs(plot);

                var evt = document.createEvent('Event');
                evt.initEvent('mmove', true, true);
                evt.xpos = xpos;
                evt.ypos = ypos;
                evt.x = Gx.retx;
                evt.y = Gx.rety;
                var executeDefault = mx.dispatchEvent(Mx, evt);
                if (!executeDefault) {
                    return;
                }

                // The crosshair logic in websigplot is different
                // because we need to clear the previous position
                // of the line (via XOR) and then draw the new line
                //
                // The Mx.xpos and Mx.ypos may have already been
                // updated to their new location so we need to store
                // the crosshair position in the Gx structure
                if (Gx.cross) {
                    if (Mx.warpbox) {
                        // during zoom operations undraw the crosshairs
                        if (Gx.cross_xpos !== undefined) {
                            mx.rubberline(Mx, Gx.cross_xpos, Mx.t,
                                Gx.cross_xpos, Mx.b);
                        }
                        if (Gx.cross_ypos !== undefined) {
                            mx.rubberline(Mx, Mx.l, Gx.cross_ypos, Mx.r,
                                Gx.cross_ypos);
                        }
                        Gx.cross_xpos = undefined;
                        Gx.cross_ypos = undefined;
                    } else {
                        draw_crosshairs(plot);
                    }
                }

                if (Gx.cntrls === 2) {
                    var evt = document.createEvent('Event');
                    evt.initEvent('mtag', true, true);
                    evt.x = Gx.retx;
                    evt.y = Gx.rety;
                    evt.xpos = xpos;
                    evt.ypos = ypos;
                    mx.dispatchEvent(Mx, evt);
                }
            };
        }(this));

        this.ontouchmove = (function(plot) {
            return function(event) {
                event.preventDefault();
                plot.onmousemove(event);
            };
        }(this));

        this.throttledOnMouseMove = m.throttle(this._Gx.scroll_time_interval,
            this.onmousemove);

        mx.addEventListener(Mx, "mousemove", this.throttledOnMouseMove, false);
        // canvas.addEventListener('touchmove', this.ontouchmove, false);

        this.onmouseout = (function(plot) {
            return function(event) {
                var Gx = plot._Gx;
                var Mx = plot._Mx;
                if (plot.mouseOnCanvas) {
                    plot.mouseOnCanvas = false;

                    if (Gx.autohide_readout) {
                        display_specs(plot);
                    }
                    if (Gx.autohide_panbars) {
                        draw_panbars(plot);
                    }
                    if (Mx.prompt) {
                        Mx.prompt.input.enableBlur();
                    }
                }
            };
        }(this));
        mx.addEventListener(Mx, "mouseout", this.onmouseout, false);

        this.onmouseover = (function(plot) {
            return function(event) {
                var Gx = plot._Gx;
                var Mx = plot._Mx;
                plot.mouseOnCanvas = true;
                if (Gx.autohide_panbars) {
                    draw_panbars(plot);
                }
                if (Mx.prompt) {
                    Mx.prompt.input.disableBlur();
                }
            };
        }(this));
        mx.addEventListener(Mx, "mouseover", this.onmouseover, false);

        this.onmousedown = (function(plot) {
            return function(event) {
                event.preventDefault(); // mouse down on the canvas should never do a browser default action

                var Mx = plot._Mx;
                var Gx = plot._Gx;

                if (Mx.widget && (Mx.widget.type === "ONESHOT")) {
                    Mx.widget = null;
                    plot.refresh();
                }

                // Update Mx event fields
                mx.ifevent(Mx, event);

                var evt = document.createEvent('Event');
                evt.initEvent('mdown', true, true);
                evt.xpos = Mx.xpos;
                evt.ypos = Mx.ypos;
                evt.x = Gx.retx;
                evt.y = Gx.rety;
                evt.which = event.which;
                var executeDefault = mx.dispatchEvent(Mx, evt);
                if (!executeDefault) {
                    return false;
                }

                // Check if event occured in the pan region
                var inPan = inPanRegion(plot);

                // Event processing
                if (inPan.inPanRegion) { // Mouse position lies in a pan
                    // region
                    event.preventDefault();
                    if (inPan.command !== ' ') {
                        var scrollbar = null;
                        var position = null;
                        if (inPan.command === "XPAN") {
                            scrollbar = Mx.scrollbar_x;
                        } else if (inPan.command === "YPAN") {
                            scrollbar = Mx.scrollbar_y;
                        }

                        if (event.which === 2) {
                            position = {
                                x: Mx.xpos,
                                y: Mx.ypos
                            };
                            if ((scrollbar !== undefined) && (onScrollbar(position, scrollbar))) {
                                // Only show menu if on the scrollbar itself
                                sigplot_scrollScaleMenu(plot, inPan.command);
                            }
                        } else {
                            if (inPan.command !== ' ') {
                                position = {
                                    x: Mx.xpos,
                                    y: Mx.ypos
                                };
                                if (!onScrollbar(position, scrollbar) && event.which === 1) { // Left-clicking
                                    // not on a
                                    // scrollbar -
                                    // handle
                                    // typical pan
                                    pan(plot, inPan.command, 0, event); // Execute
                                    // the
                                    // first
                                    // pan
                                    var repeatPan = function() {
                                        if (!onScrollbar({
                                                "x": Mx.xpos,
                                                "y": Mx.ypos
                                            }, scrollbar)) {
                                            pan(plot, inPan.command, 0, event);
                                            // execute
                                            // a
                                            // pan
                                            // on
                                            // every
                                            // interval
                                        } else {
                                            // stop
                                            // panning
                                            // once you
                                            // hit the
                                            // scrollbar
                                            if (Gx.stillPanning) {
                                                window.clearInterval(Gx.stillPanning);
                                                Gx.repeatPanning = undefined;
                                            }
                                        }
                                    };

                                    // Make scrolling smooth, the longer initial prevents
                                    // a single click from counting twice
                                    Gx.stillPanning = window.setTimeout(
                                        function() {
                                            Gx.repeatPanning = window.setInterval(repeatPan, 50);
                                        }, 250);
                                }
                            }
                        }
                    }
                } else { // Mouse not in a pan region, handle other cases
                    if (event.which === 1 || event.which === 3) {
                        var lButtonPressed = false;
                        if (Gx.legendBtnLocation) {
                            lButtonPressed = coordsInRectangle(Mx.xpos,
                                Mx.ypos, Gx.legendBtnLocation.x,
                                Gx.legendBtnLocation.y,
                                Gx.legendBtnLocation.width,
                                Gx.legendBtnLocation.height);
                        }

                        if (lButtonPressed) {
                            plot.change_settings({
                                legend: !Gx.legend
                            }); // toggle the legend
                        } else {
                            display_specs(plot);

                            // Styles for rubberbox
                            var zoom_style = {
                                opacity: 0,
                                return_value: "zoom"
                            };

                            var select_style = {
                                opacity: 0.4,
                                fill_color: Mx.hi,
                                return_value: "select"
                            };

                            if (event.which === 1) {
                                if (Gx.default_rubberbox_action === "zoom") {
                                    mx.rubberbox(Mx, rubberbox_cb(plot, event.which),
                                        Gx.default_rubberbox_mode, zoom_style,
                                        select_style);
                                } else if (Gx.default_rubberbox_action === "select") {
                                    mx.rubberbox(Mx, rubberbox_cb(plot, event.which),
                                        Gx.default_rubberbox_mode,
                                        select_style, zoom_style);
                                } // otherwise rubber-box is considered disabled
                            } else if (event.which === 3) {
                                if (Gx.default_rightclick_rubberbox_action === "zoom") {
                                    mx.rubberbox(Mx, rubberbox_cb(plot, event.which),
                                        Gx.default_rightclick_rubberbox_mode, zoom_style,
                                        select_style);
                                } else if (Gx.default_rightclick_rubberbox_action === "select") {
                                    mx.rubberbox(Mx, rubberbox_cb(plot, event.which),
                                        Gx.default_rightclick_rubberbox_mode,
                                        select_style, zoom_style);
                                } // otherwise right-click rubber-box is considered disabled
                            }
                        }
                    } else if (event.which === 2) {
                        if (!Gx.nomenu) {
                            sigplot_mainmenu(plot);
                        }
                    }
                }
                return false;
            };
        }(this));

        this.ontouchstart = (function(plot) {
            return function(event) {
                event.preventDefault();
                plot.onmousedown({
                    which: 1
                });
            };
        }(this));

        mx.addEventListener(Mx, "mousedown", this.onmousedown, false);
        // canvas.addEventListener("touchstart", this.ontouchstart, false);

        this.docMouseUp = (function(plot) {
            return function(event) {
                var Gx = plot._Gx;

                if (event.which === 1) {
                    // in general, you shouldn't put anything in here
                    // ...instead it should go into rubberbox_cb
                    Gx.panning = undefined;
                    plot._Mx.scrollbar_x.action = 0; // TODO Is this
                    // necessary?
                    plot._Mx.scrollbar_y.action = 0;
                } //else if (event.which === 2) {
                // nothing
                //} else if (event.which === 3) {
                // nothing
                //}
                if (Gx.stillPanning) {
                    window.clearTimeout(Gx.stillPanning);
                    Gx.stillPanning = undefined;
                }
                if (Gx.repeatPanning) { // Clear the panning interval on any
                    // mouse up in the document
                    window.clearInterval(Gx.repeatPanning);
                    Gx.repeatPanning = undefined;
                }
                return false;
            };
        }(this));
        document.addEventListener("mouseup", this.docMouseUp, false);

        this.mouseup = (function(plot) {
            return function(event) {
                event.preventDefault(); // mouse up on the canvas should never do a browser default action

                var Gx = plot._Gx;
                var Mx = plot._Mx;

                if (Mx.warpbox) {
                    // if we are in a warpbox, it will handle the mouseup
                    return;
                }

                // Update Mx event fields
                mx.ifevent(plot._Mx, event);

                var evt = document.createEvent('Event');
                evt.initEvent('mup', true, true);
                evt.xpos = Mx.xpos;
                evt.ypos = Mx.ypos;
                evt.x = Gx.retx;
                evt.y = Gx.rety;
                evt.which = event.which;
                var executeDefault = mx.dispatchEvent(Mx, evt);

                if (executeDefault) {
                    if (event.which === 1) {
                        // If we are in the pan region, perform the pan
                        // otherwise emit an mtag
                        var inCenter = inPanCenterRegion(plot);
                        if (inCenter.inCenterRegion) {
                            if (inCenter.command !== ' ') {
                                pan(plot, inCenter.command, 0, event); // pan
                            }
                        } else if (Gx.cntrls === 1) {
                            // Update the mark
                            Gx.xmrk = Gx.retx;
                            Gx.ymrk = Gx.rety;

                            var mtagevt = document.createEvent('Event');
                            mtagevt.initEvent('mtag', true, true);
                            mtagevt.x = Gx.xmrk;
                            mtagevt.y = Gx.ymrk;
                            mtagevt.xpos = event.x || event.clientX;
                            mtagevt.ypos = event.y || event.clientY;
                            mtagevt.w = undefined;
                            mtagevt.h = undefined;
                            mtagevt.shift = event.shiftKey;
                            mx.dispatchEvent(Mx, mtagevt);

                            // Refresh to draw the new marker position
                            if (Gx.always_show_marker || Gx.show_marker) {
                                plot.redraw();
                            }
                        }
                    } else if (event.which === 2) {
                        if (Gx.nomenu) {
                            // Send an event so that a custom menu can be displayed
                            // if desired
                            var evt = document.createEvent('Event');
                            evt.initEvent('showmenu', true, true);
                            evt.x = event.x || event.clientX;
                            evt.y = event.y || event.clientY;
                            var executeDefault = mx.dispatchEvent(Mx, evt);

                            if (executeDefault) {
                                if (event.stopPropagation) {
                                    event.stopPropagation();
                                }
                                event.cancelBubble = true;
                                mx.removeEventListener(Mx, "mousedown", plot.onmousedown, false);

                                var emit_hidemenu = function() {
                                    try {
                                        var hideMenuEvt = document.createEvent('Event');
                                        hideMenuEvt.initEvent('hidemenu', true, true);
                                        if (mx.dispatchEvent(Mx, hideMenuEvt)) {
                                            mx.addEventListener(Mx, "mousedown", plot.onmousedown, false);
                                        }
                                    } finally {
                                        document.removeEventListener("mouseup", emit_hidemenu, false);
                                    }
                                };
                                document.addEventListener("mouseup", emit_hidemenu, false);
                            }
                        }
                    } else if (event.which === 3) { // unzoom only happens on
                        // right-clicks on plot
                        // unzoom/expand
                        event.preventDefault();

                        plot.unzoom(1);
                        plot.refresh();
                    }
                }

            };
        }(this));

        this.ontouchend = (function(plot) {
            return function(event) {
                event.preventDefault();
                //
            };
        }(this));

        mx.addEventListener(Mx, "mouseup", this.mouseup, false);
        // canvas.addEventListener("touchstart", this.ontouchend, false);

        this.mouseclick = (function(plot) {
            return function(event) {
                event.preventDefault(); // alway prevent any default browser actions on the plot

                var Gx = plot._Gx;
                var Mx = plot._Mx;

                // Update Mx event fields
                mx.ifevent(plot._Mx, event);

                var evt = document.createEvent('Event');
                evt.initEvent('mclick', true, true);
                evt.xpos = Mx.xpos;
                evt.ypos = Mx.ypos;
                evt.x = Gx.retx;
                evt.y = Gx.rety;
                evt.which = event.which; // not always available on all browser
                if (mx.dispatchEvent(Mx, evt)) {
                    // currently there isn't a default for mouseclick to cancel
                }
                return false;
            };
        }(this));
        mx.addEventListener(Mx, "click", this.mouseclick, false);

        this.mousedblclick = (function(plot) {
            return function(event) {
                event.preventDefault(); // alway prevent any default browser actions on the plot

                var Gx = plot._Gx;
                var Mx = plot._Mx;

                // Update Mx event fields
                mx.ifevent(plot._Mx, event);

                var evt = document.createEvent('Event');
                evt.initEvent('mdblclick', true, true);
                evt.xpos = Mx.xpos;
                evt.ypos = Mx.ypos;
                evt.x = Gx.retx;
                evt.y = Gx.rety;
                evt.which = event.which; // not always available on all browser
                if (mx.dispatchEvent(Mx, evt)) {
                    // currently there isn't a default for mouseclick to cancel
                }
                return false;
            };
        }(this));
        mx.addEventListener(Mx, "dblclick", this.mousedblclick, false);

        // PANBAR DRAGGING mouse event handlers:
        this.dragMouseDownHandler = (function(plot) {
            return function(event) {
                var Mx = plot._Mx;
                var Gx = plot._Gx;

                // Check if event occured in the pan region
                var inPan = inPanRegion(plot);

                // Event processing
                if (inPan.inPanRegion) { // Mouse position lies in a pan
                    // region
                    event.preventDefault();
                    if (inPan.command !== ' ') {
                        var scrollbar;
                        if (inPan.command === "XPAN") {
                            scrollbar = Mx.scrollbar_x;
                        } else if (inPan.command === "YPAN") {
                            scrollbar = Mx.scrollbar_y;
                        }

                        var position = {
                            x: Mx.xpos,
                            y: Mx.ypos
                        };
                        if (scrollbar !== undefined && onScrollbar(position, scrollbar) && event.which === 1) { // On scrollbar, set up
                            // a DRAG
                            Gx.panning = {
                                axis: inPan.command,
                                xpos: event.screenX, // Use screen-relative
                                // values here instead
                                // of div/page-relative
                                // values
                                ypos: event.screenY,
                                xmin: Mx.stk[Mx.level].xmin,
                                xmax: Mx.stk[Mx.level].xmax,
                                ymin: Mx.stk[Mx.level].ymin,
                                ymax: Mx.stk[Mx.level].ymax
                            };
                        }
                    }
                }
            };
        }(this));
        window.addEventListener("mousedown", this.dragMouseDownHandler, false);

        this.dragMouseMoveHandler = (function(plot) {
            return function(e) {
                var Gx = plot._Gx;

                if (Gx.panning !== undefined) { // execute a scrollbar DRAG
                    try {
                        drag_scrollbar(plot, Gx.panning.axis, e);
                    } catch (err) {
                        console.log("Error: " + err); // TODO Eventually come
                        // up with better error
                        // handling here
                    }
                }
            };
        }(this));

        this.throttledDragOnMouseMove = m.throttle(this._Gx.scroll_time_interval,
            this.dragMouseMoveHandler);

        window.addEventListener("mousemove", this.throttledDragOnMouseMove,
            false);

        this.dragMouseUpHandler = (function(plot) {
            return function(event) {
                var Gx = plot._Gx;

                if (event.which === 1) {
                    Gx.panning = undefined; // Panbar dragging completed - clear
                    // the state variable
                }
            };
        }(this));
        window.addEventListener("mouseup", this.dragMouseUpHandler, false);

        // TODO this may need to be throttled or debounced
        this.onresize = (function(plot) {
            return function(event) {
                if (mx.checkresize(plot._Mx)) {
                    plot.refresh();
                }
            };
        }(this));

        // Mouse Wheel logic
        this.wheelHandler = (function(plot) {

            var Mx = plot._Mx;
            var Gx = plot._Gx;

            var throttledPan = m.throttle(100, function(inPan) {
                // Mouse wheel
                // event over a
                // panning
                // region

                var scrollbar;
                if (inPan.command === "XPAN") {
                    scrollbar = Mx.scrollbar_x;
                } else if (inPan.command === "YPAN") {
                    scrollbar = Mx.scrollbar_y;
                }

                // For now, vertical mouse scrolling is the only action that
                // will trigger a pan
                // Later, we can add horizontal mouse scrolling if we choose
                if (Gx.wheelscroll_mode_natural) { // Original Sig-Plot
                    // orientation
                    scrollbar.action = (event.deltaY < 0 ? mx.SB_WHEELDOWN : mx.SB_WHEELUP);
                } else { // Inverted/"un-natural" orientation
                    scrollbar.action = (event.deltaY < 0 ? mx.SB_WHEELUP : mx.SB_WHEELDOWN);
                }

                scrollbar.step = 0.1 * scrollbar.srange;
                scrollbar.page = 9 * scrollbar.step;

                // Execute wheel action on the scrollbar
                mx.scroll(Mx, scrollbar, mx.XW_COMMAND, undefined,
                    scrollbar);

                // Update the viewbox
                updateViewbox(plot, scrollbar.smin, scrollbar.smin + scrollbar.srange, inPan.command.slice(0, 1));
            });

            var throttledZoom = m.throttle(100, function() {
                var zoomperc = Gx.wheelZoomPercent || 0.2;
                if (Gx.wheelscroll_mode_natural) {
                    if (event.deltaY > 0) {
                        zoomperc = -1 * zoomperc;
                    }
                } else { // Inverted/"un-natural" orientation
                    if (event.deltaY < 0) {
                        zoomperc = -1 * zoomperc;
                    }
                }

                if (Gx.wheelZoom === "x") {
                    plot.percent_zoom(zoomperc, 1, true);
                } else if (Gx.wheelZoom === "y") {
                    plot.percent_zoom(1, zoomperc, true);
                } else {
                    plot.percent_zoom(zoomperc, zoomperc, true);
                }
            });

            return function(event) {
                // Update Mx event fields
                mx.ifevent(Mx, event);

                // Check if event occured in the pan region
                var inPan = inPanRegion(plot);

                // Event processing
                if (plot.mouseOnCanvas) {
                    event.preventDefault();

                    if (inPan.inPanRegion) {
                        throttledPan(inPan);
                    } else if (Gx.wheelZoom) {
                        throttledZoom();
                    }
                }
            };
        }(this));

        window.addWheelListener(window, this.wheelHandler, false);

        window.addEventListener("resize", this.onresize, false);

        // If multiple plots are in the same window, then it
        // may be desired to disable keypress behavior and implement
        // it at a higher-level...by default keypress behavior
        // is enabled and only works if the mouse if over the plot
        if (!options.nokeypress) {
            this.onkeypress = (function(plot) {
                return function(event) {
                    var Mx = plot._Mx;
                    var Gx = plot._Gx;
                    if (plot.mouseOnCanvas) {

                        if (Mx.widget && (Mx.widget.type === "MENU")) {
                            return; // The menu absorbs the keypress
                        }

                        if (Mx.widget && (Mx.widget.type === "ONESHOT")) {
                            Mx.widget = null;
                            plot.refresh();
                            return;
                        }

                        var keyCode = getKeyCode(event);

                        // Since the mouse is in the plot area, send a keypress event
                        var evt = document.createEvent('Event');
                        evt.initEvent('plotkeypress', true, true);
                        evt.keyCode = keyCode;
                        evt.shiftKey = event.shiftKey;
                        evt.ctrlKey = event.ctrlKey;
                        evt.altKey = event.altKey;
                        evt.metaKey = event.metaKey;
                        var executeDefault = mx.dispatchEvent(Mx, evt);
                        if (!executeDefault) {
                            return;
                        }

                        // Only respond to keypresses if the mouse is
                        // in the plot area....

                        if (keyCode === 97) { // 'a'
                            Gx.iabsc = (Gx.iabsc + 1) % 4;
                            // It's kinda up in the air if changing the 'specs'
                            // area should also change the plotting mode itself...
                            // on one hand, if you have multiple layers with different
                            // xdeta's then switching the specs area to index mode will
                            // give you only the index of the baselayer...on the other hand
                            // the use may only want to change the readout and not the x-axis
                            // or the plot...for now this is commented out to behave in the same
                            // manner as SIGPLOT.
                            //plot.change_settings({
                            //	index : Gx.iabsc === 1
                            //});
                            display_specs(plot);
                        } else if (keyCode === 108) { // 'l'
                            plot.change_settings({
                                legend: !Gx.legend
                            }); // toggle the legend
                        } else if (keyCode === 103) { // 'g'
                            plot.change_settings({
                                grid: !Gx.grid
                            }); // toggle the legend
                        } else if ((keyCode === 98) || (keyCode === 2)) { // 'b' and CTRL-'b'
                            if (Mx.warpbox) {
                                if (Mx.warpbox.mode === "box") {
                                    Mx.warpbox.mode = "horizontal";
                                } else if (Mx.warpbox.mode === "horizontal") {
                                    Mx.warpbox.mode = "vertical";
                                } else {
                                    Mx.warpbox.mode = "box";
                                }
                                mx.redraw_warpbox(Mx);
                            }
                        } else if (keyCode === 99) { // 'c'
                            plot.change_settings({
                                xcnt: -1 * Gx.cntrls
                            });
                        } else if (keyCode === 114) { // 'r'
                            plot.change_settings({
                                show_readout: !Gx.show_readout
                            });
                        } else if (keyCode === 115) { // 's'
                            plot.change_settings({
                                specs: !Gx.specs
                            });
                        } else if (keyCode === 120) { // 'x'
                            sigplot_show_x(plot);
                        } else if (keyCode === 121) { // 'y'
                            sigplot_show_y(plot);
                        } else if (keyCode === 122) { // 'z'
                            sigplot_show_z(plot);
                        } else if (keyCode === 116) { // 't'
                            sigplot_show_timecode(plot);
                        } else if (keyCode === 109) { // 'm'
                            if (!Gx.nomenu) {
                                var evt = document.createEvent('Event');
                                evt.initEvent('showmenu', true, true);
                                evt.x = Mx.x;
                                evt.y = Mx.y;
                                var executeDefault = mx.dispatchEvent(Mx, evt);
                                if (executeDefault) {
                                    sigplot_mainmenu(plot);
                                }
                            }
                        } else if (keyCode === 63) { // '?'
                            mx.message(Mx, MAIN_HELP);
                        } else if (keyCode === 102) { // 'f'
                            mx.fullscreen(Mx);
                            plot.refresh();
                        } else if ((keyCode === 9) && (event.ctrlKey)) { // ctrl-i
                            plot.change_settings({
                                invert: null
                            });
                        } else if (keyCode === 107) { // 'k' show marker
                            Gx.show_marker = !Gx.show_marker;
                            plot.redraw();

                        }
                    }
                };
            }(this));

            setKeypressHandler(this.onkeypress);
        }

        return this;
    };

    // Public methods

    sigplot.Plot.prototype = {

        /**
         * Add a plugin to the plot
         *
         * @param plugin
         *            the plugin object
         *
         * @param zorder
         *            the zorder for the plugin to render, all plugins render as
         *            overlays on top of the plot
         */
        add_plugin: function(plugin, zorder) {
            if (zorder === undefined) {
                zorder = Number.MAX_VALUE;
            }
            if (zorder <= 0) {
                throw "Invalid plugin zorder";
            }


            plugin.init(this);

            var canvas = document.createElement('canvas');
            canvas.width = this._Mx.canvas.width;
            canvas.height = this._Mx.canvas.height;

            this._Gx.plugins.push({
                impl: plugin,
                zorder: zorder,
                canvas: canvas
            });

            this._Gx.plugins.sort(function(a, b) {
                return (a.zorder - b.zorder);
            });


            this.refresh();
        },

        /**
         * Removes a plugin from the plot
         *
         * @param plugin
         *            the plugin object
         */
        remove_plugin: function(plugin) {
            var i = this._Gx.plugins.length;
            while (i--) {
                if (this._Gx.plugins[i].impl === plugin) {
                    if (plugin.dispose) {
                        plugin.dispose();
                    }
                    if (this._Gx.plugins[i].canvas.parentNode) {
                        this._Gx.plugins[i].canvas.parentNode.removeElement(this._Gx.plugins[i].canvas);
                    }
                    this._Gx.plugins.splice(i, 1);
                }
            }
            this._Gx.plugins.sort(function(a, b) {
                return (a.zorder - b.zorder);
            });

            this.refresh();
        },

        /**
         * Adds a listener to plot events.
         *
         * @param what
         *            the event to listen to mtag = a mouse 'tag' event has
         *            occurred, mmove = a mouse move event has occurred, mdown =
         *            a mouse down event has occurred, mup = a mouse up event
         *            has occurred, showmenu = showmenu even has occurred,
         *            sigplotexit = an exit plot event has occurred, reread = a
         *            reread event has occurred, file_deoverlayed = a file has
         *            been deoverlayed, file_overlayed = a file has been
         *            overlayed,
         *
         * @param callback
         */
        addListener: function(what, callback) {
            var Mx = this._Mx;
            mx.addEventListener(Mx, what, callback, false);
        },

        /**
         * Removes a listener to plot events.
         *
         * @param what
         *            the event that was listned to
         * @param callback
         */
        removeListener: function(what, callback) {
            var Mx = this._Mx;
            mx.removeEventListener(Mx, what, callback, false);
        },

        /**
         * Change one or more plot settings. For boolean types, passing null
         * will toggle the setting.
         *
         * @param settings
         *            the settings to change.
         *
         * @param {Boolean}
         *            settings.grid change grid visibility
         *
         * @param {Boolean}
         *            settings.index change index setting
         *
         * @param {Boolean}
         *            settings.all change the plot to show all data
         *
         * @param {Boolean}
         *            settings.show_x_axis
         *
         * @param {Boolean}
         *            settings.show_y_axis
         *
         * @param {Boolean}
         *            settings.show_readout
         *
         * @param {Boolean}
         *            settings.specs
         *
         * @param {String}
         *            settings.xcnt "leftmouse", "continuous", "disable",
         *            "enable"
         *
         * @param {Boolean}
         *            settings.legend
         *
         * @param {Boolean}
         *            settings.pan
         *
         * @param {Boolean}
         *            settings.cross
         *
         * @param {String}
         *            settings.rubberbox_action
         *
         * @param {String}
         *            settings.rubberbox_mode
         *
         * @param {String}
         *            settings.rightclick_rubberbox_action
         *
         * @param {String}
         *            settings.rightclick_rubberbox_mode
         *
         * @param {String}
         *            settings.wheelscroll_mode_natural
         *
         * @param {String}
         *            settings.cmode
         *
         * @param {String}
         *            settings.phunits
         */
        change_settings: function(settings) {
            var Gx = this._Gx;
            var Mx = this._Mx;

            for (var i = 0; i < Gx.lyr.length; i++) {
                Gx.lyr[i].change_settings(settings);
            }

            if (settings.grid !== undefined) {
                if (settings.grid === null) {
                    Gx.grid = !Gx.grid;
                } else {
                    Gx.grid = settings.grid;
                }
            }

            if (settings.gridBackground !== undefined) {
                Gx.gridBackground = settings.gridBackground;
            }

            if (settings.gridStyle !== undefined) {
                Gx.gridStyle = settings.gridStyle;
            }

            if (settings.wheelZoom !== undefined) {
                Gx.wheelZoom = settings.wheelZoom;
            }

            if (settings.wheelZoomPercent !== undefined) {
                Gx.wheelZoomPercent = settings.wheelZoomPercent;
            }

            if (settings.autol !== undefined) {
                Gx.autol = settings.autol;
            }

            if ((settings.index !== undefined) && (settings.index !== Gx.index)) {
                if (settings.index === null) {
                    Gx.index = !Gx.index;
                } else {
                    Gx.index = settings.index;
                }

                // the original sigplot.for fails
                // to do this so that the specs area
                // has the correct setting.
                if ((Gx.index) && (Gx.iabsc !== 1)) {
                    Gx.iabsc = 1;
                } else if ((!Gx.index) && (Gx.iabsc === 1)) {
                    Gx.iabsc = 0;
                }

                var xmin;
                var xmax;
                scale_base(this, {
                    get_data: false
                }, xmin, xmax);

                // like sigplot, undo all zoom levels
                this.unzoom();
            }

            if (settings.all !== undefined) {
                if (settings.all === null) {
                    Gx.all = !Gx.all;
                } else {
                    Gx.all = settings.all;
                }
            }

            if (settings.show_x_axis !== undefined) {
                if (settings.show_x_axis === null) {
                    Gx.show_x_axis = !Gx.show_x_axis;
                } else {
                    Gx.show_x_axis = settings.show_x_axis;
                }
                Gx.specs = (Gx.show_x_axis || Gx.show_y_axis || Gx.show_readout);
            }

            if (settings.show_y_axis !== undefined) {
                if (settings.show_y_axis === null) {
                    Gx.show_y_axis = !Gx.show_y_axis;
                } else {
                    Gx.show_y_axis = settings.show_y_axis;
                }
                Gx.specs = (Gx.show_x_axis || Gx.show_y_axis || Gx.show_readout);
            }

            if (settings.show_readout !== undefined) {
                if (settings.show_readout === null) {
                    Gx.show_readout = !Gx.show_readout;
                } else {
                    Gx.show_readout = settings.show_readout;
                }
                Gx.specs = (Gx.show_x_axis || Gx.show_y_axis || Gx.show_readout);
            }

            if (settings.specs !== undefined) {
                if (settings.specs === null) {
                    Gx.specs = !Gx.specs;
                } else {
                    Gx.specs = settings.specs;
                }
                if (Gx.specs) {
                    Gx.show_x_axis = true;
                    Gx.show_y_axis = true;
                    Gx.show_readout = true;
                } else {
                    Gx.show_x_axis = false;
                    Gx.show_y_axis = false;
                    Gx.show_readout = false;
                }
            }

            if (settings.xcnt !== undefined) {
                if (settings.xcnt === "leftmouse") {
                    Gx.cntrls = 1;
                } else if (settings.xcnt === "continuous") {
                    Gx.cntrls = 2;
                } else if ((settings.xcnt === "disable") && (Gx.cntrls > 0)) {
                    Gx.cntrls = -1 * Gx.cntrls;
                } else if ((settings.xcnt === "enable") && (Gx.cntrls < 0)) {
                    Gx.cntrls = -1 * Gx.cntrls;
                } else {
                    Gx.cntrls = settings.xcnt;
                }
            }

            if (settings.legend !== undefined) {
                if (settings.legend === null) {
                    Gx.legend = !Gx.legend;
                } else {
                    Gx.legend = settings.legend;
                }
            }

            if (settings.pan !== undefined) {
                if (settings.pan === null) {
                    Gx.pan = !Gx.pan;
                } else {
                    Gx.pan = settings.pan;
                }
            }

            if (settings.cross !== undefined) {
                if (settings.cross === null) { // catch null or undefined here
                    Gx.cross = !Gx.cross;
                } else {
                    Gx.cross = settings.cross;
                }
                if (!Gx.cross) {
                    if (Gx.cross_xpos !== undefined) {
                        mx.rubberline(Mx, Gx.cross_xpos, Mx.t, Gx.cross_xpos,
                            Mx.b);
                    }
                    if (Gx.cross_ypos !== undefined) {
                        mx.rubberline(Mx, Mx.l, Gx.cross_ypos, Mx.r,
                            Gx.cross_ypos);
                    }
                    Gx.cross_xpos = undefined;
                    Gx.cross_ypos = undefined;
                } else {
                    Gx.cross_xpos = undefined;
                    Gx.cross_ypos = undefined;
                    draw_crosshairs(this);
                }
            }

            if (settings.cmode !== undefined) {
                changemode(this, settings.cmode);
            }

            if (settings.phunits !== undefined) {
                changephunits(this, settings.phunits);
            }

            if (settings.rubberbox_action !== undefined) {
                Gx.default_rubberbox_action = settings.rubberbox_action;
            }

            if (settings.rubberbox_mode !== undefined) {
                Gx.default_rubberbox_mode = settings.rubberbox_mode;
            }

            if (settings.rightclick_rubberbox_action !== undefined) {
                Gx.default_rightclick_rubberbox_action = settings.rightclick_rubberbox_action;
            }

            if (settings.rightclick_rubberbox_mode !== undefined) {
                Gx.default_rightclick_rubberbox_mode = settings.rightclick_rubberbox_mode;
            }

            if (settings.wheelscroll_mode_natural !== undefined) {
                Gx.wheelscroll_mode_natural = settings.wheelscroll_mode_natural;
            }

            if (settings.colors !== undefined) {
                if (!settings.colors.fg) {
                    settings.colors.fg = Mx.fg;
                }
                if (!settings.colors.bg) {
                    settings.colors.bg = Mx.bg;
                }
                mx.setbgfg(Mx, settings.colors.bg, settings.colors.fg, Mx.xi);
            }

            if (settings.cmap !== undefined) {
                if (settings.cmap === null) {
                    // default
                    if (Gx.cmode === 2) {
                        Gx.cmap = 2; // wheel
                    } else {
                        Gx.cmap = 1; // ramp
                    }
                } else {
                    Gx.cmap = settings.cmap; // TODO support string lookup
                }

                setup_cmap(this, Gx.cmap);
            }

            if (settings.yinv !== undefined) {
                if (settings.yinv) {
                    Mx.origin = 4;
                } else {
                    Mx.origin = 1;
                }
            }

            if (settings.rasterSmoothing !== undefined) {
                if (settings.rasterSmoothing === null) {
                    Gx.rasterSmoothing = !Gx.rasterSmoothing;
                } else {
                    Gx.rasterSmoothing = settings.rasterSmoothing;
                }
            }

            if (settings.fillStyle !== undefined) {
                Gx.fillStyle = settings.fillStyle;
            }

            if (settings.invert !== undefined) {
                if (settings.invert === null) {
                    mx.invertbgfg(Mx);
                } else if (settings.invert === true) {
                    mx.setbgfg(this, "white", "black");
                } else {
                    mx.setbgfg(this, "black", "white");
                }
            }

            if (settings.nomenu !== undefined) {
                if (settings.nomenu === null) {
                    Gx.nomenu = !Gx.nomenu;
                } else {
                    Gx.nomenu = settings.nomenu;
                }
            }

            if (settings.ymin !== undefined) {
                updateViewbox(this, settings.ymin, Mx.stk[0].ymax, "Y");
            }

            if (settings.ymax !== undefined) {
                updateViewbox(this, Mx.stk[0].ymin, settings.ymax, "Y");
            }

            if (settings.xmin !== undefined) {
                updateViewbox(this, settings.xmin, Mx.stk[0].xmax, "X");
            }

            if (settings.xmax !== undefined) {
                updateViewbox(this, Mx.stk[0].xmin, settings.xmax, "X");
            }

            if (settings.zmin !== undefined) {
                Gx.zmin = settings.zmin;
                Gx.autoz = (Gx.autoz & 2);
            }

            if (settings.zmax !== undefined) {
                Gx.zmax = settings.zmax;
                Gx.autoz = (Gx.autoz & 1);
            }

            if (settings.autoz !== undefined) {
                Gx.autoz = settings.autoz;
                if (((Gx.autoz & 1) !== 0)) {
                    Gx.zmin = undefined;
                }
                if (((Gx.autoz & 2) !== 0)) {
                    Gx.zmax = undefined;
                }
            }

            if (settings.note !== undefined) {
                Gx.note = settings.note;
            }

            this.refresh();
            if (settings.pan !== undefined) { // refactor - new code to handle
                // disappearing specs
                display_specs(this);
            }
        },

        /**
         * Reread all files and refresh the plot.
         */
        reread: function() {
            var Gx = this._Gx;
            var oldLayerData = [];
            for (var k = 0; k < Gx.lyr.length; k++) { // make a copy of layer
                // data before
                // destroying Gx.lyr
                // with the deoverlay
                oldLayerData[k] = Gx.lyr[k];
            }

            var origHCB = Gx.HCB.slice();
            this.deoverlay();
            for (var i = 0; i < origHCB.length; i++) {
                this.overlay_bluefile(origHCB[i]);
            }

            // propagate old layer attributes to re-read layers
            for (var j = 0; j < Gx.lyr.length; j++) {
                // TODO Assumes indices of old Gx.lyr and new Gx.lyr will match
                // up correctly - should we instead use hcb and name to identify
                Gx.lyr[j].symbol = oldLayerData[j].symbol;
                Gx.lyr[j].radius = oldLayerData[j].radius;
                // TODO re-copy other things like line type???
            }
            this.refresh();

            // Notify listeners that a reread was performed
            var evt = document.createEvent('Event');
            evt.initEvent('reread', true, true);
            mx.dispatchEvent(this._Mx, evt);
        },

        /**
         * Placeholder for cleanup logic.
         */
        cleanup: function() {
            // TODO not sure what we really want to do here yet
        },

        /**
         * Reload data without adjusting other aspects about a plot
         *
         * @param {Number} n
         *            the layer to push data into
         * @param {Number[]} data
         *            data to push
         * @param {Object} hdrmod
         *            optional changes to the file header
         */
        reload: function(n, data, hdrmod, rsync) {
            var Mx = this._Mx;
            var Gx = this._Gx;
            if ((n < 0) || (n >= Gx.lyr.length)) {
                return;
            }

            if (Gx.lyr[n].reload === undefined) {
                return;
            }

            var xbnds = Gx.lyr[n].reload(data, hdrmod);

            if (Mx.level === 0) {
                // Unlike push(), always call scale_base
                // when reload is invoked
                scale_base(this, {
                    get_data: false
                }, xbnds.xmin, xbnds.xmax);
            }

            if (rsync) {
                this._refresh();
            } else {
                this.refresh();
            }

        },

        rescale: function() {
            var Mx = this._Mx;

            if (Mx.level === 0) {
                scale_base(this, {
                    get_data: false
                }, undefined, undefined);
            }

            this.refresh();
        },

        /**
         * Push data into a layer that was created with overlay_pipe
         *
         * @param {Number} n
         *            the layer to push data into
         * @param {Number[]} data
         *            data to push
         * @param {Object} hdrmod
         *            optional changes to the file header
         * @param {boolean} [sync=false]
         *            optional dispatch onpipewrite syncronously
         * @param {boolean} [rsync=false]
         *            optional dispatch refresh syncronously
         */
        push: function(n, data, hdrmod, sync, rsync) {
            var Mx = this._Mx;
            var Gx = this._Gx;
            if ((n < 0) || (n >= Gx.lyr.length)) {
                return;
            }

            if (Gx.lyr[n].push === undefined) {
                return;
            }

            var rescale = Gx.lyr[n].push(data, hdrmod, sync);

            if ((Mx.level === 0) && rescale) {
                scale_base(this, {
                    get_data: false
                });
            }

            if (rsync) {
                this._refresh();
            } else {
                this.refresh();
            }
        },

        /**
         * Create a plot layer backed by an array
         *
         * @param filname
         * @param data
         *            {Number[]} data to plot
         * @param overrides
         *            optional bluefile header overrides
         * @param layerType
         */
        overlay_array: function(data, overrides, layerOptions) {
            m.log.debug("Overlay array");
            var hcb = m.initialize(data, overrides);
            return this.overlay_bluefile(hcb, layerOptions);
        },

        overlay_pipe: function(overrides, layerOptions) {
            m.log.debug("Overlay pipe");
            if (!overrides) {
                overrides = {};
            }
            overrides.pipe = true;
            var hcb = m.initialize(null, overrides);
            //console.log("pipe filename: "+hcb.file_name);
            return this.overlay_bluefile(hcb, layerOptions);
        },

        overlay_websocket: function(wsurl, overrides, layerOptions) {
            m.log.debug("Overlay websocket: " + wsurl);
            var ws = new WebSocket(wsurl, "plot-data");
            ws.binaryType = "arraybuffer";

            var plot = this;
            if (!overrides) {
                overrides = {};
            }
            overrides.pipe = true;
            var hcb = m.initialize(null, overrides);
            hcb.ws = ws;

            var layer_n = this.overlay_bluefile(hcb, layerOptions);

            ws.onopen = function(evt) {};

            ws.onmessage = (function(theSocket) {
                return function(evt) {
                    if (evt.data instanceof ArrayBuffer) {
                        var data = hcb.createArray(evt.data);
                        plot.push(layer_n, data);
                    } else if (typeof evt.data === "string") {
                        var Gx = plot._Gx;
                        var hdr = Gx.lyr[layer_n].hcb;
                        if (!hdr) {
                            m.log.warning("Couldn't find header for layer " + layer_n);
                        }

                        var newHdr = JSON.parse(evt.data);
                        plot.push(layer_n, [], newHdr);
                    }
                };
            })(ws);

            return layer_n;
        },

        /**
         * Create a plot layer from an HREF that points to a BLUEFILE
         *
         * @param {String}
         *            href the url to the bluefile
         * @param [onload]
         *            callback to be called when the file has been loaded
         */
        overlay_href: function(href, onload, layerOptions) {
            m.log.debug("Overlay href: " + href);
            try {
                this.show_spinner();

                var handleHeader = (function(plot, onload) {
                    return function(hcb) {
                        try {
                            if (!hcb) {
                                alert("Failed to load data");
                            } else {
                                var i = plot.overlay_bluefile(hcb, layerOptions);
                                if (onload) {
                                    onload(hcb, i);
                                }
                            }
                        } finally {
                            plot.hide_spinner();
                        }
                    };
                }(this, onload));

                var br = new BlueFileReader();
                br.read_http(href, handleHeader);
            } catch (error) {
                console.log(error);
                alert("Failed to load data");
                this.hide_spinner();
            }
        },

        show_spinner: function() {
            if (!this._Gx.spinner) {
                SPINNER_OPTS.color = this._Mx.xwfg;
                this._Gx.spinner = new Spinner(SPINNER_OPTS).spin(this._Gx.parent);
            }
        },

        hide_spinner: function() {
            if (this._Gx.spinner) {
                this._Gx.spinner.stop();
            }
            this._Gx.spinner = undefined;
        },

        add_layer: function(layer) {
            var Gx = this._Gx;
            var Mx = this._Mx;

            // Notify listeners that a file was overlayed
            var evt = document.createEvent('Event');
            evt.initEvent('lyradd', true, true);
            evt.index = Gx.lyr.length; // the new index of the layer
            evt.name = layer.name; // the name of the layer
            evt.layer = layer;
            var executeDefault = mx.dispatchEvent(Mx, evt);
            if (executeDefault) {
                Gx.lyr.push(layer);
            }
        },

        get_layer: function(n) {
            var Gx = this._Gx;
            if ((n >= 0) && (n < Gx.lyr.length)) {
                return Gx.lyr[n];
            } else {
                return null;
            }
        },

        /**
         * Create a plot layer backed by a bluefile header
         *
         * @param hcb
         *            {BlueHeader} an opened BlueHeader file
         * @returns the index of the new layer
         */
        overlay_bluefile: function(hcb, layerOptions) {
            m.log.debug("Overlay bluefile: " + hcb.file_name);
            var Mx = this._Mx;
            var Gx = this._Gx;
            var size = 0;

            layerOptions = layerOptions || {};

            var basefiles = (Gx.HCB.length === 0);

            Gx.HCB.push(hcb);

            if (Gx.HCB.length === 1) {
                basefile(this, true);
            }

            var newlayer = Gx.lyr.length;

            if (layerOptions.layerType === undefined) {
                if (hcb["class"] === 1) {
                    sigplot.Layer1D.overlay(this, hcb, layerOptions);
                } else if (hcb["class"] === 2) {
                    sigplot.Layer2D.overlay(this, hcb, layerOptions);
                }
            } else {
                if (layerOptions.layerType === "1D") {
                    sigplot.Layer1D.overlay(this, hcb, layerOptions);
                } else if (layerOptions.layerType === "2D") {
                    sigplot.Layer2D.overlay(this, hcb, layerOptions);
                } else {
                    layerOptions.layerType.overlay(this, hcb, layerOptions);
                }
            }

            // TODO - do we want to alert like the XM plot did?
            //if (!Gx.all && size > Gx.bufmax && Gx.HCB.length == 1) {
            // alert("Plot truncated to buffer size. Use panning or /ALL
            // switch");
            //}
            // The original code has a bug here. Fixed by moving changemode
            // outside of
            // the !basefiles check.
            // You can recreate with SIGPLOT ,,, IR
            // And then loading a file.
            changemode(this, Gx.cmode);

            if (!basefiles && !layerOptions.expand) {
                for (var n = newlayer; n < Gx.lyr.length; n++) {
                    draw_layer(this, n);
                }
            } else {
                if (Gx.HCB.length === 0) { // TODO dead code that cannot be reached
                    basefile(this, false);
                } else {
                    Gx.basemode = Gx.cmode;
                    var xmin;
                    var xmax;
                    if ((Gx.autox && 1) === 0) {
                        xmin = Gx.xmin;
                    }
                    if ((Gx.autox && 2) === 0) {
                        xmax = Gx.xmin;
                    }
                    scale_base(this, {
                        get_data: true
                    }, xmin, xmax);
                    Mx.level = 0;
                    if ((Gx.autox && 1) !== 0) {
                        Gx.xmin = Mx.stk[0].xmin;
                    }
                    if ((Gx.autox && 2) !== 0) {
                        Gx.xmax = Mx.stk[0].xmax;
                    }
                    if ((Gx.autoy && 1) !== 0) {
                        Gx.ymin = Mx.stk[0].ymin;
                    }
                    if ((Gx.autoy && 2) !== 0) {
                        Gx.ymax = Mx.stk[0].ymax;
                    }
                    Mx.resize = true;
                    if (Gx.lyr[0].preferred_origin) {
                        Mx.origin = Gx.lyr[0].preferred_origin;
                    } else {
                        Mx.origin = 1;
                    }
                }
            }
            form_plotnote(this);
            this.refresh();

            return (Gx.HCB.length - 1);
        },

        /**
         * Load one or more files.
         *
         * @param {File[]}
         *            a list of files to plot
         */
        load_files: function(files, layerType) {
            var onload = (function(plot) {
                return function(hdr) {
                    plot.overlay_bluefile(hdr, layerType);
                };
            })(this);

            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                var br = new BlueFileReader();
                br.read(f, onload);
            }
        },

        /**
         * Remove layers.
         *
         * @param [index]
         *            the layer to remove, if not provided all layers are
         *            removed. Negative indices can be used to remove layers
         *            from the back of the layer stack.
         */
        deoverlay: function(index) {
            var Gx = this._Gx;
            var Mx = this._Mx;

            if (Gx.HCB.length > 0) {
                if (index === undefined) {
                    for (var n = Gx.HCB.length - 1; n >= 0; n--) {
                        this.remove_layer(n);
                    }
                } else if (index < 0) {
                    var n = Gx.HCB.length + index;
                    if (n < 0) {
                        return;
                    }
                    this.remove_layer(n);
                } else if (index < Gx.HCB.length) {
                    this.remove_layer(index);
                }
            }
            if (Gx.lyr.length === 0) {
                basefile(this, false);
                scale_base(this, {});
            }
        },

        /**
         * Remove a layer.
         *
         * @param index
         *            the layer to remove
         */
        remove_layer: function(index) {
            var Gx = this._Gx;

            var fileName = "";
            var HCB = null;

            if ((index >= 0) && (index < Gx.HCB.length)) {
                fileName = Gx.HCB[index].file_name;
                // TODO if (Gx.modsource > 0) {
                //	
                // }
                HCB = Gx.HCB[index];
                Gx.HCB[index] = null;
                for (var n = index; n < Gx.HCB.length - 1; n++) {
                    Gx.HCB[n] = Gx.HCB[n + 1];
                }
                Gx.HCB.length -= 1;
            }

            for (var n = Gx.lyr.length - 1; n >= 0; n--) {
                if (Gx.lyr[n].hcb === HCB) {
                    delete_layer(this, n);
                }
            }
            form_plotnote(this);
            this.refresh();

            // Notify listeners that a file has been deoverlayed
            var evt = document.createEvent('Event');
            evt.initEvent('file_deoverlayed', true, true);
            if (fileName !== "") {
                evt.fileName = fileName; // The fileName that was
            }
            // de-overlayed
            mx.dispatchEvent(this._Mx, evt);
        },

        /**
         * Zoom onto a given pixel range.
         */
        pixel_zoom: function(x1, y1, x2, y2, continuous) {
            var r1 = pixel_to_real(this, x1, y1);
            var r2 = pixel_to_real(this, x2, y2);

            this.zoom(r1, r2, continuous);
        },

        percent_zoom: function(xperc, yperc, continuous) {
            var Mx = this._Mx;
            var Gx = this._Gx;

            var xadj = 0;
            if (Math.abs(xperc) < 1) {
                xadj = Math.abs(Mx.stk[Mx.level].xmax - Mx.stk[Mx.level].xmin);
                xadj = (xadj * xperc) / 2;
            }

            var yadj = 0;
            if (Math.abs(yperc) < 1) {
                yadj = Math.abs(Mx.stk[Mx.level].ymax - Mx.stk[Mx.level].ymin);
                yadj = (yadj * yperc) / 2;
            }

            var ul = {
                x: Math.max(Mx.stk[Mx.level].xmin + xadj, Gx.panxmin),
                y: Math.max(Mx.stk[Mx.level].ymin + yadj, Gx.panymin)
            };
            var lr = {
                x: Math.min(Mx.stk[Mx.level].xmax - xadj, Gx.panxmax),
                y: Math.min(Mx.stk[Mx.level].ymax - yadj, Gx.panymax)
            };

            this.zoom(ul, lr, continuous);
        },

        /**
         * Zoom onto a given region.
         *
         * @param ul
         *            the uppler left corner
         * @param {Number}
         *            ul.x the upper left x pos in real plot value
         * @param {Number}
         *            ul.y the upper left y pos in real plot values
         *
         * @param lr
         *            the lower right corner
         * @param {Number}
         *            lr the lower right x pos in real plot value
         * @param {Number}
         *            lr the lower right y pos in real plot values
         *
         * @param continuous
         *            enter continuous zoom mode.  This will create a
         *            new if you are on level 0, but stay on the same level
         *            otherwise
         */
        zoom: function(ul, lr, continuous) {
            var Mx = this._Mx;
            var Gx = this._Gx;

            if (Mx.level >= 9) { // currently only allow 10 zooms
                return;
            }

            if (ul.x === undefined) {
                ul.x = Mx.stk[Mx.level].xmin;
            }
            if (ul.y === undefined) {
                ul.y = Mx.stk[Mx.level].ymin;
            }
            if (lr.x === undefined) {
                lr.x = Mx.stk[Mx.level].xmax;
            }
            if (lr.y === undefined) {
                lr.y = Mx.stk[Mx.level].ymax;
            }

            if (lr.x < ul.x) {
                var xtmp = lr.x;
                lr.x = ul.x;
                ul.x = xtmp;
            }
            if (lr.y < ul.y) {
                var ytmp = lr.y;
                lr.y = ul.y;
                ul.y = ytmp;
            }

            var zstk = {};

            // xscl/yscl are reset in sigplot.refresh
            zstk.xscl = Mx.stk[Mx.level].xscl;
            zstk.yscl = Mx.stk[Mx.level].yscl;

            zstk.xmin = ul.x; // real world val at x1(origin=1,4) or
            // x2(origin=2,4)
            zstk.xmax = lr.x; // real world val at x2(origin=1,4) or
            // x1(origin=2,4)
            zstk.ymin = ul.y; // real world val at y2(origin=1,2) or
            // y1(origin=3,4)
            zstk.ymax = lr.y; // real world val at y1(origin=1,2) or
            // y2(origin=3,4)
            if (Gx.index) {
                zstk.xmin = Math.min(zstk.xmin / Gx.xdelta);
                zstk.xmax = Math.min(zstk.xmax / Gx.xdelta);
            }

            if (!continuous || (!Gx.inContinuousZoom)) {
                // We aren't yet in continuous zoom mode
                // so create a new level
                Mx.stk.push(zstk);
                Mx.level = Mx.stk.length - 1;
            } else {
                // Once in continuous zoom mode update the current level
                Mx.stk[Mx.level] = zstk;
            }
            Gx.inContinuousZoom = continuous;

            this.inZoom = true; // prevent recursive zooms
            var evt = document.createEvent('Event');
            evt.initEvent('zoom', true, true);
            evt.level = Mx.level;
            evt.inContinuousZoom = Gx.inContinuousZoom;
            evt.xmin = Mx.stk[Mx.level].xmin;
            evt.ymin = Mx.stk[Mx.level].ymin;
            evt.xmax = Mx.stk[Mx.level].xmax;
            evt.ymax = Mx.stk[Mx.level].ymax;
            mx.dispatchEvent(Mx, evt); // TODO should we allow zoom to be cancelled?
            this.inZoom = false;

            this.refresh();
        },

        /**
         * Unzoom one or more levels.
         *
         * @param [levels]
         *            the number of levels to unzoom, if not provided unzoom
         *            all.
         */
        unzoom: function(levels) {
            var Mx = this._Mx;
            var Gx = this._Gx;

            if (Mx.level === 0) {
                return;
            }

            if (!levels) {
                levels = Mx.stk.length;
            }

            while (levels > 0) {
                if (Mx.level === 0) {
                    break;
                }
                Mx.stk.pop();
                Mx.level = Mx.stk.length - 1;
                levels -= 1;
            }

            // If we are back at level 0, then
            // rescale
            if (Mx.level === 0) {
                this.rescale();
            }

            // After any unzooms you can no longer remain in
            // continuous zoom
            Gx.inContinuousZoom = false;

            this.inZoom = true; // prevent recursive zoom
            // Send the event to listeners
            var evt = document.createEvent('Event');
            evt.initEvent('unzoom', true, true);
            evt.level = Mx.level;
            evt.xmin = Mx.stk[Mx.level].xmin;
            evt.ymin = Mx.stk[Mx.level].ymin;
            evt.xmax = Mx.stk[Mx.level].xmax;
            evt.ymax = Mx.stk[Mx.level].ymax;
            mx.dispatchEvent(Mx, evt);
            this.inZoom = false;

            this.refresh();
        },

        /**
         * Register this plot to mimic zoom/unzoom of other plot
         *
         * @param other
         *     the other plot to mimic
         *
         * @param mask
         *     the set of event to respond to
         *
         * @param mask.zoom
         *     if true, respond to zoom events
         *
         * @param mask.xzoom
         *     if true, respond to zoom events for the x-axis only
         *
         * @param mask.yzoom
         *     if true, respond to zoom events for the y-axis only
         *
         * @param mask.unzoom
         *     if true, respond to unzoom events
         *
         * @param mask.pan
         *     if true, respond to pan events
         *
         * @param mask.xpan
         *     if true, respond to pan events for the x-axis only
         *
         * @param mask.ypan
         *     if true, respond to pan events for the y-axis only
         */
        mimic: function(other, mask) {
            var self = this;

            if (!mask) {
                throw "mimic must be called with at least one event mask";
            }

            if (mask.zoom) {
                other.addListener("zoom", function(event) {
                    if (self.inZoom) {
                        return;
                    }
                    self.zoom({
                            x: event.xmin,
                            y: event.ymin
                        }, {
                            x: event.xmax,
                            y: event.ymax
                        },
                        event.inContinuousZoom);
                });
            } else if (mask.xzoom) {
                other.addListener("zoom", function(event) {
                    if (self.inZoom) {
                        return;
                    }
                    self.zoom({
                            x: event.xmin,
                            y: undefined
                        }, {
                            x: event.xmax,
                            y: undefined
                        },
                        event.inContinuousZoom);
                });
            } else if (mask.yzoom) {
                other.addListener("zoom", function(event) {
                    if (self.inZoom) {
                        return;
                    }
                    self.zoom({
                            x: undefined,
                            y: event.ymin
                        }, {
                            x: undefined,
                            y: event.ymax
                        },
                        event.inContinuousZoom);
                });
            }

            if (mask.unzoom) {
                other.addListener("unzoom", function(event) {
                    if (self.inZoom) {
                        return;
                    }
                    if (event.level < self._Mx.level) {
                        self.unzoom(self._Mx.level - event.level);
                    }
                });
            }

            if (mask.pan || mask.xpan) {
                other.addListener("xpan", function(event) {
                    if (self.inPan) {
                        return;
                    }
                    updateViewbox(self, event.xmin, event.xmax, "X");
                });
            }

            if (mask.pan || mask.ypan) {
                other.addListener("ypan", function(event) {
                    if (self.inPan) {
                        return;
                    }
                    updateViewbox(self, event.ymin, event.ymax, "Y");
                });
            }

        },

        // TODO - do we want an unmimic?

        /**
         * Like refresh, but doesn't rerender data
         *
         */
        redraw: function() {
            var Gx = this._Gx;
            var Mx = this._Mx;
            var ctx = Mx.canvas.getContext("2d");

            if (!Gx.plotData.valid) {
                this.refresh();
            } else {
                ctx.drawImage(Gx.plotData,
                    Mx.l - 1,
                    Mx.t - 1, (Mx.r - Mx.l) + 2, (Mx.b - Mx.t) + 2,
                    Mx.l - 1,
                    Mx.t - 1, (Mx.r - Mx.l) + 2, (Mx.b - Mx.t) + 2
                );

                draw_plugins(this);

                Gx.cross_xpos = undefined;
                Gx.cross_ypos = undefined;
                draw_crosshairs(this);

                if (Gx.always_show_marker || Gx.show_marker) {
                    draw_marker(this);
                }
            }
        },

        /**
         * Refresh the entire plot
         */
        refresh: function() {
            var self = this;
            mx.render(this._Mx, function() {
                self._refresh();
            });
        },

        enable_listeners: function() {
            var Mx = this._Mx;
            mx.addEventListener(Mx, "mousedown", this.onmousedown, false);
            mx.addEventListener(Mx, "mousemove", this.throttledOnMouseMove, false);
            document.addEventListener("mouseup", this.docMouseUp, false);
            mx.addEventListener(Mx, "mouseup", this.mouseup, false);
            window.addEventListener("mousedown", this.dragMouseDownHandler, false);
            window.addEventListener("mousemove", this.throttledDragOnMouseMove, false);
            window.addEventListener("mouseup", this.dragMouseUpHandler, false);
            window.addEventListener("wheel", this.wheelHandler, false);
            window.addEventListener("mousewheel", this.wheelHandler, false);
            window.addEventListener("DOMMouseScroll", this.wheelHandler, false);
            window.addEventListener("keypress", this.onkeypress, false);
        },

        disable_listeners: function() {
            var Mx = this._Mx;

            mx.removeEventListener(Mx, "mousedown", this.onmousedown, false);
            mx.removeEventListener(Mx, "mousemove", this.throttledOnMouseMove,
                false);
            document.removeEventListener("mouseup", this.docMouseUp, false);
            mx.removeEventListener(Mx, "mouseup", this.mouseup, false);
            window.removeEventListener("mousedown", this.dragMouseDownHandler,
                false);
            window.removeEventListener("mousemove", this.throttledDragOnMouseMove,
                false);
            window.removeEventListener("mouseup", this.dragMouseUpHandler, false);
            window.removeEventListener("wheel", this.wheelHandler, false);
            window.removeEventListener("mousewheel", this.wheelHandler, false);
            window.removeEventListener("DOMMouseScroll", this.wheelHandler, false);
            window.removeEventListener("keypress", this.onkeypress, false);
        },

        checkresize: function() {
            if (mx.checkresize(this._Mx)) {
                this.refresh();
            }
        },

        _refresh: function() {
            var Mx = this._Mx;
            var Gx = this._Gx;
            var ctx = Mx.canvas.getContext("2d");
            var plugin_index = 0;

            if (Gx.hold) {
                return;
            }
            mx.set_font(Mx, Math.min(8, Mx.width / 64));
            Gx.pthk = Mx.text_w * 1.5;

            if (Gx.specs) {
                var ytimecode = false;
                if (Gx.ylab === 4) { //time-based tics
                    ytimecode = true;
                }
                // Set left and right edges
                if (Gx.show_y_axis === true) {
                    Mx.l = Mx.text_w * 6;
                    if (ytimecode) {
                        // If we are in ytimecode, determine if we need the extra
                        // space to hold the entire YYYY:MM:DD
                        var need_full_ymd = ((Math.abs(Mx.stk[0].ymin) >= 31536000) ||
                            (Math.abs(Mx.stk[0].ymax) >= 31536000));
                        if (need_full_ymd) {
                            Mx.l = Mx.text_w * 11;
                        }
                    }
                } else {
                    Mx.l = 1;
                }
                if (Gx.pan === true) {
                    Mx.r = Mx.width - (Gx.pthk + 2 * Mx.text_w);
                } else {
                    Mx.r = Mx.width - 2;
                }

                // Set top and bottom
                if (Gx.show_readout) {
                    Mx.t = Mx.text_h * 2;
                    if (Gx.show_x_axis) {
                        Mx.b = Mx.height - Mx.text_h * 4;
                    } else {
                        Mx.b = Mx.height - Mx.text_h * 3;
                    }
                } else {
                    if (Gx.pan) {
                        Mx.t = Gx.pthk + 2 * Mx.text_w;
                    } else {
                        Mx.t = 1;
                    }
                    if (Gx.show_x_axis) {
                        Mx.b = Mx.height - (Mx.text_h * 3) / 2;
                    } else {
                        Mx.b = Mx.height - 2;
                    }
                }

                // set left and right edges for X scrollbar
                if (Gx.show_readout) {
                    Gx.pl = Mx.text_w * 50;
                } else {
                    Gx.pl = Mx.text_w * 35;
                }
                Gx.pr = Math.max(Gx.pl + Mx.text_w * 9, Mx.r);

                // set top scrollbar edge for X scrollbar
                if (Gx.show_readout) {
                    if (Gx.show_x_axis) {
                        Gx.pt = Mx.b + Mx.text_h + (Mx.height - Mx.b - Mx.text_h - Gx.pthk) / 2;
                    } else {
                        Gx.pt = Mx.b + (Mx.height - Mx.b - Gx.pthk) / 2;
                    }
                } else {
                    Gx.pt = (Mx.t - Gx.pthk) / 2;
                }
                Gx.lbtn = Mx.text_h + Mx.text_w + 2;
            } else {
                if (Gx.pan) {
                    Mx.t = Gx.pthk + 2 * Mx.text_w;
                    Mx.r = Mx.width - (Gx.pthk + Mx.text_w);
                } else {
                    Mx.t = 1;
                    Mx.r = Mx.width - 2;
                }
                Mx.b = Mx.height - 2;
                Mx.l = 1;
                Gx.pl = Mx.l;
                Gx.pr = Mx.r;
                Gx.pt = (Mx.t - Gx.pthk) / 2;
                Gx.lbtn = 0;
            }

            // pan select ranges
            Gx.pyl = Mx.r + (Mx.width - Mx.r - Gx.pthk) / 2 + 1;

            // set virtual window size/pos/scaling for current level
            var k = Mx.level;
            Mx.stk[k].x1 = Mx.l;
            Mx.stk[k].y1 = Mx.t;
            Mx.stk[k].x2 = Mx.r;
            Mx.stk[k].y2 = Mx.b;
            Mx.stk[k].xscl = (Mx.stk[k].xmax - Mx.stk[k].xmin) / (Mx.r - Mx.l);
            Mx.stk[k].yscl = (Mx.stk[k].ymax - Mx.stk[k].ymin) / (Mx.b - Mx.t);

            // In case things have rescaled
            var re = pixel_to_real(this, Mx.xpos, Mx.ypos);
            Gx.retx = re.x;
            Gx.rety = re.y;

            // modify stack for section plotting
            //if (Gx.sections) {
            // TODO
            //}

            if (Gx.panning === 0 || Gx.panning !== 0) { // TODO Gx.panning !==
                // 0?? Does this work?
                Gx.plotData.valid = false;
                mx.clear_window(Mx);
            } //else if (!Gx.specs) {
            // TODO
            //} else if (Gx.panning === 1) {
            // TODO
            //} else {
            // TODO
            //}

            var xlab = Gx.xlab;
            var ylab = Gx.ylab;

            if (xlab === undefined) {
                xlab = 30;
            }
            if (Gx.index) {
                xlab = 0;
            }

            if (ylab === undefined) {
                var cx = ((Gx.lyr.length > 0) && Gx.lyr[0].cx);
                if (Gx.cmode === 1) {
                    ylab = 28;
                } else if (Gx.cmode === 2) {
                    ylab = Gx.plab;
                } else if ((Gx.cmode === 3) && (cx)) {
                    ylab = 21;
                } else if (Gx.cmode === 4) {
                    ylab = 22;
                } else if (Gx.cmode === 5) {
                    ylab = 22;
                    xlab = 21;
                } else if (Gx.cmode === 6) {
                    ylab = 26;
                } else if (Gx.cmode === 7) {
                    ylab = 27;
                } else {
                    ylab = 0;
                }
            }

            if (Gx.specs) {
                if (Gx.sections === 0) {
                    var drawaxis_flags = {
                        grid: Gx.grid
                    };
                    if (Gx.panning === 2) {
                        drawaxis_flags.noxtlab = true;
                    } // TODO Does this work??
                    if (!Gx.show_x_axis) {
                        drawaxis_flags.noxtics = true;
                        drawaxis_flags.noxtlab = true;
                        drawaxis_flags.noxplab = true;
                    }
                    if (!Gx.show_y_axis) {
                        drawaxis_flags.noytics = true;
                        drawaxis_flags.noytlab = true;
                        drawaxis_flags.noyplab = true;
                    }
                    if (Gx.specs && !Gx.show_readout && !Gx.pan) {
                        drawaxis_flags.noyplab = true;
                        drawaxis_flags.noxplab = true;
                    }
                    if (Gx.gridBackground) {
                        drawaxis_flags.fillStyle = Gx.gridBackground;
                    }
                    if (Gx.gridStyle) {
                        drawaxis_flags.gridStyle = Gx.gridStyle;
                    }
                    if (Gx.xmult) {
                        drawaxis_flags.xmult = Gx.xmult;
                    }
                    if (Gx.ymult) {
                        drawaxis_flags.ymult = Gx.ymult;
                    }
                    mx.drawaxis(Mx, Gx.xdiv, Gx.ydiv, xlab, ylab,
                        drawaxis_flags);
                } //else {
                // Not implemented yet
                //}

                var i = Gx.lbtn - 2;

                if (Gx.show_readout && Gx.pan) {
                    if (Gx.legend) {
                        Gx.legendBtnLocation = {
                            x: Mx.width - Gx.lbtn,
                            y: 2,
                            width: i,
                            height: i
                        };
                        mx.shadowbox(Mx, Mx.width - Gx.lbtn, 2, i, i, 1, -2,
                            'L');
                    } else {
                        Gx.legendBtnLocation = {
                            x: Mx.width - Gx.lbtn,
                            y: 2,
                            width: i,
                            height: i
                        };
                        mx.shadowbox(Mx, Mx.width - Gx.lbtn, 2, i, i, 1,
                            2, 'L');
                    }
                    display_specs(this);
                } else {
                    Gx.legendBtnLocation = null;
                }
            } else if (Gx.grid && Gx.sections >= 0) {
                var drawaxis_flags = {
                    grid: true,
                    noaxisbox: true,
                    noxtics: true,
                    noxtlab: true,
                    noxplab: true,
                    noytics: true,
                    noytlab: true,
                    noyplab: true
                };
                mx.drawaxis(Mx, Gx.xdiv, Gx.ydiv, xlab, ylab,
                    drawaxis_flags);
            }

            for (var n = 0; n < Gx.lyr.length; n++) {
                //if (Gx.sections !== 0) {
                // TODO
                //}
                draw_layer(this, n);
            }

            draw_accessories(this, 4);

            if ((Mx.r > Mx.l) && (Mx.b > Mx.t)) {
                // Resize
                Gx.plotData.width = Mx.canvas.width;
                Gx.plotData.height = Mx.canvas.height;
                Gx.plotData.getContext("2d").drawImage(Mx.canvas, 0, 0);
                Gx.plotData.valid = true;
            }

            draw_plugins(this);


            Gx.cross_xpos = undefined;
            Gx.cross_ypos = undefined;
            draw_crosshairs(this);

            if (Gx.always_show_marker || Gx.show_marker) {
                draw_marker(this);
            }
        }
    };

    // /////////////////////////////////////////////////////////////////////////
    // Private methods and objects
    // /////////////////////////////////////////////////////////////////////////

    /**
     * Options used when displaying the spinner.
     *
     * @memberOf sigplot
     * @private
     */
    var SPINNER_OPTS = {
        lines: 13, // The number of lines to draw
        length: 7, // The length of each line
        width: 4, // The line thickness
        radius: 10, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };

    /**
     * Map integer cmode to string equivalent.
     *
     * @memberOf sigplot
     * @private
     */
    var cxm = ["Ma", "Ph", "Re", "Im", "IR", "Lo", "L2"];

    /**
     * Map integer abscissa mode to string equivalent.
     *
     * @memberOf sigplot
     * @private
     */
    var cam = ["(absc)", "(indx)", "(1/ab)", "(dydx)"];



    /**
     * This object holds the data associated with layers in the plot.
     *
     * @constructor
     * @memberOf sigplot
     * @private
     */
    function SIGPLOTLAYER() {

        this.xbuf = undefined; // raw (ArrayBuffer) of ABSC data
        this.ybuf = undefined; // raw (ArrayBuffer) of ORD data

        this.offset = 0.0;
        this.xstart = 0.0;
        this.xdelta = 0.0;
        this.imin = 0;
        this.xmin = 0.0;
        this.xmax = 0.0;
        this.name = "";
        this.cx = false;
        this.hcb = undefined; // index in Gx.HCB
        // xbufn = xbuf.byteLength
        // ybufn = ybuf.byteLength
        this.size = 0;

        this.display = true;
        this.color = 0;
        this.line = 3; // 0=none, 1-vertical, 2-horizontal, 3-connecting
        this.thick = 1; // negative for dashed
        this.symbol = 0;
        this.radius = 3;

        this.skip = 0; // number of elements between ord values
        this.xsub = 0;
        this.ysub = 0;
        this.xdata = false; // true if X data is data from file

        this.options = {};
    }

    /**
     * The graphics structure object used to hold state about the plot.
     *
     * @constructor
     * @memberOf sigplot
     * @private
     */
    function GX() {
        this.xptr = undefined; // xpoints as anything "array-like"...
        this.yptr = undefined; // ypoints as anything "array-like"...

        this.retx = 0.0; // absc coord. at mouse location
        this.rety = 0.0;
        this.xmrk = 0.0; // absc coord of mark
        this.ymrk = 0.0;
        this.aretx = 0.0; // absc coord. at mouse location
        this.arety = 0.0;

        this.xstart = 0.0;
        this.xdelta = 0.0;

        this.panxmin = 0.0;
        this.panxmax = 0.0;
        this.panymin = 0.0;
        this.panymax = 0.0;
        this.xmin = 0.0;
        this.xmax = 0.0;
        this.xmult = undefined;
        this.ymin = 0.0;
        this.ymax = 0.0;
        this.ymult = undefined;
        this.zmin = undefined;
        this.zmax = undefined;
        this.dbmin = 0.0;
        this.pxscl = 0.0;
        this.pyscl = 0.0;
        this.pmt = 0.0;

        this.note = "";
        // this.mouse unnecssary because we don't have res table
        this.format = "";

        this.pl = 0;
        this.pr = 0;
        this.pt = 0;
        this.pb = 0;
        this.px1 = 0; // specifies plotting field
        this.px2 = 0;
        this.py1 = 0;
        this.py2 = 0;

        this.pyl = 0;
        this.pthk = 0; // thickness of pan drag box

        this.modlayer = 0;
        this.modsource = 0;
        this.modified = false;
        this.modmode = 0;

        this.xdiv = 0;
        this.ydiv = 0;

        this.all = false;
        this.expand = false;
        this.cross = false;
        this.grid = true;
        this.gridBackground = undefined;
        this.index = false;
        this.pan = true;
        this.specs = true;
        this.legend = true;
        this.xdata = false;

        this.show_x_axis = true;
        this.show_y_axis = true;
        this.show_readout = true;
        this.hide_note = false;
        this.autohide_readout = false;
        this.autohide_panbars = false;
        this.panning = undefined;
        this.panmode = 0; // TODO Is this a good default value? Where is this
        // changed?
        this.hold = false;

        this.sections = 0; // number of plot sections, -1 for layers
        this.iysec = 0;
        this.nsec = 0; // actual number of sections
        this.isec = 0; // current sections

        this.xlab = undefined;
        this.ylab = undefined;

        this.default_rubberbox_action = "zoom";
        this.default_rubberbox_mode = "box";

        this.wheelscroll_mode_natural = true;
        this.scroll_time_interval = 10;

        this.repeatPanning = undefined;
        this.stillPanning = undefined; // TODO maybe merge this variable with
        // Gx.panning in future?

        this.autol = -1;

        this.lineSmoothing = false; // not implemented
        this.rasterSmoothing = false;

        this.wheelZoom = false;
        this.wheelZoomPercent = 0.2;
        this.inContinuousZoom = false;

        this.lyr = [];
        this.HCB = [];
        this.plugins = [];

        this.plotData = document.createElement("canvas");
        this.plotData.valid = false;
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function setup_cmap(plot, cmap) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        // If a color map array was provided make a custom map
        if (Array.isArray(cmap)) {
            var custom_cmap = {
                name: "Custom",
                colors: cmap
            };
            if (m.Mc.colormap[m.Mc.colormap.length - 1].name === "Custom") {
                m.Mc.colormap[m.Mc.colormap.length - 1].colors = cmap;
            } else {
                m.Mc.colormap.push(custom_cmap);
            }
            Gx.cmap = m.Mc.colormap.length - 1;
        } else if (typeof cmap === "string") {
            Gx.cmap = -1;
            for (var xc = 0; xc < m.Mc.colormap.length; xc++) {
                if (m.Mc.colormap[xc].name === cmap) {
                    Gx.cmap = xc;
                    break;
                }
            }
        } else {
            Gx.cmap = cmap;
        }

        if (Gx.ncolors < 0) {
            Gx.ncolors = -1 * Gx.ncolors;
            Gx.cmap = Math.max(1, Gx.cmap);
        }
        if ((Gx.cmap < 0) || (Gx.cmap > m.Mc.colormap.length)) {
            if (Gx.cmode === 2) {
                Gx.cmap = 2; // wheel
            } else {
                Gx.cmap = 1; // ramp
            }
        }

        mx.colormap(Mx, m.Mc.colormap[Gx.cmap].colors, Gx.ncolors);
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function sigplot_show_x(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        var ls = Gx.aretx.toString();
        if (Gx.iabsc === 1) {
            mx.message(Mx, "INDEX = " + ls);
        } else if (Gx.iabsc === 2) {
            mx.message(Mx, "1/X = " + ls);
        } else {
            //if (Gx.xlab === 4) {
            // TODO
            //}
            mx.message(Mx, "X = " + ls);
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function sigplot_show_timecode(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        if (Gx.lyr.length > 0) {
            //var hcb = Gx.HCB[Gx.lyr[0].hcb];
            var hcb = Gx.lyr[0].hcb; // mmm-TODO-needs investigation
            if ((hcb["class"] === 1) && ((hcb.xunits === 1) || (hcb.xunits === 4))) {
                mx.message(Mx, "Time = " + m.sec2tod(hcb.timecode + Gx.retx), true);
            } else if ((hcb["class"] === 2) && ((hcb.yunits === 1) || (hcb.yunits === 4))) {
                mx.message(Mx, "Time = " + m.sec2tod(hcb.timecode + Gx.rety), true);
            } else {
                mx.message(Mx, "Time = UNK");
            }

        }

    }

    /**
     * @memberOf sigplot
     * @private
     */
    function sigplot_show_y(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        var ls = Gx.arety.toString();
        if (Gx.iabsc === 2) {
            mx.message(Mx, "1/Y = " + ls);
        } else {
            //if (Gx.xlab === 4) {
            // TODO
            //}
            mx.message(Mx, "Y = " + ls);
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function sigplot_show_z(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        if (Gx.zmin && Gx.zmax) { // at least one layer has a z dimension
            var msg = "";
            if (Gx.lyr.length === 1) {
                var msg = "Z = " + Gx.lyr[0].get_z(Gx.retx, Gx.rety).toString();
            } else {
                var msg = "TODO"; // TODO we need to think of what we want to display here
            }
            mx.message(Mx, msg);
        }
    }

    /**
     * Constructs a menu for updating the pan scale of the plot.
     *
     * @param plot
     *            The plot to work with.
     * @param command
     *            The scroll direction to use. Either "XPAN" or "YPAN" are
     *            acceptable.
     * @private
     */
    function sigplot_scrollScaleMenu(plot, command) {
        var Mx = plot._Mx;

        mx.removeEventListener(Mx, "mousedown", plot.onmousedown, false);

        mx.menu(Mx, {
            title: "SCROLLBAR",
            refresh: function() {
                plot.refresh();
            },
            finalize: function() {
                mx.addEventListener(Mx, "mousedown",
                    plot.onmousedown, false);
                plot.refresh();
            },
            items: [{
                text: "Expand Range",
                handler: function() {
                    middleClickScrollMenuAction(plot,
                        mx.SB_EXPAND, command);
                }
            }, {
                text: "Shrink Range",
                handler: function() {
                    middleClickScrollMenuAction(plot,
                        mx.SB_SHRINK, command);
                }
            }, {
                text: "Expand Full",
                handler: function() {
                    middleClickScrollMenuAction(plot,
                        mx.SB_FULL, command);
                }
            }]
        });
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function sigplot_mainmenu(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        // show mainmenu
        //

        mx.removeEventListener(Mx, "mousedown", plot.onmousedown, false);

        // Sub-menus
        var CONTROLS_MENU = {
            text: "Cntrls...",
            menu: {
                title: "CONTROLS OPTIONS",
                items: [{
                    text: "Continuous (Disabled)",
                    checked: Gx.cntrls === -2,
                    handler: function() {
                        plot.change_settings({
                            xcnt: -2
                        });
                    }
                }, {
                    text: "LM Click (Disabled)",
                    checked: Gx.cntrls === -1,
                    handler: function() {
                        plot.change_settings({
                            xcnt: -1
                        });
                    }
                }, {
                    text: "Off",
                    checked: Gx.cntrls === 0,
                    handler: function() {
                        plot.change_settings({
                            xcnt: 0
                        });
                    }
                }, {
                    text: "LM Click",
                    checked: Gx.cntrls === 1,
                    handler: function() {
                        plot.change_settings({
                            xcnt: 1
                        });
                    }
                }, {
                    text: "Continuous",
                    checked: Gx.cntrls === 2,
                    handler: function() {
                        plot.change_settings({
                            xcnt: 2
                        });
                    }
                }]
            }
        };

        var CXMODE_MENU = {
            text: "CX Mode...",
            menu: {
                title: "COMPLEX MODE",
                items: [{
                    text: "Magnitude",
                    checked: Gx.cmode === 1,
                    handler: function() {
                        plot.change_settings({
                            cmode: 1
                        });
                    }
                }, {
                    text: "Phase",
                    checked: Gx.cmode === 2,
                    handler: function() {
                        plot.change_settings({
                            cmode: 2
                        });
                    }
                }, {
                    text: "Real",
                    checked: Gx.cmode === 3,
                    handler: function() {
                        plot.change_settings({
                            cmode: 3
                        });
                    }
                }, {
                    text: "Imaginary",
                    checked: Gx.cmode === 4,
                    handler: function() {
                        plot.change_settings({
                            cmode: 4
                        });
                    }
                }, {
                    text: "IR: Imag/Real",
                    checked: Gx.cmode === 5,
                    handler: function() {
                        plot.change_settings({
                            cmode: 5
                        });
                    }
                }, {
                    text: "10*Log10",
                    checked: Gx.cmode === 6,
                    handler: function() {
                        plot.change_settings({
                            cmode: 6
                        });
                    }
                }, {
                    text: "20*Log10",
                    checked: Gx.cmode === 7,
                    handler: function() {
                        plot.change_settings({
                            cmode: 7
                        });
                    }
                }]
            }
        };

        var SCALING_MENU = {
            text: "Scaling...",
            menu: {
                title: "SCALING",
                items: [{
                    text: "Y Axis",
                    style: "separator"
                }, {
                    text: "Parameters...",
                    checked: (Gx.autoy === 0),
                    handler: function() {
                        Gx.autoy = 0;

                        var nextPrompt = function() {
                            setupPrompt(
                                plot,
                                "Y Axis Max:",
                                mx.floatValidator,
                                function(finalValue) {
                                    if (parseFloat(finalValue) !== Mx.stk[Mx.level].ymax) {
                                        // Only update if different
                                        // value
                                        if (finalValue === "") {
                                            finalValue = 0;
                                        }
                                        updateViewbox(
                                            plot,
                                            Mx.stk[Mx.level].ymin,
                                            parseFloat(finalValue),
                                            "Y");
                                    } else {
                                        plot.refresh();
                                    }
                                }, Mx.stk[Mx.level].ymax,
                                undefined, undefined, undefined);
                        };

                        setupPrompt(
                            plot,
                            "Y Axis Min:",
                            mx.floatValidator,
                            function(finalValue) {
                                if (parseFloat(finalValue) !== Mx.stk[Mx.level].ymin) {
                                    // Only update if different
                                    // value
                                    if (finalValue === "") {
                                        finalValue = 0;
                                    }
                                    updateViewbox(plot,
                                        parseFloat(finalValue),
                                        Mx.stk[Mx.level].ymax,
                                        "Y");
                                } else {
                                    plot.refresh();
                                }

                            }, Mx.stk[Mx.level].ymin, undefined,
                            undefined, nextPrompt);
                    }
                }, {
                    text: "Min Auto",
                    checked: (Gx.autoy === 1),
                    handler: function() {
                        Gx.autoy = 1;
                    }
                }, {
                    text: "Max Auto",
                    checked: (Gx.autoy === 2),
                    handler: function() {
                        Gx.autoy = 2;
                    }
                }, {
                    text: "Full Auto",
                    checked: (Gx.autoy === 3),
                    handler: function() {
                        Gx.autoy = 3;
                    }
                }, {
                    text: "X Axis",
                    style: "separator"
                }, {
                    text: "Parameters...",
                    checked: (Gx.autox === 0),
                    handler: function() {
                        Gx.autox = 0;

                        var nextPrompt = function() {
                            setupPrompt(
                                plot,
                                "X Axis Max:",
                                mx.floatValidator,
                                function(finalValue) {
                                    if (parseFloat(finalValue) !== Mx.stk[Mx.level].xmax) {
                                        // Only update if different
                                        // value
                                        if (finalValue === "") {
                                            finalValue = 0;
                                        }
                                        updateViewbox(
                                            plot,
                                            Mx.stk[Mx.level].xmin,
                                            parseFloat(finalValue),
                                            "X");
                                    } else {
                                        plot.refresh();
                                    }
                                }, Mx.stk[Mx.level].xmax,
                                undefined, undefined, undefined);
                        };

                        setupPrompt(
                            plot,
                            "X Axis Min:",
                            mx.floatValidator,
                            function(finalValue) {
                                if (parseFloat(finalValue) !== Mx.stk[Mx.level].xmin) {
                                    // Only update if different
                                    // value
                                    if (finalValue === "") {
                                        finalValue = 0;
                                    }
                                    updateViewbox(plot,
                                        parseFloat(finalValue),
                                        Mx.stk[Mx.level].xmax,
                                        "X");
                                } else {
                                    plot.refresh();
                                }
                            }, Mx.stk[Mx.level].xmin, undefined,
                            undefined, nextPrompt);
                    }
                }, {
                    text: "Min Auto",
                    checked: (Gx.autox === 1),
                    handler: function() {
                        Gx.autox = 1;
                    }
                }, {
                    text: "Max Auto",
                    checked: (Gx.autox === 2),
                    handler: function() {
                        Gx.autox = 2;
                    }
                }, {
                    text: "Full Auto",
                    checked: (Gx.autox === 3),
                    handler: function() {
                        Gx.autox = 3;
                    }
                }, {
                    text: "Z Axis",
                    style: "separator"
                }, {
                    text: "Parameters...",
                    checked: (Gx.autoz === 0),
                    handler: function() {
                        Gx.autoz = 0;

                        var nextPrompt = function() {
                            setupPrompt(
                                plot,
                                "Z Axis Max:",
                                mx.floatValidator,
                                function(finalValue) {
                                    if (parseFloat(finalValue) !== Gx.zmax) {
                                        // Only update if different
                                        // value
                                        if (finalValue === "") {
                                            finalValue = 0;
                                        }
                                        plot.change_settings({
                                            zmax: finalValue
                                        });
                                    }
                                }, Gx.zmax,
                                undefined, undefined, undefined);
                        };

                        setupPrompt(
                            plot,
                            "Z Axis Min:",
                            mx.floatValidator,
                            function(finalValue) {
                                if (parseFloat(finalValue) !== Gx.zmin) {
                                    if (finalValue === "") {
                                        finalValue = 0;
                                    }
                                    plot.change_settings({
                                        zmin: finalValue
                                    });
                                }
                            }, Gx.zmin, undefined,
                            undefined, nextPrompt);
                    }
                }, {
                    text: "Min Auto",
                    checked: (Gx.autoz === 1),
                    handler: function() {
                        plot.change_settings({
                            autoz: 1
                        });
                    }
                }, {
                    text: "Max Auto",
                    checked: (Gx.autoz === 2),
                    handler: function() {
                        plot.change_settings({
                            autoz: 2
                        });
                    }
                }, {
                    text: "Full Auto",
                    checked: (Gx.autoz === 3),
                    handler: function() {
                        plot.change_settings({
                            autoz: 3
                        });
                    }
                }]
            }
        };

        var GRID_MENU = {
            text: "Grid",
            handler: function() {
                plot.change_settings({
                    grid: !Gx.grid
                });
            }
        };

        var SETTINGS_MENU = {
            text: "Settings...",
            menu: {
                title: "SETTINGS",
                items: [{
                    text: "ALL Mode",
                    checked: Gx.all,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            all: !Gx.all
                        });
                    }
                }, {
                    text: "Controls...",
                    menu: {
                        title: "CONTROLS OPTIONS",
                        items: [{
                            text: "Continuous (Disabled)",
                            checked: Gx.cntrls === -2,
                            handler: function() {
                                plot.change_settings({
                                    xcnt: -2
                                });
                            }
                        }, {
                            text: "LM Click (Disabled)",
                            checked: Gx.cntrls === -1,
                            handler: function() {
                                plot.change_settings({
                                    xcnt: -1
                                });
                            }
                        }, {
                            text: "Off",
                            checked: Gx.cntrls === 0,
                            handler: function() {
                                plot.change_settings({
                                    xcnt: 0
                                });
                            }
                        }, {
                            text: "LM Click",
                            checked: Gx.cntrls === 1,
                            handler: function() {
                                plot.change_settings({
                                    xcnt: 1
                                });
                            }
                        }, {
                            text: "Continuous",
                            checked: Gx.cntrls === 2,
                            handler: function() {
                                plot.change_settings({
                                    xcnt: 2
                                });
                            }
                        }]
                    }
                }, {
                    text: "Mouse...",
                    menu: {
                        title: "MOUSE OPTIONS",
                        items: [{
                            text: "LM Drag (Zoom)",
                            checked: Gx.default_rubberbox_action === "zoom",
                            handler: function() {
                                Gx.default_rubberbox_action = "zoom";
                            }
                        }, {
                            text: "LM Drag (Select)",
                            checked: Gx.default_rubberbox_action === "select",
                            handler: function() {
                                Gx.default_rubberbox_action = "select";
                            }
                        }, {
                            text: "LM Drag (Disabled)",
                            checked: Gx.default_rubberbox_action === null,
                            handler: function() {
                                Gx.default_rubberbox_action = null;
                            }
                        }, {
                            text: "RM Drag (Zoom)",
                            checked: Gx.default_rightclick_rubberbox_action === "zoom",
                            handler: function() {
                                Gx.default_rightclick_rubberbox_action = "zoom";
                            }
                        }, {
                            text: "RM Drag (Select)",
                            checked: Gx.default_rightclick_rubberbox_action === "select",
                            handler: function() {
                                Gx.default_rightclick_rubberbox_action = "select";
                            }
                        }, {
                            text: "RM Drag (Disabled)",
                            checked: Gx.default_rightclick_rubberbox_action === null,
                            handler: function() {
                                Gx.default_rightclick_rubberbox_action = null;
                            }
                        }, {
                            text: "Mode...",
                            menu: {
                                title: "MOUSE Mode",
                                items: [{
                                    text: "Box",
                                    checked: Gx.default_rubberbox_mode === "box",
                                    handler: function() {
                                        Gx.default_rubberbox_mode = "box";
                                    }

                                }, {
                                    text: "Horizontal",
                                    checked: Gx.default_rubberbox_mode === "horizontal",
                                    handler: function() {
                                        Gx.default_rubberbox_mode = "horizontal";
                                    }
                                }, {
                                    text: "Vertical",
                                    checked: Gx.default_rubberbox_mode === "vertical",
                                    handler: function() {
                                        Gx.default_rubberbox_mode = "vertical";
                                    }
                                }]
                            }
                        }, {
                            text: "CROSShairs...",
                            menu: {
                                title: "Crosshairs Mode",
                                items: [{
                                    text: "Off",
                                    checked: !Gx.cross,
                                    handler: function() {
                                        Gx.cross = false;
                                    }

                                }, {
                                    text: "On",
                                    checked: Gx.cross === true,
                                    handler: function() {
                                        Gx.cross = true;
                                    }
                                }, {
                                    text: "Horizontal",
                                    checked: Gx.cross === "horizontal",
                                    handler: function() {
                                        Gx.cross = "horizontal";
                                    }
                                }, {
                                    text: "Vertical",
                                    checked: Gx.cross === "vertical",
                                    handler: function() {
                                        Gx.cross = "vertical";
                                    }
                                }]
                            }
                        }, {
                            text: "Mousewheel Natural Mode",
                            checked: Gx.wheelscroll_mode_natural,
                            style: "checkbox",
                            handler: function() {
                                plot
                                    .change_settings({
                                        wheelscroll_mode_natural: !Gx.wheelscroll_mode_natural
                                    });
                            }
                        }]
                    }
                }, {
                    text: "CROSShairs",
                    checked: Gx.cross,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            cross: !Gx.cross
                        });
                    }
                }, {
                    text: "GRID",
                    checked: Gx.grid,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            grid: !Gx.grid
                        });
                    }
                }, {
                    text: "INDEX Mode",
                    checked: Gx.index,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            index: !Gx.index
                        });
                    }
                }, {
                    text: "LEGEND",
                    checked: Gx.legend,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            legend: !Gx.legend
                        });
                    }
                }, {
                    text: "PAN Scrollbars",
                    checked: Gx.pan,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            pan: !Gx.pan
                        });
                    }
                }, {
                    text: "PHase UNITS...",
                    menu: {
                        title: "PHASE UNITS",
                        items: [{
                            text: "Radians",
                            checked: Gx.plab === 23,
                            handler: function() {
                                plot.change_settings({
                                    phunits: 'R'
                                });
                            }

                        }, {
                            text: "Degrees",
                            checked: Gx.plab === 24,
                            handler: function() {
                                plot.change_settings({
                                    phunits: 'D'
                                });
                            }
                        }, {
                            text: "Cycles",
                            checked: Gx.plab === 25,
                            handler: function() {
                                plot.change_settings({
                                    phunits: 'C'
                                });
                            }
                        }]
                    }
                }, {
                    text: "SPECS",
                    checked: Gx.specs,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            specs: !Gx.specs
                        });
                    }
                }, {
                    text: "XDIVisions...",
                    handler: function() {
                        var validator = function(value) {
                            var isValid = mx.intValidator(value);
                            var maxXDIV = m.trunc(Mx.width / 2); // TODO
                            // Make value an option on the plot?
                            // Maybe still a little too high
                            // while dotted-line grids are
                            // being drawn?
                            if (isValid.valid && value > maxXDIV) {
                                return {
                                    valid: false,
                                    reason: "Exceeds maximum number of divisions (" + maxXDIV + ")."
                                };
                            } else {
                                return isValid;
                            }
                        };

                        setupPrompt(
                            plot,
                            "X Divisions:",
                            validator,
                            function(finalValue) {
                                if (parseFloat(finalValue) !== Gx.xdiv) { // Only
                                    // update if different value
                                    if (finalValue === "") {
                                        finalValue = 1;
                                    }
                                    Gx.xdiv = parseFloat(finalValue);
                                }
                                plot.refresh();

                            }, Gx.xdiv, undefined, undefined,
                            undefined);
                    }
                }, {
                    text: "XLABel...",
                    handler: function() {
                        var validator = function(value) {
                            console.log("The value is " + value);
                            var isValid = mx.intValidator(value);
                            return isValid;
                        };

                        setupPrompt(
                            plot,
                            "X Units:",
                            validator,
                            function(finalValue) {
                                if (parseFloat(finalValue) !== Gx.xlab) { // Only
                                    // update if different value
                                    if (finalValue < 0) {
                                        finalValue = 0;
                                    }
                                    Gx.xlab = parseFloat(finalValue);
                                }
                                plot.refresh();

                            }, Gx.xlab, undefined, undefined,
                            undefined);
                    }
                }, {
                    text: "YDIVisions...",
                    handler: function() {
                        var validator = function(value) {
                            var isValid = mx.intValidator(value);
                            var maxYDIV = m.trunc(Mx.height / 2); // TODO
                            // Make value an option on the plot?
                            // Maybe still a little too high
                            // while dotted-line grids are
                            // being drawn?
                            if (isValid.valid && value > maxYDIV) {
                                return {
                                    valid: false,
                                    reason: "Exceeds maximum number of divisions (" + maxYDIV + ")."
                                };
                            } else {
                                return isValid;
                            }
                        };

                        setupPrompt(
                            plot,
                            "Y Divisions:",
                            validator,
                            function(finalValue) {
                                if (parseFloat(finalValue) !== Gx.ydiv) {
                                    // Only update if different
                                    // value
                                    if (finalValue === "") {
                                        finalValue = 1;
                                    }
                                    Gx.ydiv = parseFloat(finalValue);
                                }
                                plot.refresh();

                            }, Gx.ydiv, undefined, undefined,
                            undefined);
                    }
                }, {
                    text: "YINVersion",
                    checked: (Mx.origin === 4),
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            yinv: (Mx.origin !== 4)
                        });
                    }
                }, {
                    text: "YLABel...",
                    handler: function() {
                        var validator = function(value) {
                            var isValid = mx.intValidator(value);
                            return isValid;
                        };

                        setupPrompt(
                            plot,
                            "Y Units:",
                            validator,
                            function(finalValue) {
                                if (parseFloat(finalValue) !== Gx.ylab) { // Only
                                    // update if different value
                                    if (finalValue < 0) {
                                        finalValue = 0;
                                    }
                                    Gx.ylab = parseFloat(finalValue);
                                }
                                plot.refresh();

                            }, Gx.ylab, undefined, undefined,
                            undefined);
                    }
                }, {
                    text: "X-axis",
                    checked: Gx.show_x_axis,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            show_x_axis: !Gx.show_x_axis
                        });
                    }
                }, {
                    text: "Y-axis",
                    checked: Gx.show_y_axis,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            show_y_axis: !Gx.show_y_axis
                        });
                    }
                }, {
                    text: "Readout",
                    checked: Gx.show_readout,
                    style: "checkbox",
                    handler: function() {
                        plot.change_settings({
                            show_readout: !Gx.show_readout
                        });
                    }
                }, {
                    text: "Invert Colors",
                    checked: Mx.xi,
                    style: "checkbox",
                    handler: function() {
                        mx.invertbgfg(Mx);
                    }
                }]
            }
        };

        var COLORMAP_MENU = {
            text: "Colormap...",
            menu: {
                title: "COLORMAP",
                items: []
            }
        };

        var colormap_handler = function(item) {
            plot.change_settings({
                cmap: this.cmap
            });
        };

        for (var xc = 0; xc < m.Mc.colormap.length; xc++) {
            var menuitem = {
                text: m.Mc.colormap[xc].name,
                cmap: xc,
                checked: (Gx.cmap === xc),
                handler: colormap_handler
            };
            COLORMAP_MENU.menu.items.push(menuitem);
        }

        var traceoptionsmenu = function(index) {
            return {
                title: "TRACE OPTIONS",
                items: [{
                    text: "Dashed...",
                    handler: function() {
                        // Figure out the current thickness
                        var thk = 1;
                        if (index !== undefined) {
                            thk = Math.abs(plot._Gx.lyr[index].thick);
                        } else {
                            if (Gx.lyr.length === 0) {
                                return;
                            }

                            thk = Math.abs(plot._Gx.lyr[0].thick);
                            for (var i = 0; i < Gx.lyr.length; i++) {
                                if (thk !== Math.abs(plot._Gx.lyr[i].thick)) {
                                    thk = 1;
                                    break;
                                }
                            }
                        }
                        setupPrompt(
                            plot,
                            "Line thickness:",
                            mx.intValidator,
                            function(finalValue) {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].line = 3;
                                    plot._Gx.lyr[index].thick = -1 * finalValue;
                                    plot._Gx.lyr[index].symbol = 0;
                                } else {
                                    for (var index = 0; index < Gx.lyr.length; index++) {
                                        plot._Gx.lyr[index].line = 3;
                                        plot._Gx.lyr[index].thick = -1 * finalValue;
                                        plot._Gx.lyr[index].symbol = 0;
                                    }
                                }
                            }, thk);
                    }
                }, {
                    text: "Dots...",
                    handler: function() {
                        // Figure out the current thickness
                        var radius = 3;
                        if (index !== undefined) {
                            radius = Math.abs(plot._Gx.lyr[index].radius);
                        } else {
                            if (Gx.lyr.length === 0) {
                                return;
                            }
                            for (var i = 0; i < Gx.lyr.length; i++) {
                                if (radius !== Math.abs(plot._Gx.lyr[i].radius)) {
                                    radius = 3;
                                    break;
                                }
                            }
                        }
                        setupPrompt(
                            plot,
                            "Radius/Shape:",
                            mx.intValidator,
                            function(finalValue) {
                                var sym;
                                var rad;
                                if (finalValue < 0) {
                                    sym = 3; // square
                                    rad = Math.abs(finalValue);
                                } else if (finalValue > 0) {
                                    sym = 2; // circle
                                    rad = finalValue;
                                } else {
                                    sym = 1;
                                    rad = 0;
                                }
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].line = 0;
                                    plot._Gx.lyr[index].radius = rad;
                                    plot._Gx.lyr[index].symbol = sym;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].line = 0;
                                        plot._Gx.lyr[i].radius = rad;
                                        plot._Gx.lyr[i].symbol = sym;
                                    }
                                }
                            }, radius);
                    }
                }, {
                    text: "Solid...",
                    handler: function() {
                        // Figure out the current thickness
                        var thk = 1;
                        if (index !== undefined) {
                            thk = Math.abs(plot._Gx.lyr[index].thick);
                        } else {
                            if (Gx.lyr.length === 0) {
                                return;
                            }

                            thk = Math.abs(plot._Gx.lyr[0].thick);
                            for (var i = 0; i < Gx.lyr.length; i++) {
                                if (thk !== Math.abs(plot._Gx.lyr[i].thick)) {
                                    thk = 1;
                                    break;
                                }
                            }
                        }
                        setupPrompt(
                            plot,
                            "Line thickness:",
                            mx.intValidator,
                            function(finalValue) {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].line = 3;
                                    plot._Gx.lyr[index].thick = finalValue;
                                    plot._Gx.lyr[index].symbol = 0;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].line = 3;
                                        plot._Gx.lyr[i].thick = finalValue;
                                        plot._Gx.lyr[i].symbol = 0;
                                    }
                                }
                            }, thk);
                    }
                }, {
                    text: "Toggle",
                    style: (index !== undefined) ? "checkbox" : undefined,
                    checked: (index !== undefined) ? plot._Gx.lyr[index].display : undefined,
                    handler: function() {
                        if (index !== undefined) {
                            plot._Gx.lyr[index].display = !plot._Gx.lyr[index].display;
                        } else {
                            for (var i = 0; i < Gx.lyr.length; i++) {
                                plot._Gx.lyr[i].display = !plot._Gx.lyr[i].display;
                            }
                        }
                    }
                }, {
                    text: "Symbols...",
                    menu: {
                        title: "SYMBOLS",
                        items: [{
                            text: "Retain Current"
                        }, {
                            text: "None",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].symbol === 0 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].radius = 0;
                                    plot._Gx.lyr[index].symbol = 0;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].radius = 0;
                                        plot._Gx.lyr[i].symbol = 0;
                                    }
                                }
                            }
                        }, {
                            text: "Pixels",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].symbol === 1 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].radius = 1;
                                    plot._Gx.lyr[index].symbol = 1;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].radius = 1;
                                        plot._Gx.lyr[i].symbol = 1;
                                    }
                                }
                            }
                        }, {
                            text: "Circles",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].symbol === 2 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].radius = 4;
                                    plot._Gx.lyr[index].symbol = 2;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].radius = 4;
                                        plot._Gx.lyr[i].symbol = 2;
                                    }
                                }
                            }
                        }, {
                            text: "Squares",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].symbol === 3 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].radius = 4;
                                    plot._Gx.lyr[index].symbol = 3;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].radius = 4;
                                        plot._Gx.lyr[i].symbol = 3;
                                    }
                                }
                            }
                        }, {
                            text: "Plusses",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].symbol === 4 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].radius = 4;
                                    plot._Gx.lyr[index].symbol = 4;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].radius = 4;
                                        plot._Gx.lyr[i].symbol = 4;
                                    }
                                }
                            }
                        }, {
                            text: "X's",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].symbol === 5 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].radius = 4;
                                    plot._Gx.lyr[index].symbol = 5;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].radius = 4;
                                        plot._Gx.lyr[i].symbol = 5;
                                    }
                                }
                            }
                        }, {
                            text: "Triangles",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].symbol === 6 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].radius = 6;
                                    plot._Gx.lyr[index].symbol = 6;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].radius = 6;
                                        plot._Gx.lyr[i].symbol = 6;
                                    }
                                }
                            }
                        }, {
                            text: "Downward Triangles",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].symbol === 7 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].radius = 6;
                                    plot._Gx.lyr[index].symbol = 7;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].radius = 6;
                                        plot._Gx.lyr[i].symbol = 7;
                                    }
                                }
                            }
                        }]
                    }
                }, {
                    text: "Line Type...",
                    menu: {
                        title: "LINE TYPE",
                        items: [{
                            text: "Retain Current"
                        }, {
                            text: "None",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].line === 0 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].line = 0;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].line = 0;
                                    }
                                }
                            }
                        }, {
                            text: "Verticals",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].line === 1 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].line = 1;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].line = 1;
                                    }
                                }
                            }
                        }, {
                            text: "Horizontals",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].line === 2 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].line = 2;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].line = 2;
                                    }
                                }
                            }
                        }, {
                            text: "Connecting",
                            checked: (index !== undefined) ? plot._Gx.lyr[index].line === 3 : undefined,
                            handler: function() {
                                if (index !== undefined) {
                                    plot._Gx.lyr[index].line = 3;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].line = 3;
                                    }
                                }
                            }
                        }]
                    }
                }, {
                    text: "Thickness...",
                    handler: function() {
                        var thickness = 1;
                        if (index !== undefined) {
                            thickness = plot._Gx.lyr[index].thick;
                        }
                        setupPrompt(
                            plot,
                            "Thickness",
                            mx.intValidator,
                            function(finalValue) {
                                if (finalValue === "") {
                                    finalValue = 1;
                                }
                                finalValue = Math.max(0, finalValue);

                                if (index !== undefined) {
                                    plot._Gx.lyr[index].thick = finalValue;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].thick = finalValue;
                                    }
                                }
                            }, thickness, undefined,
                            undefined, undefined);
                    }
                }, {
                    text: "Opacity...",
                    handler: function() {
                        var opacity = 1.0;
                        if (index !== undefined) {
                            opacity = plot._Gx.lyr[index].opacity;
                        }
                        setupPrompt(
                            plot,
                            "Opacity:",
                            mx.floatValidator,
                            function(finalValue) {
                                if (finalValue === "") {
                                    finalValue = 1.0;
                                }
                                finalValue = Math.max(0, finalValue);
                                finalValue = Math.min(1, finalValue);

                                if (index !== undefined) {
                                    plot._Gx.lyr[index].opacity = finalValue;
                                } else {
                                    for (var i = 0; i < Gx.lyr.length; i++) {
                                        plot._Gx.lyr[i].opacity = finalValue;
                                    }
                                }
                            }, opacity, undefined,
                            undefined, undefined);
                    }
                }]
            };
        };

        var VIEW_MENU = {
            text: "View...",
            menu: {
                title: "VIEW",
                items: [{
                    text: "Reset",
                    handler: function() {
                        plot.unzoom();
                    }
                }, {
                    text: "Y Axis",
                    style: "separator"
                }, {
                    text: "Expand Range",
                    handler: function() {
                        middleClickScrollMenuAction(plot,
                            mx.SB_EXPAND, "YPAN");
                    }
                }, {
                    text: "Shrink Range",
                    handler: function() {
                        middleClickScrollMenuAction(plot,
                            mx.SB_SHRINK, "YPAN");
                    }
                }, {
                    text: "Expand Full",
                    handler: function() {
                        middleClickScrollMenuAction(plot,
                            mx.SB_FULL, "YPAN");
                    }
                }, {
                    text: "X Axis",
                    style: "separator"
                }, {
                    text: "Expand Range",
                    handler: function() {
                        middleClickScrollMenuAction(plot,
                            mx.SB_EXPAND, "XPAN");
                    }
                }, {
                    text: "Shrink Range",
                    handler: function() {
                        middleClickScrollMenuAction(plot,
                            mx.SB_SHRINK, "XPAN");
                    }
                }, {
                    text: "Expand Full",
                    handler: function() {
                        middleClickScrollMenuAction(plot,
                            mx.SB_FULL, "XPAN");
                    }
                }]
            }
        };

        var TRACES_MENU = {
            text: "Traces...",
            menu: function() {
                var Gx = plot._Gx;
                var tracemenu = {
                    title: "TRACE",
                    items: []
                };
                // Add the ALL option
                tracemenu.items.push({
                    text: "All",
                    menu: traceoptionsmenu()
                });
                // Add all the active layers
                for (var i = 0; i < Gx.lyr.length; i++) {
                    tracemenu.items.push({
                        text: Gx.lyr[i].name,
                        menu: traceoptionsmenu(i)
                    });
                }
                return tracemenu;
            }
        };

        var FILES_MENU = {
            text: "Files...",
            menu: {
                title: "FILES OPTIONS",
                items: [
                    // Overlay File... is disabled
                    // because it's actually very
                    // difficult to bring up a
                    // a file upload browse dialog
                    /*
                     * { text: "Overlay File...", handler: function() {
                     * plot.change_settings( {phunits: 'R'} ); } },
                     */
                    {
                        text: "Deoverlay File...",
                        menu: function() {
                            var Gx = plot._Gx;
                            var deoverlaymenu = {
                                title: "DEOVERLAY",
                                items: []
                            };
                            deoverlaymenu.items.push({
                                text: "Deoverlay All",
                                handler: function() {
                                    plot.deoverlay();
                                }
                            });
                            /* jshint -W083 */
                            /* TODO figure out how to not create functions within a loop */
                            for (var i = 0; i < Gx.lyr.length; i++) {
                                var handler = (function(index) {
                                    return function() {
                                        plot.deoverlay(index);
                                    };
                                }(i));

                                deoverlaymenu.items.push({
                                    text: Gx.lyr[i].name,
                                    handler: handler
                                });
                            }
                            /* jshint +W083 */
                            return deoverlaymenu;
                        }
                    }
                ]
            }
        };

        var PLUGINS_MENU = {
            text: "Plugins...",
            menu: {
                title: "PLUGINS",
                items: (function() { // Immediately
                    // Invoked
                    // Function
                    var result = [];
                    for (var i = 0; i < Gx.plugins.length; i++) {
                        var plugin = Gx.plugins[i];
                        if (plugin.impl.menu) {
                            if (typeof plugin.impl.menu === 'function') {
                                result.push(plugin.impl.menu());
                            } else {
                                result.push(plugin.impl.menu);
                            }
                        }
                    }
                    return result;
                }())
            }
        };

        var SAVE_MENU = {
            text: "Save as...",
            menu: {
                title: "SAVE AS",
                items: [{
                    text: "PNG",
                    handler: function() {
                        var img = plot._Mx.active_canvas.toDataURL("image/png");
                        var link = document.createElement("a");
                        link.href = img;
                        link.download = "SigPlot." + (new Date()).getTime() + ".png";
                        link.click();
                    }
                }, {
                    text: "JPG",
                    handler: function() {
                        var img = plot._Mx.active_canvas.toDataURL("image/jpg");
                        var link = document.createElement("a");
                        link.href = img;
                        link.download = "SigPlot." + (new Date()).getTime() + ".jpg";
                        link.click();
                    }
                }, {
                    text: "SVG",
                    handler: function() {
                        var img = plot._Mx.active_canvas.toDataURL("image/svg");
                        var link = document.createElement("a");
                        link.href = img;
                        link.download = "SigPlot." + (new Date()).getTime() + ".svg";
                        link.click();
                    }
                }]
            }
        };

        var REFRESH_ITEM = {
            text: "Refresh" // no handler, just let the finalizer deal with
                // it
        };

        var KEYPRESSINFO_ITEM = {
            text: "Keypress Info",
            handler: function() {
                mx.message(Mx, KEYPRESS_HELP);
            }
        };

        var EXIT_ITEM = {
            text: "Exit",
            handler: function() {
                var evt = document.createEvent('Event');
                evt.initEvent('sigplotexit', true, true);
                mx.dispatchEvent(Mx, evt);
            }
        };

        // Main Menu
        var MAINMENU = {
            title: "SIG-PLOT",
            finalize: function() {
                if (!Mx.prompt) {
                    // A prompt may have been
                    // created by a menu handler
                    // - let it deal with
                    // eventListener re-setting
                    mx.addEventListener(Mx, "mousedown", plot.onmousedown,
                        false);
                }
                plot.refresh();
            },
            items: [REFRESH_ITEM, CONTROLS_MENU, CXMODE_MENU, SCALING_MENU, VIEW_MENU,
                GRID_MENU, SETTINGS_MENU, COLORMAP_MENU, TRACES_MENU, FILES_MENU,
                PLUGINS_MENU, KEYPRESSINFO_ITEM, SAVE_MENU, EXIT_ITEM
            ]
        };

        mx.menu(Mx, MAINMENU);
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function rubberbox_cb(plot, triggerEvent) {
        return function(event, xo, yo, xl, yl, action, mode) {
            var Gx = plot._Gx;
            var Mx = plot._Mx;

            var x = Math.min(xo, xl);
            var y = Math.min(yo, yl);
            var w = Math.abs(xl - xo);
            var h = Math.abs(yl - yo);

            var takeAction = false;
            if (event.which === triggerEvent) {
                // On some browsers, a click will actually be sent as
                // mousedown/mousemove/mouseup so
                // don't make insanely small zooms...instead treat them as a
                // click
                if (mode === "horizontal") {
                    takeAction = (w > 2);
                } else if (mode === "vertical") {
                    takeAction = (h > 2);
                } else {
                    takeAction = ((w > 2) && (h > 2));
                }
            }

            if (!takeAction) {
                // The mouse didn't shift enough to be considered
                // as a rubberbox action so treat it as mouseup
                plot.mouseup(event);
            } else {
                // action === null is disabled, but undefined is default
                if ((action === undefined) || (action === "zoom")) {
                    plot.pixel_zoom(xo, yo, xl, yl);
                    plot.refresh();
                } else if (action === "select") {
                    var evt = document.createEvent('Event');
                    evt.initEvent('mtag', true, true);
                    var re = pixel_to_real(plot, x, y);
                    var rwh = pixel_to_real(plot, x + w, y + h);
                    evt.x = re.x;
                    evt.y = re.y;
                    evt.xpos = x;
                    evt.ypos = y;
                    evt.w = Math.abs(rwh.x - re.x);
                    evt.h = Math.abs(rwh.y - re.y);
                    evt.wpxl = w;
                    evt.hpxl = h;
                    evt.shift = event.shiftKey;
                    mx.dispatchEvent(Mx, evt);
                }
            }
        };
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function plot_init(plot, o) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;

        // Equivalent to reading cmd line args
        Gx.xmin = o.xmin === undefined ? 0.0 : o.xmin;
        Gx.xmax = o.xmax === undefined ? 0.0 : o.xmax;
        var havexmin = (o.xmin !== undefined);
        var havexmax = (o.xmax !== undefined);
        var address = o.cmode === undefined ? "" : o.cmode.toUpperCase();
        var line = o.line === undefined ? 3 : o.line;
        Gx.ylab = o.ylab;
        Gx.ymin = o.ymin === undefined ? 0.0 : o.ymin;
        Gx.ymax = o.ymax === undefined ? 0.0 : o.ymax;
        var haveymin = (o.ymin !== undefined);
        var haveymax = (o.ymax !== undefined);
        Gx.zmin = o.zmin;
        Gx.zmax = o.zmax;
        var havezmin = (o.zmin !== undefined);
        var havezmax = (o.zmax !== undefined);

        if (o.colors !== undefined) {
            mx.setbgfg(Mx, o.colors.bg, o.colors.fg, Mx.xi);
        }

        if (o.xi !== undefined) {
            mx.invertbgfg(Mx);
        }

        Gx.forcelab = o.forcelab === undefined ? true : o.forcelab;

        Gx.all = o.all === undefined ? false : o.all;
        // By default, SIGPLOT auto-scales only on the first buffer size.
        // "expand" is a feature added for websigplot that when
        // combined with "all" will expand the y-range automaticall
        // to accomodate all of the samples
        Gx.expand = o.expand === undefined ? false : o.expand;

        // TODO Gx.mimic = M$GET_SWITCH ('MIMIC')
        Gx.xlab = o.xlab;
        Gx.segment = o.segment === undefined ? false : o.segment;
        Gx.plab = 24;

        var phunits = (o.phunits === undefined) ? 'D' : o.phunits;
        if (phunits[0] === 'R') {
            Gx.plab = 23;
        } else if (phunits[0] === 'C') {
            Gx.plab = 25;
        }
        Gx.xdiv = o.xdiv === undefined ? 5 : o.xdiv;
        Gx.ydiv = o.ydiv === undefined ? 5 : o.ydiv;

        Mx.origin = 1;
        if (o.yinv) {
            Mx.origin = 4;
        }
        Gx.pmt = o.pmt === undefined ? 1.0 : o.pmt;
        Gx.bufmax = o.bufmax === undefined ? 32768 : o.bufmax;
        Gx.sections = o.nsec === undefined ? 0 : o.nsec;
        Gx.anno_type = o.anno_type === undefined ? 0 : o.anno_type;

        Gx.xfmt = o.xfmt === undefined ? "" : o.xfmt;
        Gx.yfmt = o.yfmt === undefined ? "" : o.yfmt;

        // TODO Gx.xf.msgid = M$GET_SWITCH ('MSGID')
        // Gx.xf.msgmask = max (0, M$GET_SWITCH ('MASK'))

        Gx.index = o.index === undefined ? false : o.index;
        var imode = (Gx.index || (address.slice(0, 2) === "IN"));
        if (imode) {
            if (havexmin && (Gx.xmin === 1.0)) {
                havexmin = false;
            }
            if (havexmax && (Gx.xmin === 1.0)) {
                havexmax = false;
            }
        }

        Gx.xdata = false;
        Gx.note = "";
        Gx.hold = 0;
        Gx.always_show_marker = o.always_show_marker || false;

        m.vstype('D');

        if (!o.inputs) {
            basefile(plot, false);
        } else {
            // TODO load files
        }

        var cmode = address.slice(0, 2);
        if (cmode === "IN" || cmode === "AB" || cmode === "__") {
            cmode = address.slice(2, 4);
        }

        // TODO
        if ((Gx.lyr.length > 0) && (Gx.lyr[0].cx)) {
            Gx.cmode = 1;
        } else {
            Gx.cmode = 3;
        }

        if (cmode === "MA") {
            Gx.cmode = 1;
        }
        if (cmode === "PH") {
            Gx.cmode = 2;
        }
        if (cmode === "RE") {
            Gx.cmode = 3;
        }
        if (cmode === "IM") {
            Gx.cmode = 4;
        }
        if ((cmode === "LO") || (cmode === "D1")) {
            Gx.cmode = 6;
        }
        if ((cmode === "L2") || (cmode === "D2")) {
            Gx.cmode = 7;
        }
        if ((cmode === "RI") || (cmode === "IR")) {
            if (Gx.index) {
                alert("Imag/Real mode not permitted in INDEX mode");
            } else {
                Gx.cmode = 5;
            }
        }
        Gx.basemode = Gx.cmode;
        plot.change_settings({
            cmode: Gx.cmode
        });

        // if ( (Gx.forcelab) .and. (Gx.xlab .le. 0) .and.
        // & (Gx.ylab .le. 0) ) then
        // call M$WARNING
        // & ('/xlab or /ylab is missing with /forcelab usage')
        // Gx.forcelab = .false.
        // endif

        Gx.dbmin = 1.0e-20;
        if (Gx.cmode >= 6) {
            var dbscale = 10.0;
            if (Gx.cmode === 7) {
                dbscale = 20.0;
            }
            if (cmode[0] === "L") {
                if ((Gx.lyr.length > 0) && (Gx.lyr[0].cx)) {
                    Gx.ymin = Math.max(Gx.ymin, 1e-10);
                    Gx.ymax = Math.max(Gx.ymax, 1e-10);
                } else {
                    Gx.ymin = Math.max(Gx.ymin, 1e-20);
                    Gx.ymax = Math.max(Gx.ymax, 1e-20);
                }
            } else if ((Gx.lyr.length > 0) && (Gx.lyr[0].cx)) {
                Gx.ymin = Math.max(-18.0 * dbscale, Gx.ymin);
                Gx.ymax = Math.max(-18.0 * dbscale, Gx.ymax);
                Gx.dbmin = 1e-37;
            } else if (Math.min(Gx.ymin, Gx.ymax) < -20.0 * dbscale) {
                Gx.ymin = Math.max(-37.0 * dbscale, Gx.ymin);
                Gx.ymax = Math.max(-37.0 * dbscale, Gx.ymax);
                Gx.dbmin = Math.pow(10, Math.min(Gx.ymin, Gx.ymax) / dbscale);
            }
        }

        Mx.level = 0;
        if (imode && !Gx.index) {
            if (havexmin) {
                Gx.xmin = Gx.xstart + Gx.xdelta * (Gx.xmin - 1.0);
            }
            if (havexmin) {
                Gx.xmax = Gx.xstart + Gx.xdelta * (Gx.xmax - 1.0);
            }
        }
        Gx.xmult = o.xmult;
        Gx.ymult = o.xmult;
        Gx.autox = o.autox === undefined ? -1 : o.autox;
        if (Gx.autox < 0) {
            Gx.autox = 0;
            if (!havexmin) {
                Gx.autox += 1;
            }
            if (!havexmax) {
                Gx.autox += 2;
            }
        }
        Gx.autoy = o.autoy === undefined ? -1 : o.autoy;
        if (Gx.autoy < 0) {
            Gx.autoy = 0;
            if (!haveymin) {
                Gx.autoy += 1;
            }
            if (!haveymax) {
                Gx.autoy += 2;
            }
        }
        Gx.autoz = o.autoz === undefined ? -1 : o.autoz;
        if (Gx.autoz < 0) {
            Gx.autoz = 0;
            if (!havezmin) {
                Gx.autoz += 1;
            }
            if (!havezmax) {
                Gx.autoz += 2;
            }
        }
        Gx.autol = o.autol === undefined ? -1 : o.autol;

        if (!havexmin) {
            Gx.xmin = undefined;
        }
        if (!havexmax) {
            Gx.xmax = undefined;
        }
        scale_base(plot, {
            get_data: true
        }, Gx.xmin, Gx.xmax, Gx.xlab, Gx.ylab);

        if (!havexmin) {
            Gx.xmin = Mx.stk[0].xmin;
        }
        if (!havexmax) {
            Gx.xmax = Mx.stk[0].xmax;
        }
        if (!haveymin) {
            Gx.ymin = Mx.stk[0].ymin;
        }
        if (!haveymax) {
            Gx.ymax = Mx.stk[0].ymax;
        }

        if (Gx.xmin > Gx.xmax) {
            Mx.stk[0].xmin = Gx.xmax;
            Gx.xmax = Gx.xmin;
            Gx.xmin = Mx.stk[0].xmin;
        }
        if (Gx.ymin > Gx.ymax) {
            Mx.stk[0].ymin = Gx.ymax;
            Gx.ymax = Gx.ymin;
            Gx.ymin = Mx.stk[0].ymin;
        }
        Mx.stk[0].xmin = Gx.xmin;
        Mx.stk[0].xmax = Gx.xmax;
        Mx.stk[0].ymin = Gx.ymin;
        Mx.stk[0].ymax = Gx.ymax;
        Gx.panxmin = Math.min(Gx.panxmin, Gx.xmin);
        Gx.panxmax = Math.max(Gx.panxmax, Gx.xmax);
        Gx.panymin = Math.min(Gx.panymin, Gx.ymin);
        Gx.panymax = Math.max(Gx.panymax, Gx.ymax);

        Gx.xmin = Mx.stk[0].xmin;
        Gx.ymin = Mx.stk[0].ymin;

        mx.set_font(Mx, Math.min(7, Mx.width / 64));

        Gx.ncolors = o.ncolors === undefined ? 16 : o.ncolors;
        Gx.cmap = null;
        if (o.cmap) {
            Gx.cmap = o.cmap;
        } else {
            Gx.cmap = o.xc === undefined ? -1 : o.xc;
        }

        setup_cmap(plot, Gx.cmap);

        // TODO setup annotate, boxes and points facilities

        // TODO initialize layer structure line types

        if (o.xcnt === "leftmouse") {
            Gx.cntrls = 1;
        } else if (o.xcnt === "continuous") {
            Gx.cntrls = 2;
        } else {
            Gx.cntrls = o.xcnt === undefined ? 1 : o.xcnt;
        }

        Gx.default_rubberbox_mode = o.rubberbox_mode === undefined ? "box" : o.rubberbox_mode;
        Gx.default_rubberbox_action = o.rubberbox_action === undefined ? "zoom" : o.rubberbox_action;
        Gx.default_rightclick_rubberbox_mode = o.rightclick_rubberbox_mode === undefined ? "box" : o.rightclick_rubberbox_mode;
        Gx.default_rightclick_rubberbox_action = o.rightclick_rubberbox_action === undefined ? null : o.rightclick_rubberbox_action;

        Gx.cross = o.cross === undefined ? false : o.cross;
        Gx.grid = o.nogrid === undefined ? true : !o.nogrid;
        Gx.fillStyle = o.fillStyle;
        Gx.gridBackground = o.gridBackground;
        Gx.gridStyle = o.gridStyle;
        Gx.wheelZoom = o.wheelZoom;
        Gx.wheelZoomPercent = o.wheelZoomPercent;
        Gx.legend = o.legend === undefined ? false : o.legend;
        Gx.legendBtnLocation = null;
        Gx.pan = o.nopan === undefined ? true : !o.nopan;
        Gx.nomenu = o.nomenu === undefined ? false : o.nomenu;

        // TODO Gx.lmap.ip = 0
        Gx.modmode = 0;
        Gx.modlayer = -1; // 0-based indexing instead of 1
        Gx.modsource = 0;
        Gx.modified = (o.mod && Gx.lyr.length > 0);
        // TODO Gx.marks(5) = 5
        Gx.nmark = 0;
        Gx.iabsc = 0;
        if (Gx.index) {
            Gx.iabsc = 1;
        }
        // TODO if (o.specs > 0) Gx.iabsc = M$SEARCH('IRS',c(1:1))
        Gx.specs = !o.nospecs;

        Gx.scroll_time_interval = o.scroll_time_interval === undefined ? Gx.scroll_time_interval : o.scroll_time_interval;

        Gx.autohide_readout = o.autohide_readout;
        Gx.autohide_panbars = o.autohide_panbars;
        if (Gx.specs) {
            Gx.show_x_axis = !o.noxaxis;
            Gx.show_y_axis = !o.noyaxis;
            Gx.show_readout = !o.noreadout;
            if (Gx.show_x_axis || Gx.show_y_axis || Gx.show_readout) {
                Gx.specs = true;
            } else {
                Gx.specs = false;
            }
        } else {
            Gx.show_x_axis = false;
            Gx.show_y_axis = false;
            Gx.show_readout = false;
        }
        Gx.hide_note = o.hide_note || false;

        Gx.xmrk = 0.0;
        Gx.ymrk = 0.0;

        if (!o.nodragdrop) {
            mx.addEventListener(Mx, "dragover", function(evt) {
                evt.preventDefault();
            }, false);

            mx.addEventListener(Mx, "drop", (function(plot) {
                return function(evt) {
                    var files = evt.dataTransfer.files;
                    if (files.length > 0) {
                        evt.preventDefault();
                        plot.load_files(files);
                    }
                };
            }(plot)), false);
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function basefile(plot, open) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        // != BASEFILE(false)

        // unlike SIGPLOT, where if Gx.index == 1
        // then xstart = 1.0 and xdelta = 1.0...technically
        // Gx.retx is supposed to be the real X coordinate
        // and Gx.aretx is supposed to be the X coordinate in the
        // current abscissa mode
        if (open) {
            var hcb = Gx.HCB[0];
            Gx.xstart = hcb.xstart;
            Gx.xdelta = hcb.xdelta;
            Mx.origin = 1;
        } else {
            Gx.xstart = 0.0;
            Gx.xdelta = 1.0;
            Gx.autol = -1;
            Mx.origin = 1;
        }

        // if (!open) {
        // Gx.lay[0].cx = false;
        // }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function draw_accessories(plot, mode) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        if (mode > 0) {
            if ((mode >= 4) && (Gx.show_readout) && (!Gx.hide_note)) {
                var ln = Gx.note.length;
                mx.text(Mx, Mx.width - Gx.lbtn - (ln + 1) * Mx.text_w,
                    Mx.text_h, Gx.note);
            }
            if (mode >= 4) {
                draw_panbars(plot);
            }
            if ((mode >= 1) && (Gx.legend)) {
                draw_legend(plot);
            }
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function draw_plugins(plot) {
        var Gx = plot._Gx;
        var ctx = plot._Mx.canvas.getContext("2d");
        var canvas;

        var plugin_index = 0;
        while (plugin_index < Gx.plugins.length) {
            var plugin = Gx.plugins[plugin_index].impl;
            if (plugin.refresh) {
                canvas = Gx.plugins[plugin_index].canvas;

                // Ensure the plugin canvas has the same size as the plot
                if (canvas.width !== plot._Mx.canvas.width) {
                    canvas.width = plot._Mx.canvas.width;
                }
                if (canvas.height !== plot._Mx.canvas.height) {
                    canvas.height = plot._Mx.canvas.height;
                }

                // If the plugin canvas is visible, draw it
                if (canvas.height !== 0 && canvas.width !== 0) {
                    if (canvas.width !== plot._Mx.canvas.width) {
                        canvas.width = plot._Mx.canvas.width;
                    }
                    if (canvas.height !== plot._Mx.canvas.height) {
                        canvas.height = plot._Mx.canvas.height;
                    }
                    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
                    Gx.plugins[plugin_index].impl.refresh(canvas);
                    ctx.drawImage(canvas, 0, 0);
                }
            }
            plugin_index = plugin_index + 1;
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function draw_legend(plot) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        var ctx = Mx.canvas.getContext("2d");

        var n = 0; // integer*4
        var ix = 0; // integer*4
        var iy = 0; // integer*4
        var ln = 0; // integer*4
        var tw = 0; // integer*4
        var xc = 0; // integer*4
        var yc = 0; // integer*4
        var xs = 0; // integer*4
        var ys = 0; // integer*4
        var thk = 0; // integer*4
        var ic = 0; // integer*4

        tw = Mx.text_w;
        xs = tw * 23;
        ys = (Gx.lyr.length + 1) * Mx.text_h;
        xc = Mx.r - xs;
        yc = Mx.t;

        var legendPos = {
            x: xc + 2,
            y: yc + 2,
            width: xs - 5,
            height: ys - 5
        }; // default legend size

        // Determine legend position and label offset based on label sizes
        var defLabelWidth = 98; // a magic number - default width of pixels
        var maxLabelWidth = 0;
        var labelOffset = 0;
        for (n = 0; n < Gx.lyr.length; n++) { // figure out maximum label
            // length
            var labelLength = ctx.measureText(Gx.lyr[n].name).width;
            if (labelLength > maxLabelWidth) {
                maxLabelWidth = labelLength;
            }
        }
        if (maxLabelWidth > defLabelWidth) {
            labelOffset = (maxLabelWidth - defLabelWidth);
            legendPos.width += labelOffset;
            legendPos.x -= labelOffset;
        }

        ctx.strokeStyle = Mx.fg; // Mx.xwfg swapped in for FGColor
        ctx.fillStyle = Mx.bg;
        ctx.fillRect(legendPos.x, legendPos.y, legendPos.width,
            legendPos.height); // Creating a filled box instead of using
        // clear_area
        ctx.strokeRect(legendPos.x, legendPos.y, legendPos.width,
            legendPos.height);

        for (n = 0; n < Gx.lyr.length; n++) {
            ix = xc + 4 * tw;
            iy = yc + n * Mx.text_h + Mx.text_h; // additional text_h to
            // account for 0-based
            // indexing
            if (n === Gx.modlayer) {
                mx.text(Mx, xc + tw - labelOffset, iy + Math.floor(Mx.text_w / 2), '**'); // Added text_w/2
                // offset
            }
            if (Gx.lyr[n].display) {
                ic = Gx.lyr[n].color;
                if (Gx.lyr[n].line > 0) {
                    thk = m.sign(Math.min(tw, Math.abs(Gx.lyr[n].thick)),
                        Gx.lyr[n].thick);
                    // added magic -3 offset to y coordinates to center lines
                    // with text
                    if (thk < 0 || thk === mx.L_dashed) {
                        mx.draw_line(Mx, ic, ix - labelOffset, iy - 3, (ix + tw * 2) - labelOffset, iy - 3, Math.abs(thk), {
                            mode: "dashed",
                            on: 4,
                            off: 4
                        });
                    } else {
                        mx.draw_line(Mx, ic, ix - labelOffset, iy - 3, (ix + tw * 2) - labelOffset, iy - 3, Math.abs(thk));
                    }
                }
                if (Gx.lyr[n].symbol > 0) {
                    // New logic here with 0.6*tw to help with legend symbol
                    // sizing
                    if (Gx.lyr[n].radius < 0) {
                        thk = -m.trunc(0.6 * tw);
                    } else {
                        thk = Math.min(Gx.lyr[n].radius, m.trunc(0.6 * tw));
                    }

                    mx.draw_symbol(Mx, ic, ix + tw - labelOffset, iy - 3,
                        Gx.lyr[n].symbol, thk);
                }
            }
            ix = ix + tw * 3;
            iy = iy + Mx.text_h * 0.3;
            mx.text(Mx, ix - labelOffset, iy, Gx.lyr[n].name);
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function form_plotnote(plot) {
        var Gx = plot._Gx;
        if (Gx.HCB.length === 0) {
            Gx.note = "";
        } else if (Gx.HCB[0].plotnote === undefined) {
            var files = [];
            for (var n = 0; n < Gx.HCB.length; n++) {
                if (Gx.HCB[n].file_name) {
                    files.push(Gx.HCB[n].file_name);
                }
            }
            Gx.note = files.join("|").toUpperCase();
        }
    }

    /**
     * Draws the specified layer.
     *
     * This is expected to be called after clearing the plot.
     *
     * @param {sigplot.Plot}
     *            the plot object
     * @param {Number}
     *            the layer to draw
     * @private
     * @memberOf sigplot
     */
    function draw_layer(plot, n) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;

        if ((n >= Gx.lyr.length) || (!Gx.lyr[n].display) || (Gx.hold !== 0)) {
            return;
        }

        Gx.lyr[n].draw();

        var evt = document.createEvent('Event');
        evt.initEvent('lyrdraw', true, true);
        evt.index = n;
        evt.name = Gx.lyr[n].name; // the name of the layer
        evt.layer = Gx.lyr[n];
        mx.dispatchEvent(Mx, evt);
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function delete_layer(plot, n) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        //if (n < Gx.modlayer) Gx.modlayer = Gx.modlayer - 1;
        //if (n < Gx.modsource) Gx.modsource = Gx.modsource - 1;

        // Notify listeners that a layer is about to be deleted
        var evt = document.createEvent('Event');
        evt.initEvent('lyrdel', true, true);
        evt.index = n;
        evt.name = Gx.lyr[n].name; // the name of the layer
        evt.layer = Gx.lyr[n];
        var executeDefault = mx.dispatchEvent(Mx, evt);
        if (!executeDefault) {
            return; // Delete was prevented
        }

        Gx.lyr[n].ybufn = 0;
        Gx.lyr[n].ybuf = null;
        if (n < Gx.lyr.length - 1) {
            var lyr = Gx.lyr[n];
            for (var i = n; i < Gx.lyr.length - 1; i++) {
                Gx.lyr[i] = Gx.lyr[i + 1];
            }
        }
        Gx.lyr.length -= 1;

        if (Gx.HCB.length > 0) {
            Gx.panxmin = 1.0;
            Gx.panxmax = -1.0;
            Gx.panymin = 1.0;
            Gx.panymax = -1.0;
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function draw_crosshairs(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        if (Gx.cross) {
            if ((Gx.cross === "vertical") || (Gx.cross === true)) {
                if ((Mx.xpos >= Mx.l) && (Mx.xpos <= Mx.r) && (Gx.cross_xpos !== Mx.xpos)) {
                    if (Gx.cross_xpos !== undefined) {
                        mx.rubberline(Mx, Gx.cross_xpos, Mx.t, Gx.cross_xpos, Mx.b);
                    }
                    mx.rubberline(Mx, Mx.xpos, Mx.t, Mx.xpos, Mx.b);
                    Gx.cross_xpos = Mx.xpos;
                }
            }
            if ((Gx.cross === "horizontal") || (Gx.cross === true)) {
                if ((Mx.ypos >= Mx.t) && (Mx.ypos <= Mx.b) && (Gx.cross_ypos !== Mx.ypos)) {
                    if (Gx.cross_ypos !== undefined) {
                        mx.rubberline(Mx, Mx.l, Gx.cross_ypos, Mx.r, Gx.cross_ypos);
                    }

                    mx.rubberline(Mx, Mx.l, Mx.ypos, Mx.r, Mx.ypos);
                    Gx.cross_ypos = Mx.ypos;
                }
            }
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function draw_marker(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        if (Gx.xmrk !== null && Gx.ymrk !== null) {
            var pix = mx.real_to_pixel(Mx, Gx.xmrk, Gx.ymrk);
            if (pix.clipped) {
                return;
            }
            var ctx = Mx.active_canvas.getContext("2d");
            ctx.beginPath();
            ctx.strokeStyle = Mx.xwfg;
            ctx.fillStyle = Mx.xwfg;
            ctx.arc(pix.x, pix.y, 2, 0, 360);
            ctx.stroke(); // just draw the arc's outline

            // TODO add x/y coord
            ctx.textBaseline = "alphabetic";
            ctx.textAlign = "left";
            ctx.fillStyle = Mx.fg;
            ctx.font = Mx.font.font;

            var text = "x:" + mx.format_g(Gx.xmrk, 6, 3, true);
            ctx.fillText(text, pix.x + 5, pix.y - 5);
            text = "y:" + mx.format_g(Gx.ymrk, 6, 3, true);
            ctx.fillText(text, pix.x + 5, pix.y - 5 + Mx.text_h);
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function changephunits(plot, newphunits) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        var newplab = Gx.plab;
        if (newphunits === 'R') {
            newplab = 23;
        } else if (newphunits === 'D') {
            newplab = 24;
        }
        if (newphunits === 'C') {
            newplab = 25;
        }
        if (newplab !== Gx.plab) {
            var phscale = [Math.PI, 180.0, 0.5];
            var dscl = phscale[newplab - 23] / phscale[Gx.plab - 23];
            Gx.plab = newplab;
            if (Gx.cmode === 2) {
                for (var i = 0; i <= Mx.level; i++) {
                    Mx.stk[i].ymin = Mx.stk[i].ymin * dscl;
                    Mx.stk[i].ymax = Mx.stk[i].ymax * dscl;
                    Mx.stk[i].yscl = Mx.stk[i].yscl * dscl;
                }

                Gx.panymin = Gx.panymin * dscl;
                Gx.panymax = Gx.panymax * dscl;
                plot.refresh();
            }
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function changemode(plot, newmode) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;

        Gx.xdata = false;
        for (var n = 0; n < Gx.lyr.length; n++) {
            if (newmode === 5) {
                Gx.lyr[n].xdata = true;
            } else {
                Gx.lyr[n].xdata = false; // TODO (Gx.lyr(n).xsub > 0)
            }
            if (Gx.lyr[n].xdata) {
                Gx.xdata = true;
            }
        }

        if (newmode === Gx.cmode) {
            return;
        } else if (newmode === 5 && Gx.index) {
            alert("Imag/Real mode not permitted in INDEX mode");
        } else if (Gx.lyr.length <= 0) {
            Gx.cmode = newmode;
            // The call to display specs isn't found in sigplot.for;
            // which causes a small bug where the plot mode is
            // changed but the mode label in the specs area
            // isn't updated.
            display_specs(plot);
        } else if (newmode > 0) {
            var oldmode = Gx.cmode;
            Gx.cmode = newmode;

            var autox = Gx.autox;
            var autoy = Gx.autoy;
            Gx.autox = 3;
            Gx.autoy = 3;

            if ((newmode === 5) || (oldmode === 5)) {
                Gx.panxmin = 1.0;
                Gx.panxmax = -1.0;
                Gx.panymin = 1.0;
                Gx.panymax = -1.0;
                Mx.level = 0;

                if (newmode === Gx.basemode) {
                    Mx.stk[0].xmin = Gx.xmin;
                    Mx.stk[0].xmax = Gx.xmax;
                    Mx.stk[0].ymin = Gx.ymin;
                    Mx.stk[0].ymax = Gx.ymax;
                } else if ((newmode === 5) || (Gx.basemode === 5)) {
                    scale_base(plot, {
                        get_data: true
                    });
                } else {
                    Mx.stk[0].xmin = Gx.xmin;
                    Mx.stk[0].xmax = Gx.xmax;
                    scale_base(plot, {
                        get_data: true
                    }, Gx.xmin, Gx.xmax);
                }
            } else {
                if (newmode === Gx.basemode) { // This is only correct if we
                    // didn't load a basefile
                    Gx.panymin = 1.0;
                    Gx.panymax = -1.0;
                    Mx.stk[0].ymin = Gx.ymin;
                    Mx.stk[0].ymax = Gx.ymax;
                } else {
                    scale_base(plot, {}, Mx.stk[Mx.level].xmin,
                        Mx.stk[Mx.level].xmax);
                }
                for (var n = 1; n <= Mx.level; n++) {
                    Mx.stk[n].ymin = Mx.stk[0].ymin;
                    Mx.stk[n].ymax = Mx.stk[0].ymax;
                }
            }
            Gx.autox = autox;
            Gx.autoy = autoy;
            plot.refresh();
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function draw_panbars(plot) {
        var k; // integer*4
        //var i1; // integer*4
        //var itext; // integer*4

        var Mx = plot._Mx;
        var Gx = plot._Gx;

        if ((!Gx.pan) || (Mx.widget)) {
            return;
        }

        k = Mx.level; // Y scrollbar

        var out = {
            ps: Mx.stk[k].ymin,
            pe: Mx.stk[k].ymax
        };
        var need_y_scrollbar = ((out.ps !== Gx.panymin) || (out.pe !== Gx.panymax));
        need_y_scrollbar = need_y_scrollbar && (Mx.level > 0);

        if (Gx.autohide_panbars && (!need_y_scrollbar || !plot.mouseOnCanvas) && !Gx.panning) {
            var ctx = Mx.canvas.getContext("2d");
            ctx.fillStyle = Mx.bg;
            ctx.fillRect(Gx.pyl, Mx.t, Gx.pyl + Gx.pthk, Mx.b - Mx.t);
        } else {
            var i1 = mx.scrollbar(Mx, 0, Gx.pyl, Gx.pyl + Gx.pthk, Mx.t, Mx.b, out,
                Gx.panymin, Gx.panymax, undefined, Mx.scrollbar_y);
            Mx.stk[k].ymin = out.ps;
            Mx.stk[k].ymax = out.pe;
        }

        if (Gx.pl < Mx.width) { // X scrollbar
            out = {
                ps: Mx.stk[k].xmin,
                pe: Mx.stk[k].xmax
            };
            var need_x_scrollbar = ((out.ps !== Gx.panxmin) || (out.pe !== Gx.panxmax));
            need_x_scrollbar = need_x_scrollbar && (!Gx.all || (Mx.level > 0));

            if (Gx.autohide_panbars && (!need_x_scrollbar || !plot.mouseOnCanvas) && !Gx.panning) {
                var ctx = Mx.canvas.getContext("2d");
                ctx.fillStyle = Mx.bg;
                ctx.fillRect(Gx.pl, Gx.pt - 1, Gx.pr - Gx.pl, Gx.pthk + 4);
            } else {
                var i1 = mx.scrollbar(Mx, 0, Gx.pl, Gx.pr, Gx.pt, Gx.pt + Gx.pthk, out,
                    Gx.panxmin, Gx.panxmax, undefined, Mx.scrollbar_x);
                Mx.stk[k].xmin = out.ps;
                Mx.stk[k].xmax = out.pe;
            }
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function pan(plot, action, flag, mouseEvent) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;

        var i; // an integer*4
        var k; // an integer*4
        // var ih // an integer*4
        // var iw; // an integer*4
        // var imin; // an integer*4
        // var imax; // an integer*4
        var j; // an integer*4
        var xmin; // a real*8
        var xmax; // a real*8
        var xran; // a real*8
        // var xtemp; // a real*8
        var ymin; // a real*8
        var ymax; // a real*8
        var yran; // a real*8
        // var ytemp; // a real*8
        var warn; // a logical*4

        var scrollbarState;

        var sbx = new mx.SCROLLBAR(); // a SCROLLBAR
        var sby = new mx.SCROLLBAR(); // a SCROLLBAR

        var SIGPLOT_PAN = false;
        k = Mx.level;
        if (Gx.panmode > 0) {
            sbx.flag = 11;
            sby.flag = 11;
        } else {
            sbx.flag = -12;
            sby.flag = -12;
        }
        if (flag === 0) {
            sbx.action = 0;
            sby.action = 0;
        }

        warn = true;
        if (action.substring(0, 1) === 'Y') {
            ymin = Mx.stk[k].ymin;
            ymax = Mx.stk[k].ymax;
            yran = ymax - ymin;
            if (action === 'YPAN') {
                scrollbarState = Mx.scrollbar_y;

                var out = {
                    ps: ymin,
                    pe: ymax
                };
                i = mx
                    .scrollbar(Mx, sby, Gx.pyl, Gx.pyl + Gx.pthk, Mx.t,
                        Mx.b, out, Gx.panymin, Gx.panymax, mouseEvent,
                        scrollbarState);
                ymin = out.ps;
                ymax = out.pe;
                // TODO: Warn only if Scrollbar arrow is pressed and no
                // movement.
                if (sby.action !== 0) {
                    j = mx.scroll(Mx, sby, mx.XW_UPDATE, undefined,
                        scrollbarState);
                }
                warn = false;
            } else if (action === 'YCENTER') {
                // Orig code : ymin = ymin - yran * (Mx.ypos - (Mx.t + Mx.b) /
                // 2) / (Mx.b - Mx.t) // TODO Worry about any int division here?
                ymin = ymin - yran * (Mx.ypos - (Mx.t + Mx.b) / 2) / (Mx.b - Mx.t);
                ymax = ymin + yran;
                warn = false;
            }

            if (ymin !== Mx.stk[k].ymin || ymax !== Mx.stk[k].ymax) {
                Mx.stk[k].ymin = ymin;
                Mx.stk[k].ymax = ymax;
                if (Gx.cmode === Gx.basemode && Mx.level === 1) {
                    Gx.ymin = Math.min(Gx.ymin, ymin);
                    Gx.ymax = Math.max(Gx.ymax, ymax);
                }

                this.inPan = true; // prevent recursive pans
                var evt = document.createEvent('Event');
                evt.initEvent('ypan', true, true);
                evt.level = Mx.level;
                evt.xmin = Mx.stk[Mx.level].xmin;
                evt.ymin = Mx.stk[Mx.level].ymin;
                evt.xmax = Mx.stk[Mx.level].xmax;
                evt.ymax = Mx.stk[Mx.level].ymax;
                mx.dispatchEvent(Mx, evt); // TODO should we allow pan to be cancelled?
                this.inPan = false;

                plot.refresh();
                // MSGDO(MSK_PANY, Mx.level); // just sets plotinfo.xmin and
                // xmax into the MQD for the menu
                SIGPLOT_PAN = true;
            }
            // TODO Later - Implement a messagebox status method
            // else if (warn) {
            // mx.message('All panned out', -1.0);
            // }
        } else {
            xmin = Mx.stk[k].xmin;
            xmax = Mx.stk[k].xmax;
            xran = xmax - xmin;
            if (action === 'XPAN') {
                scrollbarState = Mx.scrollbar_x;

                var out = {
                    ps: xmin,
                    pe: xmax
                };
                i = mx
                    .scrollbar(Mx, sbx, Gx.pl, Gx.pr, Gx.pt, Gx.pt + Gx.pthk, out, Gx.panxmin, Gx.panxmax,
                        mouseEvent, scrollbarState);
                xmin = out.ps;
                xmax = out.pe;
                // TODO: Warn only if Scrollbox arrow is pressed and no
                // movement.
                if (sbx.action !== 0) {
                    j = mx.scroll(Mx, sbx, mx.XW_UPDATE, undefined,
                        scrollbarState);
                }
                warn = false;
            } else if (action === 'XCENTER') {
                // Original code : xmin = xmin + xran * (Mx.xpos - (Mx.l + Gx.r)
                // / 2) / (Mx.r - Mx.l) // TODO Worry about any int division
                // here?
                xmin = xmin + xran * (Mx.xpos - (Mx.l + Mx.r) / 2) / (Mx.r - Mx.l);
                if (xmin !== Mx.stk[k].xmin) {
                    xmax = xmin + xran;
                }
                warn = false;
            }

            if (Mx.stk[k].xmin !== xmin || Mx.stk[k].xmax !== xmax) {
                Mx.stk[k].xmin = xmin;
                Mx.stk[k].xmax = xmax;
                if (!Gx.xdata && Mx.level === 1) {
                    Gx.xmin = Mx.stk[1].xmin;
                    Gx.xmax = Mx.stk[1].xmax;
                }

                this.inPan = true; // prevent recursive pans
                var evt = document.createEvent('Event');
                evt.initEvent('xpan', true, true);
                evt.level = Mx.level;
                evt.xmin = Mx.stk[Mx.level].xmin;
                evt.ymin = Mx.stk[Mx.level].ymin;
                evt.xmax = Mx.stk[Mx.level].xmax;
                evt.ymax = Mx.stk[Mx.level].ymax;
                mx.dispatchEvent(Mx, evt); // TODO should we allow pan to be cancelled?
                this.inPan = false;

                plot.refresh();
                // MSGDO (MSK_PANX, Mx.level); // just sets plotinfo.xmin and
                // xmax into the MQD for the menu
                SIGPLOT_PAN = true;
            }
            // TODO Later - Implement a messagebox status method
            // else if (warn) {
            // mx.message('All panned out', -1.0);
            // }
        }

        return SIGPLOT_PAN;
    }

    /**
     * Direct method to handle the dragging of a scrollbar.
     *
     * @param plot
     *            The plot to work with.
     * @param scrollAction
     *            The scroll action being performed. Either "YPAN" or "XPAN" are
     *            accepted.
     * @param event
     *            The mouse move event.
     * @private
     * @memberOf sigplot
     */
    function drag_scrollbar(plot, scrollAction, event) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        var min;
        var max;

        // ----- Retrieve appropriate SCROLLBAR -----
        var scrollbar;
        if (scrollAction === "XPAN") {
            scrollbar = plot._Mx.scrollbar_x;
        } else if (scrollAction === "YPAN") {
            scrollbar = plot._Mx.scrollbar_y;
        } else {
            throw "Unable to drag scrollbar - scrollAction is not 'XPAN' or 'YPAN'!!";
        }

        // ----- OLD SIGPLOT.PAN Logic -----
        scrollbar.flag = -12; // TODO Necessary?
        var k = Mx.level;
        if (scrollAction === "XPAN") {
            min = Mx.stk[k].xmin;
            max = Mx.stk[k].xmax;
        } else if (scrollAction === "YPAN") {
            min = Mx.stk[k].ymin;
            max = Mx.stk[k].ymax;
        } else {
            min = undefined;
            max = undefined;
        }

        // ----- MX.SCROLLBAR Logic -----
        var rangeOut = {
            "min": min,
            "max": max
        };
        drag_updateRange(Mx, Gx, scrollbar, scrollAction, rangeOut, event);
        min = rangeOut.min;
        max = rangeOut.max;

        // ----- UPDATE SCROLLBAR -----
        scrollbar.smin = min;
        scrollbar.srange = max - min;
        mx.redrawScrollbar(scrollbar, Mx, undefined);

        // ----- Update the viewbox -----
        updateViewbox(plot, scrollbar.smin, scrollbar.smin + scrollbar.srange,
            scrollAction.slice(0, 1));

        this.inPan = true; // prevent recursive pans
        var evt = document.createEvent('Event');
        if (scrollAction === "XPAN") {
            evt.initEvent('xpan', true, true);
        } else if (scrollAction === "YPAN") {
            evt.initEvent('ypan', true, true);
        }
        evt.level = Mx.level;
        evt.xmin = Mx.stk[Mx.level].xmin;
        evt.ymin = Mx.stk[Mx.level].ymin;
        evt.xmax = Mx.stk[Mx.level].xmax;
        evt.ymax = Mx.stk[Mx.level].ymax;
        mx.dispatchEvent(Mx, evt); // TODO should we allow pan to be cancelled?
        this.inPan = false;

        scrollbar.action = 0; // TODO New step - reset action of the scrollbar
        // after drag is done...
        plot.refresh();
    }

    /**
     * Method to update plot range based on a drag event. Takes the mouse offset
     * introduced by the drag and adds a scale factor.
     *
     * @param Gx
     *            The GX Context to work with.
     * @param scrollbar
     *            The Scrollbar to use.
     * @param scrollAction
     *            The scroll action being performed. Either "YPAN" or "XPAN" are
     *            accepted.
     * @param range
     *            The plot' min and max range values to update.
     * @param event
     *            The mouse move event.
     *
     * @private
     * @memberOf sigplot
     */
    function drag_updateRange(Mx, Gx, scrollbar, scrollAction, range, event) {
        scrollbar.action = mx.SB_DRAG;

        if (scrollAction === "YPAN") {
            var scaleFactor = Mx.scrollbar_y.trange / Mx.scrollbar_y.h;
            if (scrollbar.origin === 4) { // inverted y
                scaleFactor *= -1;
            }
            var mouseOffset = event.screenY - Gx.panning.ypos;
            var realOffset = mouseOffset * scaleFactor;

            if ((Gx.panning.ymin - realOffset) < Gx.panymin) { // At the left
                // edge
                range.max = Gx.panymin + (range.max - range.min);
                range.min = Gx.panymin;
            } else if ((Gx.panning.ymax - realOffset) > Gx.panymax) { // At
                // the
                // right
                // edge
                range.min = Gx.panymax - (range.max - range.min);
                range.max = Gx.panymax;
            } else {
                range.min = Gx.panning.ymin - realOffset;
                range.max = Gx.panning.ymax - realOffset;
            }
        } else if (scrollAction === "XPAN") {
            var scaleFactor = Mx.scrollbar_x.trange / Mx.scrollbar_x.w;
            if (scrollbar.origin === 3) { // inverted x
                scaleFactor *= -1;
            }
            var mouseOffset = event.screenX - Gx.panning.xpos;
            var realOffset = mouseOffset * scaleFactor;

            if ((Gx.panning.xmin + realOffset) < Gx.panxmin) { // At the left
                // edge
                range.max = Gx.panxmin + (range.max - range.min);
                range.min = Gx.panxmin;
            } else if ((Gx.panning.xmax + realOffset) > Gx.panxmax) { // At
                // the
                // right
                // edge
                range.min = Gx.panxmax - (range.max - range.min);
                range.max = Gx.panxmax;
            } else {
                range.min = Gx.panning.xmin + realOffset;
                range.max = Gx.panning.xmax + realOffset;
            }
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function setupPrompt(plot, promptText, isValid, onSuccess, inputValue,
        xpos, ypos, callback) {
        var Mx = plot._Mx;

        if (Mx.prompt) {
            throw "Prompt already exists! Can only have one prompt at a time!";
        }

        // Disable Mx keypress/mouse listeners
        mx.disableListeners(Mx);

        // Disable Plot keypress/mouse listeners
        plot.disable_listeners();

        // Add on to the onSuccess method with plot specifics
        var realOnSuccess = function(plot, onSuccess) {
            return function(value) {
                onSuccess(value);

                // Re-enable Mx keypress/mouse listeners
                mx.enableListeners(Mx);

                // Re-enable Plot keypress/mouse listeners
                plot.enable_listeners();

                plot.refresh();

                if (callback !== undefined) {
                    callback();
                }
            };
        };

        var refresh = function() { // TODO Refactor this setup method to be
            // more like mx.menu/main menu widget?
            plot.refresh();
        };

        // Create the prompt
        var errorMessageTimeout = 5000;

        try {
            mx.prompt(Mx, promptText, isValid, realOnSuccess(plot, onSuccess),
                refresh, inputValue, xpos, ypos, errorMessageTimeout);
        } catch (err) {
            console.log("ERROR: Failed to set up prompt due to: " + err);
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function enable_listeners(plot) {
        var Mx = plot._Mx;
        mx.addEventListener(Mx, "mousedown", plot.onmousedown, false);
        mx.addEventListener(Mx, "mousemove", plot.throttledOnMouseMove, false);
        document.addEventListener("mouseup", plot.docMouseUp, false);
        mx.addEventListener(Mx, "mouseup", plot.mouseup, false);
        window.addEventListener("mousedown", plot.dragMouseDownHandler, false);
        window.addEventListener("mousemove", plot.throttledDragOnMouseMove, false);
        window.addEventListener("mouseup", plot.dragMouseUpHandler, false);
        window.addEventListener("wheel", plot.wheelHandler, false);
        window.addEventListener("mousewheel", plot.wheelHandler, false);
        window.addEventListener("DOMMouseScroll", plot.wheelHandler, false);
        window.addEventListener("keypress", plot.onkeypress, false);
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function disable_listeners(plot) {
        var Mx = plot._Mx;

        mx.removeEventListener(Mx, "mousedown", plot.onmousedown, false);
        mx.removeEventListener(Mx, "mousemove", plot.throttledOnMouseMove,
            false);
        document.removeEventListener("mouseup", plot.docMouseUp, false);
        mx.removeEventListener(Mx, "mouseup", plot.mouseup, false);
        window.removeEventListener("mousedown", plot.dragMouseDownHandler,
            false);
        window.removeEventListener("mousemove", plot.throttledDragOnMouseMove,
            false);
        window.removeEventListener("mouseup", plot.dragMouseUpHandler, false);
        window.removeEventListener("wheel", plot.wheelHandler, false);
        window.removeEventListener("mousewheel", plot.wheelHandler, false);
        window.removeEventListener("DOMMouseScroll", plot.wheelHandler, false);
        window.removeEventListener("keypress", plot.onkeypress, false);
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function display_specs(plot) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;

        var ctx = Mx.canvas.getContext("2d");

        // section logic
        if (Gx.sections !== 0) {
            // TODO
        } else {
            Gx.isec = 0;
        }

        // transform into realworld coordinates
        // is already done by the mousemove listener
        // adjust for abscissa mode
        if (Mx.warpbox) {
            var re = pixel_to_real(plot, Mx.warpbox.xo, Mx.warpbox.yo);
            var rwh = pixel_to_real(plot, Mx.warpbox.xl, Mx.warpbox.yl);

            Gx.aretx = re.x;
            Gx.arety = re.y;
            Gx.dretx = rwh.x - re.x;
            Gx.drety = rwh.y - re.y;
        } else {
            Gx.aretx = Gx.retx;
            Gx.arety = Gx.rety;
            Gx.dretx = Gx.retx - Gx.xmrk;
            Gx.drety = Gx.rety - Gx.ymrk;
        }

        if ((Gx.cmode === 5) && (Gx.iabsc === 1)) {
            Gx.iabsc = 2;
        } // R/I mode
        if (Gx.iabsc === 1) { // index
            Gx.aretx = Math.round((Gx.aretx - Gx.xstart) / Gx.xdelta);
            if (!Gx.index) {
                Gx.aretx += 1;
            }
            Gx.dretx = Math.round(Gx.dretx / Gx.xdelta);
        } else if (Gx.iabsc === 2) { // 1/absc
            if (Gx.aretx !== 0.0) {
                Gx.aretx = 1.0 / Gx.aretx;
            }
            if (Gx.arety !== 0.0) {
                Gx.arety = 1.0 / Gx.arety;
            }
            if (Gx.dretx !== 0.0) {
                Gx.dretx = 1.0 / Gx.dretx;
            }
            if (Gx.drety !== 0.0) {
                Gx.drety = 1.0 / Gx.drety;
            }
        }

        if ((!Gx.show_readout) || (Mx.widget)) {
            return;
        }

        // Clear the specs area
        ctx.fillStyle = Mx.bg;
        var iy = Math.floor(Mx.height - 2.5 * Mx.text_h);
        ctx.fillRect(Mx.text_w, iy, 49 * Mx.text_w, iy + 1.5 * Mx.text_h);

        iy = Math.floor(Mx.height - 0.5 * Mx.text_h);
        var k = Math.max(Gx.pr + Mx.text_w, Mx.width - Mx.text_w * 2);
        ctx.fillStyle = Mx.bg;
        ctx.fillRect(k, iy - Mx.text_h, Mx.text_w, Mx.text_h);

        if (Gx.autohide_readout && !plot.mouseOnCanvas && !Gx.panning) {
            return;
        }

        var xval, yval, xdelta, ydelta;
        // TODO handle xfmt/yfmt using m.d2a_form equivalent 
        if ((Gx.iabsc === 0) && (Gx.ylab === 4)) {
            yval = (m.sec2tspec(Gx.arety) + "                ").substring(0, 16);
            ydelta = (m.sec2tspec(Gx.drety, "delta") + "                ").substring(0, 16);
        } else {
            yval = mx.format_g(Gx.arety, 16, 9, true);
            ydelta = mx.format_g(Gx.drety, 16, 9);
        }
        if ((Gx.iabsc === 0) && (Gx.xlab === 4)) {
            xval = (m.sec2tspec(Gx.aretx) + "                ").substring(0, 16);
            xdelta = (m.sec2tspec(Gx.dretx, "delta") + "                ").substring(0, 16);
        } else {
            xval = mx.format_g(Gx.aretx, 16, 9, true);
            xdelta = mx.format_g(Gx.dretx, 16, 9);
        }

        var chara = "y: " + yval + " dy: " + ydelta + " L=" + Mx.level + " " + cxm[Gx.cmode - 1];
        var charb = "x: " + xval + " dx: " + xdelta + " " + cam[Gx.iabsc];
        if (Gx.iabsc === 3) {
            if (Gx.dretx === 0.0) {
                chara = chara.substr(0, 20) + "sl: Inf             " + chara.substr(40, chara.length);
            } else {
                chara = chara.substr(0, 20) + "sl: " + mx.format_g(Gx.drety / Gx.dretx, 16, 9) + chara.substr(40, chara.length);
            }
        }

        iy = Math.floor(Mx.height - 1.5 * Mx.text_h);
        mx.text(Mx, Mx.text_w, iy, chara);
        iy = Math.floor(Mx.height - 0.5 * Mx.text_h);
        mx.text(Mx, Mx.text_w, iy, charb);

        if (mx.LEGACY_RENDER) {
            // display controls indicator
            if (k < Mx.width) {
                if (Gx.cntrls > 0) {
                    mx.text(Mx, k, iy, 'C');
                } else {
                    mx.text(Mx, k, iy, ' ');
                }
            }
        }

        // draw color bar
        var x = (49 * Mx.text_w) - 3;
        var y = Mx.height - Mx.text_h * 2.5;
        var w = Mx.text_w;
        var h = Mx.text_h * 2;

        mx.colorbar(Mx, x, y, w, h);
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function scale_base(plot, mode, xxmin, xxmax, xlab, ylab) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;

        var load = (mode.get_data === true);

        Gx.panxmin = 1.0;
        Gx.panxmax = -1.0;
        Gx.panymin = 1.0;
        Gx.panymax = -1.0;
        var xmin = xxmin;
        var xmax = xxmax;
        var noxmin = (xmin === undefined);
        var noxmax = (xmax === undefined);
        if (Gx.lyr.length === 0) {
            Gx.panxmin = -1.0;
            Gx.panxmax = 1.0;
            Gx.panymin = -1.0;
            Gx.panymax = 1.0;
        } else {
            if (xlab === undefined) {
                Gx.xlab = Gx.lyr[0].xlab;
            }
            if (ylab === undefined) {
                Gx.ylab = Gx.lyr[0].ylab;
            }

            for (var n = 0; n < Gx.lyr.length; n++) {
                if (noxmin) {
                    xmin = Gx.lyr[n].xmin;
                }

                if (noxmax) {
                    xmax = Gx.lyr[n].xmax;
                }

                if (Gx.xlab !== Gx.lyr[n].xlab) {
                    Gx.xlab = 0; // If the layers aren't consistent use None
                }
                if (Gx.ylab !== Gx.lyr[n].ylab) {
                    Gx.ylab = 0; // If the layers aren't consistent use None
                }

                if (load) {
                    Gx.lyr[n].get_data(xmin, xmax);
                }

                if (Gx.autox > 0 || Gx.autoy > 0) {
                    while (xmin < xmax) {
                        // get_data fills in the layer xbuf/ybuf with data
                        Gx.lyr[n].get_data(xmin, xmax);

                        // have the layer prep it's data to be rendered
                        var npts = Gx.lyr[n].prep(xmin, xmax);

                        // If both All and Expand are provided we
                        // need to look at the entire file to auto-scale it
                        if (Gx.all && Gx.expand) {
                            if (Gx.lyr[n].size === 0) {
                                xmin = xmax;
                            } else {
                                if (Gx.index) {
                                    xmin = xmin + npts;
                                } else {
                                    if (Gx.lyr[n].xdelta >= 0) {
                                        xmin = xmin + (Gx.lyr[n].size * Gx.lyr[n].xdelta);
                                    } else {
                                        xmax = xmax + (Gx.lyr[n].size * Gx.lyr[n].xdelta);
                                    }
                                }
                            }
                        } else {
                            xmin = xmax;
                        }
                    }
                } else {
                    Gx.lyr[n].prep(1.0, -1.0);
                }
            }
        }

        var xran = Gx.panxmax - Gx.panxmin;
        if (xran < 0.0) {
            Gx.panxmax = Gx.panxmin;
            Gx.panxmin = Gx.panxmax + xran;
            xran = -xran;
        }
        if (xran <= 1.0e-20) {
            Gx.panxmin = Gx.panxmin - 1.0;
            Gx.panxmax = Gx.panxmax + 1.0;
        }

        if (((Gx.autox & 1) !== 0) && noxmin) {
            Mx.stk[0].xmin = Gx.panxmin;
        }
        if (((Gx.autox & 2) !== 0) && noxmax) {
            Mx.stk[0].xmax = Gx.panxmax;
            if (!(Gx.all || Gx.xdata)) {
                for (var n = 0; n < Gx.lyr.length; n++) {
                    xmax = Math.min(Gx.lyr[n].xmax, Mx.stk[0].xmax);
                    var dpts = Math.abs((xmax - Gx.lyr[n].xmin) / Gx.lyr[n].xdelta) - Gx.bufmax + 1.0;
                    if (dpts > 0) {
                        Mx.stk[0].xmax = xmax - dpts * Math.abs(Gx.lyr[n].xdelta);
                    }
                }
            }
        }

        if (((Gx.autoy & 1) !== 0)) {
            Mx.stk[0].ymin = Gx.panymin;
        }
        if (((Gx.autoy & 2) !== 0)) {
            Mx.stk[0].ymax = Gx.panymax;
        }
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function pixel_to_real(plot, xpos, ypos) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        var ret = mx.pixel_to_real(Mx, xpos, ypos);
        if (Gx.index) {
            ret.x = ret.x * Gx.xdelta;
        }

        return ret;
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function coordsInRectangle(x, y, rect_x, rect_y, rect_width, rect_height) {
        return (x >= rect_x && x <= rect_x + rect_width && y >= rect_y && y <= rect_y + rect_height);
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function inPanRegion(plot) {
        var inPanRegion = false;
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        var x = Mx.xpos;
        var y = Mx.ypos;

        var command = ' ';

        if (!plot.mouseOnCanvas) {
            return false;
        }

        if (Gx.pan && (x > Mx.r && y >= Mx.t && y <= Mx.b)) { // YPAN
            command = 'YPAN'; // Y scrollbar
            Mx.xpos = Gx.pyl + m.trunc(Gx.pthk / 2); // TODO do we want to
            // reset the xposition?

            inPanRegion = true;
        } else if (Gx.pan && (x >= Gx.pl && x <= Gx.pr) && ((Gx.show_readout && y > Gx.pt - 2) || (!Gx.show_readout && y <= Gx.pt + Gx.pthk + 2))) { // XPAN
            command = 'XPAN'; // X scrollbar
            Mx.ypos = Gx.pt + m.trunc(Gx.pthk / 2); // TODO Do we want to reset
            // the yposition?

            inPanRegion = true;
        }

        return {
            inPanRegion: inPanRegion,
            command: command
        };
    }

    /**
     * @memberOf sigplot
     * @private
     */
    function inPanCenterRegion(plot) {
        var inCenterRegion = false;
        var Mx = plot._Mx;
        var x = Mx.xpos;
        var y = Mx.ypos;
        var th = Mx.text_h;
        var tw = Mx.text_w;
        var command = ' ';

        if (x < Mx.l - tw && y <= Mx.b && y >= Mx.t) { // YCENTER
            // Mx.canvas.getContext("2d").strokeStyle = "blue";
            // Mx.canvas.getContext("2d").strokeRect(0, Mx.t, Mx.l - tw, Mx.b -
            // Mx.t);
            command = 'YCENTER';
            inCenterRegion = true;
        } else if (y > Mx.b + m.trunc(0.5 * tw) && y <= Mx.b + m.trunc(m.trunc(3 * th) / 2) && x >= Mx.l && x <= Mx.r) { // XCENTER
            // Mx.canvas.getContext("2d").strokeStyle = "red";
            // Mx.canvas.getContext("2d").strokeRect(Mx.l, Mx.b + m.trunc(.5 *
            // tw),
            // Mx.r - Mx.l, (Mx.b + m.trunc(m.trunc(3 * th) / 2)) - (Mx.b +
            // m.trunc(.5 * tw)));
            command = 'XCENTER';
            inCenterRegion = true;
        }

        return {
            inCenterRegion: inCenterRegion,
            command: command
        };
    }

    /**
     * Returns true if position is within the given scrollbar's area. Depends on
     * mx.scroll_real2pix method.
     *
     * @param position
     *            An object containing 'x' and 'y' pixel values that represent a
     *            position.
     * @param scrollbar
     *            The scrollbar object itself.
     *
     * @private
     * @memberOf sigplot
     */
    function onScrollbar(position, scrollbar) {
        var s1;
        var sw;

        /*
         * Compute s, the offset in pixels from the 'origin' of the scrollbar's
         * on-screen region.
         */
        var s;
        if (scrollbar.origin & 1) {
            s = position.x - scrollbar.x;
            if (scrollbar.origin & 2) {
                s = scrollbar.w - s;
            }
        } else {
            s = position.y - scrollbar.y;
            if (scrollbar.origin <= 2) {
                s = scrollbar.h - s;
            }
        }

        // Update s1 and sw values
        var scrollReal2PixOut = mx.scroll_real2pix(scrollbar);
        s1 = scrollReal2PixOut.s1;
        sw = scrollReal2PixOut.sw;

        // Determine if mouse is on scrollbar
        if (s >= s1 && s <= s1 + sw) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Performs the middle-click scroll-menu action specified on the plot.
     *
     * @param plot
     *            The plot to work with.
     * @param action
     *            The scrollbar action to perform.
     * @param direction
     *            The scroll direction to update. Acceptable directions are
     *            either "XPAN" or "YPAN".
     * @memberOf sigplot
     * @private
     */
    function middleClickScrollMenuAction(plot, action, direction) {
        var Mx = plot._Mx;

        // Determine the appropriate scrollbar to work with
        var scrollbar;
        if (direction === "XPAN") {
            scrollbar = Mx.scrollbar_x;
        } else if (direction === "YPAN") {
            scrollbar = Mx.scrollbar_y;
        }

        // Set scrollbar action
        scrollbar.action = action;
        scrollbar.step = 0.1 * scrollbar.srange;
        scrollbar.page = 9 * scrollbar.step;
        scrollbar.scale = 2.0;

        // Update min and range to the appropriate values based on action
        mx.scroll(Mx, scrollbar, mx.XW_COMMAND, undefined, scrollbar);

        // Update the viewbox based on new min and max values
        updateViewbox(plot, scrollbar.smin, scrollbar.smin + scrollbar.srange,
            direction.slice(0, 1));

        this.inPan = true; // prevent recursive pans
        var evt = document.createEvent('Event');
        if (direction === "XPAN") {
            evt.initEvent('xpan', true, true);
        } else if (direction === "YPAN") {
            evt.initEvent('ypan', true, true);
        }
        evt.level = Mx.level;
        evt.xmin = Mx.stk[Mx.level].xmin;
        evt.ymin = Mx.stk[Mx.level].ymin;
        evt.xmax = Mx.stk[Mx.level].xmax;
        evt.ymax = Mx.stk[Mx.level].ymax;
        mx.dispatchEvent(Mx, evt); // TODO should we allow pan to be cancelled?
        this.inPan = false;

    }

    /**
     * Updates a plot's viewbox along a given axis to the provided min and max
     * values.
     *
     * @param plot
     *            The plot to work with.
     * @param newMin
     *            The new minimum axis value to use
     * @param newMax
     *            The new maximum axis value to use
     * @param axis
     *            The axis to update. Acceptable axis values are "X" or "Y".
     * @memberOf sigplot
     * @private
     */
    function updateViewbox(plot, newMin, newMax, axis) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;

        var k = Mx.level;

        if (axis === "X") {
            var xmin = newMin;
            var xmax = newMax;

            if (Mx.stk[k].xmin !== xmin || Mx.stk[k].xmax !== xmax) {
                Mx.stk[k].xmin = xmin;
                Mx.stk[k].xmax = xmax;
                if (!Gx.xdata && Mx.level === 1) {
                    Gx.xmin = Mx.stk[1].xmin;
                    Gx.xmax = Mx.stk[1].xmax;
                }
                plot.refresh();
            }
        } else if (axis === "Y") {
            var ymin = newMin;
            var ymax = newMax;

            if (ymin !== Mx.stk[k].ymin || ymax !== Mx.stk[k].ymax) {
                Mx.stk[k].ymin = ymin;
                Mx.stk[k].ymax = ymax;
                if (Gx.cmode === Gx.basemode && Mx.level === 1) {
                    Gx.ymin = Math.min(Gx.ymin, ymin);
                    Gx.ymax = Math.max(Gx.ymax, ymax);
                }
                plot.refresh();
            }
        }
    }

}(window.sigplot, window.mx, window.m));
