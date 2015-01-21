var express = require('express');
var router = express.Router();
var https = require('https');
var sharedLinksController = require('../controllers/SharedLinksController');

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
	if (captcha){
		verifyRecaptcha(captcha, function(success) {
            if (success) {
			    if (channelname){
                    if (secret){
                        console.log('/channels/' + channelname + '/private');
                        res.redirect('/channels/' + channelname + '/private');
                    } else{
                        res.redirect('/channels/' + channelname);
                    }
				} else {
			    	res.render('newchannel', {title: 'Creating new channel', error: "Invalid channel's name"});	
				}
            } else {
				res.render('newchannel', {title: 'Creating new channel', error: "Captcha failed!"});
            }
        });
	} else {
    	res.render('newchannel', {title: 'Creating new channel', error: "Check the captcha before"});
	}
});

var SECRET = "6LdvpwATAAAAALo_iHl-t5lI-_XS_Ox6Ci5acWFA";
 
// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
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
