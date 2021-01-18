'use strict';

const gulp = require('gulp4');
const fs = require('fs');

const conf = require('./config.js').config;
const c_paths = conf.paths;

const views = require('./views');
const styles = require('./styles');
const scripts = require('./scripts');
const images = require('./images');
const server = require('./server');
function watch() {
	// let dirList = fs.readdirSync(c_paths.src);
  const watcher = gulp.watch(c_paths.src)
  setTimeout(() => {
    watcher.on('add', function(path){
      WatchEvent.apply(this, ['add', path, server.reload])
    })
    watcher.on('change', function(path){
      WatchEvent.apply(this, ['change', path, server.reload])
    })
    watcher.on('unlink', function(path){
      WatchEvent.apply(this, ['unlink', path, server.reload])
    })
  })
	// dirList.forEach((dir) => {
	// 	if(fs.statSync(c_paths.src + '/' + dir).isDirectory()){
	// 		WatchEvent(gulp.watch(dir + '/**/*.html',{cwd: c_paths.src}), views, server.reload);
	// 		WatchEvent(gulp.watch(dir + '/**/*.css', {cwd: c_paths.src}), styles, server.reload);
	// 		WatchEvent(gulp.watch(dir + '/**/*.{js,json}', {cwd: c_paths.src}), scripts, server.reload);
	// 		WatchEvent(gulp.watch(dir + '/**/*.{jpg,png,gif}', {cwd: c_paths.src}), images, server.reload);
	// 	}
	// })
}

// function WatchEvent(fn, task, action){
function WatchEvent(type, filePath, action){
	const self = this
  const extendMap = {
    css: styles,
    html: views,
    js: scripts,
    json: scripts,
    png: images,
    gif: images,
    jpg: images,
    jpg: images,
    eot: images,
    svg: images,
    ttf: images,
    woff: images,
    woff2: images
	}
	var pFile = /css|html/
	var internalFile = /\/_[^\/]+$/
	let fileExtend = filePath.match(/\.(.+)$/)
	if (!fileExtend) {
		throw 'no file extension!'
	}
	fileExtend = fileExtend[1]
  const task = function () {
    console.log('task:', extendMap[fileExtend.replace('.', '')].name)
    return extendMap[fileExtend.replace('.', '')].apply(null, [filePath].concat(arguments))
	}
  switch (type) {
		case 'add':
			processAdd()
			break;
		case 'change':
			processChange()
			break;
		default:
			processDel()
  }

  function processAdd () {
		if (internalFile.test(filePath) && pFile.test(filePath)) {
			return
		}
		gulp.series(task, gulp.parallel(action)).apply(self)
  }
  function processChange () {
		gulp.series(task, gulp.parallel(action)).apply(self)
  }
  function processDel () {
		if(!pFile.test(filePath) || !internalFile.test(filePath)) {
			const delPath = c_paths.tmp + filePath.replace(c_paths.src, '');
			return fs.unlinkSync(delPath)
		}
		gulp.series(task, gulp.parallel(action)).apply(self)
	}
	// var watcher = fn;
	// watcher.on('add', function(){
	// 	if(action){
	// 		gulp.series(task,gulp.parallel(action)).apply(this)
	// 	}else{
	// 		gulp.series(task).apply(this)
	// 	}

	// })

	// watcher.on('change', function(path){
	// 	const finalTask = function () {
	// 		return task.apply(null, [path].concat(arguments));
	// 	};
	// 	if(action){
	// 		gulp.series(finalTask, gulp.parallel(action)).apply(this)
	// 	}else{
	// 		gulp.series(finalTask).apply(this)
	// 	}
	// })

	// watcher.on('unlink', function(path){
	// 	var reFile = /css/;
	// 	if(!reFile.test(path)){
	// 		const delPath = c_paths.tmp + '\\' + path;
	// 		fs.unlinkSync(delPath)
	// 	}
	// 	if(action){
	// 		gulp.series(task,gulp.parallel(action)).apply(this)
	// 	}else{
	// 		gulp.series(task).apply(this)
	// 	}
	// })
}

module.exports = watch;
