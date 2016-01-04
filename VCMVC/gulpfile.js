/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');

gulp.task('sass-compile', function ()
{
    gulp
        .src('./css/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function ()
{
    gulp.watch('./css/**/*.scss', ['sass-compile']);
});