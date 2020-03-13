'use strict';

const gulp = require('gulp4');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const tinypng = require('gulp-tinypng-nokey');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const htmlbeautify = require('gulp-html-beautify');
const rev = require("gulp-rev");
const revReplace = require("gulp-rev-replace");
const through = require('through2');
const modify = require('modify-filename');
const conf = require('./config').config;
const c_paths = conf.paths;

//new postcss
const postcss = require('gulp-postcss');
const pcss = require('postcss');
const cssnano = require('cssnano');
const sprites = require('postcss-sprites');
const url = require('postcss-url');
const processors = [
	url({
		filter: (data) => {
			const url = data.url
			if(url.indexOf(conf.images.base64Path) > -1) {
				return data
			}
		},
		url: 'inline'
	}),
	sprites({
		spritePath: conf.paths.dist + '/' + conf.folders.images,
		filterBy: function(image) {
			if (image.url.indexOf(conf.images.spritesPath) < 0) { //只对_sprites目录下拼图
				return Promise.reject();
			}
			return Promise.resolve();
		},
		hooks: {
			onUpdateRule: function (rule, token, image) {
				const backgroundImage = pcss.decl({
					prop: 'background-image',
					value: 'url(' + image.spriteUrl.replace('../' + conf.paths.dist + '/', '') + ')'
				});
				const backgroundSize = pcss.decl({
					prop: 'background-size',
					value: image.spriteWidth + 'px ' + image.spriteHeight + 'px'
				});
				const backgroundPosition = pcss.decl({
					prop: 'background-position',
					value: `-${image.coords.x}px -${image.coords.y}px`
				});
				rule.insertAfter(token, backgroundImage);
				rule.insertAfter(backgroundImage, backgroundPosition);
				rule.insertAfter(backgroundPosition, backgroundSize);
			}
		},
		spritesmith: {
			algorithm: 'top-down', // 拼图方向。智能binary-tree（默认值），从上到下top-down，从左到右left-right，从左上到右下diagonal，从右上到左下alt-diagonal
			padding: 10 //图片间距，单位：px
		}
	}),
	cssnano({
		'postcss-zindex': false,
		'postcss-reduce-idents': false,
		safe: true,
		discardComments: {
			removeAll: true
		}
	})
];



function buildViews(){
	const manifest = gulp.src((c_paths.tDist || c_paths.dist) + "/rev-manifest.json");
	return gulp.src(
			[
				c_paths.tmp +'/**/*.html'
			]
		)
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', cleanCss()))
		.pipe(htmlbeautify({
    		indentSize: 2
  		}))
		.pipe(revReplace({
			manifest: manifest,
			prefix: c_paths.tDist ? '/' + conf.paths.dist : ''
		}))
		.pipe(gulp.dest(c_paths.tDist || c_paths.dist))
}

function buildStyles(){
	return gulp.src(c_paths.tmp +'/**/*.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest(c_paths.dist))
		// .pipe(rev.manifest())
		// .pipe(gulp.dest(c_paths.tDist || c_paths.dist))
		//.pipe(gulp.dest(c_paths.dist +'/**/*.min.css'))
}

function buildScripts(){
	if (c_paths.tDist) {
		return Promise.resolve()
	}
	return gulp.src(c_paths.tmp +'/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(c_paths.dist))
}

function revResource () {
	return gulp.src([c_paths.tmp +'/**/*.js', c_paths.tmp +'/**/*.css', c_paths.tmp +'/**/*.{jpg,png,gif}'])
		.pipe(rev())
		.pipe(through.obj(function (file, enc, cb) {
			file.path = modify(file.revOrigPath, function (name, ext) {
				return name + ext;
			}); //=> 'project_manage_4ad9f04399.min.js

			cb(null, file);
		}))
		.pipe(rev.manifest())
		.pipe(gulp.dest(c_paths.tDist || c_paths.dist))
}

function buildImages(){
	return gulp.src(c_paths.tmp +'/**/*.{jpg,png,gif}')
		.pipe(gulp.dest(c_paths.tmp))
		.pipe(gulp.dest(c_paths.dist))
}

function buildImagesTiny(){
	return gulp.src(c_paths.tmp +'/**/*.{jpg,png,gif}')
		.pipe(tinypng())
		.pipe(gulp.dest(c_paths.tmp))
		.pipe(gulp.dest(c_paths.dist))
}

function buildFonts(){
	return gulp.src(c_paths.tmp +'/**/*.{eot,svg,ttf,woff,woff2}')
		.pipe(gulp.dest(c_paths.dist))

}

module.exports = {
	views: buildViews,
	styles: buildStyles,
	scripts: buildScripts,
	images: buildImages,
	fonts: buildFonts,
	revResource: revResource,
	imagesTiny: buildImagesTiny
};
