var SharedLinksController = function(){};

SharedLinksController.prototype.find = function(db, currentChannel, callback) {
  var collection = db.collection('sharedlinks');

  collection.find({channel:currentChannel}).toArray(function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

SharedLinksController.prototype.new = function(db, document, callback) {
  var collection = db.collection('sharedlinks');

  collection.insert({streaming:document.streaming,
                     channel: document.channel,
                     login: document.login,
                     link: document.link,
                     date: document.date}), (function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = new SharedLinksController();