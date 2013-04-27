module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                files: {
                    'client/dist/js/uglified_src.js': ['client/src/js/*.js']
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['client/src/js/vendor/*.js', 'client/dist/js/uglified_src.js'],
                dest: 'client/dist/js/build.js'
            }
        },
        jshint: {
            all: ['*.js', 'client/src/js/!(templates).js']
        },
        less: {
            production: {
                options: {
                    yuicompress: true
                },
                files: {
                    'client/src/stylesheets/lesscompiled.css': 'client/src/stylesheets/*.less'
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    'client/dist/stylesheets/main.css': ['client/src/stylesheets/*.css']
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "JST"
                },
                files: {
                    "client/src/js/templates.js": ["views/clientside/*.hbs"]
                }
            }
        },
        watch: {
            scripts: {
                files: ['client/src/js/*.js', 'views/clientside/*.hbs'],
                tasks: ['jshint', 'handlebars', 'uglify', 'concat']
            },
            cssstylesheets: {
                files: ['client/src/stylesheets/!(main).css'],
                tasks: ['cssmin']
            },
            lessstylesheets: {
                files: ['client/src/stylesheets/*.less'],
                tasks: ['less', 'cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    grunt.registerTask('default', ['less', 'cssmin', 'jshint', 'handlebars', 'uglify', 'concat']);
};