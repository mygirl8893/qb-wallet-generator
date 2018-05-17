'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    browserify = require('browserify'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    csso = require('gulp-csso'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    minifycss = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    htmlreplace = require('gulp-html-replace'),
    fileinclude = require('gulp-file-include'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    merge = require('gulp-merge-json');

var plugins = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano()
  ];

gulp.task('clean', [], () => {
  
  return del(['dist/**/*'])
});

gulp.task('browser-sync', () => {
   browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('bs-reload', [], () => {
  browserSync.reload();
});

gulp.task('images', () => {
  gulp.src([
    'src/images/**/*',
    '!src/images/branding/*'
  ])
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', () => {
  gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.css',
    './node_modules/font-awesome/css/font-awesome.css',
    'src/styles/**/*'
  ])
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(csso())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/styles/'));
});

gulp.task('fonts', () => {
  gulp.src([
    './node_modules/font-awesome/fonts/*',
    'src/fonts/**/*'
  ])
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('branding', () => {
  gulp.src([
    'src/branding/**/*.css'
  ])
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/styles/branding/'))
    .pipe(minifycss())
    .pipe(csso())

  gulp.src('src/branding/**/*.json')
    .pipe(merge({
        fileName: 'branding.json'
    }))
    .pipe(gulp.dest('./dist/branding'))
    .pipe(gulp.dest('./src/branding'));

  gulp.src([
    'src/images/branding/**/*'
  ])
    .pipe(gulp.dest('dist/images/branding/'))
});

gulp.task('html', [], () => {
  gulp.src('src/**/*.html')
   .pipe(fileinclude({
      prefix: '@@',
      basepath: 'src/components/'
    }))
    .pipe(htmlreplace({
        'styles': 'styles/bundle.css',
        'scripts': [
          'scripts/bundle.min.js',
          'scripts/qiibee.js'
        ]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', [], () => {
  gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    'src/scripts/**/*.js',
    '!src/scripts/qiibee.js'
  ])
    .pipe(plumber({
      errorHandler: (error) => {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('bundle.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('browserify', [], () => {
  return browserify({
    entries: 'src/scripts/qiibee.js',
    standalone: 'Qiibee'
  })
  .bundle()
  .pipe(source('qiibee.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./dist/scripts/'))
});

gulp.task('default', ['clean'], () => {
   runSequence(
    'clean',
    'branding',
    'browserify',
    'images',
    'fonts',
    'styles',
    'scripts',
    'html',
    'browser-sync',
    'watch'
  );
});

gulp.task('watch', () => {
  gulp.watch(["src/scripts/**/*.js","!src/scripts/qiibee.js"]).on('change', () => {runSequence('scripts', browserSync.reload);});
  gulp.watch(["src/scripts/qiibee.js"]).on('change', () => {runSequence('browserify', browserSync.reload);});
  gulp.watch(["src/styles/**/*.css"]).on('change', () => {runSequence('styles', browserSync.reload);});
  gulp.watch(["src/fonts/**/*"]).on('change', () => {runSequence('fonts', browserSync.reload);});
  gulp.watch(["src/branding/**/*"]).on('change', () => {runSequence('branding', browserSync.reload);});
  gulp.watch("src/**/*.html").on('change', () => {runSequence('html', browserSync.reload);});
  gulp.watch("src/images/**/*").on('change', () => {runSequence('images', browserSync.reload);});
});

gulp.task('build', [], () => {
  runSequence(
    'clean',
    'branding',
    'browserify',
    'images',
    'fonts',
    'styles',
    'scripts',
    'html'
  );
});
