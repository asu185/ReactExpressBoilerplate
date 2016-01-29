var gulp = require("gulp");
var browserify = require("browserify");
var watchify = require('watchify');
var reactify = require("reactify");
var source = require("vinyl-source-stream");
var nodemon = require('gulp-nodemon');

var bundler = watchify(browserify({
  entries: ['./public/main.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true
}));

function bundle() {
  return bundler
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('public'))
}
bundler.on('update', bundle);

gulp.task('build', function() {
  bundle()
});

gulp.task('serve', function() {
  nodemon({ 
    script: 'server/server.js', 
    ext: 'html js'
  });
});

gulp.task("default",["build", "serve"], function(){
   console.log("Gulp completed..."); 
});