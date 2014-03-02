/*
 * GET part by partid
 */

exports.get = function(req, res){

	req.db.findOnePartById( req.params.partid, function( err, part ) {
		//if (err) handle error
		res.render( 'partPage', { part: part } );
		// Testing the output...
		//res.send( JSON.stringify(part) );
	});
};