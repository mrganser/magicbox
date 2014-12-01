var ChannelsController = function(){};

ChannelsController.prototype.findAll = function(db, io) {
    var collection = db.collection('sharedlinks');

    collection.find({channel:currentChannel}, {"sort" : [['date', 'asc']]}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            io.emit('loadchannel', result);
        }
    });
};

module.exports = new ChannelsController();