// Assume jQuery has been imported. Call this function on pageload of partpage.
function PRC_initPartPage() {

	// Init cadview with target html element to render in
	var cadview = new CADview( document.getElementById("partRenderCanvas") );

	// Listens to load event and loads model according to window hash
	// Note: We're using jQuery events here, so we need to wrap cadview
	// as a jQuery object to have .on() and .trigger() available
	$(cadview).on('load', function( evt ) {
		// Construct model url and load model from server
		// Do `.replace("#","?")` on the hash to make it a query, hashes are not sent to the server
		this.load( window.location.pathname + '/threejson' + window.location.hash.replace("#","?"),
		function (obj) {
			// This callback gets called on progress

			// Show bar, hide all else (make sure to apply these classes correctly)
			function tog() {
				// Toggle all elements in .loadbar with class .tog
				$('.loadbar .tog').toggleClass('hidden');

				// Make the loadbar the same height as the title
				$('.loadbar .progress').css('height', $('.loadbar').height() + 'px' );
			}
			tog();
			//console.log( "Progress! Total: " + obj.total + ", loaded: " + obj.loaded );

			if (!obj.loaded || !obj.total) {
				// I've seen obj.total be undefined so let's check for that...
				var progPerc = 50;
			} else {
				var progPerc = obj.loaded / obj.total * 100;
			}

			if (progPerc === 100) {
				console.log("Done loading");
				tog();
			} else {
				console.log("Progress: " + progPerc + "%");
				$('.loadbar .progress-bar').css('width', progPerc + '%');
			}
		});
	});

	// Trigger once to load model at startup
	$(cadview).trigger('load');

	// Make sliders, use custom formatter
	$('.sl').slider({formater: function(value) {
		// Return value with 2 decimals
		return Math.round(value*100)/100;
	}});

	// Listen to slideStop event of all sliders at once
	$('.sl').on('slideStop', function( slideStopEvt ) {

		var idsVals  = [];

		// Iterate over each slider DOM element
		$('.sl').each( function() {

			var id = this.id;
			var val = this.value;

			// If value is not set...
			if (!val) {
				// Use the default value
				val = this.getAttribute('data-slider-value');
			}
			// Append to array
			idsVals.push( [id, val] );
		});


		// Construct new hash containing all parameters
		var newHash = "#";
		$.each( idsVals, function() {
			// Append 'id=val&' to hash
			newHash += ( this[0] + "=" + this[1] + "&" );
		});

		// Change hash in url (hash doesn't reload, search query does)
		// Note: Using `window.location.replace('#hash')` works but doesn't
		//       add to browser history.
		window.location.hash = newHash;

		// Now load new model
		$(cadview).trigger('load');

	});

	
}