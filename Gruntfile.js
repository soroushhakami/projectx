module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        files: {
            'client/dist/js/build.js': ['client/src/js/*.js']
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'client/src/**/*.js']
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
    },
    watch: {
      scripts: {
        files: ['client/src/js/*.js', 'client/src/stylesheets/*.less'],
        tasks: ['jshint', 'less', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Default task(s).
  grunt.registerTask('default', ['jshint', 'less', 'uglify']);

};