module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    mochaTest: {
      // test: {
      //   options: {
      //     reporter: 'spec'
      //   },
      //   src: ['test/**/*.js']
      // }
    },
    
    nodemon: {
      dev: {
        script: './app/server/index.js'
      }
    },

    jshint: {
      
      files: [
        './app/server/**/*.js', // server
        './app/client/**/*.js', // client
        './app/chrome/scripts/**/*.js', // chrome extension scripts
        './Gruntfile.js'
      ],

      options: {
        force: 'true',
        jshintrc: './.jshintrc',
        ignores: [
          
        ]
      },

      chrome: {
        options: {
          globals: {
            $: false,
            chrome: false
          }
        },
        files: {
          src: ['./app/chrome/scripts/**/*.js']
        }
      },

      server: {
        files: {
          src: ['./app/server/**/*.js']
        }
      },

      client: {
        files: {
          src: ['./app/client/**/*.js']
        }
      }
    },

    watch: {},
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

  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha-test');
  // grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  
  grunt.registerTask('build-chrome', [
    'jshint:chrome',
    'concat:chrome',
    'concat:chrome-vendors'
  ]);

  grunt.registerTask('build', [
    'build-chrome'
  ]);
};