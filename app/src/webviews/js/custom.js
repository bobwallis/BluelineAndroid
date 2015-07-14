require(['PlaceNotation', 'LocalStorage'], function( PlaceNotation, LocalStorage ) {

	var form = document.getElementById( 'form' ),
		stageInput = document.getElementById( 'stage' ),
		notationInput = document.getElementById( 'notation-input' ),
		notationOutput = document.getElementById( 'notation' ),
		notationParsed = document.getElementById( 'notation-parsed' ),
		submit = document.getElementById( 'submit' );


	var interval;
	var cacheStatus = function() {
		LocalStorage.setItem( 'custom_age', Date.now() );
		LocalStorage.setItem( 'custom_stage', stageInput.value );
		LocalStorage.setItem( 'custom_notation', notationInput.value );
	};
	var restoreStatus = function() {
		var age = LocalStorage.getItem( 'custom_age' );
		if( typeof age === 'number' && Date.now() < age + 5000 ) {
			stageInput.value = LocalStorage.getItem( 'custom_stage' );
			notationInput.value = LocalStorage.getItem( 'custom_notation' );
		}
		interval = setInterval( cacheStatus, 5000 );
		typeNotation();
	};
	window['onPause'] = function() {
		clearInterval( interval );
	};
	window['onResume'] = function() {
		interval = setInterval( cacheStatus, 5000 );
	};


	var typeNotation = function( e ) {
		cacheStatus();
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
	stageInput.addEventListener( 'change', typeNotation );
	restoreStatus();
} );