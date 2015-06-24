/* https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md */
var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash/object/assign');

var customOpts = {
	entries: ['./src/app.jsx','./components/SMCanvas.jsx','./components/SMDropper.jsx','./components/SMFileLoader.jsx'],
	debug: true
};

var opts = assign({},watchify.args,customOpts);
var b = watchify(browserify(opts));

b.transform(reactify);

gulp.task('browserify', bundle);
b.on('update', bundle);
b.on('log',gutil.log);

function bundle(){
	return b.bundle()
		.on('error',gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'));
}