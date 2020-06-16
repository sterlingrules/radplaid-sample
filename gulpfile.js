require('dotenv').config();

var debug = process.env.NODE_ENV !== 'production';

var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var https = require('https');
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rimraf = require('gulp-rimraf');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var request = require('request');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');
var history = require('connect-history-api-fallback');
var request = require('superagent');
var open = require('open');
var parser = require('xml2json');

//
// Webpack
//
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var webpackConfigDevelopment = require('./webpack.config.js');
var webpackConfigStaging = require('./webpack.config.staging.js');
var webpackConfigProduction = require('./webpack.config.production.js');
var getSitemap = require('./src/server/get-sitemap.js');
var port = debug ? 5319 : 8080;

//
// Default tasks
//
var tasks = [
	'sitemap',
	'build:css',
	'build:dev',
];

gulp.task('sitemap', getSitemap)

gulp.task('build:css', function () {
	var fileType = 'CSS';

	return gulp.src('./scss/**/*.scss')
		.pipe(sass({
			errLogToConsole: true,
			includePaths: [
				'./node_modules/'
			]
		}))
		.on('error', notify.onError(function (error) {
			return console.error('CSS ', error);
		}))
		.pipe(autoprefixer())
		.pipe(cleanCSS({
			debug: debug
		}, (details) => {
			console.log(`${details.name}: ${details.stats.originalSize}`);
			console.log(`${details.name}: ${details.stats.minifiedSize}`);
		}))
		.pipe(gulp.dest('./public/css'));
});

//
// Staging build
//
gulp.task('build:staging', [ 'sitemap', 'build:css' ], function (callback) {
	// run webpack
	webpack(webpackConfigStaging, function (err, stats) {
		if (err) throw new gutil.PluginError('webpack:build', err);

		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));

		callback();
	});
});

//
// Production build
//
gulp.task('build:prod', [ 'sitemap', 'build:css' ], function (callback) {
	// run webpack
	webpack(webpackConfigProduction, function (err, stats) {
		if (err) throw new gutil.PluginError('webpack:build', err);

		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));

		callback();
	});
});

//
// Development build
//
gulp.task('build:dev', function (callback) {
	// run webpack
	webpack(webpackConfigDevelopment, function (err, stats) {
		if (err) throw new gutil.PluginError('webpack:build:dev', err);

		gutil.log('[webpack:build:dev]', stats.toString({
			colors: true
		}));

		callback();
	});
});

gulp.task('watch', tasks, function () {
	gutil.log('[express:server]', 'http://localhost:' + port);

	gulp.watch('./scss/**/*.scss', [ 'build:css' ], { verbose: true }, function () {
		if (process.send) {
			process.send({
				event:'online',
				url:`http://localhost:${process.env.PORT}`
			})
		}
	});

	gulp.watch([ './src/**/*' ], [ 'build:dev' ], { verbose: true }, function () {
		if (process.send) {
			process.send({
				event:'online',
				url:`http://localhost:${process.env.PORT}`
			})
		}
	});

	// open('http://localhost:' + port);
})

gulp.task('default', tasks);
