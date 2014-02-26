
/**
 * Module dependencies
   -------------------*/
var express = require('express');
var http = require('http');
var path = require('path');

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

/**
 * Presenters
 * ----------*/
var pres = {};
pres.index = require('./presenters/index');
pres.part = {};
pres.part.getPartPage = require('./presenters/part/partPage');
pres.part.getThreeJson = require('./presenters/part/threeJson')

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Match anything that does not end in .json
// See http://stackoverflow.com/questions/21962329/regex-that-matches-anything-not-ending-in-json
// Assume that all requests except for the ones ending in .json
// are requesting an html page, thus send header??????
//app.get(/^(?!.*\.json$).*$/, routes.index);

// Routes
// ------
// Main page
app.get('/', pres.index.index)
// Part individual page
app.get('/part/:partid', pres.part.getPartPage.get); // presenter.subject.jsfile.function
// Part Three.js JSON
app.get('/part/:partid/threejson', function (req, res) {res.end("Three.js JSON # " + req.params.partid)});
// Part dependency graph for display with some JS Graphviz library
app.get('/part/:partid/graphviz', function (req, res) {res.end("Graphviz requested for part # ")});

// Create page. Authenticate when submitting?
app.get('/create', function(){});

// Routes that require authentication
// ----------------------------------
// Create new part (called from '/create' page) by uploading FreeCAD
app.post('/part', function () {});
// Modify part (partially)
app.patch('/part/:partid', function () {});
// Delete part
app.delete('/part/:partid', function () {});

// My Parts, user obj??? Require authentication???
// Use passportjs (added as dependency)
app.get('/myparts', function () {});

// Get user overview page (public?)
app.get('/user/:userid', function () {});
// Make new user
app.post('/user', function () {});
// Modify existing user
app.patch('/user/:userid', function () {});


http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
