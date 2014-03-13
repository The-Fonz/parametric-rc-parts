// Assume jQuery has been imported. On page load:
$(function() {
	// Init cadview with target html element to render in
	var cadview = new CADview( $("#partRenderCanvas") );
	// Load the model from the server
	cadview.load(window.location.pathname + '/threejson');

	// Init parameter module
	//var parmod = new ParamMod( $("#parameterModule") );
	$("#presetDropdownBox").html("Hello there, this is javascript speaking");
	sliderElement = $('<input class="slider"/>');
	$('#sliderBox').append( sliderElement )
	
});