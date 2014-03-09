/*
 * GET part by partid
 */

exports.get = function(req, res){
	var p = req.db.findOnePartById( req.params.partid );
	p.done( function( part ) {
		res.render( 'partPage', { part: part } );
	});
		// Handle errors by showing 505
};