/**
 * @license
 * File: tests.js
 * Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.
 *
 * This file is part of SigPlot.
 *
 * Licensed to the LGS Innovations (LGS) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  LGS licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* globals QUnit, sigplot, sigplot_plugins, equal, test, strictEqual, asyncTest, notEqual, alert, BlueFileReader, start, ok */

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
QUnit.module('m', {
    setup: function() {},
    teardown: function() {}
});
test('m sec2tod test', function() {
    var secs = 0;
    equal(sigplot.m.sec2tod(0), "00:00:00.000000");
    equal(sigplot.m.sec2tod(1), "00:00:01.000000");
    equal(sigplot.m.sec2tod(60), "00:01:00.000000");
    equal(sigplot.m.sec2tod(3600), "01:00:00.000000");
    equal(sigplot.m.sec2tod(43200), "12:00:00.000000");
    equal(sigplot.m.sec2tod(86399), "23:59:59.000000");
    equal(sigplot.m.sec2tod(86400), "24:00:00.000000");
    equal(sigplot.m.sec2tod(86401), "1::00:00:01.000000");
    equal(sigplot.m.sec2tod(86400 + 43200), "1::12:00:00.000000");
    equal(sigplot.m.sec2tod(31535999), "364::23:59:59.000000");
    equal(sigplot.m.sec2tod(31536000), "1951:01:01::00:00:00.000000");
    equal(sigplot.m.sec2tod(-31535999), "-364::23:59:59.000000");
    equal(sigplot.m.sec2tod(-31536000), "1949:01:01::00:00:00.000000");
    equal(sigplot.m.sec2tod(-31536001), "1948:12:31::23:59:59.000000");
    equal(sigplot.m.sec2tod(0.5), "00:00:00.500000");
    equal(sigplot.m.sec2tod(-0.5), "-0::00:00:00.500000");
    equal(sigplot.m.sec2tod(86400.5), "1::00:00:00.500000");
    equal(sigplot.m.sec2tod(86401.5), "1::00:00:01.500000");
    equal(sigplot.m.sec2tod(86400.5), "1::00:00:00.500000");
    equal(sigplot.m.sec2tod(31535999.5), "364::23:59:59.500000");
    equal(sigplot.m.sec2tod(-31535999.5), "-364::23:59:59.500000");
    equal(sigplot.m.sec2tod(-31536000.5), "1948:12:31::23:59:59.500000");
    equal(sigplot.m.sec2tod(-31536001.5), "1948:12:31::23:59:58.500000");
    equal(sigplot.m.sec2tod(0.5, true), "00:00:00.5");
    equal(sigplot.m.sec2tod(-0.5, true), "-0::00:00:00.5");
    equal(sigplot.m.sec2tod(86400.5, true), "1::00:00:00.5");
    equal(sigplot.m.sec2tod(86401.5, true), "1::00:00:01.5");
    equal(sigplot.m.sec2tod(86400.5, true), "1::00:00:00.5");
    equal(sigplot.m.sec2tod(31535999.5, true), "364::23:59:59.5");
    equal(sigplot.m.sec2tod(-31535999.5, true), "-364::23:59:59.5");
    equal(sigplot.m.sec2tod(-31536000.5, true), "1948:12:31::23:59:59.5");
    equal(sigplot.m.sec2tod(-31536001.5, true), "1948:12:31::23:59:58.5");
});
QUnit.module('mx', {
    setup: function() {},
    teardown: function() {}
});
test('mx format_f', function() {
    // the toFixed() function is limited to 0-20
    equal(sigplot.mx.format_f(1.0, 0, -1), "1");
    equal(sigplot.mx.format_f(1.0, 0, 21), "1.00000000000000000000");
    equal(sigplot.mx.format_f(1.0, 0, 1), "1.0");
    equal(sigplot.mx.format_f(1.0, 0, 20), "1.00000000000000000000");
});
test('mx real_to_pixel test', function() {
    var Mx = {
        origin: 1,
        x: 0,
        y: 0,
        level: 0,
        stk: [{
            xmin: -1,
            xmax: 1,
            ymin: -1,
            ymax: 1,
            xscl: 1 / 100,
            yscl: 1 / 100,
            x1: 0,
            y1: 0,
            x2: 200,
            y2: 200
        }]
    };
    var result = sigplot.mx.real_to_pixel(Mx, 0, 0);
    equal(result.x, 100);
    equal(result.y, 100);
    equal(result.clipped, false);
    var result = sigplot.mx.real_to_pixel(Mx, 1, 1);
    equal(result.x, 200);
    equal(result.y, 0);
    equal(result.clipped, false);
    var result = sigplot.mx.real_to_pixel(Mx, -1, -1);
    equal(result.x, 0);
    equal(result.y, 200);
    equal(result.clipped, false);
    var result = sigplot.mx.real_to_pixel(Mx, 1.5, 1);
    equal(result.x, 250);
    equal(result.y, 0);
    equal(result.clipped, true);
    var result = sigplot.mx.real_to_pixel(Mx, -1, -1.5);
    equal(result.x, 0);
    equal(result.y, 250);
    equal(result.clipped, true);
    var result = sigplot.mx.real_to_pixel(Mx, 1.5, 1, true);
    equal(result.x, 200);
    equal(result.y, 0);
    equal(result.clipped, true);
    var result = sigplot.mx.real_to_pixel(Mx, -1, -1.5, true);
    equal(result.x, 0);
    equal(result.y, 200);
    equal(result.clipped, true);
});
QUnit.module('bluefile', {
    setup: function() {},
    teardown: function() {}
});
asyncTest('int data', function() {
    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/ramp.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        equal(hdr.buf.byteLength, 2560, "buf correct size");
        //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        equal(hdr.dview.length, 1024, "dview correct size");
        strictEqual(hdr.file_name, "ramp.tmp", "correct file name");
        strictEqual(hdr.version, "BLUE", "correct version");
        strictEqual(hdr.headrep, "EEEI", "correct header rep");
        strictEqual(hdr.datarep, "EEEI", "correct data rep");
        strictEqual(hdr.timecode, 0, "correct timecode");
        strictEqual(hdr.type, 1000, "correct type");
        strictEqual(hdr["class"], 1, "correct class");
        strictEqual(hdr.format, "SI", "correct format");
        strictEqual(hdr.spa, 1, "correct spa");
        strictEqual(hdr.bps, 2, "correct bps");
        strictEqual(hdr.bpa, 2, "correct bpa");
        strictEqual(hdr.ape, 1, "correct ape");
        strictEqual(hdr.bpe, 2, "correct bpe");
        strictEqual(hdr.size, 1024, "correct size");
        strictEqual(hdr.xstart, 0.0, "correct xstart");
        strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        strictEqual(hdr.xunits, 1, "correct xunits");
        strictEqual(hdr.subsize, 1, "correct subsize");
        equal(hdr.ystart, undefined);
        equal(hdr.yelta, undefined);
        equal(hdr.yunits, 0);
        strictEqual(hdr.data_start, 512.0, "correct data_start");
        strictEqual(hdr.data_size, 2048, "correct data_size");
        equal(hdr.dview[0], 0);
        equal(hdr.dview[1], 1);
        equal(hdr.dview[2], 2);
        equal(hdr.dview[1021], 1021);
        equal(hdr.dview[1022], 1022);
        equal(hdr.dview[1023], 1023);
        start();
    });
});
asyncTest('Ascii Keywords', function() {
    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/lots_of_keywords.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var i = 1;
        var strpad = "";
        while (i <= 100) {
            if (i <= 100) {
                strpad = "                                ";
            }
            if (i <= 30) {
                strpad = "                ";
            }
            if (i <= 20) {
                strpad = "";
            }
            var str = "" + i;
            var keypad = "000";
            var ans = keypad.substring(0, keypad.length - str.length) + str;
            var key = "KEYWORD_" + ans;
            var value = "[value___" + ans + strpad + "]";
            if ((i > 50) && (i <= 100)) {
                value += " ";
            }
            equal(
                hdr.ext_header[key],
                value,
                key + " = " + hdr.ext_header[key]
            );
            i++;
        }
        start();
    });
});
asyncTest('All Keywords as JSON (default)', function() {
    var bfr = new sigplot.bluefile.BlueFileReader(); //defaults are to use dict
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = {
            B_TEST: 123,
            I_TEST: 1337,
            L_TEST: 113355,
            X_TEST: 987654321,
            F_TEST: 0.12345000356435776,
            D_TEST: 9.87654321,
            O_TEST: 255,
            STRING_TEST: "Hello World",
            B_TEST2: 99,
            STRING_TEST2: "Goodbye World"
        };
        for (var prop in keywords) {
            equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        start();
    });
});
asyncTest('All Keywords as JSON (json)', function() {
    var bfr = new sigplot.bluefile.BlueFileReader({
        ext_header_type: "json"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = {
            B_TEST: 123,
            I_TEST: 1337,
            L_TEST: 113355,
            X_TEST: 987654321,
            F_TEST: 0.12345000356435776,
            D_TEST: 9.87654321,
            O_TEST: 255,
            STRING_TEST: "Hello World",
            B_TEST2: 99,
            STRING_TEST2: "Goodbye World"
        };
        for (var prop in keywords) {
            equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        start();
    });
});
asyncTest('All Keywords as JSON (dict)', function() {
    var bfr = new sigplot.bluefile.BlueFileReader({
        ext_header_type: "dict"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = {
            B_TEST: 123,
            I_TEST: 1337,
            L_TEST: 113355,
            X_TEST: 987654321,
            F_TEST: 0.12345000356435776,
            D_TEST: 9.87654321,
            O_TEST: 255,
            STRING_TEST: "Hello World",
            B_TEST2: 99,
            STRING_TEST2: "Goodbye World"
        };
        for (var prop in keywords) {
            equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        start();
    });
});
asyncTest('All Keywords as JSON ({})', function() {
    var bfr = new sigplot.bluefile.BlueFileReader({
        ext_header_type: {}
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = {
            B_TEST: 123,
            I_TEST: 1337,
            L_TEST: 113355,
            X_TEST: 987654321,
            F_TEST: 0.12345000356435776,
            D_TEST: 9.87654321,
            O_TEST: 255,
            STRING_TEST: "Hello World",
            B_TEST2: 99,
            STRING_TEST2: "Goodbye World"
        };
        for (var prop in keywords) {
            equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        start();
    });
});
asyncTest('All Keywords as Array (list)', function() {
    var bfr = new sigplot.bluefile.BlueFileReader({
        ext_header_type: "list"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = [{
            "tag": "B_TEST",
            "value": 123
        }, {
            "tag": "I_TEST",
            "value": 1337
        }, {
            "tag": "L_TEST",
            "value": 113355
        }, {
            "tag": "X_TEST",
            "value": 987654321
        }, {
            "tag": "F_TEST",
            "value": 0.12345000356435776
        }, {
            "tag": "D_TEST",
            "value": 9.87654321
        }, {
            "tag": "O_TEST",
            "value": 255
        }, {
            "tag": "STRING_TEST",
            "value": "Hello World"
        }, {
            "tag": "B_TEST2",
            "value": 99
        }, {
            "tag": "STRING_TEST2",
            "value": "Goodbye World"
        }];
        for (var i = 0; i < keywords.length; i++) {
            equal(hdr.ext_header[i].tag, keywords[i].tag, "Keyword " + i + " tag " + hdr.ext_header[i].tag + " = " + keywords[i].tag);
            equal(hdr.ext_header[i].value, keywords[i].value, "Keyword " + i + " value " + hdr.ext_header[i].value + " = " + keywords[i].value);
        }
        start();
    });
});
asyncTest('double data', function() {
    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/sin.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        equal(hdr.buf.byteLength, 33280, "buf correct size");
        //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        equal(hdr.dview.length, 4096, "dview correct size");
        strictEqual(hdr.file_name, "sin.tmp", "correct file name");
        strictEqual(hdr.version, "BLUE", "correct version");
        strictEqual(hdr.headrep, "EEEI", "correct header rep");
        strictEqual(hdr.datarep, "EEEI", "correct data rep");
        strictEqual(hdr.timecode, 0, "correct timecode");
        strictEqual(hdr.type, 1000, "correct type");
        strictEqual(hdr["class"], 1, "correct class");
        strictEqual(hdr.format, "SD", "correct format");
        strictEqual(hdr.spa, 1, "correct spa");
        strictEqual(hdr.bps, 8, "correct bps");
        strictEqual(hdr.bpa, 8, "correct bpa");
        strictEqual(hdr.ape, 1, "correct ape");
        strictEqual(hdr.bpe, 8, "correct bpe");
        strictEqual(hdr.size, 4096, "correct size");
        strictEqual(hdr.xstart, 0.0, "correct xstart");
        strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        strictEqual(hdr.xunits, 0, "correct xunits");
        strictEqual(hdr.subsize, 1, "correct subsize");
        equal(hdr.ystart, undefined);
        equal(hdr.yelta, undefined);
        equal(hdr.yunits, 0);
        strictEqual(hdr.data_start, 512.0, "correct data_start");
        strictEqual(hdr.data_size, 32768, "correct data_size");
        equal(hdr.dview[0], 1);
        equal(hdr.dview[1], 0.9980267284282716);
        equal(hdr.dview[2], 0.9921147013144778);
        equal(hdr.dview[4093], 0.9048270524660175);
        equal(hdr.dview[4094], 0.9297764858882493);
        equal(hdr.dview[4095], 0.9510565162951516);
        start();
    });
});
asyncTest('complex float data', function() {
    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/pulse_cx.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        equal(hdr.buf.byteLength, 131584, "buf correct size");
        //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        equal(hdr.dview.length, 400, "dview correct size");
        strictEqual(hdr.file_name, "pulse_cx.tmp", "correct file name");
        strictEqual(hdr.version, "BLUE", "correct version");
        strictEqual(hdr.headrep, "EEEI", "correct header rep");
        strictEqual(hdr.datarep, "EEEI", "correct data rep");
        strictEqual(hdr.timecode, 0, "correct timecode");
        strictEqual(hdr.type, 1000, "correct type");
        strictEqual(hdr["class"], 1, "correct class");
        strictEqual(hdr.format, "CF", "correct format");
        strictEqual(hdr.spa, 2, "correct spa");
        strictEqual(hdr.bps, 4, "correct bps");
        strictEqual(hdr.bpa, 8, "correct bpa");
        strictEqual(hdr.ape, 1, "correct ape");
        strictEqual(hdr.bpe, 8, "correct bpe");
        strictEqual(hdr.size, 200, "correct size");
        strictEqual(hdr.xstart, 0.0, "correct xstart");
        strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        strictEqual(hdr.xunits, 1, "correct xunits");
        strictEqual(hdr.subsize, 1, "correct subsize");
        equal(hdr.ystart, undefined);
        equal(hdr.yelta, undefined);
        equal(hdr.yunits, 0);
        strictEqual(hdr.data_start, 512.0, "correct data_start");
        strictEqual(hdr.data_size, 1600, "correct data_size");
        start();
    });
});
test('create type1000', function() {
    //var hcb = sigplot.m.initialize([1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0], {file_name :"newFile"});
    var rdbuf = new ArrayBuffer(64);
    var rdview = new Float32Array(rdbuf);
    var hcb = sigplot.m.initialize(rdview, {
        file_name: "newFile"
    });
    notEqual(hcb.pipe, true); //#1
    equal(hcb.file_name, "newFile"); //#2
    equal(hcb.format, "SF"); //#3
    equal(hcb.type, 1000); //#4
    equal(hcb.dview.BYTES_PER_ELEMENT, 4); //#5
    equal(hcb.dview.length, 16); //#6
    hcb.dview = [1, 2, 3];
    //sigplot.m.filad(hcb, rdview);
    //equal(hcb.data_free, 0);              //#7
    equal(hcb.dview[0], 1.0); //#8
    equal(hcb.dview[1], 2.0); //#8
    equal(hcb.dview[2], 3.0); //#8
});
test('bluefile pipe basics', function() {
    var hcb = sigplot.m.initialize([], {
        pipe: true,
        pipesize: 16
    });
    equal(hcb.pipe, true);
    equal(hcb.in_byte, 0);
    equal(hcb.out_byte, 0);
    equal(hcb.format, "SF");
    equal(hcb.type, 1000);
    equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    notEqual(hcb.buf, undefined);
    notEqual(hcb.dview, undefined);
    equal(hcb.buf.byteLength, 16);
    var rdbuf = new ArrayBuffer(8);
    var rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 0);
    equal(hcb.out_byte, 0);
    equal(hcb.data_free, 4);
    sigplot.m.filad(hcb, [1.0, 2.0]);
    equal(hcb.in_byte, 8);
    equal(hcb.out_byte, 0);
    equal(hcb.dview[0], 1.0);
    equal(hcb.dview[1], 2.0);
    equal(hcb.data_free, 2);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 2);
    equal(hcb.out_byte, 8);
    equal(rdview[0], 1.0);
    equal(rdview[1], 2.0);
    equal(hcb.data_free, 4);
    sigplot.m.filad(hcb, [3.0, 4.0]);
    equal(hcb.in_byte, 0);
    equal(hcb.dview[2], 3.0);
    equal(hcb.dview[3], 4.0);
    equal(hcb.data_free, 2);
    sigplot.m.filad(hcb, [5.0, 6.0]);
    equal(hcb.in_byte, 8);
    equal(hcb.dview[0], 5.0);
    equal(hcb.dview[1], 6.0);
    equal(hcb.data_free, 0);
    rdbuf = new ArrayBuffer(16);
    rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 4);
    equal(hcb.out_byte, 8);
    equal(rdview[0], 3.0);
    equal(rdview[1], 4.0);
    equal(rdview[2], 5.0);
    equal(rdview[3], 6.0);
    equal(hcb.data_free, 4);
    sigplot.m.filad(hcb, [7.0, 8.0, 9.0, 10.0]);
    equal(hcb.in_byte, 8);
    equal(hcb.dview[0], 9.0);
    equal(hcb.dview[1], 10.0);
    equal(hcb.dview[2], 7.0);
    equal(hcb.dview[3], 8.0);
    throws(function() {
        sigplot.m.filad(hcb, [11.0, 12.0]);
    }, "pipe full");
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 4);
    equal(hcb.out_byte, 8);
    equal(rdview[0], 7.0);
    equal(rdview[1], 8.0);
    equal(rdview[2], 9.0);
    equal(rdview[3], 10.0);
    equal(hcb.data_free, 4);
});
test('bluefile pipe basics (typed array)', function() {
    var hcb = sigplot.m.initialize([], {
        pipe: true,
        pipesize: 16
    });
    equal(hcb.pipe, true);
    equal(hcb.in_byte, 0);
    equal(hcb.out_byte, 0);
    equal(hcb.format, "SF");
    equal(hcb.type, 1000);
    equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    notEqual(hcb.buf, undefined);
    notEqual(hcb.dview, undefined);
    equal(hcb.buf.byteLength, 16);
    var rdbuf = new ArrayBuffer(8);
    var rdview = new Float32Array(rdbuf);
    var wrbuf = new ArrayBuffer(8);
    var wrview = new Float32Array(wrbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 0);
    equal(hcb.out_byte, 0);
    equal(hcb.data_free, 4);
    wrview[0] = 1.0;
    wrview[1] = 2.0;
    sigplot.m.filad(hcb, wrview);
    equal(hcb.in_byte, 8);
    equal(hcb.out_byte, 0);
    equal(hcb.dview[0], 1.0);
    equal(hcb.dview[1], 2.0);
    equal(hcb.data_free, 2);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 2);
    equal(hcb.out_byte, 8);
    equal(rdview[0], 1.0);
    equal(rdview[1], 2.0);
    equal(hcb.data_free, 4);
    wrview[0] = 3.0;
    wrview[1] = 4.0;
    sigplot.m.filad(hcb, wrview);
    equal(hcb.in_byte, 0);
    equal(hcb.dview[2], 3.0);
    equal(hcb.dview[3], 4.0);
    equal(hcb.data_free, 2);
    wrview[0] = 5.0;
    wrview[1] = 6.0;
    sigplot.m.filad(hcb, wrview);
    equal(hcb.in_byte, 8);
    equal(hcb.dview[0], 5.0);
    equal(hcb.dview[1], 6.0);
    equal(hcb.data_free, 0);
    rdbuf = new ArrayBuffer(16);
    rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 4);
    equal(hcb.out_byte, 8);
    equal(rdview[0], 3.0);
    equal(rdview[1], 4.0);
    equal(rdview[2], 5.0);
    equal(rdview[3], 6.0);
    equal(hcb.data_free, 4);
    var wrbuf = new ArrayBuffer(16);
    var wrview = new Float32Array(wrbuf);
    wrview[0] = 7.0;
    wrview[1] = 8.0;
    wrview[2] = 9.0;
    wrview[3] = 10.0;
    sigplot.m.filad(hcb, wrview);
    equal(hcb.in_byte, 8);
    equal(hcb.dview[0], 9.0);
    equal(hcb.dview[1], 10.0);
    equal(hcb.dview[2], 7.0);
    equal(hcb.dview[3], 8.0);
    var wrbuf = new ArrayBuffer(8);
    var wrview = new Float32Array(wrbuf);
    wrview[0] = 11.0;
    wrview[1] = 12.0;
    throws(function() {
        sigplot.m.filad(hcb, wrview);
    }, "pipe full");
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 4);
    equal(hcb.out_byte, 8);
    equal(rdview[0], 7.0);
    equal(rdview[1], 8.0);
    equal(rdview[2], 9.0);
    equal(rdview[3], 10.0);
    equal(hcb.data_free, 4);
});
test('bluefile pipe CF type 2000', function() {
    var hcb = sigplot.m.initialize([], {
        pipe: true,
        format: "CF",
        type: 2000,
        subsize: 4,
        pipesize: 64
    });
    equal(hcb.pipe, true);
    equal(hcb.in_byte, 0);
    equal(hcb.out_byte, 0);
    equal(hcb.format, "CF");
    equal(hcb.type, 2000);
    equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    equal(hcb.spa, 2);
    equal(hcb.bps, 4);
    equal(hcb.bpa, 8);
    equal(hcb.bpe, 32);
    equal(hcb.out_byte, 0);
    equal(hcb.data_free, 16); // number of scalars available
    var rdbuf = new ArrayBuffer(32);
    var rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 0);
    equal(hcb.out_byte, 0);
    equal(hcb.data_free, 16);
    sigplot.m.filad(hcb, [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]);
    equal(hcb.in_byte, 32);
    equal(hcb.out_byte, 0);
    equal(hcb.dview[0], 1.0);
    equal(hcb.dview[1], 2.0);
    equal(hcb.dview[2], 3.0);
    equal(hcb.dview[3], 4.0);
    equal(hcb.dview[6], 7.0);
    equal(hcb.dview[7], 8.0);
    equal(hcb.data_free, 8);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 8);
    equal(hcb.in_byte, 32);
    equal(hcb.out_byte, 32);
    equal(rdview.length, 8);
    equal(rdview[0], 1.0);
    equal(rdview[1], 2.0);
    equal(rdview[2], 3.0);
    equal(rdview[3], 4.0);
    equal(rdview[6], 7.0);
    equal(rdview[7], 8.0);
    equal(hcb.data_free, 16);
    sigplot.m.filad(hcb, [8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
    equal(hcb.in_byte, 0);
    equal(hcb.out_byte, 32);
    equal(hcb.dview[0], 1.0);
    equal(hcb.dview[1], 2.0);
    equal(hcb.dview[2], 3.0);
    equal(hcb.dview[3], 4.0);
    equal(hcb.dview[6], 7.0);
    equal(hcb.dview[7], 8.0);
    equal(hcb.dview[8], 8.0);
    equal(hcb.dview[9], 7.0);
    equal(hcb.dview[10], 6.0);
    equal(hcb.dview[11], 5.0);
    equal(hcb.dview[14], 2.0);
    equal(hcb.dview[15], 1.0);
    equal(hcb.data_free, 8);
    sigplot.m.filad(hcb, [0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
    equal(hcb.in_byte, 32);
    equal(hcb.out_byte, 32);
    equal(hcb.dview[0], 0.0);
    equal(hcb.dview[1], 1.0);
    equal(hcb.dview[2], 0.0);
    equal(hcb.dview[3], 1.0);
    equal(hcb.dview[6], 0.0);
    equal(hcb.dview[7], 1.0);
    equal(hcb.dview[8], 8.0);
    equal(hcb.dview[9], 7.0);
    equal(hcb.dview[10], 6.0);
    equal(hcb.dview[11], 5.0);
    equal(hcb.dview[14], 2.0);
    equal(hcb.dview[15], 1.0);
    equal(hcb.data_free, 0);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 8);
    equal(hcb.in_byte, 32);
    equal(hcb.out_byte, 0);
    equal(rdview.length, 8);
    equal(rdview[0], 8.0);
    equal(rdview[1], 7.0);
    equal(rdview[2], 6.0);
    equal(rdview[3], 5.0);
    equal(rdview[6], 2.0);
    equal(rdview[7], 1.0);
    equal(hcb.data_free, 8);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 8);
    equal(hcb.in_byte, 32);
    equal(hcb.out_byte, 32);
    equal(rdview.length, 8);
    equal(rdview[0], 0.0);
    equal(rdview[1], 1.0);
    equal(rdview[2], 0.0);
    equal(rdview[3], 1.0);
    equal(rdview[6], 0.0);
    equal(rdview[7], 1.0);
    equal(hcb.data_free, 16);
});
test('bluefile pipe CF type 2000 misaligned', function() {
    var hcb = sigplot.m.initialize([], {
        pipe: true,
        format: "CF",
        type: 2000,
        subsize: 4,
        pipesize: 80
    });
    equal(hcb.pipe, true);
    equal(hcb.in_byte, 0);
    equal(hcb.out_byte, 0);
    equal(hcb.format, "CF");
    equal(hcb.type, 2000);
    equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    equal(hcb.spa, 2);
    equal(hcb.bps, 4);
    equal(hcb.bpa, 8);
    equal(hcb.bpe, 32);
    equal(hcb.out_byte, 0);
    equal(hcb.data_free, 20); // number of scalars available
    var rdbuf = new ArrayBuffer(32);
    var rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 0);
    equal(hcb.out_byte, 0);
    equal(hcb.data_free, 20);
    sigplot.m.filad(hcb, [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]);
    equal(hcb.in_byte, 32);
    equal(hcb.out_byte, 0);
    equal(hcb.dview[0], 1.0);
    equal(hcb.dview[1], 2.0);
    equal(hcb.dview[2], 3.0);
    equal(hcb.dview[3], 4.0);
    equal(hcb.dview[6], 7.0);
    equal(hcb.dview[7], 8.0);
    equal(hcb.data_free, 12);
    var ngot = sigplot.m.grabx(hcb, rdview);
    equal(ngot, 8);
    equal(hcb.in_byte, 32);
    equal(hcb.out_byte, 32);
    equal(rdview.length, 8);
    equal(rdview[0], 1.0);
    equal(rdview[1], 2.0);
    equal(rdview[2], 3.0);
    equal(rdview[3], 4.0);
    equal(rdview[6], 7.0);
    equal(rdview[7], 8.0);
    equal(hcb.data_free, 20);
    sigplot.m.filad(hcb, [8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
    equal(hcb.in_byte, 64);
    equal(hcb.out_byte, 32);
    equal(hcb.dview[0], 1.0);
    equal(hcb.dview[1], 2.0);
    equal(hcb.dview[2], 3.0);
    equal(hcb.dview[3], 4.0);
    equal(hcb.dview[6], 7.0);
    equal(hcb.dview[7], 8.0);
    equal(hcb.dview[8], 8.0);
    equal(hcb.dview[9], 7.0);
    equal(hcb.dview[10], 6.0);
    equal(hcb.dview[11], 5.0);
    equal(hcb.dview[14], 2.0);
    equal(hcb.dview[15], 1.0);
    equal(hcb.data_free, 12);
    sigplot.m.filad(hcb, [0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
    equal(hcb.in_byte, 16);
    equal(hcb.out_byte, 32);
    equal(hcb.dview[0], 0.0);
    equal(hcb.dview[1], 1.0);
    equal(hcb.dview[2], 0.0);
    equal(hcb.dview[3], 1.0);
    equal(hcb.dview[6], 7.0);
    equal(hcb.dview[7], 8.0);
    equal(hcb.dview[8], 8.0);
    equal(hcb.dview[9], 7.0);
    equal(hcb.dview[10], 6.0);
    equal(hcb.dview[11], 5.0);
    equal(hcb.dview[14], 2.0);
    equal(hcb.dview[15], 1.0);
    equal(hcb.dview[16], 0.0);
    equal(hcb.dview[17], 1.0);
    equal(hcb.dview[18], 0.0);
    equal(hcb.dview[19], 1.0);
    equal(hcb.data_free, 4);
});
//test('bluefile pipe', function() {
// make a largeish pipe (i.e. 1MB)
// write X elements at a time
// read Y elements at a time
//});
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
test('sigplot construction', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    equal(container.childNodes.length, 1);
    equal(container.childNodes[0], plot._Mx.parent);
    equal(plot._Mx.parent.childNodes.length, 2);
    equal(plot._Mx.parent.childNodes[0], plot._Mx.canvas);
    equal(plot._Mx.parent.childNodes[1], plot._Mx.wid_canvas);
    equal(plot._Mx.canvas.width, 600);
    equal(plot._Mx.canvas.height, 400);
    equal(plot._Mx.canvas.style.position, "absolute");
    equal(plot._Mx.wid_canvas.width, 600);
    equal(plot._Mx.wid_canvas.height, 400);
    equal(plot._Mx.wid_canvas.style.position, "absolute");
});

// Demonstrate that changing the ymin/ymax settings
// will implicitly change the autoy settings
test('sigplot layer1d change_settings ymin/ymax ', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);

    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);

    // An empty plot starts at -1.0, 1.0
    equal(plot._Gx.ymin, -1.0);
    equal(plot._Gx.ymax, 1.0);
    equal(plot._Gx.autoy, 3);


    var pulse = [];
    for (var i = 0; i <= 1000; i += 1) {
        pulse.push(0.0);
    }
    pulse[0] = 10.0;

    // The first overlay will scale the plot
    plot.overlay_array(pulse);
    equal(plot._Gx.ymin, -0.2);
    equal(plot._Gx.ymax, 10.2);
    equal(plot._Gx.autoy, 3);

    plot.change_settings({
        ymin: -50
    });
    equal(plot._Gx.ymin, -50);
    equal(plot._Gx.ymax, 10.2);
    equal(plot._Gx.autoy, 2);

    plot.change_settings({
        ymax: 100
    });
    equal(plot._Gx.ymin, -50);
    equal(plot._Gx.ymax, 100);
    equal(plot._Gx.autoy, 0);

    plot.change_settings({
        ymin: 10,
        ymax: 50
    });
    equal(plot._Gx.ymin, 10);
    equal(plot._Gx.ymax, 50);
    equal(plot._Gx.autoy, 0);

    plot.change_settings({
        ymin: null
    });
    equal(plot._Gx.ymin, -0.2);
    equal(plot._Gx.ymax, 50);
    equal(plot._Gx.autoy, 1);

    plot.change_settings({
        ymax: null
    });
    equal(plot._Gx.ymin, -0.2);
    equal(plot._Gx.ymax, 10.2);
    equal(plot._Gx.autoy, 3);

    plot.change_settings({
        ymin: -100,
        ymax: 200
    });
    equal(plot._Gx.ymin, -100);
    equal(plot._Gx.ymax, 200);
    equal(plot._Gx.autoy, 0);

    plot.change_settings({
        ymin: -10,
        ymax: 20
    });
    equal(plot._Gx.ymin, -10);
    equal(plot._Gx.ymax, 20);
    equal(plot._Gx.autoy, 0);

    plot.change_settings({
        ymin: null,
        ymax: null
    });
    equal(plot._Gx.ymin, -0.2);
    equal(plot._Gx.ymax, 10.2);
    equal(plot._Gx.autoy, 3);
});

test('Cmode input test', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        cmode: "MA"
    });

    equal(plot._Gx.cmode, 1);

    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, null, {
        name: "x",
        symbol: 1,
        line: 0
    });


    plot.change_settings({
        cmode: "Magnitude"
    });
    equal(plot._Gx.cmode, 1);
    plot.change_settings({
        cmode: "Phase"
    });
    equal(plot._Gx.cmode, 2);
    plot.change_settings({
        cmode: "Real"
    });
    equal(plot._Gx.cmode, 3);
    plot.change_settings({
        cmode: "Imaginary"
    });
    equal(plot._Gx.cmode, 4);
    plot.change_settings({
        cmode: "Imag/Real"
    });
    equal(plot._Gx.cmode, 5);
    plot.change_settings({
        cmode: "Real/Imag"
    });
    equal(plot._Gx.cmode, 5);
    plot.change_settings({
        cmode: "10*log10"
    });
    equal(plot._Gx.cmode, 6);
    plot.change_settings({
        cmode: "20*log10"
    });
    equal(plot._Gx.cmode, 7);
});

test('sigplot layer1d noautoscale', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var pulse = [];
    for (var i = 0; i <= 1000; i += 1) {
        pulse.push(0.0);
    }
    plot.overlay_array(pulse);
    equal(plot._Gx.panymin, -1.0);
    equal(plot._Gx.panymax, 1.0);
    pulse[0] = 1.0;
    plot.reload(0, pulse);
    equal(plot._Gx.panymin, -0.02);
    equal(plot._Gx.panymax, 1.02);
    for (var i = 1; i <= 1000; i += 1) {
        pulse[i - 1] = 0;
        pulse[i] = 1;
        equal(plot._Gx.panymin, -0.02);
        equal(plot._Gx.panymax, 1.02);
    }
});
test('sigplot layer1d autoscale', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        autol: 2
    });
    notEqual(plot, null);
    var pulse = [];
    for (var i = 0; i <= 1000; i += 1) {
        pulse.push(0.0);
    }
    plot.overlay_array(pulse);
    equal(plot._Gx.panymin, -1.0);
    equal(plot._Gx.panymax, 1.0);
    pulse[0] = 1.0;
    plot.reload(0, pulse);
    var expected_ymin = (-0.02 * 0.5) + (-1 * 0.5);
    var expected_ymax = (1.02 * 0.5) + (1 * 0.5);
    equal(plot._Gx.panymin, expected_ymin);
    equal(plot._Gx.panymax, expected_ymax);
    for (var i = 1; i <= 1000; i += 1) {
        pulse[i - 1] = 0;
        pulse[i] = 1;
        expected_ymin = (expected_ymin * 0.5) + (expected_ymin * 0.5);
        expected_ymax = (expected_ymax * 0.5) + (expected_ymax * 0.5);
        equal(plot._Gx.panymin, expected_ymin);
        equal(plot._Gx.panymax, expected_ymax);
    }
});
test('sigplot layer1d autoscale negative', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        autol: 2
    });
    notEqual(plot, null);
    var pulse = [];
    for (var i = 0; i <= 1000; i += 1) {
        pulse.push(-60.0);
    }
    pulse[0] = -10.0;
    plot.overlay_array(pulse);
    var expected_ymin = (-61.0 * 0.5) + (-1 * 0.5);
    var expected_ymax = (-9.0 * 0.5) + (1 * 0.5);
    equal(plot._Gx.panymin, expected_ymin);
    equal(plot._Gx.panymax, expected_ymax);
    for (var i = 1; i <= 1000; i += 1) {
        pulse[i - 1] = -60;
        pulse[i] = -10;
        expected_ymin = (expected_ymin * 0.5) + (expected_ymin * 0.5);
        expected_ymax = (expected_ymax * 0.5) + (expected_ymax * 0.5);
        equal(plot._Gx.panymin, expected_ymin);
        equal(plot._Gx.panymax, expected_ymax);
    }
});
test('sigplot 0px height', function() {
    var container = document.getElementById('plot');
    container.style.height = "0px";
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container);
    notEqual(plot, null);
    equal(plot._Mx.canvas.height, 0);
    var zeros = [];
    for (var i = 0; i <= 1000; i += 1) {
        zeros.push(0.0);
    }
    plot.overlay_array(zeros);
    notEqual(plot.get_layer(0), null);
    plot.deoverlay();
    equal(plot.get_layer(0), null);
    plot.overlay_array(zeros, {
        type: 2000,
        subsize: zeros.length
    });
    notEqual(plot.get_layer(0), null);
    plot.deoverlay();
    equal(plot.get_layer(0), null);
    plot.overlay_pipe({
        type: 2000,
        subsize: 128
    });
    notEqual(plot.get_layer(0), null);
    equal(plot.get_layer(0).drawmode, "scrolling");
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 0);
    equal(plot.get_layer(0).lps, 1);
    plot.deoverlay();
    plot.overlay_pipe({
        type: 2000,
        subsize: 128
    }, {
        drawmode: "rising"
    });
    notEqual(plot.get_layer(0), null);
    equal(plot.get_layer(0).drawmode, "rising");
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 0);
    equal(plot.get_layer(0).lps, 1);
    plot.deoverlay();
    plot.overlay_pipe({
        type: 2000,
        subsize: 128
    }, {
        drawmode: "falling"
    });
    notEqual(plot.get_layer(0), null);
    equal(plot.get_layer(0).drawmode, "falling");
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 0);
    equal(plot.get_layer(0).position, 0);
    equal(plot.get_layer(0).lps, 1);
    plot.deoverlay();
});
test('sigplot resize raster 0px height', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container);
    notEqual(plot, null);
    equal(plot._Mx.canvas.height, 400);
    var zeros = [];
    for (var i = 0; i <= 128; i += 1) {
        zeros.push(0.0);
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 128
    });
    notEqual(plot.get_layer(0), null);
    equal(plot.get_layer(0).drawmode, "scrolling");
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 1);
    ok(plot.get_layer(0).lps > 1);
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 2);
    ok(plot.get_layer(0).lps > 1);
    container.style.height = "0px";
    plot.checkresize();
    plot._refresh();
    plot.checkresize();
    equal(plot._Mx.canvas.height, 0);
    equal(plot.get_layer(0).lps, 1);
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 0);
});
test('sigplot resize raster larger height', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container);
    notEqual(plot, null);
    equal(plot._Mx.canvas.height, 400);
    var zeros = [];
    for (var i = 0; i <= 128; i += 1) {
        zeros.push(0.0);
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 128
    }, {
        drawmode: "scrolling"
    });
    notEqual(plot.get_layer(0), null);
    equal(plot.get_layer(0).drawmode, "scrolling");
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 1);
    ok(plot.get_layer(0).lps > 1);
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 2);
    ok(plot.get_layer(0).lps > 1);
    var orig_lps = plot.get_layer(0).lps;
    container.style.height = "600px";
    plot.checkresize();
    plot._refresh();
    plot.checkresize();
    equal(plot._Mx.canvas.height, 600);
    ok(plot.get_layer(0).lps > orig_lps);
    plot.push(0, zeros, null, true);
    equal(plot.get_layer(0).position, 3);
    for (var i = 0; i <= plot.get_layer(0).lps; i += 1) {
        plot.push(0, zeros, null, true);
    }
});
test('sigplot change raster LPS', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(fixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container);
    notEqual(plot, null);
    var zeros = [];
    for (var i = 0; i <= 128; i += 1) {
        zeros.push(0.0);
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 128,
        lps: 100,
        pipe: true
    });
    notEqual(plot.get_layer(0), null);
    strictEqual(plot.get_layer(0).lps, 100);
    plot.push(0, zeros, {
        lps: 200
    }, true);
    plot._refresh();
    strictEqual(plot.get_layer(0).lps, 200);
});
test('Add and remove plugins', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var zeros = [];
    for (var i = 0; i <= 128; i += 1) {
        zeros.push(0.0);
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 128,
        lps: 100,
        pipe: true
    });
    var accordion = new sigplot_plugins.AccordionPlugin({
        draw_center_line: true,
        shade_area: true,
        draw_edge_lines: true,
        direction: "vertical",
        edge_line_style: {
            strokeStyle: "#FF2400"
        }
    });
    equal(plot._Gx.plugins.length, 0, "Expected zero plugins");
    plot.add_plugin(accordion, 1);
    equal(plot._Gx.plugins.length, 1, "Expected one plugin");
    plot.remove_plugin(accordion);
    equal(plot._Gx.plugins.length, 0, "Expected zero plugins");
});
test('Plugins still exist after plot and canvas height and width are 0', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        xmin: -4,
        xmax: 10
    });
    var positions = [0.0, 5.0, 9.0, 3.0];
    for (var pos = 0; pos < positions.length; ++pos) {
        var slider = new sigplot_plugins.SliderPlugin({
            style: {
                strokeStyle: "#FF0000"
            }
        });
        plot.add_plugin(slider, 1);
        slider.set_position(positions[pos]);
    }
    plot.checkresize();
    equal(plot._Gx.plugins.length, 4, "Expected 4 slider plugins");
    equal(plot._Mx.canvas.height, container.clientHeight, "Expected plot canvas height to be container width");
    equal(plot._Mx.canvas.width, container.clientWidth, "Expected plot canvas width to be container height");
    for (var pos = 0; pos < positions.length; ++pos) {
        equal(plot._Gx.plugins[pos].canvas.height, plot._Mx.canvas.height, "Expected #" + pos + " slider plugin height to be plot height");
        equal(plot._Gx.plugins[pos].canvas.width, plot._Mx.canvas.width, "Expected #" + pos + " slider plugin width to be plot width");
    }
    container.style.display = "none";
    plot.checkresize();
    plot._refresh(); // force syncronous refresh
    equal(plot._Mx.canvas.height, 0, "Expected plot canvas height to be 0");
    equal(plot._Mx.canvas.width, 0, "Expected plot canvas width to be 0");
    for (var pos = 0; pos < positions.length; ++pos) {
        equal(plot._Gx.plugins[pos].canvas.height, 0, "Expected #" + pos + " slider plugin height to be 0");
        equal(plot._Gx.plugins[pos].canvas.width, 0, "Expected #" + pos + " slider plugin width to be 0");
    }
    container.style.display = "block";
    plot.checkresize();
    plot._refresh(); // force syncronous refresh
    equal(plot._Mx.canvas.height, container.clientHeight, "Expected plot canvas height to be container width");
    equal(plot._Mx.canvas.width, container.clientWidth, "Expected plot canvas width to be container height");
    for (var pos = 0; pos < positions.length; ++pos) {
        equal(plot._Gx.plugins[pos].canvas.height, plot._Mx.canvas.height, "Expected #" + pos + " slider plugin height to be plot height");
        equal(plot._Gx.plugins[pos].canvas.width, plot._Mx.canvas.width, "Expected #" + pos + " slider plugin width to be plot width");
    }
});

test('unit strings test: x -> Power and y -> Angle rad', function() {
    var container = document.getElementById('plot');
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        xunits: "Power",
        yunits: "Angle rad"
    }, {
        name: "x",
        symbol: 1,
        line: 0
    });

    equal(plot._Gx.HCB[0].xunits, 12);
    equal(plot._Gx.HCB[0].yunits, 33);
    equal(plot._Gx.xlab, 12);
    equal(plot._Gx.ylab, 33);
});

test('unit strings test: x -> Hz and y -> Time_sec', function() {
    var container = document.getElementById('plot');
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        xunits: "Hz",
        yunits: "Time_sec"
    }, {
        name: "x",
        symbol: 1,
        line: 0
    });

    equal(plot._Gx.HCB[0].xunits, 3);
    equal(plot._Gx.HCB[0].yunits, 1);
    equal(plot._Gx.xlab, 3);
    equal(plot._Gx.ylab, 1);
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
interactiveTest('sigplot empty', 'Do you see an empty plot scaled from -1 to 1 on both axis?', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(ifixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    equal(container.childNodes.length, 1);
    equal(container.childNodes[0], plot._Mx.parent);
    equal(plot._Mx.parent.childNodes.length, 2);
    equal(plot._Mx.parent.childNodes[0], plot._Mx.canvas);
    equal(plot._Mx.parent.childNodes[1], plot._Mx.wid_canvas);
    equal(plot._Mx.canvas.width, 600);
    equal(plot._Mx.canvas.height, 400);
    equal(plot._Mx.canvas.style.position, "absolute");
    equal(plot._Mx.wid_canvas.width, 600);
    equal(plot._Mx.wid_canvas.height, 400);
    equal(plot._Mx.wid_canvas.style.position, "absolute");
});
interactiveTest('sigplot no legend', 'Is the legend button hidden?', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(ifixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        no_legend_button: true
    });
});
interactiveTest('sigplot no ylabel', 'Does the label say Unknown (U)?', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(ifixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        ylabel: null
    });
});
interactiveTest('sigplot no xlabel', 'Is the label say None (U)?', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(ifixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        xlabel: null
    });
});
interactiveTest('sigplot no label', 'Is the label completely hidden?', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(ifixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        xlabel: null,
        ylabel: null
    });
});
interactiveTest('sigplot custom font', 'Is the font changed from the default?', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(ifixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        font_family: "Comic Sans MS, cursive, sans-serif"
    });
});
interactiveTest('sigplot bottom scrollbar', 'Is the x scrollbar on the bottom?', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(ifixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        noreadout: true,
        xlabel: null,
        ylabel: null,
        x_scrollbar_location: "bottom"
    });
});
interactiveTest('sigplot minimal chrome', 'Is the plot devoid of chrome', function() {
    var container = document.getElementById('plot');
    equal(container.childNodes.length, 0);
    equal(ifixture.childNodes.length, 1);
    var plot = new sigplot.Plot(container, {
        noreadout: true,
        xlabel: null,
        ylabel: null,
        nopan: true,
        noxaxis: true,
        noyaxis: true
    });
    // display a ramp so it's easy to see the plot edges
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp"
    });
});
interactiveTest('sigplot menu no mtag', 'Open the menu and move it, ensure mtag events are not alerted', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.addListener("mtag", function(evt) {
        alert("Mtag occurred!");
    });
});
interactiveTest('sigplot continuous mtag', 'Ensure continuous mtag updates', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xcnt: "continuous"
    });
    notEqual(plot, null);

    var output = document.createElement("p");
    output.innerHTML = "";
    ifixture.appendChild(output);
    plot.addListener("mtag", function(evt) {
        output.innerHTML = "X: " + evt.x.toFixed(8) + " Y: " + evt.y.toFixed(8);
    });
});
interactiveTest('sigplot ramp', 'Do you see a ramp from 0 to 1023?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp"
    });
});
interactiveTest('sigplot ramp', 'Do you see a sin wave?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_href("dat/sin.tmp", null, {
        name: "x"
    });
});
interactiveTest('empty t1000 array', 'Do you see a plot with two pulses?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.overlay_array([], {
        file_name: "data1"
    });
    plot.overlay_array(null, {
        file_name: "data2"
    });
    var pulse1 = [];
    var pulse2 = [];
    for (var i = 0; i < 1000; i++) {
        if ((i < 490) || (i > 510)) {
            pulse1.push(0);
        } else {
            pulse1.push(10.0);
        }
        if ((i < 240) || (i > 260)) {
            pulse2.push(0);
        } else {
            pulse2.push(10.0);
        }
    }
    plot.reload(0, pulse1);
    plot.reload(1, pulse2);
});
interactiveTest('empty t2000 array', 'Do you see a plot with two pulses?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.overlay_array([], {
        type: 2000,
        subsize: 1000,
        file_name: "data1"
    }, {
        layerType: sigplot.Layer1D
    });
    plot.overlay_array([], {
        type: 2000,
        subsize: 1000,
        file_name: "data2"
    }, {
        layerType: sigplot.Layer1D
    });
    var pulse1 = [];
    var pulse2 = [];
    for (var i = 0; i < 1000; i++) {
        if ((i < 490) || (i > 510)) {
            pulse1.push(0);
        } else {
            pulse1.push(10.0);
        }
        if ((i < 240) || (i > 260)) {
            pulse2.push(0);
        } else {
            pulse2.push(10.0);
        }
    }
    plot.reload(0, pulse1);
    plot.reload(1, pulse2);
});
interactiveTest('sigplot triangle symbol', 'Do you see triangle symbols?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, null, {
        name: "x",
        symbol: 6,
        line: 0
    });
});
interactiveTest('sigplot custom symbol', 'Do you see custom symbols, alternating RGB?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);

    function custom_symbol(ctx, i, x, y) {
        var n = (i % 3);
        if (n === 0) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        } else if (n === 1) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
        } else if (n === 2) {
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 360);
        ctx.fill();
        ctx.stroke();
    }
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, null, {
        name: "x",
        symbol: custom_symbol,
        line: 0
    });
});
interactiveTest('sigplot custom symbol complex', 'Do you see custom symbols in RGB order (groups of 3)?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        cmode: "RI"
    });
    notEqual(plot, null);

    function custom_symbol(ctx, i, x, y) {
        var n = (i % 3);
        if (n === 0) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        } else if (n === 1) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
        } else if (n === 2) {
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 360);
        ctx.fill();
        ctx.stroke();
    }
    // make it so the line is RRRGGGBBB
    var ramp = [1, 1, 4, 4, 7, 7, 2, 2, 5, 5, 8, 8, 3, 3, 6, 6, 9, 9];
    plot.overlay_array(ramp, {
        format: "CF"
    }, {
        name: "x",
        symbol: custom_symbol,
        line: 0
    });
});
interactiveTest('sigplot custom symbol-line', 'Do you see custom symbols?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);

    function custom_symbol(ctx, i, x, y) {
        var n = (i % 3);
        if (n === 0) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        } else if (n === 1) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
        } else if (n === 2) {
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 360);
        ctx.fill();
        ctx.stroke();
    }
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, null, {
        name: "x",
        symbol: custom_symbol
    });
});
interactiveTest('sigplot custom xmult', 'Do you see the x-axis in "hecto-" units (0-40)?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xmult: 100
    });
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_href("dat/sin.tmp", null, {
        name: "x"
    });
});
interactiveTest('sigplot penny 1d legend default', 'Do you see a 1d penny with properly labeled legend (default)?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_href("dat/penny.prm", null, {
        layerType: sigplot.Layer1D
    });
});
interactiveTest('sigplot penny 1d legend string override', 'Do you see a penny with properly labeled legend (abc)?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_href("dat/penny.prm", null, {
        layerType: sigplot.Layer1D,
        name: "abc"
    });
});
interactiveTest('sigplot penny 1d legend multiple', 'Do you see a penny with properly labeled legend (one, two, three)?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_href("dat/penny.prm", null, {
        layerType: sigplot.Layer1D,
        name: ["one", "two", "three"]
    });
});
interactiveTest('sigplot small xrange', 'Do you see a properly formatted axis for 999.9965-999.9985?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 4096; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp",
        xstart: 999996296.08025432,
        xdelta: 0.637054443359375,
        format: "SF"
    });
});
interactiveTest('sigplot xtimecode', 'Do you see a timecode xaxis 0 to 1h?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 4096; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp",
        format: "SF",
        xunits: 4
    });
});
interactiveTest('sigplot ytimecode', 'Do you see a timecode yaxis?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 31449600; i < 31449600 + 4096; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp",
        format: "SF",
        yunits: 4
    });
});
interactiveTest('sigplot ytimecode w/dates', 'Do you see a timecode yaxis?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    var now = Date.now() / 1000;
    for (var i = now; i < now + 2000; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp",
        format: "SF",
        yunits: 4
    });
});
interactiveTest('sigplot custom xlabel/ylabel', 'Do you see custom xlabel/ylabel?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xlabel: "CustomX",
        ylabel: "CustomY"
    });
    notEqual(plot, null);
    var ramp = [];
    var now = Date.now() / 1000;
    for (var i = now; i < now + 2000; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp",
        format: "SF",
        yunits: 4
    });
});
interactiveTest('sigplot custom function xlabel/ylabel', 'Do you see custom xlabel/ylabel?', function() {
    var xlabel = function(units, mult) {
        return "CustomX - " + units + " " + mult;
    };
    var ylabel = function(units, mult) {
        return "CustomY - " + units + " " + mult;
    };
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xlabel: xlabel,
        ylabel: ylabel
    });
    notEqual(plot, null);
    var ramp = [];
    var now = Date.now() / 1000;
    for (var i = now; i < now + 2000; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp",
        format: "SF",
        yunits: 4
    });
});
interactiveTest('sigplot expand full', 'Do you see a fully expanded plot?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        autox: 3,
        autoy: 3,
        cmode: "IR",
        type: 2000,
        xlab: 1,
        ylab: 44,
        expand: true
    });

    function plot2(plot) {
        plot.overlay_array([1, 2, 2, 3, 3, 4, 4, 5], {
            subsize: 4,
            type: 2000,
            format: "CD",
            xdelta: 7.01200008392334,
            xstart: 1435763625.898,
            xunits: 1,
            yunits: 44
        }, {
            layerType: sigplot.Layer1D,
            expand: true
        });
    }

    function plot1(plot) {
        plot.overlay_array([0, 0, 1, 1, 2, 2, 3, 3], {
            subsize: 4,
            type: 2000,
            format: "CD",
            xdelta: 7.01200008392334,
            xstart: 1435763625.898,
            xunits: 1,
            yunits: 44
        }, {
            layerType: sigplot.Layer1D,
            expand: true
        });
    }
    plot1(plot);
    plot2(plot);
});
interactiveTest('sigplot custom axis label', 'Do you see the axis label "CustomY (a) vs. Time code format"?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_href("dat/sin.tmp", null, {
        xlab: 4,
        ylab: ["CustomY", "a"]
    });
});
interactiveTest('sigplot custom axis label', 'Do you see the axis label "CustomY (Ka) vs. CustomX"?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1024; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        file_name: "ramp"
    }, {
        xlab: "CustomX",
        ylab: ["CustomY", "a"]
    });
});
interactiveTest('reload', 'Do you see a pulse scrolling right?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var pulse = [];
    var pulse_width = 5;
    var pulse_position = 0;
    for (var i = 0; i < 1000; i++) {
        if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
            pulse.push(10.0);
        } else {
            pulse.push(-10.0);
        }
    }
    plot.overlay_array(pulse, {
        type: 1000
    });
    ifixture.interval = window.setInterval(function() {
        pulse_position = (pulse_position + 1) % 1000;
        for (var i = 0; i < 1000; i++) {
            if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
                pulse[i] = 10.0;
            } else {
                pulse[i] = -10.0;
            }
        }
        plot.reload(0, pulse);
    }, 100);
});
interactiveTest('xtimecode', 'Do you see a pulse scrolling right with an xtimecode axis?', function() {
    var epochDelta = (20.0 * 365.0 + 5.0) * (24 * 3600 * 1000);
    var currentTime = (new Date().getTime() + epochDelta) / 1000;
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var pulse = [];
    var pulse_width = 5;
    var pulse_position = 0;
    for (var i = 0; i < 1000; i++) {
        if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
            pulse.push(10.0);
        } else {
            pulse.push(-10.0);
        }
    }
    plot.overlay_array(pulse, {
        type: 1000,
        xstart: currentTime,
        xunits: 4
    });
    ifixture.interval = window.setInterval(function() {
        pulse_position = (pulse_position + 1) % 1000;
        for (var i = 0; i < 1000; i++) {
            if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
                pulse[i] = 10.0;
            } else {
                pulse[i] = -10.0;
            }
        }
        currentTime = (new Date().getTime() + epochDelta) / 1000;
        plot.reload(0, pulse, {
            xstart: currentTime + 1
        });
    }, 100);
});
interactiveTest('t2000 odd-size layer1D (reload)', 'Do you see a stationary pulse?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var pulse = [];
    var pulse_width = 5;
    var pulse_position = 8192;
    for (var i = 0; i < 16385; i++) {
        if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
            pulse.push(10.0);
        } else {
            pulse.push(-10.0);
        }
    }
    plot.overlay_array(null, {
        type: 2000,
        subsize: 16385
    }, {
        layerType: sigplot.Layer1D
    });
    ifixture.interval = window.setInterval(function() {
        var pulse = [];
        for (var i = 0; i < 16385; i++) {
            if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
                pulse.push(Math.random() * 10.0);
            } else {
                pulse.push(-10.0);
            }
        }
        plot.reload(0, pulse);
    }, 100);
});
interactiveTest('t2000 odd-size layer1D (push)', 'Do you see a stationary pulse?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var pulse = [];
    var pulse_width = 5;
    var pulse_position = 8192;
    for (var i = 0; i < 16385; i++) {
        if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
            pulse.push(10.0);
        } else {
            pulse.push(-10.0);
        }
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 16385
    }, {
        layerType: sigplot.Layer1D
    });
    ifixture.interval = window.setInterval(function() {
        var pulse = [];
        for (var i = 0; i < 16385; i++) {
            if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
                pulse.push(Math.random() * 10.0);
            } else {
                pulse.push(-10.0);
            }
        }
        plot.push(0, pulse);
    }, 100);
});
interactiveTest('t2000 layer1D', 'Do you see a pulse scrolling right (type 2000)?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var pulse = [];
    var pulse_width = 5;
    var pulse_position = 0;
    for (var i = 0; i < 1000; i++) {
        if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
            pulse.push(10.0);
        } else {
            pulse.push(-10.0);
        }
    }
    plot.overlay_array(null, {
        type: 2000,
        subsize: 1000
    }, {
        layerType: sigplot.Layer1D
    });
    ifixture.interval = window.setInterval(function() {
        pulse_position = (pulse_position + 1) % 1000;
        for (var i = 0; i < 1000; i++) {
            if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
                pulse[i] = 10.0;
            } else {
                pulse[i] = -10.0;
            }
        }
        plot.reload(0, pulse);
    }, 100);
});
interactiveTest('zoom-xdelta', 'Is the plot fully scaled displaying a ramp?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1000; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, {
        type: 1000,
        xstart: -500
    });
    plot.zoom({
        x: -250,
        y: 5
    }, {
        x: 250,
        y: -5
    });
    plot.reload(0, ramp, {
        xstart: 0,
        xdelta: 50
    });
    plot.unzoom();
});
interactiveTest('reload', 'Do you see a pulse stationary at 0 while the axis shifts?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var pulse = [];
    var pulse_width = 1;
    var pulse_position = 500;
    var xstart = -500;
    var delta = 100;
    for (var i = 0; i < 1000; i++) {
        if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
            pulse.push(10.0);
        } else {
            pulse.push(-10.0);
        }
    }
    plot.overlay_array(pulse, {
        type: 1000,
        xstart: xstart
    });
    ifixture.interval = window.setInterval(function() {
        pulse_position = pulse_position + delta;
        xstart = xstart - delta;
        if ((pulse_position >= 900) || (pulse_position <= 100)) {
            delta = delta * -1;
        }
        for (var i = 0; i < 1000; i++) {
            if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
                pulse[i] = 10.0;
            } else {
                pulse[i] = -10.0;
            }
        }
        plot.reload(0, pulse, {
            xstart: xstart
        });
    }, 1000);
});
interactiveTest('reload', 'Do you see a pulse stationary at 0 while the axis grows?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var pulse = [];
    var pulse_width = 1;
    var pulse_position = 500;
    var xstart = -500;
    var xdelta = 1;
    for (var i = 0; i < 1000; i++) {
        if ((i >= pulse_position) && (i < (pulse_position + pulse_width))) {
            pulse.push(10.0);
        } else {
            pulse.push(-10.0);
        }
    }
    plot.overlay_array(pulse, {
        type: 1000,
        xstart: -500,
        xdelta: xdelta
    });
    ifixture.interval = window.setInterval(function() {
        xdelta = xdelta * 2;
        xstart = -500 * xdelta;
        plot.reload(0, pulse, {
            xstart: xstart,
            xdelta: xdelta
        });
    }, 5000);
});
interactiveTest('scrolling line', 'Do you see a scrolling random data plot (0 to 1 ) that does not scale', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        ymin: -2,
        ymax: 2
    });
    plot.overlay_pipe({
        type: 1000
    }, {
        framesize: 32768,
        drawmode: "scrolling"
    });
    ifixture.interval = window.setInterval(function() {
        var random = [];
        for (var i = 0; i < 100; i += 1) {
            random.push(Math.random());
        }
        plot.push(0, random);
    }, 100);
});
interactiveTest('complex scrolling line', 'Do you see a scrolling random data (0 to 1) plot that auto-scales', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        cmode: 3,
        autol: 5
    });
    plot.overlay_pipe({
        type: 1000,
        format: "CF"
    }, {
        framesize: 32768,
        drawmode: "scrolling"
    });
    ifixture.interval = window.setInterval(function() {
        var random = [];
        for (var i = 0; i < 100; i += 1) {
            random.push(Math.random());
        }
        plot.push(0, random);
    }, 100);
});
interactiveTest('autoy with all zeros', 'Does the autoscaling properly work and keep both magenta and blue lines fully visible?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        autoy: 3
    });
    notEqual(plot, null);
    var random = [];
    var zeros = [];
    for (var i = 0; i <= 1000; i += 1) {
        random.push(Math.random());
        zeros.push(0);
    }
    var zeros_lyr = plot.overlay_array(zeros);
    var rand1_lyr = plot.overlay_array(zeros);
    var rand2_lyr = plot.overlay_array(zeros);
    var iter = 1;
    ifixture.interval = window.setInterval(function() {
        plot.reload(zeros_lyr, zeros, {});
        for (var i = 0; i <= 1000; i += 1) {
            random[i] = iter * Math.random();
        }
        plot.reload(rand1_lyr, random, {});
        for (var i = 0; i <= 1000; i += 1) {
            random[i] = -1 * iter * Math.random();
        }
        plot.reload(rand2_lyr, random, {});
        iter += 1;
    }, 500);
});
interactiveTest('autoy with all zeros (pipe)', 'Does the autoscaling properly work?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        autol: 2,
        autoy: 3
    });
    notEqual(plot, null);
    var random = [];
    var zeros = [];
    for (var i = 0; i <= 1000; i += 1) {
        random.push(Math.random());
        zeros.push(0);
    }
    var zeros_lyr = plot.overlay_pipe({}, {
        framesize: 1000
    });
    var rand1_lyr = plot.overlay_pipe({}, {
        framesize: 1000
    });
    var rand2_lyr = plot.overlay_pipe({}, {
        framesize: 1000
    });
    var iter = 1;
    ifixture.interval = window.setInterval(function() {
        plot.push(zeros_lyr, zeros);
        for (var i = 0; i <= 1000; i += 1) {
            random[i] = iter * Math.random();
        }
        plot.push(rand1_lyr, random);
        for (var i = 0; i <= 1000; i += 1) {
            random[i] = -1 * iter * Math.random();
        }
        plot.push(rand2_lyr, random);
        iter += 1;
    }, 500);
});

// By default, rasters have their autolevel set by the
// first 16 raster-lines.
interactiveTest('t2000 file (default autol)', 'Is the plot red below the ~16th line?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);

    var framesize = 128;
    var height = 120;

    var raster = [];
    for (var j = 0; j < height; j += 1) {
        for (var i = 0; i < framesize; i += 1) {
            raster.push(j);
        }
    }

    plot.overlay_array(raster, {
        type: 2000,
        subsize: framesize,
        file_name: "raster"
    });
});

// When autol is used, the raster scaling will dynamically updated per-line
// with autol=1 each line is scaled by itself, so this should render as vertical bars
interactiveTest('t2000 file (default autol)', 'Does the plot render a vertical bars?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        autol: 1
    });
    notEqual(plot, null);

    var framesize = 128;
    var height = 120;

    var raster = [];
    for (var j = 0; j < height; j += 1) {
        for (var i = 0; i < framesize; i += 1) {
            raster.push(j + i);
        }
    }

    plot.overlay_array(raster, {
        type: 2000,
        subsize: framesize,
        file_name: "raster"
    });
});

// this data is rendered where the left side of the plot will be a constant color,
// the right side should start as constant red and then around 110 switch to a gradient
// that gradually go back to all red.  The 'height' of the rainbow grows as autol
// is increased
interactiveTest('t2000 file (default autol)', 'Does the plot render a gradient on the right?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        autol: 5
    });
    notEqual(plot, null);

    var framesize = 128;
    var height = 120;

    var raster = [];
    var val = 0;
    for (var j = 0; j < height; j += 1) {
        for (var i = 0; i < framesize; i += 1) {
            if (i < (framesize) / 2) {
                val = 1;
            } else {
                if (j < 60) {
                    val = 100;
                } else {
                    val = 10;
                }
            }
            raster.push(val);
        }
    }

    plot.overlay_array(raster, {
        type: 2000,
        subsize: framesize,
        file_name: "raster"
    });
});

interactiveTest('t2000 layer2D (default autol)', 'Does the plot correctly autoscale after 100 rows?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var data = [];
    for (var i = 0; i < 16384; i++) {
        data.push(0);
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 16384
    });
    var cnt = 0;
    ifixture.interval = window.setInterval(function() {
        cnt = cnt + 1;
        if (cnt === 100) {
            data = [];
            for (var i = 0; i < 16384; i++) {
                data.push(i);
            }
        }
        plot.push(0, data);
    }, 100);
});
interactiveTest('layer2D (smoothing)', 'Do you see evenly spaced lines?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        smoothing: true
    });
    notEqual(plot, null);
    var data = [];
    for (var i = 0; i < 16384; i++) {
        if ((i % 3 === 0) && (i > 400) && (i < 800)) {
            data.push(400);
        } else if ((i % 3 === 0) && (i > 1200) && (i < 1600)) {
            data.push(800);
        } else {
            data.push(0);
        }
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 16384
    }, null, {
        smoothing: true
    });
    var cnt = 0;
    ifixture.interval = window.setInterval(function() {
        cnt = cnt + 1;
        plot.push(0, data);
    }, 100);
});
interactiveTest('layer2D (average compression)', 'Do you see evenly spaced lines of the same color?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xcmp: 1
    });
    notEqual(plot, null);
    var data = [];
    for (var i = 0; i < 16384; i++) {
        if ((i > 400) && (i < 800)) {
            if (i % 3 === 0) {
                data.push(100);
            } else if (i % 3 === 1) {
                data.push(200);
            } else {
                data.push(0);
            }
        } else if ((i > 1200) && (i < 1600)) {
            if (i % 3 === 0) {
                data.push(50);
            } else if (i % 3 === 1) {
                data.push(250);
            } else {
                data.push(0);
            }
        } else {
            data.push(0);
        }
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 16384
    });
    var cnt = 0;
    ifixture.interval = window.setInterval(function() {
        cnt = cnt + 1;
        plot.push(0, data);
    }, 100);
});
interactiveTest('layer2D (min compression)', 'Do you see two lines of the same color?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xcmp: 2
    });
    notEqual(plot, null);
    var data = [];
    for (var i = 0; i < 16384; i++) {
        if ((i > 400) && (i < 800)) {
            if (i % 3 === 0) {
                data.push(100);
            } else if (i % 3 === 1) {
                data.push(400);
            } else {
                data.push(50);
            }
        } else if ((i > 1200) && (i < 1600)) {
            if (i % 3 === 0) {
                data.push(100);
            } else if (i % 3 === 1) {
                data.push(400);
            } else {
                data.push(50);
            }
        } else {
            data.push(0);
        }
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 16384
    });
    var cnt = 0;
    ifixture.interval = window.setInterval(function() {
        cnt = cnt + 1;
        plot.push(0, data);
    }, 100);
});
interactiveTest('layer2D (max compression)', 'Do you see two lines of the same color?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xcmp: 3
    });
    notEqual(plot, null);
    var data = [];
    for (var i = 0; i < 16384; i++) {
        if ((i > 400) && (i < 800)) {
            if (i % 3 === 0) {
                data.push(100);
            } else if (i % 3 === 1) {
                data.push(400);
            } else {
                data.push(0);
            }
        } else if ((i > 1200) && (i < 1600)) {
            if (i % 3 === 0) {
                data.push(200);
            } else if (i % 3 === 1) {
                data.push(400);
            } else {
                data.push(0);
            }
        } else {
            data.push(0);
        }
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 16384
    });
    var cnt = 0;
    ifixture.interval = window.setInterval(function() {
        cnt = cnt + 1;
        plot.push(0, data);
    }, 100);
});
interactiveTest('layer2D (abs-max compression)', 'Do you see two lines of the same color?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xcmp: 5
    });
    notEqual(plot, null);
    var data = [];
    for (var i = 0; i < 16384; i++) {
        if ((i > 400) && (i < 800)) {
            if (i % 3 === 0) {
                data.push(800);
            } else if (i % 3 === 1) {
                data.push(400);
            } else {
                data.push(0);
            }
        } else if ((i > 1200) && (i < 1600)) {
            if (i % 3 === 0) {
                data.push(-800);
            } else if (i % 3 === 1) {
                data.push(400);
            } else {
                data.push(0);
            }
        } else {
            data.push(0);
        }
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: 16384
    });
    var cnt = 0;
    ifixture.interval = window.setInterval(function() {
        cnt = cnt + 1;
        plot.push(0, data);
    }, 100);
});
interactiveTest('raster (timecode)', 'Do you see a raster that starts at 2014 July 4th for one hour (use "t" to check)?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var framesize = 128;
    var height = 120;
    var ramp = [];
    for (var j = 0; j < height; j += 1) {
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
    }
    plot.overlay_array(ramp, {
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.5,
        yunits: 4,
        timecode: sigplot.m.j1970toj1950(new Date("2014-07-04T00:00:00Z"))
    });
});
interactiveTest('raster (smoothing)', 'Is the following raster smoothed?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        rasterSmoothing: true
    });
    var framesize = 200;
    var height = 100;
    var ramp = [];
    for (var j = 0; j < height; j += 1) {
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
    }
    plot.overlay_array(ramp, {
        type: 2000,
        subsize: framesize,
        file_name: "ramp"
    });
});
interactiveTest('raster (smart-smoothing)', 'Is the following raster smoothed until zoomed?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        rasterSmoothing: 3.0
    });
    var framesize = 200;
    var height = 100;
    var ramp = [];
    for (var j = 0; j < height; j += 1) {
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
    }
    plot.overlay_array(ramp, {
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        yunits: 4,
        timecode: sigplot.m.j1970toj1950(new Date("2014-07-04T00:00:00Z"))
    });
});
interactiveTest('sigplot penny', 'Do you see a raster of a penny', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.overlay_href("dat/penny.prm");
});
interactiveTest('sigplot b&w penny 1', 'Do you see a b&w penny', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xc: 0
    });
    notEqual(plot, null);
    plot.overlay_href("dat/penny.prm");
});
interactiveTest('sigplot b&w penny 2', 'Do you see a b&w penny', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        cmap: "Greyscale"
    });
    notEqual(plot, null);
    plot.overlay_href("dat/penny.prm");
});
interactiveTest('sigplot b&w penny 3', 'Do you see a b&w penny', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.overlay_href("dat/penny.prm");
    plot.change_settings({
        cmap: "Greyscale"
    });
});
interactiveTest('sigplot (custom cmap) penny', 'Do you see a red penny', function() {
    var container = document.getElementById('plot');
    var colors = [{
        pos: 0,
        red: 0,
        green: 0,
        blue: 0
    }, {
        pos: 60,
        red: 50,
        green: 0,
        blue: 0
    }, {
        pos: 100,
        red: 100,
        green: 0,
        blue: 0
    }, {
        pos: 100,
        red: 0,
        green: 0,
        blue: 0
    }, {
        pos: 100,
        red: 0,
        green: 0,
        blue: 0
    }, {
        pos: 100,
        red: 0,
        green: 0,
        blue: 0
    }, {
        pos: 100,
        red: 0,
        green: 0,
        blue: 0
    }];
    var plot = new sigplot.Plot(container, {
        cmap: colors
    });
    notEqual(plot, null);
    plot.overlay_href("dat/penny.prm");
});
interactiveTest('sigplot penny (scaled)', 'Manually scale the Z-axis, does it work (i.e. all blue)?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        zmin: 50,
        zmax: 100
    });
    notEqual(plot, null);
    equal(plot._Gx.zmin, 50);
    equal(plot._Gx.zmax, 100);
    equal(plot._Gx.autoz, 0);
    plot.overlay_href("dat/penny.prm", function() {
        equal(plot._Gx.zmin, 50);
        equal(plot._Gx.zmax, 100);
        plot.change_settings({
            zmin: 25
        });
        equal(plot._Gx.zmin, 25);
        plot.change_settings({
            zmax: 1000
        });
        equal(plot._Gx.zmax, 1000);
    });
});
interactiveTest('scrolling raster', 'Do you see a scrolling raster?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(-1 * (i + 1));
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('scrolling raster two pipes', 'Do you see a scrolling raster with two pipes?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    // typically when you have two raster layers you will want
    // to manually fix both zmin and zmax, otherwise they will
    // both be trying to adjust the zmin/zmax for autoscaling
    plot.change_settings({
        zmin: -128,
        zmax: 0
    });
    var framesize = 128;
    var layer_0 = plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "layer0",
        ydelta: 0.25
    });
    equal(layer_0, 0);
    var layer_1 = plot.overlay_pipe({
        type: 2000,
        subsize: Math.floor(framesize / 3),
        file_name: "layer1",
        ydelta: 0.25
    }, {
        opacity: 0.5
    });
    equal(layer_1, 1);

    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(-1 * (i + 1));
        }
        plot.push(layer_0, ramp);
    }, 500);

    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < Math.floor(framesize / 3); i += 1) {
            ramp.push(-2 * (i + 1));
        }
        plot.push(layer_1, ramp);
    }, 100);
});
interactiveTest('scrolling raster fixed scale', 'Do you see a scrolling raster?', function() {
    var container = document.getElementById('plot');
    // the colors will start around 50 and max out around 100
    var plot = new sigplot.Plot(container, {
        zmin: 50,
        zmax: 100
    });
    notEqual(plot, null);
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('scrolling raster (scaled)', 'Do you see the scaling change correctly?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    });

    var cnt = 0;
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
        cnt = cnt + 1;
        if (cnt === 40) {
            // After 40 lines, change the scaling changes
            plot.change_settings({
                zmin: 50,
                zmax: 100
            });
        }
    }, 100);
});
interactiveTest('raster (small xdelta)', 'Do you see the expected raster?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25,
        xdelta: 0.0009
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('zoomed scrolling raster', 'Do you see a scrolling raster with no render errors?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    });
    plot.zoom({
        x: 95,
        y: 0
    }, {
        x: 106.9,
        y: 10
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('falling raster', 'Do you see a falling raster?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "falling"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('xcmp raster align check', 'Do you see a line centered at 6000?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        xcmp: 3
    });
    notEqual(plot, null);
    var framesize = 9000;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "test"
    }, {});
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            if (i > 5990 && i < 6010) {
                ramp.push(100);
            } else {
                ramp.push(0);
            }
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('falling raster (timecode)', 'Do you see a falling raster that starts at 2014 July 4th?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.5, // two frames a second
        yunits: 4,
        timecode: sigplot.m.j1970toj1950(new Date("2014-07-04T00:00:00Z"))
    }, {
        drawmode: "falling"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 500);
});
interactiveTest('falling raster (timestamp)', 'Do you see a falling raster that starts at 2014 July 4th?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    var now = new Date("2014-07-04T00:00:00Z");
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.5, // two frames a second
        yunits: 4
    }, {
        drawmode: "falling"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp, {
            timestamp: now
        });
        now.setSeconds(now.getSeconds() + 0.5);
    }, 500);
});
interactiveTest('rising raster', 'Do you see a rising raster?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "rising"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('rising raster (timecode)', 'Do you see a rising raster that starts at 2014 July 4th?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.5, // two frames a second
        yunits: 4,
        timecode: sigplot.m.j1970toj1950(new Date("2014-07-04T00:00:00Z"))
    }, {
        drawmode: "rising"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 500);
});
interactiveTest('rising raster (timestamp)', 'Do you see a rising raster that starts at 2014 July 4th?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    var now = new Date("2014-07-04T00:00:00Z");
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.5, // two frames a second
        yunits: 4
    }, {
        drawmode: "rising"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp, {
            timestamp: now
        });
        now.setSeconds(now.getSeconds() + 0.5);
    }, 500);
});
interactiveTest('raster changing xstart', 'Do you see a falling raster that stays the same while the axis shifts?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        xstart: -64,
        ydelta: 0.25
    });
    var xstart = 0;
    var xstart_chng = 16;
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        if (Math.abs(xstart) >= 64) {
            xstart_chng = xstart_chng * -1;
        }
        xstart += xstart_chng;
        plot.push(0, ramp, {
            xstart: xstart
        });
    }, 500);
});
interactiveTest('raster changing LPS', 'Do you see a falling raster redrawn with alternating cursor speed every 10 seconds?', function() {
    var container = document.getElementById('plot');
    var initialLps = 50;
    var alternateLps = 200;
    var lpsVals = [initialLps, alternateLps];
    var currentLps = lpsVals[0];
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        xstart: 0,
        ydelta: 0.25,
        lps: initialLps
    });
    var toggleLps = function() {
        if (plot.get_layer(0).lps === lpsVals[0]) {
            currentLps = lpsVals[1];
        } else {
            currentLps = lpsVals[0];
        }
        plot.deoverlay(0);
        plot.overlay_pipe({
            type: 2000,
            subsize: framesize,
            file_name: "ramp",
            xstart: 0,
            ydelta: 0.25
        });
    };
    strictEqual(plot.get_layer(0).lps, initialLps);
    var count = 0;
    ifixture.interval = window.setInterval(function() {
        count++;
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        if (count % 20 === 0) {
            toggleLps();
        }
        plot.push(0, ramp, {
            lps: currentLps
        });
    }, 500);
});
interactiveTest('raster changing xdelta', 'Do you see a falling raster that stays the same while the axis increases?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    });
    var xdelta = 1;
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        xdelta *= 2;
        plot.push(0, ramp, {
            xdelta: xdelta
        });
    }, 500);
});
interactiveTest('large framesize falling raster', 'Do you see a falling raster?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5,
        all: true
    });
    var framesize = 128000;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('complex data falling raster', 'Do you see a falling raster?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        format: "CF",
        ydelta: 0.25
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
            ramp.push(-1 * (i + 1));
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('complex dots', 'Do you see a cluster of dots near 0,0?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        cmode: 5
    });
    var framesize = 1024;
    plot.overlay_pipe({
        file_name: "constellation",
        format: "CF"
    }, {
        framesize: framesize,
        line: 0,
        radius: 1,
        symbol: 1
    });
    plot.change_settings({
        cmode: 5,
        ymin: -2,
        ymax: 2,
        xmin: -2,
        xmax: 2
    });
    ifixture.interval = window.setInterval(function() {
        var data = [];
        for (var i = 0; i < framesize; i += 1) {
            data.push((Math.random() * 2) - 1);
            data.push((Math.random() * 2) - 1);
        }
        plot.push(0, data);
    }, 100);
});
interactiveTest('rescale', 'Do you see a plot that scales -2 to 2?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var data1 = [];
    for (var i = 0; i < 1024; i++) {
        data1.push(i % 2);
    }
    plot.overlay_array(data1, {
        file_name: "data1"
    });
    var data2 = [];
    for (var i = 0; i < 2048; i++) {
        if (i % 2) {
            data2.push(2);
        } else {
            data2.push(-2);
        }
    }
    plot.overlay_array(data2, {
        file_name: "data2"
    });
    plot.rescale();
});

// Demonstrate that changing the ymin/ymax settings
// will implicitly change the autoy settings
interactiveTest('sigplot layer1d change_settings ymin/ymax ',
    'Do you see a plot scaled from -10 to 50',
    function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual(plot, null);

        var pulse = [];
        for (var i = 0; i <= 1000; i += 1) {
            if (i < 500) {
                pulse.push(0.0);
            } else {
                pulse.push(10.0);
            }
        }

        plot.overlay_array(pulse);
        plot.change_settings({
            ymin: -10,
            ymax: 50
        });
    });

interactiveTest('sigplot layer1d change_settings ymin/ymax ',
    'Do you see a plot scaled from 0.2 to 50',
    function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual(plot, null);

        var pulse = [];
        for (var i = 0; i <= 1000; i += 1) {
            if (i < 500) {
                pulse.push(0.0);
            } else {
                pulse.push(10.0);
            }
        }

        plot.overlay_array(pulse);
        plot.change_settings({
            ymax: 50
        });
    });

interactiveTest('sigplot layer1d change_settings ymin/ymax ',
    'Do you see a plot scaled from -10 to 10.2',
    function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual(plot, null);

        var pulse = [];
        for (var i = 0; i <= 1000; i += 1) {
            if (i < 500) {
                pulse.push(0.0);
            } else {
                pulse.push(10.0);
            }
        }

        plot.overlay_array(pulse);
        plot.change_settings({
            ymin: -10
        });
    });

// Prove that automatic autoy works when setting ymin/ymax
// back to null
interactiveTest('sigplot layer1d change_settings ymin/ymax ',
    'Do you see a plot scaled from 0.2 to 10.2',
    function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual(plot, null);

        var pulse = [];
        for (var i = 0; i <= 1000; i += 1) {
            if (i < 500) {
                pulse.push(0.0);
            } else {
                pulse.push(10.0);
            }
        }

        plot.overlay_array(pulse);
        plot.change_settings({
            ymin: -10,
            ymax: 50
        });
        plot.change_settings({
            ymin: null,
            ymax: null
        });
    });
interactiveTest('sigplot layer1d framesize change',
    'Do you see a plots where the x-axis grows in size and the triangle stays centered?',
    function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual(plot, null);

        var current_framesize = 100;
        plot.overlay_pipe({
            type: 1000
        }, {
            framesize: current_framesize
        });

        ifixture.interval = window.setInterval(function() {
            var data = [];
            for (var i = 0; i < current_framesize; i += 1) {
                if (i < current_framesize / 2) {
                    data.push(i);
                } else {
                    data.push(current_framesize - i);
                }
            }
            // change the framesize
            plot.change_settings({
                framesize: current_framesize
            });
            // push the data
            plot.push(0, data);
            // increate the framesize for the next pass
            current_framesize = current_framesize + 100;
        }, 2000);
    });

interactiveTest('LO ymin/ymax', 'Do you see a plot that scales -100 to -20?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        ymin: 1e-10,
        ymax: 1e-2,
        cmode: "LO"
    });
    notEqual(plot, null);
    var data1 = [];
    for (var i = 0; i < 1024; i++) {
        data1.push(i % 2);
    }
    plot.overlay_array(data1, {
        file_name: "data1"
    });
    var data2 = [];
    for (var i = 0; i < 2048; i++) {
        if (i % 2) {
            data2.push(-60);
        } else {
            data2.push(-40);
        }
    }
    plot.overlay_array(data2, {
        file_name: "data2"
    });
});
interactiveTest('D1 ymin/ymax', 'Do you see a plot that scales -100 to -20?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        ymin: -100,
        ymax: -20,
        cmode: "D1"
    });
    notEqual(plot, null);
    var data1 = [];
    for (var i = 0; i < 1024; i++) {
        data1.push(i % 2);
    }
    plot.overlay_array(data1, {
        file_name: "data1"
    });
    var data2 = [];
    for (var i = 0; i < 2048; i++) {
        if (i % 2) {
            data2.push(-60);
        } else {
            data2.push(-40);
        }
    }
    plot.overlay_array(data2, {
        file_name: "data2"
    });
});
interactiveTest('annotations', 'Do you see a text annotation at the correct locations, fonts and colors?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    annotations.add_annotation({
        x: 0,
        y: 0,
        value: "0,0 (red)",
        color: "red",
        highlight_color: "green",
        popup: "a"
    });
    annotations.add_annotation({
        x: 0.5,
        y: 0.5,
        value: "0.5,0.5 (small)",
        font: "15px monospace",
        popup: "b"
    });
    annotations.add_annotation({
        x: -0.5,
        y: -0.5,
        value: "-0.5,-0.5",
        popup: "c",
        onclick: function() {
            alert("you clicked me");
        }
    });
    annotations.add_annotation({
        x: -0.5,
        y: 0.5,
        value: "-0.5,0.5",
        popup: "d",
        textBaseline: "middle",
        textAlign: "center"
    });
    annotations.add_annotation({
        x: 0.5,
        y: -0.5,
        value: "0.5,-0.5 (small green)",
        color: "green",
        font: "15px monospace",
        popup: "e",
        popupTextColor: "red"
    });
});
interactiveTest('annotations png', 'Do you see a image annotation centered at 0,0 that has a popup on hover?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    var img = new Image(); // Create new img element
    img.onload = function() {
        annotations.add_annotation({
            x: 0,
            y: 0,
            value: img,
            popup: "Hello World"
        });
    };
    img.src = 'dat/info.png';
});
interactiveTest('annotations popup', 'Do you see an popup when you hover over the annotation?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    annotations.add_annotation({
        x: -0.25,
        y: 0.25,
        value: "Test Popup",
        popup: "This is metadata"
    });
});
interactiveTest('annotations custom popup', 'Do you see an popup when you hover over the annotation?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var tt;
    plot.addListener("annotationhighlight", function(evt) {
        // you could use tipped.js, opentip, bootstrap, etc. here
        // this is just a simple test example not intended to be actually used
        if (evt.state && !tt) {
            tt = document.createElement("div");
            tt.setAttribute("id", "test-tooltip");
            tt.style.display = "block";
            tt.style.position = "relative";
            tt.style.top = (evt.y + 5) + "px";
            tt.style.left = (evt.x + 5) + "px";
            tt.style.width = "100px";
            tt.style.height = "50px";
            tt.style.opacity = 0.4;
            tt.style.background = "red";
            container.appendChild(tt);
        } else if (!evt.state && tt) {
            container.removeChild(tt);
            tt = null;
        }
    });
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    annotations.add_annotation({
        x: 0,
        y: 0,
        value: "Test Custom Popup"
    });
});
interactiveTest('annotations shift', 'Do you see a text annotation that remains at the correct locations while the axis shifts?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    annotations.add_annotation({
        x: 0,
        y: 50,
        value: "0,50"
    });
    annotations.add_annotation({
        x: 50,
        y: 60,
        value: "50,60"
    });
    annotations.add_annotation({
        x: -50,
        y: 60,
        value: "-50,60"
    });
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        xstart: -64,
        ydelta: 0.25
    });
    var xstart = 0;
    var xstart_chng = 16;
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        if (Math.abs(xstart) >= 64) {
            xstart_chng = xstart_chng * -1;
        }
        xstart += xstart_chng;
        plot.push(0, ramp, {
            xstart: xstart
        });
    }, 500);
});
interactiveTest('annotation falling raster', 'Do you see annotations that scroll with the data?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var img = new Image(); // Create new img element
    img.src = 'dat/info.png';
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "falling"
    });
    var row = 0;
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        row += 1;
        if (row % 64 === 0) {
            var y = (row * 0.25);
            annotations.add_annotation({
                x: 64,
                y: y,
                value: "64," + y,
                popup: "test"
            });
        } else if (row % 100 === 0) {
            var y = (row * 0.25);
            annotations.add_annotation({
                x: 32,
                y: y,
                value: img,
                popup: "32," + y
            });
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('annotation rising raster', 'Do you see annotations that scroll with the data?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var img = new Image(); // Create new img element
    img.src = 'dat/info.png';
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "rising"
    });
    var row = 0;
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        row += 1;
        if (row % 64 === 0) {
            var y = (row * 0.25);
            annotations.add_annotation({
                x: 64,
                y: y,
                value: "64," + y,
                popup: "test"
            });
        } else if (row % 100 === 0) {
            var y = (row * 0.25);
            annotations.add_annotation({
                x: 32,
                y: y,
                value: img,
                popup: "32," + y
            });
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('x-fixed annotation rising raster', 'Do you see annotations that do not scroll with the data?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var img = new Image(); // Create new img element
    img.src = 'dat/info.png';
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "rising"
    });
    annotations.add_annotation({
        x: 32,
        pxl_y: 50,
        value: "A",
        popup: "I should be at X=32 always"
    });
    annotations.add_annotation({
        x: 96,
        pxl_y: 200,
        value: "B",
        popup: "I should be at X=96 always"
    });
    var row = 0;
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('lots of annotations', 'Does the plot still seem smooth?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var img = new Image(); // Create new img element
    img.src = 'dat/info.png';
    var annotations = new sigplot_plugins.AnnotationPlugin();
    plot.add_plugin(annotations);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "rising"
    });
    for (var j = 0; j < 1000; j += 1) {
        var x = Math.random() * 128;
        var y = (Math.random() * (plot._Mx.b - plot._Mx.t)) + plot._Mx.t;
        annotations.add_annotation({
            x: x,
            pxl_y: y,
            value: j.toString(),
            popup: "Test"
        });
    }
    var row = 0;
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('vertical accordion', 'Do you see a vertical accordion that stays centered at zero as the axis shifts', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var framesize = 500;
    var zeros = [];
    for (var i = 0; i < framesize; i += 1) {
        zeros.push(0);
    }
    var accordion = new sigplot_plugins.AccordionPlugin({
        draw_center_line: true,
        shade_area: true,
        draw_edge_lines: true,
        direction: "vertical",
        edge_line_style: {
            strokeStyle: "#FF2400"
        }
    });
    plot.overlay_array(zeros, {
        type: 2000,
        subsize: framesize,
        file_name: "zeros",
        xstart: -250,
        xdelta: 1
    }, {
        layerType: sigplot.Layer1D
    });
    plot.add_plugin(accordion, 1);
    accordion.set_center(0);
    accordion.set_width(50);
    var xstart = -250;
    var xstart_chng = 25;
    ifixture.interval = window.setInterval(function() {
        if (xstart < -450 || xstart >= -25) {
            xstart_chng = xstart_chng * -1;
        }
        xstart += xstart_chng;
        plot.reload(0, zeros, {
            xstart: xstart
        });
    }, 500);
});
interactiveTest('horizontal accordion', 'Do you see a horizontal accordion at zero and each multiple of 80, scrolling with the data?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        nogrid: true
    });
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: 'rising'
    });
    var acc;
    var accordion = function(y) {
        acc = new sigplot_plugins.AccordionPlugin({
            draw_center_line: true,
            shade_area: true,
            draw_edge_lines: true,
            direction: "horizontal",
            edge_line_style: {
                strokeStyle: "#FF2400"
            }
        });
        acc.set_center(y);
        acc.set_width(0.25 * 50);
        return acc;
    };
    plot.add_plugin(accordion(0), 1);
    var row = 0;
    ifixture.interval = window.setInterval(function() {
        var zeros = [];
        for (var i = 0; i < framesize; i += 1) {
            zeros.push(0);
        }
        row += 1;
        if (row % (80 / 0.25) === 0) {
            var y = (row * 0.25);
            plot.remove_plugin(acc);
            plot.deoverlay(1);
            plot.add_plugin(accordion(y), 1);
        }
        plot.push(0, zeros);
    }, 100);
});
interactiveTest('vertical accordion relative placement', "Do you see a vertical accordion that doesn't move as the axis shifts?", function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_array(null, {
        type: 2000,
        subsize: framesize,
        file_name: "zeros",
        xstart: -64
    }, {
        layerType: sigplot.Layer1D
    });
    var accordion = new sigplot_plugins.AccordionPlugin({
        mode: "relative",
        draw_center_line: true,
        shade_area: true,
        draw_edge_lines: true,
        direction: "vertical",
        edge_line_style: {
            strokeStyle: "#FF2400"
        }
    });
    plot.add_plugin(accordion, 1);
    accordion.set_center(0.5);
    accordion.set_width(0.1);
    var xstart = 0;
    var xstart_chng = 16;
    ifixture.interval = window.setInterval(function() {
        var zeros = [];
        for (var i = 0; i < framesize; i += 1) {
            zeros.push(0);
        }
        if (Math.abs(xstart) >= 64) {
            xstart_chng = xstart_chng * -1;
        }
        xstart += xstart_chng;
        plot.reload(0, zeros, {
            xstart: xstart
        });
    }, 500);
});
interactiveTest('horizontal accordion relative placement', "Do you see a horizontal accordion that doesn't move with the data?", function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        nogrid: true
    });
    notEqual(plot, null);
    var framesize = 128;
    plot.change_settings({
        autol: 5
    });
    var zeros = [];
    for (var i = 0; i < framesize; i += 1) {
        zeros.push(0);
    }
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "zeros"
    }, {
        drawmode: 'rising'
    });
    var accordion = new sigplot_plugins.AccordionPlugin({
        mode: "relative",
        draw_center_line: true,
        shade_area: true,
        draw_edge_lines: true,
        direction: "horizontal",
        edge_line_style: {
            strokeStyle: "#FF2400"
        }
    });
    plot.add_plugin(accordion, 1);
    accordion.set_center(0.5);
    accordion.set_width(0.1);
    var count = 0;
    ifixture.interval = window.setInterval(function() {
        plot.push(0, zeros);
    }, 100);
});
interactiveTest('horizontal and vertical accordions absolute placement zoom', 'Do the accordions stay at the same Real World Coordinates when you zoom?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var zeros = [];
    for (var i = 0; i <= 1000; i++) {
        zeros.push(0);
    }
    plot.overlay_array(zeros, {});
    var vert_accordion = new sigplot_plugins.AccordionPlugin({
        mode: "absolute",
        draw_center_line: true,
        shade_area: true,
        draw_edge_lines: true,
        direction: "vertical",
        edge_line_style: {
            strokeStyle: "#FF2400"
        }
    });
    var horiz_accordion = new sigplot_plugins.AccordionPlugin({
        mode: "absolute",
        draw_center_line: true,
        shade_area: true,
        draw_edge_lines: true,
        direction: "horizontal",
        edge_line_style: {
            strokeStyle: "#FF2400"
        }
    });
    plot.add_plugin(vert_accordion, 1);
    plot.add_plugin(horiz_accordion, 2);
    vert_accordion.set_center(500);
    vert_accordion.set_width(100);
    horiz_accordion.set_center(0);
    horiz_accordion.set_width(0.5);
});
interactiveTest('horizontal and vertical accordions relative placement zoom', 'Do the accordions stay at the same pixel location when you zoom?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var zeros = [];
    for (var i = 0; i <= 1000; i++) {
        zeros.push(0);
    }
    plot.overlay_array(zeros, {});
    var vert_accordion = new sigplot_plugins.AccordionPlugin({
        mode: "relative",
        draw_center_line: true,
        shade_area: true,
        draw_edge_lines: true,
        direction: "vertical",
        edge_line_style: {
            strokeStyle: "#FF2400"
        }
    });
    var horiz_accordion = new sigplot_plugins.AccordionPlugin({
        mode: "relative",
        draw_center_line: true,
        shade_area: true,
        draw_edge_lines: true,
        direction: "horizontal",
        edge_line_style: {
            strokeStyle: "#FF2400"
        }
    });
    plot.add_plugin(vert_accordion, 1);
    plot.add_plugin(horiz_accordion, 2);
    vert_accordion.set_center(0.5);
    vert_accordion.set_width(0.1);
    horiz_accordion.set_center(0.5);
    horiz_accordion.set_width(0.1);
});
interactiveTest('boxes', 'Do you see a boxes?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var boxes = new sigplot_plugins.BoxesPlugin();
    plot.add_plugin(boxes);
    boxes.add_box({
        x: 0,
        y: 0,
        w: 0.1,
        h: 0.1,
        text: "0,0"
    });
    boxes.add_box({
        x: 0.5,
        y: 0.5,
        w: 0.1,
        h: 0.1,
        text: "0.5,0.5",
        fill: true
    });
    boxes.add_box({
        x: -0.5,
        y: -0.5,
        w: 0.1,
        h: 0.1,
        text: "-0.5,-0.5",
        fillStyle: "green"
    });
    boxes.add_box({
        x: 0.5,
        y: -0.5,
        w: 0.1,
        h: 0.1,
        text: "0.5,-0.5",
        fillStyle: "red",
        alpha: 0.25
    });
});
interactiveTest('clear boxes', 'Do you see one box?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var boxes = new sigplot_plugins.BoxesPlugin();
    plot.add_plugin(boxes);
    boxes.add_box({
        x: 0,
        y: 0,
        w: 0.1,
        h: 0.1,
        text: "I should be gone soon..."
    });
    window.setTimeout(function() {
        boxes.clear_boxes();
        boxes.add_box({
            x: 0.5,
            y: 0.5,
            w: 0.1,
            h: 0.1,
            text: "You should see me"
        });
    }, 1000);
});
interactiveTest('slider', 'Do you see a sliders?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var slider1 = new sigplot_plugins.SliderPlugin({
        name: "Slider 1"
    });
    plot.add_plugin(slider1);
    var slider2 = new sigplot_plugins.SliderPlugin({
        name: "Slider 2"
    });
    plot.add_plugin(slider2);
    slider1.pair(slider2);
    slider2.pair(slider1);
    slider1.set_position(0.5);
    slider2.set_position(-0.5);
    // slidertag events happen whenever a slider is moved
    // programatically or by the user
    plot.addListener("slidertag", function(evt) {});
    // sliderdrag events happen only when a slider is moved by
    // the user
    plot.addListener("sliderdrag", function(evt) {});
});
interactiveTest('right-click zoom', 'Can you zoom with right-click and mark with left-click?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        rightclick_rubberbox_action: "zoom",
        rubberbox_action: null,
        always_show_marker: true
    });
    notEqual(plot, null);
});
interactiveTest('right-click select', 'Can you select with right-click, zoom with left-click, and mark with left-click?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        rightclick_rubberbox_action: "select",
        rightclick_rubberbox_mode: "horizontal",
        rubberbox_action: "zoom",
        always_show_marker: true
    });
    notEqual(plot, null);
});
interactiveTest('zoom-keep-marker', 'Does zooming not change the marker, but shows box size in the specs area?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        always_show_marker: true
    });
    notEqual(plot, null);
});
interactiveTest('custom color line', 'Do you see an orange line?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1000; i++) {
        ramp.push(i);
    }
    var layer = plot.overlay_array(ramp, {
        file_name: "ramp"
    }, {
        color: "orange"
    });
});
interactiveTest('custom color line (change settings)', 'Do you see an orange line?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1000; i++) {
        ramp.push(i);
    }
    var layer = plot.overlay_array(ramp, {
        file_name: "ramp"
    });
    plot.get_layer(layer).color = "orange";
    plot.refresh();
});
interactiveTest('overlapping_highlights', 'Do you see an unbroken yellow line with red on each end?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1000; i++) {
        ramp.push(i);
    }
    var layer = plot.overlay_array(ramp, {
        file_name: "ramp"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 400,
        xend: 600,
        color: "red"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 600,
        xend: 800,
        color: "red"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 450,
        xend: 550,
        color: "yellow"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 550,
        xend: 650,
        color: "yellow"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 650,
        xend: 750,
        color: "yellow"
    });
});
interactiveTest('overlapping_highlights', 'Do you see an unbroken red line?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1000; i++) {
        ramp.push(i);
    }
    var layer = plot.overlay_array(ramp, {
        file_name: "ramp"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 450,
        xend: 550,
        color: "yellow"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 550,
        xend: 650,
        color: "yellow"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 650,
        xend: 750,
        color: "yellow"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 400,
        xend: 600,
        color: "red"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 600,
        xend: 800,
        color: "red"
    });
});
interactiveTest('overlapping_highlights', 'Do you see evenly spaced red/yellow highlights?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 1000; i++) {
        ramp.push(i);
    }
    var layer = plot.overlay_array(ramp, {
        file_name: "ramp"
    });
    // Create various overlap conditions
    plot.get_layer(layer).add_highlight({
        xstart: 375,
        xend: 450,
        color: "yellow"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 450,
        xend: 537,
        color: "yellow"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 537,
        xend: 700,
        color: "yellow"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 400,
        xend: 425,
        color: "red"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 450,
        xend: 475,
        color: "red"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 500,
        xend: 525,
        color: "red"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 550,
        xend: 575,
        color: "red"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 600,
        xend: 625,
        color: "red"
    });
    plot.get_layer(layer).add_highlight({
        xstart: 650,
        xend: 675,
        color: "red"
    });
});
interactiveTest('p-cuts: side and bottom plots', 'Do you see updating data when the mouse is moved in the x and y plots', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    plot.overlay_href("dat/penny.prm");
    plot.change_settings({
        p_cuts: true
    });
});
interactiveTest('p-cuts: side and bottom plots turn on and off', 'Do the plots toggle on "p" key regardless of mouse postion?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    plot.overlay_href("dat/penny.prm");
    plot.change_settings({
        p_cuts: true
    });
});
interactiveTest('p-cuts: x-cut', 'Does the x-plot show on "x" key regardless of mouse position and update when clicked open in different spot?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    plot.overlay_href("dat/penny.prm");
    plot.change_settings({
        p_cuts: true
    });
});
interactiveTest('p-cuts: y-cut', 'Does the y-plot show on "y" key regardless of mouse position and update when clicked open in different spot?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    plot.overlay_href("dat/penny.prm");
    plot.change_settings({
        p_cuts: true
    });
});
interactiveTest('p-cuts: turn on and off', 'Does the feature toggle with "p" key? Does everything resize correctly?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    plot.overlay_href("dat/penny.prm");
});
interactiveTest('p-cuts: x-cut and y-cut without p-cuts display', 'Do the x and y plot display when clicked without the smaller plots?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    plot.overlay_href("dat/penny.prm");
    //console.log(plot._Gx);
});
interactiveTest('falling raster with p-cuts', 'Do you see a falling raster with p-cut functionality?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5,
        enabled_streaming_pcut: true
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "falling"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('rising raster with p-cuts', 'Do you see a rising raster with p-cut functionality?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5,
        enabled_streaming_pcut: true
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "rising"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('scrolling raster with p-cuts', 'Do you see a scrolling raster with p-cut functionality?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5,
        enabled_streaming_pcut: true
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    }, {
        drawmode: "scrolling"
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(i + 1);
        }
        plot.push(0, ramp);
    }, 100);
});
interactiveTest('radius menu', 'Do you see a working radius option in the traces menu?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    var ramp = [];
    for (var i = 0; i < 25; i++) {
        ramp.push(i);
    }
    var layer = plot.overlay_array(ramp, {
        file_name: "ramp"
    }, {
        symbol: 3,
        line: 0
    });
});
interactiveTest('vertical and horizontal lines', 'Is there a horizontal and vertical line on every point?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, null, {
        name: "x",
        symbol: 0,
        line: 4
    });
});
interactiveTest('colorbar in legend', 'does the colorbar show in the legend?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    plot.overlay_href("dat/penny.prm");
});
interactiveTest('Legend', 'Are the correct functions modified from the legend??', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    var ramp = [];
    var ramp2 = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
        var contra = 20 - i;
        ramp2.push(contra);
    }
    plot.overlay_array(ramp, null, {
        name: "up",
        symbol: 0,
        line: 3
    });
    plot.overlay_array(ramp2, null, {
        name: "down",
        symbol: 0,
        line: 3
    });
});
interactiveTest('raster drawmode change (scrolling -> rising -> scrolling)', 'Do you see the scrolling line?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(-1 * (i + 1));
        }
        plot.push(0, ramp);
    }, 100);
    setTimeout(function() {
        plot.change_settings({
            drawmode: "rising"
        });
        setTimeout(function() {
            plot.change_settings({
                drawmode: "scrolling"
            });
        }, 5000);
    }, 5000);
});
interactiveTest('raster drawmode change (scrolling -> falling -> scrolling)', 'Do you see the scrolling line?', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    notEqual(plot, null);
    plot.change_settings({
        autol: 5
    });
    var framesize = 128;
    plot.overlay_pipe({
        type: 2000,
        subsize: framesize,
        file_name: "ramp",
        ydelta: 0.25
    });
    ifixture.interval = window.setInterval(function() {
        var ramp = [];
        for (var i = 0; i < framesize; i += 1) {
            ramp.push(-1 * (i + 1));
        }
        plot.push(0, ramp);
    }, 100);
    setTimeout(function() {
        plot.change_settings({
            drawmode: "falling"
        });
        setTimeout(function() {
            plot.change_settings({
                drawmode: "scrolling"
            });
        }, 5000);
    }, 5000);
});
interactiveTest('change_settings', 'does the plot show a range 200-2200', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        autohide_panbars: false,
        cmode: 'LO',
        xcnt: 'continuous'
    });
    notEqual(plot, null);

    var hcb = {
        xunits: 3,
        yunits: 26,
        size: 1024,
        xdelta: 20
    };
    var layerOptions = {
        framesize: 1024
    };

    plot.overlay_pipe(hcb, layerOptions);

    var ramp = [];
    for (var i = 0; i < 1024; i += 1) {
        ramp.push(i + 1);
    }
    // do a syncronous push so we can make some assertions
    plot.push(0, ramp, null, true);
    strictEqual(plot._Mx.stk[0].xmin, 0);
    strictEqual(plot._Mx.stk[0].xmax, 20460);

    strictEqual(plot._Gx.lyr[0].xmin, 0);
    strictEqual(plot._Gx.lyr[0].xmax, 20460);

    plot.change_settings({
        xmin: 200,
        xmax: 2200
    });
    strictEqual(plot._Mx.stk[0].xmin, 200);
    strictEqual(plot._Mx.stk[0].xmax, 2200);

    strictEqual(plot._Gx.lyr[0].xmin, 200);
    strictEqual(plot._Gx.lyr[0].xmax, 2200);

    // do a syncronous refresh
    plot._refresh();
    strictEqual(plot._Mx.stk[0].xmin, 200);
    strictEqual(plot._Mx.stk[0].xmax, 2200);

    // and another push
    plot.push(0, ramp, null, true);
    strictEqual(plot._Mx.stk[0].xmin, 200);
    strictEqual(plot._Mx.stk[0].xmax, 2200);

    strictEqual(plot._Gx.lyr[0].xmin, 200);
    strictEqual(plot._Gx.lyr[0].xmax, 2200);
});
interactiveTest('headermod', 'does the plot show a range 200-2200', function() {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        autohide_panbars: false,
        cmode: 'LO',
        xcnt: 'continuous'
    });
    notEqual(plot, null);

    var hcb = {
        xunits: 3,
        yunits: 26,
        size: 1024,
        xdelta: 20
    };
    var layerOptions = {
        framesize: 1024
    };

    plot.overlay_pipe(hcb, layerOptions);

    var ramp = [];
    for (var i = 0; i < 1024; i += 1) {
        ramp.push(i + 1);
    }
    // do a syncronous push so we can make some assertions
    plot.push(0, ramp, null, true);
    strictEqual(plot._Mx.stk[0].xmin, 0);
    strictEqual(plot._Mx.stk[0].xmax, 20460);

    strictEqual(plot._Gx.lyr[0].xmin, 0);
    strictEqual(plot._Gx.lyr[0].xmax, 20460);

    plot.hdrmod({
        xmin: 200,
        xmax: 2200
    });
    strictEqual(plot._Mx.stk[0].xmin, 200);
    strictEqual(plot._Mx.stk[0].xmax, 2200);

    strictEqual(plot._Gx.lyr[0].xmin, 200);
    strictEqual(plot._Gx.lyr[0].xmax, 2200);

    // do a syncronous refresh
    plot._refresh();
    strictEqual(plot._Mx.stk[0].xmin, 200);
    strictEqual(plot._Mx.stk[0].xmax, 2200);

    // and another push
    plot.push(0, ramp, null, true);
    strictEqual(plot._Mx.stk[0].xmin, 200);
    strictEqual(plot._Mx.stk[0].xmax, 2200);

    strictEqual(plot._Gx.lyr[0].xmin, 200);
    strictEqual(plot._Gx.lyr[0].xmax, 2200);
});
