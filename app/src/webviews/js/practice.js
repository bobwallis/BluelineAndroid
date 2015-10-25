require( ['Canvas', 'RingingPractice', 'PlaceNotation'], function( Canvas, RingingPractice, PlaceNotation ) {

	// Get options
	var queryString = window.location.search.substring(1).length > 0? window.location.search.substring(1) : Android.queryString(),
	qs = (function( a ) {
		if ( a === '' ) return {};
			var b = {};
		for ( var i = 0; i < a.length; ++i ) {
			var p = a[i].split( '=', 2 );
			if (p.length == 1)
				b[p[0]] = '';
			else
				b[p[0]] = decodeURIComponent( p[1].replace( /\+/g, " " ) );
		}
		return b;
	})( queryString.split('&') );
	qs.stage = parseInt( qs.stage );
	qs.notation = PlaceNotation.parse( qs.notation, qs.stage );
	qs.ruleOffs = (typeof qs.ruleOffs == 'string')? JSON.parse( qs.ruleOffs ) : {};
	qs.workingBell = typeof qs.workingBell == 'string' && qs.workingBell == 'lightest'? 'lightest' : 'heaviest';

	// Work out some details about the method
	var leadHead = PlaceNotation.apply( qs.notation, PlaceNotation.rounds( qs.stage ) ),
		follow = PlaceNotation.cycles( leadHead ).map( function( g ) {
			if( typeof qs.workingBell == 'string' && qs.workingBell == 'lightest' ) {
				return Math.min.apply( Math, g );
			}
			else {
				return Math.max.apply( Math, g );
			}
		} )[0],
		huntBells = PlaceNotation.huntBells( qs.notation, qs.stage ),
		lines = new Array( qs.stage );
	for( var i = 0; i < qs.stage; ++i ) {
		if( i == follow ) {
			lines[i] = { color: '#11D', width: 4 };
		}
		else if( huntBells.indexOf( i ) !== -1 ) {
			lines[i] = { color: '#D11', width: 2 };
		}
		else {
			lines[i] = null
		}
	}
	
	// Go!
	RingingPractice( {
		title: qs.title,
		notation: qs.notation,
		stage: qs.stage,
		following: follow,
		lines: lines,
		ruleOffs: qs.ruleOffs,
		placeStarts: { from: 0, every: qs.notation.length },
		introduction: true,
		score: true,
		thatsAll: true,
		startRow: PlaceNotation.rounds( qs.stage ),
		finishRow: PlaceNotation.rounds( qs.stage ),
		container: document.getElementById( 'practice' )
	} );

} );