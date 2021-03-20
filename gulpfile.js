var SRC  = 'app/src/webviews/';
var DEST = 'app/src/main/assets/webviews/';
var m = {
	localStorage_age: '20210320'
};

var gulp         = require( 'gulp' );
var rename       = require( 'gulp-rename' );
var concat       = require( 'gulp-concat');
var mergeStream  = require( 'merge-stream' );
var less         = require( 'gulp-less' );
var autoprefixer = require( 'gulp-autoprefixer' );
var minifyCss    = require( 'gulp-minify-css' );
var uncss        = require( 'gulp-uncss' );
var imagemin     = require( 'gulp-imagemin' );
var svg2png      = require( 'gulp-svg2png' );
var requirejs    = require( 'gulp-requirejs' );
var amdclean     = require( 'gulp-amdclean' );
var uglify       = require( 'gulp-uglify' );
var mustache     = require( 'gulp-mustache' );
var typogr       = require( 'gulp-typogr' );
var hypher       = require( 'gulp-hypher' );
var h_pattern    = require( 'hyphenation.en-gb' );
var htmlmin      = require( 'gulp-htmlmin' );


function html() {
	return gulp.src( SRC+'html/*.html' )
		.pipe( mustache( m ) )
		.pipe( typogr( { only: ['amp', 'widont', 'smartypants'] } ) )
		.pipe( hypher( h_pattern ) )
		.pipe( htmlmin( { removeComments: true, collapseWhitespace: true } ) )
		.pipe( gulp.dest( DEST ) );
};


function css() {
	return gulp.src( [SRC+'less/_.less'] )
		.pipe( less() )
		.pipe( autoprefixer() )
		.pipe( concat( 'blueline.css' ) )
		.pipe( minifyCss( { keepSpecialComments: 0 } ) )
		.pipe( gulp.dest( DEST ) );
};


function img() {
	return mergeStream(
		gulp.src( [SRC+'img/*.svg'] )
			.pipe( imagemin() )
			.pipe( gulp.dest( DEST ) ),
		gulp.src( ['app/src/main/res/**/*.png'] )
			.pipe( imagemin() )
			.pipe( gulp.dest( 'app/src/main/res/' ) )
	);
};


function icon() {
	var tasks = [ ['mdpi',48], ['hdpi',72], ['xhdpi',96], ['xxhdpi',144], ['xxxhdpi',192] ].map( function( size ) {
		return gulp.src( 'res/icon.svg' )
			.pipe( svg2png( size[1]/192 ) )
			.pipe( imagemin() )
			.pipe( rename( 'ic_launcher.png' ) )
			.pipe( gulp.dest( 'app/src/main/res/mipmap-'+size[0]+'/' ) );
	} );
	return mergeStream.apply( null, tasks );
};
function iconRound() {
	var tasks = [ ['mdpi',48], ['hdpi',72], ['xhdpi',96], ['xxhdpi',144], ['xxxhdpi',192] ].map( function( size ) {
		return gulp.src( 'res/icon_round.svg' )
			.pipe( svg2png( size[1]/192 ) )
			.pipe( imagemin() )
			.pipe( rename( 'ic_launcher_round.png' ) )
			.pipe( gulp.dest( 'app/src/main/res/mipmap-'+size[0]+'/' ) );
	} );
	return mergeStream.apply( null, tasks );
};
function iconStore() {
	return gulp.src( 'res/icon_store.svg' )
		.pipe( svg2png( 512/63 ) )
		.pipe( imagemin() )
		.pipe( rename( 'icon_full.png' ) )
		.pipe( gulp.dest( 'res/' ) );
};

function js() {
	var tasks = ['grids', 'lines', 'custom', 'practice', 'discover'].map( function( s ) {
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
	return mergeStream.apply( null, tasks );
};


exports.default = gulp.parallel( html, css, js );
exports.images  = gulp.parallel( img, icon, iconRound, iconStore );
