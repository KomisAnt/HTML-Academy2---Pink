const gulp = require('gulp');
const webp = require('gulp-webp');
const gulpClean = require('gulp-clean');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const gulpPostcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const sync = require('browser-sync').create();
const cssMinify = require('gulp-css-minify');
const htmlMin = require('gulp-htmlmin');
const jsMinify = require('gulp-minify');
const imgmin = require('gulp-imagemin');

// Styles

const styles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulpPostcss([autoprefixer()]))
    .pipe(cssMinify())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTMLminify

const htmlMinify = () => {
  return gulp.src('source/*.html')
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

exports.htmlMinify = htmlMinify;

// JS Minify

const jsMin = (done) => {
  gulp.src('source/js/script.js')
    .pipe(jsMinify())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'))
  done();
};

exports.jsMin = jsMin;

// Images

const optimizeImg = (done) => {
  gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imgmin([
      imgmin.mozjpeg({ quality: 100, progressive: true }),
      imgmin.optipng({ optimizationLevel: 5 }),
      imgmin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('build/img'))
  done();
};

exports.optimizeImg = optimizeImg;

const copyImg = (done) => {
  gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(gulp.dest('build/img'))
  done();
};

exports.copyImg = copyImg;

// WebP

const createWebp = () => {
  return gulp.src('source/img/*.jpg')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'))
};

exports.createWebp = createWebp;

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/img/**/*.svg',
    '!source/img/icons/*.svg',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return gulp.src('build')
    .pipe(plumber())
    .pipe(gulpClean());
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(jsMin));
  gulp.watch('source/*.html', gulp.series(htmlMinify, reload));
}

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImg,
  gulp.parallel(
    styles,
    htmlMinify,
    jsMin,
    createWebp
  ),
);

exports.build = build;

exports.default = gulp.series(
  clean,
  copy,
  copyImg,
  gulp.parallel(
    styles,
    htmlMinify,
    jsMin,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
