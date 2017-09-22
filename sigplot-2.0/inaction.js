

var plot = new sigplot.Plot(document.getElementById('basic'), {
    xi: true, // invert background and foreground
    gridBackground: ["#fff", "#ddd"], // set a gradient background
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true, // only show panbars when necessary and the mouse is over the plot
    rightclick_rubberbox_action: "zoom"
});

var x = [];
var y = [];
var start = -100;

while (start <= 100)
{
    x.push(start);
    start += 0.5;
}

for (var i = 0; i < x.length; i++)
{
    var x_i = x[i];
    var y_i = Math.sin(10*x_i);
    y.push(y_i);

}

var layer = plot.overlay_array(y, null, {name: "y", line: 3});

plot.get_layer(layer).color = "orange";

var fft_plot = new sigplot.Plot(document.getElementById('fft-plot'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

fft_plot.overlay_href("assets/dat/fsk_fft.tmp", null, {name: "FFT"});

var slider1 = new sigplot_plugins.SliderPlugin({
  name: "Slider 1"
});
fft_plot.add_plugin(slider1);
var slider2 = new sigplot_plugins.SliderPlugin({
    name: "Slider 2"
});
fft_plot.add_plugin(slider2);
slider1.pair(slider2);
slider2.pair(slider1);
slider1.set_position(300000);
slider2.set_position(200000);
// slidertag events happen whenever a slider is moved
// programatically or by the user
fft_plot.addListener("slidertag", function(evt) {});
// sliderdrag events happen only when a slider is moved by
// the user
fft_plot.addListener("sliderdrag", function(evt) {});

var penny_plot = new sigplot.Plot(document.getElementById('penny-plot'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

penny_plot.overlay_href("assets/dat/penny.prm");

var iq_plot = new sigplot.Plot(document.getElementById('iq-plot'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

iq_plot.overlay_href("assets/dat/symbols_noise.tmp", null, {name: "I/Q", line: 0, symbol: 1});

iq_plot.change_settings({cmode: 5});

var penny_lines = new sigplot.Plot(document.getElementById('line-penny'), {
  autohide_readout: true, // only show the readout when the mouse is over the plot
  autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

penny_lines.overlay_href("assets/dat/penny.prm", 3, {layerType: sigplot.Layer1D});

var modem = new sigplot.Plot(document.getElementById('modem'), {
  autohide_readout: true, // only show the readout when the mouse is over the plot
  autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

modem.overlay_href("assets/dat/dial-up-modem.tmp", 3);

var accordionv = new sigplot_plugins.AccordionPlugin({
  draw_center_line: true,
  shade_area: true,
  draw_edge_lines: true,
  direction: "vertical",
  edge_line_style: {
    strokeStyle: "#FF2400"
  }
});
modem.add_plugin(accordionv, 1);
accordionv.set_center(3);
accordionv.set_width(0.5);

modem.addListener('mtag', function(event) {
  accordionv.set_center(modem._Gx.retx);
})

var rt_plot = new sigplot.Plot(document.getElementById('rt-plot'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

update_rtplot();
var hdl = window.setInterval(update_rtplot, 500);

var cnt = 0;
function update_rtplot() {
    var random = [];
    for (var i = 0; i <= 1000; i += 1) {
        random.push(Math.random());
    }

    var data_layer = rt_plot.get_layer(0);
    if (data_layer) {
        cnt += 1;
    if (cnt === 10) {
        rt_plot.get_layer(0).hcb.xstart = -100;
        rt_plot.get_layer(0).xmin = -100;
        rt_plot.change_settings({xmin: -100, xmax: -100+1000})
    }
        rt_plot.reload(0, random);
    } else {
        rt_plot.change_settings({
            cmode : 3,
            autol: -1
        });
    rt_plot.overlay_array(random,{file_name: "random"});
                }
}

var rt_raster = new sigplot.Plot(document.getElementById('rt-raster'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

update_rtraster();
var hdl = window.setInterval(update_rtraster, 300);


function update_rtraster() {
    var random = [];
    var framesize = 8192;
    for (var i = 0; i < framesize; i += 1) {
        random.push(Math.random());
    }

    var data_layer = rt_raster.get_layer(0);
    if (!data_layer) {
        rt_raster.change_settings({
            cmode : 3,
            autol: 5,
            all: true,
        });
        rt_raster.overlay_pipe({type: 2000, subsize: framesize, file_name: "random"});
    }
    rt_raster.push(0, random);
}

var rt_iq = new sigplot.Plot(document.getElementById('rt-iq'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

update_rtiq();
var hdl = window.setInterval(update_rtiq, 500);

function update_rtiq() {
  var random = [];
  for (var i = 0; i <= 1024; i += 1) {
      random.push((Math.random()*2)-1);
  }

  var data_layer = rt_iq.get_layer(0);
  if (!data_layer) {
      rt_iq.overlay_pipe({type: 1000, format: "CF"}, { framesize: 512, line: 0, radius: 1, symbol: 1});
      rt_iq.change_settings({
                  cmode: 5,
                  ymin: -2,
                  ymax: 2,
                  xmin: -2,
                  xmax: 2,
      });
  }
  rt_iq.push(0, random);
}

var rt_line = new sigplot.Plot(document.getElementById('rt-line'), {
    autohide_readout: true,
    autohide_panbars: true
});

update_rtline();
var hdl = window.setInterval(update_rtline, 100);

function update_rtline() {
		var random = [];
		for (var i = 0; i <= 128; i += 1) {
			random.push(Math.random());
		}

		var data_layer = rt_line.get_layer(0);
		if (!data_layer) {
			rt_line.overlay_pipe({type: 1000}, { framesize: 32768, drawmode: "scrolling", file_name: "random"});
			rt_line.change_settings({
				ymin: -2,
				ymax: 2
			});
		}
		rt_line.push(0, random);
	}

  var oned_stream = new sigplot.Plot(document.getElementById('1d-stream'), {
    autohide_readout: true,
    autohide_panbars: true,
    autol: 5,
    cmode: "LO"
  })

  var twod_stream = new sigplot.Plot(document.getElementById('2d-stream'),
  {
    autohide_readout: true,
    autohide_panbars: true,
    autol: 5,
    cmode: "LO"
  })

  function getURLParameter(name) {
      return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(
          location.search) || [, null])[1]);
  }

  var stream_annotaions;
  var updater;
  var oned_stream_layer1;
  var oned_stream_layer2;
  var twod_stream_layer;

  var fs = 44100;
  var fftsize = 2048;
  var xdelta = fs / fftsize;

  var complex_mode = (getURLParameter("complex") === "true");

  var osc1 = new Oscillator(DSP.SINEWAVE, 440, 1, 2048, 44100);
  var hann1 = new WindowFunction(DSP.HANN)
  var fft1 = new FFT(fftsize, fs);

  var osc2 = new Oscillator(DSP.SINEWAVE, 14400, 1, 2048, 44100);
  var hann2 = new WindowFunction(DSP.HANN)
  var fft2 = new FFT(fftsize, fs);

  function initialize() {
    stream_annotations = new sigplot_plugins.AnnotationPlugin();
    twod_stream.add_plugin(stream_annotations);

    if (complex_mode) {
      oned_stream_layer1 = oned_stream.overlay_array(null, {
          format: 'CF',
          xdelta: xdelta,
          xunits: 3,
          size: fftsize / 2,
          yunits: 26
      });

      oned_stream_layer2 = oned_stream.overlay_array(null, {
          format: 'CF',
          xdelta: xdelta,
          xunits: 3,
          size: fftsize / 2,
          yunits: 26
      });

      twod_stream_layer = twod_stream.overlay_pipe({
          type: 2000,
          format: 'CF',
          subsize: fftsize / 2,
          xdelta: xdelta,
          pipesize: (fftsize / 2) * 8,
          xunits: 3
      });
    } else {
      oned_stream_layer1 = oned_stream.overlay_array(null, {
          xdelta: xdelta,
          xunits: 3,
          yunits: 26,
          size: fftsize / 2
      });

      oned_stream_layer2 = oned_stream.overlay_array(null, {
          xdelta: xdelta,
          xunits: 3,
          yunits: 26,
          size: fftsize / 2
      });

      twod_stream_layer = twod_stream.overlay_pipe({
          type: 2000,
          subsize: fftsize / 2,
          xdelta: xdelta,
          xunits: 3
      });
    }
  }

  //document.getElementById('freq').innerHTML = osc1.frequency.toFixed(2) + " Hz";
  twod_stream.mimic(oned_stream, {
    xzoom: true,
    unzoom: true,
    xpan: true
  });
  oned_stream.mimic(twod_stream, {
    xzoom: true,
    unzoom: true,
    xpan: true
  });

  function update() {
      osc1.generate();
      hann1.process(osc1.signal)
      fft1.forward(osc1.signal);
      var spectrum1;
      if (complex_mode) {
          spectrum1 = DSP.interleave(fft1.real, fft1.imag);
          spectrum1 = spectrum.subarray(0, fftsize);
      } else {
          spectrum1 = fft1.spectrum;
      }

      // Reload the data layer
      if (oned_stream_layer1 !== undefined) {
          oned_stream.reload(oned_stream_layer1, spectrum1);
      }

      osc2.generate();
      hann2.process(osc2.signal)
      fft2.forward(osc2.signal);
      var spectrum2;
      if (complex_mode) {
          spectrum2 = DSP.interleave(fft2.real, fft2.imag);
          spectrum2 = spectrum.subarray(0, fftsize);
      } else {
          spectrum2 = fft2.spectrum;
      }
      if (oned_stream_layer2 !== undefined) {
          oned_stream.reload(oned_stream_layer2, spectrum2);
      }

      var mix = DSP.mixSampleBuffers(spectrum1, spectrum2, false, 1);
      if (twod_stream_layer !== undefined) {
          twod_stream.push(twod_stream_layer, mix);
      }
  }

  window.onload = function() {
      initialize();

      document.getElementById('framerate').value = 10;
      document.getElementById('framerate').addEventListener('input', function() {
          change_framerate();
      });
      change_framerate();

      document.getElementById('freq1').value = osc1.frequency.toFixed(2);
      document.getElementById('freq1').addEventListener('input', function() {
          change_freq1();
      });
      change_freq1();

      document.getElementById('freq2').value = osc2.frequency.toFixed(2);
      document.getElementById('freq2').addEventListener('input', function() {
          change_freq2();
      });
      change_freq2();

      oned_stream.addListener("mtag", function(event) {
          // values directly on the at the axis edges
          // will cause the osciallator problems...on the
          // upper edge you need to to stay one whole
          // frequency bin away from the axis
          if ((event.x > 0) && (event.x < 22028)) {
              if (event.x != osc1.frequency) {
                  osc1.setFreq(event.x);
                  document.getElementById('freq1').value = osc1.frequency.toFixed(2);
                  document.getElementById('freq1val').innerHTML = osc1.frequency.toFixed(2) + " Hz";
              }
          }
      });

      twod_stream.addListener("mtag", function(event) {
          stream_annotations.add_annotation({
              x: event.x,
              y: event.y,
              value: "click"
          });
      });
  }

  function change_framerate() {
      var framerate = document.getElementById('framerate').value;

      framerate = parseFloat(framerate);
      if (isNaN(framerate)) {
          alert("Invalid framerate");
          return;
      }
      if (framerate <= 0) {
          alert("Invalid framerate");
          return;
      }

      var interval = (1.0 / framerate) * 1000;
      if (updater !== undefined) {
          window.clearInterval(updater);
      }
      updater = window.setInterval(update, interval);
  }

  function change_freq1() {
      var freq1 = document.getElementById('freq1').value;

      freq1 = parseFloat(freq1);
      if (isNaN(freq1)) {
          alert("Invalid freq1");
          return;
      }
      if (freq1 <= 0) {
          alert("Invalid freq1");
          return;
      }

      osc1.setFreq(freq1);
      document.getElementById('freq1val').innerHTML = osc1.frequency.toFixed(2) + " Hz";
  }

  function change_freq2() {
    var freq2 = document.getElementById('freq2').value;

    freq2 = parseFloat(freq2);
    if (isNaN(freq2)) {
        alert("Invalid freq2");
        return;
    }
    if (freq2 <= 0) {
        alert("Invalid freq2");
        return;
    }

    osc2.setFreq(freq2);
    document.getElementById('freq2val').innerHTML = osc2.frequency.toFixed(2) + " Hz";
  }


var audio_bf = new sigplot.Plot(document.getElementById('audio-bf'), {
  autohide_panbars: true,
  autohide_readout: true,
  all: true,
  expand: true
})

var audio_array = new sigplot.Plot(document.getElementById('audio-array'), {
  autohide_panbars: true,
  autohide_readout: true
})

var audioContext;
var audio;
var audioBuffer;

var source;
var analyser;

var data_layer;

var start_time = 0;
var start_offset = 0;

if (typeof AudioContext !== 'undefined') {
    audioContext = new AudioContext();
} else if (typeof webkitAudioContext !== 'undefined') {
    audioContext = new webkitAudioContext();
} else if (typeof Audio !== 'undefined') {
    //Create an <audio> element dynamically.
    audio = new Audio();
    audio.src = 'assets/dat/dial-up-modem.wav';
    audio.controls = false;
    audio.autoplay = false;
    document.body.appendChild(audio);
} else {
    alert("Your brower does not support audio playback");
}

if ((audioContext) && (audioContext.decodeAudioData)) {
  // Demonstrate how to plot an audio buffer directly if possible
  loadPlotFromWav();
} else {
  loadPlotFromHref();
}

if (audio || audioContext) {
  slider = new sigplot_plugins.SliderPlugin({
      style: {
          strokeStyle: "#FF2400"
      }
  });
  audio_bf.add_plugin(slider, 1);
  slider.set_position(0.0);

  slider.addListener("sliderdrag", function(evt) {
      start_offset = evt.position;
  });

  controls = new sigplot_plugins.PlaybackControlsPlugin();
  audio_bf.add_plugin(controls);
  controls.addListener("playbackevt", function(evt) {
      if (evt.state === "playing") {
          if (audio) {
              audio.currentTime = start_offset;
              audio.play();
          } else if (audioContext && !source) {
              source = audioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(analyser);
              if (typeof source.start === 'undefined') {
                  var remainingTime = audioBuffer.duration - start_offset;
                  source.noteGrainOn(0, start_offset, remainingTime);
              } else {
                  source.start(0, start_offset);
              }
              start_time = audioContext.currentTime;
          }
          slider.options.prevent_drag = true;
      } else {
          if (audio) {
              audio.pause();
          } else if (audioContext && source) {
              start_time = null;
              if (typeof source.stop === 'undefined') {
                  source.noteOff(0);
              } else {
                  source.stop(0);
              }
              source = null;
          }
          slider.options.prevent_drag = false;
      }
  });

  if (audio) {
      audio.onended = function() {
          audio.pause();
          audio.currentTime = start_offset;
          slider.set_position(start_offset)
          controls.toggle("paused");
      };
  }

  update_slider();
}

if (audioContext && audioContext.createAnalyser) {
  analyser = audioContext.createAnalyser();
  analyser.connect(audioContext.destination);

  // Don't run analyze in a requestAnimFrame because
  // it will cause too many calls to refresh on the plot
  var framerate = 10;
  var interval = (1.0 / framerate) * 1000;
  window.setInterval(analyze, interval);
} /*else {
  document.getElementById('audio-bf').css = {height: "400px",
    width: "90%",
    "float": "none",
    "margin-left": "auto",
    "margin-right": "auto"}
  $("#right-plot").hide();
  plot.checkresize();
}*/

// Update the slider using an animation frame
// update so that it stays very in-sync with the current audio playback
function update_slider() {
    requestAnimFrame(update_slider);
    if (audio && !audio.paused) {
        slider.set_position(audio.currentTime);
    } else if (audioContext && start_time) {
        var position = start_offset + audioContext.currentTime - start_time;
        if (position >= source.buffer.duration) {
            controls.toggle("paused");
            slider.set_position(start_offset);
        } else {
            slider.set_position(position);
        }
    }
}
function analyze() {
    if (audio && audio.paused) return;
    if (audioContext && !source) return;

    if (analyser.frequencyBinCount > 0) {
        var freqData = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(freqData); //analyser.getFloaTimeDomainData(timeData);
        // Reload the data layer
        if (data_layer !== undefined) {
            audio_array.reload(data_layer, freqData);
        } else {

            data_layer = audio_array.overlay_array(freqData, {
                xunits: 3,
                yunits: 35,
                xdelta: ((audioContext.sampleRate * 0.5) / analyser.frequencyBinCount)
            });
        }
    }
}

function loadPlotFromHref() {
    plot.overlay_href("assets/dat/dial-up-modem.tmp");
}

function loadPlotFromWav() {
    var request = new XMLHttpRequest();
    request.open('GET', "assets/dat/dial-up-modem.wav", true);
    request.responseType = 'arraybuffer';

    var handlebuffer = function(buffer) {
        audioBuffer = buffer;
        for (var i = 0; i < audioBuffer.numberOfChannels; i++) {
            // decimate the time domain data so that Firefox can plot it...chrome can handle the
            // larger data size
            var data = audioBuffer.getChannelData(i);
            var shortData = new Float32Array(data.length / 10);
            for (var j = 0; j < shortData.length; j++) {
                shortData[j] = data[j * 10];
            }

            audio_bf.overlay_array(shortData, {
                xdelta: 10.0 / audioBuffer.sampleRate,
                xunits: 1
            });
        }
    };

    // Decode asynchronously
    request.onload = function() {
        audioContext.decodeAudioData(request.response, handlebuffer, onerror);
    }
    request.send();
}

var plot_name = [['basic-wt', plot], ['fft-wt', fft_plot], ['penny-wt', penny_plot],
  ['iq-wt', iq_plot], ['penny-line-wt', penny_lines], ['modem-wt', modem], ['rt-plot-wt', rt_plot],
  ['rt-raster-wt', rt_raster], ['rt-iq-wt', rt_iq], ['rt-line-wt', rt_line],
  ['2-plot-stream', oned_stream, twod_stream], ['2-plot-audio', audio_bf, audio_array]];

var curr_display = 'basic-wt';

document.getElementById('basic-btn').onclick = function() {
  if (curr_display === 'basic-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'basic-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('fft-btn').onclick = function() {
  if (curr_display === 'fft-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'fft-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('penny-btn').onclick = function() {
  if (curr_display === 'penny-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'penny-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('iq-btn').onclick = function() {
  if (curr_display === 'iq-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'iq-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('lines-btn').onclick = function() {
  if (curr_display === 'penny-line-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'penny-line-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('modem-btn').onclick = function() {
  if (curr_display === 'modem-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'modem-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('rt-plot-btn').onclick = function() {
  if (curr_display === 'rt-plot-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'rt-plot-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('rt-raster-btn').onclick = function() {
  if (curr_display === 'rt-raster-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'rt-raster-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('rt-iq-btn').onclick = function() {
  if (curr_display === 'rt-iq-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'rt-iq-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('rt-line-btn').onclick = function() {
  if (curr_display === 'rt-line-wt') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = 'rt-line-wt';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('stream-btn').onclick = function() {
  if (curr_display === '2-plot-stream') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = '2-plot-stream';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('audio-btn').onclick = function() {
  if (curr_display === '2-plot-audio') {
    return;
  }
  document.getElementById(curr_display).style.display = 'none';
  curr_display = '2-plot-audio';
  document.getElementById(curr_display).style.display = 'block';
};

document.getElementById('solid-grid-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({gridStyle: {"color": "#999999"}});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({gridStyle: {"color": "#999999"}});
      }
    }
  }
}

document.getElementById('dotted-grid-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({gridStyle: null});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({gridStyle: null});
      }
    }
  }
}

document.getElementById('no-grid-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({grid: false});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({grid: false});
      }
    }
  }
}

document.getElementById('x-grid-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({grid: "x"});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({grid: "x"});
      }
    }
  }
}

document.getElementById('y-grid-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({grid: "y"});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({grid: "y"});
      }
    }
  }
}

document.getElementById('xy-grid-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({grid: true});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({grid: true});
      }
    }
  }
}

document.getElementById('crosshair-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({cross: null});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({cross: null});
      }
    }
  }
}

document.getElementById('x-axis-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({show_x_axis: null});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({show_x_axis: null});
      }
    }
  }
}

document.getElementById('y-axis-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({show_y_axis: null});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({show_y_axis: null});
      }
    }
  }
}

document.getElementById('readout-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({show_readout: null});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({show_readout: null});
      }
    }
  }
}

document.getElementById('scrollbar-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({pan: null});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({pan: null});
      }
    }
  }
}

document.getElementById('colors-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      if (i === 0) {
        if (plot_name[i][1]._Gx.gridBackground[0] === "#fff") {
          plot_name[i][1].change_settings({invert: null, gridBackground: ["#585858", "#000"]});
        } else {
          plot_name[i][1].change_settings({invert: null, gridBackground: ["#fff", "#ddd"]});
        }
      } else {
          plot_name[i][1].change_settings({invert: null});
      }
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({invert: null});
      }
    }
  }
}

document.getElementById('color-fill-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      if (i !== 11) {
        if ((plot_name[i][1]._Gx.fillStyle === null) || (plot_name[i][1]._Gx.fillStyle === undefined)) {
          plot_name[i][1].change_settings({fillStyle: "rgba(224, 255, 194, 0.5)"});
        } else {
          plot_name[i][1].change_settings({fillStyle: null});
        }
      }
      if ((i === 10) || (i === 11)) {
        if ((plot_name[i][2]._Gx.fillStyle === null) || (plot_name[i][2]._Gx.fillStyle === undefined)) {
          plot_name[i][2].change_settings({fillStyle: "rgba(224, 255, 194, 0.5)"});
        } else {
          plot_name[i][2].change_settings({fillStyle: null});
        }
      }
    }
  }
}

document.getElementById('gradient-fill-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      if (i !== 11) {
        if ((plot_name[i][1]._Gx.fillStyle === null) || (plot_name[i][1]._Gx.fillStyle === undefined)) {
          plot_name[i][1].change_settings({fillStyle: ["rgba(224, 255, 194, 0.0)", "rgba(0, 153, 51, 0.7)", "rgba(0, 0, 0, 1.0)"]});
        } else {
          plot_name[i][1].change_settings({fillStyle: null});
        }
      }
      if ((i === 10) || (i === 11)) {
        if ((plot_name[i][2]._Gx.fillStyle === null) || (plot_name[i][2]._Gx.fillStyle === undefined)) {
          plot_name[i][2].change_settings({fillStyle: ["rgba(224, 255, 194, 0.0)", "rgba(0, 153, 51, 0.7)", "rgba(0, 0, 0, 1.0)"]});
        } else {
          plot_name[i][2].change_settings({fillStyle: null});
        }
      }
    }
  }
}

document.getElementById('wz-off-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({wheelZoom: false});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({wheelZoom: false});
      }
    }
  }
}

document.getElementById('wz-x-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({wheelZoom: "x"});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({wheelZoom: "x"});
      }
    }
  }
}

document.getElementById('wz-y-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({wheelZoom: "y"});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({wheelZoom: "y"});
      }
    }
  }
}

document.getElementById('wz-xy-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({wheelZoom: true});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({wheelZoom: true});
      }
    }
  }
}

document.getElementById('mb-zoom-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({rubberbox_action: 'zoom'});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({rubberbox_action: 'zoom'});
      }
    }
  }
}

document.getElementById('mb-select-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({rubberbox_action: 'select'});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({rubberbox_action: 'select'});
      }
    }
  }
}

document.getElementById('mb-off-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({rubberbox_action: null});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({rubberbox_action: null});
      }
    }
  }
}

document.getElementById('mb-box-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({rubberbox_mode: 'box'});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({rubberbox_mode: 'box'});
      }
    }
  }
}

document.getElementById('mb-horizontal-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({rubberbox_mode: 'horizontal'});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({rubberbox_mode: 'horizontal'});
      }
    }
  }
}

document.getElementById('mb-vertical-btn').onclick = function() {
  for (var i = 0; i < 11; i++) {
    if (curr_display === plot_name[i][0]) {
      plot_name[i][1].change_settings({rubberbox_mode: 'vertical'});
      if ((i === 10) || (i === 11)) {
        plot_name[i][2].change_settings({rubberbox_mode: 'vertical'});
      }
    }
  }
}

document.getElementById('raster-scrolling-btn').onclick = function() {
  if (curr_display === plot_name[7][0]) {
    plot_name[7][1].change_settings({drawmode: 'scrolling'});
  }
  if (curr_display === plot_name[10][0]) {
    plot_name[10][2].change_settings({drawmode: 'scrolling'});
  }
}

document.getElementById('raster-rising-btn').onclick = function() {
  if (curr_display === plot_name[7][0]) {
    plot_name[7][1].change_settings({drawmode: 'rising'});
  }
  if (curr_display === plot_name[10][0]) {
    plot_name[10][2].change_settings({drawmode: 'rising'});
  }
}

document.getElementById('raster-falling-btn').onclick = function() {
  if (curr_display === plot_name[6][0]) {
    plot_name[7][1].change_settings({drawmode: 'falling'});
  }
  if (curr_display === plot_name[10][0]) {
    plot_name[10][2].change_settings({drawmode: 'falling'});
  }
}

document.getElementById('scroll-line-btn').onclick = function() {
  if (curr_display === plot_name[9][0]) {
    plot_name[9][1].change_settings({drawmode: 'scrolling'});
  }
}

document.getElementById('l-to-r-btn').onclick = function() {
  if (curr_display === plot_name[9][0]) {
    plot_name[9][1].change_settings({drawmode: 'lefttoright'});
  }
}

document.getElementById('r-to-l-btn').onclick = function() {
  if (curr_display === plot_name[9][0]) {
    plot_name[9][1].change_settings({drawmode: 'righttoleft'});
  }
}

for (var i = 0; i < 12; i++) {
  if (plot_name[i][0] !== curr_display) {
    document.getElementById(plot_name[i][0]).style.display = 'none';
  }
}
