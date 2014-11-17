var SharedLinksController = function(){};

SharedLinksController.prototype.find = function(currentChannel, db, io) {
    var collection = db.collection('sharedlinks');

    collection.find({channel:currentChannel}, {"sort" : [['date', 'asc']]}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            io.emit('loadchannel', result);
        }
    });
};

SharedLinksController.prototype.new = function(msg, db, io) {
    var collection = db.collection('sharedlinks');

    collection.insert({streaming: 1,
        channel: 1,
        login: "gsuarez",
        link: msg,
        date: new Date()}, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                io.emit('linkshared', msg);
            }
        });
};

module.exports = new SharedLinksController();