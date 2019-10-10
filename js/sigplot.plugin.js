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
    var common = require("./common");

    class Plugin {
        /**
         * Plugins implement pluginConstructor to define properties (via this.defineProperty)
         * and any local variables.
         */
        pluginConstructor() {}

        /**
         * pluginInit is called afer the plugin has been added to
         * a plot.
         * 
         * @param {object} plot
         *     The plot the plugin was added to.
         */
        pluginInit() {}

        /**
         * pluginDispose is called after then plugin has been removed
         * from a plot.
         */
        pluginDispose() {}

        /**
         * pluginRefresh is called whenever the plugin need to redraw.
         * 
         * Plugins should render their current state to this.canvas.  The canvas
         * is entirely under the control of the plugin can can be cleared or
         * completely filled
         */
        pluginRefresh() {}

        /**
         * pluginGetMenu is called to obtain the menu structure for the
         * plugin.
         * 
         * If a plugin does not have a menu, it does not need to implement this.
         */
        pluginGetMenu() {}

        /**
         * Construct the plugin.
         * 
         * @param {object} properties
         *     The properties for this plugin.
         */
        constructor(properties) {
            this.initial_properties = properties;
            this.properties = {};

            this._plot = undefined;
            this._canvas = undefined;

            // All plugins have a display Property
            this.defineProperty("display", {
                defaultValue: true,
                refreshOnChange: true,
                help: "changes if the plugin is rendered on the plot or not"
            });

            this.pluginSetup();

            return this;
        }

        /**
         * Called when the plugin is added to the plot.
         *  @param plot
         *      The plot the plugin is attahced to 
         *  @param canvas
         *      The canvas the plugin should render to
         */
        init(plot, canvas) {
            if (this._plot) {
                throw "Plugins can only be added to one plot at a time";
            }
            this._plot = plot;
            this._canvas = canvas;
            this.properties = {};

            // When a plugin is added to a plot, it's properties are reset
            // to the initial values provided during construction.  This
            // avoids confusion when a plugin is constructed, added to a plot
            // has it's state modified, then removed from a plot, and added
            // back to a plot
            this.resetProperties(this.initial_properties);

            this.pluginInit();
        }

        /**
         * Get's the plot
         */
        get plot() {
            return this._plot;
        }

        get Mx() {
            return (this._plot) ? this._plot._Mx : null;
        }

        get Gx() {
            return (this._plot) ? this._plot._Gx : null;
        }

        get canvas() {
            return this._canvas;
        }

        get Context() {
            return (this._canvas) ? this._canvas.getContext("2d") : null;
        }

        /**
         * Called when the plugin is removed from the plot.
         */
        dispose() {
            this.pluginDispose();

            this._plot = undefined;
            this._canvas = undefined;
            this.properties = {};
        }

        /**
         * Refresh is called when the plugin needs to redraw itself.
         */
        refresh() {
            if (!this._plot || !this._canvas) {
                return;
            }
            if (!this.properties.display) {
                return;
            }
            this.pluginRefresh(this.canvas);
        }

        /**
         * Provides the menu for the plugin
         *
         * @returns
         *    A mx.menu compatible object or a function that creates one
         */
        menu() {
            return this.pluginGetMenu();
        }

        /**
         * Defines a new Property that the Plugin exposes.
         * 
         * @param {string} PropertyName 
         * @param {object} definition 
         */
        defineProperty(PropertyName, definition) {
            if (this.definedproperties === undefined) {
                this.definedproperties = {};
            }

            definition = definition || {};

            this.definedproperties[PropertyName] = definition;

            // Fluentize the API
            this[PropertyName] = function() {
                if (!arguments.length) {
                    return this.properties[PropertyName];
                }

                if (definition.readonly) {
                    throw "property " + PropertyName + " is readonly";
                }

                if (this.properties[PropertyName] !== arguments[0]) {
                    this.properties[PropertyName] = arguments[0];
                    if (definition.callback) {
                        definition.callback(arguments[0]);
                    }
                    if (definition.refreshOnChange) {
                        this.refresh();
                    }
                    return this;
                }
            };
        }

        resetProperties(overrides) {
            for (let propName in this.definedproperties) {
                this.properties[propName] = this.definedproperties[propName].defaultValue;
            }
            this.assignProperties(overrides);
        }

        /**
         * Updates the Plugin's properties with new values.
         * 
         * @param {object} properties 
         */
        assignProperties(properties) {
            let refresh = false;
            for (let propName in properties) {
                // don't let the user define new properties
                if (!this.definedproperties.hasOwnProperty(propName)) {
                    continue;
                }

                // if the values are the same nothing to do
                if (this.properties[propName] === properties[propName]) {
                    continue;
                }

                if (this.definedproperties[propName].readonly) {
                    throw "property " + propName + " is readonly";
                }

                // set the Property
                this.properties[propName] = properties[propName];
                // make the callback if necessary
                if (this.definedproperties[propName].callback) {
                    this.definedproperties[propName].callback(properties[propName]);
                }
                // if a refresh is necessary, call it later
                if (this.definedproperties[propName].refreshOnChange === true) {
                    refresh = true;
                }
            }
            // refresh if necessary
            if (refresh) {
                this.refresh();
            }
        }

        /**
         * Register to receive a plugin specific event
         *
         * @param type
         *    The type of event
         * @param fn
         *    The function callback
         *  @param context
         *     Context that will be provided to the callback
         */
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

        /**
         * Emit a plugin event.
         */
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

        /**
         * Unregister callback for a plugin specific event
         *
         * @param type
         *    The type of event
         * @param fn
         *    The function callback
         *  @param context
         *     Context that will be provided to the callback
         */
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

        /**
         * Add a listener to a Plot event
         */
        addListener(what, callback) {
            if (!this.Mx) {
                throw "listeners cannot be added until pluginInit is called";
            }
            mx.addEventListener(this.Mx, what, callback, false);
        }

        /**
         * Remove a listener from the Plot
         */
        removeListener(what, callback) {
            if (!this.Mx) {
                throw "listeners cannot be removed until pluginInit is called";
            }
            mx.removeEventListener(this.Mx, what, callback, false);
        }
    }

    module.exports = {
        Plugin: Plugin
    };
}());
