module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			grid: {
				options: {
					'findNestedDependencies': true,
					'baseUrl': 'app/src/main/assets/js',
					'optimize': 'none',
					'include': ['grids'],
					'mainConfigFile': 'app/src/main/assets/js/grids.js',
					'out': 'app/src/main/assets/js/grids.built.js',
					'onModuleBundleComplete': function (data) {
						var fs = require('fs'),
						amdclean = require('amdclean'),
						outputFile = data.path;
						fs.writeFileSync(outputFile, amdclean.clean({ 'filePath': outputFile }));
					}
				}
			},
			custom: {
				options: {
					'findNestedDependencies': true,
					'baseUrl': 'app/src/main/assets/js',
					'optimize': 'none',
					'include': ['custom'],
					'mainConfigFile': 'app/src/main/assets/js/custom.js',
					'out': 'app/src/main/assets/js/custom.built.js',
					'onModuleBundleComplete': function (data) {
						var fs = require('fs'),
						amdclean = require('amdclean'),
						outputFile = data.path;
						fs.writeFileSync(outputFile, amdclean.clean({ 'filePath': outputFile }));
					}
				}
			},
			prove: {
				options: {
					'findNestedDependencies': true,
					'baseUrl': 'app/src/main/assets/js',
					'optimize': 'none',
					'include': ['prove'],
					'mainConfigFile': 'app/src/main/assets/js/prove.js',
					'out': 'app/src/main/assets/js/prove.built.js',
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