var ChannelsController = function(){};

ChannelsController.prototype.findAll = function(db, callback) {
    var collection = db.collection('sharedlinks');

    collection.distinct('login', function(err, result) {
        if (err) {
            console.log(err);
        	callback(err, []);
        } else {
        	callback(null, result);
        }
    });
};

module.exports = new ChannelsController();