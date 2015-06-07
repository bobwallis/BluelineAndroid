define( ['require', 'jquery', 'GridOptions', 'PlaceNotation', 'Canvas', 'MeasureCanvasTextOffset'], function( require, $, GridOptions, PlaceNotation, Canvas, MeasureCanvasTextOffset ) {

	var MethodGrid = function( passedOptions ) {
		var options = {};

		this.setOptions = function( passedOptions ) {
			options = GridOptions( $.extend( true, options, passedOptions ) );
		};

		this.measure = function() {
			return options.dimensions;
		};

		this.draw = function(returnImage) {
			returnImage = (typeof returnImage !== 'boolean')? false : returnImage;
			// Set up canvas
			var canvas =  new Canvas( {
				id: options.id,
				width: options.dimensions.canvas.width,
				height: options.dimensions.canvas.height
			} );

			// Create some shortcut variables for later use
			var i, j, k, h, w, x, y,
				context = canvas.context,

				numberOfLeads = options.layout.numberOfLeads,
				numberOfColumns = options.layout.numberOfColumns,
				leadsPerColumn = options.layout.leadsPerColumn,
				changesPerColumn = options.layout.changesPerColumn,
				leadLength = options.layout.leadLength,

				rowHeight = options.dimensions.row.height,
				rowWidth = options.dimensions.row.width,
				bellHeight = options.dimensions.bell.height,
				bellWidth = options.dimensions.bell.width,

				canvasTopPadding = options.dimensions.canvas.padding.top,
				canvasLeftPadding = options.dimensions.canvas.padding.left,
				columnRightPadding = options.dimensions.column.padding.right,
				interColumnPadding = options.dimensions.column.padding.between,
				rowWidthWithPadding = options.dimensions.column.padding.between + options.dimensions.column.padding.left + options.dimensions.column.padding.right + options.dimensions.row.width,

				textMetrics;

			// If we're displaying multiple leads, pre-calculate the lead heads for later use
			var leadHeads = [options.startRow];
			if( numberOfLeads > 1 ) {
				for( i = 1; i < numberOfLeads; ++i ) {
					leadHeads.push( PlaceNotation.apply( options.notation.parsed, leadHeads[i-1] ) );
				}
			}

			// Set the background color
			context.fillStyle = options.background.color;
			context.fillRect(0, 0, options.dimensions.canvas.width, options.dimensions.canvas.height);

			// Draw title
			if( options.title.show ) {
				context.fillStyle = options.title.color;
				context.font = options.title.font;
				context.textAlign = 'left';
				context.textBaseline = 'top';
				context.fillText( options.title.text, 0, 0 );
			}

			// Draw notation down side
			if( options.sideNotation.show ) {
				textMetrics = MeasureCanvasTextOffset( parseInt( options.sideNotation.font ), options.sideNotation.font, '0' );
				context.fillStyle = options.sideNotation.color;
				context.font = options.sideNotation.font;
				context.textAlign = 'right';
				context.textBaseline = 'middle';
				y = canvasTopPadding + rowHeight + textMetrics.y;
				for( i = 0; i < options.sideNotation.text.length; ++i ) {
					context.fillText( options.sideNotation.text[i], canvasLeftPadding - 4, (i*rowHeight)+y );
				}
			}

			// Draw vertical guides - shading
			if( options.verticalGuides.shading.show ) {
				context.fillStyle = options.verticalGuides.shading.color;
				for( i = 0; i < numberOfColumns; ++i ) {
					if( options.verticalGuides.shading.fullHeight ) {
						h = rowHeight*(1+(leadLength*((i+1 == numberOfColumns)? Math.max(1,(numberOfLeads%leadsPerColumn)): leadsPerColumn)));
						y = canvasTopPadding;
					}
					else {
						if(i+1 == numberOfColumns) {
							h = rowHeight*leadLength*((numberOfLeads%leadsPerColumn === 0)? leadsPerColumn : numberOfLeads%leadsPerColumn);
						} else {
							h = rowHeight*(0.25+(leadLength*leadsPerColumn));
						}
						y = canvasTopPadding + (bellHeight/2);
					}
					for( k = 1; k < options.stage; k+=2 ) {
						context.fillRect( canvasLeftPadding + (i*rowWidthWithPadding) + ((k-0.5)*bellWidth), y, bellWidth, h );
					}
				}
			}

			// Draw vertical guides - lines
			if( options.verticalGuides.lines.show ) {
				context.lineWidth = options.verticalGuides.lines.width;
				context.lineCap = options.verticalGuides.lines.cap;
				context.strokeStyle = options.verticalGuides.lines.stroke;
				context.setLineDash( options.verticalGuides.lines.dash );
				context.beginPath();
				for( i = 0; i < numberOfColumns; ++i ) {
					if( options.verticalGuides.shading.fullHeight ) {
						h = rowHeight*(1+(leadLength*((i+1 == numberOfColumns)? Math.max(1,(numberOfLeads%leadsPerColumn)): leadsPerColumn)));
						y = canvasTopPadding;
					}
					else {
						if(i+1 == numberOfColumns) {
							h = rowHeight*leadLength*Math.max(1,(numberOfLeads%leadsPerColumn));
						} else {
							h = rowHeight*(0.25+(leadLength*leadsPerColumn));
						}
						y = canvasTopPadding + (bellHeight/2);
					}
					for( k = 0; k < options.stage; ++k ) {
						x = canvasLeftPadding + (i*rowWidthWithPadding) + ((0.5+k)*bellWidth);
						context.moveTo( x, y );
						context.lineTo( x, y + h );
					}
				}
				context.stroke();
			}

			// Draw numbers
			if( options.numbers.show ) {
				// Calculate reused offsets
				var textMetrics = MeasureCanvasTextOffset( Math.max(bellWidth, rowHeight ), options.numbers.font, '0' ),
					columnSidePadding = interColumnPadding + columnRightPadding,
					sidePadding = canvasLeftPadding + (bellWidth/2) + textMetrics.x,
					topPadding = canvasTopPadding + (rowHeight/2) + textMetrics.y;

				// Set up the context
				context.font = options.numbers.font;
				context.textAlign = 'center';
				context.textBaseline = 'middle';

				options.numbers.bells.forEach( function( bellOptions, bell ) { // For each number
					if( bellOptions.color !== 'transparent' ) { // Only bother drawing at all if not transparent
						context.fillStyle = bellOptions.color;

						var char = PlaceNotation.bellToChar( bell ),
							row = options.startRow;

						for( i = 0; i < numberOfColumns; ++i ) {
							for( j = 0; j < leadsPerColumn && (i*leadsPerColumn)+j < numberOfLeads; ++j ) {
								if( j === 0 ) {
									context.fillText( char, sidePadding + (row.indexOf( bell )*bellWidth) + i*(rowWidth+columnSidePadding), topPadding );
								}
								for( k = 0; k < leadLength; ) {
									row = PlaceNotation.apply( options.notation.parsed[k], row );
									context.fillText( char, sidePadding + (row.indexOf( bell )*bellWidth) + i*(rowWidth+columnSidePadding), topPadding+(j*leadLength*rowHeight)+(++k*rowHeight) );
								}
							}
						}
					}
				} );
			}

			// Draw lines
			if( options.lines.show ) {
				i = options.stage;
				while( i-- ) {
					j = options.startRow[i];
					if( typeof options.lines.bells[j] === 'object' && options.lines.bells[j].stroke !== 'transparent' ) {
						context.beginPath();
						for( k = 0; k < numberOfColumns; ++k ) {
							var columnNotation = options.notation.parsed;
							for( l = 1; l < leadsPerColumn && (k*leadsPerColumn)+l < numberOfLeads; ++l ) {
								columnNotation = columnNotation.concat( options.notation.parsed );
							}

							var bell = leadHeads[k*leadsPerColumn].indexOf( j ),
								position = bell, newPosition;

							x = canvasLeftPadding + (k*rowWidthWithPadding) + (bell*bellWidth) + (bellWidth/2);
							y = canvasTopPadding + (rowHeight/2);

							context.moveTo( x, y );
							for( m = 0; m < columnNotation.length; ++m ) {
								newPosition = columnNotation[m].indexOf( position );
								x += (newPosition-position)*bellWidth;
								y += rowHeight;
								context.lineTo( x, y );
								position = newPosition;
							}

							if( (k*leadsPerColumn)+l < numberOfLeads ) {
								newPosition = columnNotation[0].indexOf( position );
								context.lineTo( x + (((newPosition-position)*bellWidth)/4), y + (rowHeight/4) );
							}
						}
						context.strokeStyle = options.lines.bells[j].stroke;
						context.lineWidth = options.lines.bells[j].width;
						context.lineCap = options.lines.bells[j].cap;
						context.lineJoin = options.lines.bells[j].join;
						context.setLineDash( options.lines.bells[j].dash );
						context.stroke();
					}
				}
			}

			// Draw rule offs
			if( options.ruleOffs.show ) {
				context.lineWidth = options.ruleOffs.width;
				context.lineCap = options.ruleOffs.cap;
				context.strokeStyle = options.ruleOffs.stroke;
				context.setLineDash( options.ruleOffs.dash );
				context.beginPath();
				for( i = 0; i < numberOfColumns; ++i ) {
					for( j = 0; j < leadsPerColumn && (i*leadsPerColumn)+j < numberOfLeads; ++j ) {
						for( k = options.ruleOffs.from; k <= leadLength; k += options.ruleOffs.every ) {
							if( k > 0 ) {
								x = canvasLeftPadding + (i*rowWidthWithPadding);
								y = canvasTopPadding + (((j*leadLength)+k)*rowHeight);
								context.moveTo( x, y );
								context.lineTo( x + rowWidth, y );
							}
						}
					}
				}
				context.stroke();
			}

			// Draw place starts
			if( options.placeStarts.show ) {
				options.placeStarts.bells.sort( function(a,b) { return a - b; } );
				context.lineWidth = 1;
				context.setLineDash( [] );
				options.placeStarts.bells.forEach( function( i, pos ) {
					var j = (typeof options.startRow === 'object')? options.startRow[i] : i,
						k, l;
					for( k = 0; k < numberOfColumns; ++k ) {
						for( l = 0; l < leadsPerColumn && (k*leadsPerColumn)+l < numberOfLeads; ++l ) {
							var positionInLeadHead = leadHeads[(k*leadsPerColumn)+l].indexOf( j );

							// The little circle
							var x = canvasLeftPadding + (k*rowWidthWithPadding) + ((positionInLeadHead+0.5)*bellWidth),
								y = canvasTopPadding + (l*rowHeight*leadLength) + Math.max(3.25*2, rowHeight/2);
							
							context.fillStyle = options.lines.bells[j].stroke;
							context.beginPath();
							context.arc( x, y, 2, 0, Math.PI*2, true);
							context.closePath();
							context.fill();

							// The big circle
							x = canvasLeftPadding + (k*rowWidthWithPadding) + rowWidth + 12*pos + 10;
							context.strokeStyle = options.lines.bells[j].stroke;
							context.beginPath();
							context.arc( x, y, 6.5, 0, Math.PI*2, true );
							context.closePath();
							context.stroke();

							// The text inside the big circle
							var placeStartFontSize = ((positionInLeadHead<9)?10:8),
								textMetrics = MeasureCanvasTextOffset( 13, placeStartFontSize+'px '+options.placeStarts.font, (positionInLeadHead+1).toString() );
							context.fillStyle = options.placeStarts.color;
							context.font = placeStartFontSize+'px '+options.placeStarts.font;
							context.textAlign = 'center';
							context.textBaseline = 'middle';
							context.fillText( (positionInLeadHead+1).toString(), x + textMetrics.x, y + textMetrics.y );
						}
					}
				}, this );
			}

			// Draw calling positions
			if( options.callingPositions.show && typeof options.callingPositions.title == 'object' ) {
				context.fillStyle = options.callingPositions.color;
				context.font = options.callingPositions.font;
				context.textAlign = 'left';
				context.textBaseline = 'bottom';

				for( i = 0; i < options.callingPositions.titles.length; ++i ) {
					if( options.callingPositions.titles[i] !== null ) {
						var rowInMethod = options.callingPositions.from + ( options.callingPositions.every * (i+1) ) - 2;
						x = canvasLeftPadding + (Math.floor( rowInMethod/changesPerColumn )*rowWidthWithPadding) + rowWidth + 4;
						y = canvasTopPadding + ((rowInMethod % changesPerColumn) + 1)*rowHeight;
						context.fillText( '-'+options.callingPositions.titles[i], x, y );
					}
				}
			}

			// Return the image
			if( returnImage ) {
				var i = new Image();
				i.width = options.dimensions.canvas.width;
				i.height = options.dimensions.canvas.height;
				i.src = canvas.element.toDataURL();
				return i;
			}
			else {
				return canvas.element;
			}
		};

		// Do an initial set up and return
		if( passedOptions ) {
			this.setOptions( passedOptions );
		}
		
		return this;
	};

	return MethodGrid;
} );
