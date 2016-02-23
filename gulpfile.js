var gulp = require("gulp");
var browserify = require("browserify");
var watchify = require('watchify');
var reactify = require("reactify");
var source = require("vinyl-source-stream");
var nodemon = require('gulp-nodemon');
var notifier = require('node-notifier');

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }

  notifier.notify({title: title, message: message});
};

var bundler = watchify(browserify({
  entries: ['./public/components/main.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true
}));

function bundle() {
  return bundler
    .bundle()
    .on('error', notify)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public'));
}
bundler.on('update', bundle);

gulp.task('build', function() {
  bundle()
});

gulp.task('serve', function() {
  nodemon({ 
    script: 'server/server.js', 
    ignore: [
      './public',
      './omlet-autotest'
    ],
    ext: 'html js'
  });
});

// gulp.task("default", ['build', 'serve'], function(){
//   console.log("Gulp completed..."); 
// });

var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp.src('./public')
      .pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: true
      }));
});

gulp.task("default", ['webserver', 'build', 'serve'], function() {
  console.log("Gulp completed...");
});