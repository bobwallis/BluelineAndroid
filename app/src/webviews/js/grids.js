require(['jquery', 'pinch', 'Method', 'Grid'], function( $, pinch, Method, Grid ) {
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
	qs.id = 'blueline';
	qs.calls = (typeof qs.calls == 'string')? JSON.parse( qs.calls ) : {};
	qs.ruleOffs = (typeof qs.ruleOffs == 'string')? JSON.parse( qs.ruleOffs ) : {};
	qs.size = 'medium';
	qs.layout = 'oneColumn';
	qs.fontSize = 15;

	// Configure page
	document.body.className = qs.layout+' '+qs.size;
	var scaleX = 1, scaleY = 1;

	// Get container and method details
	var container = document.getElementById( 'container' ),
		method = new Method( qs );

	// Function to tweak the container padding when pinch-to-zooming
	container.style.padding = '16px';
	var adjustContainer = function() {
		container.style.padding = (parseFloat(container.style.padding)*scaleY)+'px';
	};

	// Drawing the plain course
	var plainCourseContainer = document.createElement( 'div' );
	container.appendChild( plainCourseContainer );
	var plainCourseGridOptions = $.extend( true, method.gridOptions.plainCourse['grid'](), {
		title: false,
		layout: {
			numberOfColumns: 1,
			numberOfLeads: 1
		}
	} );
	var redrawPlainCourseGrid = function() {
		plainCourseContainer.innerHTML = '';
		plainCourseContainer.style.marginBottom = (parseFloat(plainCourseContainer.style.marginBottom)*scaleY)+'px';
		plainCourseGridOptions.dimensions.row.height *= scaleY;
		plainCourseGridOptions.dimensions.row.width *= scaleX;
		plainCourseGridOptions.sideNotation.font = (parseFloat( plainCourseGridOptions.sideNotation.font )*scaleY)+'px sans-serif';
		plainCourseGridOptions.lines.bells = plainCourseGridOptions.lines.bells.map( function( b ) { b.width*=scaleX; return b; } );
		var plainCourseGrid = new Grid( plainCourseGridOptions );
		var plainCourseGridImage = plainCourseGrid.draw();
		plainCourseGridImage.style.marginLeft = ((plainCourseGrid.measure().column.padding.right||0) - (plainCourseGrid.measure().canvas.padding.left||0))+'px';
		plainCourseContainer.appendChild( plainCourseGridImage );
	};
	redrawPlainCourseGrid();

	// Drawing calls
	var callGridOptions = method.gridOptions.calls['grid'](),
		callContainers = [],
		callTitles = [];
	callGridOptions = callGridOptions.map( function( e, i ) {
		callContainers[i] = document.createElement( 'div' );
		callTitles[i] = document.createElement( 'h1' );
		callTitles[i].style.fontSize = '15px';
		callTitles[i].style.marginBottom = '5px';
		callTitles[i].appendChild( document.createTextNode( e.title.text.replace(':', '') ) );
		callContainers[i].appendChild( callTitles[i] );
		container.appendChild( callContainers[i] );
		e.title = false;
		return e;
	} );
	var redrawCallGrids = function() {
		callGridOptions = callGridOptions.map( function( e, i ) {
			callContainers[i].innerHTML = '';
			callTitles[i].style.fontSize = (parseFloat(callTitles[i].style.fontSize)*scaleY)+'px';
			callTitles[i].style.marginBottom = (parseFloat(callTitles[i].style.marginBottom)*scaleY)+'px';
			callContainers[i].appendChild( callTitles[i] );
			callContainers[i].style.marginBottom = (parseFloat(callContainers[i].style.marginBottom)*scaleY)+'px';
			e.dimensions.row.height *= scaleY;
			e.dimensions.row.width *= scaleX;
			e.sideNotation.font = (parseFloat( e.sideNotation.font )*scaleY)+'px sans-serif';
			e.lines.bells = e.lines.bells.map( function( b ) { b.width*=scaleX; return b; } );
			var callGrid = new Grid( e );
			var callGridImage = callGrid.draw();
			callGridImage.style.marginLeft = ((callGrid.measure().column.padding.right||0) - (callGrid.measure().canvas.padding.left||0))+'px';
			callContainers[i].appendChild( callGridImage );
			return e;
		} );
	};
	redrawCallGrids();

	// Watch for pinch zoom
	container.style.transformOrigin = container.style.webkitTransformOrigin = 'top center';
	pinch( document.body,
		// While zooming, scale the container using CSS transform
		function(p1s,p1c,p2s,p2c) {
			var newScaleX = Math.min( 4, Math.max( 0.25, Math.abs((p1c[0]-p2c[0])/(p1s[0]-p2s[0])) ) ),
				newScaleY = Math.min( 4, Math.max( 0.25, Math.abs((p1c[1]-p2c[1])/(p1s[1]-p2s[1])) ) );
			container.style.transform = container.style.webkitTransform = 'scale('+newScaleX+','+newScaleY+')';
		},
		// When done zooming redraw all the grids at the new scale
		function(p1s,p1c,p2s,p2c) {
			scaleX = scaleX*Math.min( 4, Math.max( 0.25, scaleX*Math.abs((p1c[0]-p2c[0])/(p1s[0]-p2s[0])) ) ),
			scaleY = scaleY*Math.min( 4, Math.max( 0.25, scaleY*Math.abs((p1c[1]-p2c[1])/(p1s[1]-p2s[1])) ) );
			adjustContainer();
			redrawPlainCourseGrid();
			redrawCallGrids();
			scaleX = scaleY = 1;
			container.style.transform = container.style.webkitTransform = 'scale(1,1)';
		}
	);

} );