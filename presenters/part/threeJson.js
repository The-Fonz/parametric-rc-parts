/*
 * GET Three.js JSON, by partid
 */

 // URL parsing logic
 var url = require('url');

// Assume parametric generator location
var Manager = require( process.cwd()+ '/../freecad-parametric-generator/manager').Manager;
var genUtils = require( process.cwd()+ '/../freecad-parametric-generator/utils');

// DIRTY
// Looks in '../freecad-parametric-generator/test/example-parts/'
var testFile = 'torus.FCStd';

// Remember manager instance
var managerInstance = null;

exports.get = function(req, res){
	/* Can also be gotten from req itself (because of Express) but I'd rather
	   tough it out in pure Node */
	var hash = url.parse( req.originalUrl ).query;

	if (!hash) {
		// No hash so we'll load the std mesh from the database
		var p = req.db.findStdThreeMesh( req.params.partid );
		p.done( function( threemesh ) {
			res.send( threemesh );
		}, function( err ) {
			// This is sent to the client-side JS, user's not gonna see it
			res.status(404).send("Part not found");
		});
		// Handle error with 505
	
	} else {
		// Hash is present so we'll generate the new model on-the-fly
		var cmdBlock = genUtils.parseHash( hash );

		if (!managerInstance) {
			managerInstance = new Manager();
		}
		
		managerInstance.cmdsAndTessellate( req, res, testFile, cmdBlock );
	}
	
};