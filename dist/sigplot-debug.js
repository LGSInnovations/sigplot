/*

 File: CanvasInput.js
  CanvasInput v1.0.10
  http://goldfirestudios.com/blog/108/CanvasInput-HTML5-Canvas-Text-Input

  (c) 2013, James Simpson of GoldFire Studios
  goldfirestudios.com

  (c) 2013, Axios, Inc.
  Modifications made by Axios, Inc.
  axiosengineering.com

  MIT License

 File: common.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.


 File: m.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.

 File: sigplot.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.

 File: sigplot.layer1d.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.

 File: sigplot.layer2d.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License

 File: bluefile.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.


 File: matfile.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.

 File: mx.js
 Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.

 This file is part of SigPlot.

 Licensed to the LGS Innovations (LGS) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  LGS licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
*/
(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else {
    if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else {
        if (typeof global !== "undefined") {
          g = global;
        } else {
          if (typeof self !== "undefined") {
            g = self;
          } else {
            g = this;
          }
        }
      }
      g.sigplot = f();
    }
  }
})(function() {
  var define, module, exports;
  return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) {
            return a(o, !0);
          }
          if (i) {
            return i(o, !0);
          }
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {exports:{}};
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0;o < r.length;o++) {
      s(r[o]);
    }
    return s;
  }({1:[function(require, module, exports) {
    (function() {
      var inputs = [];
      var CanvasInput = window.CanvasInput = function(o) {
        var self = this;
        o = o ? o : {};
        self._canvas = o.canvas || null;
        self._ctx = self._canvas ? self._canvas.getContext("2d") : null;
        self._x = o.x || 0;
        self._y = o.y || 0;
        self._extraX = o.extraX || 0;
        self._extraY = o.extraY || 0;
        self._fontSize = o.fontSize || 14;
        self._fontFamily = o.fontFamily || "Arial";
        self._fontColor = o.fontColor || "#000";
        self._placeHolderColor = o.placeHolderColor || "#bfbebd";
        self._fontWeight = o.fontWeight || "normal";
        self._fontStyle = o.fontStyle || "normal";
        self._readonly = o.readonly || false;
        self._maxlength = o.maxlength || null;
        self._width = o.width || 150;
        self._height = o.height || self._fontSize;
        self._padding = o.padding >= 0 ? o.padding : 5;
        self._borderWidth = o.borderWidth >= 0 ? o.borderWidth : 1;
        self._borderColor = o.borderColor || "#959595";
        self._borderRadius = o.borderRadius >= 0 ? o.borderRadius : 3;
        self._backgroundImage = o.backgroundImage || "";
        self._boxShadow = o.boxShadow || "1px 1px 0px rgba(255, 255, 255, 1)";
        self._innerShadow = o.innerShadow || "0px 0px 4px rgba(0, 0, 0, 0.4)";
        self._selectionColor = o.selectionColor || "rgba(179, 212, 253, 0.8)";
        self._placeHolder = o.placeHolder || "";
        self._value = o.value || self._placeHolder;
        self._onsubmit = o.onsubmit || function() {
        };
        self._onkeydown = o.onkeydown || function() {
        };
        self._onkeyup = o.onkeyup || function() {
        };
        self._onfocus = o.onfocus || function() {
        };
        self._onblur = o.onblur || function() {
        };
        self._cursor = false;
        self._cursorPos = 0;
        self._hasFocus = false;
        self._selection = [0, 0];
        self._wasOver = false;
        self._renderOnReturn = o.renderOnReturn !== undefined ? o.renderOnReturn : true;
        self._disableBlur = o.disableBlur || false;
        self._tabToClear = o.tabToClear || false;
        self.boxShadow(self._boxShadow, true);
        self._calcWH();
        self._renderCanvas = document.createElement("canvas");
        self._renderCanvas.setAttribute("width", self.outerW);
        self._renderCanvas.setAttribute("height", self.outerH);
        self._renderCtx = self._renderCanvas.getContext("2d");
        self._shadowCanvas = document.createElement("canvas");
        self._shadowCanvas.setAttribute("width", self._width + self._padding * 2);
        self._shadowCanvas.setAttribute("height", self._height + self._padding * 2);
        self._shadowCtx = self._shadowCanvas.getContext("2d");
        if (typeof o.backgroundGradient !== "undefined") {
          self._backgroundColor = self._renderCtx.createLinearGradient(0, 0, 0, self.outerH);
          self._backgroundColor.addColorStop(0, o.backgroundGradient[0]);
          self._backgroundColor.addColorStop(1, o.backgroundGradient[1]);
        } else {
          self._backgroundColor = o.backgroundColor || "#fff";
        }
        if (self._canvas) {
          self.mousemoveCanvasListener = function(e) {
            e = e || window.event;
            self.mousemove(e, self);
          };
          self._canvas.addEventListener("mousemove", self.mousemoveCanvasListener, false);
          self.mousedownCanvasListener = function(e) {
            e = e || window.event;
            self.mousedown(e, self);
          };
          self._canvas.addEventListener("mousedown", self.mousedownCanvasListener, false);
          self.mouseupCanvasListener = function(e) {
            e = e || window.event;
            self.mouseup(e, self);
          };
          self._canvas.addEventListener("mouseup", self.mouseupCanvasListener, false);
        }
        self.mouseupWindowListener = function(e) {
          e = e || window.event;
          if (self._hasFocus && !self._mouseDown) {
            self.blur();
          }
        };
        window.addEventListener("mouseup", self.mouseupWindowListener, true);
        self.keydownWindowListener = function(e) {
          e = e || window.event;
          if (self._hasFocus) {
            self.keydown(e, self);
          }
        };
        window.addEventListener("keydown", self.keydownWindowListener, false);
        self.keyupWindowListener = function(e) {
          e = e || window.event;
          if (self._hasFocus) {
            self._onkeyup(e, self);
          }
        };
        window.addEventListener("keyup", self.keyupWindowListener, false);
        self.pasteWindowListener = function(e) {
          e = e || window.event;
          if (self._hasFocus) {
            var text = e.clipboardData.getData("text/plain"), startText = self._value.substr(0, self._cursorPos), endText = self._value.substr(self._cursorPos);
            self._value = startText + text + endText;
            self._cursorPos += text.length;
            self.render();
          }
        };
        window.addEventListener("paste", self.pasteWindowListener, false);
        inputs.push(self);
        self._inputsIndex = inputs.length - 1;
        self.render();
      };
      CanvasInput.prototype = {canvas:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._canvas = data;
          self._ctx = self._canvas.getContext("2d");
          return self.render();
        } else {
          return self._canvas;
        }
      }, x:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._x = data;
          return self.render();
        } else {
          return self._x;
        }
      }, y:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._y = data;
          return self.render();
        } else {
          return self._y;
        }
      }, extraX:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._extraX = data;
          return self.render();
        } else {
          return self._extraX;
        }
      }, extraY:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._extraY = data;
          return self.render();
        } else {
          return self._extraY;
        }
      }, fontSize:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._fontSize = data;
          return self.render();
        } else {
          return self._fontSize;
        }
      }, fontFamily:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._fontFamily = data;
          return self.render();
        } else {
          return self._fontFamily;
        }
      }, fontColor:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._fontColor = data;
          return self.render();
        } else {
          return self._fontColor;
        }
      }, placeHolderColor:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._placeHolderColor = data;
          return self.render();
        } else {
          return self._placeHolderColor;
        }
      }, fontWeight:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._fontWeight = data;
          return self.render();
        } else {
          return self._fontWeight;
        }
      }, fontStyle:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._fontStyle = data;
          return self.render();
        } else {
          return self._fontStyle;
        }
      }, width:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._width = data;
          self._calcWH();
          self._updateCanvasWH();
          return self.render();
        } else {
          return self._width;
        }
      }, height:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._height = data;
          self._calcWH();
          self._updateCanvasWH();
          return self.render();
        } else {
          return self._height;
        }
      }, padding:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._padding = data;
          self._calcWH();
          self._updateCanvasWH();
          return self.render();
        } else {
          return self._padding;
        }
      }, borderWidth:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._borderWidth = data;
          self._calcWH();
          self._updateCanvasWH();
          return self.render();
        } else {
          return self._borderWidth;
        }
      }, borderColor:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._borderColor = data;
          return self.render();
        } else {
          return self._borderColor;
        }
      }, borderRadius:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._borderRadius = data;
          return self.render();
        } else {
          return self._borderRadius;
        }
      }, backgroundColor:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._backgroundColor = data;
          return self.render();
        } else {
          return self._backgroundColor;
        }
      }, backgroundGradient:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._backgroundColor = self._renderCtx.createLinearGradient(0, 0, 0, self.outerH);
          self._backgroundColor.addColorStop(0, data[0]);
          self._backgroundColor.addColorStop(1, data[1]);
          return self.render();
        } else {
          return self._backgroundColor;
        }
      }, boxShadow:function(data, doReturn) {
        var self = this;
        if (typeof data !== "undefined") {
          var boxShadow = data.split("px ");
          self._boxShadow = {x:self._boxShadow === "none" ? 0 : parseInt(boxShadow[0], 10), y:self._boxShadow === "none" ? 0 : parseInt(boxShadow[1], 10), blur:self._boxShadow === "none" ? 0 : parseInt(boxShadow[2], 10), color:self._boxShadow === "none" ? "" : boxShadow[3]};
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
      }, innerShadow:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._innerShadow = data;
          return self.render();
        } else {
          return self._innerShadow;
        }
      }, selectionColor:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._selectionColor = data;
          return self.render();
        } else {
          return self._selectionColor;
        }
      }, placeHolder:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._placeHolder = data;
          return self.render();
        } else {
          return self._placeHolder;
        }
      }, value:function(data) {
        var self = this;
        if (typeof data !== "undefined") {
          self._value = data;
          return self.focus();
        } else {
          return self._value;
        }
      }, onsubmit:function(fn) {
        var self = this;
        if (typeof fn !== "undefined") {
          self._onsubmit = fn;
          return self;
        } else {
          self._onsubmit();
        }
      }, onkeydown:function(fn) {
        var self = this;
        if (typeof fn !== "undefined") {
          self._onkeydown = fn;
          return self;
        } else {
          self._onkeydown();
        }
      }, onkeyup:function(fn) {
        var self = this;
        if (typeof fn !== "undefined") {
          self._onkeyup = fn;
          return self;
        } else {
          self._onkeyup();
        }
      }, focus:function(pos) {
        var self = this, input;
        if (self._readonly) {
          return;
        }
        if (!self._hasFocus) {
          self._onfocus(self);
        }
        if (!self._selectionUpdated) {
          self._selection = [0, 0];
        } else {
          delete self._selectionUpdated;
        }
        self._cursorPos = typeof pos === "number" ? pos : self._clipText().length;
        if (self._placeHolder === self._value) {
          self._value = "";
        }
        self._hasFocus = true;
        self._cursor = true;
        if (self._cursorInterval) {
          clearInterval(self._cursorInterval);
        }
        self._cursorInterval = setInterval(function() {
          self._cursor = !self._cursor;
          self.render();
        }, 500);
        var nav = navigator.userAgent.toLowerCase(), isChromeMobile = nav.indexOf("chrome") >= 0 && (nav.indexOf("mobile") >= 0 && nav.indexOf("android") >= 0);
        var isMobile = typeof window.orientation !== "undefined";
        if (isMobile && (!isChromeMobile && (document && (document.createElement && (input = document.createElement("input")))))) {
          input.type = "text";
          input.style.opacity = 0;
          input.style.position = "absolute";
          input.style.left = self._x + self._extraX + (self._canvas ? self._canvas.offsetLeft : 0) + "px";
          input.style.top = self._y + self._extraY + (self._canvas ? self._canvas.offsetTop : 0) + "px";
          input.style.width = self._width;
          input.style.height = 0;
          document.body.appendChild(input);
          input.focus();
          input.addEventListener("blur", function() {
            self.blur(self);
          }, false);
        } else {
          if (isMobile) {
            self.value(prompt(self._placeHolder) || "");
          }
        }
        return self.render();
      }, blur:function(_this) {
        var self = _this || this;
        if (!self._disableBlur) {
          self._onblur(self);
          if (self._cursorInterval) {
            clearInterval(self._cursorInterval);
          }
          self._hasFocus = false;
          self._cursor = false;
          self._selection = [0, 0];
          if (self._value === "") {
            self._value = self._placeHolder;
          }
        }
        return self.render();
      }, disableBlur:function(_this) {
        var self = _this || this;
        self._disableBlur = true;
      }, enableBlur:function(_this) {
        var self = _this || this;
        self._disableBlur = false;
      }, keydown:function(e, self) {
        var keyCode = e.which, isShift = e.shiftKey, key = null, startText, endText;
        if (!self._hasFocus) {
          return;
        }
        self._onkeydown(e, self);
        if (keyCode === 65 && (e.ctrlKey || e.metaKey)) {
          self._selection = [0, self._value.length];
          e.preventDefault();
          return self.render();
        }
        if (keyCode === 17 || (e.metaKey || e.ctrlKey)) {
          return self;
        }
        e.preventDefault();
        if (keyCode === 8) {
          if (!self._clearSelection()) {
            if (self._cursorPos > 0) {
              startText = self._value.substr(0, self._cursorPos - 1);
              endText = self._value.substr(self._cursorPos, self._value.length);
              self._value = startText + endText;
              self._cursorPos--;
            }
          }
        } else {
          if (keyCode === 37) {
            if (self._cursorPos > 0) {
              self._cursorPos--;
              self._cursor = true;
              self._selection = [0, 0];
            }
          } else {
            if (keyCode === 39) {
              if (self._cursorPos < self._value.length) {
                self._cursorPos++;
                self._cursor = true;
                self._selection = [0, 0];
              }
            } else {
              if (keyCode === 13) {
                self._onsubmit(e, self);
              } else {
                if (keyCode === 9) {
                  if (self._tabToClear) {
                    self._value = "";
                    self._cursorPos = 0;
                  } else {
                    var next = inputs[self._inputsIndex + 1] ? self._inputsIndex + 1 : 0;
                    if (next !== self._inputsIndex) {
                      self.blur();
                      setTimeout(function() {
                        inputs[next].focus();
                      }, 10);
                    }
                  }
                } else {
                  if (key = self._mapCodeToKey(isShift, keyCode)) {
                    self._clearSelection();
                    if (self._maxlength && self._maxlength <= self._value.length) {
                      return;
                    }
                    startText = self._value ? self._value.substr(0, self._cursorPos) : "";
                    endText = self._value ? self._value.substr(self._cursorPos) : "";
                    self._value = startText + key + endText;
                    self._cursorPos++;
                  }
                }
              }
            }
          }
        }
        if (keyCode == 13 && self._renderOnReturn || keyCode !== 13) {
          return self.render();
        } else {
          return function() {
          };
        }
      }, click:function(e, self) {
        var mouse = self._mousePos(e), x = mouse.x, y = mouse.y;
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
      }, mousemove:function(e, self) {
        var mouse = self._mousePos(e), x = mouse.x, y = mouse.y, isOver = self._overInput(x, y);
        if (isOver && self._canvas) {
          self._canvas.style.cursor = "text";
          self._wasOver = true;
        } else {
          if (self._wasOver && self._canvas) {
            self._canvas.style.cursor = "default";
            self._wasOver = false;
          }
        }
        if (self._hasFocus && self._selectionStart >= 0) {
          var curPos = self._clickPos(x, y), start = Math.min(self._selectionStart, curPos), end = Math.max(self._selectionStart, curPos);
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
      }, mousedown:function(e, self) {
        var mouse = self._mousePos(e), x = mouse.x, y = mouse.y, isOver = self._overInput(x, y);
        self._mouseDown = isOver;
        if (self._hasFocus && isOver) {
          self._selectionStart = self._clickPos(x, y);
        }
      }, mouseup:function(e, self) {
        var mouse = self._mousePos(e), x = mouse.x, y = mouse.y;
        var isSelection = self._clickPos(x, y) !== self._selectionStart;
        if (self._hasFocus && (self._selectionStart >= 0 && (self._overInput(x, y) && isSelection))) {
          self._selectionUpdated = true;
          delete self._selectionStart;
          self.render();
        } else {
          delete self._selectionStart;
        }
        self.click(e, self);
      }, renderCanvas:function() {
        return this._renderCanvas;
      }, cleanup:function() {
        this._canvas.removeEventListener("mouseup", this.mouseupCanvasListener, false);
        this._canvas.removeEventListener("mousedown", this.mousedownCanvasListener, false);
        this._canvas.removeEventListener("mousemove", this.mousemoveCanvasListener, false);
        window.removeEventListener("keydown", this.keydownWindowListener, false);
        window.removeEventListener("keyup", this.keyupWindowListener, false);
        window.removeEventListener("mouseup", this.mouseupWindowListener, true);
        window.removeEventListener("paste", this.pasteWindowListener, false);
        clearInterval(this._cursorInterval);
        this._canvas.style.cursor = "default";
        for (var i = 0;i < inputs.length;i++) {
          if (inputs[i] === this) {
            inputs.remove(i);
          }
        }
      }, render:function() {
        var self = this, ctx = self._renderCtx, w = self.outerW, h = self.outerH, br = self._borderRadius, bw = self._borderWidth, sw = self.shadowW, sh = self.shadowH;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.shadowOffsetX = self._boxShadow.x;
        ctx.shadowOffsetY = self._boxShadow.y;
        ctx.shadowBlur = self._boxShadow.blur;
        ctx.shadowColor = self._boxShadow.color;
        if (self._borderWidth > 0) {
          ctx.fillStyle = self._borderColor;
          self._roundedRect(ctx, self.shadowL, self.shadowT, w - sw, h - sh, br);
          ctx.fill();
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 0;
        }
        self._drawTextBox(function() {
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 0;
          var text = self._clipText();
          var paddingBorder = self._padding + self._borderWidth + self.shadowT;
          if (self._selection[1] > 0) {
            var selectOffset = self._textWidth(text.substring(0, self._selection[0])), selectWidth = self._textWidth(text.substring(self._selection[0], self._selection[1]));
            ctx.fillStyle = self._selectionColor;
            ctx.fillRect(paddingBorder + selectOffset, paddingBorder, selectWidth, self._height);
          }
          ctx.fillStyle = self._placeHolder === self._value && self._value !== "" ? self._placeHolderColor : self._fontColor;
          if (self._cursor) {
            var cursorOffset = self._textWidth(text.substring(0, self._cursorPos));
            ctx.fillRect(paddingBorder + cursorOffset, paddingBorder, 1, self._height);
          }
          var textX = self._padding + self._borderWidth + self.shadowL, textY = Math.round(paddingBorder + self._height / 2);
          ctx.font = self._fontStyle + " " + self._fontWeight + " " + self._fontSize + "px " + self._fontFamily;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(text, textX, textY);
          var innerShadow = self._innerShadow.split("px "), isOffsetX = self._innerShadow === "none" ? 0 : parseInt(innerShadow[0], 10), isOffsetY = self._innerShadow === "none" ? 0 : parseInt(innerShadow[1], 10), isBlur = self._innerShadow === "none" ? 0 : parseInt(innerShadow[2], 10), isColor = self._innerShadow === "none" ? "" : innerShadow[3];
          if (isBlur > 0) {
            var shadowCtx = self._shadowCtx, scw = shadowCtx.canvas.width, sch = shadowCtx.canvas.height;
            shadowCtx.clearRect(0, 0, scw, sch);
            shadowCtx.shadowBlur = isBlur;
            shadowCtx.shadowColor = isColor;
            shadowCtx.shadowOffsetX = 0;
            shadowCtx.shadowOffsetY = isOffsetY;
            shadowCtx.fillRect(-1 * w, -100, 3 * w, 100);
            shadowCtx.shadowOffsetX = isOffsetX;
            shadowCtx.shadowOffsetY = 0;
            shadowCtx.fillRect(scw, -1 * h, 100, 3 * h);
            shadowCtx.shadowOffsetX = 0;
            shadowCtx.shadowOffsetY = isOffsetY;
            shadowCtx.fillRect(-1 * w, sch, 3 * w, 100);
            shadowCtx.shadowOffsetX = isOffsetX;
            shadowCtx.shadowOffsetY = 0;
            shadowCtx.fillRect(-100, -1 * h, 100, 3 * h);
            self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
            ctx.clip();
            ctx.drawImage(self._shadowCanvas, 0, 0, scw, sch, bw + self.shadowL, bw + self.shadowT, scw, sch);
          }
          if (self._ctx) {
            self._ctx.clearRect(self._x, self._y, ctx.canvas.width, ctx.canvas.height);
            self._ctx.drawImage(self._renderCanvas, self._x, self._y);
          }
          return self;
        });
      }, _drawTextBox:function(fn) {
        var self = this, ctx = self._renderCtx, w = self.outerW, h = self.outerH, br = self._borderRadius, bw = self._borderWidth, sw = self.shadowW, sh = self.shadowH;
        if (self._backgroundImage === "") {
          ctx.fillStyle = self._backgroundColor;
          self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
          ctx.fill();
          fn();
        } else {
          var img = new Image;
          img.src = self._backgroundImage;
          img.onload = function() {
            ctx.drawImage(img, 0, 0, img.width, img.height, bw + self.shadowL, bw + self.shadowT, w, h);
            fn();
          };
        }
      }, _clearSelection:function() {
        var self = this;
        if (self._selection[1] > 0) {
          var start = self._selection[0], end = self._selection[1];
          self._value = self._value.substr(0, start) + self._value.substr(end);
          self._cursorPos = start;
          self._cursorPos = self._cursorPos < 0 ? 0 : self._cursorPos;
          self._selection = [0, 0];
          return true;
        }
        return false;
      }, _clipText:function(value) {
        var self = this;
        value = typeof value === "undefined" ? self._value : value;
        var textWidth = self._textWidth(value), fillPer = textWidth / (self._width - self._padding), text = fillPer > 1 ? value.substr(-1 * Math.floor(value.length / fillPer)) : value;
        return text + "";
      }, _textWidth:function(text) {
        var self = this, ctx = self._renderCtx;
        ctx.font = self._fontStyle + " " + self._fontWeight + " " + self._fontSize + "px " + self._fontFamily;
        ctx.textAlign = "left";
        return ctx.measureText(text).width;
      }, _calcWH:function() {
        var self = this;
        self.outerW = self._width + self._padding * 2 + self._borderWidth * 2 + self.shadowW;
        self.outerH = self._height + self._padding * 2 + self._borderWidth * 2 + self.shadowH;
      }, _updateCanvasWH:function() {
        var self = this, oldW = self._renderCanvas.width, oldH = self._renderCanvas.height;
        self._renderCanvas.setAttribute("width", self.outerW);
        self._renderCanvas.setAttribute("height", self.outerH);
        self._shadowCanvas.setAttribute("width", self._width + self._padding * 2);
        self._shadowCanvas.setAttribute("height", self._height + self._padding * 2);
        if (self._ctx) {
          self._ctx.clearRect(self._x, self._y, oldW, oldH);
        }
      }, _roundedRect:function(ctx, x, y, w, h, r) {
        if (w < 2 * r) {
          r = w / 2;
        }
        if (h < 2 * r) {
          r = h / 2;
        }
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
      }, _overInput:function(x, y) {
        var self = this, xLeft = x >= self._x + self._extraX, xRight = x <= self._x + self._extraX + self._width + self._padding * 2, yTop = y >= self._y + self._extraY, yBottom = y <= self._y + self._extraY + self._height + self._padding * 2;
        return xLeft && (xRight && (yTop && yBottom));
      }, _clickPos:function(x, y) {
        var self = this, value = self._value;
        if (self._value === self._placeHolder) {
          value = "";
        }
        var text = self._clipText(value), totalW = 0, pos = text.length;
        if (x - (self._x + self._extraX) < self._textWidth(text)) {
          for (var i = 0;i < text.length;i++) {
            totalW += self._textWidth(text[i]);
            if (totalW >= x - (self._x + self._extraX)) {
              pos = i;
              break;
            }
          }
        }
        return pos;
      }, _mousePos:function(e) {
        var elm = e.target, style = document.defaultView.getComputedStyle(elm, undefined), paddingLeft = parseInt(style["paddingLeft"], 10) || 0, paddingTop = parseInt(style["paddingLeft"], 10) || 0, borderLeft = parseInt(style["borderLeftWidth"], 10) || 0, borderTop = parseInt(style["borderLeftWidth"], 10) || 0, htmlTop = document.body.parentNode.offsetTop || 0, htmlLeft = document.body.parentNode.offsetLeft || 0, offsetX = 0, offsetY = 0, x, y;
        if (typeof elm.offsetParent !== "unefined") {
          do {
            offsetX += elm.offsetLeft;
            offsetY += elm.offsetTop;
          } while (elm = elm.offsetParent);
        }
        offsetX += paddingLeft + borderLeft + htmlLeft;
        offsetY += paddingTop + borderTop + htmlTop;
        return{x:e.pageX - offsetX, y:e.pageY - offsetY};
      }, _mapCodeToKey:function(isShift, keyCode) {
        var self = this, blockedKeys = [8, 9, 13, 16, 17, 18, 20, 27, 91, 92], key = "";
        for (var i = 0;i < blockedKeys.length;i++) {
          if (keyCode === blockedKeys[i]) {
            return;
          }
        }
        if (typeof isShift !== "boolean" || typeof keyCode !== "number") {
          return;
        }
        var charMap = {32:" ", 48:")", 49:"!", 50:"@", 51:"#", 52:"$", 53:"%", 54:"^", 55:"&", 56:"*", 57:"(", 59:":", 107:"+", 173:"_", 189:"_", 186:":", 187:"+", 188:"<", 190:">", 191:"?", 192:"~", 219:"{", 220:"|", 221:"}", 222:'"'};
        if (isShift) {
          key = keyCode >= 65 && keyCode <= 90 ? String.fromCharCode(keyCode) : charMap[keyCode];
        } else {
          if (keyCode >= 65 && keyCode <= 90) {
            key = String.fromCharCode(keyCode).toLowerCase();
          } else {
            if (keyCode === 96) {
              key = "0";
            } else {
              if (keyCode === 97) {
                key = "1";
              } else {
                if (keyCode === 98) {
                  key = "2";
                } else {
                  if (keyCode === 99) {
                    key = "3";
                  } else {
                    if (keyCode === 100) {
                      key = "4";
                    } else {
                      if (keyCode === 101) {
                        key = "5";
                      } else {
                        if (keyCode === 102) {
                          key = "6";
                        } else {
                          if (keyCode === 103) {
                            key = "7";
                          } else {
                            if (keyCode === 104) {
                              key = "8";
                            } else {
                              if (keyCode === 105) {
                                key = "9";
                              } else {
                                if (keyCode === 188) {
                                  key = ",";
                                } else {
                                  if (keyCode === 190) {
                                    key = ".";
                                  } else {
                                    if (keyCode === 191) {
                                      key = "/";
                                    } else {
                                      if (keyCode === 192) {
                                        key = "`";
                                      } else {
                                        if (keyCode === 220) {
                                          key = "\\";
                                        } else {
                                          if (keyCode === 187) {
                                            key = "=";
                                          } else {
                                            if (keyCode === 189 || keyCode === 173) {
                                              key = "-";
                                            } else {
                                              if (keyCode === 222) {
                                                key = "'";
                                              } else {
                                                if (keyCode === 186) {
                                                  key = ";";
                                                } else {
                                                  if (keyCode === 219) {
                                                    key = "[";
                                                  } else {
                                                    if (keyCode === 221) {
                                                      key = "]";
                                                    } else {
                                                      key = String.fromCharCode(keyCode);
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return key;
      }};
      module.exports = CanvasInput;
    })();
  }, {}], 2:[function(require, module, exports) {
    (function() {
      var common = require("./common");
      function bluefile() {
      }
      var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false;
      function endianness() {
        var b = new ArrayBuffer(4);
        var a = new Uint32Array(b);
        var c = new Uint8Array(b);
        a[0] = 3735928559;
        if (c[0] === 239) {
          return "LE";
        }
        if (c[0] === 222) {
          return "BE";
        }
        throw new Error("unknown endianness");
      }
      var ARRAY_BUFFER_ENDIANNESS = endianness();
      var _SPA = {"S":1, "C":2, "V":3, "Q":4, "M":9, "X":10, "T":16, "U":1, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9};
      var _BPS = {"P":0.125, "A":1, "O":1, "B":1, "I":2, "L":4, "X":8, "F":4, "D":8};
      var _XM_TO_TYPEDARRAY = {"P":null, "A":null, "O":Uint8Array, "B":Int8Array, "I":Int16Array, "L":Int32Array, "X":null, "F":Float32Array, "D":Float64Array};
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
      var _XM_TO_DATAVIEW = {"P":null, "A":null, "O":"getUint8", "B":"getInt8", "I":"getInt16", "L":"getInt32", "X":getInt64, "F":"getFloat32", "D":"getFloat64"};
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
      function ab2str(buf) {
        var uintbuf = new Uint8Array(buf);
        if (_applySupportsTypedArray) {
          return String.fromCharCode.apply(null, uintbuf);
        } else {
          var str = "";
          for (var i = 0;i < uintbuf.length;i++) {
            str += String.fromCharCode(uintbuf[i]);
          }
          return str;
        }
      }
      function str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2);
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length;i < strLen;i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }
      function pow2(n) {
        return n >= 0 && n < 31 ? 1 << n : pow2[n] || (pow2[n] = Math.pow(2, n));
      }
      bluefile.BlueHeader = function(buf, options) {
        this.options = {ext_header_type:"dict"};
        common.update(this.options, options);
        this.buf = buf;
        if (this.buf != null) {
          var dvhdr = new DataView(this.buf);
          this.version = ab2str(this.buf.slice(0, 4));
          this.headrep = ab2str(this.buf.slice(4, 8));
          this.datarep = ab2str(this.buf.slice(8, 12));
          var littleEndianHdr = this.headrep === "EEEI";
          var littleEndianData = this.datarep === "EEEI";
          this.ext_start = dvhdr.getInt32(24, littleEndianHdr);
          this.ext_size = dvhdr.getInt32(28, littleEndianHdr);
          this.type = dvhdr.getUint32(48, littleEndianHdr);
          this["class"] = this.type / 1E3;
          this.format = ab2str(this.buf.slice(52, 54));
          this.timecode = dvhdr.getFloat64(56, littleEndianHdr);
          if (this["class"] === 1) {
            this.xstart = dvhdr.getFloat64(256, littleEndianHdr);
            this.xdelta = dvhdr.getFloat64(256 + 8, littleEndianHdr);
            this.xunits = dvhdr.getInt32(256 + 16, littleEndianHdr);
            this.yunits = dvhdr.getInt32(256 + 40, littleEndianHdr);
            this.subsize = 1;
          } else {
            if (this["class"] === 2) {
              this.xstart = dvhdr.getFloat64(256, littleEndianHdr);
              this.xdelta = dvhdr.getFloat64(256 + 8, littleEndianHdr);
              this.xunits = dvhdr.getInt32(256 + 16, littleEndianHdr);
              this.subsize = dvhdr.getInt32(256 + 20, littleEndianHdr);
              this.ystart = dvhdr.getFloat64(256 + 24, littleEndianHdr);
              this.ydelta = dvhdr.getFloat64(256 + 32, littleEndianHdr);
              this.yunits = dvhdr.getInt32(256 + 40, littleEndianHdr);
            }
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
      bluefile.BlueHeader.prototype = {setData:function(buf, offset, data_end, littleEndian) {
        if (this["class"] === 1) {
          this.spa = _SPA[this.format[0]];
          this.bps = _BPS[this.format[1]];
          this.bpa = this.spa * this.bps;
          this.ape = 1;
          this.bpe = this.ape * this.bpa;
        } else {
          if (this["class"] === 2) {
            this.spa = _SPA[this.format[0]];
            this.bps = _BPS[this.format[1]];
            this.bpa = this.spa * this.bps;
            this.ape = this.subsize;
            this.bpe = this.ape * this.bpa;
          }
        }
        if (littleEndian === undefined) {
          littleEndian = ARRAY_BUFFER_ENDIANNESS === "LE";
        }
        if (ARRAY_BUFFER_ENDIANNESS === "LE" && !littleEndian) {
          throw "Not supported " + ARRAY_BUFFER_ENDIANNESS + " " + littleEndian;
        } else {
          if (ARRAY_BUFFER_ENDIANNESS === "BE" && this.littleEndianData) {
            throw "Not supported " + ARRAY_BUFFER_ENDIANNESS + " " + littleEndian;
          }
        }
        if (buf) {
          if (offset && data_end) {
            this.dview = this.createArray(buf, offset, (data_end - offset) / this.bps);
          } else {
            this.dview = this.createArray(buf);
          }
          this.size = this.dview.length / (this.spa * this.ape);
        } else {
          this.dview = this.createArray(null, null, this.size);
        }
      }, unpack_keywords:function(buf, lbuf, offset, littleEndian) {
        var lkey, lextra, ltag, format, tag, data, ldata, itag, idata, dvk;
        var keywords = [];
        var dic_index = {};
        var dict_keywords = {};
        var ii = 0;
        buf = buf.slice(offset, buf.length);
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
              window.console.info("Unsupported keyword format " + format + " for tag " + tag);
            }
          }
          if (typeof dic_index[tag] === "undefined") {
            dic_index[tag] = 1;
          } else {
            dic_index[tag]++;
            tag = "" + tag + dic_index[tag];
          }
          dict_keywords[tag] = data;
          keywords.push({tag:tag, value:data});
          ii += lkey;
        }
        var dictTypes = ["dict", "json", {}, "XMTable", "JSON", "DICT"];
        for (var k in dictTypes) {
          if (dictTypes[k] === this.options.ext_header_type) {
            return dict_keywords;
          }
        }
        return keywords;
      }, createArray:function(buf, offset, length) {
        var TypedArray = _XM_TO_TYPEDARRAY[this.format[1]];
        if (TypedArray === undefined) {
          throw "unknown format " + this.format[1];
        }
        if (offset === undefined) {
          offset = 0;
        }
        if (length === undefined) {
          length = buf.length || buf.byteLength / _BPS[this.format[1]];
        }
        if (buf) {
          return new TypedArray(buf, offset, length);
        } else {
          return new TypedArray(length);
        }
      }};
      function parseURL(url) {
        var a = document.createElement("a");
        a.href = url;
        return{source:url, protocol:a.protocol.replace(":", ""), host:a.hostname, port:a.port, query:a.search, params:function() {
          var ret = {}, seg = a.search.replace(/^\?/, "").split("&"), len = seg.length, i = 0, s;
          for (;i < len;i++) {
            if (!seg[i]) {
              continue;
            }
            s = seg[i].split("=");
            ret[s[0]] = s[1];
          }
          return ret;
        }(), file:(a.pathname.match(/\/([^\/?#]+)$/i) || [null, ""])[1], hash:a.hash.replace("#", ""), path:a.pathname.replace(/^([^\/])/, "/$1"), relative:(a.href.match(/tps?:\/\/[^\/]+(.+)/) || [null, ""])[1], segments:a.pathname.replace(/^\//, "").split("/")};
      }
      function text2buffer(text, oncomplete, blocksize) {
        blocksize = blocksize || 1024;
        var i = 0;
        var arrayBuffer = new ArrayBuffer(text.length);
        var bufView = new Uint8Array(arrayBuffer);
        var worker = function() {
          var end = i + blocksize;
          for (;i < end;i++) {
            bufView[i] = text.charCodeAt(i) & 255;
          }
          if (i >= text.length) {
            oncomplete(arrayBuffer);
          } else {
            setTimeout(worker, 0);
          }
        };
        setTimeout(worker, 0);
      }
      bluefile.BlueFileReader = function(options) {
        this.options = options;
      };
      bluefile.BlueFileReader.prototype = {readheader:function readheader(theFile, onload) {
        var that = this;
        var reader = new FileReader;
        var blob = theFile.webkitSlice(0, 512);
        reader.onloadend = function(theFile) {
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
        }(theFile);
        reader.readAsArrayBuffer(blob);
      }, read:function read(theFile, onload) {
        var that = this;
        var reader = new FileReader;
        reader.onloadend = function(theFile) {
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
        }(theFile);
        reader.readAsArrayBuffer(theFile);
      }, read_http:function read_http(href, onload) {
        var that = this;
        var oReq = new XMLHttpRequest;
        oReq.open("GET", href, true);
        oReq.responseType = "arraybuffer";
        oReq.overrideMimeType("text/plain; charset=x-user-defined");
        oReq.onload = function(oEvent) {
          if (oReq.readyState === 4) {
            if (oReq.status === 200 || oReq.status === 0) {
              var arrayBuffer = null;
              if (oReq.response) {
                arrayBuffer = oReq.response;
                var hdr = new bluefile.BlueHeader(arrayBuffer, that.options);
                parseURL(href);
                var fileUrl = parseURL(href);
                hdr.file_name = fileUrl.file;
                onload(hdr);
              } else {
                if (oReq.responseText) {
                  text2buffer(oReq.responseText, function(arrayBuffer) {
                    var hdr = new bluefile.BlueHeader(arrayBuffer, that.options);
                    parseURL(href);
                    var fileUrl = parseURL(href);
                    hdr.file_name = fileUrl.file;
                    onload(hdr);
                  });
                }
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
      }};
      module.exports = bluefile;
    })();
  }, {"./common":3}], 3:[function(require, module, exports) {
    (function() {
      module.exports = {};
      if (window.ArrayBuffer) {
        if (!ArrayBuffer.prototype.slice) {
          ArrayBuffer.prototype.slice = function(start, end) {
            var that = new Uint8Array(this);
            if (end === undefined) {
              end = that.length;
            }
            var result = new ArrayBuffer(end - start);
            var resultArray = new Uint8Array(result);
            for (var i = 0;i < resultArray.length;i++) {
              resultArray[i] = that[i + start];
            }
            return result;
          };
        }
      }
      Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
      };
      window.requestAnimFrame = function(callback) {
        return window.requestAnimationFrame || (window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || function(callback) {
          return window.setTimeout(callback, 1E3 / 60);
        }))));
      }();
      window.cancelAnimFrame = function(callback) {
        return window.cancelAnimationFrame || (window.webkitCancelAnimationFrame || (window.mozCancelAnimationFrame || (window.oCancelAnimationFrame || (window.msCanelAnimationFrame || function(timeoutID) {
          window.clearTimeout(timeoutID);
        }))));
      }();
      module.exports.dashOn = function(ctx, on, off) {
        if (ctx.setLineDash) {
          ctx.setLineDash([on, off]);
          return true;
        } else {
          if (ctx.mozDash !== undefined) {
            ctx.mozDash = [on, off];
            return true;
          } else {
            if (ctx.webkitLineDash && ctx.webkitLineDash.length === 0) {
              ctx.webkitLineDash = [on, off];
              return true;
            }
          }
        }
        return false;
      };
      module.exports.dashOff = function(ctx) {
        if (ctx.setLineDash) {
          ctx.setLineDash([]);
        } else {
          if (ctx.mozDash) {
            ctx.mozDash = null;
          } else {
            if (ctx.webkitLineDash) {
              ctx.webkitLineDash = [];
            }
          }
        }
      };
      module.exports.getKeyCode = function(e) {
        e = window.event || e;
        e = e.charCode || e.keyCode;
        return e;
      };
      module.exports.setKeypressHandler = function(handler) {
        if (window.addEventListener) {
          window.addEventListener("keypress", handler, false);
        } else {
          if (window.attachEvent) {
            window.attachEvent("onkeypress", handler);
          }
        }
      };
      if (!Array.isArray) {
        Array.isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      if (!window.Float64Array) {
        window.Float64Array = function() {
          return window.Float64Array || function(buffer, byteOffset, length) {
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
            for (var i = 0;i < b.length;i++) {
              b[i] = dv.getFloat64(i * 8 + byteOffset, true);
            }
            b.subarray = function(begin, end) {
              return b.slice(begin, end);
            };
            return b;
          };
        }();
      }
      (function() {
        var f = function() {
        };
        if (!window.console) {
          window.console = {log:f, info:f, warn:f, debug:f, error:f};
        }
        if ((new Int8Array([0, 1, 0])).subarray(1).subarray(1)[0]) {
          var subarray = function(begin, end) {
            if (arguments.length === 0) {
              begin = 0;
              end = this.length;
            } else {
              if (begin < 0) {
                begin += this.length;
              }
              begin = Math.max(0, Math.min(this.length, begin));
              if (arguments.length === 1) {
                end = this.length;
              } else {
                if (end < 0) {
                  end += this.length;
                }
                end = Math.max(begin, Math.min(this.length, end));
              }
            }
            var byteOffset = this.byteOffset + begin * this.BYTES_PER_ELEMENT;
            return new this.constructor(this.buffer, byteOffset, end - begin);
          };
          var typedArrays = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
          typedArrays.forEach(function(cls) {
            cls.prototype.subarray = subarray;
          });
        }
      })();
      (function(window, document) {
        var prefix = "", _addEventListener, onwheel, support;
        if (window.addEventListener) {
          _addEventListener = "addEventListener";
        } else {
          _addEventListener = "attachEvent";
          prefix = "on";
        }
        support = "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
        window.addWheelListener = function(elem, callback, useCapture) {
          _addWheelListener(elem, support, callback, useCapture);
          if (support === "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
          }
        };
        function _addWheelListener(elem, eventName, callback, useCapture) {
          elem[_addEventListener](prefix + eventName, support === "wheel" ? callback : function(originalEvent) {
            !originalEvent && (originalEvent = window.event);
            var event = {originalEvent:originalEvent, target:originalEvent.target || originalEvent.srcElement, type:"wheel", deltaMode:originalEvent.type === "MozMousePixelScroll" ? 0 : 1, deltaX:0, delatZ:0, preventDefault:function() {
              originalEvent.preventDefault ? originalEvent.preventDefault() : originalEvent.returnValue = false;
            }};
            if (support === "mousewheel") {
              event.deltaY = -1 / 40 * originalEvent.wheelDelta;
              originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
            } else {
              event.deltaY = originalEvent.detail;
            }
            return callback(event);
          }, useCapture || false);
        }
      })(window, document);
      module.exports.update = function update(dst, src) {
        for (var prop in src) {
          var val = src[prop];
          if (typeof val === "object") {
            update(dst[prop], val);
          } else {
            dst[prop] = val;
          }
        }
        return dst;
      };
    })();
  }, {}], 4:[function(require, module, exports) {
    (function() {
      var bluefile = require("./bluefile");
      var loglevel = require("loglevel");
      function m() {
      }
      m.log = loglevel;
      var PointArray = null;
      var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false;
      if (iOS || (typeof Float64Array === "undefined" || (Float64Array.emulated || !Float64Array.BYTES_PER_ELEMENT))) {
        m.PointArray = Float32Array;
      } else {
        m.PointArray = Float64Array;
      }
      var UNITS = {0:["None", "U", true, true], 1:["Time", "sec", true, true], 2:["Delay", "sec", true, false], 3:["Frequency", "Hz", true, true], 4:["Time code format", "", true, false], 5:["Distance", "m", true, true], 6:["Speed", "m/s", true, true], 7:["Acceleration", "m/sec^2", true, true], 8:["Jerk", "m/sec^3", true, true], 9:["Doppler", "Hz", true, false], 10:["Doppler rate", "Hz/sec", true, true], 11:["Energy", "J", true, true], 12:["Power", "W", true, true], 13:["Mass", "g", true, true], 
      14:["Volume", "l", true, true], 15:["Angular power density", "W/ster", true, true], 16:["Integrated power density", "W/rad", true, true], 17:["Spatial power density", "W/m^2", true, true], 18:["Integrated power density", "W/m", false, true], 19:["Spectral power density", "W/MHz", true, true], 20:["Amplitude", "U", true, false], 21:["Real", "U", true, false], 22:["Imaginary", "U", true, false], 23:["Phase", "rad", true, true], 24:["Phase", "deg", false, true], 25:["Phase", "cycles", false, true], 
      26:["10*Log", "U", true, false], 27:["20*Log", "U", true, false], 28:["Magnitude", "U", true, false], 29:["Unknown", "U", true, false], 30:["Unknown", "U", false, false], 31:["General dimensionless", "", true, true], 32:["Counts", "", true, false], 33:["Angle", "rad", true, false], 34:["Angle", "deg", false, false], 35:["Relative power", "dB", true, true], 36:["Relative power", "dBm", false, true], 37:["Relative power", "dBW", false, true], 38:["Solid angle", "ster", true, true], 40:["Distance", 
      "ft", false, true], 41:["Distance", "nmi", false, true], 42:["Speed", "ft/sec", false, true], 43:["Speed", "nmi/sec", false, true], 44:["Speed", "knots=nmi/hr", false, true], 45:["Acceleration", "ft/sec^2", false, true], 46:["Acceleration", "nmi/sec^2", false, true], 47:["Acceleration", "knots/sec", false, true], 48:["Acceleration", "G", false, true], 49:["Jerk", "G/sec", false, true], 50:["Rotation", "rps", true, false], 51:["Rotation", "rpm", false, false], 52:["Angular velocity", "rad/sec", 
      true, true], 53:["Angular velocity", "deg/sec", false, true], 54:["Angular acceleration", "rad/sec^2", true, true], 55:["Angular acceleration", "deg/sec^2", false, true], 60:["Latitude", "deg", true, false], 61:["Longitude", "deg", true, false], 62:["Altitude", "ft", true, false], 63:["Altitude", "m", false, false]};
      m.UNITS = UNITS;
      m.Mc = {colormap:[{name:"Greyscale", colors:[{pos:0, red:0, green:0, blue:0}, {pos:60, red:50, green:50, blue:50}, {pos:100, red:100, green:100, blue:100}, {pos:100, red:0, green:0, blue:0}, {pos:100, red:0, green:0, blue:0}, {pos:100, red:0, green:0, blue:0}, {pos:100, red:0, green:0, blue:0}]}, {name:"Ramp Colormap", colors:[{pos:0, red:0, green:0, blue:15}, {pos:10, red:0, green:0, blue:50}, {pos:31, red:0, green:65, blue:75}, {pos:50, red:0, green:85, blue:0}, {pos:70, red:75, green:80, 
      blue:0}, {pos:83, red:100, green:60, blue:0}, {pos:100, red:100, green:0, blue:0}]}, {name:"Color Wheel", colors:[{pos:0, red:100, green:100, blue:0}, {pos:20, red:0, green:80, blue:40}, {pos:30, red:0, green:100, blue:100}, {pos:50, red:10, green:10, blue:0}, {pos:65, red:100, green:0, blue:0}, {pos:88, red:100, green:40, blue:0}, {pos:100, red:100, green:100, blue:0}]}, {name:"Spectrum", colors:[{pos:0, red:0, green:75, blue:0}, {pos:22, red:0, green:90, blue:90}, {pos:37, red:0, green:0, 
      blue:85}, {pos:49, red:90, green:0, blue:85}, {pos:68, red:90, green:0, blue:0}, {pos:80, red:90, green:90, blue:0}, {pos:100, red:95, green:95, blue:95}]}, {name:"calewhite", colors:[{pos:0, red:100, green:100, blue:100}, {pos:16.666, red:0, green:0, blue:100}, {pos:33.333, red:0, green:100, blue:100}, {pos:50, red:0, green:100, blue:0}, {pos:66.666, red:100, green:100, blue:0}, {pos:83.333, red:100, green:0, blue:0}, {pos:100, red:100, green:0, blue:100}]}, {name:"HotDesat", colors:[{pos:0, 
      red:27.84, green:27.84, blue:85.88}, {pos:14.2857, red:0, green:0, blue:35.69}, {pos:28.571, red:0, green:100, blue:100}, {pos:42.857, red:0, green:49.8, blue:0}, {pos:57.14286, red:100, green:100, blue:0}, {pos:71.42857, red:100, green:37.65, blue:0}, {pos:85.7143, red:41.96, green:0, blue:0}, {pos:100, red:87.84, green:29.8, blue:29.8}]}, {name:"Sunset", colors:[{pos:0, red:10, green:0, blue:23}, {pos:18, red:34, green:0, blue:60}, {pos:36, red:58, green:20, blue:47}, {pos:55, red:74, green:20, 
      blue:28}, {pos:72, red:90, green:43, blue:0}, {pos:87, red:100, green:72, blue:0}, {pos:100, red:100, green:100, blue:76}]}]};
      m.PIPESIZE = 1024 * 1024;
      m.unit_lookup = function(unitInput) {
        for (var i = 0;i < 64;i++) {
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
          } else {
            if (unitInput === second) {
              if (u[3]) {
                return i;
              }
            } else {
              if (unitInput === comparer1 || unitInput === comparer2) {
                return i;
              }
            }
          }
        }
        return unitInput;
      };
      m.initialize = function(data, overrides) {
        var hcb = new bluefile.BlueHeader(null);
        hcb.version = "BLUE";
        hcb.size = 0;
        hcb.type = 1E3;
        hcb.format = "SF";
        hcb.timecode = 0;
        hcb.xstart = 0;
        hcb.xdelta = 1;
        hcb.xunits = 0;
        hcb.subsize = 1;
        hcb.ystart = 0;
        hcb.ydelta = 1;
        hcb.yunits = 0;
        hcb.enabled_streaming_pcut = false;
        if (!overrides) {
          overrides = {};
        }
        for (var field in overrides) {
          hcb[field] = overrides[field];
        }
        hcb["xunits"] = m.unit_lookup(hcb["xunits"]);
        hcb["yunits"] = m.unit_lookup(hcb["yunits"]);
        if (hcb["subsize"] > 1) {
          hcb.type = 2E3;
        }
        hcb["class"] = hcb.type / 1E3;
        if (hcb["class"] === 2 && overrides["subsize"] === undefined) {
          throw "subsize must be provided with type 2000 files";
        }
        if (!overrides.pipe) {
          hcb.setData(data);
        } else {
          hcb.pipe = true;
          hcb.in_byte = 0;
          hcb.out_byte = 0;
          var pipesize = overrides.pipesize || m.PIPESIZE;
          hcb.buf = new ArrayBuffer(pipesize);
          hcb.setData(hcb.buf);
          hcb.data_free = hcb.dview.length;
        }
        return hcb;
      };
      m.force1000 = function(hcb) {
        if (hcb["class"] === 2) {
          if (hcb.size && !hcb.pipe) {
            hcb.size = hcb.subsize * hcb.size;
          } else {
            hcb.size = 0;
          }
          hcb.bpe = hcb.bpe / hcb.subsize;
          hcb.ape = 1;
        }
      };
      m.grab = function(hcb, bufview, start, nget) {
        if (!hcb.dview) {
          return 0;
        }
        if (hcb.format[0] === "C") {
          start = start * 2;
        }
        nget = hcb.ape * nget;
        var ngot = Math.min(bufview.length, hcb.dview.length - start);
        if (bufview.set === undefined) {
          for (var i = 0;i < ngot;i++) {
            bufview[i] = hcb.dview[start + i];
          }
        } else {
          bufview.set(hcb.dview.subarray(start, start + ngot));
        }
        if (hcb.format[0] === "C") {
          ngot = ngot / 2;
        }
        return ngot;
      };
      m.filad = function(hcb, data, sync) {
        if (hcb.data_free < data.length) {
          throw "Pipe full";
        }
        var sidx = hcb.in_byte / hcb.dview.BYTES_PER_ELEMENT;
        var eidx = sidx + data.length;
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
          hcb.in_byte = tail * hcb.dview.BYTES_PER_ELEMENT;
        } else {
          hcb.dview.set(data, sidx);
          hcb.in_byte = eidx * hcb.dview.BYTES_PER_ELEMENT % hcb.buf.byteLength;
        }
        hcb.data_free -= data.length;
        if (hcb.onwritelisteners) {
          for (var i = 0;i < hcb.onwritelisteners.length;i++) {
            if (!sync) {
              window.setTimeout(hcb.onwritelisteners[i], 0);
            } else {
              hcb.onwritelisteners[i]();
            }
          }
        }
      };
      m.pavail = function(hcb) {
        return hcb.dview.length - hcb.data_free;
      };
      m.grabx = function(hcb, dview, nget, offset) {
        var navail = hcb.dview.length - hcb.data_free;
        if (offset === undefined) {
          offset = 0;
        }
        if (!nget) {
          nget = Math.min(dview.length - offset, navail);
        } else {
          if (nget > dview.length - offset) {
            throw "m.grabx : nget larger then available buffer space";
          }
        }
        if (nget < 0) {
          throw "m.grabx : nget cannot be negative";
        }
        if (nget > navail) {
          return 0;
        }
        var sidx = hcb.out_byte / hcb.dview.BYTES_PER_ELEMENT;
        var eidx = sidx + nget;
        if (eidx >= hcb.dview.length) {
          var head = hcb.dview.length - sidx;
          eidx = eidx - hcb.dview.length;
          dview.set(hcb.dview.subarray(sidx, hcb.dview.length), offset);
          dview.set(hcb.dview.subarray(0, eidx), offset + head);
        } else {
          dview.set(hcb.dview.subarray(sidx, eidx), offset);
        }
        hcb.out_byte = eidx * hcb.dview.BYTES_PER_ELEMENT % hcb.buf.byteLength;
        hcb.data_free += nget;
        var ngot = nget;
        return ngot;
      };
      m.addPipeWriteListener = function(hcb, onwrite) {
        if (!hcb.onwritelisteners) {
          hcb.onwritelisteners = [];
        }
        if (hcb.onwritelisteners.indexOf(onwrite) === -1) {
          hcb.onwritelisteners.push(onwrite);
        }
      };
      m.units_name = function(units) {
        var u = UNITS[units];
        return u[0] + " (" + u[1] + ")";
      };
      m.trim_name = function(pathfilename) {
        var i = pathfilename.indexOf("]");
        if (i === -1) {
          i = pathfilename.indexOf("/");
        }
        if (i === -1) {
          i = pathfilename.indexOf(":");
        }
        var j = pathfilename.substr(i + 1, pathfilename.length).indexOf(".");
        if (j < 0) {
          j = pathfilename.length - i;
        }
        var filename = pathfilename.substr(i + 1, i + j + 1);
        return filename;
      };
      m.label = function(units, mult) {
        var u = ["Unknown", "U"];
        if (typeof units === "string") {
          u = [units, null];
        } else {
          if (Array.isArray(units)) {
            u = units;
          } else {
            u = UNITS[units];
            if (u === undefined) {
              u = ["Unknown", "U"];
            }
          }
        }
        var prefix = m.mult_prefix(mult);
        if (u[1]) {
          return u[0] + " (" + prefix + u[1] + ")";
        } else {
          return u[0];
        }
      };
      m.bound = function(a, b, c) {
        return a < b ? b : a > c ? c : a;
      };
      m.touch_distance = function(touchA, touchB) {
        var xd = touchA.pageX - touchB.pageX;
        var yd = touchA.pageY - touchB.pageY;
        return Math.sqrt(xd * xd + yd * yd);
      };
      m.mult_prefix = function(mult) {
        var prefix = "?";
        if (mult == 1) {
          prefix = "";
        } else {
          if (mult == 10) {
            prefix = "da";
          } else {
            if (mult == 0.1) {
              prefix = "d";
            } else {
              if (mult == 100) {
                prefix = "h";
              } else {
                if (mult == 0.01) {
                  prefix = "c";
                } else {
                  if (mult == 1E3) {
                    prefix = "K";
                  } else {
                    if (mult == 0.001) {
                      prefix = "m";
                    } else {
                      if (mult == 1E6) {
                        prefix = "M";
                      } else {
                        if (mult == 1E-6) {
                          prefix = "u";
                        } else {
                          if (mult == 1E9) {
                            prefix = "G";
                          } else {
                            if (mult == 1E-9) {
                              prefix = "n";
                            } else {
                              if (mult == 1E12) {
                                prefix = "T";
                              } else {
                                if (mult == 1E-12) {
                                  prefix = "p";
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return prefix;
      };
      var VECTOR = {MV:"F", MS:"F", nbpt:4, view:undefined};
      m.vstype = function(ctype) {
        VECTOR.MS = ctype;
        VECTOR.MV = ctype;
        if (VECTOR.MV === "D") {
          VECTOR.nbpt = 8;
        } else {
          if (VECTOR.MV === "L" || VECTOR.MV === "F") {
            VECTOR.nbpt = 4;
          } else {
            if (VECTOR.MV === "I") {
              VECTOR.nbpt = 2;
            } else {
              if (VECTOR.MV === "B") {
                VECTOR.nbpt = 1;
              } else {
                alert("Unsupported vector type");
              }
            }
          }
        }
      };
      m.log10 = function(v, lo_thresh) {
        if (lo_thresh === undefined) {
          lo_thresh = 1E-20;
        }
        return Math.log(Math.max(v, lo_thresh)) / Math.log(10);
      };
      m.vlog10 = function(src, lo_thresh, dst) {
        if (lo_thresh === undefined) {
          lo_thresh = 1E-20;
        }
        if (dst === undefined) {
          dst = src;
        }
        for (var i = 0;i < src.length;i++) {
          if (dst.length <= i) {
            break;
          }
          dst[i] = Math.log(Math.max(src[i], lo_thresh)) / Math.log(10);
        }
      };
      m.vlogscale = function(src, lo_thresh, dbscale, dst) {
        if (lo_thresh === undefined) {
          lo_thresh = 1E-20;
        }
        if (dbscale === undefined) {
          dbscale = 1;
        }
        if (dst === undefined) {
          dst = src;
        }
        for (var i = 0;i < src.length;i++) {
          if (dst.length <= i) {
            break;
          }
          dst[i] = Math.log(Math.abs(Math.max(src[i], lo_thresh))) / Math.log(10);
          dst[i] = dst[i] * dbscale;
        }
      };
      m.cvmag2logscale = function(src, lo_thresh, dbscale, dst) {
        if (lo_thresh === undefined) {
          lo_thresh = 1E-20;
        }
        if (dbscale === undefined) {
          dbscale = 1;
        }
        if (dst === undefined) {
          dst = src;
        }
        var j = 0;
        for (var i = 0;i < dst.length;i++) {
          j = 2 * i + 1;
          if (j >= src.length) {
            break;
          }
          dst[i] = src[j - 1] * src[j - 1] + src[j] * src[j];
          dst[i] = Math.log(Math.abs(Math.max(dst[i], lo_thresh))) / Math.log(10);
          dst[i] = dst[i] * dbscale;
        }
      };
      m.vsmul = function(src, mul, dst, count) {
        if (dst === undefined) {
          dst = src;
        }
        if (count === undefined) {
          count = dst.length;
        }
        count = Math.min(dst.length, count);
        count = Math.min(src.length, count);
        for (var i = 0;i < count;i++) {
          if (dst.length <= i) {
            break;
          }
          dst[i] = src[i] * mul;
        }
      };
      m.vmxmn = function(vec, size) {
        var smax = vec[0];
        var smin = vec[0];
        var imax = 0;
        var imin = 0;
        size = Math.min(size, vec.length);
        for (var i = 0;i < size;i++) {
          if (vec[i] > smax) {
            smax = vec[i];
            imax = i;
          }
          if (vec[i] < smin) {
            smin = vec[i];
            imin = i;
          }
        }
        return{smax:smax, smin:smin, imax:imax, imin:imin};
      };
      m.vmov = function(src, sstride, dest, dstride, count) {
        if (count === undefined) {
          count = src.length;
        }
        count = Math.min(src.length, count);
        for (var i = 0;i < count;i++) {
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
      m.vfill = function(vec, inpval, count) {
        if (count === undefined) {
          count = vec.length;
        }
        count = Math.min(vec.length, count);
        for (var i = 0;i < count;i++) {
          vec[i] = inpval;
        }
      };
      m.vabs = function(vec, dest, count) {
        if (count === undefined) {
          count = vec.length;
        }
        if (dest === undefined) {
          dest = vec;
        }
        for (var i = 0;i < count;i++) {
          dest[i] = Math.abs(vec[i]);
        }
      };
      m.cvmag = function(cxvec, dest, count) {
        if (count === undefined) {
          count = dest.length;
        }
        count = Math.min(dest.length, count);
        for (var i = 0;i < count;i++) {
          var j = 2 * i + 1;
          if (j >= cxvec.length) {
            break;
          }
          dest[i] = Math.sqrt(cxvec[j - 1] * cxvec[j - 1] + cxvec[j] * cxvec[j]);
        }
      };
      m.cvmag2 = function(cxvec, dest, count) {
        if (count === undefined) {
          count = dest.length;
        }
        count = Math.min(dest.length, count);
        var j = 0;
        for (var i = 0;i < count;i++) {
          j = 2 * i + 1;
          if (j >= cxvec.length) {
            break;
          }
          dest[i] = cxvec[j - 1] * cxvec[j - 1] + cxvec[j] * cxvec[j];
        }
      };
      m.cvpha = function(cxvec, dest, count) {
        if (count === undefined) {
          count = dest.length;
        }
        count = Math.min(dest.length, count);
        var j = 0;
        var re = 0;
        var im = 0;
        for (var i = 0;i < count;i++) {
          j = 2 * i + 1;
          if (j >= cxvec.length) {
            break;
          }
          re = cxvec[j - 1];
          im = cxvec[j];
          if (re === 0 && im === 0) {
            re = 1;
          }
          dest[i] = Math.atan2(im, re);
        }
      };
      m.cvphad = function(cxvec, dest, count) {
        if (count === undefined) {
          count = dest.length;
        }
        count = Math.min(dest.length, count);
        var j = 0;
        var re = 0;
        var im = 0;
        for (var i = 0;i < count;i++) {
          j = 2 * i + 1;
          if (j >= cxvec.length) {
            break;
          }
          re = cxvec[j - 1];
          im = cxvec[j];
          if (re === 0 && im === 0) {
            re = 1;
          }
          dest[i] = Math.atan2(im, re) * (180 / Math.PI);
        }
      };
      m.trunc = function(n) {
        return n - n % 1;
      };
      m.sign = function(a1, a2) {
        if (a2 >= 0) {
          return Math.abs(a1);
        } else {
          return-Math.abs(a1);
        }
      };
      function pad2(number) {
        return(number < 10 ? "0" : "") + number;
      }
      m.sec2tod = function(sec, trim_trailing_zeros) {
        var tod = "";
        var j1950 = Date.UTC(1950, 0, 1);
        var j1950Date = new Date(j1950);
        var j1949 = Date.UTC(1949, 11, 31);
        var j1949Date = new Date(j1949);
        var d = new Date;
        var midnightToday = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        var diffDaySecs = 86400;
        var diffYearSecs = 31536E3;
        var negDiffYearSecs = -1 * diffYearSecs;
        if (sec >= 0) {
          if (sec < diffDaySecs) {
            var millisecs = midnightToday.getTime() + sec * 1E3;
            var d = new Date(millisecs);
            tod = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
          } else {
            if (sec === 86400) {
              tod = "24:00:00";
            } else {
              if (sec < diffYearSecs) {
                var days = sec / diffDaySecs;
                days = [days > 0 ? Math.floor(days) : Math.ceil(days)];
                var d = new Date(sec * 1E3 + midnightToday.getTime());
                tod = days.toString() + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
              } else {
                var secMilli = Math.floor(sec * 1E3) + j1950;
                d = new Date(secMilli);
                tod = d.getUTCFullYear() + ":" + pad2(d.getUTCMonth() + 1) + ":" + pad2(d.getUTCDate()) + "::" + pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds());
              }
            }
          }
        } else {
          if (sec > negDiffYearSecs) {
            var days = sec / diffDaySecs;
            days = days <= 0 ? Math.ceil(days) : Math.floor(days);
            var d = new Date(Math.abs(sec * 1E3) + midnightToday.getTime());
            if (days === 0) {
              days = "-0";
            } else {
              days = days.toString();
            }
            tod = days + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
          } else {
            var secMilli = Math.floor(sec * 1E3) + j1950;
            d = new Date(secMilli);
            tod = d.getUTCFullYear() + ":" + pad2(d.getUTCMonth() + 1) + ":" + pad2(d.getUTCDate()) + "::" + pad2(d.getUTCHours()) + ":" + pad2(d.getUTCMinutes()) + ":" + pad2(d.getUTCSeconds());
          }
        }
        var fractional = sec % 1;
        if (fractional === 0) {
          tod += ".000000";
        } else {
          tod += "." + Math.abs(sec % 1).toPrecision(6).slice(2, 8);
        }
        if (trim_trailing_zeros) {
          var dloc = tod.indexOf(".");
          var zloc = -1;
          if (dloc !== -1) {
            zloc = tod.substr(dloc, tod.length).indexOf("0");
          }
          if (zloc !== -1) {
            tod = tod.substr(0, dloc + zloc);
          }
        }
        return tod;
      };
      var j1950offset = (20 * 365 + 5) * (24 * 3600);
      m.sec2tspec = function(sec, mode, trim_trailing_zeros) {
        mode = mode || "";
        if (sec >= 0 && sec <= 86400) {
          return m.sec2tod(sec, trim_trailing_zeros);
        } else {
          sec = sec % 86400;
          if (mode !== "delta" && sec <= 0) {
            return m.sec2tod(sec + 86400, trim_trailing_zeros);
          } else {
            if (mode === "delta" && sec <= 0) {
              return "-" + m.sec2tod(-1 * sec, trim_trailing_zeros);
            } else {
              return m.sec2tod(sec, trim_trailing_zeros);
            }
          }
        }
      };
      m.sec2tod_j1970 = function(sec) {
        var tod = "";
        var d;
        if (sec >= 0 && sec < 86400) {
          d = new Date(sec * 1E3);
          tod = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
        } else {
          if (sec < 0 && sec > -31536E3) {
            var days = -1 * (sec / (24 * 60 * 60));
            d = new Date(sec * 1E3);
            tod = days.toString() + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
          } else {
            d = new Date((sec - j1950offset) * 1E3);
            tod = d.getFullYear() + ":" + pad2(d.getMonth()) + ":" + pad2(d.getDate()) + "::" + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
          }
        }
        if (sec % 1 !== 0) {
          tod += "." + (sec % 1).toPrecision(6).slice(2, 8);
        }
        return tod;
      };
      m.j1970toj1950 = function(t) {
        if (t.getTime !== undefined) {
          return t.getTime() / 1E3 + j1950offset;
        } else {
          return t + j1950offset;
        }
      };
      m.j1950toj1970 = function(t) {
        return t - j1950offset;
      };
      m.throttle = function(delay, callback) {
        var previousCall = (new Date).getTime();
        return function() {
          var time = (new Date).getTime();
          if (time - previousCall >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
          }
        };
      };
      module.exports = m;
    })();
  }, {"./bluefile":2, "loglevel":10}], 5:[function(require, module, exports) {
    (function(global) {
      var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false;
      var headerTextBegin = 1;
      var headerTextEnd = 116;
      var subsysOffsetBegin = 117;
      var subsysOffsetEnd = 124;
      var versionOffsetBegin = 125;
      var versionOffsetEnd = 126;
      var endianCharsBegin = 127;
      var endianCharsEnd = 128;
      var firstDataTypeOffsetBegin = 129;
      var firstDataTypeOffsetEnd = 132;
      var numBytesOffsetBegin = 133;
      var numBytesOffsetEnd = 136;
      function endianness() {
        var b = new ArrayBuffer(4);
        var a = new Uint32Array(b);
        var c = new Uint8Array(b);
        a[0] = 3735928559;
        if (c[0] === 239) {
          return "LE";
        }
        if (c[0] === 222) {
          return "BE";
        }
        throw new Error("unknown endianness");
      }
      function getDataField(fileData, firstByte, lastByte) {
        return fileData.slice(firstByte - 1, lastByte);
      }
      var ARRAY_BUFFER_ENDIANNESS = endianness();
      var versionNames = {256:"MAT-file"};
      var dataTypeNames = {1:{name:"miINT8", size:1}, 2:{name:"miUINT8", size:1}, 3:{name:"miINT16", size:2}, 4:{name:"miUINT16", size:2}, 5:{name:"miINT32", size:4}, 6:{name:"miUINT32", size:4}, 7:{name:"miSINGLE", size:4}, 9:{name:"miDOUBLE", size:8}, 12:{name:"miINT64", size:8}, 13:{name:"miUINT64", size:8}, 14:{name:"miMATRIX", size:null}, 15:{name:"miCOMPRESSED", size:null}, 16:{name:"miUTF8", size:null}, 17:{name:"miUTF16", size:null}, 18:{name:"miUTF32", size:null}};
      var arrayClassNames = {1:"mxCELL_CLASS", 2:"mxSTRUCT_CLASS", 3:"mxOBJECT_CLASS", 4:"mxCHAR_CLASS", 5:"mxSPARSE_CLASS", 6:"mxDOUBLE_CLASS", 7:"mxSINGLE_CLASS", 8:"mxINT8_CLASS", 9:"mxUINT8_CLASS", 10:"mxINT16_CLASS", 11:"mxUINT16_CLASS", 12:"mxINT32_CLASS", 13:"mxUINT32_CLASS", 14:"mxINT64_CLASS", 15:"mxUINT64_CLASS"};
      var _SPA = {"S":1, "C":2, "V":3, "Q":4, "M":9, "X":10, "T":16, "U":1, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9};
      var _BPS = {"P":0.125, "A":1, "O":1, "B":1, "I":2, "L":4, "X":8, "F":4, "D":8};
      var _XM_TO_TYPEDARRAY = {"P":null, "A":null, "O":Uint8Array, "B":Int8Array, "I":Int16Array, "L":Int32Array, "X":null, "F":Float32Array, "D":Float64Array};
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
      function ab2str(buf) {
        var uintbuf = new Uint8Array(buf);
        if (_applySupportsTypedArray) {
          return String.fromCharCode.apply(null, uintbuf);
        } else {
          var str = "";
          for (var i = 0;i < uintbuf.length;i++) {
            str += String.fromCharCode(uintbuf[i]);
          }
          return str;
        }
      }
      function str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2);
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length;i < strLen;i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }
      function pow2(n) {
        return n >= 0 && n < 31 ? 1 << n : pow2[n] || (pow2[n] = Math.pow(2, n));
      }
      function getArray(arrayBuff, startByte, byteLength, type) {
        var outArr = [];
        var dv = new DataView(arrayBuff, startByte, byteLength);
        var array;
        if (type === "miINT8") {
          array = new Int8Array(arrayBuff, startByte, byteLength);
        } else {
          if (type === "miUINT8") {
            array = new Uint8Array(arrayBuff, startByte, byteLength);
          } else {
            if (type === "miINT16") {
              array = new Int16Array(arrayBuff, startByte, byteLength);
            } else {
              if (type === "miUINT16") {
                array = new Uint16Array(arrayBuff, startByte, byteLength);
              } else {
                if (type === "miINT32") {
                  array = new Int32Array(arrayBuff, startByte, byteLength);
                } else {
                  if (type === "miUINT32") {
                    array = new Uint32Array(arrayBuff, startByte, byteLength);
                  } else {
                    if (type === "miDOUBLE") {
                      array = new Float64Array(arrayBuff, startByte, byteLength);
                    } else {
                      window.console.warn("Array data type not supported yet.");
                      return;
                    }
                  }
                }
              }
            }
          }
        }
        array.forEach(function(element) {
          outArr.push(element);
        });
        return outArr;
      }
      function getDataWithType(dv, typeName, offset, littleEndian) {
        var output;
        switch(typeName) {
          case "miINT8":
            output = dv.getInt8(offset, littleEndian);
            break;
          case "miUINT8":
            output = dv.getInt8(offset, littleEndian);
            break;
          case "miINT16":
            output = dv.getInt16(offset, littleEndian);
            break;
          case "miUINT16":
            output = dv.getUint16(offset, littleEndian);
            break;
          case "miINT32":
            output = dv.getInt32(offset, littleEndian);
            break;
          case "miUINT32":
            output = dv.getUint32(offset, littleEndian);
            break;
          case "miSINGLE":
            output = dv.getFloat32(offset, littleEndian);
            break;
          case "miDOUBLE":
            output = dv.getFloat64(offset, littleEndian);
            break;
          case "miINT64":
            output = getInt64(dv, offset, littleEndian);
            break;
          default:
            window.console.warn(typeName + " not supported at thsi time");
            break;
        }
        return output;
      }
      function MatHeader(buf, options) {
        this.file = null;
        this.file_name = null;
        this.buf = buf;
        if (this.buf != null) {
          var dvhdr = new DataView(this.buf);
          this.headerStr = ab2str(this.buf.slice(headerTextBegin - 1, headerTextEnd));
          this.datarep = ab2str(this.buf.slice(endianCharsBegin - 1, endianCharsEnd));
          var littleEndianHdr = this.datarep === "IM";
          var littleEndianData = this.datarep === "IM";
          this.headerList = this.headerStr.split(",").map(function(str) {
            return str.trim();
          });
          this.matfile = this.headerList[0];
          this.platform = this.headerList[1];
          this.createdOn = this.headerList[2];
          this.subsystemOffset = ab2str(this.buf.slice(subsysOffsetBegin - 1, subsysOffsetEnd));
          this.version = dvhdr.getUint16(versionOffsetBegin - 1, littleEndianHdr);
          this.versionName = versionNames[this.version];
          this.dataType = dvhdr.getUint32(firstDataTypeOffsetBegin - 1, littleEndianHdr);
          this.dataTypeName = dataTypeNames[this.dataType].name;
          this.arraySize = dvhdr.getUint32(numBytesOffsetBegin - 1, littleEndianHdr);
          var beginArray = numBytesOffsetEnd + 1;
          var currIndex = numBytesOffsetEnd + 1;
          var typeNum = dvhdr.getUint32(currIndex - 1, littleEndianHdr);
          var typeName = dataTypeNames[typeNum].name;
          var typeSize = dataTypeNames[typeNum].size;
          currIndex += 4;
          var flagLength = getDataWithType(dvhdr, typeName, currIndex - 1, littleEndianData);
          currIndex += typeSize;
          var arrayFlag = getDataWithType(dvhdr, typeName, currIndex - 1, littleEndianData);
          currIndex += typeSize;
          var complexFlag = arrayFlag & 128;
          var globalFlag = arrayFlag & 64;
          var logicalFlag = arrayFlag & 32;
          var arrayClassNum = arrayFlag & 15;
          var arrayClassName = arrayClassNames[arrayClassNum];
          currIndex += typeSize;
          var dimTypeNum = dvhdr.getUint32(currIndex - 1, littleEndianData);
          currIndex += 4;
          var dimTypeName = dataTypeNames[dimTypeNum].name;
          var dimTypeSize = dataTypeNames[dimTypeNum].size;
          var arrayDimTotalSize = dvhdr.getUint32(currIndex - 1, littleEndianData);
          currIndex += 4;
          var rows = getDataWithType(dvhdr, dimTypeName, currIndex - 1, littleEndianData);
          currIndex += dimTypeSize;
          if (rows > 1) {
            window.console.warn("Only 1D arrays are currently supported.");
          }
          var cols = getDataWithType(dvhdr, dimTypeName, currIndex - 1, littleEndianData);
          currIndex += typeSize;
          var arrayNameTypeNum = dvhdr.getUint32(currIndex - 1, littleEndianData);
          currIndex += 4;
          var nameSize = 0;
          var small = false;
          if (arrayNameTypeNum > 15) {
            arrayNameTypeNum &= 255;
            small = true;
            nameSize = dvhdr.getUint16(currIndex - 5, littleEndianData);
          }
          var arrayNameTypeName = dataTypeNames[arrayNameTypeNum].name;
          var arrayNameTypeSize = dataTypeNames[arrayNameTypeNum].size;
          if (!small) {
            nameSize = getDataWithType(dvhdr, arrayNameTypeName, currIndex - 1, littleEndianData);
            currIndex += 4;
          }
          var arrayName = ab2str(this.buf.slice(currIndex - 1, currIndex + nameSize - 1));
          var rndUp;
          if (small) {
            rndUp = (4 - nameSize % 4) % 4;
          } else {
            rndUp = (8 - nameSize % 8) % 8;
          }
          var jumpTo = nameSize + rndUp;
          currIndex += jumpTo;
          this.setData(this.buf, dvhdr, currIndex, littleEndianData);
        }
      }
      MatHeader.prototype = {setData:function(buf, dvhdr, currIndex, littleEndian) {
        var arrayValSize;
        var typeNum = dvhdr.getUint32(currIndex - 1, littleEndian);
        var small = false;
        if (typeNum > 15) {
          typeNum &= 255;
          small = true;
          arrayValSize = dvhdr.getUint16(currIndex + 1, 2, littleEndian);
        } else {
          currIndex += 4;
        }
        var typeName = dataTypeNames[typeNum].name;
        var typeSize = dataTypeNames[typeNum].size;
        if (!small) {
          arrayValSize = dvhdr.getUint32(currIndex - 1, littleEndian);
          small = false;
        }
        currIndex += 4;
        this.dview = getArray(buf, currIndex - 1, arrayValSize / typeSize, typeName);
      }};
      function parseURL(url) {
        var a = document.createElement("a");
        a.href = url;
        return{source:url, protocol:a.protocol.replace(":", ""), host:a.hostname, port:a.port, query:a.search, params:function() {
          var ret = {}, seg = a.search.replace(/^\?/, "").split("&"), len = seg.length, i = 0, s;
          for (;i < len;i++) {
            if (!seg[i]) {
              continue;
            }
            s = seg[i].split("=");
            ret[s[0]] = s[1];
          }
          return ret;
        }(), file:(a.pathname.match(/\/([^\/?#]+)$/i) || [null, ""])[1], hash:a.hash.replace("#", ""), path:a.pathname.replace(/^([^\/])/, "/$1"), relative:(a.href.match(/tps?:\/\/[^\/]+(.+)/) || [null, ""])[1], segments:a.pathname.replace(/^\//, "").split("/")};
      }
      function text2buffer(text, oncomplete, blocksize) {
        blocksize = blocksize || 1024;
        var i = 0;
        var arrayBuffer = new ArrayBuffer(text.length);
        var bufView = new Uint8Array(arrayBuffer);
        var worker = function() {
          var end = i + blocksize;
          for (;i < end;i++) {
            bufView[i] = text.charCodeAt(i) & 255;
          }
          if (i >= text.length) {
            oncomplete(arrayBuffer);
          } else {
            setTimeout(worker, 0);
          }
        };
        setTimeout(worker, 0);
      }
      function MatFileReader(options) {
        this.options = options;
      }
      MatFileReader.prototype = {readheader:function readheader(theFile, onload) {
        var that = this;
        var reader = new FileReader;
        var blob = theFile.webkitSlice(0, 116);
        reader.onloadend = function(theFile) {
          return function(e) {
            if (e.target.error) {
              onload(null);
              return;
            }
            var rawhdr = reader.result;
            var hdr = new MatHeader(rawhdr, that.options);
            hdr.file = theFile;
            onload(hdr);
          };
        }(theFile);
        reader.readAsArrayBuffer(blob);
      }, read:function read(theFile, onload) {
        var that = this;
        var reader = new FileReader;
        reader.onloadend = function(theFile) {
          return function(e) {
            if (e.target.error) {
              onload(null);
              return;
            }
            var raw = reader.result;
            var hdr = new MatHeader(raw, that.options);
            hdr.file = theFile;
            hdr.file_name = theFile.name;
            onload(hdr);
          };
        }(theFile);
        reader.readAsArrayBuffer(theFile);
      }, read_http:function read_http(href, onload) {
        var that = this;
        var oReq = new XMLHttpRequest;
        oReq.open("GET", href, true);
        oReq.responseType = "arraybuffer";
        oReq.overrideMimeType("text/plain; charset=x-user-defined");
        oReq.onload = function(oEvent) {
          if (oReq.readyState === 4) {
            if (oReq.status === 200 || oReq.status === 0) {
              var arrayBuffer = null;
              if (oReq.response) {
                arrayBuffer = oReq.response;
                var hdr = new MatHeader(arrayBuffer, that.options);
                parseURL(href);
                var fileUrl = parseURL(href);
                hdr.file_name = fileUrl.file;
                onload(hdr);
              } else {
                if (oReq.responseText) {
                  text2buffer(oReq.responseText, function(arrayBuffer) {
                    var hdr = new MatHeader(arrayBuffer, that.options);
                    parseURL(href);
                    var fileUrl = parseURL(href);
                    hdr.file_name = fileUrl.file;
                    onload(hdr);
                  });
                }
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
      }};
      global["MatHeader"] = global["MatHeader"] || MatHeader;
      global["MatFileReader"] = global["MatFileReader"] || MatFileReader;
    })(this);
  }, {}], 6:[function(require, module, exports) {
    (function() {
      var tinycolor = require("tinycolor2");
      var common = require("./common");
      var CanvasInput = require("./CanvasInput");
      var m = require("./m");
      function mx() {
      }
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
      mx.L_ArrowLeft = 1001;
      mx.L_ArrowRight = 1002;
      mx.L_ArrowUp = 1003;
      mx.L_ArrowDown = 1004;
      mx.L_dashed = 801;
      mx.GBorder = 3;
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
      mx.LEGACY_RENDER = false;
      mx.STKSTRUCT = function() {
        this.xmin = 0;
        this.xmax = 0;
        this.ymin = 0;
        this.ymax = 0;
        this.xscl = 0;
        this.yscl = 0;
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
      };
      mx.SCROLLBAR = function() {
        this.flag = null;
        this.action = null;
        this.smin = null;
        this.srange = null;
        this.tmin = null;
        this.trange = null;
        this.step = null;
        this.page = null;
        this.scale = null;
        this.dragoutline = null;
        this.initial_pause = null;
        this.repeat_pause = null;
        this.x = null;
        this.y = null;
        this.w = null;
        this.h = null;
        this.s1 = null;
        this.sw = null;
        this.swmin = null;
        this.soff = null;
        this.a1 = null;
        this.a2 = null;
        this.arrow = null;
        this.mxevent = null;
        this.origin = null;
        this.repeat_count = null;
      };
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
      function MX(element) {
        this.root = element;
        this.parent = document.createElement("div");
        this.parent.style.position = "relative";
        this.parent.width = element.clientWidth;
        this.parent.height = element.clientHeight;
        element.appendChild(this.parent);
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px";
        this.canvas.width = element.clientWidth;
        this.canvas.height = element.clientHeight;
        this.parent.appendChild(this.canvas);
        this.active_canvas = this.canvas;
        this.wid_canvas = document.createElement("canvas");
        this.wid_canvas.style.position = "absolute";
        this.wid_canvas.style.top = "0px";
        this.wid_canvas.style.left = "0px";
        this.wid_canvas.style.zIndex = 1;
        this.wid_canvas.width = element.clientWidth;
        this.wid_canvas.height = element.clientHeight;
        this.parent.appendChild(this.wid_canvas);
        this.font = undefined;
        this.font_family = "Courier New, monospace";
        this.text_w = 0;
        this.text_h = 0;
        this.level = 0;
        this.width = this.parent.width;
        this.height = this.parent.height;
        this.xpos = 0;
        this.ypos = 0;
        this.xmrk = 0;
        this.ymrk = 0;
        this.origin = 1;
        this.stk = [new mx.STKSTRUCT];
        mx.setbgfg(this, "black", "white");
        this.event_cb = undefined;
        this.warpbox = undefined;
        this.rmode = false;
        this.linewidth = 1;
        this.style = undefined;
        this.xi = false;
        this.button_release = 0;
        this.button_press = 0;
        this.state_mask = 0;
        this.l = 0;
        this.r = this.width;
        this.t = 0;
        this.b = this.height;
        this.scrollbar_x = new mx.SCROLLBAR;
        this.scrollbar_y = new mx.SCROLLBAR;
        this.prompt = undefined;
        this.pixel = [];
        this._renderCanvas = document.createElement("canvas");
      }
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
      mx.open = function(element) {
        var Mx = new MX(element);
        Mx.wid_canvas.oncontextmenu = function(event) {
          event.preventDefault();
          return false;
        };
        this._ctx = Mx.active_canvas.getContext("2d");
        Mx.onmousemove = function(Mx) {
          return function(e) {
            var rect = e.target.getBoundingClientRect();
            Mx.x = e.x || e.clientX;
            Mx.y = e.y || e.clientY;
            Mx.xpos = e.offsetX === undefined ? e.pageX - rect.left - window.scrollX : e.offsetX;
            Mx.ypos = e.offsetX === undefined ? e.pageY - rect.top - window.scrollY : e.offsetY;
            if (Mx.warpbox) {
              if ((e.ctrlKey || e.metaKey) && Mx.warpbox.alt_style !== undefined) {
                Mx.warpbox.style = Mx.warpbox.alt_style;
              } else {
                Mx.warpbox.style = Mx.warpbox.def_style;
              }
              mx.redraw_warpbox(Mx);
            }
            mx.widget_callback(Mx, e);
          };
        }(Mx);
        Mx.onmouseup = function(Mx) {
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
                  } else {
                    if (old_warpbox.mode === "horizontal") {
                      yo = Mx.t;
                      yl = Mx.b;
                    }
                  }
                  old_warpbox.func(event, xo, yo, xl, yl, old_warpbox.style.return_value, old_warpbox.mode);
                }
              }
            }
            mx.widget_callback(Mx, event);
          };
        }(Mx);
        Mx.onmousedown = function(Mx) {
          return function(event) {
            event.preventDefault();
            mx.widget_callback(Mx, event);
            return false;
          };
        }(Mx);
        Mx.onkeydown = function(Mx) {
          return function(event) {
            if (Mx.warpbox) {
              var keyCode = common.getKeyCode(event);
              if ((keyCode === 17 || (keyCode === 224 || (keyCode === 91 || keyCode === 93))) && Mx.warpbox.style !== Mx.warpbox.alt_style) {
                Mx.warpbox.style = Mx.warpbox.alt_style;
                mx.redraw_warpbox(Mx);
              }
            }
            mx.widget_callback(Mx, event);
          };
        }(Mx);
        Mx.onkeyup = function(Mx) {
          return function(event) {
            if (Mx.warpbox) {
              var keyCode = common.getKeyCode(event);
              if ((keyCode === 17 || (keyCode === 224 || (keyCode === 91 || keyCode === 93))) && Mx.warpbox.style !== Mx.warpbox.def_style) {
                Mx.warpbox.style = Mx.warpbox.def_style;
                mx.redraw_warpbox(Mx);
              }
            }
          };
        }(Mx);
        Mx.ontouchend = function(Mx) {
          return function(event) {
            Mx.onmouseup({which:1});
          };
        }(Mx);
        Mx.ontouchmove = function(Mx) {
          return function(event) {
            var element = Mx.canvas;
            var offsetX = 0;
            var offsetY = 0;
            if (element.offsetParent !== undefined) {
              do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
              } while (element = element.offsetParent);
            }
            Mx.xpos = event.targetTouches[0].pageX - offsetX;
            Mx.ypos = event.targetTouches[0].pageY - offsetY;
            mx.redraw_warpbox(Mx);
          };
        }(Mx);
        mx.enableListeners(Mx);
        return Mx;
      };
      mx.enableListeners = function(Mx) {
        mx.addEventListener(Mx, "mousemove", Mx.onmousemove, false);
        window.addEventListener("mouseup", Mx.onmouseup, false);
        mx.addEventListener(Mx, "mousedown", Mx.onmousedown, false);
        window.addEventListener("keydown", Mx.onkeydown, false);
        window.addEventListener("keyup", Mx.onkeyup, false);
      };
      mx.disableListeners = function(Mx) {
        mx.removeEventListener(Mx, "mousemove", Mx.onmousemove, false);
        window.removeEventListener("mouseup", Mx.onmouseup, false);
        mx.removeEventListener(Mx, "mousedown", Mx.onmousedown, false);
        window.removeEventListener("keydown", Mx.onkeydown, false);
        window.removeEventListener("keyup", Mx.onkeyup, false);
      };
      mx.addEventListener = function(Mx, event, callback, useCapture) {
        return Mx.wid_canvas.addEventListener(event, callback, useCapture);
      };
      mx.removeEventListener = function(Mx, event, callback, useCapture) {
        return Mx.wid_canvas.removeEventListener(event, callback, useCapture);
      };
      mx.dispatchEvent = function(Mx, event) {
        return Mx.wid_canvas.dispatchEvent(event);
      };
      mx.onWidgetLayer = function(Mx, func) {
        mx.onCanvas(Mx, Mx.wid_canvas, func);
      };
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
      mx.withWidgetLayer = function(Mx, func) {
        var f = function() {
          mx.onWidgetLayer(Mx, func);
        };
        return f;
      };
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
      mx.fullscreen = function(Mx, value) {
        if (value === undefined) {
          value = !Mx.fullscreen;
        }
        if (value) {
          Mx.fullscreen = {position:Mx.root.style.position, height:Mx.root.style.height, width:Mx.root.style.width, left:Mx.root.style.left, top:Mx.root.style.top, zIndex:Mx.root.style.zIndex};
          Mx.root.style.position = "fixed";
          Mx.root.style.height = "100%";
          Mx.root.style.width = "100%";
          Mx.root.style.left = "0px";
          Mx.root.style.top = "0px";
          Mx.root.style.zIndex = 16777271;
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
      mx.checkresize = function(Mx) {
        var canvas = Mx.canvas;
        if (canvas.height !== Mx.root.clientHeight || canvas.width !== Mx.root.clientWidth) {
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
      mx.invertbgfg = function(Mx) {
        mx.setbgfg(Mx, Mx.fg, Mx.bg, !Mx.xi);
      };
      mx.mixcolor = function(color1, color2, perc1to2) {
        var c1 = tinycolor(color1).toRgb();
        var c2 = tinycolor(color2).toRgb();
        var mix = 1 - perc1to2;
        c2.r = c1.r * mix + c2.r * perc1to2;
        c2.g = c1.g * mix + c2.g * perc1to2;
        c2.b = c1.b * mix + c2.b * perc1to2;
        return tinycolor(c2).toHexString(true);
      };
      mx.linear_gradient = function(Mx, x, y, w, h, fillStyle) {
        var ctx = Mx.active_canvas.getContext("2d");
        var step_size = 1 / fillStyle.length;
        var lingrad = ctx.createLinearGradient(x, y, w, h);
        for (var i = 0;i < fillStyle.length - 1;i++) {
          lingrad.addColorStop(step_size * i, fillStyle[i]);
        }
        lingrad.addColorStop(1, fillStyle[fillStyle.length - 1]);
        return lingrad;
      };
      mx.setbgfg = function(Mx, bg, fg, xi) {
        Mx.bg = tinycolor(bg).toHexString();
        Mx.fg = tinycolor(fg).toHexString();
        Mx.xi = tinycolor(xi).toHexString();
        if (tinycolor.equals(Mx.bg, "black") && tinycolor.equals(Mx.fg, "white")) {
          Mx.xwfg = Mx.fg;
          Mx.xwbg = "rgb(35%,35%,30%)";
          Mx.xwts = "rgb(60%,60%,55%)";
          Mx.xwbs = "rgb(25%,25%,20%)";
          Mx.xwms = mx.mixcolor(Mx.xwts, Mx.xwbs, 0.5);
          Mx.xwlo = "rgb(15%,15%,10%)";
          Mx.hi = Mx.xwts;
        } else {
          if (tinycolor.equals(Mx.bg, "white") && tinycolor.equals(Mx.fg, "black")) {
            Mx.xwfg = Mx.fg;
            Mx.xwbg = "rgb(60%,60%,55%)";
            Mx.xwts = "rgb(80%,80%,75%)";
            Mx.xwbs = "rgb(40%,40%,35%)";
            Mx.xwms = mx.mixcolor(Mx.xwts, Mx.xwbs, 0.5);
            Mx.xwlo = "rgb(70%,70%,65%)";
            Mx.hi = Mx.xwbs;
          } else {
            var clr = tinycolor(Mx.bg).toRgb();
            var hsp = Math.sqrt(0.299 * (clr.r * clr.r) + 0.587 * (clr.g * clr.g) + 0.114 * (clr.b * clr.b));
            if (hsp > 127.5) {
              Mx.xwfg = "black";
              Mx.xwbg = "rgb(60%,60%,55%)";
              Mx.xwts = "rgb(80%,80%,75%)";
              Mx.xwbs = "rgb(40%,40%,35%)";
              Mx.xwms = mx.mixcolor(Mx.xwts, Mx.xwbs, 0.5);
              Mx.xwlo = "rgb(70%,70%,65%)";
              Mx.hi = Mx.xwts;
            } else {
              Mx.xwfg = "white";
              Mx.xwbg = "rgb(35%,35%,30%)";
              Mx.xwts = "rgb(60%,60%,55%)";
              Mx.xwbs = "rgb(25%,25%,20%)";
              Mx.xwms = mx.mixcolor(Mx.xwts, Mx.xwbs, 0.5);
              Mx.xwlo = "rgb(15%,15%,10%)";
              Mx.hi = Mx.xwbs;
            }
          }
        }
      };
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
      mx.close = function(Mx) {
        var canvas = Mx.wid_canvas;
        canvas.removeEventListener("mousemove", Mx.onmousemove, false);
        canvas.removeEventListener("mouseup", Mx.onmouseup, false);
        if (Mx.parent && Mx.parent.parentNode) {
          Mx.parent.parentNode.removeChild(Mx.parent);
        }
      };
      mx.scrollbar = function(Mx, sb, xs, xe, ys, ye, out, qs, qe, mouseEvent, scrollbarState) {
        var mode;
        var action;
        var origin;
        var stat = 0;
        var step;
        var page;
        var scale;
        var sblocal = new mx.SCROLLBAR;
        mode = sb.flag !== undefined ? sb.flag : sb;
        action = Math.abs(mode);
        if (ye - ys > xe - xs) {
          if (Mx.origin < 3) {
            origin = 2;
          } else {
            origin = 4;
          }
        } else {
          if (Mx.origin & 2) {
            origin = 3;
          } else {
            origin = 1;
          }
        }
        if (action < 10) {
          sb = sblocal;
        }
        if (action < 10 || sb.action === 0) {
          mx.scroll(Mx, sb, mx.XW_INIT, undefined, scrollbarState);
          sb.flag = mode;
          sb.initial_pause = -1;
          mx.scroll_loc(sb, xs, ys, xe - xs + 1, ye - ys + 1, origin, scrollbarState);
        }
        sb.srange = out.pe - out.ps;
        switch(action) {
          case 0:
            step = page = scale = 1;
            break;
          case 1:
          ;
          case 11:
            step = page = 0.9 * sb.srange;
            scale = 2;
            break;
          case 2:
          ;
          case 12:
            step = 0.1 * sb.srange;
            page = 9 * step;
            scale = 2;
            break;
          case 3:
          ;
          case 13:
            step = 1;
            page = sb.srange - 1;
            scale = 1;
            break;
          default:
            return 0;
        }
        mx.scroll_vals(sb, out.ps, sb.srange, qs, qe - qs, step, page, scale, scrollbarState);
        if (mode === 0) {
          mx.scroll(Mx, sb, mx.XW_DRAW, undefined, undefined);
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
      mx.scroll = function(Mx, sv, op, mouseEvent, scrollbarState) {
        var btn;
        var smin;
        var srange;
        var s;
        if (sv === undefined) {
          return false;
        }
        switch(op) {
          case mx.XW_INIT:
            mx.scroll_loc(sv, 0, 0, Mx.width, 20, 1, scrollbarState);
            mx.scroll_vals(sv, 0, 10, 0, 100, 1, 10, 1, scrollbarState);
            sv.flag = 0;
            sv.action = 0;
            sv.initial_pause = 0.25;
            sv.repeat_pause = 0.05;
            sv.mxevent = true;
            sv.repeat_count = 0;
            break;
          case mx.XW_EVENT:
            btn = 0;
            if (sv.mxevent) {
              btn = Mx.button_release ? -Mx.button_release : Mx.button_press;
            } else {
              if (mouseEvent.type === "mousedown" || mouseEvent.type === "mouseup") {
                switch(mouseEvent.which) {
                  case 1:
                    btn = 1;
                    break;
                  case 2:
                    btn = 2;
                    break;
                  case 3:
                    btn = 3;
                    break;
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
              } else {
                if (mouseEvent.type === "mousewheel" || mouseEvent.type === "DOM-MouseScroll") {
                  if (mouseEvent.wheelDelta && mouseEvent.wheelDelta > 0) {
                    btn = 4;
                  } else {
                    if (mouseEvent.wheelDelta && mouseEvent.wheelDelta < 0) {
                      btn = 5;
                    }
                  }
                }
              }
            }
            if (sv.action === 0) {
              if (btn === 4 || btn === 5) {
                Mx.xpos = sv.x;
              }
              if (btn !== 1 && (btn !== 2 && (btn !== 4 && btn !== 5)) || (Mx.xpos < sv.x || (Mx.ypos < sv.y || (Mx.xpos > sv.x + sv.w || Mx.ypos > sv.y + sv.h)))) {
                return false;
              }
            } else {
              if (btn < 0) {
                sv.action = sv.repeat_count = 0;
                return true;
              }
            }
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
            if (sv.action === 0) {
              sv.repeat_count = 0;
              var scrollReal2PixOut = mx.scroll_real2pix(sv);
              sv.s1 = scrollbarState.s1 = scrollReal2PixOut.s1;
              sv.sw = scrollbarState.sw = scrollReal2PixOut.sw;
              sv.soff = scrollbarState.soff = s - sv.s1;
              if (sv.trange === 0) {
                sv.smin = scrollbarState.smin = sv.tmin;
                sv.srange = scrollbarState.srange = 0;
              } else {
                switch(btn) {
                  case 1:
                    if (s > sv.a1 && s < sv.a2) {
                      sv.action = sv.soff > 0 ? mx.SB_PAGEINC : mx.SB_PAGEDEC;
                    } else {
                      sv.action = sv.soff > 0 ? mx.SB_STEPINC : mx.SB_STEPDEC;
                    }
                    break;
                  case 4:
                    sv.action = mx.SB_WHEELUP;
                    break;
                  case 5:
                    sv.action = mx.SB_WHEELDOWN;
                    break;
                }
              }
            } else {
              switch(sv.action) {
                case mx.SB_WHEELUP:
                ;
                case mx.SB_WHEELDOWN:
                ;
                case mx.SB_EXPAND:
                ;
                case mx.SB_SHRINK:
                ;
                case mx.SB_FULL:
                  sv.action = sv.repeat_count = 0;
              }
            }
          ;
          case mx.XW_COMMAND:
            smin = sv.smin;
            srange = sv.srange;
            switch(sv.action) {
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
                  smin -= (srange - sv.srange) / 2;
                }
                break;
              case mx.SB_SHRINK:
                srange = srange / sv.scale;
                if (smin < 0 && smin + sv.srange >= 0) {
                  smin += srange / sv.scale;
                } else {
                  if (smin === 0 && smin + sv.srange >= 0) {
                    smin = srange / sv.scale;
                  } else {
                    smin += (sv.srange - srange) / 2;
                  }
                }
                break;
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
          ;
          case mx.XW_UPDATE:
            mx.redrawScrollbar(sv, Mx, op);
        }
        return true;
      };
      mx.scroll_loc = function(sv, x, y, w, h, origin, scrollbarState) {
        if (sv === undefined) {
          return;
        }
        sv.x = scrollbarState.x = x;
        sv.y = scrollbarState.y = y;
        sv.w = scrollbarState.w = w;
        sv.h = scrollbarState.h = h;
        sv.origin = scrollbarState.origin = Math.max(1, Math.min(4, origin));
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
      mx.scroll_vals = function(sv, smin, srange, tmin, trange, step, page, scale, scrollbarState) {
        if (sv === undefined) {
          return;
        }
        sv.smin = scrollbarState.smin = smin;
        sv.srange = scrollbarState.srange = srange;
        sv.tmin = scrollbarState.tmin = tmin;
        sv.trange = scrollbarState.trange = trange;
        sv.step = scrollbarState.step = step;
        sv.page = scrollbarState.page = page;
        sv.scale = scrollbarState.scale = Math.max(scale, 1);
      };
      mx.draw_symbol = function(Mx, ic, x, y, symbol, rr, n) {
        var ctx = Mx.active_canvas.getContext("2d");
        var r = 0;
        var d = 0;
        var d2 = 0;
        var rmode = false;
        var fill = false;
        var tri = [];
        for (var cnt = 0;cnt < 4;cnt++) {
          tri[cnt] = {x:0, y:0};
        }
        var c = "";
        fill = rr < 0;
        r = Math.abs(rr);
        d = r * 2;
        ctx.fillStyle = ic;
        ctx.strokeStyle = ic;
        if (typeof symbol === "function") {
          symbol(ctx, n, x, y);
        } else {
          switch(symbol) {
            case mx.L_CircleSymbol:
              ctx.beginPath();
              if (fill) {
                ctx.arc(x, y, r, 0, 360);
                ctx.fill();
              } else {
                ctx.arc(x, y, r, 0, 360);
                ctx.stroke();
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
              d = 1;
              ctx.beginPath();
              ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
              ctx.fill();
              break;
            case mx.L_ITriangleSymbol:
              r = -r;
            case mx.L_TriangleSymbol:
              d = m.trunc(r * 1.5);
              d2 = m.trunc(r * 0.8);
              tri[1].x = -d2;
              tri[1].y = d;
              tri[2].x = d2 * 2;
              tri[2].y = 0;
              tri[3].x = -d2;
              tri[3].y = -d;
              var tempTri = [];
              for (var cnt = 0;cnt < 4;cnt++) {
                tempTri[cnt] = {x:0, y:0};
              }
              if (fill) {
                tempTri[0].x = x;
                tempTri[0].y = y - r;
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
              r = m.trunc(Mx.text_w / 2);
              if (fill && !rmode) {
                ctx.fillText(c.substring(0, 2), x - r, y + r);
              }
              break;
          }
        }
      };
      mx.draw_symbols = function(Mx, ic, pixx, pixy, npix, symbol, rr, istart) {
        for (var i = 0;i < npix;i++) {
          mx.draw_symbol(Mx, ic, pixx[i], pixy[i], symbol, rr, i + istart);
        }
      };
      function isLeft(p_x, p_y, e_x1, e_y1, e_x2, e_y2) {
        return(e_x1 - p_x) * (e_y2 - p_y) - (e_x2 - p_x) * (e_y1 - p_y);
      }
      function update_winding_number(wn, p_x, p_y, e_x1, e_y1, e_x2, e_y2) {
        if (e_y1 <= p_y) {
          if (e_y2 > p_y) {
            if (isLeft(p_x, p_y, e_x1, e_y1, e_x2, e_y2) > 0) {
              wn += 1;
            }
          }
        } else {
          if (e_y2 <= p_y) {
            if (isLeft(p_x, p_y, e_x1, e_y1, e_x2, e_y2) < 0) {
              wn -= 1;
            }
          }
        }
        return wn;
      }
      mx.trace = function(Mx, color, xpoint, ypoint, npts, istart, skip, line, symb, rad, options) {
        if (xpoint === undefined || ypoint === undefined) {
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
        if (line === 0 && symb === 0) {
          m.log.warn("No line or symbol to draw");
          return;
        }
        var style;
        if (options.dashed) {
          style = {mode:"dashed", on:4, off:4};
        }
        var stk4 = mx.origin(Mx.origin, 4, Mx.stk[Mx.level]);
        if (stk4.xscl === 0 || stk4.yscl === 0) {
          return;
        }
        var left = stk4.x1;
        var top = stk4.y1;
        var xxmin = stk4.xmin;
        var xscl = 1 / stk4.xscl;
        var yymin = stk4.ymin;
        var yscl = 1 / stk4.yscl;
        if (!options.noclip) {
          mx.clip(Mx, left, top, stk4.x2 - left + 1, stk4.y2 - top + 1);
        }
        var dx = Math.abs(stk4.xmax - stk4.xmin);
        var dy = Math.abs(stk4.ymax - stk4.ymin);
        var xmin = Math.min(stk4.xmin, stk4.xmax);
        var ymin = Math.min(stk4.ymin, stk4.ymax);
        var xmax = xmin + dx;
        var ymax = ymin + dy;
        var bufsize = 4 * Math.ceil(2 * xpoint.length);
        var pixx = new Int32Array(new ArrayBuffer(bufsize));
        var pixy = new Int32Array(new ArrayBuffer(bufsize));
        var ib = 0;
        if (line === 0 && symb !== 0) {
          for (var n = skip - 1;n < npts;n += skip) {
            var x = xpoint[n];
            var y = ypoint[n];
            var lvisible = x >= xmin && (x <= xmax && (y >= ymin && y <= ymax));
            if (lvisible) {
              pixx[0] = Math.round((x - xxmin) * xscl) + left;
              pixy[0] = Math.round((y - yymin) * yscl) + top;
              mx.draw_symbol(Mx, color, pixx[0], pixy[0], symb, rad, istart + n);
            }
          }
        }
        if (options.vertsym === true) {
          for (var n = skip - 1;n < npts;n += skip) {
            var x = xpoint[n];
            var y = ypoint[n];
            if (x >= xmin && x <= xmax) {
              var i = Math.round((x - xxmin) * xscl) + left;
              mx.draw_line(Mx, color, i, 0, i, Mx.height);
              if (y >= ymin && y <= ymax) {
                pixx[0] = i;
                pixy[0] = Math.round((y - yymin) * yscl) + top;
                mx.draw_symbol(Mx, color, pixx[0], pixy[0], symb, rad, istart + n);
              }
            }
          }
        }
        if (options.horzsym === true) {
          for (var n = skip - 1;n < npts;n += skip) {
            var x = xpoint[n];
            var y = ypoint[n];
            if (y >= ymin && y <= ymax) {
              var i = Math.round((y - yymin) * yscl) + top;
              mx.draw_line(Mx, color, 0, i, Mx.width, i);
              if (x >= xmin && x <= xmax) {
                pixx[0] = Math.round((x - xxmin) * xscl) + left;
                pixy[0] = i;
                mx.draw_symbol(Mx, color, pixx[0], pixy[0], symb, rad, istart + n);
              }
            }
          }
        } else {
          if (line !== 0) {
            var colors;
            if (options && options.highlight) {
              colors = [];
              for (var sn = 0;sn < options.highlight.length;sn++) {
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
                  for (var cn = colors.length - 1;cn >= 0;cn--) {
                    if (rxs <= colors[cn].start && rxe >= colors[cn].end) {
                      colors.splice(cn, 1);
                      continue;
                    } else {
                      if (rxs >= colors[cn].start && rxe <= colors[cn].end) {
                        colors.push({start:rxe, end:colors[cn].end, color:colors[cn].color});
                        colors[cn].end = rxs;
                      } else {
                        if (rxs <= colors[cn].start && rxe >= colors[cn].start) {
                          colors[cn].start = rxe;
                        } else {
                          if (rxs <= colors[cn].end && rxe >= colors[cn].end) {
                            colors[cn].end = rxs;
                          }
                        }
                      }
                    }
                    if (colors[cn].end <= colors[cn].start) {
                      colors.splice(cn, 1);
                    }
                  }
                  colors.push({start:rxs, end:rxe, color:options.highlight[sn].color});
                }
              }
              colors.push({start:left, color:color});
              colors.sort(function(a, b) {
                return a.start - b.start;
              });
            } else {
              colors = color;
            }
            var wn = 0;
            var mid_x = (Mx.stk[Mx.level].xmax + Mx.stk[Mx.level].xmin) / 2;
            var mid_y = (Mx.stk[Mx.level].ymax + Mx.stk[Mx.level].ymin) / 2;
            var x = xpoint[0];
            var y = ypoint[0];
            wn = update_winding_number(wn, mid_x, mid_y, Mx.stk[Mx.level].xmin, Mx.stk[Mx.level].ymin, x, y);
            var lvisible = x >= xmin && (x <= xmax && (y >= ymin && y <= ymax));
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
            for (var n = skip;n <= skip * (npts - 1);n += skip) {
              var lx = x;
              var ly = y;
              x = xpoint[n];
              y = ypoint[n];
              wn = update_winding_number(wn, mid_x, mid_y, lx, ly, x, y);
              visible = x >= xmin && (x <= xmax && (y >= ymin && y <= ymax));
              if (lvisible && visible) {
                pixx[ib] = Math.round((x - xxmin) * xscl) + left;
                pixy[ib] = Math.round((y - yymin) * yscl) + top;
                ib += 1;
              } else {
                lvisible = visible;
                dx = lx - x;
                dy = ly - y;
                if (dx !== 0 || dy !== 0) {
                  var o = {tL:1, tE:0};
                  if (clipt(dx, xmin - x, o)) {
                    if (clipt(-dx, x - xmax, o)) {
                      if (clipt(dy, ymin - y, o)) {
                        if (clipt(-dy, y - ymax, o)) {
                          if (o.tL < 1) {
                            pixx[ib] = Math.round((x - xxmin + o.tL * dx) * xscl) + left;
                            pixy[ib] = Math.round((y - yymin + o.tL * dy) * yscl) + top;
                            ib += 1;
                          }
                          if (o.tE > 0) {
                            pixx[ib] = Math.round((x - xxmin + o.tE * dx) * xscl) + left;
                            pixy[ib] = Math.round((y - yymin + o.tE * dy) * yscl) + top;
                            ib += 1;
                            mx.draw_lines(Mx, colors, pixx.subarray(ie, ib), pixy.subarray(ie, ib), ib - ie, line, style);
                            if (symb !== 0 && ib - ie > 2) {
                              mx.draw_symbols(Mx, color, pixx.subarray(ie + 1, ib - 1), pixy.subarray(ie + 1, ib - 1), ib - ie - 2, symb, rad, istart + n - (ib - ie - 2));
                            }
                            ie = ib;
                          } else {
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
            if (ib - ie > 0) {
              mx.draw_lines(Mx, colors, pixx.subarray(ie, ib), pixy.subarray(ie, ib), ib - ie, line, style);
              if (visible) {
                ie = ie + 1;
              }
              if (symb !== 0 && ib - ie > 1) {
                mx.draw_symbols(Mx, color, pixx.subarray(ie - 1, ib), pixy.subarray(ie - 1, ib), ib - ie - 1, symb, rad, n - ib + istart);
              }
            }
            if (options.fillStyle && (!Mx.fillMin && !Mx.fillMax)) {
              if (ib > 1 || wn !== 0) {
                mx.fill_trace(Mx, options.fillStyle, pixx, pixy, ib);
              }
            }
            if (options.highlight) {
              for (var i = 0;i < options.highlight.length;i++) {
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
                if (ib > 1 || wn !== 0) {
                  var xstart_pixel_value = mx.real_to_pixel(Mx, x_start, 0);
                  var xend_pixel_value = mx.real_to_pixel(Mx, x_end, 0);
                  var pi_start = xstart_pixel_value.x;
                  var pi_end = xend_pixel_value.x;
                  var pixx_new = [];
                  var pixy_new = [];
                  for (var q = 0;q < ib;q++) {
                    var this_point = pixx[q];
                    var this_point_y = pixy[q];
                    if (in_fill_range(this_point, pi_start, pi_end) === true) {
                      pixx_new.push(this_point);
                      pixy_new.push(this_point_y);
                    }
                  }
                  if (pixx_new.length > 0 || wn !== 0) {
                    pi_start = Math.max(pi_start, pixx_new[0]);
                    pi_end = Math.min(pi_end, pixx_new[pixx_new.length - 1]);
                    mx.fill_trace(Mx, highlight.fill, pixx_new, pixy_new, pixx_new.length, pi_start, pi_end);
                  }
                }
              }
            }
          }
        }
        if (!options.noclip) {
          mx.clip(Mx, 0, 0, 0, 0);
        }
      };
      mx.draw_mode = function(Mx, linewidth, style) {
        Mx.linewidth = linewidth === undefined ? 1 : linewidth;
        Mx.style = style;
      };
      mx.draw_line = function(Mx, color, x1, y1, x2, y2, linewidth, style) {
        var ctx = Mx.active_canvas.getContext("2d");
        if (linewidth === undefined) {
          linewidth = Mx.linewidth;
        }
        if (style === undefined) {
          style = Mx.style;
        }
        if (typeof color === "number") {
          if (!Mx.pixel || Mx.pixel.length === 0) {
            m.log.warn("COLORMAP not initialized, defaulting to foreground");
            color = Mx.fg;
          } else {
            var cidx = Math.max(0, Math.min(Mx.pixel.length, color));
            color = to_rgb(Mx.pixel[cidx].red, Mx.pixel[cidx].green, Mx.pixel[cidx].blue);
          }
        }
        draw_line(ctx, x1, y1, x2, y2, style, color, linewidth);
      };
      mx.rubberline = function(Mx, x1, y1, x2, y2) {
        var ctx = Mx.active_canvas.getContext("2d");
        draw_line(ctx, x1, y1, x2, y2, {mode:"xor"}, "white", 1);
      };
      mx.fill_trace = function(Mx, fillStyle, pixx, pixy, npts, l, r) {
        var ctx = Mx.active_canvas.getContext("2d");
        if (Array.isArray(fillStyle)) {
          ctx.fillStyle = mx.linear_gradient(Mx, 0, 0, 0, Mx.b - Mx.t, fillStyle);
        } else {
          ctx.fillStyle = fillStyle;
        }
        if (npts < 1) {
          ctx.fillRect(Mx.l, Mx.t, Mx.r - Mx.l, Mx.b - Mx.t);
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
          for (var i = 1;i < npts;i++) {
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
        if (style && style.mode === "dashed") {
          var dash_supported = common.dashOn(ctx, style.on, style.off);
          if (!dash_supported) {
            m.log.warn("WARNING: Dashed lines aren't supported on your browser");
          }
        }
        ctx.lineWidth = linewidth;
        var current_color = 0;
        if (typeof colors === "string") {
          colors = [{start:0, color:colors}];
        } else {
          if (!(colors instanceof Array)) {
            if (colors.start === undefined) {
              colors.start = 0;
            }
            colors = [colors];
          }
        }
        for (var n = 0;n < colors.length;n++) {
          if (colors[n].end != null && colors[n].end < x) {
            colors.remove(n);
          } else {
            if (colors[n].start < x) {
              current_color = n;
            }
          }
        }
        ctx.strokeStyle = colors[current_color].color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var i = 0;i < npts;i++) {
          if (x === pixx[i] && y === pixy[i]) {
            continue;
          }
          x = pixx[i];
          y = pixy[i];
          var newcolor = false;
          if (current_color > 0 && (colors[current_color].end != null && colors[current_color].end < x)) {
            newcolor = true;
            while (colors[current_color].end != null && colors[current_color].end < x) {
              colors.remove(current_color);
              current_color -= 1;
              if (current_color === 0) {
                break;
              }
            }
          }
          if (current_color + 1 < colors.length && colors[current_color + 1].start <= x) {
            newcolor = true;
            while (current_color + 1 < colors.length && colors[current_color + 1].start <= x) {
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
      mx.clip = function(Mx, left, top, width, height) {
        var ctx = Mx.active_canvas.getContext("2d");
        if (left === 0 && (top === 0 && (width === 0 && height === 0))) {
          ctx.restore();
          return;
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.clip();
      };
      mx.clear_window = function(Mx) {
        var ctx = Mx.active_canvas.getContext("2d");
        ctx.fillStyle = Mx.bg;
        ctx.fillRect(0, 0, Mx.width, Mx.height);
      };
      mx.erase_window = function(Mx) {
        var ctx = Mx.active_canvas.getContext("2d");
        ctx.clearRect(0, 0, Mx.width, Mx.height);
      };
      mx.rubberbox = function(Mx, func, mode, def_style, alt_style) {
        mx.warpbox(Mx, Mx.xpos, Mx.ypos, Mx.xpos, Mx.ypos, 0, Mx.width, 0, Mx.height, func, mode, def_style, alt_style);
      };
      mx.warpbox = function(Mx, xo, yo, xl, yl, xmin, xmax, ymin, ymax, func, mode, def_style, alt_style) {
        if (!def_style) {
          def_style = {};
        }
        Mx.warpbox = new WARPBOX;
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
      mx.origin = function(inorigin, outorigin, instk) {
        inorigin = Math.max(1, inorigin);
        outorigin = Math.max(1, outorigin);
        var outstk = new mx.STKSTRUCT;
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
          var diff = Math.abs(outorigin - inorigin);
          var sum = outorigin + inorigin;
          if (diff === 2 || sum !== 5) {
            outstk.xmin = instk.xmax;
            outstk.xmax = instk.xmin;
            outstk.xscl = -instk.xscl;
          }
          if (diff === 2 || sum === 5) {
            outstk.ymin = instk.ymax;
            outstk.ymax = instk.ymin;
            outstk.yscl = -instk.yscl;
          }
        }
        return outstk;
      };
      mx.mult = function(end1, end2) {
        var absmax = Math.max(Math.abs(end1), Math.abs(end2));
        if (absmax === 0) {
          return 1;
        }
        var kengr = 0.1447648 * Math.log(absmax);
        kengr = kengr | kengr;
        if (absmax < 1) {
          kengr = kengr - 1;
        }
        if (kengr < 0) {
          return 1 / Math.pow(10, -3 * kengr);
        } else {
          return Math.pow(10, 3 * kengr);
        }
      };
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
      mx.prompt = function(Mx, promptText, isValid, onSuccess, refresh, inputValue, xpos, ypos, errorTimeout) {
        if (inputValue !== undefined) {
          var inputValid = isValid(inputValue);
          if (!inputValid.valid) {
            throw "Prompt default input value not valid due to '" + inputValid.reason + "'";
          }
        }
        mx.onWidgetLayer(Mx, function() {
          var ctx = Mx.active_canvas.getContext("2d");
          var maxNumChars = 30;
          var pxIndex = ctx.font.indexOf("px");
          var fontIndex = pxIndex + 3;
          var fontSize = ctx.font.substr(0, pxIndex);
          var fontFamily = ctx.font.substr(fontIndex, ctx.font.length).toString();
          var canvasInput = new CanvasInput({height:Mx.text_h, fontFamily:fontFamily, fontSize:new Number(fontSize), backgroundColor:Mx.bg, fontColor:Mx.fg, borderWidth:0, borderRadius:0, padding:0, boxShadow:"none", innerShadow:"none", width:Mx.text_w * maxNumChars, value:inputValue !== undefined ? inputValue.toString() : "", disableBlur:true, renderOnReturn:false, tabToClear:true});
          var subHandlerCreator = function(messageX, messageY) {
            return function() {
              var newValue = this.value();
              var inputValid = isValid(newValue);
              if (!inputValid.valid) {
                mx.message(Mx, "Value: '" + newValue + "' isn't valid due to '" + inputValid.reason + "' - RETRY", undefined, messageX, messageY);
                setTimeout(function() {
                  mx.onWidgetLayer(Mx, function() {
                    mx.erase_window(Mx);
                  });
                  Mx.widget = null;
                }, errorTimeout != null ? errorTimeout : 4E3);
              } else {
                Mx.prompt = undefined;
                this.cleanup();
                mx.onWidgetLayer(Mx, function() {
                  mx.erase_window(Mx);
                });
                onSuccess(newValue);
              }
            };
          };
          var redrawPromptCreator = function(Mx, input, promptText) {
            return function(xpos, ypos) {
              mx.onWidgetLayer(Mx, function() {
                var GBorder = 3;
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
                mx.widgetbox(Mx, xc, yc, xs, ys, xcc, ycc, 0, "");
                mx.text(Mx, inputXPos, yPos, promptText);
                var inputYPos = yPos - Mx.text_h * 1.15;
                input.x(xcc + Mx.text_w + xssPrompt - Mx.text_w);
                input.y(inputYPos);
                input.onsubmit(subHandlerCreator(xc, inputYPos - 75));
                if (!input.canvas()) {
                  input.canvas(Mx.active_canvas);
                } else {
                  input.render();
                }
              });
            };
          };
          var redrawPrompt = redrawPromptCreator(Mx, canvasInput, promptText);
          redrawPrompt(xpos, ypos);
          canvasInput.focus();
          Mx.prompt = {redraw:redrawPrompt, input:canvasInput};
        });
      };
      mx.floatValidator = function(value, strict) {
        if (!((strict === undefined || strict === false) && value === "") && isNaN(parseFloat(value)) || !isFinite(value)) {
          return{valid:false, reason:"Failed float validation: not a valid floating point number"};
        }
        return{valid:true, reason:""};
      };
      mx.intValidator = function(value, strict) {
        if ((strict === undefined || strict === false) && value === "" || parseFloat(value) === parseInt(value, 10) && !isNaN(value)) {
          return{valid:true, reason:""};
        } else {
          return{valid:false, reason:"Failed integer validation: not a valid integer"};
        }
      };
      mx.hexValidator = function(value, strict) {
        var regColorcode = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
        if ((strict === undefined || strict === false) && value === "" || regColorcode.test(value) !== false) {
          return{valid:true, reason:""};
        } else {
          return{valid:false, reason:"Failed hexcode validation: not a valid hexcode"};
        }
      };
      mx.message = function(Mx, msg, time, xpos, ypos, type) {
        mx.onWidgetLayer(Mx, function() {
          mx.render_message_box(Mx, msg, xpos, ypos);
          Mx.widget = {type:type || "ONESHOT", callback:function(event) {
            if (event.type === "mousedown" || event.type === "keydown") {
              Mx.widget = null;
              mx.onWidgetLayer(Mx, function() {
                mx.erase_window(Mx);
              });
            }
          }};
        });
      };
      mx.render_message_box = function(Mx, msg, xpos, ypos, textColor) {
        var GBorder = 3;
        var beg = msg.split(/\r\n|\r|\n/g);
        var linel = 0;
        var center;
        if (beg.length === 1) {
          beg = [];
          var MESSWIDTH = 40;
          linel = Math.min((Mx.width - 2 * GBorder) / Mx.text_w - 2, msg.length);
          if (linel <= 0) {
            return;
          }
          while (linel > MESSWIDTH && 2.5 * Mx.text_h * msg.length < Mx.height * linel) {
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
            for (cur = bg;cur <= end && !endinreturn;cur++) {
              switch(msg[cur]) {
                case ",":
                ;
                case ";":
                ;
                case " ":
                ;
                case ":":
                  brk = cur;
                  break;
                case "-":
                ;
                case "/":
                  if (brk !== cur - 1) {
                    brk = cur;
                  }
                  break;
                case "@":
                ;
                case "\n":
                ;
                case "\r":
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
              var s = msg.substring(bg, brk + 1).replace(/^\s+/, "");
              beg.push(s);
            }
            bg = brk + 1;
            j = Math.max(j, beg[i].length);
          }
        } else {
          for (var i = 0;i < beg.length;i++) {
            linel = Math.min((Mx.width - 2 * GBorder) / Mx.text_w - 2, Math.max(linel, beg[i].length));
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
            i = xc + xs / 2 - beg[cur].length * Mx.text_w / 2;
          }
          mx.text(Mx, i, j, beg[cur], textColor);
          cur++;
        }
      };
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
        if (fill_opacity !== undefined && fill_opacity > 0) {
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
      mx.draw_box = function(Mx, color, x, y, w, h, fill_opacity, fill_color) {
        var ctx = Mx.active_canvas.getContext("2d");
        if (color !== "xor") {
          ctx.lineWidth = 1;
          ctx.strokeStyle = color;
          ctx.strokeRect(x, y, w, h);
        } else {
          if (typeof Uint8ClampedArray === "undefined") {
            ctx.lineWidth = 1;
            ctx.strokeStyle = Mx.fg;
            ctx.strokeRect(x, y, w, h);
          } else {
            x = Math.floor(x);
            y = Math.floor(y);
            w = Math.floor(w);
            h = Math.floor(h);
            var dctx = Mx.canvas.getContext("2d");
            var imgd = dctx.getImageData(x, y, w, 1);
            var pix = imgd.data;
            for (var c = 0;c < imgd.data.length;c++) {
              pix[c * 4] = 255 - pix[c * 4];
              pix[c * 4 + 1] = 255 - pix[c * 4 + 1];
              pix[c * 4 + 2] = 255 - pix[c * 4 + 2];
              pix[c * 4 + 3] = 255;
            }
            ctx.putImageData(imgd, x, y);
            imgd = dctx.getImageData(x, y + h, w, 1);
            pix = imgd.data;
            for (var c = 0;c < imgd.data.length;c++) {
              pix[c * 4] = 255 - pix[c * 4];
              pix[c * 4 + 1] = 255 - pix[c * 4 + 1];
              pix[c * 4 + 2] = 255 - pix[c * 4 + 2];
              pix[c * 4 + 3] = 255;
            }
            ctx.putImageData(imgd, x, y + h);
            var imgd = dctx.getImageData(x, y, 1, h);
            var pix = imgd.data;
            for (var c = 0;c < h;c++) {
              pix[c * 4] = 255 - pix[c * 4];
              pix[c * 4 + 1] = 255 - pix[c * 4 + 1];
              pix[c * 4 + 2] = 255 - pix[c * 4 + 2];
              pix[c * 4 + 3] = 255;
            }
            ctx.putImageData(imgd, x, y);
            imgd = dctx.getImageData(x + w, y, 1, h);
            pix = imgd.data;
            for (var c = 0;c < h;c++) {
              pix[c * 4] = 255 - pix[c * 4];
              pix[c * 4 + 1] = 255 - pix[c * 4 + 1];
              pix[c * 4 + 2] = 255 - pix[c * 4 + 2];
              pix[c * 4 + 3] = 255;
            }
            ctx.putImageData(imgd, x + w, y);
          }
        }
        if (fill_opacity !== undefined && fill_opacity > 0) {
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
      mx.set_font = function(Mx, width) {
        var ctx = Mx.canvas.getContext("2d");
        var ctx_wid = Mx.wid_canvas.getContext("2d");
        if (Mx.font && Mx.font.width === width) {
          ctx.font = Mx.font.font;
          ctx_wid.font = Mx.font.font;
        } else {
          var text_h = 1;
          do {
            text_h = text_h + 1;
            ctx.font = text_h + "px " + Mx.font_family;
            ctx_wid.font = text_h + "px " + Mx.font_family;
            var font_size = ctx.measureText("M");
            Mx.text_w = font_size.width;
            Mx.text_h = text_h;
          } while (Mx.text_w < width);
          Mx.font = {font:text_h + "px " + Mx.font_family, width:width};
        }
      };
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
      mx.tics = function(dmin, dmax, ndiv, timecode) {
        var dtic = 1;
        var dtic1 = dmin;
        if (dmax === dmin) {
          return{dtic:1, dtic1:dmin};
        }
        var dran = Math.abs(dmax - dmin);
        var df = dran / ndiv;
        var sig = log10(Math.max(df, 1E-36));
        var nsig;
        if (sig < 0) {
          nsig = Math.ceil(sig);
          nsig = nsig - 1;
        } else {
          nsig = Math.floor(sig);
        }
        var ddf = df * Math.pow(10, -nsig);
        sig = Math.pow(10, nsig);
        var dft = ddf * sig;
        if (timecode && (dft >= 5 && dft <= 59.5 * 3600 * 24)) {
          var dscl;
          if (dft < 17.5) {
            dscl = 5;
          } else {
            if (dft < 37.5) {
              dscl = 15;
            } else {
              if (dft < 4.5 * 60) {
                dscl = 60;
              } else {
                if (dft < 17.5 * 60) {
                  dscl = 5 * 60;
                } else {
                  if (dft < 37.5 * 60) {
                    dscl = 15 * 60;
                  } else {
                    if (dft < 2 * 3600) {
                      dscl = 1 * 3600;
                    } else {
                      if (dft < 4.5 * 3600) {
                        dscl = 3 * 3600;
                      } else {
                        if (dft < 9 * 3600) {
                          dscl = 6 * 3600;
                        } else {
                          if (dft < 1.5 * 3600 * 24) {
                            dscl = 12 * 3600;
                          } else {
                            if (dft < 6 * 3600 * 24) {
                              dscl = 1 * 3600 * 24;
                            } else {
                              dscl = 1 * 3600 * 24 * 7;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          dtic = Math.round(dft / dscl) * dscl;
        } else {
          if (ddf < 1.75) {
            dtic = sig;
          } else {
            if (ddf < 2.25) {
              dtic = 2 * sig;
            } else {
              if (ddf < 3.5) {
                dtic = 2.5 * sig;
              } else {
                if (ddf < 7) {
                  dtic = 5 * sig;
                } else {
                  dtic = 10 * sig;
                }
              }
            }
          }
        }
        if (dtic === 0) {
          dtic = 1;
        }
        var nseg;
        if (dmax >= dmin) {
          if (dmin >= 0) {
            nseg = dmin / dtic + 0.995;
          } else {
            nseg = dmin / dtic - 0.005;
          }
          nseg = Math.floor(nseg);
          dtic1 = nseg * dtic;
        } else {
          if (dmin >= 0) {
            nseg = dmin / dtic + 0.005;
          } else {
            nseg = dmin / dtic - 0.995;
          }
          nseg = Math.floor(nseg);
          dtic1 = nseg * dtic;
          dtic = -1 * dtic;
        }
        if (dtic1 + dtic === dtic1) {
          dtic = dmax - dmin;
        }
        return{dtic:dtic, dtic1:dtic1};
      };
      mx.drawaxis = function(Gx, Mx, xdiv, ydiv, xlab, ylab, flags) {
        var stk1 = mx.origin(Mx.origin, 1, Mx.stk[Mx.level]);
        var iscl = 0;
        var isct = 0;
        var iscr = 0;
        var iscb = 0;
        var width = 0;
        var height = 0;
        xlab = xlab === undefined ? 30 : xlab;
        ylab = ylab === undefined ? 30 : ylab;
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
        var xTIC = {dtic:0, dtic1:0};
        var yTIC = {dtic:0, dtic1:0};
        if (xdiv < 0) {
          xTIC.dtic1 = stk1.xmin;
          xTIC.dtic = (stk1.xmin - stk1.xmax) / xdiv;
        } else {
          xTIC = mx.tics(stk1.xmin, stk1.xmax, xdiv, flags.xtimecode);
        }
        var _xmult = 1;
        if (flags.xmult) {
          _xmult = flags.xmult;
        } else {
          if (!flags.xtimecode) {
            _xmult = mx.mult(stk1.xmin, stk1.xmax);
          }
        }
        if (ydiv < 0) {
          yTIC.dtic1 = stk1.ymin;
          yTIC.dtic = (stk1.ymin - stk1.ymax) / ydiv;
        } else {
          yTIC = mx.tics(stk1.ymin, stk1.ymax, ydiv, flags.ytimecode);
        }
        var _ymult = 1;
        if (flags.ymult) {
          _ymult = flags.ymult;
        } else {
          if (!flags.ytimecode) {
            _ymult = mx.mult(stk1.ymin, stk1.ymax);
          }
        }
        var xticlabels = !flags.noxtlab;
        var yticlabels = !flags.noytlab;
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
            } else {
              if (flags.ylabel !== undefined) {
                ylabel = flags.ylabel;
              } else {
                ylabel = m.label(ylab, _ymult);
              }
            }
          }
          if (!flags.noxplab) {
            if (flags.xlabel instanceof Function) {
              xlabel = flags.xlabel(xlab, _xmult);
            } else {
              if (flags.xlabel !== undefined) {
                xlabel = flags.xlabel;
              } else {
                xlabel = m.label(xlab, _xmult);
              }
            }
          }
        }
        if (xlabel && ylabel) {
          mx.text(Mx, ix, iy, ylabel + " vs " + xlabel);
        } else {
          if (xlabel) {
            mx.text(Mx, ix, iy, xlabel);
          } else {
            if (ylabel) {
              mx.text(Mx, ix, iy, ylabel);
            }
          }
        }
        var itext = 5.5 * Mx.text_w;
        var jtext = 0;
        if (flags.ontop) {
          if (flags.inside) {
            jtext = isct + 1 * Mx.text_h;
          } else {
            jtext = isct - 0.2 * Mx.text_h;
          }
        } else {
          if (flags.inside) {
            jtext = iscb - 0.5 * Mx.text_h;
          } else {
            jtext = iscb + 1 * Mx.text_h + 2;
          }
        }
        var fact;
        if (stk1.xmin !== stk1.xmax) {
          fact = width / (stk1.xmax - stk1.xmin);
        } else {
          fact = width / 1;
        }
        var fmul;
        if (_xmult !== 0) {
          fmul = 1 / _xmult;
        } else {
          fmul = 1;
        }
        var xlbl_maxlen = Math.min(12, Math.round(fact * xTIC.dtic) / Mx.text_w);
        var sp = 1;
        var x;
        var xlbl = "";
        if (xticlabels) {
          if (flags.xtimecode) {
            xlbl = m.sec2tod(xTIC.dtic1);
            sp = xlbl.length * Mx.text_w < (iscr - iscl) / 2;
          } else {
            var last_xlbl;
            for (x = xTIC.dtic1;x <= stk1.xmax;x = x + xTIC.dtic) {
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
          xTIC.dtic = stk1.xmax - xTIC.dtic1 + 1;
        }
        var i;
        ix = 0;
        xlbl = "";
        for (x = xTIC.dtic1;x <= stk1.xmax;x = x + xTIC.dtic) {
          i = iscl + Math.round(fact * (x - stk1.xmin)) + 2;
          if (i < iscl) {
            continue;
          }
          if (flags.grid && flags.grid !== "y") {
            if (!flags.gridStyle) {
              if (mx.LEGACY_RENDER) {
                flags.gridStyle = {mode:"dashed", on:1, off:3};
              } else {
                flags.gridStyle = {"color":Mx.xwms, mode:"dashed", on:1, off:3};
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
                if (i > ix) {
                  xlbl = m.sec2tod(x, true);
                  ix = i + Mx.text_w * (xlbl.length + 1);
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
            } else {
              if (x === xTIC.dtic1) {
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
                  mx.text(Mx, i - itext, jtext, xlbl + " +\u0394 " + xTIC.dtic * fmul);
                }
              }
            }
          }
        }
        if (flags.yonright) {
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
          fact = -height / 1;
        }
        if (_ymult !== 0) {
          fmul = 1 / _ymult;
        } else {
          fmul = 1;
        }
        var ytic, ytic1, endtic;
        if (yTIC.dtic === 0) {
          ytic = stk1.ymax - ytic1 + 1;
        }
        if (stk1.ymax >= stk1.ymin) {
          endtic = function(val) {
            return val <= stk1.ymax;
          };
        } else {
          endtic = function(val) {
            return val >= stk1.ymax;
          };
        }
        var ylbl;
        for (var y = yTIC.dtic1;endtic(y);y = y + yTIC.dtic) {
          i = iscb + Math.round(fact * (y - stk1.ymin)) - 2;
          if (i > iscb) {
            continue;
          }
          if (flags.grid && flags.grid !== "x") {
            if (!flags.gridStyle) {
              flags.gridStyle = {mode:"dashed", on:1, off:3};
            }
            mx.textline(Mx, iscl, i, iscr, i, flags.gridStyle);
          } else {
            mx.textline(Mx, iscl - 2, i, iscl + 2, i);
            mx.textline(Mx, iscr - 2, i, iscr + 2, i);
          }
          if (yticlabels) {
            if (flags.inside && (i < isct + Mx.text_h || i > iscb - Mx.text_h * 2)) {
            } else {
              if (flags.ytimecode) {
                ylbl = m.sec2tod(y);
                var k = i + jtext - Mx.text_h;
                var sep = ylbl.indexOf("::");
                if (sep !== -1) {
                  if (k > isct && k < iscb) {
                    mx.text(Mx, itext, k, ylbl.substring(0, sep));
                  }
                  sep += 1;
                }
                mx.text(Mx, itext, Math.min(iscb, i + jtext), ylbl.substring(sep + 1, sep + 6));
                k = i + jtext + Mx.text_h;
                if (k > isct && k < iscb) {
                  if (ylbl.substring(sep + 7, sep + 9) !== "00") {
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
        }
      };
      mx.inrect = function(x, y, rect_x, rect_y, rect_width, rect_height) {
        return x >= rect_x && (x <= rect_x + rect_width && (y >= rect_y && y <= rect_y + rect_height));
      };
      var MENU_CONSTANTS = {GBorder:3, sidelab:0, toplab:1, n_show:0};
      function _menu_redraw(Mx, menu) {
        if (menu.animationFrameHandle) {
          return;
        }
        var plot_height = Mx.canvas.height;
        var buffer_sz = 35;
        var avail_space = plot_height - 2 * buffer_sz;
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
          var ctx = Mx.wid_canvas.getContext("2d");
          ctx.lineWidth = 1;
          ctx.strokeStyle = Mx.xwbs;
          ctx.beginPath();
          ctx.moveTo(xcc, ycc - 4 + 0.5);
          ctx.lineTo(xcc + xss - 1, ycc - 4 + 0.5);
          ctx.stroke();
          ctx.strokeStyle = Mx.xwts;
          ctx.beginPath();
          ctx.moveTo(xcc, ycc - 3 + 0.5);
          ctx.lineTo(xcc + xss - 1, ycc - 3 + 0.5);
          ctx.stroke();
          var i_begin = menu.queue[0];
          var i_end = menu.queue[MENU_CONSTANTS.n_show - 1];
          if (i_end === 0) {
            for (var q = 0;q < MENU_CONSTANTS.n_show;q++) {
              menu.queue[q] = q;
            }
            i_begin = menu.queue[0];
            i_end = menu.queue[MENU_CONSTANTS.n_show - 1];
          }
          var menu_counter = 0;
          for (var i = i_begin;i <= i_end;i++) {
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
                ctx.strokeRect(xcc + 1 + Mx.text_w, y + (yb - Mx.text_w) / 2, Mx.text_w, Mx.text_w);
                if (item.checked) {
                  ctx.beginPath();
                  ctx.moveTo(xcc + 1 + Mx.text_w, y + (yb - Mx.text_w) / 2);
                  ctx.lineTo(xcc + 1 + Mx.text_w + Mx.text_w, y + (yb - Mx.text_w) / 2 + Mx.text_w);
                  ctx.stroke();
                  ctx.beginPath();
                  ctx.moveTo(xcc + 1 + Mx.text_w + Mx.text_w, y + (yb - Mx.text_w) / 2);
                  ctx.lineTo(xcc + 1 + Mx.text_w, y + (yb - Mx.text_w) / 2 + Mx.text_w);
                  ctx.stroke();
                }
              } else {
                ctx.fillText(" " + item.text + " ", xcc, y + yb / 2);
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
      function _menu_takeaction(Mx, menu) {
        mx.onWidgetLayer(Mx, function() {
          mx.erase_window(Mx);
        });
        Mx.menu = undefined;
        Mx.widget = null;
        for (var i = 0;i < menu.items.length;i++) {
          var item = menu.items[i];
          if (item.selected) {
            if (item.handler) {
              item.handler();
            } else {
              if (item.menu) {
                var newmenu = item.menu;
                if (typeof item.menu === "function") {
                  newmenu = item.menu();
                }
                newmenu.finalize = menu.finalize;
                mx.menu(Mx, newmenu);
              }
            }
            break;
          }
        }
        if (!Mx.menu && menu.finalize) {
          menu.finalize();
        }
      }
      function _menu_dismiss(Mx, menu) {
        mx.onWidgetLayer(Mx, function() {
          mx.erase_window(Mx);
        });
        Mx.menu = undefined;
        Mx.widget = null;
        if (!Mx.menu && menu.finalize) {
          menu.finalize();
        }
      }
      function _menu_callback(Mx, menu, event) {
        var i_begin = menu.queue[0];
        var i_end = menu.queue[MENU_CONSTANTS.n_show - 1];
        if (event === undefined) {
          _menu_redraw(Mx, menu);
        } else {
          if (event.type === "mousemove") {
            if (menu.drag_x !== undefined && (menu.drag_y !== undefined && (Math.abs(Mx.xpos - menu.drag_x) > 2 && Math.abs(Mx.ypos - menu.drag_y) > 2))) {
              menu.x += Mx.xpos - menu.drag_x;
              menu.y += Mx.ypos - menu.drag_y;
              menu.drag_x = Mx.xpos;
              menu.drag_y = Mx.ypos;
            }
            var xcc = menu.x + MENU_CONSTANTS.GBorder + Math.max(0, MENU_CONSTANTS.sidelab);
            var xss = menu.w - 2 * MENU_CONSTANTS.GBorder - Math.abs(MENU_CONSTANTS.sidelab);
            var yb = Mx.text_h * 1.5;
            var ycc = menu.y + MENU_CONSTANTS.GBorder + MENU_CONSTANTS.toplab * (yb + MENU_CONSTANTS.GBorder);
            for (var i = i_begin;i <= i_end;i++) {
              var y = ycc + yb * i;
              var item = menu.items[i];
              item.selected = false;
              if (mx.inrect(Mx.xpos, Mx.ypos, xcc, y, xss, yb)) {
                item.selected = true;
              }
            }
            _menu_redraw(Mx, menu);
          } else {
            if (event.type === "mouseup") {
              if (event.which === 1) {
                if (menu.drag_x !== undefined && menu.drag_y !== undefined) {
                  menu.drag_x = undefined;
                  menu.drag_y = undefined;
                } else {
                  _menu_takeaction(Mx, menu);
                }
              } else {
                if (event.which === 3) {
                  _menu_dismiss(Mx, menu);
                }
              }
            } else {
              if (event.type === "mousedown") {
                event.preventDefault();
                if (event.which === 1) {
                  if (Mx.xpos > menu.x && (Mx.xpos < menu.x + menu.w && (Mx.ypos > menu.y && Mx.ypos < menu.y + Mx.text_h * 1.5))) {
                    menu.drag_x = Mx.xpos;
                    menu.drag_y = Mx.ypos;
                  }
                } else {
                  if (event.which === 2) {
                    _menu_takeaction(Mx, menu);
                  }
                }
              } else {
                if (event.type === "keydown") {
                  if (Mx.menu) {
                    var menu = Mx.menu;
                    event.preventDefault();
                    var keyCode = common.getKeyCode(event);
                    if (keyCode === 13) {
                      _menu_takeaction(Mx, menu);
                    } else {
                      if (keyCode === 38) {
                        for (var i = i_begin;i < i_end;i++) {
                          var item = menu.items[i];
                          if (item.selected) {
                            item.selected = false;
                            if (menu.items[i - 1] !== undefined) {
                              menu.items[i - 1].selected = true;
                            }
                            break;
                          } else {
                            if (i === i_begin && i_begin !== 0) {
                              menu.queue.pop();
                              menu.queue.unshift(i_begin - 1);
                              _menu_redraw(Mx, menu);
                              menu.items[i_end - 1].selected = true;
                            } else {
                              if (i_begin === 0 && menu.items[i_begin].selected === true) {
                                _menu_redraw(Mx, menu);
                                menu.items[0].selected = true;
                              }
                            }
                          }
                        }
                        _menu_redraw(Mx, menu);
                      } else {
                        if (keyCode === 40) {
                          for (var i = i_begin;i < i_end;i++) {
                            var item = menu.items[i];
                            if (item.selected) {
                              item.selected = false;
                              if (menu.items[i + 1] !== undefined) {
                                menu.items[i + 1].selected = true;
                              }
                              break;
                            } else {
                              if (i === i_end - 1) {
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
                          }
                          _menu_redraw(Mx, menu);
                        } else {
                          if (keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90) {
                            var inp = String.fromCharCode(keyCode).toUpperCase();
                            if (menu.keypresses === undefined) {
                              menu.keypresses = inp;
                            } else {
                              menu.keypresses = menu.keypresses + inp;
                            }
                            var matches = 0;
                            for (var i = 0;i < menu.items.length;i++) {
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
                            } else {
                              if (matches === 1) {
                                _menu_takeaction(Mx, menu);
                              } else {
                                _menu_redraw(Mx, menu);
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      mx.menu = function(Mx, menu) {
        var yb = Mx.text_h * 1.5;
        var plot_height = Mx.canvas.height;
        var buffer_sz = 35;
        var avail_space = plot_height - 2 * buffer_sz;
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
            menu.y = menu.y - ((MENU_CONSTANTS.toplab + Math.max(1, menu.val) - 0.5) * yb + (1 + MENU_CONSTANTS.toplab) * MENU_CONSTANTS.GBorder) + 1;
            var xb = menu.title.length;
            var yadj = 0;
            for (var i = 0;i < menu.items.length;i++) {
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
            for (var q = 0;q < MENU_CONSTANTS.n_show;q++) {
              menu.queue.push(q);
            }
            menu.y = menu.y - yadj;
            xb += 2;
            xb = xb * Mx.text_w;
            menu.w = MENU_CONSTANTS.GBorder * 2 + Math.abs(MENU_CONSTANTS.sidelab) + xb - 1;
            menu.x = menu.x - menu.w / 2;
            Mx.menu = menu;
            Mx.widget = {type:"MENU", callback:function(event) {
              _menu_callback(Mx, menu, event);
            }};
          }
          _menu_redraw(Mx, menu);
        }
      };
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
      mx.text = function(Mx, x, y, lbl, color) {
        var ctx = Mx.active_canvas.getContext("2d");
        x = Math.max(0, x);
        y = Math.max(0, y);
        if (x < 0 || y < 0) {
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
      function clipt(denom, num, o) {
        var accept = true;
        var t;
        t = num / denom;
        if (denom > 0) {
          if (t > o.tL) {
            accept = false;
          } else {
            if (t > o.tE) {
              o.tE = t;
            }
          }
        } else {
          if (denom < 0) {
            if (t < o.tE) {
              accept = false;
            } else {
              if (t < o.tL) {
                o.tL = t;
              }
            }
          } else {
            if (num > 0) {
              accept = false;
            }
          }
        }
        return accept;
      }
      function draw_line(ctx, x1, y1, x2, y2, style, color, width) {
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
        } else {
          if (style.mode === "dashed") {
            var dash_supported = common.dashOn(ctx, style.on, style.off);
            if (dash_supported) {
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
              common.dashOff(ctx);
              ctx.beginPath();
            } else {
              ctx.beginPath();
              if (y1 === y2) {
                var x = Math.min(x1, x2);
                x2 = Math.max(x1, x2);
                while (x < x2) {
                  ctx.moveTo(x, y1);
                  ctx.lineTo(x + style.on, y1);
                  ctx.stroke();
                  x += style.on + style.off;
                }
              } else {
                if (x1 === x2) {
                  var y = Math.min(y1, y2);
                  y2 = Math.max(y1, y2);
                  while (y < y2) {
                    ctx.moveTo(x1, y);
                    ctx.lineTo(x1, y + style.on);
                    ctx.stroke();
                    y += style.on + style.off;
                  }
                } else {
                  throw "Only horizontal or vertical dashed lines are supported";
                }
              }
              ctx.beginPath();
            }
          } else {
            if (style.mode === "xor") {
              if (typeof Uint8ClampedArray === "undefined") {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.beginPath();
              } else {
                var w = 0;
                var h = 0;
                if (y1 === y2) {
                  w = Math.abs(x2 - x1);
                  h = width;
                  x1 = Math.min(x1, x2);
                } else {
                  if (x1 === x2) {
                    w = width;
                    h = Math.abs(y2 - y1);
                    y1 = Math.min(y1, y2);
                  } else {
                    throw "Only horizontal and vertical lines can be drawn with XOR";
                  }
                }
                if (w === 0 || h === 0) {
                  return;
                }
                x1 = Math.floor(x1);
                y1 = Math.floor(y1);
                var imgd = ctx.getImageData(x1, y1, w, h);
                var pix = imgd.data;
                for (var i = 0, n = pix.length;i < n;i += 4) {
                  pix[i] = 255 - pix[i];
                  pix[i + 1] = 255 - pix[i + 1];
                  pix[i + 2] = 255 - pix[i + 2];
                  pix[i + 3] = 255;
                }
                ctx.putImageData(imgd, x1, y1);
                ctx.clearRect(0, 0, 1, 1);
              }
            }
          }
        }
      }
      function draw_poly(ctx, pix, color, width) {
        start_poly(ctx, pix, width);
        if (color) {
          ctx.strokeStyle = color;
        }
        ctx.stroke();
        ctx.closePath();
      }
      function fill_poly(ctx, pix, lineColor, fillColor, width) {
        start_poly(ctx, pix, width);
        if (lineColor) {
          ctx.strokeStyle = lineColor;
        }
        if (fillColor) {
          ctx.fillStyle = fillColor;
        }
        ctx.fill();
        ctx.closePath();
      }
      function start_poly(ctx, pix, width) {
        if (pix.length < 1) {
          return;
        }
        var x = pix[0].x;
        var y = pix[0].y;
        if (width) {
          ctx.lineWidth = width;
        } else {
          ctx.lineWidth = 1;
        }
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var i = 0;i < pix.length;i++) {
          x = pix[i].x;
          y = pix[i].y;
          ctx.lineTo(x, y);
        }
      }
      function draw_rectangle(ctx, x, y, width, height, color, lineWidth) {
        if (lineWidth) {
          ctx.lineWidth = lineWidth;
        }
        if (color) {
          ctx.strokeStyle = color;
        }
        ctx.strokeRect(x, y, width, height);
      }
      function fill_rectangle(ctx, x, y, width, height, fillColor, strokeColor, lineWidth) {
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
      function pc2px(perc) {
        return Math.floor(Math.round(255 * (perc / 100)));
      }
      function to_rgb(red, green, blue) {
        return "rgb(" + Math.round(red) + ", " + Math.round(green) + ", " + Math.round(blue) + ")";
      }
      mx.getcolor = function(Mx, map, z) {
        var iz = 0;
        for (;iz < 6 && map[iz + 1].pos === 0;iz++) {
        }
        while (z > map[iz].pos && iz < 6) {
          iz++;
        }
        if (iz === 0 || z >= map[iz].pos) {
          return to_rgb(pc2px(map[iz].red), pc2px(map[iz].green), pc2px(map[iz].blue));
        } else {
          var pf = (z - map[iz - 1].pos) / (map[iz].pos - map[iz - 1].pos);
          var zf = pc2px(pf * 100);
          var zf1 = 255 - zf;
          return to_rgb(zf * (map[iz].red / 100) + zf1 * (map[iz - 1].red / 100), zf * (map[iz].green / 100) + zf1 * (map[iz - 1].green / 100), zf * (map[iz].blue / 100) + zf1 * (map[iz - 1].blue / 100));
        }
      };
      function trimlabel(lbl, inside) {
        var k;
        var j;
        if (lbl.substring(5, 8) === ".000000") {
          k = 4;
        } else {
          k = lbl.length - 1;
          while (lbl[k] === "0") {
            k = k - 1;
          }
        }
        j = 0;
        while (lbl[j] === " " && (k - j + 1 > 5 || inside)) {
          j = j + 1;
        }
        var res = lbl.substring(j, k + 1);
        if (res.indexOf(".") === -1) {
          res += ".";
        }
        return res;
      }
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
      function display_warpbox(Mx) {
        Mx._animationFrameHandle = undefined;
        var warpbox = Mx.warpbox;
        var ctx = Mx.active_canvas.getContext("2d");
        if (!warpbox) {
          return;
        }
        if (Mx.xpos >= warpbox.xmin && Mx.xpos <= warpbox.xmax && (Mx.ypos >= warpbox.ymin && Mx.ypos <= warpbox.ymax)) {
          warpbox.xl = Mx.xpos;
          warpbox.yl = Mx.ypos;
          var x = Math.min(warpbox.xo, warpbox.xl);
          var y = Math.min(warpbox.yo, warpbox.yl);
          var w = Math.abs(warpbox.xl - warpbox.xo);
          var h = Math.abs(warpbox.yl - warpbox.yo);
          if (w === 0 || h === 0) {
            return;
          }
          if (warpbox.mode === "vertical") {
            x = Mx.l;
            w = Mx.r - Mx.l;
          } else {
            if (warpbox.mode === "horizontal") {
              y = Mx.t;
              h = Mx.b - Mx.t;
            }
          }
          mx.onWidgetLayer(Mx, function() {
            mx.erase_window(Mx);
            mx.draw_box(Mx, "xor", x, y, w, h, warpbox.style.opacity, warpbox.style.fill_color);
          });
        }
      }
      function log10(val) {
        return Math.log(val) / Math.log(10);
      }
      mx.format_g = function(num, w, d, leading_nonzero) {
        var w = Math.min(w, d + 7);
        var f = Math.abs(num).toString();
        var decloc = f.indexOf(".");
        if (decloc === -1) {
          f = f + ".";
          decloc = f.length;
        }
        var exp = 0;
        var eloc = f.indexOf("e");
        if (eloc !== -1) {
          exp = parseInt(f.slice(eloc + 1, f.length), 10);
          f = f.slice(0, eloc);
        }
        var dz = Math.min(d - (f.length - decloc) + 1, d);
        for (var i = 0;i < dz;i++) {
          f = f + "0";
        }
        if (num !== 0) {
          if (Math.abs(num) < 1) {
            if (f.slice(0, 2) === "0.") {
              for (var i = 2;i < f.length;i++) {
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
          } else {
            if (decloc > d) {
              var exp = Math.max(0, decloc - 1);
              f = f[0] + "." + f.slice(1, d + 1);
            } else {
              f = f.slice(0, d + 2);
            }
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
      mx.format_f = function(num, s, d) {
        d = Math.max(Math.min(d, 20), 0);
        var f = num.toFixed(d).toString();
        f = mx.pad(f, s + d, " ");
        return f;
      };
      mx.pad = function(s, size, c) {
        while (s.length < size) {
          s = c + s;
        }
        return s;
      };
      mx.legacy_shadowbox = function(Mx, x, y, w, h, shape, func, label) {
        var length = label.length;
        var xt = 0;
        var yt = 0;
        var bw = 0;
        var pix = [];
        for (var cnt = 0;cnt < 11;cnt++) {
          pix[cnt] = {x:0, y:0};
        }
        var fill = !(func === 1 || func === -1);
        var j = shape === mx.L_ArrowLeft || shape === mx.L_ArrowUp ? 1 : 2;
        if (func !== 0 && mx.GBorder > 0) {
          bw = m.trunc(Math.min(w, h) / 3);
          bw = Math.max(1, Math.min(bw, mx.GBorder));
        }
        if (bw > 0) {
          pix[0].x = pix[1].x = x;
          pix[8].x = pix[9].x = x + w;
          pix[1].y = pix[8].y = y;
          pix[0].y = pix[9].y = y + h;
          switch(shape) {
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
        pix[4].x = pix[5].x = x;
        pix[3].x = pix[6].x = x + w;
        pix[3].y = pix[4].y = y;
        pix[5].y = pix[6].y = y + h;
        switch(shape) {
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
          ctx.fillStyle = func > 0 ? Mx.xwts : Mx.xwbs;
          fill_poly(ctx, pix.slice(0, 7));
          ctx.fillStyle = func < 0 ? Mx.xwts : Mx.xwbs;
          fill_poly(ctx, pix.slice(5, 11));
        }
        if (fill) {
          ctx.fillStyle = Mx.xwbg;
          fill_poly(ctx, pix.slice(3, 8));
        }
        ctx.fillStyle = Mx.xwfg;
        ctx.textBaseline = "alphabetic";
        if (fill && length > 0) {
          length = Math.min(length, m.trunc(w / Mx.text_w));
          length = Math.max(length, 1);
          xt = x + m.trunc((w - length * Mx.text_w) / 2);
          yt = y + m.trunc((h + 0.7 * Mx.text_h) / 2);
          ctx.fillText(label, xt, yt);
        }
      };
      mx.sigplot_shadowbox = function(Mx, x, y, w, h, shape, func, label, alpha) {
        var ctx = Mx.active_canvas.getContext("2d");
        var length = label.length;
        var color = func < 0 ? Mx.xwts : Mx.xwbs;
        alpha = alpha || 1;
        var pix = [];
        for (var cnt = 0;cnt < 11;cnt++) {
          pix[cnt] = {x:0, y:0};
        }
        switch(shape) {
          case mx.L_ArrowLeft:
          ;
          case mx.L_ArrowRight:
          ;
          case mx.L_ArrowUp:
          ;
          case mx.L_ArrowDown:
            var pix = mx.chevron(shape, x, y, w, h);
            ctx.fillStyle = func > 0 ? Mx.xwts : Mx.xwbs;
            fill_poly(ctx, pix.slice(0, 6));
            break;
          default:
            mx.draw_round_box(Mx, color, x, y, w, h, alpha, Mx.xwbg, 5, Mx.xwbs);
            break;
        }
        ctx.fillStyle = Mx.xwfg;
        ctx.textBaseline = "alphabetic";
        var fill = !(func === 1 || func === -1);
        if (fill && length > 0) {
          length = Math.min(length, m.trunc(w / Mx.text_w));
          length = Math.max(length, 1);
          var xt = x + m.trunc((w - length * Mx.text_w) / 2);
          var yt = y + m.trunc((h + 0.7 * Mx.text_h) / 2);
          ctx.fillText(label, xt, yt);
        }
      };
      if (mx.LEGACY_RENDER) {
        mx.shadowbox = mx.legacy_shadowbox;
      } else {
        mx.shadowbox = mx.sigplot_shadowbox;
      }
      mx.chevron = function(shape, x, y, w, h, e) {
        var q = Math.min(w, h);
        if (!e) {
          e = q * 0.25;
        }
        var pix = [];
        for (var cnt = 0;cnt < 6;cnt++) {
          pix[cnt] = {x:0, y:0};
        }
        var x_offset = m.trunc((w - q) / 2 + q / 4 - e / (2 * 1.414));
        var y_offset = m.trunc((h - q) / 2 + q / 4 - e / (2 * 1.414));
        switch(shape) {
          case mx.L_ArrowLeft:
            pix[0].x = x + x_offset;
            pix[0].y = y + m.trunc(q / 2);
            pix[1].x = x + x_offset + m.trunc(q / 2);
            pix[1].y = y;
            pix[2].x = x + x_offset + m.trunc(q / 2 + e / 1.414);
            pix[2].y = y + m.trunc(e / 1.414);
            pix[3].x = x + x_offset + m.trunc(2 * e / 1.414);
            pix[3].y = y + m.trunc(q / 2);
            pix[4].x = x + x_offset + m.trunc(q / 2 + e / 1.414);
            pix[4].y = y + h - m.trunc(e / 1.414);
            pix[5].x = x + x_offset + m.trunc(q / 2);
            pix[5].y = y + q;
            break;
          case mx.L_ArrowRight:
            pix[0].x = x + w - x_offset;
            pix[0].y = y + m.trunc(q / 2);
            pix[1].x = x + w - x_offset - m.trunc(q / 2);
            pix[1].y = y;
            pix[2].x = x + w - x_offset - m.trunc(q / 2 + e / 1.414);
            pix[2].y = y + m.trunc(e / 1.414);
            pix[3].x = x + w - x_offset - m.trunc(2 * e / 1.414);
            pix[3].y = y + m.trunc(q / 2);
            pix[4].x = x + w - x_offset - m.trunc(q / 2 + e / 1.414);
            pix[4].y = y + h - m.trunc(e / 1.414);
            pix[5].x = x + w - x_offset - m.trunc(q / 2);
            pix[5].y = y + q;
            break;
          case mx.L_ArrowUp:
            pix[0].x = x + m.trunc(q / 2);
            pix[0].y = y + y_offset;
            pix[1].x = x;
            pix[1].y = y + y_offset + m.trunc(q / 2);
            pix[2].x = x + m.trunc(e / 1.414);
            pix[2].y = y + y_offset + m.trunc(q / 2 + e / 1.414);
            pix[3].x = x + m.trunc(q / 2);
            pix[3].y = y + y_offset + m.trunc(2 * e / 1.414);
            pix[4].x = x + w - m.trunc(e / 1.414);
            pix[4].y = y + y_offset + m.trunc(q / 2 + e / 1.414);
            pix[5].x = x + q;
            pix[5].y = y + y_offset + m.trunc(q / 2);
            break;
          case mx.L_ArrowDown:
            pix[0].x = x + m.trunc(q / 2);
            pix[0].y = y + h - y_offset;
            pix[1].x = x;
            pix[1].y = y + h - y_offset - m.trunc(q / 2);
            pix[2].x = x + m.trunc(e / 1.414);
            pix[2].y = y + h - y_offset - m.trunc(q / 2 + e / 1.414);
            pix[3].x = x + m.trunc(q / 2);
            pix[3].y = y + h - y_offset - m.trunc(2 * e / 1.414);
            pix[4].x = x + w - m.trunc(e / 1.414);
            pix[4].y = y + h - y_offset - m.trunc(q / 2 + e / 1.414);
            pix[5].x = x + q;
            pix[5].y = y + h - y_offset - m.trunc(q / 2);
            break;
        }
        return pix;
      };
      mx.ifevent = function(Mx, mouseEvent) {
        Mx.button_press = 0;
        Mx.button_release = 0;
        Mx.state_mask = 0;
        var rect = mouseEvent.target.getBoundingClientRect();
        var eventXPos = mouseEvent.offsetX === undefined ? mouseEvent.pageX - rect.left - window.scrollX : mouseEvent.offsetX;
        var eventYPos = mouseEvent.offsetX === undefined ? mouseEvent.pageY - rect.top - window.scrollY : mouseEvent.offsetY;
        switch(mouseEvent.type) {
          case "mousedown":
            Mx.xpos = m.bound(eventXPos, 0, Mx.width);
            Mx.ypos = m.bound(eventYPos, 0, Mx.height);
            switch(mouseEvent.which) {
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
            break;
          case "mouseup":
            Mx.xpos = m.bound(eventXPos, 0, Mx.width);
            Mx.ypos = m.bound(eventYPos, 0, Mx.height);
            switch(mouseEvent.which) {
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
            break;
        }
      };
      mx.scroll_real2pix = function(sv) {
        if (sv.range === 0) {
          return{s1:sv.a1, sw:sv.a2 - sv.a1};
        } else {
          var dv;
          var ts1;
          var ts2;
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
          return{s1:ts1, sw:Math.max(ts2 - ts1, sv.swmin)};
        }
      };
      mx.redrawScrollbar = function(sv, Mx, op) {
        var x;
        var y;
        var xcc;
        var ycc;
        var xss;
        var yss;
        var p1;
        var op1;
        var s1;
        var sw;
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
        if (sv.origin & 1) {
          y = ycc + yss / 2;
          if (sv.origin & 2) {
            op1 = xss - op1 - sv.sw;
            p1 = xss - p1 - sw;
          }
          if (op === mx.XW_DRAW) {
            var arrow = sv.arrow;
            mx.shadowbox(Mx, xcc, ycc, arrow, yss - 1, mx.L_ArrowLeft, 2, "", 0);
            mx.shadowbox(Mx, xcc + xss - arrow, ycc, arrow - 1, yss, mx.L_ArrowRight, 2, "", 0);
          }
          if (mx.LEGACY_RENDER) {
            mx.draw_line(Mx, Mx.fg, xcc + sv.a1, y, xcc + sv.a2, y);
            mx.shadowbox(Mx, xcc + p1, ycc, sw + 1, yss, 1, 2, "", 0);
          } else {
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
        } else {
          x = xcc + m.trunc(xss / 2);
          if (sv.origin <= 2) {
            op1 = yss - op1 - sv.sw;
            p1 = yss - p1 - sw;
          }
          if (op === mx.XW_DRAW) {
            var arrow = sv.arrow;
            mx.shadowbox(Mx, xcc, ycc, xss - 1, arrow, mx.L_ArrowUp, 2, "", 0);
            mx.shadowbox(Mx, xcc, ycc + yss - arrow, xss - 1, arrow, mx.L_ArrowDown, 2, "", 0);
          }
          if (mx.LEGACY_RENDER) {
            mx.draw_line(Mx, Mx.fg, x, ycc + sv.a1, x, ycc + sv.a2);
            mx.shadowbox(Mx, xcc, ycc + p1, xss, sw + 1, 1, 2, "", 0);
          } else {
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
      mx.real_to_pixel = function(Mx, x, y, clip) {
        var stk4 = mx.origin(Mx.origin, 4, Mx.stk[Mx.level]);
        if (stk4.xscl === 0 || stk4.yscl === 0) {
          return{x:0, y:0};
        }
        var left = stk4.x1;
        var top = stk4.y1;
        var xxmin = stk4.xmin;
        var xscl = 1 / stk4.xscl;
        var yymin = stk4.ymin;
        var yscl = 1 / stk4.yscl;
        var clipped_x = false;
        var clipped_y = false;
        if (x !== null) {
          clipped_x = x > stk4.xmax || x < stk4.xmin;
          if (clip) {
            x = Math.min(x, stk4.xmax);
            x = Math.max(x, stk4.xmin);
          }
          x = Math.round((x - xxmin) * xscl) + left;
        }
        if (y !== null) {
          clipped_y = y > stk4.ymin || y < stk4.ymax;
          if (clip) {
            y = Math.min(y, stk4.ymin);
            y = Math.max(y, stk4.ymax);
          }
          y = Math.round((y - yymin) * yscl) + top;
        }
        x = Math.round(x);
        y = Math.round(y);
        return{x:x, y:y, clipped_x:clipped_x, clipped_y:clipped_y, clipped:clipped_x || clipped_y};
      };
      mx.pixel_to_real = function(Mx, xpos, ypos) {
        var iretx = Math.min(Mx.r, Math.max(Mx.l, xpos));
        var irety = Math.min(Mx.b, Math.max(Mx.t, ypos));
        var retx;
        var rety;
        var k = Mx.level;
        if (Mx.origin !== 2 && Mx.origin !== 3) {
          retx = Mx.stk[k].xmin + (iretx - Mx.stk[k].x1) * Mx.stk[k].xscl;
        } else {
          retx = Mx.stk[k].xmin + (Mx.stk[k].x2 - iretx) * Mx.stk[k].xscl;
        }
        if (Mx.origin > 2) {
          rety = Mx.stk[k].ymin + (irety - Mx.stk[k].y1) * Mx.stk[k].yscl;
        } else {
          rety = Mx.stk[k].ymin + (Mx.stk[k].y2 - irety) * Mx.stk[k].yscl;
        }
        return{x:retx, y:rety};
      };
      mx.colormap = function(Mx, map, ncolors) {
        Mx.pixel = new Array(ncolors);
        var colorp = new Array(ncolors);
        var cf = 100 / (Math.max(2, ncolors) - 1);
        for (var n = 0;n < ncolors;n++) {
          colorp[n] = cf * n + 0.5;
        }
        var iz;
        for (iz = 0;iz < 6 && map[iz + 1].pos === 0;iz++) {
        }
        for (var n = 0;n < ncolors;n++) {
          Mx.pixel[n] = 0;
          var z = colorp[n];
          while (iz < 6 && Math.floor(z) > map[iz].pos) {
            iz++;
          }
          if (iz === 0 || z >= map[iz].pos) {
            Mx.pixel[n] = {red:pc2px(map[iz].red), green:pc2px(map[iz].green), blue:pc2px(map[iz].blue)};
          } else {
            var pf = (z - map[iz - 1].pos) / (map[iz].pos - map[iz - 1].pos);
            var zf = pc2px(pf * 100);
            var zf1 = 255 - zf;
            Mx.pixel[n] = {red:zf * (map[iz].red / 100) + zf1 * (map[iz - 1].red / 100), green:zf * (map[iz].green / 100) + zf1 * (map[iz - 1].green / 100), blue:zf * (map[iz].blue / 100) + zf1 * (map[iz - 1].blue / 100)};
          }
        }
      };
      mx.colorbar = function(Mx, x, y, w, h) {
        for (var j = 1;j < h;j++) {
          var cidx = Math.floor(Mx.pixel.length * (j - 1) / h);
          mx.draw_line(Mx, cidx, x, y + h - j, x + w, y + h - j);
        }
        mx.draw_box(Mx, Mx.fg, x + 0.5, y, w, h);
      };
      mx.legend_colorbar = function(Mx, x, y, w, h) {
        for (var j = 1;j < w;j++) {
          var cidx = Math.floor(Mx.pixel.length * (j - 1) / w);
          mx.draw_line(Mx, cidx, x + w - j, y, x + w - j, y + h);
        }
        mx.draw_box(Mx, Mx.fg, x + 0.5, y, w, h);
      };
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
        Mx._renderCanvas.width = buf.width;
        Mx._renderCanvas.height = buf.height;
        var imgctx = Mx._renderCanvas.getContext("2d");
        var imgd = imgctx.createImageData(Mx._renderCanvas.width, Mx._renderCanvas.height);
        var buf8 = new Uint8Array(buf);
        for (var yy = 0;yy < buf.height;++yy) {
          for (var xx = 0;xx < buf.width;++xx) {
            var index = (yy * buf.width + xx) * 4;
            imgd.data[index] = buf8[index];
            imgd.data[index + 1] = buf8[index + 1];
            imgd.data[index + 2] = buf8[index + 2];
            imgd.data[index + 3] = 255;
          }
        }
        imgctx.putImageData(imgd, 0, 0);
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
        if (buf.width < 32768 && buf.height < 32768) {
          Mx._renderCanvas.width = buf.width;
          Mx._renderCanvas.height = buf.height;
          var imgctx = Mx._renderCanvas.getContext("2d");
          var imgd = imgctx.createImageData(Mx._renderCanvas.width, Mx._renderCanvas.height);
          var buf8 = new Uint8ClampedArray(buf);
          imgd.data.set(buf8);
          imgctx.putImageData(imgd, 0, 0);
        } else {
          if (sw < 32768 && sh < 32768) {
            Mx._renderCanvas.width = sw;
            Mx._renderCanvas.height = sh;
            scaleImage(Mx._renderCanvas, buf, sx, sy, sw, sh);
          } else {
            Mx._renderCanvas.width = Math.min(w * 2, buf.width);
            Mx._renderCanvas.height = Math.min(h * 2, buf.height);
            scaleImage(Mx._renderCanvas, buf, sx, sy, sw, sh);
            sw = Mx._renderCanvas.width;
            sh = Mx._renderCanvas.height;
          }
          sx = 0;
          sy = 0;
        }
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
      function scaleImage(img, buf, sx, sy, sw, sh) {
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
        var w = img.width;
        var h = img.height;
        var imgctx = img.getContext("2d");
        var imgd = imgctx.createImageData(w, h);
        var ibuf = new ArrayBuffer(imgd.data.length);
        var buf8 = new Uint8ClampedArray(ibuf);
        var dest = new Uint32Array(ibuf);
        var width_scaling = sw / w;
        var height_scaling = sh / h;
        var xx = 0;
        var yy = 0;
        var jj = 0;
        for (var i = 0;i < dest.length;i++) {
          xx = Math.round(Math.floor(i % w) * width_scaling) + sx;
          yy = Math.round(Math.floor(i / w) * height_scaling) + sy;
          jj = Math.floor(yy * buf.width + xx);
          dest[i] = src[jj];
        }
        imgd.data.set(buf8);
        imgctx.putImageData(imgd, 0, 0);
      }
      var renderImage = typeof Uint8ClampedArray === "undefined" ? renderImageNoTypedArrays : renderImageTypedArrays;
      mx.shift_image_rows = function(Mx, buf, shift) {
        var imgd = new Uint32Array(buf);
        if (shift > 0) {
          shift = shift * buf.width;
          imgd.set(imgd.subarray(0, imgd.length - shift), shift);
        } else {
          if (shift < 0) {
            shift = Math.abs(shift) * buf.width;
            imgd.set(imgd.subarray(shift));
          }
        }
        return buf;
      };
      mx.update_image_row = function(Mx, buf, data, row, zmin, zmax, xcompression) {
        var imgd = new Uint32Array(buf, row * buf.width * 4, buf.width);
        var fscale = 1;
        if (zmax !== zmin) {
          fscale = Mx.pixel.length / Math.abs(zmax - zmin);
        }
        var xc = Math.max(1, data.length / buf.width);
        for (var i = 0;i < buf.width;i++) {
          var didx = Math.floor(i * xc);
          var value = data[didx];
          if (xc > 1) {
            if (xcompression === 1) {
              for (var j = 1;j < xc;j++) {
                value += data[didx + j];
              }
              value = value / xc;
            } else {
              if (xcompression === 2) {
                for (var j = 1;j < xc;j++) {
                  value = Math.min(value, data[didx + j]);
                }
              } else {
                if (xcompression === 3) {
                  for (var j = 1;j < xc;j++) {
                    value = Math.max(value, data[didx + j]);
                  }
                } else {
                  if (xcompression === 4) {
                    value = data[i];
                  } else {
                    if (xcompression === 5) {
                      for (var j = 1;j < xc;j++) {
                        value = Math.max(Math.abs(value), Math.abs(data[didx + j]));
                      }
                    }
                  }
                }
              }
            }
          }
          var cidx = Math.floor((value - zmin) * fscale);
          cidx = Math.max(0, Math.min(Mx.pixel.length - 1, cidx));
          var color = Mx.pixel[cidx];
          if (color) {
            imgd[i] = 255 << 24 | color.blue << 16 | color.green << 8 | color.red;
          }
        }
        return imgd;
      };
      mx.create_image = function(Mx, data, subsize, w, h, zmin, zmax, xcompression) {
        var ctx = Mx.active_canvas.getContext("2d");
        if (!Mx.pixel || Mx.pixel.length === 0) {
          m.log.warn("COLORMAP not initialized, defaulting to foreground");
          mx.colormap(Mx, m.Mc.colormap[1].colors, 16);
        }
        var fscale = 1;
        if (zmax !== zmin) {
          fscale = Mx.pixel.length / Math.abs(zmax - zmin);
        }
        w = Math.ceil(w);
        h = Math.ceil(h);
        var buf = new ArrayBuffer(w * h * 4);
        buf.width = w;
        buf.height = h;
        var nxc = Math.max(1, subsize / w);
        var imgd = new Uint32Array(buf);
        if (data) {
          for (var i = 0;i < imgd.length;i++) {
            var ix;
            var iy;
            if (Mx.origin === 1 || Mx.origin === 4) {
              ix = Math.floor(i % w);
            } else {
              ix = w - Math.floor(i % w) - 1;
            }
            if (Mx.origin === 3 || Mx.origin === 4) {
              iy = Math.floor(i / w);
            } else {
              iy = h - Math.floor(i / w) - 1;
            }
            if (iy === 1) {
              var test = 1
            }
            var didx = iy * subsize + Math.floor(ix * nxc);
            var value = data[didx];
            if (nxc > 1) {
              if (xcompression === 1) {
                for (var j = 1;j < nxc;j++) {
                  value += data[didx + j];
                }
                value = value / nxc;
              } else {
                if (xcompression === 2) {
                  for (var j = 1;j < nxc;j++) {
                    value = Math.min(value, data[didx + j]);
                  }
                } else {
                  if (xcompression === 3) {
                    for (var j = 1;j < nxc;j++) {
                      value = Math.max(value, data[didx + j]);
                    }
                  } else {
                    if (xcompression === 4) {
                      value = data[didx];
                    } else {
                      if (xcompression === 5) {
                        for (var j = 1;j < nxc;j++) {
                          value = Math.max(Math.abs(value), Math.abs(data[didx + j]));
                        }
                      }
                    }
                  }
                }
              }
            }
            var cidx = Math.floor((value - zmin) * fscale);
            cidx = Math.max(0, Math.min(Mx.pixel.length - 1, cidx));
            var color = Mx.pixel[cidx];
            if (color) {
              imgd[i] = 255 << 24 | color.blue << 16 | color.green << 8 | color.red;
            }
          }
        }
        return buf;
      };
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
        for (var i = 0;i < imgd.length;i++) {
          var cidx = Math.max(0, data[i]);
          cidx = Math.min(Mx.pixel.length - 1, cidx);
          var color = Mx.pixel[cidx];
          if (color) {
            imgd[i] = 255 << 24 | color.blue << 16 | color.green << 8 | color.red;
          }
        }
        renderImage(Mx, ctx, buf, opacity, smoothing, xd, yd, w, h);
        return buf;
      };
      mx.draw_image = function(Mx, buf, xmin, ymin, xmax, ymax, opacity, smoothing) {
        var view_xmin = Math.max(xmin, Mx.stk[Mx.level].xmin);
        var view_xmax = Math.min(xmax, Mx.stk[Mx.level].xmax);
        var view_ymin = Math.max(ymin, Mx.stk[Mx.level].ymin);
        var view_ymax = Math.min(ymax, Mx.stk[Mx.level].ymax);
        if (buf.width <= 1 || Math.abs(xmax - xmin) === 0) {
          return;
        }
        if (buf.height <= 1 || Math.abs(ymax - ymin) === 0) {
          return;
        }
        var rx = buf.width / (xmax - xmin);
        var ry = buf.height / (ymax - ymin);
        view_xmin = Math.floor(view_xmin * rx) / rx;
        view_xmax = Math.ceil(view_xmax * rx) / rx;
        view_ymin = Math.floor(view_ymin * ry) / ry;
        view_ymax = Math.ceil(view_ymax * ry) / ry;
        var ul, lr;
        var sy, sx, sw, sh;
        if (Mx.origin === 1) {
          sy = Math.max(0, Math.floor((ymax - view_ymax) * ry));
          sh = Math.min(buf.height - sy, Math.floor((view_ymax - view_ymin) * ry));
          sx = Math.max(0, Math.floor((view_xmin - xmin) * rx));
          sw = Math.min(buf.width - sx, Math.floor((view_xmax - view_xmin) * rx));
          ul = mx.real_to_pixel(Mx, view_xmin, view_ymax);
          lr = mx.real_to_pixel(Mx, view_xmax, view_ymin);
        } else {
          if (Mx.origin === 2) {
            sy = Math.max(0, Math.floor((ymax - view_ymax) * ry));
            sh = Math.min(buf.height - sy, Math.floor((view_ymax - view_ymin) * ry));
            sx = Math.max(0, Math.ceil((view_xmin - xmin) * rx));
            sw = Math.min(buf.width - sx, Math.floor((view_xmax - view_xmin) * rx));
            ul = mx.real_to_pixel(Mx, view_xmax, view_ymax);
            lr = mx.real_to_pixel(Mx, view_xmin, view_ymin);
          } else {
            if (Mx.origin === 3) {
              sy = Math.max(0, Math.ceil((view_ymin - ymin) * ry));
              sh = Math.min(buf.height - sy, Math.floor((view_ymax - view_ymin) * ry));
              sx = Math.max(0, Math.ceil((view_xmin - xmin) * rx));
              sw = Math.min(buf.width - sx, Math.floor((view_xmax - view_xmin) * rx));
              ul = mx.real_to_pixel(Mx, view_xmax, view_ymin);
              lr = mx.real_to_pixel(Mx, view_xmin, view_ymax);
            } else {
              if (Mx.origin === 4) {
                sy = Math.max(0, Math.ceil((view_ymin - ymin) * ry));
                sh = Math.min(buf.height - sy, Math.floor((view_ymax - view_ymin) * ry));
                sx = Math.max(0, Math.floor((view_xmin - xmin) * rx));
                sw = Math.min(buf.width - sx, Math.floor((view_xmax - view_xmin) * rx));
                ul = mx.real_to_pixel(Mx, view_xmin, view_ymin);
                lr = mx.real_to_pixel(Mx, view_xmax, view_ymax);
              }
            }
          }
        }
        var iw = lr.x - ul.x;
        var ih = lr.y - ul.y;
        sw = Math.max(1, sw);
        sh = Math.max(1, sh);
        if (typeof smoothing === "number") {
          var ratio = (Mx.r - Mx.l) / sw;
          smoothing = ratio <= smoothing;
        }
        var ctx = Mx.active_canvas.getContext("2d");
        ctx.save();
        ctx.beginPath();
        ctx.rect(Mx.l, Mx.t, Mx.r - Mx.l, Mx.b - Mx.t);
        ctx.clip();
        renderImage(Mx, ctx, buf, opacity, smoothing, ul.x, ul.y, iw, ih, sx, sy, sw, sh);
        ctx.restore();
      };
      module.exports = mx;
    })();
  }, {"./CanvasInput":1, "./common":3, "./m":4, "tinycolor2":12}], 7:[function(require, module, exports) {
    (function() {
      var version = "2.0.0rc";
      var Spinner = require("spin");
      var common = require("./common");
      var bluefile = require("./bluefile");
      var matfile = require("./matfile");
      var m = require("./m");
      var mx = require("./mx");
      var Layer1D = require("./sigplot.layer1d");
      var Layer2D = require("./sigplot.layer2d");
      function sigplot(element, options) {
        if (!(this instanceof sigplot)) {
          return new sigplot.Plot(element, options);
        }
      }
      sigplot.bluefile = bluefile;
      sigplot.matfile = matfile;
      sigplot.m = m;
      sigplot.mx = mx;
      sigplot.Layer1D = Layer1D;
      sigplot.Layer2D = Layer2D;
      sigplot.version = version;
      var KEYPRESS_HELP = "Keypress Table:\n" + "--------------\n" + "?       - Main help box.\n" + "A       - Toggle display x,y readouts:\n" + "          (absc) -> (index) -> (1/absc) -> (time).\n" + "B       - Toggle LM Drag Mode:\n" + "          (box) -> (horizontal) -> (vertical).\n" + "C       - Toggle controls.\n" + "K       - Show Marker.\n" + "L       - Toggle legend.\n" + "M       - Pops up main menu\n" + "R       - Toggle display specs (x/y readout)\n" + "S       - Toggle display specs and axes.\n" + 
      "T       - Popup box with timecode value at mouse.\n" + "X       - In 1D mode, popup box with X value at mouse.\n" + "        - In 2D mode, toggle x-cut display.\n" + "Y       - In 1D mode, popup box with Y value at mouse.\n" + "        - In 2D mode, toggle y-cut display.\n" + "P       - In 2D mode, displays p-cuts along side and bottom.\n" + "F       - Toggle fullscreen.\n" + "Cntrl+I - Invert colors.";
      var MAIN_HELP = "To zoom, press and drag the left mouse (LM) over the region of interest and release. " + "To unzoom, press right mouse (RM).  Press the middle mouse (MM) button or press the 'M' key to open the main menu." + "View the function of all keypresses by selecting 'Keypress Info' from the main menu.";
      sigplot.browserIsCompatible = function browserIsCompatible() {
        var test_canvas = document.createElement("canvas");
        var hascanvas = test_canvas.getContext ? true : false;
        var hasarraybuf = "ArrayBuffer" in window;
        return hascanvas && hasarraybuf;
      };
      sigplot.Plot = function(element, options) {
        if (!sigplot.browserIsCompatible()) {
          throw "Browser is not compatible";
        }
        this._Mx = mx.open(element);
        var Mx = this._Mx;
        this._Gx = new GX;
        this._Gx.parent = element;
        this.mouseOnCanvas = false;
        if (!options) {
          options = {};
        }
        plot_init(this, options);
        this._refresh();
        this.onmousemove = function(plot) {
          return function(e) {
            var Mx = plot._Mx;
            var Gx = plot._Gx;
            var rect = e.target.getBoundingClientRect();
            var xpos = e.offsetX === undefined ? e.pageX - rect.left - window.scrollX : e.offsetX;
            var ypos = e.offsetX === undefined ? e.pageY - rect.top - window.scrollY : e.offsetY;
            var re = pixel_to_real(plot, xpos, ypos);
            Gx.retx = re.x;
            Gx.rety = re.y;
            if (Mx.widget) {
              return;
            }
            display_specs(plot);
            var evt = document.createEvent("Event");
            evt.initEvent("mmove", true, true);
            evt.xpos = xpos;
            evt.ypos = ypos;
            evt.x = Gx.retx;
            evt.y = Gx.rety;
            var executeDefault = mx.dispatchEvent(Mx, evt);
            if (!executeDefault) {
              return;
            }
            if (Gx.cross) {
              if (Mx.warpbox) {
                if (Gx.cross_xpos !== undefined) {
                  mx.rubberline(Mx, Gx.cross_xpos, Mx.t, Gx.cross_xpos, Mx.b);
                }
                if (Gx.cross_ypos !== undefined) {
                  mx.rubberline(Mx, Mx.l, Gx.cross_ypos, Mx.r, Gx.cross_ypos);
                }
                Gx.cross_xpos = undefined;
                Gx.cross_ypos = undefined;
              } else {
                if (plot.mouseOnCanvas) {
                  draw_crosshairs(plot);
                  if (Gx.p_cuts && Gx.lyr[0].hcb["class"] === 2) {
                    if (!Gx.y_cut_press_on && !Gx.x_cut_press_on) {
                      draw_p_cuts(plot);
                    }
                  }
                }
              }
            }
            if (Gx.cntrls === 2) {
              var evt = document.createEvent("Event");
              evt.initEvent("mtag", true, true);
              evt.x = Gx.retx;
              evt.y = Gx.rety;
              evt.xpos = xpos;
              evt.ypos = ypos;
              mx.dispatchEvent(Mx, evt);
            }
          };
        }(this);
        this.throttledOnMouseMove = m.throttle(this._Gx.scroll_time_interval, this.onmousemove);
        mx.addEventListener(Mx, "mousemove", this.throttledOnMouseMove, false);
        this.onmouseout = function(plot) {
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
        }(this);
        mx.addEventListener(Mx, "mouseout", this.onmouseout, false);
        this.onmouseover = function(plot) {
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
        }(this);
        mx.addEventListener(Mx, "mouseover", this.onmouseover, false);
        this.onmousedown = function(plot) {
          return function(event) {
            event.preventDefault();
            var Mx = plot._Mx;
            var Gx = plot._Gx;
            if (Mx.widget && Mx.widget.type === "ONESHOT") {
              Mx.widget = null;
              plot.refresh();
            }
            mx.ifevent(Mx, event);
            var evt = document.createEvent("Event");
            evt.initEvent("mdown", true, true);
            evt.xpos = Mx.xpos;
            evt.ypos = Mx.ypos;
            evt.x = Gx.retx;
            evt.y = Gx.rety;
            evt.which = event.which;
            var executeDefault = mx.dispatchEvent(Mx, evt);
            if (!executeDefault) {
              return false;
            }
            var inPan = inPanRegion(plot);
            if (inPan.inPanRegion) {
              event.preventDefault();
              if (inPan.command !== " ") {
                var scrollbar = null;
                var position = null;
                if (inPan.command === "XPAN") {
                  scrollbar = Mx.scrollbar_x;
                } else {
                  if (inPan.command === "YPAN") {
                    scrollbar = Mx.scrollbar_y;
                  }
                }
                if (event.which === 2) {
                  position = {x:Mx.xpos, y:Mx.ypos};
                  if (scrollbar !== undefined && onScrollbar(position, scrollbar)) {
                    sigplot_scrollScaleMenu(plot, inPan.command);
                  }
                } else {
                  if (inPan.command !== " ") {
                    position = {x:Mx.xpos, y:Mx.ypos};
                    if (!onScrollbar(position, scrollbar) && event.which === 1) {
                      pan(plot, inPan.command, 0, event);
                      var repeatPan = function() {
                        if (!onScrollbar({"x":Mx.xpos, "y":Mx.ypos}, scrollbar)) {
                          pan(plot, inPan.command, 0, event);
                        } else {
                          if (Gx.stillPanning) {
                            window.clearInterval(Gx.stillPanning);
                            Gx.repeatPanning = undefined;
                          }
                        }
                      };
                      Gx.stillPanning = window.setTimeout(function() {
                        Gx.repeatPanning = window.setInterval(repeatPan, 50);
                      }, 250);
                    }
                  }
                }
              }
            } else {
              if (event.which === 1 || event.which === 3) {
                var lButtonPressed = false;
                if (Gx.legendBtnLocation) {
                  lButtonPressed = coordsInRectangle(Mx.xpos, Mx.ypos, Gx.legendBtnLocation.x, Gx.legendBtnLocation.y, Gx.legendBtnLocation.width, Gx.legendBtnLocation.height);
                }
                if (Gx.lg_colorbar && Gx.lyr[0].hcb["class"] === 2) {
                  if (event.which === 1 || event.which === 3) {
                    var mouse_x = Mx.xpos;
                    var mouse_y = Mx.ypos;
                    var top_x1 = Gx.cbb_top_x1;
                    var top_y1 = Gx.cbb_top_y1;
                    var top_x2 = top_x1 + Gx.cbb_width;
                    var top_y2 = top_y1;
                    var top_x3 = top_x1 + 1 / 2 * Gx.cbb_width;
                    var top_y3 = top_y1 - Gx.cbb_height;
                    var topButtonPressed = coordsInTriangle(mouse_x, mouse_y, top_x1, top_y1, top_x2, top_y2, top_x3, top_y3);
                    if (topButtonPressed) {
                      var cur_cmap = Gx.cmap;
                      plot.get_layer(0).img = undefined;
                      console.log(m.Mc.colormap[cur_cmap]);
                      var current_map = m.Mc.colormap[cur_cmap];
                      for (var i = 0;i < current_map.colors.length;i++) {
                        current_map.colors[i].pos += 5;
                      }
                      mx.colormap(Mx, current_map.colors, 16);
                      plot.refresh();
                    }
                    var bot_x1 = Gx.cbb_bot_x1;
                    var bot_y1 = Gx.cbb_bot_y1;
                    var bot_x2 = bot_x1 + Gx.cbb_width;
                    var bot_y2 = bot_y1;
                    var bot_x3 = bot_x1 + 1 / 2 * Gx.cbb_width;
                    var bot_y3 = bot_y1 + Gx.cbb_height;
                    var botButtonPressed = coordsInTriangle(mouse_x, mouse_y, bot_x1, bot_y1, bot_x2, bot_y2, bot_x3, bot_y3);
                    if (botButtonPressed) {
                      var cur_cmap = Gx.cmap;
                      var current_map = m.Mc.colormap[cur_cmap];
                      plot.get_layer(0).img = undefined;
                      for (var i = 0;i < current_map.colors.length;i++) {
                        current_map.colors[i].pos -= 5;
                      }
                      mx.colormap(Mx, current_map.colors, 16);
                      plot.refresh();
                    }
                  }
                }
                if (lButtonPressed) {
                  plot.change_settings({legend:!Gx.legend});
                } else {
                  display_specs(plot);
                  var zoom_style = {opacity:0, return_value:"zoom"};
                  var select_style = {opacity:0.4, fill_color:Mx.hi, return_value:"select"};
                  if (event.which === 1) {
                    if (Gx.default_rubberbox_action === "zoom") {
                      mx.rubberbox(Mx, rubberbox_cb(plot, event.which), Gx.default_rubberbox_mode, zoom_style, select_style);
                    } else {
                      if (Gx.default_rubberbox_action === "select") {
                        mx.rubberbox(Mx, rubberbox_cb(plot, event.which), Gx.default_rubberbox_mode, select_style, zoom_style);
                      }
                    }
                  } else {
                    if (event.which === 3) {
                      if (Gx.default_rightclick_rubberbox_action === "zoom") {
                        mx.rubberbox(Mx, rubberbox_cb(plot, event.which), Gx.default_rightclick_rubberbox_mode, zoom_style, select_style);
                      } else {
                        if (Gx.default_rightclick_rubberbox_action === "select") {
                          mx.rubberbox(Mx, rubberbox_cb(plot, event.which), Gx.default_rightclick_rubberbox_mode, select_style, zoom_style);
                        }
                      }
                    }
                  }
                }
              } else {
                if (event.which === 2) {
                  if (!Gx.nomenu) {
                    sigplot_mainmenu(plot);
                  }
                }
              }
            }
            return false;
          };
        }(this);
        mx.addEventListener(Mx, "mousedown", this.onmousedown, false);
        this.ontouchstart = function(plot) {
          return function(event) {
            event.preventDefault();
            if (event.targetTouches.length === 1) {
              if (Mx.touchClear && Mx.touches) {
                window.clearTimeout(Mx.touchClear);
                plot.unzoom();
                middleClickScrollMenuAction(plot, mx.SB_FULL, "XPAN");
                middleClickScrollMenuAction(plot, mx.SB_FULL, "YPAN");
              } else {
                var touchEvent = event.targetTouches[0];
                var rect = touchEvent.target.getBoundingClientRect();
                var position = {x:touchEvent.pageX - rect.left - window.scrollX, y:touchEvent.pageY - rect.top - window.scrollY};
                Mx.xpos = m.bound(position.x, 0, Mx.width);
                Mx.ypos = m.bound(position.y, 0, Mx.height);
                var inPan = inPanRegion(plot, position);
                if (!inPan.inPanRegion) {
                  Mx.touches = event.targetTouches;
                }
              }
            } else {
              if (event.targetTouches.length === 2) {
                Mx.touch_distance = m.touch_distance(event.targetTouches[0], event.targetTouches[1]);
              }
            }
          };
        }(this);
        mx.addEventListener(Mx, "touchstart", this.ontouchstart, false);
        this.ontouchmove = function(plot) {
          return function(event) {
            var Mx = plot._Mx;
            var Gx = plot._Gx;
            var k = Mx.level;
            event.preventDefault();
            if (event.targetTouches.length === 1) {
              var touchStart = Mx.touches[0];
              var rect = touchStart.target.getBoundingClientRect();
              var startPosition = {x:touchStart.pageX - rect.left - window.scrollX, y:touchStart.pageY - rect.top - window.scrollY};
              var touchEvent = event.targetTouches[0];
              var rect = touchEvent.target.getBoundingClientRect();
              var position = {x:touchEvent.pageX - rect.left - window.scrollX, y:touchEvent.pageY - rect.top - window.scrollY};
              var new_xpos = m.bound(position.x, 0, Mx.width);
              var new_ypos = m.bound(position.y, 0, Mx.height);
              var delta_xpos = new_xpos - Mx.xpos;
              var delta_ypos = new_ypos - Mx.ypos;
              Mx.xpos = new_xpos;
              Mx.ypos = new_ypos;
              var inPan = inPanRegion(plot, position);
              if (inPan.inPanRegion) {
                return;
              }
              var xdelta = Mx.stk[k].xscl * delta_xpos;
              var ydelta = Mx.stk[k].yscl * delta_ypos;
              if (Mx.origin === 1) {
                xdelta *= -1;
              } else {
                if (Mx.origin === 2) {
                  ydelta *= -1;
                } else {
                  if (Mx.origin === 3) {
                    ydelta *= -1;
                  } else {
                    if (Mx.origin === 4) {
                      xdelta *= -1;
                      ydelta *= -1;
                    }
                  }
                }
              }
              var xmin = Mx.stk[k].xmin + xdelta;
              var xmax = Mx.stk[k].xmax + xdelta;
              var ymin = Mx.stk[k].ymin + ydelta;
              var ymax = Mx.stk[k].ymax + ydelta;
              if (xmin >= Gx.xmin && xmax <= Gx.xmax) {
                Mx.stk[k].xmin = xmin;
                Mx.stk[k].xmax = xmax;
              }
              if (ymin >= Gx.ymin && ymax <= Gx.ymax) {
                Mx.stk[k].ymin = ymin;
                Mx.stk[k].ymax = ymax;
              }
              if (Gx.cmode === Gx.basemode && Mx.level === 1) {
                Gx.xmin = Math.min(Gx.xmin, xmin);
                Gx.xmax = Math.max(Gx.xmax, xmax);
                Gx.ymin = Math.min(Gx.ymin, ymin);
                Gx.ymax = Math.max(Gx.ymax, ymax);
              }
              plot.refresh();
            } else {
              if (event.targetTouches.length === 2) {
                var cur_distance = m.touch_distance(event.targetTouches[0], event.targetTouches[1]);
                var scaling = (1 - Mx.touch_distance / cur_distance) * 0.05;
                var xran = Mx.stk[k].xmax - Mx.stk[k].xmin;
                var yran = Mx.stk[k].ymax - Mx.stk[k].ymin;
                var xmin = Mx.stk[k].xmin + scaling * xran;
                var xmax = Mx.stk[k].xmax - scaling * xran;
                var ymin = Mx.stk[k].ymin + scaling * yran;
                var ymax = Mx.stk[k].ymax - scaling * yran;
                Mx.stk[k].xmin = Math.max(Gx.xmin, xmin);
                Mx.stk[k].xmax = Math.min(Gx.xmax, xmax);
                Mx.stk[k].ymin = Math.max(Gx.ymin, ymin);
                Mx.stk[k].ymax = Math.min(Gx.ymax, ymax);
                plot.refresh();
              }
            }
          };
        }(this);
        this.throttledOnTouchMove = m.throttle(this._Gx.scroll_time_interval, this.ontouchmove);
        mx.addEventListener(Mx, "touchmove", this.throttledOnTouchMove, false);
        this.ontouchend = function(plot) {
          return function(event) {
            var Gx = plot._Gx;
            var Mx = plot._Mx;
            event.preventDefault();
            console.log("on touch end ", event.targetTouches.length);
            Gx.panning = undefined;
            plot._Mx.scrollbar_x.action = 0;
            plot._Mx.scrollbar_y.action = 0;
            Mx.touch_distance = undefined;
            mx.widget_callback(Mx, event);
            Mx.touchClear = window.setTimeout(function() {
              Mx.touches = undefined;
              Mx.touchClear = undefined;
            }, 100);
          };
        }(this);
        mx.addEventListener(Mx, "touchend", this.ontouchend, false);
        this.docMouseUp = function(plot) {
          return function(event) {
            var Gx = plot._Gx;
            if (event.which === 1) {
              Gx.panning = undefined;
              plot._Mx.scrollbar_x.action = 0;
              plot._Mx.scrollbar_y.action = 0;
            }
            if (Gx.stillPanning) {
              window.clearTimeout(Gx.stillPanning);
              Gx.stillPanning = undefined;
            }
            if (Gx.repeatPanning) {
              window.clearInterval(Gx.repeatPanning);
              Gx.repeatPanning = undefined;
            }
            return false;
          };
        }(this);
        document.addEventListener("mouseup", this.docMouseUp, false);
        this.mouseup = function(plot) {
          return function(event) {
            event.preventDefault();
            var Gx = plot._Gx;
            var Mx = plot._Mx;
            mx.ifevent(plot._Mx, event);
            var evt = document.createEvent("Event");
            evt.initEvent("mup", true, true);
            evt.xpos = Mx.xpos;
            evt.ypos = Mx.ypos;
            evt.x = Gx.retx;
            evt.y = Gx.rety;
            evt.which = event.which;
            var executeDefault = mx.dispatchEvent(Mx, evt);
            if (executeDefault) {
              if (Mx.warpbox || (Mx.widget || Mx.prompt)) {
                return;
              }
              if (event.which === 1) {
                var inCenter = inPanCenterRegion(plot);
                if (inCenter.inCenterRegion) {
                  if (inCenter.command !== " ") {
                    pan(plot, inCenter.command, 0, event);
                  }
                } else {
                  if (Gx.cntrls === 1) {
                    Gx.xmrk = Gx.retx;
                    Gx.ymrk = Gx.rety;
                    var mtagevt = document.createEvent("Event");
                    mtagevt.initEvent("mtag", true, true);
                    mtagevt.x = Gx.xmrk;
                    mtagevt.y = Gx.ymrk;
                    mtagevt.xpos = event.x || event.clientX;
                    mtagevt.ypos = event.y || event.clientY;
                    mtagevt.w = undefined;
                    mtagevt.h = undefined;
                    mtagevt.shift = event.shiftKey;
                    mx.dispatchEvent(Mx, mtagevt);
                    plot.redraw();
                  }
                }
              } else {
                if (event.which === 2) {
                  if (Gx.nomenu) {
                    var evt = document.createEvent("Event");
                    evt.initEvent("showmenu", true, true);
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
                          var hideMenuEvt = document.createEvent("Event");
                          hideMenuEvt.initEvent("hidemenu", true, true);
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
                } else {
                  if (event.which === 3) {
                    event.preventDefault();
                    plot.unzoom(1);
                    plot.refresh();
                  }
                }
              }
            }
          };
        }(this);
        mx.addEventListener(Mx, "mouseup", this.mouseup, false);
        this.mouseclick = function(plot) {
          return function(event) {
            event.preventDefault();
            var Gx = plot._Gx;
            var Mx = plot._Mx;
            mx.ifevent(plot._Mx, event);
            var evt = document.createEvent("Event");
            evt.initEvent("mclick", true, true);
            evt.xpos = Mx.xpos;
            evt.ypos = Mx.ypos;
            evt.x = Gx.retx;
            evt.y = Gx.rety;
            evt.which = event.which;
            if (mx.dispatchEvent(Mx, evt)) {
            }
            return false;
          };
        }(this);
        mx.addEventListener(Mx, "click", this.mouseclick, false);
        this.mousedblclick = function(plot) {
          return function(event) {
            event.preventDefault();
            var Gx = plot._Gx;
            var Mx = plot._Mx;
            mx.ifevent(plot._Mx, event);
            var evt = document.createEvent("Event");
            evt.initEvent("mdblclick", true, true);
            evt.xpos = Mx.xpos;
            evt.ypos = Mx.ypos;
            evt.x = Gx.retx;
            evt.y = Gx.rety;
            evt.which = event.which;
            if (mx.dispatchEvent(Mx, evt)) {
            }
            return false;
          };
        }(this);
        mx.addEventListener(Mx, "dblclick", this.mousedblclick, false);
        this.dragMouseDownHandler = function(plot) {
          return function(event) {
            var Mx = plot._Mx;
            var Gx = plot._Gx;
            var inPan = inPanRegion(plot);
            if (inPan.inPanRegion) {
              event.preventDefault();
              if (inPan.command !== " ") {
                var scrollbar;
                if (inPan.command === "XPAN") {
                  scrollbar = Mx.scrollbar_x;
                } else {
                  if (inPan.command === "YPAN") {
                    scrollbar = Mx.scrollbar_y;
                  }
                }
                var position = {x:Mx.xpos, y:Mx.ypos};
                if (scrollbar !== undefined && (onScrollbar(position, scrollbar) && event.which === 1)) {
                  Gx.panning = {axis:inPan.command, xpos:event.screenX, ypos:event.screenY, xmin:Mx.stk[Mx.level].xmin, xmax:Mx.stk[Mx.level].xmax, ymin:Mx.stk[Mx.level].ymin, ymax:Mx.stk[Mx.level].ymax};
                }
              }
            }
          };
        }(this);
        window.addEventListener("mousedown", this.dragMouseDownHandler, false);
        this.dragMouseMoveHandler = function(plot) {
          return function(e) {
            var Gx = plot._Gx;
            if (Gx.panning !== undefined) {
              try {
                drag_scrollbar(plot, Gx.panning.axis, e);
              } catch (err) {
                console.log("Error: " + err);
              }
            }
          };
        }(this);
        this.throttledDragOnMouseMove = m.throttle(this._Gx.scroll_time_interval, this.dragMouseMoveHandler);
        window.addEventListener("mousemove", this.throttledDragOnMouseMove, false);
        this.dragMouseUpHandler = function(plot) {
          return function(event) {
            var Gx = plot._Gx;
            if (event.which === 1) {
              Gx.panning = undefined;
            }
          };
        }(this);
        window.addEventListener("mouseup", this.dragMouseUpHandler, false);
        this.onresize = function(plot) {
          return function(event) {
            if (mx.checkresize(plot._Mx)) {
              plot.refresh();
            }
          };
        }(this);
        this.wheelHandler = function(plot) {
          var Mx = plot._Mx;
          var Gx = plot._Gx;
          var throttledPan = m.throttle(100, function(inPan) {
            var scrollbar;
            if (inPan.command === "XPAN") {
              scrollbar = Mx.scrollbar_x;
            } else {
              if (inPan.command === "YPAN") {
                scrollbar = Mx.scrollbar_y;
              }
            }
            if (Gx.wheelscroll_mode_natural) {
              scrollbar.action = event.deltaY < 0 ? mx.SB_WHEELDOWN : mx.SB_WHEELUP;
            } else {
              scrollbar.action = event.deltaY < 0 ? mx.SB_WHEELUP : mx.SB_WHEELDOWN;
            }
            scrollbar.step = 0.1 * scrollbar.srange;
            scrollbar.page = 9 * scrollbar.step;
            mx.scroll(Mx, scrollbar, mx.XW_COMMAND, undefined, scrollbar);
            updateViewbox(plot, scrollbar.smin, scrollbar.smin + scrollbar.srange, inPan.command.slice(0, 1));
          });
          var throttledZoom = m.throttle(100, function() {
            var zoomperc = Gx.wheelZoomPercent || 0.2;
            if (Gx.wheelscroll_mode_natural) {
              if (event.deltaY > 0) {
                zoomperc = -1 * zoomperc;
              }
            } else {
              if (event.deltaY < 0) {
                zoomperc = -1 * zoomperc;
              }
            }
            if (Gx.wheelZoom === "x") {
              plot.percent_zoom(zoomperc, 1, true);
            } else {
              if (Gx.wheelZoom === "y") {
                plot.percent_zoom(1, zoomperc, true);
              } else {
                plot.percent_zoom(zoomperc, zoomperc, true);
              }
            }
          });
          return function(event) {
            mx.ifevent(Mx, event);
            var inPan = inPanRegion(plot);
            if (plot.mouseOnCanvas) {
              event.preventDefault();
              if (inPan.inPanRegion) {
                throttledPan(inPan);
              } else {
                if (Gx.wheelZoom) {
                  throttledZoom();
                }
              }
            }
          };
        }(this);
        window.addWheelListener(window, this.wheelHandler, false);
        window.addEventListener("resize", this.onresize, false);
        if (!options.nokeypress) {
          this.onkeypress = function(plot) {
            return function(event) {
              var Mx = plot._Mx;
              var Gx = plot._Gx;
              if (plot.mouseOnCanvas) {
                if (Mx.widget && Mx.widget.type === "MENU") {
                  return;
                }
                if (Mx.widget && Mx.widget.type === "ONESHOT") {
                  Mx.widget = null;
                  plot.refresh();
                  return;
                }
                var keyCode = common.getKeyCode(event);
                var evt = document.createEvent("Event");
                evt.initEvent("plotkeypress", true, true);
                evt.keyCode = keyCode;
                evt.shiftKey = event.shiftKey;
                evt.ctrlKey = event.ctrlKey;
                evt.altKey = event.altKey;
                evt.metaKey = event.metaKey;
                var executeDefault = mx.dispatchEvent(Mx, evt);
                if (!executeDefault) {
                  return;
                }
                if (keyCode === 97) {
                  Gx.iabsc = (Gx.iabsc + 1) % 4;
                  display_specs(plot);
                } else {
                  if (keyCode === 108) {
                    plot.change_settings({legend:!Gx.legend});
                  } else {
                    if (keyCode === 103) {
                      plot.change_settings({grid:!Gx.grid});
                    } else {
                      if (keyCode === 98 || keyCode === 2) {
                        if (Mx.warpbox) {
                          if (Mx.warpbox.mode === "box") {
                            Mx.warpbox.mode = "horizontal";
                          } else {
                            if (Mx.warpbox.mode === "horizontal") {
                              Mx.warpbox.mode = "vertical";
                            } else {
                              Mx.warpbox.mode = "box";
                            }
                          }
                          mx.redraw_warpbox(Mx);
                        }
                      } else {
                        if (keyCode === 99) {
                          plot.change_settings({xcnt:-1 * Gx.cntrls});
                        } else {
                          if (keyCode === 114) {
                            plot.change_settings({show_readout:!Gx.show_readout});
                          } else {
                            if (keyCode === 115) {
                              plot.change_settings({specs:!Gx.specs});
                            } else {
                              if (keyCode === 112) {
                                if (Gx.lyr[0].hcb["class"] !== 1) {
                                  Gx.p_press = true;
                                  if (Gx.lyr[0].buf.length === Gx.lyr[0].hcb.subsize) {
                                    plot.change_settings({enabled_streaming_pcut:!Gx.enabled_streaming_pcut});
                                  } else {
                                    plot.change_settings({p_cuts:!Gx.p_cuts});
                                  }
                                }
                              } else {
                                if (keyCode === 120) {
                                  if (Gx.x_cut_press_on) {
                                    Gx.x_cut_press_on = false;
                                    Gx.ylabel = Gx.ylabel_stash;
                                    Gx.xlabel = Gx.xlabel_stash;
                                    for (var h = 0;h < Gx.xcut_layer;h++) {
                                      plot._Gx.lyr[h].display = !plot._Gx.lyr[h].display;
                                    }
                                    delete_layer(plot, plot._Gx.xcut_layer);
                                    plot.rescale();
                                    plot.refresh();
                                    Gx.xcut_layer = undefined;
                                    plot.change_settings({drawmode:Gx.old_drawmode, autol:Gx.old_autol});
                                  } else {
                                    if (Gx.xyKeys === "pop-up") {
                                      if (!Gx.x_pop_now) {
                                        sigplot_show_x(plot);
                                        Gx.x_pop_now = true;
                                      } else {
                                        Gx.x_pop_now = false;
                                      }
                                    } else {
                                      if (Gx.lyr[0].hcb["class"] === 1 && Gx.xyKeys === "automatic") {
                                        if (!Gx.x_pop_now) {
                                          sigplot_show_x(plot);
                                          Gx.x_pop_now = true;
                                        } else {
                                          Gx.x_pop_now = false;
                                        }
                                      } else {
                                        if (Gx.xyKeys !== "disable" && Gx.lyr[0].hcb["class"] === 2) {
                                          if (!Gx.y_cut_press_on) {
                                            if (!Gx.p_cuts) {
                                              Gx.x_cut_data = [];
                                              var plot_height = Mx.b - Mx.t;
                                              var plot_width = Mx.r - Mx.l;
                                              var height = Gx.lyr[0].lps;
                                              var width = Gx.lyr[0].xframe;
                                              var row, start, finish = 0;
                                              row = Math.floor(height * (Mx.ypos - Mx.t) / plot_height);
                                              start = row * width;
                                              finish = start + width;
                                              Gx.x_cut_data = Gx.lyr[0].zbuf.slice(start, finish);
                                            }
                                            var xcut_display = [];
                                            for (var a = 0;a < Gx.x_cut_data.length;a++) {
                                              var item = Gx.x_cut_data[a];
                                              item = item * -1;
                                              xcut_display.push(item);
                                            }
                                            Gx.old_drawmode = Gx.lyr[0].drawmode;
                                            Gx.old_autol = Gx.autol;
                                            plot.change_settings({drawmode:"undefined", autol:-1});
                                            Gx.ylabel_stash = Gx.ylabel;
                                            var cx = Gx.lyr.length > 0 && Gx.lyr[0].cx;
                                            if (Gx.cmode === 1) {
                                              Gx.ylabel = m.UNITS[28][0];
                                            } else {
                                              if (Gx.cmode === 2) {
                                                Gx.ylabel = Gx.plab;
                                              } else {
                                                if (Gx.cmode === 3 && cx) {
                                                  Gx.ylabel = m.UNITS[21][0];
                                                } else {
                                                  if (Gx.cmode === 4) {
                                                    Gx.ylabel = m.UNITS[22][0];
                                                  } else {
                                                    if (Gx.cmode === 5) {
                                                      Gx.ylabel = m.UNITS[22][0];
                                                    } else {
                                                      if (Gx.cmode === 6) {
                                                        Gx.ylabel = m.UNITS[26][0];
                                                      } else {
                                                        if (Gx.cmode === 7) {
                                                          Gx.ylabel = m.UNITS[27][0];
                                                        } else {
                                                          Gx.ylabel = "Intensity";
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                            Gx.xlabel_stash = Gx.xlabel;
                                            if (m.UNITS[Gx.xlab][0] !== "None" && m.UNITS[Gx.xlab][0] !== "Unknown") {
                                              Gx.xlabel = m.UNITS[Gx.xlab][0];
                                            } else {
                                              Gx.xlabel = "Frequency";
                                            }
                                            Gx.xlabel += "    CURRENTLY IN X_CUT MODE";
                                            Gx.xcut_layer = plot.overlay_array(xcut_display, null, {name:"x_cut_data", line:3});
                                            Gx.xcut_layer = Gx.lyr.length - 1;
                                            for (var i = 0;i < Gx.xcut_layer;i++) {
                                              plot._Gx.lyr[i].display = !plot._Gx.lyr[i].display;
                                            }
                                            Gx.x_cut_press_on = true;
                                            plot.rescale();
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  if (keyCode === 121) {
                                    if (Gx.y_cut_press_on) {
                                      Gx.y_cut_press_on = false;
                                      Gx.ylabel = Gx.ylabel_stash;
                                      Gx.xlabel = Gx.xlabel_stash;
                                      for (var j = 0;j < Gx.ycut_layer;j++) {
                                        plot._Gx.lyr[j].display = !plot._Gx.lyr[j].display;
                                      }
                                      delete_layer(plot, plot._Gx.ycut_layer);
                                      plot.rescale();
                                      plot.refresh();
                                      Gx.ycut_layer = undefined;
                                      plot.change_settings({drawmode:Gx.old_drawmode, autol:Gx.old_autol});
                                    } else {
                                      if (Gx.xyKeys === "pop-up") {
                                        if (!Gx.y_pop_now) {
                                          sigplot_show_y(plot);
                                          Gx.y_pop_now = true;
                                        } else {
                                          Gx.y_pop_now = false;
                                        }
                                      } else {
                                        if (Gx.lyr[0].hcb["class"] === 1 && Gx.xyKeys === "automatic") {
                                          if (!Gx.y_pop_now) {
                                            sigplot_show_y(plot);
                                            Gx.y_pop_now = true;
                                          } else {
                                            Gx.y_pop_now = false;
                                          }
                                        } else {
                                          if (Gx.xyKeys !== "disable" && Gx.lyr[0].hcb["class"] === 2) {
                                            if (!Gx.x_cut_press_on) {
                                              if (!Gx.p_cuts) {
                                                Gx.y_cut_data = [];
                                                var plot_height = Mx.b - Mx.t;
                                                var plot_width = Mx.r - Mx.l;
                                                var height = Gx.lyr[0].lps;
                                                var width = Gx.lyr[0].xframe;
                                                var line, i = 0;
                                                Gx.y_cut_data = [];
                                                line = Math.floor(width * (Mx.xpos - Mx.l) / plot_width);
                                                for (i = line;i < width * height;i += width) {
                                                  Gx.y_cut_data.push(Gx.lyr[0].zbuf[i]);
                                                }
                                              }
                                              var ycut_display = [];
                                              for (var a = 0;a < Gx.y_cut_data.length;a++) {
                                                var item = Gx.y_cut_data[a];
                                                item = item * -1;
                                                ycut_display.push(item);
                                              }
                                              Gx.old_drawmode = Gx.lyr[0].drawmode;
                                              Gx.old_autol = Gx.autol;
                                              plot.change_settings({drawmode:"undefined", autol:-1});
                                              Gx.ylabel_stash = Gx.ylabel;
                                              var cx = Gx.lyr.length > 0 && Gx.lyr[0].cx;
                                              if (Gx.cmode === 1) {
                                                Gx.ylabel = m.UNITS[28][0];
                                              } else {
                                                if (Gx.cmode === 2) {
                                                  Gx.ylabel = Gx.plab;
                                                } else {
                                                  if (Gx.cmode === 3 && cx) {
                                                    Gx.ylabel = m.UNITS[21][0];
                                                  } else {
                                                    if (Gx.cmode === 4) {
                                                      Gx.ylabel = m.UNITS[22][0];
                                                    } else {
                                                      if (Gx.cmode === 5) {
                                                        Gx.ylabel = m.UNITS[22][0];
                                                      } else {
                                                        if (Gx.cmode === 6) {
                                                          Gx.ylabel = m.UNITS[26][0];
                                                        } else {
                                                          if (Gx.cmode === 7) {
                                                            Gx.ylabel = m.UNITS[27][0];
                                                          } else {
                                                            Gx.ylabel = "Intensity";
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                              Gx.xlabel_stash = Gx.xlabel;
                                              if (m.UNITS[Gx.ylab][0] !== "None" && m.UNITS[Gx.ylab][0] !== "Unknown") {
                                                Gx.xlabel = m.UNITS[Gx.ylab][0];
                                              } else {
                                                Gx.xlabel = "Time";
                                              }
                                              Gx.xlabel += "    CURRENTLY IN Y_CUT MODE";
                                              Gx.ycut_layer = plot.overlay_array(ycut_display, null, {name:"y_cut_data", line:3});
                                              Gx.ycut_layer = Gx.lyr.length - 1;
                                              for (var k = 0;k < Gx.ycut_layer;k++) {
                                                plot._Gx.lyr[k].display = !plot._Gx.lyr[k].display;
                                              }
                                              Gx.y_cut_press_on = true;
                                              plot.rescale();
                                            }
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    if (keyCode === 122) {
                                      sigplot_show_z(plot);
                                    } else {
                                      if (keyCode === 116) {
                                        sigplot_show_timecode(plot);
                                      } else {
                                        if (keyCode === 109) {
                                          if (!Gx.nomenu) {
                                            var evt = document.createEvent("Event");
                                            evt.initEvent("showmenu", true, true);
                                            evt.x = Mx.x;
                                            evt.y = Mx.y;
                                            var executeDefault = mx.dispatchEvent(Mx, evt);
                                            if (executeDefault) {
                                              sigplot_mainmenu(plot);
                                            }
                                          }
                                        } else {
                                          if (keyCode === 63) {
                                            mx.message(Mx, MAIN_HELP);
                                          } else {
                                            if (keyCode === 102) {
                                              var switcher = 0;
                                              if (Gx.p_cuts) {
                                                plot.change_settings({p_cuts:!Gx.p_cuts});
                                                switcher = 1;
                                              }
                                              mx.fullscreen(Mx);
                                              plot.refresh();
                                              if (switcher === 1) {
                                                plot.change_settings({p_cuts:!Gx.p_cuts});
                                              }
                                            } else {
                                              if (keyCode === 9 && event.ctrlKey) {
                                                plot.change_settings({invert:null});
                                              } else {
                                                if (keyCode === 107) {
                                                  Gx.show_marker = !Gx.show_marker;
                                                  plot.redraw();
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            };
          }(this);
          common.setKeypressHandler(this.onkeypress);
        }
        return this;
      };
      sigplot.Plot.prototype = {add_plugin:function(plugin, zorder) {
        if (zorder === undefined) {
          zorder = Number.MAX_VALUE;
        }
        if (zorder <= 0) {
          throw "Invalid plugin zorder";
        }
        plugin.init(this);
        var canvas = document.createElement("canvas");
        canvas.width = this._Mx.canvas.width;
        canvas.height = this._Mx.canvas.height;
        this._Gx.plugins.push({impl:plugin, zorder:zorder, canvas:canvas});
        this._Gx.plugins.sort(function(a, b) {
          return a.zorder - b.zorder;
        });
        this.refresh();
      }, remove_plugin:function(plugin) {
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
          return a.zorder - b.zorder;
        });
        this.refresh();
      }, addListener:function(what, callback) {
        var Mx = this._Mx;
        mx.addEventListener(Mx, what, callback, false);
      }, removeListener:function(what, callback) {
        var Mx = this._Mx;
        mx.removeEventListener(Mx, what, callback, false);
      }, change_settings:function(settings) {
        var Gx = this._Gx;
        var Mx = this._Mx;
        for (var i = 0;i < Gx.lyr.length;i++) {
          Gx.lyr[i].change_settings(settings);
        }
        if (settings.xyKeys !== undefined) {
          if (settings.xyKeys === null) {
            Gx.xyKeys = "automatic";
          } else {
            Gx.xyKeys = settings.xyKeys;
          }
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
        if (settings.index !== undefined && settings.index !== Gx.index) {
          if (settings.index === null) {
            Gx.index = !Gx.index;
          } else {
            Gx.index = settings.index;
          }
          if (Gx.index && Gx.iabsc !== 1) {
            Gx.iabsc = 1;
          } else {
            if (!Gx.index && Gx.iabsc === 1) {
              Gx.iabsc = 0;
            }
          }
          var xmin;
          var xmax;
          scale_base(this, {get_data:false}, xmin, xmax);
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
          Gx.specs = Gx.show_x_axis || (Gx.show_y_axis || Gx.show_readout);
        }
        if (settings.show_y_axis !== undefined) {
          if (settings.show_y_axis === null) {
            Gx.show_y_axis = !Gx.show_y_axis;
          } else {
            Gx.show_y_axis = settings.show_y_axis;
          }
          Gx.specs = Gx.show_x_axis || (Gx.show_y_axis || Gx.show_readout);
        }
        if (settings.show_readout !== undefined) {
          if (settings.show_readout === null) {
            Gx.show_readout = !Gx.show_readout;
          } else {
            Gx.show_readout = settings.show_readout;
          }
          Gx.specs = Gx.show_x_axis || (Gx.show_y_axis || Gx.show_readout);
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
          } else {
            if (settings.xcnt === "continuous") {
              Gx.cntrls = 2;
            } else {
              if (settings.xcnt === "disable" && Gx.cntrls > 0) {
                Gx.cntrls = -1 * Gx.cntrls;
              } else {
                if (settings.xcnt === "enable" && Gx.cntrls < 0) {
                  Gx.cntrls = -1 * Gx.cntrls;
                } else {
                  Gx.cntrls = settings.xcnt;
                }
              }
            }
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
          if (settings.cross === null) {
            Gx.cross = !Gx.cross;
          } else {
            Gx.cross = settings.cross;
          }
          if (!Gx.cross) {
            if (Gx.cross_xpos !== undefined) {
              mx.rubberline(Mx, Gx.cross_xpos, Mx.t, Gx.cross_xpos, Mx.b);
            }
            if (Gx.cross_ypos !== undefined) {
              mx.rubberline(Mx, Mx.l, Gx.cross_ypos, Mx.r, Gx.cross_ypos);
            }
            Gx.cross_xpos = undefined;
            Gx.cross_ypos = undefined;
          } else {
            Gx.cross_xpos = undefined;
            Gx.cross_ypos = undefined;
            if (!Mx.warpbox && this.mouseOnCanvas) {
              draw_crosshairs(this);
            }
          }
        }
        var cmode;
        var address = settings.cmode === undefined ? "" : settings.cmode;
        if (typeof address === "string") {
          address = address + "";
          cmode = address.toUpperCase();
        } else {
          cmode = address;
        }
        if (settings.cmode !== undefined) {
          if (Gx.lyr.length > 0 && Gx.lyr[0].cx) {
            Gx.cmode = 1;
          } else {
            Gx.cmode = 3;
          }
          if (cmode === "MA" || (cmode === "INMA" || (cmode === "ABMA" || (cmode === "__MA" || (cmode === "MAGNITUDE" || cmode === 1))))) {
            Gx.cmode = 1;
          }
          if (cmode === "PH" || (cmode === "INPH" || (cmode === "ABPH" || (cmode === "__PH" || (cmode === "PHASE" || cmode === 2))))) {
            Gx.cmode = 2;
          }
          if (cmode === "RE" || (cmode === "INRE" || (cmode === "ABRE" || (cmode === "__RE" || (cmode === "REAL" || cmode === 3))))) {
            Gx.cmode = 3;
          }
          if (cmode === "IM" || (cmode === "INIM" || (cmode === "ABIM" || (cmode === "__IM" || (cmode === "IMAGINARY" || cmode === 4))))) {
            Gx.cmode = 4;
          }
          if (cmode === "LO" || (cmode === "D1" || (cmode === "INLO" || (cmode === "IND1" || (cmode === "ABIM" || (cmode === "ABD1" || (cmode === "__LO" || (cmode === "__D1" || (cmode === "10*LOG10" || cmode === 6))))))))) {
            Gx.cmode = 6;
          }
          if (cmode === "L2" || (cmode === "D2" || (cmode === "INL2" || (cmode === "IND2" || (cmode === "ABLO" || (cmode === "ABD2" || (cmode === "__L2" || (cmode === "__D2" || (cmode === "20*LOG10" || cmode === 7))))))))) {
            Gx.cmode = 7;
          }
          if (cmode === "RI" || (cmode === "IR" || (cmode === "INRI" || (cmode === "INIR" || (cmode === "ABRI" || (cmode === "ABIR" || (cmode === "__RI" || (cmode === "__IR" || (cmode === "IMAG/REAL" || (cmode === "REAL/IMAG" || cmode === 5)))))))))) {
            if (Gx.index) {
              alert("Imag/Real mode not permitted in INDEX mode");
            } else {
              Gx.cmode = 5;
            }
          }
          Gx.basemode = Gx.cmode;
          changemode(this, Gx.cmode);
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
            if (Gx.cmode === 2) {
              Gx.cmap = 2;
            } else {
              Gx.cmap = 1;
            }
          } else {
            Gx.cmap = settings.cmap;
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
          } else {
            if (settings.invert === true) {
              mx.setbgfg(this, "white", "black");
            } else {
              mx.setbgfg(this, "black", "white");
            }
          }
        }
        if (settings.nomenu !== undefined) {
          if (settings.nomenu === null) {
            Gx.nomenu = !Gx.nomenu;
          } else {
            Gx.nomenu = settings.nomenu;
          }
        }
        if (settings.ymax !== undefined) {
          if (settings.ymax === null) {
            Gx.autoy = Gx.autoy | 2;
            Gx.panymax = undefined;
            scale_base(this, {});
            Gx.ymax = Gx.panymax;
          } else {
            Gx.autoy = Gx.autoy & 13;
            Gx.ymax = settings.ymax;
            updateViewbox(this, Mx.stk[0].ymin, settings.ymax, "Y");
            this.redraw();
          }
        }
        if (settings.ymin !== undefined) {
          if (settings.ymin === null) {
            Gx.autoy = Gx.autoy | 1;
            Gx.panymin = undefined;
            scale_base(this, {});
            Gx.ymin = Gx.panymin;
          } else {
            Gx.autoy = Gx.autoy & 14;
            Gx.ymin = settings.ymin;
            updateViewbox(this, settings.ymin, Mx.stk[0].ymax, "Y");
            this.redraw();
          }
        }
        if (settings.autoy !== undefined) {
          Gx.autoy = settings.autoy;
          if ((Gx.autoy & 1) !== 0) {
            Gx.ymin = undefined;
          }
          if ((Gx.autoy & 2) !== 0) {
            Gx.ymax = undefined;
          }
        }
        if (settings.xmin !== undefined) {
          updateViewbox(this, settings.xmin, Mx.stk[0].xmax, "X");
          Gx.autox = Gx.autox & 2;
          this.redraw();
        }
        if (settings.xmax !== undefined) {
          updateViewbox(this, Mx.stk[0].xmin, settings.xmax, "X");
          Gx.autox = Gx.autox & 1;
          this.redraw();
        }
        if (settings.zmin !== undefined) {
          Gx.zmin = settings.zmin;
          Gx.autoz = Gx.autoz & 2;
        }
        if (settings.zmax !== undefined) {
          Gx.zmax = settings.zmax;
          Gx.autoz = Gx.autoz & 1;
        }
        if (settings.autoz !== undefined) {
          Gx.autoz = settings.autoz;
          if ((Gx.autoz & 1) !== 0) {
            Gx.zmin = undefined;
          }
          if ((Gx.autoz & 2) !== 0) {
            Gx.zmax = undefined;
          }
        }
        if (settings.note !== undefined) {
          Gx.note = settings.note;
        }
        if (settings.lg_colorbar !== undefined) {
          Gx.lg_colorbar = !Gx.lg_colorbar;
        }
        if (settings.enabled_streaming_pcut !== undefined) {
          Gx.enabled_streaming_pcut = !Gx.enabled_streaming_pcut;
          if (Gx.enabled_streaming_pcut === false) {
            Gx.lyr[0].zbuf = [];
            if (Gx.element1.parentNode === null) {
              document.getElementById(this._Gx.parent.id).appendChild(this._Gx.element1);
            }
            if (Gx.element2.parentNode === null) {
              document.getElementById(this._Gx.parent.id).appendChild(this._Gx.element2);
            }
            Gx.element1.parentNode.removeChild(Gx.element1);
            Gx.element2.parentNode.removeChild(Gx.element2);
            Gx.ycut = undefined;
            Gx.xcut = undefined;
          }
          Gx.parent.setAttribute("style", "position:relative");
        }
        if (settings.p_cuts !== undefined) {
          Gx.p_cuts = !Gx.p_cuts;
          if (Gx.p_cuts === false) {
            if (Gx.element1.parentNode === null) {
              document.getElementById(this._Gx.parent.id).appendChild(this._Gx.element1);
            }
            if (Gx.element2.parentNode === null) {
              document.getElementById(this._Gx.parent.id).appendChild(this._Gx.element2);
            }
            Gx.element1.parentNode.removeChild(Gx.element1);
            Gx.element2.parentNode.removeChild(Gx.element2);
            Gx.ycut = undefined;
            Gx.xcut = undefined;
          }
          Gx.parent.setAttribute("style", "position:relative");
        }
        if (settings.xcut_now !== undefined) {
          Gx.xcut_now = !Gx.xcut_now;
        }
        if (settings.ycut_now !== undefined) {
          Gx.ycut_now = !Gx.ycut_now;
        }
        this.refresh();
        if (settings.pan !== undefined) {
          display_specs(this);
        }
      }, reread:function() {
        var Gx = this._Gx;
        var oldLayerData = [];
        for (var k = 0;k < Gx.lyr.length;k++) {
          oldLayerData[k] = Gx.lyr[k];
        }
        var origHCB = Gx.HCB.slice();
        this.deoverlay();
        for (var i = 0;i < origHCB.length;i++) {
          this.overlay_bluefile(origHCB[i]);
        }
        for (var j = 0;j < Gx.lyr.length;j++) {
          Gx.lyr[j].symbol = oldLayerData[j].symbol;
          Gx.lyr[j].radius = oldLayerData[j].radius;
        }
        this.refresh();
        var evt = document.createEvent("Event");
        evt.initEvent("reread", true, true);
        mx.dispatchEvent(this._Mx, evt);
      }, cleanup:function() {
      }, reload:function(n, data, hdrmod, rsync) {
        var Mx = this._Mx;
        var Gx = this._Gx;
        if (n < 0 || n >= Gx.lyr.length) {
          return;
        }
        if (Gx.lyr[n].reload === undefined) {
          return;
        }
        var xbnds = Gx.lyr[n].reload(data, hdrmod);
        if (Mx.level === 0) {
          scale_base(this, {get_data:false}, xbnds.xmin, xbnds.xmax);
        }
        if (rsync) {
          this._refresh();
        } else {
          this.refresh();
        }
      }, rescale:function() {
        var Mx = this._Mx;
        if (Mx.level === 0) {
          scale_base(this, {get_data:false}, undefined, undefined);
        }
        this.refresh();
      }, headermod:function(n, hdrmod) {
        this.change_settings(hdrmod);
        this.push(n, [], hdrmod);
      }, push:function(n, data, hdrmod, sync, rsync) {
        var Mx = this._Mx;
        var Gx = this._Gx;
        if (n < 0 || n >= Gx.lyr.length) {
          return;
        }
        if (Gx.lyr[n].push === undefined) {
          return;
        }
        if (Gx.lyr[n].display === false) {
          return;
        }
        var hdrmod_clone = hdrmod;
        if (hdrmod) {
          var hdrmod_clone = JSON.parse(JSON.stringify(hdrmod));
          if (data.length === 0) {
            hdrmod_clone.xmin = Mx.stk[n].xmin;
            hdrmod_clone.xmax = Mx.stk[n].xmax;
            hdrmod_clone.ymin = Mx.stk[n].ymin;
            hdrmod_clone.ymax = Mx.stk[n].ymax;
          }
        }
        var rescale = Gx.lyr[n].push(data, hdrmod_clone, sync);
        if (Mx.level === 0 && rescale) {
          scale_base(this, {get_data:false});
        }
        if (rsync) {
          if (Gx.enabled_streaming_pcut) {
            draw_p_cuts(this);
          }
          this._refresh();
        } else {
          if (Gx.enabled_streaming_pcut) {
            draw_p_cuts(this);
          }
          this.refresh();
        }
      }, overlay_array:function(data, overrides, layerOptions) {
        m.log.debug("Overlay array");
        var hcb = m.initialize(data, overrides);
        return this.overlay_bluefile(hcb, layerOptions);
      }, overlay_pipe:function(overrides, layerOptions) {
        m.log.debug("Overlay pipe");
        if (!overrides) {
          overrides = {};
        }
        overrides.pipe = true;
        var hcb = m.initialize(null, overrides);
        return this.overlay_bluefile(hcb, layerOptions);
      }, overlay_websocket:function(wsurl, overrides, layerOptions) {
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
        ws.onopen = function(evt) {
        };
        ws.onmessage = function(theSocket) {
          return function(evt) {
            if (evt.data instanceof ArrayBuffer) {
              var data = hcb.createArray(evt.data);
              plot.push(layer_n, data);
            } else {
              if (typeof evt.data === "string") {
                var Gx = plot._Gx;
                var hdr = Gx.lyr[layer_n].hcb;
                if (!hdr) {
                  m.log.warning("Couldn't find header for layer " + layer_n);
                }
                var newHdr = JSON.parse(evt.data);
                plot.push(layer_n, [], newHdr);
              }
            }
          };
        }(ws);
        return layer_n;
      }, overlay_href:function(href, onload, layerOptions) {
        m.log.debug("Overlay href: " + href);
        try {
          this.show_spinner();
          var handleHeader = function(plot, onload) {
            return function(hcb) {
              try {
                if (!hcb) {
                  alert("Failed to load data");
                } else {
                  var i;
                  if (href.endsWith(".mat")) {
                    i = plot.overlay_matfile(hcb, layerOptions);
                  } else {
                    i = plot.overlay_bluefile(hcb, layerOptions);
                  }
                  if (onload) {
                    onload(hcb, i);
                  }
                }
              } finally {
                plot.hide_spinner();
              }
            };
          }(this, onload);
          var reader;
          if (href.endsWith(".mat")) {
            reader = new matfile.MatFileReader;
          } else {
            reader = new bluefile.BlueFileReader;
          }
          reader.read_http(href, handleHeader);
        } catch (error) {
          console.error(error);
          alert("Failed to load data");
          this.hide_spinner();
        }
      }, show_spinner:function() {
        if (!this._Gx.spinner) {
          SPINNER_OPTS.color = this._Mx.xwfg;
          this._Gx.spinner = (new Spinner(SPINNER_OPTS)).spin(this._Gx.parent);
        }
      }, hide_spinner:function() {
        if (this._Gx.spinner) {
          this._Gx.spinner.stop();
        }
        this._Gx.spinner = undefined;
      }, add_layer:function(layer) {
        var Gx = this._Gx;
        var Mx = this._Mx;
        var evt = document.createEvent("Event");
        evt.initEvent("lyradd", true, true);
        evt.index = Gx.lyr.length;
        evt.name = layer.name;
        evt.layer = layer;
        var executeDefault = mx.dispatchEvent(Mx, evt);
        if (executeDefault) {
          Gx.lyr.push(layer);
        }
      }, get_layer:function(n) {
        var Gx = this._Gx;
        if (n >= 0 && n < Gx.lyr.length) {
          return Gx.lyr[n];
        } else {
          return null;
        }
      }, overlay_matfile:function(mfile, layerOptions) {
        m.log.debug("Overlay matfile: " + mfile.file_name);
        return this.overlay_array(mfile.dview);
      }, overlay_bluefile:function(hcb, layerOptions) {
        m.log.debug("Overlay bluefile: " + hcb.file_name);
        var Mx = this._Mx;
        var Gx = this._Gx;
        var size = 0;
        layerOptions = layerOptions || {};
        var basefiles = Gx.HCB.length === 0;
        Gx.HCB.push(hcb);
        if (Gx.HCB.length === 1) {
          basefile(this, true);
        }
        var newlayer = Gx.lyr.length;
        if (layerOptions.layerType === undefined) {
          if (hcb["class"] === 1) {
            Layer1D.overlay(this, hcb, layerOptions);
          } else {
            if (hcb["class"] === 2) {
              Layer2D.overlay(this, hcb, layerOptions);
            }
          }
        } else {
          if (layerOptions.layerType === "1D") {
            Layer1D.overlay(this, hcb, layerOptions);
          } else {
            if (layerOptions.layerType === "2D") {
              Layer2D.overlay(this, hcb, layerOptions);
            } else {
              layerOptions.layerType.overlay(this, hcb, layerOptions);
            }
          }
        }
        changemode(this, Gx.cmode);
        if (!basefiles && !layerOptions.expand) {
          for (var n = newlayer;n < Gx.lyr.length;n++) {
            draw_layer(this, n);
          }
        } else {
          if (Gx.HCB.length === 0) {
            basefile(this, false);
          } else {
            Gx.basemode = Gx.cmode;
            var xmin;
            var xmax;
            if ((Gx.autox & 1) === 0) {
              xmin = Gx.xmin;
            }
            if ((Gx.autox & 2) === 0) {
              xmax = Gx.xmin;
            }
            scale_base(this, {get_data:true}, xmin, xmax);
            Mx.level = 0;
            if ((Gx.autox & 1) !== 0) {
              Gx.xmin = Mx.stk[0].xmin;
            }
            if ((Gx.autox & 2) !== 0) {
              Gx.xmax = Mx.stk[0].xmax;
            }
            if ((Gx.autoy & 1) !== 0) {
              Gx.ymin = Mx.stk[0].ymin;
            }
            if ((Gx.autoy & 2) !== 0) {
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
        return Gx.HCB.length - 1;
      }, load_files:function(files, layerType) {
        var onload = function(plot) {
          return function(hdr) {
            plot.overlay_bluefile(hdr, layerType);
          };
        }(this);
        for (var i = 0;i < files.length;i++) {
          var f = files[i];
          var br = new bluefile.BlueFileReader;
          br.read(f, onload);
        }
      }, deoverlay:function(index) {
        var Gx = this._Gx;
        var Mx = this._Mx;
        if (Gx.HCB.length > 0) {
          if (index === undefined) {
            for (var n = Gx.HCB.length - 1;n >= 0;n--) {
              this.remove_layer(n);
            }
          } else {
            if (index < 0) {
              var n = Gx.HCB.length + index;
              if (n < 0) {
                return;
              }
              this.remove_layer(n);
            } else {
              if (index < Gx.HCB.length) {
                this.remove_layer(index);
              }
            }
          }
        }
        if (Gx.lyr.length === 0) {
          basefile(this, false);
          scale_base(this, {});
        }
      }, remove_layer:function(index) {
        var Gx = this._Gx;
        var fileName = "";
        var HCB = null;
        if (index >= 0 && index < Gx.HCB.length) {
          fileName = Gx.HCB[index].file_name;
          HCB = Gx.HCB[index];
          Gx.HCB[index] = null;
          for (var n = index;n < Gx.HCB.length - 1;n++) {
            Gx.HCB[n] = Gx.HCB[n + 1];
          }
          Gx.HCB.length -= 1;
        }
        for (var n = Gx.lyr.length - 1;n >= 0;n--) {
          if (Gx.lyr[n].hcb === HCB) {
            delete_layer(this, n);
          }
        }
        form_plotnote(this);
        this.refresh();
        var evt = document.createEvent("Event");
        evt.initEvent("file_deoverlayed", true, true);
        if (fileName !== "") {
          evt.fileName = fileName;
        }
        mx.dispatchEvent(this._Mx, evt);
      }, pixel_zoom:function(x1, y1, x2, y2, continuous) {
        var r1 = pixel_to_real(this, x1, y1);
        var r2 = pixel_to_real(this, x2, y2);
        this.zoom(r1, r2, continuous);
      }, percent_zoom:function(xperc, yperc, continuous) {
        var Mx = this._Mx;
        var Gx = this._Gx;
        var xadj = 0;
        if (Math.abs(xperc) < 1) {
          xadj = Math.abs(Mx.stk[Mx.level].xmax - Mx.stk[Mx.level].xmin);
          xadj = xadj * xperc / 2;
        }
        var yadj = 0;
        if (Math.abs(yperc) < 1) {
          yadj = Math.abs(Mx.stk[Mx.level].ymax - Mx.stk[Mx.level].ymin);
          yadj = yadj * yperc / 2;
        }
        var ul = {x:Math.max(Mx.stk[Mx.level].xmin + xadj, Gx.panxmin), y:Math.max(Mx.stk[Mx.level].ymin + yadj, Gx.panymin)};
        var lr = {x:Math.min(Mx.stk[Mx.level].xmax - xadj, Gx.panxmax), y:Math.min(Mx.stk[Mx.level].ymax - yadj, Gx.panymax)};
        this.zoom(ul, lr, continuous);
      }, zoom:function(ul, lr, continuous) {
        var Mx = this._Mx;
        var Gx = this._Gx;
        if (Mx.level >= 9) {
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
        zstk.xscl = Mx.stk[Mx.level].xscl;
        zstk.yscl = Mx.stk[Mx.level].yscl;
        zstk.xmin = ul.x;
        zstk.xmax = lr.x;
        zstk.ymin = ul.y;
        zstk.ymax = lr.y;
        if (Gx.index) {
          zstk.xmin = Math.min(zstk.xmin / Gx.xdelta);
          zstk.xmax = Math.min(zstk.xmax / Gx.xdelta);
        }
        if (!continuous || !Gx.inContinuousZoom) {
          Mx.stk.push(zstk);
          Mx.level = Mx.stk.length - 1;
        } else {
          Mx.stk[Mx.level] = zstk;
        }
        Gx.inContinuousZoom = continuous;
        this.inZoom = true;
        var evt = document.createEvent("Event");
        evt.initEvent("zoom", true, true);
        evt.level = Mx.level;
        evt.inContinuousZoom = Gx.inContinuousZoom;
        evt.xmin = Mx.stk[Mx.level].xmin;
        evt.ymin = Mx.stk[Mx.level].ymin;
        evt.xmax = Mx.stk[Mx.level].xmax;
        evt.ymax = Mx.stk[Mx.level].ymax;
        mx.dispatchEvent(Mx, evt);
        this.inZoom = false;
        this.refresh();
      }, unzoom:function(levels) {
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
        if (Mx.level === 0) {
          this.rescale();
        }
        Gx.inContinuousZoom = false;
        this.inZoom = true;
        var evt = document.createEvent("Event");
        evt.initEvent("unzoom", true, true);
        evt.level = Mx.level;
        evt.xmin = Mx.stk[Mx.level].xmin;
        evt.ymin = Mx.stk[Mx.level].ymin;
        evt.xmax = Mx.stk[Mx.level].xmax;
        evt.ymax = Mx.stk[Mx.level].ymax;
        mx.dispatchEvent(Mx, evt);
        this.inZoom = false;
        this.refresh();
      }, mimic:function(other, mask) {
        var self = this;
        if (!mask) {
          throw "mimic must be called with at least one event mask";
        }
        if (mask.zoom) {
          other.addListener("zoom", function(event) {
            if (self.inZoom) {
              return;
            }
            self.zoom({x:event.xmin, y:event.ymin}, {x:event.xmax, y:event.ymax}, event.inContinuousZoom);
          });
        } else {
          if (mask.xzoom) {
            other.addListener("zoom", function(event) {
              if (self.inZoom) {
                return;
              }
              self.zoom({x:event.xmin, y:undefined}, {x:event.xmax, y:undefined}, event.inContinuousZoom);
            });
          } else {
            if (mask.yzoom) {
              other.addListener("zoom", function(event) {
                if (self.inZoom) {
                  return;
                }
                self.zoom({x:undefined, y:event.ymin}, {x:undefined, y:event.ymax}, event.inContinuousZoom);
              });
            }
          }
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
      }, redraw:function() {
        var Gx = this._Gx;
        var Mx = this._Mx;
        var ctx = Mx.canvas.getContext("2d");
        if (!Gx.plotData.valid) {
          this.refresh();
        } else {
          ctx.drawImage(Gx.plotData, Mx.l - 1, Mx.t - 1, Mx.r - Mx.l + 2, Mx.b - Mx.t + 2, Mx.l - 1, Mx.t - 1, Mx.r - Mx.l + 2, Mx.b - Mx.t + 2);
          draw_plugins(this);
          Gx.cross_xpos = undefined;
          Gx.cross_ypos = undefined;
          if (!Mx.warpbox && this.mouseOnCanvas) {
            draw_crosshairs(this);
          }
          if (Gx.always_show_marker || Gx.show_marker) {
            draw_marker(this);
          }
        }
      }, refresh:function() {
        var self = this;
        mx.render(this._Mx, function() {
          self._refresh();
        });
      }, enable_listeners:function() {
        var Mx = this._Mx;
        mx.addEventListener(Mx, "mousedown", this.onmousedown, false);
        mx.addEventListener(Mx, "mousemove", this.throttledOnMouseMove, false);
        window.addEventListener("mouseup", Mx.onmouseup, false);
        window.addEventListener("keydown", Mx.onkeydown, false);
        window.addEventListener("keyup", Mx.onkeyup, false);
        window.addEventListener("resize", this.onresize, false);
        document.addEventListener("mouseup", this.docMouseUp, false);
        mx.addEventListener(Mx, "mouseup", this.mouseup, false);
        window.addEventListener("mousedown", this.dragMouseDownHandler, false);
        window.addEventListener("mousemove", this.throttledDragOnMouseMove, false);
        window.addEventListener("mouseup", this.dragMouseUpHandler, false);
        window.addEventListener("wheel", this.wheelHandler, false);
        window.addEventListener("mousewheel", this.wheelHandler, false);
        window.addEventListener("DOMMouseScroll", this.wheelHandler, false);
        window.addEventListener("keypress", this.onkeypress, false);
      }, disable_listeners:function() {
        var Mx = this._Mx;
        mx.removeEventListener(Mx, "mousedown", this.onmousedown, false);
        mx.removeEventListener(Mx, "mousemove", this.throttledOnMouseMove, false);
        mx.removeEventListener(Mx, "mouseup", this.mouseup, false);
        window.removeEventListener("mouseup", Mx.onmouseup, false);
        window.removeEventListener("keydown", Mx.onkeydown, false);
        window.removeEventListener("keyup", Mx.onkeyup, false);
        window.removeEventListener("resize", this.onresize, false);
        document.removeEventListener("mouseup", this.docMouseUp, false);
        window.removeEventListener("mousedown", this.dragMouseDownHandler, false);
        window.removeEventListener("mousemove", this.throttledDragOnMouseMove, false);
        window.removeEventListener("mouseup", this.dragMouseUpHandler, false);
        window.removeEventListener("wheel", this.wheelHandler, false);
        window.removeEventListener("mousewheel", this.wheelHandler, false);
        window.removeEventListener("DOMMouseScroll", this.wheelHandler, false);
        window.removeEventListener("keypress", this.onkeypress, false);
      }, checkresize:function() {
        if (mx.checkresize(this._Mx)) {
          this.refresh();
        }
      }, _refresh:function() {
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
          if (Gx.ylab === 4) {
            ytimecode = true;
          }
          if (Gx.show_y_axis === true) {
            Mx.l = Mx.text_w * 6;
            if (ytimecode) {
              var need_full_ymd = Math.abs(Mx.stk[0].ymin) >= 31536E3 || Math.abs(Mx.stk[0].ymax) >= 31536E3;
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
            Mx.r = Mx.width - 5;
          }
          if (Gx.show_readout) {
            Mx.t = Mx.text_h * 2;
            if (Gx.show_x_axis) {
              Mx.b = Mx.height - Mx.text_h * 4;
            } else {
              Mx.b = Mx.height - Mx.text_h * 3;
            }
          } else {
            if (Gx.x_scrollbar_location === "bottom") {
              Mx.t = Mx.text_h * 2;
              if (Gx.pan) {
                if (Gx.show_x_axis) {
                  Mx.b = Mx.height - Mx.text_h * 3;
                } else {
                  Mx.b = Mx.height - Mx.text_h * 2;
                }
              } else {
                if (Gx.show_x_axis) {
                  Mx.b = Mx.height - Mx.text_h * 2;
                } else {
                  Mx.b = Mx.height - 5;
                }
              }
            } else {
              if (Gx.pan) {
                Mx.t = Gx.pthk + 2 * Mx.text_w;
              } else {
                Mx.t = 1;
              }
              if (Gx.show_x_axis) {
                Mx.b = Mx.height - Mx.text_h * 3 / 2;
              } else {
                Mx.b = Mx.height - 2;
              }
            }
          }
          if (Gx.show_readout) {
            Gx.pl = Mx.text_w * 50;
          } else {
            if (Gx.x_scrollbar_location === "bottom") {
              Gx.pl = Mx.l;
            } else {
              Gx.pl = Mx.text_w * 35;
            }
          }
          Gx.pr = Math.max(Gx.pl + Mx.text_w * 9, Mx.r);
          if (Gx.show_readout) {
            if (Gx.show_x_axis) {
              Gx.pt = Mx.b + Mx.text_h + (Mx.height - Mx.b - Mx.text_h - Gx.pthk) / 2;
            } else {
              Gx.pt = Mx.b + (Mx.height - Mx.b - Gx.pthk) / 2;
            }
          } else {
            if (Gx.x_scrollbar_location === "bottom") {
              if (Gx.show_x_axis) {
                Gx.pt = Mx.b + Mx.text_h + (Mx.height - Mx.b - Mx.text_h - Gx.pthk) / 2;
              } else {
                Gx.pt = Mx.b + (Mx.height - Mx.b - Gx.pthk) / 2;
              }
            } else {
              Gx.pt = (Mx.t - Gx.pthk) / 2;
            }
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
        Gx.pyl = Mx.r + (Mx.width - Mx.r - Gx.pthk) / 2 + 1;
        if (Gx.lg_colorbar && Gx.lyr[0].hcb["class"] === 2) {
          var prev_Mx_r = Mx.r;
          Mx.r = prev_Mx_r - 100;
        }
        if ((Gx.p_cuts || Gx.enabled_streaming_pcut) && Gx.lyr[0].hcb["class"] === 2) {
          Gx.cross = true;
          var prev_Mx_r = Mx.r;
          Mx.r = prev_Mx_r - 100;
          var prev_Mx_b = Mx.b;
          Mx.b = prev_Mx_b - 100;
        }
        if (Gx.xcut_now) {
          Mx.canvas.width = Gx.x_box_w - 1;
          Mx.canvas.height = Gx.x_box_h;
          Mx.r = Gx.x_box_w - 1;
          Mx.l = 0;
          Mx.b = Gx.x_box_h;
          Mx.t = 0;
        }
        if (Gx.ycut_now) {
          Mx.canvas.width = Gx.y_box_h - 1;
          Mx.canvas.height = Gx.y_box_w;
          Mx.r = Gx.y_box_h - 1;
          Mx.l = 0;
          Mx.b = Gx.y_box_w;
          Mx.t = 0;
        }
        var k = Mx.level;
        Mx.stk[k].x1 = Mx.l;
        Mx.stk[k].y1 = Mx.t;
        Mx.stk[k].x2 = Mx.r;
        Mx.stk[k].y2 = Mx.b;
        Mx.stk[k].xscl = (Mx.stk[k].xmax - Mx.stk[k].xmin) / (Mx.r - Mx.l);
        Mx.stk[k].yscl = (Mx.stk[k].ymax - Mx.stk[k].ymin) / (Mx.b - Mx.t);
        var re = pixel_to_real(this, Mx.xpos, Mx.ypos);
        Gx.retx = re.x;
        Gx.rety = re.y;
        if (Gx.panning === 0 || Gx.panning !== 0) {
          Gx.plotData.valid = false;
          mx.clear_window(Mx);
        }
        var xlab = Gx.xlab;
        var ylab = Gx.ylab;
        if (xlab === undefined) {
          xlab = 30;
        }
        if (Gx.index) {
          xlab = 0;
        }
        if (ylab === undefined) {
          var cx = Gx.lyr.length > 0 && Gx.lyr[0].cx;
          if (Gx.cmode === 1) {
            ylab = 28;
          } else {
            if (Gx.cmode === 2) {
              ylab = Gx.plab;
            } else {
              if (Gx.cmode === 3 && cx) {
                ylab = 21;
              } else {
                if (Gx.cmode === 4) {
                  ylab = 22;
                } else {
                  if (Gx.cmode === 5) {
                    ylab = 22;
                    xlab = 21;
                  } else {
                    if (Gx.cmode === 6) {
                      ylab = 26;
                    } else {
                      if (Gx.cmode === 7) {
                        ylab = 27;
                      } else {
                        ylab = 0;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (Gx.specs) {
          if (Gx.sections === 0) {
            var drawaxis_flags = {grid:Gx.grid};
            if (Gx.panning === 2) {
              drawaxis_flags.noxtlab = true;
            }
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
            if (Gx.specs && (!Gx.show_readout && !Gx.pan)) {
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
            if (xlab === 4) {
              drawaxis_flags.xtimecode = true;
            }
            if (ylab === 4) {
              drawaxis_flags.ytimecode = true;
            }
            if (Gx.xlabel !== undefined) {
              drawaxis_flags.xlabel = Gx.xlabel;
            }
            if (Gx.ylabel !== undefined) {
              drawaxis_flags.ylabel = Gx.ylabel;
            }
            mx.drawaxis(Gx, Mx, Gx.xdiv, Gx.ydiv, xlab, ylab, drawaxis_flags);
          }
          var i = Gx.lbtn - 2;
          if (Gx.show_readout && (Gx.pan && !Gx.no_legend_button)) {
            if (Gx.legend) {
              Gx.legendBtnLocation = {x:Mx.width - Gx.lbtn, y:2, width:i, height:i};
              mx.shadowbox(Mx, Mx.width - Gx.lbtn, 2, i, i, 1, -2, "L");
            } else {
              Gx.legendBtnLocation = {x:Mx.width - Gx.lbtn, y:2, width:i, height:i};
              mx.shadowbox(Mx, Mx.width - Gx.lbtn, 2, i, i, 1, 2, "L");
            }
            display_specs(this);
          } else {
            Gx.legendBtnLocation = null;
          }
        } else {
          if (Gx.grid && Gx.sections >= 0) {
            var drawaxis_flags = {grid:true, noaxisbox:true, noxtics:true, noxtlab:true, noxplab:true, noytics:true, noytlab:true, noyplab:true};
            mx.drawaxis(Gx, Mx, Gx.xdiv, Gx.ydiv, xlab, ylab, drawaxis_flags);
          }
        }
        for (var n = 0;n < Gx.lyr.length;n++) {
          draw_layer(this, n);
        }
        draw_accessories(this, 4);
        draw_plugins(this);
        Gx.cross_xpos = undefined;
        Gx.cross_ypos = undefined;
        if (!Mx.warpbox && this.mouseOnCanvas) {
          draw_crosshairs(this);
          if (!Gx.y_cut_press_on && (!Gx.x_cut_press_on && Gx.lyr[0].hcb["class"] === 2)) {
            draw_p_cuts(this);
          }
        }
        if (Gx.always_show_marker || Gx.show_marker) {
          draw_marker(this);
        }
      }};
      var SPINNER_OPTS = {lines:13, length:7, width:4, radius:10, corners:1, rotate:0, color:"#FFF", speed:1, trail:60, shadow:false, hwaccel:false, className:"spinner", zIndex:2E9, top:"auto", left:"auto"};
      var cxm = ["Ma", "Ph", "Re", "Im", "IR", "Lo", "L2"];
      var cam = ["(absc)", "(indx)", "(1/ab)", "(dydx)"];
      function SIGPLOTLAYER() {
        this.xbuf = undefined;
        this.ybuf = undefined;
        this.offset = 0;
        this.xstart = 0;
        this.xdelta = 0;
        this.imin = 0;
        this.xmin = 0;
        this.xmax = 0;
        this.name = "";
        this.cx = false;
        this.hcb = undefined;
        this.size = 0;
        this.display = true;
        this.color = 0;
        this.line = 3;
        this.thick = 1;
        this.symbol = 0;
        this.radius = 3;
        this.skip = 0;
        this.xsub = 0;
        this.ysub = 0;
        this.xdata = false;
        this.options = {};
      }
      function GX() {
        this.xptr = undefined;
        this.yptr = undefined;
        this.retx = 0;
        this.rety = 0;
        this.xmrk = 0;
        this.ymrk = 0;
        this.aretx = 0;
        this.arety = 0;
        this.xstart = 0;
        this.xdelta = 0;
        this.panxmin = 0;
        this.panxmax = 0;
        this.panymin = 0;
        this.panymax = 0;
        this.xmin = 0;
        this.xmax = 0;
        this.xmult = undefined;
        this.ymin = 0;
        this.ymax = 0;
        this.ymult = undefined;
        this.zmin = undefined;
        this.zmax = undefined;
        this.zoff = 0;
        this.dbmin = 0;
        this.pxscl = 0;
        this.pyscl = 0;
        this.pmt = 0;
        this.note = "";
        this.format = "";
        this.pl = 0;
        this.pr = 0;
        this.pt = 0;
        this.pb = 0;
        this.px1 = 0;
        this.px2 = 0;
        this.py1 = 0;
        this.py2 = 0;
        this.pyl = 0;
        this.pthk = 0;
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
        this.panmode = 0;
        this.hold = false;
        this.sections = 0;
        this.iysec = 0;
        this.nsec = 0;
        this.isec = 0;
        this.xlab = undefined;
        this.xlabel = undefined;
        this.ylab = undefined;
        this.ylabel = undefined;
        this.xcompression = 0;
        this.default_rubberbox_action = "zoom";
        this.default_rubberbox_mode = "box";
        this.wheelscroll_mode_natural = true;
        this.scroll_time_interval = 10;
        this.repeatPanning = undefined;
        this.stillPanning = undefined;
        this.autol = -1;
        this.lineSmoothing = false;
        this.rasterSmoothing = false;
        this.wheelZoom = false;
        this.wheelZoomPercent = 0.2;
        this.inContinuousZoom = false;
        this.lyr = [];
        this.HCB = [];
        this.plugins = [];
        this.plotData = document.createElement("canvas");
        this.plotData.valid = false;
        this.lg_colorbar = false;
        this.cbb_top_x1 = 0;
        this.cbb_top_y1 = 0;
        this.cbb_bot_x1 = 0;
        this.cbb_bot_y1 = 0;
        this.cbb_width = 0;
        this.cbb_height = 0;
        this.p_cuts = false;
        this.x_box_x = 0;
        this.x_box_y = 0;
        this.x_box_h = 0;
        this.x_box_w = 0;
        this.y_box_x = 0;
        this.y_box_y = 0;
        this.y_box_h = 0;
        this.y_box_w = 0;
        this.p_cuts_xpos = undefined;
        this.p_cuts_ypos = undefined;
        this.x_cut_data = [];
        this.y_cut_data = [];
        this.xcut = undefined;
        this.xcut_layer = undefined;
        this.x_cut_press_on = false;
        this.xcut_now = false;
        this.ycut = undefined;
        this.ycut_layer = undefined;
        this.y_cut_press_on = false;
        this.ycut_now = false;
        this.ylabel_stash = undefined;
        this.xlabel_stash = undefined;
        this.element1 = undefined;
        this.element2 = undefined;
        this.p_press = false;
        this.xyKeys = "automatic";
        this.x_pop_now = false;
        this.y_pop_now = false;
        this.enabled_streaming_pcut = false;
        this.old_drawmode = undefined;
        this.old_autol = undefined;
      }
      function setup_cmap(plot, cmap) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        if (Array.isArray(cmap)) {
          var custom_cmap = {name:"Custom", colors:cmap};
          if (m.Mc.colormap[m.Mc.colormap.length - 1].name === "Custom") {
            m.Mc.colormap[m.Mc.colormap.length - 1].colors = cmap;
          } else {
            m.Mc.colormap.push(custom_cmap);
          }
          Gx.cmap = m.Mc.colormap.length - 1;
        } else {
          if (typeof cmap === "string") {
            Gx.cmap = -1;
            for (var xc = 0;xc < m.Mc.colormap.length;xc++) {
              if (m.Mc.colormap[xc].name === cmap) {
                Gx.cmap = xc;
                break;
              }
            }
          } else {
            Gx.cmap = cmap;
          }
        }
        if (Gx.ncolors < 0) {
          Gx.ncolors = -1 * Gx.ncolors;
          Gx.cmap = Math.max(1, Gx.cmap);
        }
        if (Gx.cmap < 0 || Gx.cmap > m.Mc.colormap.length) {
          if (Gx.cmode === 2) {
            Gx.cmap = 2;
          } else {
            Gx.cmap = 1;
          }
        }
        mx.colormap(Mx, m.Mc.colormap[Gx.cmap].colors, Gx.ncolors);
      }
      function sigplot_show_x(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        var ls = Gx.aretx.toString();
        if (Gx.iabsc === 1) {
          mx.message(Mx, "INDEX = " + ls);
        } else {
          if (Gx.iabsc === 2) {
            mx.message(Mx, "1/X = " + ls);
          } else {
            mx.message(Mx, "X = " + ls);
          }
        }
      }
      function sigplot_show_timecode(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        if (Gx.lyr.length > 0) {
          var hcb = Gx.lyr[0].hcb;
          if (hcb["class"] === 1 && (hcb.xunits === 1 || hcb.xunits === 4)) {
            mx.message(Mx, "Time = " + m.sec2tod(hcb.timecode + Gx.retx), true);
          } else {
            if (hcb["class"] === 2 && (hcb.yunits === 1 || hcb.yunits === 4)) {
              mx.message(Mx, "Time = " + m.sec2tod(hcb.timecode + Gx.rety), true);
            } else {
              mx.message(Mx, "Time = UNK");
            }
          }
        }
      }
      function sigplot_show_y(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        var ls = Gx.arety.toString();
        if (Gx.iabsc === 2) {
          mx.message(Mx, "1/Y = " + ls);
        } else {
          mx.message(Mx, "Y = " + ls);
        }
      }
      function sigplot_show_z(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        if (Gx.zmin && Gx.zmax) {
          var msg = "";
          if (Gx.lyr.length === 1) {
            var msg = "Z = " + Gx.lyr[0].get_z(Gx.retx, Gx.rety).toString()
          } else {
            var msg = "TODO"
          }
          mx.message(Mx, msg);
        }
      }
      function sigplot_scrollScaleMenu(plot, command) {
        var Mx = plot._Mx;
        mx.removeEventListener(Mx, "mousedown", plot.onmousedown, false);
        mx.menu(Mx, {title:"SCROLLBAR", refresh:function() {
          plot.refresh();
        }, finalize:function() {
          mx.addEventListener(Mx, "mousedown", plot.onmousedown, false);
          plot.refresh();
        }, items:[{text:"Expand Range", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_EXPAND, command);
        }}, {text:"Shrink Range", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_SHRINK, command);
        }}, {text:"Expand Full", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_FULL, command);
        }}]});
      }
      function sigplot_mainmenu(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        mx.removeEventListener(Mx, "mousedown", plot.onmousedown, false);
        var CONTROLS_MENU = {text:"Cntrls...", menu:{title:"CONTROLS OPTIONS", items:[{text:"Continuous (Disabled)", checked:Gx.cntrls === -2, handler:function() {
          plot.change_settings({xcnt:-2});
        }}, {text:"LM Click (Disabled)", checked:Gx.cntrls === -1, handler:function() {
          plot.change_settings({xcnt:-1});
        }}, {text:"Off", checked:Gx.cntrls === 0, handler:function() {
          plot.change_settings({xcnt:0});
        }}, {text:"LM Click", checked:Gx.cntrls === 1, handler:function() {
          plot.change_settings({xcnt:1});
        }}, {text:"Continuous", checked:Gx.cntrls === 2, handler:function() {
          plot.change_settings({xcnt:2});
        }}]}};
        var CXMODE_MENU = {text:"CX Mode...", menu:{title:"COMPLEX MODE", items:[{text:"Magnitude", checked:Gx.cmode === 1, handler:function() {
          plot.change_settings({cmode:1});
        }}, {text:"Phase", checked:Gx.cmode === 2, handler:function() {
          plot.change_settings({cmode:2});
        }}, {text:"Real", checked:Gx.cmode === 3, handler:function() {
          plot.change_settings({cmode:3});
        }}, {text:"Imaginary", checked:Gx.cmode === 4, handler:function() {
          plot.change_settings({cmode:4});
        }}, {text:"IR: Imag/Real", checked:Gx.cmode === 5, handler:function() {
          plot.change_settings({cmode:5});
        }}, {text:"10*Log10", checked:Gx.cmode === 6, handler:function() {
          plot.change_settings({cmode:6});
        }}, {text:"20*Log10", checked:Gx.cmode === 7, handler:function() {
          plot.change_settings({cmode:7});
        }}]}};
        var SCALING_MENU = {text:"Scaling...", menu:{title:"SCALING", items:[{text:"Y Axis", style:"separator"}, {text:"Parameters...", checked:Gx.autoy === 0, handler:function() {
          Gx.autoy = 0;
          var nextPrompt = function() {
            setupPrompt(plot, "Y Axis Max:", mx.floatValidator, function(finalValue) {
              if (parseFloat(finalValue) !== Mx.stk[Mx.level].ymax) {
                if (finalValue === "") {
                  finalValue = 0;
                }
                updateViewbox(plot, Mx.stk[Mx.level].ymin, parseFloat(finalValue), "Y");
              } else {
                plot.refresh();
              }
            }, Mx.stk[Mx.level].ymax, undefined, undefined, undefined);
          };
          setupPrompt(plot, "Y Axis Min:", mx.floatValidator, function(finalValue) {
            if (parseFloat(finalValue) !== Mx.stk[Mx.level].ymin) {
              if (finalValue === "") {
                finalValue = 0;
              }
              updateViewbox(plot, parseFloat(finalValue), Mx.stk[Mx.level].ymax, "Y");
            } else {
              plot.refresh();
            }
          }, Mx.stk[Mx.level].ymin, undefined, undefined, nextPrompt);
        }}, {text:"Min Auto", checked:Gx.autoy === 1, handler:function() {
          Gx.autoy = 1;
        }}, {text:"Max Auto", checked:Gx.autoy === 2, handler:function() {
          Gx.autoy = 2;
        }}, {text:"Full Auto", checked:Gx.autoy === 3, handler:function() {
          Gx.autoy = 3;
        }}, {text:"X Axis", style:"separator"}, {text:"Parameters...", checked:Gx.autox === 0, handler:function() {
          Gx.autox = 0;
          var nextPrompt = function() {
            setupPrompt(plot, "X Axis Max:", mx.floatValidator, function(finalValue) {
              if (parseFloat(finalValue) !== Mx.stk[Mx.level].xmax) {
                if (finalValue === "") {
                  finalValue = 0;
                }
                updateViewbox(plot, Mx.stk[Mx.level].xmin, parseFloat(finalValue), "X");
              } else {
                plot.refresh();
              }
            }, Mx.stk[Mx.level].xmax, undefined, undefined, undefined);
          };
          setupPrompt(plot, "X Axis Min:", mx.floatValidator, function(finalValue) {
            if (parseFloat(finalValue) !== Mx.stk[Mx.level].xmin) {
              if (finalValue === "") {
                finalValue = 0;
              }
              updateViewbox(plot, parseFloat(finalValue), Mx.stk[Mx.level].xmax, "X");
            } else {
              plot.refresh();
            }
          }, Mx.stk[Mx.level].xmin, undefined, undefined, nextPrompt);
        }}, {text:"Min Auto", checked:Gx.autox === 1, handler:function() {
          Gx.autox = 1;
        }}, {text:"Max Auto", checked:Gx.autox === 2, handler:function() {
          Gx.autox = 2;
        }}, {text:"Full Auto", checked:Gx.autox === 3, handler:function() {
          Gx.autox = 3;
        }}, {text:"Z Axis", style:"separator"}, {text:"Parameters...", checked:Gx.autoz === 0, handler:function() {
          Gx.autoz = 0;
          var nextPrompt = function() {
            setupPrompt(plot, "Z Axis Max:", mx.floatValidator, function(finalValue) {
              if (parseFloat(finalValue) !== Gx.zmax) {
                if (finalValue === "") {
                  finalValue = 0;
                }
                plot.change_settings({zmax:finalValue});
              }
            }, Gx.zmax, undefined, undefined, undefined);
          };
          setupPrompt(plot, "Z Axis Min:", mx.floatValidator, function(finalValue) {
            if (parseFloat(finalValue) !== Gx.zmin) {
              if (finalValue === "") {
                finalValue = 0;
              }
              plot.change_settings({zmin:finalValue});
            }
          }, Gx.zmin, undefined, undefined, nextPrompt);
        }}, {text:"Min Auto", checked:Gx.autoz === 1, handler:function() {
          plot.change_settings({autoz:1});
        }}, {text:"Max Auto", checked:Gx.autoz === 2, handler:function() {
          plot.change_settings({autoz:2});
        }}, {text:"Full Auto", checked:Gx.autoz === 3, handler:function() {
          plot.change_settings({autoz:3});
        }}]}};
        var GRID_MENU = {text:"Grid", handler:function() {
          plot.change_settings({grid:!Gx.grid});
        }};
        var SETTINGS_MENU = {text:"Settings...", menu:{title:"SETTINGS", items:[{text:"ALL Mode", checked:Gx.all, style:"checkbox", handler:function() {
          plot.change_settings({all:!Gx.all});
        }}, {text:"Controls...", menu:{title:"CONTROLS OPTIONS", items:[{text:"Continuous (Disabled)", checked:Gx.cntrls === -2, handler:function() {
          plot.change_settings({xcnt:-2});
        }}, {text:"LM Click (Disabled)", checked:Gx.cntrls === -1, handler:function() {
          plot.change_settings({xcnt:-1});
        }}, {text:"Off", checked:Gx.cntrls === 0, handler:function() {
          plot.change_settings({xcnt:0});
        }}, {text:"LM Click", checked:Gx.cntrls === 1, handler:function() {
          plot.change_settings({xcnt:1});
        }}, {text:"Continuous", checked:Gx.cntrls === 2, handler:function() {
          plot.change_settings({xcnt:2});
        }}]}}, {text:"Mouse...", menu:{title:"MOUSE OPTIONS", items:[{text:"LM Drag (Zoom)", checked:Gx.default_rubberbox_action === "zoom", handler:function() {
          Gx.default_rubberbox_action = "zoom";
        }}, {text:"LM Drag (Select)", checked:Gx.default_rubberbox_action === "select", handler:function() {
          Gx.default_rubberbox_action = "select";
        }}, {text:"LM Drag (Disabled)", checked:Gx.default_rubberbox_action === null, handler:function() {
          Gx.default_rubberbox_action = null;
        }}, {text:"RM Drag (Zoom)", checked:Gx.default_rightclick_rubberbox_action === "zoom", handler:function() {
          Gx.default_rightclick_rubberbox_action = "zoom";
        }}, {text:"RM Drag (Select)", checked:Gx.default_rightclick_rubberbox_action === "select", handler:function() {
          Gx.default_rightclick_rubberbox_action = "select";
        }}, {text:"RM Drag (Disabled)", checked:Gx.default_rightclick_rubberbox_action === null, handler:function() {
          Gx.default_rightclick_rubberbox_action = null;
        }}, {text:"Mode...", menu:{title:"MOUSE Mode", items:[{text:"Box", checked:Gx.default_rubberbox_mode === "box", handler:function() {
          Gx.default_rubberbox_mode = "box";
        }}, {text:"Horizontal", checked:Gx.default_rubberbox_mode === "horizontal", handler:function() {
          Gx.default_rubberbox_mode = "horizontal";
        }}, {text:"Vertical", checked:Gx.default_rubberbox_mode === "vertical", handler:function() {
          Gx.default_rubberbox_mode = "vertical";
        }}]}}, {text:"CROSShairs...", menu:{title:"Crosshairs Mode", items:[{text:"Off", checked:!Gx.cross, handler:function() {
          Gx.cross = false;
        }}, {text:"On", checked:Gx.cross === true, handler:function() {
          Gx.cross = true;
        }}, {text:"Horizontal", checked:Gx.cross === "horizontal", handler:function() {
          Gx.cross = "horizontal";
        }}, {text:"Vertical", checked:Gx.cross === "vertical", handler:function() {
          Gx.cross = "vertical";
        }}]}}, {text:"Mousewheel Natural Mode", checked:Gx.wheelscroll_mode_natural, style:"checkbox", handler:function() {
          plot.change_settings({wheelscroll_mode_natural:!Gx.wheelscroll_mode_natural});
        }}]}}, {text:"CROSShairs", checked:Gx.cross, style:"checkbox", handler:function() {
          plot.change_settings({cross:!Gx.cross});
        }}, {text:"GRID", checked:Gx.grid, style:"checkbox", handler:function() {
          plot.change_settings({grid:!Gx.grid});
        }}, {text:"INDEX Mode", checked:Gx.index, style:"checkbox", handler:function() {
          plot.change_settings({index:!Gx.index});
        }}, {text:"LEGEND", checked:Gx.legend, style:"checkbox", handler:function() {
          plot.change_settings({legend:!Gx.legend});
        }}, {text:"PAN Scrollbars", checked:Gx.pan, style:"checkbox", handler:function() {
          plot.change_settings({pan:!Gx.pan});
        }}, {text:"PHase UNITS...", menu:{title:"PHASE UNITS", items:[{text:"Radians", checked:Gx.plab === 23, handler:function() {
          plot.change_settings({phunits:"R"});
        }}, {text:"Degrees", checked:Gx.plab === 24, handler:function() {
          plot.change_settings({phunits:"D"});
        }}, {text:"Cycles", checked:Gx.plab === 25, handler:function() {
          plot.change_settings({phunits:"C"});
        }}]}}, {text:"SPECS", checked:Gx.specs, style:"checkbox", handler:function() {
          plot.change_settings({specs:!Gx.specs});
        }}, {text:"P-Cuts", checked:Gx.p_cuts, style:"checkbox", handler:function() {
          if (Gx.lyr[0].hcb["class"] !== 1) {
            plot.change_settings({p_cuts:!Gx.p_cuts});
            if (Gx.p_cuts === false) {
              draw_p_cuts(plot);
              Gx.element1.parentNode.removeChild(Gx.element1);
              Gx.element2.parentNode.removeChild(Gx.element2);
              Gx.ycut = undefined;
              Gx.xcut = undefined;
            }
            Gx.parent.setAttribute("style", "position:relative");
          }
        }}, {text:"Large Colorbar", checked:Gx.lg_colorbar, style:"checkbox", handler:function() {
          plot.change_settings({lg_colorbar:!Gx.lg_colorbar});
        }}, {text:"XDIVisions...", handler:function() {
          var validator = function(value) {
            var isValid = mx.intValidator(value);
            var maxXDIV = m.trunc(Mx.width / 2);
            if (isValid.valid && value > maxXDIV) {
              return{valid:false, reason:"Exceeds maximum number of divisions (" + maxXDIV + ")."};
            } else {
              return isValid;
            }
          };
          setupPrompt(plot, "X Divisions:", validator, function(finalValue) {
            if (parseFloat(finalValue) !== Gx.xdiv) {
              if (finalValue === "") {
                finalValue = 1;
              }
              Gx.xdiv = parseFloat(finalValue);
            }
            plot.refresh();
          }, Gx.xdiv, undefined, undefined, undefined);
        }}, {text:"XLABel...", handler:function() {
          var validator = function(value) {
            console.log("The value is " + value);
            var isValid = mx.intValidator(value);
            return isValid;
          };
          setupPrompt(plot, "X Units:", validator, function(finalValue) {
            if (parseFloat(finalValue) !== Gx.xlab) {
              if (finalValue < 0) {
                finalValue = 0;
              }
              Gx.xlab = parseFloat(finalValue);
            }
            plot.refresh();
          }, Gx.xlab, undefined, undefined, undefined);
        }}, {text:"YDIVisions...", handler:function() {
          var validator = function(value) {
            var isValid = mx.intValidator(value);
            var maxYDIV = m.trunc(Mx.height / 2);
            if (isValid.valid && value > maxYDIV) {
              return{valid:false, reason:"Exceeds maximum number of divisions (" + maxYDIV + ")."};
            } else {
              return isValid;
            }
          };
          setupPrompt(plot, "Y Divisions:", validator, function(finalValue) {
            if (parseFloat(finalValue) !== Gx.ydiv) {
              if (finalValue === "") {
                finalValue = 1;
              }
              Gx.ydiv = parseFloat(finalValue);
            }
            plot.refresh();
          }, Gx.ydiv, undefined, undefined, undefined);
        }}, {text:"YINVersion", checked:Mx.origin === 4, style:"checkbox", handler:function() {
          plot.change_settings({yinv:Mx.origin !== 4});
        }}, {text:"YLABel...", handler:function() {
          var validator = function(value) {
            var isValid = mx.intValidator(value);
            return isValid;
          };
          setupPrompt(plot, "Y Units:", validator, function(finalValue) {
            if (parseFloat(finalValue) !== Gx.ylab) {
              if (finalValue < 0) {
                finalValue = 0;
              }
              Gx.ylab = parseFloat(finalValue);
            }
            plot.refresh();
          }, Gx.ylab, undefined, undefined, undefined);
        }}, {text:"X-axis", checked:Gx.show_x_axis, style:"checkbox", handler:function() {
          plot.change_settings({show_x_axis:!Gx.show_x_axis});
        }}, {text:"Y-axis", checked:Gx.show_y_axis, style:"checkbox", handler:function() {
          plot.change_settings({show_y_axis:!Gx.show_y_axis});
        }}, {text:"Readout", checked:Gx.show_readout, style:"checkbox", handler:function() {
          plot.change_settings({show_readout:!Gx.show_readout});
        }}, {text:"Invert Colors", checked:Mx.xi, style:"checkbox", handler:function() {
          mx.invertbgfg(Mx);
        }}]}};
        var COLORMAP_MENU = {text:"Colormap...", menu:{title:"COLORMAP", items:[]}};
        var colormap_handler = function(item) {
        };
        for (var xc = 0;xc < m.Mc.colormap.length;xc++) {
          var menuitem = {text:m.Mc.colormap[xc].name, cmap:xc, checked:Gx.cmap === xc, handler:colormap_handler};
          COLORMAP_MENU.menu.items.push(menuitem);
        }
        var traceoptionsmenu = function(index) {
          return{title:"TRACE OPTIONS", items:[{text:"Dashed...", handler:function() {
            var thk = 1;
            if (index !== undefined) {
              thk = Math.abs(plot._Gx.lyr[index].thick);
            } else {
              if (Gx.lyr.length === 0) {
                return;
              }
              thk = Math.abs(plot._Gx.lyr[0].thick);
              for (var i = 0;i < Gx.lyr.length;i++) {
                if (thk !== Math.abs(plot._Gx.lyr[i].thick)) {
                  thk = 1;
                  break;
                }
              }
            }
            setupPrompt(plot, "Line thickness:", mx.intValidator, function(finalValue) {
              if (index !== undefined) {
                plot._Gx.lyr[index].line = 3;
                plot._Gx.lyr[index].thick = -1 * finalValue;
                plot._Gx.lyr[index].symbol = 0;
              } else {
                for (var index = 0;index < Gx.lyr.length;index++) {
                  plot._Gx.lyr[index].line = 3;
                  plot._Gx.lyr[index].thick = -1 * finalValue;
                  plot._Gx.lyr[index].symbol = 0;
                }
              }
            }, thk);
          }}, {text:"Colors...", menu:{title:"COLORS", items:[{text:"Retain Current"}, {text:"Red", checked:index !== undefined ? plot._Gx.lyr[index].color === "red" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "red";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "red";
              }
            }
          }}, {text:"Pink", checked:index !== undefined ? plot._Gx.lyr[index].color === "pink" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "pink";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "pink";
              }
            }
          }}, {text:"Hot Pink", checked:index !== undefined ? plot._Gx.lyr[index].color === "#ff009e" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "#ff009e";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "#ff009e";
              }
            }
          }}, {text:"Orange", checked:index !== undefined ? plot._Gx.lyr[index].color === "orange" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "orange";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "orange";
              }
            }
          }}, {text:"Yellow", checked:index !== undefined ? plot._Gx.lyr[index].color === "yellow" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "yellow";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "yellow";
              }
            }
          }}, {text:"Lime Green", checked:index !== undefined ? plot._Gx.lyr[index].color === "#80f741" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "#80f741";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "#80f741";
              }
            }
          }}, {text:"Green", checked:index !== undefined ? plot._Gx.lyr[index].color === "green" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "green";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "green";
              }
            }
          }}, {text:"Blue", checked:index !== undefined ? plot._Gx.lyr[index].color === "blue" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "blue";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "blue";
              }
            }
          }}, {text:"Purple", checked:index !== undefined ? plot._Gx.lyr[index].color === "purple" : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = "purple";
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].color = "purple";
              }
            }
          }}, {text:"Custom Hexcode", handler:function() {
            setupPrompt(plot, "Color code (requires #):", mx.hexValidator, function(finalValue) {
              if (index !== undefined) {
                plot._Gx.lyr[index].color = finalValue;
              } else {
                for (var index = 0;index < Gx.lyr.length;index++) {
                  plot._Gx.lyr[index].color = finalValue;
                }
              }
            }, undefined, undefined, undefined, undefined);
          }}]}}, {text:"Dots...", handler:function() {
            var radius = 3;
            if (index !== undefined) {
              radius = Math.abs(plot._Gx.lyr[index].radius);
            } else {
              if (Gx.lyr.length === 0) {
                return;
              }
              var i;
              for (i = 0;i < Gx.lyr.length;i++) {
                if (radius !== Math.abs(plot._Gx.lyr[i].radius)) {
                  radius = 3;
                  break;
                }
              }
            }
            setupPrompt(plot, "Radius/Shape:", mx.intValidator, function(finalValue) {
              var sym;
              var rad;
              if (finalValue < 0) {
                sym = 3;
                rad = Math.abs(finalValue);
              } else {
                if (finalValue > 0) {
                  sym = 2;
                  rad = finalValue;
                } else {
                  sym = 1;
                  rad = 0;
                }
              }
              if (index !== undefined) {
                plot._Gx.lyr[index].line = 0;
                plot._Gx.lyr[index].radius = rad;
                plot._Gx.lyr[index].symbol = sym;
              } else {
                var i;
                for (i = 0;i < Gx.lyr.length;i++) {
                  plot._Gx.lyr[i].line = 0;
                  plot._Gx.lyr[i].radius = rad;
                  plot._Gx.lyr[i].symbol = sym;
                }
              }
            }, radius);
          }}, {text:"Radius...", handler:function() {
            var radius = 3;
            if (index !== undefined) {
              radius = Math.abs(plot._Gx.lyr[index].radius);
            } else {
              if (Gx.lyr.length === 0) {
                return;
              }
              for (var i = 0;i < Gx.lyr.length;i++) {
                if (radius !== Math.abs(plot._Gx.lyr[i].radius)) {
                  radius = 3;
                  break;
                }
              }
            }
            setupPrompt(plot, "Radius:", mx.intValidator, function(finalValue) {
              var sym;
              var rad;
              if (finalValue < 0) {
                rad = Math.abs(finalValue);
              } else {
                if (finalValue > 0) {
                  rad = finalValue;
                } else {
                  sym = 1;
                  rad = 0;
                }
              }
              if (index !== undefined) {
                plot._Gx.lyr[index].line = 0;
                plot._Gx.lyr[index].radius = rad;
              } else {
                for (var i = 0;i < Gx.lyr.length;i++) {
                  plot._Gx.lyr[i].line = 0;
                  plot._Gx.lyr[i].radius = rad;
                }
              }
            }, radius);
          }}, {text:"Solid...", handler:function() {
            var thk = 1;
            if (index !== undefined) {
              thk = Math.abs(plot._Gx.lyr[index].thick);
            } else {
              if (Gx.lyr.length === 0) {
                return;
              }
              thk = Math.abs(plot._Gx.lyr[0].thick);
              var i;
              for (i = 0;i < Gx.lyr.length;i++) {
                if (thk !== Math.abs(plot._Gx.lyr[i].thick)) {
                  thk = 1;
                  break;
                }
              }
            }
            setupPrompt(plot, "Line thickness:", mx.intValidator, function(finalValue) {
              if (index !== undefined) {
                plot._Gx.lyr[index].line = 3;
                plot._Gx.lyr[index].thick = finalValue;
                plot._Gx.lyr[index].symbol = 0;
              } else {
                var i;
                for (i = 0;i < Gx.lyr.length;i++) {
                  plot._Gx.lyr[i].line = 3;
                  plot._Gx.lyr[i].thick = finalValue;
                  plot._Gx.lyr[i].symbol = 0;
                }
              }
            }, thk);
          }}, {text:"Toggle", style:index !== undefined ? "checkbox" : undefined, checked:index !== undefined ? plot._Gx.lyr[index].display : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].display = !plot._Gx.lyr[index].display;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].display = !plot._Gx.lyr[i].display;
              }
            }
          }}, {text:"Symbols...", menu:{title:"SYMBOLS", items:[{text:"Retain Current"}, {text:"None", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 0 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].radius = 0;
              plot._Gx.lyr[index].symbol = 0;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].radius = 0;
                plot._Gx.lyr[i].symbol = 0;
              }
            }
          }}, {text:"Pixels", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 1 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].radius = 1;
              plot._Gx.lyr[index].symbol = 1;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].radius = 1;
                plot._Gx.lyr[i].symbol = 1;
              }
            }
          }}, {text:"Circles", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 2 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].radius = 4;
              plot._Gx.lyr[index].symbol = 2;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].radius = 4;
                plot._Gx.lyr[i].symbol = 2;
              }
            }
          }}, {text:"Squares", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 3 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].radius = 4;
              plot._Gx.lyr[index].symbol = 3;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].radius = 4;
                plot._Gx.lyr[i].symbol = 3;
              }
            }
          }}, {text:"Plusses", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 4 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].radius = 4;
              plot._Gx.lyr[index].symbol = 4;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].radius = 4;
                plot._Gx.lyr[i].symbol = 4;
              }
            }
          }}, {text:"X's", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 5 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].radius = 4;
              plot._Gx.lyr[index].symbol = 5;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].radius = 4;
                plot._Gx.lyr[i].symbol = 5;
              }
            }
          }}, {text:"Triangles", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 6 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].radius = 6;
              plot._Gx.lyr[index].symbol = 6;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].radius = 6;
                plot._Gx.lyr[i].symbol = 6;
              }
            }
          }}, {text:"Downward Triangles", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 7 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].radius = 6;
              plot._Gx.lyr[index].symbol = 7;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].radius = 6;
                plot._Gx.lyr[i].symbol = 7;
              }
            }
          }}]}}, {text:"Line Type...", menu:{title:"LINE TYPE", items:[{text:"Retain Current"}, {text:"None", checked:index !== undefined ? plot._Gx.lyr[index].line === 0 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].line = 0;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].line = 0;
              }
            }
          }}, {text:"Verticals", checked:index !== undefined ? plot._Gx.lyr[index].line === 1 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].line = 1;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].line = 1;
              }
            }
          }}, {text:"Horizontals", checked:index !== undefined ? plot._Gx.lyr[index].line === 2 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].line = 2;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].line = 2;
              }
            }
          }}, {text:"Connecting", checked:index !== undefined ? plot._Gx.lyr[index].line === 3 : undefined, handler:function() {
            if (index !== undefined) {
              plot._Gx.lyr[index].line = 3;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].line = 3;
              }
            }
          }}]}}, {text:"Thickness...", handler:function() {
            var thickness = 1;
            if (index !== undefined) {
              thickness = plot._Gx.lyr[index].thick;
            }
            setupPrompt(plot, "Thickness", mx.intValidator, function(finalValue) {
              if (finalValue === "") {
                finalValue = 1;
              }
              finalValue = Math.max(0, finalValue);
              if (index !== undefined) {
                plot._Gx.lyr[index].thick = finalValue;
              } else {
                for (var i = 0;i < Gx.lyr.length;i++) {
                  plot._Gx.lyr[i].thick = finalValue;
                }
              }
            }, thickness, undefined, undefined, undefined);
          }}, {text:"Opacity...", handler:function() {
            var opacity = 1;
            if (index !== undefined) {
              opacity = plot._Gx.lyr[index].opacity;
            }
            setupPrompt(plot, "Opacity:", mx.floatValidator, function(finalValue) {
              if (finalValue === "") {
                finalValue = 1;
              }
              finalValue = Math.max(0, finalValue);
              finalValue = Math.min(1, finalValue);
              if (index !== undefined) {
                plot._Gx.lyr[index].opacity = finalValue;
              } else {
                for (var i = 0;i < Gx.lyr.length;i++) {
                  plot._Gx.lyr[i].opacity = finalValue;
                }
              }
            }, opacity, undefined, undefined, undefined);
          }}]};
        };
        var VIEW_MENU = {text:"View...", menu:{title:"VIEW", items:[{text:"Reset", handler:function() {
          plot.unzoom();
        }}, {text:"Y Axis", style:"separator"}, {text:"Expand Range", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_EXPAND, "YPAN");
        }}, {text:"Shrink Range", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_SHRINK, "YPAN");
        }}, {text:"Expand Full", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_FULL, "YPAN");
        }}, {text:"X Axis", style:"separator"}, {text:"Expand Range", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_EXPAND, "XPAN");
        }}, {text:"Shrink Range", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_SHRINK, "XPAN");
        }}, {text:"Expand Full", handler:function() {
          middleClickScrollMenuAction(plot, mx.SB_FULL, "XPAN");
        }}]}};
        var TRACES_MENU = {text:"Traces...", menu:function() {
          var Gx = plot._Gx;
          var tracemenu = {title:"TRACE", items:[]};
          tracemenu.items.push({text:"All", menu:traceoptionsmenu()});
          for (var i = 0;i < Gx.lyr.length;i++) {
            tracemenu.items.push({text:Gx.lyr[i].name, menu:traceoptionsmenu(i)});
          }
          return tracemenu;
        }};
        var FILES_MENU = {text:"Files...", menu:{title:"FILES OPTIONS", items:[{text:"Deoverlay File...", menu:function() {
          var Gx = plot._Gx;
          var deoverlaymenu = {title:"DEOVERLAY", items:[]};
          deoverlaymenu.items.push({text:"Deoverlay All", handler:function() {
            plot.deoverlay();
          }});
          for (var i = 0;i < Gx.lyr.length;i++) {
            var handler = function(index) {
              return function() {
                plot.deoverlay(index);
              };
            }(i);
            deoverlaymenu.items.push({text:Gx.lyr[i].name, handler:handler});
          }
          return deoverlaymenu;
        }}]}};
        var PLUGINS_MENU = {text:"Plugins...", menu:{title:"PLUGINS", items:function() {
          var result = [];
          for (var i = 0;i < Gx.plugins.length;i++) {
            var plugin = Gx.plugins[i];
            if (plugin.impl.menu) {
              if (typeof plugin.impl.menu === "function") {
                result.push(plugin.impl.menu());
              } else {
                result.push(plugin.impl.menu);
              }
            }
          }
          return result;
        }()}};
        var SAVE_MENU = {text:"Save as...", menu:{title:"SAVE AS", items:[{text:"PNG", handler:function() {
          var img = plot._Mx.active_canvas.toDataURL("image/png");
          var link = document.createElement("a");
          link.href = img;
          link.download = "SigPlot." + (new Date).getTime() + ".png";
          link.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}, {text:"JPG", handler:function() {
          var img = plot._Mx.active_canvas.toDataURL("image/jpg");
          var link = document.createElement("a");
          link.href = img;
          link.download = "SigPlot." + (new Date).getTime() + ".jpg";
          link.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}, {text:"SVG", handler:function() {
          var img = plot._Mx.active_canvas.toDataURL("image/svg");
          var link = document.createElement("a");
          link.href = img;
          link.download = "SigPlot." + (new Date).getTime() + ".svg";
          link.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}]}};
        var REFRESH_ITEM = {text:"Refresh"};
        var KEYPRESSINFO_ITEM = {text:"Keypress Info", handler:function() {
          mx.message(Mx, KEYPRESS_HELP);
        }};
        var EXIT_ITEM = {text:"Exit", handler:function() {
          var evt = document.createEvent("Event");
          evt.initEvent("sigplotexit", true, true);
          mx.dispatchEvent(Mx, evt);
        }};
        var MAINMENU = {title:"SIG-PLOT", finalize:function() {
          if (!Mx.prompt) {
            mx.addEventListener(Mx, "mousedown", plot.onmousedown, false);
          }
          plot.refresh();
        }, items:[REFRESH_ITEM, CONTROLS_MENU, CXMODE_MENU, SCALING_MENU, VIEW_MENU, GRID_MENU, SETTINGS_MENU, COLORMAP_MENU, TRACES_MENU, FILES_MENU, PLUGINS_MENU, KEYPRESSINFO_ITEM, SAVE_MENU, EXIT_ITEM]};
        mx.menu(Mx, MAINMENU);
      }
      function sigplot_legend_menu(plot, index) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        mx.removeEventListener(Mx, "mousedown", plot.onmousedown, false);
        var DASHED = {text:"Dashed...", handler:function() {
          var thk = 1;
          if (index !== undefined) {
            thk = Math.abs(plot._Gx.lyr[index].thick);
          } else {
            if (Gx.lyr.length === 0) {
              return;
            }
            thk = Math.abs(plot._Gx.lyr[0].thick);
            for (var i = 0;i < Gx.lyr.length;i++) {
              if (thk !== Math.abs(plot._Gx.lyr[i].thick)) {
                thk = 1;
                break;
              }
            }
          }
          setupPrompt(plot, "Line thickness:", mx.intValidator, function(finalValue) {
            if (index !== undefined) {
              plot._Gx.lyr[index].line = 3;
              plot._Gx.lyr[index].thick = -1 * finalValue;
              plot._Gx.lyr[index].symbol = 0;
            } else {
              for (var index = 0;index < Gx.lyr.length;index++) {
                plot._Gx.lyr[index].line = 3;
                plot._Gx.lyr[index].thick = -1 * finalValue;
                plot._Gx.lyr[index].symbol = 0;
              }
            }
          }, thk);
        }};
        var COLORS = {text:"Colors...", menu:{title:"COLORS", items:[{text:"Retain Current"}, {text:"Red", checked:index !== undefined ? plot._Gx.lyr[index].color === "red" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "red";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "red";
            }
          }
        }}, {text:"Pink", checked:index !== undefined ? plot._Gx.lyr[index].color === "pink" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "pink";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "pink";
            }
          }
        }}, {text:"Hot Pink", checked:index !== undefined ? plot._Gx.lyr[index].color === "#ff009e" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "#ff009e";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "#ff009e";
            }
          }
        }}, {text:"Orange", checked:index !== undefined ? plot._Gx.lyr[index].color === "orange" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "orange";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "orange";
            }
          }
        }}, {text:"Yellow", checked:index !== undefined ? plot._Gx.lyr[index].color === "yellow" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "yellow";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "yellow";
            }
          }
        }}, {text:"Lime Green", checked:index !== undefined ? plot._Gx.lyr[index].color === "#80f741" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "#80f741";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "#80f741";
            }
          }
        }}, {text:"Green", checked:index !== undefined ? plot._Gx.lyr[index].color === "green" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "green";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "green";
            }
          }
        }}, {text:"Blue", checked:index !== undefined ? plot._Gx.lyr[index].color === "blue" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "blue";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "blue";
            }
          }
        }}, {text:"Purple", checked:index !== undefined ? plot._Gx.lyr[index].color === "purple" : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].color = "purple";
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].color = "purple";
            }
          }
        }}, {text:"Custom Hexcode", handler:function() {
          setupPrompt(plot, "Color code (requires #):", mx.hexValidator, function(finalValue) {
            if (index !== undefined) {
              plot._Gx.lyr[index].color = finalValue;
            } else {
              for (var index = 0;index < Gx.lyr.length;index++) {
                plot._Gx.lyr[index].color = finalValue;
              }
            }
          }, undefined, undefined, undefined, undefined);
        }}]}};
        var SOLID = {text:"Solid...", handler:function() {
          var thk = 1;
          if (index !== undefined) {
            thk = Math.abs(plot._Gx.lyr[index].thick);
          } else {
            if (Gx.lyr.length === 0) {
              return;
            }
            thk = Math.abs(plot._Gx.lyr[0].thick);
            var i;
            for (i = 0;i < Gx.lyr.length;i++) {
              if (thk !== Math.abs(plot._Gx.lyr[i].thick)) {
                thk = 1;
                break;
              }
            }
          }
          setupPrompt(plot, "Line thickness:", mx.intValidator, function(finalValue) {
            if (index !== undefined) {
              plot._Gx.lyr[index].line = 3;
              plot._Gx.lyr[index].thick = finalValue;
              plot._Gx.lyr[index].symbol = 0;
            } else {
              var i;
              for (i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].line = 3;
                plot._Gx.lyr[i].thick = finalValue;
                plot._Gx.lyr[i].symbol = 0;
              }
            }
          }, thk);
        }};
        var TOGGLE = {text:"Toggle", style:index !== undefined ? "checkbox" : undefined, checked:index !== undefined ? plot._Gx.lyr[index].display : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].display = !plot._Gx.lyr[index].display;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].display = !plot._Gx.lyr[i].display;
            }
          }
        }};
        var SYMBOLS = {text:"Symbols...", menu:{title:"SYMBOLS", items:[{text:"Retain Current"}, {text:"None", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 0 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].radius = 0;
            plot._Gx.lyr[index].symbol = 0;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].radius = 0;
              plot._Gx.lyr[i].symbol = 0;
            }
          }
        }}, {text:"Pixels", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 1 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].radius = 1;
            plot._Gx.lyr[index].symbol = 1;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].radius = 1;
              plot._Gx.lyr[i].symbol = 1;
            }
          }
        }}, {text:"Circles", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 2 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].radius = 4;
            plot._Gx.lyr[index].symbol = 2;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].radius = 4;
              plot._Gx.lyr[i].symbol = 2;
            }
          }
        }}, {text:"Squares", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 3 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].radius = 4;
            plot._Gx.lyr[index].symbol = 3;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].radius = 4;
              plot._Gx.lyr[i].symbol = 3;
            }
          }
        }}, {text:"Plusses", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 4 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].radius = 4;
            plot._Gx.lyr[index].symbol = 4;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].radius = 4;
              plot._Gx.lyr[i].symbol = 4;
            }
          }
        }}, {text:"X's", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 5 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].radius = 4;
            plot._Gx.lyr[index].symbol = 5;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].radius = 4;
              plot._Gx.lyr[i].symbol = 5;
            }
          }
        }}, {text:"Triangles", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 6 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].radius = 6;
            plot._Gx.lyr[index].symbol = 6;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].radius = 6;
              plot._Gx.lyr[i].symbol = 6;
            }
          }
        }}, {text:"Downward Triangles", checked:index !== undefined ? plot._Gx.lyr[index].symbol === 7 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].radius = 6;
            plot._Gx.lyr[index].symbol = 7;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].radius = 6;
              plot._Gx.lyr[i].symbol = 7;
            }
          }
        }}]}};
        var LINE_TYPE = {text:"Line Type...", menu:{title:"LINE TYPE", items:[{text:"Retain Current"}, {text:"None", checked:index !== undefined ? plot._Gx.lyr[index].line === 0 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].line = 0;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].line = 0;
            }
          }
        }}, {text:"Verticals", checked:index !== undefined ? plot._Gx.lyr[index].line === 1 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].line = 1;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].line = 1;
            }
          }
        }}, {text:"Horizontals", checked:index !== undefined ? plot._Gx.lyr[index].line === 2 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].line = 2;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].line = 2;
            }
          }
        }}, {text:"Connecting", checked:index !== undefined ? plot._Gx.lyr[index].line === 3 : undefined, handler:function() {
          if (index !== undefined) {
            plot._Gx.lyr[index].line = 3;
          } else {
            for (var i = 0;i < Gx.lyr.length;i++) {
              plot._Gx.lyr[i].line = 3;
            }
          }
        }}]}};
        var THICKNESS = {text:"Thickness...", handler:function() {
          var thickness = 1;
          if (index !== undefined) {
            thickness = plot._Gx.lyr[index].thick;
          }
          setupPrompt(plot, "Thickness", mx.intValidator, function(finalValue) {
            if (finalValue === "") {
              finalValue = 1;
            }
            finalValue = Math.max(0, finalValue);
            if (index !== undefined) {
              plot._Gx.lyr[index].thick = finalValue;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].thick = finalValue;
              }
            }
          }, thickness, undefined, undefined, undefined);
        }};
        var OPACITY = {text:"Opacity...", handler:function() {
          var opacity = 1;
          if (index !== undefined) {
            opacity = plot._Gx.lyr[index].opacity;
          }
          setupPrompt(plot, "Opacity:", mx.floatValidator, function(finalValue) {
            if (finalValue === "") {
              finalValue = 1;
            }
            finalValue = Math.max(0, finalValue);
            finalValue = Math.min(1, finalValue);
            if (index !== undefined) {
              plot._Gx.lyr[index].opacity = finalValue;
            } else {
              for (var i = 0;i < Gx.lyr.length;i++) {
                plot._Gx.lyr[i].opacity = finalValue;
              }
            }
          }, opacity, undefined, undefined, undefined);
        }};
        var LEGEND_TRACE = {title:Gx.lyr[index].name, finalize:function() {
          if (!Mx.prompt) {
            mx.addEventListener(Mx, "mousedown", plot.onmousedown, false);
          }
          plot.refresh();
        }, items:[DASHED, COLORS, SOLID, TOGGLE, SYMBOLS, LINE_TYPE, THICKNESS, OPACITY]};
        mx.menu(Mx, LEGEND_TRACE);
      }
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
            if (mode === "horizontal") {
              takeAction = w > 2;
            } else {
              if (mode === "vertical") {
                takeAction = h > 2;
              } else {
                takeAction = w > 2 && h > 2;
              }
            }
          }
          if (!takeAction) {
            plot.mouseup(event);
          } else {
            if (action === undefined || action === "zoom") {
              plot.pixel_zoom(xo, yo, xl, yl);
              plot.refresh();
            } else {
              if (action === "select") {
                var evt = document.createEvent("Event");
                evt.initEvent("mtag", true, true);
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
          }
        };
      }
      function plot_init(plot, o) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        if (!o.xlab) {
          o.xlab = 0;
        }
        if (!o.ylab) {
          o.ylab = 0;
        }
        o.xlab = m.unit_lookup(o.xlab);
        o.ylab = m.unit_lookup(o.ylab);
        Gx.xmin = o.xmin === undefined ? 0 : o.xmin;
        Gx.xmax = o.xmax === undefined ? 0 : o.xmax;
        var havexmin = o.xmin !== undefined;
        var havexmax = o.xmax !== undefined;
        var address = o.cmode === undefined ? "" : o.cmode.toUpperCase();
        var line = o.line === undefined ? 3 : o.line;
        Gx.ylab = o.ylab;
        Gx.ylabel = o.ylabel;
        Gx.ymin = o.ymin === undefined ? 0 : o.ymin;
        Gx.ymax = o.ymax === undefined ? 0 : o.ymax;
        var haveymin = o.ymin !== undefined;
        var haveymax = o.ymax !== undefined;
        Gx.zmin = o.zmin;
        Gx.zmax = o.zmax;
        var havezmin = o.zmin !== undefined;
        var havezmax = o.zmax !== undefined;
        if (o.colors !== undefined) {
          mx.setbgfg(Mx, o.colors.bg, o.colors.fg, Mx.xi);
        }
        if (o.xi !== undefined) {
          mx.invertbgfg(Mx);
        }
        Gx.forcelab = o.forcelab === undefined ? true : o.forcelab;
        Gx.all = o.all === undefined ? false : o.all;
        Gx.expand = o.expand === undefined ? false : o.expand;
        Gx.xlab = o.xlab;
        Gx.xlabel = o.xlabel;
        Gx.segment = o.segment === undefined ? false : o.segment;
        Gx.plab = 24;
        var phunits = o.phunits === undefined ? "D" : o.phunits;
        if (phunits[0] === "R") {
          Gx.plab = 23;
        } else {
          if (phunits[0] === "C") {
            Gx.plab = 25;
          }
        }
        Gx.xdiv = o.xdiv === undefined ? 5 : o.xdiv;
        Gx.ydiv = o.ydiv === undefined ? 5 : o.ydiv;
        Gx.xcompression = o.xcmp || 0;
        Gx.rasterSmoothing = o.smoothing || false;
        Mx.origin = 1;
        if (o.yinv) {
          Mx.origin = 4;
        }
        Gx.pmt = o.pmt === undefined ? 1 : o.pmt;
        Gx.bufmax = o.bufmax === undefined ? 32768 : o.bufmax;
        Gx.sections = o.nsec === undefined ? 0 : o.nsec;
        Gx.anno_type = o.anno_type === undefined ? 0 : o.anno_type;
        Gx.xfmt = o.xfmt === undefined ? "" : o.xfmt;
        Gx.yfmt = o.yfmt === undefined ? "" : o.yfmt;
        Gx.index = o.index === undefined ? false : o.index;
        var imode = Gx.index || address.slice(0, 2) === "IN";
        if (imode) {
          if (havexmin && Gx.xmin === 1) {
            havexmin = false;
          }
          if (havexmax && Gx.xmin === 1) {
            havexmax = false;
          }
        }
        Gx.xdata = false;
        Gx.note = "";
        Gx.hold = 0;
        Gx.always_show_marker = o.always_show_marker || false;
        m.vstype("D");
        if (!o.inputs) {
          basefile(plot, false);
        } else {
        }
        var cmode = address;
        if (Gx.lyr.length > 0 && Gx.lyr[0].cx) {
          Gx.cmode = 1;
        } else {
          Gx.cmode = 3;
        }
        if (cmode === "MA" || (cmode === "INMA" || (cmode === "ABMA" || (cmode === "__MA" || cmode === "MAGNITUDE")))) {
          Gx.cmode = 1;
        }
        if (cmode === "PH" || (cmode === "INPH" || (cmode === "ABPH" || (cmode === "__PH" || cmode === "PHASE")))) {
          Gx.cmode = 2;
        }
        if (cmode === "RE" || (cmode === "INRE" || (cmode === "ABRE" || (cmode === "__RE" || cmode === "REAL")))) {
          Gx.cmode = 3;
        }
        if (cmode === "IM" || (cmode === "INIM" || (cmode === "ABIM" || (cmode === "__IM" || cmode === "IMAGINARY")))) {
          Gx.cmode = 4;
        }
        if (cmode === "LO" || (cmode === "D1" || (cmode === "INLO" || (cmode === "IND1" || (cmode === "ABIM" || (cmode === "ABD1" || (cmode === "__LO" || (cmode === "__D1" || cmode === "10*LOG10")))))))) {
          Gx.cmode = 6;
        }
        if (cmode === "L2" || (cmode === "D2" || (cmode === "INL2" || (cmode === "IND2" || (cmode === "ABLO" || (cmode === "ABD2" || (cmode === "__L2" || (cmode === "__D2" || cmode === "20*LOG10")))))))) {
          Gx.cmode = 7;
        }
        if (cmode === "RI" || (cmode === "IR" || (cmode === "INRI" || (cmode === "INIR" || (cmode === "ABRI" || (cmode === "ABIR" || (cmode === "__RI" || (cmode === "__IR" || (cmode === "IMAG/REAL" || cmode === "REAL/IMAG"))))))))) {
          if (Gx.index) {
            alert("Imag/Real mode not permitted in INDEX mode");
          } else {
            Gx.cmode = 5;
          }
        }
        Gx.basemode = Gx.cmode;
        plot.change_settings({cmode:Gx.cmode});
        Gx.dbmin = 1E-20;
        if (Gx.cmode >= 6) {
          var dbscale = 10;
          if (Gx.cmode === 7) {
            dbscale = 20;
          }
          if (cmode[0] === "L" || (cmode[0] === "1" || cmode[0] === "2")) {
            if (Gx.lyr.length > 0 && Gx.lyr[0].cx) {
              Gx.ymin = Math.max(Gx.ymin, 1E-10);
              Gx.ymax = Math.max(Gx.ymax, 1E-10);
            } else {
              Gx.ymin = Math.max(Gx.ymin, 1E-20);
              Gx.ymax = Math.max(Gx.ymax, 1E-20);
            }
            Gx.ymin = m.log10(Gx.ymin) * dbscale;
            Gx.ymax = m.log10(Gx.ymax) * dbscale;
          } else {
            if (Gx.lyr.length > 0 && Gx.lyr[0].cx) {
              Gx.ymin = Math.max(-18 * dbscale, Gx.ymin);
              Gx.ymax = Math.max(-18 * dbscale, Gx.ymax);
              Gx.dbmin = 1E-37;
            } else {
              if (Math.min(Gx.ymin, Gx.ymax) < -20 * dbscale) {
                Gx.ymin = Math.max(-37 * dbscale, Gx.ymin);
                Gx.ymax = Math.max(-37 * dbscale, Gx.ymax);
                Gx.dbmin = Math.pow(10, Math.min(Gx.ymin, Gx.ymax) / dbscale);
              }
            }
          }
        }
        Mx.level = 0;
        if (imode && !Gx.index) {
          if (havexmin) {
            Gx.xmin = Gx.xstart + Gx.xdelta * (Gx.xmin - 1);
          }
          if (havexmin) {
            Gx.xmax = Gx.xstart + Gx.xdelta * (Gx.xmax - 1);
          }
        }
        Gx.xmult = o.xmult;
        Gx.ymult = o.xmult;
        switch(o.autox) {
          case "none":
            o.autox = -1;
            break;
          case "min":
            o.autox = 1;
            break;
          case "max":
            o.autox = 2;
            break;
          case "full":
            o.autox = 3;
            break;
        }
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
        switch(o.autoy) {
          case "none":
            o.autoy = -1;
            break;
          case "min":
            o.autoy = 1;
            break;
          case "max":
            o.autoy = 2;
            break;
          case "full":
            o.autoy = 3;
            break;
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
        switch(o.autoz) {
          case "none":
            o.autoz = -1;
            break;
          case "min":
            o.autoz = 1;
            break;
          case "max":
            o.autoz = 2;
            break;
          case "full":
            o.autoz = 3;
            break;
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
        scale_base(plot, {get_data:true}, Gx.xmin, Gx.xmax, Gx.xlab, Gx.ylab);
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
        if (o.font_family) {
          Mx.font_family = o.font_family;
        }
        mx.set_font(Mx, Math.min(7, Mx.width / 64));
        Gx.ncolors = o.ncolors === undefined ? 16 : o.ncolors;
        Gx.cmap = null;
        if (o.cmap) {
          Gx.cmap = o.cmap;
        } else {
          Gx.cmap = o.xc === undefined ? -1 : o.xc;
        }
        setup_cmap(plot, Gx.cmap);
        if (o.xcnt === "leftmouse") {
          Gx.cntrls = 1;
        } else {
          if (o.xcnt === "continuous") {
            Gx.cntrls = 2;
          } else {
            Gx.cntrls = o.xcnt === undefined ? 1 : o.xcnt;
          }
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
        Gx.no_legend_button = o.no_legend_button === undefined ? false : o.no_legend_button;
        Gx.legendBtnLocation = null;
        Gx.pan = o.nopan === undefined ? true : !o.nopan;
        Gx.nomenu = o.nomenu === undefined ? false : o.nomenu;
        Gx.modmode = 0;
        Gx.modlayer = -1;
        Gx.modsource = 0;
        Gx.modified = o.mod && Gx.lyr.length > 0;
        Gx.nmark = 0;
        Gx.iabsc = 0;
        if (Gx.index) {
          Gx.iabsc = 1;
        }
        Gx.specs = !o.nospecs;
        Gx.scroll_time_interval = o.scroll_time_interval === undefined ? Gx.scroll_time_interval : o.scroll_time_interval;
        Gx.autohide_readout = o.autohide_readout;
        Gx.autohide_panbars = o.autohide_panbars;
        Gx.x_scrollbar_location = o.x_scrollbar_location;
        if (Gx.specs) {
          Gx.show_x_axis = !o.noxaxis;
          Gx.show_y_axis = !o.noyaxis;
          Gx.show_readout = !o.noreadout;
          if (Gx.show_x_axis || (Gx.show_y_axis || Gx.show_readout)) {
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
        Gx.xmrk = 0;
        Gx.ymrk = 0;
        if (!o.nodragdrop) {
          mx.addEventListener(Mx, "dragover", function(evt) {
            evt.preventDefault();
          }, false);
          mx.addEventListener(Mx, "drop", function(plot) {
            return function(evt) {
              var files = evt.dataTransfer.files;
              if (files.length > 0) {
                evt.preventDefault();
                plot.load_files(files);
              }
            };
          }(plot), false);
        }
      }
      function basefile(plot, open) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        if (open) {
          var hcb = Gx.HCB[0];
          Gx.xstart = hcb.xstart;
          Gx.xdelta = hcb.xdelta;
          Mx.origin = 1;
        } else {
          Gx.xstart = 0;
          Gx.xdelta = 1;
          Gx.autol = -1;
          Mx.origin = 1;
        }
      }
      function draw_accessories(plot, mode) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        if (mode > 0) {
          if (mode >= 4 && (Gx.show_readout && !Gx.hide_note)) {
            var ln = Gx.note.length;
            mx.text(Mx, Mx.width - Gx.lbtn - (ln + 1) * Mx.text_w, Mx.text_h, Gx.note);
          }
          if (mode >= 4) {
            draw_panbars(plot);
          }
          if (mode >= 1 && Gx.legend) {
            draw_legend(plot);
          }
        }
      }
      function draw_plugins(plot) {
        var Gx = plot._Gx;
        var ctx = plot._Mx.canvas.getContext("2d");
        var canvas;
        var plugin_index = 0;
        while (plugin_index < Gx.plugins.length) {
          var plugin = Gx.plugins[plugin_index].impl;
          if (plugin.refresh) {
            canvas = Gx.plugins[plugin_index].canvas;
            if (canvas.width !== plot._Mx.canvas.width) {
              canvas.width = plot._Mx.canvas.width;
            }
            if (canvas.height !== plot._Mx.canvas.height) {
              canvas.height = plot._Mx.canvas.height;
            }
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
      function draw_legend(plot) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        var ctx = Mx.canvas.getContext("2d");
        var i = 0;
        var n = 0;
        var ix = 0;
        var iy = 0;
        var ln = 0;
        var tw = 0;
        var xc = 0;
        var yc = 0;
        var xs = 0;
        var ys = 0;
        var thk = 0;
        var ic = 0;
        tw = Mx.text_w;
        xs = tw * 23;
        ys = (Gx.lyr.length + 1) * Mx.text_h;
        xc = Mx.r - xs;
        yc = Mx.t;
        var legendPos = {x:xc + 2, y:yc + 2, width:xs - 5, height:ys - 5};
        var defLabelWidth = 98;
        var maxLabelWidth = 0;
        var labelOffset = 0;
        for (n = 0;n < Gx.lyr.length;n++) {
          var labelLength = ctx.measureText(Gx.lyr[n].name).width;
          if (labelLength > maxLabelWidth) {
            maxLabelWidth = labelLength;
          }
        }
        if (maxLabelWidth > defLabelWidth) {
          labelOffset = maxLabelWidth - defLabelWidth;
          legendPos.width += labelOffset;
          legendPos.x -= labelOffset;
        }
        ctx.strokeStyle = Mx.fg;
        ctx.fillStyle = Mx.bg;
        ctx.fillRect(legendPos.x, legendPos.y, legendPos.width, legendPos.height);
        ctx.strokeRect(legendPos.x, legendPos.y, legendPos.width, legendPos.height);
        for (n = 0;n < Gx.lyr.length;n++) {
          ix = xc + 4 * tw;
          iy = yc + n * Mx.text_h + Mx.text_h;
          if (n === Gx.modlayer) {
            mx.text(Mx, xc + tw - labelOffset, iy + Math.floor(Mx.text_w / 2), "**");
          }
          if (Gx.lyr[n].display) {
            ic = Gx.lyr[n].color;
            if (Gx.lyr[n].line > 0) {
              thk = m.sign(Math.min(tw, Math.abs(Gx.lyr[n].thick)), Gx.lyr[n].thick);
              if (thk < 0 || thk === mx.L_dashed) {
                mx.draw_line(Mx, ic, ix - labelOffset, iy - 3, ix + tw * 2 - labelOffset, iy - 3, Math.abs(thk), {mode:"dashed", on:4, off:4});
              } else {
                mx.draw_line(Mx, ic, ix - labelOffset, iy - 3, ix + tw * 2 - labelOffset, iy - 3, Math.abs(thk));
              }
            }
            if (Gx.lyr[n].symbol > 0) {
              if (Gx.lyr[n].radius < 0) {
                thk = -m.trunc(0.6 * tw);
              } else {
                thk = Math.min(Gx.lyr[n].radius, m.trunc(0.6 * tw));
              }
              mx.draw_symbol(Mx, ic, ix + tw - labelOffset, iy - 3, Gx.lyr[n].symbol, thk);
            }
            if (Gx.lyr[n].hcb["class"] === 2) {
              mx.legend_colorbar(Mx, legendPos.x + 10, legendPos.y + legendPos.height / 4, legendPos.width / 4 - 10, legendPos.height / 2);
            }
          }
          ix = ix + tw * 3;
          iy = iy + Mx.text_h * 0.3;
          mx.text(Mx, ix - labelOffset, iy, Gx.lyr[n].name);
        }
        var layerheight = legendPos.height / Gx.lyr.length;
        for (i = 0;i < Gx.lyr.length;i++) {
          if (legendPos.x <= Mx.xpos && (legendPos.x + legendPos.width >= Mx.xpos && (legendPos.y <= Mx.ypos && legendPos.y + layerheight >= Mx.ypos))) {
            sigplot_legend_menu(plot, i);
          }
          legendPos.y += layerheight;
        }
      }
      function form_plotnote(plot) {
        var Gx = plot._Gx;
        if (Gx.HCB.length === 0) {
          Gx.note = "";
        } else {
          if (Gx.HCB[0].plotnote === undefined) {
            var files = [];
            for (var n = 0;n < Gx.HCB.length;n++) {
              if (Gx.HCB[n].file_name) {
                files.push(Gx.HCB[n].file_name);
              }
            }
            Gx.note = files.join("|").toUpperCase();
          }
        }
      }
      function draw_layer(plot, n) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        if (n >= Gx.lyr.length || (!Gx.lyr[n].display || Gx.hold !== 0)) {
          return;
        }
        Gx.lyr[n].draw();
        var evt = document.createEvent("Event");
        evt.initEvent("lyrdraw", true, true);
        evt.index = n;
        evt.name = Gx.lyr[n].name;
        evt.layer = Gx.lyr[n];
        mx.dispatchEvent(Mx, evt);
      }
      function delete_layer(plot, n) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        var evt = document.createEvent("Event");
        evt.initEvent("lyrdel", true, true);
        evt.index = n;
        evt.name = Gx.lyr[n].name;
        evt.layer = Gx.lyr[n];
        var executeDefault = mx.dispatchEvent(Mx, evt);
        if (!executeDefault) {
          return;
        }
        Gx.lyr[n].ybufn = 0;
        Gx.lyr[n].ybuf = null;
        if (n < Gx.lyr.length - 1) {
          var lyr = Gx.lyr[n];
          for (var i = n;i < Gx.lyr.length - 1;i++) {
            Gx.lyr[i] = Gx.lyr[i + 1];
          }
        }
        Gx.lyr.length -= 1;
        if (Gx.HCB.length > 0) {
          Gx.panxmin = 1;
          Gx.panxmax = -1;
          Gx.panymin = 1;
          Gx.panymax = -1;
        }
      }
      function draw_p_cuts(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        if (Gx.lyr[0].hcb["class"] !== 2) {
          return;
        }
        var eventx = document.createEvent("Event");
        eventx.initEvent("x-cut", false, false);
        var onPlotXCut = function() {
          if (plot._Gx.xcut === undefined) {
            plot._Gx.element1 = document.createElement("div");
            document.getElementById(plot._Gx.parent.id).appendChild(plot._Gx.element1);
            plot._Gx.xcut = new sigplot.Plot(plot._Gx.element1, {});
            var layer = plot._Gx.xcut.overlay_array(plot._Gx.x_cut_data, null, {name:"x_cut_data", line:3});
            plot._Gx.xcut.change_settings({specs:!Gx.specs});
            plot._Gx.xcut.change_settings({grid:!Gx.grid});
            plot._Gx.xcut.change_settings({pan:!Gx.pan});
            plot._Gx.xcut._Gx.x_box_x = plot._Gx.x_box_x;
            plot._Gx.xcut._Gx.x_box_y = plot._Gx.x_box_y;
            plot._Gx.xcut._Gx.x_box_h = plot._Gx.x_box_h;
            plot._Gx.xcut._Gx.x_box_w = plot._Gx.x_box_w;
            plot._Gx.xcut.change_settings({xcut_now:!Gx.xcut_now});
            plot._Gx.xcut.get_layer(layer).color = plot._Mx.fg;
            plot._Gx.element1.setAttribute("style", "width:" + plot._Gx.x_box_w + "px;" + "height:" + plot._Gx.x_box_h + "px;position:absolute;left:" + plot._Gx.x_box_x + "px;top:" + plot._Gx.x_box_y + "px");
          } else {
            plot._Gx.xcut.reload(0, plot._Gx.x_cut_data);
          }
        };
        plot.addListener("x-cut", onPlotXCut);
        var eventy = document.createEvent("Event");
        eventy.initEvent("y-cut", false, false);
        var onPlotYCut = function() {
          if (plot._Gx.ycut === undefined) {
            plot._Gx.element2 = document.createElement("div");
            document.getElementById(plot._Gx.parent.id).appendChild(plot._Gx.element2);
            plot._Gx.ycut = new sigplot.Plot(plot._Gx.element2, {});
            var layer = plot._Gx.ycut.overlay_array(plot._Gx.y_cut_data, null, {name:"y_cut_data", line:3});
            plot._Gx.ycut.change_settings({specs:!Gx.specs});
            plot._Gx.ycut.change_settings({grid:!Gx.grid});
            plot._Gx.ycut.change_settings({pan:!Gx.pan});
            plot._Gx.ycut._Gx.y_box_x = plot._Gx.y_box_x;
            plot._Gx.ycut._Gx.y_box_y = plot._Gx.y_box_y;
            plot._Gx.ycut._Gx.y_box_h = plot._Gx.y_box_h;
            plot._Gx.ycut._Gx.y_box_w = plot._Gx.y_box_w;
            plot._Gx.ycut.change_settings({ycut_now:!Gx.ycut_now});
            plot._Gx.ycut.get_layer(layer).color = plot._Mx.fg;
            var new_left = plot._Gx.y_box_x + 0.5 * plot._Gx.y_box_w - 0.5 * plot._Gx.y_box_h;
            var new_top = plot._Gx.y_box_y + 0.5 * plot._Gx.y_box_h - 0.5 * plot._Gx.y_box_w;
            plot._Gx.element2.setAttribute("style", "width:" + plot._Gx.y_box_h + "px;" + "height:" + plot._Gx.y_box_w + "px;position:absolute;left:" + new_left + "px;top:" + new_top + "px");
            plot._Gx.element2.style.transform = "rotate(90deg)";
          } else {
            plot._Gx.ycut.reload(0, plot._Gx.y_cut_data);
          }
        };
        plot.addListener("y-cut", onPlotYCut);
        var plot_height = Mx.b - Mx.t;
        var plot_width = Mx.r - Mx.l;
        var height = Gx.lyr[0].yframe;
        var width = Gx.lyr[0].xframe;
        if (Gx.p_cuts) {
          if (Mx.xpos >= Mx.l && (Mx.xpos <= Mx.r && Gx.p_cuts_xpos !== Mx.xpos) || Gx.p_press) {
            var line = 0;
            var i = 0;
            if (Gx.p_cuts_xpos !== undefined) {
              Gx.y_cut_data = [];
              line = Math.floor(width * (Gx.p_cuts_xpos - Mx.l) / plot_width);
              for (i = line;i < width * height;i += width) {
                Gx.y_cut_data.push(Gx.lyr[0].zbuf[i]);
              }
              mx.dispatchEvent(Mx, eventy);
            }
            Gx.y_cut_data = [];
            line = Math.floor(width * (Mx.xpos - Mx.l) / plot_width);
            for (i = line;i < width * height;i += width) {
              Gx.y_cut_data.push(Gx.lyr[0].zbuf[i]);
            }
            mx.dispatchEvent(Mx, eventy);
            Gx.p_cuts_xpos = Mx.xpos;
          }
          if (Mx.ypos >= Mx.t && (Mx.ypos <= Mx.b && Gx.p_cuts_ypos !== Mx.ypos) || Gx.p_press) {
            var row = 0;
            var start = 0;
            var finish = 0;
            var i = 0;
            if (Gx.p_cuts_ypos !== undefined) {
              row = Math.floor(height * (Gx.p_cuts_ypos - Mx.t) / plot_height);
              start = row * width;
              finish = start + width;
              Gx.x_cut_data = Gx.lyr[0].zbuf.slice(start, finish);
              mx.dispatchEvent(Mx, eventx);
            }
            row = Math.floor(height * (Mx.ypos - Mx.t) / plot_height);
            start = row * width;
            finish = start + width;
            Gx.x_cut_data = Gx.lyr[0].zbuf.slice(start, finish);
            mx.dispatchEvent(Mx, eventx);
            Gx.p_cuts_ypos = Mx.ypos;
          }
          Gx.p_press = false;
        }
        if (Gx.enabled_streaming_pcut) {
          var line = 0;
          var i = 0;
          height = Gx.lyr[0].lps;
          Gx.y_cut_data = [];
          line = Math.floor(width * (Mx.xpos - Mx.l) / plot_width);
          for (i = line;i < width * height;i += width) {
            Gx.y_cut_data.push(Gx.lyr[0].zbuf[i]);
          }
          mx.dispatchEvent(Mx, eventy);
          var row = 0;
          var start = 0;
          var finish = 0;
          Gx.x_cut_data = [];
          row = Math.floor(height * (Mx.ypos - Mx.t) / plot_height);
          start = row * width;
          finish = start + width;
          Gx.x_cut_data = Gx.lyr[0].zbuf.slice(start, finish);
          mx.dispatchEvent(Mx, eventx);
        }
      }
      function draw_crosshairs(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        if (Gx.cross) {
          if (Gx.cross === "vertical" || Gx.cross === true) {
            if (Mx.xpos >= Mx.l && (Mx.xpos <= Mx.r && Gx.cross_xpos !== Mx.xpos)) {
              if (Gx.cross_xpos !== undefined) {
                mx.rubberline(Mx, Gx.cross_xpos, Mx.t, Gx.cross_xpos, Mx.b);
              }
              mx.rubberline(Mx, Mx.xpos, Mx.t, Mx.xpos, Mx.b);
              Gx.cross_xpos = Mx.xpos;
            }
          }
          if (Gx.cross === "horizontal" || Gx.cross === true) {
            if (Mx.ypos >= Mx.t && (Mx.ypos <= Mx.b && Gx.cross_ypos !== Mx.ypos)) {
              if (Gx.cross_ypos !== undefined) {
                mx.rubberline(Mx, Mx.l, Gx.cross_ypos, Mx.r, Gx.cross_ypos);
              }
              mx.rubberline(Mx, Mx.l, Mx.ypos, Mx.r, Mx.ypos);
              Gx.cross_ypos = Mx.ypos;
            }
          }
        }
      }
      function draw_marker(plot) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        if (Gx.xmrk !== null && Gx.ymrk !== null) {
          var pix = mx.real_to_pixel(Mx, Gx.xmrk, Gx.ymrk);
          if (Gx.lyr[0].hcb["class"] === 1) {
            if (pix.clipped) {
              return;
            }
          } else {
            if (Gx.lyr[0].hcb["class"] === 2) {
              if (pix.clipped_x || !pix.clipped_y) {
                return;
              }
            }
          }
          var ctx = Mx.active_canvas.getContext("2d");
          ctx.beginPath();
          ctx.strokeStyle = Mx.xwfg;
          ctx.fillStyle = Mx.xwfg;
          ctx.arc(pix.x, pix.y, 2, 0, 360);
          ctx.stroke();
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
      function changephunits(plot, newphunits) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        var newplab = Gx.plab;
        if (newphunits === "R") {
          newplab = 23;
        } else {
          if (newphunits === "D") {
            newplab = 24;
          }
        }
        if (newphunits === "C") {
          newplab = 25;
        }
        if (newplab !== Gx.plab) {
          var phscale = [Math.PI, 180, 0.5];
          var dscl = phscale[newplab - 23] / phscale[Gx.plab - 23];
          Gx.plab = newplab;
          if (Gx.cmode === 2) {
            for (var i = 0;i <= Mx.level;i++) {
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
      function changemode(plot, newmode) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        Gx.xdata = false;
        for (var n = 0;n < Gx.lyr.length;n++) {
          if (newmode === 5) {
            Gx.lyr[n].xdata = true;
          } else {
            Gx.lyr[n].xdata = false;
          }
          if (Gx.lyr[n].xdata) {
            Gx.xdata = true;
          }
        }
        if (newmode === Gx.cmode) {
          return;
        } else {
          if (newmode === 5 && Gx.index) {
            alert("Imag/Real mode not permitted in INDEX mode");
          } else {
            if (Gx.lyr.length <= 0) {
              Gx.cmode = newmode;
              display_specs(plot);
            } else {
              if (newmode > 0) {
                var oldmode = Gx.cmode;
                Gx.cmode = newmode;
                var autox = Gx.autox;
                var autoy = Gx.autoy;
                Gx.autox = 3;
                Gx.autoy = 3;
                if (newmode === 5 || oldmode === 5) {
                  Gx.panxmin = 1;
                  Gx.panxmax = -1;
                  Gx.panymin = 1;
                  Gx.panymax = -1;
                  Mx.level = 0;
                  if (newmode === Gx.basemode) {
                    Mx.stk[0].xmin = Gx.xmin;
                    Mx.stk[0].xmax = Gx.xmax;
                    Mx.stk[0].ymin = Gx.ymin;
                    Mx.stk[0].ymax = Gx.ymax;
                  } else {
                    if (newmode === 5 || Gx.basemode === 5) {
                      scale_base(plot, {get_data:true});
                    } else {
                      Mx.stk[0].xmin = Gx.xmin;
                      Mx.stk[0].xmax = Gx.xmax;
                      scale_base(plot, {get_data:true}, Gx.xmin, Gx.xmax);
                    }
                  }
                } else {
                  if (newmode === Gx.basemode) {
                    Gx.panymin = 1;
                    Gx.panymax = -1;
                    Mx.stk[0].ymin = Gx.ymin;
                    Mx.stk[0].ymax = Gx.ymax;
                  } else {
                    scale_base(plot, {}, Mx.stk[Mx.level].xmin, Mx.stk[Mx.level].xmax);
                  }
                  for (var n = 1;n <= Mx.level;n++) {
                    Mx.stk[n].ymin = Mx.stk[0].ymin;
                    Mx.stk[n].ymax = Mx.stk[0].ymax;
                  }
                }
                Gx.autox = autox;
                Gx.autoy = autoy;
                plot.refresh();
              }
            }
          }
        }
      }
      function draw_panbars(plot) {
        var k;
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        if (!Gx.pan || Mx.widget) {
          return;
        }
        k = Mx.level;
        var out = {ps:Mx.stk[k].ymin, pe:Mx.stk[k].ymax};
        var need_y_scrollbar = out.ps !== Gx.panymin || out.pe !== Gx.panymax;
        need_y_scrollbar = need_y_scrollbar && Mx.level > 0;
        if (Gx.autohide_panbars && ((!need_y_scrollbar || !plot.mouseOnCanvas) && !Gx.panning)) {
          var ctx = Mx.canvas.getContext("2d");
          ctx.fillStyle = Mx.bg;
          ctx.fillRect(Gx.pyl, Mx.t, Gx.pyl + Gx.pthk, Mx.b - Mx.t);
        } else {
          var i1 = mx.scrollbar(Mx, 0, Gx.pyl, Gx.pyl + Gx.pthk, Mx.t, Mx.b, out, Gx.panymin, Gx.panymax, undefined, Mx.scrollbar_y);
          Mx.stk[k].ymin = out.ps;
          Mx.stk[k].ymax = out.pe;
        }
        if (Gx.pl < Mx.width) {
          out = {ps:Mx.stk[k].xmin, pe:Mx.stk[k].xmax};
          var need_x_scrollbar = out.ps !== Gx.panxmin || out.pe !== Gx.panxmax;
          need_x_scrollbar = need_x_scrollbar && (!Gx.all || Mx.level > 0);
          if (Gx.autohide_panbars && ((!need_x_scrollbar || !plot.mouseOnCanvas) && !Gx.panning)) {
            var ctx = Mx.canvas.getContext("2d");
            ctx.fillStyle = Mx.bg;
            ctx.fillRect(Gx.pl, Gx.pt - 1, Gx.pr - Gx.pl, Gx.pthk + 4);
          } else {
            var i1 = mx.scrollbar(Mx, 0, Gx.pl, Gx.pr, Gx.pt, Gx.pt + Gx.pthk, out, Gx.panxmin, Gx.panxmax, undefined, Mx.scrollbar_x);
            Mx.stk[k].xmin = out.ps;
            Mx.stk[k].xmax = out.pe;
          }
        }
      }
      function pan(plot, action, flag, mouseEvent) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        var i;
        var k;
        var j;
        var xmin;
        var xmax;
        var xran;
        var ymin;
        var ymax;
        var yran;
        var warn;
        var scrollbarState;
        var sbx = new mx.SCROLLBAR;
        var sby = new mx.SCROLLBAR;
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
        if (action.substring(0, 1) === "Y") {
          ymin = Mx.stk[k].ymin;
          ymax = Mx.stk[k].ymax;
          yran = ymax - ymin;
          if (action === "YPAN") {
            scrollbarState = Mx.scrollbar_y;
            var out = {ps:ymin, pe:ymax};
            i = mx.scrollbar(Mx, sby, Gx.pyl, Gx.pyl + Gx.pthk, Mx.t, Mx.b, out, Gx.panymin, Gx.panymax, mouseEvent, scrollbarState);
            ymin = out.ps;
            ymax = out.pe;
            if (sby.action !== 0) {
              j = mx.scroll(Mx, sby, mx.XW_UPDATE, undefined, scrollbarState);
            }
            warn = false;
          } else {
            if (action === "YCENTER") {
              ymin = ymin - yran * (Mx.ypos - (Mx.t + Mx.b) / 2) / (Mx.b - Mx.t);
              ymax = ymin + yran;
              warn = false;
            }
          }
          if (ymin !== Mx.stk[k].ymin || ymax !== Mx.stk[k].ymax) {
            Mx.stk[k].ymin = ymin;
            Mx.stk[k].ymax = ymax;
            if (Gx.cmode === Gx.basemode && Mx.level === 1) {
              Gx.ymin = Math.min(Gx.ymin, ymin);
              Gx.ymax = Math.max(Gx.ymax, ymax);
            }
            this.inPan = true;
            var evt = document.createEvent("Event");
            evt.initEvent("ypan", true, true);
            evt.level = Mx.level;
            evt.xmin = Mx.stk[Mx.level].xmin;
            evt.ymin = Mx.stk[Mx.level].ymin;
            evt.xmax = Mx.stk[Mx.level].xmax;
            evt.ymax = Mx.stk[Mx.level].ymax;
            mx.dispatchEvent(Mx, evt);
            this.inPan = false;
            plot.refresh();
            SIGPLOT_PAN = true;
          }
        } else {
          xmin = Mx.stk[k].xmin;
          xmax = Mx.stk[k].xmax;
          xran = xmax - xmin;
          if (action === "XPAN") {
            scrollbarState = Mx.scrollbar_x;
            var out = {ps:xmin, pe:xmax};
            i = mx.scrollbar(Mx, sbx, Gx.pl, Gx.pr, Gx.pt, Gx.pt + Gx.pthk, out, Gx.panxmin, Gx.panxmax, mouseEvent, scrollbarState);
            xmin = out.ps;
            xmax = out.pe;
            if (sbx.action !== 0) {
              j = mx.scroll(Mx, sbx, mx.XW_UPDATE, undefined, scrollbarState);
            }
            warn = false;
          } else {
            if (action === "XCENTER") {
              xmin = xmin + xran * (Mx.xpos - (Mx.l + Mx.r) / 2) / (Mx.r - Mx.l);
              if (xmin !== Mx.stk[k].xmin) {
                xmax = xmin + xran;
              }
              warn = false;
            }
          }
          if (Mx.stk[k].xmin !== xmin || Mx.stk[k].xmax !== xmax) {
            Mx.stk[k].xmin = xmin;
            Mx.stk[k].xmax = xmax;
            if (!Gx.xdata && Mx.level === 1) {
              Gx.xmin = Mx.stk[1].xmin;
              Gx.xmax = Mx.stk[1].xmax;
            }
            this.inPan = true;
            var evt = document.createEvent("Event");
            evt.initEvent("xpan", true, true);
            evt.level = Mx.level;
            evt.xmin = Mx.stk[Mx.level].xmin;
            evt.ymin = Mx.stk[Mx.level].ymin;
            evt.xmax = Mx.stk[Mx.level].xmax;
            evt.ymax = Mx.stk[Mx.level].ymax;
            mx.dispatchEvent(Mx, evt);
            this.inPan = false;
            plot.refresh();
            SIGPLOT_PAN = true;
          }
        }
        return SIGPLOT_PAN;
      }
      function drag_scrollbar(plot, scrollAction, event) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        var min;
        var max;
        var scrollbar;
        if (scrollAction === "XPAN") {
          scrollbar = plot._Mx.scrollbar_x;
        } else {
          if (scrollAction === "YPAN") {
            scrollbar = plot._Mx.scrollbar_y;
          } else {
            throw "Unable to drag scrollbar - scrollAction is not 'XPAN' or 'YPAN'!!";
          }
        }
        scrollbar.flag = -12;
        var k = Mx.level;
        if (scrollAction === "XPAN") {
          min = Mx.stk[k].xmin;
          max = Mx.stk[k].xmax;
        } else {
          if (scrollAction === "YPAN") {
            min = Mx.stk[k].ymin;
            max = Mx.stk[k].ymax;
          } else {
            min = undefined;
            max = undefined;
          }
        }
        var rangeOut = {"min":min, "max":max};
        drag_updateRange(Mx, Gx, scrollbar, scrollAction, rangeOut, event);
        min = rangeOut.min;
        max = rangeOut.max;
        scrollbar.smin = min;
        scrollbar.srange = max - min;
        mx.redrawScrollbar(scrollbar, Mx, undefined);
        updateViewbox(plot, scrollbar.smin, scrollbar.smin + scrollbar.srange, scrollAction.slice(0, 1));
        this.inPan = true;
        var evt = document.createEvent("Event");
        if (scrollAction === "XPAN") {
          evt.initEvent("xpan", true, true);
        } else {
          if (scrollAction === "YPAN") {
            evt.initEvent("ypan", true, true);
          }
        }
        evt.level = Mx.level;
        evt.xmin = Mx.stk[Mx.level].xmin;
        evt.ymin = Mx.stk[Mx.level].ymin;
        evt.xmax = Mx.stk[Mx.level].xmax;
        evt.ymax = Mx.stk[Mx.level].ymax;
        mx.dispatchEvent(Mx, evt);
        this.inPan = false;
        scrollbar.action = 0;
        plot.refresh();
      }
      function drag_updateRange(Mx, Gx, scrollbar, scrollAction, range, event) {
        scrollbar.action = mx.SB_DRAG;
        if (scrollAction === "YPAN") {
          var scaleFactor = Mx.scrollbar_y.trange / Mx.scrollbar_y.h;
          if (scrollbar.origin === 4) {
            scaleFactor *= -1;
          }
          var mouseOffset = event.screenY - Gx.panning.ypos;
          var realOffset = mouseOffset * scaleFactor;
          if (Gx.panning.ymin - realOffset < Gx.panymin) {
            range.max = Gx.panymin + (range.max - range.min);
            range.min = Gx.panymin;
          } else {
            if (Gx.panning.ymax - realOffset > Gx.panymax) {
              range.min = Gx.panymax - (range.max - range.min);
              range.max = Gx.panymax;
            } else {
              range.min = Gx.panning.ymin - realOffset;
              range.max = Gx.panning.ymax - realOffset;
            }
          }
        } else {
          if (scrollAction === "XPAN") {
            var scaleFactor = Mx.scrollbar_x.trange / Mx.scrollbar_x.w;
            if (scrollbar.origin === 3) {
              scaleFactor *= -1;
            }
            var mouseOffset = event.screenX - Gx.panning.xpos;
            var realOffset = mouseOffset * scaleFactor;
            if (Gx.panning.xmin + realOffset < Gx.panxmin) {
              range.max = Gx.panxmin + (range.max - range.min);
              range.min = Gx.panxmin;
            } else {
              if (Gx.panning.xmax + realOffset > Gx.panxmax) {
                range.min = Gx.panxmax - (range.max - range.min);
                range.max = Gx.panxmax;
              } else {
                range.min = Gx.panning.xmin + realOffset;
                range.max = Gx.panning.xmax + realOffset;
              }
            }
          }
        }
      }
      function setupPrompt(plot, promptText, isValid, onSuccess, inputValue, xpos, ypos, callback) {
        var Mx = plot._Mx;
        if (Mx.prompt) {
          throw "Prompt already exists! Can only have one prompt at a time!";
        }
        mx.disableListeners(Mx);
        plot.disable_listeners();
        var realOnSuccess = function(plot, onSuccess) {
          return function(value) {
            onSuccess(value);
            mx.enableListeners(Mx);
            plot.enable_listeners();
            plot.refresh();
            if (callback !== undefined) {
              callback();
            }
          };
        };
        var refresh = function() {
          plot.refresh();
        };
        var errorMessageTimeout = 5E3;
        try {
          mx.prompt(Mx, promptText, isValid, realOnSuccess(plot, onSuccess), refresh, inputValue, xpos, ypos, errorMessageTimeout);
        } catch (err) {
          console.log("ERROR: Failed to set up prompt due to: " + err);
        }
      }
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
      function disable_listeners(plot) {
        var Mx = plot._Mx;
        mx.removeEventListener(Mx, "mousedown", plot.onmousedown, false);
        mx.removeEventListener(Mx, "mousemove", plot.throttledOnMouseMove, false);
        document.removeEventListener("mouseup", plot.docMouseUp, false);
        mx.removeEventListener(Mx, "mouseup", plot.mouseup, false);
        window.removeEventListener("mousedown", plot.dragMouseDownHandler, false);
        window.removeEventListener("mousemove", plot.throttledDragOnMouseMove, false);
        window.removeEventListener("mouseup", plot.dragMouseUpHandler, false);
        window.removeEventListener("wheel", plot.wheelHandler, false);
        window.removeEventListener("mousewheel", plot.wheelHandler, false);
        window.removeEventListener("DOMMouseScroll", plot.wheelHandler, false);
        window.removeEventListener("keypress", plot.onkeypress, false);
      }
      function display_specs(plot) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        var ctx = Mx.canvas.getContext("2d");
        if (Gx.sections !== 0) {
        } else {
          Gx.isec = 0;
        }
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
        if (Gx.cmode === 5 && Gx.iabsc === 1) {
          Gx.iabsc = 2;
        }
        if (Gx.iabsc === 1) {
          Gx.aretx = Math.round((Gx.aretx - Gx.xstart) / Gx.xdelta);
          if (!Gx.index) {
            Gx.aretx += 1;
          }
          Gx.dretx = Math.round(Gx.dretx / Gx.xdelta);
        } else {
          if (Gx.iabsc === 2) {
            if (Gx.aretx !== 0) {
              Gx.aretx = 1 / Gx.aretx;
            }
            if (Gx.arety !== 0) {
              Gx.arety = 1 / Gx.arety;
            }
            if (Gx.dretx !== 0) {
              Gx.dretx = 1 / Gx.dretx;
            }
            if (Gx.drety !== 0) {
              Gx.drety = 1 / Gx.drety;
            }
          }
        }
        if (!Gx.show_readout || Mx.widget) {
          return;
        }
        ctx.fillStyle = Mx.bg;
        var iy = Math.floor(Mx.height - 2.5 * Mx.text_h);
        ctx.fillRect(Mx.text_w, iy - 1, 49 * Mx.text_w, iy + 1.5 * Mx.text_h);
        iy = Math.floor(Mx.height - 0.5 * Mx.text_h);
        var k = Math.max(Gx.pr + Mx.text_w, Mx.width - Mx.text_w * 2);
        ctx.fillStyle = Mx.bg;
        ctx.fillRect(k, iy - Mx.text_h, Mx.text_w, Mx.text_h);
        if (Gx.autohide_readout && (!plot.mouseOnCanvas && !Gx.panning)) {
          return;
        }
        var xval, yval, xdelta, ydelta;
        if (Gx.iabsc === 0 && Gx.ylab === 4) {
          yval = (m.sec2tspec(Gx.arety) + "                ").substring(0, 16);
          ydelta = (m.sec2tspec(Gx.drety, "delta") + "                ").substring(0, 16);
        } else {
          yval = mx.format_g(Gx.arety, 16, 9, true);
          ydelta = mx.format_g(Gx.drety, 16, 9);
        }
        if (Gx.iabsc === 0 && Gx.xlab === 4) {
          xval = (m.sec2tspec(Gx.aretx) + "                ").substring(0, 16);
          xdelta = (m.sec2tspec(Gx.dretx, "delta") + "                ").substring(0, 16);
        } else {
          xval = mx.format_g(Gx.aretx, 16, 9, true);
          xdelta = mx.format_g(Gx.dretx, 16, 9);
        }
        var chara = "y: " + yval + " dy: " + ydelta + " L=" + Mx.level + " " + cxm[Gx.cmode - 1];
        var charb = "x: " + xval + " dx: " + xdelta + " " + cam[Gx.iabsc];
        if (Gx.iabsc === 3) {
          if (Gx.dretx === 0) {
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
          if (k < Mx.width) {
            if (Gx.cntrls > 0) {
              mx.text(Mx, k, iy, "C");
            } else {
              mx.text(Mx, k, iy, " ");
            }
          }
        }
        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;
        if (Gx.lg_colorbar && Gx.lyr[0].hcb["class"] === 2) {
          var plot_height = Mx.b - Mx.t;
          x = Mx.r + 35;
          y = Mx.t + 1 / 8 * plot_height;
          w = 5 * Mx.text_w;
          h = 3 / 4 * plot_height;
          var ctx = Mx.active_canvas.getContext("2d");
          ctx.strokeStyle = "rgba(124, 123, 121, 0.8)";
          ctx.fillStyle = " rgba(124, 123, 121, 0.8)";
          var colorbar_x = x;
          var colorbar_y = y;
          var colorbar_width = w;
          var colorbar_height = h;
          var button_width = colorbar_width - 2;
          var button_height = button_width / 2;
          var button_x = colorbar_x + (colorbar_width - button_width) / 2;
          var button_y = colorbar_y - 10;
          ctx.beginPath();
          ctx.moveTo(button_x, button_y);
          ctx.lineTo(button_x + button_width, button_y);
          ctx.lineTo(button_x + 1 / 2 * button_width, button_y - button_height);
          ctx.lineTo(button_x, button_y);
          ctx.stroke();
          ctx.fill();
          var button_y_2 = button_y + colorbar_height + 20;
          ctx.beginPath();
          ctx.moveTo(button_x, button_y_2);
          ctx.lineTo(button_x + button_width, button_y_2);
          ctx.lineTo(button_x + 1 / 2 * button_width, button_y_2 + button_height);
          ctx.lineTo(button_x, button_y_2);
          ctx.stroke();
          ctx.fill();
          Gx.cbb_top_x1 = button_x;
          Gx.cbb_top_y1 = button_y;
          Gx.cbb_bot_x1 = button_x;
          Gx.cbb_bot_y1 = button_y_2;
          Gx.cbb_width = button_width;
          Gx.cbb_height = button_height;
        } else {
          x = 49 * Mx.text_w - 3;
          y = Mx.height - Mx.text_h * 2.5;
          w = Mx.text_w;
          h = Mx.text_h * 2;
        }
        mx.colorbar(Mx, x, y, w, h);
        if ((Gx.p_cuts || Gx.enabled_streaming_pcut) && Gx.lyr[0].hcb["class"] === 2) {
          var plot_height = Mx.b - Mx.t;
          var plot_width = Mx.r - Mx.l;
          Gx.y_box_x = Mx.r + 25;
          Gx.y_box_y = Mx.t;
          Gx.y_box_w = 5 * Mx.text_w + 20;
          Gx.y_box_h = plot_height;
          if (Gx.lg_colorbar) {
            Gx.y_box_x += 100;
          }
          mx.draw_box(Mx, Mx.fg, Gx.y_box_x + 0.5, Gx.y_box_y, Gx.y_box_w, Gx.y_box_h);
          Gx.x_box_x = Mx.l;
          Gx.x_box_y = Mx.b + 25;
          Gx.x_box_w = plot_width;
          Gx.x_box_h = 5 * Mx.text_h + 20;
          mx.draw_box(Mx, Mx.fg, Gx.x_box_x + 0.5, Gx.x_box_y, Gx.x_box_w, Gx.x_box_h);
        }
      }
      function scale_base(plot, mode, xxmin, xxmax, xlab, ylab) {
        var Mx = plot._Mx;
        var Gx = plot._Gx;
        var load = mode.get_data === true;
        Gx.panxmin = 1;
        Gx.panxmax = -1;
        Gx.panymin = 1;
        Gx.panymax = -1;
        var xmin = xxmin;
        var xmax = xxmax;
        var noxmin = xmin === undefined;
        var noxmax = xmax === undefined;
        if (Gx.lyr.length === 0) {
          Gx.panxmin = -1;
          Gx.panxmax = 1;
          Gx.panymin = -1;
          Gx.panymax = 1;
        } else {
          if (xlab === undefined) {
            Gx.xlab = Gx.lyr[0].xlab;
          }
          if (ylab === undefined) {
            Gx.ylab = Gx.lyr[0].ylab;
          }
          for (var n = 0;n < Gx.lyr.length;n++) {
            if (noxmin) {
              xmin = Gx.lyr[n].xmin;
            }
            if (noxmax) {
              xmax = Gx.lyr[n].xmax;
            }
            if (Gx.xlab !== Gx.lyr[n].xlab) {
              Gx.xlab = 0;
            }
            if (Gx.ylab !== Gx.lyr[n].ylab) {
              Gx.ylab = 0;
            }
            if (load) {
              Gx.lyr[n].get_data(xmin, xmax);
            }
            if (Gx.autox > 0 || Gx.autoy > 0) {
              while (xmin < xmax) {
                Gx.lyr[n].get_data(xmin, xmax);
                var npts = Gx.lyr[n].prep(xmin, xmax);
                if (Gx.all && Gx.expand) {
                  if (Gx.lyr[n].size === 0) {
                    xmin = xmax;
                  } else {
                    if (Gx.index) {
                      xmin = xmin + npts;
                    } else {
                      if (Gx.lyr[n].xdelta >= 0) {
                        xmin = xmin + Gx.lyr[n].size * Gx.lyr[n].xdelta;
                      } else {
                        xmax = xmax + Gx.lyr[n].size * Gx.lyr[n].xdelta;
                      }
                    }
                  }
                } else {
                  xmin = xmax;
                }
              }
            } else {
              Gx.lyr[n].prep(1, -1);
            }
          }
        }
        var xran = Gx.panxmax - Gx.panxmin;
        if (xran < 0) {
          Gx.panxmax = Gx.panxmin;
          Gx.panxmin = Gx.panxmax + xran;
          xran = -xran;
        }
        if (xran <= 1E-20) {
          Gx.panxmin = Gx.panxmin - 1;
          Gx.panxmax = Gx.panxmax + 1;
        }
        if ((Gx.autox & 1) !== 0 && noxmin) {
          Mx.stk[0].xmin = Gx.panxmin;
        }
        if ((Gx.autox & 2) !== 0 && noxmax) {
          Mx.stk[0].xmax = Gx.panxmax;
          if (!(Gx.all || Gx.xdata)) {
            for (var n = 0;n < Gx.lyr.length;n++) {
              xmax = Math.min(Gx.lyr[n].xmax, Mx.stk[0].xmax);
              var dpts = Math.abs((xmax - Gx.lyr[n].xmin) / Gx.lyr[n].xdelta) - Gx.bufmax + 1;
              if (dpts > 0) {
                Mx.stk[0].xmax = xmax - dpts * Math.abs(Gx.lyr[n].xdelta);
              }
            }
          }
        }
        if ((Gx.autoy & 1) !== 0) {
          Mx.stk[0].ymin = Gx.panymin;
        }
        if ((Gx.autoy & 2) !== 0) {
          Mx.stk[0].ymax = Gx.panymax;
        }
      }
      function pixel_to_real(plot, xpos, ypos) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        var ret = mx.pixel_to_real(Mx, xpos, ypos);
        if (Gx.index) {
          ret.x = ret.x * Gx.xdelta;
        }
        return ret;
      }
      function coordsInRectangle(x, y, rect_x, rect_y, rect_width, rect_height) {
        return x >= rect_x && (x <= rect_x + rect_width && (y >= rect_y && y <= rect_y + rect_height));
      }
      function coordsInTriangle(x, y, tri_x1, tri_y1, tri_x2, tri_y2, tri_x3, tri_y3) {
        var v0 = [tri_x3 - tri_x1, tri_y3 - tri_y1];
        var v1 = [tri_x2 - tri_x1, tri_y2 - tri_y1];
        var v2 = [x - tri_x1, y - tri_y1];
        var dot00 = v0[0] * v0[0] + v0[1] * v0[1];
        var dot01 = v0[0] * v1[0] + v0[1] * v1[1];
        var dot02 = v0[0] * v2[0] + v0[1] * v2[1];
        var dot11 = v1[0] * v1[0] + v1[1] * v1[1];
        var dot12 = v1[0] * v2[0] + v1[1] * v2[1];
        var inv_denom = 1 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * inv_denom;
        var v = (dot00 * dot12 - dot01 * dot02) * inv_denom;
        return u >= 0 && (v >= 0 && u + v < 1);
      }
      function inPanRegion(plot, coord) {
        var inPanRegion = false;
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        var x = 0;
        var y = 0;
        if (coord === undefined) {
          x = Mx.xpos;
          y = Mx.ypos;
          if (!plot.mouseOnCanvas) {
            return false;
          }
        } else {
          x = coord.x;
          y = coord.y;
        }
        var command = " ";
        if (!Gx.pan) {
          return false;
        }
        var outside_right_border = x > Mx.r;
        var above_top_border = y <= Gx.pt + Gx.pthk + 2;
        var below_bottom_border = y > Gx.pt - 2;
        var between_top_and_bottom = y >= Mx.t && y <= Mx.b;
        var between_left_and_right = x >= Gx.pl && x <= Gx.pr;
        var has_bottom_scrollbar = Gx.show_readout || Gx.x_scrollbar_location === "bottom";
        if (outside_right_border && between_top_and_bottom) {
          command = "YPAN";
          if (Gx.lg_colorbar && Gx.lyr[0].hcb["class"] === 2) {
            var right_of_colorbar = x > Mx.r + 100;
            if (right_of_colorbar) {
              inPanRegion = true;
            } else {
              inPanRegion = false;
            }
          } else {
            Mx.xpos = Gx.pyl + m.trunc(Gx.pthk / 2);
            inPanRegion = true;
          }
        } else {
          if (has_bottom_scrollbar && (between_left_and_right && below_bottom_border)) {
            command = "XPAN";
            Mx.ypos = Gx.pt + m.trunc(Gx.pthk / 2);
            inPanRegion = true;
          } else {
            if (!has_bottom_scrollbar && (between_left_and_right && above_top_border)) {
              command = "XPAN";
              Mx.ypos = Gx.pt + m.trunc(Gx.pthk / 2);
              inPanRegion = true;
            }
          }
        }
        return{inPanRegion:inPanRegion, command:command};
      }
      function inPanCenterRegion(plot) {
        var inCenterRegion = false;
        var Mx = plot._Mx;
        var x = Mx.xpos;
        var y = Mx.ypos;
        var th = Mx.text_h;
        var tw = Mx.text_w;
        var command = " ";
        if (x < Mx.l - tw && (y <= Mx.b && y >= Mx.t)) {
          command = "YCENTER";
          inCenterRegion = true;
        } else {
          if (y > Mx.b + m.trunc(0.5 * tw) && (y <= Mx.b + m.trunc(m.trunc(3 * th) / 2) && (x >= Mx.l && x <= Mx.r))) {
            command = "XCENTER";
            inCenterRegion = true;
          }
        }
        return{inCenterRegion:inCenterRegion, command:command};
      }
      function onScrollbar(position, scrollbar) {
        var s1;
        var sw;
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
        var scrollReal2PixOut = mx.scroll_real2pix(scrollbar);
        s1 = scrollReal2PixOut.s1;
        sw = scrollReal2PixOut.sw;
        if (s >= s1 && s <= s1 + sw) {
          return true;
        } else {
          return false;
        }
      }
      function middleClickScrollMenuAction(plot, action, direction) {
        var Mx = plot._Mx;
        var scrollbar;
        if (direction === "XPAN") {
          scrollbar = Mx.scrollbar_x;
        } else {
          if (direction === "YPAN") {
            scrollbar = Mx.scrollbar_y;
          }
        }
        scrollbar.action = action;
        scrollbar.step = 0.1 * scrollbar.srange;
        scrollbar.page = 9 * scrollbar.step;
        scrollbar.scale = 2;
        mx.scroll(Mx, scrollbar, mx.XW_COMMAND, undefined, scrollbar);
        updateViewbox(plot, scrollbar.smin, scrollbar.smin + scrollbar.srange, direction.slice(0, 1));
        this.inPan = true;
        var evt = document.createEvent("Event");
        if (direction === "XPAN") {
          evt.initEvent("xpan", true, true);
        } else {
          if (direction === "YPAN") {
            evt.initEvent("ypan", true, true);
          }
        }
        evt.level = Mx.level;
        evt.xmin = Mx.stk[Mx.level].xmin;
        evt.ymin = Mx.stk[Mx.level].ymin;
        evt.xmax = Mx.stk[Mx.level].xmax;
        evt.ymax = Mx.stk[Mx.level].ymax;
        mx.dispatchEvent(Mx, evt);
        this.inPan = false;
      }
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
        } else {
          if (axis === "Y") {
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
      }
      module.exports = sigplot;
    })();
  }, {"./bluefile":2, "./common":3, "./m":4, "./matfile":5, "./mx":6, "./sigplot.layer1d":8, "./sigplot.layer2d":9, "spin":11}], 8:[function(require, module, exports) {
    (function() {
      var m = require("./m");
      var mx = require("./mx");
      var Layer1D = function(plot) {
        this.plot = plot;
        this.xbuf = undefined;
        this.ybuf = undefined;
        this.offset = 0;
        this.xstart = 0;
        this.xdelta = 0;
        this.imin = 0;
        this.xmin = 0;
        this.xmax = 0;
        this.name = "";
        this.cx = false;
        this.hcb = undefined;
        this.size = 0;
        this.display = true;
        this.color = 0;
        this.line = 3;
        this.thick = 1;
        this.symbol = 0;
        this.radius = 3;
        this.skip = 0;
        this.xsub = 0;
        this.ysub = 0;
        this.xdata = false;
        this.modified = false;
        this.opacity = 1;
        this.preferred_origin = 1;
        this.pointbufsize = 0;
        this.xptr = null;
        this.yptr = null;
        this.xpoint = null;
        this.ypoint = null;
        this.options = {};
      };
      Layer1D.prototype = {init:function(hcb, options) {
        var Gx = this.plot._Gx;
        this.hcb = hcb;
        this.hcb.buf_type = "D";
        this.offset = 0;
        this.size = 0;
        this.xbufn = 0;
        this.ybufn = 0;
        if (!this.hcb.pipe) {
          if (hcb["class"] === 2) {
            m.force1000(hcb);
            this.size = hcb.subsize;
          } else {
            this.size = hcb.size;
          }
        } else {
          if (hcb["class"] === 2) {
            m.force1000(hcb);
            this.size = hcb.subsize;
          }
        }
        if (options.framesize) {
          this.size = options.framesize;
        }
        if (this.hcb.pipe && !this.size) {
          throw "1D layer could not determine appropriate size for pipe, use framesize option";
        }
        if (hcb["class"] <= 2) {
          this.xsub = -1;
          this.ysub = 1;
          this.cx = hcb.format[0] === "C";
        } else {
        }
        this.skip = 1;
        if (this.cx) {
          this.skip = 2;
        }
        this.xstart = hcb.xstart;
        this.xdelta = hcb.xdelta;
        var d = hcb.xstart + hcb.xdelta * (this.size - 1);
        this.xmin = Math.min(hcb.xstart, d);
        this.xmax = Math.max(hcb.xstart, d);
        this.xlab = hcb.xunits;
        this.ylab = hcb.yunits;
        if (this.hcb.pipe) {
          this.drawmode = "scrolling";
          this.position = 0;
          this.tle = options.tl;
          this.ybufn = this.size * Math.max(this.skip * m.PointArray.BYTES_PER_ELEMENT, m.PointArray.BYTES_PER_ELEMENT);
          this.ybuf = new ArrayBuffer(this.ybufn);
          var self = this;
          m.addPipeWriteListener(this.hcb, function() {
            self._onpipewrite();
          });
        }
      }, _onpipewrite:function() {
        var ybuf = new m.PointArray(this.ybuf);
        var tle = this.tle;
        if (tle === undefined) {
          tle = Math.floor(m.pavail(this.hcb)) / this.hcb.spa;
        } else {
          if (m.pavail(this.hcb) < tle * this.hcb.spa) {
            return;
          }
        }
        var tl = tle * this.hcb.spa;
        if (this.drawmode === "lefttoright") {
          this.position = 0;
          ybuf.set(ybuf.subarray(0, this.size - tl), tl);
        } else {
          if (this.drawmode === "righttoleft") {
            this.position = this.size - tle;
            ybuf.set(ybuf.subarray(tl), 0);
          } else {
            if (this.drawmode === "scrolling") {
            } else {
              throw "Invalid draw mode";
            }
          }
        }
        tle = Math.min(tle, this.size - this.position);
        var ngot = m.grabx(this.hcb, ybuf, tle * this.hcb.spa, this.position * this.hcb.spa);
        if (ngot === 0) {
          return;
        }
        this.position = (this.position + tle) % this.size;
        if (this.plot._Gx.autol !== 0) {
          this.plot.rescale();
        }
      }, get_data:function(xmin, xmax) {
        var Gx = this.plot._Gx;
        var HCB = this.hcb;
        var skip = this.skip;
        var size;
        if (HCB["class"] === 2) {
          size = HCB.subsize;
        } else {
          size = HCB.size;
        }
        var imin = 0;
        var imax = 0;
        if (Gx.index) {
          imin = Math.floor(xmin);
          imax = Math.floor(xmax + 0.5);
        } else {
          if (HCB.xdelta >= 0) {
            imin = Math.floor((xmin - HCB.xstart) / HCB.xdelta) - 1;
            imax = Math.floor((xmax - HCB.xstart) / HCB.xdelta + 0.5);
          } else {
            imin = Math.floor((xmax - HCB.xstart) / HCB.xdelta) - 1;
            imax = Math.floor((xmin - HCB.xstart) / HCB.xdelta + 0.5);
          }
        }
        imin = Math.max(0, imin);
        imax = Math.min(size, imax);
        var npts = Math.max(0, Math.min(imax - imin + 1, Gx.bufmax));
        if (HCB.xdelta < 0) {
          imin = imax - npts + 1;
        }
        if (imin >= this.imin && (imin + npts <= this.imin + this.size && this.ybuf !== undefined)) {
        } else {
          if (this.modified) {
          } else {
            if (HCB["class"] <= 2) {
              var start = this.offset + imin;
              var skip = this.skip;
              this.ybufn = npts * Math.max(skip * m.PointArray.BYTES_PER_ELEMENT, m.PointArray.BYTES_PER_ELEMENT);
              if (this.ybuf === undefined || this.ybuf.byteLength < this.ybufn) {
                this.ybuf = new ArrayBuffer(this.ybufn);
              }
              var ybuf = new m.PointArray(this.ybuf);
              var ngot = m.grab(HCB, ybuf, start, npts);
              this.imin = imin;
              this.xstart = HCB.xstart + imin * this.xdelta;
              this.size = ngot;
            } else {
            }
          }
        }
      }, change_settings:function(settings) {
        if (settings.index !== undefined) {
          if (settings.index) {
            this.xstart = 1;
            this.xdelta = 1;
            this.xmin = 1;
            this.xmax = this.size;
          } else {
            this.xstart = this.hcb.xstart + this.imin * this.xdelta;
            this.xdelta = this.hcb.xdelta;
            var d = this.hcb.xstart + this.hcb.xdelta * (this.size - 1);
            this.xmin = Math.min(this.hcb.xstart, d);
            this.xmax = Math.max(this.hcb.xstart, d);
          }
        }
        if (settings.drawmode !== undefined) {
          this.drawmode = settings.drawmode;
          this.position = 0;
          this.ybufn = this.size * Math.max(this.skip * m.PointArray.BYTES_PER_ELEMENT, m.PointArray.BYTES_PER_ELEMENT);
          this.ybuf = new ArrayBuffer(this.ybufn);
        }
      }, reload:function(data, hdrmod) {
        if (this.hcb.pipe) {
          throw "reload cannot be used with pipe, use push instead";
        }
        var axis_change = this.hcb.dview.length !== data.length || hdrmod;
        if (hdrmod) {
          for (var k in hdrmod) {
            this.hcb[k] = hdrmod[k];
            if (k === "xstart" || k === "xdelta") {
              axis_change = true;
            }
          }
        }
        this.hcb.setData(data);
        this.imin = 0;
        this.xstart = undefined;
        this.size = 0;
        var xmin = this.xmin;
        var xmax = this.xmax;
        if (axis_change) {
          if (this.hcb["class"] === 2) {
            m.force1000(this.hcb);
          }
          var d = this.hcb.xstart + this.hcb.xdelta * (this.hcb.size - 1);
          this.xmin = Math.min(this.hcb.xstart, d);
          this.xmax = Math.max(this.hcb.xstart, d);
          this.xdelta = this.hcb.xdelta;
          this.xstart = this.hcb.xstart;
          xmin = undefined;
          xmax = undefined;
        }
        return{xmin:xmin, xmax:xmax};
      }, push:function(data, hdrmod, sync) {
        if (hdrmod) {
          for (var k in hdrmod) {
            this.hcb[k] = hdrmod[k];
            if (k === "type") {
              this.hcb["class"] = hdrmod[k] / 1E3;
            }
          }
          if (hdrmod.subsize) {
            if (this.hcb["class"] === 2) {
              m.force1000(this.hcb);
              this.size = this.hcb.subsize;
              this.position = null;
              this.ybufn = this.size * Math.max(this.skip * m.PointArray.BYTES_PER_ELEMENT, m.PointArray.BYTES_PER_ELEMENT);
              this.ybuf = new ArrayBuffer(this.ybufn);
            }
          }
          var d = this.hcb.xstart + this.hcb.xdelta * (this.hcb.size - 1);
          this.xmin = this.hcb.xmin || Math.min(this.hcb.xstart, d);
          this.xmax = this.hcb.xmax || Math.max(this.hcb.xstart, d);
          this.xdelta = this.hcb.xdelta;
          this.xstart = this.hcb.xstart;
        }
        if (data.length > 0) {
          m.filad(this.hcb, data, sync);
        }
        return hdrmod ? true : false;
      }, prep:function(xmin, xmax) {
        var Gx = this.plot._Gx;
        var Mx = this.plot._Mx;
        var npts = Math.ceil(this.size);
        var skip = this.skip;
        if (npts === 0) {
          return{num:0, start:0, end:0};
        }
        if (npts * m.PointArray.BYTES_PER_ELEMENT > this.pointbufsize) {
          this.pointbufsize = npts * m.PointArray.BYTES_PER_ELEMENT;
          this.xptr = new ArrayBuffer(this.pointbufsize);
          this.yptr = new ArrayBuffer(this.pointbufsize);
          this.xpoint = new m.PointArray(this.xptr);
          this.ypoint = new m.PointArray(this.yptr);
        }
        var dbuf = new m.PointArray(this.ybuf);
        var qmin = this.xmin;
        var qmax = this.xmax;
        var n1, n2;
        var mxmn;
        if (Gx.cmode === 5 || this.xsub > 0) {
          if (npts <= 0) {
            qmin = Gx.panxmin;
            qmax = Gx.panxmax;
          } else {
            if (Gx.cmode !== 5) {
              this.xpoint = new m.PointArray(this.xbuf);
            } else {
              if (this.cx) {
                m.vmov(dbuf, skip, this.xpoint, 1, npts);
              } else {
                if (this.line !== 0) {
                  mxmn = m.vmxmn(dbuf, npts);
                  this.xpoint[0] = mxmn.smax;
                  this.xpoint[1] = mxmn.smin;
                  n1 = 0;
                  n2 = 2;
                  npts = 2;
                } else {
                  this.xpoint = dbuf;
                }
              }
            }
          }
          if (npts > 0) {
            mxmn = m.vmxmn(this.xpoint, npts);
            qmax = mxmn.smax;
            qmin = mxmn.smin;
            n1 = 0;
            n2 = npts;
          }
        } else {
          if (npts > 0) {
            var xstart = this.xstart;
            var xdelta = this.xdelta;
            var d = npts;
            if (Gx.index) {
              n1 = 0;
              n2 = npts - 1;
            } else {
              if (xdelta >= 0) {
                n1 = Math.max(1, Math.min(d, Math.round((xmin - xstart) / xdelta))) - 1;
                n2 = Math.max(1, Math.min(d, Math.round((xmax - xstart) / xdelta) + 2)) - 1;
              } else {
                n1 = Math.max(1, Math.min(d, Math.round((xmax - xstart) / xdelta) - 1)) - 1;
                n2 = Math.max(1, Math.min(d, Math.round((xmin - xstart) / xdelta) + 2)) - 1;
              }
            }
            npts = n2 - n1 + 1;
            if (npts < 0) {
              m.log.debug("Nothing to plot");
              npts = 0;
            }
            dbuf = (new m.PointArray(this.ybuf)).subarray(n1 * skip);
            xstart = xstart + xdelta * n1;
            for (var i = 0;i < npts;i++) {
              if (Gx.index) {
                this.xpoint[i] = this.imin + i + 1;
              } else {
                this.xpoint[i] = xstart + i * xdelta;
              }
            }
          }
        }
        if (Gx.panxmin > Gx.panxmax) {
          Gx.panxmin = qmin;
          Gx.panxmax = qmax;
        } else {
          Gx.panxmin = Math.min(Gx.panxmin, qmin);
          Gx.panxmax = Math.max(Gx.panxmax, qmax);
        }
        if (npts <= 0) {
          m.log.debug("Nothing to plot");
          return{num:npts, start:n1, end:n2};
        }
        if (this.cx) {
          if (Gx.cmode === 1) {
            m.cvmag(dbuf, this.ypoint, npts);
          } else {
            if (Gx.cmode === 2) {
              if (Gx.plab === 25) {
                m.cvpha(dbuf, this.ypoint, npts);
                m.vsmul(this.ypoint, 1 / (2 * Math.PI), this.ypoint, npts);
              } else {
                if (Gx.plab !== 24) {
                  m.cvpha(dbuf, this.ypoint, npts);
                } else {
                  m.cvphad(dbuf, this.ypoint, npts);
                }
              }
            } else {
              if (Gx.cmode === 3) {
                m.vmov(dbuf, skip, this.ypoint, 1, npts);
              } else {
                if (Gx.cmode >= 6) {
                  m.cvmag2(dbuf, this.ypoint, npts);
                } else {
                  if (Gx.cmode >= 4) {
                    m.vmov(dbuf.subarray(1), skip, this.ypoint, 1, npts);
                  }
                }
              }
            }
          }
        } else {
          if (Gx.cmode === 5) {
            m.vfill(this.ypoint, 0, npts);
          } else {
            if (Gx.cmode === 1 || Gx.cmode >= 6) {
              for (var i = 0;i < npts;i++) {
                this.ypoint[i] = Math.abs(dbuf[i]);
              }
            } else {
              for (var i = 0;i < npts;i++) {
                this.ypoint[i] = dbuf[i];
              }
            }
          }
        }
        if (Gx.cmode >= 6) {
          m.vlog10(this.ypoint, Gx.dbmin, this.ypoint);
          var dbscale = 10;
          if (Gx.cmode === 7) {
            dbscale = 20;
          }
          if (Gx.lyr.length > 0 && Gx.lyr[0].cx) {
            dbscale = dbscale / 2;
          }
          m.vsmul(this.ypoint, dbscale, this.ypoint);
        }
        mxmn = m.vmxmn(this.ypoint, npts);
        qmax = mxmn.smax;
        qmin = mxmn.smin;
        var yran = qmax - qmin;
        if (yran < 0) {
          qmax = qmin;
          qmin = qmax + yran;
          yran = -yran;
        }
        if (yran <= 1E-20) {
          qmin = qmin - 1;
          qmax = qmax + 1;
        } else {
          qmin = qmin - 0.02 * yran;
          qmax = qmax + 0.02 * yran;
        }
        if (Mx.level === 0) {
          if (Gx.panymin > Gx.panymax) {
            Gx.panymin = qmin;
            Gx.panymax = qmax;
          } else {
            Gx.panymin = Math.min(Gx.panymin, qmin);
            Gx.panymax = Math.max(Gx.panymax, qmax);
          }
          if (Gx.autol > 1) {
            var fac = 1 / Math.max(Gx.autol, 1);
            Gx.panymin = Gx.panymin * fac + Mx.stk[0].ymin * (1 - fac);
            Gx.panymax = Gx.panymax * fac + Mx.stk[0].ymax * (1 - fac);
          }
        }
        return{num:npts, start:n1, end:n2};
      }, draw:function() {
        var Mx = this.plot._Mx;
        var Gx = this.plot._Gx;
        var ic = this.color;
        var symbol = this.symbol;
        var rad = this.radius;
        var mask = 0;
        var line = 0;
        var traceoptions = {};
        traceoptions.fillStyle = Gx.fillStyle;
        if (this.options) {
          traceoptions.highlight = this.options.highlight;
          traceoptions.noclip = this.options.noclip;
        }
        if (this.line === 0) {
          line = 0;
        } else {
          line = 1;
          if (this.thick > 0) {
            line = this.thick;
          } else {
            if (this.thick < 0) {
              line = Math.abs(this.thick);
              traceoptions.dashed = true;
            }
          }
          if (this.line === 1) {
            traceoptions.vertsym = true;
          }
          if (this.line === 2) {
            traceoptions.horzsym = true;
          }
          if (this.line === 4) {
            traceoptions.horzsym = true;
            traceoptions.vertsym = true;
          }
        }
        var segment = Gx.segment && (Gx.cmode !== 5 && (this.xsub > 0 && mask === 0));
        var xdelta = this.xdelta;
        var xmin;
        var xmax;
        if (this.xdata) {
          xmin = this.xmin;
          xmax = this.xmax;
        } else {
          xmin = Math.max(this.xmin, Mx.stk[Mx.level].xmin);
          xmax = Math.min(this.xmax, Mx.stk[Mx.level].xmax);
          if (xmin >= xmax) {
            Gx.panxmin = Math.min(Gx.panxmin, this.xmin);
            Gx.panxmax = Math.max(Gx.panxmax, this.xmax);
          }
        }
        if (!Gx.all) {
          var xran = (Gx.bufmax - 1) * xdelta;
          if (xran >= -0) {
            xmax = Math.min(xmax, xmin + xran);
          } else {
            xmin = Math.max(xmin, xmax + xran);
          }
        }
        if (line === 0 && symbol === 0) {
          return;
        }
        while (xmin < xmax) {
          if (!this.hcb.pipe) {
            this.get_data(xmin, xmax);
          }
          var pts = this.prep(xmin, xmax);
          if (pts.num > 0) {
            if (segment) {
            } else {
              mx.trace(Mx, ic, new m.PointArray(this.xptr), new m.PointArray(this.yptr), pts.num, pts.start, 1, line, symbol, rad, traceoptions);
            }
          }
          if (Gx.all) {
            if (this.size === 0) {
              xmin = xmax;
            } else {
              if (Gx.index) {
                xmin = xmin + pts.num;
              } else {
                if (xdelta >= 0) {
                  xmin = xmin + this.size * xdelta;
                } else {
                  xmax = xmax + this.size * xdelta;
                }
              }
            }
          } else {
            xmin = xmax;
          }
        }
        if (this.position && this.drawmode === "scrolling") {
          var pnt = mx.real_to_pixel(Mx, this.position * this.xdelta, 0);
          if (pnt.x > Mx.l && pnt.x < Mx.r) {
            mx.draw_line(Mx, "white", pnt.x, Mx.t, pnt.x, Mx.b);
          }
        }
      }, add_highlight:function(highlight) {
        if (!this.options.highlight) {
          this.options.highlight = [];
        }
        var xmin = highlight.xstart;
        var xmax = highlight.xend;
        var min_nan = isNaN(xmin);
        var max_nan = isNaN(xmax);
        if (min_nan === true || (xmin === null || xmin === undefined)) {
          this.options.highlight = [];
        }
        if (max_nan === true || (xmax === null || xmax === undefined)) {
          this.options.highlight = [];
        }
        if (highlight instanceof Array) {
          this.options.highlight.push.apply(this.options.highlight, highlight);
        } else {
          this.options.highlight.push(highlight);
        }
        this.plot.refresh();
      }, remove_highlight:function(highlight) {
        if (this.options.highlight) {
          var i = this.options.highlight.length;
          while (i--) {
            if (highlight === this.options.highlight[i] || highlight === this.options.highlight[i].id) {
              this.options.highlight.splice(i, 1);
            }
          }
          this.plot.refresh();
        }
      }, get_highlights:function() {
        if (this.options.highlight) {
          return this.options.highlight.slice(0);
        } else {
          return[];
        }
      }, clear_highlights:function() {
        if (this.options.highlight) {
          this.options.highlight = undefined;
          this.plot.refresh();
        }
      }};
      var mixc = [0, 53, 27, 80, 13, 40, 67, 93, 7, 60, 33, 87, 20, 47, 73, 100];
      Layer1D.overlay = function(plot, hcb, layerOptions) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        if (hcb["class"] === 2) {
          m.force1000(hcb);
        }
        hcb.buf_type = "D";
        var n1 = 0;
        var n2 = 1;
        if (hcb["class"] === 2 && hcb.size > 0) {
          var num_rows = hcb.size / hcb.subsize;
          n2 = Math.min(num_rows, 16 - Gx.lyr.length);
        }
        var layer_name_override = layerOptions["name"];
        delete layerOptions["name"];
        for (var i = n1;i < n2;i++) {
          var layer = new Layer1D(plot);
          layer.init(hcb, layerOptions);
          var n = Gx.lyr.length % mixc.length;
          layer.color = mx.getcolor(Mx, m.Mc.colormap[3].colors, mixc[n]);
          if (hcb["class"] === 2) {
            if (layer_name_override !== undefined) {
              if (Array.isArray(layer_name_override)) {
                layer.name = layer_name_override[i];
              } else {
                layer.name = layer_name_override;
                layer.name = layer.name + "." + mx.pad((i + 1).toString(), 3, "0");
              }
            }
            if (!layer.name) {
              if (hcb.file_name) {
                layer.name = m.trim_name(hcb.file_name);
              } else {
                layer.name = "layer_" + Gx.lyr.length;
              }
              layer.name = layer.name + "." + mx.pad((i + 1).toString(), 3, "0");
            }
            layer.offset = i * hcb.subsize;
          } else {
            if (layer_name_override !== undefined) {
              layer.name = layer_name_override;
            } else {
              if (hcb.file_name) {
                layer.name = m.trim_name(hcb.file_name);
              } else {
                layer.name = "layer_" + Gx.lyr.length;
              }
            }
            layer.offset = 0;
          }
          for (var layerOption in layerOptions) {
            if (layer[layerOption] !== undefined) {
              layer[layerOption] = layerOptions[layerOption];
            }
          }
          plot.add_layer(layer);
        }
      };
      module.exports = Layer1D;
    })();
  }, {"./m":4, "./mx":6}], 9:[function(require, module, exports) {
    (function() {
      var m = require("./m");
      var mx = require("./mx");
      var Layer2D = function(plot) {
        this.plot = plot;
        this.offset = 0;
        this.xstart = 0;
        this.xdelta = 0;
        this.ystart = 0;
        this.ydelta = 0;
        this.imin = 0;
        this.xmin = 0;
        this.xmax = 0;
        this.name = "";
        this.cx = false;
        this.hcb = undefined;
        this.display = true;
        this.color = 0;
        this.line = 3;
        this.thick = 1;
        this.symbol = 0;
        this.radius = 3;
        this.skip = 0;
        this.xsub = 0;
        this.ysub = 0;
        this.xdata = false;
        this.modified = false;
        this.preferred_origin = 4;
        this.opacity = 1;
        this.lpb = undefined;
        this.yc = 1;
        this.options = {};
      };
      Layer2D.prototype = {init:function(hcb) {
        var Gx = this.plot._Gx;
        var Mx = this.plot._Mx;
        this.hcb = hcb;
        this.hcb.buf_type = "D";
        if (this.hcb.pipe) {
          var self = this;
          this.position = 0;
          this.frame = 0;
          this.lps = this.hcb.lps || Math.ceil(Math.max(1, Mx.b - Mx.t));
          m.addPipeWriteListener(this.hcb, function() {
            self._onpipewrite();
          });
        } else {
          this.lps = this.hcb.lps || Math.ceil(hcb.size);
        }
        this.offset = 0;
        this.xbufn = 0;
        this.ybufn = 0;
        this.drawmode = "scrolling";
        if (hcb["class"] <= 2) {
          this.xsub = -1;
          this.ysub = 1;
          this.cx = hcb.format[0] === "C";
        } else {
        }
        this.skip = 1;
        if (this.cx) {
          this.skip = 2;
        }
        if (Gx.index) {
          this.xstart = 1;
          this.xdelta = 1;
          this.xmin = 1;
          this.xmax = hcb.subsize;
          this.ystart = 1;
          this.ydelta = 1;
          this.ymin = 1;
          this.ymax = this.size;
        } else {
          this.xstart = hcb.xstart;
          this.xdelta = hcb.xdelta;
          var d = hcb.xstart + hcb.xdelta * (hcb.subsize - 1);
          this.xmin = this.hcb.xmin || Math.min(hcb.xstart, d);
          this.xmax = this.hcb.xmax || Math.max(hcb.xstart, d);
          this.ystart = hcb.ystart;
          this.ydelta = hcb.ydelta;
          var d = hcb.ystart + hcb.ydelta * (this.lps - 1);
          this.ymin = this.hcb.ymin || Math.min(hcb.ystart, d);
          this.ymax = this.hcb.ymax || Math.max(hcb.ystart, d);
        }
        this.xframe = this.hcb.subsize;
        this.yframe = this.lps * this.hcb.subsize / this.xframe;
        if (this.lpb === 0) {
          this.lpb = this.yframe;
        }
        if (!this.lpb || this.lpb <= 0) {
          this.lpb = 16;
        }
        this.lpb = Math.max(1, this.lpb / this.yc) * this.yc;
        this.xlab = hcb.xunits;
        this.ylab = hcb.yunits;
      }, _onpipewrite:function() {
        var Gx = this.plot._Gx;
        var Mx = this.plot._Mx;
        if (m.pavail(this.hcb) < this.hcb.subsize * this.hcb.spa) {
          return;
        }
        if (this.drawmode !== "scrolling") {
          this.hcb.ystart += this.hcb.ydelta;
          this.ystart = this.hcb.ystart;
          this.ymin = this.hcb.ystart - this.hcb.ydelta * this.lps;
          this.ymax = this.hcb.ystart;
        }
        if (this.drawmode === "falling") {
          this.position = 0;
          if (this.img) {
            mx.shift_image_rows(Mx, this.img, 1);
          }
        } else {
          if (this.drawmode === "rising") {
            this.position = this.lps - 1;
            if (this.img) {
              mx.shift_image_rows(Mx, this.img, -1);
            }
          } else {
            if (this.drawmode === "scrolling") {
              var ylength = Math.abs(this.ymax - this.ymin);
              this.ystart = 0;
              this.ymin = 0;
              this.ymax = ylength;
              if (this.position >= this.lps) {
                this.position = 0;
              }
            } else {
              throw "Invalid draw mode";
            }
          }
        }
        if (!this.buf) {
          return;
        }
        var ngot = m.grabx(this.hcb, this.buf, this.hcb.subsize * this.hcb.spa);
        if (ngot === 0) {
          m.log.error("Internal error");
          return;
        }
        var zpoint = new m.PointArray(this.hcb.subsize);
        if (this.cx) {
          if (Gx.cmode === 1) {
            m.cvmag(this.buf, zpoint, zpoint.length);
          } else {
            if (Gx.cmode === 2) {
              if (Gx.plab === 25) {
                m.cvpha(this.buf, zpoint, zpoint.length);
                m.vsmul(zpoint, 1 / (2 * Math.PI), zpoint, zpoint.length);
              } else {
                if (Gx.plab !== 24) {
                  m.cvpha(this.buf, zpoint, zpoint.length);
                } else {
                  m.cvphad(this.buf, zpoint, zpoint.length);
                }
              }
            } else {
              if (Gx.cmode === 3) {
                m.vmov(this.buf, this.skip, zpoint, 1, zpoint.length);
              } else {
                if (Gx.cmode === 4) {
                  m.vmov(this.buf.subarray(1), this.skip, zpoint, 1, zpoint.length);
                } else {
                  if (Gx.cmode === 5) {
                    m.vfill(zpoint, 0, zpoint.length);
                  } else {
                    if (Gx.cmode === 6) {
                      m.cvmag2logscale(this.buf, Gx.dbmin, 10, zpoint);
                    } else {
                      if (Gx.cmode === 7) {
                        m.cvmag2logscale(this.buf, Gx.dbmin, 20, zpoint);
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          if (Gx.cmode === 1) {
            m.vabs(this.buf, zpoint);
          } else {
            if (Gx.cmode === 2) {
              m.vfill(zpoint, 0, zpoint.length);
            } else {
              if (Gx.cmode === 3) {
                m.vmov(this.buf, this.skip, zpoint, 1, zpoint.length);
              } else {
                if (Gx.cmode === 4) {
                  m.vfill(zpoint, 0, zpoint.length);
                } else {
                  if (Gx.cmode === 5) {
                    m.vfill(zpoint, 0, zpoint.length);
                  } else {
                    if (Gx.cmode === 6) {
                      m.vlogscale(this.buf, Gx.dbmin, 10, zpoint);
                    } else {
                      if (Gx.cmode === 7) {
                        m.vlogscale(this.buf, Gx.dbmin, 20, zpoint);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        var min = zpoint[0];
        var max = zpoint[0];
        for (var i = 0;i < zpoint.length;i++) {
          if (zpoint[i] < min) {
            min = zpoint[i];
          }
          if (zpoint[i] > max) {
            max = zpoint[i];
          }
        }
        var zmin, zmax;
        if (Gx.autol === 1) {
          zmin = min;
          zmax = max;
        } else {
          if (Gx.autol > 1) {
            var fac = 1 / Math.max(Gx.autol, 1);
            zmin = Gx.zmin * fac + min * (1 - fac);
            zmax = Gx.zmax * fac + max * (1 - fac);
          } else {
            if (Gx.autol < 0) {
              var fac = 1 / Math.max(5, 1);
              zmin = Gx.zmin * fac + min * (1 - fac);
              zmax = Gx.zmax * fac + max * (1 - fac);
            }
          }
        }
        if ((Gx.autoz & 1) !== 0) {
          Gx.zmin = zmin;
        }
        if ((Gx.autoz & 2) !== 0) {
          Gx.zmax = zmax;
        }
        if (Gx.enabled_streaming_pcut) {
          if (this.zbuf.length !== this.lps * this.hcb.subsize) {
            this.zbuf = [];
            this.zbuf = new m.PointArray(this.hcb.subsize * this.lps);
          }
          if (this.drawmode === "scrolling") {
            var start_write = this.position * this.hcb.subsize;
            var stop_write = start_write + this.hcb.subsize;
            var b = 0;
            for (var i = start_write;i < stop_write;i++) {
              this.zbuf[i] = zpoint[b];
              b++;
            }
          }
          if (this.drawmode === "falling") {
            var cut_off = (this.lps - 1) * this.hcb.subsize;
            var tmp = this.zbuf.slice(0, cut_off);
            this.zbuf = [];
            for (var i = 0;i < this.hcb.subsize;i++) {
              this.zbuf.push(zpoint[i]);
            }
            this.zbuf.push.apply(this.zbuf, tmp);
            tmp = [];
          }
          if (this.drawmode === "rising") {
            var cut_off = this.lps * this.hcb.subsize;
            var tmp = this.zbuf.slice(this.hcb.subsize, cut_off);
            this.zbuf = [];
            this.zbuf.push.apply(this.zbuf, tmp);
            for (var i = 0;i < this.hcb.subsize;i++) {
              this.zbuf.push(zpoint[i]);
            }
            tmp = [];
          }
        }
        if (this.img) {
          mx.update_image_row(Mx, this.img, zpoint, this.position, Gx.zmin, Gx.zmax, Gx.xcompression);
        }
        this.frame += 1;
        if (this.drawmode === "scrolling") {
          this.position = (this.position + 1) % this.lps;
        }
        if (Mx.level === 0) {
          Gx.panymin = this.ymin;
          Gx.panymax = this.ymax;
          Mx.stk[0].ymin = this.ymin;
          Mx.stk[0].ymax = this.ymax;
        }
      }, get_data:function() {
        var HCB = this.hcb;
        if (!this.buf) {
          if (this.hcb.pipe) {
            this.buf = this.hcb.createArray(null, 0, this.hcb.subsize * this.hcb.spa);
            this.zbuf = new m.PointArray(this.hcb.subsize);
          } else {
            this.buf = this.hcb.createArray(null, 0, this.lps * this.hcb.subsize * this.hcb.spa);
            this.zbuf = new m.PointArray(this.lps * this.hcb.subsize);
          }
        }
        if (!this.hcb.pipe) {
          m.grab(HCB, this.buf, 0, HCB.subsize);
        }
      }, get_z:function(x, y) {
        var ix = Math.floor(x / this.hcb.xdelta);
        var iy = Math.floor(y / this.hcb.ydelta);
        var zidx = iy * this.hcb.subsize + ix;
        return this.zbuf[zidx];
      }, change_settings:function(settings) {
        var Gx = this.plot._Gx;
        if (settings.cmode !== undefined) {
          this.img = undefined;
          if ((Gx.autoz & 1) !== 0) {
            Gx.zmin = undefined;
          }
          if ((Gx.autoz & 2) !== 0) {
            Gx.zmax = undefined;
          }
        }
        if (settings.zmin !== undefined || (settings.zmax !== undefined || settings.autoz !== undefined)) {
          this.img = undefined;
        }
        if (settings.cmap !== undefined) {
          this.img = undefined;
        }
        if (settings.drawmode !== undefined || (settings.xmin !== undefined || (settings.xmax !== undefined || (settings.xdelta !== undefined || settings.xstart !== undefined)))) {
          if (settings.drawmode === undefined) {
            settings.drawmode = this.drawmode;
          }
          this.drawmode = settings.drawmode;
          this.position = 0;
          this.frame = 0;
          if (this.hcb.pipe) {
            this.buf = this.hcb.createArray(null, 0, this.hcb.subsize * this.hcb.spa);
            this.zbuf = new m.PointArray(this.hcb.subsize);
          } else {
            this.buf = this.hcb.createArray(null, 0, this.lps * this.hcb.subsize * this.hcb.spa);
            this.zbuf = new m.PointArray(this.lps * this.hcb.subsize);
          }
          this.img = undefined;
          if (this.drawmode === "falling") {
            this.plot._Mx.origin = 1;
            this.preferred_origin = 1;
          } else {
            this.plot._Mx.origin = 4;
            this.preferred_origin = 4;
          }
        }
        if (settings.opacity !== undefined) {
          this.opacity = settings.opacity;
        }
      }, push:function(data, hdrmod, sync) {
        var rescale = false;
        var timestamp = null;
        if (hdrmod) {
          if (hdrmod.timestamp) {
            timestamp = hdrmod.timestamp;
            delete hdrmod["timestamp"];
          }
          if (hdrmod.subsize && hdrmod.subsize !== this.hcb.subsize) {
            this.hcb.subsize = hdrmod.subsize;
            if (this.hcb.pipe) {
              this.buf = this.hcb.createArray(null, 0, this.hcb.subsize * this.hcb.spa);
              this.zbuf = new m.PointArray(this.hcb.subsize);
            } else {
              this.buf = this.hcb.createArray(null, 0, this.lps * this.hcb.subsize * this.hcb.spa);
              this.zbuf = new m.PointArray(this.lps * this.hcb.subsize);
            }
            rescale = true;
          }
          for (var k in hdrmod) {
            if (this.hcb[k] !== hdrmod[k]) {
              this.hcb[k] = hdrmod[k];
              if (k === "type") {
                this.hcb["class"] = hdrmod[k] / 1E3;
              }
              rescale = true;
            }
          }
          if (hdrmod.lps) {
            this.lps = hdrmod.lps;
          }
          if (rescale) {
            var d = this.hcb.xstart + this.hcb.xdelta * (this.hcb.subsize - 1);
            this.xmin = Math.min(this.hcb.xstart, d);
            this.xmax = Math.max(this.hcb.xstart, d);
            this.xdelta = this.hcb.xdelta;
            this.xstart = this.hcb.xstart;
            this.ystart = this.hcb.ystart;
            this.ydelta = this.hcb.ydelta;
            var d = this.hcb.ystart + this.hcb.ydelta * (this.lps - 1);
            this.ymin = Math.min(this.hcb.ystart, d);
            this.ymax = Math.max(this.hcb.ystart, d);
          }
        }
        if (this.hcb.yunits === 1 || this.hcb.yunits === 4) {
          if (!this.hcb["timecode"] && timestamp) {
            this.hcb.timecode = m.j1970toj1950(timestamp);
            this.hcb.ystart = 0;
            rescale = true;
          } else {
          }
        }
        if (data.length > 0) {
          m.filad(this.hcb, data, sync);
        }
        return rescale;
      }, prep:function(xmin, xmax) {
        var Gx = this.plot._Gx;
        var Mx = this.plot._Mx;
        var npts = this.lps;
        var skip = this.skip;
        var qmin = this.xmin;
        var qmax = this.xmax;
        var n1, n2;
        var xsize = this.hcb.subsize;
        if (Gx.xcompression > 0) {
          xsize = Math.ceil(Mx.r - Mx.l);
        }
        this.get_data(xmin, xmax);
        if (!this.hcb.pipe) {
          if (Gx.cmode === 5 || this.xsub > 0) {
          } else {
            if (npts > 0) {
              var xstart = this.xstart;
              var xdelta = this.xdelta;
              var d = npts;
              if (Gx.index) {
                n1 = 0;
                n2 = npts - 1;
              } else {
                if (xdelta >= 0) {
                  n1 = Math.max(1, Math.min(d, Math.round((xmin - xstart) / xdelta))) - 1;
                  n2 = Math.max(1, Math.min(d, Math.round((xmax - xstart) / xdelta) + 2)) - 1;
                } else {
                  n1 = Math.max(1, Math.min(d, Math.round((xmax - xstart) / xdelta) - 1)) - 1;
                  n2 = Math.max(1, Math.min(d, Math.round((xmin - xstart) / xdelta) + 2)) - 1;
                }
              }
              npts = n2 - n1 + 1;
              if (npts < 0) {
                m.log.debug("Nothing to plot");
                npts = 0;
              }
            }
          }
          if (Gx.panxmin > Gx.panxmax) {
            Gx.panxmin = qmin;
            Gx.panxmax = qmax;
          } else {
            Gx.panxmin = Math.min(Gx.panxmin, qmin);
            Gx.panxmax = Math.max(Gx.panxmax, qmax);
          }
          if (npts <= 0) {
            m.log.debug("Nothing to plot");
            return;
          }
          if (Gx.cmode === 5 || this.ysub > 0) {
          } else {
            if (npts > 0) {
              var ystart = this.ystart;
              var ydelta = this.ydelta;
              var d = npts;
              if (Gx.index) {
                n1 = 0;
                n2 = npts - 1;
              } else {
                if (ydelta >= 0) {
                  n1 = Math.max(1, Math.min(d, Math.round((xmin - ystart) / ydelta))) - 1;
                  n2 = Math.max(1, Math.min(d, Math.round((xmax - ystart) / ydelta) + 2)) - 1;
                } else {
                  n1 = Math.max(1, Math.min(d, Math.round((xmax - ystart) / ydelta) - 1)) - 1;
                  n2 = Math.max(1, Math.min(d, Math.round((xmin - ystart) / ydelta) + 2)) - 1;
                }
              }
              npts = n2 - n1 + 1;
              if (npts < 0) {
                m.log.debug("Nothing to plot");
                npts = 0;
              }
            }
          }
          if (Gx.panymin > Gx.panxmax) {
            Gx.panymin = this.ymin;
            Gx.panymax = this.ymax;
          } else {
            Gx.panymin = Math.min(Gx.panymin, this.ymin);
            Gx.panymax = Math.max(Gx.panymax, this.ymax);
          }
          if (this.cx) {
            if (Gx.cmode === 1) {
              m.cvmag(this.buf, this.zbuf, this.zbuf.length);
            } else {
              if (Gx.cmode === 2) {
                if (Gx.plab === 25) {
                  m.cvpha(this.buf, this.zbuf, this.zbuf.length);
                  m.vsmul(this.zbuf, 1 / (2 * Math.PI), this.zbuf, this.zbuf.length);
                } else {
                  if (Gx.plab !== 24) {
                    m.cvpha(this.buf, this.zbuf, this.zbuf.length);
                  } else {
                    m.cvphad(this.buf, this.zbuf, this.zbuf.length);
                  }
                }
              } else {
                if (Gx.cmode === 3) {
                  m.vmov(this.buf, this.skip, this.zbuf, 1, this.zbuf.length);
                } else {
                  if (Gx.cmode === 4) {
                    m.vmov(this.buf.subarray(1), this.skip, this.zbuf, 1, this.zbuf.length);
                  } else {
                    if (Gx.cmode === 5) {
                      m.vfill(this.zbuf, 0, this.zbuf.length);
                    } else {
                      if (Gx.cmode === 6) {
                        m.cvmag2logscale(this.buf, Gx.dbmin, 10, this.zbuf);
                      } else {
                        if (Gx.cmode === 7) {
                          m.cvmag2logscale(this.buf, Gx.dbmin, 20, this.zbuf);
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            if (Gx.cmode === 1) {
              m.vabs(this.buf, this.zbuf);
            } else {
              if (Gx.cmode === 2) {
                m.vfill(this.zbuf, 0, this.zbuf.length);
              } else {
                if (Gx.cmode === 3) {
                  m.vmov(this.buf, this.skip, this.zbuf, 1, this.zbuf.length);
                } else {
                  if (Gx.cmode === 4) {
                    m.vfill(this.zbuf, 0, this.zbuf.length);
                  } else {
                    if (Gx.cmode === 5) {
                      m.vfill(this.zbuf, 0, this.zbuf.length);
                    } else {
                      if (Gx.cmode === 6) {
                        m.vlogscale(this.buf, Gx.dbmin, 10, this.zbuf);
                      } else {
                        if (Gx.cmode === 7) {
                          m.vlogscale(this.buf, Gx.dbmin, 20, this.zbuf);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          var zpoint = this.zbuf;
          var min = 0;
          var max = 0;
          if (Gx.autol <= 0 || this.hcb.pipe) {
            if (zpoint.length > 0) {
              min = zpoint[0];
              max = zpoint[0];
              for (var i = 0;i < zpoint.length;i++) {
                if (i / this.xframe >= this.lpb) {
                  break;
                }
                if (zpoint[i] < min) {
                  min = zpoint[i];
                }
                if (zpoint[i] > max) {
                  max = zpoint[i];
                }
              }
            }
            if ((Gx.autoz & 1) !== 0) {
              if (Gx.zmin !== undefined) {
                Gx.zmin = Math.min(Gx.zmin, min);
              } else {
                Gx.zmin = min;
              }
            }
            if ((Gx.autoz & 2) !== 0) {
              if (Gx.zmax !== undefined) {
                Gx.zmax = Math.min(Gx.zmax, max);
              } else {
                Gx.zmax = max;
              }
            }
            this.img = mx.create_image(Mx, this.zbuf, this.hcb.subsize, xsize, this.lps, Gx.zmin + Gx.zoff, Gx.zmax + Gx.zoff, Gx.xcompression);
          } else {
            var nny = this.hcb.size;
            var fac = 1 / Math.max(Gx.autol, 1);
            if (!this.img) {
              this.img = mx.create_image(Mx, this.zbuf, this.hcb.subsize, xsize, this.lps, Gx.zmin + Gx.zoff, Gx.zmax + Gx.zoff);
            }
            Gx.zmin = 0;
            Gx.zmax = 0;
            if (zpoint.length > 0) {
              for (var yy = 0;yy < nny;yy++) {
                var noff = yy * this.xframe;
                var min = zpoint[noff];
                var max = zpoint[noff];
                for (var i = 0;i < this.xframe;i++) {
                  min = Math.min(zpoint[noff + i], min);
                  max = Math.max(zpoint[noff + i], max);
                }
                if (Gx.autoz !== 2 && min !== undefined) {
                  Gx.zmin = min * fac + Gx.zmin * (1 - fac);
                }
                if (Gx.autoz !== 1 && max !== undefined) {
                  Gx.zmax = max * fac + Gx.zmax * (1 - fac);
                }
                mx.update_image_row(Mx, this.img, zpoint.subarray(noff, noff + this.xframe), yy, Gx.zmin, Gx.zmax);
              }
            }
          }
        } else {
          if (Gx.panxmin > Gx.panxmax) {
            Gx.panxmin = qmin;
            Gx.panxmax = qmax;
          } else {
            Gx.panxmin = Math.min(Gx.panxmin, qmin);
            Gx.panxmax = Math.max(Gx.panxmax, qmax);
          }
          if (Gx.panymin > Gx.panxmax) {
            Gx.panymin = this.ymin;
            Gx.panymax = this.ymax;
          } else {
            Gx.panymin = Math.min(Gx.panymin, this.ymin);
            Gx.panymax = Math.max(Gx.panymax, this.ymax);
          }
          if (!this.img) {
            if (Gx.zmin === undefined) {
              Gx.zmin = 0;
            }
            if (Gx.zmax === undefined) {
              Gx.zmax = 0;
            }
            this.img = mx.create_image(Mx, null, this.hcb.subsize, xsize, this.lps, Gx.zmin + Gx.zoff, Gx.zmax + Gx.zoff, Gx.xcompression);
          }
        }
        this.img.cmode = Gx.cmode;
        this.img.cmap = Gx.cmap;
        this.img.origin = Mx.origin;
        if (this.hcb.pipe && this.frame < this.lps) {
          var imgd = new Uint32Array(this.img);
          if (this.drawmode === "rising") {
            for (var i = 0;i < imgd.length - this.frame * xsize;i++) {
              imgd[i] = 0;
            }
          } else {
            for (var i = this.frame * xsize;i < imgd.length;i++) {
              imgd[i] = 0;
            }
          }
        }
        return npts;
      }, draw:function() {
        var Mx = this.plot._Mx;
        var Gx = this.plot._Gx;
        var HCB = this.hcb;
        if (this.hcb.pipe) {
          var lps = this.hcb.lps || Math.ceil(Math.max(1, Mx.b - Mx.t));
          if (lps !== this.lps && this.buf) {
            this.lps = lps;
            if (this.position >= this.lps) {
              this.position = 0;
            }
            var d = HCB.ystart + HCB.ydelta * (this.lps - 1);
            this.ymin = Math.min(HCB.ystart, d);
            this.ymax = Math.max(HCB.ystart, d);
            this.img = null;
            this.plot.rescale();
          }
        }
        var xmin = Math.max(this.xmin, Mx.stk[Mx.level].xmin);
        var xmax = Math.min(this.xmax, Mx.stk[Mx.level].xmax);
        if (xmin >= xmax) {
          Gx.panxmin = Math.min(Gx.panxmin, this.xmin);
          Gx.panxmax = Math.max(Gx.panxmax, this.xmax);
          return;
        }
        var ymin = Math.max(this.ymin, Mx.stk[Mx.level].ymin);
        var ymax = Math.min(this.ymax, Mx.stk[Mx.level].ymax);
        var w = Math.abs(xmax - xmin) + 1;
        var h = Math.abs(ymax - ymin) + 1;
        w = Math.floor(w / HCB.xdelta);
        h = Math.floor(h / HCB.ydelta);
        w = Math.min(w, HCB.subsize);
        h = Math.min(h, HCB.size);
        var ul = mx.real_to_pixel(Mx, xmin, ymin);
        var lr = mx.real_to_pixel(Mx, xmax, ymax);
        var iw = lr.x - ul.x;
        var ih = lr.y - ul.y;
        var rx = iw / w;
        var ry = ih / h;
        Gx.xe = Math.max(1, Math.round(rx));
        Gx.ye = Math.max(1, Math.round(ry));
        if (!this.img || (!this.buf || (Gx.cmode !== this.img.cmode || (Gx.cmap !== this.img.cmap || Mx.origin !== this.img.origin)))) {
          this.prep(xmin, xmax);
        }
        if (this.img) {
          mx.draw_image(Mx, this.img, this.xmin, this.ymin, this.xmax, this.ymax, this.opacity, Gx.rasterSmoothing);
        }
        if (this.position !== null && this.drawmode === "scrolling") {
          var pnt = mx.real_to_pixel(Mx, 0, this.position * this.ydelta);
          if (pnt.y > Mx.t && pnt.y < Mx.b) {
            mx.draw_line(Mx, "white", Mx.l, pnt.y, Mx.r, pnt.y);
          }
        }
      }};
      Layer2D.overlay = function(plot, hcb, layerOptions) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;
        hcb.buf_type = "D";
        var layer = new Layer2D(plot);
        layer.init(hcb);
        if (hcb.file_name) {
          layer.name = m.trim_name(hcb.file_name);
        } else {
          layer.name = "layer_" + Gx.lyr.length;
        }
        layer.change_settings(layerOptions);
        plot.add_layer(layer);
      };
      module.exports = Layer2D;
    })();
  }, {"./m":4, "./mx":6}], 10:[function(require, module, exports) {
    (function(root, definition) {
      if (typeof define === "function" && define.amd) {
        define(definition);
      } else {
        if (typeof module === "object" && module.exports) {
          module.exports = definition();
        } else {
          root.log = definition();
        }
      }
    })(this, function() {
      var noop = function() {
      };
      var undefinedType = "undefined";
      function realMethod(methodName) {
        if (typeof console === undefinedType) {
          return false;
        } else {
          if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
          } else {
            if (console.log !== undefined) {
              return bindMethod(console, "log");
            } else {
              return noop;
            }
          }
        }
      }
      function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === "function") {
          return method.bind(obj);
        } else {
          try {
            return Function.prototype.bind.call(method, obj);
          } catch (e) {
            return function() {
              return Function.prototype.apply.apply(method, [obj, arguments]);
            };
          }
        }
      }
      function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function() {
          if (typeof console !== undefinedType) {
            replaceLoggingMethods.call(this, level, loggerName);
            this[methodName].apply(this, arguments);
          }
        };
      }
      function replaceLoggingMethods(level, loggerName) {
        for (var i = 0;i < logMethods.length;i++) {
          var methodName = logMethods[i];
          this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
        }
      }
      function defaultMethodFactory(methodName, level, loggerName) {
        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
      }
      var logMethods = ["trace", "debug", "info", "warn", "error"];
      function Logger(name, defaultLevel, factory) {
        var self = this;
        var currentLevel;
        var storageKey = "loglevel";
        if (name) {
          storageKey += ":" + name;
        }
        function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || "silent").toUpperCase();
          try {
            window.localStorage[storageKey] = levelName;
            return;
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {
          }
        }
        function getPersistedLevel() {
          var storedLevel;
          try {
            storedLevel = window.localStorage[storageKey];
          } catch (ignore) {
          }
          if (typeof storedLevel === undefinedType) {
            try {
              var cookie = window.document.cookie;
              var location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
              if (location) {
                storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
              }
            } catch (ignore) {
            }
          }
          if (self.levels[storedLevel] === undefined) {
            storedLevel = undefined;
          }
          return storedLevel;
        }
        self.levels = {"TRACE":0, "DEBUG":1, "INFO":2, "WARN":3, "ERROR":4, "SILENT":5};
        self.methodFactory = factory || defaultMethodFactory;
        self.getLevel = function() {
          return currentLevel;
        };
        self.setLevel = function(level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
            level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && (level >= 0 && level <= self.levels.SILENT)) {
            currentLevel = level;
            if (persist !== false) {
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
        self.setDefaultLevel = function(level) {
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
        var initialLevel = getPersistedLevel();
        if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
        }
        self.setLevel(initialLevel, false);
      }
      var defaultLogger = new Logger;
      var _loggersByName = {};
      defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }
        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
      };
      var _log = typeof window !== undefinedType ? window.log : undefined;
      defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType && window.log === defaultLogger) {
          window.log = _log;
        }
        return defaultLogger;
      };
      return defaultLogger;
    });
  }, {}], 11:[function(require, module, exports) {
    var prefixes = ["webkit", "Moz", "ms", "O"];
    var animations = {};
    var useCssAnimations;
    function createEl(tag, prop) {
      var el = document.createElement(tag || "div");
      var n;
      for (n in prop) {
        el[n] = prop[n];
      }
      return el;
    }
    function ins(parent) {
      for (var i = 1, n = arguments.length;i < n;i++) {
        parent.appendChild(arguments[i]);
      }
      return parent;
    }
    var sheet = function() {
      var el = createEl("style");
      ins(document.getElementsByTagName("head")[0], el);
      return el.sheet || el.styleSheet;
    }();
    function addAnimation(alpha, trail, i, lines) {
      var name = ["opacity", trail, ~~(alpha * 100), i, lines].join("-");
      var start = 0.01 + i / lines * 100;
      var z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha);
      var prefix = useCssAnimations.substring(0, useCssAnimations.indexOf("Animation")).toLowerCase();
      var pre = prefix && "-" + prefix + "-" || "";
      if (!animations[name]) {
        sheet.insertRule("@" + pre + "keyframes " + name + "{" + "0%{opacity:" + z + "}" + start + "%{opacity:" + alpha + "}" + (start + 0.01) + "%{opacity:1}" + (start + trail) % 100 + "%{opacity:" + alpha + "}" + "100%{opacity:" + z + "}" + "}", 0);
        animations[name] = 1;
      }
      return name;
    }
    function vendor(el, prop) {
      var s = el.style;
      var pp;
      var i;
      if (s[prop] !== undefined) {
        return prop;
      }
      prop = prop.charAt(0).toUpperCase() + prop.slice(1);
      for (i = 0;i < prefixes.length;i++) {
        pp = prefixes[i] + prop;
        if (s[pp] !== undefined) {
          return pp;
        }
      }
    }
    function css(el, prop) {
      for (var n in prop) {
        el.style[vendor(el, n) || n] = prop[n];
      }
      return el;
    }
    function merge(obj) {
      for (var i = 1;i < arguments.length;i++) {
        var def = arguments[i];
        for (var n in def) {
          if (obj[n] === undefined) {
            obj[n] = def[n];
          }
        }
      }
      return obj;
    }
    function pos(el) {
      var o = {x:el.offsetLeft, y:el.offsetTop};
      while (el = el.offsetParent) {
        o.x += el.offsetLeft;
        o.y += el.offsetTop;
      }
      return o;
    }
    var defaults = {lines:12, length:7, width:5, radius:10, rotate:0, color:"#000", speed:1, trail:100, opacity:1 / 4, fps:20, zIndex:2E9, className:"spinner", top:"auto", left:"auto"};
    var Spinner = function Spinner(o) {
      if (!this.spin) {
        return new Spinner(o);
      }
      this.opts = merge(o || {}, Spinner.defaults, defaults);
    };
    Spinner.defaults = {};
    merge(Spinner.prototype, {spin:function(target) {
      this.stop();
      var self = this;
      var o = self.opts;
      var el = self.el = css(createEl(0, {className:o.className}), {position:"relative", zIndex:o.zIndex});
      var mid = o.radius + o.length + o.width;
      var ep;
      var tp;
      if (target) {
        target.insertBefore(el, target.firstChild || null);
        tp = pos(target);
        ep = pos(el);
        css(el, {left:(o.left == "auto" ? tp.x - ep.x + (target.offsetWidth >> 1) : o.left + mid) + "px", top:(o.top == "auto" ? tp.y - ep.y + (target.offsetHeight >> 1) : o.top + mid) + "px"});
      }
      el.setAttribute("aria-role", "progressbar");
      self.lines(el, self.opts);
      if (!useCssAnimations) {
        var i = 0;
        var fps = o.fps;
        var f = fps / o.speed;
        var ostep = (1 - o.opacity) / (f * o.trail / 100);
        var astep = f / o.lines;
        !function anim() {
          i++;
          for (var s = o.lines;s;s--) {
            var alpha = Math.max(1 - (i + s * astep) % f * ostep, o.opacity);
            self.opacity(el, o.lines - s, alpha, o);
          }
          self.timeout = self.el && setTimeout(anim, ~~(1E3 / fps));
        }();
      }
      return self;
    }, stop:function() {
      var el = this.el;
      if (el) {
        clearTimeout(this.timeout);
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        this.el = undefined;
      }
      return this;
    }, lines:function(el, o) {
      var i = 0;
      var seg;
      function fill(color, shadow) {
        return css(createEl(), {position:"absolute", width:o.length + o.width + "px", height:o.width + "px", background:color, boxShadow:shadow, transformOrigin:"left", transform:"rotate(" + ~~(360 / o.lines * i + o.rotate) + "deg) translate(" + o.radius + "px" + ",0)", borderRadius:(o.width >> 1) + "px"});
      }
      for (;i < o.lines;i++) {
        seg = css(createEl(), {position:"absolute", top:1 + ~(o.width / 2) + "px", transform:o.hwaccel ? "translate3d(0,0,0)" : "", opacity:o.opacity, animation:useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + " " + 1 / o.speed + "s linear infinite"});
        if (o.shadow) {
          ins(seg, css(fill("#000", "0 0 4px " + "#000"), {top:2 + "px"}));
        }
        ins(el, ins(seg, fill(o.color, "0 0 1px rgba(0,0,0,.1)")));
      }
      return el;
    }, opacity:function(el, i, val) {
      if (i < el.childNodes.length) {
        el.childNodes[i].style.opacity = val;
      }
    }});
    !function() {
      function vml(tag, attr) {
        return createEl("<" + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
      }
      var s = css(createEl("group"), {behavior:"url(#default#VML)"});
      if (!vendor(s, "transform") && s.adj) {
        sheet.addRule(".spin-vml", "behavior:url(#default#VML)");
        Spinner.prototype.lines = function(el, o) {
          var r = o.length + o.width;
          var s = 2 * r;
          function grp() {
            return css(vml("group", {coordsize:s + " " + s, coordorigin:-r + " " + -r}), {width:s, height:s});
          }
          var margin = -(o.width + o.length) * 2 + "px";
          var g = css(grp(), {position:"absolute", top:margin, left:margin});
          var i;
          function seg(i, dx, filter) {
            ins(g, ins(css(grp(), {rotation:360 / o.lines * i + "deg", left:~~dx}), ins(css(vml("roundrect", {arcsize:1}), {width:r, height:o.width, left:o.radius, top:-o.width >> 1, filter:filter}), vml("fill", {color:o.color, opacity:o.opacity}), vml("stroke", {opacity:0}))));
          }
          if (o.shadow) {
            for (i = 1;i <= o.lines;i++) {
              seg(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
            }
          }
          for (i = 1;i <= o.lines;i++) {
            seg(i);
          }
          return ins(el, g);
        };
        Spinner.prototype.opacity = function(el, i, val, o) {
          var c = el.firstChild;
          o = o.shadow && o.lines || 0;
          if (c && i + o < c.childNodes.length) {
            c = c.childNodes[i + o];
            c = c && c.firstChild;
            c = c && c.firstChild;
            if (c) {
              c.opacity = val;
            }
          }
        };
      } else {
        useCssAnimations = vendor(s, "animation");
      }
    }();
    module.exports = Spinner;
  }, {}], 12:[function(require, module, exports) {
    (function(Math) {
      var trimLeft = /^\s+/, trimRight = /\s+$/, tinyCounter = 0, mathRound = Math.round, mathMin = Math.min, mathMax = Math.max, mathRandom = Math.random;
      function tinycolor(color, opts) {
        color = color ? color : "";
        opts = opts || {};
        if (color instanceof tinycolor) {
          return color;
        }
        if (!(this instanceof tinycolor)) {
          return new tinycolor(color, opts);
        }
        var rgb = inputToRGB(color);
        this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = mathRound(100 * this._a) / 100, this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;
        if (this._r < 1) {
          this._r = mathRound(this._r);
        }
        if (this._g < 1) {
          this._g = mathRound(this._g);
        }
        if (this._b < 1) {
          this._b = mathRound(this._b);
        }
        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
      }
      tinycolor.prototype = {isDark:function() {
        return this.getBrightness() < 128;
      }, isLight:function() {
        return!this.isDark();
      }, isValid:function() {
        return this._ok;
      }, getOriginalInput:function() {
        return this._originalInput;
      }, getFormat:function() {
        return this._format;
      }, getAlpha:function() {
        return this._a;
      }, getBrightness:function() {
        var rgb = this.toRgb();
        return(rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1E3;
      }, getLuminance:function() {
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r / 255;
        GsRGB = rgb.g / 255;
        BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
          R = RsRGB / 12.92;
        } else {
          R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
          G = GsRGB / 12.92;
        } else {
          G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
          B = BsRGB / 12.92;
        } else {
          B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
      }, setAlpha:function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100 * this._a) / 100;
        return this;
      }, toHsv:function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return{h:hsv.h * 360, s:hsv.s, v:hsv.v, a:this._a};
      }, toHsvString:function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
      }, toHsl:function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return{h:hsl.h * 360, s:hsl.s, l:hsl.l, a:this._a};
      }, toHslString:function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
      }, toHex:function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
      }, toHexString:function(allow3Char) {
        return "#" + this.toHex(allow3Char);
      }, toHex8:function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
      }, toHex8String:function(allow4Char) {
        return "#" + this.toHex8(allow4Char);
      }, toRgb:function() {
        return{r:mathRound(this._r), g:mathRound(this._g), b:mathRound(this._b), a:this._a};
      }, toRgbString:function() {
        return this._a == 1 ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
      }, toPercentageRgb:function() {
        return{r:mathRound(bound01(this._r, 255) * 100) + "%", g:mathRound(bound01(this._g, 255) * 100) + "%", b:mathRound(bound01(this._b, 255) * 100) + "%", a:this._a};
      }, toPercentageRgbString:function() {
        return this._a == 1 ? "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" : "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
      }, toName:function() {
        if (this._a === 0) {
          return "transparent";
        }
        if (this._a < 1) {
          return false;
        }
        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
      }, toFilter:function(secondColor) {
        var hex8String = "#" + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";
        if (secondColor) {
          var s = tinycolor(secondColor);
          secondHex8String = "#" + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }
        return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
      }, toString:function(format) {
        var formatSet = !!format;
        format = format || this._format;
        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && (hasAlpha && (format === "hex" || (format === "hex6" || (format === "hex3" || (format === "hex4" || (format === "hex8" || format === "name"))))));
        if (needsAlphaFormat) {
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
      }, clone:function() {
        return tinycolor(this.toString());
      }, _applyModification:function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
      }, lighten:function() {
        return this._applyModification(lighten, arguments);
      }, brighten:function() {
        return this._applyModification(brighten, arguments);
      }, darken:function() {
        return this._applyModification(darken, arguments);
      }, desaturate:function() {
        return this._applyModification(desaturate, arguments);
      }, saturate:function() {
        return this._applyModification(saturate, arguments);
      }, greyscale:function() {
        return this._applyModification(greyscale, arguments);
      }, spin:function() {
        return this._applyModification(spin, arguments);
      }, _applyCombination:function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
      }, analogous:function() {
        return this._applyCombination(analogous, arguments);
      }, complement:function() {
        return this._applyCombination(complement, arguments);
      }, monochromatic:function() {
        return this._applyCombination(monochromatic, arguments);
      }, splitcomplement:function() {
        return this._applyCombination(splitcomplement, arguments);
      }, triad:function() {
        return this._applyCombination(triad, arguments);
      }, tetrad:function() {
        return this._applyCombination(tetrad, arguments);
      }};
      tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
          var newColor = {};
          for (var i in color) {
            if (color.hasOwnProperty(i)) {
              if (i === "a") {
                newColor[i] = color[i];
              } else {
                newColor[i] = convertToPercentage(color[i]);
              }
            }
          }
          color = newColor;
        }
        return tinycolor(color, opts);
      };
      function inputToRGB(color) {
        var rgb = {r:0, g:0, b:0};
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
          if (isValidCSSUnit(color.r) && (isValidCSSUnit(color.g) && isValidCSSUnit(color.b))) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
          } else {
            if (isValidCSSUnit(color.h) && (isValidCSSUnit(color.s) && isValidCSSUnit(color.v))) {
              s = convertToPercentage(color.s);
              v = convertToPercentage(color.v);
              rgb = hsvToRgb(color.h, s, v);
              ok = true;
              format = "hsv";
            } else {
              if (isValidCSSUnit(color.h) && (isValidCSSUnit(color.s) && isValidCSSUnit(color.l))) {
                s = convertToPercentage(color.s);
                l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, s, l);
                ok = true;
                format = "hsl";
              }
            }
          }
          if (color.hasOwnProperty("a")) {
            a = color.a;
          }
        }
        a = boundAlpha(a);
        return{ok:ok, format:color.format || format, r:mathMin(255, mathMax(rgb.r, 0)), g:mathMin(255, mathMax(rgb.g, 0)), b:mathMin(255, mathMax(rgb.b, 0)), a:a};
      }
      function rgbToRgb(r, g, b) {
        return{r:bound01(r, 255) * 255, g:bound01(g, 255) * 255, b:bound01(b, 255) * 255};
      }
      function rgbToHsl(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
          h = s = 0;
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return{h:h, s:s, l:l};
      }
      function hslToRgb(h, s, l) {
        var r, g, b;
        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);
        function hue2rgb(p, q, t) {
          if (t < 0) {
            t += 1;
          }
          if (t > 1) {
            t -= 1;
          }
          if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
          }
          if (t < 1 / 2) {
            return q;
          }
          if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
          }
          return p;
        }
        if (s === 0) {
          r = g = b = l;
        } else {
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }
        return{r:r * 255, g:g * 255, b:b * 255};
      }
      function rgbToHsv(r, g, b) {
        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);
        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;
        var d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max == min) {
          h = 0;
        } else {
          switch(max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return{h:h, s:s, v:v};
      }
      function hsvToRgb(h, s, v) {
        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);
        var i = Math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [v, q, p, p, t, v][mod], g = [t, v, v, q, p, p][mod], b = [p, p, t, v, v, q][mod];
        return{r:r * 255, g:g * 255, b:b * 255};
      }
      function rgbToHex(r, g, b, allow3Char) {
        var hex = [pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16))];
        if (allow3Char && (hex[0].charAt(0) == hex[0].charAt(1) && (hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)))) {
          return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }
        return hex.join("");
      }
      function rgbaToHex(r, g, b, a, allow4Char) {
        var hex = [pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16)), pad2(convertDecimalToHex(a))];
        if (allow4Char && (hex[0].charAt(0) == hex[0].charAt(1) && (hex[1].charAt(0) == hex[1].charAt(1) && (hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1))))) {
          return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
        }
        return hex.join("");
      }
      function rgbaToArgbHex(r, g, b, a) {
        var hex = [pad2(convertDecimalToHex(a)), pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16))];
        return hex.join("");
      }
      tinycolor.equals = function(color1, color2) {
        if (!color1 || !color2) {
          return false;
        }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
      };
      tinycolor.random = function() {
        return tinycolor.fromRatio({r:mathRandom(), g:mathRandom(), b:mathRandom()});
      };
      function desaturate(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
      }
      function saturate(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
      }
      function greyscale(color) {
        return tinycolor(color).desaturate(100);
      }
      function lighten(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
      }
      function brighten(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
        return tinycolor(rgb);
      }
      function darken(color, amount) {
        amount = amount === 0 ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
      }
      function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
      }
      function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
      }
      function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return[tinycolor(color), tinycolor({h:(h + 120) % 360, s:hsl.s, l:hsl.l}), tinycolor({h:(h + 240) % 360, s:hsl.s, l:hsl.l})];
      }
      function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return[tinycolor(color), tinycolor({h:(h + 90) % 360, s:hsl.s, l:hsl.l}), tinycolor({h:(h + 180) % 360, s:hsl.s, l:hsl.l}), tinycolor({h:(h + 270) % 360, s:hsl.s, l:hsl.l})];
      }
      function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return[tinycolor(color), tinycolor({h:(h + 72) % 360, s:hsl.s, l:hsl.l}), tinycolor({h:(h + 216) % 360, s:hsl.s, l:hsl.l})];
      }
      function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;
        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];
        for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360;--results;) {
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
          ret.push(tinycolor({h:h, s:s, v:v}));
          v = (v + modification) % 1;
        }
        return ret;
      }
      tinycolor.mix = function(color1, color2, amount) {
        amount = amount === 0 ? 0 : amount || 50;
        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();
        var p = amount / 100;
        var rgba = {r:(rgb2.r - rgb1.r) * p + rgb1.r, g:(rgb2.g - rgb1.g) * p + rgb1.g, b:(rgb2.b - rgb1.b) * p + rgb1.b, a:(rgb2.a - rgb1.a) * p + rgb1.a};
        return tinycolor(rgba);
      };
      tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        return(Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
      };
      tinycolor.isReadable = function(color1, color2, wcag2) {
        var readability = tinycolor.readability(color1, color2);
        var wcag2Parms, out;
        out = false;
        wcag2Parms = validateWCAG2Parms(wcag2);
        switch(wcag2Parms.level + wcag2Parms.size) {
          case "AAsmall":
          ;
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
      tinycolor.mostReadable = function(baseColor, colorList, args) {
        var bestColor = null;
        var bestScore = 0;
        var readability;
        var includeFallbackColors, level, size;
        args = args || {};
        includeFallbackColors = args.includeFallbackColors;
        level = args.level;
        size = args.size;
        for (var i = 0;i < colorList.length;i++) {
          readability = tinycolor.readability(baseColor, colorList[i]);
          if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
          }
        }
        if (tinycolor.isReadable(baseColor, bestColor, {"level":level, "size":size}) || !includeFallbackColors) {
          return bestColor;
        } else {
          args.includeFallbackColors = false;
          return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
        }
      };
      var names = tinycolor.names = {aliceblue:"f0f8ff", antiquewhite:"faebd7", aqua:"0ff", aquamarine:"7fffd4", azure:"f0ffff", beige:"f5f5dc", bisque:"ffe4c4", black:"000", blanchedalmond:"ffebcd", blue:"00f", blueviolet:"8a2be2", brown:"a52a2a", burlywood:"deb887", burntsienna:"ea7e5d", cadetblue:"5f9ea0", chartreuse:"7fff00", chocolate:"d2691e", coral:"ff7f50", cornflowerblue:"6495ed", cornsilk:"fff8dc", crimson:"dc143c", cyan:"0ff", darkblue:"00008b", darkcyan:"008b8b", darkgoldenrod:"b8860b", 
      darkgray:"a9a9a9", darkgreen:"006400", darkgrey:"a9a9a9", darkkhaki:"bdb76b", darkmagenta:"8b008b", darkolivegreen:"556b2f", darkorange:"ff8c00", darkorchid:"9932cc", darkred:"8b0000", darksalmon:"e9967a", darkseagreen:"8fbc8f", darkslateblue:"483d8b", darkslategray:"2f4f4f", darkslategrey:"2f4f4f", darkturquoise:"00ced1", darkviolet:"9400d3", deeppink:"ff1493", deepskyblue:"00bfff", dimgray:"696969", dimgrey:"696969", dodgerblue:"1e90ff", firebrick:"b22222", floralwhite:"fffaf0", forestgreen:"228b22", 
      fuchsia:"f0f", gainsboro:"dcdcdc", ghostwhite:"f8f8ff", gold:"ffd700", goldenrod:"daa520", gray:"808080", green:"008000", greenyellow:"adff2f", grey:"808080", honeydew:"f0fff0", hotpink:"ff69b4", indianred:"cd5c5c", indigo:"4b0082", ivory:"fffff0", khaki:"f0e68c", lavender:"e6e6fa", lavenderblush:"fff0f5", lawngreen:"7cfc00", lemonchiffon:"fffacd", lightblue:"add8e6", lightcoral:"f08080", lightcyan:"e0ffff", lightgoldenrodyellow:"fafad2", lightgray:"d3d3d3", lightgreen:"90ee90", lightgrey:"d3d3d3", 
      lightpink:"ffb6c1", lightsalmon:"ffa07a", lightseagreen:"20b2aa", lightskyblue:"87cefa", lightslategray:"789", lightslategrey:"789", lightsteelblue:"b0c4de", lightyellow:"ffffe0", lime:"0f0", limegreen:"32cd32", linen:"faf0e6", magenta:"f0f", maroon:"800000", mediumaquamarine:"66cdaa", mediumblue:"0000cd", mediumorchid:"ba55d3", mediumpurple:"9370db", mediumseagreen:"3cb371", mediumslateblue:"7b68ee", mediumspringgreen:"00fa9a", mediumturquoise:"48d1cc", mediumvioletred:"c71585", midnightblue:"191970", 
      mintcream:"f5fffa", mistyrose:"ffe4e1", moccasin:"ffe4b5", navajowhite:"ffdead", navy:"000080", oldlace:"fdf5e6", olive:"808000", olivedrab:"6b8e23", orange:"ffa500", orangered:"ff4500", orchid:"da70d6", palegoldenrod:"eee8aa", palegreen:"98fb98", paleturquoise:"afeeee", palevioletred:"db7093", papayawhip:"ffefd5", peachpuff:"ffdab9", peru:"cd853f", pink:"ffc0cb", plum:"dda0dd", powderblue:"b0e0e6", purple:"800080", rebeccapurple:"663399", red:"f00", rosybrown:"bc8f8f", royalblue:"4169e1", 
      saddlebrown:"8b4513", salmon:"fa8072", sandybrown:"f4a460", seagreen:"2e8b57", seashell:"fff5ee", sienna:"a0522d", silver:"c0c0c0", skyblue:"87ceeb", slateblue:"6a5acd", slategray:"708090", slategrey:"708090", snow:"fffafa", springgreen:"00ff7f", steelblue:"4682b4", tan:"d2b48c", teal:"008080", thistle:"d8bfd8", tomato:"ff6347", turquoise:"40e0d0", violet:"ee82ee", wheat:"f5deb3", white:"fff", whitesmoke:"f5f5f5", yellow:"ff0", yellowgreen:"9acd32"};
      var hexNames = tinycolor.hexNames = flip(names);
      function flip(o) {
        var flipped = {};
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
          }
        }
        return flipped;
      }
      function boundAlpha(a) {
        a = parseFloat(a);
        if (isNaN(a) || (a < 0 || a > 1)) {
          a = 1;
        }
        return a;
      }
      function bound01(n, max) {
        if (isOnePointZero(n)) {
          n = "100%";
        }
        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));
        if (processPercent) {
          n = parseInt(n * max, 10) / 100;
        }
        if (Math.abs(n - max) < 1E-6) {
          return 1;
        }
        return n % max / parseFloat(max);
      }
      function clamp01(val) {
        return mathMin(1, mathMax(0, val));
      }
      function parseIntFromHex(val) {
        return parseInt(val, 16);
      }
      function isOnePointZero(n) {
        return typeof n == "string" && (n.indexOf(".") != -1 && parseFloat(n) === 1);
      }
      function isPercentage(n) {
        return typeof n === "string" && n.indexOf("%") != -1;
      }
      function pad2(c) {
        return c.length == 1 ? "0" + c : "" + c;
      }
      function convertToPercentage(n) {
        if (n <= 1) {
          n = n * 100 + "%";
        }
        return n;
      }
      function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
      }
      function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
      }
      var matchers = function() {
        var CSS_INTEGER = "[-\\+]?\\d+%?";
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        return{CSS_UNIT:new RegExp(CSS_UNIT), rgb:new RegExp("rgb" + PERMISSIVE_MATCH3), rgba:new RegExp("rgba" + PERMISSIVE_MATCH4), hsl:new RegExp("hsl" + PERMISSIVE_MATCH3), hsla:new RegExp("hsla" + PERMISSIVE_MATCH4), hsv:new RegExp("hsv" + PERMISSIVE_MATCH3), hsva:new RegExp("hsva" + PERMISSIVE_MATCH4), hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/, hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, 
        hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};
      }();
      function isValidCSSUnit(color) {
        return!!matchers.CSS_UNIT.exec(color);
      }
      function stringInputToObject(color) {
        color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
        var named = false;
        if (names[color]) {
          color = names[color];
          named = true;
        } else {
          if (color == "transparent") {
            return{r:0, g:0, b:0, a:0, format:"name"};
          }
        }
        var match;
        if (match = matchers.rgb.exec(color)) {
          return{r:match[1], g:match[2], b:match[3]};
        }
        if (match = matchers.rgba.exec(color)) {
          return{r:match[1], g:match[2], b:match[3], a:match[4]};
        }
        if (match = matchers.hsl.exec(color)) {
          return{h:match[1], s:match[2], l:match[3]};
        }
        if (match = matchers.hsla.exec(color)) {
          return{h:match[1], s:match[2], l:match[3], a:match[4]};
        }
        if (match = matchers.hsv.exec(color)) {
          return{h:match[1], s:match[2], v:match[3]};
        }
        if (match = matchers.hsva.exec(color)) {
          return{h:match[1], s:match[2], v:match[3], a:match[4]};
        }
        if (match = matchers.hex8.exec(color)) {
          return{r:parseIntFromHex(match[1]), g:parseIntFromHex(match[2]), b:parseIntFromHex(match[3]), a:convertHexToDecimal(match[4]), format:named ? "name" : "hex8"};
        }
        if (match = matchers.hex6.exec(color)) {
          return{r:parseIntFromHex(match[1]), g:parseIntFromHex(match[2]), b:parseIntFromHex(match[3]), format:named ? "name" : "hex"};
        }
        if (match = matchers.hex4.exec(color)) {
          return{r:parseIntFromHex(match[1] + "" + match[1]), g:parseIntFromHex(match[2] + "" + match[2]), b:parseIntFromHex(match[3] + "" + match[3]), a:convertHexToDecimal(match[4] + "" + match[4]), format:named ? "name" : "hex8"};
        }
        if (match = matchers.hex3.exec(color)) {
          return{r:parseIntFromHex(match[1] + "" + match[1]), g:parseIntFromHex(match[2] + "" + match[2]), b:parseIntFromHex(match[3] + "" + match[3]), format:named ? "name" : "hex"};
        }
        return false;
      }
      function validateWCAG2Parms(parms) {
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
        return{"level":level, "size":size};
      }
      if (typeof module !== "undefined" && module.exports) {
        module.exports = tinycolor;
      } else {
        if (typeof define === "function" && define.amd) {
          define(function() {
            return tinycolor;
          });
        } else {
          window.tinycolor = tinycolor;
        }
      }
    })(Math);
  }, {}]}, {}, [7])(7);
});

