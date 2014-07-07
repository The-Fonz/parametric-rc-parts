
// # Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var lessMiddleware = require('less-middleware'); // CSS preprocessor
var app = express();

// ## All environments
var PRT = null;
//console.log(process.env);
// In production, we use the standard HTML port 80
if ('production' == process.env.NODE_ENV) PRT = 80;
else PRT = 3000;
app.set('port', process.env.PORT || PRT); // Set port
// Configuration of views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Middleware definitions
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// TODO: Do gzipping by using app.use(express.compress())
// Configure Stylus CSS preprocessor. Note the paths!
/*
app.use('/public',
  lessMiddleware( path.join(__dirname, '/public') )
);*/
// First check if a static file is requested, before routing.
// TODO: Cache using app.use(....express.static(..., {maxAge: 86400000}))
app.use('/public', express.static(__dirname + '/public'));

// The order in which middleware is defined, matters.
// Doing `app.use(app.router)` first goes through all routes before other middleware.
app.use(app.router);

// Add a google analytics? error sending handler here for production

// If in development, show detailed error pages.
if ('development' == app.get('env')) {
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
}

// ## Make database
var Database = require('./database').Database;
var dataBase = new Database( "mongodb://localhost:27017/exampleDb" );
dataBase.init().done(); // Inits and throws any unhandled errors by calling done() on the promise


// # Routes
// Inject database for all requests. Can also be done by passing to module on require(...) call.
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
app.get('/create', require('./presenters/create/createPage').get ); // Auth path????

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


// # Serve
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
