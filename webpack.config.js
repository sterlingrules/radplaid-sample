require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const WorkboxPlugin = require('workbox-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const CONSTANTS = [
	'NODE_ENV',
	'HOSTNAME',
	'API_VERSION',
	'SESSION_SECRET',
	'COOKIE_SECRET',
	'RADPLAID_CLIENT_ID',
	'STRIPE_PUBLISHABLE_KEY',
	'BASE_CLIENT_URL',
	'BASE_SERVER_URL',
	'ASSET_URL',
	'GA_ID',
	'GA_CONVERSION_ID',
	'DATE_FORMAT',
	'APPLE_APP_ID',
	'FACEBOOK_APP_ID',
	'AUTHO_CLIENT_ID',
	'SOUNDCLOUD_CLIENT_ID',
	'KICKBOX_APP_CODE',
	'LOCATION_ACCURACY',
	'MAPBOX_ACCESS_TOKEN',
	'MIXPANEL_KEY',
	'SENTRY_KEY'
]

const getEnv = () => {
	let env = {}

	CONSTANTS.forEach((key) => {
		env[key] = JSON.stringify(process.env[key])
	})

	return env
}

module.exports = {
	context: __dirname,
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		port: 5319,
		contentBase: './public',
		hotOnly: true,
	},
	target: 'web',
	entry: {
		main: './src/app/client.jsx',
		head: './src/app/head.js',
		simple: './src/app/simple.js',
		analytics: './src/app/helpers/analytics.jsx'
	},
	output: {
		path: path.join(__dirname, '/public/js'),
		publicPath: '/js/',
		filename: '[name].[hash].js',
		chunkFilename: '[name].[hash].js',
		pathinfo: false,
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			loader: 'babel-loader?cacheDirectory',
			exclude: /(node_modules)/,
			query: {
				presets: [
					'env',
					'react',
					'stage-0'
				]
			}
		}]
	},
	resolve: {
		symlinks: false
	},

	optimization: {
		runtimeChunk: false,
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 150000,
			// chunks: 'async',
			// minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 5,
			// maxInitialRequests: 3,
			automaticNameDelimiter: '-',
			name: true,
			cacheGroups: {
				// vendors: {
				// 	chunks: 'initial',
				// 	name: 'vendor',
				// 	test: /[\\/]node_modules[\\/]/,
				// 	priority: -10
				// },
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `${packageName.replace('@', '')}`;
					}
				},
				default: {
					minChunks: Infinity,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		}
	},

	plugins: [
		new CleanWebpackPlugin([ 'public/js/**/*' ]),
		new ManifestPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.HotModuleReplacementPlugin(),
		new MomentLocalesPlugin({
			localesToKeep: [ 'en' ]
		}),
		new HardSourceWebpackPlugin({
			cachePrune: {
				// Caches younger than `maxAge` are not considered for deletion. They must
				// be at least this (default: 2 days) old in milliseconds.
				maxAge: 2 * 24 * 60 * 60 * 1000,

				// All caches together must be larger than `sizeThreshold` before any
				// caches will be deleted. Together they must be at least this
				// (default: 50 MB) big in bytes.
				sizeThreshold: 500 * 1024 * 1024
			}
		}),
		new webpack.DefinePlugin({
			'process.env': getEnv()
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new WorkboxPlugin.InjectManifest({
			swSrc: './src/app/service-worker.js'
		})
	]
};
