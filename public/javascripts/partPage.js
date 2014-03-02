// Assume jQuery has been imported. On page load:
$(function() {
	// Animate spinner or similar
	function toggleSpinner () {
		$(".partRenderCanvas > .overlay").toggleClass( "hidden" );
		//setTimeout( toggle , 1000 );
	}
	// Init cadview with target object
	var cadview = new CADview( $(".partRenderCanvas") );
	cadview.load(window.location.pathname + '/threejson');

});