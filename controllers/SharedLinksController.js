var SharedLinksController = function () {};

SharedLinksController.prototype.find = function (currentChannel, secret, db, callback) {
  var collection = db.collection('sharedlinks');

  collection
    .find({ channel: currentChannel, secret: secret })
    .sort({ date: 1 })
    .toArray(function (err, result) {
      if (err) {
        console.log(err);
        callback(err, []);
      } else {
        callback(null, result);
      }
    });
};

SharedLinksController.prototype.new = function (channel, secret, link, db, io) {
  var collection = db.collection('sharedlinks');
  var currentDate = new Date();

  collection.insert(
    {
      channel: channel,
      secret: secret,
      link: link,
      date: currentDate,
    },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        io.emit('linkshared', channel, secret, link, currentDate);
      }
    }
  );
};

module.exports = new SharedLinksController();
