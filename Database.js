/* This is the backend implementation. The backend can be anything really,
 * if the databse changes, only this file changes. For now it's MongoDB.
 * Backend is a class with methods. It intializes the database on construction.
 * The object can then be passed around and it methods can be called.
 */

var	MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// Constructor. Connects to database on instantiation
Database = function ( mongoDbUrl, callBack ) {
	self = this; // VERY IMPORTANT
	self.db = null;
	self.partsColl = null; // Hold collections in object as well
	// TODO: More collections, split part metadata and json obj for speed
	function cB ( err, db ) {
		if (db == null) console.error("Backend: Database object empty");
		if (err) {
			console.error("Backend: Database connect error");
		} else {
			self.db = db; // self.db, not this.db!!!
			self.partsColl = db.collection("parts");
		}
		// Let the callback know that we're done
		if (callBack) callBack( err, db );
	}
	MongoClient.connect( mongoDbUrl , cB );
}
// Inserts the JSON object into the parts collection
Database.prototype.insertPart = function ( jsonObject, callBack ) {
	function checkCb ( err, result ) {
		if (err) console.error("Database.insertPart callback");
		if (callBack) callBack ( err, result ); // Call the optional callback
	}
	self.partsColl.insert( jsonObject, checkCb );
}
// Find one part by its ID.
Database.prototype.findOnePartById = function ( id, callBack ) {
	function cB (err, doc) {
		if (err) console.error("callback error");
		if (!doc) console.error("doc is empty");
		if (callBack) callBack( err, doc );
	}
	// If id is a string and not an ObjectID... convert it
	if ( typeof(id) === "string" ) {
		id = ObjectID(id);
	}
	self.partsColl.findOne( { _id: id }, cB );
}
// Preliminary function to search multiple parts. Needs filters. And spec.
Database.prototype.findParts = function ( n, callBack ) {
	function cB ( err, docs ) {
		if (err) console.error("callback error");
		if (!docs) console.error("doc is empty");
		callBack( err, docs );
	}
	self.partsColl.find( {}, { limit: n } ).toArray( cB );
}
// Close the database to avoid many connections building up.
Database.prototype.close = function () {
	self.db.close();
}

// Export the class. Needs to be instantiated with `new`.
exports.Database = Database;