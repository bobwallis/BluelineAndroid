module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			gsirilWorker: {
				src:  'app/src/webviews/js/gsiril.worker.js',
				dest: 'app/src/main/assets/webviews/gsiril.worker.js'
			},
			html: {
				files: [{
					expand: true,
					flatten: true,
					src: 'app/src/webviews/html/*.html',
					dest: 'app/src/main/assets/webviews/'
				}]
			}
		},
		less: {
			options: {
				ieCompat: false,
				plugins: [
					new (require('less-plugin-autoprefix'))({browsers: ["Android > 0"]}),
					new require('less-plugin-inline-urls')
				]
			},
			all: {
				src:  'app/src/webviews/less/blueline.less',
				dest: 'app/src/main/assets/webviews/blueline.css'
			}
		},
		uncss: {
			options: {
				ignore: [':focus']
			},
			about: {
				files: {
					'app/src/main/assets/webviews/about.css': ['app/src/main/assets/webviews/about.html']
				}
			},
			copyright: {
				files: {
					'app/src/main/assets/webviews/copyright.css': ['app/src/main/assets/webviews/copyright.html']
				}
			}
		},
		requirejs: {
			options: {
				'findNestedDependencies': true,
				'baseUrl': 'app/src/webviews/js',
				'optimize': 'none',
				'onModuleBundleComplete': function (data) {
					var fs = require('fs'),
					amdclean = require('amdclean'),
					outputFile = data.path;
					fs.writeFileSync(outputFile, amdclean.clean({ 'filePath': outputFile }));
				}
			},
			grid: {
				options: {
					'include': ['grids'],
					'mainConfigFile': 'app/src/webviews/js/grids.js',
					'out': 'app/src/main/assets/webviews/grids.js'
				}
			},
			custom: {
				options: {
					'include': ['custom'],
					'mainConfigFile': 'app/src/webviews/js/custom.js',
					'out': 'app/src/main/assets/webviews/custom.js'
				}
			},
			prove: {
				options: {
					'include': ['prove'],
					'mainConfigFile': 'app/src/webviews/js/prove.js',
					'out': 'app/src/main/assets/webviews/prove.js'
				}
			}
		},
		cssmin: {
			all: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'app/src/main/assets/webviews/',
					src: ['**/*.css'],
					dest: 'app/src/main/assets/webviews/'
				}]
			}
		},
		processhtml: {
			all: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'app/src/main/assets/webviews/',
					src: ['**/*.html'],
					dest: 'app/src/main/assets/webviews/'
				}]
			}
		},
		htmlmin: {
			options: {
				removeComments: true,
				removeCommentsFromCDATA: true,
				removeEmptyAttributes: true,
				collapseWhitespace: true,
				keepClosingSlash: true,
			},
			all: {
				files: [{
					expand: true,
					flatten: true,
					cwd: 'app/src/main/assets/webviews/',
					src: ['**/*.html'],
					dest: 'app/src/main/assets/webviews/'
				}]
			}
		},
		uglify: {
			options: {
				preserveComments: false,
				screwIE8: true
			},
			all: {
				files: {
					'app/src/main/assets/webviews/custom.js': 'app/src/main/assets/webviews/custom.js',
					'app/src/main/assets/webviews/grids.js':  'app/src/main/assets/webviews/grids.js',
					'app/src/main/assets/webviews/prove.js':  'app/src/main/assets/webviews/prove.js'
				}
			}
		},
		clean: {
			all: {
				files: [
					{ src: 'app/src/main/assets/webviews/about.css' },
					{ src: 'app/src/main/assets/webviews/copyright.css' },
					{ src: 'app/src/main/assets/webviews/custom.js' },
					{ src: 'app/src/main/assets/webviews/prove.js' }
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', 'Build all.', [
		'copy', 'less', 'uncss', 'requirejs',         // Build and copy in all assets
		'cssmin', 'uglify', 'processhtml', 'htmlmin' // Minify everything
		//'clean'
	]);
};