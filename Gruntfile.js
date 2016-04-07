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
          'app/server/spec/serverSpec.js'
        ]
      },
      chrome: {
        src: [
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
        tasks: ['jshint:chrome', 'mocha:chrome', 'mochaTest:chrome', 'build-chrome']
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
      },
      'chrome-popup': {
        src: ['./app/chrome/popup/**/*.js'],
        dest: './app/chrome/dist/popup.js'
      }
    },

    concat: {
      'chrome-vendors': {
        src: [
          './node_modules/jquery/dist/jquery.min.js'
        ],
        dest: './app/chrome/dist/vendors.js'
      }
    },

    jade: {
      prod: {
        options: {
          data: {
            url: 'https://keeping-tabs.herokuapp.com'
          }
        },
        files: {
          './chrome_ext/prod/background.html': './app/chrome/src/background.jade',
          './chrome_ext/prod/popup.html': './app/chrome/src/popup.jade'
        }
      },
      dev: {
        options: {
          data: {
            url: 'http://localhost:8080'
          }
        },
        files: {
          './chrome_ext/dev/background.html': './app/chrome/src/background.jade',
          './chrome_ext/dev/popup.html': './app/chrome/src/popup.jade'
        }
      }
    },

    copy: {
      prod: {
        expand: true,
        flatten: true,
        src: './app/chrome/src/keeping-tabsicon.png',
        dest: './chrome_ext/dev/'
      },
      dev: {
        expand: true,
        flatten: true,
        src: './app/chrome/src/keeping-tabsicon.png',
        dest: './chrome_ext/prod/'
      }
    }
  });
  grunt.registerTask('build-manifest', function() {
    // update manifest.json
    var manifestFile = './app/chrome/src/manifest.json';
    
    if (!grunt.file.exists(manifestFile)) {
      grunt.log.error('file ' + manifestFile + ' not found');
      return false;//return false to abort the execution
    }
    

    // Prepare Production manifest
    var manifestProd = grunt.file.readJSON(manifestFile);

    manifestProd['name'] = manifestProd.name + ' PROD';
    manifestProd['content_security_policy'] = 'script-src \'self\' https://keeping-tabs.herokuapp.com; object-src \'self\'';
    manifestProd['permissions'].push('https://keeping-tabs.herokuapp.com/*');

    grunt.file.write('./chrome_ext/prod/manifest.json', JSON.stringify(manifestProd, null, 2));

    // Prepare Production manifest
    var manifestDev = grunt.file.readJSON(manifestFile);

    manifestDev['name'] = manifestDev.name + ' DEV';
    manifestDev['content_security_policy'] = 'script-src \'self\' http://localhost:8080; object-src \'self\'';
    manifestDev['permissions'].push('http://localhost/*');

    grunt.file.write('./chrome_ext/dev/manifest.json', JSON.stringify(manifestDev, null, 2));
  });

  grunt.registerTask('build-chrome', [
    'browserify:chrome',
    'browserify:chrome-popup',
    'concat:chrome-vendors',
    'jade',
    'copy',
    'build-manifest'
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