/**
 * @license
 * File: plugins.js
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

(function() {

// Bundle all the standard-plugins into this module
module.exports = {
	SigplotPlugin		   : require("./sigplot.plugin"),
    AccordionPlugin        : require("./sigplot.accordion"),
    AnnotationPlugin       : require("./sigplot.annotations"),
    BoxesPlugin            : require("./sigplot.boxes"),
    PlaybackControlsPlugin : require("./sigplot.playback"),
    SliderPlugin           : require("./sigplot.slider"),
    PeakSelector		   : require("./sigplot.peakselector")
};

}());
