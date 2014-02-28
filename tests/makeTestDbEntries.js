// Enter test entries into database
var assert = require('assert'),
  Database = require('Database').Database,
        fs = require('fs');

var daba = new Database( "mongodb://localhost:27017/exampleDb" );

// Synchronously reads entire contents of file, notice toString!
var dbstork = fs.readFileSync('./tests/testModels/dbobject-stork-test.js').
				toString();

console.log( daba.insertPart ( dbstork ) )

