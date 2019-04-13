import gulp from 'gulp';

// markup
import panini from 'panini';

// styles
import postcss from 'gulp-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import postcssImport from 'postcss-import';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import doiuse from 'doiuse';
import autoprefixer from 'autoprefixer';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';

// scripts
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';


// utilities
import del from 'del';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import concat from 'gulp-concat';

import pkg from './package.json';

/* ------------------------------------------------------------ *\
  # Configuration
\* ------------------------------------------------------------ */
const ASSETS_SRC = 'src/assets';
const ASSETS_DIST = 'dist/assets';
const MARKUP_SRC = 'src/markup';
const MARKUP_DIST = 'dist';
const STYLES_SRC = 'src/styles';
const STYLES_DIST = 'dist/styles';
const SCRIPTS_SRC = 'src/scripts';
const SCRIPTS_DIST = 'dist/scripts';

const babelConfig = pkg.babel;

/* ------------------------------------------------------------ *\
  # Utilities
\* ------------------------------------------------------------ */
function logStartTask(taskName) {
  console.log(`\n> Start '${taskName}' task.`);
  console.log('--------------------------------------------------');
}

function logSubtask(taskName) {
  console.log(`  * Run '${taskName}' subtask.`);
}

/* ------------------------------------------------------------ *\
  # Task: Copy everything from assets folder
\* ------------------------------------------------------------ */
function taskAssetsCopy() {
  logSubtask('assets copy');

  return gulp.src(`${ASSETS_SRC}/**/*`)
    .pipe(gulp.dest(ASSETS_DIST));
}

function taskAssetsClean() {
  logSubtask('assets clean');

  return del(`${ASSETS_DIST}/**/*`, { force: true });
}

const taskAssets = gulp.series(taskAssetsClean, taskAssetsCopy);

/* ------------------------------------------------------------ *\
  # Task: Handle static pages
\* ------------------------------------------------------------ */
function taskMarkup() {
  logSubtask('markup');

  return gulp.src(`${MARKUP_SRC}/pages/**/*.html`)
    .pipe(panini({
      root: `${MARKUP_SRC}/pages/`,
      layouts: `${MARKUP_SRC}/layouts/`,
      partials: `${MARKUP_SRC}/partials/`,
    }))
    .pipe(gulp.dest(MARKUP_DIST));
}

function taskMarkupClean() {
  logSubtask('markup clean');

  return del(`${MARKUP_DIST}/*.html`, { force: true });
}

/* ------------------------------------------------------------ *\
  # Task: Handle styles
\* ------------------------------------------------------------ */
function taskStyles(done) {
  logSubtask('styles');

  const plugins = [
    postcssImport,
    postcssPresetEnv,
    autoprefixer,
    postcssFlexbugsFixes,
    doiuse({
      browsers: pkg.browserslist,
      // an optional array of features to ignore
      ignore: ['rem'],
      // an optional array of file globs to match against original source file path, to ignore
      ignoreFiles: ['**/vendor/**/*'],
      onFeatureUsage: usageInfo => console.log(`\t[doiuse] ${usageInfo.message}`),
    }),
  ];

  return gulp.src(`${STYLES_SRC}/styles.css`)
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .on('error', done)
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(STYLES_DIST));
}

function taskStylesClean() {
  logSubtask('styles clean');

  return del(`${STYLES_DIST}/**/*`, { force: true });
}

/* ------------------------------------------------------------ *\
  # Task: Combine and compress scripts
\* ------------------------------------------------------------ */
function taskScripts() {
  logSubtask('scripts');

  return gulp.src(`${SCRIPTS_SRC}/app.js`)
    .pipe(plumber())
    .pipe(babel(babelConfig))
    .pipe(uglify({ compress: { hoist_funs: false, hoist_vars: false } }))
    .pipe(gulp.dest(SCRIPTS_DIST));
}

function taskScriptsVendor() {
  logSubtask('scripts vendor');

  return gulp.src(`${SCRIPTS_SRC}/vendor/**/*.js`)
    .pipe(concat('vendor.js'))
    .pipe(uglify({ compress: { hoist_funs: false, hoist_vars: false } }))
    .pipe(gulp.dest(SCRIPTS_DIST));
}

function taskScriptsClean() {
  logSubtask('scripts clean');

  return del(`${SCRIPTS_DIST}/**/*`, { force: true });
}

function taskScriptsLint() {
  return gulp.src(`${SCRIPTS_SRC}/app.js`)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

/* ------------------------------------------------------------ *\
  # Task: Compile the project
\* ------------------------------------------------------------ */
const taskBuild = gulp.parallel(
  gulp.series(taskAssetsClean, taskAssetsCopy),
  gulp.series(taskMarkupClean, taskMarkup),
  gulp.series(taskStylesClean, taskStyles),
  gulp.series(taskScriptsClean, taskScripts, taskScriptsLint, taskScriptsVendor),
);

/* ------------------------------------------------------------ *\
  # Task(default): Watch files for changes
\* ------------------------------------------------------------ */
function taskWatch() {
  logStartTask('watch');

  gulp.watch(`${MARKUP_SRC}/**/*.html`, gulp.series(taskMarkupClean, taskMarkup));
  gulp.watch(`${STYLES_SRC}/**/*.css`, gulp.series(taskStylesClean, taskStyles));
  gulp.watch(`${SCRIPTS_SRC}/**/*.js`, gulp.series(taskScriptsClean, taskScripts, taskScriptsLint, taskScriptsVendor));
}

export { taskBuild as build, taskAssets as assets };
export default taskWatch;
