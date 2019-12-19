let options = {all: true, expand: true}
let plots = []
numPlots = 4
let updateIntId = null;
let pipeFullCount = 0
let pipeSize = 5 * 1024 * 1024;
let framesize = 256 * 1024;


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
    

startPlots = function() {
    let fftOpt = document.getElementById("fftSelect").value;
    switch(fftOpt){
        case "8k":
            framesize = 8 * 1024;
            break;
        case "32k":
            framesize = 32 * 1024;
            break;
        case "64k":
            framesize = 64 * 1024;
            break;
        case "256k":
            framesize = 256 * 1024;
            break;
        case "1m":
            framesize = 1024 * 1024;
            break;
        case "8m":
            framesize = 8 * 1024 * 1024;
            break;
        default:
            console.log(`Unrecognized fft size ${fftOpt}`);
    }
    num = document.getElementById("plotCountSelect").value;
    let pipeSizeTxt = document.getElementById("pipeSizeText").value;
    pipeSize = Number(pipeSizeTxt) * 1024 * 1024;
    let updateRate = 10;
    try {
        let updateRate = Number(document.getElementById('updateRateInp').value)
        if (updateRate = 0) {
            updateRate = 10
        } else {
            updateRate = (1/updateRate) * 1000;
        }
    } catch(e) {
        updateRate = 10;
    }
        
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
    document.getElementById('startPlotsBtn').textContent = 'Restart';
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
