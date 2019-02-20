/**
 * @license
 * File: sigplot.plugin.js
 * Copyright (c) 2012-2019, LGS Innovations Inc., All rights reserved.
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

/*jslint nomen: true, browser: true, devel: true */

/* global module */
/* global require */

(function() {

    var mx = require("./mx");

    class Plugin {
        constructor(options) {
            this.options = (options !== undefined) ? options : {};
	}

        init(plot) {
            this.plot = plot;
	}

        dispose() {
            this.plot = undefined;
        }
	    
        refresh(canvas) {
	}

        on(type, fn, context) {
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
        }

        emit(type, data) {
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
        }

        off(type, fn, context) {
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
        }

        addListener(what, callback) {
            var Mx = this.plot._Mx;
            mx.addEventListener(Mx, what, callback, false);
        }

        removeListener(what, callback) {
            var Mx = this.plot._Mx;
            mx.removeEventListener(Mx, what, callback, false);
        }
    }

    module.exports = {
	Plugin: Plugin
    };
}());
