'use strict';

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

gulp.task('default', function () {
    gulp.src([
        './src/index.html',
        './src/lib.js'
    ], {
        base: 'src'
    }).pipe(gulp.dest('dist'));

    gulp.src('./src/animation.css')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));

    gulp.watch([
        'src/lib.js',
        'src/index.html'
    ], function () {
        gulp.src([
            './src/index.html',
            './src/lib.js'
        ], {
            base: 'src'
        }).pipe(gulp.dest('dist'));
    });
    gulp.watch([
        'src/animation.css'
    ], function () {
        gulp.src('./src/animation.css')
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.init())
            .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'));
    });
});
