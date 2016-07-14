'use strict';
module.exports = function(grunt) {
	var gc = {
		bp		:	'bower_components',
		css		:	'css',
		img		:	'images',
		font	:	'fonts',
		js		:	'js',
		locales	: 	'_locales',
		assets	:	'assets',
		src		:	'test',
		dev		:	'develop',
		test	:	'test'
	};
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'options.html': '<%= globalConfig.dev %>/options.html'
				}
			}
		},
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 5,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: ['<%= globalConfig.dev %>/<%= globalConfig.img %>/*.{png,jpg,gif,svg}'],
						dest: '<%= globalConfig.dev %>/<%= globalConfig.img %>/min/',
						filter : 'isFile'
					}
				]
			}
		},
		copy: {
			image: {
				files: [
					{
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/demicat.png"			:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/demicat.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/logo_demicolor.webp"	:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/logo_demicolor.webp",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/fi.png"					:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/fi.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/ld.png"					:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/ld.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/favicon.png"			:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/favicon.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/icon16.png"				:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/icon16.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/icon19.png"				:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/icon19.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/icon38.png"				:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/icon38.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/icon48.png"				:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/icon48.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/icon70.png"				:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/icon70.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/icon100.png"				:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/icon100.png",
						"<%= globalConfig.assets %>/<%= globalConfig.img %>/icon128.png"			:	"<%= globalConfig.dev %>/<%= globalConfig.img %>/min/icon128.png",
					}
				]
			}
		},
		less: {
			countmsg: {
				files :{
					'<%= globalConfig.assets %>/<%= globalConfig.css %>/count-msg.css' : [
							'<%= globalConfig.dev %>/<%= globalConfig.css %>/count-msg.less'
						]
				},
				options : {
					 compress: true,
					 ieCompat: false
				}
			},
			styles : {
				files :{
					'<%= globalConfig.assets %>/<%= globalConfig.css %>/styles.css' : [
							'<%= globalConfig.dev %>/<%= globalConfig.css %>/styles.less'
						]
				},
				options : {
					 compress: true,
					 ieCompat: false
				}
			},
			ddc: {
				files :{
					'<%= globalConfig.assets %>/<%= globalConfig.css %>/ddc.css' : [
							'<%= globalConfig.bp %>/codemirror/lib/codemirror.css',
							'<%= globalConfig.dev %>/<%= globalConfig.css %>/demicolor.less'
						]
				},
				options : {
					 compress: true,
					 ieCompat: false
				}
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			background: {
				src: [
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/libddc.js',
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/background.js'
				],
				dest: '<%= globalConfig.dev %>/<%= globalConfig.test %>/background.js'
			},
			option: {
				src: [
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/libddc.js',
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/options.js'
				],
				dest: '<%= globalConfig.dev %>/<%= globalConfig.test %>/options.js'
			},
			ddc: {
				src: [
					'<%= globalConfig.bp %>/code-prettify/src/prettify.js',
					'<%= globalConfig.bp %>/code-prettify/src/lang-ml.js',
					'<%= globalConfig.bp %>/code-prettify/src/lang-css.js',
					'<%= globalConfig.bp %>/code-prettify/src/lang-sql.js',
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/lang-as.js',
					'<%= globalConfig.bp %>/codemirror/lib/codemirror.js',
					'<%= globalConfig.bp %>/jquery/dist/jquery.js',
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/ddc-demicolor.js',
				],
				dest: '<%= globalConfig.dev %>/<%= globalConfig.test %>/ddc.js'
			}
		},
		uglify: {
			options: {
				beautify: false,
				mangle: true,
				keep_fnames: true
			},
			background: {
				src: '<%= globalConfig.dev %>/<%= globalConfig.test %>/background.js',
				dest: '<%= globalConfig.assets %>/<%= globalConfig.js %>/background.js'
			},
			option: {
				src: '<%= globalConfig.dev %>/<%= globalConfig.test %>/options.js',
				dest: '<%= globalConfig.assets %>/<%= globalConfig.js %>/options.js'
			},
			countmsg: {
				src: '<%= globalConfig.dev %>/<%= globalConfig.js %>/count-msg.js',
				dest: '<%= globalConfig.assets %>/<%= globalConfig.js %>/count-msg.js'
			},
			ddc: {
				src: '<%= globalConfig.dev %>/<%= globalConfig.test %>/ddc.js',
				dest: '<%= globalConfig.assets %>/<%= globalConfig.js %>/ddc.js'
			}
		},
		json_generator: {
			chrome: {
				dest: "manifest.json",
				options: {
					commands: {
						activate_tab_demi: {
							suggested_key: {
								windows: "Ctrl+Shift+D",
								mac: "Command+Shift+D",
								chromeos: "Ctrl+Shift+D",
								linux: "Ctrl+Shift+D"
							},
							description: "__MSG_keybord1__",
							global: true
						},
						_execute_browser_action: {
							suggested_key: {
								windows: "Ctrl+Shift+A",
								mac: "Command+Shift+A",
								chromeos: "Ctrl+Shift+A",
								linux: "Ctrl+Shift+A"
							}
						}
					},
					description: "__MSG_description__",
					author: "<%= pkg.author %>",
					manifest_version: 2,
					icons: {
						128: "assets/images/icon128.png",
						48: "assets/images/icon48.png",
						16: "assets/images/icon16.png"
					},
					homepage_url: "https://demiart.ru/forum/index.php?showtopic=231647",
					version: "<%= pkg.version %>",
					default_locale: "ru",
					options_page: "options.html",
					background: {
						scripts: [
							"assets/js/background.js"
						]
					},
					developer: {
						name: "<%= pkg.author %>"
					},
					permissions: [
						"*://demiart.ru/forum/*",
						"tabs",
						"contextMenus",
						"background"
					],
					browser_action: {
						default_icon: {
							19: "assets/images/icon19.png",
							38: "assets/images/icon38.png"
						},
						default_title: "__MSG_name__"
					},
					name: "__MSG_name__"
				}
			},
			opera: {
				dest: "manifest.json",
				options: {
					commands: {
						activate_tab_demi: {
							suggested_key: {
								windows: "Ctrl+Shift+D",
								mac: "Command+Shift+D",
								chromeos: "Ctrl+Shift+D",
								linux: "Ctrl+Shift+D"
							},
							description: "__MSG_keybord1__",
							global: true
						},
						_execute_browser_action: {
							suggested_key: {
								windows: "Ctrl+Shift+A",
								mac: "Command+Shift+A",
								chromeos: "Ctrl+Shift+A",
								linux: "Ctrl+Shift+A"
							}
						}
					},
					description: "__MSG_description__",
					author: "<%= pkg.author %>",
					manifest_version: 2,
					icons: {
						128: "assets/images/icon128.png",
						48: "assets/images/icon48.png",
						16: "assets/images/icon16.png"
					},
					homepage_url: "https://demiart.ru/forum/index.php?showtopic=231647",
					version: "<%= pkg.version %>",
					default_locale: "ru",
					options_page: "options.html",
					background: {
						scripts: [
							"assets/js/background.js"
						]
					},
					developer: {
						name: "<%= pkg.author %>"
					},
					permissions: [
						"*://demiart.ru/forum/*",
						"tabs",
						"contextMenus"
					],
					browser_action: {
						default_icon: {
							19: "assets/images/icon19.png",
							38: "assets/images/icon38.png"
						},
						default_title: "__MSG_name__"
					},
					name: "__MSG_name__"
				}
			}
		},
		'json-format': {
			main: {
				options: {
					indent: "\t",
					remove: ['_comment']
				},
				files: [
					{
						expand: true,
						cwd: '<%= globalConfig.dev %>/<%= globalConfig.locales %>/',
						src: ['**/*.json'],
						dest: '<%= globalConfig.dev %>/<%= globalConfig.test %>/<%= globalConfig.locales %>/',
						ext: '.json',
						extDot: 'first'
					}
				]
			}
		},
		unicode: {
			main: {
				
				files: [
					{
						expand: true,
						cwd: '<%= globalConfig.dev %>/<%= globalConfig.test %>/<%= globalConfig.locales %>/',
						src: ['**/*.json'],
						dest: '<%= globalConfig.locales %>/',
						ext: '.json',
						extDot: 'first'
					}
				]
			}
		},
		zip : {
			chrome : {
				src: [
					"manifest.json", "favicon.ico", "options.html", "<%= globalConfig.locales %>/**", "<%= globalConfig.assets %>/**"
				],
				dest: "chrome_<%= pkg.name %>_v<%= pkg.version %>.zip"
			},
			opera : {
				src: [
					"manifest.json", "index.html", "options.html", "<%= globalConfig.locales %>/**", "<%= globalConfig.assets %>/**"
				],
				dest: "opera_<%= pkg.name %>_v<%= pkg.version %>.zip"
			},
			develop : {
				src: [
					"manifest.json",
					"package.json",
					"bower.json",
					"favicon.ico",
					"gruntfile.js",
					"<%= globalConfig.dev %>/**/*"
				],
				dest : "develop_<%= pkg.name %>_v<%= pkg.version %>.zip"
			}
		}
	});
	grunt.registerTask('default', 	['imagemin', 'copy', 'htmlmin', 'concat', 'uglify', 'less', 'json-format', 'unicode', 'json_generator:chrome', 'zip:chrome', 'json_generator:opera', 'zip:opera', 'zip:develop']);
}