QUnit.test( 'sigplot benchmark test', function(assert) {
    var countDone = assert.async();
    var inner = document.createElement('iframe');
    inner.name = 'innerframe';
    inner.height = "600px";
    inner.width = "1000px";
    
    // Ask server how many scores are already in file for current browser
    inner.src = 'http://localhost:3000/countscores?browser=' + trimBrowser();
    document.body.appendChild(inner);
    var numRuns = 1;
    var runNum = 1;
    var done = null;
    var countRuns = function() {
        var location = inner.contentWindow.location;
        if (location == null || location.href == undefined) {
            // Wait another half-second for redirect from server
            setTimeout(countRuns, 500);
        } else {
            var currentHref = location.href;
            // Server sends back number of runs to do as query parameter in redirect
            var index = currentHref.lastIndexOf('autolaunch=');
            if (index != -1) {
                numRuns = Number(currentHref.substring(index + 11));
            }
            // Now that we know now many runs, expect that many async calls
            done = assert.async(numRuns);
            // And schedule the first benchmark run
            setTimeout(runBenches, 100);
            countDone();
        }
    }
    
    var runBenches = function() {
        console.log("Starting benchmark run " + runNum + " of " + numRuns);
        // Click on the "launch" link to start the run
	inner.contentWindow.document.getElementById("home-launch").click();
        var tofunc = function() {
            var doc = inner.contentWindow.document;
            var score = doc.getElementById("score-footer-text").innerHTML;
            if (score == "") {
        	// Run not finished yet, wait another 5 seconds and check again
                setTimeout(tofunc, 5000);
            } else {
                sendScoreToServer(inner, score, function(status) {
                    assert.ok(status, "Finished benchmark run " + runNum + " of " + numRuns);
                    if (runNum < numRuns) {
                	// Still have more runs to do, schedule the next one
                	++runNum;
                	inner.src = 'http://localhost:9876/base/benchmark/index.html';
                	setTimeout(runBenches, 1000);
                    }
                    done();
                });
            }
        };
        // Wait at least 10 seconds before checking to see if run is finished
        setTimeout(tofunc, 10000);
    }
    
    setTimeout(countRuns, 500);
});

// Takes an HTMLCollection object and returns an array of its contents.
function collectionToArray( collection ) {
    var size = collection.length;
    var arr = [];
    for (index = 0; index < size; ++index) {
	var bench = makeBenchObject(collection[index]);
	if (bench != null) {
	    arr.push(bench);
	}
    }
    return arr;
}

// Takes a score-entry-block HTMLDivElement object and returns an object with:
// "benchName", "benchScore", and "benchFPS" attributes
function makeBenchObject( element ) {
    var ret = {};
    var anchors = element.getElementsByTagName("a");
    var len = anchors.length;
    if (len < 1) {
	return null;
    }
    var divs = element.getElementsByTagName("div");
    ret.benchName = anchors[0].innerHTML;
    var bScore = Number(divs[0].innerHTML);
    if (isNaN(bScore)) {
	ret.benchScore = 0;
    } else {
	ret.benchScore = bScore;
    }
    var fps = Number(anchors[1].innerHTML);
    if (isNaN(fps)) {
	ret.benchFPS = 0;
    } else {
	ret.benchFPS = fps;
    }
    return ret;
}

// Creates and submits a form containing the scores of the latest benchmark run.
function sendScoreToServer( inner, score, cb ) {
    var doc = inner.contentWindow.document;
    var benches = collectionToArray(doc.getElementsByClassName("score-entry-block"));
    var scoreForm = doc.createElement('form');
    scoreForm.action = "http://localhost:3000/savescore";
    scoreForm.method = "post";
    scoreForm.name = "sendscore";
    scoreForm.enctype = "application/x-www-form-urlencoded";
    scoreForm.appendChild(hiddenInput(doc, "finalscore", score));
    scoreForm.appendChild(hiddenInput(doc, "browser", trimBrowser()));
    scoreForm.appendChild(hiddenInput(doc, "benches", JSON.stringify(benches, null, 2)));
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

// Creates a hidden input element to be added to a form in an HTML DOM document.
function hiddenInput( doc, name, value ) {
    var input = doc.createElement('input');
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
}

// Returns an abbreviated form of the browser type.
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
