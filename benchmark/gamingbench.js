var POTATOES = POTATOES || {};

(function () {
    // Internals
    var currentBenchIndex = -1;
    var currentBench = null;


    var state;

    var fpsDiv;
    var progress;
    var progressText;
    var benchName;
    var benchTitle;
    var benchTitleBackground;
    var workbench;

    var progressInteval;
    var durationTimeout;

    var startTime;

    var fpsFrame = 20; // fps window frame
    var fpsCap = 60;
    var previousFramesDuration = [];
    
    var handleMetrics = function () {
        if (!currentBench) {
            return;
        }

        currentBench.score++;

        previousFramesDuration.push(Date.now());

        if (previousFramesDuration.length >= fpsFrame) {

            if (previousFramesDuration.length > fpsFrame) {
                previousFramesDuration.splice(0, 1);
            }

            var avg = 0;
            for (var id = 0; id < fpsFrame - 1; id++) {
                avg += previousFramesDuration[id + 1] - previousFramesDuration[id];
            }
            avg /= fpsFrame - 1;

            POTATOES.GamingBench.currentFPS = Math.min(fpsCap, 1000.0 / (previousFramesDuration[fpsFrame - 1] - previousFramesDuration[fpsFrame - 2]));
            POTATOES.GamingBench.averageFPS = Math.min(fpsCap, 1000.0 / avg);

            if (state === "running" && isFinite(POTATOES.GamingBench.currentFPS)) {
                fpsDiv.innerHTML = POTATOES.GamingBench.currentFPS.toFixed() + " fps";

                if (currentBench.stats.length == 0) {
                    startTime = Date.now();
                }

                currentBench.stats.push({ x: (Date.now() - startTime) / 1000, y: POTATOES.GamingBench.averageFPS });
            }
        }

        if (state === "running") {
            POTATOES.Tools.queueNewFrame(handleMetrics);
        }
    };

    var updateProgress = function () {
        if (progress.value > 100)
            return;

        progress.value += 5;
        progressText.innerHTML = progress.value + "%";
    };

    var stopCurrentBench = function (stop) {
        state = "stopped";
        clearInterval(progressInteval);

        benchTitle.removeEventListener("animationend", onAnimationEnd);
        benchTitle.removeEventListener("webkitAnimationEnd", onAnimationEnd);

        // Stopping
        if (currentBench) {
            currentBench.onInitCompleted = function () { };
            currentBench.stop(workbench);

            // Removing all children
            while (workbench.childNodes.length) {
                workbench.removeChild(workbench.childNodes[0]);
            }
        }

        // Running next one
        if (!stop) {
            runBench(currentBenchIndex + 1);
        } else {
            currentBench = null;
        }
    };

    // When animations end
    var onAnimationEnd = function () {
        POTATOES.Tools.removeClass(benchTitle, "animate-bench-title");
        POTATOES.Tools.removeClass(benchTitleBackground, "animate-bench-title-background");

        benchTitle.removeEventListener("animationend", onAnimationEnd);
        benchTitle.removeEventListener("webkitAnimationEnd", onAnimationEnd);

        if (!currentBench) {
            return;
        }

        // Bench initialization
        benchName.innerHTML = currentBench.name;

        // On init completed
        currentBench.onInitCompleted = function () {
            // Set duration check
            durationTimeout = setTimeout(stopCurrentBench, currentBench.stepDuration);
            progressInteval = setInterval(updateProgress, currentBench.stepDuration / 20);

            // Launch bench
            if (currentBench.isSupported()) {
                state = "running";
                currentBench.run();

                // Preparing framework
                previousFramesDuration = [];
                POTATOES.Tools.queueNewFrame(handleMetrics);
            } else {
                stopCurrentBench(false);
            }
        };

        // Launch bench initialization
        currentBench.init(workbench);
    };

    // Launch bench
    var runBench = function (index) {
        if (index >= POTATOES.GamingBench.benches.length) {
            currentBench = null;
            if (POTATOES.GamingBench.onprocessended) {
                POTATOES.GamingBench.onprocessended();
            }
            return;
        }

        currentBenchIndex = index;
        currentBench = POTATOES.GamingBench.benches[index];
        currentBench.score = 0;
        currentBench.stats = [];

        fpsDiv.innerHTML = "";
        previousFramesDuration = [];
        progress.value = 0;
        progressText.innerHTML = "0%";
        benchName.innerHTML = "";
        benchTitle.innerHTML = currentBench.name;

        if (benchTitle.style.webkitAnimationName !== undefined || benchTitle.style.animationName !== undefined) {
            benchTitle.addEventListener("animationend", onAnimationEnd, false);
            benchTitle.addEventListener("webkitAnimationEnd", onAnimationEnd, false);

            // Launching animations
            POTATOES.Tools.addClass(benchTitle, "animate-bench-title");
            POTATOES.Tools.addClass(benchTitleBackground, "animate-bench-title-background");
        } else {
            // No animations
            onAnimationEnd();
        }
    };

    // Gaming Bench engine
    POTATOES.GamingBench = {
        onprocessended: null,
        benches: [],
        currentFPS: 0
    };

    POTATOES.GamingBench.Bench = function (name, url, onInit, onRun, onStop, isSupported) {
        return {
            run: onRun,
            init: onInit,
            stop: onStop,
            name: name,
            url: url,
            score: 0,
            stats: [],
            isSupported: function () {
                if (isSupported) {
                    return isSupported();
                }
                return true;
            },
            stepDuration: 20000,
            onInitCompleted: null
        };
    };

    POTATOES.GamingBench.registerBench = function (bench) {
        POTATOES.GamingBench.benches.push(bench);
    };

    POTATOES.GamingBench.cancel = function () {
        POTATOES.Tools.removeClass(benchTitle, "animate-bench-title");
        POTATOES.Tools.removeClass(benchTitleBackground, "animate-bench-title-background");
        clearTimeout(durationTimeout);
        previousFramesDuration = [];

        if (currentBench) {
            stopCurrentBench(true);
        }
    };

    POTATOES.GamingBench.skipCurrent = function () {
        clearTimeout(durationTimeout);
        previousFramesDuration = [];

        if (currentBench) {
            stopCurrentBench();
        }
    };

    POTATOES.GamingBench.start = function () {
        // Getting fps display zone and progress indicator
        fpsDiv = document.getElementById("bench-fps");
        progress = document.getElementById("bench-status-progress");
        progressText = document.getElementById("bench-status-progress-text");
        benchName = document.getElementById("bench-name");
        benchTitle = document.getElementById("bench-title");
        benchTitleBackground = document.getElementById("bench-title-background");
        workbench = document.getElementById("bench-work");

        // Preparing animations
        POTATOES.Tools.removeClass(benchTitle, "animate-bench-title");
        POTATOES.Tools.removeClass(benchTitleBackground, "animate-bench-title-background");

        // Launch first bench
        runBench(0);
    };
})();