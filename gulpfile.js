var SRC  = 'app/src/webviews/';
var DEST = 'app/src/main/assets/webviews/';
var m = {
	localStorage_age: '20151003'
};

var gulp            = require( 'gulp' );
var rename          = require( 'gulp-rename' );
var concat          = require( 'gulp-concat');
var es              = require( 'event-stream' );
var less            = require( 'gulp-less' );
var autoprefixer    = require( 'gulp-autoprefixer' );
var minifyCss       = require( 'gulp-minify-css' );
var uncss           = require( 'gulp-uncss' );
var imagemin        = require( 'gulp-imagemin' );
var imagemin_zopfli = require( 'imagemin-zopfli' );
var svg2png         = require( 'gulp-svg2png' );
var requirejs       = require( 'gulp-requirejs' );
var amdclean        = require( 'gulp-amdclean' );
var uglify          = require( 'gulp-uglify' );
var mustache        = require( 'gulp-mustache' );
var typogr          = require( 'gulp-typogr' );
var hypher          = require( 'gulp-hypher' );
var h_pattern       = require( 'hyphenation.en-gb' );
var htmlmin         = require( 'gulp-htmlmin' );


gulp.task( 'default', ['html', 'css', 'js', 'js.workers'] );
gulp.task( 'images', ['img', 'icon', 'icon-store'] );


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
		.pipe( imagemin( { use: [imagemin_zopfli()] } ) )
		.pipe( gulp.dest( DEST ) );
	gulp.src( ['app/src/main/res/**/*.png'] )
		.pipe( imagemin( { use: [imagemin_zopfli()] } ) )
		.pipe( gulp.dest( 'app/src/main/res/' ) );
} );


gulp.task( 'icon', function() {
	var tasks = [ ['mdpi',48], ['hdpi',72], ['xhdpi',96], ['xxhdpi',144], ['xxxhdpi',192] ].map( function( size ) {
		return gulp.src( 'res/icon.svg' )
			.pipe( svg2png( size[1]/192 ) )
			.pipe( imagemin( { use: [imagemin_zopfli()] } ) )
			.pipe( rename( 'ic_launcher.png' ) )
			.pipe( gulp.dest( 'app/src/main/res/mipmap-'+size[0]+'/' ) );
	} );
	return es.merge.apply( null, tasks );
} );
gulp.task( 'icon-store', function() {
	return gulp.src( 'res/icon.svg' )
		.pipe( svg2png( 512/192 ) )
		.pipe( imagemin( { use: [imagemin_zopfli()] } ) )
		.pipe( rename( 'icon.png' ) )
		.pipe( gulp.dest( 'res/' ) );
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

gulp.task( 'js.workers', function() {
	gulp.src( [SRC+'js/gsiril.worker.js'] )
		.pipe( gulp.dest( DEST ) );
} );