define( ['./PlaceNotation', './Canvas', './MeasureCanvasTextOffset'], function( PlaceNotation, Canvas, MeasureCanvasTextOffset ) {
	var RingingPractice = function( options ) {

		// Key codes
		var LEFT = 37, DOWN = 40, RIGHT = 39, SHIFT = 16;

		// Helper functions
		var arraysEqual = function( a, b ) {
			if (a === b)                { return true; }
			if (a === null || b === null) { return false; }
			if (a.length != b.length)   { return false; }
			for (var i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) { return false; }
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
		if( typeof options.hbIndicator === 'boolean' ) {
			options.hbIndicator = options.hbIndicator | 0;
		}
		if( options.hbIndicator !== 1 && options.hbIndicator !== -1 ) {
			options.hbIndicator = 0;
		}


		// Sizing
		var canvasWidth   = (typeof options.width == 'number')? options.width : container.offsetWidth,
			canvasHeight  = ((typeof options.height == 'number')? options.height : container.offsetHeight) - 30,
			bellWidth     = Math.min( 20, (canvasWidth - 40) / stage ),
			rowHeight     = bellWidth,
			paddingForLeftMostPosition = (canvasWidth - ((stage-1)*bellWidth))/2;

		// Calling clearRect (to clear the canvas after each frame) is surprisingly resource intensive
		// so we only want to clear the part of the canvas we actually draw on
		var clearLeft = Math.floor(Math.max(0, paddingForLeftMostPosition - (bellWidth/3))),
			clearWidth = Math.floor(Math.min((stage-1)*bellWidth + (2*bellWidth/3) + 4, canvasWidth - clearLeft));

		// Clear the container
		container.innerHTML = '';

		// Create the canvas
		var canvas = new Canvas( {
			id: 'practice_canvas',
			width: canvasWidth,
			height: canvasHeight
		} );
		container.appendChild( canvas.element );

		// Create the scoreboard
		var scoreboard = (function() {
			var scoreboard = document.createElement( 'div' );
			scoreboard.className = 'practice_scoreboard';
			container.appendChild( scoreboard );
			var rowCount   = 0,
				errorCount = 0;
			return {
				element: scoreboard,
				show: function() {
					if( options.score ) {
						scoreboard.className = 'practice_scoreboard visible';
					}
				},
				hide: function() {
					scoreboard.className = 'practice_scoreboard';
				},
				reset: function() {
					rowCount = errorCount = 0;
					scoreboard.innerHTML = 'Changes: '+rowCount+'<br/>Errors: '+errorCount;
				},
				score: function() {
					return Math.max(0, Math.round(100 - ((errorCount*100)/rowCount)))+'%';
				},
				correct: function() {
					rowCount++;
					scoreboard.innerHTML = 'Changes: '+rowCount+'<br/>Errors: '+errorCount;
				},
				error: function() {
					errorCount++;
					scoreboard.innerHTML = 'Changes: '+rowCount+'<br/>Errors: '+errorCount;
				}
			};
		})();

		// Red error overlays in the background
		var errorFlash = (function() {
			var errorFlashes = {};
			['left', 'down', 'right'].forEach( function( e ) {
				errorFlashes[e] = document.createElement( 'div' );
				errorFlashes[e].className = 'practice_errorFlash_'+e;
				container.appendChild( errorFlashes[e] );
			} );

			return function( e ) {
				errorFlashes[e].className = 'practice_errorFlash_'+e;
				setTimeout( function() { errorFlashes[e].className = 'error practice_errorFlash_'+e; }, 50 );  // Need the timeout so the browser ticks and the removal of the previous classes actually processes
			};
		})();

		// Pause button
		var pauseButton = (function() {
			var pause = document.createElement( 'div' );
			pause.className = 'practice_pause';
			container.appendChild( pause );
			pauseFunction = function() {
				going = false;
				canvasPaused = true;
				buttons.show();
				pauseButton.hide();
				controls.deactivate();
			};
			pause.addEventListener( 'click', pauseFunction );
			if( typeof document.hidden === 'boolean' ) {
				document.addEventListener( 'visibilitychange', function() {
					if( document.hidden == true && going ) {
						pauseFunction();
					}
				}, false );
			}
			return {
				element: pause,
				show: function() { pause.className = 'practice_pause visible'; },
				hide: function() { pause.className = 'practice_pause'; }
			};
		})();

		// Other buttons
		var buttons = (function() {
			var buttonsContainer = document.createElement( 'div' );
			buttonsContainer.className = 'practice_buttons visible';
			container.appendChild( buttonsContainer );
			if( typeof options.title === 'string' && options.title !== '' ) {
				var title = document.createElement( 'h1' );
				title.appendChild( document.createTextNode( options.title ) );
				buttonsContainer.appendChild( title );
			}
			else {
				buttonsContainer.style.height     = '60px';
				buttonsContainer.style.paddingTop = '12.5px';
			}

			var button_resume   = document.createElement( 'input' );
			button_resume.value = 'Resume';
			button_resume.type  = 'button';
			button_resume.style.display = 'none';
			buttonsContainer.appendChild( button_resume );

			var button_restart   = document.createElement( 'input' );
			button_restart.value = 'Go';
			button_restart.type  = 'button';
			buttonsContainer.appendChild( button_restart );

			button_resume.addEventListener( 'click', function() {
				if( !going ) {
					going = true;
					canvasPaused = false;
					buttons.hide();
					pauseButton.show();
					controls.activate();
					scoreboard.show();
					canvas.element.className = 'visible';
					draw();
				}
			} );
			button_restart.addEventListener( 'click', function() {
				if( !going ) {
					going = true;
					canvasPaused = false;
					setup();
					buttons.hide();
					pauseButton.show();
					controls.activate();
					if( options.score ) { scoreboard.show(); }
					canvas.element.className = 'visible';
					draw();
				}
			} );

			return {
				element: buttonsContainer,
				show: function() {
					if( currentRow > 0 ) {
						button_restart.value = 'Restart';
						button_resume.style.display = 'inline-block';
					}
					if( currentRow === 0 || finished ) {
						button_resume.style.display = 'none';
					}
					buttonsContainer.className = 'practice_buttons visible';
				},
				hide: function() {
					button_resume.blur();
					button_restart.blur();
					buttonsContainer.className = 'practice_buttons';
				}
			};
		})();

		// Controls
		var controls = (function() {
			var controlsContainer = document.createElement( 'div' );
			controlsContainer.className = 'practice_controls';
			container.appendChild( controlsContainer );
			return {
				element: controlsContainer,
				deactivate: function() { controlsContainer.className = 'practice_controls'; },
				activate: function() { controlsContainer.className = 'practice_controls active'; }
			};
		})();

		// Function that flashes the buttons
		var buttonFlash = (function() {
			var control_button = {};
			['left', 'down', 'right'].forEach( function( e ) {
				control_button[e] = document.createElement( 'div' );
				control_button[e].className = 'practice_controls_'+e;
				controls.element.appendChild( control_button[e] );
			} );

			return function( e, type ) {
				control_button[e].className = 'practice_controls_'+e;
				setTimeout( function() { control_button[e].className = type+' practice_controls_'+e; }, 50 ); // Need the timeout so the browser ticks and the removal of the previous classes actually processes
			};
		})();


		// Cache some resuable images to avoid excessive use of slow fillText calls in the drawing function that's meant to run at 60fps
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
				// Check if the clearance rectangle needs to be increase
				if( paddingForLeftMostPosition-bellWidth-8 < clearLeft ) {
					clearWidth = Math.floor( clearWidth + clearLeft - (paddingForLeftMostPosition-bellWidth-8) );
					clearLeft = Math.floor( Math.max( 0, paddingForLeftMostPosition-bellWidth-8 ) );
				}
				return cacheCanvas;
			}() );
			var fillTextCache_bIndicator = ( function() {
				var cacheCanvas = new Canvas( {
					id: 'cc1',
					width: 16,
					height: 16
				} );
				var context  = cacheCanvas.context;
				var bMetrics = MeasureCanvasTextOffset( 16, '12px sans-serif', 'B' );
				context.fillStyle = '#999';
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.font = '12px sans-serif';
				context.fillText( 'B', 8 + bMetrics.x, 8 + bMetrics.y );
				return cacheCanvas;
			}() );
		}
		var fillTextCache_placeStarts = (typeof options.placeStarts === 'object')? ( function() {
			var x, y;
			var cacheCanvas = new Canvas( {
				id: 'cc0',
				width: 22*stage,
				height: 22
			} );
			var context = cacheCanvas.context;
			var placeStartTextMetrics = MeasureCanvasTextOffset( 16, '12px sans-serif', '0' );
			context.strokeStyle = options.lines[following].color;
			context.fillStyle   = '#333';
			context.lineWidth   = 1.5;
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
			// Check if the clearance rectangle needs to be increase
			clearWidth = Math.floor( Math.max( clearWidth, paddingForLeftMostPosition + (stage*bellWidth) + 16 - clearLeft ) );
			return cacheCanvas;
		})() : null;
		var fillTextCache_guides = (function() {
			var cacheCanvas = new Canvas( {
				id: 'cc1',
				width: canvasWidth,
				height: 22
			} );
			var context = cacheCanvas.context;
			context.fillStyle    = '#999';
			context.textAlign    = 'center';
			context.textBaseline = 'middle';
			context.font         = '12px sans-serif';
			for( var i = 0; i < stage; ++i ) {
				context.fillText( PlaceNotation.bellToChar( i ), paddingForLeftMostPosition + (i*bellWidth), 11 );
			}
			return cacheCanvas;
		})();
		var fillTextCache_introduction = (options.introduction)? (function() {
			var cacheCanvas = new Canvas( {
				id: 'cc2',
				width: canvasWidth,
				height: 40
			} );
			var context = cacheCanvas.context;
			context.font         = 'bold 12px sans-serif';
			context.strokeStyle  = 'rgba(255,255,255,0.8)';
			context.lineWidth    = 4;
			context.fillStyle    = '#333';
			context.textAlign    = 'center';
			context.textBaseline = 'middle';
			context.strokeText( 'Use the arrow keys, or', canvasWidth/2, 40/3 );
			context.strokeText( 'tap the screen, to navigate.', canvasWidth/2, 40*2/3 );
			context.fillText( 'Use the arrow keys, or', canvasWidth/2, 40/3 );
			context.fillText( 'tap the screen, to navigate.', canvasWidth/2, 40*2/3 );
			// Check if the clearance rectangle needs to be increase
			var width = context.measureText('tap the screen, to navigate.').width;
			if( Math.floor((canvasWidth - width)/2) < clearLeft ) {
				clearWidth = Math.max( width, clearWidth + clearLeft - Math.floor((canvasWidth - width)/2) );
				clearLeft = Math.floor( Math.max(0, (canvasWidth - width)/2));
			}
			clearWidth = Math.floor(Math.min(Math.max(clearWidth, canvasWidth - clearLeft - (canvasWidth-width)/2), canvasWidth - clearLeft));
			return cacheCanvas;
		})() : null;
		var fillTextCache_thatsAll = (options.thatsAll)? (function() {
			var cacheCanvas = new Canvas( {
				id: 'cc3',
				width: canvasWidth,
				height: 40
			} );
			var context = cacheCanvas.context;
			context.font         = 'bold 15px sans-serif';
			context.strokeStyle  = 'rgba(255,255,255,0.8)';
			context.lineWidth    = 4;
			context.fillStyle    = '#333';
			context.textAlign    = 'center';
			context.textBaseline = 'top';
			context.strokeText( (typeof options.thatsAll == 'string')? options.thatsAll : "That's all!", canvasWidth/2, 0 );
			context.fillText( (typeof options.thatsAll == 'string')? options.thatsAll : "That's all!", canvasWidth/2, 0 );
			return cacheCanvas;
		})() : null;
		var fillTextCache_thatsAllFinished = (options.score)? false : true; // We'll need to draw on the final score later
		var fillTextCache_messagesText = (function() {
			var m = {
				byRow: [],
				canvases: []
			},
				i = 0, width,
				multiLineMatch = /^(\d+)\-(\d+)$/;
			for( var prop in options.messages) {
				prop.split( ',' ).forEach( function( pos ) {
					var multiLineMatchResult = pos.match( multiLineMatch );
					if( multiLineMatchResult !== null ) {
						var x = parseInt( multiLineMatchResult[1] ),
							xLim = parseInt( multiLineMatchResult[2] );
						while( x <= xLim ) {
							m.byRow[x] = i;
							++x;
						}
					}
					else if( !isNaN( parseInt( pos ) ) ) {
						m.byRow[parseInt( pos )] = i;
					}
				} );
				m.canvases[i] = new Canvas( {
					id: 'ccm'+i,
					width: canvasWidth,
					height: 40
				} );
				var context = m.canvases[i].context;
				context.font         = 'bold 12px sans-serif';
				context.strokeStyle  = 'rgba(255,255,255,0.8)';
				context.lineWidth    = 4;
				context.fillStyle    = '#333';
				context.textAlign    = 'center';
				context.textBaseline = 'top';
				context.strokeText( options.messages[prop], canvasWidth/2, 0 );
				context.fillText( options.messages[prop], canvasWidth/2, 0 );
				++i;
				// See if we need to increase the amount of the canvas to clear to make sure the text is covered
				width = context.measureText( options.messages[prop] ).width;
				if( Math.floor((canvasWidth - width)/2) < clearLeft ) {
					clearWidth = Math.max( width, clearWidth + clearLeft - Math.floor((canvasWidth - width)/2) );
					clearLeft = Math.floor( Math.max(0, (canvasWidth - width)/2));
				}
				clearWidth = Math.floor(Math.min(Math.max(clearWidth, canvasWidth - clearLeft - (canvasWidth-width)/2), canvasWidth - clearLeft));
			}
			return m;
		})();


		// Variables used during drawing
		var context      = canvas.context;
		var rows, nextRow, currentPos, nextPos;
		var going        = false;
		var canvasPaused = false;
		var finished     = false;
		var currentRow, targetRow, dotY, previousTimestamp, currentRowAtTimeOfLastTargetRowSet;

		var setup = function() {
			rows       = [startRow.slice(0)];
			nextRow    = PlaceNotation.apply( notation[0], rows[0] );
			currentPos = rows[0].indexOf( following );
			nextPos    = nextRow.indexOf( following );
			currentRow = 0;
			targetRow  = 0;
			dotY       = canvasHeight/2;
			previousTimestamp = null;
			currentRowAtTimeOfLastTargetRowSet = 0;
			scoreboard.reset();
			finished = false;
		};
		setup();

		// Do everything required when the user successfully advances to the next row
		var advance = function( direction ) {
			if( !going ) { return; }
			// Advance the various tracking variables
			rows.push( nextRow.slice(0) );
			currentPos = nextPos;
			targetRow  = rows.length - 1;
			currentRowAtTimeOfLastTargetRowSet = currentRow;
			scoreboard.correct();
			buttonFlash( direction, 'success' );
			// Stop if we're at the end
			if( rows.length > 1 && arraysEqual( nextRow, finishRow ) ) {
				going    = false;
				finished = true;
				buttons.show();
				pauseButton.hide();
				controls.deactivate();
			}
			// Otherwise keep going
			else {
				nextRow = PlaceNotation.apply( notation[(rows.length-1) % notation.length], nextRow );
				nextPos = nextRow.indexOf( following );
			}
		};

		// Do everything required when there is an error
		var error = function( direction ) {
			buttonFlash( direction, 'error' );
			errorFlash( direction );
			scoreboard.error();
			if( typeof Android === 'object' ) { // JavascriptInterface added in Blueline Android app
				Android.buzz();
			}
		};

		// Stepper function
		var rowMoveDuration = 300;
		var step = function( timestamp ) {
			var redrawNeeded = false;
			// Do an initial draw if this is the first run
			if( previousTimestamp === null ) {
				previousTimestamp = timestamp;
				redrawNeeded = true;
			}
			// Full pause
			if( !canvasPaused ) {
				// Animate the user's movement along the line
				if( currentRow < targetRow ) {
					var rowsToMove = Math.min( targetRow - currentRow, ((previousTimestamp - timestamp)/rowMoveDuration)*(((timestamp - previousTimestamp)/rowMoveDuration)-2) * (targetRow - currentRowAtTimeOfLastTargetRowSet) );
					currentRow = Math.min( targetRow, currentRow + rowsToMove );
					dotY  += rowsToMove*rowHeight;
					redrawNeeded = true;
				}
				// Scroll up the line even if the user isn't moving
				if( dotY > canvasHeight/2 ) {
					dotY   = Math.min( canvasHeight - 28 - (fillTextCache_messagesText.byRow.length>0? 20 : 0), Math.max( canvasHeight/2, dotY - Math.max(0.05, (timestamp - previousTimestamp)*(canvasHeight/(rowMoveDuration*10))*Math.pow((dotY-(canvasHeight/2))/(canvasHeight/2), 2) ) ));
					redrawNeeded = true;
				}
				if( redrawNeeded ) { draw(); }
			}
			previousTimestamp = timestamp;
			window.requestAnimationFrame( step );
		};
		window.requestAnimationFrame( step );

		// Draws a frame at the current state
		var draw = function() {
			var i, j,
				x, y,
				comingFromPosition, goingToPosition,
				currentRowCeil  = Math.ceil( currentRow ),
				currentRowFloor = Math.floor( currentRow );

			// Clear
			context.clearRect( clearLeft, 0, clearWidth, canvasHeight );

			// Draw background guides
			context.strokeStyle = '#BBB';
			context.lineWidth   = 0.5;
			context.setLineDash( [4,3] );
			context.lineCap     = 'butt';
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
					fillTextCache_thatsAll.context.fillText( 'Final score: '+scoreboard.score(), canvasWidth/2, 20 );
					fillTextCache_thatsAllFinished = true;
				}
				y = dotY + (1 - ((currentRow%1 === 0)? 1 : currentRow%1))*rowHeight + 20;
				context.globalAlpha = (currentRow%1 === 0)? 1 : currentRow%1;
				context.drawImage( fillTextCache_thatsAll.element, 0, y, canvasWidth, 40 );
				context.globalAlpha = 1;
			}

			// Handstroke/Backstroke indicator
			if( options.hbIndicator !== 0 ) {
				var toI, fromI;
				if( ( currentRowFloor%2 === 0 && options.hbIndicator === 1 ) || ( currentRowFloor%2 === 1 && options.hbIndicator === -1 ) ) {
					toI   = fillTextCache_hIndicator.element;
					fromI = fillTextCache_bIndicator.element;
				}
				else {
					fromI = fillTextCache_hIndicator.element;
					toI   = fillTextCache_bIndicator.element;
				}
				if( currentRow%1 === 0 ) {
					context.drawImage( fromI, paddingForLeftMostPosition-bellWidth-8, dotY-8, 16, 16 );
				}
				else if( currentRow%1 > 0.66 ) {
					context.drawImage( toI, paddingForLeftMostPosition-bellWidth-8, dotY-8, 16, 16 );
				}
				else {
					context.globalAlpha = (currentRow%1)/0.66;
					context.drawImage( toI, paddingForLeftMostPosition-bellWidth-8, dotY-8, 16, 16 );
					context.globalAlpha = 1 - ((currentRow%1)/0.66);
					context.drawImage( fromI, paddingForLeftMostPosition-bellWidth-8, dotY-8, 16, 16 );
					context.globalAlpha = 1;
				}
			}

			// Draw the lines
			if( currentRow > 0 ) {
				context.setLineDash( [] );
				context.lineCap  = 'round';
				context.lineJoin = 'round';
				for( i = 0; i < options.lines.length; ++i ) {
					if( options.lines[i] === null || typeof options.lines[i].color !== 'string' ) {
						continue;
					}
					comingFromPosition = rows[currentRowFloor].indexOf( i );
					goingToPosition    = rows[currentRowCeil].indexOf( i );
					x = paddingForLeftMostPosition + (bellWidth * ((currentRow == currentRowCeil)? goingToPosition : comingFromPosition + ((currentRow%1)*(goingToPosition - comingFromPosition)) ));
					y = dotY;
					context.strokeStyle = options.lines[i].color;
					context.lineWidth   = options.lines[i].width;
					context.beginPath();
					context.moveTo( x, y );
					x  = paddingForLeftMostPosition + (bellWidth * ((currentRow == currentRowCeil)? goingToPosition : comingFromPosition ));
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

			// Draw the user's dot
			comingFromPosition = rows[currentRowFloor].indexOf( following );
			goingToPosition    = rows[currentRowCeil].indexOf( following );
			x = paddingForLeftMostPosition + (bellWidth * ((currentRow == currentRowCeil)? goingToPosition : comingFromPosition + ((currentRow%1)*(goingToPosition - comingFromPosition)) ));
			y = dotY;
			context.fillStyle = options.lines[following].color;
			context.beginPath();
			context.arc( x, y, 4, 0, Math.PI*2, true );
			context.closePath();
			context.fill();

			// Draw overlaid messages
			if( fillTextCache_messagesText.byRow.length > 0 && (typeof fillTextCache_messagesText.byRow[currentRowFloor] !== 'undefined' || typeof fillTextCache_messagesText.byRow[currentRowCeil] !== 'undefined') ) {

				if( fillTextCache_messagesText.byRow[currentRowCeil] === fillTextCache_messagesText.byRow[currentRowFloor] ) {
					context.drawImage( fillTextCache_messagesText.canvases[fillTextCache_messagesText.byRow[currentRowFloor]].element, 0, dotY + 15, canvasWidth, 40 );
				}
				else {
					if( typeof fillTextCache_messagesText.byRow[currentRowCeil] !== 'undefined' ) {
						context.globalAlpha = currentRow%1;
						context.drawImage( fillTextCache_messagesText.canvases[fillTextCache_messagesText.byRow[currentRowCeil]].element, 0, dotY + 15, canvasWidth, 40 );
					}
					if( typeof fillTextCache_messagesText.byRow[currentRowFloor] !== 'undefined' ) {
						context.globalAlpha = 1 - (currentRow%1);
						context.drawImage( fillTextCache_messagesText.canvases[fillTextCache_messagesText.byRow[currentRowFloor]].element, 0, dotY + 15, canvasWidth, 40 );
					}
					context.globalAlpha = 1;
				}
			}
		};


		// Functions which try to go left/down/right
		var left = function() {
			if( going ) {
				if( nextPos - currentPos === -1 ) { advance( 'left' ); }
				else                              { error( 'left' ); }
			}
		};
		var down = function() {
			if( going ) {
				if( nextPos - currentPos === 0 ) { advance( 'down' ); }
				else                             { error( 'down' ); }
			}
		};
		var right = function() {
			if( going ) {
				if( nextPos - currentPos === 1 ) { advance( 'right' ); }
				else                             { error( 'right' ); }
			}
		};
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
					case SHIFT:
						rowMoveDuration = 3000;
						break;
				}
			}
		} );
		document.body.addEventListener( 'keyup', function( e ) {
			if( going ) {
				switch( e.which ) {
					case SHIFT:
						rowMoveDuration = 300;
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
				if( posX <= 0.33 )      { left(); }
				else if( posX >= 0.66 ) { right(); }
				else                    { down(); }
			}
		} );
		container.addEventListener( 'click', function( e ) {
			var classes = e.target.className.split( /\s+/ );
			if( classes.indexOf( 'practice_controls_left' ) !== -1 )       { left(); }
			else if( classes.indexOf( 'practice_controls_down' ) !== -1 )  { down(); }
			else if( classes.indexOf( 'practice_controls_right' ) !== -1 ) { right(); }
		} );
	};

	return RingingPractice;
} );