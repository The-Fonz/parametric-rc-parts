
/**
 * Module dependencies
   -------------------*/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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

// Main page
app.get('/', routes.index)
// Part individual page
app.get('/part/:partid', function(req, res) {res.end("Part # " + req.params.partid)});
// Part Three.js JSON
app.get('/part/:partid/threejson', function (req, res) {res.end("JSON # " + req.params.partid)});
// Create page. Authenticate when submitting?
//app.get('/create', routes.create);
// My Parts, user obj??? Require authentication???
// Use Express basicAuth() NO passportjs
//app.get('/myparts', requireAuthentication???, user.myparts);


http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
