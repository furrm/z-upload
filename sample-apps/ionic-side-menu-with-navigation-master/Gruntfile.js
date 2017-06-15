module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowercopy: {
	    options: {
	        srcPrefix: 'bower_components'
	    },
        // Javascript
	    scripts: {
	        options: {
	            destPrefix: 'www/js/vendor'
	        },
	        files: {
	            'angular/angular.min.js': 'angular/angular.min.js',
   	            'angular-animate/angular-animate.min.js': 'angular-animate/angular-animate.min.js',
   	            'angular-sanitize/angular-sanitize.min.js': 'angular-sanitize/angular-sanitize.min.js',
   	            'angular-ui-router/release/angular-ui-router.min.js': 'angular-ui-router/angular-ui-router.min.js',
	            'ionic/release/js/ionic-angular.min.js': 'ionic/ionic-angular.min.js',
  	            'ionic/release/js/ionic.min.js': 'ionic/ionic.min.js'
	        }
	    },
	    // Less
        less: {
            options: {
                destPrefix: 'fonts'
            },
            files: {
                // If either the src or the dest is not present,
                // the specified location will be used for both.
                // In other words, this will copy
                // 'bower_components/bootstrap/less/dropdowns.less' to 'less/bootstrap/less/dropdowns.less'
                // See http://gruntjs.com/configuring-tasks#files for recommended files formats
                src: 'ionic/release/fonts/ionicons.eot'
            }
        }
    }
  });

  // Load the plugin that provides the "bower-copy" task.
  grunt.loadNpmTasks('grunt-bowercopy');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);

};