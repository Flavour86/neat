'use strict';

const gulp = require('gulp4');

const conf = require('./config.js').config;
const c_paths = conf.paths;

function scripts(){
	return gulp.src(c_paths.src +'/**/*.{js,json}')
		.pipe(gulp.dest(c_paths.tmp))
}

module.exports = scripts;
