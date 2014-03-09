// Enter test entries into database
var Database = require('../database').Database;
var fs = require('fs');
var nodefn = require('when/node/function');


describe("Database", function () {
	
	var dabase = null;

	it("should be able to connect", function ( finished ) { // Async!
		dabase = new Database( "mongodb://localhost:27017/exampleDb" );
		var p = dabase.init(); // Returns promise
		// Using nodefn.bindCallback allows us to do expect(err).toBeNull, which makes
		// it easier to evaluate if an error occurred or not: when using
		// `done(successfunc, errorfunc)` there's no `err` to test for in the successfunc.
		nodefn.bindCallback( p, function ( err, res ) {
			expect(err).toBeNull();
			finished();
		});
	});

	it("db member of Database object should exist", function () {
		expect( dabase.db ).not.toBeNull();
	});

	var dbstork = null;
	it("test model should be there", function () {
		dbstork = require('../spec/testModels/dbobject-stork-test.json');
		expect( dbstork.owner_id ).toBe("AE5400DB"); // Hard-coded check
	});

	var dbstork_id = null;
	it("should be able to insert the test model", function ( finished ) {
		var p = dabase.insertPart( dbstork );
		nodefn.bindCallback( p, function ( err, result ) {
			expect( err ).toBeNull();
			// result is an array of records inserted
			//console.log(result[0]._id);
			expect( result[0] ).toEqual( jasmine.objectContaining( dbstork ) );
			dbstork_id = result[0]._id; // Remember id for later retrieval
			expect( dbstork_id ).not.toBeNull();
			finished(); // Asynchronous test so we must explicitly say to continue.
		});
	});

	it("should be able to retrieve this very model", function ( finished ) {
		var p = dabase.findOnePartById( dbstork_id );
		nodefn.bindCallback( p, function ( err, doc ) {
			expect( err ).toBeNull();
			expect( doc ).toEqual( jasmine.objectContaining( dbstork ) );
			finished();
		});
	});

	// Make sure to close the db
	it("close DB", function() {
		dabase.close(true, function(){});
	});

});


