module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        files: {
          'client/dist/build.js': ['client/src/js/vendor/*.js', 'client/src/js/*.js']
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['client/src/js/vendor/*.js', 'client/src/js/*.js'],
        dest: 'client/src/build.js'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'app.js', 'client/src/js/!(templates).js']
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
        files: ['app.js', 'client/src/js/*.js', 'client/src/stylesheets/*.less'],
        tasks: ['jshint', 'less', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  grunt.registerTask('default', ['less', 'jshint', 'handlebars', 'concat']);
  grunt.registerTask('build', ['jshint', 'less', 'concat', 'handlebars', 'uglify']);
};