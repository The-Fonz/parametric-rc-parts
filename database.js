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
	self.partsMetaColl = null; // Hold collections in object as well
	self.partsStdThreeMeshColl = null;
	// TODO: More collections, split part metadata and json obj for speed
}
Database.prototype.init = function (  ) {
	var d = when.defer(); // Set up promise
	function cB ( err, db ) {
		if ( err || db == null) { // If error or datbase object empty
			d.reject(new Error("Database connect error"));
		} else {
			self.db = db; // self.db, not this.db!!!
			self.partsMetaColl = db.collection("partsMeta");
			self.partsStdThreeMeshColl = db.collection("partsStdThreeMesh");
			d.resolve( db ); // Return db???
		}
	}
	MongoClient.connect( self.mongoDbUrl , cB );
	return d.promise;
}
// Inserts the JSON object into the parts collection. id is optional
Database.prototype._insert = function ( collection, jsonObject, id ) {
	var d = when.defer();
	function checkCb ( err, result ) {
		if (err) d.reject( new Error("Error when inserting part") );
		else d.resolve( result );
	}
	// If id is given, set the object's id
	if ( id ) jsonObject._id = id;
	collection.insert( jsonObject, checkCb );
	return d.promise;
}
// Insert part metadata
Database.prototype.insertPartMeta = function ( jsonObject ) {
	return self._insert ( self.partsMetaColl, jsonObject ) // Returns promise
}
// Insert standard Three.js JSON mesh. Must give an id (that matches the part metadata's)
Database.prototype.insertPartStdThreeMesh = function ( id, jsonThreeMesh ) {
	return self._insert ( self.partsStdThreeMeshColl, jsonThreeMesh, id ) // Returns promise
}
// Find one part by its ID. The underscore indicates that it's a private method.
Database.prototype._findOneById = function ( collection, id ) {
	var d = when.defer();
	function cB (err, doc) {
		if (err || !doc) d.reject( new Error("Not found or error") );
		else d.resolve( doc );
	}
	// If id is a string and not an ObjectID... convert it
	if ( typeof(id) === "string" ) {
		id = ObjectID(id);
	}
	collection.findOne( { _id: id }, cB );
	return d.promise;
}
// Find part metadata by ID
Database.prototype.findPartMeta = function ( id ) {
	return self._findOneById( self.partsMetaColl, id ) // Returns promise
}
// Find standard Three.js JSON mesh
Database.prototype.findStdThreeMesh = function ( id ) {
	return self._findOneById( self.partsStdThreeMeshColl, id ) // Returns promise
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
	self.partsMetaColl.find( {}, { limit: n } ).toArray( cB );
	return d.promise;
}
// Close the database to avoid many connections building up.
Database.prototype.close = function () {
	self.db.close();
}

// Export the class. Needs to be instantiated with `new`.
exports.Database = Database;