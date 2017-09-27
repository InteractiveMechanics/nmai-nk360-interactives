module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('../package.json'),
        
        sass: {
            dev: {
                files: {
                    'css/main.css': 'sass/main.scss',
                    'css/theme-pnw.css': 'sass/theme-pnw.scss',
                    'css/theme-np.css': 'sass/theme-np.scss'
                }
            }
        },
        watch: {
            css: {
                files: ['../**/*.scss'],
                tasks: ['sass:dev']
            }
		},
        connect: {
            dev: {
                options: {
                    port: 4000,
                    debug: true,
                    open: true,
                    base: ['shared', '.']
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['js/**/*.js']
        },
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'js/magic.min.js': 'src/js/magic.js'
                }
            }
        }
    });
    
    grunt.loadTasks('../node_modules/grunt-contrib-sass/tasks');
    grunt.loadTasks('../node_modules/grunt-contrib-watch/tasks');
    grunt.loadTasks('../node_modules/grunt-contrib-connect/tasks');

    grunt.loadTasks('../node_modules/grunt-contrib-jshint/tasks');

    //grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');
    //grunt.loadTasks('../node_modules/grunt-contrib-qunit/tasks');
    //grunt.loadTasks('../node_modules/grunt-contrib-uglify/tasks');
    
    grunt.registerTask('dev', ['connect', 'watch']);
    //grunt.registerTask('dist', ['sass', 'uglify']);
};