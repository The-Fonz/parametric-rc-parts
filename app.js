
/**
 * Module dependencies
   -------------------*/
var express = require('express');
var http = require('http');
var path = require('path');
var stylus = require('stylus'); // CSS preprocessor
var app = express();

/**
 * All routes
   ----------*/
/*
var routes = {};
// Routes are defined per path, so any request starting with /part is routed by ./routes/part.
// In this example, ./routes/part then routes to a presenter that does the work.
routes.index = require('./routes/index');
routes.part = require('./routes/part');
// User specific routes
var user = require('./routes/user');
*/

// all environments
var PRT = null;
if ('development' == app.get('env')) PRT = 3000; // Development needs another port than 80
else PRT = 80; // In production, we use the standard HTML port 80
app.set('port', process.env.PORT || PRT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// Configure Stylus CSS preprocessor. Note the paths!
// TODO: Only use debug and force in development environment
app.use('/public/stylesheets', stylus.middleware({
  src: __dirname + '/resources/stylesheets',
  dest: __dirname + '/public/stylesheets',
  debug: true,
  force: true,
}));
// First check if a static file is requested...
app.use('/public', express.static(__dirname + '/public'));

// Injecting the app.router here makes the routes take precedence!
app.use(app.router);

// Add a google analytics error sending handler here for production

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
}

// Make database
// -------------
var Database = require('./database').Database;
var dataBase = new Database( "mongodb://localhost:27017/exampleDb" );
dataBase.init().done(); // Inits and throws any unhandled errors by calling done() on the promise

// Routes
// ------
// Inject database for all requests! Injection using new Module(app, db) is
// also possible, but I think that the db object gets copied. My database
// object relies on a callback to provide its self.db object, so maybe this
// hasn't been instantiated yet so doesn't get copied with new Module(app,db).
app.all("*", function( req, res, next ) {
	req.db = dataBase;
  next();
});
// Main page
app.get('/', require('./presenters/index').index)
// Part individual page
app.get('/part/:partid', require('./presenters/part/partPage').get ); // presenter.subject.jsfile.function
// Part Three.js JSON
app.get('/part/:partid/threejson', require('./presenters/part/threeJson').get );
// Part dependency graph for display with some JS Graphviz library
app.get('/part/:partid/graphviz', function (req, res) {res.end("Graphviz requested for part # " + req.params.partid)});

// Create page. Authenticate when submitting?
app.get('/create', function(){}); // Auth path????

// Routes that require authentication
// ----------------------------------
// Create new part (called from '/create' page) by uploading FreeCAD
app.post('/auth/part', function () {});
// Modify part (partially)
app.patch('/auth/part/:partid', function () {});
// Delete part
app.delete('/auth/part/:partid', function () {});

// My Parts, user obj??? Require authentication???
// Use passportjs (added as dependency)
app.get('/auth/myparts', function () {});

// Get user overview page (public?)
app.get('/user/:userid', function () {});
// Make new user
app.post('/user', function () {}); // Auth path???
// Modify existing user
app.patch('/auth/user/:userid', function () {});

// Run Mocha, Jasmine (or other testing framework) tests and output as HTML
app.get('/tests', function (req, res) {res.end("Do all unit tests and output as HTML.")});


http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
