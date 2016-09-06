var gulp = require('gulp');
var clean = require('gulp-clean');
var tslint = require("gulp-tslint");

gulp.task('default', ['tslint']);

gulp.task('clean', function () {
    return gulp.src(['src/**/*.js', 'src/**/*js.map'], { read: false })
        .pipe(clean());
});

gulp.task("tslint", function () {
    return gulp.src(['src/**/*.ts', '!src/typings/**'])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});