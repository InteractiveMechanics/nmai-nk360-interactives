module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('../package.json'),
        
        watch: {
            css: {
                files: ['**/*.scss'], 
                tasks: ['sass'] 
            }
		},
        connect: {
            dev: {
                options: {
                    port: 8000,
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