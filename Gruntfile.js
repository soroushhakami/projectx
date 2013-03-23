module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        files: {
          'client/src/js/uglified.js': ['client/src/js/!(uglified).js']
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['client/src/js/vendor/*.js', 'client/src/js/uglified.js'],
        dest: 'client/dist/build.js'
      },
      src: {
        src: ['client/src/js/vendor/*.js', 'client/src/js/uglified.js'],
        dest: 'client/src/build.js'
      }
    },
    jshint: {
      all: ['*.js', 'client/src/js/!(uglified|templates).js']
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
          'client/dist/stylesheets/main.css': ['client/src/stylesheets/!(main).css']
        }
      },
      src: {
        files: {
          'client/src/stylesheets/main.css': ['client/src/stylesheets/!(main).css']
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
      stylesheets: {
        files: ['client/src/stylesheets/*.css', 'client/src/stylesheets/*.less'],
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