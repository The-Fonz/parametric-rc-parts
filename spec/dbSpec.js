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

	var dbstorkmeta = null;
	var dbstorkthreejson = null;
	it("test model should be there", function () {
		dbstorkmeta = require('../spec/testModels/dbobject-stork-test-partmeta.json');
		dbstorkthreejson = require('../spec/testModels/dbobject-stork-test-threejson.json');
		expect( dbstorkmeta.owner_id ).toBe("AE5400DB"); // Hard-coded check
		expect( dbstorkthreejson.metadata.formatVersion ).toBe( 3 ); // Hard-coded check
	});

	var dbstork_id = null;
	it("should be able to insert the test part metadata", function ( finished ) {
		var p = dabase.insertPartMeta( dbstorkmeta );
		nodefn.bindCallback( p, function ( err, result ) {
			expect( err ).toBeNull();
			// result is an array of records inserted //console.log(result[0]._id);
			expect( result[0] ).toEqual( jasmine.objectContaining( dbstorkmeta ) );
			dbstork_id = result[0]._id; // Remember id for later retrieval
			expect( dbstork_id ).not.toBeNull();
			finished(); // Asynchronous test so we must explicitly say to continue.
		});
	});
	it("should be able to insert the test part std three mesh", function ( finished ) {
		var p = dabase.insertPartStdThreeMesh( dbstork_id, dbstorkthreejson );
		nodefn.bindCallback( p, function ( err, result ) {
			expect( err ).toBeNull();
			// result is an array of records inserted //console.log(result[0]._id);
			expect( result[0] ).toEqual( jasmine.objectContaining( dbstorkthreejson ) );
			//dbstork_id = result[0]._id; // Remember id for later retrieval
			//expect( dbstork_id ).not.toBeNull();
			finished(); // Asynchronous test so we must explicitly say to continue.
		});
	});

	it("should be able to retrieve the inserted part metadata", function ( finished ) {
		var p = dabase.findPartMeta( dbstork_id );
		nodefn.bindCallback( p, function ( err, doc ) {
			expect( err ).toBeNull();
			expect( doc ).toEqual( jasmine.objectContaining( dbstorkmeta ) );
			finished();
		});
	});
	it("should be able to retrieve the inserted threejson mesh", function ( finished ) {
		var p = dabase.findStdThreeMesh( dbstork_id );
		nodefn.bindCallback( p, function ( err, doc ) {
			expect( err ).toBeNull();
			expect( doc ).toEqual( jasmine.objectContaining( dbstorkthreejson ) );
			finished();
		});
	});

	// Make sure to close the db
	it("close DB", function() {
		dabase.close(true, function(){});
	});

});


