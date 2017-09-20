/**
 * @license
 * File: slider.js
 * Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.
 *
 * This file is part of SigPlot.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function(slider, undefined) {

	var sliderLength = 170, position, x, y, value, max, min, place, scroll_time_interval = 95, canvasInput, stillpanning = null;

	/**
	 * main function that draws the slider and adds listeners and the canvas
	 * input textbox etc.
	 * 
	 * @param x:
	 *            x-position of top left corner of slider
	 * @param y:
	 *            y-position of top right corner of slider
	 * @param value:
	 *            value that the slider is on
	 * @param max:
	 *            max value of the slider
	 * @param min:
	 *            min value of the slider
	 */

	slider.draw = function(x, y, value, max, min, title,change) {

		this.x = x;
		this.y = y;
		this.max = max;
		this.min = min;
		position = value / max;
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext('2d');
		drawBackground(x, y);
		drawSlider(x, y);
		drawValue(value, position, x, y, max, min);
		this.value = value;
		drawText(x, y, title);
		canvasInput = new CanvasInput({
			canvas : canvas,
			height : 15,
			x : x + 140,
			y : y + 7,
			backgroundColor : 'black',
			fontColor : 'white',
			fontSize : 15,
			padding : 0,
			width : 50,
			borderRadius : 0,
			borderWidth : 0,
			value : (value !== undefined ? value.toString() : ""),
			boxShadow : "none",
			innerShadow : "none",
			disableBlur : true,
			renderOnReturn : false,
			onsubmit : function() {
				value = this.value();
				var valid=slider.verify(value, max, min, x, y);
				
				if (!valid){
					this.enableBlur();
					this.blur();
					ctx.fillStyle = 'grey';
					ctx.fillRect(x, y - 30, 204, 25);
					ctx.fillStyle = 'white';
					ctx.font = "11px Arial";
					ctx.fillText("Invalid input. Please enter a new number.", x + 4,y - 15);
					window.setTimeout(function() {
						ctx.clearRect(x, y - 30, 204, 25);
					}, 5000);
				
				}
				else{
					if (min >= value) {
						value = min;
					} else if (value >= max) {
						value = max;
					}
					 plot._Gx.xdiv = this.value();
				   	 sigplot.refresh(plot);
					 canvas.style.zIndex="-1";
					 this.cleanup();
					 ctx.clearRect(0,0,canvas.width,canvas.height);
					
					
				}
				
			}
		});
		
		onclick(x, y, value, max, min, position, title);
		window.addEventListener("keypress",function(event){
			plot._Gx.xdiv=parseInt(slider.value);
			canvas.style.zIndex="-1";
			canvasInput.cleanup();
			ctx.clearRect(0,0,canvas.width,canvas.height);
			sigplot.refresh(plot);
		},false);

	};
	/**
	 * function that redraws/updates the slider
	 * 
	 * @param x:
	 *            x-position of top left corner of slider
	 * @param y:
	 *            y-position of top right corner of slider
	 * @param value:
	 *            value that the slider is on
	 * @param max:
	 *            max value of the slider
	 * @param min:
	 *            min value of the slider
	 * @param position:
	 *            position, in decimal, of the thumb on slider
	 */
	redraw = function(x, y, value, max, min, position, title) {
		canvasInput.cleanup();
		ctx.clearRect(0,0,canvas.width,canvas.height);
		drawBackground(x, y);
		drawSlider(x, y);
		drawText(x, y, title);
		drawValue(value, position, x, y, max, min);
		value = parseFloat(value).toFixed(0);
		createCI(x, y, value, max, min, title);
		value = canvasInput.value();
	};
	function drawBackground(x, y) {
		ctx.fillStyle = 'grey';
		ctx.fillRect(x, y, 204, 56);
		ctx.fillStyle = 'black';
		ctx.fillRect(x + 2, y + 2, 200, 52);
	}
	;

	function drawText(x, y, title) {
		ctx.fillStyle = 'white';
		ctx.font = "15px Arial";
		ctx.fillText(title, x + 20, y + 20);
	}
	;

	function drawSlider(x, y) {
		ctx.fillStyle = 'grey';
		ctx.fillRect(x + 12, y + 37, 180, 2);
		ctx.beginPath();
		ctx.moveTo(x + 5, y + 38);
		ctx.lineTo(x + 12, y + 42);
		ctx.lineTo(x + 12, y + 33);
		ctx.lineTo(x + 5, y + 38);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(x + 199, y + 38);
		ctx.lineTo(x + 192, y + 42);
		ctx.lineTo(x + 192, y + 33);
		ctx.lineTo(x + 199, y + 38);
		ctx.fill();
	}
	;

	function drawValue(value, position, x, y, max, min) {
		if (min >= value) {
			value = min;
		} else if (value >= max) {
			value = max;
		}

		position = (value / max);
		slider.position = position;
		ctx.fillStyle = 'grey';
		ctx.fillRect((sliderLength * position) + x + 13.5, y + 34, 7, 7);
		value = parseFloat(value).toFixed(0);
	}
	;

	function onLeftArrow(mouseX, mouseY, x, y) // checks if on the left arrow
	{
		if (mouseX >= (x + 7) && mouseX <= (x + 14) && mouseY >= (y + 35)
				&& mouseY <= (y + 43)) {
			return true;
		} else
			return false;
	}
	;
	function onRightArrow(mouseX, mouseY, x, y) // checks if on the right arrow
	{
		if (mouseX >= (x + 193) && mouseX <= (x + 200) && mouseY >= (y + 35)
				&& mouseY <= (y + 43)) {
			return true;
		} else
			return false;
	}
	;

	function onThumb(mouseX, mouseY, position, x, y) // checks if on the
														// thumb
	{
		if (mouseX >= (sliderLength * position) + x + 14
				&& mouseX <= (sliderLength * position) + x + 21
				&& mouseY >= (y + 33) && mouseY <= (y + 42)) {
			return true;
		} else
			return false;
	}
	;

	function onSlider(mouseX, mouseY, x, y) // checks if on any part of the
											// slider bar
	{
		if (mouseX >= (x + 14) && mouseX <= (x + 192) && mouseY >= (y + 29)
				&& mouseY <= (y + 50)) {
			return true;
		} else
			return false;
	}
	;
	
	
	/**
	 * main function that handles all events
	 * 
	 * @param x:
	 *            x-position of top left corner of slider
	 * @param y:
	 *            y-position of top right corner of slider
	 * @param value:
	 *            value that the slider is on
	 * @param max:
	 *            max value of the slider
	 * @param min:
	 *            min value of the slider
	 * @param position:
	 *            position, in decimal, of the thumb on slider
	 */
	function onclick(x, y, value, max, min, position, title) {

		window.addEventListener("mousemove", function(evt) {
			getMousePos(canvas, evt);
			onLeftArrow(mouseX, mouseY, x, y);
			onRightArrow(mouseX, mouseY, x, y);
			onSlider(mouseX, mouseY, x, y);
			onThumb(mouseX, mouseY, position, x, y);
		}, false);
		window.onmousedown = function() {
			return false;
		};
		window.addEventListener("mousedown",function(event) 
				{
							if ((!onThumb(window.mouseX, window.mouseY,position, x, y) && event.which === 1)&& 
								(onSlider(window.mouseX, window.mouseY, x, y)|| onRightArrow(window.mouseX,window.mouseY, x, y) || onLeftArrow(window.mouseX, window.mouseY, x, y)))
							{
								if (onRightArrow(mouseX, mouseY, x, y))
								{
									value = slider.value;
									ctx.clearRect(x, y, ctx.canvas.width,ctx.canvas.height);
									value = (+value) + 1;
									position = (value / max);
									if (min >= value) 
									{
										value = min;
									} else if (value >= max) 
									{
										value = max;
									}
									redraw(x, y, value, max, min, position,title);
									slider.value = value;

								} else if (onLeftArrow(mouseX, mouseY, x, y)) 
								{
									value = slider.value;
									ctx.clearRect(x, y, ctx.canvas.width,ctx.canvas.height);
									value = (+value) - 1;
									position = (value / max);
									if (min >= value)
									{
										value = min;
									} else if (value >= max) 
									{
										value = max;
									}
									redraw(x, y, value, max, min, position,title);
									slider.value = value;
								}
								else if (onSlider(mouseX, mouseY, x, y)) 
								{
									if ((sliderLength * position + 43) > (mouseX - 15 - x)&& (sliderLength * position - 27) < (mouseX - 15 - x)) {
										value = slider.value;
										ctx.clearRect(x, y, ctx.canvas.width,ctx.canvas.height);
										position = ((mouseX - 15 - x) / sliderLength);
										value = position * max;
										if (min >= value)
										{
											value = min;
										} 
										else if (value >= max) 
										{
											value = max;
										}
										redraw(x, y, value, max, min, position,
												title);
										slider.value = value;
									} 
									else {
										if (((sliderLength * position - 17) > (mouseX - 15 - x))) {

											place = slider.position* sliderLength - 30;
											position = place / sliderLength;
											value = max * position;
											value = parseFloat(value).toFixed(0);
											value = (+value);
											if (min >= value) {
												value = min;
											} else if (value >= max) {
												value = max;
											}
											redraw(x, y, value, max, min,position, title);
											slider.value = value;
										}
										if (((sliderLength * position + 43) < (mouseX - 15 - x))) {

											place = slider.position* sliderLength - 13;
											place = (+place) + 30;
											position = place / sliderLength;
											value = max * position;
											value = parseFloat(value).toFixed(0);
											value = (+value);
											if (min >= value) {
												value = min;
											} else if (value >= max) {
												value = max;
											}
											redraw(x, y, value, max, min,position, title);
											slider.value = value;
										}
									}
								}

							}
							slider.value = value;
							stillpanning = window.setInterval(function() 
									{
									if ((!onThumb(window.mouseX,window.mouseY,position, x, y) && event.which === 1)&& 
									(onSlider(window.mouseX,window.mouseY,x, y)|| onRightArrow(window.mouseX,window.mouseY,x, y) ||
									onLeftArrow(window.mouseX,window.mouseY,x, y))) {
													if (onRightArrow(mouseX,mouseY, x, y)) {
														value = slider.value;
														ctx.clearRect(x,y,ctx.canvas.width,ctx.canvas.height);
														value = (+value) + 1;
														position = (value / max);
														if (min >= value) {
															value = min;
														} else if (value >= max) {
															value = max;
														}
														redraw(x, y, value,max, min,position, title);
														slider.value = value;
													} else if (onLeftArrow(mouseX, mouseY, x,y)) {
														value = slider.value;
														ctx.clearRect(x,y,ctx.canvas.width,ctx.canvas.height);
														value = (+value) - 1;
														position = (value / max);
														if (min >= value) {
															value = min;
														} else if (value >= max) {
															value = max;
														}
														redraw(x, y, value,max, min,position, title);
														slider.value = value;
													} else if (onSlider(mouseX,mouseY, x, y)) {
														if ((sliderLength* position + 43) > (mouseX - 15 - x)&& (sliderLength* position - 27) < (mouseX - 15 - x)) 
														{
															value = slider.value;
															ctx.clearRect(x,y,ctx.canvas.width,ctx.canvas.height);
															position = ((mouseX - 15 - x) / sliderLength);
															value = position
																	* max;
															if (min >= value) {
																value = min;
															} else if (value >= max) {
																value = max;
															}
															redraw(x, y, value,max, min,position,title);
															slider.value = canvasInput.value();
														} else {
															if (((sliderLength* position - 17) > (mouseX - 15 - x))) {

																place = slider.position* sliderLength- 17;
																position = place/ sliderLength;
																value = max* position;
																value = parseFloat(value).toFixed(0);
																value = (+value);
																if (min >= value) {
																	value = min;
																} else if (value >= max) {
																	value = max;
																}
																redraw(x,y,value,max,min,position,title);
																slider.value = value;
															}
															if (((sliderLength* position + 43) < (mouseX - 15 - x))) {
																place = slider.position* sliderLength
																		+ 17;
																position = place/ sliderLength;
																value = max* position;
																value = parseFloat(value).toFixed(0);
																value = (+value);
																if (min >= value) {
																	value = min;
																} else if (value >= max) {
																	value = max;
																}
																redraw(x,y,value,max,min,position,title);
																slider.value = value;
															}
														}
													}
												}
											}, scroll_time_interval);

						}, false);
		window.addEventListener("mouseup", function(event) {
			slider.value = value;
			window.clearInterval(stillpanning);
			stillpanning=null;
		});

	}
	;

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect(), root = document.documentElement;
		this.mouseX = evt.clientX - rect.left - root.scrollLeft;
		this.mouseY = evt.clientY - rect.top - root.scrollTop;
		return {
			x : mouseX,
			y : mouseY
		};
	}
	;

	slider.verify = function(value, max, min, x, y) {
		if (value > max || value < min) {
			ctx.fillStyle = 'grey';
			ctx.fillRect(x, y - 30, 204, 25);
			ctx.fillStyle = 'white';
			ctx.font = "11px Arial";
			ctx.fillText("Invalid input. Please enter a new number.", x + 4,
					y - 15);
			window.setTimeout(function() {
				ctx.clearRect(x, y - 30, 204, 25);
			}, 5000);
			return false;
		} else
			return true;
	};
	/**
	 * initializes and renders canvas input textbox on the slider
	 */

	createCI = function(x, y, value, max, min, title) { // x,y,value,position,max,min
			canvasInput = new CanvasInput({
			canvas : canvas,
			height : 15,
			x : x + 140,
			y : y + 7,
			backgroundColor : 'black',
			fontColor : 'white',
			fontSize : 15,
			padding : 0,
			width : 50,
			borderRadius : 0,
			borderWidth : 0,
			value : (value !== undefined ? value.toString() : ""),
			boxShadow : "none",
			innerShadow : "none",
			disableBlur : true,
			renderOnReturn : false,
			onsubmit : function() {
				value = this.value();
				var valid=slider.verify(value, max, min, x, y);
				if (!valid){
					this.enableBlur();
					this.blur();
					ctx.fillStyle = 'grey';
					ctx.fillRect(x, y - 30, 204, 25);
					ctx.fillStyle = 'white';
					ctx.font = "11px Arial";
					ctx.fillText("Invalid input. Please enter a new number.", x + 4,y - 15);
					window.setTimeout(function() {
						ctx.clearRect(x, y - 30, 204, 25);
					}, 5000);
				}
				else{
					if (min >= value) {
						value = min;
					} else if (value >= max) {
						value = max;
					}				
					plot._Gx.xdiv = this.value();
					sigplot.refresh(plot);
					canvas.style.zIndex="-1";
					this.cleanup();
					ctx.clearRect(0,0,canvas.width,canvas.height);
					
				}
				
			}
		});
		
	};
}(window.slider = window.slider || {}));
