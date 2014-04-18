// Assume jQuery has been imported. On page load:
function PRC_initPartPage() {
	// Init cadview with target html element to render in
	var cadview = new CADview( document.getElementById("partRenderCanvas") );
	// Construct model url and load model from server
	cadview.load( window.location.pathname + '/threejson' );

	// Init parameter module
	//var parmod = new ParamMod( $("#parameterModule") );
	$("#presetDropdownBox").html("Hello there, this is javascript speaking");
	sliderElement = $('<input class="slider"/>');
	$('#sliderBox').append( sliderElement );
	// Make sliders
	
}