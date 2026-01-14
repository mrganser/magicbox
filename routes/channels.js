const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/ChannelsController');
const sharedLinksController = require('../controllers/SharedLinksController');

/* GET channels listing. */
router.get('/', async function (req, res) {
  const result = await channelsController.findAll(req.db);
  res.render('channels', { title: 'Channels List', channels: result });
});

/*Access one private channel*/
router.get('/:channel/private', async function (req, res) {
  const result = await sharedLinksController.find(req.params.channel, true, req.db);
  res.render('magicbox', {
    title: req.params.channel + ' - channel',
    channel: req.params.channel,
    links: result,
    secret: true,
  });
});

/*Access one channel*/
router.get('/:channel', async function (req, res) {
  const result = await sharedLinksController.find(req.params.channel, false, req.db);
  res.render('magicbox', {
    title: req.params.channel + ' - channel',
    channel: req.params.channel,
    links: result,
    secret: false,
  });
});

module.exports = router;
