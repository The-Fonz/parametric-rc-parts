/* This is the backend implementation. The backend can be anything really,
 * if the databse changes, only this file changes. For now it's MongoDB.
 * Backend is a class with methods. It intializes the database on construction.
 * The object can then be passed around and it methods can be called.
 */

var	MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var when = require('when');

// Constructor. Connects to database on instantiation
Database = function ( mongoDbUrl ) {
	self = this; // VERY IMPORTANT
	self.mongoDbUrl = mongoDbUrl;
	self.db = null;
	self.partsColl = null; // Hold collections in object as well
	// TODO: More collections, split part metadata and json obj for speed
}
Database.prototype.init = function (  ) {
	var d = when.defer(); // Set up promise
	function cB ( err, db ) {
		if ( err || db == null) { // If error or datbase object empty
			d.reject(new Error("Database connect error"));
		} else {
			self.db = db; // self.db, not this.db!!!
			self.partsColl = db.collection("parts");
			d.resolve( db ); // Return db???
		}
	}
	MongoClient.connect( self.mongoDbUrl , cB );
	return d.promise;
}
// Inserts the JSON object into the parts collection
Database.prototype.insertPart = function ( jsonObject ) {
	var d = when.defer();
	function checkCb ( err, result ) {
		if (err) d.reject( new Error("Error when inserting part") );
		else d.resolve( result );
	}
	self.partsColl.insert( jsonObject, checkCb );
	return d.promise;
}
// Find one part by its ID.
Database.prototype.findOnePartById = function ( id ) {
	var d = when.defer();
	function cB (err, doc) {
		if (err || !doc) d.reject( new Error("Part not found or error") );
		else d.resolve( doc );
	}
	// If id is a string and not an ObjectID... convert it
	if ( typeof(id) === "string" ) {
		id = ObjectID(id);
	}
	self.partsColl.findOne( { _id: id }, cB );
	return d.promise;
}
// Preliminary function to search multiple parts. Needs filters. And spec.
Database.prototype.findParts = function ( n ) {
	var d = when.defer();
	// This callback function is repeated several times. If it doesn't change much,
	// make it separate (DRY).
	function cB ( err, docs ) {
		if (err) d.reject( new Error("callback error") );
		else if (!docs) d.reject( new Error("doc is empty") );
		else d.resolve( docs );
	}
	self.partsColl.find( {}, { limit: n } ).toArray( cB );
	return d.promise;
}
// Close the database to avoid many connections building up.
Database.prototype.close = function () {
	self.db.close();
}

// Export the class. Needs to be instantiated with `new`.
exports.Database = Database;