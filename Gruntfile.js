module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		githooks: {
			all: {
				'pre-commit': 'test'
			}
		},

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				sub: true,
				reporter: require('jshint-stylish')
			}
		},

		jscs: {
			src: ['*.js', 'public/js/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-githooks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs-checker');

	grunt.registerTask('test', ['jshint', 'jscs']);

}
