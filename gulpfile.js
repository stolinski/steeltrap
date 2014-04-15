// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint')
, changed = require('gulp-changed')
, imagemin = require('gulp-imagemin')
, uglify = require('gulp-uglify')
, minifyCSS = require('gulp-minify-css')
, compass = require('gulp-compass')
, livereload = require('gulp-livereload')
, concat = require('gulp-concat')
, stripDebug = require('gulp-strip-debug'),
  plumber = require('gulp-plumber');


var paths = {
  sass: './public/scss/**/*'
};



// Styles
gulp.task('styles', function() {
  return gulp.src('./public/scss/**/*')
    .pipe(plumber())
    .pipe(compass({
        sass: './public/scss',
        css: './public/css'
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css'));
});


// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch('*.html', function(evt) {
      server.changed(evt.path);
  });
  gulp.watch(paths.sass, ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['styles','watch']);
