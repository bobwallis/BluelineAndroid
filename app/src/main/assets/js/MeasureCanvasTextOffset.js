define( ['Canvas', 'LocalStorage'], function( Canvas, LocalStorage ) {
	/*
	 * Text positioning on a <canvas> is inconsistent across browsers and platforms.
	 * This is a problem when trying to get pixel perfect alignments of text and lines.
	 *
	 * This function, given a font and size, will return the offset needed to be applied
	 * to x and y to centre a single character of the font in a sizexsize box when drawing
	 * with textAlign=center and baseLine=middle
	 * It caches the result when used in production.
	*/
	var measureXAndYTextPadding = function( size, font, text ) {
		if( typeof text == 'undefined' ) { text = '0'; }

		var padding = LocalStorage.getItem( 'Metrics.'+font+text );

		if( padding === null ) {
			var canvas = new Canvas( {
				id: 'metric',
				width: size*3,
				height: size*3,
				scale: (typeof window.devicePixelRatio === 'number')? Math.round(window.devicePixelRatio*8) : 8
			} );
			if( canvas !== false ) {
				try {
					var context = canvas.context;
					context.font = font;
					context.textAlign = 'center';
					context.textBaseline = 'middle';
					context.fillStyle = '#F00';
					context.fillText( text, size*1.5, size*1.5 );

					var dim = size*3*canvas.scale,
						imageData = context.getImageData( 0, 0, dim, dim ),
						bottomOfText = false,
						topOfText = false,
						leftOfText = false,
						rightOfText = false,
						row, column;

					// Find top
					for( row = 0; topOfText === false && row < dim; ++row ) {
						for( column = 0; column < dim ; ++column ) {
							if(imageData.data[((row*(dim*4)) + (column*4))] > 0 ) {
								topOfText = row;
								break;
							}
						}
					}
					// Find bottom
					for( row = dim; bottomOfText === false && row > 0; --row ) {
						for( column = 0; column < dim ; ++column ) {
							if( imageData.data[((row*(dim*4)) + (column*4))] > 0 ) {
								bottomOfText = row + 1;
								break;
							}
						}
					}
					// Find left
					for( column = 0; leftOfText === false && column < dim; ++column ) {
						for( row = 0; row < dim ; ++row ) {
							if( imageData.data[((row*(dim*4)) + (column*4))] > 0 ) {
								leftOfText = column;
								break;
							}
						}
					}
					// Find right
					for( column = dim; rightOfText === false && column > 0; --column ) {
						for( row = 0; row < dim ; ++row ) {
							if( imageData.data[((row*(dim*4)) + (column*4))] > 0 ) {
								rightOfText = column + 1;
								break;
							}
						}
					}

					padding = {
						x: ((dim - rightOfText) - leftOfText) / (canvas.scale*2),
						y: ((dim - bottomOfText) - topOfText) / (canvas.scale*2)
					};

					LocalStorage.setItem( 'Metrics.'+font+text, padding );
				}
				catch( e ) {
					padding.x = padding.y = 0;
				}
			}
			canvas = null;
		}
		return padding;
	};

	return measureXAndYTextPadding;
} );