var gulp = require('gulp'), // mandatory
    less = require('gulp-less'), // compile .less files
    concat = require('gulp-concat'), // concatenate files
    sourcemaps = require('gulp-sourcemaps'), // allow browser console.log to show relevant info in minified js
    revall = require('gulp-rev-all'), // add hash to filenames and override urls in css files to hashed
    uglify = require('gulp-uglify'), // minify scripts
    minifyCSS = require('gulp-minify-css'), // minify css
    ngAnnotate = require('gulp-ng-annotate'), // allow angular to do dependency injection after script has been minified
    jshint = require('gulp-jshint'), // js linter
    stylish = require('jshint-stylish'), // JSHint reporter
    notify = require("gulp-notify"), // send messages based on Vinyl Files or Errors - required for jshint
    connect = require('gulp-connect'), // allow app to run on a development server
    del = require('del'); // delete files and folders - https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md

// create '.css' file from '.less' 
gulp.task('less', function() {
  return gulp.src(['./app/**/*.less', '!./app/bower_components/**'])
    .pipe(less())
    .pipe(gulp.dest('./app'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist'));
});

// test js files and minify
gulp.task('js', function () {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
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
    .pipe(gulp.dest('./dist/js'));
});

// Run 'less' and 'js' functions to update minified/concatenated js and css files after each save
gulp.task('watch', ['less', 'js'], function() {
  gulp.watch('./app/css/**/*.less', ['less']);
  gulp.watch('./app/js/**/*.js', ['js']);
});

gulp.task('rev', ['less', 'js'], function() {
  return gulp.src(['dist/**/*.css', 'dist/**/*.js'])
    .pipe(revall())
    .pipe(gulp.dest('./dist'))
    .pipe(revall.manifest())
    .pipe(gulp.dest('./dist'))
    .pipe(revall.versionFile()) 
    .pipe(gulp.dest('./dist')); 
});

gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});

// View development 
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});

gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

gulp.task('clean', function (cb) {
  del([
    'dist/report.csv',
    // here we use a globbing pattern to match everything inside the 'dist' folder
    './dist/*',
    // we don't want to clean this file though so we negate the pattern
    '!dist/deploy.json'
  ], cb);
});

// default task
gulp.task('default',
  ['lint', 'connect']
);

// build task
gulp.task('build',
  ['clean', 'less', 'js', 'copy-html-files', 'copy-bower-components', 'connectDist']
);