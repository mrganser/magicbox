var express = require('express');
var path = require('path');
var router = express.Router();
var channelsController = require('../controllers/ChannelsController');

/* GET channels listing. */
router.get('/', function(req, res) {
	channelsController.findAll();
    res.render('channels');
});

module.exports = router;
