const merge = require('lodash/merge')

module.exports = {
	config: {
		isMobile: false,
		paths: {
			src: 'src',
			tmp: '.tmp',
			dist: 'dist'
		},
		images: {
			base64Path: '/images/_base64', //base64图片存放位置
			spritesPath: '/images/_sprites' //sprite后的图片存放位置
		},
		folders: {
			html: 'views',
			css: 'styles',
			js: 'scripts',
			images: 'images'
		}
	},
	mergeConfig: function (config) {
		this.config = merge({}, this.config, config)
	}
}
