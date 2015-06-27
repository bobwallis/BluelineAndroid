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
			blueline: {
				src:  ['app/src/webviews/less/blueline.less', 'app/src/webviews/less/ringingPractice.less'],
				dest: 'app/src/main/assets/webviews/blueline.css'
			}
		},
		uncss: {
			options: {
				ignore: [/:focus/]
			},
			about: {
				options: {
					ignore: [/html\.about.*/]
				},
				files: {
					'app/src/main/assets/webviews/about.css': ['app/src/main/assets/webviews/about.html']
				}
			},
			copyright: {
				options: {
					ignore: [/html\.copyright.*/]
				},
				files: {
					'app/src/main/assets/webviews/copyright.css': ['app/src/main/assets/webviews/copyright.html']
				}
			},
			custom: {
				options: {
					ignore: [/html\.custom.*/]
				},
				files: {
					'app/src/main/assets/webviews/custom.css': ['app/src/main/assets/webviews/custom.html']
				}
			},
			grids: {
				options: {
					ignore: [/html\.grids.*/]
				},
				files: {
					'app/src/main/assets/webviews/grids.css': ['app/src/main/assets/webviews/grids.html']
				}
			},
			practice: {
				options: {
					ignore: [/html\.practice.*/, /\.practice_container.*/]
				},
				files: {
					'app/src/main/assets/webviews/practice.css': ['app/src/main/assets/webviews/practice.html']
				}
			},
			prove: {
				options: {
					ignore: [/html\.prove.*/]
				},
				files: {
					'app/src/main/assets/webviews/prove.css': ['app/src/main/assets/webviews/prove.html']
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
			practice: {
				options: {
					'include': ['practice'],
					'mainConfigFile': 'app/src/webviews/js/practice.js',
					'out': 'app/src/main/assets/webviews/practice.js'
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
			options: {
				process: true,
				data: {
					localStorage_age: '20150627'
				}
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
					'app/src/main/assets/webviews/practice.js':  'app/src/main/assets/webviews/practice.js',
					'app/src/main/assets/webviews/prove.js':  'app/src/main/assets/webviews/prove.js'
				}
			}
		},
		clean: {
			all: {
				files: [
					{ src: 'app/src/main/assets/webviews/*.css' },
					{ src: 'app/src/main/assets/webviews/custom.js' },
					{ src: 'app/src/main/assets/webviews/grids.js' },
					{ src: 'app/src/main/assets/webviews/practice.js' },
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

	grunt.registerTask('dist', 'Build all.', [
		'copy', 'less', 'uncss', 'requirejs',         // Build and copy in all assets
		'cssmin', 'uglify', 'processhtml', 'htmlmin', // Minify everything
		'clean'
	]);

	grunt.registerTask('default', 'Build for distribution.', [
		'copy', 'less', 'requirejs', // Build and copy in all assets
	]);
};