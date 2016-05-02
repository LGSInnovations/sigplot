QUnit.test( 'sigplot benchmark test', function(assert) {
    var countDone = assert.async();
    var inner = document.createElement('iframe');
    inner.name = 'innerframe';
    inner.src = 'http://localhost:3000/countscores?browser=' + trimBrowser();
    inner.height = "600px";
    inner.width = "1000px";
    document.body.appendChild(inner);
    var numRuns = 1;
    var runNum = 1;
    var done = null;
    var countRuns = function() {
        var location = inner.contentWindow.location;
        if (location == null || location.href == undefined) {
            setTimeout(countRuns, 500);
        } else {
            var currentHref = location.href;
            var index = currentHref.lastIndexOf('autolaunch=');
            if (index != -1) {
                numRuns = Number(currentHref.substring(index + 11));
            }
            done = assert.async(numRuns);
            setTimeout(runBenches, 100);
            countDone();
        }
    }
    var runBenches = function() {
        console.log("Starting benchmark run " + runNum + " of " + numRuns);
	inner.contentWindow.document.getElementById("home-launch").click();
        var tofunc = function() {
            var doc = inner.contentWindow.document;
            var score = doc.getElementById("score-footer-text").innerHTML;
            if (score == "") {
                setTimeout(tofunc, 5000);
            } else {
                sendScoreToServer(inner, score, function(status) {
                    assert.ok(status, "Finished benchmark run " + runNum + " of " + numRuns);
                    if (runNum < numRuns) {
                	++runNum;
                	inner.src = 'http://localhost:9876/base/benchmark/index.html';
                	setTimeout(runBenches, 100);
                    }
                    done();
                });
            }
        };
        setTimeout(tofunc, 10000);
    }
    setTimeout(countRuns, 500);
});

function sendScoreToServer( inner, score, cb ) {
    var doc = inner.contentWindow.document;
    var scoreForm = doc.createElement('form');
    scoreForm.action = "http://localhost:3000/savescore";
    scoreForm.method = "get";
    scoreForm.name = "sendscore";
    scoreForm.enctype = "application/x-www-form-urlencoded";
    scoreForm.appendChild(hiddenInput(doc, "finalscore", score));
    scoreForm.appendChild(hiddenInput(doc, "browser", trimBrowser()));
    doc.body.appendChild(scoreForm);
    scoreForm.submit();
    
    var finishFunc = function() {
	var innerLoc = document.getElementsByTagName("iframe")[0].contentWindow.location;
	if (innerLoc.href.lastIndexOf("pass.html") != -1) {
	    cb(true);
	} else {
	    cb(false);
	}
    };
    setTimeout(finishFunc, 1000);
}

function hiddenInput( doc, name, value ) {
    var input = doc.createElement('input');
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
}

function trimBrowser() {
    var agent = navigator.userAgent;
    if (agent.lastIndexOf('Firefox') != -1) {
	return 'Firefox';
    } else if (agent.lastIndexOf('Chrome') != -1) {
	return 'Chrome';
    } else {
	return 'Other';
    }
}
