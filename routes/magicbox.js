var express = require('express');
var path = require('path');
var router = express.Router();
var sharedLinksController = require('../controllers/SharedLinksController');

/* GET chat listing. */
router.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/magicbox.html"));
});

module.exports = router;
