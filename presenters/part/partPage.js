/*
 * GET part by partid
 */

exports.get = function(req, res){
	var p = req.db.findPartMeta( req.params.partid );
	p.done( function( part ) {
		res.render( 'partPage', { part: part } );
	}, function( err ) {
		// TODO: Call next(error) to pass it to an error handler
		res.status(404).send("Part not found");
	});
		// Handle errors by showing 505
};