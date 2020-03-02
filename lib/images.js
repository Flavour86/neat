'use strict';

const gulp = require('gulp4');

const conf = require('./config.js').config;
const c_paths = conf.paths;

function images(){
	return gulp.src(c_paths.src +'/**/*.{eot,svg,ttf,woff,woff2,jpg,png,gif}')
		.pipe(gulp.dest(c_paths.tmp))
}

module.exports = images;
