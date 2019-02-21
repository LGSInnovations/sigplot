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
        constructor(options) {
	    this.definedOptions = {};
	    this.options = {};

	    this.defineOptions();

	    this.assignOptions(options);
	}

	defineOptions() {
	    this.defineOption("display", {
		defaultValue: true,
		refreshOnChange: true
	    });
	}

        /**
	 * Called when the plugin is added to the plot.
	 */
        init(plot) {
            this.plot = plot;
	}

        /**
	 * Called when the plugin is removed from the plot.
	 */
        dispose() {
            this.plot = undefined;
        }
	   
	/**
	 * Refresh is called when the plugin needs to redraw itself.
	 *
	 * @param canvas
	 *   The canvas the plugin should render to
	 */
        refresh(canvas) {
	}

	/**
	 * Provides the menu for the plugin
	 *
	 * @returns
	 *    A mx.menu compatible object or a function that creates one
	 */
	menu() {
	}

	defineOption(optionName, definition) {
	    if (this.definedOptions === undefined) {
		this.definedOptions = {};
	    }

	    definition = definition || {};

	    this.definedOptions[optionName] = definition;
            this.options[optionName] = definition.defaultValue;

	    // Fluentize the API
	    this[optionName] =  function() {
		if (!arguments.length) {
		    return this.options[optionName];
		}

		if (this.options[optionName] !== arguments[0]) {
		    this.options[optionName] = arguments[0];
		    if (definition.refreshOnChange) {
			this.refresh();
		    }
		    return this;
		}
	    };
	}

	assignOptions(options) {
	    let refresh = false;
	    for (let optName in options) {
		// don't let the user define new options
		if (!this.definedOptions.hasOwnProperty(optName)) {
		    continue;
		}

		// if the values are the same nothing to do
		if (this.options[optName] === options[optName]) {
		    continue;
		}

		// set the option
		this.options[optName] = options[optName];

	        if (this.definedOptions[optName].refreshOnChange === true) {
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
            var Mx = this.plot._Mx;
            mx.addEventListener(Mx, what, callback, false);
        }

	/**
	 * Remove a listener from the Plot
	 */
        removeListener(what, callback) {
            var Mx = this.plot._Mx;
            mx.removeEventListener(Mx, what, callback, false);
        }
    }

    module.exports = {
	Plugin: Plugin
    };
}());
