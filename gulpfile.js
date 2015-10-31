var SRC  = 'app/src/webviews/';
var DEST = 'app/src/main/assets/webviews/';
var m = {
	localStorage_age: '20151003'
};

var gulp         = require( 'gulp' );
var rename       = require( 'gulp-rename' );
var concat       = require( 'gulp-concat');
var es           = require( 'event-stream' );
var less         = require( 'gulp-less' );
var autoprefixer = require( 'gulp-autoprefixer' );
var minifyCss    = require( 'gulp-minify-css' );
var uncss        = require( 'gulp-uncss' );
var imagemin     = require( 'gulp-imagemin' );
var requirejs    = require( 'gulp-requirejs' );
var amdclean     = require( 'gulp-amdclean' );
var uglify       = require( 'gulp-uglify' );
var mustache     = require( 'gulp-mustache' );
var typogr       = require( 'gulp-typogr' );
var hypher       = require( 'gulp-hypher' );
var h_pattern    = require( 'hyphenation.en-gb' );
var htmlmin      = require( 'gulp-htmlmin' );


gulp.task( 'default', ['html', 'css', 'js', 'img'] );


gulp.task( 'html', function() {
	gulp.src( SRC+'html/*.html' )
		.pipe( mustache( m ) )
		.pipe( typogr( { only: ['amp', 'widont', 'caps', 'smartypants'] } ) )
		.pipe( hypher( h_pattern ) )
		.pipe( htmlmin( { removeComments: true, collapseWhitespace: true } ) )
		.pipe( gulp.dest( DEST ) );
} );


gulp.task( 'css', function() {
	gulp.src( [SRC+'less/blueline.less', SRC+'less/ringingPractice.less'] )
		.pipe( less() )
		.pipe( autoprefixer( { browsers: ['Android > 0'] } ) )
		.pipe( concat( 'blueline.css' ) )
		.pipe( minifyCss( { keepSpecialComments: 0 } ) )
		.pipe( gulp.dest( DEST ) );
} );


gulp.task( 'img', function() {
	gulp.src( [SRC+'less/*.svg'] )
		.pipe( imagemin() )
		.pipe( gulp.dest( DEST ) );
} );


gulp.task( 'js', function() {
	var tasks = ['grids', 'custom', 'practice', 'prove'].map( function( s ) {
		return requirejs( {
			baseUrl: SRC+'js/',
			include: [s],
			mainConfigFile: SRC+'js/'+s+'.js',
			optimize: 'none',
			out: s+'.js'
		} )
			.pipe( amdclean.gulp() )
			.pipe( uglify() )
			.pipe( gulp.dest( DEST ) );
	} );
	return es.merge.apply( null, tasks );
} );