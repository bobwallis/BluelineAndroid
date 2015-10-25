define( ['PlaceNotation', 'Canvas', 'MeasureCanvasTextOffset'], function( PlaceNotation, Canvas, MeasureCanvasTextOffset ) {
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


		// Set up method options
		var container = (typeof options.container === 'string')? document.getElementById( options.container ) : options.container,
			stage     = parseInt( options.stage ),
			notation  = (typeof options.notation === 'string')? PlaceNotation.parse( PlaceNotation.expand( options.notation, stage ), stage ) : options.notation,
			startRow  = (typeof options.startRow === 'string')? options.startRow.split( '' ).map( PlaceNotation.charToBell ) : ((typeof options.startRow === 'object')? options.startRow.slice(0) : PlaceNotation.rounds( stage )),
			finishRow = (typeof options.finishRow === 'string')? options.finishRow.split( '' ).map( PlaceNotation.charToBell ) : ((typeof options.finishRow === 'object')? options.finishRow.slice(0) : PlaceNotation.rounds( stage )),
			following = options.following;
		if( typeof options.score !== 'boolean' ) {
			options.score = false;
		}
		if( typeof options.introduction !== 'boolean' ) {
			options.introduction = false;
		}
		if( typeof options.thatsAll !== 'boolean' && typeof options.thatsAll !== 'string' ) {
			options.thatsAll = false;
		}
		if( typeof options.hbIndicator !== 'boolean' ) {
			options.hbIndicator = false;
		}

		// Sizing
		var canvasWidth  = (typeof options.width == 'number')? options.width : container.offsetWidth,
			canvasHeight = ((typeof options.height == 'number')? options.height : container.offsetHeight) - 30,
			bellWidth = Math.min( 20, (canvasWidth - 40) / stage ),
			rowHeight = bellWidth,
			rowsToDisplay = Math.floor((canvasHeight-20) / rowHeight),
			paddingForLeftMostPosition = (canvasWidth - ((stage-1)*bellWidth))/2;


		// Create the elements we need to make this all work
		container.innerHTML = '';
		var canvas = new Canvas( {
			id: 'practice_canvas',
			width: canvasWidth,
			height: canvasHeight
		} );
		container.appendChild( canvas.element );
		var scoreboard = document.createElement( 'div' );
		scoreboard.className = 'practice_scoreboard';
		container.appendChild( scoreboard );
		var messages = document.createElement( 'div' );
		messages.className = 'practice_messages';
		container.appendChild( messages );
		var errorFlashes = {};
		['left', 'down', 'right'].forEach( function( e ) {
			errorFlashes[e] = document.createElement( 'div' );
			errorFlashes[e].className = 'practice_errorFlash_'+e;
			container.appendChild( errorFlashes[e] );
		} );
		var pause = document.createElement( 'div' );
		pause.className = 'practice_pause';
		container.appendChild( pause );
		var buttonsContainer = document.createElement( 'div' );
		buttonsContainer.className = 'practice_buttons visible';
		container.appendChild( buttonsContainer );
		if( typeof options.title === 'string' && options.title !== '' ) {
			var title = document.createElement( 'h1' );
			title.appendChild( document.createTextNode( options.title ) );
			buttonsContainer.appendChild( title );
		}
		else {
			buttonsContainer.style.height = '60px';
			buttonsContainer.style.paddingTop = '12.5px';
		}
		var button_resume = document.createElement( 'input' );
		button_resume.value = 'Resume';
		button_resume.type = 'button';
		button_resume.style.display = 'none';
		buttonsContainer.appendChild( button_resume );
		var button_restart = document.createElement( 'input' );
		button_restart.value = 'Go';
		button_restart.type = 'button';
		buttonsContainer.appendChild( button_restart );
		var control_button = {};
		var controlsContainer = document.createElement( 'div' );
		controlsContainer.className = 'practice_controls';
		container.appendChild( controlsContainer );
		['left', 'down', 'right'].forEach( function( e ) {
			control_button[e] = document.createElement( 'div' );
			control_button[e].className = 'practice_controls_'+e;
			controlsContainer.appendChild( control_button[e] );
		} );

		// Cache some resuable images to avoid excessive use of fillText
		if( options.hbIndicator ) {
			var fillTextCache_hIndicator = ( function() {
				var cacheCanvas = new Canvas( {
					id: 'cc1',
					width: 16,
					height: 16
				} );
				var context = cacheCanvas.context;
				var hMetrics = MeasureCanvasTextOffset( 16, '12px sans-serif', 'H' );
				context.fillStyle = '#999';
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.font = '12px sans-serif';
				context.fillText( 'H', 8 + hMetrics.x, 8 + hMetrics.y );
				return cacheCanvas;
			}() );
			var fillTextCache_bIndicator = ( function() {
				var cacheCanvas = new Canvas( {
					id: 'cc1',
					width: 16,
					height: 16
				} );
				var context = cacheCanvas.context;
				var bMetrics = MeasureCanvasTextOffset( 16, '12px sans-serif', 'B' );
				context.fillStyle = '#999';
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.font = '12px sans-serif';
				context.fillText( 'B', 8 + bMetrics.x, 8 + bMetrics.y );
				return cacheCanvas;
			}() );
		}
		var fillTextCache_placeStarts = ( function() {
			var x, y;
			var cacheCanvas = new Canvas( {
				id: 'cc0',
				width: 22*stage,
				height: 22
			} );
			var context = cacheCanvas.context;
			var placeStartTextMetrics = MeasureCanvasTextOffset( 16, '12px sans-serif', '0' );
			context.strokeStyle = options.lines[following].color;
			context.fillStyle = '#333';
			context.lineWidth = 1.5;
			context.setLineDash( [] );
			context.font = '12px sans-serif';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			for( var i = 0; i < stage; ++i ) {
				x = (i+0.5)*22;
				y = 11;
				context.fillText( PlaceNotation.bellToChar( i ), x + placeStartTextMetrics.x, y + placeStartTextMetrics.y );
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
				width: canvasWidth,
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
		var fillTextCache_introduction = (options.introduction)? ( function() {
			var cacheCanvas = new Canvas( {
				id: 'cc2',
				width: canvasWidth,
				height: 40
			} );
			var context = cacheCanvas.context;
			context.font = 'bold 12px sans-serif';
			context.fillStyle = '#333';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillText( "Use the arrow keys, or", canvasWidth/2, 40/3 );
			context.fillText( "tap the screen, to navigate.", canvasWidth/2, 40*2/3 );
			return cacheCanvas;
		}()) : null;
		var fillTextCache_thatsAll = (options.thatsAll)? ( function() {
			var cacheCanvas = new Canvas( {
				id: 'cc3',
				width: canvasWidth,
				height: 40
			} );
			var context = cacheCanvas.context;
			context.font = 'bold 15px sans-serif';
			context.textAlign = 'center';
			context.textBaseline = 'top';
			context.fillText( (typeof options.thatsAll == 'string')? options.thatsAll : "That's all!", canvasWidth/2, 0 );
			return cacheCanvas;
		}()) : null;
		var fillTextCache_thatsAllFinished = (options.score)? false : true; // We'll need to draw on the final score later

		// Get context for drawing
		var context = canvas.context;


		// Track the current position within the method, and advance the row position
		var rows, nextRow, currentPos, nextPos;
		var errorCount;
		var going = false;
		var finished = false;
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
			}
			// Stop if we're at the end
			if( rows.length > 1 && arraysEqual( nextRow, finishRow ) ) {
				going = false;
				finished = true;
				button_restart.value = 'Restart';
				button_restart.style.display = 'inline-block';
				button_resume.style.display = 'none';
				buttonsContainer.className = 'practice_buttons visible';
				scoreboard.className = 'practice_scoreboard';
				pause.className = 'practice_pause';
				controlsContainer.className = 'practice_controls';
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
				var rowsToMove = Math.min( targetRow - currentRow, ((previousTimestamp - timestamp)/250)*(((timestamp - previousTimestamp)/250)-2) * (targetRow - currentRowAtTimeOfLastTargetRowSet) );
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
			rows = [startRow.slice(0)];
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
			finished = false;
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
			context.clearRect( Math.max(0,paddingForLeftMostPosition-(2*bellWidth)), 0, (stage+3)*bellWidth, canvasHeight );

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
				x = paddingForLeftMostPosition + (stage*bellWidth) + 5;
				y = 1;
				for( i = going? currentRowCeil : currentRowCeil-(options.thatsAll?1:0); y > 0 && i >= 0; --i ) {
					y = dotY - (currentRowFloor-i+(currentRow%1)+0.5)*rowHeight;
					if( (i-options.placeStarts.from)%options.placeStarts.every === 0 ) {
						if( i == (currentRowFloor+1) ) { context.globalAlpha = currentRow%1; }
						context.drawImage( fillTextCache_placeStarts.element, Math.floor(rows[i].indexOf( following )*22*fillTextCache_placeStarts.scale), 0, Math.floor(22*fillTextCache_placeStarts.scale), Math.floor(22*fillTextCache_placeStarts.scale), x-11, y-11, 22, 22 );
						if( i == (currentRowFloor+1) ) { context.globalAlpha = 1; }
					}
				}
			}

			// Introduction message
			if( dotY - (currentRow*rowHeight) > 0 && options.introduction ) {
				context.drawImage( fillTextCache_introduction.element, 0, dotY - (currentRow*rowHeight) - 100, canvasWidth, 40 );
			}

			// That's all message
			if( finished && currentRow > 1 && options.thatsAll ) {
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

			// Handstroke/Backstroke indicator
			if( options.hbIndicator ) {
				var toI, fromI;
				if( currentRowFloor%2 == 0 ) {
					toI = fillTextCache_hIndicator.element;
					fromI = fillTextCache_bIndicator.element;
				}
				else {
					fromI = fillTextCache_hIndicator.element;
					toI = fillTextCache_bIndicator.element;
				}
				if( currentRow%1 == 0 ) {
					context.drawImage( fromI, paddingForLeftMostPosition-bellWidth-8, dotY-8, 16, 16 );
				}
				else if( currentRow%1 > 0.66 ) {
					context.drawImage( toI, paddingForLeftMostPosition-bellWidth-8, dotY-8, 16, 16 );
				}
				else {
					context.globalAlpha = currentRow%1;
					context.drawImage( fromI, paddingForLeftMostPosition-bellWidth-8, dotY-8, 16, 16 );
					context.globalAlpha = 1 - (currentRow%1);
					context.drawImage( toI, paddingForLeftMostPosition-bellWidth-8, dotY-8, 16, 16 );
					context.globalAlpha = 1;
				}
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


		// Start/restart/pause buttons
		button_resume.addEventListener( 'click', function() {
			if( !going ) {
				going = true;
				button_resume.blur();
				buttonsContainer.className = 'practice_buttons';
				pause.className = 'practice_pause visible';
				controlsContainer.className = 'practice_controls active';
				if( options.score ) {
					scoreboard.className = 'practice_scoreboard visible';
				}
				canvas.element.className = 'visible';
				draw();
			}
		} );
		button_restart.addEventListener( 'click', function() {
			if( !going ) {
				going = true;
				setup();
				button_restart.blur();
				buttonsContainer.className = 'practice_buttons';
				pause.className = 'practice_pause visible';
				controlsContainer.className = 'practice_controls active';
				if( options.score ) {
					scoreboard.className = 'practice_scoreboard visible';
				}
				canvas.element.className = 'visible';
				draw();
			}
		} );
		pause.addEventListener( 'click', function() {
			going = false;
			button_restart.value = 'Restart';
			button_restart.style.display = (currentRow == 0)? 'none' : 'inline-block';
			button_resume.style.display = 'inline-block';
			buttonsContainer.className = 'practice_buttons visible';
			pause.className = 'practice_pause';
			controlsContainer.className = 'practice_controls';
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
			if( options.score ) {
				++errorCount;
				scoreboard.innerHTML = 'Changes: '+(rows.length-1)+'<br/>Errors: '+errorCount;
			}
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
		container.addEventListener( 'touchstart', function( e ) {
			var touch = event.touches[0],
				containerRect = container.getBoundingClientRect(),
				posX = (touch.clientX - containerRect.left) / containerRect.width;
			if( going && touch.pageY - containerRect.top > 30 ) {
				e.preventDefault(); // This prevents click emulation, so the click event below won't fire as well
				if( posX <= 0.33 ) {
					left();
				}
				else if( posX >= 0.66 ) {
					right();
				}
				else {
					down();
				}
			}
		} );
		container.addEventListener( 'click', function( e ) {
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