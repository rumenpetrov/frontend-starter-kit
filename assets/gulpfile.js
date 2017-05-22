/* ------------------------------------------------------------ *\
    # Plugins
\* ------------------------------------------------------------ */
var gulp = require('gulp');

// styles
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var postcssImport = require('postcss-import');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');

// scripts
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

// images
var imagemin = require('gulp-imagemin');

// utilities
var concat = require('gulp-concat');
var rename = require('gulp-rename');

// paths
var pathBuild = 'build/';

/* ------------------------------------------------------------ *\
    # Task: Build styles
\* ------------------------------------------------------------ */
gulp.task('build:css', function(done) {
	var plugins = [
		postcssImport,
		cssnext
	];

	return gulp.src('css/style.css')

	.pipe(sourcemaps.init())
	.pipe(postcss(plugins))
	.on('error', done)
	.pipe(rename('build.css'))
	// uncomment next row to compress styles
	// .pipe(cssnano())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(pathBuild));
});

/* ------------------------------------------------------------ *\
    # Task: Combine and compress scripts
\* ------------------------------------------------------------ */
gulp.task('build:js', function() {
	return gulp.src(['js/plugins/*.js', 'js/main.js'])

	.pipe(concat('build.js'))
	// uncomment next row to compress scripts
	// .pipe(uglify({compress: {hoist_funs: false, hoist_vars: false}}))
	.pipe(gulp.dest(pathBuild));
});

/* ------------------------------------------------------------ *\
    # Task: Check main js for errors and optimizations
\* ------------------------------------------------------------ */
gulp.task('validate:js', function(done) {
	return gulp.src('js/main.js')

	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish', { beep: true }));
});

/* ------------------------------------------------------------ *\
    # Task: Compress images
\* ------------------------------------------------------------ */
gulp.task('compress:images', function() {
	return gulp.src('images/**/*.{png,jpg,jpeg}')
	
	.pipe(imagemin({
		optimizationLevel: 7,
		progressive: true,
		verbose: true
	}))
	.pipe(gulp.dest('images/'))
});

/* ------------------------------------------------------------ *\
    # Task: Watch files for changes
\* ------------------------------------------------------------ */
gulp.task('watch', function() {
	gulp.watch('css/**/*.css', ['build:css']);
	gulp.watch('js/**/*.js', ['validate:js', 'build:js']);
});

/* ------------------------------------------------------------ *\
    # Task: Default
\* ------------------------------------------------------------ */
gulp.task('default', [ 'build:css', 'compress:images', 'validate:js', 'build:js' ]);