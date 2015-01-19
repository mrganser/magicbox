var SharedLinksController = function(){};

SharedLinksController.prototype.find = function(currentChannel, db, callback) {
    var collection = db.collection('sharedlinks');

    collection.find({login:currentChannel}).sort({date:-1}).toArray(function(err, result) {
        if (err) {
            console.log(err);
            callback(err, []);
        } else {
            callback(null, result);
        }
    });
};

SharedLinksController.prototype.new = function(channel, msg, db, io) {
    var collection = db.collection('sharedlinks');
    var currentDate = new Date();

    collection.insert({
        login: channel,
        link: msg,
        date: currentDate}, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                io.emit('linkshared', channel, msg, currentDate);
            }
        });
};

module.exports = new SharedLinksController();