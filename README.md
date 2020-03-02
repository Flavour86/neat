# neat-gulp-xgj

Framework for quick develop static `Html+css` Depend on gulp4

## Installation

```bash
  npm install --save-dev neat-gulp-xgj
```

## Usage

```javascript
const gulp = require('gulp4');
const getTasks = require('neat-gulp-xgj')

const tasks = getTasks({
	isMobile: true
})

gulp.task('default', tasks.default);
gulp.task('dist', tasks.dist);
gulp.task('dist:tiny', tasks.distTiny);
```

## API

### options
the params of `getTasks` function
- options.isMobile: If it is a mobile project, set true，css selector px transformTo vw, default is false
- options.path.src:  the root directory of source code, default is `src`
- options.path.tmp:  the root directory of tmp, use for development, default is `.tmp`
- options.path.dist: the root directory of build, use for product, default is `dist`
- options.images.base64Path: the directory of image to base64, default is `/images/_base64`
- options.images.spritesPath: the directory of image to sprites, default is `/images/_sprites`
- options.folders.html: the root directory of html, default is `view`
- options.folders.css: the root directory of html, default is `styles`
- options.folders.cssVariable: the directory of css variable, default is `variable`
- options.folders.cssCommon: the directory of common css, default is `styles`
- options.folders.js: the root directory of javascript, default is `scripts`
- options.folders.images: the root directory of images, default is `images`

### tasks
the return value of `getTasks` function
- task.default: use of development, create serve and auto refresh browser
- task.dist: use of product, uglify js ,css and html, image to image sprites
- task.distTiny: use of product, and images are compressed
