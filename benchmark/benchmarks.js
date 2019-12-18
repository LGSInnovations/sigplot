/*jslint nomen: true, browser: true, devel: true */

(function () {
    /* global POTATOES */
    /* global sigplot */

    var plot = null;
    var plot2 = null;
    var container = null;
    var container2 = null;
    var data = null;
    var data2 = null;
    var render;

    var init = function (workbench, width, height, numContainers=1) {
        
        // Getting container and context
        container = document.createElement('div');
        workbench.appendChild(container);


        // Setting hardware scaling
        container.width = width;
        container.style.width = width+'px';
        container.height = height;
        container.style.height = height+'px';

        // Position
        container.style.position = "absolute";
        container.style.left = (workbench.clientWidth - width) / 2 + "px";
        container.style.top = (workbench.clientHeight - height) / 2 + "px";
        if (numContainers > 1) {

            container2 = document.createElement('div');
            workbench.appendChild(container2);


            // Setting hardware scaling
            container2.width = width;
            container2.style.width = width+'px';
            container2.height = height;
            container2.style.height = height+'px';

            // Position
            container2.style.position = "relative";
            container2.style.left = (workbench.clientWidth - width) / 2 + "px";
            container2.style.top = (workbench.clientHeight - height) / 2 + "px";
        }
    };

    var refreshLoop = function() {
        plot._refresh();
        plot2 && plot2._refresh()
        if (render) { // Run again
            POTATOES.Tools.queueNewFrame(refreshLoop);
        } else { // Cleanup
            plot = null;
            data = null;
            plot2 = null;
            data2 = null;
        }
    };
    
    var reloadLoop = function() {
        plot.reload(0, data);
        if (render) { // Run again
            POTATOES.Tools.queueNewFrame(reloadLoop);
        } else { // Cleanup
            plot = null;
            plot2 = null
            data = null;
            data2 = null;
        }
    };

    var pushLoop = function() {
        plot.push(0, data, null, true);
        if (render) { // Run again
            POTATOES.Tools.queueNewFrame(pushLoop);
        } else { // Cleanup
            plot = null;
            data = null;
            plot2 = null;
            data2 = null;
        }
    };

    var emptyBench = new POTATOES.GamingBench.Bench("Empty SigPlot", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(refreshLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(emptyBench);
    
    var Layer1DSmallBench = new POTATOES.GamingBench.Bench("Layer 1D (1k points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});
            data = [];
            for (var i = 0; i < 1024; i++) {
                data.push(i);
            }
            plot.overlay_array(data, {
                file_name: "data"
            });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(refreshLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(Layer1DSmallBench);
    
    var Layer1DLargeBench = new POTATOES.GamingBench.Bench("Layer 1D (1M points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});
            data = [];
            for (var i = 0; i < 1048576; i++) {
                data.push(i);
            }
            plot.overlay_array(data, {
                file_name: "data"
            });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(refreshLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(Layer1DLargeBench);
    
    var Layer1DSmallReloadBench = new POTATOES.GamingBench.Bench("Layer 1D Reload (1k points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});
            data = [];
            for (var i = 0; i < 1024; i++) {
                data.push(i);
            }
            plot.overlay_array(data, {
                file_name: "data"
            });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(reloadLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(Layer1DSmallReloadBench);

    var Layer1DLargeReloadBench = new POTATOES.GamingBench.Bench("Layer 1D Reload (1M points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});
            data = [];
            for (var i = 0; i < 1048576; i++) {
                data.push(i);
            }
            plot.overlay_array(data, {
                file_name: "data"
            });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(reloadLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(Layer1DLargeReloadBench);


    var Layer2DSmallPushBench = new POTATOES.GamingBench.Bench("Streaming 2D (1k points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});

            plot.change_settings({
                autol: 5,
            });
    
            var framesize = 1024;
            data = [];
            for (var i = 0; i < framesize; i += 1) {
                data.push(i + 1);
            }
            plot.overlay_pipe({
                type: 2000,
                subsize: framesize,
                file_name: "data"
            });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(pushLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(Layer2DSmallPushBench);

    var Layer2DMediumPushBench = new POTATOES.GamingBench.Bench("Streaming 2D (64k points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});

            plot.change_settings({
                autol: 5,
            });
    
            var framesize = 64*1024;
            data = [];
            for (var i = 0; i < framesize; i += 1) {
                data.push(i + 1);
            }
            plot.overlay_pipe({
                type: 2000,
                subsize: framesize,
                file_name: "data"
            });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(pushLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(Layer2DMediumPushBench);
    
    var Layer2DLargePushBench = new POTATOES.GamingBench.Bench("Streaming 2D 2 plots (256k points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench,) { // Init
            init(workbench, 600, 200, 2);
            plot = new sigplot.Plot(container, {all: true, expand: true});
            //If you uncomment this line, plot will not show any data
            // plot2 = new sigplot.Plot(container2, {all: true, expand: true});
            plot._refresh(); // refresh now so that it displays while we wait for the initial data to be created
            // plot2._refresh()

            plot.change_settings({
                autol: 5,
            });
            // plot2.change_settings({
            //     autol: 5,
            // });
    
            var framesize = 256*1024;
            data = [];
            for (var i = 0; i < framesize; i += 1) {
                data.push(i + 1);
            }
            // data2 = [];
            // for (var i = 0; i < framesize; i += 1) {
            //     data2.push(i + 1);
            // }
            plot.overlay_pipe({
                type: 2000,
                subsize: framesize,
                file_name: "data"
            });
            // plot2.overlay_pipe({
            //     type: 2000,
            //     subsize: framesize,
            //     file_name: "data2"
            // });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(pushLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(Layer2DLargePushBench);
    
    var Layer2DSmallBench = new POTATOES.GamingBench.Bench("Layer 2D (1k points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});
    
            var framesize = 1024;
            var height = 1024;
            data = [];
            for (var j = 0; j < height; j += 1) {
                for (var i = 0; i < framesize; i += 1) {
                    data.push(i + 1);
                }
            }
            plot.overlay_array(data, {
                type: 2000,
                subsize: framesize,
                file_name: "data"
            });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(refreshLoop);
        }, function () { // End
            render = false;
        });

    POTATOES.GamingBench.registerBench(Layer2DSmallBench);

    var Layer2DLargeBench = new POTATOES.GamingBench.Bench("Layer 2D (64k points)", "http://sigplot.lgsinnovations.com/sigplot",
        function (workbench) { // Init
            init(workbench, 600, 400);
            plot = new sigplot.Plot(container, {all: true, expand: true});
            plot._refresh(); // refresh now so that it displays while we wait for the initial data to be created
    
            var framesize = 65536;
            var height = 1024;
            data = [];
            for (var j = 0; j < height; j += 1) {
                for (var i = 0; i < framesize; i += 1) {
                    data.push(i + 1);
                }
            }
            plot.overlay_array(data, {
                type: 2000,
                subsize: framesize,
                file_name: "data"
            });
            this.onInitCompleted();
        }, function () { // Run
            render = true;
            POTATOES.Tools.queueNewFrame(refreshLoop);
        }, function () { // End
            render = false;
        });

   POTATOES.GamingBench.registerBench(Layer2DLargeBench);

})();
