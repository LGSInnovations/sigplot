/*

 File: sigplot.annotations.js

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

 File: sigplot.slider.js

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

 File: sigplot.accordion.js

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

 File: sigplot.boxes.js

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

 File: sigplot.playback.js

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

 File: license.js
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

 Portions of SigPlot may utilize the following open-source software:

   loglevel.js          - MIT License; Copyright (c) 2014, Tim Perry
   typedarray.js        - MIT License; Copyright (c) 2010, Linden Research, Inc.
   tinycolor.js         - MIT License; Copyright (c) 2013, Brian Grinstead
   CanvasInput.js       - MIT License; Copyright (c) 2013, James Simpson of GoldFire Studios
   spin.js              - MIT License; Copyright (c) 2011-2013 Felix Gnass
   Array.remove         - MIT License; Copyright (c) 2007, John Resig
   Firefox subarray fix - Public Domain; Copyright (c) 2011, Ryan Berdeen
*/
(function(l,g,r,e){l.AnnotationPlugin=function(a){this.options=a===e?{}:a;this.options.display===e&&(this.options.display=!0);this.options.textBaseline=this.options.textBaseline||"alphabetic";this.options.textAlign=this.options.textAlign||"left";this.annotations=[]};l.AnnotationPlugin.prototype={init:function(a){var c=this;this.plot=a;var b=this.plot._Mx;this.onmousemove=function(a){if(0!==c.annotations.length&&!c.options.prevent_hover)if(a.xpos<b.l||a.xpos>b.r)c.set_highlight(!1);else if(a.ypos>
b.b||a.ypos<b.t)c.set_highlight(!1);else{for(var h=!1,d=0;d<c.annotations.length;d++){var f=c.annotations[d],n=e,p=e;f.absolute_placement&&(n=f.x,p=f.y);f.pxl_x!==e&&(n=f.pxl_x);f.pxl_y!==e&&(p=f.pxl_y);var l=g.real_to_pixel(b,f.x,f.y);n===e&&(n=l.x);p===e&&(p=l.y);var l=n,q=p;f.value instanceof HTMLImageElement||f.value instanceof HTMLCanvasElement||f.value instanceof HTMLVideoElement?(l-=f.width/2,q-=f.height/2):q-=f.height;g.inrect(a.xpos,a.ypos,l,q,f.width,f.height)?f.highlight||(c.set_highlight(!0,
[f],n,p),h=!0):(f.highlight&&(c.set_highlight(!1,[f]),h=!0),f.selected=e)}c.plot&&h&&c.plot.refresh()}};this.plot.addListener("mmove",this.onmousemove);this.onmousedown=function(b){for(b=0;b<c.annotations.length;b++)c.annotations[b].highlight&&(c.annotations[b].selected=!0)};this.plot.addListener("mdown",this.onmousedown);this.onmouseup=function(b){for(var a=0;a<c.annotations.length;a++){if(c.annotations[a].selected&&(b=document.createEvent("Event"),b.initEvent("annotationclick",!0,!0),b.annotation=
c.annotations[a],g.dispatchEvent(c.plot._Mx,b)&&c.annotations[a].onclick))c.annotations[a].onclick();c.annotations[a].selected=e}};document.addEventListener("mouseup",this.onmouseup,!1)},set_highlight:function(a,c,b,k){c=c||this.annotations;for(var h=0;h<c.length;h++){var d=document.createEvent("Event");d.initEvent("annotationhighlight",!0,!0);d.annotation=c[h];d.state=a;d.x=b;d.y=k;g.dispatchEvent(this.plot._Mx,d)&&(c[h].highlight=a)}},menu:function(){var a=function(b){return function(){b.options.display=
!b.options.display;b.plot.redraw()}}(this),c=function(b){return function(){b.annotations=[];b.plot.redraw()}}(this);return{text:"Annotations...",menu:{title:"ANNOTATIONS",items:[{text:"Display",checked:this.options.display,style:"checkbox",handler:a},{text:"Clear All",handler:c}]}}},add_annotation:function(a){this.annotations.push(a);this.plot.redraw();return this.annotations.length},clear_annotations:function(){this.annotations=[];this.plot.redraw()},refresh:function(a){if(this.options.display){var c=
this.plot._Mx,b=a.getContext("2d"),k=this;b.save();b.beginPath();b.rect(c.l,c.t,c.r-c.l,c.b-c.t);b.clip();g.onCanvas(c,a,function(){for(var a=k.annotations.length-1;0<=a;a--){var d=k.annotations[a],f=e,n=e;d.absolute_placement&&(f=d.x,n=d.y);d.pxl_x!==e&&(f=d.pxl_x);d.pxl_y!==e&&(n=d.pxl_y);var l=g.real_to_pixel(c,d.x,d.y);f===e&&(f=l.x);n===e&&(n=l.y);g.inrect(f,n,c.l,c.t,c.r-c.l,c.b-c.t)&&(d.value instanceof HTMLImageElement||d.value instanceof HTMLCanvasElement||d.value instanceof HTMLVideoElement?
(d.width=d.value.width,d.height=d.value.height,b.drawImage(d.value,f-d.width/2,n-d.height/2)):(b.font=d.font||"bold italic 20px new century schoolbook",b.fillStyle=d.highlight?d.highlight_color||c.hi:d.color||c.fg,b.globalAlpha=1,d.width=b.measureText(d.value).width,d.height=b.measureText("M").width,b.textBaseline=d.textBaseline||k.options.textBaseline,b.textAlign=d.textAlign||k.options.textAlign,b.fillText(d.value,f,n)),d.highlight&&d.popup&&g.render_message_box(c,d.popup,f+5,n+5,d.popupTextColor))}});
b.restore()}},dispose:function(){this.annotations=this.plot=e}}})(window.sigplot=window.sigplot||{},mx,m);
(function(l,g,r,e){l.SliderPlugin=function(a){this.options={display:!0,style:{lineWidth:1,lineCap:"square"},direction:"vertical",name:"Slider",prevent_drag:!1};window.update(this.options,a);this.paired_slider=this.location=this.position=e;this.name=this.options.name};l.SliderPlugin.prototype={init:function(a){this.plot=a;var c=a._Mx,b=this;this.onmousemove=function(a){if(b.location!==e&&!b.options.prevent_drag)if(a.xpos<c.l||a.xpos>c.r)b.set_highlight(!1);else if(a.ypos>c.b||a.ypos<c.t)b.set_highlight(!1);
else{var h=b.options.style.lineWidth;b.dragging?(h=g.pixel_to_real(c,a.xpos,a.ypos),"vertical"===b.options.direction?(b.location=a.xpos,b.position=h.x):"horizontal"===b.options.direction?(b.location=a.ypos,b.position=h.y):"both"===b.options.direction&&(b.location.x=a.xpos,b.position.x=h.x,b.location.y=a.ypos,b.position.y=h.y),b.plot.redraw(),a.preventDefault()):c.warpbox||("vertical"===b.options.direction?Math.abs(b.location-a.xpos)<h+5?b.set_highlight(!0):b.set_highlight(!1):"horizontal"===b.options.direction?
Math.abs(b.location-a.ypos)<h+5?b.set_highlight(!0):b.set_highlight(!1):"both"===b.options.direction&&(Math.abs(b.location.x-a.xpos)<h+5&&Math.abs(b.location.y-a.ypos)<h+5?b.set_highlight(!0):b.set_highlight(!1)))}};this.plot.addListener("mmove",this.onmousemove);this.onmousedown=function(a){if(b.location!==e&&!(b.options.prevent_drag||a.xpos<c.l||a.xpos>c.r||a.ypos>c.b||a.ypos<c.t||a.slider_drag)){var h=b.options.style.lineWidth;"vertical"===b.options.direction?Math.abs(b.location-a.xpos)<h+5&&(b.dragging=
!0,a.slider_drag=!0,a.preventDefault()):"horizontal"===b.options.direction?Math.abs(b.location-a.ypos)<h+5&&(b.dragging=!0,a.slider_drag=!0,a.preventDefault()):"both"===b.options.direction&&Math.abs(b.location.x-a.xpos)<h+5&&Math.abs(b.location.y-a.ypos)<h+5&&(b.dragging=!0,a.slider_drag=!0,a.preventDefault())}};this.plot.addListener("mdown",this.onmousedown);this.onmouseup=function(a){b.dragging&&(a.preventDefault(),b.dragging=!1,a=document.createEvent("Event"),a.source=b,a.initEvent("slidertag",
!0,!0),"both"===b.options.direction?(a.location=b.location?JSON.parse(JSON.stringify(b.location)):e,a.position=b.position?JSON.parse(JSON.stringify(b.position)):e):(a.location=b.location,a.position=b.position),g.dispatchEvent(c,a),a=document.createEvent("Event"),a.initEvent("sliderdrag",!0,!0),"both"===b.options.direction?(a.location=b.location?JSON.parse(JSON.stringify(b.location)):e,a.position=b.position?JSON.parse(JSON.stringify(b.position)):e):(a.location=b.location,a.position=b.position),g.dispatchEvent(c,
a))};this.plot.addListener("mup",this.onmouseup)},menu:function(){var a=function(b){return function(){b.options.display=!b.options.display;b.plot.redraw()}}(this),c=function(b){return function(){var a=b.plot._Mx,c=a.stk[a.level],a=(c.xmax-c.xmin)/2+c.xmin,c=(c.ymax-c.ymin)/2+c.ymin;"vertical"===b.options.direction?b.set_position(a):"horizontal"===b.options.direction?b.set_position(c):"both"===b.options.direction&&b.set_position({x:a,y:c})}}(this);return{text:this.name+"...",menu:{title:"SLIDER",items:[{text:"Display",
checked:this.options.display,style:"checkbox",handler:a},{text:"Center",handler:c}]}}},addListener:function(a,c){var b=this;g.addEventListener(this.plot._Mx,a,function(a){if(a.source===b)return c(a)},!1)},removeListener:function(a,c){g.removeEventListener(this.plot._Mx,a,c,!1)},pair:function(a){if(a){if(a.direction!==this.direction)throw"paired sliders must use the same direction setting";this.paired_slider=a}else this.paired_slider=null},set_highlight:function(a){a!==this.highlight&&(this.highlight=
a,this.plot.redraw())},set_position:function(a){if(!this.dragging){if("both"===this.options.direction){if(this.position!==e&&this.position.x===a.x&&this.position.y===a.y)return}else if(this.position===a)return;this.set_highlight(!1);var c=this.plot._Mx;this.position="both"===this.options.direction?a?JSON.parse(JSON.stringify(a)):e:a;a="both"===this.options.direction?g.real_to_pixel(c,this.position.x,this.position.y):g.real_to_pixel(c,this.position,this.position);"vertical"===this.options.direction?
this.location=a.x:"horizontal"===this.options.direction?this.location=a.y:"both"===this.options.direction&&(this.location={x:a.x,y:a.y});a=document.createEvent("Event");a.initEvent("slidertag",!0,!0);"both"===this.options.direction?(a.location=this.location?JSON.parse(JSON.stringify(this.location)):e,a.position=this.position?JSON.parse(JSON.stringify(this.position)):e):(a.location=this.location,a.position=this.position);g.dispatchEvent(c,a);this.plot.redraw()}},set_location:function(a){if(!this.dragging){if("both"===
this.options.direction){if(this.location!==e&&this.location.x===a.x&&this.location.y===a.y)return}else if(this.location===a)return;this.set_highlight(!1);var c=this.plot._Mx;this.location="both"===this.options.direction?a?JSON.parse(JSON.stringify(a)):e:a;a="both"===this.options.direction?g.pixel_to_real(c,a.x,a.y):g.pixel_to_real(c,a,a);"vertical"===this.options.direction?this.position=a.x:"horizontal"===this.options.direction?this.position=a.y:"both"===this.options.direction&&(this.position={x:a.x,
y:a.y});a=document.createEvent("Event");a.initEvent("slidertag",!0,!0);"both"===this.options.direction?(a.location=this.location?JSON.parse(JSON.stringify(this.location)):e,a.position=this.position?JSON.parse(JSON.stringify(this.position)):e):(a.location=this.location,a.position=this.position);g.dispatchEvent(c,a);this.plot.redraw()}},get_position:function(){return this.position},get_location:function(){return this.location},refresh:function(a){if(this.options.display&&this.position!==e){var c=this.plot._Mx;
a=a.getContext("2d");a.lineWidth=this.options.style.lineWidth;a.lineCap=this.options.style.lineCap;a.strokeStyle=this.options.style.strokeStyle!==e?this.options.style.strokeStyle:c.fg;if(this.dragging||this.highlight)a.lineWidth=Math.ceil(1.2*a.lineWidth);var b;b="both"===this.options.direction?g.real_to_pixel(c,this.position.x,this.position.y):g.real_to_pixel(c,this.position,this.position);if("vertical"===this.options.direction){if(b.x<c.l||b.x>c.r)return;this.location=b.x}else if("horizontal"===
this.options.direction){if(b.y<c.t||b.y>c.b)return;this.location=b.y}else if("both"===this.options.direction){if(b.x<c.l||b.x>c.r||b.y<c.t||b.y>c.b)return;this.location.x=b.x;this.location.y=b.y}"vertical"===this.options.direction?(a.beginPath(),a.moveTo(this.location+0.5,c.t),a.lineTo(this.location+0.5,c.b),a.stroke()):"horizontal"===this.options.direction?(a.beginPath(),a.moveTo(c.l,this.location+0.5),a.lineTo(c.r,this.location+0.5),a.stroke()):"both"===this.options.direction&&(a.beginPath(),a.moveTo(c.l,
this.location.y+0.5),a.lineTo(c.r,this.location.y+0.5),a.closePath(),a.moveTo(this.location.x+0.5,c.t),a.lineTo(this.location.x+0.5,c.b),a.stroke());if(this.dragging||this.highlight){if("vertical"===this.options.direction){a.textBaseline="alphabetic";a.textAlign="left";a.fillStyle=this.options.style.textStyle!==e?this.options.style.textStyle:c.fg;a.font=c.font.font;b=g.format_g(this.position,6,3,!0).trim();var k=a.measureText(b).width;this.location+5+k>c.r?(a.textAlign="right",a.fillText(b,this.location-
5,c.t+10)):a.fillText(b,this.location+5,c.t+10)}else"horizontal"===this.options.direction&&(a.textBaseline="alphabetic",a.textAlign="left",a.fillStyle=this.options.style.textStyle!==e?this.options.style.textStyle:c.fg,a.font=c.font.font,b=g.format_g(this.position,6,3,!0).trim(),this.location-c.text_h-5>c.t?a.fillText(b,c.l+10,this.location-5):a.fillText(b,c.l+10,this.location+5+c.text_h));if(this.paired_slider)if("vertical"===this.options.direction){b=this.position-this.paired_slider.position;var k=
this.location-this.paired_slider.location,h=c.t+Math.round((c.b-c.t)/2);g.textline(c,this.location,h,this.paired_slider.location,h,{mode:"dashed",on:3,off:3});a.textBaseline="alphabetic";a.textAlign="center";a.fillStyle=this.options.style.textStyle!==e?this.options.style.textStyle:c.fg;a.font=c.font.font;b=g.format_g(b,6,3,!0);a.fillText(b,this.location-Math.round(k/2),h-5)}else"horizontal"===this.options.direction&&(b=this.position-this.paired_slider.position,k=this.location-this.paired_slider.location,
h=c.l+Math.round((c.r-c.l)/2),g.textline(c,h,this.location,h,this.paired_slider.location,{mode:"dashed",on:3,off:3}),a.textBaseline="alphabetic",a.textAlign="left",a.fillStyle=this.options.style.textStyle!==e?this.options.style.textStyle:c.fg,a.font=c.font.font,b=g.format_g(b,6,3,!0),a.fillText(b,h+5,this.location-Math.round(k/2)))}}},dispose:function(){this.plot.removeListener("mmove",this.onmousemove);document.removeEventListener("mouseup",this.onmouseup,!1);this.position=this.plot=e}}})(window.sigplot=
window.sigplot||{},mx,m);
(function(l,g,r,e){l.AccordionPlugin=function(a){this.options=a!==e?a:{};this.options.display===e&&(this.options.display=!0);this.options.center_line_style===e&&(this.options.center_line_style={});this.options.edge_line_style===e&&(this.options.edge_line_style={});this.options.fill_style===e&&(this.options.fill_style={});this.options.direction===e&&(this.options.direction="vertical");this.options.mode===e&&(this.options.mode="absolute");this.loc_2=this.loc_1=this.center_location=this.width=this.center=
e;this.visible=!0};l.AccordionPlugin.prototype={init:function(a){this.plot=a;var c=this.plot._Mx,b=this;this.onmousemove=function(a){if(b.center_location!==e&&!b.options.prevent_drag)if(a.xpos<c.l||a.xpos>c.r)b.set_highlight(!1);else if(a.ypos>c.b||a.ypos<c.t)b.set_highlight(!1);else{var h=b.options.center_line_style.lineWidth!==e?b.options.center_line_style.lineWidth:1,d=b.options.edge_line_style.lineWidth!==e?b.options.edge_line_style.lineWidth:1;if(b.dragging||b.edge_dragging){b.dragging&&(h=g.pixel_to_real(c,
a.xpos,a.ypos),"vertical"===b.options.direction?(b.center_location=a.xpos,"absolute"===b.options.mode?b.center=h.x:"relative"===b.options.mode&&(b.center=(a.xpos-c.l)/(c.r-c.l))):"horizontal"===b.options.direction&&(b.center_location=a.ypos,"absolute"===b.options.mode?b.center=h.y:"relative"===b.options.mode&&(b.center=(a.ypos-c.t)/(c.b-c.t))));if(b.edge_dragging)if(h=g.pixel_to_real(c,a.xpos,a.ypos),"vertical"===b.options.direction?"absolute"===b.options.mode?b.width=2*Math.abs(b.center-h.x):"relative"===
b.options.mode&&(b.width=2*Math.abs(b.center_location-a.xpos)/(c.r-c.l)):"horizontal"===b.options.direction&&("absolute"===b.options.mode?b.width=2*Math.abs(b.center-h.y):"relative"===b.options.mode&&(b.width=2*Math.abs(b.center_location-a.ypos)/(c.b-c.t))),b.options.discrete_widths){for(var h=0,d=Math.abs(b.width-b.options.discrete_widths[0]),f=0,n=1;n<b.options.discrete_widths.length;n++)f=Math.abs(b.width-b.options.discrete_widths[n]),f<d&&(h=n,d=f);b.width=b.options.discrete_widths[h]}else b.options.min_width&&
(b.width=Math.max(b.width,b.options.min_width)),b.options.max_width&&(b.width=Math.min(b.width,b.options.max_width));b.plot&&b.plot.refresh();a.preventDefault()}else c.warpbox||("vertical"===b.options.direction?(Math.abs(b.center_location-a.xpos)<h+5?b.set_highlight(!0):b.set_highlight(!1),Math.abs(b.loc_1-a.xpos)<d+5||Math.abs(b.loc_2-a.xpos)<d+5?b.set_edge_highlight(!0):b.set_edge_highlight(!1)):"horizontal"===b.options.direction&&(Math.abs(b.center_location-a.ypos)<h+5?b.set_highlight(!0):b.set_highlight(!1),
Math.abs(b.loc_1-a.ypos)<d+5||Math.abs(b.loc_2-a.ypos)<d+5?b.set_edge_highlight(!0):b.set_edge_highlight(!1)))}};this.plot.addListener("mmove",this.onmousemove);this.onmousedown=function(a){if(b.center_location!==e&&!(a.xpos<c.l||a.xpos>c.r||a.ypos>c.b||a.ypos<c.t)){var h=b.options.center_line_style.lineWidth!==e?b.options.center_line_style.lineWidth:1,d=b.options.edge_line_style.lineWidth!==e?b.options.edge_line_style.lineWidth:1;"vertical"===b.options.direction?Math.abs(b.loc_1-a.xpos)<d+5||Math.abs(b.loc_2-
a.xpos)<d+5?(b.edge_dragging=!0,a.preventDefault()):Math.abs(b.center_location-a.xpos)<h+5&&(b.dragging=!0,a.preventDefault()):"horizontal"===b.options.direction&&(Math.abs(b.loc_1-a.ypos)<d+5||Math.abs(b.loc_2-a.ypos)<d+5?(b.edge_dragging=!0,a.preventDefault()):Math.abs(b.center_location-a.ypos)<h+5&&(b.dragging=!0,a.preventDefault()))}};this.plot.addListener("mdown",this.onmousedown);this.onmouseup=function(a){b.dragging=!1;b.edge_dragging=!1;a=document.createEvent("Event");a.initEvent("accordiontag",
!0,!0);a.center=b.center;a.width=b.width;g.dispatchEvent(c,a)};document.addEventListener("mouseup",this.onmouseup,!1)},addListener:function(a,c){g.addEventListener(this.plot._Mx,a,c,!1)},removeListener:function(a,c){g.removeEventListener(this.plot._Mx,a,c,!1)},set_highlight:function(a){a!==this.highlight&&(this.highlight=a,this.plot.redraw())},set_edge_highlight:function(a){a!==this.edge_highlight&&(this.edge_highlight=a,this.plot.redraw())},set_center:function(a){this.center=a;if(this.plot){a=this.plot._Mx;
var c=document.createEvent("Event");c.initEvent("accordiontag",!0,!0);c.center=this.center;c.width=this.width;g.dispatchEvent(a,c);this.plot.redraw()}},set_width:function(a){this.width=a;if(this.plot){a=this.plot._Mx;var c=document.createEvent("Event");c.initEvent("accordiontag",!0,!0);c.center=this.center;c.width=this.width;g.dispatchEvent(a,c);this.plot.redraw()}},get_center:function(){return this.center},get_width:function(){return this.width},refresh:function(a){if(this.plot&&this.visible&&this.options.display&&
this.center!==e&&this.width!==e){var c=this.plot._Mx,b=a.getContext("2d");b.clearRect(0,0,a.width,a.height);var k;"absolute"===this.options.mode?k=g.real_to_pixel(c,this.center,this.center):"relative"===this.options.mode&&("vertical"===this.options.direction?(k=c.stk[0].x1+(c.stk[0].x2-c.stk[0].x1)*this.center,k=g.real_to_pixel(c,g.pixel_to_real(c,k,k).x,g.pixel_to_real(c,k,k).y)):"horizontal"===this.options.direction&&(k=c.stk[0].y1+(c.stk[0].y2-c.stk[0].y1)*this.center,k=g.real_to_pixel(c,g.pixel_to_real(c,
k,k).x,g.pixel_to_real(c,k,k).y)));var h,d;"absolute"===this.options.mode?(h=g.real_to_pixel(c,this.center-this.width/2,this.center-this.width/2),d=g.real_to_pixel(c,this.center+this.width/2,this.center+this.width/2)):"relative"===this.options.mode&&(d=c.stk[0].x2-c.stk[0].x1,a=c.stk[0].y2-c.stk[0].y1,h={x:k.x-this.width*d/2,y:k.y-this.width*a/2},d={x:k.x+this.width*d/2,y:k.y+this.width*a/2});"vertical"===this.options.direction?(this.center_location=k.x,this.loc_1=Math.max(c.l,h.x),this.loc_2=Math.min(c.r,
d.x)):"horizontal"===this.options.direction&&(this.center_location=k.y,this.loc_1=Math.max(c.t,d.y),this.loc_2=Math.min(c.b,h.y));this.options.shade_area&&0<Math.abs(this.loc_2-this.loc_1)&&(h=b.globalAlpha,b.globalAlpha=this.options.fill_style.opacity!==e?this.options.fill_style.opacity:0.4,b.fillStyle=this.options.fill_style.fillStyle!==e?this.options.fill_style.fillStyle:c.hi,"vertical"===this.options.direction?b.fillRect(this.loc_1,c.t,this.loc_2-this.loc_1,c.b-c.t):"horizontal"===this.options.direction&&
b.fillRect(c.l,this.loc_1,c.r-c.l,this.loc_2-this.loc_1),b.globalAlpha=h);if(this.options.draw_edge_lines||this.edge_highlight||this.edge_dragging){b.lineWidth=this.options.edge_line_style.lineWidth!==e?this.options.edge_line_style.lineWidth:1;b.lineCap=this.options.edge_line_style.lineCap!==e?this.options.edge_line_style.lineCap:"square";b.strokeStyle=this.options.edge_line_style.strokeStyle!==e?this.options.edge_line_style.strokeStyle:c.fg;if(this.edge_dragging||this.edge_highlight)b.lineWidth=
Math.ceil(1.2*b.lineWidth);"vertical"===this.options.direction?(b.beginPath(),b.moveTo(this.loc_1+0.5,c.t),b.lineTo(this.loc_1+0.5,c.b),b.stroke(),b.beginPath(),b.moveTo(this.loc_2+0.5,c.t),b.lineTo(this.loc_2+0.5,c.b),b.stroke()):"horizontal"===this.options.direction&&(b.beginPath(),b.moveTo(c.l,this.loc_1+0.5),b.lineTo(c.r,this.loc_1+0.5),b.stroke(),b.beginPath(),b.moveTo(c.l,this.loc_2+0.5),b.lineTo(c.r,this.loc_2+0.5),b.stroke())}if(this.options.draw_center_line){b.lineWidth=this.options.center_line_style.lineWidth!==
e?this.options.center_line_style.lineWidth:1;b.lineCap=this.options.center_line_style.lineCap!==e?this.options.center_line_style.lineCap:"square";b.strokeStyle=this.options.center_line_style.strokeStyle!==e?this.options.center_line_style.strokeStyle:c.fg;if(this.dragging||this.highlight)b.lineWidth=Math.ceil(1.2*b.lineWidth);"vertical"===this.options.direction?(b.beginPath(),b.moveTo(this.center_location+0.5,c.t),b.lineTo(this.center_location+0.5,c.b),b.stroke()):"horizontal"===this.options.direction&&
(b.beginPath(),b.moveTo(c.l,this.center_location+0.5),b.lineTo(c.r,this.center_location+0.5),b.stroke())}}},set_visible:function(a){this.visible=a;this.plot.redraw()},set_mode:function(a){this.options.mode=a},dispose:function(){this.width=this.center_location=this.center=this.plot=e}}})(window.sigplot=window.sigplot||{},mx,m);
(function(l,g,r,e){l.BoxesPlugin=function(a){this.options=a===e?{}:a;this.options.display===e&&(this.options.display=!0);this.boxes=[]};l.BoxesPlugin.prototype={init:function(a){this.plot=a},menu:function(){var a=function(a){return function(){a.options.display=!a.options.display;a.plot.redraw()}}(this),c=function(a){return function(){a.boxes=[];a.plot.redraw()}}(this);return{text:"Boxes...",menu:{title:"BOXES",items:[{text:"Display",checked:this.options.display,style:"checkbox",handler:a},{text:"Clear All",
handler:c}]}}},add_box:function(a){this.boxes.push(a);this.plot.redraw();return this.boxes.length},clear_boxes:function(){this.boxes=[];this.plot.redraw()},refresh:function(a){if(this.options.display){var c=this.plot._Mx;a=a.getContext("2d");var b,e,h,d,f,n;a.save();a.beginPath();a.rect(c.l,c.t,c.r-c.l,c.b-c.t);a.clip();for(var l=0;l<this.boxes.length;l++){b=this.boxes[l];!0===b.absolute_placement?(e=b.x+c.l,h=b.y+c.t,d=b.w,f=b.h):(f=g.real_to_pixel(c,b.x,b.y),n=g.real_to_pixel(c,b.x+b.w,b.y+b.h),
e=f.x,h=f.y,d=n.x-f.x,f=f.y-n.y);a.strokeStyle=b.strokeStyle||c.fg;a.lineWidth=b.lineWidth||1;1===a.lineWidth%2&&(e+=0.5,h+=0.5);if(b.fillStyle||b.fill)a.globalAlpha=b.alpha||0.5,a.fillStyle=b.fillStyle||a.strokeStyle,a.fillRect(e,h,d,f),a.globalAlpha=1;a.strokeRect(e,h,d,f);b.text&&(a.save(),a.font=b.font||c.text_H+"px Courier New, monospace",a.globalAlpha=1,a.textAlign="end",a.fillStyle=a.strokeStyle,b.font&&(a.font=b.font),e-=c.text_w,h-=c.text_h/3,f=a.measureText(b.text).width,e-f<c.l&&(e+=d),
a.fillText(b.text,e,h),a.restore())}a.restore()}},dispose:function(){this.plot=e;this.boxes=[]}}})(window.sigplot=window.sigplot||{},mx,m);
(function(l,g,r,e){l.PlaybackControlsPlugin=function(a){this.options={display:!0,size:25,lineWidth:2,fillStyle:!1};window.update(this.options,a);this.state="paused";this.highlight=!1};l.PlaybackControlsPlugin.prototype={init:function(a){this.plot=a;var c=this,b=this.plot._Mx;this.onmousemove=function(a){b.warpbox||(c.ismouseover(a.xpos,a.ypos)?c.set_highlight(!0):c.set_highlight(!1))};this.plot.addListener("mmove",this.onmousemove);this.onmousedown=function(a){b.warpbox||c.ismouseover(a.xpos,a.ypos)&&
a.preventDefault()};this.plot.addListener("mdown",this.onmousedown);this.onmouseclick=function(a){!b.warpbox&&c.ismouseover(a.xpos,a.ypos)&&(c.toggle(),a.preventDefault())};this.plot.addListener("mclick",this.onmouseclick)},set_highlight:function(a){a!==this.highlight&&(this.highlight=a,this.plot.redraw())},toggle:function(a){a||(a="paused"===this.state?"playing":"paused");if(a!==this.state&&this.plot){var c=this.plot._Mx,b=document.createEvent("Event");b.initEvent("playbackevt",!0,!0);b.state=a;
g.dispatchEvent(c,b)&&(this.state=a);this.plot.redraw()}},addListener:function(a,c){g.addEventListener(this.plot._Mx,a,c,!1)},removeListener:function(a,c){g.removeEventListener(this.plot._Mx,a,c,!1)},ismouseover:function(a,c){var b=this.position();return Math.pow(a-b.x,2)+Math.pow(c-b.y,2)<Math.pow(this.options.size/2,2)},position:function(){if(this.options.position)return this.options.position;if(this.plot){var a=this.plot._Mx,c=this.options.size/2;return{x:a.l+c+this.options.lineWidth+1,y:a.t+c+
this.options.lineWidth+1}}return{x:null,y:null}},refresh:function(a){var c,b,e;if(this.options.display){var h=this.plot._Mx,d=a.getContext("2d");d.lineWidth=this.options.lineWidth;var f=this.options.size/2;this.highlight&&(d.lineWidth+=2,f+=1);var g=this.position();d.beginPath();d.arc(g.x,g.y,f-d.lineWidth,0,2*Math.PI,!0);d.closePath();d.strokeStyle=this.options.strokeStyle||h.fg;d.stroke();this.options.fillStyle&&(d.fillStyle=this.options.fillStyle,d.fill());if("paused"===this.state){var l;b=0.8*
f+(g.x-f);a=1.45*f+(g.x-f);l=0.8*f+(g.x-f);e=0.56*f+(g.y-f);c=f+(g.y-f);f=1.45*f+(g.y-f);d.beginPath();d.moveTo(b,e);d.lineTo(a,c);d.lineTo(l,f);d.closePath();d.fillStyle=this.options.strokeStyle||h.fg;d.fill()}else d.lineCap="round",d.lineWidth=Math.floor(Math.min(1,this.options.size/8)),b=0.8*f+(g.x-f),a=0.8*f+(g.x-f),e=f/2+(g.y-f),c=1.5*f+(g.y-f),d.beginPath(),d.moveTo(b,e),d.lineTo(a,c),d.closePath(),d.stroke(),b=f+f/5+(g.x-f),a=f+f/5+(g.x-f),e=f/2+(g.y-f),c=1.5*f+(g.y-f),d.beginPath(),d.moveTo(b,
e),d.lineTo(a,c),d.closePath(),d.stroke();d.restore()}},dispose:function(){this.boxes=this.plot=e}}})(window.sigplot=window.sigplot||{},mx,m);