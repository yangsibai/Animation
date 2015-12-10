'use strict';
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var clean = require('gulp-clean');

gulp.task('default', ['css', 'js_html'], function () {
    gulp.watch([
        'src/lib.js',
        'src/index.html'
    ], ['js_html']);
    gulp.watch([
        'src/animation.css'
    ], ['css']);
});

gulp.task('clean-scripts', function () {
    return gulp.src('dist').pipe(clean({read: false}));
});

gulp.task('js_html', function () {
    return gulp.src([
        './src/index.html',
        './src/lib.js'
    ], {
        base: 'src'
    }).pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    return gulp.src('./src/animation.css')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('publish', ['clean-scripts', 'css'], function () {
    return gulp.src([
        './src/lib.js'
    ], {
        base: 'src'
    }).pipe(gulp.dest('dist'));
});
