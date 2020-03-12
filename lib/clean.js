'use strict';

const gulp = require('gulp4');
const del = require('del');
const path = require('path')

const conf = require('./config.js').config;
const c_paths = conf.paths;
const c_images = conf.images;

function clean(){
	return del(c_paths.tmp)
}

function cleanBuild(){
	if (c_paths.tDist) {
		return cleanTemplate()
	}
	return del(c_paths.dist, {
		force: true
	})
}

function cleanTemplate() {
	return del(c_paths.tDist, {
		force: true
	})
}

function cleanBase64(){
	return del(c_paths.dist+"/**/"+c_images.base64Path, {
		force: true
	})
}

function cleanSprites(){
	return del(c_paths.dist+"/**/"+c_images.spritesPath, {
		force: true
	})
}

function cleanManifest () {
	const manifest = (c_paths.tDist || c_paths.dist) + "/rev-manifest.json"
	return del(manifest, {
		force: true
	})
}

module.exports = {
	clean: clean,
	cleanTemplate: cleanTemplate,
	cleanBuild: cleanBuild,
	cleanBase64: cleanBase64,
	cleanSprites: cleanSprites,
	cleanManifest: cleanManifest
}
