require(['PlaceNotation'], function( PlaceNotation ) {

	var form = document.getElementById( 'form' ),
		stageInput = document.getElementById( 'stage' ),
		notationInput = document.getElementById( 'notation-input' ),
		notationOutput = document.getElementById( 'notation' ),
		notationParsed = document.getElementById( 'notation-parsed' ),
		submit = document.getElementById( 'submit' );

	var typeNotation = function( e ) {
		if( notationInput.value !== '' ) {
			var stage = parseInt( stageInput.value );
			if( isNaN( stage ) ) {
				stage = Math.max.apply( Math, notationInput.value.split( '' ).map( PlaceNotation.charToBell ) ) + 1;
			}

			var longNotation = PlaceNotation.expand( notationInput.value, isNaN( stage )? undefined : stage );

			notationParsed.classList.remove( 'placeholder' );
			notationParsed.innerHTML = longNotation.replace( /(x|\.)/g, function(t) { return ' '+t+' '; } );
			notationOutput.value = longNotation;
			submit.disabled = false;
		}
		else {
			notationParsed.classList.add( 'placeholder' );
			notationParsed.innerHTML = '…';
			submit.disabled = true;
		}
	};

	var submitForm = function( e ) {
		if( isNaN( parseInt( stageInput.value ) ) ) {
			stage.value = Math.max.apply( Math, notationInput.value.split( '' ).map( PlaceNotation.charToBell ) ) + 1;
		}
		notationInput.blur();
		submit.blur();
		return true;
	};

	form.addEventListener( 'submit', submitForm );
	notationInput.addEventListener( 'input', typeNotation );
} );