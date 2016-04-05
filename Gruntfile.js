module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      server: {
        src: [
          'app/server/spec/serverSpec.js',
          'app/chrome/spec/chromeSpec.js'
        ]
      }
    },

    mocha: {
      chrome: {
        // include html spec files here
        src: [
          'app/chrome/spec/spec.html',
        ]
      },
      options: {
        reporter: 'spec',
        run: true
      },
    },
    
    nodemon: {
      dev: {
        script: './app/index.js'
      }
    },

    jshint: {
      options: {
        force: 'true',
        jshintrc: './.jshintrc'
      },

      all: {
        files: {
          src: [
            './app/server/**/*.js', // server
            './app/client/**/*.js', // client
            './app/chrome/scripts/**/*.js', // chrome extension scripts
            './Gruntfile.js'
          ]
        }
      },

      chrome: {
        files: {
          src: ['./app/chrome/scripts/**/*.js']
        }
      },

      server: {
        files: {
          src: ['./app/server/**/*.js', './app/server/index.js']
        }
      },

      client: {
        files: {
          src: ['./app/client/**/*.js']
        }
      }
    },

    watch: {
      chrome: {
        files: ['./app/chrome/scripts/**/*.js'],
        tasks: ['jshint:chrome', 'mocha:chrome', 'build-chrome']
      },
      server: {
        files: ['./app/server/**/*.js', './app/server/index.js'],
        tasks: ['jshint:server', 'mochaTest:server']
      },
      client: {
        files: ['./app/client/**/*.js'],
        tasks: ['jshint:client']
      }
    },

    browserify: {
      chrome: {
        src: ['./app/chrome/scripts/**/*.js'],
        dest: './app/chrome/dist/script.js'
      }
    },

    concat: {
      chrome: {
        src: ['./app/chrome/scripts/**/*.js'],
        dest: './app/chrome/dist/script.js'
      },
      'chrome-vendors': {
        src: [
          './node_modules/jquery/dist/jquery.min.js'
        ],
        dest: './app/chrome/dist/vendors.js'
      }
    }
  });
  
  grunt.registerTask('build-chrome', [
    'browserify:chrome',
    'concat:chrome-vendors'
  ]);

  grunt.registerTask('build', [
    'build-chrome'
  ]);
  
  grunt.registerTask('default', [
    'jshint',
    'mochaTest',
    'mocha',
    'build' ,
    'watch'
  ]);
};