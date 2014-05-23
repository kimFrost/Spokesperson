/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		banner: '',
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			head: {
				src: [
					//'js/libs/jquery-2.0.3.min.js',
					//'js/libs/html5shiv.js',
					//'js/libs/jquery-1.11.0.min.js',
					//'js/libs/mediaelement-and-player.js',
					//'js/libs/swfobject.js',
					'js/libs/timestring-0.0.22.js'
				],
				dest: '../scripts/timestring-0.0.22.js'
			},
			enligthen: {
				src: [
					'js/libs/enlighten-0.0.1.js'
				],
				dest: '../scripts/enlighten-0.0.1.js'
			},
			app: {
				src: [
					'js/setup.js'
				],
				dest: '../scripts/spokesperson.js'
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			head: {
				src: '<%= concat.head.dest %>',
				dest: '../scripts/timestring-0.0.22.min.js'
			},
			enligthen: {
				src: '<%= concat.head.dest %>',
				dest: '../scripts/enlighten-0.0.1.min.js'
			},
			app: {
				src: '<%= concat.app.dest %>',
				dest: '../scripts/spokesperson.min.js'
			}
		},
		compass: {
			dist: {
				options: {
					config: 'config.rb'
					//noLineComments: false
				}
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: '../css/',
				src: ['*.css', '!*.min.css', '!Icon*.css', '!RTE*.css'],
				dest: '../css/',
				ext: '.min.css'
			}
		},
		copy: {
			main: {
				files: [
					{ expand: true, cwd: 'img/', src: ['**', '!**/*.db', '!*.db'], dest: '../img/' },
					{ expand: true, cwd: 'fonts/', src: ['**'], dest: '../fonts/' },
					{ expand: true, cwd: 'icons/', src: ['*.svg', '*.eot', '*.woff', '*.ttf'], dest: '../fonts/' }
				]
			}
		},
		watch: {
			scripts: {
				files: ['<%= concat.app.src %>',
					'<%= concat.head.src %>'],
				tasks: ['concat']
			},
			images: {
				files: ['img/**',
					'img/**/*'],
				tasks: ['copy']
			},
			styles: {
				files: ['scss/**',
					'scss/**/*'
					],
				tasks: ['compass']
			},
			jade: {
				files: ["views/*.jade","views/pages/*.jade"],
				tasks: ["jade"]
			}
		},
		jade: {
			compile: {
				options: {
					pretty: true,
					data: {
						debug: false
					}
				},
				files: [ {
					cwd: "views/pages",
					src: "**/*.jade",
					dest: "../",
					expand: true,
					ext: ".html"
				} ]
			}
		},
		cactuspilot: {
			dist: {
				options: {

				},
				files: {
					'../cactus/': '../css/spokesperson.css'
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-cactuspilot');
	// Default task.
	grunt.registerTask('default', ['concat', 'uglify', 'copy', 'compass', 'cssmin']);
	grunt.registerTask('dev', ['concat', 'copy', 'compass', 'watch']);
	grunt.registerTask('cactus', ['cactuspilot']);
	grunt.registerTask('renderview', ['jade']);
};