module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('../package.json'),

        sass: {
            dist: {
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
                tasks: ['sass:dist']
            }
		},
        connect: {
            dev: {
                options: {
                    port: 4000,
                    debug: true,
                    open: true,
                    base: ['../..']
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['js/**/*.js']
        },
        copy: {
            dist: {
                files: [
                    {expand: true, src: ['css/**'], dest: '../' + grunt.option('dir')},
                    {expand: true, src: ['assets/**'], dest: '../' + grunt.option('dir')},
                    {expand: true, src: ['data/**'], dest: '../' + grunt.option('dir')},
                ]
            },
        },
        processhtml: {
            options: {
                process: true,
                data: {
                    json: grunt.option('json'),
                    theme: grunt.option('theme')
                }
            },
            dist: {
                files: [
                    {expand: true, src: ['*.html'], dest: '../' + grunt.option('dir') + '/', ext: '.html'},
                ]
            },
        },
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: '*.js',
                    dest: '../' + grunt.option('dir') + '/js'
                }]
            }
        }
    });
    
    grunt.loadTasks('../node_modules/grunt-contrib-sass/tasks');
    grunt.loadTasks('../node_modules/grunt-contrib-watch/tasks');
    grunt.loadTasks('../node_modules/grunt-contrib-connect/tasks');

    grunt.loadTasks('../node_modules/grunt-contrib-jshint/tasks');

    grunt.loadTasks('../node_modules/grunt-contrib-copy/tasks');
    grunt.loadTasks('../node_modules/grunt-contrib-symlink/tasks');
    grunt.loadTasks('../node_modules/grunt-processhtml/tasks');
    grunt.loadTasks('../node_modules/grunt-contrib-uglify/tasks');
    
    grunt.registerTask('dev', ['connect', 'watch']);
    grunt.registerTask('dist', ['sass', 'copy', 'processhtml', 'uglify']);
};