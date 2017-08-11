module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('../package.json'),
        
        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.scss'],
                    dest: '../css',
                    ext: '.css'
                }]
            }
        },
        watch: {
            css: {
                files: ['**/*.scss'], 
                tasks: ['sass:dev']
            }
		},
        connect: {
            dev: {
                options: {
                    port: 4000,
                    debug: true,
                    open: true,
                    base: ['../shared', '.']
                }
            }
        }
    });
    
    grunt.loadTasks('../node_modules/grunt-contrib-sass/tasks');
    grunt.loadTasks('../node_modules/grunt-contrib-watch/tasks');
    grunt.loadTasks('../node_modules/grunt-contrib-connect/tasks');
    // grunt.loadTasks('../node_modules/grunt-contrib-qunit/tasks');
    // grunt.loadTasks('../node_modules/grunt-contrib-concat/tasks');
    // grunt.loadTasks('../node_modules/grunt-contrib-uglify/tasks');
    
    grunt.registerTask('dev', ['connect', 'watch']);
    // grunt.registerTask('dist', ['sass', 'qunit', 'concat', 'uglify']);
};