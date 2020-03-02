'use strict';

const gulp = require('gulp4');
const browserSync = require('browser-sync');
const bsCreate = browserSync.create();

const conf = require('./config.js').config;
const c_paths = conf.paths;

module.exports = {
	reload: bsCreate.reload,
	dev: ()=>{
		bsCreate.init({
			server: {
				baseDir: c_paths.tmp,
				directory: true,
			}
		});
	}
}
