require(['jquery', 'Method', 'Grid'], function( $, Method, Grid ) {
	var r = (function() {
		var fns = [],
			listener,
			doc = document,
			hack = doc.documentElement.doScroll,
			domContentLoaded = 'DOMContentLoaded',
			loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
		if (!loaded) {
			doc.addEventListener(domContentLoaded, listener = function() {
				var fn;
				doc.removeEventListener(domContentLoaded, listener);
				loaded = 1;
				while( fn = fns.shift() ) {
					fn();
				}
			} );
		}
		return function( fn ) {
			loaded ? setTimeout( fn, 0 ) : fns.push( fn );
		};

	})();
	
	r( function() {
		var qs = (function( a ) {
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
		})( Android.queryString().split('&') );
		qs.id = 'blueline';
		qs.type = (typeof qs.type == 'string' && (qs.type == 'lines' || qs.type == 'grid'))? qs.type : 'numbers';
		qs.size = (typeof qs.size == 'string' && (qs.size == 'tiny' || qs.size == 'small' || qs.size == 'large' || qs.size == 'xlarge'))? qs.size : 'medium';
		qs.layout = (typeof qs.layout == 'string' && qs.layout == 'oneRow')? 'oneRow' : 'oneColumn';
		qs.calls = (typeof qs.calls == 'string')? JSON.parse( qs.calls ) : {};
		qs.ruleOffs = (typeof qs.ruleOffs == 'string')? JSON.parse( qs.ruleOffs ) : {};
		qs.callingPositions = typeof qs.callingPositions == 'string'? JSON.parse( qs.callingPositions ) : {};

		document.body.className = qs.layout+' '+qs.size;

		switch( qs.size ) {
			case 'tiny':
				qs.fontSize = 10;
				break;
			case 'small':
				qs.fontSize = 12;
				break;
			case 'medium':
				qs.fontSize = 14;
				break;
			case 'large':
				qs.fontSize = 18;
				break;
			case 'xlarge':
				qs.fontSize = 24;
				break;
		}

	    var container = document.getElementById( 'container' ),
	    	method = new Method( qs );

		// Plain course
		var plainCourseGrid = new Grid( $.extend( true, method.gridOptions.plainCourse[qs.type], {
			title: false,
			sideNotation: {
				show: true,
				color: '#999',
				font: (qs.fontSize*0.75)+'px sans-serif'
			},
			layout: {
				numberOfColumns: (qs.layout == 'oneRow')? method.numberOfLeads: 1,
				numberOfLeads: (qs.type == 'grid')? 1 : method.numberOfLeads
			}
		} ) ),
			plainCourseGridImage = plainCourseGrid.draw(true);
		plainCourseContainer = document.createElement( 'div' );
		plainCourseContainer.appendChild( plainCourseGridImage );
		container.appendChild( plainCourseContainer );

		var plainCourseSideNotationPadding = ((plainCourseGrid.measure().column.padding.right||0) - (plainCourseGrid.measure().canvas.padding.left||0))
		plainCourseGridImage.style.marginLeft = plainCourseSideNotationPadding+'px';
		if(qs.layout == 'oneRow') {
			plainCourseContainer.style.marginLeft = (-plainCourseSideNotationPadding)+'px';
		}

		// Calls
		method.gridOptions.calls[qs.type].map( function(e) {
			var callContainer = document.createElement( 'div' ),
				title = document.createElement( 'h1' ),
				titleText = document.createTextNode( e.title.text.replace(':', '') ),
				callGrid = new Grid( $.extend( e, {
					sideNotation: {
						show: true,
						color: '#999',
						font: (qs.fontSize*0.75)+'px sans-serif'
					},
					title: false
				} ) ),
				callGridImage = callGrid.draw(true);
			title.appendChild( titleText );
			callContainer.appendChild( title );
			callContainer.appendChild( callGridImage );
			container.appendChild( callContainer );

			var callSideNotationPadding = ((callGrid.measure().column.padding.right||0) - (callGrid.measure().canvas.padding.left||0));
			callGridImage.style.marginLeft = callSideNotationPadding+'px';
			if(qs.layout == 'oneRow') {
				callContainer.style.marginLeft = (-callSideNotationPadding)+'px';
			}
		} );
	} );
} );