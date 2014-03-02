/*
 * GET Three.js JSON, by partid
 */

exports.get = function(req, res){
	//res.send("ThreeJson for part ID # " + req.params.partid);
	req.db.findOnePartById( req.params.partid, function( err, part ) {
		//if (err) handle error
		//res.render( 'partPage', { part: part } );
		// Testing the output...
		//res.send( JSON.stringify(part.defaultMesh_threejson) );
		res.send( part.defaultMesh_threejson );
	});
};