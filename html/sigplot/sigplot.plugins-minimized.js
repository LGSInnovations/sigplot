(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sigplot_plugins = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @license
 * File: CanvasInput.js
 *  CanvasInput v1.0.10
 *  http://goldfirestudios.com/blog/108/CanvasInput-HTML5-Canvas-Text-Input
 *
 *  (c) 2013, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  (c) 2013, Axios, Inc.
 *  Modifications made by Axios, Inc.
 *  axiosengineering.com
 *
 *  MIT License
 */

/* global module */
/* global require */

(function() {
    // create a buffer that stores all inputs so that tabbing
    // between them is made possible.
    var inputs = [];

    // initialize the Canvas Input
    var CanvasInput = window.CanvasInput = function(o) {
        var self = this;

        o = o ? o : {};

        // setup the defaults
        self._canvas = o.canvas || null;
        self._ctx = self._canvas ? self._canvas.getContext('2d') : null;
        self._x = o.x || 0;
        self._y = o.y || 0;
        self._extraX = o.extraX || 0;
        self._extraY = o.extraY || 0;
        self._fontSize = o.fontSize || 14;
        self._fontFamily = o.fontFamily || 'Arial';
        self._fontColor = o.fontColor || '#000';
        self._placeHolderColor = o.placeHolderColor || '#bfbebd';
        self._fontWeight = o.fontWeight || 'normal';
        self._fontStyle = o.fontStyle || 'normal';
        self._readonly = o.readonly || false;
        self._maxlength = o.maxlength || null;
        self._width = o.width || 150;
        self._height = o.height || self._fontSize;
        self._padding = o.padding >= 0 ? o.padding : 5;
        self._borderWidth = o.borderWidth >= 0 ? o.borderWidth : 1;
        self._borderColor = o.borderColor || '#959595';
        self._borderRadius = o.borderRadius >= 0 ? o.borderRadius : 3;
        self._backgroundImage = o.backgroundImage || '';
        self._boxShadow = o.boxShadow || '1px 1px 0px rgba(255, 255, 255, 1)';
        self._innerShadow = o.innerShadow || '0px 0px 4px rgba(0, 0, 0, 0.4)';
        self._selectionColor = o.selectionColor || 'rgba(179, 212, 253, 0.8)';
        self._placeHolder = o.placeHolder || '';
        self._value = o.value || self._placeHolder;
        self._onsubmit = o.onsubmit || function() {};
        self._onkeydown = o.onkeydown || function() {};
        self._onkeyup = o.onkeyup || function() {};
        self._onfocus = o.onfocus || function() {};
        self._onblur = o.onblur || function() {};
        self._cursor = false;
        self._cursorPos = 0;
        self._hasFocus = false;
        self._selection = [0, 0];
        self._wasOver = false;
        self._renderOnReturn = (o.renderOnReturn !== undefined ? o.renderOnReturn : true);
        self._disableBlur = o.disableBlur || false;
        self._tabToClear = o.tabToClear || false;

        // parse box shadow
        self.boxShadow(self._boxShadow, true);

        // calculate the full width and height with padding, borders and shadows
        self._calcWH();

        // setup the off-DOM canvas
        self._renderCanvas = document.createElement('canvas');
        self._renderCanvas.setAttribute('width', self.outerW);
        self._renderCanvas.setAttribute('height', self.outerH);
        self._renderCtx = self._renderCanvas.getContext('2d');

        // setup another off-DOM canvas for inner-shadows
        self._shadowCanvas = document.createElement('canvas');
        self._shadowCanvas.setAttribute('width', self._width + self._padding * 2);
        self._shadowCanvas.setAttribute('height', self._height + self._padding * 2);
        self._shadowCtx = self._shadowCanvas.getContext('2d');

        // setup the background color
        if (typeof o.backgroundGradient !== 'undefined') {
            self._backgroundColor = self._renderCtx.createLinearGradient(
                0,
                0,
                0,
                self.outerH
            );
            self._backgroundColor.addColorStop(0, o.backgroundGradient[0]);
            self._backgroundColor.addColorStop(1, o.backgroundGradient[1]);
        } else {
            self._backgroundColor = o.backgroundColor || '#fff';
        }

        // setup main canvas events
        if (self._canvas) {
            self.mousemoveCanvasListener = function(e) {
                e = e || window.event;
                self.mousemove(e, self);
            };
            self._canvas.addEventListener('mousemove', self.mousemoveCanvasListener, false);

            self.mousedownCanvasListener = function(e) {
                e = e || window.event;
                self.mousedown(e, self);
            };
            self._canvas.addEventListener('mousedown', self.mousedownCanvasListener, false);

            self.mouseupCanvasListener = function(e) {
                e = e || window.event;
                self.mouseup(e, self);
            };
            self._canvas.addEventListener('mouseup', self.mouseupCanvasListener, false);
        }

        // setup a global mouseup to blur the input outside of the canvas
        self.mouseupWindowListener = function(e) {
            e = e || window.event;
            if (self._hasFocus && !self._mouseDown) {
                self.blur();
            }
        };
        window.addEventListener('mouseup', self.mouseupWindowListener, true);

        // setup the keydown listener
        self.keydownWindowListener = function(e) {
            e = e || window.event;
            if (self._hasFocus) {
                self.keydown(e, self);
            }
        };
        window.addEventListener('keydown', self.keydownWindowListener, false);

        // setup the keyup listener
        self.keyupWindowListener = function(e) {
            e = e || window.event;
            if (self._hasFocus) {
                self._onkeyup(e, self);
            }
        };
        window.addEventListener('keyup', self.keyupWindowListener, false);

        // setup the 'paste' listener
        self.pasteWindowListener = function(e) {
            e = e || window.event;
            if (self._hasFocus) {
                var text = e.clipboardData.getData('text/plain'),
                    startText = self._value.substr(0, self._cursorPos),
                    endText = self._value.substr(self._cursorPos);
                self._value = startText + text + endText;
                self._cursorPos += text.length;

                self.render();
            }
        };
        window.addEventListener('paste', self.pasteWindowListener, false);

        // add this to the buffer
        inputs.push(self);
        self._inputsIndex = inputs.length - 1;

        // draw the text box
        self.render();
    };

    // setup the prototype
    CanvasInput.prototype = {
        /**
         * Get/set the main canvas.
         * @param  {Object} data Canvas reference.
         * @return {Mixed}      CanvasInput or current canvas.
         */
        canvas: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._canvas = data;
                self._ctx = self._canvas.getContext('2d');

                return self.render();
            } else {
                return self._canvas;
            }
        },

        /**
         * Get/set the x-position.
         * @param  {Number} data The pixel position along the x-coordinate.
         * @return {Mixed}      CanvasInput or current x-value.
         */
        x: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._x = data;

                return self.render();
            } else {
                return self._x;
            }
        },

        /**
         * Get/set the y-position.
         * @param  {Number} data The pixel position along the y-coordinate.
         * @return {Mixed}      CanvasInput or current y-value.
         */
        y: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._y = data;

                return self.render();
            } else {
                return self._y;
            }
        },

        /**
         * Get/set the extra x-position (generally used when no canvas is specified).
         * @param  {Number} data The pixel position along the x-coordinate.
         * @return {Mixed}      CanvasInput or current x-value.
         */
        extraX: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._extraX = data;

                return self.render();
            } else {
                return self._extraX;
            }
        },

        /**
         * Get/set the extra y-position (generally used when no canvas is specified).
         * @param  {Number} data The pixel position along the y-coordinate.
         * @return {Mixed}      CanvasInput or current y-value.
         */
        extraY: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._extraY = data;

                return self.render();
            } else {
                return self._extraY;
            }
        },

        /**
         * Get/set the font size.
         * @param  {Number} data Font size.
         * @return {Mixed}      CanvasInput or current font size.
         */
        fontSize: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._fontSize = data;

                return self.render();
            } else {
                return self._fontSize;
            }
        },

        /**
         * Get/set the font family.
         * @param  {String} data Font family.
         * @return {Mixed}      CanvasInput or current font family.
         */
        fontFamily: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._fontFamily = data;

                return self.render();
            } else {
                return self._fontFamily;
            }
        },

        /**
         * Get/set the font color.
         * @param  {String} data Font color.
         * @return {Mixed}      CanvasInput or current font color.
         */
        fontColor: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._fontColor = data;

                return self.render();
            } else {
                return self._fontColor;
            }
        },

        /**
         * Get/set the place holder font color.
         * @param  {String} data Font color.
         * @return {Mixed}      CanvasInput or current place holder font color.
         */
        placeHolderColor: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._placeHolderColor = data;

                return self.render();
            } else {
                return self._placeHolderColor;
            }
        },

        /**
         * Get/set the font weight.
         * @param  {String} data Font weight.
         * @return {Mixed}      CanvasInput or current font weight.
         */
        fontWeight: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._fontWeight = data;

                return self.render();
            } else {
                return self._fontWeight;
            }
        },

        /**
         * Get/set the font style.
         * @param  {String} data Font style.
         * @return {Mixed}      CanvasInput or current font style.
         */
        fontStyle: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._fontStyle = data;

                return self.render();
            } else {
                return self._fontStyle;
            }
        },

        /**
         * Get/set the width of the text box.
         * @param  {Number} data Width in pixels.
         * @return {Mixed}      CanvasInput or current width.
         */
        width: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._width = data;
                self._calcWH();
                self._updateCanvasWH();

                return self.render();
            } else {
                return self._width;
            }
        },

        /**
         * Get/set the height of the text box.
         * @param  {Number} data Height in pixels.
         * @return {Mixed}      CanvasInput or current height.
         */
        height: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._height = data;
                self._calcWH();
                self._updateCanvasWH();

                return self.render();
            } else {
                return self._height;
            }
        },

        /**
         * Get/set the padding of the text box.
         * @param  {Number} data Padding in pixels.
         * @return {Mixed}      CanvasInput or current padding.
         */
        padding: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._padding = data;
                self._calcWH();
                self._updateCanvasWH();

                return self.render();
            } else {
                return self._padding;
            }
        },

        /**
         * Get/set the border width.
         * @param  {Number} data Border width.
         * @return {Mixed}      CanvasInput or current border width.
         */
        borderWidth: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._borderWidth = data;
                self._calcWH();
                self._updateCanvasWH();

                return self.render();
            } else {
                return self._borderWidth;
            }
        },

        /**
         * Get/set the border color.
         * @param  {String} data Border color.
         * @return {Mixed}      CanvasInput or current border color.
         */
        borderColor: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._borderColor = data;

                return self.render();
            } else {
                return self._borderColor;
            }
        },

        /**
         * Get/set the border radius.
         * @param  {Number} data Border radius.
         * @return {Mixed}      CanvasInput or current border radius.
         */
        borderRadius: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._borderRadius = data;

                return self.render();
            } else {
                return self._borderRadius;
            }
        },

        /**
         * Get/set the background color.
         * @param  {Number} data Background color.
         * @return {Mixed}      CanvasInput or current background color.
         */
        backgroundColor: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._backgroundColor = data;

                return self.render();
            } else {
                return self._backgroundColor;
            }
        },

        /**
         * Get/set the background gradient.
         * @param  {Number} data Background gradient.
         * @return {Mixed}      CanvasInput or current background gradient.
         */
        backgroundGradient: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._backgroundColor = self._renderCtx.createLinearGradient(
                    0,
                    0,
                    0,
                    self.outerH
                );
                self._backgroundColor.addColorStop(0, data[0]);
                self._backgroundColor.addColorStop(1, data[1]);

                return self.render();
            } else {
                return self._backgroundColor;
            }
        },

        /**
         * Get/set the box shadow.
         * @param  {String} data     Box shadow in CSS format (1px 1px 1px rgba(0, 0, 0.5)).
         * @param  {Boolean} doReturn (optional) True to prevent a premature render.
         * @return {Mixed}          CanvasInput or current box shadow.
         */
        boxShadow: function(data, doReturn) {
            var self = this;

            if (typeof data !== 'undefined') {
                // parse box shadow
                var boxShadow = data.split('px ');
                self._boxShadow = {
                    x: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[0], 10),
                    y: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[1], 10),
                    blur: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[2], 10),
                    color: self._boxShadow === 'none' ? '' : boxShadow[3]
                };

                // take into account the shadow and its direction
                if (self._boxShadow.x < 0) {
                    self.shadowL = Math.abs(self._boxShadow.x) + self._boxShadow.blur;
                    self.shadowR = self._boxShadow.blur + self._boxShadow.x;
                } else {
                    self.shadowL = Math.abs(self._boxShadow.blur - self._boxShadow.x);
                    self.shadowR = self._boxShadow.blur + self._boxShadow.x;
                }
                if (self._boxShadow.y < 0) {
                    self.shadowT = Math.abs(self._boxShadow.y) + self._boxShadow.blur;
                    self.shadowB = self._boxShadow.blur + self._boxShadow.y;
                } else {
                    self.shadowT = Math.abs(self._boxShadow.blur - self._boxShadow.y);
                    self.shadowB = self._boxShadow.blur + self._boxShadow.y;
                }

                self.shadowW = self.shadowL + self.shadowR;
                self.shadowH = self.shadowT + self.shadowB;

                self._calcWH();

                if (!doReturn) {
                    self._updateCanvasWH();

                    return self.render();
                }
            } else {
                return self._boxShadow;
            }
        },

        /**
         * Get/set the inner shadow.
         * @param  {String} data In the format of a CSS box shadow (1px 1px 1px rgba(0, 0, 0.5)).
         * @return {Mixed}          CanvasInput or current inner shadow.
         */
        innerShadow: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._innerShadow = data;

                return self.render();
            } else {
                return self._innerShadow;
            }
        },

        /**
         * Get/set the text selection color.
         * @param  {String} data Color.
         * @return {Mixed}      CanvasInput or current selection color.
         */
        selectionColor: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._selectionColor = data;

                return self.render();
            } else {
                return self._selectionColor;
            }
        },

        /**
         * Get/set the place holder text.
         * @param  {String} data Place holder text.
         * @return {Mixed}      CanvasInput or current place holder text.
         */
        placeHolder: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._placeHolder = data;

                return self.render();
            } else {
                return self._placeHolder;
            }
        },

        /**
         * Get/set the current text box value.
         * @param  {String} data Text value.
         * @return {Mixed}      CanvasInput or current text value.
         */
        value: function(data) {
            var self = this;

            if (typeof data !== 'undefined') {
                self._value = data;

                return self.focus();
            } else {
                return self._value;
            }
        },

        /**
         * Set or fire the onsubmit event.
         * @param  {Function} fn Custom callback.
         */
        onsubmit: function(fn) {
            var self = this;

            if (typeof fn !== 'undefined') {
                self._onsubmit = fn;

                return self;
            } else {
                self._onsubmit();
            }
        },

        /**
         * Set or fire the onkeydown event.
         * @param  {Function} fn Custom callback.
         */
        onkeydown: function(fn) {
            var self = this;

            if (typeof fn !== 'undefined') {
                self._onkeydown = fn;

                return self;
            } else {
                self._onkeydown();
            }
        },

        /**
         * Set or fire the onkeyup event.
         * @param  {Function} fn Custom callback.
         */
        onkeyup: function(fn) {
            var self = this;

            if (typeof fn !== 'undefined') {
                self._onkeyup = fn;

                return self;
            } else {
                self._onkeyup();
            }
        },

        /**
         * Place focus on the CanvasInput box, placing the cursor
         * either at the end of the text or where the user clicked.
         * @param  {Number} pos (optional) The position to place the cursor.
         * @return {CanvasInput}
         */
        focus: function(pos) {
            var self = this,
                input;

            // if this is readonly, don't allow it to get focus
            if (self._readonly) {
                return;
            }

            // only fire the focus event when going from unfocussed
            if (!self._hasFocus) {
                self._onfocus(self);
            }

            // remove selection
            if (!self._selectionUpdated) {
                self._selection = [0, 0];
            } else {
                delete self._selectionUpdated;
            }

            // update the cursor position
            self._cursorPos = (typeof pos === 'number') ? pos : self._clipText().length;

            // clear the place holder
            if (self._placeHolder === self._value) {
                self._value = '';
            }

            self._hasFocus = true;
            self._cursor = true;

            // setup cursor interval
            if (self._cursorInterval) {
                clearInterval(self._cursorInterval);
            }
            self._cursorInterval = setInterval(function() {
                self._cursor = !self._cursor;
                self.render();
            }, 500);

            // check if this is Chrome for Android (there is a bug with returning incorrect character key codes)
            var nav = navigator.userAgent.toLowerCase(),
                isChromeMobile = (nav.indexOf('chrome') >= 0 && nav.indexOf('mobile') >= 0 && nav.indexOf('android') >= 0);

            // add support for mobile
            var isMobile = (typeof window.orientation !== 'undefined');
            if (isMobile && !isChromeMobile && document && document.createElement && (input = document.createElement('input'))) {
                input.type = 'text';
                input.style.opacity = 0;
                input.style.position = 'absolute';
                input.style.left = (self._x + self._extraX + (self._canvas ? self._canvas.offsetLeft : 0)) + 'px';
                input.style.top = (self._y + self._extraY + (self._canvas ? self._canvas.offsetTop : 0)) + 'px';
                input.style.width = self._width;
                input.style.height = 0;
                document.body.appendChild(input);
                input.focus();
                input.addEventListener('blur', function() {
                    self.blur(self);
                }, false);
            } else if (isMobile) {
                self.value(prompt(self._placeHolder) || '');
            }

            return self.render();
        },

        /**
         * Removes focus from the CanvasInput box.
         * @param  {Object} _this Reference to this.
         * @return {CanvasInput}
         */
        blur: function(_this) {
            var self = _this || this;

            if (!self._disableBlur) {
                self._onblur(self);

                if (self._cursorInterval) {
                    clearInterval(self._cursorInterval);
                }
                self._hasFocus = false;
                self._cursor = false;
                self._selection = [0, 0];

                // fill the place holder
                if (self._value === '') {
                    self._value = self._placeHolder;
                }
            }

            return self.render();
        },

        /**
         * Maintains continual focus on the CanvasInput by disabling blur.
         * @param {Object} _this Reference to this.
         */
        disableBlur: function(_this) {
            var self = _this || this;
            self._disableBlur = true;
        },

        /**
         * Allows the CanvasInput to blur or focus by re-enabling blur.
         * @param {Object} _this Reference to this.
         */
        enableBlur: function(_this) {
            var self = _this || this;
            self._disableBlur = false;
        },

        /**
         * Fired with the keydown event to draw the typed characters.
         * @param  {Event}       e    The keydown event.
         * @param  {CanvasInput} self
         * @return {CanvasInput}
         */
        keydown: function(e, self) {
            var keyCode = e.which,
                isShift = e.shiftKey,
                key = null,
                startText, endText;

            // make sure the correct text field is being updated
            if (!self._hasFocus) {
                return;
            }

            // fire custom user event
            self._onkeydown(e, self);

            // add support for Ctrl/Cmd+A selection
            if (keyCode === 65 && (e.ctrlKey || e.metaKey)) {
                self._selection = [0, self._value.length];
                e.preventDefault();
                return self.render();
            }

            // block keys that shouldn't be processed
            if (keyCode === 17 || e.metaKey || e.ctrlKey) {
                return self;
            }

            // prevent the default action
            e.preventDefault();

            if (keyCode === 8) { // backspace
                if (!self._clearSelection()) {
                    if (self._cursorPos > 0) {
                        startText = self._value.substr(0, self._cursorPos - 1);
                        endText = self._value.substr(self._cursorPos, self._value.length);
                        self._value = startText + endText;
                        self._cursorPos--;
                    }
                }
            } else if (keyCode === 37) { // left arrow key
                if (self._cursorPos > 0) {
                    self._cursorPos--;
                    self._cursor = true;
                    self._selection = [0, 0];
                }
            } else if (keyCode === 39) { // right arrow key
                if (self._cursorPos < self._value.length) {
                    self._cursorPos++;
                    self._cursor = true;
                    self._selection = [0, 0];
                }
            } else if (keyCode === 13) { // enter key
                self._onsubmit(e, self);
            } else if (keyCode === 9) { // tab key
                if (self._tabToClear) {
                    self._value = "";
                    self._cursorPos = 0;
                } else {
                    var next = (inputs[self._inputsIndex + 1]) ? self._inputsIndex + 1 : 0;
                    if (next !== self._inputsIndex) {
                        self.blur();
                        setTimeout(function() {
                            inputs[next].focus();
                        }, 10);
                    }
                }
            } else if (key = self._mapCodeToKey(isShift, keyCode)) {
                self._clearSelection();

                // enforce the max length
                if (self._maxlength && self._maxlength <= self._value.length) {
                    return;
                }

                startText = (self._value) ? self._value.substr(0, self._cursorPos) : '';
                endText = (self._value) ? self._value.substr(self._cursorPos) : '';
                self._value = startText + key + endText;
                self._cursorPos++;
            }

            if ((keyCode == 13 && self._renderOnReturn) || keyCode !== 13) {
                return self.render();
            } else {
                return function() {};
            }
        },

        /**
         * Fired with the click event on the canvas, and puts focus on/off
         * based on where the user clicks.
         * @param  {Event}       e    The click event.
         * @param  {CanvasInput} self
         * @return {CanvasInput}
         */
        click: function(e, self) {
            var mouse = self._mousePos(e),
                x = mouse.x,
                y = mouse.y;

            if (self._endSelection) {
                delete self._endSelection;
                delete self._selectionUpdated;
                return;
            }

            if (self._canvas && self._overInput(x, y) || !self._canvas) {
                if (self._mouseDown) {
                    self._mouseDown = false;
                    self.click(e, self);
                    return self.focus(self._clickPos(x, y));
                }
            } else {
                return self.blur();
            }
        },

        /**
         * Fired with the mousemove event to update the default cursor.
         * @param  {Event}       e    The mousemove event.
         * @param  {CanvasInput} self
         * @return {CanvasInput}
         */
        mousemove: function(e, self) {
            var mouse = self._mousePos(e),
                x = mouse.x,
                y = mouse.y,
                isOver = self._overInput(x, y);

            if (isOver && self._canvas) {
                self._canvas.style.cursor = 'text';
                self._wasOver = true;
            } else if (self._wasOver && self._canvas) {
                self._canvas.style.cursor = 'default';
                self._wasOver = false;
            }

            if (self._hasFocus && self._selectionStart >= 0) {
                var curPos = self._clickPos(x, y),
                    start = Math.min(self._selectionStart, curPos),
                    end = Math.max(self._selectionStart, curPos);

                if (!isOver) {
                    self._selectionUpdated = true;
                    self._endSelection = true;
                    delete self._selectionStart;
                    self.render();
                    return;
                }

                if (self._selection[0] !== start || self._selection[1] !== end) {
                    self._selection = [start, end];
                    self.render();
                }
            }
        },

        /**
         * Fired with the mousedown event to start a selection drag.
         * @param  {Event} e    The mousedown event.
         * @param  {CanvasInput} self
         */
        mousedown: function(e, self) {
            var mouse = self._mousePos(e),
                x = mouse.x,
                y = mouse.y,
                isOver = self._overInput(x, y);

            // setup the 'click' event
            self._mouseDown = isOver;

            // start the selection drag if inside the input
            if (self._hasFocus && isOver) {
                self._selectionStart = self._clickPos(x, y);
            }
        },

        /**
         * Fired with the mouseup event to end a selection drag.
         * @param  {Event} e    The mouseup event.
         * @param  {CanvasInput} self
         */
        mouseup: function(e, self) {
            var mouse = self._mousePos(e),
                x = mouse.x,
                y = mouse.y;

            // update selection if a drag has happened
            var isSelection = self._clickPos(x, y) !== self._selectionStart;
            if (self._hasFocus && self._selectionStart >= 0 && self._overInput(x, y) && isSelection) {
                self._selectionUpdated = true;
                delete self._selectionStart;
                self.render();
            } else {
                delete self._selectionStart;
            }

            self.click(e, self);
        },

        /**
         * Helper method to get the off-DOM canvas.
         * @return {Object} Reference to the canvas.
         */
        renderCanvas: function() {
            return this._renderCanvas;
        },

        /**
         * Helper method to remove all event listeners, stop the blinking cursor and
         * reset the cursor style.
         */
        cleanup: function() {
            this._canvas.removeEventListener("mouseup", this.mouseupCanvasListener, false);
            this._canvas.removeEventListener("mousedown", this.mousedownCanvasListener, false);
            this._canvas.removeEventListener("mousemove", this.mousemoveCanvasListener, false);
            window.removeEventListener("keydown", this.keydownWindowListener, false);
            window.removeEventListener("keyup", this.keyupWindowListener, false);
            window.removeEventListener("mouseup", this.mouseupWindowListener, true);
            window.removeEventListener("paste", this.pasteWindowListener, false);
            clearInterval(this._cursorInterval);

            this._canvas.style.cursor = 'default';
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i] === this) {
                    inputs.remove(i);
                }
            }
        },

        /**
         * Clears and redraws the CanvasInput on an off-DOM canvas,
         * and if a main canvas is provided, draws it all onto that.
         * @return {CanvasInput}
         */
        render: function() {
            var self = this,
                ctx = self._renderCtx,
                w = self.outerW,
                h = self.outerH,
                br = self._borderRadius,
                bw = self._borderWidth,
                sw = self.shadowW,
                sh = self.shadowH;

            // clear the canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // setup the box shadow
            ctx.shadowOffsetX = self._boxShadow.x;
            ctx.shadowOffsetY = self._boxShadow.y;
            ctx.shadowBlur = self._boxShadow.blur;
            ctx.shadowColor = self._boxShadow.color;

            // draw the border
            if (self._borderWidth > 0) {
                ctx.fillStyle = self._borderColor;
                self._roundedRect(ctx, self.shadowL, self.shadowT, w - sw, h - sh, br);
                ctx.fill();

                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
            }

            // draw the text box background
            self._drawTextBox(function() {
                // make sure all shadows are reset
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;

                // clip the text so that it fits within the box
                var text = self._clipText();

                // draw the selection
                var paddingBorder = self._padding + self._borderWidth + self.shadowT;
                if (self._selection[1] > 0) {
                    var selectOffset = self._textWidth(text.substring(0, self._selection[0])),
                        selectWidth = self._textWidth(text.substring(self._selection[0], self._selection[1]));

                    ctx.fillStyle = self._selectionColor;
                    ctx.fillRect(paddingBorder + selectOffset, paddingBorder, selectWidth, self._height);
                }

                // draw the cursor
                ctx.fillStyle = (self._placeHolder === self._value && self._value !== '') ? self._placeHolderColor : self._fontColor;
                if (self._cursor) {
                    var cursorOffset = self._textWidth(text.substring(0, self._cursorPos));

                    ctx.fillRect(paddingBorder + cursorOffset, paddingBorder, 1, self._height);
                }

                // draw the text
                var textX = self._padding + self._borderWidth + self.shadowL,
                    textY = Math.round(paddingBorder + self._height / 2);

                ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, textX, textY);

                // parse inner shadow
                var innerShadow = self._innerShadow.split('px '),
                    isOffsetX = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[0], 10),
                    isOffsetY = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[1], 10),
                    isBlur = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[2], 10),
                    isColor = self._innerShadow === 'none' ? '' : innerShadow[3];

                // draw the inner-shadow (damn you canvas, this should be easier than this...)
                if (isBlur > 0) {
                    var shadowCtx = self._shadowCtx,
                        scw = shadowCtx.canvas.width,
                        sch = shadowCtx.canvas.height;

                    shadowCtx.clearRect(0, 0, scw, sch);
                    shadowCtx.shadowBlur = isBlur;
                    shadowCtx.shadowColor = isColor;

                    // top shadow
                    shadowCtx.shadowOffsetX = 0;
                    shadowCtx.shadowOffsetY = isOffsetY;
                    shadowCtx.fillRect(-1 * w, -100, 3 * w, 100);

                    // right shadow
                    shadowCtx.shadowOffsetX = isOffsetX;
                    shadowCtx.shadowOffsetY = 0;
                    shadowCtx.fillRect(scw, -1 * h, 100, 3 * h);

                    // bottom shadow
                    shadowCtx.shadowOffsetX = 0;
                    shadowCtx.shadowOffsetY = isOffsetY;
                    shadowCtx.fillRect(-1 * w, sch, 3 * w, 100);

                    // left shadow
                    shadowCtx.shadowOffsetX = isOffsetX;
                    shadowCtx.shadowOffsetY = 0;
                    shadowCtx.fillRect(-100, -1 * h, 100, 3 * h);

                    // create a clipping mask on the main canvas
                    self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
                    ctx.clip();

                    // draw the inner-shadow from the off-DOM canvas
                    ctx.drawImage(self._shadowCanvas, 0, 0, scw, sch, bw + self.shadowL, bw + self.shadowT, scw, sch);
                }

                // draw to the visible canvas
                if (self._ctx) {
                    self._ctx.clearRect(self._x, self._y, ctx.canvas.width, ctx.canvas.height);
                    self._ctx.drawImage(self._renderCanvas, self._x, self._y);
                }

                return self;

            });
        },

        /**
         * Draw the text box area with either an image or background color.
         * @param  {Function} fn Callback.
         */
        _drawTextBox: function(fn) {
            var self = this,
                ctx = self._renderCtx,
                w = self.outerW,
                h = self.outerH,
                br = self._borderRadius,
                bw = self._borderWidth,
                sw = self.shadowW,
                sh = self.shadowH;

            // only draw the background shape if no image is being used
            if (self._backgroundImage === '') {
                ctx.fillStyle = self._backgroundColor;
                self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
                ctx.fill();

                fn();
            } else {
                var img = new Image();
                img.src = self._backgroundImage;
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, img.width, img.height, bw + self.shadowL, bw + self.shadowT, w, h);

                    fn();
                };
            }
        },

        /**
         * Deletes selected text in selection range and repositions cursor.
         * @return {Boolean} true if text removed.
         */
        _clearSelection: function() {
            var self = this;

            if (self._selection[1] > 0) {
                // clear the selected contents
                var start = self._selection[0],
                    end = self._selection[1];

                self._value = self._value.substr(0, start) + self._value.substr(end);
                self._cursorPos = start;
                self._cursorPos = (self._cursorPos < 0) ? 0 : self._cursorPos;
                self._selection = [0, 0];

                return true;
            }

            return false;
        },

        /**
         * Clip the text string to only return what fits in the visible text box.
         * @param  {String} value The text to clip.
         * @return {String} The clipped text.
         */
        _clipText: function(value) {
            var self = this;
            value = (typeof value === 'undefined') ? self._value : value;

            var textWidth = self._textWidth(value),
                fillPer = textWidth / (self._width - self._padding),
                text = fillPer > 1 ? value.substr(-1 * Math.floor(value.length / fillPer)) : value;

            return text + '';
        },

        /**
         * Gets the pixel with of passed text.
         * @param  {String} text The text to measure.
         * @return {Number}      The measured width.
         */
        _textWidth: function(text) {
            var self = this,
                ctx = self._renderCtx;

            ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
            ctx.textAlign = 'left';

            return ctx.measureText(text).width;
        },

        /**
         * Recalculate the outer with and height of the text box.
         */
        _calcWH: function() {
            var self = this;

            // calculate the full width and height with padding, borders and shadows
            self.outerW = self._width + self._padding * 2 + self._borderWidth * 2 + self.shadowW;
            self.outerH = self._height + self._padding * 2 + self._borderWidth * 2 + self.shadowH;
        },

        /**
         * Update the width and height of the off-DOM canvas when attributes are changed.
         */
        _updateCanvasWH: function() {
            var self = this,
                oldW = self._renderCanvas.width,
                oldH = self._renderCanvas.height;

            // update off-DOM canvas
            self._renderCanvas.setAttribute('width', self.outerW);
            self._renderCanvas.setAttribute('height', self.outerH);
            self._shadowCanvas.setAttribute('width', self._width + self._padding * 2);
            self._shadowCanvas.setAttribute('height', self._height + self._padding * 2);

            // clear the main canvas
            if (self._ctx) {
                self._ctx.clearRect(self._x, self._y, oldW, oldH);
            }
        },

        /**
         * Creates the path for a rectangle with rounded corners.
         * Must call ctx.fill() after calling this to draw the rectangle.
         * @param  {Object} ctx Canvas context.
         * @param  {Number} x   x-coordinate to draw from.
         * @param  {Number} y   y-coordinate to draw from.
         * @param  {Number} w   Width of rectangle.
         * @param  {Number} h   Height of rectangle.
         * @param  {Number} r   Border radius.
         */
        _roundedRect: function(ctx, x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;

            ctx.beginPath();

            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);

            ctx.closePath();
        },

        /**
         * Checks if a coordinate point is over the input box.
         * @param  {Number} x x-coordinate position.
         * @param  {Number} y y-coordinate position.
         * @return {Boolean}   True if it is over the input box.
         */
        _overInput: function(x, y) {
            var self = this,
                xLeft = x >= self._x + self._extraX,
                xRight = x <= self._x + self._extraX + self._width + self._padding * 2,
                yTop = y >= self._y + self._extraY,
                yBottom = y <= self._y + self._extraY + self._height + self._padding * 2;

            return xLeft && xRight && yTop && yBottom;
        },

        /**
         * Use the mouse's x & y coordinates to determine
         * the position clicked in the text.
         * @param  {Number} x X-coordinate.
         * @param  {Number} y Y-coordinate.
         * @return {Number}   Cursor position.
         */
        _clickPos: function(x, y) {
            var self = this,
                value = self._value;

            // don't count placeholder text in this
            if (self._value === self._placeHolder) {
                value = '';
            }

            // determine where the click was made along the string
            var text = self._clipText(value),
                totalW = 0,
                pos = text.length;

            if (x - (self._x + self._extraX) < self._textWidth(text)) {
                // loop through each character to identify the position
                for (var i = 0; i < text.length; i++) {
                    totalW += self._textWidth(text[i]);
                    if (totalW >= x - (self._x + self._extraX)) {
                        pos = i;
                        break;
                    }
                }
            }

            return pos;
        },

        /**
         * Calculate the mouse position based on the event callback and the elements on the page.
         * @param  {Event} e
         * @return {Object}   x & y values
         */
        _mousePos: function(e) {
            var elm = e.target,
                style = document.defaultView.getComputedStyle(elm, undefined),
                paddingLeft = parseInt(style['paddingLeft'], 10) || 0,
                paddingTop = parseInt(style['paddingLeft'], 10) || 0,
                borderLeft = parseInt(style['borderLeftWidth'], 10) || 0,
                borderTop = parseInt(style['borderLeftWidth'], 10) || 0,
                htmlTop = document.body.parentNode.offsetTop || 0,
                htmlLeft = document.body.parentNode.offsetLeft || 0,
                offsetX = 0,
                offsetY = 0,
                x, y;

            // calculate the total offset
            if (typeof elm.offsetParent !== 'unefined') {
                do {
                    offsetX += elm.offsetLeft;
                    offsetY += elm.offsetTop;
                } while ((elm = elm.offsetParent));
            }

            // take into account borders and padding
            offsetX += paddingLeft + borderLeft + htmlLeft;
            offsetY += paddingTop + borderTop + htmlTop;

            return {
                x: e.pageX - offsetX,
                y: e.pageY - offsetY
            };
        },

        /**
         * Translate a keycode into the correct keyboard character.
         * @param  {Boolean} isShift True if the shift key is being pressed.
         * @param  {Number}  keyCode The character code.
         * @return {String}          The translated character.
         */
        _mapCodeToKey: function(isShift, keyCode) {
            var self = this,
                blockedKeys = [8, 9, 13, 16, 17, 18, 20, 27, 91, 92],
                key = '';

            // block keys that we don't want to type
            for (var i = 0; i < blockedKeys.length; i++) {
                if (keyCode === blockedKeys[i]) {
                    return;
                }
            }

            // make sure we are getting the correct input
            if (typeof isShift !== 'boolean' || typeof keyCode !== 'number') {
                return;
            }

            var charMap = {
                32: ' ',
                48: ')',
                49: '!',
                50: '@',
                51: '#',
                52: '$',
                53: '%',
                54: '^',
                55: '&',
                56: '*',
                57: '(',
                59: ':',
                107: '+',
                173: '_', // firefox uses 173 instead of 189
                189: '_',
                186: ':',
                187: '+',
                188: '<',
                190: '>',
                191: '?',
                192: '~',
                219: '{',
                220: '|',
                221: '}',
                222: '"'
            };

            // convert the code to a character
            if (isShift) {
                key = (keyCode >= 65 && keyCode <= 90) ? String.fromCharCode(keyCode) : charMap[keyCode];
            } else {
                if (keyCode >= 65 && keyCode <= 90) {
                    key = String.fromCharCode(keyCode).toLowerCase();
                } else {
                    if (keyCode === 96) {
                        key = '0';
                    } else if (keyCode === 97) {
                        key = '1';
                    } else if (keyCode === 98) {
                        key = '2';
                    } else if (keyCode === 99) {
                        key = '3';
                    } else if (keyCode === 100) {
                        key = '4';
                    } else if (keyCode === 101) {
                        key = '5';
                    } else if (keyCode === 102) {
                        key = '6';
                    } else if (keyCode === 103) {
                        key = '7';
                    } else if (keyCode === 104) {
                        key = '8';
                    } else if (keyCode === 105) {
                        key = '9';
                    } else if (keyCode === 188) {
                        key = ',';
                    } else if (keyCode === 190) {
                        key = '.';
                    } else if (keyCode === 191) {
                        key = '/';
                    } else if (keyCode === 192) {
                        key = '`';
                    } else if (keyCode === 220) {
                        key = '\\';
                    } else if (keyCode === 187) {
                        key = '=';
                    } else if ((keyCode === 189)  || (keyCode === 173)) {
                        // firefox maps the minus key to 173, rather
                        // then trying to use browser detection we
                        // simply accept 173 as well...which means that
                        // for Chrome using the mute button would
                        // cause minus sign to appear
                        key = '-';
                    } else if (keyCode === 222) {
                        key = '\'';
                    } else if (keyCode === 186) {
                        key = ';';
                    } else if (keyCode === 219) {
                        key = '[';
                    } else if (keyCode === 221) {
                        key = ']';
                    } else {
                        key = String.fromCharCode(keyCode);
                    }
                }
            }

            return key;
        }
    };

    module.exports = CanvasInput;
})();

},{}],2:[function(require,module,exports){
/* global module */
/* global require */
 (function() {
     var tinycolor = require("tinycolor2");
     if (typeof Object.assign !== 'function') {
         // Must be writable: true, enumerable: false, configurable: true
         Object.defineProperty(Object, "assign", {
             value: function assign(target, varArgs) { // .length of function is 2
                 'use strict';
                 if (target == null) { // TypeError if undefined or null
                     throw new TypeError('Cannot convert undefined or null to object');
                 }
                 var to = Object(target);
                 for (var index = 1; index < arguments.length; index++) {
                     var nextSource = arguments[index];
                     if (nextSource != null) { // Skip over if undefined or null
                         for (var nextKey in nextSource) {
                             // Avoid bugs when hasOwnProperty is shadowed
                             if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                 to[nextKey] = nextSource[nextKey];
                             }
                         }
                     }
                 }
                 return to;
             },
             writable: true,
             configurable: true
         });
     }
     var ColorMap = window.ColorMap = function(colors, options) {
         this.options = {
             ncolors: 500,
             alpha: 255
         };
         this.options = Object.assign(this.options, options);
         this.map = [];
         var _min = 0;
         this._low = 0;
         this._high = 1;
         var ncolors = this.options.ncolors;
         this._fscale = ncolors / (this._high - this._low);
         var colorindex = 1;
         var colorBlockIndex = 1;
         colors = JSON.parse(JSON.stringify(colors)); //make a copy so we dont change the original colors
         colors = this._parseColors(colors);
         this.colors = colors;
         var col1 = colors[0];
         var col2 = colors[1];
         var colorStop = colors[1].pos - colors[0].pos;
         var colorsInBlock = ncolors * (colorStop / 100);
         this.colorsInBlock = colorsInBlock;
         var factorStep = 1 / colorsInBlock;
         for (var n = 0; n < ncolors - 2; n++) {
             if (colorBlockIndex > colorsInBlock) {
                 col1 = colors[colorindex];
                 col2 = colors[colorindex + 1];
                 if (col2 === undefined) {
                     break;
                 }
                 var colorStop = col2.pos - col1.pos;
                 var colorsInBlock = ncolors * (colorStop / 100);
                 this.colorsInBlock = colorsInBlock;
                 var factorStep = 1 / colorsInBlock;
                 var colorBlockIndex = 1;
                 colorindex += 1;
             }
             this._addColor(this.interpolate(col1, col2, factorStep * colorBlockIndex));
             colorBlockIndex += 1;
         }
         
        this._addColor(colors[colors.length -1]);
        this._addColor(colors[0], true);
         
     };
     ColorMap.prototype = {
         _addColor: function(color, front) {
             color.hex = this._rgbToHex(color.red, color.green, color.blue);
             color.color = (color.alpha << 24) | // alpha
                 (color.blue << 16) | // blue
                 (color.green << 8) | // green
                 (color.red);
             if (front) {
                 this.map.unshift(color);
             } else {
                 this.map.push(color);
             }
         },
         _parseColors: function(colors) {
             for (var i = 0, c = colors.length; i < c; i++) {
                 var color = colors[i];
                 if (typeof color === "string") {
                     colors[i] = this._hexToRgb(color);
                     color = tinycolor(color);
                     color = color.toRgb();
                     colors[i] = {red:color.r,green:color.g,blue:color.b,alpha:this.options.alpha};

                 } else if (color.hasOwnProperty("color")) {
                     var newColor = tinycolor(color.color);
                     newColor = newColor.toRgb();
                     newColor = {red:newColor.r,green:newColor.g,blue:newColor.b,alpha:this.options.alpha};
                     if (color.hasOwnProperty("pos")) {
                         newColor.pos = color.pos;
                     }
                     colors[i] = newColor;
                 } else {
                     //assume if it has rgb values it is a percentage
                     colors[i].red = Math.floor(Math.round(255 * (color.red / 100)));
                     colors[i].green = Math.floor(Math.round(255 * (color.green / 100)));
                     colors[i].blue = Math.floor(Math.round(255 * (color.blue / 100)));
                 }
                 if (!colors[i].hasOwnProperty("alpha")) {
                     colors[i].alpha = this.options.alpha;
                 }
             }
             return this._checkColorStops(colors);
         },
         _checkColorStops: function(colors) {
             var lastStop = 0;
             var colorsWithNoStops = 0;
             for (var i = 0, c = colors.length; i < c; i++) {
                 var color = colors[i];
                 if (!color.hasOwnProperty("pos")) {
                     colorsWithNoStops += 1;
                 } else {
                     if (colorsWithNoStops) {
                         var stopSize = (color.pos - lastStop) / colorsWithNoStops;
                         var currentPos = color.pos;
                         for (var z = 1; z <= colorsWithNoStops; z++) {
                             colors[i - z].pos = currentPos - stopSize;
                             currentPos -= stopSize;
                         }
                     }
                     colorsWithNoStops = 0;
                 }
             }
             if (colorsWithNoStops) {
                 var currentPos = 100;
                 colors[colors.length - 1].pos = currentPos;
                 if (lastStop === 0) {
                     colors[0].pos = 0;
                     colorsWithNoStops -= 1;
                 }
                 var stopSize = (currentPos - lastStop) / colorsWithNoStops;
                 var i = colors.length - 1;
                 for (var z = 1; z < colorsWithNoStops; z++) {
                     colors[i - z].pos = currentPos - stopSize;
                     currentPos -= stopSize;
                 }
             }
             return colors;
         },
         _componentToHex: function(c) {
             var hex = c.toString(16);
             return hex.length === 1 ? "0" + hex : hex;
         },
         _rgbToHex: function(r, g, b) {
             return "#" + this._componentToHex(r) + this._componentToHex(g) + this._componentToHex(b);
         },
         _hexToRgb: function(hex) {
             var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
             return result ? {
                 red: parseInt(result[1], 16),
                 green: parseInt(result[2], 16),
                 blue: parseInt(result[3], 16)
             } : null;
         },
         getColor: function(number) {
             var n = (number - this._low) * this._fscale;
             var colorindex = ~~n; //make int fastest method
             if (colorindex > this.map.length - 1) {
                 colorindex = this.map.length - 1;
             } else if (colorindex < 0) {
                 colorindex = 0;
             }
             return this.map[colorindex];
         },
         setRange: function(low, high) {
             // only recalculate if a value has changed
             if ((this._low !== low) || (this._high !== high)) {
                 this._low = low;
                 this._high = high;
                 this._fscale = this.map.length / Math.abs(this._high - this._low);
             }
         },
         interpolate: function(col1, col2, factor) {
             return {
                 red: col1.red + factor * (col2.red - col1.red),
                 green: col1.green + factor * (col2.green - col1.green),
                 blue: col1.blue + factor * (col2.blue - col1.blue),
                 alpha: col1.alpha + factor * (col2.alpha - col1.alpha)
             };
         }
     };
     module.exports = ColorMap;
 })();
},{"tinycolor2":14}],3:[function(require,module,exports){
/**
 * @license
 * File: bluefile.js
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
 *
 */
/**
 * Bluefiles are a binary format directly supported by SigPlot.  A Bluefile consists of a 512-byte header
 * followed by binary data.
 * For more information on BLUEFILES, please visit http://nextmidas.techma.com/nm/htdocs/usersguide/BlueFiles.html
 *
 * Offset   Name        Size    Type        Description
 * -----------------------------------------------------------------------------
 * 0        version     4   char[4]     Header version
 * 4        head_rep    4   char[4]     Header representation
 * 8        data_rep    4   char[4]     Data representation
 *12        detached    4   int_4       Detached header
 *16        protected   4   int_4       Protected from overwrite
 *20        pipe        4   int_4       Pipe mode (N/A)
 *24        ext_start   4   int_4       Extended header start, in 512-byte blocks
 *28        ext_size    4   int_4       Extended header size in bytes
 *32        data_start  8   real_8      Data start in bytes
 *40        data_size   8   real_8      Data size in bytes
 *48        type        4   int_4       File type code
 *52        format      2   char[2]     Data format code
 *54        flagmask    2   int_2       16-bit flagmask (1=flagbit)
 *56        timecode    8   real_8      Time code field
 *64        inlet       2   int_2       Inlet owner
 *66        outlets     2   int_2       Number of outlets
 *68        outmask     4   int_4       Outlet async mask
 *72        pipeloc     4   int_4       Pipe location
 *76        pipesize    4   int_4       Pipe size in bytes
 *80        in_byte     8   real_8      Next input byte
 *88        out_byte    8   real_8      Next out byte (cumulative)
 *96        outbytes    64  real_8[8]   Next out byte (each outlet)
 *160       keylength   4   int_4       Length of keyword string
 *164       keywords    92  char[92]    User defined keyword string
 *256       Adjunct     256     char[256]   Type-specific adjunct union (See below for 1000 and 2000 type bluefiles)
 *
 *
 * Type-1000 Adjunct
 * 0        xstart      8   real_8      Abscissa value for first sample
 *8         xdelta      8   real_8      Abscissa interval between samples
 *16        xunits      4   int_4       Units for abscissa values
 *
 * Type-2000 Adjunct
 *0         xstart      8   real_8      Frame (column) starting value
 *8         xdelta      8   real_8      Increment between samples in frame
 *16        xunits      4   int_4       Frame (column) units
 *20        subsize     4   int_4       Number of data points per frame (row)
 *24        ystart      8   real_8      Abscissa (row) start
 *32        ydelta      8   real_8      Increment between frames
 *36        yunits      4   int_4       Abscissa (row) unit code
 *
 * @namespace bluefile
 */

/* global module */
/* global require */

(function() {
    'use strict';

    var common = require("./common");

    function bluefile() {}

    /**
     * @memberOf bluefile
     * @private
     */
    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
    // https://gist.github.com/TooTallNate/4750953
    /**
     * @memberof bluefile
     * @private
     */
    function endianness() {
        var b = new ArrayBuffer(4);
        var a = new Uint32Array(b);
        var c = new Uint8Array(b);
        a[0] = 0xdeadbeef;
        if (c[0] === 0xef) {
            return 'LE';
        }
        if (c[0] === 0xde) {
            return 'BE';
        }
        throw new Error('unknown endianness');
    }
    /**
     * @memberOf bluefile
     * @private
     */
    var ARRAY_BUFFER_ENDIANNESS = endianness();
    /**
     * @memberOf bluefile
     * @private
     */
    var _SPA = {
        'S': 1,
        'C': 2,
        'V': 3,
        'Q': 4,
        'M': 9,
        'X': 10,
        'T': 16,
        'U': 1,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9
    };
    /**
     * @memberOf bluefile
     * @private
     */
    var _BPS = {
        'P': 0.125,
        'A': 1,
        'O': 1,
        'B': 1,
        'I': 2,
        'L': 4,
        'X': 8,
        'F': 4,
        'D': 8
    };
    /**
     * @memberOf bluefile
     * @private
     */
    var _XM_TO_TYPEDARRAY = {
        'P': null,
        'A': null,
        'O': Uint8Array,
        'B': Int8Array,
        'I': Int16Array,
        'L': Int32Array,
        'X': null,
        'F': Float32Array,
        'D': Float64Array
    };
    /**
     * @memberof bluefile
     * @param   {array}     buf         Data bffer
     * @param number
     * @param bool
     * @private
     */
    function getInt64(dataView, index, littleEndian) {
        var highIndex, lowIndex;
        var MAX_INT = Math.pow(2, 53);
        if (littleEndian) {
            highIndex = 4;
            lowIndex = 0;
        } else {
            highIndex = 0;
            lowIndex = 4;
        }
        var high = dataView.getInt32(index + highIndex, littleEndian);
        var low = dataView.getInt32(index + lowIndex, littleEndian);
        var rv = low + pow2(32) * high;
        if (rv >= MAX_INT) {
            window.console.info("Int is bigger than JS can represent.");
            return Infinity;
        }
        return rv;
    }
    /**
     * @memberOf bluefile
     * @private
     */
    var _XM_TO_DATAVIEW = {
        'P': null,
        'A': null,
        'O': "getUint8",
        'B': "getInt8",
        'I': "getInt16",
        'L': "getInt32",
        'X': getInt64,
        'F': "getFloat32",
        'D': "getFloat64"
    };
    /**
     * @memberOf bluefile
     * @private
     */
    var _applySupportsTypedArray = true;
    try {
        var uintbuf = new Uint8Array(new ArrayBuffer(4));
        uintbuf[0] = 66;
        uintbuf[1] = 76;
        uintbuf[2] = 85;
        uintbuf[3] = 69;
        var test = String.fromCharCode.apply(null, uintbuf);
        if (test !== "BLUE") {
            _applySupportsTypedArray = false;
        }
    } catch (error) {
        _applySupportsTypedArray = false;
    }
    /**
     * Convert an ArrayBuffer to a string
     *
     * @private
     * @memberof bluefile
     * @param   {array}     buf         Data bffer
     */
    function ab2str(buf) {
        var uintbuf = new Uint8Array(buf);
        // Firefox 3.6 nor iOS devices can use ArrayBuffers with .apply
        if (_applySupportsTypedArray) {
            return String.fromCharCode.apply(null, uintbuf);
        } else {
            var str = "";
            for (var i = 0; i < uintbuf.length; i++) {
                str += String.fromCharCode(uintbuf[i]);
            }
            return str;
        }
    }
    /**
     * Convert a string to an ArrayBuffer
     *
     * @private
     * @memberof bluefile
     * @param   {string}
     */
    function str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
    /**
     * Calculate 2^n
     *
     * If 31 > n >= 0 then a left-shift is used, otherwise Math.pow is used.
     *
     * @private
     * @memberof bluefile
     * @param   {number}
     */
    function pow2(n) {
        return (n >= 0 && n < 31) ? (1 << n) : (pow2[n] || (pow2[n] = Math.pow(2, n)));
    }
    /**
     * Constructor for a BlueHeader that extracts paramters from the 512-byte
     * Bluefile binary header.  If the data segment of the bluefile is also
     * included in the provided buffer it will be accessible as well
     * via the dview property.
     *
     * @memberof bluefile
     * @param {array} buf
     *   - An existing ArrayBuffer of Bluefile data.
     * @param {Object} options
     *     - options that affect how the bluefile is read
     * @param {string} ["dict"] options.ext_header_type
     *     - if the BlueFile contains extended header keywords,
     *       extract them either as a dictionary ("dict", "json", 
     *       {}, "XMTable", "JSON", "DICT") or as a list of 
     *       key value pairs.  The extended header keywords
     *       will be accessible on the hdr.ext_header property
     *       after the file has been read.
     *
     * See http://nextmidas.techma.com/nm/nxm/sys/docs/MidasBlueFileFormat.pdf for
     * more details on header properties.
     *
     * @property {ArrayBuffer} buf
     * @property {String} version - the header version extracted from the file, always 'BLUE'
     * @property {String} headrep - endianness of header 'IEEE' or 'EEEI'
     * @property {String} datarep - endianness of data 'IEEE' or 'EEEI'
     * @property {Number} ext_start - byte offset for extended header binary data
     * @property {Number} ext_size - byte size for extended header data
     * @property {Number} type - the BLUEFILE type (1000 = 1-D data, 2000 = 2-D data)
     * @property {Number} class - the BLUEFILE class (i.e. type/1000)
     * @property {String} format - the BLUEFILE format, the format is a two character diagraph, such as SF.
     * @property {Number} timecode - absolute time reference for the file (in seconds since Jan 1st 1950)
     * @property {Number} xstart - relative offset for the first sample on the x-axis
     * @property {Number} xdelta - delta between points on the x-axis 
     * @property {Number} xunits - the unitcode for the x-axis (see m.UNITS)
     * @property {Number} ystart - relative offset for the first sample on the y-axis
     * @property {Number} ydelta - delta between points on the y-axis 
     * @property {Number} yunits - the unitcode for the y-axis (see m.UNITS)
     * @property {Number} subsize - the number of columns for a 2-D data file
     * @property {Number} data_start - byte offset for data
     * @property {Number} data_size - byte size for data
     * @property {Object} ext_header - extracted extended header keywords
     * @property {Number} spa - scalars per atom
     * @property {Number} bps - bytes per scalar
     * @property {Number} bpa - bytes per atom
     * @property {Number} ape - atoms per element
     * @property {Number} bpe - bytes per element
     * @property {Number} size - number of elements in dview
     * @property {DataView} dview - a Data
     */
    bluefile.BlueHeader = function(buf, options) {
        this.options = {
            ext_header_type: "dict"
        };
        common.update(this.options, options);
        this.buf = buf;
        if (this.buf != null) {
            var dvhdr = new DataView(this.buf);
            this.version = ab2str(this.buf.slice(0, 4));
            this.headrep = ab2str(this.buf.slice(4, 8));
            this.datarep = ab2str(this.buf.slice(8, 12));
            var littleEndianHdr = (this.headrep === "EEEI");
            var littleEndianData = (this.datarep === "EEEI");
            this.ext_start = dvhdr.getInt32(24, littleEndianHdr);
            this.ext_size = dvhdr.getInt32(28, littleEndianHdr);
            this.type = dvhdr.getUint32(48, littleEndianHdr);
            this["class"] = this.type / 1000;
            this.format = ab2str(this.buf.slice(52, 54));
            this.timecode = dvhdr.getFloat64(56, littleEndianHdr);
            // the adjunct starts at offset 0x100
            if (this["class"] === 1) {
                this.xstart = dvhdr.getFloat64(0x100, littleEndianHdr);
                this.xdelta = dvhdr.getFloat64(0x100 + 8, littleEndianHdr);
                this.xunits = dvhdr.getInt32(0x100 + 16, littleEndianHdr);
                this.yunits = dvhdr.getInt32(0x100 + 40, littleEndianHdr);
                this.subsize = 1;
            } else if (this["class"] === 2) {
                this.xstart = dvhdr.getFloat64(0x100, littleEndianHdr);
                this.xdelta = dvhdr.getFloat64(0x100 + 8, littleEndianHdr);
                this.xunits = dvhdr.getInt32(0x100 + 16, littleEndianHdr);
                this.subsize = dvhdr.getInt32(0x100 + 20, littleEndianHdr);
                this.ystart = dvhdr.getFloat64(0x100 + 24, littleEndianHdr);
                this.ydelta = dvhdr.getFloat64(0x100 + 32, littleEndianHdr);
                this.yunits = dvhdr.getInt32(0x100 + 40, littleEndianHdr);
            }
            this.data_start = dvhdr.getFloat64(32, littleEndianHdr);
            this.data_size = dvhdr.getFloat64(40, littleEndianHdr);
            var ds = this.data_start;
            var de = this.data_start + this.data_size;
            if (this.ext_size) {
                this.ext_header = this.unpack_keywords(this.buf, this.ext_size, this.ext_start * 512, littleEndianHdr);
            }
            this.setData(this.buf, ds, de, littleEndianData);
        }
    };

    bluefile.BlueHeader.prototype = {
        /**
         * Internal method that sets the dview up based off the
         * provided buffer and fields extracted from the header.
         *
         * @memberof bluefile
         * @private
         * @param   buf
         * @param   offset
         * @param   data_end
         * @param   littleEndian
         */
        setData: function(buf, offset, data_end, littleEndian) {
            if (this["class"] === 1) {
                this.spa = _SPA[this.format[0]];
                this.bps = _BPS[this.format[1]];
                this.bpa = this.spa * this.bps;
                this.ape = 1;
                this.bpe = this.ape * this.bpa;
            } else if (this["class"] === 2) {
                this.spa = _SPA[this.format[0]];
                this.bps = _BPS[this.format[1]];
                this.bpa = this.spa * this.bps;
                this.ape = this.subsize;
                this.bpe = this.ape * this.bpa;
            }
            if (littleEndian === undefined) {
                littleEndian = (ARRAY_BUFFER_ENDIANNESS === "LE");
            }
            // TODO handle mismatch between host and data endianness using arrayBufferEndianness
            if (ARRAY_BUFFER_ENDIANNESS === "LE" && !littleEndian) {
                throw ("Not supported " + ARRAY_BUFFER_ENDIANNESS + " " + littleEndian);
            } else if (ARRAY_BUFFER_ENDIANNESS === "BE" && this.littleEndianData) {
                throw ("Not supported " + ARRAY_BUFFER_ENDIANNESS + " " + littleEndian);
            }
            if (buf) {
                if ((offset) && (data_end)) {
                    this.dview = this.createArray(buf, offset, (data_end - offset) / this.bps);
                } else {
                    this.dview = this.createArray(buf);
                }
                this.size = this.dview.length / (this.spa * this.ape);
            } else {
                this.dview = this.createArray(null, null, this.size);
            }
        },
        /**
         * Internal method that unpacks the extended header keywords into
         * either a object (i.e. dictionary) or a list of key-value pairs
         * depending on this.options.ext_header_type.
         *
         * @author Sean Sullivan https://github.com/desean1625
         * @private
         * @memberof bluefile
         * @param   buf
         * @param   lbuf
         * @param   offset
         * @param   littleEndian
         */
        unpack_keywords: function(buf, lbuf, offset, littleEndian) {
            var lkey, lextra, ltag, format, tag, data, ldata, itag, idata;
            var keywords = [];
            var dic_index = {};
            var dict_keywords = {};
            var ii = 0;
            window.buf = buf;
            buf = buf.slice(offset, buf.byteLength);
            var dvhdr = new DataView(buf);
            buf = ab2str(buf);
            while (ii < lbuf) {
                idata = ii + 8;
                lkey = dvhdr.getUint32(ii, littleEndian);
                lextra = dvhdr.getInt16(ii + 4, littleEndian);
                ltag = dvhdr.getInt8(ii + 6, littleEndian);
                format = buf.slice(ii + 7, ii + 8);
                ldata = lkey - lextra;
                itag = idata + ldata;
                tag = buf.slice(itag, itag + ltag);
                if (format === "A") {
                    data = buf.slice(idata, idata + ldata);
                } else {
                    if (_XM_TO_DATAVIEW[format]) {
                        if (typeof _XM_TO_DATAVIEW[format] === "string") {
                            data = dvhdr[_XM_TO_DATAVIEW[format]](idata, littleEndian);
                        } else {
                            data = _XM_TO_DATAVIEW[format](dvhdr, idata, littleEndian);
                        }
                    } else {
                        //Should never get here now.
                        window.console.info("Unsupported keyword format " + format + " for tag " + tag);
                    }
                }
                if (typeof dic_index[tag] === "undefined") {
                    dic_index[tag] = 1;
                } else {
                    dic_index[tag]++;
                    tag = "" + tag + dic_index[tag]; //Force to string just incase the tag is interpreted as a number
                }
                dict_keywords[tag] = data;
                keywords.push({
                    tag: tag,
                    value: data
                });
                ii += lkey;
            }
            var dictTypes = ['dict', 'json', {}, 'XMTable', 'JSON', 'DICT'];
            for (var k in dictTypes) {
                if (dictTypes[k] === this.options.ext_header_type) {
                    return dict_keywords;
                }
            }
            return keywords;
        },
        /**
         * Internal method to create typed array for the data based on the
         * format extracted from the header.
         *
         * @private
         * @memberof bluefile
         * @param   buf
         * @param   offset
         * @param   length
         * @returns -
         */
        createArray: function(buf, offset, length) {
            var TypedArray = _XM_TO_TYPEDARRAY[this.format[1]];
            if (TypedArray === undefined) {
                throw ("unknown format " + this.format[1]);
            }
            // backwards compatibility with some implementations of typed array
            // requires this
            if (offset === undefined) {
                offset = 0;
            }
            if (length === undefined) {
                length = buf.length || (buf.byteLength / _BPS[this.format[1]]);
            }
            if (buf) {
                return new TypedArray(buf, offset, length);
            } else {
                return new TypedArray(length);
            }
        }
    };

    /**
     * Internal method to create a new anchor element and uses location
     * properties (inherent) to get the desired URL data. Some String
     * operations are used (to normalize results across browsers).
     *
     * @private
     * @memberof bluefile
     * @param   url
     * @returns -
     *
     * Based off http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
     */
    function parseURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [null, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [null, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    }
    /**
     * Internal method to convert text from an HTTP response
     * into an ArrayBuffer.
     *
     * @private
     * @memberof bluefile
     * @param   text
     * @param   oncomplete
     * @param   blocksize
     */
    function text2buffer(text, oncomplete, blocksize) {
        blocksize = blocksize || 1024;
        var i = 0;
        var arrayBuffer = new ArrayBuffer(text.length);
        var bufView = new Uint8Array(arrayBuffer);
        var worker = function() {
            var end = i + blocksize;
            for (; i < end; i++) {
                bufView[i] = (text.charCodeAt(i) & 0xff);
            }
            if (i >= text.length) {
                oncomplete(arrayBuffer);
            } else {
                setTimeout(worker, 0);
            }
        };
        setTimeout(worker, 0);
    }
    /**
     * Bluefile Reader constructor.
     *
     * @memberof bluefile
     * @param {Object} options
     *     - options that affect how the bluefile is read
     * @param {string} ["dict"] options.ext_header_type
     *     - if the BlueFile contains extended header keywords,
     *       extract them either as a dictionary ("dict", "json", 
     *       {}, "XMTable", "JSON", "DICT") or as a list of 
     *       key value pairs.  The extended header keywords
     *       will be accessible on the hdr.ext_header property
     *       after the file has been read.
     */
    bluefile.BlueFileReader = function(options) {
        this.options = options;
    };

    bluefile.BlueFileReader.prototype = {
        /**
         * @callback readCallback
         * @param {BlueHeader}
         *     - the extracted header, or null on failure
         */

        /**
         * Read only the header from a local Bluefile.
         *
         * @memberof bluefile
         * @param {File} theFile
         *     - a File object for the bluefile
         * @param {readCallback} onload
         *     - callback when the header has been read
         */
        readheader: function readheader(theFile, onload) {
            var that = this;
            var reader = new FileReader();
            var blob = theFile.webkitSlice(0, 512); // Chrome specific
            // Closure to capture the file information.
            reader.onloadend = (function(theFile) {
                return function(e) {
                    if (e.target.error) {
                        onload(null);
                        return;
                    }
                    var rawhdr = reader.result;
                    var hdr = new bluefile.BlueHeader(rawhdr, that.options);
                    hdr.file = theFile;
                    onload(hdr);
                };
            })(theFile);
            reader.readAsArrayBuffer(blob);
        },
        /**
         * Read a local Bluefile on disk.
         *
         * @memberof bluefile
         * @param {File} theFile
         *     - a File object for the bluefile
         * @param {readCallback} onload
         *     - callback when the header has been read
         */
        read: function read(theFile, onload) {
            var that = this;
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onloadend = (function(theFile) {
                return function(e) {
                    if (e.target.error) {
                        onload(null);
                        return;
                    }
                    var raw = reader.result;
                    var hdr = new bluefile.BlueHeader(raw, that.options);
                    hdr.file = theFile;
                    hdr.file_name = theFile.name;
                    onload(hdr);
                };
            })(theFile);
            reader.readAsArrayBuffer(theFile);
        },
        /**
         * Read a Bluefile from a URL
         *
         * @memberof bluefile
         * @param {string} href
         *     - the URL for the bluefile
         * @param {readCallback} onload
         *     - callback when the header has been read
         */
        read_http: function read_http(href, onload) {
            var that = this;
            var oReq = new XMLHttpRequest();
            oReq.open("GET", href, true);
            oReq.responseType = "arraybuffer";
            oReq.overrideMimeType('text\/plain; charset=x-user-defined');
            oReq.onload = function(oEvent) {
                if (oReq.readyState === 4) {
                    if ((oReq.status === 200) || (oReq.status === 0)) { // status = 0 is necessary for file URL
                        var arrayBuffer = null; // Note: not oReq.responseText
                        if (oReq.response) {
                            arrayBuffer = oReq.response;
                            var hdr = new bluefile.BlueHeader(arrayBuffer, that.options);
                            parseURL(href);
                            var fileUrl = parseURL(href);
                            hdr.file_name = fileUrl.file;
                            onload(hdr);
                        } else if (oReq.responseText) {
                            text2buffer(oReq.responseText, function(arrayBuffer) {
                                var hdr = new bluefile.BlueHeader(arrayBuffer, that.options);
                                parseURL(href);
                                var fileUrl = parseURL(href);
                                hdr.file_name = fileUrl.file;
                                onload(hdr);
                            });
                        }
                        return;
                    }
                }
                onload(null);
            };
            oReq.onerror = function(oEvent) {
                onload(null);
            };
            oReq.send(null);
        }
    };

    // Node: Export function
    module.exports = bluefile;

}());

},{"./common":4}],4:[function(require,module,exports){
/**
 * @license
 * File: common.js
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
 *
 */

/* global module */
/* global require */

(function() {

module.exports = {};

if (window.ArrayBuffer) {
    if (!ArrayBuffer.prototype.slice) {
        //Monkey Patching for iOS and early Firefox
        ArrayBuffer.prototype.slice = function(start, end) {
            var that = new Uint8Array(this);
            if (end === undefined) {
                end = that.length;
            }
            var result = new ArrayBuffer(end - start);
            var resultArray = new Uint8Array(result);
            for (var i = 0; i < resultArray.length; i++) {
                resultArray[i] = that[i + start];
            }
            return result;
        };
    }
}

//Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// Shim for requestAnimationFrame compatibility
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelAnimFrame = (function(callback) {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCanelAnimationFrame ||
        function(timeoutID) {
            window.clearTimeout(timeoutID);
    };
})();

// Handle various ways to draw dashed lines
module.exports.dashOn = function(ctx, on, off) {
    if (ctx.setLineDash) {
        ctx.setLineDash([on, off]);
        return true;
    } else if (ctx.mozDash !== undefined) { // Gecko 7.0+
        ctx.mozDash = [on, off];
        return true;
    } else if (ctx.webkitLineDash && ctx.webkitLineDash.length === 0) {
        ctx.webkitLineDash = [on, off];
        return true;
    }
    return false;
};

module.exports.dashOff = function(ctx) {
    if (ctx.setLineDash) {
        ctx.setLineDash([]);
    } else if (ctx.mozDash) { // Gecko 7.0+
        ctx.mozDash = null;
    } else if (ctx.webkitLineDash) {
        ctx.webkitLineDash = [];
    }
};

// Firefox behaves differntly for keypress events
module.exports.getKeyCode = function(e) {
    e = window.event || e;
    e = e.charCode || e.keyCode;
    return e;
};

module.exports.setKeypressHandler = function(handler) {
    if (window.addEventListener) { window.addEventListener('keypress', handler, false); }
    else if (window.attachEvent) {
        window.attachEvent('onkeypress', handler);
    }
};

// Array.isArray
// FF 4+
// IE 9+
// SF 5+
// http://kangax.github.io/es5-compat-table/#Array.isArray
if (!Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
}

if (!window.Float64Array) {
    //Monkey Patching for iOS
    // This is essentially ReadOnly because
    // if someone does x[i] = 5
    // the value will be set in the array
    // but not in the underlying buffer
    window.Float64Array = (function() {
        return window.Float64Array ||
            function(buffer, byteOffset, length) {
                if (!(buffer instanceof ArrayBuffer)) {
                    throw "Invalid type";
                }
                var dv = new DataView(buffer);
                var b = [];
                var maxlength = (buffer.byteLength - byteOffset) / 8;
                if (length === undefined) {
                    b.length = maxlength;
                } else {
                    b.length = Math.min(length, maxlength);
                }

                for (var i = 0; i < b.length; i++) {
                    b[i] = dv.getFloat64(i * 8 + byteOffset, true);
                }
                b.subarray = function(begin, end) {
                    return b.slice(begin, end);
                };
                return b;
        };
    })();
}

// Shims
(function() {
    /* console shim*/
    var f = function() {};
    if (!window.console) {
        window.console = {
            log: f,
            info: f,
            warn: f,
            debug: f,
            error: f
        };
    }

    // Firefox 4 has a glaring subarray bug
    // http://ryanberdeen.com/2011/04/16/firefox-subarray-bug.html
    if (new Int8Array([0, 1, 0]).subarray(1).subarray(1)[0]) {
        var subarray = function(begin, end) {
            if (arguments.length === 0) {
                begin = 0;
                end = this.length;
            } else {
                if (begin < 0) {
                    // relative to end
                    begin += this.length;
                }
                // clamp to 0, length
                begin = Math.max(0, Math.min(this.length, begin));
                if (arguments.length === 1) {
                    // slice to end
                    end = this.length;
                } else {
                    if (end < 0) {
                        // relative to end
                        end += this.length;
                    }
                    // clamp to begin, length
                    end = Math.max(begin, Math.min(this.length, end));
                }
            }

            var byteOffset = this.byteOffset + begin * this.BYTES_PER_ELEMENT;
            return new this.constructor(this.buffer, byteOffset, end - begin);
        };

        var typedArrays = [Int8Array, Uint8Array, Int16Array, Uint16Array,
            Int32Array, Uint32Array, Float32Array, Float64Array
        ];
        typedArrays.forEach(function(cls) {
            cls.prototype.subarray = subarray;
        });
    }

}());

// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel?redirectlocale=en-US&redirectslug=DOM%2FMozilla_event_reference%2Fwheel#Listening_to_this_event_across_browser
// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function(window, document) {

    var prefix = "",
        _addEventListener, onwheel, support;

    // detect event model
    if (window.addEventListener) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
    "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = function(elem, callback, useCapture) {
        _addWheelListener(elem, support, callback, useCapture);

        // handle MozMousePixelScroll in older Firefox
        if (support === "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
        }
    };

    /* jshint -W030 */
    function _addWheelListener(elem, eventName, callback, useCapture) {
        elem[_addEventListener](prefix + eventName, support === "wheel" ? callback : function(originalEvent) {
            !originalEvent && (originalEvent = window.event);

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type === "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support === "mousewheel") {
                event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);

        }, useCapture || false);
    }
    /* jshint +W030 */

})(window, document);

//Updates destenation object with source values
module.exports.update = function update(dst, src) {
    for (var prop in src) {
        var val = src[prop];
        if (typeof val === "object") { // recursive
            update(dst[prop], val);
        } else {
            dst[prop] = val;
        }
    }
    return dst; // return dst to allow method chaining
};

}());

},{}],5:[function(require,module,exports){
/**
 * @license
 * File: m.js
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

/* global module */
/* global require */

(function() {
    'use strict';

    var bluefile = require("./bluefile");
    var loglevel = require("loglevel");

    function m() {}

    m.log = loglevel;

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
        m.PointArray = Float32Array;
    } else {
        m.PointArray = Float64Array;
    }


    /** UNITS Structure:
     *		0: ["None", "U"],
     *		1: ["Time", "sec"],
     *		2: ["Delay", "sec"],
     *		3: ["Frequency", "Hz"],
     *		4: ["Time code format", ""],
     *		5: ["Distance", "m"],
     *		6: ["Speed", "m/s"],
     *		7: ["Acceleration", "m/sec^2"],
     *		8: ["Jerk", "m/sec^3"],
     *		9: ["Doppler", "Hz"],
     *		10: ["Doppler rate", "Hz/sec"],
     *		11: ["Energy", "J"],
     *		12: ["Power", "W"],
     *		13: ["Mass", "g"],
     *		14: ["Volume", "l"],
     *		15: ["Angular power density", "W/ster"],
     *		16: ["Integrated power density", "W/rad"],
     *		17: ["Spatial power density", "W/m^2"],
     *		18: ["Integrated power density", "W/m"],
     *		19: ["Spectral power density", "W/MHz"],
     *		20: ["Amplitude", "U"],
     *		21: ["Real", "U"],
     *		22: ["Imaginary", "U"],
     *		23: ["Phase", "rad"],
     *		24: ["Phase", "deg"],
     *		25: ["Phase", "cycles"],
     *		26: ["10*Log", "U"],
     *		27: ["20*Log", "U"],
     *		28: ["Magnitude", "U"],
     *		29: ["Unknown", "U"],
     *		30: ["Unknown", "U"],
     *		31: ["General dimensionless", ""],
     *		32: ["Counts", ""],
     *		33: ["Angle", "rad"],
     *		34: ["Angle", "deg"],
     *		35: ["Relative power", "dB"],
     *		36: ["Relative power", "dBm"],
     *		37: ["Relative power", "dBW"],
     *		38: ["Solid angle", "ster"],
     *		40: ["Distance", "ft"],
     *		41: ["Distance", "nmi"],
     *		42: ["Speed", "ft/sec"],
     *		43: ["Speed", "nmi/sec"],
     *		44: ["Speed", "knots=nmi/hr"],
     *		45: ["Acceleration", "ft/sec^2"],
     *		46: ["Acceleration", "nmi/sec^2"],
     *		47: ["Acceleration", "knots/sec"],
     *		48: ["Acceleration", "G"],
     *		49: ["Jerk", "G/sec"],
     *		50: ["Rotation", "rps"],
     *		51: ["Rotation", "rpm"],
     *		52: ["Angular velocity", "rad/sec"],
     *		53: ["Angular velocity", "deg/sec"],
     *		54: ["Angular acceleration", "rad/sec^2"],
     *		55: ["Angular acceleration", "deg/sec^2"],
     *		60: ["Latitude", "deg"],
     *		61: ["Longitude", "deg"],
     *		62: ["Altitude", "ft"],
     *		63: ["Altitude", "m"]
     * @global
     */
    var UNITS = {
        0: ["None", "U", true, true],
        1: ["Time", "sec", true, true],
        2: ["Delay", "sec", true, false],
        3: ["Frequency", "Hz", true, true],
        4: ["Time code format", "", true, false],
        5: ["Distance", "m", true, true],
        6: ["Speed", "m/s", true, true],
        7: ["Acceleration", "m/sec^2", true, true],
        8: ["Jerk", "m/sec^3", true, true],
        9: ["Doppler", "Hz", true, false],
        10: ["Doppler rate", "Hz/sec", true, true],
        11: ["Energy", "J", true, true],
        12: ["Power", "W", true, true],
        13: ["Mass", "g", true, true],
        14: ["Volume", "l", true, true],
        15: ["Angular power density", "W/ster", true, true],
        16: ["Integrated power density", "W/rad", true, true],
        17: ["Spatial power density", "W/m^2", true, true],
        18: ["Integrated power density", "W/m", false, true],
        19: ["Spectral power density", "W/MHz", true, true],
        20: ["Amplitude", "U", true, false],
        21: ["Real", "U", true, false],
        22: ["Imaginary", "U", true, false],
        23: ["Phase", "rad", true, true],
        24: ["Phase", "deg", false, true],
        25: ["Phase", "cycles", false, true],
        26: ["10*Log", "U", true, false],
        27: ["20*Log", "U", true, false],
        28: ["Magnitude", "U", true, false],
        29: ["Unknown", "U", true, false],
        30: ["Unknown", "U", false, false],
        31: ["General dimensionless", "", true, true],
        32: ["Counts", "", true, false],
        33: ["Angle", "rad", true, false],
        34: ["Angle", "deg", false, false],
        35: ["Relative power", "dB", true, true],
        36: ["Relative power", "dBm", false, true],
        37: ["Relative power", "dBW", false, true],
        38: ["Solid angle", "ster", true, true],
        40: ["Distance", "ft", false, true],
        41: ["Distance", "nmi", false, true],
        42: ["Speed", "ft/sec", false, true],
        43: ["Speed", "nmi/sec", false, true],
        44: ["Speed", "knots=nmi/hr", false, true],
        45: ["Acceleration", "ft/sec^2", false, true],
        46: ["Acceleration", "nmi/sec^2", false, true],
        47: ["Acceleration", "knots/sec", false, true],
        48: ["Acceleration", "G", false, true],
        49: ["Jerk", "G/sec", false, true],
        50: ["Rotation", "rps", true, false],
        51: ["Rotation", "rpm", false, false],
        52: ["Angular velocity", "rad/sec", true, true],
        53: ["Angular velocity", "deg/sec", false, true],
        54: ["Angular acceleration", "rad/sec^2", true, true],
        55: ["Angular acceleration", "deg/sec^2", false, true],
        60: ["Latitude", "deg", true, false],
        61: ["Longitude", "deg", true, false],
        62: ["Altitude", "ft", true, false],
        63: ["Altitude", "m", false, false]
    };

    m.UNITS = UNITS;

    /** Common structure
     * @private
     */
    m.Mc = {
        // Colormaps are stored as 7 element tables which are then
        //	interpolated to the number of colors actually used in a graphics routine
        //	call to MX$COLORMAP.

        // There are 4 colormap tables stored in the environment: A GREYSCALE,
        // COLORRAMP, COLORWHEEL, COLORSPECTRUM, or SUNSET.  The specific values that
        // are listed here are from xcolordef.prm (use the XCOLORMAP widget).
        //
        // The actual values are a result of tribal knowledge and years of experience
        colormap: [{
                name: "Greyscale",
                colors: [{
                    pos: 0,
                    red: 0,
                    green: 0,
                    blue: 0
                }, {
                    pos: 60,
                    red: 50,
                    green: 50,
                    blue: 50
                }, {
                    pos: 100,
                    red: 100,
                    green: 100,
                    blue: 100
                }, {
                    pos: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 0,
                    green: 0,
                    blue: 0
                }]
            }, {
                name: "Ramp Colormap",
                colors: [{
                    pos: 0,
                    red: 0,
                    green: 0,
                    blue: 15
                }, {
                    pos: 10,
                    red: 0,
                    green: 0,
                    blue: 50
                }, {
                    pos: 31,
                    red: 0,
                    green: 65,
                    blue: 75
                }, {
                    pos: 50,
                    red: 0,
                    green: 85,
                    blue: 0
                }, {
                    pos: 70,
                    red: 75,
                    green: 80,
                    blue: 0
                }, {
                    pos: 83,
                    red: 100,
                    green: 60,
                    blue: 0
                }, {
                    pos: 100,
                    red: 100,
                    green: 0,
                    blue: 0
                }]
            }, {
                name: "Color Wheel",
                colors: [{
                    pos: 0,
                    red: 100,
                    green: 100,
                    blue: 0
                }, {
                    pos: 20,
                    red: 0,
                    green: 80,
                    blue: 40
                }, {
                    pos: 30,
                    red: 0,
                    green: 100,
                    blue: 100
                }, {
                    pos: 50,
                    red: 10,
                    green: 10,
                    blue: 0
                }, {
                    pos: 65,
                    red: 100,
                    green: 0,
                    blue: 0
                }, {
                    pos: 88,
                    red: 100,
                    green: 40,
                    blue: 0
                }, {
                    pos: 100,
                    red: 100,
                    green: 100,
                    blue: 0
                }]
            }, {
                name: "Spectrum",
                colors: [{
                    pos: 0,
                    red: 0,
                    green: 75,
                    blue: 0
                }, {
                    pos: 22,
                    red: 0,
                    green: 90,
                    blue: 90
                }, {
                    pos: 37,
                    red: 0,
                    green: 0,
                    blue: 85
                }, {
                    pos: 49,
                    red: 90,
                    green: 0,
                    blue: 85
                }, {
                    pos: 68,
                    red: 90,
                    green: 0,
                    blue: 0
                }, {
                    pos: 80,
                    red: 90,
                    green: 90,
                    blue: 0
                }, {
                    pos: 100,
                    red: 95,
                    green: 95,
                    blue: 95
                }]
            }, {
                name: "calewhite",
                colors: [{
                    pos: 0,
                    red: 100,
                    green: 100,
                    blue: 100
                }, {
                    pos: 16.666,
                    red: 0,
                    green: 0,
                    blue: 100
                }, {
                    pos: 33.333,
                    red: 0,
                    green: 100,
                    blue: 100
                }, {
                    pos: 50,
                    red: 0,
                    green: 100,
                    blue: 0
                }, {
                    pos: 66.666,
                    red: 100,
                    green: 100,
                    blue: 0
                }, {
                    pos: 83.333,
                    red: 100,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 100,
                    green: 0,
                    blue: 100
                }]
            }, {
                name: "HotDesat",
                colors: [{
                    pos: 0,
                    red: 27.84,
                    green: 27.84,
                    blue: 85.88
                }, {
                    pos: 14.2857,
                    red: 0,
                    green: 0,
                    blue: 35.69
                }, {
                    pos: 28.571,
                    red: 0,
                    green: 100,
                    blue: 100
                }, {
                    pos: 42.857,
                    red: 0,
                    green: 49.8,
                    blue: 0
                }, {
                    pos: 57.14286,
                    red: 100,
                    green: 100,
                    blue: 0
                }, {
                    pos: 71.42857,
                    red: 100,
                    green: 37.65,
                    blue: 0
                }, {
                    pos: 85.7143,
                    red: 41.96,
                    green: 0,
                    blue: 0
                }, {
                    pos: 100,
                    red: 87.84,
                    green: 29.8,
                    blue: 29.8
                }]
            }, {
                name: "Sunset",
                colors: [{
                    pos: 0,
                    red: 10,
                    green: 0,
                    blue: 23
                }, {
                    pos: 18,
                    red: 34,
                    green: 0,
                    blue: 60
                }, {
                    pos: 36,
                    red: 58,
                    green: 20,
                    blue: 47
                }, {
                    pos: 55,
                    red: 74,
                    green: 20,
                    blue: 28
                }, {
                    pos: 72,
                    red: 90,
                    green: 43,
                    blue: 0
                }, {
                    pos: 87,
                    red: 100,
                    green: 72,
                    blue: 0
                }, {
                    pos: 100,
                    red: 100,
                    green: 100,
                    blue: 76
                }]
            },
            {
                name: "Hot",
                colors: ["#000000", "#7f0000", "#b30000", "#d7301f", "#ef6548", "#fc8d59", "#fdbb84", "#fdd49e", "#fee8c8", "#fff7ec", "#ffffff"]
            }, {
                name: "Cold",
                colors: ["#000000", "#023858", "#045a8d", "#0570b0", "#3690c0", "#74a9cf", "#a6bddb", "#d0d1e6", "#ece7f2", "#fff7fb", "#ffffff"]
            },
            {
                name: "Purple",
                colors: ["#230022", "#4d004b", "#810f7c", "#88419d", "#8c6bb1", "#8c96c6", "#9ebcda", "#bfd3e6", "#e0ecf4", "#f7fcfd"]
            }, {
                name: "BuGn",
                colors: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b']
            }, {
                name: "YlOrBr",
                colors: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506']
            }, {
                name: "YlGnBu",
                colors: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']
            }, {
                name: "YlOrRd",
                colors: ["#000000", "#662506", "#993404", "#cc4c02", "#ec7014", "#fe9929", "#fec44f", "#fee391", "#fff7bc", "#ffffe5", "#ffffff"]
            }, {
                name: "GreyNRed",
                colors: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'].reverse()
            }
        ]
    };

    /** Pipe Size
     * @private
     */
    m.PIPESIZE = 1024 * 1024;

    /**
     * Converts unit strings to number code
     * @param	{string}	unitInput	User unit input
     */
    m.unit_lookup = function(unitInput) {
        for (var i = 0; i < 64; i++) {
            var u;
            if (UNITS[i] === undefined) {
                u = UNITS[0];
            } else {
                u = UNITS[i];
            }
            var first = u[0];
            var second = u[1];
            var comparer1 = u[0] + " " + u[1];
            var comparer2 = u[0] + "_" + u[1];
            if (unitInput === first) {
                if (u[2]) {
                    return i;
                }
            } else if (unitInput === second) {
                if (u[3]) {
                    return i;
                }
            } else if ((unitInput === comparer1) || (unitInput === comparer2)) {
                return i;
            }
        }
        return unitInput;
    };

    /**
     * Creates new file with header initialized to type-1000 defaults
     * and data appended. (tbd)
     * @param	{string}	filename	Name of File to Create
     * @param  	{array}		data		Input data buffer
     * @param  	{array}	  	overrides	List of fields/values to be overridden in the bluefile header
     * @return 	{header} 	hcb		Return <hcb> type-1000 bluefile header, filename=null
     */
    m.initialize = function(data, overrides) {
        var hcb = new bluefile.BlueHeader(null);

        hcb.version = 'BLUE';
        hcb.size = 0;
        hcb.type = 1000;
        hcb.format = 'SF';
        hcb.timecode = 0.0;
        hcb.xstart = 0.0;
        hcb.xdelta = 1.0;
        hcb.xunits = 0;
        hcb.subsize = 1;
        hcb.ystart = 0.0;
        hcb.ydelta = 1.0;
        hcb.yunits = 0;
        hcb.enabled_streaming_pcut = false;

        if (!overrides) { /* if no overrides provided...set it to empty*/
            overrides = {};
        }

        for (var field in overrides) {
            hcb[field] = overrides[field];
        }

        //Convert xunits and yunits to numbers if they are strings
        hcb["xunits"] = m.unit_lookup(hcb["xunits"]);
        hcb["yunits"] = m.unit_lookup(hcb["yunits"]);


        // Force type 2000 is subsize is specified
        if (hcb["subsize"] > 1) {
            hcb.type = 2000;
        }
        hcb["class"] = hcb.type / 1000;
        // If this is a type 2000 , subsize *must* be provided
        if ((hcb["class"] === 2) && (overrides["subsize"] === undefined)) {
            throw "subsize must be provided with type 2000 files";
        }


        if (!overrides.pipe) {
            hcb.setData(data);
        } else {
            hcb.pipe = true;
            hcb.in_byte = 0;
            hcb.out_byte = 0;
            // TODO round pipe size to nearest number of elements
            var pipesize = overrides.pipesize || m.PIPESIZE;

            hcb.buf = new ArrayBuffer(pipesize);
            hcb.setData(hcb.buf);
            hcb.data_free = hcb.dview.length;
        }

        return hcb;
    };

    /**
     * Convert type-2000 header internals to force GRAB and FILAD routines to treat file as a 1000-type file.
     * @param	{header}	hcb		Bluefile header control block
     */
    m.force1000 = function(hcb) {
        if (hcb["class"] === 2) {
            if ((hcb.size) && (!hcb.pipe)) {
                hcb.size = hcb.subsize * hcb.size;
            } else {
                // assume the size is 0
                hcb.size = 0;
            }
            hcb.bpe = hcb.bpe / hcb.subsize;
            hcb.ape = 1;
        }
    };

    /**
     * Get data from file at specified start location.
     * @param	{header}	hcb		Bluefile header control block
     * @param	{array}		bufview		Data buffer to receive data
     * @param	{number}	start		Start location
     * @param	{number}	nget		Number of requested data
     * @return	{number}	ngot		Number of received data
     */
    m.grab = function(hcb, bufview, start, nget) {
        if (!hcb.dview) {
            return 0;
        }

        // TODO reformat
        if (hcb.format[0] === 'C') {
            start = start * 2;
        }

        nget = hcb.ape * nget; // TODO - this is never used????

        //var ngot = Math.min(bufview.length, (hcb.dview.length-start)); //mmm
        var ngot = Math.min(bufview.length, (hcb.dview.length - start));
        // iOS doesn't have .set on TypedArrays
        if (bufview.set === undefined) {
            for (var i = 0; i < ngot; i++) {
                bufview[i] = hcb.dview[start + i];
            }
        } else {
            bufview.set(hcb.dview.subarray(start, start + ngot));
        }
        if (hcb.format[0] === 'C') {
            ngot = ngot / 2;
        }
        return ngot;
    };

    /**
     * Append data buffer to file specified in the bluefile header control block.
     * @param	{header}	hcb		Bluefile header control block
     * @param	{array}		data		Data buffer
     * @param   {boolean}       [sync=false]    dispatch onpipewrite syncronously
     */
    m.filad = function(hcb, data, sync) {
        if (hcb.data_free < data.length) {
            throw "Pipe full";
        }
        var sidx = hcb.in_byte / hcb.dview.BYTES_PER_ELEMENT;
        var eidx = (sidx + data.length);
        if (eidx > hcb.dview.length) {
            var head = hcb.dview.length - sidx;
            var tail = data.length - head;
            if (data.subarray) {
                hcb.dview.set(data.subarray(0, head), sidx);
                hcb.dview.set(data.subarray(head, data.length), 0);
            } else {
                hcb.dview.set(data.slice(0, head), sidx);
                hcb.dview.set(data.slice(head, data.length), 0);
            }
            hcb.in_byte = (tail * hcb.dview.BYTES_PER_ELEMENT);
        } else {
            hcb.dview.set(data, sidx);
            hcb.in_byte = (eidx * hcb.dview.BYTES_PER_ELEMENT) % hcb.buf.byteLength;
        }
        hcb.data_free -= data.length;
        if (hcb.onwritelisteners) {
            for (var i = 0; i < hcb.onwritelisteners.length; i++) {
                if (!sync) {
                    window.setTimeout(hcb.onwritelisteners[i], 0);
                } else {
                    hcb.onwritelisteners[i]();
                }
            }
        }
    };

    /**
     * @param	{header}	hcb		Bluefile header control block
     * @return	{number}	elements available
     * @private
     */
    m.pavail = function(hcb) {
        return hcb.dview.length - hcb.data_free;
    };

    /**
     * Get data from file in dataflow fashion.
     * @param	{array}		hcb	Bluefile header control block
     * @param 	{array}		dview	Data buffer to receive data
     * @param	{number}	nget	Input variable name of parameter to receive data
     * @param	{number}	offset	Offset into file
     * @return	{number}	ngot	Number of data values gotten
     */
    // WARNING - nget is number of scalars...which differs from the normal API
    m.grabx = function(hcb, dview, nget, offset) {
        var navail = hcb.dview.length - hcb.data_free;
        if (offset === undefined) {
            offset = 0;
        }
        if (!nget) {
            nget = Math.min(dview.length - offset, navail);
        } else if (nget > dview.length - offset) {
            throw "m.grabx : nget larger then available buffer space";
        }
        if (nget < 0) {
            throw "m.grabx : nget cannot be negative";
        }
        if (nget > navail) {
            return 0;
        }

        var sidx = hcb.out_byte / hcb.dview.BYTES_PER_ELEMENT;
        var eidx = (sidx + nget);
        if (eidx >= hcb.dview.length) {
            var head = hcb.dview.length - sidx;
            eidx = eidx - hcb.dview.length;
            dview.set(hcb.dview.subarray(sidx, hcb.dview.length), offset);
            dview.set(hcb.dview.subarray(0, eidx), offset + head);
        } else {
            dview.set(hcb.dview.subarray(sidx, eidx), offset);
        }
        hcb.out_byte = (eidx * hcb.dview.BYTES_PER_ELEMENT) % hcb.buf.byteLength;
        hcb.data_free += nget;
        var ngot = nget;
        return ngot;
    };


    /**
     * @param	{header}	hcb		Bluefile header control block
     * @param	{number}	onwrite		-
     * @private
     */
    m.addPipeWriteListener = function(hcb, onwrite) {
        if (!hcb.onwritelisteners) {
            hcb.onwritelisteners = [];
        }
        if (hcb.onwritelisteners.indexOf(onwrite) === -1) {
            hcb.onwritelisteners.push(onwrite);
        }
    };

    /**
     * Returns ASCII description of units code
     * @param 	{number}	UNITS array index (see global UNITS)
     * @return 	{string}	ASCII code pair
     */
    // ~= M$UNITS_NAME
    m.units_name = function(units) {
        var u = UNITS[units];
        return u[0] + " (" + u[1] + ")";
    };

    /**
     * Extract filename from full path
     * @param 	{string}	pathfilename	Full path, including filename
     * @return	{string}	filename	    Trimmed filename
     */
    m.trim_name = function(pathfilename) {
        var i = pathfilename.indexOf(']');
        if (i === -1) {
            i = pathfilename.indexOf('/');
        }
        if (i === -1) {
            i = pathfilename.indexOf(':');
        }
        var j = pathfilename.substr(i + 1, pathfilename.length).indexOf('.');
        if (j < 0) {
            j = pathfilename.length - i;
        }
        var filename = pathfilename.substr(i + 1, i + j + 1);
        return filename;
    };

    /**
     * Takes an integer code for units and a multiplier and returns the string representation of the two.
     * Example: l = m.label(1,1.0e3) ==> l =  Time (Ksec)
     * @param 	{number}	units	Integer code for Unit (see global UNITS)
     * @param 	{number} 	mult	Units multiplier (i.e 1.0e3 ==> 'K')
     * @return {string} representation of units and multiplier
     */
    // ~= M$LABEL
    m.label = function(units, mult) {
        var u = ["Unknown", "U"];

        if (typeof units === "string") {
            u = [units, null];
        } else if (Array.isArray(units)) {
            u = units;
        } else {
            u = UNITS[units];
            if (u === undefined) {
                u = ["Unknown", "U"];
            }
        }

        var prefix = m.mult_prefix(mult);

        if (u[1]) {
            return u[0] + " (" + prefix + u[1] + ")";
        } else {
            return u[0];
        }
    };

    /**
     * @method bound
     * @param a
     * @param b
     * @param c
     */
    m.bound = function(a, b, c) {
        return a < b ? b : (a > c ? c : a);
    };

    m.touch_distance = function(touchA, touchB) {
        var xd = (touchA.pageX - touchB.pageX);
        var yd = (touchA.pageY - touchB.pageY);
        return Math.sqrt((xd * xd) + (yd * yd));
    };

    m.mult_prefix = function(mult) {
        var prefix = "?";

        /* jshint -W116 */
        if (mult == 1) {
            prefix = "";
        } else if (mult == 10) {
            prefix = 'da';
        } else if (mult == 0.1) {
            prefix = 'd';
        } else if (mult == 100) {
            prefix = 'h';
        } else if (mult == 0.01) {
            prefix = 'c';
        } else if (mult == 1.0e3) {
            prefix = 'K';
        } else if (mult == 1.0e-3) {
            prefix = 'm';
        } else if (mult == 1.0e6) {
            prefix = 'M';
        } else if (mult == 1.0e-6) {
            prefix = 'u';
        } else if (mult == 1.0e9) {
            prefix = 'G';
        } else if (mult == 1.0e-9) {
            prefix = 'n';
        } else if (mult == 1.0e12) {
            prefix = 'T';
        } else if (mult == 1.0e-12) {
            prefix = 'p';
        }
        /* jshint +W116 */

        return prefix;
    };

    /**
     * @private
     */
    var VECTOR = {
        MV: 'F', // vector type
        MS: 'F', // scalar type...not really necessary in javascript
        nbpt: 4,
        view: undefined
    };


    /**
     * Sets data type for all subsequent calls to vector libraries.  Remains in effect until another call to this routine.
     * @param ctype
     */
    // ~= VSTYPE - not really necessary
    m.vstype = function(ctype) {
        VECTOR.MS = ctype;
        VECTOR.MV = ctype;
        if (VECTOR.MV === 'D') {
            VECTOR.nbpt = 8;
        } else if ((VECTOR.MV === 'L') || (VECTOR.MV === 'F')) {
            VECTOR.nbpt = 4;
        } else if (VECTOR.MV === 'I') {
            VECTOR.nbpt = 2;
        } else if (VECTOR.MV === 'B') {
            VECTOR.nbpt = 1;
        } else {
            alert("Unsupported vector type");
        }
    };

    m.log10 = function(v, lo_thresh) {
        if (lo_thresh === undefined) {
            lo_thresh = 1.0e-20;
        }
        return Math.log(Math.max(v, lo_thresh)) / Math.log(10);
    };

    /**
     * For each vector element in <src>, determine the max of <src> element and <lo_thresh>, returns the log(base10) of that value in <dst>
     * @param	{array}		src		Input vector.
     * @param 	{number} 	lo_thresh	User-set minimum log threshold (if not defined, set default=1.0e-20). Prevent computing log of 0 or negative values.
     * @param 	{array}		dst		Ouput vector.  If undefined, <src> elements will be overwritten.
     */
    // ~= M$VLOG10- not really necessary
    m.vlog10 = function(src, lo_thresh, dst) {
        if (lo_thresh === undefined) {
            lo_thresh = 1.0e-20;
        }
        if (dst === undefined) {
            dst = src;
        }
        for (var i = 0; i < src.length; i++) {
            if (dst.length <= i) {
                break;
            }
            dst[i] = Math.log(Math.max(src[i], lo_thresh)) / Math.log(10);
        }
    };

    /**
     * Same as vlog10 but multiply each output value by a scale factor <dbscale>.
     * @param 	{array}		src		Input vector.
     * @param 	{number}	lo_thresh	User-set minimum log threshold.
     *                                              If undefined, defaults to 1.0e-20. Prevent computing log of 0 or negative values.
     * @param 	{number}	dbscale		Output scale factor. If undefined, defaults to 1.
     * @param 	{array}		dst		Output vector. If undefined, <src> elements will be overwritten.
     * @private
     */
    m.vlogscale = function(src, lo_thresh, dbscale, dst) {
        if (lo_thresh === undefined) {
            lo_thresh = 1.0e-20;
        }
        if (dbscale === undefined) {
            dbscale = 1;
        }
        if (dst === undefined) {
            dst = src;
        }
        for (var i = 0; i < src.length; i++) {
            if (dst.length <= i) {
                break;
            }
            dst[i] = Math.log(Math.abs(Math.max(src[i], lo_thresh))) / Math.log(10);
            dst[i] = dst[i] * dbscale;
        }
    };

    /**
     * Same as vlogscale but computes magnitude squared.
     *
     * @param 	{array}		src		Input vector.
     * @param 	{number}	lo_thresh	User-set minimum log threshold.
     *                                              If undefined, defaults to 1.0e-20. Prevent computing log of 0 or negative values.
     * @param 	{number}	dbscale		Output scale factor. If undefined, defaults to 1.
     * @param 	{array}		dst		Output vector. If undefined, <src> elements will be overwritten.
     * @private
     */
    m.cvmag2logscale = function(src, lo_thresh, dbscale, dst) {
        if (lo_thresh === undefined) {
            lo_thresh = 1.0e-20;
        }
        if (dbscale === undefined) {
            dbscale = 1;
        }
        if (dst === undefined) {
            dst = src;
        }
        var j = 0;
        for (var i = 0; i < dst.length; i++) {
            j = 2 * i + 1;
            if (j >= src.length) {
                break;
            }
            dst[i] = (src[j - 1] * src[j - 1]) + (src[j] * src[j]);
            dst[i] = Math.log(Math.abs(Math.max(dst[i], lo_thresh))) / Math.log(10);
            dst[i] = dst[i] * dbscale;
        }
    };

    /**
     * Multiply <count> elements of <src> by <mul>, store results in <dst>
     * @param	{array} 	src		Input vector.
     * @param	{number}	mul		Vector multiplier.
     * @param	{array}		dst		Output vector. If not defined, <src> elements will be overwritten.
     * @param	{number}	count		Number of elements to apply multiplier, starting with first <src> element.
     */
    // ~= M$VSMUL
    m.vsmul = function(src, mul, dst, count) {
        if (dst === undefined) {
            dst = src;
        }
        if (count === undefined) {
            count = dst.length;
        }
        count = Math.min(dst.length, count);
        count = Math.min(src.length, count);

        for (var i = 0; i < count; i++) {
            if (dst.length <= i) {
                break;
            }
            dst[i] = src[i] * mul;
        }
    };

    /**
     * Finds max and min values in vector <vec> and returns values.
     * @param 	{array}		vec		Input vector.
     * @param	{number}	size		Number of elements to search to find max.min values.
     * @return 	{array}		mxmin		Index and value of min and max elements in <vec>.
     */
    // ~= M$VMXMN
    m.vmxmn = function(vec, size) {
        // Originally this code used an object to hold the values
        // but Chrome 34.0.1847.131 seemed to have a bug where
        // these values would somehow get messed up...oddly
        // putting printouts or breakpoints prevented the
        // problem from showing up.
        var smax = vec[0];
        var smin = vec[0];
        var imax = 0;
        var imin = 0;
        size = Math.min(size, vec.length);
        for (var i = 0; i < size; i++) {
            if (vec[i] > smax) {
                smax = vec[i];
                imax = i;
            }
            if (vec[i] < smin) {
                smin = vec[i];
                imin = i;
            }
        }
        return {
            smax: smax,
            smin: smin,
            imax: imax,
            imin: imin
        };
    };

    /**
     * Move <count> elements from <src> to <dest>.  Stride is the distance between each array element in either or both the input and output vectors.
     * @param {array}	src		Input vector.
     * @param {number}	sstride		Input stride.
     * @param {array}	dest		Output vector.
     * @param {number}	dstride		Output stride.
     * @param {number}	count		Number of input vector elements to move, starting with 0th element of <vec>. Cannot exceed vector lengths,
     *					taking into account the strides.
     */
    m.vmov = function(src, sstride, dest, dstride, count) {
        if (count === undefined) {
            count = src.length;
        }
        count = Math.min(src.length, count);
        //count = Math.min(src.length, count, (count)*(dest.length)*(dstride)); //mmm-TODO

        for (var i = 0; i < count; i++) {
            var s = i * sstride;
            var d = i * dstride;
            if (s >= src.length) {
                break;
            }
            if (d >= dest.length) {
                break;
            }
            dest[d] = src[s];
        }
    };

    /**
     * Initialize <count> consecutive elements of input vector <vec> with value <inpval>.
     * @param	{array}		vec		Input vector
     * @param	{number}	inpval		Value
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <vec>.  If undefined, entire <vec> is written.
     */
    // ~= M$VFILL
    // TODO - more optimal version?
    m.vfill = function(vec, inpval, count) {
        if (count === undefined) {
            count = vec.length;
        }
        count = Math.min(vec.length, count);
        for (var i = 0; i < count; i++) {
            vec[i] = inpval;
        }
    };

    /**
     * Compute the absolute value of <count> elements in <vec> and write to output vector <dest>
     * @param 	{array}		vec		Input vector.
     * @param 	{array}		dest		Ouput vector. If <dest> is undefined, overwrite input vector <vec>.
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <vec>. Cannot exceed vector lengths.
     */
    m.vabs = function(vec, dest, count) {
        if (count === undefined) {
            count = vec.length;
        }
        if (dest === undefined) {
            dest = vec;
        }
        //count = Math.min(dest.length, count, vec.length); //mmm-TODO
        for (var i = 0; i < count; i++) {
            dest[i] = Math.abs(vec[i]);
        }
    };


    /**
     * Computes the magnitude of <count> complex vector <cxvec> elements. Store results in output vector <dest>.
     * @param	{array}		cxvec		Input vector
     * @param 	{array}		dest		Output vector
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <cxvec>. Cannot exceed vector lengths.  If undefined, defaults to output vector <dest> length.
     */
    // ~= M$CVMAG
    m.cvmag = function(cxvec, dest, count) {
        if (count === undefined) {
            count = dest.length;
        }
        count = Math.min(dest.length, count);
        //count = Math.min(dest.length, count, cxvec.length); //mmm-TODO

        for (var i = 0; i < count; i++) {
            var j = 2 * i + 1;
            if (j >= cxvec.length) {
                break;
            }
            dest[i] = Math.sqrt((cxvec[j - 1] * cxvec[j - 1]) + (cxvec[j] * cxvec[j]));
        }
    };

    /**
     * Computes the magnitude squared of <count> complex vector <cxvec> elements. Store results in output vector <dest>.
     * @param	{array}		cxvec		Input vector
     * @param 	{array}		dest		Output vector
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <cxvec>. Cannot exceed vector lengths.  If undefined, defaults to output vector <dest> length.
     */
    // ~= M$CVMAG2
    m.cvmag2 = function(cxvec, dest, count) {
        if (count === undefined) {
            count = dest.length;
        }
        count = Math.min(dest.length, count);
        //count = Math.min(dest.length, count, cxvec.length); //mmm-TODO

        var j = 0;
        for (var i = 0; i < count; i++) {
            j = 2 * i + 1;
            if (j >= cxvec.length) {
                break;
            }
            dest[i] = (cxvec[j - 1] * cxvec[j - 1]) + (cxvec[j] * cxvec[j]);
        }
    };

    /**
     * Computes phase in radians of <count> complex vector <cxvec> elements. Store results in output vector <dest>.
     * @param	{array}		cxvec		Input vector
     * @param 	{array}		dest		Output vector
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <cxvec>. Cannot exceed vector lengths.  If undefined, defaults to output vector <dest> length.
     */
    // ~= M$CVPHA
    m.cvpha = function(cxvec, dest, count) {
        if (count === undefined) {
            count = dest.length;
        }
        count = Math.min(dest.length, count);
        //count = Math.min(dest.length, count, cxvec.length); //mmm-TODO

        var j = 0;
        var re = 0;
        var im = 0;
        for (var i = 0; i < count; i++) {
            j = 2 * i + 1;
            if (j >= cxvec.length) {
                break;
            }
            re = cxvec[j - 1];
            im = cxvec[j];
            if ((re === 0.0) && (im === 0.0)) {
                re = 1.0;
            }
            dest[i] = Math.atan2(im, re);
        }
    };

    /**
     * Computes the phase in degrees of <count> complex vector <cxvec> elements. Store results in output vector <dest>.
     * @param	{array}		cxvec		Input vector
     * @param 	{array}		dest		Output vector
     * @param 	{number}	count		Number of elements to write, starting with 0th element of <cxvec>. Cannot exceed vector lengths.  If undefined, defaults to output vector <dest> length.
     */
    // ~= M$CVPHAD
    m.cvphad = function(cxvec, dest, count) {
        if (count === undefined) {
            count = dest.length;
        }
        count = Math.min(dest.length, count);

        var j = 0;
        var re = 0;
        var im = 0;
        for (var i = 0; i < count; i++) {
            j = 2 * i + 1;
            if (j >= cxvec.length) {
                break;
            }
            re = cxvec[j - 1];
            im = cxvec[j];
            if ((re === 0.0) && (im === 0.0)) {
                re = 1.0;
            }
            dest[i] = Math.atan2(im, re) * (180.0 / Math.PI);
        }
    };

    /**
     * @param n
     * @private
     */
    // ~= INT(), DINT
    m.trunc = function(n) {
        return n - n % 1;
    };

    /**
     * @param a1
     * @param a2
     * @private
     */
    // Transfer of sign function from Fortran
    m.sign = function(a1, a2) {
        if (a2 >= 0) {
            return Math.abs(a1);
        } else {
            return -Math.abs(a1);
        }
    };

    /**
     * @method pad2
     * @param number
     * @private
     */

    function pad2(number) {
        return (number < 10 ? '0' : '') + number;
    }

    /**
     * Convert J1950 time or seconds-since-Epoch (midnight Dec-31-1949) to time-of-day. Fractional seconds accurate to milliseconds.
     * @param 	{number}	sec		Number of seconds.
     * @return	{string}	tod		Time of day
     */

    /* Output string can be in different forms as follows:
     * -31536000 <  sec < 0                   -DDD::HH:MM:SS
     *         0 <= sec < 86400                     HH:MM:SS
     *         86400 <= sec < 31536000         DDD::HH:MM:SS
     *         31536000 <=sec            YYYY:MM:DD:HH:MM:SS.<FFFFFF>
     *                                    where FFFFFF is in microseconds
     *
     */

    m.sec2tod = function(sec, trim_trailing_zeros) {
        var tod = "";
        var j1950 = Date.UTC(1950, 0, 1); //From 1950 to 1970
        var j1950Date = new Date(j1950); //debug var
        var j1949 = Date.UTC(1949, 11, 31);
        var j1949Date = new Date(j1949); //debug var
        var d = new Date();
        var midnightToday = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        var diffDaySecs = 86400; //    86400 secs = 24*60*60
        var diffYearSecs = 31536000; // 31536000 secs = 365*24*60*60
        var negDiffYearSecs = -1 * diffYearSecs; //-31536000 secs

        if (sec >= 0) {
            if (sec < diffDaySecs) {
                // hh:mm:ss
                var millisecs = midnightToday.getTime() + (sec * 1000);
                var d = new Date(millisecs);
                tod = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
            } else if (sec === 86400) {
                tod = "24:00:00";
            } else if (sec < diffYearSecs) {
                // ddd:hh:mm:ss
                var days = sec / diffDaySecs;
                days = [days > 0 ? Math.floor(days) : Math.ceil(days)];
                var d = new Date((sec * 1000) + midnightToday.getTime());
                tod = days.toString() + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
            } else {
                // convert to j1950
                var secMilli = Math.floor(sec * 1000) + j1950;
                d = new Date(secMilli);
                tod = d.getUTCFullYear() + ":" + pad2(d.getUTCMonth() + 1) + ":" + pad2(d.getUTCDate()) + "::" +
                    pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds());
            }
        } else {
            if (sec > negDiffYearSecs) {
                // -ddd:hh:mm:ss
                var days = sec / diffDaySecs;
                days = (days <= 0) ? Math.ceil(days) : Math.floor(days);
                var d = new Date(Math.abs(sec * 1000) + midnightToday.getTime());
                if (days === 0) {
                    days = "-0";
                } else {
                    days = days.toString();
                }
                tod = days + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
            } else {
                // convert to j1950
                var secMilli = Math.floor(sec * 1000) + j1950;
                d = new Date(secMilli);
                tod = d.getUTCFullYear() + ":" + pad2(d.getUTCMonth() + 1) + ":" + pad2(d.getUTCDate()) + "::" +
                    pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds());
            }
        }

        // violate legacy behavior, include full precision always
        // even if we are on a full second boundary, otherwise
        // on rising/falling rasters it can look like the display
        // is flickering
        var fractional = (sec % 1);
        if (fractional === 0.0) {
            tod += ".000000";
        } else {
            tod += "." + Math.abs(sec % 1).toPrecision(6).slice(2, 8);
        }

        if (trim_trailing_zeros) {
            var dloc = tod.indexOf(".");
            var zloc = -1;
            // If there is a 'decimal point'
            if (dloc !== -1) {
                zloc = tod.substr(dloc, tod.length).indexOf("0");
            }
            if (zloc !== -1) {
                tod = tod.substr(0, dloc + zloc);
            }
        }
        return tod;

    };

    /**
     * The offset to convert midnight Jan 1st 1970 to
     * midnight Jan 1st 1950.
     *
     * @private
     */
    var j1950offset = (20.0 * 365.0 + 5.0) * (24 * 3600);

    /**
     * 0.0 - 86400 == m.sec2tod
     * >86400 then modulo 86400
     *   if modulo <= 0 return m.sec2tod(modulo)+86400
     *   if module <
     */
    m.sec2tspec = function(sec, mode, trim_trailing_zeros) {
        mode = mode || "";
        if (sec >= 0 && sec <= 86400) {
            return m.sec2tod(sec, trim_trailing_zeros);
        } else {
            sec = sec % 86400;
            if (mode !== "delta" && sec <= 0) {
                return m.sec2tod(sec + 86400, trim_trailing_zeros);
            } else if (mode === "delta" && sec <= 0) {
                return "-" + m.sec2tod(-1 * sec, trim_trailing_zeros);
            } else {
                return m.sec2tod(sec, trim_trailing_zeros);
            }
        }
    };

    /**
     * @param 	{number}	sec		Number of seconds.
     * @return	{string}	tod		Time of day
     */

    m.sec2tod_j1970 = function(sec) {
        var tod = "";
        var d;
        if ((sec >= 0) && (sec < 86400)) {
            // hh:mm:ss
            d = new Date(sec * 1000);
            tod = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());

        } else if ((sec < 0) && (sec > -31536000)) {
            // -ddd:hh:mm:ss
            var days = -1 * (sec / (24 * 60 * 60));
            d = new Date(sec * 1000);
            tod = days.toString() + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
        } else {
            // convert to j1950
            d = new Date((sec - j1950offset) * 1000);
            tod = d.getFullYear() + ":" + pad2(d.getMonth()) + ":" + pad2(d.getDate()) + "::" +
                pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
        }
        if ((sec % 1) !== 0) {
            tod += "." + (sec % 1).toPrecision(6).slice(2, 8);
        }
        return tod;
    };

    m.j1970toj1950 = function(t) {
        if (t.getTime !== undefined) {
            return ((t.getTime() / 1000) + j1950offset);
        } else {
            return (t + j1950offset);
        }
    };

    m.j1950toj1970 = function(t) {
        return (t - j1950offset);
    };

    /**
     * @private
     */
    // Throttle calls to "callback" routine and ensure that it
    // is not invoked any more often than "delay" milliseconds.
    //
    m.throttle = function(delay, callback) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();

            //
            // if "delay" milliseconds have expired since
            // the previous call then propagate this call to
            // "callback"
            //
            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    };

    // Node: Export function
    module.exports = m;

}());

},{"./bluefile":3,"loglevel":13}],6:[function(require,module,exports){
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
    var ColorMap = require("./ColorMap");
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
        this.font_width = 8;
        this.font_scaled = false;
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
            if (!Mx.pixel) {
                m.log.warn("COLORMAP not initialized, defaulting to foreground");
                color = Mx.fg;
            } else {
                if (isNaN(color)) {
                    color = 0;
                }
                var cidx = Math.max(0, Math.min(Mx.pixel.map.length, color));
                color = Mx.pixel.getColor(color);
                color = to_rgb(
                    color.red,
                    color.green,
                    color.blue);
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
        Mx.pixel = new ColorMap(map, {
            ncolors: ncolors
        });
        return;
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
        Mx.pixel.setRange(0, Mx.pixel.map.length);
        for (var j = 1; j < h; j++) {
            var cidx = Math.floor(Mx.pixel.map.length * (j - 1) / h);
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

        Mx.pixel.setRange(zmin, zmax);

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
            var color = Mx.pixel.getColor(value);
            if (color) {
                imgd[i] = color.color;

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

        if (!Mx.pixel) {
            console.log("COLORMAP not initialized, defaulting to foreground");
            Mx.pixel = new ColorMap(m.Mc.colormap[1].colors);
        }


        Mx.pixel.setRange(zmin, zmax);
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


                var color = Mx.pixel.getColor(value);
                if (color) {
                    imgd[i] = color.color;
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

        if (!Mx.pixel) {
            m.log.warn("COLORMAP not initialized, defaulting to foreground");
            Mx.pixel = new ColorMap(m.Mc.colormap[1].colors);
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
            var color = Mx.pixel.getColor(data[i]);
            if (color) {
                imgd[i] = color.color;
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

},{"./CanvasInput":1,"./ColorMap":2,"./common":4,"./m":5,"tinycolor2":14}],7:[function(require,module,exports){
/**
 * @license
 * File: plugins.js
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

// Bundle all the standard-plugins into this module
module.exports = {
    AccordionPlugin        : require("./sigplot.accordion"),
    AnnotationPlugin       : require("./sigplot.annotations"),
    BoxesPlugin            : require("./sigplot.boxes"),
    PlaybackControlsPlugin : require("./sigplot.playback"),
    SliderPlugin           : require("./sigplot.slider")
};

}());

},{"./sigplot.accordion":8,"./sigplot.annotations":9,"./sigplot.boxes":10,"./sigplot.playback":11,"./sigplot.slider":12}],8:[function(require,module,exports){
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

},{"./m":5,"./mx":6}],9:[function(require,module,exports){
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

},{"./m":5,"./mx":6}],10:[function(require,module,exports){
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

    /**
     * @constructor
     * @param options
     * @returns {BoxesPlugin}
     */
    var BoxesPlugin = function(options) {
        this.options = (options === undefined) ? {} : options;

        if (this.options.display === undefined) {
            this.options.display = true;
        }

        this.boxes = [];
    };

    BoxesPlugin.prototype = {
        init: function(plot) {
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
                ctx.strokeRect(x,
                    y,
                    w,
                    h);

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
    };

    module.exports = BoxesPlugin;

}());

},{"./m":5,"./mx":6}],11:[function(require,module,exports){
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
            fillStyle: false
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

},{"./common":4,"./m":5,"./mx":6}],12:[function(require,module,exports){
/**
 * @license
 * File: sigplot.slider.js
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
     * @returns {SliderPlugin}
     */
    var SliderPlugin = function(options) {
        this.options = {
            display: true,
            style: {
                lineWidth: 1,
                lineCap: "square" //, strokeStyle: "#FFFFFF", textStyle: "#FFFFFF"
            },
            direction: "vertical", // "vertical","horizontal","both" 
            name: "Slider",
            prevent_drag: false,
            add_box: false, // add boxes around values
            persistent_style: false, // highlights and/or boxes persist
            slider_ID: 0 // each slider has a numerical int ID
        };

        common.update(this.options, options);
        this.position = undefined;
        this.location = undefined;
        this.paired_slider = undefined;
        this.name = this.options.name;

    };

    SliderPlugin.prototype = {
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

                var lineWidth = self.options.style.lineWidth;

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

                var lineWidth = self.options.style.lineWidth;

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

                // the slider is handling this, so prevent default actions
                evt.preventDefault();

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
            this.plot.addListener("mup", this.onmouseup);
        },

        menu: function() {
            var _display_handler = (function(self) {
                return function() {
                    self.options.display = !self.options.display;
                    self.plot.redraw();
                };
            }(this));

            var _center_handler = (function(self) {
                return function() {
                    var Mx = self.plot._Mx;
                    var stk = Mx.stk[Mx.level];

                    var xctr = ((stk.xmax - stk.xmin) / 2.0) + stk.xmin;
                    var yctr = ((stk.ymax - stk.ymin) / 2.0) + stk.ymin;

                    if (self.options.direction === "vertical") {
                        self.set_position(xctr);
                    } else if (self.options.direction === "horizontal") {
                        self.set_position(yctr);
                    } else if (self.options.direction === "both") {
                        self.set_position({
                            x: xctr,
                            y: yctr
                        });
                    }
                };
            }(this));

            return {
                text: this.name + "...",
                menu: {
                    title: "SLIDER",
                    items: [{
                        text: "Display",
                        checked: this.options.display,
                        style: "checkbox",
                        handler: _display_handler
                    }, {
                        text: "Center",
                        handler: _center_handler
                    }]
                }
            };
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

            ctx.lineWidth = this.options.style.lineWidth;
            ctx.lineCap = this.options.style.lineCap;
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

            // Show extra information while dragging or highlighted or if the user wants persistent highlights
            if (this.dragging || this.highlight || this.options.persistent_style) {
                var overlap_adjustment = 2 * Mx.text_h * (this.options.slider_ID);
                if (this.options.direction === "vertical") {
                    ctx.textBaseline = "alphabetic";
                    ctx.textAlign = "left";
                    ctx.fillStyle = (this.options.style.textStyle !== undefined) ? this.options.style.textStyle : Mx.fg;
                    ctx.font = Mx.font.font;
                    var text = mx.format_g(this.position, 6, 3, true).trim();
                    var text_w = ctx.measureText(text).width;
                    if ((this.location + 2 * text_w) > Mx.r) {
                        ctx.textAlign = "right";
                        ctx.fillText(text, this.location - 15, Mx.t + 40 + overlap_adjustment);
                    } else {
                        ctx.fillText(text, this.location + 15, Mx.t + 40 + overlap_adjustment);
                    }


                    if (this.options.add_box) {
                        // Draw a box around the value

                        if ((this.location + 2 * text_w) > Mx.r) {
                            ctx.rect(this.location - 2 * text_w, Mx.t + 20 + overlap_adjustment, 2 * text_w, 2 * Mx.text_h);
                            ctx.strokeStyle = this.options.style.strokeStyle;
                            ctx.stroke();
                        } else {
                            ctx.rect(this.location + 0.5, Mx.t + 20 + overlap_adjustment, 2 * text_w, 2 * Mx.text_h);
                            ctx.strokeStyle = this.options.style.strokeStyle;
                            ctx.stroke();
                        }

                    }
                } else if (this.options.direction === "horizontal") {
                    ctx.textBaseline = "alphabetic";
                    ctx.textAlign = "left";
                    ctx.fillStyle = (this.options.style.textStyle !== undefined) ? this.options.style.textStyle : Mx.fg;
                    ctx.font = Mx.font.font;
                    var text = mx.format_g(this.position, 6, 3, true).trim();
                    var text_w = ctx.measureText(text).width;
                    overlap_adjustment = 2 * text_w * (this.options.slider_ID);
                    if ((this.location - 2 * Mx.text_h) > Mx.t) {
                        ctx.fillText(text, Mx.l + 20 + overlap_adjustment, this.location - 5);
                    } else {
                        ctx.fillText(text, Mx.l + 20 + overlap_adjustment, this.location + 5 + Mx.text_h);

                    }

                    if (this.options.add_box) {
                        // Draw a box around the value

                        if ((this.location - 2 * Mx.text_h) > Mx.t) {
                            ctx.rect(Mx.l + 15 + overlap_adjustment, this.location - 2 * Mx.text_h, 2 * text_w, 2 * Mx.text_h);
                            ctx.strokeStyle = this.options.style.strokeStyle;
                            ctx.stroke();
                        } else {
                            ctx.rect(Mx.l + 15 + overlap_adjustment, this.location, 2 * text_w, 2 * Mx.text_h);
                            ctx.strokeStyle = this.options.style.strokeStyle;
                            ctx.stroke();
                        }
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

    module.exports = SliderPlugin;

}());

},{"./common":4,"./m":5,"./mx":6}],13:[function(require,module,exports){
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
}));

},{}],14:[function(require,module,exports){
// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);

},{}]},{},[7])(7)
});
