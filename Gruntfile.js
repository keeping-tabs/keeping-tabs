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
        jshintrc: true
      },

      tests: {
        options: {
          jshintrc: './.jshintrc_spec'
        },
        files: {
          src: ['./app/**/spec/*.js']
        }
      },

      chrome: {
        files: {
          src: [
            './app/chrome/scripts/**/*.js',
            '!./app/chrome/scripts/spec/*.js'
          ]
        }
      },

      server: {
        files: {
          src: [
            './app/index.js',
            './app/server/**/*.js',
            '!./app/server/spec/*.js'
          ]
        }
      },

      client: {
        files: {
          src: [
            './app/client/src/**/*.js',
            '!./app/client/spec/*.js'
          ]
        }
      }
    },

    watch: {
      chrome: {
        files: [
          './app/chrome/**/*.js',
          '!./app/chrome/dist/*.js',
          './app/chrome/**/*.css',
          '!./app/chrome/dist/*.css'
        ],
        tasks: ['jshint:chrome', 'mocha:chrome', 'mochaTest:chrome', 'build-chrome']
      },
      server: {
        files: ['./app/server/**/*.js', './app/index.js'],
        tasks: ['jshint:server', 'mochaTest:server']
      },
      client: {
        files: ['./app/client/**/*.js'],
        tasks: ['jshint:client', 'build-client']
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
      },
      client: {
        src: ['./app/client/src/**/*.js'],
        dest: './app/client/dist/app.js'
      }
    },

    concat: {
      'chrome-vendors': {
        src: [
          './node_modules/jquery/dist/jquery.min.js'
        ],
        dest: './app/chrome/dist/vendors.js'
      },
      'client': {
        src: [
          './node_modules/angular/angular.min.js'
        ],
        dest: './app/client/dist/vendors.js'
      }
    },

    ejs: {
      prod: {
        options: {
          url: 'https://keeping-tabs.herokuapp.com'
        },
        src: [
          './app/chrome/src/background.ejs',
          './app/chrome/src/popup.ejs'
        ],
        expand: true,
        flatten: true,
        dest: './chrome_ext/prod/',
        ext: '.html'
      },
      dev: {
        options: {
          url: 'http://localhost:8080'
        },
        src: [
          './app/chrome/src/background.ejs',
          './app/chrome/src/popup.ejs'
        ],
        expand: true,
        flatten: true,
        dest: './chrome_ext/dev/',
        ext: '.html'
      }
    },
    
    cssmin: {
      'chrome-popup': {
        files: {
          './app/chrome/dist/popup.css': [
            './node_modules/tachyons/css/tachyons.min.css',
            './app/chrome/popup/popup.css'
          ]
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
      },
      client: {
        expand: true,
        cwd: './app/client/src/',
        src: ['**/*.html'],
        dest: './app/client/dist/'
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
    'cssmin:chrome-popup',
    'ejs',
    'copy',
    'build-manifest'
  ]);

  grunt.registerTask('build-client', [
    'browserify:client',
    'concat:client',
    'copy:client'
  ]);

  grunt.registerTask('build', [
    'build-chrome',
    'build-client'
  ]);
  
  grunt.registerTask('default', [
    'jshint',
    'mochaTest',
    'mocha',
    'build' ,
    'watch'
  ]);
};