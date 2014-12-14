var express = require('express');
var path = require('path');
var router = express.Router();
var channelsController = require('../controllers/ChannelsController');
var sharedLinksController = require('../controllers/SharedLinksController');

/* GET channels listing. */
router.get('/', function(req, res) {
	channelsController.findAll(req.db, function(error, result){
		res.render('channels', {title: 'Channels List', channels: result});
	});
});

/*Access one channel*/
router.get('/:login', function(req, res) {
	sharedLinksController.find(req.params.login, req.db, function(error, result){
		res.render('magicbox', {title: req.params.login+' - Magic Box', links: result});
	});
});

module.exports = router;
