'use strict';

const gulp = require('gulp4');

//new postcss
const path = require('path')
const postcss = require('gulp-postcss');
const precss = require('precss');
const easyImport = require('postcss-easy-import')
const alpha = require('postcss-color-rgba-fallback');
const opacity = require('postcss-opacity');
const each = require('postcss-each')
const autoprefixer = require('autoprefixer');
const rucksack = require('rucksack-css');
const pxtoviewport = require('postcss-px-to-viewport');

const conf = require('./config.js').config;
const c_paths = conf.paths
const server = require('./server');
const processors = [
	easyImport({
		glob: true
	}),
	each(),
	precss(),
	rucksack(),
	alpha(),
	opacity(),
	autoprefixer({
		browsers: ['last 2 versions', 'Android >= 4', 'iOS >= 7']
	})
];
if (conf.isMobile) {
	processors.push(pxtoviewport({
		viewportWidth: 750,
		unitPrecision: 3,
		viewportUnit: "vw",
		selectorBlackList: ['.ignore-', '.hairlines-'],
		minPixelValue: 1,
		mediaQuery: false
	}))
}

function styles(pathFile){
	let source = [
		c_paths.src + '/' + conf.folders.css + '/**/*.css',
		c_paths.src + '/' + conf.folders.cssLib + '/*.css',
		'!'+ c_paths.src + '/' + conf.folders.css + '/**/_*.css'
	]
	let dest = c_paths.tmp + '/' + conf.folders.css
	if (pathFile && typeof pathFile === 'string') {
		pathFile = pathFile.split(path.sep).slice(0, -1)
		const dir = pathFile.join('/');
		if (dir.indexOf(conf.folders.css + '/' + conf.folders.cssCommon) > -1 && dir.indexOf(conf.folders.cssVariable) === -1) {
			source = path.join(c_paths.src, conf.folders.css, 'index.css')
			dest = path.join(c_paths.tmp, conf.folders.css)
		} else if (dir.indexOf(conf.folders.css) > -1 && dir.indexOf('/' + conf.folders.cssCommon) === -1) {
			source = [
				path.join(c_paths.src, dir, '/**/*.css'),
				'!'+c_paths.src + '/**/_*.css'
			]
			dest = path.join(c_paths.tmp, dir)
		} else if (dir.indexOf(c_paths.src + '/' + conf.folders.cssLib) > -1) {
			let source = [
				c_paths.src + '/' + conf.folders.cssLib + '/*.css'
			]
			dest = c_paths.tmp + '/' + conf.folders.css
		}
	}
	return gulp.src(source)
	.pipe(postcss(processors))
	.on("error", err => {
		console.error(err, 'err');
	})
	.pipe(gulp.dest(dest))
	.pipe(server.reload({stream:true}))
}

module.exports = styles;
