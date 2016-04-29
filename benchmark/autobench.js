QUnit.test( 'sigplot benchmark test', function(assert) {
    var done = assert.async();
    console.log("Starting benchmark tests");
    var inner = document.createElement('iframe');
    inner.name = 'innerframe';
    inner.src = 'http://localhost:9876/base/benchmark/index.html?autolaunch';
    inner.height = "600px";
    inner.width = "1000px";
    var tofunc = function() {
        var doc = inner.contentWindow.document;
        var score = doc.getElementById("score-footer-text").innerHTML;
        if (score == "") {
            setTimeout(tofunc, 5000);
        } else {
            sendScoreToServer(inner, score, function(status) {
                assert.ok(status, "Tests finished!");
                done();
            });
        }
    };
    setTimeout(tofunc, 20000);
    document.body.appendChild(inner);
});

function sendScoreToServer( inner, score, cb ) {
    var doc = inner.contentWindow.document;
    var scoreForm = doc.createElement('form');
    scoreForm.action = "http://localhost:3000/savescore";
    scoreForm.method = "get";
    scoreForm.name = "sendscore";
    scoreForm.enctype = "application/x-www-form-urlencoded";
    var scoreInput = doc.createElement('input');
    scoreInput.type = "hidden";
    scoreInput.name = "finalscore";
    scoreInput.value = score;
    scoreForm.appendChild(scoreInput);
    var browserInput = doc.createElement('input');
    browserInput.type = "hidden";
    browserInput.name = "browser";
    browserInput.value = trimBrowser();
    scoreForm.appendChild(browserInput);
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
    setTimeout(finishFunc, 2000);
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
