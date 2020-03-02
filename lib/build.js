'use strict';

const gulp = require('gulp4');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const tinypng = require('gulp-tinypng-nokey');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const htmlbeautify = require('gulp-html-beautify');

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
			const re = /images\/_base64/gi
			if(re.test(url)) {
				return data
			}
		},
		url: 'inline'
	}),
	sprites({
		spritePath: './dist/images',
		filterBy: function(image) {
			if (image.url.indexOf('/_sprites')===-1) { //只对_sprites目录下拼图
				return Promise.reject();
			}
			return Promise.resolve();
		},
		hooks: {
			onUpdateRule: function (rule, token, image) {
				const backgroundImage = pcss.decl({
					prop: 'background-image',
					value: 'url(' + image.spriteUrl.replace('../dist/', '') + ')'
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
		.pipe(gulp.dest(c_paths.dist))
}

function buildStyles(){
	return gulp.src(c_paths.tmp +'/**/*.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest(c_paths.dist))
		//.pipe(gulp.dest(c_paths.dist +'/**/*.min.css'))
}

function buildScripts(){
	return gulp.src(c_paths.tmp +'/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(c_paths.dist))
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
	imagesTiny: buildImagesTiny
};
