define( function() {
	var skipClickDelay = function( e ) {
		e.preventDefault();
		e.target.click();
	};

	var closestElementOfType = function( el, s ) {
		var matches = (el.document || el.ownerDocument).querySelectorAll(s), i;
		do {
			i = matches.length;
			while( --i >= 0 && matches.item(i) !== el ) {};
		} while( (i < 0) && (el = el.parentElement) ); 
		return el;
	};

	var switchAccordion = function( e ) {
		if( e.target.tagName === 'A' ) { return; }
		e.preventDefault();
		var target = closestElementOfType( e.target, 'dt, dd' ),
			otherTarget = (target.tagName.toUpperCase() === 'DT')? target.nextElementSibling : target.previousElementSibling;
		target.classList.toggle('collapsed');
		target.classList.toggle('expanded');
		otherTarget.classList.toggle('collapsed');
		otherTarget.classList.toggle('expanded');
	};

	return function() {
		var accordionToggles = document.querySelectorAll( '.accordion dt, .accordion dd' );
		for( var i = 0; i < accordionToggles.length; i++ ) {
			accordionToggles[i].addEventListener('click', switchAccordion, false);
		}
	}
} );