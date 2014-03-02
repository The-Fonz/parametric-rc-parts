
/*
 * GET home page.
 */

// Home page, displays list of objects.
exports.index = function(req, res){
	// Get objects from database, req.db is the injected DB
	var parts = null;
	var limit = 12;
	req.db.findParts( limit, function ( err, docs ) {
		//if (err) throw 500? none found, server error
		parts = docs;
		//console.log(docs);
		res.render('index', { title: 'Parametric RC Parts', parts: parts });
	});
};