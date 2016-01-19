var gulp = require("gulp"); //build skeleton
var gutil = require("gulp-util"); //console util
var source = require("vinyl-source-stream"); // helps with transfering files
var browserify = require("browserify"); //keeps build/concat order straight with requires
var watchify = require("watchify"); //tool that watches src for changes and auto runs gulpfile
//var reactify = require("reactify"); //tool that changes jsx to js
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');



gulp.task("default", function(){
  var bundler = watchify(browserify({
    entries: ["./scripts_src/app.js"],
   // transform: [reactify],
    extensions: ['.jsx', '.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: false
  }));

  function build(file){
    if (file) {
      gutil.log("Recompiling " + file);
    }
    return bundler
      .bundle()
      .on("error", gutil.log.bind(gutil, "Browserify Error"))
      .pipe(source("build/main.js"))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest("./"));
  };
  build();
  bundler.on("update", build);


});