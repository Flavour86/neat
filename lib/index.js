const gulp = require('gulp4');
const conf = require('./config')

module.exports = function (config) {
  conf.mergeConfig(config)
  const views = require('./views');
  const styles = require('./styles');
  const scripts = require('./scripts');
  const images = require('./images');
  const watch = require('./watch');
  const server = require('./server');
  const clean = require('./clean');
  const build = require('./build');
  return {
    default: gulp.series(
      clean.clean,
      gulp.parallel(
        watch,
        views,
        scripts,
        styles,
        images,
        server.dev
      )
    ),
    dist: gulp.series(
      clean.clean,
      // clean.cleanBuild,
      clean.cleanTemplate,
      gulp.parallel(
        views,
        scripts,
        styles,
        images
      ),
      build.images,
      build.scripts,
      build.styles,
      build.revResource,
      build.fonts,
      build.views,
      clean.cleanBase64,
      clean.cleanSprites,
      clean.cleanManifest
    ),
    distTiny: gulp.series(
      clean.clean,
      clean.cleanBuild,
      gulp.parallel(
        views,
        scripts,
        styles,
        images
      ),
      build.imagesTiny,
      build.styles,
      build.scripts,
      build.revResource,
      build.fonts,
      build.views,
      clean.cleanBase64,
      clean.cleanSprites,
      clean.cleanManifest
    )
  }
}
