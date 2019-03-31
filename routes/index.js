var express = require('express');
var router = express.Router();
var https = require('https');
var sharedLinksController = require('../controllers/SharedLinksController');
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {title: 'Magic Box'});
});

/* GET new channel page. */
router.get('/newchannel', function(req, res) {
    res.render('newchannel', {title: 'Creating new channel'});
});

/* CREATE new channel. */
router.post('/newchannel', function(req, res) {
	var channelname = req.body.channelname;
    var secret = req.body.secret;
	var captcha = req.body["g-recaptcha-response"];
	if (captcha) {
		verifyRecaptcha(captcha, function(success) {
            if (success) {
			    if (channelname.trim()){
                    if (secret){
                        res.redirect('/channels/' + channelname + '/private');
                    } else {
                        res.redirect('/channels/' + channelname);
                    }
				} else {
			    	res.render('newchannel', {title: 'Creating new channel', error: 'Invalid name of the channel'});	
				}
            } else {
				res.render('newchannel', {title: 'Creating new channel', error: 'Recaptcha v3 failed. Try again.'});
            }
        });
	} else {
    	res.render('newchannel', {title: 'Creating new channel', error: 'Recaptcha v3 failed. Try again.'});
	}
});
 
// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + config.recaptcha.secret + "&response=" + key, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk.toString();
        });
        res.on('end', function() {
            try {
                var parsedData = JSON.parse(data);
	            callback(parsedData.success);
            } catch (e) {
                callback(false);
            }
        });
    });
};

module.exports = router;
