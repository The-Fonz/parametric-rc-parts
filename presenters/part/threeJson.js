/*
 * GET Three.js JSON, by partid
 */

exports.get = function(req, res){
	var p = req.db.findStdThreeMesh( req.params.partid );
	p.done( function( threemesh ) {
		res.send( threemesh );
	}, function( err ) {
		// This is sent to the client-side JS, user's not gonna see it
		res.status(404).send("Part not found");
	});
		// Handle error with 505
};