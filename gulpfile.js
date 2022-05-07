import gulp         from 'gulp';
import rename       from 'gulp-rename';
import concat       from 'gulp-concat';
import mergeStream  from 'merge-stream';
import less         from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import minifyCss    from 'gulp-minify-css';
import imagemin     from 'gulp-imagemin';
import svg2png      from 'gulp-svg2png';
import requirejs    from 'gulp-requirejs';
import amdclean     from 'gulp-amdclean';
import uglify       from 'gulp-uglify';
import mustache     from 'gulp-mustache';
import typogr       from 'gulp-typogr';
import hypher       from 'gulp-hypher';
import h_pattern    from 'hyphenation.en-gb';
import htmlmin      from 'gulp-htmlmin';

var SRC  = 'app/src/webviews/';
var DEST = 'app/src/main/assets/webviews/';
var m = {
	localStorage_age: '20220507'
};

function gulp_html() {
	return gulp.src( SRC+'html/*.html' )
		.pipe( mustache( m ) )
		.pipe( typogr( { only: ['amp', 'widont', 'smartypants'] } ) )
		.pipe( hypher( h_pattern ) )
		.pipe( htmlmin( { removeComments: true, collapseWhitespace: true } ) )
		.pipe( gulp.dest( DEST ) );
};


function gulp_css() {
	return gulp.src( [SRC+'less/_.less'] )
		.pipe( less() )
		.pipe( autoprefixer() )
		.pipe( concat( 'blueline.css' ) )
		.pipe( minifyCss( { keepSpecialComments: 0 } ) )
		.pipe( gulp.dest( DEST ) );
};


function gulp_img() {
	return mergeStream(
		gulp.src( [SRC+'img/*.svg'] )
			.pipe( imagemin() )
			.pipe( gulp.dest( DEST ) ),
		gulp.src( ['app/src/main/res/**/*.png'] )
			.pipe( imagemin() )
			.pipe( gulp.dest( 'app/src/main/res/' ) )
	);
};


function gulp_icon() {
	var tasks = [ ['mdpi',48], ['hdpi',72], ['xhdpi',96], ['xxhdpi',144], ['xxxhdpi',192] ].map( function( size ) {
		return gulp.src( 'res/icon.svg' )
			.pipe( svg2png( size[1]/192 ) )
			.pipe( imagemin() )
			.pipe( rename( 'ic_launcher.png' ) )
			.pipe( gulp.dest( 'app/src/main/res/mipmap-'+size[0]+'/' ) );
	} );
	return mergeStream.apply( null, tasks );
};
function gulp_iconRound() {
	var tasks = [ ['mdpi',48], ['hdpi',72], ['xhdpi',96], ['xxhdpi',144], ['xxxhdpi',192] ].map( function( size ) {
		return gulp.src( 'res/icon_round.svg' )
			.pipe( svg2png( size[1]/192 ) )
			.pipe( imagemin() )
			.pipe( rename( 'ic_launcher_round.png' ) )
			.pipe( gulp.dest( 'app/src/main/res/mipmap-'+size[0]+'/' ) );
	} );
	return mergeStream.apply( null, tasks );
};
function gulp_iconStore() {
	return gulp.src( 'res/icon_store.svg' )
		.pipe( svg2png( 512/63 ) )
		.pipe( imagemin() )
		.pipe( rename( 'icon_full.png' ) )
		.pipe( gulp.dest( 'res/' ) );
};

function gulp_js() {
	var tasks = ['grids', 'lines', 'custom', 'practice', 'discover'].map( function( s ) {
		return requirejs( {
			baseUrl: SRC+'js/',
			include: [s],
			mainConfigFile: SRC+'js/'+s+'.js',
			optimize: 'none',
			out: s+'.js'
		} ).on('error', function( error ) { console.log( error ); } )
			.pipe( amdclean.gulp() )
			.pipe( uglify() )
			.pipe( gulp.dest( DEST ) );
	} );
	return mergeStream.apply( null, tasks );
};


export default gulp.parallel( gulp_html, gulp_css, gulp_js );
export const images = gulp.parallel( gulp_img, gulp_icon, gulp_iconRound, gulp_iconStore );
