/**
 * @license
 * File: tests.js
 *
 * Copyright (c) 2012-2014, Michael Ihde, All rights reserved.
 * Copyright (c) 2012-2014, Axios Inc., All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation; either version 3.0 of the License, or
 * (at your option) any later version. This library is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE. See the GNU Lesser General Public License for more details. You should have received a copy of the
 * GNU Lesser General Public License along with this library.
 */

var fixture = document.getElementById("qunit-fixture");
var ifixture = document.getElementById("interactive-fixture");

function interactiveTest(testName, msg, callback) {
    if ( !ifixture ) return;

    var wrapped_callback = function() {
	callback();

        var toolbar = document.getElementById("qunit-testrunner-toolbar");
        var question = document.createElement("div")
        toolbar.appendChild(question);
        question.innerHTML =
            "<span>" + msg + "?</span>" +
            "<input id='askOkYes' type='button' value='Yes'></input>" +
            "<input id='askOkNo' type='button' value='No'></input>";

        var askOkYes = document.getElementById("askOkYes");
        askOkYes.onclick = function () {
            question.innerHTML = "";
            QUnit.push(true,true,true,msg);
            QUnit.start();
        };
        var askOkNo = document.getElementById("askOkNo");
        askOkNo.onclick = function () {
            question.innerHTML = "";
            QUnit.push(false,false,true,msg);
            QUnit.start();
        };
    };
    QUnit.test( testName, null, wrapped_callback, true);
}

QUnit.module('m', {
    setup: function() {
    },
    teardown: function() {
    }
});

test('m sec2tod test', function() {
	/* Test #1 */
	var secs = 43200;
	equal(m.sec2tod(secs),"12:00:00:00");
	/* Test #2 */
	var secs = 86399;
	equal(m.sec2tod(secs),"23:59:59:00");
	/* Test #3 */
	var secs = 86400;
	equal(m.sec2tod(secs),"1::00:00:00:00");
	/* Test #4 */
	var secs = 86401;
	equal(m.sec2tod(secs),"1::00:00:01:00");
	/* Test #5 */
	var secs = 86400+43200;
	equal(m.sec2tod(secs),"1::12:00:00:00");
	/* Test #6 */
	var secs = 31535999;
	equal(m.sec2tod(secs),"364::23:59:59:00");
	/* Test #7 */
	var secs = 31536000;
	equal(m.sec2tod(secs),"1951:00:01::00:00:00:00");
	/* Test #8 */
	var secs = -31535999;
	equal(m.sec2tod(secs),"-364::23:59:59:00");
	/* Test #9 */
	var secs = -31536000;
	equal(m.sec2tod(secs),"1949:00:01::00:00:00:00");
	/* Test #10 */
	var secs = -31536001;
	equal(m.sec2tod(secs),"1948:11:31::23:59:59:00");

});

QUnit.module('mx', {
    setup: function() {
    },
    teardown: function() {
    }
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
          xscl: 1/100,
          yscl: 1/100,
          x1: 0,
          y1: 0,
          x2: 200,
          y2: 200,
              
        }]
    };
    
    var result = mx.real_to_pixel(Mx, 0, 0);
    equal( result.x, 100 );
    equal( result.y, 100 );
    equal( result.clipped, false );
    
    var result = mx.real_to_pixel(Mx, 1, 1);
    equal( result.x, 200 );
    equal( result.y, 0 );
    equal( result.clipped, false );
    
    var result = mx.real_to_pixel(Mx, -1, -1);
    equal( result.x, 0 );
    equal( result.y, 200 );
    equal( result.clipped, false );
    
    var result = mx.real_to_pixel(Mx, 1.5, 1);
    equal( result.x, 250 );
    equal( result.y, 0 );
    equal( result.clipped, true );
    
    var result = mx.real_to_pixel(Mx, -1, -1.5);
    equal( result.x, 0 );
    equal( result.y, 250 );
    equal( result.clipped, true );
    
    var result = mx.real_to_pixel(Mx, 1.5, 1, true);
    equal( result.x, 200 );
    equal( result.y, 0 );
    equal( result.clipped, true );
    
    var result = mx.real_to_pixel(Mx, -1, -1.5, true);
    equal( result.x, 0 );
    equal( result.y, 200 );
    equal( result.clipped, true );

});

QUnit.module('bluefile', {
    setup: function() {
    },
    teardown: function() {
    }
});

asyncTest('int data', function() {
        var bfr = new BlueFileReader();
        bfr.read_http("dat/ramp.tmp", function (hdr) {
                //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
                equal( hdr.buf.byteLength, 2560, "buf correct size");

                //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
                equal( hdr.dview.length, 1024, "dview correct size");

                strictEqual( hdr.file_name, "ramp.tmp", "correct file name");

                strictEqual( hdr.version, "BLUE", "correct version");
                strictEqual( hdr.headrep, "EEEI", "correct header rep");
                strictEqual( hdr.datarep, "EEEI", "correct data rep");

                strictEqual( hdr.timecode, 0, "correct timecode");

                strictEqual( hdr.type, 1000, "correct type");
                strictEqual( hdr.class, 1, "correct class");
                strictEqual( hdr.format, "SI", "correct format");

                strictEqual( hdr.spa, 1, "correct spa");
                strictEqual( hdr.bps, 2, "correct bps");
                strictEqual( hdr.bpa, 2, "correct bpa");
                strictEqual( hdr.ape, 1, "correct ape");
                strictEqual( hdr.bpe, 2, "correct bpe");

                strictEqual( hdr.size, 1024, "correct size");

                strictEqual( hdr.xstart, 0.0, "correct xstart");
                strictEqual( hdr.xdelta, 1.0, "correct xdelta");
                strictEqual( hdr.xunits, 1, "correct xunits");
                strictEqual( hdr.subsize, 1, "correct subsize");

                equal( hdr.ystart, undefined);
                equal( hdr.yelta, undefined);
                equal( hdr.yunits, undefined);


                strictEqual( hdr.data_start, 512.0, "correct data_start");
                strictEqual( hdr.data_size, 2048, "correct data_size");

                equal( hdr.dview[0], 0);

                equal( hdr.dview[1], 1);
                equal( hdr.dview[2], 2);
                equal( hdr.dview[1021], 1021);
                equal( hdr.dview[1022], 1022);
                equal( hdr.dview[1023], 1023);

                start();
        });
});

asyncTest('double data', function() {
        var bfr = new BlueFileReader();
        bfr.read_http("dat/sin.tmp", function (hdr) {
                //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
                equal( hdr.buf.byteLength, 33280, "buf correct size");

                //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
                equal( hdr.dview.length, 4096, "dview correct size");

                strictEqual( hdr.file_name, "sin.tmp", "correct file name");

                strictEqual( hdr.version, "BLUE", "correct version");
                strictEqual( hdr.headrep, "EEEI", "correct header rep");
                strictEqual( hdr.datarep, "EEEI", "correct data rep");

                strictEqual( hdr.timecode, 0, "correct timecode");

                strictEqual( hdr.type, 1000, "correct type");
                strictEqual( hdr.class, 1, "correct class");
                strictEqual( hdr.format, "SD", "correct format");

                strictEqual( hdr.spa, 1, "correct spa");
                strictEqual( hdr.bps, 8, "correct bps");
                strictEqual( hdr.bpa, 8, "correct bpa");
                strictEqual( hdr.ape, 1, "correct ape");
                strictEqual( hdr.bpe, 8, "correct bpe");

                strictEqual( hdr.size, 4096, "correct size");

                strictEqual( hdr.xstart, 0.0, "correct xstart");
                strictEqual( hdr.xdelta, 1.0, "correct xdelta");
                strictEqual( hdr.xunits, 0, "correct xunits");
                strictEqual( hdr.subsize, 1, "correct subsize");

                equal( hdr.ystart, undefined);
                equal( hdr.yelta, undefined);
                equal( hdr.yunits, undefined);


                strictEqual( hdr.data_start, 512.0, "correct data_start");
                strictEqual( hdr.data_size, 32768, "correct data_size");

                equal( hdr.dview[0], 1);
                equal( hdr.dview[1], 0.9980267284282716);
                equal( hdr.dview[2], 0.9921147013144778);
                equal( hdr.dview[4093], 0.9048270524660175);
                equal( hdr.dview[4094], 0.9297764858882493);
                equal( hdr.dview[4095], 0.9510565162951516);

                start();
        });
});

asyncTest('complex float data', function() {
        var bfr = new BlueFileReader();
        bfr.read_http("dat/pulse_cx.tmp", function (hdr) {
                //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
                equal( hdr.buf.byteLength, 131584, "buf correct size");

                //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
                equal( hdr.dview.length, 400, "dview correct size");

                strictEqual( hdr.file_name, "pulse_cx.tmp", "correct file name");

                strictEqual( hdr.version, "BLUE", "correct version");
                strictEqual( hdr.headrep, "EEEI", "correct header rep");
                strictEqual( hdr.datarep, "EEEI", "correct data rep");

                strictEqual( hdr.timecode, 0, "correct timecode");

                strictEqual( hdr.type, 1000, "correct type");
                strictEqual( hdr.class, 1, "correct class");
                strictEqual( hdr.format, "CF", "correct format");

                strictEqual( hdr.spa, 2, "correct spa");
                strictEqual( hdr.bps, 4, "correct bps");
                strictEqual( hdr.bpa, 8, "correct bpa");
                strictEqual( hdr.ape, 1, "correct ape");
                strictEqual( hdr.bpe, 8, "correct bpe");

                strictEqual( hdr.size, 200, "correct size");

                strictEqual( hdr.xstart, 0.0, "correct xstart");
                strictEqual( hdr.xdelta, 1.0, "correct xdelta");
                strictEqual( hdr.xunits, 1, "correct xunits");
                strictEqual( hdr.subsize, 1, "correct subsize");

                equal( hdr.ystart, undefined);
                equal( hdr.yelta, undefined);
                equal( hdr.yunits, undefined);


                strictEqual( hdr.data_start, 512.0, "correct data_start");
                strictEqual( hdr.data_size, 1600, "correct data_size");

                start();
        });
});

test('create type1000', function() {
        //var hcb = m.initialize([1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0], {file_name :"newFile"});
        var rdbuf = new ArrayBuffer(64);
        var rdview = new Float32Array(rdbuf);
        var hcb = m.initialize(rdview, {file_name :"newFile"});
        notEqual(hcb.pipe, true);               //#1
        equal(hcb.file_name, "newFile");        //#2
        equal(hcb.format, "SF");                //#3
        equal(hcb.type, 1000);                  //#4
        equal(hcb.dview.BYTES_PER_ELEMENT, 4);  //#5
        equal(hcb.dview.length, 16);            //#6
        hcb.dview=[1,2,3];
        //m.filad(hcb, rdview);
        //equal(hcb.data_free, 0);              //#7
        equal(hcb.dview[0], 1.0);               //#8
        equal(hcb.dview[1], 2.0);               //#8
        equal(hcb.dview[2], 3.0);               //#8
});

test('bluefile pipe basics', function() {
        var hcb = m.initialize([], {pipe: true, pipesize: 16});
        equal( hcb.pipe, true);
        equal( hcb.in_byte, 0);
        equal( hcb.out_byte, 0);
        equal( hcb.format, "SF");
        equal( hcb.type, 1000);
        equal( hcb.dview.BYTES_PER_ELEMENT, 4);

        notEqual( hcb.buf, undefined);
        notEqual( hcb.dview, undefined);
        equal( hcb.buf.byteLength, 16);

        var rdbuf = new ArrayBuffer(8);
        var rdview = new Float32Array(rdbuf);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 0);
        equal( hcb.out_byte, 0);
        equal( hcb.data_free, 4);

        m.filad(hcb, [1.0, 2.0]);
        equal( hcb.in_byte, 8);
        equal( hcb.out_byte, 0);
        equal( hcb.dview[0], 1.0);
        equal( hcb.dview[1], 2.0);
        equal( hcb.data_free, 2);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 2);
        equal( hcb.out_byte, 8);
        equal( rdview[0], 1.0);
        equal( rdview[1], 2.0);
        equal( hcb.data_free, 4);

        m.filad(hcb, [3.0, 4.0]);
        equal( hcb.in_byte, 0);
        equal( hcb.dview[2], 3.0);
        equal( hcb.dview[3], 4.0);
        equal( hcb.data_free, 2);

        m.filad(hcb, [5.0, 6.0]);
        equal( hcb.in_byte, 8);
        equal( hcb.dview[0], 5.0);
        equal( hcb.dview[1], 6.0);
        equal( hcb.data_free, 0);

        rdbuf = new ArrayBuffer(16);
        rdview = new Float32Array(rdbuf);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 4);
        equal( hcb.out_byte, 8);
        equal( rdview[0], 3.0);
        equal( rdview[1], 4.0);
        equal( rdview[2], 5.0);
        equal( rdview[3], 6.0);
        equal( hcb.data_free, 4);

        m.filad(hcb, [7.0, 8.0, 9.0, 10.0]);
        equal( hcb.in_byte, 8);
        equal( hcb.dview[0], 9.0);
        equal( hcb.dview[1], 10.0);
        equal( hcb.dview[2], 7.0);
        equal( hcb.dview[3], 8.0);

        throws( function() { m.filad(hcb, [11.0, 12.0]) }, "pipe full" );

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 4);
        equal( hcb.out_byte, 8);
        equal( rdview[0], 7.0);
        equal( rdview[1], 8.0);
        equal( rdview[2], 9.0);
        equal( rdview[3], 10.0);
        equal( hcb.data_free, 4);



});

test('bluefile pipe basics (typed array)', function() {
        var hcb = m.initialize([], {pipe: true, pipesize: 16});
        equal( hcb.pipe, true);
        equal( hcb.in_byte, 0);
        equal( hcb.out_byte, 0);
        equal( hcb.format, "SF");
        equal( hcb.type, 1000);
        equal( hcb.dview.BYTES_PER_ELEMENT, 4);

        notEqual( hcb.buf, undefined);
        notEqual( hcb.dview, undefined);
        equal( hcb.buf.byteLength, 16);

        var rdbuf = new ArrayBuffer(8);
        var rdview = new Float32Array(rdbuf);

        var wrbuf = new ArrayBuffer(8);
        var wrview = new Float32Array(wrbuf);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 0);
        equal( hcb.out_byte, 0);
        equal( hcb.data_free, 4);

        wrview[0] = 1.0;
        wrview[1] = 2.0;
        m.filad(hcb, wrview);
        equal( hcb.in_byte, 8);
        equal( hcb.out_byte, 0);
        equal( hcb.dview[0], 1.0);
        equal( hcb.dview[1], 2.0);
        equal( hcb.data_free, 2);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 2);
        equal( hcb.out_byte, 8);
        equal( rdview[0], 1.0);
        equal( rdview[1], 2.0);
        equal( hcb.data_free, 4);

        wrview[0] = 3.0;
        wrview[1] = 4.0;
        m.filad(hcb, wrview);
        equal( hcb.in_byte, 0);
        equal( hcb.dview[2], 3.0);
        equal( hcb.dview[3], 4.0);
        equal( hcb.data_free, 2);

        wrview[0] = 5.0;
        wrview[1] = 6.0;
        m.filad(hcb, wrview);
        equal( hcb.in_byte, 8);
        equal( hcb.dview[0], 5.0);
        equal( hcb.dview[1], 6.0);
        equal( hcb.data_free, 0);

        rdbuf = new ArrayBuffer(16);
        rdview = new Float32Array(rdbuf);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 4);
        equal( hcb.out_byte, 8);
        equal( rdview[0], 3.0);
        equal( rdview[1], 4.0);
        equal( rdview[2], 5.0);
        equal( rdview[3], 6.0);
        equal( hcb.data_free, 4);

        var wrbuf = new ArrayBuffer(16);
        var wrview = new Float32Array(wrbuf);

        wrview[0] = 7.0;
        wrview[1] = 8.0;
        wrview[2] = 9.0;
        wrview[3] = 10.0;

        m.filad(hcb, wrview);
        equal( hcb.in_byte, 8);
        equal( hcb.dview[0], 9.0);
        equal( hcb.dview[1], 10.0);
        equal( hcb.dview[2], 7.0);
        equal( hcb.dview[3], 8.0);

        var wrbuf = new ArrayBuffer(8);
        var wrview = new Float32Array(wrbuf);
        wrview[0] = 11.0;
        wrview[1] = 12.0;
        throws( function() { m.filad(hcb, wrview) }, "pipe full" );

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 4);
        equal( hcb.out_byte, 8);
        equal( rdview[0], 7.0);
        equal( rdview[1], 8.0);
        equal( rdview[2], 9.0);
        equal( rdview[3], 10.0);
        equal( hcb.data_free, 4);


});

test('bluefile pipe CF type 2000', function() {
        var hcb = m.initialize([], {pipe: true, format: "CF", type: 2000, subsize: 4, pipesize: 64});
        equal( hcb.pipe, true);
        equal( hcb.in_byte, 0);
        equal( hcb.out_byte, 0);
        equal( hcb.format, "CF");
        equal( hcb.type, 2000);
        equal( hcb.dview.BYTES_PER_ELEMENT, 4);
        equal( hcb.spa, 2);
        equal( hcb.bps, 4);
        equal( hcb.bpa, 8);
        equal( hcb.bpe, 32);
        equal( hcb.out_byte, 0);
        equal( hcb.data_free, 16); // number of scalars available

        var rdbuf = new ArrayBuffer(32);
        var rdview = new Float32Array(rdbuf);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 0);
        equal( hcb.out_byte, 0);
        equal( hcb.data_free, 16);

        m.filad(hcb, [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]);
        equal( hcb.in_byte, 32);
        equal( hcb.out_byte, 0);
        equal( hcb.dview[0], 1.0);
        equal( hcb.dview[1], 2.0);
        equal( hcb.dview[2], 3.0);
        equal( hcb.dview[3], 4.0);
        equal( hcb.dview[6], 7.0);
        equal( hcb.dview[7], 8.0);
        equal( hcb.data_free, 8);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 8);
        equal( hcb.in_byte, 32);
        equal( hcb.out_byte, 32);
        equal( rdview.length, 8);
        equal( rdview[0], 1.0);
        equal( rdview[1], 2.0);
        equal( rdview[2], 3.0);
        equal( rdview[3], 4.0);
        equal( rdview[6], 7.0);
        equal( rdview[7], 8.0);
        equal( hcb.data_free, 16);

        m.filad(hcb, [8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
        equal( hcb.in_byte, 0);
        equal( hcb.out_byte, 32);
        equal( hcb.dview[0], 1.0);
        equal( hcb.dview[1], 2.0);
        equal( hcb.dview[2], 3.0);
        equal( hcb.dview[3], 4.0);
        equal( hcb.dview[6], 7.0);
        equal( hcb.dview[7], 8.0);
        equal( hcb.dview[8], 8.0);
        equal( hcb.dview[9], 7.0);
        equal( hcb.dview[10], 6.0);
        equal( hcb.dview[11], 5.0);
        equal( hcb.dview[14], 2.0);
        equal( hcb.dview[15], 1.0);
        equal( hcb.data_free, 8);

        m.filad(hcb, [0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
        equal( hcb.in_byte, 32);
        equal( hcb.out_byte, 32);
        equal( hcb.dview[0], 0.0);
        equal( hcb.dview[1], 1.0);
        equal( hcb.dview[2], 0.0);
        equal( hcb.dview[3], 1.0);
        equal( hcb.dview[6], 0.0);
        equal( hcb.dview[7], 1.0);
        equal( hcb.dview[8], 8.0);
        equal( hcb.dview[9], 7.0);
        equal( hcb.dview[10], 6.0);
        equal( hcb.dview[11], 5.0);
        equal( hcb.dview[14], 2.0);
        equal( hcb.dview[15], 1.0);
        equal( hcb.data_free, 0);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 8);
        equal( hcb.in_byte, 32);
        equal( hcb.out_byte, 0);
        equal( rdview.length, 8);
        equal( rdview[0], 8.0);
        equal( rdview[1], 7.0);
        equal( rdview[2], 6.0);
        equal( rdview[3], 5.0);
        equal( rdview[6], 2.0);
        equal( rdview[7], 1.0);
        equal( hcb.data_free, 8);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 8);
        equal( hcb.in_byte, 32);
        equal( hcb.out_byte, 32);
        equal( rdview.length, 8);
        equal( rdview[0], 0.0);
        equal( rdview[1], 1.0);
        equal( rdview[2], 0.0);
        equal( rdview[3], 1.0);
        equal( rdview[6], 0.0);
        equal( rdview[7], 1.0);
        equal( hcb.data_free, 16);
});

test('bluefile pipe CF type 2000 misaligned', function() {
        var hcb = m.initialize([], {pipe: true, format: "CF", type: 2000, subsize: 4, pipesize: 80});
        equal( hcb.pipe, true);
        equal( hcb.in_byte, 0);
        equal( hcb.out_byte, 0);
        equal( hcb.format, "CF");
        equal( hcb.type, 2000);
        equal( hcb.dview.BYTES_PER_ELEMENT, 4);
        equal( hcb.spa, 2);
        equal( hcb.bps, 4);
        equal( hcb.bpa, 8);
        equal( hcb.bpe, 32);
        equal( hcb.out_byte, 0);
        equal( hcb.data_free, 20); // number of scalars available

        var rdbuf = new ArrayBuffer(32);
        var rdview = new Float32Array(rdbuf);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 0);
        equal( hcb.out_byte, 0);
        equal( hcb.data_free, 20);

        m.filad(hcb, [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]);
        equal( hcb.in_byte, 32);
        equal( hcb.out_byte, 0);
        equal( hcb.dview[0], 1.0);
        equal( hcb.dview[1], 2.0);
        equal( hcb.dview[2], 3.0);
        equal( hcb.dview[3], 4.0);
        equal( hcb.dview[6], 7.0);
        equal( hcb.dview[7], 8.0);
        equal( hcb.data_free, 12);

        var ngot = m.grabx(hcb, rdview);
        equal( ngot, 8);
        equal( hcb.in_byte, 32);
        equal( hcb.out_byte, 32);
        equal( rdview.length, 8);
        equal( rdview[0], 1.0);
        equal( rdview[1], 2.0);
        equal( rdview[2], 3.0);
        equal( rdview[3], 4.0);
        equal( rdview[6], 7.0);
        equal( rdview[7], 8.0);
        equal( hcb.data_free, 20);

        m.filad(hcb, [8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
        equal( hcb.in_byte, 64);
        equal( hcb.out_byte, 32);
        equal( hcb.dview[0], 1.0);
        equal( hcb.dview[1], 2.0);
        equal( hcb.dview[2], 3.0);
        equal( hcb.dview[3], 4.0);
        equal( hcb.dview[6], 7.0);
        equal( hcb.dview[7], 8.0);
        equal( hcb.dview[8], 8.0);
        equal( hcb.dview[9], 7.0);
        equal( hcb.dview[10], 6.0);
        equal( hcb.dview[11], 5.0);
        equal( hcb.dview[14], 2.0);
        equal( hcb.dview[15], 1.0);
        equal( hcb.data_free, 12);

        m.filad(hcb, [0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
        equal( hcb.in_byte, 16);
        equal( hcb.out_byte, 32);
        equal( hcb.dview[0], 0.0);
        equal( hcb.dview[1], 1.0);
        equal( hcb.dview[2], 0.0);
        equal( hcb.dview[3], 1.0);
        equal( hcb.dview[6], 7.0);
        equal( hcb.dview[7], 8.0);
        equal( hcb.dview[8], 8.0);
        equal( hcb.dview[9], 7.0);
        equal( hcb.dview[10], 6.0);
        equal( hcb.dview[11], 5.0);
        equal( hcb.dview[14], 2.0);
        equal( hcb.dview[15], 1.0);
        equal( hcb.dview[16], 0.0);
        equal( hcb.dview[17], 1.0);
        equal( hcb.dview[18], 0.0);
        equal( hcb.dview[19], 1.0);
        equal( hcb.data_free, 4);
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
    teardown: function() {
    }
});

test('sigplot construction', function() {
        var container = document.getElementById('plot');
        equal( container.childNodes.length, 0);
        equal( fixture.childNodes.length, 1);

        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);
        equal( container.childNodes.length, 1);
        equal( container.childNodes[0], plot._Mx.parent);

        equal( plot._Mx.parent.childNodes.length, 2);
        equal( plot._Mx.parent.childNodes[0], plot._Mx.canvas);
        equal( plot._Mx.parent.childNodes[1], plot._Mx.wid_canvas);

        equal( plot._Mx.canvas.width, 600);
        equal( plot._Mx.canvas.height, 400);
        equal( plot._Mx.canvas.style.position, "absolute");

        equal( plot._Mx.wid_canvas.width, 600);
        equal( plot._Mx.wid_canvas.height, 400);
        equal( plot._Mx.wid_canvas.style.position, "absolute");
});

test('sigplot layer1d noautoscale', function() {
        var container = document.getElementById('plot');
        equal( container.childNodes.length, 0);
        equal( fixture.childNodes.length, 1);

        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);

        var pulse = [];
        for (var i = 0; i <= 1000; i += 1) {
                pulse.push(0.0);
        }

        plot.overlay_array(pulse);
        equal( plot._Gx.panymin, -1.0);
        equal( plot._Gx.panymax, 1.0);

        pulse[0] = 1.0;
        plot.reload(0, pulse);
        equal( plot._Gx.panymin, -0.02);
        equal( plot._Gx.panymax, 1.02);

        for (var i = 1; i <= 1000; i += 1) {
                pulse[i-1] = 0;
                pulse[i] = 1;
                equal( plot._Gx.panymin, -0.02);
                equal( plot._Gx.panymax, 1.02);
        }
});

test('sigplot layer1d autoscale', function() {
        var container = document.getElementById('plot');
        equal( container.childNodes.length, 0);
        equal( fixture.childNodes.length, 1);

        var plot = new sigplot.Plot(container, {autol: 2});
        notEqual( plot, null);

        var pulse = [];
        for (var i = 0; i <= 1000; i += 1) {
                pulse.push(0.0);
        }

        plot.overlay_array(pulse);
        equal( plot._Gx.panymin, -1.0);
        equal( plot._Gx.panymax, 1.0);

        pulse[0] = 1.0;
        plot.reload(0, pulse);
        var expected_ymin = (-0.02 * .5) + (-1 * .5);
        var expected_ymax = (1.02 * .5) + (1 * .5);
        equal( plot._Gx.panymin, expected_ymin);
        equal( plot._Gx.panymax, expected_ymax);

        for (var i = 1; i <= 1000; i += 1) {
                pulse[i-1] = 0;
                pulse[i] = 1;
                expected_ymin = (expected_ymin * .5) + (expected_ymin * .5);
                expected_ymax = (expected_ymax * .5) + (expected_ymax * .5);
                equal( plot._Gx.panymin, expected_ymin);
                equal( plot._Gx.panymax, expected_ymax);
        }
});

test('sigplot layer1d autoscale negative', function() {
        var container = document.getElementById('plot');
        equal( container.childNodes.length, 0);
        equal( fixture.childNodes.length, 1);

        var plot = new sigplot.Plot(container, {autol: 2});
        notEqual( plot, null);

        var pulse = [];
        for (var i = 0; i <= 1000; i += 1) {
                pulse.push(-60.0);
        }

        pulse[0] = -10.0;
        plot.overlay_array(pulse);

        var expected_ymin = (-61.0 * .5) + (-1 * .5);
        var expected_ymax = (-9.0 * .5) + (1 * .5);
        equal( plot._Gx.panymin, expected_ymin);
        equal( plot._Gx.panymax, expected_ymax);

        for (var i = 1; i <= 1000; i += 1) {
                pulse[i-1] = -60;
                pulse[i] = -10;
                expected_ymin = (expected_ymin * .5) + (expected_ymin * .5);
                expected_ymax = (expected_ymax * .5) + (expected_ymax * .5);
                equal( plot._Gx.panymin, expected_ymin);
                equal( plot._Gx.panymax, expected_ymax);
        }
});

test('sigplot 0px height', function() {
        var container = document.getElementById('plot');
        container.style.height = "0px";

        equal( container.childNodes.length, 0);
        equal( fixture.childNodes.length, 1);

        var plot = new sigplot.Plot(container);
        notEqual( plot, null);
        equal( plot._Mx.canvas.height, 0);

        var zeros = [];
        for (var i = 0; i <= 1000; i += 1) {
                zeros.push(0.0);
        }
        plot.overlay_array(zeros);
        notEqual( plot.get_layer(0), null);
        plot.deoverlay();
        equal( plot.get_layer(0), null);
        
        plot.overlay_array(zeros, {type: 2000});
        notEqual( plot.get_layer(0), null);
        plot.deoverlay();
        equal( plot.get_layer(0), null);

        plot.overlay_pipe({type: 2000, subsize: 128});
        notEqual( plot.get_layer(0), null);
        equal( plot.get_layer(0).drawmode, "scrolling");
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 0)
        equal(plot.get_layer(0).lps, 1)
        plot.deoverlay();
                        
        plot.overlay_pipe({type: 2000, subsize: 128}, {drawmode: "rising"});
        notEqual( plot.get_layer(0), null);
        equal( plot.get_layer(0).drawmode, "rising");
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 0)
        equal(plot.get_layer(0).lps, 1)
        plot.deoverlay();

        plot.overlay_pipe({type: 2000, subsize: 128}, {drawmode: "falling"});
        notEqual( plot.get_layer(0), null);
        equal( plot.get_layer(0).drawmode, "falling");
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 0)
        equal(plot.get_layer(0).position, 0)
        equal(plot.get_layer(0).lps, 1)
        plot.deoverlay();
});

test('sigplot resize raster 0px height', function() {
        var container = document.getElementById('plot');

        equal( container.childNodes.length, 0);
        equal( fixture.childNodes.length, 1);

        var plot = new sigplot.Plot(container);
        notEqual( plot, null);
        equal( plot._Mx.canvas.height, 400);

        var zeros = [];
        for (var i = 0; i <= 128; i += 1) {
                zeros.push(0.0);
        }

        plot.overlay_pipe({type: 2000, subsize: 128});
        notEqual( plot.get_layer(0), null);
        equal( plot.get_layer(0).drawmode, "scrolling");
        
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 1);
        ok(plot.get_layer(0).lps > 1);
        
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 2);
        ok(plot.get_layer(0).lps > 1);

        container.style.height = "0px";
        plot.checkresize();
        plot._refresh();
        plot.checkresize();
        equal( plot._Mx.canvas.height, 0);
        equal(plot.get_layer(0).lps, 1);
        
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 0);
});

test('sigplot resize raster larger height', function() {
        var container = document.getElementById('plot');

        equal( container.childNodes.length, 0);
        equal( fixture.childNodes.length, 1);

        var plot = new sigplot.Plot(container);
        notEqual( plot, null);
        equal( plot._Mx.canvas.height, 400);

        var zeros = [];
        for (var i = 0; i <= 128; i += 1) {
                zeros.push(0.0);
        }

        plot.overlay_pipe({type: 2000, subsize: 128}, {drawmode: "scrolling"});
        notEqual( plot.get_layer(0), null);
        equal( plot.get_layer(0).drawmode, "scrolling");
        
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 1);
        ok(plot.get_layer(0).lps > 1);
        
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 2);
        ok(plot.get_layer(0).lps > 1);
        var orig_lps = plot.get_layer(0).lps;

        container.style.height = "600px";
        plot.checkresize();
        plot._refresh();
        plot.checkresize();

        equal( plot._Mx.canvas.height, 600);
        ok(plot.get_layer(0).lps > orig_lps);
        
        plot.push(0, zeros, true);
        equal(plot.get_layer(0).position, 3);
        for (var i = 0; i <= plot.get_layer(0).lps; i += 1) {
            plot.push(0, zeros, true);
        }
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
        equal( container.childNodes.length, 0);
        equal( ifixture.childNodes.length, 1);

        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);
        equal( container.childNodes.length, 1);
        equal( container.childNodes[0], plot._Mx.parent);

        equal( plot._Mx.parent.childNodes.length, 2);
        equal( plot._Mx.parent.childNodes[0], plot._Mx.canvas);
        equal( plot._Mx.parent.childNodes[1], plot._Mx.wid_canvas);

        equal( plot._Mx.canvas.width, 600);
        equal( plot._Mx.canvas.height, 400);
        equal( plot._Mx.canvas.style.position, "absolute");

        equal( plot._Mx.wid_canvas.width, 600);
        equal( plot._Mx.wid_canvas.height, 400);
        equal( plot._Mx.wid_canvas.style.position, "absolute");
});

interactiveTest('sigplot ramp', 'Do you see a ramp from 0 to 1023?',  function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);

        var ramp = [];
        for (var i=0; i<1024; i++) {
            ramp.push(i);
        }
        plot.overlay_array(ramp,{file_name: "ramp"});
});

interactiveTest('scrolling line', 'Do you see a scrolling random data plot',  function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);

	plot.change_settings({
                                ymin: -2,
                                ymax: 2
	});
	
	plot.overlay_pipe({type: 1000}, { framesize: 32768, drawmode: "scrolling" });
                
	ifixture.interval = window.setInterval(function() {
		var random = [];
		for (var i = 0; i < 100; i += 1) {
			random.push(Math.random());
		}
		plot.push(0, random);
	}, 100);
});

interactiveTest('complex scrolling line', 'Do you see a scrolling random data plot',  function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);

	plot.change_settings({
                                cmode: 3,
                                autol: 5,
	});
	
	plot.overlay_pipe({type: 1000, format: "CF"}, { framesize: 32768, drawmode: "scrolling" });
                
	ifixture.interval = window.setInterval(function() {
		var random = [];
		for (var i = 0; i < 100; i += 1) {
			random.push(Math.random());
		}
		plot.push(0, random);
	}, 100);
});

interactiveTest('sigplot penny', 'Do you see a raster of a penny',  function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);

        var ramp = [];
        for (var i=0; i<1024; i++) {
            ramp.push(i);
        }
        plot.overlay_href("dat/penny.prm");
});

interactiveTest('falling raster', 'Do you see a falling raster?',  function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);
                        
	plot.change_settings({
                                autol: 5,
	});
	
	var framesize = 128;
	plot.overlay_pipe({type: 2000, subsize: framesize, file_name: "ramp", ydelta: 0.25});
                
	ifixture.interval = window.setInterval(function() {
		var ramp = [];
		for (var i = 0; i < framesize; i += 1) {
			ramp.push(i+1);
		}
		plot.push(0, ramp);
	}, 100);
});

interactiveTest('large framesize falling raster', 'Do you see a falling raster?',  function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);
                        
	plot.change_settings({
                                autol: 5,
				all: true
	});
	
	var framesize = 128000;
	plot.overlay_pipe({type: 2000, subsize: framesize, file_name: "ramp", ydelta: 0.25});
                
	ifixture.interval = window.setInterval(function() {
		var ramp = [];
		for (var i = 0; i < framesize; i += 1) {
			ramp.push(i);
		}
		plot.push(0, ramp);
	}, 100);
});

interactiveTest('complex data falling raster', 'Do you see a falling raster?',  function() {
        var container = document.getElementById('plot');
        var plot = new sigplot.Plot(container, {});
        notEqual( plot, null);
                        
	plot.change_settings({
                                autol: 5,
	});
	
	var framesize = 128;
	plot.overlay_pipe({type: 2000, subsize: framesize, file_name: "ramp", format: "CF", ydelta: 0.25});
                
	ifixture.interval = window.setInterval(function() {
		var ramp = [];
		for (var i = 0; i < framesize; i += 1) {
			ramp.push(i+1);
			ramp.push(-1*(i+1));
		}
		plot.push(0, ramp);
	}, 100);
});
