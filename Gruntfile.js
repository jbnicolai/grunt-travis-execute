module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options:{
        jshintrc: 'jshintconfig.json'
      },
      all:['Gruntfile.js', 'tasks/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);
};
