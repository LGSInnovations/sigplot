'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        concat: {
          bluefile: {
            src: [
                    'js/license.js',
                    'js/typedarray.js',
                    'js/common.js',
                    'js/bluefile.js'
            ],
            dest: 'dist/bluefile.js'
          },
          matfile: {
            src: [
                    'js/license.js',
                    'js/typedarray.js',
                    'js/common.js',
                    'js/matfile.js'
            ],
            dest: 'dist/matfile.js'
          },
          sigplot: {
            src: [
                    'js/license.js',
                    'js/typedarray.js',
                    'js/common.js',
                    'js/bluefile.js',
                    'js/matfile.js',
                    'js/ColorMap.js',
                    'js/tinycolor.js',
                    'js/CanvasInput.js',
                    'js/spin.js',
                    'js/loglevel.js',
                    'js/m.js',
                    'js/mx.js',
                    'js/sigplot.Utils.js',
                    'js/sigplot.layer1d.js',
                    'js/sigplot.layer2d.js',
                    'js/sigplot.js'
            ],
            dest: 'dist/sigplot.js'
          },
          sigplot_plugins: {
            src: [
                    'js/license.js',
                    'js/sigplot.annotations.js',
                    'js/sigplot.slider.js',
                    'js/sigplot.accordion.js',
                    'js/sigplot.boxes.js',
                    'js/sigplot.playback.js',
            ],
            dest: 'dist/sigplot.plugins.js'
          }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            js: {
                options: {
                    jshintrc: 'js/.jshintrc'
                },
                src: ['js/**/*.js', 'test/tests.js']
            },
        },
        qunit: {
            options: { '--web-security': 'no', '--local-to-remote-url-access': 'yes' },
            all: ['test/test.html']
        },
        'closure-compiler': {
            bluefile_debug: {
                closurePath: 'support/google-closure-compiler',
                js: 'dist/bluefile.js',
                maxBuffer: 500,
                jsOutputFile: 'dist/bluefile-debug.js',
                options: {
                    formatting: 'PRETTY_PRINT',
                    compilation_level: 'WHITESPACE_ONLY'
                }
            },
            matfile_debug: {
                closurePath: 'support/google-closure-compiler',
                js: 'dist/matfile.js',
                maxBuffer: 500,
                jsOutputFile: 'dist/matfile-debug.js',
                options: {
                    formatting: 'PRETTY_PRINT',
                    compilation_level: 'WHITESPACE_ONLY'
                }
            },
            sigplot_debug: {
                closurePath: 'support/google-closure-compiler',
                js: 'dist/sigplot.js',
                maxBuffer: 500,
                jsOutputFile: 'dist/sigplot-debug.js',
                options: {
                    formatting: 'PRETTY_PRINT',
                    compilation_level: 'WHITESPACE_ONLY',
                }
            },
            sigplot_plugins_debug: {
                closurePath: 'support/google-closure-compiler',
                js: 'dist/sigplot.plugins.js',
                maxBuffer: 500,
                jsOutputFile: 'dist/sigplot.plugins-debug.js',
                options: {
                    formatting: 'PRETTY_PRINT',
                    compilation_level: 'WHITESPACE_ONLY'
                }
            },
            bluefile_minimized: {
                closurePath: 'support/google-closure-compiler',
                js: 'dist/bluefile.js',
                maxBuffer: 500,
                jsOutputFile: 'dist/bluefile-minimized.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            },
            matfile_minimized: {
                closurePath: 'support/google-closure-compiler',
                js: 'dist/matfile.js',
                maxBuffer: 500,
                jsOutputFile: 'dist/matfile-minimized.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            },
            sigplot_minimized: {
                closurePath: 'support/google-closure-compiler',
                js: 'dist/sigplot.js',
                maxBuffer: 500,
                jsOutputFile: 'dist/sigplot-minimized.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            },
            sigplot_plugins_minimized: {
                closurePath: 'support/google-closure-compiler',
                js: 'dist/sigplot.plugins.js',
                maxBuffer: 500,
                jsOutputFile: 'dist/sigplot.plugins-minimized.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            } 
        },
        jsdoc: {
            sigplot: {
                src: ['js/*.js'],
                options: {
                    destination: 'doc',
                    template: 'docstrap-master/template',
                    configure: 'docstrap-master/conf.json'
                }
            }
        },
        clean: {
            build: ["dist/**/*", "!dist/*.zip"],
            doc: ["doc/**/*", "!doc/*.png", "!doc/Sigplot_Setup.md"]
        },
        compress: {
            main: {
                options: {
                    archive: "dist/sigplot-<%= pkg.version %>-<%= grunt.template.today('yyyy-mm-dd') %>.zip",
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['*-debug.js'], dest: 'sigplot-<%= pkg.version %>'},
                    {expand: true, cwd: 'dist/', src: ['*-minimized.js'], dest: 'sigplot-<%= pkg.version %>'},
                    {src: ['doc/**/*'], dest: 'sigplot-<%= pkg.version %>'}
                ]
            }
        },
        replace: {
            version: {
                src: ["dist/*.js"],
                overwrite: true,
                replacements: [{
                    from: /version-PLACEHOLDER/g,
                    to: "<%= pkg.version %>",
                }],
            },
        },
        'http-server': {
            'test': {
                cache: 0,
                port: 1337
            },
        },
        jsbeautifier: {
            check: {
                // Only check a subset of the files
                src: [
                        'js/bluefile.js',
                        'js/matfile.js',
                        'js/m.js',
                        'js/mx.js',
                        'js/sigplot.layer1d.js',
                        'js/sigplot.layer2d.js',
                        'js/sigplot.js',
                        'js/sigplot.annotations.js',
                        'js/sigplot.slider.js',
                        'js/sigplot.accordion.js',
                        'js/sigplot.boxes.js',
                        'js/sigplot.playback.js',
                        'test/tests.js'
                ],
                options: {
                    mode: "VERIFY_ONLY",
                    eol: "\n"
                }
            },
            cleanup: {
                // Only cleanup a subset of the files
                src: [
                        'js/bluefile.js',
                        'js/matfile.js',
                        'js/m.js',
                        'js/mx.js',
                        'js/sigplot.layer1d.js',
                        'js/sigplot.layer2d.js',
                        'js/sigplot.js',
                        'js/sigplot.annotations.js',
                        'js/sigplot.slider.js',
                        'js/sigplot.accordion.js',
                        'js/sigplot.boxes.js',
                        'js/sigplot.playback.js',
                        'test/tests.js'
                ],
                options: {
                    indentSize: 4,
                    indentWithTabs: false,
                    wrapLineLength: 0,
                    eol: "\n"
                }
            }
        },
        express: {
            test: {
                options: {
                    script: 'benchmark/express.js'
                }
            }
        },
        karma: {
            bench: {
                configFile: 'karma.conf.js'
            }
        },
        browserify: {
            bluefile: {
                src: 'js/bluefile.js',
                dest: 'dist/bluefile.js',
                options: {
                    browserifyOptions: {
                      standalone: 'bluefile'
                    }
                }
            },
            matfile: {
                src: 'js/matfile.js',
                dest: 'dist/matfile.js',
                options: {
                    browserifyOptions: {
                      standalone: 'matfile'
                    }
                }
            },
            sigplot: {
                src: 'js/sigplot.js',
                dest: 'dist/sigplot.js',
                options: {
                    browserifyOptions: {
                      standalone: 'sigplot'
                    }
                }
            },
            plugins: {
                src: [ 'js/plugins.js' ],
                dest: 'dist/sigplot.plugins.js',
                options: {
                    browserifyOptions: {
                      standalone: 'sigplot_plugins'
                    }
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('build', ['jsbeautifier:check', 'jshint', 'browserify', 'replace']);

    // Check everything is good
    grunt.registerTask('test', ['build', 'qunit']);
    
    // Build a distributable release
    grunt.registerTask('dist', ['clean', 'test', 'closure-compiler', 'jsdoc', 'compress']);
    
    // Default task.
    grunt.registerTask('default', 'test');

    // Benchmark in browsers.
    grunt.registerTask('benchtest', ['express:test', 'karma:bench']);
    grunt.registerTask('build_and_test', ['build', 'benchtest']);

    // for compatibility with the old grunt commands
    grunt.registerTask('web_server', 'http-server');
    
};
