'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            options: { '--web-security': 'no', '--local-to-remote-url-access': 'yes' },
            all: ['test/passfail.html']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Build a distributable release
    grunt.registerTask('dist', ['test' ]);

    // Check everything is good
    grunt.registerTask('test', ['qunit']);

    // Default task.
    grunt.registerTask('default', 'test');

};
