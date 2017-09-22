
if ((localStorage.getItem("demo") === undefined) || (localStorage.getItem("demo") === null)) {
  document.getElementById('dynamic').src = "examples/fft_demo.html";
}
else {
  document.getElementById('dynamic').src = localStorage.getItem("demo");
}

if ((localStorage.getItem("frame_height") === undefined) || (localStorage.getItem("frame_height") === null)) {
  document.getElementById('dynamic').height = 800;
}
else {
  document.getElementById('dynamic').height = localStorage.getItem("frame_height");
}

if (localStorage.getItem("just_clicked") === "true") {
  document.getElementById('hidden_link').click();
}

localStorage.setItem("just_clicked", false);

document.getElementById('basic').onclick = function() {
  localStorage.setItem("demo", "examples/basic_demo.html");
  localStorage.setItem("frame_height", 1300);
  location.reload();
}

document.getElementById('raster').onclick = function() {
  localStorage.setItem("demo", "examples/penny_demo.html");
  localStorage.setItem("frame_height", 850);
  location.reload();
}

document.getElementById('rt-raster').onclick = function() {
  localStorage.setItem("demo", "examples/rt_raster_demo.html");
  localStorage.setItem("frame_height", 975);
  location.reload();
}

document.getElementById('fft').onclick = function() {
  localStorage.setItem("demo", "examples/fft_demo.html");
  localStorage.setItem("frame_height", 1060);
  location.reload();
}

document.getElementById('rt-plot').onclick = function() {
  localStorage.setItem("demo", "examples/rt_array_demo.html");
  localStorage.setItem("frame_height", 1000);
  location.reload();
}

document.getElementById('iq').onclick = function() {
  localStorage.setItem("demo", "examples/iq_demo.html");
  localStorage.setItem("frame_height", 1000);
  location.reload();
}

document.getElementById('rt-iq').onclick = function() {
  localStorage.setItem("demo", "examples/rt_iq_demo.html");
  localStorage.setItem("frame_height", 875);
  location.reload();
}

document.getElementById('stream').onclick = function() {
  localStorage.setItem("demo", "examples/streams_demo.html");
  localStorage.setItem("frame_height", 1350);
  location.reload();
}

document.getElementById('audio').onclick = function() {
  localStorage.setItem("demo", "examples/audio_demo.html");
  localStorage.setItem("frame_height", 1075);
  location.reload();
}

document.getElementById('appear').onclick = function() {
  localStorage.setItem("demo", "examples/appearance_demo.html");
  localStorage.setItem("frame_height", 1200);
  location.reload();
}

document.getElementById('m-events').onclick = function() {
  localStorage.setItem("demo", "examples/mouse_events_demo.html");
  localStorage.setItem("frame_height", 1100);
  location.reload();
}

document.getElementById('menu').onclick = function() {
  localStorage.setItem("demo", "examples/menu_demo.html");
  localStorage.setItem("frame_height", 1125);
  location.reload();
}

document.getElementById('m-select').onclick = function() {
  localStorage.setItem("demo", "examples/mouse_select_demo.html");
  localStorage.setItem("frame_height", 875);
  location.reload();
}

document.getElementById('highlight').onclick = function() {
  localStorage.setItem("demo", "examples/highlight_demo.html");
  localStorage.setItem("frame_height", 1050);
  location.reload();
}

document.getElementById('colorbar').onclick = function() {
  localStorage.setItem("demo", "examples/colorbar_demo.html");
  localStorage.setItem("frame_height", 1050);
  location.reload();
}
