
/*
 * GET home page.
 */

// Home page, displays list of objects.
exports.index = function(req, res){
	// Get objects from database, req.db is the injected DB
	var parts = null;
	var limit = 12;
	var p = req.db.findParts( limit );
	p.done( function ( docs ) {
		parts = docs;
		//console.log(docs);
		res.render('index', { title: 'Parametric RC Parts', parts: parts });
	});
		// Log error and throw 505? "none found, server error"
};