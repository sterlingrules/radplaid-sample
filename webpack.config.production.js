require('dotenv').config()

const path = require('path')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const webpack = require('webpack')

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
	mode: 'production',
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
		filename: '[name].[chunkhash].js'
	},
	module: {
		noParse: /(mapbox-gl)\.js$/,
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
	optimization: {
		nodeEnv: 'production',
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
				uglifyOptions: {
					compress: {
						inline: false,
						warnings: false,
						conditionals: true,
						unused: true,
						comparisons: true,
						sequences: true,
						dead_code: true,
						drop_console: false, // true,
						evaluate: true,
						if_return: true,
						join_vars: true
					},
					output: {
						comments: false
					}
				}
			})
		],
		runtimeChunk: false,
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 100000,
			// minSize: 200000,
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
		new MomentLocalesPlugin({
			localesToKeep: [ 'en' ]
		}),
		new MomentTimezoneDataPlugin({
			matchZones: 'America/New_York',
			startYear: 2018
		}),
		new webpack.DefinePlugin({
			'process.env': getEnv()
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new CompressionPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
			// threshold: 10240,
			threshold: 100000,
			minRatio: 0.7
		}),
		new webpack.HashedModuleIdsPlugin(),
		new WorkboxPlugin.InjectManifest({
			swSrc: './src/app/service-worker.js'
		})
	]
};
