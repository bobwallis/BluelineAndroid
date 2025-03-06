require( ['Canvas', 'RingingPractice', 'PlaceNotation'], function( Canvas, RingingPractice, PlaceNotation ) {
	var i;

	// Utility functions
	var addOrdinalIndicator = function( i ) {
		i = parseInt( i+'', 10 );
		return i + ((i%10 === 1 && i%100 !== 11)? 'st' : (i%10 === 2 && i%100 !== 12)? 'nd' : (i%10 === 3 && i%100 !== 13)? 'rd' : 'th');
	};

	// Set body to the right height
	document.body.style.minHeight = (typeof Android === 'object')? Android.maxLayoutHeight()+'px' : 0;

	// Get options set in the query string
	var queryString = window.location.search.substring(1).length > 0? window.location.search.substring(1) : (typeof Android === 'object')? Android.queryString() : '',
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

	// Show the right number of stage selectors
	var stageSelectors = document.querySelectorAll( '#practice_chooser_bell_list li' );
	for( i = 0; i < stageSelectors.length; ++i ) {
		if( i >= qs.stage ) {
			stageSelectors[i].style.display = 'none';
		}
	}

	// Listen for changes to the place bell and single lead/course selectors
	var radios = document.querySelectorAll( 'ul.tab_group input[type=radio]' );
	for( i = 0; i < radios.length; i++ ) {
		radios[i].addEventListener( 'click', function( e ) {
			for( var node = e.target.parentElement.parentElement.firstChild; node && node.nodeType === 1; node = node.nextElementSibling || node.nextSibling ) {
				node.classList.remove( 'active' );
			}
			e.target.parentElement.classList.add( 'active' );
		} );
	}

	// Work out some details about the method, and create re-usable options
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
		option_lines = new Array( qs.stage );

	// Highlight the right stage selector to start with
		var option_placeStart_radios = document.getElementsByName( 'practice_chooser_bell' );
		for( i = 0; i < option_placeStart_radios.length; i++ ) {
    		if( i == follow ) {
				option_placeStart_radios[i].checked = true;
				option_placeStart_radios[i].parentElement.className = 'active';
			}
			else {
        		option_placeStart_radios[i].checked = false;
				option_placeStart_radios[i].parentElement.className = '';
			}
		}

	// Get elements we need references to
	var practiceOverflow_element = document.getElementById( 'practice_overflow' ),
		practice_element = document.getElementById( 'practice' );

// Open and close handlers
    var openPractice = function( e ) {
		// Stop the default event
		e.preventDefault();
		e.stopPropagation();

		// Read options
		var i;
		var option_placeStart_radios = document.getElementsByName( 'practice_chooser_bell' ),
			option_placeStart;
		for( i = 0; i < option_placeStart_radios.length; i++ ) {
    		if( option_placeStart_radios[i].checked ) {
        		option_placeStart = parseInt( option_placeStart_radios[i].value, 10 );
		        break;
    		}
		}
		var option_leadOrCourse_radios = document.getElementsByName( 'practice_chooser_leadOrCourse' ),
			option_leadOrCourse;
		for( i = 0; i < option_leadOrCourse_radios.length; i++ ) {
    		if( option_leadOrCourse_radios[i].checked ) {
        		option_leadOrCourse = option_leadOrCourse_radios[i].value;
		        break;
    		}
		}
		var option_title = (option_leadOrCourse === 'course')? qs.title : addOrdinalIndicator(option_placeStart)+'s place '+qs.title,
        	option_thatsAll = (option_leadOrCourse === 'course')? "That's all" : ' ',
			option_rows = (option_leadOrCourse === 'course')? false : qs.notation.length;

		for( i = 0; i < qs.stage; ++i ) {
			if( huntBells.indexOf( i ) !== -1 ) {
				option_lines[i] = { color: '#D11', width: 2 };
			}
			else {
				option_lines[i] = null
			}
		}
        option_lines[option_placeStart-1] = { color: (huntBells.indexOf( option_placeStart-1 ) !== -1)? '#D11' : '#11D', width: 4 };

        // Create the practice interface
        RingingPractice( {
            title: option_title,
            notation: qs.notation,
            stage: qs.stage,
            autostart: true,
            buttons: [{ text: 'Close', callback: closePractice }],
            following: option_placeStart-1,
            lines: option_lines,
            ruleOffs: qs.ruleOffs,
            placeStarts: { from: 0, every: qs.notation.length },
            introduction: true,
            score: true,
            thatsAll: option_thatsAll,
            finishRow: option_rows,
            container: practice_element,
            height: document.documentElement.clientHeight,
            width: document.documentElement.clientWidth
		} );

        // Show the practice interface
        practice_element.className = 'practice_container';
		practiceOverflow_element.className = 'open';
		window.requestAnimationFrame( function() {
			practice_element.className = 'practice_container open';
		} );
    };
    var closePractice = function() {
        practice_element.className = 'practice_container';
		window.setTimeout( function() {
		    practiceOverflow_element.className = '';
		}, 425 );
    };

	// Listen for a click on the go button, and set-up and launch the practice interface
	document.getElementById( 'practice_chooser_go_button' ).addEventListener( 'click', openPractice );

} );
