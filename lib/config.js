const merge = require('lodash/merge')

module.exports = {
	config: {
		isMobile: false,
		paths: {
			src: 'src',
			tmp: '.tmp',
			dist: 'dist',
			tDist: ''
		},
		images: {
			base64Path: '_base64', //base64图片存放位置
			spritesPath: '_sprites' //sprite后的图片存放位置
		},
		folders: {
			html: 'views',
			css: 'styles',
			component: 'components',
			cssVariable: 'variable',
			cssCommon: 'common',
			cssLib: 'lib',
			js: 'scripts',
			images: 'images'
		}
	},
	mergeConfig: function (config) {
		this.config = merge({}, this.config, config)
		this.config.images = {
			base64Path: `/${this.config.folders.images}/${this.config.images.base64Path}`,
			spritesPath: `/${this.config.folders.images}/${this.config.images.spritesPath}`
		}
	}
}
