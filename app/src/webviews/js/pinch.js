define( function() {
	return function( target, callbackWhileZooming, callbackWhenZoomingStops ) {
		var requestAnimationFrameId = -1,
			moved = false,
			startZoom = function() {
				if( p1Start[0] === -1 ) {
					return;
				}
				if( moved ) {
					callbackWhileZooming( p1Start, p1Current, p2Start, p2Current );
					moved = false;
				}
				requestAnimationFrameId = window.requestAnimationFrame( startZoom );
			},
			p1Start = [-1, -1],
			p2Start = [-1, -1],
			p1Current = [-1, -1],
			p2Current = [-1, -1];

		var endZoom = function() {
			callbackWhenZoomingStops( p1Start, p1Current, p2Start, p2Current );
			target.removeEventListener( 'touchend', touchEndHandler );
			target.removeEventListener( 'touchmove', touchMoveHandler );
			window.cancelAnimationFrame( requestAnimationFrameId );
			requestAnimationFrameId = p1Start[0] = p1Start[1] = p2Start[0] = p2Start[1] = p1Current[0] = p1Current[1] = p2Current[0] = p2Current[1] = -1;
			moved = false;
			Android.enableNonWebViewTouchEvents();
		};

		var touchStartHandler = function( e ) {
			// If more than 2 touches are detected then end the pinch zoom
			if( e.touches.length > 2 ) {
				endZoom();
			}
			// If 2 are detected, then start running a pinch zoom tracker
			else if( e.touches.length === 2 ) {
				p1Start[0] = e.touches[0].clientX;
				p1Start[1] = e.touches[0].clientY;
				p2Start[0] = e.touches[1].clientX;
				p2Start[1] = e.touches[1].clientY;
				touchMoveHandler( e );
				target.addEventListener( 'touchend', touchEndHandler );
				target.addEventListener( 'touchmove', touchMoveHandler );
				Android.disableNonWebViewTouchEvents();
				startZoom();
			}
		};

		var touchEndHandler = function( e ) {
			// If the number of pointers being tracked drops below 2 then pinch-to-zoom isn't happening any more, so end
			if( e.touches.length !== 2 ) {
				endZoom();
			}
		};

		var touchMoveHandler = function( e ) {
			// If the number of pointers being tracked drops below 2 then pinch-to-zoom isn't happening any more, so end
			if( e.touches.length !== 2 ) {
				endZoom();
			}
			else {
				// Update the state when moving
				moved = true;
				p1Current[0] = e.touches[0].clientX;
				p1Current[1] = e.touches[0].clientY;
				p2Current[0] = e.touches[1].clientX;
				p2Current[1] = e.touches[1].clientY;
			}
		};

		// Listen for touches
		target.addEventListener( 'touchstart', touchStartHandler );
	};
} );