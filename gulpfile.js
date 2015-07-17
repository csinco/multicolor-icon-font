var gulp = require('gulp');
var fs = require('fs');
var File = require('vinyl');
var es = require('event-stream');
var rename = require('gulp-rename');
var xmljs = require('libxmljs');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
var SVG_DEST = 'source/out';

gulp.task('default', function () {
	console.log('Splitting SVGs...');
	
	var splitFiles = [];
	gulp.src(['source/*orig.svg'])
		.pipe(es.mapSync(function(f) {
			var xmlDoc = xmljs.parseXml(f.contents.toString('utf-8'));

			var y = xmlDoc.find('//xmlns:g', SVG_NAMESPACE);
			y.map(function(x) {
				var a = x.attr('id');
				if (a) {
					console.log(a.value());
				}
			});

			//splitFiles.push(new File({ cwd: "", base: "", path: f.relative + "-1.txt", contents: new Buffer('hello') }));
			return f;
		}))
		.pipe(es.through(null, function () {
			es.readArray(splitFiles)
				.pipe(rename({ extname: '.svg' }))
				.pipe(gulp.dest(SVG_DEST));
		}));
;})