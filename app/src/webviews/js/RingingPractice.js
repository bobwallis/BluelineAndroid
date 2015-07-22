define( ['PlaceNotation', 'MeasureCanvasTextOffset'], function( PlaceNotation, MeasureCanvasTextOffset ) {
	var RingingPractice = function( options ) {

		// Key codes
		var LEFT = 37, DOWN = 40, RIGHT = 39;

		// Helper functions
		var arraysEqual = function( a, b ) {
			if (a === b) return true;
			if (a == null || b == null) return false;
			if (a.length != b.length) return false;
			for (var i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) return false;
			}
			return true;
		};


		// Validate and create a few options to save having to check for existence later
		if( typeof options.score !== 'boolean' ) {
			options.score = false;
		}
		if( typeof options.thatsAll !== 'boolean' ) {
			options.thatsAll = false;
		}


		// Create the elements we need to make this all work
		options.container.innerHTML = '';
		var errorFlashes = {};
		['left', 'down', 'right'].forEach( function( e ) {
			errorFlashes[e] = document.createElement( 'div' );
			errorFlashes[e].className = 'practice_errorFlash_'+e;
			options.container.appendChild( errorFlashes[e] );
		} );
		var control_button = {};
		var controlsContainer = document.createElement( 'div' );
		controlsContainer.className = 'practice_controls';
		options.container.appendChild( controlsContainer );
		['left', 'down', 'right'].forEach( function( e ) {
			control_button[e] = document.createElement( 'div' );
			control_button[e].className = 'practice_controls_'+e;
			controlsContainer.appendChild( control_button[e] );
		} );
		var canvas = new Canvas( {
			id: 'practice_canvas',
			width: options.container.offsetWidth,
			height: options.container.offsetHeight - controlsContainer.offsetHeight
		} );
		options.container.appendChild( canvas.element );
		var buttonsContainer = document.createElement( 'div' );
		buttonsContainer.className = 'practice_buttons';
		options.container.appendChild( buttonsContainer );
		if( typeof options.title === 'string' && options.title !== '' ) {
			var title = document.createElement( 'h1' );
			title.appendChild( document.createTextNode( options.title ) );
			buttonsContainer.appendChild( title );
		}
		else {
			buttonsContainer.style.height = '60px';
			buttonsContainer.style.paddingTop = '12.5px';
		}
		var button_go = document.createElement( 'input' );
		button_go.value = 'Go';
		button_go.type = 'button';
		buttonsContainer.appendChild( button_go );
		var button_restart = document.createElement( 'input' );
		button_restart.value = 'Restart';
		button_restart.type = 'button';
		button_restart.style.display = 'none';
		buttonsContainer.appendChild( button_restart );
		var scoreboard = document.createElement( 'div' );
		scoreboard.className = 'practice_scoreboard';
		options.container.appendChild( scoreboard );


		// Set up method options
		var stage = options.stage,
			notation = options.notation,
			following = options.following;


		// Sizing
		var canvasWidth = canvas.width,
			canvasHeight = canvas.height,
			bellWidth = Math.min( 20, (canvasWidth - 40) / stage ),
			rowHeight = bellWidth,
			rowsToDisplay = Math.floor((canvasHeight-20) / rowHeight),
			paddingForLeftMostPosition = (canvasWidth - ((stage-1)*bellWidth))/2,
			placeStartTextMetrics = textMetrics = MeasureCanvasTextOffset( 16, '12px sans-serif', '0' );


		// Cache some resuable images to avoid excessive use of fillText
		var fillTextCache_placeStarts = ( function() {
			var x, y;
			var cacheCanvas = new Canvas( {
				id: 'cc0',
				width: 22*stage,
				height: 22
			} );
			var context = cacheCanvas.context;
			var placeStartTextMetrics = textMetrics = MeasureCanvasTextOffset( 16, '12px sans-serif', '0' );
			context.strokeStyle = options.lines[following].color;
			context.fillStyle = '#333';
			context.lineWidth = 1.5;
			context.setLineDash( [] );
			context.font = '12px sans-serif';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			for( var i = 0; i < stage; ++i ) {
				x = (i+0.5)*22 + placeStartTextMetrics.x;
				y = 11 + placeStartTextMetrics.y;
				context.fillText( PlaceNotation.bellToChar( i ), x, y );
				context.beginPath();
				context.arc( x, y, 8, 0, Math.PI*2, true );
				context.closePath();
				context.stroke();
			}
			return cacheCanvas;
		}() );
		var fillTextCache_guides = ( function() {
			var cacheCanvas = new Canvas( {
				id: 'cc1',
				width: options.container.offsetWidth,
				height: 22
			} );
			var context = cacheCanvas.context;
			context.fillStyle = '#999';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.font = '12px sans-serif';
			for( var i = 0; i < stage; ++i ) {
				context.fillText( PlaceNotation.bellToChar( i ), paddingForLeftMostPosition + (i*bellWidth), 11 );
			}
			return cacheCanvas;
		}() );
		var fillTextCache_thatsAll = (options.thatsAll)? ( function() {
			var cacheCanvas = new Canvas( {
				id: 'cc2',
				width: options.container.offsetWidth,
				height: 40
			} );
			var context = cacheCanvas.context;
			context.font = 'bold 15px sans-serif';
			context.textAlign = 'center';
			context.textBaseline = 'top';
			context.fillText( "That's all!", canvasWidth/2, 0 );
			return cacheCanvas;
		}()) : null;
		var fillTextCache_thatsAllFinished = (options.score)? false : true; // We'll need to draw on the final score later

		// Get context for drawing
		var context = canvas.context;


		// Track the current position within the method, and advance the row position
		var finishRow, rows, nextRow, currentPos, nextPos;
		var errorCount;
		var going = false;
		var advance = function() {
			if( !going ) {
				return;
			}
			// Advance the various tracking variables
			rows.push( nextRow.slice(0) );
			currentPos = nextPos;
			targetRow = rows.length - 1;
			currentRowAtTimeOfLastTargetRowSet = currentRow;
			// Update the scoreboard
			if( options.score ) {
				scoreboard.innerHTML = 'Changes: '+(rows.length-1)+'<br/>Errors: '+errorCount;
				scoreboard.style.opacity = 1;
			}
			// Stop if we're at the end
			if( rows.length > 1 && arraysEqual( nextRow, finishRow ) ) {
				going = false;
				button_go.style.display = 'none';
				button_restart.style.display = 'inline-block';
				buttonsContainer.style.opacity = 1;
				scoreboard.style.opacity = 0;
			}
			// Otherwise keep going
			else {
				nextRow = PlaceNotation.apply( notation[(rows.length-1) % notation.length], nextRow );
				nextPos = nextRow.indexOf( following );
			}
		};


		// Stepper function
		var currentRow, targetRow, dotY, pixelsMoved, previousTimestamp, currentRowAtTimeOfLastTargetRowSet;
		var step = function( timestamp ) {
			var doDraw = false;
			// Do an initial draw if this is the first run
			if( previousTimestamp === null ) {
				previousTimestamp = timestamp;
				doDraw = true;
			}
			// Animate the user's movement along the line
			if( currentRow < targetRow ) {
				var rowsToMove = Math.min( targetRow - currentRow, ((previousTimestamp - timestamp)/200)*(((timestamp - previousTimestamp)/200)-2) * (targetRow - currentRowAtTimeOfLastTargetRowSet) );
				currentRow = Math.min( targetRow, currentRow + rowsToMove );
				dotY += rowsToMove*rowHeight;
				doDraw = true;
			}
			// Scroll up the line even if the user isn't moving
			if( dotY > canvasHeight/2 ) {
				dotY = Math.min( canvasHeight - 28, Math.max( canvasHeight/2, dotY - Math.max(0.05, (timestamp - previousTimestamp)*(canvasHeight/3000)*Math.pow((dotY-(canvasHeight/2))/(canvasHeight/2), 2) ) ));
				doDraw = true;
			}
			if( doDraw ) {
				draw();
			}
			previousTimestamp = timestamp;
			window.requestAnimationFrame( step );
		};
		window.requestAnimationFrame( step );


		var setup = function() {
			finishRow = typeof options.finishRow === 'object'? options.finishRow.slice(0) : PlaceNotation.rounds( stage );
			rows = [(typeof options.startRow === 'object'? options.startRow.slice(0) : PlaceNotation.rounds( stage ))];
			nextRow = PlaceNotation.apply( notation[0], rows[0] );
			currentPos = rows[0].indexOf( following );
			nextPos = nextRow.indexOf( following );
			currentRow = 0;
			targetRow = 0;
			dotY = canvasHeight/2;
			previousTimestamp = null;
			currentRowAtTimeOfLastTargetRowSet = 0;
			errorCount = 0;
			scoreboard.innerHTML = 'Changes: 0<br/>Errors: 0';
		};
		setup();

		// Function which draws the canvas
		var draw = function() {
			var i, j,
				x, y,
				currentRowCeil = Math.ceil( currentRow ),
				currentRowFloor = Math.floor( currentRow );

			// Reusable position variables
			var comingFromPosition = rows[currentRowFloor].indexOf( following ),
				goingToPosition = rows[currentRowCeil].indexOf( following );

			// Clear
			context.clearRect( paddingForLeftMostPosition-8, 0, (stage*bellWidth)+33, canvasHeight );

			// Draw background guides
			context.strokeStyle = '#BBB';
			context.lineWidth = 0.5;
			context.setLineDash( [4,3] );
			context.lineCap = 'butt';
			context.beginPath();
			for( i = 0; i < stage; ++i ) {
				context.moveTo( paddingForLeftMostPosition + (i*bellWidth), (dotY-(currentRow*rowHeight))%7 );
				context.lineTo( paddingForLeftMostPosition + (i*bellWidth), canvasHeight - 22 );
			}
			context.stroke();

			// Draw place guides
			context.drawImage( fillTextCache_guides.element, 0, canvasHeight - 22, canvasWidth, 22 );

			// Draw rules offs
			if( typeof options.ruleOffs === 'object' ) {
				y = 1;
				context.lineWidth = 1;
				context.setLineDash( [3,1] );
				for( i = going? currentRowFloor+1 : currentRowFloor; y > 0 && i > 0; --i ) {
					y = dotY - (currentRowFloor-i+(currentRow%1)+0.5)*rowHeight;
					if( (i-options.ruleOffs.from)%options.ruleOffs.every === 0 ) {
						context.strokeStyle = (i==(currentRowFloor+1))? 'rgba(153,153,153,'+ Math.round((currentRow%1)*10)/10 +')' : '#999';
						context.beginPath();
						context.moveTo( paddingForLeftMostPosition - (bellWidth/3), y );
						context.lineTo( paddingForLeftMostPosition + ((stage-1)*bellWidth) + (bellWidth/3), y );
						context.stroke();
					}
				}
			}

			// Draw place starts
			if( typeof options.placeStarts === 'object' ) {
				x = paddingForLeftMostPosition + (stage*bellWidth) + 15;
				y = 1;
				for( i = going? currentRowCeil : currentRowCeil-1; y > 0 && i >= 0; --i ) {
					y = dotY - (currentRowFloor-i+(currentRow%1)+0.5)*rowHeight;
					if( (i-options.placeStarts.from)%options.placeStarts.every === 0 ) {
						if( i == (currentRowFloor+1) ) { context.globalAlpha = currentRow%1; }
						context.drawImage( fillTextCache_placeStarts.element, rows[i].indexOf( following )*22*fillTextCache_placeStarts.scale, 0, 22*fillTextCache_placeStarts.scale, 22*fillTextCache_placeStarts.scale, x-11, y-11, 22, 22 );
						if( i == (currentRowFloor+1) ) { context.globalAlpha = 1; }
					}
				}
			}

			// That's all message
			if( !going && currentRow > 1 && options.thatsAll ) {
				if( !fillTextCache_thatsAllFinished && options.score ) {
					fillTextCache_thatsAll.context.font = '13px sans-serif';
					fillTextCache_thatsAll.context.fillText( 'Final score: '+Math.max(0, Math.round(100 - ((errorCount*100)/(rows.length-1))))+'%', canvasWidth/2, 20 );
					fillTextCache_thatsAllFinished = true;
				}
				y = dotY + (1 - ((currentRow%1 == 0)? 1 : currentRow%1))*rowHeight + 20;
				context.globalAlpha = (currentRow%1 == 0)? 1 : currentRow%1;
				context.drawImage( fillTextCache_thatsAll.element, 0, y, canvasWidth, 40 );
				context.globalAlpha = 1;
			}

			// Draw the user's dot
			x = paddingForLeftMostPosition + (bellWidth * ((currentRow == currentRowCeil)? goingToPosition : comingFromPosition + ((currentRow%1)*(goingToPosition - comingFromPosition)) )),
			y = dotY;
			context.fillStyle = options.lines[following].color;
			context.beginPath();
			context.arc( x, y, 4, 0, Math.PI*2, true );
			context.closePath();
			context.fill();

			// Draw the lines
			if( currentRow > 0 ) {
				context.setLineDash( [] );
				context.lineCap = 'round';
				context.lineJoin = 'round';
				for( i = 0; i < options.lines.length; ++i ) {
					if( options.lines[i] === null || typeof options.lines[i].color !== 'string' ) {
						continue;
					}
					comingFromPosition = rows[currentRowFloor].indexOf( i ),
					goingToPosition = rows[currentRowCeil].indexOf( i ),
					x = paddingForLeftMostPosition + (bellWidth * ((currentRow == currentRowCeil)? goingToPosition : comingFromPosition + ((currentRow%1)*(goingToPosition - comingFromPosition)) )),
					y = dotY;
					context.strokeStyle = options.lines[i].color;
					context.lineWidth = options.lines[i].width;
					context.beginPath();
					context.moveTo( x, y );
					x = paddingForLeftMostPosition + (bellWidth * ((currentRow == currentRowCeil)? goingToPosition : comingFromPosition ));
					y -= (currentRow - currentRowFloor)*rowHeight;
					context.lineTo( x, y );
					for( j = 1; (typeof rows[currentRowFloor-j] !== 'undefined') && y > 0; j++ ) {
						x  = paddingForLeftMostPosition + (bellWidth * rows[currentRowFloor-j].indexOf( i ));
						y -= rowHeight;
						context.lineTo( x, y );
					}
					context.stroke();
				}
			}
		};


		// Start/restart buttons
		button_go.addEventListener( 'click', function() {
			going = true;
			button_go.blur();
			buttonsContainer.style.opacity = 0;
			canvas.element.style.opacity = 1;
			draw();
		} );
		button_restart.addEventListener( 'click', function() {
			going = true;
			setup();
			button_restart.blur();
			buttonsContainer.style.opacity = 0;
		} );


		// Functions which try to go left/down/right
		var left = function() {
			if( going ) {
				if( nextPos - currentPos === -1 ) {
					buttonFlash( 'left', 'success' );
					advance();
				}
				else {
					buttonFlash( 'left', 'error' );
					errorFlash( 'left' );
					buzz();
				}
			}
		};
		var down = function() {
			if( going ) {
				if( nextPos - currentPos === 0 ) {
					buttonFlash( 'down', 'success' );
					advance();
				}
				else {
					buttonFlash( 'down', 'error' );
					errorFlash( 'down' );
					buzz();
				}
			}
		};
		var right = function() {
			if( going ) {
				if( nextPos - currentPos === 1 ) {
					buttonFlash( 'right', 'success' );
					advance();
				}
				else {
					buttonFlash( 'right', 'error' );
					errorFlash( 'right' );
					buzz();
				}
			}
		};


		// Function to do the highlighting of the left/down/right buttons on click
		var buttonFlash = function( e, type ) {
			control_button[e].classList.remove( 'success' );
			control_button[e].classList.remove( 'error' );
			setTimeout( function() { control_button[e].classList.add( type ); }, 50 ); // Need the timeout so the browser ticks and the removal of the previous classes actually processes
		};
		// and of the error overlays
		var errorFlash = function( e ) {
			errorFlashes[e].classList.remove( 'error' );
			setTimeout( function() { errorFlashes[e].classList.add( 'error' ); }, 50 );  // Need the timeout so the browser ticks and the removal of the previous classes actually processe
			++errorCount;
			scoreboard.innerHTML = 'Changes: '+(rows.length-1)+'<br/>Errors: '+errorCount;
		};
		// Buzz
		var buzz = function() {
			if( typeof Android === 'object' ) { // JavascriptInterface added in Blueline Android app
				Android.buzz();
			}
		}


		// Add user interaction listeners
		document.body.addEventListener( 'keydown', function( e ) {
			if( going ) {
				switch( e.which ) {
					case LEFT:
						e.preventDefault();
						left();
						break;
					case DOWN:
						e.preventDefault();
						down();
						break;
					case RIGHT:
						e.preventDefault();
						right();
						break;
				}
			}
		} );
		options.container.addEventListener( 'touchstart', function( e ) {
			if( going ) {
				e.preventDefault(); // This prevents click emulation, so the click event below won't fire as well
				var touch = event.touches[0],
					pos = touch.clientX / document.body.clientWidth;
				if( pos <= 0.33 ) {
					left();
				}
				else if( pos >= 0.66 ) {
					right();
				}
				else {
					down();
				}
			}
		} );
		options.container.addEventListener( 'click', function( e ) {
			if( e.target.classList.contains( 'practice_controls_left' ) ) {
				left();
			}
			else if( e.target.classList.contains( 'practice_controls_down' ) ) {
				down();
			}
			else if( e.target.classList.contains( 'practice_controls_right' ) ) {
				right();
			}
		} );
	};

	return RingingPractice;
} );