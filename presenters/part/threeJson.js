/*
 * GET Three.js JSON, by partid
 */

exports.get = function(req, res){
	res.send("ThreeJson for part ID # " + req.params.partid);
};