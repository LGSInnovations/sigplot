/**
 * @license
 * File: sigplot.plugin.js
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
/* global console */
(function() {
    var common = require("./common");
    var Class = function() {};
    window.Class = Class;
    Class.extend = function(props) {
        props = props || {};
        var _extend = function(dest) { // (Object[, Object, ...]) ->
            var sources = Array.prototype.slice.call(arguments, 1),
                i, j, len, src;
            for (j = 0, len = sources.length; j < len; j++) {
                src = sources[j] || {};
                for (i in src) {
                    if (src.hasOwnProperty(i)) {
                        dest[i] = src[i];
                    }
                }
            }
            return dest;
        };
        var update = function(dst, src) {
            for (var prop in src) {
                var val = src[prop];
                if (typeof val === "object") { // recursive
                    if (typeof dst[prop] !== "object") {
                        dst[prop] = {};
                    }
                    update(dst[prop], val);
                } else {
                    dst[prop] = val;
                }
            }
            return dst; // return dst to allow method chaining
        };
        // extended class with the new prototype
        var NewClass = function() {
            // merge options
            this.options = {};
            if (proto.options) {
                update(this.options, proto.options);
            }
            if (props.options) {
                update(this.options, props.options);
            }
            // call the constructor
            if (this.init) {
                this.init.apply(this, arguments);
            }
            // call all constructor hooks
            if (this._initHooks) {
                this.callInitHooks();
            }
        };
        // instantiate class without calling constructor
        var F = function() {};
        F.prototype = this.prototype;
        var proto = new F();
        proto.constructor = NewClass;
        NewClass.prototype = proto;
        //inherit parent's statics
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'prototype') {
                NewClass[i] = this[i];
            }
        }
        var events = {
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
            }
        };
        _extend(proto, events);
        // mix given properties into the prototype
        _extend(proto, props);
        proto._initHooks = [];
        var parent = this;
        // jshint camelcase: false
        NewClass.__super__ = parent.prototype;
        // add method for calling all hooks
        proto.callInitHooks = function() {
            if (this._initHooksCalled) {
                return;
            }
            if (parent.prototype.callInitHooks) {
                parent.prototype.callInitHooks.call(this);
            }
            this._initHooksCalled = true;
            for (var i = 0, len = proto._initHooks.length; i < len; i++) {
                proto._initHooks[i].call(this);
            }
        };
        return NewClass;
    };
    Class.addInitHook = function(fn) { // (Function) || (String, args...)
        var args = Array.prototype.slice.call(arguments, 1);
        var init = typeof fn === 'function' ? fn : function() {
            this[fn].apply(this, args);
        };
        this.prototype._initHooks = this.prototype._initHooks || [];
        this.prototype._initHooks.push(init);
    };
    var SigplotPlugin = Class.extend({
         options: {
            refreshOnOptionChange: true
        },
        init: function(plot) {
            console.log("Abstract constructor Method");
        },
        onAdd: function() {
            console.log("Abstract onAdd Method what to do when added to plot");
        },
        refresh: function(canvas) {
            console.log("Abstract refresh Method what to do when asked to be redrawn");
        },
        despose: function() {
            console.log("Abstract destructor Method");
        },
        menu:function(){
            console.log("Abstract menu Method need to return either an mx.menu compatible object or a function that returns one");
        },
        addTo: function(plot) {
            plot.add_plugin(this);
        },
        setOptions: function(options) {
            common.update(this.options, options);
            if(this.options.refreshOnOptionChange && this._plot){
                this._plot.refresh();
            }
        }
    });
    module.exports = SigplotPlugin;
}());