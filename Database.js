/* This is the backend implementation. The backend can be anything really,
 * if the databse changes, only this file changes. For now it's MongoDB.
 * Backend is a class with methods. It intializes the database on construction.
 * The object can then be passed around and it methods can be called.
 */

var	MongoClient = require('mongodb').MongoClient;

// Constructor. Connects to database on instantiation
Database = function ( mongoDbUrl ) {
	self = this; // VERY IMPORTANT
	self.db = null;
	self.partsColl = null; // Hold collections in object as well
	function cB ( err, db ) {
		if (err) console.error("Backend: Database connect error");
		if (db == null) console.error("Backend: Database object empty");
		self.db = db; // self.db, not this.db!!!
		self.partsColl = db.collection("parts");
	}
	MongoClient.connect( mongoDbUrl , cB );
}
// Inserts the JSON object into the parts collection
Database.prototype.insertPart = function ( jsonObject ) {
	function checkCb ( err, result ) {
		if (err) console.error("Database.insertPart callback");
	}
	self.partsColl.insert( jsonObject, checkCb );
}

Database.prototype.findOnePartById = function ( id, callBack ) {
	function cB (err, doc) {
		if (err) console.error("callback error");
		if (!doc) console.error("doc is empty")
		callBack( doc );
	}
	self.partsColl.findOne( {_id: id}, cB );
}



exports.Database = Database;