module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('../package.json'),

        sass: {
            default: {
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
        copy: {
            dist: {
                files: [
                    {expand: true, src: ['css/**'], dest: 'dist/' + grunt.option('dir')},
                    {expand: true, src: ['js/**'], dest: 'dist/' + grunt.option('dir')},
                    {expand: true, src: ['assets/**'], dest: 'dist/' + grunt.option('dir')},
                    {expand: true, src: ['data/**'], dest: 'dist/' + grunt.option('dir')},
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
                    {expand: true, src: ['*.html'], dest: 'dist/' + grunt.option('dir') + '/', ext: '.html'},
                ]
            },
        },
        symlink: {
            options: {
                overwrite: true
            },
            build: {
                src: '../shared',
                dest: 'dist/' + grunt.option('dir') + '/shared'
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
    
    grunt.registerTask('dev', ['connect', 'watch']);
    grunt.registerTask('dist', ['sass', 'copy', 'processhtml', 'symlink']);
};