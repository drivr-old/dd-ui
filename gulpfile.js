var gulp = require('gulp');
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var tslint = require("gulp-tslint");

gulp.task('default', ['clean', 'compile', 'tslint']);

gulp.task('clean', function () {
    return gulp.src(['src/**/*.js', 'src/**/*.js.map', 'src/**/*.d.ts'], { read: false })
        .pipe(clean());
});

gulp.task('compile', ['clean'], shell.task(['tsc']));

gulp.task('tslint', ['compile'], function () {
    return gulp.src(['src/**/*.ts', '!src/typings/**', '!src/**/*.d.ts'])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});