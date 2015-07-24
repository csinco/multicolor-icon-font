var gulp = require('gulp');
var fs = require('fs');
var File = require('vinyl');
var es = require('event-stream');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var iconfont = require('gulp-iconfont');
var xmljs = require('libxmljs');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
var SVG_DEST = 'source/out';

gulp.task('default', function () {
	console.log('Splitting SVGs...');
	
	var splitFiles = [];
	gulp.src(['source/*.svg'])
		.pipe(es.mapSync(function(f) {
			var xmlDoc = xmljs.parseXml(f.contents.toString('utf-8'));
			var root = xmlDoc.root();
			var cn = [];
			root.childNodes().map(function(n) {
				if (n.type() === 'element') {
					cn.push(n);
				}
				n.remove();
			});
			cn.map(function(c, idx) {
				root.addChild(c);
				splitFiles.push(new File({ 
					cwd: "", 
					base: "", 
					path: f.relative.substr(0, f.relative.indexOf('.')) + "_" + idx + ".svg", 
					contents: new Buffer(xmlDoc.toString()) 
				}));
				root.child(0).remove();
			});

			return f;
		}))
		.pipe(es.through(null, function () {
			console.log('Creating split files...');
			es.readArray(splitFiles)	
				.pipe(imagemin())
				.pipe(iconfont({
					fontName: 'monaco',
					fontHeight: 1001,
					normalize: true,
					appendCodepoints: true
				}))
				.on('glyphs', function(codepoints) {
					codepoints.forEach(function(glyph, idx, arr) {
						arr[idx].codepoint = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase();
						console.log(arr[idx].codepoint);
					});
					
				})
				.pipe(gulp.dest(SVG_DEST));
		}));
});
