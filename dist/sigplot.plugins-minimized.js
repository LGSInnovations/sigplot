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
(function(k,e,n,d){k.AnnotationPlugin=function(a){this.options=a===d?{}:a;this.options.display===d&&(this.options.display=!0);this.annotations=[]};k.AnnotationPlugin.prototype={init:function(a){this.plot=a},menu:function(){var a=function(b){return function(){b.options.display=!b.options.display;b.plot.redraw()}}(this),c=function(b){return function(){b.annotations=[];b.plot.redraw()}}(this);return{text:"Annotations...",menu:{title:"ANNOTATIONS",items:[{text:"Display",checked:this.options.display,style:"checkbox",
handler:a},{text:"Clear All",handler:c}]}}},add_annotation:function(a){this.annotations.push(a);this.plot.redraw();return this.annotations.length},clear_annotations:function(){this.annotations=[];this.plot.redraw()},refresh:function(a){if(this.options.display){var c=this.plot._Mx;a=a.getContext("2d");for(var b=0;b<this.annotations.length;b++){var l=this.annotations[b],d={x:l.x,y:l.y};!0===l.absolute_placement?d.x+=c.l:d=e.real_to_pixel(c,d.x,d.y);d.y+=c.t;l.value instanceof HTMLImageElement||l.value instanceof
HTMLCanvasElement||l.value instanceof HTMLVideoElement?a.drawImage(l.value,d.x,d.y):(a.save(),a.font="bold italic 20px new century schoolbook",a.globalAlpha=1,a.fillStyle=c.fg,l.font&&(a.font=l.font),a.fillText(l.value,d.x,d.y),a.restore())}}},dispose:function(){this.annotations=this.plot=d}}})(window.sigplot=window.sigplot||{},mx,m);
(function(k,e,n,d){k.SliderPlugin=function(a){this.options=a!==d?a:{};this.options.display===d&&(this.options.display=!0);this.options.style===d&&(this.options.style={});this.options.direction===d&&(this.options.direction="vertical");this.location=this.position=d};k.SliderPlugin.prototype={init:function(a){this.plot=a;var c=a._Mx,b=this;this.onmousemove=function(a){if(b.location!==d&&!b.options.prevent_drag)if(a.xpos<c.l||a.xpos>c.r)b.set_highlight(!1);else if(a.ypos>c.b||a.ypos<c.t)b.set_highlight(!1);
else{var h=b.options.style.lineWidth!==d?b.options.style.lineWidth:1;b.dragging?(h=e.pixel_to_real(c,a.xpos,a.ypos),"vertical"===b.options.direction?(b.location=a.xpos,b.position=h.x):"horizontal"===b.options.direction?(b.location=a.ypos,b.position=h.y):"both"===b.options.direction&&(b.location.x=a.xpos,b.position.x=h.x,b.location.y=a.ypos,b.position.y=h.y),b.plot.redraw(),a.preventDefault()):c.warpbox||("vertical"===b.options.direction?Math.abs(b.location-a.xpos)<h+5?b.set_highlight(!0):b.set_highlight(!1):
"horizontal"===b.options.direction?Math.abs(b.location-a.ypos)<h+5?b.set_highlight(!0):b.set_highlight(!1):"both"===b.options.direction&&(Math.abs(b.location.x-a.xpos)<h+5&&Math.abs(b.location.y-a.ypos)<h+5?b.set_highlight(!0):b.set_highlight(!1)))}};this.plot.addListener("mmove",this.onmousemove);this.onmousedown=function(a){if(b.location!==d&&!(b.options.prevent_drag||a.xpos<c.l||a.xpos>c.r||a.ypos>c.b||a.ypos<c.t)){var h=b.options.style.lineWidth!==d?b.options.style.lineWidth:1;"vertical"===b.options.direction?
Math.abs(b.location-a.xpos)<h+5&&(b.dragging=!0,a.preventDefault()):"horizontal"===b.options.direction?Math.abs(b.location-a.ypos)<h+5&&(b.dragging=!0,a.preventDefault()):"both"===b.options.direction&&Math.abs(b.location.x-a.xpos)<h+5&&Math.abs(b.location.y-a.ypos)<h+5&&(b.dragging=!0,a.preventDefault())}};this.plot.addListener("mdown",this.onmousedown);this.onmouseup=function(a){b.dragging&&(b.dragging=!1,a=document.createEvent("Event"),a.source=b,a.initEvent("slidertag",!0,!0),"both"===b.options.direction?
(a.location=b.location?JSON.parse(JSON.stringify(b.location)):d,a.position=b.position?JSON.parse(JSON.stringify(b.position)):d):(a.location=b.location,a.position=b.position),e.dispatchEvent(c,a),a=document.createEvent("Event"),a.initEvent("sliderdrag",!0,!0),"both"===b.options.direction?(a.location=b.location?JSON.parse(JSON.stringify(b.location)):d,a.position=b.position?JSON.parse(JSON.stringify(b.position)):d):(a.location=b.location,a.position=b.position),e.dispatchEvent(c,a))};document.addEventListener("mouseup",
this.onmouseup,!1)},addListener:function(a,c){var b=this;e.addEventListener(this.plot._Mx,a,function(a){if(a.source===b)return c(a)},!1)},removeListener:function(a,c){e.removeEventListener(this.plot._Mx,a,c,!1)},set_highlight:function(a){a!==this.highlight&&(this.highlight=a,this.plot.redraw())},set_position:function(a){if(!this.dragging){if("both"===this.options.direction){if(this.position!==d&&this.position.x===a.x&&this.position.y===a.y)return}else if(this.position===a)return;this.set_highlight(!1);
var c=this.plot._Mx;this.position="both"===this.options.direction?a?JSON.parse(JSON.stringify(a)):d:a;a="both"===this.options.direction?e.real_to_pixel(c,this.position.x,this.position.y):e.real_to_pixel(c,this.position,this.position);"vertical"===this.options.direction?this.location=a.x:"horizontal"===this.options.direction?this.location=a.y:"both"===this.options.direction&&(this.location={x:a.x,y:a.y});a=document.createEvent("Event");a.initEvent("slidertag",!0,!0);"both"===this.options.direction?
(a.location=this.location?JSON.parse(JSON.stringify(this.location)):d,a.position=this.position?JSON.parse(JSON.stringify(this.position)):d):(a.location=this.location,a.position=this.position);e.dispatchEvent(c,a)&&this.plot.redraw()}},set_location:function(a){if(!this.dragging){if("both"===this.options.direction){if(this.location!==d&&this.location.x===a.x&&this.location.y===a.y)return}else if(this.location===a)return;this.set_highlight(!1);var c=this.plot._Mx;this.location="both"===this.options.direction?
a?JSON.parse(JSON.stringify(a)):d:a;a="both"===this.options.direction?e.pixel_to_real(c,a.x,a.y):e.pixel_to_real(c,a,a);"vertical"===this.options.direction?this.position=a.x:"horizontal"===this.options.direction?this.position=a.y:"both"===this.options.direction&&(this.position={x:a.x,y:a.y});a=document.createEvent("Event");a.initEvent("slidertag",!0,!0);"both"===this.options.direction?(a.location=this.location?JSON.parse(JSON.stringify(this.location)):d,a.position=this.position?JSON.parse(JSON.stringify(this.position)):
d):(a.location=this.location,a.position=this.position);e.dispatchEvent(c,a)&&this.plot.redraw()}},get_position:function(){return this.position},get_location:function(){return this.location},refresh:function(a){if(this.options.display&&this.position!==d){var c=this.plot._Mx;a=a.getContext("2d");a.lineWidth=this.options.style.lineWidth!==d?this.options.style.lineWidth:1;a.lineCap=this.options.style.lineCap!==d?this.options.style.lineCap:"square";a.strokeStyle=this.options.style.strokeStyle!==d?this.options.style.strokeStyle:
c.fg;if(this.dragging||this.highlight)a.lineWidth=Math.ceil(1.2*a.lineWidth);var b;b="both"===this.options.direction?e.real_to_pixel(c,this.position.x,this.position.y):e.real_to_pixel(c,this.position,this.position);if("vertical"===this.options.direction){if(b.x<c.l||b.x>c.r)return;this.location=b.x}else if("horizontal"===this.options.direction){if(b.y<c.t||b.y>c.b)return;this.location=b.y}else if("both"===this.options.direction){if(b.x<c.l||b.x>c.r||b.y<c.t||b.y>c.b)return;this.location.x=b.x;this.location.y=
b.y}"vertical"===this.options.direction?(a.beginPath(),a.moveTo(this.location+0.5,c.t),a.lineTo(this.location+0.5,c.b),a.stroke()):"horizontal"===this.options.direction?(a.beginPath(),a.moveTo(c.l,this.location+0.5),a.lineTo(c.r,this.location+0.5),a.stroke()):"both"===this.options.direction&&(a.beginPath(),a.moveTo(c.l,this.location.y+0.5),a.lineTo(c.r,this.location.y+0.5),a.closePath(),a.moveTo(this.location.x+0.5,c.t),a.lineTo(this.location.x+0.5,c.b),a.stroke())}},dispose:function(){this.plot.removeListener("mmove",
this.onmousemove);document.removeEventListener("mouseup",this.onmouseup,!1);this.position=this.plot=d}}})(window.sigplot=window.sigplot||{},mx,m);
(function(k,e,n,d){k.AccordionPlugin=function(a){this.options=a!==d?a:{};this.options.display===d&&(this.options.display=!0);this.options.center_line_style===d&&(this.options.center_line_style={});this.options.edge_line_style===d&&(this.options.edge_line_style={});this.options.fill_style===d&&(this.options.fill_style={});this.options.direction===d&&(this.options.direction="vertical");this.loc_2=this.loc_1=this.center_location=this.width=this.center=d};k.AccordionPlugin.prototype={init:function(a){this.plot=
a;var c=this.plot._Mx,b=this;this.onmousemove=function(a){if(b.center_location!==d&&!b.options.prevent_drag)if(a.xpos<c.l||a.xpos>c.r)b.set_highlight(!1);else if(a.ypos>c.b||a.ypos<c.t)b.set_highlight(!1);else{var h=b.options.center_line_style.lineWidth!==d?b.options.center_line_style.lineWidth:1,f=b.options.edge_line_style.lineWidth!==d?b.options.edge_line_style.lineWidth:1;b.dragging||b.edge_dragging?(b.dragging&&(h=e.pixel_to_real(c,a.xpos,a.ypos),"vertical"===b.options.direction?(b.center_location=
a.xpos,b.center=h.x):"horizontal"===b.options.direction&&(b.center_location=a.ypos,b.center=h.y)),b.edge_dragging&&(h=e.pixel_to_real(c,a.xpos,a.ypos),"vertical"===b.options.direction?b.width=2*Math.abs(b.center-h.x):"horizontal"===b.options.direction&&(b.width=2*Math.abs(b.center-h.y))),b.plot&&b.plot.refresh(),a.preventDefault()):c.warpbox||("vertical"===b.options.direction?(Math.abs(b.center_location-a.xpos)<h+5?b.set_highlight(!0):b.set_highlight(!1),Math.abs(b.loc_1-a.xpos)<f+5||Math.abs(b.loc_2-
a.xpos)<f+5?b.set_edge_highlight(!0):b.set_edge_highlight(!1)):"horizontal"===b.options.direction&&(Math.abs(b.center_location-a.ypos)<h+5?b.set_highlight(!0):b.set_highlight(!1),Math.abs(b.loc_1-a.ypos)<f+5||Math.abs(b.loc_2-a.ypos)<f+5?b.set_edge_highlight(!0):b.set_edge_highlight(!1)))}};this.plot.addListener("mmove",this.onmousemove);this.onmousedown=function(a){if(b.center_location!==d&&!(a.xpos<c.l||a.xpos>c.r||a.ypos>c.b||a.ypos<c.t)){var h=b.options.center_line_style.lineWidth!==d?b.options.center_line_style.lineWidth:
1,f=b.options.edge_line_style.lineWidth!==d?b.options.edge_line_style.lineWidth:1;"vertical"===b.options.direction?Math.abs(b.loc_1-a.xpos)<f+5||Math.abs(b.loc_2-a.xpos)<f+5?(b.edge_dragging=!0,a.preventDefault()):Math.abs(b.center_location-a.xpos)<h+5&&(b.dragging=!0,a.preventDefault()):"horizontal"===b.options.direction&&(Math.abs(b.loc_1-a.ypos)<f+5||Math.abs(b.loc_2-a.ypos)<f+5?(b.edge_dragging=!0,a.preventDefault()):Math.abs(b.center_location-a.ypos)<h+5&&(b.dragging=!0,a.preventDefault()))}};
this.plot.addListener("mdown",this.onmousedown);this.onmouseup=function(a){b.dragging=!1;b.edge_dragging=!1;a=document.createEvent("Event");a.initEvent("accordiontag",!0,!0);a.center=b.center;a.width=b.width;e.dispatchEvent(c,a)};document.addEventListener("mouseup",this.onmouseup,!1)},addListener:function(a,c){e.addEventListener(this.plot._Mx,a,c,!1)},removeListener:function(a,c){e.removeEventListener(this.plot._Mx,a,c,!1)},set_highlight:function(a){a!==this.highlight&&(this.highlight=a,this.plot.redraw())},
set_edge_highlight:function(a){a!==this.edge_highlight&&(this.edge_highlight=a,this.plot.redraw())},set_center:function(a){this.center=a;if(this.plot){a=this.plot._Mx;var c=document.createEvent("Event");c.initEvent("accordiontag",!0,!0);c.center=this.center;c.width=this.width;e.dispatchEvent(a,c)&&this.plot.redraw()}},set_width:function(a){this.width=a;if(this.plot){a=this.plot._Mx;var c=document.createEvent("Event");c.initEvent("accordiontag",!0,!0);c.center=this.center;c.width=this.width;e.dispatchEvent(a,
c)&&this.plot.redraw()}},get_center:function(){return this.center},get_width:function(){return this.width},refresh:function(a){if(this.plot&&this.options.display&&this.center!==d&&this.width!==d){var c=this.plot._Mx,b=a.getContext("2d");b.clearRect(0,0,a.width,a.height);a=e.real_to_pixel(c,this.center,this.center);var l=e.real_to_pixel(c,this.center-this.width/2,this.center-this.width/2),h=e.real_to_pixel(c,this.center+this.width/2,this.center+this.width/2);"vertical"===this.options.direction?(this.center_location=
a.x,this.loc_1=Math.max(c.l,l.x),this.loc_2=Math.min(c.r,h.x)):"horizontal"===this.options.direction&&(this.center_location=a.y,this.loc_1=Math.max(c.t,h.y),this.loc_2=Math.min(c.b,l.y));this.options.shade_area&&0<this.loc_2-this.loc_1&&(a=b.globalAlpha,b.globalAlpha=this.options.fill_style.opacity!==d?this.options.fill_style.opacity:0.4,b.fillStyle=this.options.fill_style.fillStyle!==d?this.options.fill_style.fillStyle:c.hi,"vertical"===this.options.direction?b.fillRect(this.loc_1,c.t,this.loc_2-
this.loc_1,c.b-c.t):"horizontal"===this.options.direction&&b.fillRect(c.l,this.loc_1,c.r-c.l,this.loc_2-this.loc_1),b.globalAlpha=a);if(this.options.draw_edge_lines||this.edge_highlight||this.edge_dragging){b.lineWidth=this.options.edge_line_style.lineWidth!==d?this.options.edge_line_style.lineWidth:1;b.lineCap=this.options.edge_line_style.lineCap!==d?this.options.edge_line_style.lineCap:"square";b.strokeStyle=this.options.edge_line_style.strokeStyle!==d?this.options.edge_line_style.strokeStyle:c.fg;
if(this.edge_dragging||this.edge_highlight)b.lineWidth=Math.ceil(1.2*b.lineWidth);"vertical"===this.options.direction?(b.beginPath(),b.moveTo(this.loc_1+0.5,c.t),b.lineTo(this.loc_1+0.5,c.b),b.stroke(),b.beginPath(),b.moveTo(this.loc_2+0.5,c.t),b.lineTo(this.loc_2+0.5,c.b),b.stroke()):"horizontal"===this.options.direction&&(b.beginPath(),b.moveTo(c.l,this.loc_1+0.5),b.lineTo(c.r,this.loc_1+0.5),b.stroke(),b.beginPath(),b.moveTo(c.l,this.loc_2+0.5),b.lineTo(c.r,this.loc_2+0.5),b.stroke())}if(this.options.draw_center_line){b.lineWidth=
this.options.center_line_style.lineWidth!==d?this.options.center_line_style.lineWidth:1;b.lineCap=this.options.center_line_style.lineCap!==d?this.options.center_line_style.lineCap:"square";b.strokeStyle=this.options.center_line_style.strokeStyle!==d?this.options.center_line_style.strokeStyle:c.fg;if(this.dragging||this.highlight)b.lineWidth=Math.ceil(1.2*b.lineWidth);"vertical"===this.options.direction?(b.beginPath(),b.moveTo(this.center_location+0.5,c.t),b.lineTo(this.center_location+0.5,c.b),b.stroke()):
"horizontal"===this.options.direction&&(b.beginPath(),b.moveTo(c.l,this.center_location+0.5),b.lineTo(c.r,this.center_location+0.5),b.stroke())}}},dispose:function(){this.width=this.center_location=this.center=this.plot=d}}})(window.sigplot=window.sigplot||{},mx,m);
(function(k,e,n,d){k.BoxesPlugin=function(a){this.options=a===d?{}:a;this.options.display===d&&(this.options.display=!0);this.boxes=[]};k.BoxesPlugin.prototype={init:function(a){this.plot=a},menu:function(){var a=function(a){return function(){a.options.display=!a.options.display;a.plot.redraw()}}(this),c=function(a){return function(){a.boxes=[];a.plot.redraw()}}(this);return{text:"Annotations...",menu:{title:"ANNOTATIONS",items:[{text:"Display",checked:this.options.display,style:"checkbox",handler:a},
{text:"Clear All",handler:c}]}}},add_box:function(a){this.boxes.push(a);this.plot.redraw();return this.boxes.length},refresh:function(a){if(this.options.display){var c=this.plot._Mx;a=a.getContext("2d");var b,d,h,f,g,p;a.save();a.beginPath();a.rect(c.l,c.t,c.r-c.l,c.b-c.t);a.clip();for(var k=0;k<this.boxes.length;k++)b=this.boxes[k],!0===b.absolute_placement?(d=b.x+c.l,h=b.y+c.t,f=b.w,g=b.h):(g=e.real_to_pixel(c,b.x,b.y),p=e.real_to_pixel(c,b.x+b.w,b.y+b.h),d=g.x,h=g.y,f=p.x-g.x,g=g.y-p.y),a.strokeStyle=
b.strokeStyle||c.fg,a.lineWidth=b.lineWidth||1,1===a.lineWidth%2&&(d+=0.5,h+=0.5),a.strokeRect(d,h,f,g),b.text&&(a.save(),a.font=b.font||c.text_H+"px Courier New, monospace",a.globalAlpha=1,a.textAlign="end",a.fillStyle=a.strokeStyle,b.font&&(a.font=b.font),d-=c.text_w,h-=c.text_h/3,g=a.measureText(b.text).width,d-g<c.l&&(d+=f),a.fillText(b.text,d,h),a.restore());a.restore()}},dispose:function(){this.boxes=this.plot=d}}})(window.sigplot=window.sigplot||{},mx,m);
(function(k,e,n,d){k.PlaybackControlsPlugin=function(a){this.options=a===d?{}:a;this.options.display===d&&(this.options.display=!0);this.options.size=this.options.size||25;this.options.lineWidth=this.options.lineWidth||2;this.state="paused";this.highlight=!1};k.PlaybackControlsPlugin.prototype={init:function(a){this.plot=a;var c=this,b=this.plot._Mx;this.onmousemove=function(a){b.warpbox||(c.ismouseover(a.xpos,a.ypos)?c.set_highlight(!0):c.set_highlight(!1))};this.plot.addListener("mmove",this.onmousemove);
this.onmousedown=function(a){b.warpbox||c.ismouseover(a.xpos,a.ypos)&&a.preventDefault()};this.plot.addListener("mdown",this.onmousedown);this.onmouseclick=function(a){!b.warpbox&&c.ismouseover(a.xpos,a.ypos)&&(c.toggle(),a.preventDefault())};this.plot.addListener("mclick",this.onmouseclick)},set_highlight:function(a){a!==this.highlight&&(this.highlight=a,this.plot.redraw())},toggle:function(a){a||(a="paused"===this.state?"playing":"paused");if(a!==this.state&&this.plot){var c=this.plot._Mx,b=document.createEvent("Event");
b.initEvent("playbackevt",!0,!0);b.state=a;e.dispatchEvent(c,b)&&(this.state=a);this.plot.redraw()}},addListener:function(a,c){e.addEventListener(this.plot._Mx,a,c,!1)},removeListener:function(a,c){e.removeEventListener(this.plot._Mx,a,c,!1)},ismouseover:function(a,c){var b=this.position();return Math.pow(a-b.x,2)+Math.pow(c-b.y,2)<Math.pow(this.options.size/2,2)},position:function(){if(this.options.position)return this.options.position;if(this.plot){var a=this.plot._Mx,c=this.options.size/2;return{x:a.l+
c+this.options.lineWidth+1,y:a.t+c+this.options.lineWidth+1}}return{x:null,y:null}},refresh:function(a){var c,b,d;if(this.options.display){var h=this.plot._Mx,f=a.getContext("2d");f.lineWidth=this.options.lineWidth;var g=this.options.size/2;this.highlight&&(f.lineWidth+=2,g+=1);var e=this.position();f.beginPath();f.arc(e.x,e.y,g-f.lineWidth,0,2*Math.PI,!0);f.closePath();f.strokeStyle=this.options.strokeStyle||h.fg;f.stroke();this.options.fillStyle&&(f.fillStyle=this.options.fillStyle,f.fill());if("paused"===
this.state){var k;b=0.8*g+(e.x-g);a=1.45*g+(e.x-g);k=0.8*g+(e.x-g);d=0.56*g+(e.y-g);c=g+(e.y-g);g=1.45*g+(e.y-g);f.beginPath();f.moveTo(b,d);f.lineTo(a,c);f.lineTo(k,g);f.closePath();f.fillStyle=this.options.strokeStyle||h.fg;f.fill()}else f.lineCap="round",f.lineWidth=Math.floor(Math.min(1,this.options.size/8)),b=0.8*g+(e.x-g),a=0.8*g+(e.x-g),d=g/2+(e.y-g),c=1.5*g+(e.y-g),f.beginPath(),f.moveTo(b,d),f.lineTo(a,c),f.closePath(),f.stroke(),b=g+g/5+(e.x-g),a=g+g/5+(e.x-g),d=g/2+(e.y-g),c=1.5*g+(e.y-
g),f.beginPath(),f.moveTo(b,d),f.lineTo(a,c),f.closePath(),f.stroke();f.restore()}},dispose:function(){this.boxes=this.plot=d}}})(window.sigplot=window.sigplot||{},mx,m);
