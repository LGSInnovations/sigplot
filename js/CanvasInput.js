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
            for (var i = (inputs.length- 1); i >= 0 ; i--) {
                if (inputs[i] === this) {
                    inputs.splice(i, 1);
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
