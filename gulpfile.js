var gulp = require('gulp');
var clean = require('gulp-clean');
var tslint = require("gulp-tslint");
var ts = require('gulp-typescript');

gulp.task('default', ['clean', 'compile', 'tslint']);

gulp.task('clean', function () {
    return gulp.src(['src/**/*.js', 'src/**/*.js.map', '!src/dd-ui.d.ts'], { read: false })
        .pipe(clean());
});

gulp.task('tslint', function () {
    return gulp.src(['src/**/*.ts', '!src/typings/**', '!src/dd-ui.d.ts'])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});

var tsProject = ts.createProject('tsconfig.json');
gulp.task('compile', function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));
    return tsResult.js.pipe(gulp.dest('src'));
});

