var express = require("express");
var path = require("path");
var router = express.Router();
var channelsController = require("../controllers/ChannelsController");
var sharedLinksController = require("../controllers/SharedLinksController");

/* GET channels listing. */
router.get("/", function(req, res) {
  channelsController.findAll(req.db, function(error, result) {
    res.render("channels", { title: "Channels List", channels: result });
  });
});

/*Access one private channel*/
router.get("/:channel/private", function(req, res) {
  sharedLinksController.find(req.params.channel, true, req.db, function(error, result) {
    res.render("magicbox", {
      title: req.params.channel + " - channel",
      channel: req.params.channel,
      links: result,
      secret: true
    });
  });
});

/*Access one channel*/
router.get("/:channel", function(req, res) {
  sharedLinksController.find(req.params.channel, false, req.db, function(error, result) {
    res.render("magicbox", {
      title: req.params.channel + " - channel",
      channel: req.params.channel,
      links: result,
      secret: false
    });
  });
});

module.exports = router;
