require(['PlaceNotation'], function( PlaceNotation ) {

	var form = document.getElementById( 'form' ),
		stageContainer = document.getElementById( 'stage-container' ),
		stageFront = document.getElementById( 'stage-front' ),
		stageBack = document.getElementById( 'stage-back' ),
		stageText = document.getElementById( 'stage-text' ),
		stageOutput = document.getElementById( 'stage' ),
		notationInput = document.getElementById( 'notation-input' ),
		notationOutput = document.getElementById( 'notation' ),
		notationParsed = document.getElementById( 'notation-parsed' ),
		submit = document.getElementById( 'submit' );

	stageBack.scrollTop = 64;

	var openStageSelector = function( e ) {
		stageContainer.setAttribute( 'data-direction', 'top' );
		stageContainer.classList.add( 'is-open' );
	};

	var chooseStage = function( e ) {
		stageText.innerHTML = e.target.innerHTML;
		stageText.classList.remove( 'placeholder' );
		stageOutput.value = e.target.getAttribute( 'data-stage' );
		stageContainer.classList.remove( 'is-open' );
		typeNotation();
	};

	var typeNotation = function( e ) {
		if( notationInput.value !== '' ) {
			var stage = parseInt( stageOutput.value );
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
			notationParsed.innerHTML = '...';
			submit.disabled = true;
		}
	};

	var submitForm = function( e ) {
		if( isNaN( parseInt( stageOutput.value ) ) ) {
			stageOutput.value = Math.max.apply( Math, notationInput.value.split( '' ).map( PlaceNotation.charToBell ) ) + 1;
		}
		notationInput.blur();
		submit.blur();
		return true;
	};

	form.addEventListener( 'submit', submitForm );
	stageFront.addEventListener( 'click', openStageSelector );
	stageBack.addEventListener( 'click', chooseStage );
	notationInput.addEventListener( 'input', typeNotation );
} );