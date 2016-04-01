module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
      }
    },

    watch: {},
    concat: {
      chrome: {
        src: ['./app/chrome/scripts/**/*.js'],
        dest: './app/chrome/dist/script.js'
      },
      vendors: {
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
  // grunt.loadNpmTasks('grunt-mocha-test');
  // grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('build', [
    'jshint',
    'concat'
  ]);
};