require(['autosize'], function( autosize ) {

	// Set up syntax selector
	var syntaxContainer = document.getElementById( 'syntax-container' ),
		syntaxFront = document.getElementById( 'syntax-front' ),
		syntaxBack = document.getElementById( 'syntax-back' ),
		syntaxText = document.getElementById( 'syntax-text' );

	var openSyntaxSelector = function( e ) {
		syntaxContainer.setAttribute( 'data-direction', 'top' );
		syntaxContainer.classList.add( 'is-open' );
	};

	var chooseSyntax = function( e ) {
		syntaxText.innerHTML = e.target.innerHTML;
		syntaxText.setAttribute( 'data-syntax', e.target.getAttribute( 'data-syntax' ) );
		syntaxContainer.classList.remove( 'is-open' );
	};
	syntaxFront.addEventListener( 'click', openSyntaxSelector );
	syntaxBack.addEventListener( 'click', chooseSyntax );


	// Setup text area
	var input = document.getElementById( 'input' );

	autosize( input );

	input.addEventListener( 'input', function( e ) {
		if( input.value === '' ) {
			submit.disabled = true;
		}
		else {
			submit.disabled = false;
		}
		output.innerHTML = '...';
		output.classList.add( 'placeholder' );
	} );


	// Submit
	var form = document.getElementById( 'form' ),
		submit = document.getElementById( 'submit' );

	var submitForm = function( e ) {
		e.preventDefault();
		input.blur();
		submit.blur();
		gsirilWorker.postMessage( {
			input: input.value,
			args: (syntaxText.getAttribute( 'data-syntax' ) == 'microsiril')? ['--msiril'] : []
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
		output.innerHTML = '...';
		output.classList.add( 'placeholder' );
	} );


	// Output
	var output = document.getElementById( 'output' );


	// Create the web worker
	var gsirilWorker = new Worker( '../js/gsiril.worker.js' );
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