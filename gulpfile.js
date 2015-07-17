var gulp = require('gulp');
var fs = require('fs');
var File = require('vinyl');
var es = require('event-stream');
var rename = require('gulp-rename');

gulp.task('default', function () {
	console.log('Splitting SVGs...');
	
	var splitFiles = [];
	gulp.src(['source/*.svg'])
		.pipe(es.through(function (f) {
			splitFiles.push(new File({ cwd: "", base: "", path: f.relative + "-1.txt", contents: new Buffer('hello') }));
			splitFiles.push(new File({ cwd: "", base: "", path: f.relative + "-2.txt", contents: new Buffer('world') }));
		}, function () {
			es.readArray(splitFiles)
				.pipe(rename({ extname: '.svg' }))
				.pipe(gulp.dest('source/out'));
		}));
;})