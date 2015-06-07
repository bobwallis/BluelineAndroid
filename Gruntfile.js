module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			js: {
				options: {
					'findNestedDependencies': true,
					'baseUrl': 'app/src/main/assets/js',
					'optimize': 'none',
					'include': ['main'],
					'mainConfigFile': 'app/src/main/assets/js/main.js',
					'out': 'app/src/main/assets/js/main.built.js',
					'onModuleBundleComplete': function (data) {
						var fs = require('fs'),
						amdclean = require('amdclean'),
						outputFile = data.path;
						fs.writeFileSync(outputFile, amdclean.clean({ 'filePath': outputFile }));
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', 'Build all.', ['requirejs']);
};