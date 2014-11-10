var express = require('express');
var path = require('path');
var router = express.Router();
var SharedLinksController = require('../controllers/SharedLinksController').SharedLinksController;

/* GET chat listing. */
router.get('/', function(req, res) {
	
	var sharedLinksController = new SharedLinksController();

	sharedLinksController.findAll(function(err, results){
		if (err){
			console.log(err);
		} else {
			if (results){
  				res.sendFile(path.resolve(__dirname + "/../views/magicbox.html"));
			}
		}
	});

});

module.exports = router;

