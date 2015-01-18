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
router.get('/:channel', function(req, res) {
	sharedLinksController.find(req.params.channel, req.db, function(error, result){
		res.render('magicbox', {channel: req.params.channel, links: result});
	});
});

module.exports = router;
