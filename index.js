require('babel-register')({
	presets: [
		'env',
		'react',
		'stage-0'
	],
	plugins: [
		'transform-react-remove-prop-types',
		'transform-class-properties',
		'react-hot-loader/babel'
	]
})

module.exports = require('./src/server.jsx')
