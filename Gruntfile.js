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
    concat: {}
  });

  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-mocha-test');
  // grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
};