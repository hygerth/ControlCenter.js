module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		githooks: {
			all: {
				'pre-commit': 'test'
			}
		},

		jscs: {
			src: "."
		}
	});

	grunt.loadNpmTasks('grunt-jscs-checker');

	grunt.registerTask('test', ['jscs']);

}
