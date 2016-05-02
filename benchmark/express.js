var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/savescore', function (req, res) {
    var score = Number(req.query.finalscore);
    var browser = req.query.browser;
    writeScoreToFile(score, browser, function (passed) {
	if (passed) {
	    res.redirect('http://localhost:9876/base/benchmark/pass.html?score=' + score);
	} else {
	    res.redirect('http://localhost:9876/base/benchmark/fail.html?score=' + score);
	}
    });
});

app.get('/countscores', function (req, res) {
    var browser = req.query.browser;
    countScores(browser, function(numRuns) {
	res.redirect('http://localhost:9876/base/benchmark/index.html?autolaunch=' + numRuns);
    });
});

app.listen(3000, function () {
  console.log('Benchmark database writer listening on port 3000!');
});

function countScores( browser, cb ) {
    var fs = require("fs");
    if (!fs.existsSync("benchmark/json")) {
	fs.mkdirSync("benchmark/json");
    }
    var numRuns = 10;
    var fileName = "benchmark/json/Scores_" + browser + ".json";
    console.log("Looking for file " + fileName);
    if (fs.existsSync(fileName)) {
	console.log("Found file " + fileName);
	var fileData = fs.readFileSync(fileName);
	var JSONdata = JSON.parse(fileData);
	var scoreData = JSONdata.scores;
	var numScores = scoreData.length;
	console.log("File " + fileName + " contains " + numScores + " scores");
	numRuns = 10 - numScores;
    }
    if (numRuns < 1) {
	numRuns = 1;
    }
    cb(numRuns);
}

function scorePasses( score, prevScores ) {
    var mean = getMean(prevScores);
    var stdDev = getStdDev(prevScores);
    var currentDiff = mean - score;
    if (currentDiff > stdDev) {
	return false;
    } else {
	prevScores.push(score);
	prevScores.shift();
	return true;
    }
}

function getMean( numArray ) {
    if (!Array.isArray(numArray)) {
	return 0;
    }
    var numValues = numArray.length;
    if (numValues == 0) {
	return 0;
    }
    var sum = 0;
    for (var index = 0; index < numValues; ++index) {
	sum += numArray[index];
    }
    return sum / numValues;
}

function getStdDev( numArray ) {
    if (!Array.isArray(numArray)) {
	return 0;
    }
    var numValues = numArray.length;
    if (numValues == 0) {
	return 0;
    }
    var mean = getMean(numArray);
    var totalDev = 0;
    for (var index = 0; index < numValues; ++index) {
	var diff = numArray[index] - mean;
	totalDev += (diff * diff);
    }
    var variance = totalDev / numValues;
    return Math.sqrt(variance);
}

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
	scoreData.push(score);
	fs.writeFileSync(fileName, JSON.stringify(JSONdata, null, 4));
	cb(true);
	return;
    }
    if (scorePasses(score, scoreData)) {
	cb(true);
    } else {
	fileName = "benchmark/json/FailedScores.json";
	fileData = "{ \"failedScores\": [] }"
	if (fs.existsSync(fileName)) {
	    fileData = fs.readFileSync(fileName);
	}
	JSONdata = JSON.parse(fileData);
	JSONdata.failedScores.push({"browser": browser, "date": new Date(), "score": score});
	cb(false);
    }
    fs.writeFileSync(fileName, JSON.stringify(JSONdata, null, 4));
}
