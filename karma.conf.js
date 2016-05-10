module.exports = function(config) {
    config.set({
        files: ['benchmark/autobench.js', 
                "benchmark/index.html", 
                "benchmark/pass.html", 
                "benchmark/fail.html", 
                "benchmark/gamingbench.js", 
                "benchmark/tools.js", 
                "benchmark/benchmarks.js", 
                "benchmark/index.css", 
                "benchmark/index.js", 
                "dist/sigplot.js",
                "dist/bluefile.js",
                "dist/sigplot.plugins.js"],
        browsers: ['Firefox', 'Chrome'],
        frameworks: ['qunit'],
        concurrency: 1,
        browserNoActivityTimeout: 360000,
        singleRun: true,
        logLevel: config.LOG_DEBUG
    });
};
