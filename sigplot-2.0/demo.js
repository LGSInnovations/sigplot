/**
 * Created by sohickm on 6/30/17.
**/

document.getElementById('basic').onclick = function(){
  localStorage.setItem("demo", "examples/basic_demo.html");
  localStorage.setItem("frame_height", 1300);
  localStorage.setItem("just_clicked", true);
  document.getElementById('basic_l').click();
}
 document.getElementById('penny').onclick = function(){
   localStorage.setItem("demo", "examples/penny_demo.html");
   localStorage.setItem("frame_height", 850);
   localStorage.setItem("just_clicked", true);
   document.getElementById('penny_l').click();
 }
 document.getElementById('rt_raster').onclick = function(){
   localStorage.setItem("demo", "examples/rt_raster_demo.html");
   localStorage.setItem("frame_height", 975);
   localStorage.setItem("just_clicked", true);
   document.getElementById('rt_raster_l').click();
 }
 document.getElementById('fft').onclick = function(){
   localStorage.setItem("demo", "examples/fft_demo.html");
   localStorage.setItem("frame_height", 1060);
   localStorage.setItem("just_clicked", true);
   document.getElementById('fft_l').click();
 }
 document.getElementById('rt_array').onclick = function(){
   localStorage.setItem("demo", "examples/rt_array_demo.html");
   localStorage.setItem("frame_height", 1000);
   localStorage.setItem("just_clicked", true);
   document.getElementById('rt_array_l').click();
 }
 document.getElementById('iq').onclick = function(){
   localStorage.setItem("demo", "examples/iq_demo.html");
   localStorage.setItem("frame_height", 1000);
   localStorage.setItem("just_clicked", true);
   document.getElementById('iq_l').click();
 }
 document.getElementById('rt_iq').onclick = function(){
   localStorage.setItem("demo", "examples/rt_iq_demo.html");
   localStorage.setItem("frame_height", 875);
   localStorage.setItem("just_clicked", true);
   document.getElementById('rt_iq_l').click();
 }

var plot = new sigplot.Plot(document.getElementById('plot'), {
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

var penny_plot = new sigplot.Plot(document.getElementById('penny-plot'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

penny_plot.overlay_href("assets/dat/penny.prm");

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
        //console.log("initialize raster data layer");
        rt_raster.change_settings({
            cmode : 3,
            autol: 5,
            all: true,
        });
        rt_raster.overlay_pipe({type: 2000, subsize: framesize, file_name: "random"});
    }
    rt_raster.push(0, random);
}

var fft_plot = new sigplot.Plot(document.getElementById('fft-plot'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

fft_plot.overlay_href("assets/dat/fsk_fft.tmp", null, {name: "FFT"});

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
        console.log("changing xstart")
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

var iq_plot = new sigplot.Plot(document.getElementById('iq-plot'), {
    autohide_readout: true, // only show the readout when the mouse is over the plot
    autohide_panbars: true // only show panbars when necessary and the mouse is over the plot
})

iq_plot.overlay_href("assets/dat/symbols_noise.tmp", null, {name: "I/Q", line: 0, symbol: 1});

iq_plot.change_settings({cmode: 5});

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
