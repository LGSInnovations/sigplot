'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
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
                    template: './node_modules/minami/',
                    configure: '.jsdoc.json'
                }
            }
        },
        clean: {
            build: ["dist/**/*", "!dist/*.zip"],
            doc: ["doc/**/*"]
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
        githash: {
            main: {
                options: {}
            }
        },
        replace: {
            version: {
                src: ["dist/*.js"],
                overwrite: true,
                replacements: [{
                    from: /version-PLACEHOLDER/g,
                    to: "<%= pkg.version %>-<%= githash.main.short %>",
                }],
            }
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
                        'js/sigplot.plugin.js',
                        'test/tests.js'
                ],
                options: {
                    mode: "VERIFY_ONLY",
                    config: ".jsbeautifyrc"
                }
            },
            cleanup: {
                // Only cleanup a subset of the files
                src: [
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
                        'js/sigplot.plugin.js',
                        'test/tests.js'
                ],
                options: {
                    config: ".jsbeautifyrc"
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
            sigplot: {
                src: 'js/sigplot.js',
                dest: 'dist/sigplot.js',
                options: {
                    browserifyOptions: {
                      standalone: 'sigplot'
                    },
                    transform: [
                        [
                            'babelify', {
                                "presets": ["@babel/preset-env"]
                            }
                        ]
                    ]
                }
            },
            plugins: {
                src: [ 'js/plugins.js' ],
                dest: 'dist/sigplot.plugins.js',
                options: {
                    browserifyOptions: {
                      standalone: 'sigplot_plugins'
                    },
                    transform: [
                        [
                            'babelify', {
                                "presets": ["@babel/preset-env"]
                            }
                        ]
                    ]
                }
            }
        }
    });

    // These plugins provide necessary tasks.
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
    grunt.loadNpmTasks('grunt-githash');

    grunt.registerTask('build', ['jsbeautifier:check', 'jshint', 'browserify', 'githash', 'replace']);

    // Check everything is good
    grunt.registerTask('test', ['build', 'qunit']);
    
    // Beautify the code
    grunt.registerTask('prep', ['jsbeautifier:cleanup']);

    // Generate documentation
    grunt.registerTask('generate-docs', ['jsdoc']);

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
