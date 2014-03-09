/*
 * GET Three.js JSON, by partid
 */

exports.get = function(req, res){
	var p = req.db.findOnePartById( req.params.partid );
	p.done( function( part ) {
		res.send( part.defaultMesh_threejson );
	});
		// Handle error with 505
};