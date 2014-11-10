var MongoClient = require('mongodb').MongoClient;

SharedLinksControler = function(){};

SharedLinksControler.prototype.findAll = function(callback) {
  MongoClient.connect('mongodb://localhost:27017/magicbox', function(err, db){
    if(!err) {
      var collection = db.collection('sharedlinks');

      collection.find({"canal":1}, function(err, result) {
        if (err) {
          console.log("Fallo");
          callback(err, null);
        } else {
          console.log("Guardado");
          callback(null, result);
        }
      });
    }
  })
};

exports.SharedLinksControler = SharedLinksControler;