/*
 * GET Three.js JSON, by partid
 */

 // URL parsing logic
 var url = require('url');
 var path = require('path');

// Assume parametric generator location
var Manager = require( path.resolve( __dirname, '../../../freecad-parametric-generator/manager')).Manager;
var genUtils = require( path.resolve( __dirname, '../../../freecad-parametric-generator/utils'));

// DIRTY
var testFile = path.resolve( __dirname, '../../../freecad-parametric-generator/test/example-parts/torus.FCStd');

// ## Load environment variables that set configuration
// PRC_PYTHON_CMD
var PYTHON_CMD = process.env.PRC_PYTHON_CMD;
if (!PYTHON_CMD) throw Error("PRD_PYTHON_CMD environment variable not set");
//else console.log("PRC_PYTHON_CMD: "+PYTHON_CMD)
// "C:/Program Files (x86)/FreeCAD0.13/bin/python.exe"

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

		// Create new manager instance if non-existent
		if (!managerInstance) {
			managerInstance = new Manager( PYTHON_CMD );
		}
		
		managerInstance.cmdsAndTessellate( req, res, testFile, cmdBlock );
	}
	
};