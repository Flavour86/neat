'use strict';

const gulp = require('gulp4');
const del = require('del');

const conf = require('./config.js').config;
const c_paths = conf.paths;
const c_images = conf.images;

function clean(){
	return del(c_paths.tmp)
}

function cleanBuild(){
	return del(c_paths.dist)
}

function cleanBase64(){
	return del([c_paths.dist+"/**"+c_images.base64Path])
}

function cleanSprites(){
	return del(c_paths.dist+"/**"+c_images.spritesPath)
}

module.exports = {
	clean: clean,
	cleanBuild: cleanBuild,
	cleanBase64: cleanBase64,
	cleanSprites: cleanSprites
}
