
//var myscope = myscope || {};

//(function (myscope){

  document.getElementById('s_1').onclick = function(){
    localStorage.setItem("demo", "examples/rt_array_demo.html");
    //localStorage.setItem("frame_height", 1000);
    localStorage.setItem("just_clicked", true);
    document.getElementById('s_1_l').click();
  }
  document.getElementById('s_2').onclick = function(){
    localStorage.setItem("demo", "examples/rt_raster_demo.html");
    //localStorage.setItem("frame_height", 975);
    localStorage.setItem("just_clicked", true);
    document.getElementById('s_2_l').click();
  }
  document.getElementById('stream').onclick = function(){
    localStorage.setItem("demo", "examples/streams_demo.html");
    //localStorage.setItem("frame_height", 1350);
    localStorage.setItem("just_clicked", true);
    document.getElementById('stream_l').click();
  }
  document.getElementById('aud').onclick = function(){
    localStorage.setItem("demo", "examples/audio_demo.html");
    //localStorage.setItem("frame_height", 1075);
    localStorage.setItem("just_clicked", true);
    document.getElementById('aud_l').click();
  }
  document.getElementById('appear').onclick = function(){
    localStorage.setItem("demo", "examples/appearance_demo.html");
  //  localStorage.setItem("frame_height", 1200);
    localStorage.setItem("just_clicked", true);
    document.getElementById('appear_l').click();
  }
  document.getElementById('mo_ev').onclick = function(){
    localStorage.setItem("demo", "examples/mouse_events_demo.html");
    //localStorage.setItem("frame_height", 1100);
    localStorage.setItem("just_clicked", true);
    document.getElementById('mo_ev_l').click();
  }
  document.getElementById('menu').onclick = function(){
    localStorage.setItem("demo", "examples/menu_demo.html");
    //localStorage.setItem("frame_height", 1125);
    localStorage.setItem("just_clicked", true);
    document.getElementById('menu_l').click();
  }
  document.getElementById('mo_se').onclick = function(){
    localStorage.setItem("demo", "examples/mouse_select_demo.html");
    //localStorage.setItem("frame_height", 875);
    localStorage.setItem("just_clicked", true);
    document.getElementById('mo_se_l').click();
  }
  document.getElementById('high').onclick = function(){
    localStorage.setItem("demo", "examples/highlight_demo.html");
    localStorage.setItem("frame_height", 1050);
    localStorage.setItem("just_clicked", true);
    document.getElementById('high_l').click();
  }
  document.getElementById('color').onclick = function(){
    localStorage.setItem("demo", "examples/colorbar_demo.html");
    //localStorage.setItem("frame_height", 1050);
    localStorage.setItem("just_clicked", true);
    document.getElementById('color_l').click();
  }
  document.getElementById('acc').onclick = function(){
    localStorage.setItem("demo", "examples/acc_demo.html");
    //localStorage.setItem("frame_height", 1175);
    localStorage.setItem("just_clicked", true);
    document.getElementById('acc_l').click();
  }
  document.getElementById('ann').onclick = function(){
    localStorage.setItem("demo", "examples/ann_demo.html");
    //localStorage.setItem("frame_height", 1275);
    localStorage.setItem("just_clicked", true);
    document.getElementById('ann_l').click();
  }
  document.getElementById('boxes').onclick = function(){
    localStorage.setItem("demo", "examples/box_demo.html");
    //.setItem("frame_height", 1125);
    localStorage.setItem("just_clicked", true);
    document.getElementById('boxes_l').click();
  }
  document.getElementById('slide').onclick = function(){
    localStorage.setItem("demo", "examples/slider_demo.html");
    //localStorage.setItem("frame_height", 1275);
    localStorage.setItem("just_clicked", true);
    document.getElementById('slide_l').click();
  }

  var oned_sr = new sigplot.Plot(document.getElementById('1d-sr'), {
    autohide_readout: true,
    autohide_panbars: true
  })

  update_rtplot();
  var hdl = window.setInterval(update_rtplot, 500);

  var cnt = 0;
  function update_rtplot() {
      var random = [];
      for (var i = 0; i <= 1000; i += 1) {
          random.push(Math.random());
      }

      var data_layer = oned_sr.get_layer(0);
      if (data_layer) {
          cnt += 1;
      if (cnt === 10) {
          oned_sr.get_layer(0).hcb.xstart = -100;
          oned_sr.get_layer(0).xmin = -100;
          oned_sr.change_settings({xmin: -100, xmax: -100+1000})
      }
          oned_sr.reload(0, random);
      } else {
          oned_sr.change_settings({
              cmode : 3,
              autol: -1
          });
      oned_sr.overlay_array(random,{file_name: "random"});
                  }
  }

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

  var twod_sr = new sigplot.Plot(document.getElementById('2d-sr'), {
    autohide_readout: true,
    autohide_panbars: true
  })

  update_rtraster();
  var hdl = window.setInterval(update_rtraster, 300);


  function update_rtraster() {
      var random = [];
      var framesize = 8192;
      for (var i = 0; i < framesize; i += 1) {
          random.push(Math.random());
      }

      var data_layer = twod_sr.get_layer(0);
      if (!data_layer) {
          //console.log("initialize raster data layer");
          twod_sr.change_settings({
              cmode : 3,
              autol: 5,
              all: true,
          });
          twod_sr.overlay_pipe({type: 2000, subsize: framesize, file_name: "random"});
      }
      twod_sr.push(0, random);
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

  //oned_stream.overlay_array(y, null, {name: "y", line: 3});
  //twod_stream.overlay_array(y, null, {name: "y", line: 3});

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
  console.log('complex mode:', complex_mode);

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
          spectrum1 = spectrum1.subarray(0, fftsize);
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
          spectrum2 = spectrum2.subarray(0, fftsize);
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

      document.getElementById('scrolling').onclick = function() {
          twod_stream.change_settings({
              drawmode: 'scrolling'
          });
          stream_annotations.clear_annotations();
      };
      document.getElementById('rising').onclick = function() {
          twod_stream.change_settings({
              drawmode: 'rising'
          });
          stream_annotations.clear_annotations();
      };
      document.getElementById('falling').onclick = function() {
          twod_stream.change_settings({
              drawmode: 'falling'
          });
          stream_annotations.clear_annotations();
      };
      document.getElementById('defaultcmap').onclick = function() {
          console.log("DEFAULT!")
          twod_stream.change_settings({
              cmap: null
          });
      };
      document.getElementById('greyscale').onclick = function() {
          twod_stream.change_settings({
              cmap: 0
          });
      };
      document.getElementById('ramp').onclick = function() {
          twod_stream.change_settings({
              cmap: 1
          });
      };
      document.getElementById('wheel').onclick = function() {
          twod_stream.change_settings({
              cmap: 2
          });
      };
      document.getElementById('spectrum').onclick = function() {
          twod_stream.change_settings({
              cmap: 3
          });
      };
      document.getElementById('sunset').onclick = function() {
          twod_stream.change_settings({
              cmap: 4
          });
      };

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
      /*
      twod_stream.addListener("annotationhighlight", function(evt) {
          if (evt.state) {
              if (!evt.annotation.tooltip) {
                  var msg = "x=" + evt.annotation.x + " y=" + evt.annotation.y;
                  evt.annotation.tooltip = new Opentip($('#bottom-plot'),
                      msg, {
                          "extends": "glass",
                          showOn: null
                      });
              }
              evt.annotation.tooltip.show();
          } else {
              if (evt.annotation.tooltip) {
                  evt.annotation.tooltip.hide();
              }
          }
      });*/
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

  //audio_bf.overlay_array(y, null, {name: "y", line: 3});

  //audio_array.overlay_array(y, null, {name: "y", line: 3});

  var appearance = new sigplot.Plot(document.getElementById('appearance'), {
    xi: true, //invert backrgound and foreground
    gridBackground: ["#fff", "#ddd"], //set a gradient background
    autohide_readout: true, //only show readout when mouse is over plot
    autohide_readout: true, //only show readout when mouse is over plot
    autohide_panbars: true //show panbars when necessary and mouse is over plot
  });

  appearance.overlay_array(y, null, {name: "y", line: 3});

  document.getElementById('invert').onclick = function() {
    if (appearance._Gx.gridBackground[0] === "#fff") {
      appearance.change_settings({invert: null, gridBackground: ["#585858", "#000"]});
    }
    else {
      appearance.change_settings({invert: null, gridBackground: ["#fff", "#ddd"]});
    }
  };

  var mtags = new sigplot.Plot(document.getElementById('mtags'), {
    autohide_panbars: true,
    autohide_readout: true
  })

  mtags.overlay_array(y, null, {name: "y", line: 3});

  mtags.addListener('mtag', function(event) {
    console.log(mtags._Mx.xpos + ", " + mtags._Mx.ypos);
    console.log(mtags._Gx.retx + ", " + mtags._Gx.rety);
    var elt1 = document.getElementById('mtagx');
    elt1.innerHTML = "X: " + event.x.toFixed(8);
    var elt2 = document.getElementById('mtagy');
    elt2.innerHTML = "Y: " + event.y.toFixed(8);
  });

  var menu_plot = new sigplot.Plot(document.getElementById('menu-plot'), {
    autohide_panbars: true,
    autohide_readout: true,
    nomenu: true
  })

  var s = [];
  var t = [];
  start = 0;
  while (start <= 25)
  {
      t.push(start);
      start += 0.25;
  }
  for (var i = 0; i < t.length; i++)
  {
      var t_i = t[i];
      var s_i = Math.sin(t_i);
      s.push(s_i);
  }

  var menu_layer = menu_plot.overlay_array(s, null, {name: "s", line: 3});

  document.getElementById('go_red').onclick = function() {
    menu_plot.get_layer(0).color = "red";
    menu_plot.refresh();
  };
  document.getElementById('go_orange').onclick = function() {
    menu_plot.get_layer(0).color = "orange";
    menu_plot.refresh();
  };
  document.getElementById('go_yellow').onclick = function() {
    menu_plot.get_layer(0).color = "yellow";
    menu_plot.refresh();
  };
  document.getElementById('go_green').onclick = function() {
    menu_plot.get_layer(0).color = "green";
    menu_plot.refresh();
  };
  document.getElementById('go_blue').onclick = function() {
    menu_plot.get_layer(0).color = "blue";
    menu_plot.refresh();
  };
  document.getElementById('go_purple').onclick = function() {
    menu_plot.get_layer(0).color = "purple";
    menu_plot.refresh();
  };

  menu_plot.addListener("showmenu", function(event) {
    document.getElementById('custom-menu').style.display = "block";
  });

  menu_plot.addListener("hidemenu", function(event) {
    document.getElementById('custom-menu').style.display = "none";
  });

  var ms_plot = new sigplot.Plot(document.getElementById('mselection-plot'), {
    autohide_panbars: true,
    autohide_readout: true
  })

  ms_plot.overlay_array(y, null, {name: "y", line: 3});

  document.getElementById('vertical').onclick = function() {
    ms_plot.change_settings({rubberbox_mode: "vertical"});
  };
  document.getElementById('horizontal').onclick = function() {
    ms_plot.change_settings({rubberbox_mode: "horizontal"});
  };
  document.getElementById('box').onclick = function() {
    ms_plot.change_settings({rubberbox_mode: "box"});
  };

  var hl_plot = new sigplot.Plot(document.getElementById('hl-plot'), {
    autohide_panbars: true,
    autohide_readout: true
  })

  hl_plot.overlay_array(y, null, {name: "y", line: 3});
  hl_plot.change_settings({rubberbox_mode: "horizontal"});

  hl_plot.addListener('mtag', function(event) {
    if ((event.w !== undefined) && (event.h !== undefined)) {
      hl_plot.get_layer(0).add_highlight({
        xstart: event.x,
        xend: event.x + event.w,
        color: "red"
      });
    }
  });

  hl_plot.addListener("mdblclick", function(event) {
      var highlights = hl_plot.get_layer(0).get_highlights();
      for (var i = 0; i < highlights.length; i++) {
        var highlight = highlights[i];
        if ((highlight.xstart <= event.x) && (highlight.xend >= event.x)) {
            hl_plot.get_layer(0).remove_highlight(highlight);
        }
      }
  });

  document.getElementById('clear').onclick = function() {
    var highlights = hl_plot.get_layer(0).get_highlights();
    for (var i = 0; i < highlights.length; i++) {
      var highlight = highlights[i];
      hl_plot.get_layer(0).remove_highlight(highlight)
    }
  };

  var cb_plot =  new sigplot.Plot(document.getElementById('cb-plot'), {
    autohide_panbars: true,
    autohide_readout: true
  })

  cb_plot.overlay_href("assets/dat/penny.prm");
  cb_plot.change_settings({lg_colorbar: true});
  //cb_plot.overlay_array(y, null, {name: "y", line: 3});

  document.getElementById('colorbar').onclick = function() {
    cb_plot.change_settings({lg_colorbar: !cb_plot._Gx.lg_bcolorbar});
  };

  var acc_plot = new sigplot.Plot(document.getElementById('acc-plot'), {
    autohide_panbars: true,
    autohide_readout: true
  })

  acc_plot.overlay_array(s, null, {name: null, line: 3});

  var accordionv = new sigplot_plugins.AccordionPlugin({
    draw_center_line: true,
    shade_area: true,
    draw_edge_lines: true,
    direction: "vertical",
    edge_line_style: {
      strokeStyle: "#FF2400"
    }
  });

  acc_plot.add_plugin(accordionv, 1);
  accordionv.set_center(40);
  accordionv.set_width(10);

  var accordionh = new sigplot_plugins.AccordionPlugin({
    draw_center_line: true,
    shade_area: true,
    draw_edge_lines: true,
    direction: "horizontal",
    edge_line_style: {
      strokeStyle: "#9BD5E0"
    }
  });

  acc_plot.add_plugin(accordionh, 1);
  accordionh.set_center(0);
  accordionh.set_width(0.25);

  var annotate_plot = new sigplot.Plot(document.getElementById('annotate-plot'), {
    autohide_panbars: true,
    autohide_readout: true
  })

  annotate_plot.overlay_array(s, null, {name: null, line: 3});

  var annotations = new sigplot_plugins.AnnotationPlugin();
  annotate_plot.add_plugin(annotations);
  annotations.add_annotation({
    x: 20,
    y: 0,
    value: "Text",
    color: "#FA7B92",
    highlight_color: "green",
    popup: "Text annotations have a position text, color, highlight color, and pop-up text."
  });
  var img = new Image(); // Create new img element
  img.onload = function() {
    annotations.add_annotation({
        x: 60,
        y: 0,
        value: img,
        popup: "Hello World"
    });
  };
  img.src = 'images/sigplot.png';

  var box_plot = new sigplot.Plot(document.getElementById('box-plot'), {
    autohide_panbars: true,
    autohide_readout: true
  })

  box_plot.overlay_array(s, null, {name: null, line: 3});

  var boxes = new sigplot_plugins.BoxesPlugin();
  box_plot.add_plugin(boxes);
  boxes.add_box({
    x: 20,
    y: 0,
    w: 4,
    h: 0.1,
    text: "(20, 0)"
  });
  boxes.add_box({
    x: 40,
    y: 0.5,
    w: 20,
    h: 0.5,
    text: "Filled Box",
    fill: true
  });

  var slider_plot = new sigplot.Plot(document.getElementById('slider-plot'), {
    autohide_panbars: true,
    autohide_readout: true
  })

  slider_plot.overlay_array(s, null, {name: null, line: 3});

  var slider1 = new sigplot_plugins.SliderPlugin({
    name: "Slider 1"
  });
  slider_plot.add_plugin(slider1);
  var slider2 = new sigplot_plugins.SliderPlugin({
      name: "Slider 2"
  });
  slider_plot.add_plugin(slider2);
  slider1.pair(slider2);
  slider2.pair(slider1);
  slider1.set_position(70);
  slider2.set_position(10);
  // slidertag events happen whenever a slider is moved
  // programatically or by the user
  slider_plot.addListener("slidertag", function(evt) {});
  // sliderdrag events happen only when a slider is moved by
  // the user
  slider_plot.addListener("sliderdrag", function(evt) {});

  console.log(slider_plot._Gx.lyr);


//})(myscope)

var a = document.getElementsByClassName('sig_func');
for (var i = 0; i < a.length; i++) {
  a[i].onclick = function() {
    if (document.getElementById('sig').style.display === "none") {
      document.getElementById('sig').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('sig').style.display = "none";
    }
  }
}
var b = document.getElementsByClassName('cs_func');
for (var i = 0; i < b.length; i++) {
  b[i].onclick = function() {
    if (document.getElementById('chs').style.display === "none") {
      document.getElementById('chs').style.display = "block";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('chs').style.display = "none";
    }
  }
}
var c = document.getElementsByClassName('oh_func');
for (var i = 0; i < c.length; i++) {
  c[i].onclick = function() {
    if (document.getElementById('ovh').style.display === "none") {
      document.getElementById('ovh').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('ovh').style.display = "none";
    }
  }
}
var d = document.getElementsByClassName('oa_func');
for(var i = 0; i < d.length; i++) {
  d[i].onclick = function() {
    if (document.getElementById('ova').style.display === "none") {
      document.getElementById('ova').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('ova').style.display = "none";
    }
  }
}
var e = document.getElementsByClassName('op_func');
for (var i = 0; i < e.length; i++) {
  e[i].onclick = function() {
    if (document.getElementById('ovp').style.display === "none") {
      document.getElementById('ovp').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('ovp').style.display = "none";
    }
  }
}
var f = document.getElementsByClassName('ow_func');
for (var i = 0; i < f.length; i++) {
  f[i].onclick = function() {
    if (document.getElementById('ovw').style.display === "none") {
      document.getElementById('ovw').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('ovw').style.display = "none";
    }
  }
}
var g = document.getElementsByClassName('push_func');
for (var i = 0; i < g.length; i++) {
  g[i].onclick = function() {
    if (document.getElementById('push').style.display === "none") {
      document.getElementById('push').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('push').style.display = "none";
    }
  }
}
var h = document.getElementsByClassName('get_layer_func');
for (var i = 0; i < h.length; i++) {
  h[i].onclick = function() {
    if (document.getElementById('get_layer').style.display === "none") {
      document.getElementById('get_layer').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('get_layer').style.display = "none";
    }
  }
}
var j = document.getElementsByClassName('deoverlay_func');
for (var i = 0; i < j.length; i++) {
  j[i].onclick = function() {
    if (document.getElementById('deoverlay').style.display === "none") {
      document.getElementById('deoverlay').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('deoverlay').style.display = "none";
    }
  }
}
var k = document.getElementsByClassName('el_func');
for (var i = 0; i < k.length; i++) {
  k[i].onclick = function() {
    if (document.getElementById('el').style.display === "none") {
      document.getElementById('el').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('el').style.display = "none";
    }
  }
}
var l = document.getElementsByClassName('dl_func');
for (var i = 0; i < l.length; i++) {
  l[i].onclick = function() {
    if (document.getElementById('dl').style.display === "none") {
      document.getElementById('dl').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('dl').style.display = "none";
    }
  }
}
var m = document.getElementsByClassName('al_func');
for (var i = 0; i < m.length; i++) {
  m[i].onclick = function() {
    if (document.getElementById('al').style.display === "none") {
      document.getElementById('al').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('refresh').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('al').style.display = "none";
    }
  }
}
var n = document.getElementsByClassName('refresh_func');
for (var i = 0; i < n.length; i++) {
  n[i].onclick = function() {
    if (document.getElementById('refresh').style.display === "none") {
      document.getElementById('refresh').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('redraw').style.display = "none";
    } else {
      document.getElementById('refresh').style.display = "none";
    }
  }
}
var p = document.getElementsByClassName('redraw_func');
for (var i = 0; i < p.length; i++) {
  p[i].onclick = function() {
    console.log('this works');
    if (document.getElementById('redraw').style.display === "none") {
      document.getElementById('redraw').style.display = "block";
      document.getElementById('chs').style.display = "none";
      document.getElementById('sig').style.display = "none";
      document.getElementById('ovh').style.display = "none";
      document.getElementById('ova').style.display = "none";
      document.getElementById('ovp').style.display = "none";
      document.getElementById('ovw').style.display = "none";
      document.getElementById('push').style.display = "none";
      document.getElementById('get_layer').style.display = "none";
      document.getElementById('deoverlay').style.display = "none";
      document.getElementById('el').style.display = "none";
      document.getElementById('dl').style.display = "none";
      document.getElementById('al').style.display = "none";
      document.getElementById('refresh').style.display = "none";
    } else {
      document.getElementById('redraw').style.display = "none";
    }
  }
}
