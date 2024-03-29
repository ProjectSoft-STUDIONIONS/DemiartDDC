module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : {},
		pkg : grunt.file.readJSON('package.json'),
		imagemin: {
			options: {
				optimizationLevel: 3,
				svgoPlugins: [
					{
						removeViewBox: false
					}
				]
			},
			base: {
				files: [
					{
						expand: true,
						cwd: 'src/images', 
						src: ['**/*.{png,jpg,jpeg}'],
						dest: 'test/images/',
					}
				]
			}
		},
		tinyimg: {
			dynamic: {
				files: [
					{
						expand: true,
						cwd: 'test/images', 
						src: ['**/*.{png,jpg,jpeg}'],
						dest: 'addon/images/'
					}
				]
			}
		},
		less: {
			option: {
				options: {
					compress: false,
					ieCompat: false
				},
				files: {
					'test/css/options.css': [
						'bower_components/normalize.css/normalize.css',
						'src/less/options.less'
					]
				}
			},
			main: {
				options: {
					compress: false,
					ieCompat: false
				},
				files: {
					'test/css/main.css': 'src/less/main.less',
					'test/css/messages.css': 'src/less/messages.less'
				}
			}
		},
		group_css_media_queries: {
			group: {
				files: {
					'test/css/media/options.css': 'test/css/options.css',
					'test/css/media/main.css': 'test/css/main.css',
					'test/css/media/messages.css': 'test/css/messages.css'
				}
			}
		},
		replace: {
			css: {
				options: {
					patterns: [
						{
							match: /\/\*\!.+\*\//gm,
							replacement: ``
						}
					]
				},
				files: {
					'test/css/replace/options.css': 'test/css/media/options.css',
					'test/css/replace/main.css': 'test/css/media/main.css',
					'test/css/replace/messages.css': 'test/css/media/messages.css'
				}
			},
			html: {
				options: {
					patterns: [
						{
							match: /#has#/gm,
							replacement: ((new Date()).getTime())
						}
					]
				},
				files: {
					'addon/options.html': 'test/options.html'
				}
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					'addon/css/options.css': 'test/css/replace/options.css',
					'addon/css/main.css': 'test/css/replace/main.css',
					'addon/css/messages.css': [
						'test/css/replace/messages.css',
						'bower_components/codemirror/lib/codemirror.css'
					]
				}
			}
		},
		pug: {
			files: {
				options: {
					pretty: '',// '\t',
					separator: '',// '\n'
				},
				files: {
					"test/options.html": 'src/pug/options.pug',
				},
			},
		},
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: [
					'bower_components/jquery/dist/jquery.js'
				],
				dest: 'test/js/jquery.js',
			},
		},
		uglify : {
			options: {
				ASCIIOnly: true,
				compress: true,
			},
			main: {
				files: {
					'addon/js/background.js': [
						'src/js/lib.js',
						'src/js/background.js'
					],
					'addon/js/options.js': [
						'src/js/lib.js',
						'src/js/options.js'
					],
					'addon/js/messages.js': [
						'bower_components/codemirror/lib/codemirror.js',
						'bower_components/code-prettify/src/prettify.js',
						'bower_components/code-prettify/src/lang-ml.js',
						'bower_components/code-prettify/src/lang-css.js',
						'bower_components/code-prettify/src/lang-sql.js',
						'src/js/lang-as.js',
						'src/js/parser.js',
						'src/js/messages.js'
					],
				},
			},
		},
		copy: {
			locales: {
				files: [
					{
						expand: true,
						flatten : true,
						src: ['src/_locales/en/*.json'],
						dest: 'addon/_locales/en/',
						filter : 'isFile'
					},
					{
						expand: true,
						flatten : true,
						src: ['src/_locales/ru/*.json'],
						dest: 'addon/_locales/ru/',
						filter : 'isFile'
					},
					{
						expand: true,
						flatten : true,
						src: ['src/sound/*.ogg'],
						dest: 'addon/sound/',
						filter : 'isFile'
					}
				]
			},
			favicon: {
				files: {
					'addon/favicon.ico': ['src/images/favicon.ico'],
					'addon/manifest.json': ['src/manifest.json']
				}
			},
		},
	});
	grunt.registerTask('default',
		[
			'copy',
			'imagemin',
			'tinyimg',
			'concat',
			'uglify',
			'less',
			'group_css_media_queries',
			'replace:css',
			'cssmin',
			'pug',
			'replace:html'
		]
	);
	grunt.registerTask('speed',
		[
			'copy',
			'concat',
			'uglify',
			'less',
			'group_css_media_queries',
			'replace:css',
			'cssmin',
			'pug',
			'replace:html'
		]
	);
}