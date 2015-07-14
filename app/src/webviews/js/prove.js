require(['autosize', 'LocalStorage'], function( autosize ) {

	var syntax = document.getElementById( 'syntax' );
	var input = document.getElementById( 'input' );

	autosize( input );

	var interval;
	var cacheStatus = function() {
		LocalStorage.setItem( 'prove_age', Date.now() );
		LocalStorage.setItem( 'prove_syntax', syntax.value );
		LocalStorage.setItem( 'prove_input', input.value );
	};
	var restoreStatus = function() {
		var age = LocalStorage.getItem( 'prove_age' );
		syntax.value = LocalStorage.getItem( 'prove_syntax' ) === null? 'microsiril' : LocalStorage.getItem( 'prove_syntax' );
		if( typeof age === 'number' && Date.now() < age + 5000 ) {
			input.value = LocalStorage.getItem( 'prove_input' );
		}
		interval = setInterval( cacheStatus, 5000 );
	};
	window['onPause'] = function() {
		clearInterval( interval );
	};


	syntax.addEventListener( 'change', cacheStatus );

	input.addEventListener( 'input', function( e ) {
		cacheStatus();
		if( input.value === '' ) {
			submit.disabled = true;
		}
		else {
			submit.disabled = false;
		}
		output.innerHTML = '…';
		output.classList.add( 'placeholder' );
	} );

	restoreStatus();

	// Submit
	var form = document.getElementById( 'form' ),
		submit = document.getElementById( 'submit' );

	var submitForm = function( e ) {
		e.preventDefault();
		input.blur();
		submit.blur();
		gsirilWorker.postMessage( {
			input: input.value,
			args: (syntax.value == 'microsiril')? ['--msiril'] : []
		} );
		autosize.update( input );
		output.innerHTML = '';
		output.classList.remove( 'placeholder' );
		output.style.whiteSpace = 'pre';
	};
	form.addEventListener( 'submit', submitForm );


	// Reset
	var reset = document.getElementById( 'clear' );
	reset.addEventListener( 'click', function( e ) {
		input.value = '';
		autosize.update( input );
		output.innerHTML = '…';
		output.classList.add( 'placeholder' );
	} );


	// Output
	var output = document.getElementById( 'output' );


	// Create the web worker
	var gsirilWorker = new Worker( 'gsiril.worker.js' );
	gsirilWorker.onmessage = function( e ) {
		if(typeof e.data.output == 'string' ) {
			output.innerHTML += e.data.output+"\n";
		}
		else if(typeof e.data.error === 'string') {
			output.style.whiteSpace = 'pre-wrap';
			output.innerHTML += '<span style="color:red">'+e.data.error+"</span>\n";
		}
		else {
			console.log(e.data);
		}
		setTimeout( function() { Android.scrollToBottom(); }, 100 );
	};

} );