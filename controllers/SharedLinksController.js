const SharedLinksController = function () {};

SharedLinksController.prototype.find = async function (currentChannel, secret, db) {
  const collection = db.collection('sharedlinks');
  return collection
    .find({ channel: currentChannel, secret: secret })
    .sort({ date: 1 })
    .toArray();
};

SharedLinksController.prototype.new = async function (channel, secret, link, db, io) {
  const collection = db.collection('sharedlinks');
  const currentDate = new Date();

  try {
    await collection.insertOne({
      channel: channel,
      secret: secret,
      link: link,
      date: currentDate,
    });
    io.emit('linkshared', channel, secret, link, currentDate);
  } catch (err) {
    console.log(err);
  }
};

module.exports = new SharedLinksController();
