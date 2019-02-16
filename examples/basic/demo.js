window.onload = function() {
    var plot_options = {
        autohide_panbars: true,
          hide_note: true
    };
    var data = [1, 2, 3, 4, 5, 4, 3, 2, 1]; // the series of y-values
    var data_header = {
        xunits: "Time",
          xstart: 100, // the start of the x-axis
            xdelta: 50, // the x-axis step between each data point
              yunits: "Power"
    };
    var layer_options = {
        name: "Sample Data"
    };
    var plot = new sigplot.Plot(document.getElementById('plot'), plot_options);
    plot.overlay_array(data, data_header, layer_options);
}
