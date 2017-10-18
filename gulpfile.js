var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');

gulp.task('js', function () {
  return gulp.src('js/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('clean', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('connect', function () {
  connect.server({
    livereload: true
  });
});

gulp.task('default', ['clean'], function () {
  gulp.start('js');
});

gulp.task('watch', function () {
  gulp.watch('js/*.js', ['js']);
});

gulp.task('server', ['connect', 'watch']);