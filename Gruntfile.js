module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
          'app/server/spec/**/*.js',
          'app/client/spec/**/*.js',
          'app/chrome/spec/**/*.js',
          'app/chrome_ext/spec/**/*.js',
        ]
      }
    },

    mocha: {
      all: {
        // include html spec files here
        // src: ['browser tests/spec.html'],
      },
      options: {
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
        tasks: ['jshint:chrome', 'build-chrome']
      },
      server: {
        files: ['./app/server/**/*.js', './app/server/index.js'],
        tasks: ['jshint:server']
      },
      client: {
        files: ['./app/client/**/*.js'],
        tasks: ['jshint:client']
      },
      scripts: {
        files: ['**/*.js'],
        tasks: ['mochaTest'/*, 'mocha'*/],
      },
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
    'concat:chrome',
    'concat:chrome-vendors'
  ]);

  grunt.registerTask('build', [
    'build-chrome'
  ]);
  
  grunt.registerTask('default', [
    'jshint',
    // 'mochaTest',
    'build' ,
    'watch'
  ]);
};