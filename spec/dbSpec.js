// Enter test entries into database
var Database = require('../database').Database,
        fs = require('fs');


describe("Database", function () {
	
	var dabase = null;

	it("should be able to connect", function ( done ) { // Async!
		dabase = new Database( "mongodb://localhost:27017/exampleDb", function ( err, db ) {
			expect( err ).toBeNull();
			expect( db ).not.toBeNull();
			done();
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
	it("should be able to insert the test model", function ( done ) {
		dabase.insertPart ( dbstork, function ( err, result ) {
			expect( err ).toBeNull();
			// result is an array of records inserted
			//console.log(result[0]._id);
			expect( result[0] ).toEqual( jasmine.objectContaining( dbstork ) );
			dbstork_id = result[0]._id; // Remember id for later retrieval
			expect( dbstork_id ).not.toBeNull();
			done(); // Asynchronous test so we must explicitly say to continue.
		});
	});

	it("should be able to retrieve this very model", function ( done ) {
		// Problem here is dbstork_id, apparently it's not returned by result[0]._id above
		dabase.findOnePartById( dbstork_id, function ( err, doc ) {
			expect( err ).toBeNull();
			expect( doc ).toEqual( jasmine.objectContaining( dbstork ) );
			done();
		});
	});

	// Make sure to close the db
	it("close DB", function() {
		dabase.close(true, function(){});
	});

});


