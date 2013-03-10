module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: ['client/src/js/*.js'],
        dest:['build.js']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'client/**/**/*.js']
    },
    'closure-compiler': {
      closurePath: '/Users/soroushhakami/dev/lib',
      frontend: {
        js: ['client/src/js/*.js'],
        jsOutputFile: ['build.js']
      }
    },
    less: {
      development: {
        files: {
          'client/src/stylesheets/main.css': 'client/src/stylesheets/*.less'
        }
      },
      production: {
        options: {
          yuicompress: true
        },
        files: {
          'client/dist/stylesheets/main.css': 'client/src/stylesheets/*.less'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-contrib-less');


  // Default task(s).
  grunt.registerTask('default', ['jshint', 'less']);

};