/*
 * GET part by partid
 */

exports.get = function(req, res){
	res.send("Part # " + req.params.partid);
};