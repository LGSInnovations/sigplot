(function () {
    var scoreList;
    var scoreStats;
    var scoreStatsGraph;

    var homePage;
    var benchPage;
    var scorePage;

    var currentScreen = "home";

    var displayStats = function (bench) {
        return function() {
            if (scoreStatsGraph.childNodes.length > 0) {
                scoreStatsGraph.removeChild(scoreStatsGraph.childNodes[0]);
            }

            // Animations
            POTATOES.Tools.addClass(scoreList, "hidden");
            POTATOES.Tools.removeClass(scoreStats, "hidden");

            currentScreen = "score-graph";

            if (history.pushState) {
                history.pushState({}, "graph", "index.html");
            }
            
            // Title
            document.getElementById("score-stats-title").innerHTML = bench.name;

            // Drawing stats
            var clientWidth = scoreStatsGraph.clientWidth;
            var clientHeight = scoreStatsGraph.clientHeight;
            
            var margin = { top: 20, right: 20, bottom: 30, left: 50 },
                width = clientWidth - margin.left - margin.right,
                height = clientHeight - margin.top - margin.bottom;

            var x = d3.scale.linear()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .x(function(d) { return x(d.x); })
                .y(function(d) { return y(d.y); });

            var svg = d3.select("#score-stats-graph").append("svg")
                .attr("viewBox", "0, 0, " + (width + margin.left + margin.right) + ", " + (height + margin.top + margin.bottom))
                //.attr("height", height + margin.top + margin.bottom)
                .attr("class", "score-stats-graph-svg")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(d3.extent(bench.stats, function(d) { return d.x; }));
            y.domain(d3.extent(bench.stats, function(d) { return d.y; }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("FPS");

            svg.append("path")
                .datum(bench.stats)
                .attr("class", "line")
                .attr("d", line);
        };
    };

    var goHome = function () {
        currentScreen = "home";
        POTATOES.GamingBench.cancel();

        // Switching pages
        POTATOES.Tools.addClass(scorePage, "hidden");
        POTATOES.Tools.addClass(benchPage, "hidden");
        POTATOES.Tools.removeClass(homePage, "hidden");
    };

    var goScoreList = function () {
        POTATOES.Tools.addClass(scoreStats, "hidden");
        POTATOES.Tools.removeClass(scoreList, "hidden");

        currentScreen = "score-list";
    };

    // Events
    var onInit = function () {
        scoreList = document.getElementById("score-list");
        scoreStats = document.getElementById("score-stats");
        if (scoreStats == null) {
            return;
        }
        scoreStatsGraph = document.getElementById("score-stats-graph");

        scoreStats.onclick = function () {
            goScoreList();
        };

        // History
        if (window.onpopstate !== undefined) {
            window.onpopstate = function (evt) {
                switch (currentScreen) {
                    case "home":
                        break;
                    case "bench":
                        goHome();
                        break;
                    case "score-list":
                        goHome();
                        break;
                    case "score-graph":
                        goScoreList();
                        break;
                }
            };
        }

        // Pages
        homePage = document.getElementById("home");
        benchPage = document.getElementById("bench");
        scorePage = document.getElementById("score");

        // Buttons
        document.getElementById("home-launch").onclick = function () {
            // Switching pages
            POTATOES.Tools.addClass(homePage, "hidden");
            POTATOES.Tools.removeClass(benchPage, "hidden");

            if (history.pushState) {
                history.pushState({}, "launch", "index.html");
            }
            currentScreen = "bench";

            // Starting benchmark
            POTATOES.GamingBench.start();
        };
        
        document.getElementById("bench-skip").onclick = function () {
            POTATOES.GamingBench.skipCurrent();
        };

        document.getElementById("bench-cancel").onclick = function () {
            goHome();
        };
        
        document.getElementById("score-footer-back").onclick = function () {
            goScoreList();
            goHome();
        };
                
        POTATOES.GamingBench.onprocessended = function () {
            POTATOES.Tools.addClass(benchPage, "hidden");
            POTATOES.Tools.removeClass(scorePage, "hidden");

            currentScreen = "score-list";

            // Clearing list
            while (scoreList.childNodes.length) {
                scoreList.removeChild(scoreList.childNodes[0]);
            }

            // Headers
            var paragraphHeader = document.createElement("div");
            POTATOES.Tools.addClass(paragraphHeader, "score-entry-block");
            scoreList.appendChild(paragraphHeader);
            var fpsHeader = document.createElement("div");
            POTATOES.Tools.addClass(fpsHeader, "score-entry-header-fps");
            fpsHeader.innerHTML = "FPS";
            paragraphHeader.appendChild(fpsHeader);

            var scoreHeader = document.createElement("div");
            POTATOES.Tools.addClass(scoreHeader, "score-entry-header-score");
            scoreHeader.innerHTML = "Score";
            paragraphHeader.appendChild(scoreHeader);

            // Generating the result list
            var score = 0;
            for (var index = 0; index < POTATOES.GamingBench.benches.length; index++) {
                var bench = POTATOES.GamingBench.benches[index];

                var paragraph = document.createElement("div");
                POTATOES.Tools.addClass(paragraph, "score-entry-block");
                scoreList.appendChild(paragraph);

                var linkTitle = document.createElement("a");
                POTATOES.Tools.addClass(linkTitle, "score-entry");
                linkTitle.innerHTML = bench.name + ":  ";
                linkTitle.href = bench.url;
                linkTitle.target = "_blank";
                paragraph.appendChild(linkTitle);

                var link = document.createElement("a");
                POTATOES.Tools.addClass(link, "score-entry-link");
                var avgFps = 0;
                for (var i = 0; i < bench.stats.length; i++) {
                    avgFps += bench.stats[i].y;
                }

                avgFps /= bench.stats.length;

                link.innerHTML = isNaN(avgFps) ? "&nbsp;" : avgFps.toFixed();
                link.onclick = displayStats(bench);
                paragraph.appendChild(link);

                var scoreSpan = document.createElement("div");
                POTATOES.Tools.addClass(scoreSpan, "score-entry-score");
                scoreSpan.innerHTML = bench.score;
                paragraph.appendChild(scoreSpan);

                score += bench.score;
            }

            document.getElementById("score-footer-text").innerHTML = score;
        };
        if (location.href.lastIndexOf("autolaunch") !== -1) {
            document.getElementById("home-launch").click();
        }
    };

    var onResize = function () {

    };

    document.addEventListener("DOMContentLoaded", onInit, false);
    window.addEventListener("resize", onResize, false);
})();


var checkHTML5Support = function () {
    if (window.HTMLCanvasElement === undefined) {
        var controls = document.getElementById("home-controls");
        var message = document.getElementById("home-nohtml5");

        POTATOES.Tools.addClass(controls, "hidden");
        POTATOES.Tools.removeClass(message, "hidden");
    }
};
