var MongoClient = require('mongodb').MongoClient;

var SharedLinksController = function(){};

SharedLinksController.prototype.findAll = function(callback) {
  MongoClient.connect('mongodb://localhost:27017/magicbox', function(err, db){
    if(!err) {
      var collection = db.collection('sharedlinks');

      collection.find({"canal":1}, function(err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      });
    }
  })
};

module.exports = new SharedLinksController();