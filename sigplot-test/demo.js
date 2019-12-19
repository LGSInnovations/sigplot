let options = {all: true, expand: true}
let plots = []
numPlots = 4
const UPDATE_INTERVAL = 10;
let framesize = 256*1024;
let updateIntId = null;
updateRate = 10;
pipeFullCount = 0
pipeSize = 5 * 1024 * 1024;
numPlotsRunning = 0;

data = [];
for (var j = 0; j < framesize; j += 1) {
    data.push(j+10);
}

setupPlots = function() {
    plots = [];
    for (let i = 1; i <=numPlots; i++) {
        let plotDiv = document.getElementById('plot'+i)
        plots.push(new sigplot.Plot(plotDiv, options))
    }
}

updatePipeFullCount = function(count) {
    pipeFullCount = count;
    document.getElementById('pipeFullText').value = pipeFullCount;
}
    

startPlots = function(num) {
    numPlotsRunning = num;
    if (updateIntId) {
        clearInterval(updateIntId);
        setupPlots();
        updatePipeFullCount(0)
    }
    for (let i = 0; i <=num-1; i++) {
        plot = plots[i]
        plot._refresh();
        plot.change_settings({
            autol: 5,
        });
        layer = plot.overlay_pipe({
            type: 2000,
            subsize: framesize,
            file_name: "data",
            pipesize: pipeSize
        });
    }

    updateIntId = setInterval(() => {
        plots.forEach(plot => {
            try {
                plot.push(0, data);
            } catch(e) {
                updatePipeFullCount(pipeFullCount+1)
            }
            plot.refresh();
            
        })
    }, updateRate);
}

setDataUpdateRate = function(val) {
    if (val == 0) {
        updateRate = 10;
    } else {
        updateRate = (1/val) * 1000;
    }
    clearInterval(updateIntId);
    updateIntId = setInterval(() => {
        plots.forEach(plot => {
            try {
                plot.push(0, data)
            } catch(e) {
                updatePipeFullCount(pipeFullCount+1)
            }
            plot.refresh();
        })
    }, updateRate);
}

setPipeSize = function(val) {
    pipeSize = val * 1024 * 1024;
    startPlots(numPlots);
}
