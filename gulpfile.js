/* ------------------------------------------------------------ *\
    # Plugins
\* ------------------------------------------------------------ */
var gulp = require('gulp');

// templates
var ssi = require("gulp-ssi");
var panini = require('panini');

// styles
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var postcssImport = require('postcss-import');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');

// scripts
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

// utilities
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var del = require("del");
var gulpSequence = require('gulp-sequence')

// paths
var paths = {
	html: {
		src: 'html/source',
		dist: 'html/build'
	},
	css: {
		src: 'css/source',
		dist: 'css/build'
	},
	js: {
		src: 'js/source',
		dist: 'js/build'
	}
};

/* ------------------------------------------------------------ *\
    # Task: Handle static pages
\* ------------------------------------------------------------ */
gulp.task('build:html', function(callback) {
	gulpSequence('clean:html', 'pages:refresh', 'pages')(callback)
});

gulp.task('clean:html', function() {
	return del(paths.html.src + '/*.html');
});

gulp.task('pages', function() {
	return gulp.src(paths.html.src + '/pages/**/*.html')
	
	.pipe(panini({
		root: paths.html.src + '/pages/',
		layouts: paths.html.src + '/layouts/',
		partials: paths.html.src + '/partials/'
	}))
	.pipe(gulp.dest(paths.html.dist));
});

gulp.task('pages:refresh', function() {
	panini.refresh();
});

/* ------------------------------------------------------------ *\
    # Task: Handle styles
\* ------------------------------------------------------------ */
gulp.task('build:css:dev', function(done) {
	var plugins = [
		postcssImport,
		cssnext
	];

	return gulp.src(paths.css.src + '/style.css')

	.pipe(sourcemaps.init())
	.pipe(postcss(plugins))
	.on('error', done)
	.pipe(rename('build.css'))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(paths.css.dist));
});

gulp.task('build:css:prod', function(done) {
	var plugins = [
		postcssImport,
		cssnext
	];

	return gulp.src(paths.css.src + '/style.css')

	.pipe(sourcemaps.init())
	.pipe(postcss(plugins))
	.on('error', done)
	.pipe(rename('build.css'))
	.pipe(cssnano())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(paths.css.dist));
});

/* ------------------------------------------------------------ *\
    # Task: Combine and compress scripts
\* ------------------------------------------------------------ */
gulp.task('build:js:dev', function() {
	return gulp.src([paths.js.src + '/plugins/*.js', paths.js.src + '/main.js'])

	.pipe(concat('build.js'))
	.pipe(gulp.dest(paths.js.dist));
});

gulp.task('build:js:prod', function() {
	return gulp.src([paths.js.src + '/plugins/*.js', paths.js.src + '/main.js'])

	.pipe(concat('build.js'))
	.pipe(uglify({compress: {hoist_funs: false, hoist_vars: false}}))
	.pipe(gulp.dest(paths.js.dist));
});

/* ------------------------------------------------------------ *\
    # Task: Check main js for errors and optimizations
\* ------------------------------------------------------------ */
gulp.task('validate:js', function() {
	return gulp.src(paths.js.src + '/main.js')

	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish', { beep: true }));
});

/* ------------------------------------------------------------ *\
    # Task: Watch files for changes
\* ------------------------------------------------------------ */
gulp.task('watch', function() {
	gulp.watch('html/source/**/*', ['build:html']);
	gulp.watch('css/source/**/*.css', ['build:css:dev']);
	gulp.watch(paths.js.src + '/**/*.js', ['validate:js', 'build:js:dev']);
});

/* ------------------------------------------------------------ *\
    # Task: Default
\* ------------------------------------------------------------ */
gulp.task('default', ['build:html', 'build:css:prod', 'validate:js', 'build:js:prod']);