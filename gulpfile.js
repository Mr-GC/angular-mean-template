var gulp = require('gulp'); // mandatory
var less = require('gulp-less'); // compile .less files
var concat = require('gulp-concat'); // concatenate files
var sourcemaps = require('gulp-sourcemaps') // allow browser console.log to show relevant info in minified js
var revall = require('gulp-rev-all'); // add hash to filenames and override urls in css files to hashed
var uglify = require('gulp-uglify'); // minify scripts
var ngAnnotate = require('gulp-ng-annotate') // allow angular to do dependency injection after script has been minified
var jshint = require('gulp-jshint'); // js linter
var stylish = require('jshint-stylish'); // JSHint reporter
 
gulp.task('less', function() {
  return gulp.src('css/app.less')
    .pipe(less())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
  gulp.src(['src/**/module.js', 'src/**/*.js'])
    .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(notify({
            title: 'JSHint',
            message: 'JSHint Passed. Let it fly!',
        }))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['less', 'js'], function() {
  gulp.watch('css/**/*.less', ['less']);
  gulp.watch('src/**/*.js', ['js']);
});

gulp.task('rev', ['less', 'js'], function() {
  return gulp.src(['dist/**/*.css', 'dist/**/*.js'])
    .pipe(revall())
    .pipe(revall.manifest())
    .pipe(gulp.dest('dist'));
});

gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});