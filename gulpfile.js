"use strict";

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del');

     gulp.task("concatScripts", function() {
	    gulp.src([
	        'dist/bower_components/jquery/dist/jquery.js',
	        'dist/bower_components/boostrap/dist/js/boostrap.js',
	        'js/Chess.js'
	        ])
	    .pipe(maps.init())
	    .pipe(concat('app.js'))
	    .pipe(maps.write('./'))
	    .pipe(gulp.dest('dist'));
	});

     gulp.task("minifyScripts", ["concatScripts"], function() {
	  gulp.src("dist/app.js")
	    .pipe(uglify())
	    .pipe(rename('app.min.js'))
	    .pipe(gulp.dest('dist'));
	});

     gulp.task('compileSass', function() {
	  gulp.src("src/scss/application.scss")
	      .pipe(maps.init())
	      .pipe(sass())
	      .pipe(rename('main.css'))
	      .pipe(maps.write('./'))
	      .pipe(gulp.dest('dist'));
	});

     gulp.task('copyViews', function(){
     	gulp.src('src/views/*html')
     		.pipe(gulp.dest('dist/views'));
     });

     gulp.task('copyIndex', function(){
     	gulp.src('src/index.html')
     		.pipe(gulp.dest('dist'));
     });