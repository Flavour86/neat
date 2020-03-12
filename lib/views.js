'use strict';

const gulp = require('gulp4');
const fileinclude = require('gulp-file-include');
const htmlbeautify = require('gulp-html-beautify');

const conf = require('./config').config;
const c_paths = conf.paths;

function views(){
	return gulp.src(
			[
				c_paths.src + '/**/*.html',
				'!'+ c_paths.src + '/**/_*.html'
			]
		)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(htmlbeautify({
    		indentSize: 4
  		}))
		.pipe(gulp.dest(c_paths.tmp))
}

module.exports = views;
