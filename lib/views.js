'use strict';

const gulp = require('gulp4');
const fileinclude = require('gulp-file-include');
const htmlbeautify = require('gulp-html-beautify');

const conf = require('./config').config;
const config = require('./config');
const c_paths = conf.paths;

function views(pathFile){
	let source = [
		c_paths.src + '/**/*.html',
		'!'+ c_paths.src + '/**/_*.html'
	]
	let dest = c_paths.tmp
	if (pathFile && typeof pathFile === 'string' && !/[\/|\\]_[^\/|\\]+$/.test(pathFile)) {
    source = pathFile
    dest = c_paths.tmp + '/' + conf.folders.html
	}
	return gulp.src(
			source
		)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(htmlbeautify({
    		indentSize: 4
  		}))
		.pipe(gulp.dest(dest))
}

module.exports = views;
