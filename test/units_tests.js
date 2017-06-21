/**
 * Created by sohickm on 6/2/17.
 */

var fixture = document.getElementById("qunit-fixture");
var ifixture = document.getElementById("interactive-fixture");

function interactiveTest(testName, msg, callback) {
    if (!ifixture) {
        return;
    }
    var wrapped_callback = function() {
        QUnit.start();
        callback();
        QUnit.stop();
        var toolbar = document.getElementById("qunit-testrunner-toolbar");
        var question = document.createElement("div");
        toolbar.appendChild(question);
        question.innerHTML = "<input id='askOkYes' type='button' value='Yes'></input>" + "<input id='askOkNo' type='button' value='No'></input>" + "<span>" + msg + "?</span>";
        var askOkYes = document.getElementById("askOkYes");
        askOkYes.onclick = function() {
            question.innerHTML = "";
            QUnit.push(true, true, true, msg);
            QUnit.start();
        };
        var askOkNo = document.getElementById("askOkNo");
        askOkNo.onclick = function() {
            question.innerHTML = "";
            QUnit.push(false, false, true, msg);
            QUnit.start();
        };
    };
    QUnit.test(testName, null, wrapped_callback, true);
}

QUnit.module('sigplot', {
    setup: function() {
        var plotdiv = document.createElement("div");
        plotdiv.id = "plot";
        plotdiv.style.position = "absolute";
        plotdiv.style.width = "600px";
        plotdiv.style.height = "400px";
        fixture.appendChild(plotdiv);
    },
    teardown: function() {}
});

test('unit strings test', function() {
    var container = document.getElementById('plot');
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {xunits: "W", yunits: "Angle rad"}, {
        name: "x",
        symbol: 1,
        line: 0
    });

    equal(plot._Gx.HCB[0].xunits, 12);
    equal(plot._Gx.HCB[0].yunits, 33);
    equal(plot._Gx.xlab, 12);
    equal(plot._Gx.ylab, 33);
});

QUnit.module('sigplot-interactive', {
    setup: function() {
        ifixture.innerHTML = '';
        var plotdiv = document.createElement("div");
        plotdiv.id = "plot";
        plotdiv.style.margin = "0 auto";
        plotdiv.style.width = "600px";
        plotdiv.style.height = "400px";
        ifixture.appendChild(plotdiv);
    },
    teardown: function() {
        ifixture.innerHTML = '';
        if (ifixture.interval) {
            window.clearInterval(ifixture.interval);
            ifixture.interval = undefined;
        }
    }
});

interactiveTest('xunits: "Power", yunits: "Angle rad', 'Do you see the correct units?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {xunits: "Power", yunits: "Angle rad"}, {
        name: "x",
        symbol: 1,
        line: 0
    });
});

interactiveTest('xunits: "W/m^2", yunits: "Counts"', 'Do you see the correct units?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {xunits: "W/m^2", yunits: "Counts"}, {
        name: "x",
        symbol: 1,
        line: 0
    });
});

interactiveTest('xunits: "Hz", yunits: "Speed_knots=nmi/hr"', 'Do you see the correct units?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {xunits: "Hz", yunits: "Speed_knots=nmi/hr"}, {
        name: "x",
        symbol: 1,
        line: 0
    });
});

