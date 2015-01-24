/*

 File: sigplot.annotations.js

 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser 
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or 
 (at your option) any later version. This library is distributed in the hope that it will be useful, but 
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the 
 GNU Lesser General Public License along with SigPlot.

 File: sigplot.slider.js

 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser 
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or 
 (at your option) any later version. This library is distributed in the hope that it will be useful, but 
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the 
 GNU Lesser General Public License along with SigPlot.

 File: sigplot.accordion.js

 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser 
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or 
 (at your option) any later version. This library is distributed in the hope that it will be useful, but 
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the 
 GNU Lesser General Public License along with SigPlot.

 File: sigplot.boxes.js

 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser 
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or 
 (at your option) any later version. This library is distributed in the hope that it will be useful, but 
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the 
 GNU Lesser General Public License along with SigPlot.

 File: sigplot.playback.js

 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser 
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or 
 (at your option) any later version. This library is distributed in the hope that it will be useful, but 
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the 
 GNU Lesser General Public License along with SigPlot.

 File: license.js
 Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 Copyright (c) 2012-2014, Axios Inc., All rights reserved.

 This file is part of SigPlot.

 SigPlot is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser 
 General Public License as published by the Free Software Foundation; either version 3.0 of the License, or 
 (at your option) any later version. This library is distributed in the hope that it will be useful, but 
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
 PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the 
 GNU Lesser General Public License along with SigPlot.

 Portions of SigPlot may utilize the following open-source software:

   loglevel.js          - MIT License; Copyright (c) 2014, Tim Perry
   typedarray.js        - MIT License; Copyright (c) 2010, Linden Research, Inc.
   tinycolor.js         - MIT License; Copyright (c) 2013, Brian Grinstead
   CanvasInput.js       - MIT License; Copyright (c) 2013, James Simpson of GoldFire Studios
   spin.js              - MIT License; Copyright (c) 2011-2013 Felix Gnass
   Array.remove         - MIT License; Copyright (c) 2007, John Resig
   Firefox subarray fix - Public Domain; Copyright (c) 2011, Ryan Berdeen
*/
(function(sigplot, mx, m, undefined) {
  sigplot.AnnotationPlugin = function(options) {
    this.options = options === undefined ? {} : options;
    if (this.options.display === undefined) {
      this.options.display = true;
    }
    this.annotations = [];
  };
  sigplot.AnnotationPlugin.prototype = {init:function(plot) {
    this.plot = plot;
  }, menu:function() {
    var _display_handler = function(self) {
      return function() {
        self.options.display = !self.options.display;
        self.plot.redraw();
      };
    }(this);
    var _clearall_handler = function(self) {
      return function() {
        self.annotations = [];
        self.plot.redraw();
      };
    }(this);
    return{text:"Annotations...", menu:{title:"ANNOTATIONS", items:[{text:"Display", checked:this.options.display, style:"checkbox", handler:_display_handler}, {text:"Clear All", handler:_clearall_handler}]}};
  }, add_annotation:function(annotation) {
    this.annotations.push(annotation);
    this.plot.redraw();
    return this.annotations.length;
  }, clear_annotations:function() {
    this.annotations = [];
    this.plot.redraw();
  }, refresh:function(canvas) {
    if (!this.options.display) {
      return;
    }
    var Gx = this.plot._Gx;
    var Mx = this.plot._Mx;
    var ctx = canvas.getContext("2d");
    for (var i = 0;i < this.annotations.length;i++) {
      var annotation = this.annotations[i];
      var pxl = {x:annotation.x, y:annotation.y};
      if (annotation.absolute_placement === true) {
        pxl.x += Mx.l;
        pxl.y += Mx.t;
      } else {
        pxl = mx.real_to_pixel(Mx, pxl.x, pxl.y);
        pxl.y += Mx.t;
      }
      if (annotation.value instanceof HTMLImageElement || (annotation.value instanceof HTMLCanvasElement || annotation.value instanceof HTMLVideoElement)) {
        ctx.drawImage(annotation.value, pxl.x, pxl.y);
      } else {
        ctx.save();
        ctx.font = "bold italic 20px new century schoolbook";
        ctx.globalAlpha = 1;
        ctx.fillStyle = Mx.fg;
        if (annotation.font) {
          ctx.font = annotation.font;
        }
        ctx.fillText(annotation.value, pxl.x, pxl.y);
        ctx.restore();
      }
    }
  }, dispose:function() {
    this.plot = undefined;
    this.annotations = undefined;
  }};
})(window.sigplot = window.sigplot || {}, mx, m);
(function(sigplot, mx, m, undefined) {
  sigplot.SliderPlugin = function(options) {
    this.options = options !== undefined ? options : {};
    if (this.options.display === undefined) {
      this.options.display = true;
    }
    if (this.options.style === undefined) {
      this.options.style = {};
    }
    if (this.options.direction === undefined) {
      this.options.direction = "vertical";
    }
    this.position = undefined;
    this.location = undefined;
  };
  sigplot.SliderPlugin.prototype = {init:function(plot) {
    this.plot = plot;
    var Mx = plot._Mx;
    var self = this;
    this.onmousemove = function(evt) {
      if (self.location === undefined) {
        return;
      }
      if (self.options.prevent_drag) {
        return;
      }
      if (evt.xpos < Mx.l || evt.xpos > Mx.r) {
        self.set_highlight(false);
        return;
      }
      if (evt.ypos > Mx.b || evt.ypos < Mx.t) {
        self.set_highlight(false);
        return;
      }
      var lineWidth = self.options.style.lineWidth !== undefined ? self.options.style.lineWidth : 1;
      if (!self.dragging) {
        if (Mx.warpbox) {
          return;
        }
        if (self.options.direction === "vertical") {
          if (Math.abs(self.location - evt.xpos) < lineWidth + 5) {
            self.set_highlight(true);
          } else {
            self.set_highlight(false);
          }
        } else {
          if (self.options.direction === "horizontal") {
            if (Math.abs(self.location - evt.ypos) < lineWidth + 5) {
              self.set_highlight(true);
            } else {
              self.set_highlight(false);
            }
          } else {
            if (self.options.direction === "both") {
              if (Math.abs(self.location.x - evt.xpos) < lineWidth + 5 && Math.abs(self.location.y - evt.ypos) < lineWidth + 5) {
                self.set_highlight(true);
              } else {
                self.set_highlight(false);
              }
            }
          }
        }
        return;
      }
      var pos = mx.pixel_to_real(Mx, evt.xpos, evt.ypos);
      if (self.options.direction === "vertical") {
        self.location = evt.xpos;
        self.position = pos.x;
      } else {
        if (self.options.direction === "horizontal") {
          self.location = evt.ypos;
          self.position = pos.y;
        } else {
          if (self.options.direction === "both") {
            self.location.x = evt.xpos;
            self.position.x = pos.x;
            self.location.y = evt.ypos;
            self.position.y = pos.y;
          }
        }
      }
      self.plot.redraw();
      evt.preventDefault();
    };
    this.plot.addListener("mmove", this.onmousemove);
    this.onmousedown = function(evt) {
      if (self.location === undefined) {
        return;
      }
      if (self.options.prevent_drag) {
        return;
      }
      if (evt.xpos < Mx.l || evt.xpos > Mx.r) {
        return;
      }
      if (evt.ypos > Mx.b || evt.ypos < Mx.t) {
        return;
      }
      var lineWidth = self.options.style.lineWidth !== undefined ? self.options.style.lineWidth : 1;
      if (self.options.direction === "vertical") {
        if (Math.abs(self.location - evt.xpos) < lineWidth + 5) {
          self.dragging = true;
          evt.preventDefault();
        }
      } else {
        if (self.options.direction === "horizontal") {
          if (Math.abs(self.location - evt.ypos) < lineWidth + 5) {
            self.dragging = true;
            evt.preventDefault();
          }
        } else {
          if (self.options.direction === "both") {
            if (Math.abs(self.location.x - evt.xpos) < lineWidth + 5 && Math.abs(self.location.y - evt.ypos) < lineWidth + 5) {
              self.dragging = true;
              evt.preventDefault();
            }
          }
        }
      }
    };
    this.plot.addListener("mdown", this.onmousedown);
    this.onmouseup = function(evt) {
      if (!self.dragging) {
        return;
      }
      self.dragging = false;
      var evt = document.createEvent("Event");
      evt.source = self;
      evt.initEvent("slidertag", true, true);
      if (self.options.direction === "both") {
        evt.location = self.location ? JSON.parse(JSON.stringify(self.location)) : undefined;
        evt.position = self.position ? JSON.parse(JSON.stringify(self.position)) : undefined;
      } else {
        evt.location = self.location;
        evt.position = self.position;
      }
      var canceled = !mx.dispatchEvent(Mx, evt);
      var evt = document.createEvent("Event");
      evt.initEvent("sliderdrag", true, true);
      if (self.options.direction === "both") {
        evt.location = self.location ? JSON.parse(JSON.stringify(self.location)) : undefined;
        evt.position = self.position ? JSON.parse(JSON.stringify(self.position)) : undefined;
      } else {
        evt.location = self.location;
        evt.position = self.position;
      }
      var canceled = !mx.dispatchEvent(Mx, evt);
    };
    document.addEventListener("mouseup", this.onmouseup, false);
  }, addListener:function(what, callback) {
    var Mx = this.plot._Mx;
    var self = this;
    var wrapped_cb = function(evt) {
      if (evt.source === self) {
        return callback(evt);
      }
    };
    mx.addEventListener(Mx, what, wrapped_cb, false);
  }, removeListener:function(what, callback) {
    var Mx = this.plot._Mx;
    mx.removeEventListener(Mx, what, callback, false);
  }, set_highlight:function(ishighlight) {
    if (ishighlight !== this.highlight) {
      this.highlight = ishighlight;
      this.plot.redraw();
    }
  }, set_position:function(position) {
    if (this.dragging) {
      return;
    }
    if (this.options.direction === "both") {
      if (this.position !== undefined && (this.position.x === position.x && this.position.y === position.y)) {
        return;
      }
    } else {
      if (this.position === position) {
        return;
      }
    }
    this.set_highlight(false);
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
    } else {
      if (this.options.direction === "horizontal") {
        this.location = pxl.y;
      } else {
        if (this.options.direction === "both") {
          this.location = {x:pxl.x, y:pxl.y};
        }
      }
    }
    var evt = document.createEvent("Event");
    evt.initEvent("slidertag", true, true);
    if (this.options.direction === "both") {
      evt.location = this.location ? JSON.parse(JSON.stringify(this.location)) : undefined;
      evt.position = this.position ? JSON.parse(JSON.stringify(this.position)) : undefined;
    } else {
      evt.location = this.location;
      evt.position = this.position;
    }
    var canceled = !mx.dispatchEvent(Mx, evt);
    if (canceled) {
      return;
    }
    this.plot.redraw();
  }, set_location:function(location) {
    if (this.dragging) {
      return;
    }
    if (this.options.direction === "both") {
      if (this.location !== undefined && (this.location.x === location.x && this.location.y === location.y)) {
        return;
      }
    } else {
      if (this.location === location) {
        return;
      }
    }
    this.set_highlight(false);
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
    } else {
      if (this.options.direction === "horizontal") {
        this.position = pos.y;
      } else {
        if (this.options.direction === "both") {
          this.position = {x:pos.x, y:pos.y};
        }
      }
    }
    var evt = document.createEvent("Event");
    evt.initEvent("slidertag", true, true);
    if (this.options.direction === "both") {
      evt.location = this.location ? JSON.parse(JSON.stringify(this.location)) : undefined;
      evt.position = this.position ? JSON.parse(JSON.stringify(this.position)) : undefined;
    } else {
      evt.location = this.location;
      evt.position = this.position;
    }
    var canceled = !mx.dispatchEvent(Mx, evt);
    if (canceled) {
      return;
    }
    this.plot.redraw();
  }, get_position:function() {
    return this.position;
  }, get_location:function() {
    return this.location;
  }, refresh:function(canvas) {
    if (!this.options.display) {
      return;
    }
    if (this.position === undefined) {
      return;
    }
    var Mx = this.plot._Mx;
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = this.options.style.lineWidth !== undefined ? this.options.style.lineWidth : 1;
    ctx.lineCap = this.options.style.lineCap !== undefined ? this.options.style.lineCap : "square";
    ctx.strokeStyle = this.options.style.strokeStyle !== undefined ? this.options.style.strokeStyle : Mx.fg;
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
      if (pxl.x < Mx.l || pxl.x > Mx.r) {
        return;
      }
      this.location = pxl.x;
    } else {
      if (this.options.direction === "horizontal") {
        if (pxl.y < Mx.t || pxl.y > Mx.b) {
          return;
        }
        this.location = pxl.y;
      } else {
        if (this.options.direction === "both") {
          if (pxl.x < Mx.l || (pxl.x > Mx.r || (pxl.y < Mx.t || pxl.y > Mx.b))) {
            return;
          }
          this.location.x = pxl.x;
          this.location.y = pxl.y;
        }
      }
    }
    if (this.options.direction === "vertical") {
      ctx.beginPath();
      ctx.moveTo(this.location + 0.5, Mx.t);
      ctx.lineTo(this.location + 0.5, Mx.b);
      ctx.stroke();
    } else {
      if (this.options.direction === "horizontal") {
        ctx.beginPath();
        ctx.moveTo(Mx.l, this.location + 0.5);
        ctx.lineTo(Mx.r, this.location + 0.5);
        ctx.stroke();
      } else {
        if (this.options.direction === "both") {
          ctx.beginPath();
          ctx.moveTo(Mx.l, this.location.y + 0.5);
          ctx.lineTo(Mx.r, this.location.y + 0.5);
          ctx.closePath();
          ctx.moveTo(this.location.x + 0.5, Mx.t);
          ctx.lineTo(this.location.x + 0.5, Mx.b);
          ctx.stroke();
        }
      }
    }
  }, dispose:function() {
    this.plot.removeListener("mmove", this.onmousemove);
    document.removeEventListener("mouseup", this.onmouseup, false);
    this.plot = undefined;
    this.position = undefined;
  }};
})(window.sigplot = window.sigplot || {}, mx, m);
(function(sigplot, mx, m, undefined) {
  sigplot.AccordionPlugin = function(options) {
    this.options = options !== undefined ? options : {};
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
    this.center = undefined;
    this.width = undefined;
    this.center_location = undefined;
    this.loc_1 = undefined;
    this.loc_2 = undefined;
  };
  sigplot.AccordionPlugin.prototype = {init:function(plot) {
    this.plot = plot;
    var Mx = this.plot._Mx;
    var self = this;
    this.onmousemove = function(evt) {
      if (self.center_location === undefined) {
        return;
      }
      if (self.options.prevent_drag) {
        return;
      }
      if (evt.xpos < Mx.l || evt.xpos > Mx.r) {
        self.set_highlight(false);
        return;
      }
      if (evt.ypos > Mx.b || evt.ypos < Mx.t) {
        self.set_highlight(false);
        return;
      }
      var lineWidth = self.options.center_line_style.lineWidth !== undefined ? self.options.center_line_style.lineWidth : 1;
      var elineWidth = self.options.edge_line_style.lineWidth !== undefined ? self.options.edge_line_style.lineWidth : 1;
      if (!self.dragging && !self.edge_dragging) {
        if (Mx.warpbox) {
          return;
        }
        if (self.options.direction === "vertical") {
          if (Math.abs(self.center_location - evt.xpos) < lineWidth + 5) {
            self.set_highlight(true);
          } else {
            self.set_highlight(false);
          }
          if (Math.abs(self.loc_1 - evt.xpos) < elineWidth + 5 || Math.abs(self.loc_2 - evt.xpos) < elineWidth + 5) {
            self.set_edge_highlight(true);
          } else {
            self.set_edge_highlight(false);
          }
        } else {
          if (self.options.direction === "horizontal") {
            if (Math.abs(self.center_location - evt.ypos) < lineWidth + 5) {
              self.set_highlight(true);
            } else {
              self.set_highlight(false);
            }
            if (Math.abs(self.loc_1 - evt.ypos) < elineWidth + 5 || Math.abs(self.loc_2 - evt.ypos) < elineWidth + 5) {
              self.set_edge_highlight(true);
            } else {
              self.set_edge_highlight(false);
            }
          }
        }
        return;
      }
      if (self.dragging) {
        var pos = mx.pixel_to_real(Mx, evt.xpos, evt.ypos);
        if (self.options.direction === "vertical") {
          self.center_location = evt.xpos;
          self.center = pos.x;
        } else {
          if (self.options.direction === "horizontal") {
            self.center_location = evt.ypos;
            self.center = pos.y;
          }
        }
      }
      if (self.edge_dragging) {
        var pos = mx.pixel_to_real(Mx, evt.xpos, evt.ypos);
        if (self.options.direction === "vertical") {
          self.width = 2 * Math.abs(self.center - pos.x);
        } else {
          if (self.options.direction === "horizontal") {
            self.width = 2 * Math.abs(self.center - pos.y);
          }
        }
      }
      if (self.plot) {
        self.plot.refresh();
      }
      evt.preventDefault();
    };
    this.plot.addListener("mmove", this.onmousemove);
    this.onmousedown = function(evt) {
      if (self.center_location === undefined) {
        return;
      }
      if (evt.xpos < Mx.l || evt.xpos > Mx.r) {
        return;
      }
      if (evt.ypos > Mx.b || evt.ypos < Mx.t) {
        return;
      }
      var lineWidth = self.options.center_line_style.lineWidth !== undefined ? self.options.center_line_style.lineWidth : 1;
      var elineWidth = self.options.edge_line_style.lineWidth !== undefined ? self.options.edge_line_style.lineWidth : 1;
      if (self.options.direction === "vertical") {
        if (Math.abs(self.loc_1 - evt.xpos) < elineWidth + 5 || Math.abs(self.loc_2 - evt.xpos) < elineWidth + 5) {
          self.edge_dragging = true;
          evt.preventDefault();
        } else {
          if (Math.abs(self.center_location - evt.xpos) < lineWidth + 5) {
            self.dragging = true;
            evt.preventDefault();
          }
        }
      } else {
        if (self.options.direction === "horizontal") {
          if (Math.abs(self.loc_1 - evt.ypos) < elineWidth + 5 || Math.abs(self.loc_2 - evt.ypos) < elineWidth + 5) {
            self.edge_dragging = true;
            evt.preventDefault();
          } else {
            if (Math.abs(self.center_location - evt.ypos) < lineWidth + 5) {
              self.dragging = true;
              evt.preventDefault();
            }
          }
        }
      }
    };
    this.plot.addListener("mdown", this.onmousedown);
    this.onmouseup = function(evt) {
      self.dragging = false;
      self.edge_dragging = false;
      var evt = document.createEvent("Event");
      evt.initEvent("accordiontag", true, true);
      evt.center = self.center;
      evt.width = self.width;
      var canceled = !mx.dispatchEvent(Mx, evt);
    };
    document.addEventListener("mouseup", this.onmouseup, false);
  }, addListener:function(what, callback) {
    var Mx = this.plot._Mx;
    mx.addEventListener(Mx, what, callback, false);
  }, removeListener:function(what, callback) {
    var Mx = this.plot._Mx;
    mx.removeEventListener(Mx, what, callback, false);
  }, set_highlight:function(ishighlight) {
    if (ishighlight !== this.highlight) {
      this.highlight = ishighlight;
      this.plot.redraw();
    }
  }, set_edge_highlight:function(ishighlight) {
    if (ishighlight !== this.edge_highlight) {
      this.edge_highlight = ishighlight;
      this.plot.redraw();
    }
  }, set_center:function(center) {
    this.center = center;
    if (this.plot) {
      var Mx = this.plot._Mx;
      var evt = document.createEvent("Event");
      evt.initEvent("accordiontag", true, true);
      evt.center = this.center;
      evt.width = this.width;
      var canceled = !mx.dispatchEvent(Mx, evt);
      if (canceled) {
        return;
      }
      this.plot.redraw();
    }
  }, set_width:function(width) {
    this.width = width;
    if (this.plot) {
      var Mx = this.plot._Mx;
      var evt = document.createEvent("Event");
      evt.initEvent("accordiontag", true, true);
      evt.center = this.center;
      evt.width = this.width;
      var canceled = !mx.dispatchEvent(Mx, evt);
      if (canceled) {
        return;
      }
      this.plot.redraw();
    }
  }, get_center:function() {
    return this.center;
  }, get_width:function() {
    return this.width;
  }, refresh:function(canvas) {
    if (!this.plot) {
      return;
    }
    if (!this.options.display) {
      return;
    }
    if (this.center === undefined || this.width === undefined) {
      return;
    }
    var Mx = this.plot._Mx;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var center_pxl = mx.real_to_pixel(Mx, this.center, this.center);
    var pxl_1 = mx.real_to_pixel(Mx, this.center - this.width / 2, this.center - this.width / 2);
    var pxl_2 = mx.real_to_pixel(Mx, this.center + this.width / 2, this.center + this.width / 2);
    if (this.options.direction === "vertical") {
      this.center_location = center_pxl.x;
      this.loc_1 = Math.max(Mx.l, pxl_1.x);
      this.loc_2 = Math.min(Mx.r, pxl_2.x);
    } else {
      if (this.options.direction === "horizontal") {
        this.center_location = center_pxl.y;
        this.loc_1 = Math.max(Mx.t, pxl_2.y);
        this.loc_2 = Math.min(Mx.b, pxl_1.y);
      }
    }
    if (this.options.shade_area && this.loc_2 - this.loc_1 > 0) {
      var oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.options.fill_style.opacity !== undefined ? this.options.fill_style.opacity : 0.4;
      ctx.fillStyle = this.options.fill_style.fillStyle !== undefined ? this.options.fill_style.fillStyle : Mx.hi;
      if (this.options.direction === "vertical") {
        ctx.fillRect(this.loc_1, Mx.t, this.loc_2 - this.loc_1, Mx.b - Mx.t);
      } else {
        if (this.options.direction === "horizontal") {
          ctx.fillRect(Mx.l, this.loc_1, Mx.r - Mx.l, this.loc_2 - this.loc_1);
        }
      }
      ctx.globalAlpha = oldAlpha;
    }
    if (this.options.draw_edge_lines || (this.edge_highlight || this.edge_dragging)) {
      ctx.lineWidth = this.options.edge_line_style.lineWidth !== undefined ? this.options.edge_line_style.lineWidth : 1;
      ctx.lineCap = this.options.edge_line_style.lineCap !== undefined ? this.options.edge_line_style.lineCap : "square";
      ctx.strokeStyle = this.options.edge_line_style.strokeStyle !== undefined ? this.options.edge_line_style.strokeStyle : Mx.fg;
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
      } else {
        if (this.options.direction === "horizontal") {
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
    }
    if (this.options.draw_center_line) {
      ctx.lineWidth = this.options.center_line_style.lineWidth !== undefined ? this.options.center_line_style.lineWidth : 1;
      ctx.lineCap = this.options.center_line_style.lineCap !== undefined ? this.options.center_line_style.lineCap : "square";
      ctx.strokeStyle = this.options.center_line_style.strokeStyle !== undefined ? this.options.center_line_style.strokeStyle : Mx.fg;
      if (this.dragging || this.highlight) {
        ctx.lineWidth = Math.ceil(ctx.lineWidth * 1.2);
      }
      if (this.options.direction === "vertical") {
        ctx.beginPath();
        ctx.moveTo(this.center_location + 0.5, Mx.t);
        ctx.lineTo(this.center_location + 0.5, Mx.b);
        ctx.stroke();
      } else {
        if (this.options.direction === "horizontal") {
          ctx.beginPath();
          ctx.moveTo(Mx.l, this.center_location + 0.5);
          ctx.lineTo(Mx.r, this.center_location + 0.5);
          ctx.stroke();
        }
      }
    }
  }, dispose:function() {
    this.plot = undefined;
    this.center = undefined;
    this.center_location = undefined;
    this.width = undefined;
  }};
})(window.sigplot = window.sigplot || {}, mx, m);
(function(sigplot, mx, m, undefined) {
  sigplot.BoxesPlugin = function(options) {
    this.options = options === undefined ? {} : options;
    if (this.options.display === undefined) {
      this.options.display = true;
    }
    this.boxes = [];
  };
  sigplot.BoxesPlugin.prototype = {init:function(plot) {
    this.plot = plot;
  }, menu:function() {
    var _display_handler = function(self) {
      return function() {
        self.options.display = !self.options.display;
        self.plot.redraw();
      };
    }(this);
    var _clearall_handler = function(self) {
      return function() {
        self.boxes = [];
        self.plot.redraw();
      };
    }(this);
    return{text:"Annotations...", menu:{title:"ANNOTATIONS", items:[{text:"Display", checked:this.options.display, style:"checkbox", handler:_display_handler}, {text:"Clear All", handler:_clearall_handler}]}};
  }, add_box:function(box) {
    this.boxes.push(box);
    this.plot.redraw();
    return this.boxes.length;
  }, refresh:function(canvas) {
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
    for (var i = 0;i < this.boxes.length;i++) {
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
      ctx.strokeRect(x, y, w, h);
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
        y = y - Mx.text_h / 3;
        var text_w = ctx.measureText(box.text).width;
        if (x - text_w < Mx.l) {
          x = x + w;
        }
        ctx.fillText(box.text, x, y);
        ctx.restore();
      }
    }
    ctx.restore();
  }, dispose:function() {
    this.plot = undefined;
    this.boxes = undefined;
  }};
})(window.sigplot = window.sigplot || {}, mx, m);
(function(sigplot, mx, m, undefined) {
  sigplot.PlaybackControlsPlugin = function(options) {
    this.options = options === undefined ? {} : options;
    if (this.options.display === undefined) {
      this.options.display = true;
    }
    this.options.size = this.options.size || 25;
    this.options.lineWidth = this.options.lineWidth || 2;
    this.state = "paused";
    this.highlight = false;
  };
  sigplot.PlaybackControlsPlugin.prototype = {init:function(plot) {
    this.plot = plot;
    var self = this;
    var Mx = this.plot._Mx;
    this.onmousemove = function(evt) {
      if (Mx.warpbox) {
        return;
      }
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
      }
      if (self.ismouseover(evt.xpos, evt.ypos)) {
        evt.preventDefault();
      }
    };
    this.plot.addListener("mdown", this.onmousedown);
    this.onmouseclick = function(evt) {
      if (Mx.warpbox) {
        return;
      }
      if (self.ismouseover(evt.xpos, evt.ypos)) {
        self.toggle();
        evt.preventDefault();
      }
    };
    this.plot.addListener("mclick", this.onmouseclick);
  }, set_highlight:function(ishighlight) {
    if (ishighlight !== this.highlight) {
      this.highlight = ishighlight;
      this.plot.redraw();
    }
  }, toggle:function(new_state) {
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
        var evt = document.createEvent("Event");
        evt.initEvent("playbackevt", true, true);
        evt.state = new_state;
        var canceled = !mx.dispatchEvent(Mx, evt);
        if (!canceled) {
          this.state = new_state;
        }
        this.plot.redraw();
      }
    }
  }, addListener:function(what, callback) {
    var Mx = this.plot._Mx;
    mx.addEventListener(Mx, what, callback, false);
  }, removeListener:function(what, callback) {
    var Mx = this.plot._Mx;
    mx.removeEventListener(Mx, what, callback, false);
  }, ismouseover:function(xpos, ypos) {
    var position = this.position();
    var distance_from_ctr = Math.pow(xpos - position.x, 2) + Math.pow(ypos - position.y, 2);
    var R = this.options.size / 2;
    return distance_from_ctr < Math.pow(R, 2);
  }, position:function() {
    if (this.options.position) {
      return this.options.position;
    } else {
      if (this.plot) {
        var Mx = this.plot._Mx;
        var R = this.options.size / 2;
        return{x:Mx.l + R + this.options.lineWidth + 1, y:Mx.t + R + this.options.lineWidth + 1};
      } else {
        return{x:null, y:null};
      }
    }
  }, refresh:function(canvas) {
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
      var p1 = {x:R * 0.8, y:R * 0.56};
      var p2 = {x:R * 1.45, y:R};
      var p3 = {x:R * 0.8, y:R * 1.45};
      p1.x += position.x - R;
      p2.x += position.x - R;
      p3.x += position.x - R;
      p1.y += position.y - R;
      p2.y += position.y - R;
      p3.y += position.y - R;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fillStyle = this.options.strokeStyle || Mx.fg;
      ctx.fill();
    } else {
      ctx.lineCap = "round";
      ctx.lineWidth = Math.floor(Math.min(1, this.options.size / 8));
      var p1 = {x:R * 0.8, y:R / 2};
      var p2 = {x:R * 0.8, y:R * 1.5};
      p1.x += position.x - R;
      p2.x += position.x - R;
      p1.y += position.y - R;
      p2.y += position.y - R;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();
      ctx.stroke();
      var p1 = {x:R + R / 5, y:R / 2};
      var p2 = {x:R + R / 5, y:R * 1.5};
      p1.x += position.x - R;
      p2.x += position.x - R;
      p1.y += position.y - R;
      p2.y += position.y - R;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }, dispose:function() {
    this.plot = undefined;
    this.boxes = undefined;
  }};
})(window.sigplot = window.sigplot || {}, mx, m);

