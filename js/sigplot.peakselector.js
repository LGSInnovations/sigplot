    /* global module */
    /* global require */
    (function() {
        var m = require("./m");
        var mx = require("./mx");
        var SigplotPlugin = require("./sigplot.plugin");
        var PeakSelector = SigplotPlugin.extend({
            options: {
                display: true,
                linewidth: 1,
                style: {
                    lineWidth: 1,
                    lineCap: "square",
                    color: "#FF0000"
                },
                toggleKey: "p"
            },
            init: function(options) {
                this.setOptions(options);
                this.enabled = false;
            },
            toggle: function() {
                this.enabled = !this.enabled;
            },
            onAdd: function(plot) {
                this.plot = plot;
                var self = this;
                self.handleMouseMove = function(e) {
                    if (!self.enabled) {
                        return;
                    }
                    if (!self.selectStart) {
                        self.selectStart = e;
                    }
                    self.selectStop = e;
                    self.drawSelection();
                };
                plot.addListener("mmove", self.handleMouseMove);
                self.handleMouseup = function(e) {
                    e.preventDefault();
                    if (!self.enabled) {
                        return;
                    }
                    self.selectStop = e;
                    self.finalize();
                };
                plot.addListener("mtag", self.handleMouseup);
                plot.addListener("zoom",function(){
                    self.reset(); //If we zoom disable and clear
                });
                plot.addListener("unzoom",function(){
                    self.reset(); //If we zoom disable and clear
                });
                plot.addListener("plotkeypress", function(e) {
                    if (e.keyCode === self.options.toggleKey.charCodeAt(0)) {
                        if (self.enabled) {
                            self.finalize();
                        } else {
                            self.toggle();
                        }
                    }
                });
            },
            refresh: function(canvas) {
                if (!this.options.display) {
                    return;
                }
                if (!this.enabled) {
                    return;
                }
                if (!this.selectStart || !this.selectStop) {
                    return; //Still not enough to draw!
                }
                var ctx = canvas.getContext("2d");
                ctx.lineWidth = this.options.style.lineWidth;
                ctx.lineCap = this.options.style.lineCap;
                ctx.strokeStyle = this.options.style.color;
                ctx.beginPath();
                ctx.moveTo(this.selectStart.xpos, this.selectStart.ypos);
                ctx.lineTo(this.selectStop.xpos, this.selectStop.ypos);
                ctx.stroke();
            },
            drawSelection: function(e) {
                this.plot.redraw();
            },
            finalize: function() {
                var Mx = this.plot._Mx;
                var self = this;
                if (!self.selectStart || !self.selectStop) {
                    return; //Nothing was ever selected
                }
                //Select was right to left not left to right swap these
                if (self.selectStart.x > self.selectStop.x) {
                    var temp = self.selectStart;
                    self.selectStart = self.selectStop;
                    self.selectStop = temp;
                }
                if (self.selectStart.x === self.selectStop.x) {
                    return; //nothing was selected
                }
                if (this.plot._Gx.lyr.length === 0) {
                    return; //There are no layers
                }
                var max, min;
                for (var l = 0; l < this.plot._Gx.lyr.length; l++) {
                    var layer = self.plot.get_layer(l);
                    var arr = layer.ypoint.slice(self.selectStart.x, self.selectStop.x);
                    var len = layer.xpoint.length;
                    var xstart, xstop;
                    for (var i = 0; i < len; i++) {
                        if (!xstart && layer.xpoint[i] > self.selectStart.x) {
                            xstart = i;
                        }
                        if (layer.xpoint[i] > self.selectStop.x) {
                            xstop = i;
                            break;
                        }
                    }
                    for (var i = xstart; i < xstop; i++) {
                        if (!max) {
                            max = {
                                x: layer.xpoint[i],
                                y: layer.ypoint[i]
                            };
                        }
                        if (!min) {
                            min = {
                                x: layer.xpoint[i],
                                y: layer.ypoint[i]
                            };
                        }
                        if (layer.ypoint[i] > max.y) {
                            max = {
                                x: layer.xpoint[i],
                                y: layer.ypoint[i]
                            };
                        }
                        if (layer.ypoint[i] < min.y) {
                            min = {
                                x: layer.xpoint[i],
                                y: layer.ypoint[i]
                            };
                        }
                    }
                }
                this.emit("peakSelect", {
                    max: max,
                    min: min
                });
                var evt = document.createEvent('Event');
                evt.initEvent('peakSelect', true, true);
                evt.max = max;
                evt.min = min;
                mx.dispatchEvent(Mx, evt);
                this.reset();
            },
            reset: function() {
                this.enabled = false;
                this.selectStart = undefined;
                this.drawPoint = undefined;
            }
        });
        module.exports = PeakSelector;
    }());