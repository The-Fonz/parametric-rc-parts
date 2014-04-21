module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['./source/**/*.js',
            './source/**/*.less',
            './source/**/**/*.less'],
            
      tasks: ['less','concat']
    },

    less: {
      build: {
        src: 'source/stylesheets/style.less',
        dest: 'public/stylesheets/style.css'
      },
      options: {
        cleancss: false
      }
    },

    concat: {
      build: {
        src: ['source/javascripts/jquery-1.11.0.js',
              'source/javascripts/three.js',
              'source/javascripts/*.js'],

        dest: 'public/javascripts/bundle.min.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/javascripts/bundle.js',
        dest: 'public/javascripts/bundle.min.js'
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Watch for file changes, run with `grunt watch`
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['less','concat']);//,'uglify']);

};