define( ['deepmerge', 'PlaceNotation', 'MeasureCanvasText'], function( deepmerge, PlaceNotation, MeasureCanvasText ) {

	// Default options (note runtime defaults are set later)
	var defaultOptions = {
		layout: {
			numberOfLeads: 1,
			numberOfColumns: 1
		},
		dimensions: {
			bell: {
				width: 10,
				height: 13
			},
			row: { padding: {} },
			column: { padding: {} },
			canvas: { padding: {} }
		},
		background: {
			color: '#FFF'
		},
		title: {
			show: false,
			text: null,
			font: '12px "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
			color: '#000'
		},
		sideNotation: {
			show: false,
			font: '10px "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
			color: '#999'
		},
		verticalGuides: {
			shading: {
				show: false,
				fullHeight: false,
				color: '#F3F3F3'
			},
			lines: {
				show: false,
				fullHeight: false,
				stroke: '#999',
				dash:   [3,1],
				width:  1,
				cap:    'butt'
			}
		},
		placeStarts: {
			show: false,
			showSmallCircle: true,
			font: '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
			color: '#000',
			diameter: 13,
			width: 1.25,
			from: 0
		},
		callingPositions: {
			show: false,
			font: '10px sans-serif',
			color: '#000'
		},
		ruleOffs: {
			show: false,
			stroke: 'rgba(0,0,0,0.4)',
			dash:   [3,1],
			width:  1,
			cap:    'butt',
			from:   0
		},
		numbers: {
			show: true,
			font: '12px '+((navigator.userAgent.toLowerCase().indexOf('android') > -1)? '' : 'Blueline, "Andale Mono", Consolas, ')+'monospace'
		},
		lines: {
			show: true
		},
		highlighting: {
			show: false,
			colors: []
		}
	};

	var counter = 1;

	return function( passedOptions ) {
		var options = {};
		passedOptions = passedOptions || {};

		// Parse notation passed as a string
		if( typeof passedOptions.notation === 'string' ) {
			passedOptions.notation = {
				text: PlaceNotation.expand( passedOptions.notation, ((typeof passedOptions.stage !== 'undefined')? passedOptions.stage : undefined) ),
			};
			passedOptions.notation.exploded = PlaceNotation.explode( passedOptions.notation.text );
			passedOptions.notation.parsed = PlaceNotation.parse( passedOptions.notation.text, ((typeof passedOptions.stage !== 'undefined')? passedOptions.stage : undefined) );
		}

		// Parse startRow passed as a string
		if( typeof passedOptions.startRow === 'string' ) {
			passedOptions.startRow = passedOptions.startRow.split( '' ).map( PlaceNotation.charToBell );
		}

		// Make runtime adjustments to the default options object
		var defaultRuntimeOptions = {
			id: 'grid_'+(++counter),
			sideNotation: {
				text: passedOptions.notation.exploded
			},
			startRow: PlaceNotation.rounds( passedOptions.stage ),
			layout: {
				leadLength: passedOptions.notation.exploded.length
			},
			lines: {
				bells: ( function( stage ) {
					var bells = [], i = 0;
					for(; i < stage; ++i ) {
						bells.push( {
							width: 1,
							stroke: 'transparent',
							cap: 'round',
							join: 'round',
							dash: []
						} );
					}
					return bells;
				} )( passedOptions.stage )
			},
			numbers: {
				bells: ( function( stage ) {
					var bells = [], i = 0;
					for(; i < stage; ++i ) {
						bells.push( {
							color: '#000'
						} );
					}
					return bells;
				} )( passedOptions.stage )
			},
			ruleOffs: {
				every: passedOptions.notation.exploded.length
			},
			placeStarts: {
				every: passedOptions.notation.exploded.length
			}
		};

		// Allow entire attributes to be set to true or false
		Object.keys( defaultOptions ).forEach( function( e ) {
			if( typeof passedOptions[e] === 'boolean' ) {
				passedOptions[e] = { show: passedOptions[e] };
			}
		} );

		// Merge options object with the defaults
		options = deepmerge.all( [{}, defaultOptions, defaultRuntimeOptions, passedOptions] );

		// Allow title to be shown by just setting title.text
		if( options.title.text !== null ) { options.title.show = true; }

		// Calculate what the 'layout' option object should look like using the passed options to guide
		if( options.layout.numberOfColumns > options.layout.numberOfLeads ) {
			options.layout.numberOfColumns = options.layout.numberOfLeads;
		}
		options.layout.leadsPerColumn = Math.ceil( options.layout.numberOfLeads / options.layout.numberOfColumns );
		options.layout.changesPerColumn = (options.layout.leadsPerColumn * options.layout.leadLength);

		// Calculation what the 'dimensions' object should look like
		// Bell width and row width come from each other, rowWidth overrides bellWidth
		if( typeof options.dimensions.row.width === 'number' ) {
			options.dimensions.bell.width = options.dimensions.row.width / options.stage;
		}
		else if( typeof options.dimensions.bell.width === 'number' ) {
			options.dimensions.row.width = options.dimensions.bell.width * options.stage;
		}
		if( typeof options.dimensions.row.height !== 'number' ) {
			options.dimensions.row.height = options.dimensions.bell.height;
		}

		// Padding
		options.dimensions.canvas.padding = {
			top: 0,
			left: 0
		};
		options.dimensions.column.padding = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			between: (typeof options.dimensions.column.padding.between === 'number' )? options.dimensions.column.padding.between : ((options.layout.numberOfColumns > 1)? 10 : 0)
		};
		options.dimensions.canvas.padding.top += options.title.show? Math.ceil( parseInt( options.title.font )*1.2 ) : 0;
		options.dimensions.canvas.padding.left += options.sideNotation.show? Math.ceil((function() {
			var longest = 0, text = '', i;
			for( i = 0; i < options.sideNotation.text.length; ++i ) {
				if( options.sideNotation.text[i].length > longest ) {
					longest = options.sideNotation.text[i].length;
					text = options.sideNotation.text[i];
				}
			}
			return MeasureCanvasText( new Array(text.length + 1).join( '0' ), options.sideNotation.font ) + parseInt(options.sideNotation.font)/2;
		})()) : 0;

		if( options.placeStarts.show ) {
			options.dimensions.column.padding.right = Math.ceil( Math.max( options.dimensions.column.padding.right, 10 + ( options.placeStarts.bells.length * options.placeStarts.diameter ) ) );
			options.dimensions.canvas.padding.top = Math.ceil( Math.max( options.dimensions.canvas.padding.top, 1 + options.placeStarts.diameter - options.dimensions.row.height) );
		}
		if( options.callingPositions.show ) {
			options.dimensions.column.padding.right = Math.ceil( Math.max( options.dimensions.column.padding.right, 15 ) );
		}

		// Canvas dimensions
		options.dimensions.canvas = {
			width: Math.max(
				options.dimensions.canvas.padding.left + ((options.dimensions.row.width + options.dimensions.column.padding.left + options.dimensions.column.padding.right)*options.layout.numberOfColumns) + (options.dimensions.column.padding.between*(options.layout.numberOfColumns-1)),
				options.title.show? MeasureCanvasText( options.title.text, options.title.font ) : 0
			),
			height: options.dimensions.canvas.padding.top + (options.dimensions.row.height * ((options.layout.leadsPerColumn * options.layout.leadLength)+1)),
			padding: options.dimensions.canvas.padding
		};

		return options;
	};

} );
