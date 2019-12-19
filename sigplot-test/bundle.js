(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let options = {all: true, expand: true}
let plots = []
numPlots = 4
let updateIntId = null;
let pipeFullCount = 0
let pipeSize = null
let frameSize = null
let bufferLength = null;


let data = [];
let makeData = function(callback) {
    data = []
    for (let i = 0; i < bufferLength; i++) {
        for (var j = 0; j < frameSize; j += 1) {
            data.push(j+10);
        }
    }
    console.log(`data length ${data.length}`);
    callback();
}

setupPlots = function() {
    let fftOpt = document.getElementById("fftSelect").value;
    switch(fftOpt){
        case "1k":
            frameSize = 1024;
            break;
        case "8k":
            frameSize = 8 * 1024;
            break;
        case "32k":
            frameSize = 32 * 1024;
            break;
        case "64k":
            frameSize = 64 * 1024;
            break;
        case "256k":
            frameSize = 256 * 1024;
            break;
        case "1m":
            frameSize = 1024 * 1024;
            break;
        case "8m":
            frameSize = 8 * 1024 * 1024;
            break;
        default:
            console.log(`Unrecognized fft size ${fftOpt}`);
    }
    let pipeSizeTxt = document.getElementById("pipeSizeText").value;
    pipeSize = Number(pipeSizeTxt) * 1024 * 1024;
    let bufferLengthTxt = document.getElementById("bufferLengthText").value;
    bufferLength = Number(bufferLengthTxt)
    plots = [];
    for (let i = 1; i <=numPlots; i++) {
        let plotDiv = document.getElementById('plot'+i)
        plots.push(new sigplot.Plot(plotDiv, options))
    }
    updatePipeFullCount(0);
}

let updatePipeFullCount = function(count) {
    pipeFullCount = count;
    document.getElementById('pipeFullText').value = pipeFullCount;
}
    

startPlots = function() {
    if (updateIntId) {
        clearInterval(updateIntId);
        updatePipeFullCount(0)
    }
    setupPlots();
    let lbl = document.getElementById('generatingDataLabel');
    lbl.textContent = 'Generating data...';
    //Let the browser set the label before blocking on makeData()
    setTimeout(() => {
        makeData(() => {
            lbl.textContent = "";
            num = document.getElementById("plotCountSelect").value;
            let updateRate = 10;
            try {
                let updateRate = Number(document.getElementById('updateRateInp').value)
                if (updateRate == 0) {
                    updateRate = 10
                } else {
                    updateRate = (1/updateRate) * 1000;
                }
            } catch(e) {
                updateRate = 10;
            }
            for (let i = 0; i <= num-1; i++) {
                plot = plots[i]
                plot.refresh();
                plot.change_settings({
                    autol: 5,
                });
                layer = plot.overlay_pipe({
                    type: 2000,
                    subsize: frameSize,
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
        });
    }, 500);
    
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

},{}]},{},[1]);
