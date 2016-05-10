var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/savescore', function (req, res) {
    // Client finished run, check score to see if it passes regression threshold
    var contents = req.body;
    var score = contents;
    var benches = JSON.parse(contents.benches);
    contents.benches = benches;
    contents.timestamp = new Date();
    var browser = contents.browser;
    writeScoreToFile(score, browser, function (passed) {
	// Use redirect to tell client whether run passed or failed
	if (passed) {
	    res.redirect('http://localhost:9876/base/benchmark/pass.html?score=' + score);
	} else {
	    res.redirect('http://localhost:9876/base/benchmark/fail.html?score=' + score);
	}
    });
});

app.get('/countscores', function (req, res) {
    // Client asking how many benchmark runs to do, check number of scores in existing file
    var browser = req.query.browser;
    countScores(browser, function(numRuns) {
	// Redirect client to HTML5 Potatoes test page with # runs to do as query parameter
	res.redirect('http://localhost:9876/base/benchmark/index.html?autolaunch=' + numRuns);
    });
});

app.listen(3000, function () {
  console.log('Benchmark score reader/writer listening on port 3000!');
});

// Determine how many benchmark runs client needs to do to populate scores file for browser
function countScores( browser, cb ) {
    var fs = require("fs");
    if (!fs.existsSync("benchmark/json")) {
	fs.mkdirSync("benchmark/json");
    }
    var numRuns = 10;
    var fileName = "benchmark/json/Scores_" + browser + ".json";
    if (fs.existsSync(fileName)) {
	var fileData = fs.readFileSync(fileName);
	var JSONdata = JSON.parse(fileData);
	var scoreData = JSONdata.scores;
	var numScores = scoreData.length;
	numRuns = 10 - numScores;
    }
    if (numRuns < 1) {
	// Already 10+ scores for comparison, so just do 1 run to check against them
	numRuns = 1;
    }
    cb(numRuns);
}

// Return false if final score lower than mean of last 10 successful runs by > 1 sigma
function scorePasses( score, prevScores ) {
    testBenchScores(score, prevScores);
    var mean = getMean(prevScores);
    var stdDev = getStdDev(prevScores, mean);
    var currentDiff = mean - Number(score.finalScore);
    if (currentDiff > stdDev) {
	return false;
    } else {
	return true;
    }
}

// Attach "failed" attribute to any specific benchmark in run that shows regression
function testBenchScores( score, prevScores ) {
    var benches = score.benches;
    var numBenches = benches.length;
    for (var benchIndex = 0; benchIndex < numBenches; ++benchIndex) {
	var bench = benches[benchIndex];
	if (!benchScorePassesByIndex(score, prevScores, benchIndex)) {
	    bench.failed = true;
	}
    }
}

// Return mean of last 10 successful runs' final scores
function getMean( scoreArray ) {
    if (!Array.isArray(scoreArray)) {
	return 0;
    }
    var numValues = scoreArray.length;
    if (numValues == 0) {
	return 0;
    }
    var sum = 0;
    for (var index = 0; index < numValues; ++index) {
	sum += scoreArray[index].finalscore;
    }
    return sum / numValues;
}

// Return standard deviation (sigma) of last 10 successful runs' final scores
function getStdDev( scoreArray, mean ) {
    if (!Array.isArray(scoreArray)) {
	return 0;
    }
    var numValues = scoreArray.length;
    if (numValues == 0) {
	return 0;
    }
    var totalDev = 0;
    for (var index = 0; index < numValues; ++index) {
	var diff = scoreArray[index].finalscore - mean;
	totalDev += (diff * diff);
    }
    var variance = totalDev / numValues;
    return Math.sqrt(variance);
}

// Get score of specific benchmark from results submitted by client
function getBenchScore( score, benchName ) {
    var benches = score.benches;
    var numBenches = benches.length;
    for (var benchIndex = 0; benchIndex < numBenches; ++benchIndex) {
	var bench = benches[benchIndex];
	if (bench.benchName == benchName) {
	    return bench.benchScore;
	}
    }
    return 0;
}

// Get index of specific benchmark in score array
function getBenchIndex( score, benchName ) {
    var benches = score.benches;
    var numBenches = benches.length;
    for (var benchIndex = 0; benchIndex < numBenches; ++benchIndex) {
	var bench = benches[benchIndex];
	if (bench.benchName == benchName) {
	    return benchIndex;
	}
    }
    return -1;
}

// Return false if benchmark score lower than mean of last 10 successful runs by > 1 sigma
function benchScorePasses( score, prevScores, benchName ) {
    var mean = getBenchMean(prevScores, benchName);
    var stdDev = getBenchStdDev(prevScores, benchName, mean);
    var currentDiff = mean - getBenchScore(score, benchName);
    if (currentDiff > stdDev) {
	return false;
    } else {
	return true;
    }
}

// Return mean score for specific benchmark for last 10 successful runs
function getBenchMean( scoreArray, benchName ) {
    if (!Array.isArray(scoreArray)) {
	return 0;
    }
    var numValues = scoreArray.length;
    if (numValues == 0) {
	return 0;
    }
    var sum = 0;
    for (var index = 0; index < numValues; ++index) {
	sum += getBenchScore(scoreArray[index], benchName);
    }
    return sum / numValues;
}

// Return standard deviation of score for specific benchmark for last 10 successful runs
function getBenchStdDev( scoreArray, benchName, mean ) {
    if (!Array.isArray(scoreArray)) {
	return 0;
    }
    var numValues = scoreArray.length;
    if (numValues == 0) {
	return 0;
    }
    var totalDev = 0;
    for (var index = 0; index < numValues; ++index) {
	var benchScore = getBenchScore(scoreArray[index], benchName);
	var diff = benchScore - mean;
	totalDev += (diff * diff);
    }
    var variance = totalDev / numValues;
    return Math.sqrt(variance);
}

// Index-based version of benchScorePasses() to improve efficiency
function benchScorePassesByIndex( score, prevScores, benchIndex ) {
    var mean = getBenchMeanByIndex(prevScores, benchIndex);
    var stdDev = getBenchStdDevByIndex(prevScores, benchIndex, mean);
    var currentDiff = mean - score.benches[benchIndex].benchScore;
    if (currentDiff > stdDev) {
	return false;
    } else {
	return true;
    }
}

// Index-based version of getBenchMean() to improve efficiency
function getBenchMeanByIndex( scoreArray, benchIndex ) {
    if (!Array.isArray(scoreArray)) {
	return 0;
    }
    var numValues = scoreArray.length;
    if (numValues == 0) {
	return 0;
    }
    var sum = 0;
    for (var index = 0; index < numValues; ++index) {
	sum += scoreArray[index].benches[benchIndex].benchScore;
    }
    return sum / numValues;
}

// Index-based version of getBenchStdDev() to improve efficiency
function getBenchStdDevByIndex( scoreArray, benchIndex, mean ) {
    if (!Array.isArray(scoreArray)) {
	return 0;
    }
    var numValues = scoreArray.length;
    if (numValues == 0) {
	return 0;
    }
    var totalDev = 0;
    for (var index = 0; index < numValues; ++index) {
	var benchScore = scoreArray[index].benches[benchIndex].benchScore;
	var diff = benchScore - mean;
	totalDev += (diff * diff);
    }
    var variance = totalDev / numValues;
    return Math.sqrt(variance);
}

// Test last score against 10 previous successful ones, and add to appropriate file
function writeScoreToFile( score, browser, cb) {
    var fs = require("fs");
    if (!fs.existsSync("benchmark/json")) {
	fs.mkdirSync("benchmark/json");
    }
    var fileName = "benchmark/json/Scores_" + browser + ".json";
    var fileData = "{\n\t\"scores\": []\n}";
    if (fs.existsSync(fileName)) {
	fileData = fs.readFileSync(fileName);
    }
    var JSONdata = JSON.parse(fileData);
    var scoreData = JSONdata.scores;
    var numScores = scoreData.length;
    if (numScores < 10) {
	// Too few scores to do analysis yet, just add last run to browser's score file
	scoreData.push(score);
	cb(true);
    } else if (scorePasses(score, scoreData)) {
	// Add last run to browser's score file, and remove oldest one
	scoreData.push(score);
	scoreData.shift();
	cb(true);
    } else {
	// Store last run in the list of failures
	fileName = "benchmark/json/FailedScores.json";
	fileData = "{ \"failedScores\": [] }"
	if (fs.existsSync(fileName)) {
	    fileData = fs.readFileSync(fileName);
	}
	JSONdata = JSON.parse(fileData);
	JSONdata.failedScores.push(score);
	cb(false);
    }
    fs.writeFileSync(fileName, JSON.stringify(JSONdata, null, 4));
}
